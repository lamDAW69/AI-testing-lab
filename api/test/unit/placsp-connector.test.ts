import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseMadridDateTime, placspConnector, RawPlacspEntry } from '../../src/modules/procurement/connectors/placsp.connector.js';
import { PlacspTenderInputSchema, TenderQueryFilterSchema } from '../../src/modules/procurement/procurement.schema.js';

const SAMPLE_RAW_ENTRY: RawPlacspEntry = {
  id: 'EXP-UNIT-001',
  title: 'Licitación de desarrollo de software para el portal tributario',
  summary: 'Plataforma en TypeScript y arquitecturas limpias',
  status: 'PUBLISHED',
  procedureType: 'OPEN',
  contractType: 'SERVICES',
  budgetAmountEur: 125000.5,
  taxInclusiveAmountEur: 151250.605,
  estimatedValueEur: 250000.0,
  cpvCode: '72262000',
  additionalCpvCodes: ['72260000-0', '72000000'],
  submissionDeadline: '2026-10-15T12:00:00.000Z',
  authority: {
    name: 'Dirección General de Informática',
    taxId: 'Q2800001A',
    sourceAuthorityId: 'DIR3-INF-01',
    buyerType: 'central',
    postalCode: '28001',
    city: 'Madrid',
  },
  lots: [
    {
      lotNumber: 1,
      title: 'Lote 1: Aplicación web',
      budgetAmountEur: 60000.0,
      cpvCode: '72262000',
    },
    {
      lotNumber: 2,
      title: 'Lote 2: API backend y microservicios',
      budgetAmountEur: 65000.5,
      cpvCode: '72262000',
    },
  ],
  documents: [
    {
      type: 'PCAP',
      name: 'Pliego Administrativo',
      url: 'https://contrataciondelestado.es/pcap_001.pdf',
      contentHash: '1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
      mimeType: 'application/pdf',
    },
  ],
};

test('PlacspConnector normaliza importes a céntimos enteros exactos y CPVs a 8 dígitos', () => {
  const normalized = placspConnector.normalizeEntry(SAMPLE_RAW_ENTRY);

  assert.equal(normalized.sourceTenderId, 'EXP-UNIT-001');
  assert.equal(normalized.sourceCode, 'ES_PLACSP');
  // 125000.50 EUR = 12500050 céntimos enteros
  assert.equal(normalized.budgetAmountCents, 12500050);
  assert.equal(normalized.taxInclusiveAmountCents, 15125061);
  assert.equal(normalized.estimatedValueCents, 25000000);
  assert.equal(normalized.mainCpvCode, '72262000');
  assert.deepEqual(normalized.additionalCpvCodes, ['72260000', '72000000']);
  assert.equal(normalized.status, 'PUBLISHED');
  assert.equal(normalized.procedureType, 'OPEN');
  assert.equal(normalized.contractType, 'SERVICES');

  // Lotes normalizados a céntimos
  assert.equal(normalized.lots.length, 2);
  assert.equal(normalized.lots[0].budgetAmountCents, 6000000);
  assert.equal(normalized.lots[1].budgetAmountCents, 6500050);

  // Documentos
  assert.equal(normalized.documents.length, 1);
  assert.equal(normalized.documents[0].documentType, 'PCAP');
});

test('computePayloadHash es determinista y sensible a modificaciones de pliegos y presupuesto', () => {
  const normalized1 = placspConnector.normalizeEntry(SAMPLE_RAW_ENTRY);
  const hash1 = placspConnector.computePayloadHash(normalized1);

  // Mismo expediente -> mismo hash exactamente
  const hash1Repeat = placspConnector.computePayloadHash(normalized1);
  assert.equal(hash1, hash1Repeat);

  // Modificación del importe presupuestario -> hash debe cambiar
  const modifiedBudget = {
    ...normalized1,
    budgetAmountCents: normalized1.budgetAmountCents + 1000,
  };
  const hashModifiedBudget = placspConnector.computePayloadHash(modifiedBudget);
  assert.notEqual(hash1, hashModifiedBudget);

  // Modificación en pliegos (enmienda de documento) -> hash debe cambiar
  const modifiedDocument = {
    ...normalized1,
    documents: [
      {
        ...normalized1.documents[0],
        url: 'https://contrataciondelestado.es/pcap_001_enmienda.pdf',
        contentHash: '9999888877776666555544443333222211110000aaaabbbbccccddddeeeeffff',
      },
    ],
  };
  const hashModifiedDoc = placspConnector.computePayloadHash(modifiedDocument);
  assert.notEqual(hash1, hashModifiedDoc);
});

