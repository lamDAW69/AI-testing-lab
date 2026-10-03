import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { placspConnector, PLACSP_OFFICIAL_FEED_URL } from '../src/modules/procurement/connectors/placsp.connector.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('══════════════════════════════════════════════════════════════════');
  console.log('🌐 RASTREANDO FEED OFICIAL EN VIVO DE PLACSP (SPAIN PUBLIC PROCUREMENT)');
  console.log('══════════════════════════════════════════════════════════════════');

  const collectedTenders = [];
  const maxPages = 4;
  let currentUrl = PLACSP_OFFICIAL_FEED_URL;

  for (let pageNum = 1; pageNum <= maxPages && currentUrl; pageNum++) {
    console.log(`\n📄 [Página ${pageNum}] Descargando: ${currentUrl}...`);
    const xml = await placspConnector.fetchFeedPage(currentUrl);
    const result = placspConnector.parseFeedPage(xml, {
      filterTicOnly: true,
      maxItems: 300,
    });

    console.log(`   - Evaluados crudos: ${result.rawCount}`);
    console.log(`   - TIC calificados: ${result.qualifiedCount}`);

    for (const tender of result.tenders) {
      // Excluir expedientes sin título
      if (!tender.title) continue;
      collectedTenders.push(tender);
      console.log(`     * [${tender.mainCpvCode}] ${tender.title.slice(0, 70)}... (${(tender.budgetAmountCents / 100).toLocaleString('es-ES')} €)`);
    }

    currentUrl = result.nextUrl;
    if (!currentUrl) {
      console.log('   ℹ No hay más páginas siguientes.');
      break;
    }
  }

  console.log(`\n✅ Total de licitaciones TIC reales recolectadas: ${collectedTenders.length}`);

  // Deduplicar por sourceTenderId
  const uniqueMap = new Map();
  for (const t of collectedTenders) {
    if (!uniqueMap.has(t.sourceTenderId)) {
      uniqueMap.set(t.sourceTenderId, t);
    }
  }
  const deduplicated = Array.from(uniqueMap.values());
  console.log(`✅ Licitaciones TIC únicas y normalizadas: ${deduplicated.length}`);

  const outDir = path.resolve(__dirname, '../src/modules/procurement/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'real-placsp-tenders.json');
  fs.writeFileSync(outPath, JSON.stringify(deduplicated, null, 2), 'utf8');
  console.log(`💾 Guardado en: ${outPath}`);
}

main().catch((err) => {
  console.error('Error durante el rastreo:', err);
  process.exitCode = 1;
});
