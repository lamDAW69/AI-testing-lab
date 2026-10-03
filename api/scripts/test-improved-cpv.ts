import { placspConnector, PLACSP_OFFICIAL_FEED_URL } from '../src/modules/procurement/connectors/placsp.connector.js';
import { XMLParser } from 'fast-xml-parser';

function extractXmlText(node) {
  if (typeof node === 'string') return node.trim();
  if (typeof node === 'number') return String(node);
  if (node && typeof node === 'object' && '#text' in node) {
    return String(node['#text']).trim();
  }
  return '';
}

function extractCpvList(classificationNode) {
  if (!classificationNode) return [];
  const nodes = Array.isArray(classificationNode) ? classificationNode : [classificationNode];
  const cpvs = [];
  for (const node of nodes) {
    const rawCode = node?.['cbc:ItemClassificationCode'];
    const text = extractXmlText(rawCode);
    if (text) {
      const clean = text.replace(/\D/g, '');
      if (clean.length >= 2) {
        cpvs.push(clean.padEnd(8, '0').slice(0, 8));
      }
    }
  }
  return cpvs;
}

function isTicCpv(cpv) {
  if (!cpv || cpv === '00000000') return false;
  const clean = cpv.replace(/\D/g, '');
  return clean.startsWith('72') || clean.startsWith('48');
}

async function main() {
  console.log('Fetching live PLACSP page...');
  const xml = await placspConnector.fetchFeedPage(PLACSP_OFFICIAL_FEED_URL);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });
  const parsed = parser.parse(xml);
  const entries = parsed.feed?.entry || [];
  console.log(`Evaluated ${entries.length} raw entries in top page:`);

  let realTicCount = 0;
  for (const entry of entries) {
    const folder = entry['cac-place-ext:ContractFolderStatus'];
    if (!folder) continue;
    const project = folder['cac:ProcurementProject'];
    const title = extractXmlText(project?.['cbc:Name']) || extractXmlText(entry.title);
    const cpvs = extractCpvList(project?.['cac:RequiredCommodityClassification']);

    const isTic = cpvs.some(c => isTicCpv(c));
    if (isTic) {
      realTicCount++;
      console.log(`✅ REAL TIC FOUND [CPV: ${cpvs.join(', ')}]: ${title.slice(0, 80)}`);
    }
  }
  console.log(`\nReal TIC in first page without false fallback: ${realTicCount} (out of ${entries.length})`);
}

main();