test('Anti-Mass Assignment: Esquema Zod descarta y rechaza campos no autorizados (.strict())', () => {
  const maliciousPayload = {
    ...placspConnector.normalizeEntry(SAMPLE_RAW_ENTRY),
    is_admin: true, // Intento de inyección de privilegio
    tenant_id: '99999999-9999-4999-8999-999999999999', // Intento de inyección de tenant
  };

  const parsed = PlacspTenderInputSchema.safeParse(maliciousPayload);
  assert.equal(parsed.success, false);
});

test('TenderQueryFilterSchema valida filtros deterministas y rechaza parámetros inesperados', () => {
  const validQuery = {
    cpv: '72262000',
    status: 'PUBLISHED',
    minBudget: '500000',
    maxBudget: '2000000',
    page: '2',
    limit: '15',
  };

  const parsed = TenderQueryFilterSchema.safeParse(validQuery);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.cpv, '72262000');
    assert.equal(parsed.data.status, 'PUBLISHED');
    assert.equal(parsed.data.minBudget, 500000);
    assert.equal(parsed.data.maxBudget, 2000000);
    assert.equal(parsed.data.page, 2);
    assert.equal(parsed.data.limit, 15);
  }

  // Rechazo de filtros maliciosos o no tipados
  const invalidQuery = {
    ...validQuery,
    sql_injection: "1 OR 1=1",
  };
  const parsedInvalid = TenderQueryFilterSchema.safeParse(invalidQuery);
  assert.equal(parsedInvalid.success, false);
});

