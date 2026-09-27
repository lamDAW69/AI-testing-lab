import { db, pool } from '../../../db/client.js';
import { tenderDocumentVersions, documentContentSnapshots, tenderDocuments, tenders } from '../../../db/schema.js';
import { documentContentService } from '../document-content.service.js';
import { eq, isNull } from 'drizzle-orm';

async function main(): Promise<void> {
  const versionIdArg = process.argv[2];

  let targetVersionId = versionIdArg;

  if (!targetVersionId) {
    console.log('🔍 Buscando la versión documental más reciente pendiente de sellar...');
    // Buscar versiones de documentos que aún no tengan snapshot
    const unsealed = await db
      .select({
        versionId: tenderDocumentVersions.id,
        tenderTitle: tenders.title,
        docName: tenderDocuments.name,
        docType: tenderDocuments.documentType,
        url: tenderDocumentVersions.url,
      })
      .from(tenderDocumentVersions)
      .innerJoin(tenderDocuments, eq(tenderDocumentVersions.documentId, tenderDocuments.id))
      .innerJoin(tenders, eq(tenderDocuments.tenderId, tenders.id))
      .leftJoin(
        documentContentSnapshots,
        eq(documentContentSnapshots.documentVersionId, tenderDocumentVersions.id),
      )
      .where(isNull(documentContentSnapshots.id))
      .limit(1);

    if (unsealed.length === 0) {
      console.log('ℹ️ No hay versiones documentales pendientes de sellar en la base de datos.');
      return;
    }

    const first = unsealed[0]!;
    console.log(`📄 Expediente: "${first.tenderTitle}"`);
    console.log(`📑 Documento: ${first.docName} (${first.docType})`);
    console.log(`🔗 URL Oficial: ${first.url}`);
    targetVersionId = first.versionId;
  }

  console.log(`🔒 Sellando versión documental inmutable: ${targetVersionId}...`);
  const result = await documentContentService.fetchAndStore(targetVersionId);

  console.log('✅ Documento descargado, verificado y sellado con éxito:');
  console.log(`   - ID Versión: ${result.snapshot.documentVersionId}`);
  console.log(`   - SHA-256 Binario: ${result.snapshot.rawSha256}`);
  console.log(`   - Tamaño Binario: ${result.snapshot.rawByteSize} bytes`);
  console.log(`   - SHA-256 Texto: ${result.snapshot.extractedTextSha256}`);
  console.log(`   - Motor Extracción: ${result.snapshot.extractionEngine}`);
  console.log(`   - Caracteres extraídos: ${result.snapshot.extractedText.length}`);
  console.log(`   - Almacenamiento seguro: ${result.snapshot.rawStoragePath}`);
  console.log(`   - Idempotente: ${result.idempotent}`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error sellando el pliego oficial:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
