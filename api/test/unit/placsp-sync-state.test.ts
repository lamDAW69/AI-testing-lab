import assert from 'node:assert/strict';
import { test } from 'node:test';
import { placspConnector, isTicCpv, isTicTender } from '../../src/modules/procurement/connectors/placsp.connector.js';
import { ingestionSyncStates } from '../../src/db/schema.js';

test('ingestion_sync_states: esquema y columnas canónicas definidas en Drizzle ORM', () => {
  assert.ok(ingestionSyncStates);
  assert.ok(ingestionSyncStates.id);
  assert.ok(ingestionSyncStates.sourceCode);
  assert.ok(ingestionSyncStates.jobType);
  assert.ok(ingestionSyncStates.currentPageUrl);
  assert.ok(ingestionSyncStates.nextPageUrl);
  assert.ok(ingestionSyncStates.oldestProcessedDate);
  assert.ok(ingestionSyncStates.newestProcessedDate);
  assert.ok(ingestionSyncStates.cutoffDate);
  assert.ok(ingestionSyncStates.pagesProcessed);
  assert.ok(ingestionSyncStates.tendersScanned);
  assert.ok(ingestionSyncStates.tendersPersisted);
  assert.ok(ingestionSyncStates.status);
});

test('crawlFeedToCutoff recorre páginas históricas secuencialmente respetando maxPages y cutoff', async () => {
  // Mock de páginas XML
  const page1Xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:cbc="urn:dgpe:names:draft:codice:schema:xsd:CommonBasicComponents-2"
      xmlns:cac="urn:dgpe:names:draft:codice:schema:xsd:CommonAggregateComponents-2"
      xmlns:cac-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonAggregateComponents-2"
      xmlns:cbc-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonBasicComponents-2">
  <link href="https://ejemplo.gob.es/page2.atom" rel="next"/>
  <entry>
    <id>E1</id>
    <title>Software Cloud Page 1</title>
    <updated>2026-09-20T10:00:00.000Z</updated>
    <cac-place-ext:ContractFolderStatus>
      <cbc:ContractFolderID>EXP-P1-001</cbc:ContractFolderID>
      <cac:ProcurementProject>
        <cbc:Name>Software Cloud</cbc:Name>
        <cac:BudgetAmount><cbc:TaxExclusiveAmount>10000.00</cbc:TaxExclusiveAmount></cac:BudgetAmount>
        <cac:RequiredCommodityClassification><cbc:ItemClassificationCode>72262000</cbc:ItemClassificationCode></cac:RequiredCommodityClassification>
      </cac:ProcurementProject>
    </cac-place-ext:ContractFolderStatus>
  </entry>
</feed>`;

  const page2Xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:cbc="urn:dgpe:names:draft:codice:schema:xsd:CommonBasicComponents-2"
      xmlns:cac="urn:dgpe:names:draft:codice:schema:xsd:CommonAggregateComponents-2"
      xmlns:cac-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonAggregateComponents-2"
      xmlns:cbc-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonBasicComponents-2">
  <link href="https://ejemplo.gob.es/page3.atom" rel="next"/>
  <entry>
    <id>E2</id>
    <title>Software Cloud Page 2 (Older)</title>
    <updated>2026-08-30T10:00:00.000Z</updated>
    <cac-place-ext:ContractFolderStatus>
      <cbc:ContractFolderID>EXP-P2-002</cbc:ContractFolderID>
      <cac:ProcurementProject>
        <cbc:Name>Software Cloud</cbc:Name>
        <cac:BudgetAmount><cbc:TaxExclusiveAmount>20000.00</cbc:TaxExclusiveAmount></cac:BudgetAmount>
        <cac:RequiredCommodityClassification><cbc:ItemClassificationCode>72262000</cbc:ItemClassificationCode></cac:RequiredCommodityClassification>
      </cac:ProcurementProject>
    </cac-place-ext:ContractFolderStatus>
  </entry>
</feed>`;

  // Sobrescribimos fetchFeedPage temporalmente para probar la lógica de rastreo multi-página
  const originalFetch = placspConnector.fetchFeedPage;
  try {
    placspConnector.fetchFeedPage = async (url: string) => {
      if (url.includes('page2')) return page2Xml;
      return page1Xml;
    };

    const pagesVisited: string[] = [];
    const summary = await placspConnector.crawlFeedToCutoff({
      startUrl: 'https://ejemplo.gob.es/page1.atom',
      cutoffDate: new Date('2026-09-01T00:00:00.000Z'),
      delayBetweenPagesMs: 0,
      onPageProcessed: async (page) => {
        pagesVisited.push(page.pageUrl);
      },
    });

    assert.equal(summary.pagesProcessed, 2);
    assert.equal(pagesVisited.length, 2);
    assert.equal(summary.totalScanned, 2);
    assert.equal(summary.totalQualified, 1); // Solo la página 1 estaba dentro del límite temporal (septiembre 2026)
    assert.equal(summary.hitCutoff, true);
  } finally {
    placspConnector.fetchFeedPage = originalFetch;
  }
});