test('parseFeedXml extrae y normaliza correctamente una licitación real en formato XML CODICE', () => {
  const sampleCodiceXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:cbc="urn:dgpe:names:draft:codice:schema:xsd:CommonBasicComponents-2"
      xmlns:cac="urn:dgpe:names:draft:codice:schema:xsd:CommonAggregateComponents-2"
      xmlns:cac-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonAggregateComponents-2"
      xmlns:cbc-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonBasicComponents-2">
  <entry>
    <id>https://contrataciondelestado.es/sindicacion/licitacionesPerfilContratante/20545188</id>
    <title>Reforma de la cantina del campo de fútbol</title>
    <cac-place-ext:ContractFolderStatus>
      <cbc:ContractFolderID>EXP-REAL-095/2026</cbc:ContractFolderID>
      <cbc-place-ext:ContractFolderStatusCode>PUB</cbc-place-ext:ContractFolderStatusCode>
      <cac-place-ext:LocatedContractingParty>
        <cac:Party>
          <cac:PartyName>
            <cbc:Name>Alcaldía del Ayuntamiento de Santiago del Teide</cbc:Name>
          </cac:PartyName>
          <cac:PartyIdentification>
            <cbc:ID schemeName="NIF">P3804000B</cbc:ID>
          </cac:PartyIdentification>
          <cac:PostalAddress>
            <cbc:CityName>Santiago del Teide</cbc:CityName>
            <cbc:PostalZone>38690</cbc:PostalZone>
          </cac:PostalAddress>
        </cac:Party>
      </cac-place-ext:LocatedContractingParty>
      <cac:ProcurementProject>
        <cbc:Name>Reforma integral y modernización de instalaciones</cbc:Name>
        <cbc:TypeCode>3</cbc:TypeCode>
        <cac:BudgetAmount>
          <cbc:TaxExclusiveAmount>51401.87</cbc:TaxExclusiveAmount>
          <cbc:TotalAmount>55000.00</cbc:TotalAmount>
        </cac:BudgetAmount>
        <cac:RequiredCommodityClassification>
          <cbc:ItemClassificationCode>45000000</cbc:ItemClassificationCode>
        </cac:RequiredCommodityClassification>
      </cac:ProcurementProject>
      <cac:TenderingProcess>
        <cbc:ProcedureCode>9</cbc:ProcedureCode>
        <cac:TenderSubmissionDeadlinePeriod>
          <cbc:EndDate>2026-10-15</cbc:EndDate>
          <cbc:EndTime>17:00:00</cbc:EndTime>
        </cac:TenderSubmissionDeadlinePeriod>
      </cac:TenderingProcess>
      <cac:LegalDocumentReference>
        <cbc:ID>PCAP_CANTINA.PDF</cbc:ID>
        <cac:Attachment>
          <cac:ExternalReference>
            <cbc:URI>https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocId=123</cbc:URI>
            <cbc:DocumentHash>QN2alusF1cUBUjhvlIeodNPAL5A=</cbc:DocumentHash>
          </cac:ExternalReference>
        </cac:Attachment>
      </cac:LegalDocumentReference>
    </cac-place-ext:ContractFolderStatus>
  </entry>
</feed>`;

  const extracted = placspConnector.parseFeedXml(sampleCodiceXml, 10);
  assert.equal(extracted.length, 1);

  const tender = extracted[0]!;
  assert.equal(tender.sourceTenderId, 'EXP-REAL-095/2026');
  assert.equal(tender.budgetAmountCents, 5140187); // 51401.87 EUR -> 5140187 céntimos
  assert.equal(tender.taxInclusiveAmountCents, 5500000);
  assert.equal(tender.mainCpvCode, '45000000');
  assert.equal(tender.status, 'PUBLISHED');
  assert.equal(tender.authority.name, 'Alcaldía del Ayuntamiento de Santiago del Teide');
  assert.equal(tender.authority.taxId, 'P3804000B');
  assert.equal(tender.documents.length, 1);
  assert.equal(tender.documents[0]!.documentType, 'PCAP');
  assert.equal(tender.documents[0]!.url, 'https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocId=123');
  // Verifica la conversión precisa de huso peninsular (CEST UTC+2 en octubre)
  assert.equal(tender.submissionDeadline, '2026-10-15T15:00:00.000Z');
});

test('parseMadridDateTime convierte fielmente CET (+1 invierno) y CEST (+2 verano) a ISO UTC', () => {
  // Invierno (CET, UTC+1)
  const winterIso = parseMadridDateTime('2026-01-15', '14:00:00');
  assert.equal(winterIso, '2026-01-15T13:00:00.000Z');

  // Verano (CEST, UTC+2)
  const summerIso = parseMadridDateTime('2026-07-15', '14:00:00');
  assert.equal(summerIso, '2026-07-15T12:00:00.000Z');

  // Si ya trae timezone explícito (Z o offset), no lo altera
  const explicitUtc = parseMadridDateTime('2026-07-15', '14:00:00Z');
  assert.equal(explicitUtc, '2026-07-15T14:00:00.000Z');
});

test('parseFeedXml extrae correctamente múltiples lotes (cac:ProcurementProjectLot)', () => {
  const xmlWithLots = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:cbc="urn:dgpe:names:draft:codice:schema:xsd:CommonBasicComponents-2"
      xmlns:cac="urn:dgpe:names:draft:codice:schema:xsd:CommonAggregateComponents-2"
      xmlns:cac-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonAggregateComponents-2"
      xmlns:cbc-place-ext="urn:dgpe:names:draft:codice-place-ext:schema:xsd:CommonBasicComponents-2">
  <entry>
    <id>EXP-LOTS-123</id>
    <title>Servicios IT con lotes</title>
    <cac-place-ext:ContractFolderStatus>
      <cbc:ContractFolderID>EXP-LOTS-123</cbc:ContractFolderID>
      <cac:ProcurementProject>
        <cbc:Name>Servicios IT con lotes</cbc:Name>
        <cac:BudgetAmount>
          <cbc:TaxExclusiveAmount>100000.00</cbc:TaxExclusiveAmount>
        </cac:BudgetAmount>
      </cac:ProcurementProject>
      <cac:ProcurementProjectLot>
        <cbc:ID schemeName="LotNumber">1</cbc:ID>
        <cac:ProcurementProject>
          <cbc:Name>Lote 1: Microservicios</cbc:Name>
          <cac:BudgetAmount>
            <cbc:TaxExclusiveAmount>60000.00</cbc:TaxExclusiveAmount>
          </cac:BudgetAmount>
          <cac:RequiredCommodityClassification>
            <cbc:ItemClassificationCode>72262000</cbc:ItemClassificationCode>
          </cac:RequiredCommodityClassification>
        </cac:ProcurementProject>
      </cac:ProcurementProjectLot>
      <cac:ProcurementProjectLot>
        <cbc:ID schemeName="LotNumber">2</cbc:ID>
        <cac:ProcurementProject>
          <cbc:Name>Lote 2: Frontend Cloudflare</cbc:Name>
          <cac:BudgetAmount>
            <cbc:TaxExclusiveAmount>40000.00</cbc:TaxExclusiveAmount>
          </cac:BudgetAmount>
          <cac:RequiredCommodityClassification>
            <cbc:ItemClassificationCode>72260000</cbc:ItemClassificationCode>
          </cac:RequiredCommodityClassification>
        </cac:ProcurementProject>
      </cac:ProcurementProjectLot>
    </cac-place-ext:ContractFolderStatus>
  </entry>
</feed>`;

  const tenders = placspConnector.parseFeedXml(xmlWithLots);
  assert.equal(tenders.length, 1);
  const tender = tenders[0]!;
  assert.equal(tender.lots.length, 2);
  assert.equal(tender.lots[0]!.lotNumber, 1);
  assert.equal(tender.lots[0]!.title, 'Lote 1: Microservicios');
  assert.equal(tender.lots[0]!.budgetAmountCents, 6000000);
  assert.equal(tender.lots[0]!.mainCpvCode, '72262000');
  assert.equal(tender.lots[1]!.lotNumber, 2);
  assert.equal(tender.lots[1]!.title, 'Lote 2: Frontend Cloudflare');
  assert.equal(tender.lots[1]!.budgetAmountCents, 4000000);
  assert.equal(tender.lots[1]!.mainCpvCode, '72260000');
});
