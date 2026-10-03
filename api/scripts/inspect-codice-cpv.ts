import { placspConnector, PLACSP_OFFICIAL_FEED_URL } from '../src/modules/procurement/connectors/placsp.connector.js';
import { XMLParser } from 'fast-xml-parser';

async function main() {
  const xml = await placspConnector.fetchFeedPage(PLACSP_OFFICIAL_FEED_URL);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });
  const parsed = parser.parse(xml);
  const entries = parsed.feed?.entry || [];
  console.log('Total entries:', entries.length);

  for (let i = 0; i < Math.min(10, entries.length); i++) {
    const e = entries[i];
    const title = e.title?.['#text'] || e.title;
    const folder = e['cac-place-ext:ContractFolderStatus'];
    const project = folder?.['cac:ProcurementProject'];
    const classCode = project?.['cac:RequiredCommodityClassification'];
    
    // Search recursively for any key containing "Classification" or "CPV" or "ItemClassificationCode"
    function findKeys(obj, regex, path = '') {
      if (!obj || typeof obj !== 'object') return [];
      let found = [];
      for (const k of Object.keys(obj)) {
        if (regex.test(k)) {
          found.push({ path: `${path}.${k}`, val: obj[k] });
        }
        if (typeof obj[k] === 'object') {
          found.push(...findKeys(obj[k], regex, `${path}.${k}`));
        }
      }
      return found;
    }

    const cpvHits = findKeys(e, /commodity|classification|cpv/i);
    console.log(`\n--- Entry ${i + 1}: ${title?.slice(0, 70)}...`);
    console.log('Direct project.RequiredCommodityClassification:', JSON.stringify(classCode));
    console.log('CPV Hits across entire entry:', JSON.stringify(cpvHits, null, 2));
  }
}

main();
