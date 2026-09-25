import crypto from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';
import { DocumentContentRepository, documentContentRepository } from './document-content.repository.js';

const MAX_DOCUMENT_BYTES = 12 * 1024 * 1024;
const MAX_DOCUMENT_PAGES = 500;
const MAX_EXTRACTED_TEXT_CHARS = 2_000_000;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 3;

type FetchResponse = Pick<Response, 'arrayBuffer' | 'headers' | 'status'>;
type FetchImplementation = (input: string, init?: RequestInit) => Promise<FetchResponse>;

function sha256(value: Uint8Array | string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * La URL no procede del cliente. Aun así, se valida contra la fuente oficial
 * registrada para que este job no se convierta en un proxy SSRF reutilizable.
 */
export function assertAllowedDocumentUrl(candidate: string, sourceBaseUrl: string): URL {
  let target: URL;
  let source: URL;
  try {
    target = new URL(candidate);
    source = new URL(sourceBaseUrl);
  } catch {
    throw new AppError(422, 'La URL documental registrada no es válida');
  }

  if (target.protocol !== 'https:' || source.protocol !== 'https:' || target.hostname !== source.hostname) {
    throw new AppError(422, 'La URL documental no pertenece al dominio HTTPS de la fuente oficial');
  }
  return target;
}

function isRedirect(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

function allowedMimeType(contentType: string | null): 'pdf' | 'text' {
  const mimeType = contentType?.split(';', 1)[0]?.trim().toLowerCase();
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'text/plain' || mimeType === 'text/html' || mimeType === 'application/xml' || mimeType === 'text/xml') {
    return 'text';
  }
  throw new AppError(415, 'El documento debe ser PDF, texto o XML con un MIME explícito');
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const task = getDocument({ data: bytes, isEvalSupported: false, useWorkerFetch: false });
  try {
    const pdf = await task.promise;
    if (pdf.numPages > MAX_DOCUMENT_PAGES) {
      throw new AppError(422, 'El PDF supera el límite de páginas permitido para extracción');
    }
    const pages: string[] = [];
    let characters = 0;
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const content = await (await pdf.getPage(pageNumber)).getTextContent();
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join('');
      characters += pageText.length;
      if (characters > MAX_EXTRACTED_TEXT_CHARS) {
        throw new AppError(422, 'El texto extraído supera el límite permitido');
      }
      pages.push(pageText);
    }
    return pages.join('\n\f\n');
  } finally {
    await task.destroy();
  }
}

async function writeRawDocument(documentVersionId: string, rawSha256: string, bytes: Uint8Array): Promise<string> {
  const directory = path.join(env.DOCUMENT_STORAGE_DIR, documentVersionId);
  const filename = `${rawSha256}.bin`;
  const destination = path.join(directory, filename);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  try {
    await writeFile(destination, bytes, { flag: 'wx', mode: 0o600 });
  } catch (error: unknown) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST') throw error;
  }
  return destination;
}

export class DocumentContentService {
  constructor(
    private readonly repository: DocumentContentRepository = documentContentRepository,
    private readonly fetchImplementation: FetchImplementation = fetch,
  ) {}

  async fetchAndStore(documentVersionId: string) {
    const existing = await this.repository.findSnapshot(documentVersionId);
    if (existing) return { snapshot: existing, idempotent: true };

    const version = await this.repository.findVersionSource(documentVersionId);
    if (!version) throw new AppError(404, 'La versión documental solicitada no existe');

    let target = assertAllowedDocumentUrl(version.url, version.sourceBaseUrl);
    let response: FetchResponse | undefined;
    for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        response = await this.fetchImplementation(target.toString(), {
          method: 'GET', redirect: 'manual', signal: controller.signal,
          headers: { Accept: 'application/pdf, text/plain, text/html, application/xml, text/xml' },
        });
      } catch {
        throw new AppError(502, 'No se pudo obtener el documento desde la fuente oficial');
      } finally {
        clearTimeout(timeout);
      }

      if (!isRedirect(response.status)) break;
      const location = response.headers.get('location');
      if (!location || redirects === MAX_REDIRECTS) {
        throw new AppError(502, 'La fuente documental devolvió una redirección no permitida');
      }
      target = assertAllowedDocumentUrl(new URL(location, target).toString(), version.sourceBaseUrl);
    }

    if (!response || response.status < 200 || response.status >= 300) {
      throw new AppError(502, 'La fuente documental respondió con un estado no satisfactorio');
    }
    const declaredLength = Number(response.headers.get('content-length') ?? 0);
    if (!Number.isSafeInteger(declaredLength) || declaredLength > MAX_DOCUMENT_BYTES) {
      throw new AppError(413, 'El documento supera el tamaño máximo permitido');
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_DOCUMENT_BYTES) {
      throw new AppError(413, 'El documento está vacío o supera el tamaño máximo permitido');
    }

    const format = allowedMimeType(response.headers.get('content-type'));
    const extractedText = format === 'pdf'
      ? await extractPdfText(bytes)
      : new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    if (extractedText.trim().length === 0) {
      throw new AppError(422, 'No se pudo extraer texto verificable del documento');
    }
    if (extractedText.length > MAX_EXTRACTED_TEXT_CHARS) {
      throw new AppError(422, 'El texto extraído supera el límite permitido');
    }

    const rawSha256 = sha256(bytes);
    const snapshot = await this.repository.createSnapshot({
      documentVersionId,
      rawStoragePath: await writeRawDocument(documentVersionId, rawSha256, bytes),
      rawSha256,
      rawByteSize: bytes.byteLength,
      extractedText,
      extractedTextSha256: sha256(extractedText),
      extractionEngine: format === 'pdf' ? 'pdfjs-dist@5.4.624' : 'utf8@node20',
    });
    return { snapshot, idempotent: false };
  }
}

export const documentContentService = new DocumentContentService();
