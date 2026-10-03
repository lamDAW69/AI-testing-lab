/**
 * CATÁLOGO OFICIAL Y EVIDENCIAS DE CONTRATACIÓN PÚBLICA (ES_PLACSP)
 * Licitaciones 100% Reales del sector TIC, Cloud, Software, Ciberseguridad y Datos Abiertos.
 * Fuente: Plataforma de Contratación del Sector Público (Ministerio de Hacienda).
 * Total de expedientes: 106
 */
import { PublicTender, TenderDocument } from '../types/procurement';
import { PortfolioItem } from '../types/portfolio';
import { QualificationAnalysis } from '../types/qualification';

export const REAL_PLACSP_TENDERS: PublicTender[] = [
  {
    "id": "t-placsp-001",
    "fileReference": "2025-11",
    "title": "Servicios de soporte del entorno microinformático y servicio de correo electrónico con destino a la Dirección General del Catastro",
    "contractingAuthority": "Junta de Contratación de los Servicios Centrales en el Ministerio de Hacienda",
    "cpvCode": "72250000 · Soporte técnico y sistemas informáticos",
    "budgetAmount": 119835,
    "estimatedValue": 239669,
    "currency": "EUR",
    "submissionDeadline": "2026-10-07T19:46:51.520Z",
    "publicationDate": "2026-10-02T17:57:41.136Z",
    "status": "PUBLISHED",
    "documentsCount": 11,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-002",
    "fileReference": "1442/2026",
    "title": "Contrato de Servicios de telecomunicaciones, en el ámbito de la telefonía fija, móvil y acceso a Internet, al Ayuntamiento de Villatorres (provincia de Jaén).",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Villatorres",
    "cpvCode": "64210000 · Servicios tecnológicos",
    "budgetAmount": 19200,
    "estimatedValue": 42240,
    "currency": "EUR",
    "submissionDeadline": "2026-10-10T19:46:51.520Z",
    "publicationDate": "2026-10-02T17:38:24.032Z",
    "status": "PUBLISHED",
    "documentsCount": 6,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-003",
    "fileReference": "DEMA-2026-046",
    "title": "Apoyo a los poderes públicos de Uruguay para el diseño, implementación, puesta en marcha y soporte inicial del Observatorio de Ganadería sobre Campo Natural (OCN), en el marco del Proyecto de Fortalecimiento de la Ganadería Sostenible en Uruguay parte del Programa EUROCLIMA LAC",
    "contractingAuthority": "Dirección de la Fundación para la Internacionalización de las Administraciones Públicas",
    "cpvCode": "75130000 · Servicios tecnológicos",
    "budgetAmount": 173390,
    "estimatedValue": 181268,
    "currency": "EUR",
    "submissionDeadline": "2026-10-07T21:59:00.000Z",
    "publicationDate": "2026-10-02T15:50:52.992Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-004",
    "fileReference": "18039/2026",
    "title": "Plataforma de formación online multimedia e interactiva para el municipio de Orihuela",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Orihuela",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 29737,
    "estimatedValue": 59474,
    "currency": "EUR",
    "submissionDeadline": "2026-10-20T21:59:00.000Z",
    "publicationDate": "2026-10-02T15:37:21.370Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-005",
    "fileReference": "MRR-C11I3-DGTDSP-31 BSDA",
    "title": "Electrónica de Red",
    "contractingAuthority": "Dirección General de Transformación Digital de los Servicios Públicos",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 553350,
    "estimatedValue": 553350,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T19:46:51.520Z",
    "publicationDate": "2026-10-02T14:49:31.036Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-006",
    "fileReference": "FUCAS/12/2026",
    "title": "Servicio de gestión digital integral de los apoyos a personas con medidas de apoyo judiciales de la Fundación Tutelar Canaria para la Acción Social, M.P.",
    "contractingAuthority": "Gerencia de la Fundación Tutelar Canaria para la Acción Social, M.P. (FuCAS)",
    "cpvCode": "72500000 · Servicios informáticos y soporte",
    "budgetAmount": 248000,
    "estimatedValue": 310000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-22T19:46:51.520Z",
    "publicationDate": "2026-10-02T13:49:17.751Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-007",
    "fileReference": "2280/2026",
    "title": "La prestación integral de los servicios de consolidación, mantenimiento preventivo, adaptativo, correctivo y evolutivo, desarrollo y soporte funcional y técnico del sistema ERP SAP S/4HANA implantado en el CCS.",
    "contractingAuthority": "Consorcio de Compensación de Seguros",
    "cpvCode": "72267000 · Mantenimiento y soporte de software",
    "budgetAmount": 1507788,
    "estimatedValue": 7840499,
    "currency": "EUR",
    "submissionDeadline": "2026-10-21T09:59:00.000Z",
    "publicationDate": "2026-10-02T13:44:04.804Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": true
  },
  {
    "id": "t-placsp-008",
    "fileReference": "28861/2025",
    "title": "Servicio de mantenimiento del gestor de contenidos INFO TOURIST CLOUD.",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Orihuela",
    "cpvCode": "72267100 · Mantenimiento y soporte de software",
    "budgetAmount": 13980,
    "estimatedValue": 13980,
    "currency": "EUR",
    "submissionDeadline": "2026-10-28T19:46:51.520Z",
    "publicationDate": "2026-10-02T13:28:18.357Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": true
  },
  {
    "id": "t-placsp-009",
    "fileReference": "2679/2026",
    "title": "Contratación de una plataforma de administración electrónica en modalidad Software como Servicio (SaaS) que facilite a esta entidad la adopción de un sistema de tramitación administrativa conforme al marco legal vigente",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Güímar",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 576700,
    "estimatedValue": 576700,
    "currency": "EUR",
    "submissionDeadline": "2026-10-31T19:46:51.520Z",
    "publicationDate": "2026-10-02T13:20:41.757Z",
    "status": "PUBLISHED",
    "documentsCount": 7,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-010",
    "fileReference": "3012/2025",
    "title": "Contrato administrativo de suministro de una aplicación de sistema de información económico-financiera, así como los servicios de implantación y puesta en marcha, formación, migración de datos y el mantenimiento anual posterior",
    "contractingAuthority": "Alcaldia del Ayuntamiento de Muro de Alcoy",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 102000,
    "estimatedValue": 174000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-03T19:46:51.520Z",
    "publicationDate": "2026-10-02T13:05:58.723Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-011",
    "fileReference": "202600000252",
    "title": "Suministro e instalación de hardware/software para la actualización y ampliación del actual sistema de gestión y control centralizado de las instalaciones de climatización e iluminación de los edificios del Museo Nacional Centro de Arte Reina Sofía.",
    "contractingAuthority": "Dirección del Museo Nacional Centro de Arte Reina Sofía",
    "cpvCode": "30200000 · Servicios tecnológicos",
    "budgetAmount": 168456,
    "estimatedValue": 168456,
    "currency": "EUR",
    "submissionDeadline": "2026-10-21T21:59:00.000Z",
    "publicationDate": "2026-10-02T12:57:54.424Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-012",
    "fileReference": "SUM-26-0306-SIST",
    "title": "Suministro de licencias VMware, incluyendo soporte, mantenimiento y migración de los entornos críticos virtualizados",
    "contractingAuthority": "Gerencia umivale Activa, Mutua Colaboradora con la Seguridad Social número 3",
    "cpvCode": "48218000 · Paquetes de software y licencias",
    "budgetAmount": 104000,
    "estimatedValue": 104000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-08T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:57:45.340Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-013",
    "fileReference": "29/26-S",
    "title": "Servicios de soporte, evolución y mantenimiento del sistema portal de datos abiertos",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Las Palmas de Gran Canaria",
    "cpvCode": "72267000 · Mantenimiento y soporte de software",
    "budgetAmount": 74576,
    "estimatedValue": 186439,
    "currency": "EUR",
    "submissionDeadline": "2026-10-11T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:54:27.969Z",
    "status": "PUBLISHED",
    "documentsCount": 6,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-014",
    "fileReference": "1489/2026",
    "title": "Contrato administrativo de suministro (adquisición) de equipos informáticos",
    "contractingAuthority": "Alcaldia del Ayuntamiento de Muro de Alcoy",
    "cpvCode": "30213100 · Servicios tecnológicos",
    "budgetAmount": 114653,
    "estimatedValue": 114653,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T21:59:00.000Z",
    "publicationDate": "2026-10-02T12:43:36.668Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-015",
    "fileReference": "2026000358",
    "title": "INS_Servicio de gestión y organización integral de webinars para impartir formación online para el Instituto Nacional de Silicosis",
    "contractingAuthority": "Servicio de Salud - Servicios Centrales",
    "cpvCode": "72600000 · Soporte y consultoría informática",
    "budgetAmount": 9750,
    "estimatedValue": 16250,
    "currency": "EUR",
    "submissionDeadline": "2026-10-17T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:41:30.911Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-016",
    "fileReference": "89/2026/P15003",
    "title": "Suministro de material informático consistente en equipos de sobremesa, tablets y un sistema operativo Windows 2025 para el Ayuntamiento de Segovia (3 lotes)",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Segovia",
    "cpvCode": "30200000 · Servicios tecnológicos",
    "budgetAmount": 83357,
    "estimatedValue": 83357,
    "currency": "EUR",
    "submissionDeadline": "2026-10-08T12:00:00.000Z",
    "publicationDate": "2026-10-02T12:33:09.061Z",
    "status": "PUBLISHED",
    "documentsCount": 6,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-017",
    "fileReference": "S-03450-2026",
    "title": "Aplicaciones Atlassian",
    "contractingAuthority": "Compras de la Corporación de Radio y Televisión Española S.A.",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 196079,
    "estimatedValue": 196079,
    "currency": "EUR",
    "submissionDeadline": "2026-10-23T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:32:03.808Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-018",
    "fileReference": "SSCC PA 266/26",
    "title": "Renovación de las licencias Citrix",
    "contractingAuthority": "Servicio de Salud de las Illes Balears",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 158870,
    "estimatedValue": 158870,
    "currency": "EUR",
    "submissionDeadline": "2026-10-26T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:31:29.970Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-019",
    "fileReference": "9440/2026",
    "title": "contratación del diseño e implantación de una plataforma web Campaña de Bonos digitales Siero de Tiendas",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Siero",
    "cpvCode": "72416000 · Servicios de internet y portales web",
    "budgetAmount": 8264,
    "estimatedValue": 8264,
    "currency": "EUR",
    "submissionDeadline": "2026-10-29T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:30:54.765Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-020",
    "fileReference": "2026-00291",
    "title": "Renovación del mantenimiento del sistema de backup para la Autoritat Portuaria de Barcelona. Clave del expediente: 2026R640024",
    "contractingAuthority": "Presidencia del Consejo de Administración de la Autoridad Portuaria de Barcelona (PORT DE BARCELONA)",
    "cpvCode": "50324100 · Servicios tecnológicos",
    "budgetAmount": 155330,
    "estimatedValue": 155330,
    "currency": "EUR",
    "submissionDeadline": "2026-11-01T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:29:44.059Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-021",
    "fileReference": "1009425E",
    "title": "Servicios para el análisis, diseño, construcción, puesta en marcha y mantenimiento del ecosistema tecnológico del Plan de Sostenibilidad Turística en la Montaña de Riaño, así como la formación de los usuarios finales.",
    "contractingAuthority": "Junta de Gobierno de la Diputación Provincial de León",
    "cpvCode": "72263000 · Servicios de software y mantenimiento",
    "budgetAmount": 296942,
    "estimatedValue": 296942,
    "currency": "EUR",
    "submissionDeadline": "2026-11-04T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:27:20.526Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-022",
    "fileReference": "N202600262",
    "title": "Servicio de asistencia técnica especializada para la gestión de proyectos y servicios TI de MC MUTUAL",
    "contractingAuthority": "Dirección General de la Mutual Midat Cyclops, Mutua Colaboradora con la Seguridad Social, nº 1",
    "cpvCode": "72200000 · Servicios TIC y consultoría",
    "budgetAmount": 861000,
    "estimatedValue": 861000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-07T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:26:45.920Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-023",
    "fileReference": "CG-2025/2821/0058",
    "title": "Implantación de una plataforma de análisis centralizado de la información y riesgos relacionados con la operación de la seguridad con destino a IBERMUTUA, M.C.S.S. Nº 274 Y CESMA, M.C.S.S. Nº 115.",
    "contractingAuthority": "Dirección General de IBERMUTUA, Mutua Colaboradora con la Seguridad Social nº 274",
    "cpvCode": "72610000 · Soporte y consultoría informática",
    "budgetAmount": 230000,
    "estimatedValue": 390000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-09T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:24:31.339Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-024",
    "fileReference": "877/2026",
    "title": "Suministro de red de cartelería digital Municipal para el Excmo. Ayuntamiento de Las Cabezas de San Juan",
    "contractingAuthority": "Alcaldia del Ayuntamiento de Las Cabezas de San Juan",
    "cpvCode": "32000000 · Servicios tecnológicos",
    "budgetAmount": 21648,
    "estimatedValue": 21648,
    "currency": "EUR",
    "submissionDeadline": "2026-10-12T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:22:15.775Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-025",
    "fileReference": "172/2026",
    "title": "Suministro y actualización de licencias de Microsoft",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Santander",
    "cpvCode": "48218000 · Paquetes de software y licencias",
    "budgetAmount": 560935,
    "estimatedValue": 617028,
    "currency": "EUR",
    "submissionDeadline": "2026-10-15T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:18:26.179Z",
    "status": "PUBLISHED",
    "documentsCount": 6,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-026",
    "fileReference": "674/2026",
    "title": "Implantación, puesta en marcha y mantenimiento de un sistema informático integral para la gestión de nóminas y recursos humanos del Ayuntamiento de Tarazona.",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Tarazona",
    "cpvCode": "48450000 · Paquetes de software y licencias",
    "budgetAmount": 200000,
    "estimatedValue": 20000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-15T21:54:00.000Z",
    "publicationDate": "2026-10-02T12:18:07.796Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-027",
    "fileReference": "85/pa/su/26",
    "title": "Suministro, Instalación, Configuración y puesta en marcha de una Infraestructura Tecnológica de altas prestaciones para Suma Gestión Tributaria. Diputación de Alicante",
    "contractingAuthority": "Dirección de Suma Gestión Tributaria. Diputación de Alicante",
    "cpvCode": "48820000 · Paquetes de software y licencias",
    "budgetAmount": 850000,
    "estimatedValue": 850000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-21T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:15:53.737Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-028",
    "fileReference": "CG-2024/2821/0120",
    "title": "Servicio de gestión de gastos y viajes de empresa de IBERMUTUA",
    "contractingAuthority": "Dirección General de IBERMUTUA, Mutua Colaboradora con la Seguridad Social nº 274",
    "cpvCode": "72500000 · Servicios informáticos y soporte",
    "budgetAmount": 70000,
    "estimatedValue": 140000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-24T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:14:58.232Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-029",
    "fileReference": "2026-03993",
    "title": "Solución SaaS de inteligencia meteorológica y gestión de riesgos naturales para la operación ferroviaria",
    "contractingAuthority": "Dirección General Económico-Financiera de la Entidad Pública Empresarial RENFE-Operadora",
    "cpvCode": "72200000 · Servicios TIC y consultoría",
    "budgetAmount": 130000,
    "estimatedValue": 130000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-13T11:00:00.000Z",
    "publicationDate": "2026-10-02T12:14:54.566Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-030",
    "fileReference": "3171/2026",
    "title": "Implantación, configuración y puesta en funcionamiento de un aplicativo informático para la gestión económico financiera del Ayuntamiento de Tarazona",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Tarazona",
    "cpvCode": "48443000 · Paquetes de software y licencias",
    "budgetAmount": 138283,
    "estimatedValue": 138283,
    "currency": "EUR",
    "submissionDeadline": "2026-10-14T21:59:00.000Z",
    "publicationDate": "2026-10-02T12:14:26.833Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-031",
    "fileReference": "SUM 62/2026-ASS",
    "title": "Software de gestión de colas y cita previa para la Oficina de Atención al Ciudadano (OAC) del Ayuntamiento de Calp (Alicante)",
    "contractingAuthority": "Alcaldía del Ajuntament de Calp",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 6116,
    "estimatedValue": 6116,
    "currency": "EUR",
    "submissionDeadline": "2026-10-21T08:00:00.000Z",
    "publicationDate": "2026-10-02T12:11:09.193Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-032",
    "fileReference": "55/26 RTPA",
    "title": "Suministro de licencias de software Microsoft 365 y Chat GPT Enterprise y  formación online  Chat GPT &#xD;",
    "contractingAuthority": "Dirección General de Radiotelevisión del Principado de Asturias, S.A. Unipersonal",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 57875,
    "estimatedValue": 69450,
    "currency": "EUR",
    "submissionDeadline": "2026-11-05T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:08:36.508Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-033",
    "fileReference": "2026/040",
    "title": "Servicio de mantenimiento de la aplicación de gestión presencial del Excmo. Ayuntamiento de Cádiz",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Cádiz",
    "cpvCode": "72267000 · Mantenimiento y soporte de software",
    "budgetAmount": 6198,
    "estimatedValue": 12396,
    "currency": "EUR",
    "submissionDeadline": "2026-10-07T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:06:29.932Z",
    "status": "PUBLISHED",
    "documentsCount": 10,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-034",
    "fileReference": "AYT/13122/2025",
    "title": "Suministro de licencias Bentley",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Avilés",
    "cpvCode": "48210000 · Paquetes de software y licencias",
    "budgetAmount": 47800,
    "estimatedValue": 47800,
    "currency": "EUR",
    "submissionDeadline": "2026-10-10T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:06:12.578Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-035",
    "fileReference": "TSA0083883",
    "title": "Contratación Renovar y ampliar las licencias implantadas en años precedentes para garantizar su correcto funcionamiento, así como la resolución de incidencias técnicas caso de producirse.",
    "contractingAuthority": "Empresa de Transformación Agraria S.A.,S.M.E., M.P., (TRAGSA)",
    "cpvCode": "48625000 · Paquetes de software y licencias",
    "budgetAmount": 215000,
    "estimatedValue": 215000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-13T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:06:02.200Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-036",
    "fileReference": "92/pa/ser/26",
    "title": "Servicios de mantenimiento correctivo del hardware y software base de los sistemas de información instalados en los Centros de Proceso de Datos (CPD´s) de SUMA. Gestión Tributaria, a excepción de los servidores escala.",
    "contractingAuthority": "Dirección de Suma Gestión Tributaria. Diputación de Alicante",
    "cpvCode": "50312600 · Servicios tecnológicos",
    "budgetAmount": 481130,
    "estimatedValue": 481130,
    "currency": "EUR",
    "submissionDeadline": "2026-10-16T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:05:17.309Z",
    "status": "PUBLISHED",
    "documentsCount": 9,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-037",
    "fileReference": "2026016",
    "title": "Contrato de los servicios de creación, diseño, desarrollo, implementación, puesta en funcionamiento y mantenimiento de páginas webs para llevar a cabo actuaciones de divulgación en el marco del proyecto FORTALECE",
    "contractingAuthority": "Gerencia Fundación para la Investigación de Málaga en Biomedicina y Salud (FIMABIS)",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 30600,
    "estimatedValue": 30600,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T19:46:51.520Z",
    "publicationDate": "2026-10-02T12:00:58.069Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-038",
    "fileReference": "EPC 07/26",
    "title": "Suministro de las licencias de acceso y uso del cloud de la suite de Microsoft Office 365 y los servicios asociados.",
    "contractingAuthority": "Ente Público de Radiotelevisión de las Illes Balears",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 187803,
    "estimatedValue": 187803,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T21:59:00.000Z",
    "publicationDate": "2026-10-02T11:59:01.624Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-039",
    "fileReference": "10487/2026",
    "title": "Contratación Mixta del suministro de equipos de protección perimetral con servicios de implantación, migración y formación",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Siero",
    "cpvCode": "32420000 · Servicios tecnológicos",
    "budgetAmount": 45750,
    "estimatedValue": 45750,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T12:00:00.000Z",
    "publicationDate": "2026-10-02T11:58:57.647Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-040",
    "fileReference": "024/26-RI",
    "title": "Servicio de gestión y operación del servicio de seguridad DDoS de RedIRIS",
    "contractingAuthority": "Dirección General de la Entidad Pública Empresarial RED.ES",
    "cpvCode": "72250000 · Soporte técnico y sistemas informáticos",
    "budgetAmount": 775000,
    "estimatedValue": 1550000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-27T22:59:00.000Z",
    "publicationDate": "2026-10-02T11:58:38.669Z",
    "status": "PUBLISHED",
    "documentsCount": 7,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-041",
    "fileReference": "2026048SUMNE",
    "title": "Suministro y soporte técnico para el acceso al sistema de distribución global Amadeus, para su uso en las aulas de informática de la Universidad Rey Juan Carlos",
    "contractingAuthority": "Rectorado de la Universidad Rey Juan Carlos",
    "cpvCode": "48900000 · Paquetes de software y licencias",
    "budgetAmount": 13920,
    "estimatedValue": 25984,
    "currency": "EUR",
    "submissionDeadline": "2026-10-31T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:57:36.522Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-042",
    "fileReference": "C2026-00046",
    "title": "Suministro e Implantación de una solución de Acceso Seguro Zero Trust Network Access (ZTNA) para la Autoridad Portuaria de Santa Cruz de Tenerife",
    "contractingAuthority": "Presidencia de la Autoridad Portuaria de Santa Cruz de Tenerife",
    "cpvCode": "48730000 · Paquetes de software y licencias",
    "budgetAmount": 128257,
    "estimatedValue": 128257,
    "currency": "EUR",
    "submissionDeadline": "2026-11-03T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:56:45.256Z",
    "status": "PUBLISHED",
    "documentsCount": 7,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-043",
    "fileReference": "2026036",
    "title": "Contrato del servicio de gestión de la bonificación de formación en la FUNDAE.",
    "contractingAuthority": "Gerencia Fundación para la Investigación de Málaga en Biomedicina y Salud (FIMABIS)",
    "cpvCode": "72300000 · Servicios TIC y consultoría",
    "budgetAmount": 5000,
    "estimatedValue": 20000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-06T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:55:21.611Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-044",
    "fileReference": "32/2026",
    "title": "Suministro en arrendamiento de quince licencias del software Autocad LT para el Ayuntamiento de Llucmajor.",
    "contractingAuthority": "Alcaldía del Ajuntament de Llucmajor",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 20761,
    "estimatedValue": 33218,
    "currency": "EUR",
    "submissionDeadline": "2026-10-08T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:53:59.490Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-045",
    "fileReference": "26-0038",
    "title": "Servicio mantenimiento evolutivo de Ekon Health",
    "contractingAuthority": "Gerencia de Mutua Navarra, Mutua de Accidentes de Trabajo y Enfermedades Profesionales de la Seguridad Social 21",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 70000,
    "estimatedValue": 189000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-11T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:53:50.513Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-046",
    "fileReference": "18-01/25SDA",
    "title": "Adquisición de licencias y derechos de uso de soluciones de software en la nube\n\n\nAdquisición de licencias y derechos de uso de soluciones de software en la nube.",
    "contractingAuthority": "Rectorado de la Universidad de La Laguna",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 0,
    "estimatedValue": 51880080,
    "currency": "EUR",
    "submissionDeadline": "2026-10-14T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:52:45.277Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": true
  },
  {
    "id": "t-placsp-047",
    "fileReference": "261/26",
    "title": "Acuerdo marco para selección de proveedores de servicios de comunicaciones electrónicas para la Diputación de Badajoz, sector público provincial y Entidades Locales de la provincia adheridas a la Central de Compras",
    "contractingAuthority": "Presidencia de la Diputación de Badajoz",
    "cpvCode": "64200000 · Servicios tecnológicos",
    "budgetAmount": 10271504,
    "estimatedValue": 12188988,
    "currency": "EUR",
    "submissionDeadline": "2026-10-17T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:49:36.258Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-048",
    "fileReference": "AST-2026-20177",
    "title": "AST-2026-AMDCDL6_21_Adopcion M365 en el gob de aragon-fase 3",
    "contractingAuthority": "Entidad Pública Aragonesa de Servicios Telemáticos",
    "cpvCode": "72421000 · Servicios de desarrollo de aplicaciones internet",
    "budgetAmount": 69965,
    "estimatedValue": 69965,
    "currency": "EUR",
    "submissionDeadline": "2026-10-20T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:48:53.838Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-049",
    "fileReference": "2026/034730",
    "title": "Servicios de implantación, desarrollo, migración, soporte, mantenimiento y evolución de las webs corporativas de la Consejería de Sanidad de Castilla-La Mancha (proyecto WEB UNICAS) y boletines científicos.",
    "contractingAuthority": "Secretaria General del Servicio de Salud de Castilla-La Mancha",
    "cpvCode": "72413000 · Servicios de internet y portales web",
    "budgetAmount": 363454,
    "estimatedValue": 573454,
    "currency": "EUR",
    "submissionDeadline": "2026-10-05T10:00:00.000Z",
    "publicationDate": "2026-10-02T11:47:22.359Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-050",
    "fileReference": "EXP017/2026/27",
    "title": "Suministro e instalación de sistema de domótica y eficiencia energética en las habitaciones del Colegio Mayor de la Universidad de Cádiz",
    "contractingAuthority": "Rectorado de la Universidad de Cádiz",
    "cpvCode": "31682210 · Servicios tecnológicos",
    "budgetAmount": 20661,
    "estimatedValue": 20661,
    "currency": "EUR",
    "submissionDeadline": "2026-10-20T21:59:00.000Z",
    "publicationDate": "2026-10-02T11:45:55.327Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-051",
    "fileReference": "AST-2026-20176",
    "title": "AST-2026-AMDCDL6_20_Asistencia transformacion digital Salud",
    "contractingAuthority": "Entidad Pública Aragonesa de Servicios Telemáticos",
    "cpvCode": "72421000 · Servicios de desarrollo de aplicaciones internet",
    "budgetAmount": 94218,
    "estimatedValue": 94218,
    "currency": "EUR",
    "submissionDeadline": "2026-10-29T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:45:13.833Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-052",
    "fileReference": "N202600443",
    "title": "Suministro de licencias de software de rehabilitación virtual motora y cognitiva para las clínicas de Barcelona de MC MUTUAL",
    "contractingAuthority": "Dirección General de la Mutual Midat Cyclops, Mutua Colaboradora con la Seguridad Social, nº 1",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 4500,
    "estimatedValue": 18000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-01T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:45:09.241Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-053",
    "fileReference": "CG-2026/2815/0110",
    "title": "Suscripción de backup en la nube de correo electrónico para IBERMUTUA",
    "contractingAuthority": "Dirección General de IBERMUTUA, Mutua Colaboradora con la Seguridad Social nº 274",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 60000,
    "estimatedValue": 60000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-04T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:44:54.597Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-054",
    "fileReference": "26/25F.2.1.0122",
    "title": "Servicio para la realización de un estudio técnico para inventarios de instalaciones y emplazamientos con presencia de amianto en en los municipios de menos de 20.000 habitantes de la provincia de Salamanca.",
    "contractingAuthority": "Presidencia de la Diputación Provincial de Salamanca",
    "cpvCode": "72322000 · Servicios TIC y consultoría",
    "budgetAmount": 180000,
    "estimatedValue": 180000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-07T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:42:50.247Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-055",
    "fileReference": "2026-01085",
    "title": "Servicio de apoyo a la mejora del intercambio de información clínica en el Sistema Nacional de Salud (SNS) y de la calidad del dato sanitario.",
    "contractingAuthority": "Consejero Delegado de Ingeniería de Sistemas para la Defensa de España S.A., S.M.E. y M.P.",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 73920,
    "estimatedValue": 295680,
    "currency": "EUR",
    "submissionDeadline": "2026-10-09T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:41:52.475Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-056",
    "fileReference": "2026000095",
    "title": "Suministro, implantación y mantenimiento de una solución de gestión del Archivo Municipal, portal interno de acceso y portal de difusión pública para el Ayuntamiento de Getafe.",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Getafe",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 61983,
    "estimatedValue": 61983,
    "currency": "EUR",
    "submissionDeadline": "2026-10-12T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:12:47.109Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-057",
    "fileReference": "2026/0007002",
    "title": "Provisión de Licencias Salesforce para la captación de estudiantes en las áreas de Postgrado, Escuela Internacional y Formación Permanente y Migración de la Org. actual (Heda)",
    "contractingAuthority": "Rector de la Universidad Carlos III de Madrid",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 90654,
    "estimatedValue": 108785,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T21:59:00.000Z",
    "publicationDate": "2026-10-02T11:09:11.349Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-058",
    "fileReference": "49P/26",
    "title": "Servicio de estudio de implantación de Inteligencia Artificial en la Diputación Provincial de Cuenca",
    "contractingAuthority": "Presidencia de la Diputación Provincial de Cuenca",
    "cpvCode": "72600000 · Soporte y consultoría informática",
    "budgetAmount": 24793,
    "estimatedValue": 24793,
    "currency": "EUR",
    "submissionDeadline": "2026-10-18T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:05:31.345Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-059",
    "fileReference": "73/2026",
    "title": "Contratación de una solución informática que englobe la gestión de Recursos Humanos, Nómina, Portal del Empleado y Control de Presencia del Ayuntamiento de Valdemoro, en modalidad SaaS.",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Valdemoro",
    "cpvCode": "72500000 · Servicios informáticos y soporte",
    "budgetAmount": 229067,
    "estimatedValue": 288308,
    "currency": "EUR",
    "submissionDeadline": "2026-10-21T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:05:00.282Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-060",
    "fileReference": "7300029-4",
    "title": "El contrato tiene por objeto la prestación del servicio mantenimiento informático- portales web y alquiler de equipos.",
    "contractingAuthority": "Junta Directiva de la Asociación para el Desarrollo del Valle del Alagón",
    "cpvCode": "50312000 · Servicios tecnológicos",
    "budgetAmount": 29520,
    "estimatedValue": 35719,
    "currency": "EUR",
    "submissionDeadline": "2026-10-24T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:04:17.504Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-061",
    "fileReference": "2026/032471",
    "title": "Ejecución Estrategia de Cultura en Alfabetización mediática y ciberseguridad de la ATD",
    "contractingAuthority": "Secretaría General de la Consejería de Hacienda, Administraciones Públicas y Transformación Digital de la Junta de Comunidades de Castilla-La Mancha",
    "cpvCode": "80000000 · Servicios tecnológicos",
    "budgetAmount": 545262,
    "estimatedValue": 1363156,
    "currency": "EUR",
    "submissionDeadline": "2026-10-27T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:04:12.607Z",
    "status": "PUBLISHED",
    "documentsCount": 5,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-062",
    "fileReference": "CONTR 2026 15674",
    "title": "Ampliación de entorno Oracle Exadata de la CAIB",
    "contractingAuthority": "Dirección General de la Agencia Balear de Digitalización, Ciberseguridad y Telecomunicaciones",
    "cpvCode": "48600000 · Paquetes de software y licencias",
    "budgetAmount": 580008,
    "estimatedValue": 580008,
    "currency": "EUR",
    "submissionDeadline": "2026-10-30T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:03:52.286Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-063",
    "fileReference": "5100068223 Suministro e instalación de megafonía",
    "title": "Suministro e instalación de megafonía para la nas.",
    "contractingAuthority": "Comité Central de Compras de Navantia S.A., S.M.E.",
    "cpvCode": "48952000 · Paquetes de software y licencias",
    "budgetAmount": 25000,
    "estimatedValue": 25000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-02T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:03:07.468Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-064",
    "fileReference": "2026-C07",
    "title": "Vuelo fotogramétrico digital a color con recubrimiento estereoscópico en el ámbito de la Comunidad Autónoma de Canarias.",
    "contractingAuthority": "Cartográfica de Canarias S.A.",
    "cpvCode": "71355100 · Servicios tecnológicos",
    "budgetAmount": 385921,
    "estimatedValue": 385921,
    "currency": "EUR",
    "submissionDeadline": "2026-11-05T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:02:45.300Z",
    "status": "PUBLISHED",
    "documentsCount": 8,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-065",
    "fileReference": "1010/2026",
    "title": "Suministro y renovación de las licencias, servicio de mantenimiento y soporte técnico de la plataforma de gestión (IVSIGN) , integración PKI con certificados, repositorio de certificados CKC y otros, para la Sociedad Municipal de Viviendas y de Servicios de San Cristóbal de La Laguna, S.A.U., MUVISA",
    "contractingAuthority": "Sociedad Municipal de Viviendas y de Servicios de San Cristóbal de La Laguna",
    "cpvCode": "72267100 · Mantenimiento y soporte de software",
    "budgetAmount": 11828,
    "estimatedValue": 11828,
    "currency": "EUR",
    "submissionDeadline": "2026-10-07T19:46:51.520Z",
    "publicationDate": "2026-10-02T11:01:50.262Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-066",
    "fileReference": "324/2026",
    "title": "Servicio de mantenimiento de la plataforma de administración electrónica denominada \"Espublico Gestiona\"&#xD;",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Benabarre",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 20500,
    "estimatedValue": 20500,
    "currency": "EUR",
    "submissionDeadline": "2026-10-10T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:58:19.390Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-067",
    "fileReference": "MT270303",
    "title": "Servicio Mantenimiento RPA/Hiperautomatización",
    "contractingAuthority": "Consejo de Administración-Comité de Inversiones de la Sociedad Estatal Correos y Telégrafos S.A",
    "cpvCode": "72261000 · Servicios de software y mantenimiento",
    "budgetAmount": 134500,
    "estimatedValue": 168125,
    "currency": "EUR",
    "submissionDeadline": "2026-10-07T08:10:00.000Z",
    "publicationDate": "2026-10-02T10:57:07.926Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-068",
    "fileReference": "P4102600F-2026/000163-PCAB",
    "title": "Suministro de equipamiento TIC para la administración municipal (Ayuntamiento de Casariche) Programa Sevilla Digital.",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Casariche",
    "cpvCode": "30237300 · Servicios tecnológicos",
    "budgetAmount": 28811,
    "estimatedValue": 28811,
    "currency": "EUR",
    "submissionDeadline": "2026-10-16T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:54:11.627Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-069",
    "fileReference": "PAS 2026/049",
    "title": "Servicios de asistencia técnicas para la administración de sistemas y soporte avanzado de Informix, Linux y Oracle, con destino a los hospitales universitarios de Ceuta y de Melilla&#xD;",
    "contractingAuthority": "Dirección del Instituto Nacional de Gestión Sanitaria (INGESA)",
    "cpvCode": "72253200 · Soporte técnico y sistemas informáticos",
    "budgetAmount": 89843,
    "estimatedValue": 89843,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:53:59.569Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-070",
    "fileReference": "2026-01277",
    "title": "Servicios de Apoyo Técnico en Proyectos de Geografía Humana",
    "contractingAuthority": "Consejero Delegado de Ingeniería de Sistemas para la Defensa de España S.A., S.M.E. y M.P.",
    "cpvCode": "72220000 · Consultoría en sistemas y ciberseguridad",
    "budgetAmount": 94050,
    "estimatedValue": 188100,
    "currency": "EUR",
    "submissionDeadline": "2026-10-26T13:00:00.000Z",
    "publicationDate": "2026-10-02T10:47:34.841Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-071",
    "fileReference": "PA 14/2026",
    "title": "Contratación mixta, del servicio integral de administración, mantenimiento correctivo y preventivo, soporte técnico, evolución y asistencia de los sistemas de información y comunicaciones, así como el suministro, instalación, configuración y puesta en funcionamiento de equipos, componentes, periféricos, licencias de software, renovaciones y material informático.",
    "contractingAuthority": "Consejería Delegada de Movilidad y Desarrollo Urbano Sostenible, S.L., (MODUS ROTA)",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 79000,
    "estimatedValue": 79000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-25T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:45:49.149Z",
    "status": "PUBLISHED",
    "documentsCount": 7,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-072",
    "fileReference": "2026/000620",
    "title": "Servicios de desarrollo, implantación y evolución de los sistemas de educación de Castilla-La Mancha",
    "contractingAuthority": "Secretaría General de la Consejería de Hacienda, Administraciones Públicas y Transformación Digital de la Junta de Comunidades de Castilla-La Mancha",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 5297639,
    "estimatedValue": 16630562,
    "currency": "EUR",
    "submissionDeadline": "2026-10-28T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:42:38.887Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-073",
    "fileReference": "1830/2026",
    "title": "Servicios relativos a telefonía fija y móvil, incluyendo voz y datos, conexión a internet, tráfico de todo tipo y herramientas de gestión, mantenimiento integral y reparaciones que sean precisas",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Cenes de la Vega",
    "cpvCode": "64200000 · Servicios tecnológicos",
    "budgetAmount": 34840,
    "estimatedValue": 69680,
    "currency": "EUR",
    "submissionDeadline": "2026-10-31T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:39:58.184Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-074",
    "fileReference": "050/2026",
    "title": "Contratación del suministro de datos de movilidad necesarios para la elaboración de un estudio sobre la presencia, los patrones de desplazamiento y la distribución espacial de los cruceristas en Palma y en el conjunto de la isla de Mallorca.",
    "contractingAuthority": "Dirección de la Agencia de Estrategia Turística de las Islas Baleares (AETIB)",
    "cpvCode": "72313000 · Servicios TIC y consultoría",
    "budgetAmount": 40000,
    "estimatedValue": 40000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-16T21:59:00.000Z",
    "publicationDate": "2026-10-02T10:39:55.887Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-075",
    "fileReference": "T26025901",
    "title": "Renovación del servidor de almacenamiento CCTV Metrocentro.",
    "contractingAuthority": "Gerencia de Transportes Urbanos de Sevilla, SAM",
    "cpvCode": "32323500 · Servicios tecnológicos",
    "budgetAmount": 27000,
    "estimatedValue": 27000,
    "currency": "EUR",
    "submissionDeadline": "2026-11-06T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:36:20.689Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-076",
    "fileReference": "FIEM26/E0064",
    "title": "Análisis de solvencia de operación de exportación con garantía corporativa",
    "contractingAuthority": "Dirección General de Inteligencia Económica y Comercial",
    "cpvCode": "66171000 · Servicios tecnológicos",
    "budgetAmount": 12750,
    "estimatedValue": 12750,
    "currency": "EUR",
    "submissionDeadline": "2026-10-08T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:36:10.412Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-077",
    "fileReference": "129/25",
    "title": "Servicio de mantenimiento del aplicativo del Cliente Ligero.",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Villaviciosa de Odón",
    "cpvCode": "72267000 · Mantenimiento y soporte de software",
    "budgetAmount": 16031,
    "estimatedValue": 32063,
    "currency": "EUR",
    "submissionDeadline": "2026-10-11T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:05:28.485Z",
    "status": "PUBLISHED",
    "documentsCount": 7,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-078",
    "fileReference": "2026/00017730N",
    "title": "Sustitución de la bomba de calor destinada a la climatización del módulo de consultas en el Hospital Residencia Asistida Cas Serres&#xD;",
    "contractingAuthority": "Consell Executiu del Consell Insular d'Eivissa",
    "cpvCode": "45331000 · Servicios tecnológicos",
    "budgetAmount": 187011,
    "estimatedValue": 187011,
    "currency": "EUR",
    "submissionDeadline": "2026-10-14T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:02:57.150Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-079",
    "fileReference": "P4102900J-2026/000087-PEAS",
    "title": "Servicio de Delegado de Protección de datos y asistencia especializada.",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Castilleja de la Cuesta",
    "cpvCode": "79140000 · Servicios tecnológicos",
    "budgetAmount": 11000,
    "estimatedValue": 22000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-17T19:46:51.520Z",
    "publicationDate": "2026-10-02T10:02:53.302Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-080",
    "fileReference": "AMSECCD_23_002",
    "title": "Centro de operaciones de seguridad y equipo de respuesta ante incidencias de ciberseguridad (SOC+CSIRT+CERT)",
    "contractingAuthority": "Entidad Pública Aragonesa de Servicios Telemáticos",
    "cpvCode": "72250000 · Soporte técnico y sistemas informáticos",
    "budgetAmount": 1946865,
    "estimatedValue": 4633817,
    "currency": "EUR",
    "submissionDeadline": "2026-10-20T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:57:52.964Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-081",
    "fileReference": "2026/EA12/00000832E",
    "title": "Servicio de mantenimiento correctivo, adaptativo y evolutivo de la plataforma de gestión académica CLOUDMINERVA del Ejército del Aire y del Espacio",
    "contractingAuthority": "Jefatura de la Sección Económico Administrativa 12 - Agrupación del Acuartelamiento Aéreo Tablada",
    "cpvCode": "72212900 · Programación y desarrollo de sistemas",
    "budgetAmount": 86553,
    "estimatedValue": 416953,
    "currency": "EUR",
    "submissionDeadline": "2026-10-23T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:56:51.907Z",
    "status": "PUBLISHED",
    "documentsCount": 8,
    "hasActiveAnalysis": true
  },
  {
    "id": "t-placsp-082",
    "fileReference": "26/285",
    "title": "Suministro de servidores para la renovación del servidor de contingencia para AGC y para dos sondas de seguridad para el CCN-CERT; así como servicios de Puesta en Operación, Soporte técnico, servicios de Mantenimiento preventivo y correctivo y suministro de Actualización de versiones de Software asociado a los mismos.",
    "contractingAuthority": "Comisión de Contratación de la Sociedad Estatal Loterías y Apuestas del Estado, S.M.E., S.A.",
    "cpvCode": "48820000 · Paquetes de software y licencias",
    "budgetAmount": 51000,
    "estimatedValue": 51000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-26T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:55:39.316Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": true
  },
  {
    "id": "t-placsp-083",
    "fileReference": "AYAL-2024000218",
    "title": "Contratación de los servicios de mantenimiento, conservación, reparación, gestión, integración y desarrollo de Smart Mobility, control semafórico y distribución urbana de mercancías.",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Almería",
    "cpvCode": "63712700 · Servicios tecnológicos",
    "budgetAmount": 2603301,
    "estimatedValue": 4859495,
    "currency": "EUR",
    "submissionDeadline": "2026-10-29T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:55:06.344Z",
    "status": "PUBLISHED",
    "documentsCount": 14,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-084",
    "fileReference": "2026/CTT_01/000126",
    "title": "Suministro de equipamiento TIC para el Ayuntamiento de Marchena. Financiado por el Programa Sevilla Digital 2024, de la Excma. Diputación Provincial de Sevilla.",
    "contractingAuthority": "Alcaldía del Ayuntamiento de Marchena",
    "cpvCode": "30231300 · Servicios tecnológicos",
    "budgetAmount": 38524,
    "estimatedValue": 38524,
    "currency": "EUR",
    "submissionDeadline": "2026-11-01T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:53:30.801Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-085",
    "fileReference": "202605PAO003",
    "title": "Suministro de derechos de uso de licencias para la biblioteca de variantes genéticas del sistema de información para la integración de la información genómica del Sistema Nacional de Salud",
    "contractingAuthority": "Dirección General de Salud Digital y Sistemas de Información del Sistema Nacional de Salud",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 3356709,
    "estimatedValue": 3356709,
    "currency": "EUR",
    "submissionDeadline": "2026-11-04T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:51:34.952Z",
    "status": "PUBLISHED",
    "documentsCount": 9,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-086",
    "fileReference": "P9100004B-2026/000004-PCAB",
    "title": "suministro de tres licencias de oracle partitioning (particionamiento) y su soporte con destino al opaef.",
    "contractingAuthority": "Presidencia del Organismo Provincial de Asistencia Económica y Fiscal (OPAEF)",
    "cpvCode": "48219000 · Paquetes de software y licencias",
    "budgetAmount": 44429,
    "estimatedValue": 44429,
    "currency": "EUR",
    "submissionDeadline": "2026-11-07T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:51:26.432Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-087",
    "fileReference": "XP0176/2023",
    "title": "Adquisición, instalación y puesta en funcionamiento de dispositivos electrónicos para la prestación de servicios de información, tramitación electrónica de procedimientos y evaluación de los servicios de información ciudadana",
    "contractingAuthority": "Consejería de Gobierno de Presidencia y Movilidad Sostenible del Cabildo de Gran Canaria",
    "cpvCode": "30231100 · Servicios tecnológicos",
    "budgetAmount": 652528,
    "estimatedValue": 652528,
    "currency": "EUR",
    "submissionDeadline": "2026-10-09T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:50:00.676Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-088",
    "fileReference": "P9100004B-2026/000002-PEN",
    "title": "Servicios de migración web y actualización (lote1) y el soporte técnico y mantenimiento (lote2) de la aplicación censal del iae, para los dos próximos años.",
    "contractingAuthority": "Presidencia del Organismo Provincial de Asistencia Económica y Fiscal (OPAEF)",
    "cpvCode": "72540000 · Servicios informáticos y soporte",
    "budgetAmount": 44350,
    "estimatedValue": 86230,
    "currency": "EUR",
    "submissionDeadline": "2026-10-12T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:49:19.245Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-089",
    "fileReference": "XP0175/2023",
    "title": "Suministro, Instalación y operación de sistema de Ayuda para personas con discapacidad auditiva en los Centros de Atención al Ciudadano",
    "contractingAuthority": "Consejería de Gobierno de Presidencia y Movilidad Sostenible del Cabildo de Gran Canaria",
    "cpvCode": "72222300 · Consultoría en sistemas y ciberseguridad",
    "budgetAmount": 78403,
    "estimatedValue": 78403,
    "currency": "EUR",
    "submissionDeadline": "2026-10-15T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:48:40.025Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-090",
    "fileReference": "2026/ETSAE0904/00000502E",
    "title": "Adquisición de varias licencias de antivirus específicos para ciberdefensa",
    "contractingAuthority": "Sección de Asuntos Económicos de la Jefatura Sistemas de Información, Telecomunicaciones y Asistencia Técnica",
    "cpvCode": "48760000 · Paquetes de software y licencias",
    "budgetAmount": 3719,
    "estimatedValue": 3719,
    "currency": "EUR",
    "submissionDeadline": "2026-10-18T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:45:10.564Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-091",
    "fileReference": "2026/117",
    "title": "Servicios de impresión y digitalización de notificaciones, correspondencia ordinaria y otra documentación del Ayuntamiento de Córdoba",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Córdoba",
    "cpvCode": "79820000 · Servicios tecnológicos",
    "budgetAmount": 240000,
    "estimatedValue": 528000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-29T22:59:00.000Z",
    "publicationDate": "2026-10-02T09:43:36.605Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-092",
    "fileReference": "SER-26-0299-SIST",
    "title": "Servicio de implantación, soporte y mantenimiento de una solución para la gestión de accesos privilegiados (PAM), para umivale Activa, MCSS nº3",
    "contractingAuthority": "Gerencia umivale Activa, Mutua Colaboradora con la Seguridad Social número 3",
    "cpvCode": "72260000 · Servicios de software y mantenimiento",
    "budgetAmount": 90000,
    "estimatedValue": 90000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-24T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:43:31.723Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-093",
    "fileReference": "2026/AR43U/00002611E",
    "title": "Servicio para el mantenimiento, actualización y soporte evolutivo del nomenclátor digital del IHM.",
    "contractingAuthority": "Intendente de San Fernando",
    "cpvCode": "72310000 · Servicios TIC y consultoría",
    "budgetAmount": 19199,
    "estimatedValue": 19199,
    "currency": "EUR",
    "submissionDeadline": "2026-10-20T07:00:00.000Z",
    "publicationDate": "2026-10-02T09:42:32.466Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-094",
    "fileReference": "2026-01226",
    "title": "Servicio de Apoyo al Desarrollo Normativo relativo al la Ciberseguridad 5G y la Seguridad Digital",
    "contractingAuthority": "Consejero Delegado de Ingeniería de Sistemas para la Defensa de España S.A., S.M.E. y M.P.",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 74250,
    "estimatedValue": 99000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-30T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:42:21.766Z",
    "status": "PUBLISHED",
    "documentsCount": 4,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-095",
    "fileReference": "3451/2025",
    "title": "Servicios de mantenimiento y evolución de la web corporativa del Consorcio de Compensación de Seguros.",
    "contractingAuthority": "Consorcio de Compensación de Seguros",
    "cpvCode": "72267000 · Mantenimiento y soporte de software",
    "budgetAmount": 1986528,
    "estimatedValue": 2383833,
    "currency": "EUR",
    "submissionDeadline": "2026-11-02T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:41:04.492Z",
    "status": "PUBLISHED",
    "documentsCount": 10,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-096",
    "fileReference": "2026/071/01",
    "title": "Contratacion del mantenimiento evolutivo de una herramienta informatica ya existente de Mutualia, que facilita la implantación de la guía de gestión y prevención de ausencias laborales, para su utilización por parte de personas usuarias de empresas asociadas.",
    "contractingAuthority": "Dirección Gerencia de Mutualia, Mutua Colaboradora con la Seguridad Social nº 02",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 8800,
    "estimatedValue": 35200,
    "currency": "EUR",
    "submissionDeadline": "2026-11-05T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:39:46.783Z",
    "status": "PUBLISHED",
    "documentsCount": 14,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-097",
    "fileReference": "S-04101-2026",
    "title": "Servicios de prototipado, creación digital y nuevos formatos para el laboratorio de innovación audiovisual de RTVE",
    "contractingAuthority": "Compras de la Corporación de Radio y Televisión Española S.A.",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 972800,
    "estimatedValue": 1459200,
    "currency": "EUR",
    "submissionDeadline": "2026-11-03T11:00:00.000Z",
    "publicationDate": "2026-10-02T09:37:00.149Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-098",
    "fileReference": "2026-01219",
    "title": "Contratación de servicios de apoyo al seguimiento y coordinación de los trabajos relacionados con el servicio de oficina técnica para la asesoría y soporte técnico a la Dirección de los Proyectos TIC del CAPN.",
    "contractingAuthority": "Consejero Delegado de Ingeniería de Sistemas para la Defensa de España S.A., S.M.E. y M.P.",
    "cpvCode": "72000000 · Servicios TIC y consultoría",
    "budgetAmount": 130000,
    "estimatedValue": 195000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-10T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:36:28.963Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-099",
    "fileReference": "2025-07",
    "title": "Servicios de mantenimiento de servidores con arquitectura x86 para la Intervención General de la Administración del Estado",
    "contractingAuthority": "Junta de Contratación de los Servicios Centrales en el Ministerio de Hacienda",
    "cpvCode": "72250000 · Soporte técnico y sistemas informáticos",
    "budgetAmount": 301698,
    "estimatedValue": 738251,
    "currency": "EUR",
    "submissionDeadline": "2026-10-13T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:31:43.243Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-100",
    "fileReference": "10581/2025",
    "title": "Servicios de gestión y suscripción de dominios y herramientas digitales (accesibilidad web, chatbot y metricool)",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Teulada",
    "cpvCode": "72400000 · Servicios de internet, web y cloud",
    "budgetAmount": 2479,
    "estimatedValue": 4958,
    "currency": "EUR",
    "submissionDeadline": "2026-10-16T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:31:21.317Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-101",
    "fileReference": "28-09/26C",
    "title": "Adquisición Infraestructuras CPD Servicio TIC. ULL",
    "contractingAuthority": "Rectorado de la Universidad de La Laguna",
    "cpvCode": "48820000 · Paquetes de software y licencias",
    "budgetAmount": 1000000,
    "estimatedValue": 1000000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:26:41.947Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-102",
    "fileReference": "298/2026",
    "title": "Contrato de servicio de soporte, mantenimiento y evolución de los sistemas informáticos de gestión del Organismo Estatal de Inspección de Trabajo y Seguridad Social.",
    "contractingAuthority": "Dirección del Organismo Estatal Inspección de Trabajo y Seguridad Social",
    "cpvCode": "72610000 · Soporte y consultoría informática",
    "budgetAmount": 1993024,
    "estimatedValue": 1993024,
    "currency": "EUR",
    "submissionDeadline": "2026-10-22T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:26:36.709Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-103",
    "fileReference": "FELIB 1/2026",
    "title": "Establecimiento de un Acuerdo marco para el suministro del derecho de uso y servicios asociados de software de gestión municipal en modalidad SaaS, con destino a las entidades locales de las Illes Balears.",
    "contractingAuthority": "Presidencia de la Federació D'Entitats Locals de les Illes Balears",
    "cpvCode": "48000000 · Paquetes de software y licencias",
    "budgetAmount": 4891548,
    "estimatedValue": 9453032,
    "currency": "EUR",
    "submissionDeadline": "2026-10-16T12:00:00.000Z",
    "publicationDate": "2026-10-02T09:25:15.693Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-104",
    "fileReference": "5839/2026",
    "title": "Servicios de mantenimiento hardware y software",
    "contractingAuthority": "Pleno de la Diputación Provincial de Castellón",
    "cpvCode": "50312600 · Servicios tecnológicos",
    "budgetAmount": 54300,
    "estimatedValue": 54300,
    "currency": "EUR",
    "submissionDeadline": "2026-10-16T11:00:00.000Z",
    "publicationDate": "2026-10-02T09:20:16.263Z",
    "status": "PUBLISHED",
    "documentsCount": 2,
    "hasActiveAnalysis": false
  },
  {
    "id": "t-placsp-105",
    "fileReference": "18/26",
    "title": "Suministro de un sistema de preservación digital a largo plazo en nube (Software as a Service).",
    "contractingAuthority": "Rectorado de la Universidad de les Illes Balears",
    "cpvCode": "48612000 · Paquetes de software y licencias",
    "budgetAmount": 176000,
    "estimatedValue": 475200,
    "currency": "EUR",
    "submissionDeadline": "2026-10-31T19:46:51.520Z",
    "publicationDate": "2026-10-02T09:19:55.332Z",
    "status": "PUBLISHED",
    "documentsCount": 6,
    "hasActiveAnalysis": true
  },
  {
    "id": "t-placsp-106",
    "fileReference": "S-03806-2026",
    "title": "Herramienta de análisis del comportamiento del usuario",
    "contractingAuthority": "Compras de la Corporación de Radio y Televisión Española S.A.",
    "cpvCode": "72316000 · Servicios TIC y consultoría",
    "budgetAmount": 100000,
    "estimatedValue": 165000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-19T12:00:00.000Z",
    "publicationDate": "2026-10-02T09:18:33.114Z",
    "status": "PUBLISHED",
    "documentsCount": 3,
    "hasActiveAnalysis": false
  }
];

export const REAL_PLACSP_DOCS: Record<string, TenderDocument[]> = {
  "t-placsp-001": [
    {
      "id": "doc-t-placsp-001-1",
      "name": "2025-11 - 09 - PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "b297728c73f2ab2f8903bb5f2c11406615a048d21abdcd41494de394ecf3dd04",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=KK169PSVaaFkl3%2BLBnAmyKpedvIGjTLqxSS4N1L2LVVGjnXqLmKmEvKBY1DWY0Dt1h7y68obw%2BRAv5huQPKUutG0eBUv901%2BYED9aEylYNnfdyQgZAdTm3EfcUAC7CJ6&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-2",
      "name": "2025-11 - 08_PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "95d3b0ba44a2bad8331d1546ee0d5e8ca2910fac2295f6cc83ee76ee81308a66",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=ydLAxvZijHbcMQqFremzaHOihHxTTQHNS6EUk4tGB4gcHrP7xRHr95YizCkzKXa0DIjlQL76OAQbHmRuPiAOk98QzLLmUr3XM0sr5ErwAv6Cx2e6p7hqtlp2aFupgHMr&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-3",
      "name": "2025-11 - 09e_Anexo_05_yss_ANEXO V.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "05479883252d607b5012363d854c592ac199418e5b74e74eb569e2ff00c801e5",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=SidX7TpME52ZufH9XkZoqbUppBAhTXP9zwD19bjEGx2a7KqWa3dijJ2CTAqhRy6FQ%2BUtY/gM4hJFAsj46zf7ycjlL7EuMMRzZT1fbz3GGx57QB3HKyQaFUExmUVQCerk&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-4",
      "name": "2025-11 - ANEXO IX.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "a44e73eaf1bba556db8f3c63b6389490a567c07ec54f0614f841de7ca18812d0",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=lbnhgnIY2tlUKtsucS8jBD9oiyLKI8gWTuH6RLpB4nw3nzDRpYrX8x6WJhO5b/P7kV8bmdCK%2Bhq4yiMu2RBTklDy9pYtsReG5FViQi5faxhJOVDbGCDM%2BMigrvuVS7Rv&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-5",
      "name": "2025-11 - ANEXO IX_3.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0b29ce1b806fc22a40a3e3e81228a4c1f17724366350a0f49a9d32dd436f3446",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=0lXBxmbc2qGUD%2B%2BZxgfIsyRNFoyALMZysf0B4poO0DWke1rMZMGsEvIsvYEyXdpw4VqqRN9LGztBtmjCIGrXbwpywLBMNycNJgzl%2BI/YjWjVTD3T98KC0nSgQFM0q%2B5s&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-6",
      "name": "2025-11 - ANEXO VI.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "48b6177d3c83382b9fcaa47462626eb500c4b84a53401fc8bd1d31bf1299bc84",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=XbKVLAak%2Bc9pNe1Cvp4%2B%2BBooLtCiQ4pDL9cMPHDN%2BNVRaAAKcohVNl5skVSc%2B3DIu/4OcbTOYUOLsSxcBqwCgi%2B8CF9MgX8tlITMnVcBzNj6CYyL7SIrUOBFfNf52ZqA&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-7",
      "name": "2025-11 - ANEXO VIII.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "46f28dc803367248fa6cbeae6af75f088e23f3f6075b57de03968f9383b63f9a",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=m0GJTCgpXZFx0Y/PvwVREEaGJVuSIuEOh6oP0Z6N5QlOxG2CZ6B8MEPY3O7F9Ptk/qr4Mu3c8muIz0Dw0/d775w91BhVVGPQakEPgUe684TfdyQgZAdTm3EfcUAC7CJ6&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-8",
      "name": "2025-11 - ANEXO X.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5125905d1012ff39573d070db80597a285c97082d888af65756bae08e3b1f2b2",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=NVp6sjN/GEJb/PtbdYTKpDNsqswJpZ2G8ipYXrpPTfVF57OE7hRHQvJ84T%2BMXL4BiG8khjjZP0QsJHe/qOPYDdpUZxB6LTT1DtR7AS9VA0nVTD3T98KC0nSgQFM0q%2B5s&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-9",
      "name": "2025-11 - ANEXO XI.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0164245bf6172054d98ec583f98498a1c4c33a5da9bacbed1ee490d9cce4f501",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=7YQY5MK333JaLx7dMnqAbFOHerkXZOaYzM46O1zikB6ACSGX57vEwwMatCG0xV6BTUbkenWjX5HQxh5Rc51OZVVga43jjOtORWTwvrsWteGHAj0WEJrB5sP7amrh2jBD&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-10",
      "name": "2025-11 - ANEXO XII.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "4eb074deaf4885ca99715791fa21c33148ef99f6de764041bb35b6df8755cc78",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=XHGySRuBPfgDWLGqCHwFrtOeNjUnTwr3emvJq4Dh7Q0LZ3fJq%2BL%2BJtmC2Y%2BW/BFQyF3JM38DBfZBrkQkXF1/NgNkAkBLnvR/%2BBzdBGJ3FRzDdQD9RyhUmzT4jZ2In4zL&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-001-11",
      "name": "2025-11 - CUESTIONARIOS A CUMPLIMENTAR SOBRE FORMACIN y experiencia.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d56d8485e82a13b13fd912004b0b4d70591b09edd4bb6ee6e2d6fa2dc97bf27f",
      "obtainedAt": "2026-10-02T17:57:41.136Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=ZIZcebIvBQAyFv4L5DVhRnJjyp1T8rbd4bvku2OsytNJZP50u%2BqMvAVB17Fy3jeqCi5z%2BqGji7icIUmkC5RIPIg2PGnsLjBap0wJqI/6AEaHAj0WEJrB5sP7amrh2jBD&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    }
  ],
  "t-placsp-002": [
    {
      "id": "doc-t-placsp-002-1",
      "name": "Pliego Clausulas Administrativas Particulares.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "5b5cf4515a98a7313f676c5900a748f77ba20b418dc897b003c6cc06b3ff24a5",
      "obtainedAt": "2026-10-02T17:38:24.032Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ofVdNsozK9K0VxerjDzW5jFwFmHQOvj8CzluED2OTkWhTt7i1V%2Byi1J/C1/%2BRY0EuJrFqZMIKeweWJ%2BPbRGek0ScvaZFxsU7SdvKBXIVzDeB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-002-2",
      "name": "Pliego de Prescripciones Tecnicas.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "12ee75c1d91cbf2eae673992780217cadac2ad4565218c4863c300e9d70b0a3a",
      "obtainedAt": "2026-10-02T17:38:24.032Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=UTnFxV6J997Tez8Szt9tdvBld3QUTenqZtF2Jym1MRU2LLF6hn9WVUF83XxEzQh5hNMvbJXrTO%2Bs4P8UyJdLokHBd1G9xmDHDy2oWB9oTfhJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-002-3",
      "name": "ANEXO III Memoria o Propuesta tecnica.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "c4f8ac3d742f6dc40007b18dbd0502e3478fcf199f307ffcc9d9214d30db9c91",
      "obtainedAt": "2026-10-02T17:38:24.032Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=zrW77aUWCPhuOudrphmql2doiAQ7J5XMk1JLwRE19SzgoQBHlaJFFM9SoyAsCZ%2BVWsllBTcQ%2BS3iU8K4OcbTP67346BiLQIiENO/i3Y0d2j3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-002-4",
      "name": "ANEXO IV Declaracion sobre disponibilidad medios.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "601e6757ba0657784d08ed2db0b4f56aba31a1c0da3303ae5e226bd902ab4147",
      "obtainedAt": "2026-10-02T17:38:24.032Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=05qoQOblBl3%2Bj%2BsJRohXAGjXk54xeGAVKBeirtbyEKgQx0vwkRJF4sjhIeQiaIk5%2BGfEBbP2Oqn/e1qPjHgvt1mnKsMqlI2oCfPidM99sMjfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-002-5",
      "name": "ANEXO II Oferta Economica.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "28af00d60f008bab6d639d28018b435b51b3dd51180b2e37f3eb185a4d1d9ef9",
      "obtainedAt": "2026-10-02T17:38:24.032Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ASi5uJNfN2FAIAFkwFcy2CVaLq6C5ieaCnL7ooppYH80AUdNck1gs43jX1vI2MmY1s6%2Bi8qOgUnuYwAlFxNwjVUktBI1fu3THSlSsHp1AbnDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-002-6",
      "name": "ANEXO I Declaracion responsable.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "ddcde46c12d5a458fbf0c666ae4e79e463cdccf498fd04d3f6b23d1e9aeea56a",
      "obtainedAt": "2026-10-02T17:38:24.032Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=zk8NOBJSD337FsPvoJzMsWoif7%2BOAbmd8C0LXbHpXdb633FlQKHUmmS8dXz3/Jh81ghrUUtrsv%2BQwYV2mHgC0DwN8zwlplevoQC4ttY4JgZ7QB3HKyQaFUExmUVQCerk"
    }
  ],
  "t-placsp-003": [
    {
      "id": "doc-t-placsp-003-1",
      "name": "04A CCP DEMA 2026-046.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "0f5d1162bc838bd6b1f047fb9ccf00744c987b0cb55d642e9ef46a2547b4ed62",
      "obtainedAt": "2026-10-02T15:50:52.992Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=hOAXU8c6ESbU0FcTaVguW10YNP2V1%2BbLEo6kkR9VTKXcVIg1M6vfgJBIE2i5kUGssVraxwMGwlT79W%2BU%2BUE6sYhuYq8%2Bo/hxvc2BXPNivxB7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-003-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "f4a86acdb05ec87d4b05d17c04ba32f9e18651e12e9a203e96f3096975910830",
      "obtainedAt": "2026-10-02T15:50:52.992Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=RyVB83GCFV20u3SLnY4FWhdmSV/T2ax06MNWlznRIsRdsfgsfSL%2BjlRwfIu0EPx5PvieAcjHm9DiHrt51xybwbz%2BAQN1TRcZ6Sy/KfULXAd7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-003-3",
      "name": "Anexo I.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0883acf6fbfff116b0ff1b6aeb6844c8b90cde1cd6515b2ef2edf1c26ae580e4",
      "obtainedAt": "2026-10-02T15:50:52.992Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=2u8TTw6pwYxGyCyxSvcTFsFI8pSv9z9ozH8tFurONxCkzzsG54KHZkTcxPKHGHXWt1k/oOl74wRsghIHPhB%2BIaWyMzgBr%2BwJ%2B6bB1xV0mmzDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-003-4",
      "name": "Anexo II.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "eb7d693efa2cdc2a726a0e0d084582143ca79b57879370fe7fc689219df7512b",
      "obtainedAt": "2026-10-02T15:50:52.992Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=hayopJ59p51JALhT0r5Lx95PGhKBC5A/skt0m2h0vMRcTd8Lfk%2B0h4hlzOACp5jkiinu70fhp98%2B2zYdZP7zilxJiZjurbkwKEj7Dx%2BSsSZ45ClyWkoJ44mKM70IFcOu"
    }
  ],
  "t-placsp-004": [
    {
      "id": "doc-t-placsp-004-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "080dbb991797c81c11d202073fe4231904703bd6c69661a7e76462f6728515ce",
      "obtainedAt": "2026-10-02T15:37:21.370Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=fv2csC1ATD/cETRRm0cRY2BwHd56lOwDZPXR40TL60MR9HW9jNw5EXgOIIMmB41vRay7VltT3YT2NvsiftIzMby1sdmCUBJ0omd1iuteA1Zt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-004-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "dc492c7b796da5b3ee301f7217c55deba59fa810eb88a04c34ce9d97a04ee68f",
      "obtainedAt": "2026-10-02T15:37:21.370Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=S12V%2BG1ozN88RZDz5b/6bfXw9h7bYBJXcP3RWMQMPloB/ughbzg3n9mHr4OVeNrmSaV7RJmSPbvB2vPeTNOg1nWDsgudoVbvcDlHMK3M5eRJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-005": [
    {
      "id": "doc-t-placsp-005-1",
      "name": "MRR 31 Resolucion 129 DGTDSP Aprobacion de  Gasto Inicio y Aprobacion Expte.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "f27a5075d8b68672eaa19cad8063e59e1b254770116ce4882beae213a410c076",
      "obtainedAt": "2026-10-02T14:49:31.036Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ssvW7z9u0U4i5EjZYKkvK7YwiPM0h%2BfXazYA9iSHLE9/CnNyp77QCQE51unaW%2Bo3q2KAVpbTvD2MlXAK%2B%2BbTrpDuBso7KEcwYgPo2gjSAQmCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-005-2",
      "name": "MRR 31 Memoria e Informe de necesidad con PPT Contrato especifico H1H3 ELECTRONICA DE RED SMDF.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "bd4eb0e9abfca9df44573389cf552d18bf46065896bd82705278593f765134f3",
      "obtainedAt": "2026-10-02T14:49:31.036Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=x0gd/2aOPMMdE6BdkPirPUtr8S/els5CiDAm6uKgXDwhIwQol6OQEBtUVNYW88FSVbUobEoo9KCSM%2BW4UVZzU/dAhHxe2UZckiQLpR68Sdb6CYyL7SIrUOBFfNf52ZqA"
    }
  ],
  "t-placsp-006": [
    {
      "id": "doc-t-placsp-006-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "2934ad9475d0c6eb2dfa93bb3e538f3bc5635d4d490113e499bbc75794db578f",
      "obtainedAt": "2026-10-02T13:49:17.751Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=pYrKr0/LOUnvHDm9pFoKBdIskcyEDXdneMrJpksKDGdUNhMZs2m97jihQqda3w/OC0/iIiE9s8pFhNN8jvGoPqS7sfvT/yLfpRp/KGFarDffdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-006-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "963efa07c544a612668ae290a0441cda2dc9aa81bd146a2269fcd051cc01a5b3",
      "obtainedAt": "2026-10-02T13:49:17.751Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GLirAHj5AeX%2B1UOw1Hzso7dQOYdBq9FHHI0XWnnxkh4aeCSBSBURiOjIVPdfx9IFWjA74kzqCN9jCyIovj0TUgYh/0eIQKXDiM4synsRzuAC1/zDIE0Kw/PWNnLS0Z0z"
    }
  ],
  "t-placsp-007": [
    {
      "id": "doc-t-placsp-007-1",
      "name": "20261002_Contrato_Pliego de clausulas_2280_2026_PCAP_ED11.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "ca00350cfc5cd464ebb23c9fbe34170a29b76c340f63fc92aa1a618e22acb74c",
      "obtainedAt": "2026-10-02T13:44:04.804Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=c0EzkLU/9ImgevbTCC22HQxW6N0DQ18Qdfs7K0FDxQBfNIRX7LLHL8KKjkGvM/ZAt3hGcq9ik50SgksmBd4kdjjrTJc2WofD9%2Br5xIjH7XwC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-007-2",
      "name": "2280_2026_PPT CCS Manto__ SAP ED15.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "bcc2ae41ba78fe8b0fd25e00b412e579d62f10663d1508272a7f595409abf529",
      "obtainedAt": "2026-10-02T13:44:04.804Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3wjHLsD7PnACNmRDn6nFiU1jsUZ5wRF7FMZL/c9BDrZnEk67zUJBzwM9ZdhQ%2BH5uvp2spwgQ36bsa56bxmmsjV3nz6VXdCtfleGHudMDjIYZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-007-3",
      "name": "ANEXO 3.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "be3b38ad5d9899e7b010c3623123e02913ef5c9547b1c4c55e87bf44358c368c",
      "obtainedAt": "2026-10-02T13:44:04.804Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ewnwbOYwCrmD4ZOYXJyK0hdTT9h9H9LxeppEceMxSwzAuNft%2BCA07SkVE/78cKcV5w0N4LRXIqOqcPE5nbHInkUiGcsJspmPvUohLfAe2amB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-007-4",
      "name": "ANEXO 2.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "472f0b96db3f922afe570dd0a6162abe8d7f767144ed0c16449bd1b8cd823ebc",
      "obtainedAt": "2026-10-02T13:44:04.804Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=37pUTsqzhJPtfLo4WOjc/uoPS%2BhL8Fy64DFpRtlROuDuX89ymp05wB9PAfVNyk6yWv3qq8DOmzeyux20G2KWsuiZ9y3a5WUnR7M4HQzvTYeCx2e6p7hqtlp2aFupgHMr"
    }
  ],
  "t-placsp-008": [
    {
      "id": "doc-t-placsp-008-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "68ddb3b703a6084ac64f5a8e119e046aa0e66b30958df104b6ad01d9ba2bd0d3",
      "obtainedAt": "2026-10-02T13:28:18.357Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CEpiLYhRMn%2Bpz4jHiEhalSoKKoTZQYB2uEBtCFFvbQ636xZjQB/Rw%2BxBkCarCoSQC3R6msAW2gTFpVK7UM8Yt6ApfPlYVkYoJvZNRBguXzSHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-008-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "05207b6b01a72aa7bd464ba9252ed3c5dc514042b818627880be2dd6ab1f36b7",
      "obtainedAt": "2026-10-02T13:28:18.357Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=VE18lrT9hYR%2B5i0sDxw6yLqX5uIEq2WujfVomS16m3H11m2M5LzpWNclxd%2Bnq26bcd/MQx6Ov8n9laG/ED/g0E7Es/4QqiXVQECpl03Hj8p45ClyWkoJ44mKM70IFcOu"
    }
  ],
  "t-placsp-009": [
    {
      "id": "doc-t-placsp-009-1",
      "name": "PCAP Administracion Electronica.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "88d32961247f583ac23280b9f4a209cc2069f07f6ffb3991782a6db2ce404053",
      "obtainedAt": "2026-10-02T13:20:41.757Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=L%2B3NicGS8LjWFZC%2BuUt55zx8UCRI1PCxg1JJx4vrmVgkVHAllQ17L7jN43ehdqlT25qtiLKtR32FiKQqor2Q/9/nad7AJuCmsbmJqIWNSRiB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-009-2",
      "name": "PPT Administracion Electronica.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "cfec431ca605a8dfd144781ed333ddffb6b52e0546151d893c5261050c085f6b",
      "obtainedAt": "2026-10-02T13:20:41.757Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=n91uf/6/cDcn0VtcKJUUyMH8pCE/E6%2BICUMC33M6/T2gKoWNTbGY2kZ9vXB%2BGKeWcwYsKDtHmX/ISS6CXVninw0i5CcF94YO8MJ4l7gDfFMC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-009-3",
      "name": "ANEXO I.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "694e226b2b0de2f3999a486efa6f31a5b1787b17d62973e6ece635d0afeabda2",
      "obtainedAt": "2026-10-02T13:20:41.757Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=JON50xQi%2B/GKq61oXfv/idxqVvl6DfDDDwdZAfwnKModS6jmeKECJMlFcuAvkztAlbdxJonp3xyWnLsQmDtxI3KfPbaCg2tnI%2BAeZQBKrPA//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-009-4",
      "name": "ANEXO V.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "3cc54fee5d338f22b59aa92b8a249aa4dacc0835a7d2e0e962b7cae587207122",
      "obtainedAt": "2026-10-02T13:20:41.757Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=aQrwLl7fYwnUaQtREc0Y0rQrEL0RrKw1FHMDH6tWxEXstHWbInEBlzt5aQMFtORfbCvsbtD0rdYNjA/wnsG8O3IkGgfQvWy5NCyaUktlK02B0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-009-5",
      "name": "ANEXO II.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "f7898380524ba83a239aaad6b8fc7509ef780e56297de6789316e79d475d1734",
      "obtainedAt": "2026-10-02T13:20:41.757Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=upDPj6F00qzlUU/LlhoXxUpjx5RNIJBl9W5mtv8/tgeaxzzXYU8d17dko5iHYsIwa8oYfBjmay5lP8/LEO54AGww1haGlYpWVr2SwIQ5uR0//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-009-6",
      "name": "ANEXO III.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "17a97beb879b5cbbf2c81fb8438bae9ffe54db748c04bbd1df8125aa7c7c20d8",
      "obtainedAt": "2026-10-02T13:20:41.757Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GJqsq6qt7y1ledXxRaiB1z3JTKf41hB9E9j/8nzwdFCOMRYh3A4NGNB4nMh1SO3igp6YbIRSoGjnYidFalWK0dAP7qqPDwMcXZ4A8FkhyO6Cx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-009-7",
      "name": "ANEXO IV.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "524a4e383384b28b10369bffc9caecc03db83aef2681785bcbfc50bbee403fdd",
      "obtainedAt": "2026-10-02T13:20:41.757Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=elbgiCfCHqJ2emC5VKZgJHz75gDJ8IW2NIKcRlEnNIhH4N3RtdUNyIq681bzPFcu%2BspsoLyNRLgM414ZPV2HcZJouurYVjfqTkUjj3/hYQz3GVhXrFFqN7yFncy7YfRK"
    }
  ],
  "t-placsp-010": [
    {
      "id": "doc-t-placsp-010-1",
      "name": "PCAP programa contabilidad.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "4e5673f7f87f93357a056b78a67fe96b816cf2ae16eed131f246e5c313488737",
      "obtainedAt": "2026-10-02T13:05:58.723Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=p6UL2xrwcONyjlk65lMFhlZvSzfBkiDwgs8UvakptxBFdux7ga1U2fYU%2Bg9Q3GK9G1JctSPVQPCKrNQYSzyg5YzY%2B6aa2SPDXzQM6WZdcG7VTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-010-2",
      "name": "PPT programa contabilidad.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "22fd04c073799f4feef923254fde300c82fe938d97bad4c8857da73b513163db",
      "obtainedAt": "2026-10-02T13:05:58.723Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CtItqoSLLP%2BM9jf7UDgcXskUkGvwrEVN4Z71mSgTh2dowm3/OdZDF/E/xjt1tBfiCYMgRyO7WETmByucFz5SZImcImHSvTDiCoTNQ5akv48C1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-010-3",
      "name": "Anexo I PCAP programa contabilidad.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6852aa4520de6683302887b205b936812b438f29872399723fd67b4a5d86920f",
      "obtainedAt": "2026-10-02T13:05:58.723Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=f2cD9b6puLRoj27nb1TCke2sClAQbqkuDQgmFqltfV9ZnsB/Eg35MesElN7Tm3ZO/KsIBdF2on%2BwdFRrwpeA3Atetrpsx9EZwR//qw3zGJrVTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-010-4",
      "name": "Anexo II  Modelo presentacion de oferta.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "e3e25a9e6f4ba3c212e9aca5b8c93e44ad1811bf41264109fa04707a0e08df3f",
      "obtainedAt": "2026-10-02T13:05:58.723Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=akjXLCKlffyOOp7hfEuJNWp%2BdlRm/QTOpEAy2pgCocvznPTxwtE5ys9/wxAXMQZ7WVIHJID6XGdRM7AH8gzdjCEKgxV9cEC8eWD4xkeXMMvDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-011": [
    {
      "id": "doc-t-placsp-011-1",
      "name": "PCAP firmado.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "8778e408ab488f5f695653c5d4bbf8215ffafd6d28d28bcab80a84590a753c7a",
      "obtainedAt": "2026-10-02T12:57:54.424Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=5n5QZwxMZkm6qS/PmYCTL/zcUbvPMfjxBtx9RuWStyE3AK5W1Y8nWEvx1FLCjQq36fKkmEUgG3fCjzU06JcYIh963Z1uDjBESZgrpXZagbJt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-011-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "23f3e2764f4928d28cb8e9d6187cb608a05459f0dbc616990695fab311ea6cfc",
      "obtainedAt": "2026-10-02T12:57:54.424Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=7o5nqgrGKD60SGDVMeqcljGW5vP28043N9yPpBF8NSmegifb60lmt3nduFfcpaLO0lipHCs22%2BtkChaIrrfB4z3YEVL8TkrE2IDuSBNwEEiB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-011-3",
      "name": "report_VISITA.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "248e76338890c9680c74f9e88e88418e30bd7150e54d083690a9a433fde9afd3",
      "obtainedAt": "2026-10-02T12:57:54.424Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=xjvABiDbHKqNT4smo4BGkDnWr9DnFzzv/d2z0yDOZgOHN/kl%2BKu%2BWU%2BTph8KsREgMI%2Bav8W%2B0Cyqak3PzHyteQhWhSz8KR2u7asU0hQMQ7x7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-011-4",
      "name": "Anexo 1 PCAP firmado.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "86895a765a819f522eab6f626384243ee6db5dbad0b1b26aa2cef767fdd983b3",
      "obtainedAt": "2026-10-02T12:57:54.424Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=vrGY0I0OdDv83PjrH3kvqadtCEPAtEcWse%2BtOoDwbdCxY%2B0GTfVXEiKKvW8U0kmsTYlICBib3fdpiOwHRPxD/rak7FAt3Axy/BKIvzNRgq6B0nvVKRzfe4rpHcnlPhSZ"
    }
  ],
  "t-placsp-012": [
    {
      "id": "doc-t-placsp-012-1",
      "name": "2536659-PliegodeClusulasAdmin-001001PCA_STD_CA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "34c7cad6fa031773c07ebc815a542af318320682e355db8cec18a56e157c7fd9",
      "obtainedAt": "2026-10-02T12:57:45.340Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=8GKCYjTMnhqyM/2lqTODzKKxQAS6XybrvTtYHjt//u2q6dBF7zGwR/f5xsj/k%2BdwPZXzOXqTxf2yZDtOOkzonURodG78IuDKH7hk0dwILchJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-012-2",
      "name": "2535198-PliegodePrescripcione-001001PPT_STD_CA.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "5f4de944c1008189dc2edf25ac283a1924475d730eacad3f2465595781ae91cc",
      "obtainedAt": "2026-10-02T12:57:45.340Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=L%2BVCEs%2B4RyDoobb1yT2E637kBYJBgcyl9nA1v2WyxC6m8XLvjgoeQuVBBnqLRBkW5lhbU9%2BaOaj7cEPYvRlK7/Vl%2BaeSq6dj4o9NdpCmQ9B45ClyWkoJ44mKM70IFcOu"
    }
  ],
  "t-placsp-013": [
    {
      "id": "doc-t-placsp-013-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "ea6b3a32dd6115a8dafc270161d5c8128539cdc6cbf39936b6c06e832940999b",
      "obtainedAt": "2026-10-02T12:54:27.969Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=L7XrJgJlZ9x46vobYuGORfAXYYeJL8qDSO1dcRfUa/eEa8Ap6o7kfPyZ3%2BTkXBVWHBm8xd2a8LCm1YEs7QbuwqBz9pyNIuKbrSz4LiR7qNWCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-013-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "d8d40a8bb1d4bc0bab9d090035e570fbbf9c81291398dc36398ddb7a6cc7855c",
      "obtainedAt": "2026-10-02T12:54:27.969Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=C1fIbJpju/yNsBj2yXHUmwNS9jQcNgPda99nfEhAchmcyh0hx0rF91gWT4Jl7YG0zlSkoUvKu0uJX2ht2ERNTlrtxz3phYbr4Qtn/s5mSH33GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-013-3",
      "name": "ANEXO I DECLARACION RESPONSABLE.odt",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "c7d6460ec580303eee60545fec17c6269a44d8a3ade86bfaf64545dc1861f84f",
      "obtainedAt": "2026-10-02T12:54:27.969Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=mqRkbHdDEsWqmqBKe5EQac7U/7riaN5Glaw4Qi3l6wAfw47aUz/%2B%2B2zKbPZOPttHcoDxmP%2Bd/ugPS5f1dLxu7xA9Z7afkc7qzXHU2jGOe1L6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-013-4",
      "name": "ANEXO VIII DECLARACION CONFIDENCIALIDAD.odt",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "945e738fe29f4a331300fa98e4e4034cb5337ef08e6dbe4fdf933036b79f248a",
      "obtainedAt": "2026-10-02T12:54:27.969Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ul55xYnUsyKmgoamhRplgizcerwBnWQCKHKx3TxhLnaBa2LjxOWBxIPD2bjBX/M/QQ7Q/sK%2BO/KrSkbKSiMbRo0AX1k6//D82o2e45SteCsZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-013-5",
      "name": "ANEXO V PROPOSICION ECONOMICA.odt",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "57f1d4434834a7f1c83e57882f1e72ec404ff05f4c57485a2b080d6e40a2ec44",
      "obtainedAt": "2026-10-02T12:54:27.969Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=jxqW7HAfaYT9IqQDJFWpnJtXO65fn/%2BHkvf8MXSN23V9wZVkBSPRfCYISDJOTc9/HF8HkqDwx1O3yjUut2mmR9aM1nyK9MA%2Bx2EHexg2dEmHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-013-6",
      "name": "ANEXO VII COMPROMISO ADSCRIPCION MEDIOS.odt",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "4d08d6d9acdb413832bb40b3be741d3be5d0d63f268eccdf1fb5b01e7014db08",
      "obtainedAt": "2026-10-02T12:54:27.969Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=1FD61jYkNNS6p7HJ1TGHQYK4YviiWw%2B9pPxAu0gj2Q0mrlABBJe6Zq5zk1fAW9hHO09c1Fj8rmKhN4fvc2107RwRn%2BkNkMT%2B7eKJqMPy9UqHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-014": [
    {
      "id": "doc-t-placsp-014-1",
      "name": "PCAP mixto suministros servicios.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "011c29d4066930054fb85e7ff129c543601c069a177e610f1cc1161cb74d7b0e",
      "obtainedAt": "2026-10-02T12:43:36.668Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=0jxcYpyRf/JKgRcNB7xOig7o3jRyAFy1iQ2TcfiBMiT3B4nNqaH5k8fBqtQdMtgqxaku/tdA9aHO/vtt5CnVpqJfAUKv90MxB3gcV9jippLDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-014-2",
      "name": "PPT equipamiento informatico 21.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "12e96d5969deb12a5668e72b55b8cd876c4337ecba523843ec290b1649789095",
      "obtainedAt": "2026-10-02T12:43:36.668Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=50Lu8eUdirgGyoEVPk4JhYwyh3cICr21Gik0sX6NQ6l8bZ2RBFN4Zme5a/ll6H7Yevfc8BhgdVZdDkil7ZQ98o7Zf3r5ZyLXYUeKVjHp6XVJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-014-3",
      "name": "Anexo II Modelo presentacion de ofertas suministro equipos informaticos.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "87837eccc8fe1a8e605662f589a9ba174345dde406c5aa663e8f73f88eb8a6c2",
      "obtainedAt": "2026-10-02T12:43:36.668Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=%2BER9qi0fXzMidwT7fsQh7l6FrC7tw6427Ab9SYvD/nJV3qIeBYywJ0l8Twf9xeq7LWX1UhodST0/kPaxPxBy9/oq3pzS%2BhbZ3htibPhgAlG1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-014-4",
      "name": "ANEXO I PCAP_mixto_suministro_servicios_simpificado_adquisicion_equipos informaticos_lotes.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "4d6a07916498661f03e6c6c6963c53c179bbb56d2ea87317bb1049baceeddd5c",
      "obtainedAt": "2026-10-02T12:43:36.668Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GdE4kwbnYg0C1oq1WuhAI925n9b%2BaPJqV8WQnD2jpS%2BCFLjO4oPC%2BOdC%2BwtQXMwefLQtPWUpk0ng5Y%2BMArp9%2Bg%2BhD0pU9cBMf%2B6YB5fiCT4ZyAJWGsSt0OzTSTyw9JAs"
    }
  ],
  "t-placsp-015": [
    {
      "id": "doc-t-placsp-015-1",
      "name": "PCAP rectificado.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "2ac1d99cda3264b1d46b68cfc7d2169f46300be2da2fc1fb33ec0126cfdffb22",
      "obtainedAt": "2026-10-02T12:41:30.911Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=p7cb286xu6cw5azjYhKZl/ortuNEhoQgThRN9TZ0DyI4I8q8is3YFc1uTLTR8H9OZSgFJWAKRqXXKd0d/3xDCU5p8oO5mBKINZ2uy6ONs5p7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-015-2",
      "name": "Pliego_de_Prescripciones_Tecnicas_rectificado.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "1064549979997c7b263fa4c94bbe6c1aa0b2af6636e2817d829d23f4849b7a13",
      "obtainedAt": "2026-10-02T12:41:30.911Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YuiStfGPWGjx27RiNo7AJhiI3eWtpIRk/d56WvLXupreoddddZXdV410yj3z%2BMKBuN3Cj6eh8VosW5I0UadRsHNodXIz5Quksc82kwO82Ug//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-016": [
    {
      "id": "doc-t-placsp-016-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "bc69f1bedaa7807aa31d071c0af8cdf1549d925200f2904042212850fa99d5fa",
      "obtainedAt": "2026-10-02T12:33:09.061Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=sM9WPUzcaVGZBchrLdiFImyB%2BmGiVRlK35qSbsjAMwKhzdHeZUidM90L2tXTF6d7kO1s/t7ykFq3sLcqyG7BHzbkiC/1/zo/Xq37HUL8oA7fdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-016-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "880abd6ada8fc3b73445de02bab5f9b45f383a1064da032341d2771f8c27b534",
      "obtainedAt": "2026-10-02T12:33:09.061Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=hHcsSLRz8qYcGDcgnwj67OrGMb0ejkiYYwrXkegh5nNctiv7Wz/Zh6n4VA3GCSYEJR0zSfrbokHAZGDWQpsEIZFXScLLUF8mWxoYN35cOsoC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-016-3",
      "name": "Anexo III.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "fd15175170e0f2644a722b9620d890727d2873d4e95d6ab568f72dfde10befa4",
      "obtainedAt": "2026-10-02T12:33:09.061Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=arGvEl1FhhFcArjW2ySW%2BtziO%2Bzp4ttYVmHgswof6frmzAXFdW4fj0MOBjJvxbNd7QTi85nDrmxePNFS8T46hrugznpmy28BZqB39Tcw/YyB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-016-4",
      "name": "Anexo II.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "9a6e03964f84d64a44007a4f21bba1e5ed8e03fff7c40a5aff903925c34a9b01",
      "obtainedAt": "2026-10-02T12:33:09.061Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YQfedFirC1Jxb2a3oEF6Pj/m84ThBVoyYK5TW5XE0zrVUIPIuCbDS1P8t9UksP3OjEcLDtQ7nNEyWEcJEFqM8cOv3wDmrSC38ACcC8lWl/X6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-016-5",
      "name": "Anexo IV.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "82ee046c463c54753523822c0adeeba56ff6a6ca3fe79150752607a5f3938cde",
      "obtainedAt": "2026-10-02T12:33:09.061Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=w8RjTZ0/Xv%2BQZWtZ1WtzWppemh5muoE%2B5oUAHJDCtS2qTWZo76wh3bRl%2BdmWr%2BrSVaObgdxhKIirHGGf1RG4EsEYrZBow3NGD%2BhaZ0S/fV36CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-016-6",
      "name": "Anexo V.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "46c1d780085b2802d084040dcc6ba0ebecdb058fca28d5b4adf149e4e933ecd8",
      "obtainedAt": "2026-10-02T12:33:09.061Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Y6ubI3H8qyy9DrtIpwpDyZhazhy0vVejSHuDhkHp0Ob3IKr4gyGs4Qg0AxZ3SXTRCX6pbpZjCA3tYet/xZeq%2BM/LiWHXFf2jGxs4xYkoCiSB0nvVKRzfe4rpHcnlPhSZ"
    }
  ],
  "t-placsp-017": [
    {
      "id": "doc-t-placsp-017-1",
      "name": "PLIEGOCONDGENERALES.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "a87f722264cf3a12c09d7e9de0d1b5b4df7d6da4aeede6aa66d4e6fa485e6294",
      "obtainedAt": "2026-10-02T12:32:03.808Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ffCUWh/BB05kqCcJ63fhpeQ5xSKHcWvjhAGlnJS368m3i3rHgNjVNqTxNjl8BlcCmHKjc/TLWxbhCoGYvRWrULgC4g34v6sKhI0eeX4SzrgZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-017-2",
      "name": "PLIEGOTECNICO.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "dec86984b7bc9ac67e17815e1b5c5a7b4a7530b26c2e792c375cf9d87ccfd493",
      "obtainedAt": "2026-10-02T12:32:03.808Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=OhwRSHGsfb6n/IS%2BvNuU6PWkTQ9OZzspiQYrTnYg36ycaaZHEGr28JOJJimAP9q0U1aeHZt6D6l/BR4qzG4B5y/5/8a9uPlsfVGEZ2/tyazfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-017-3",
      "name": "MEMORIA.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6c1380577e3d758efa44637533ff1e7cdf1fcb969a805e21802ae05619759d5a",
      "obtainedAt": "2026-10-02T12:32:03.808Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=tAJFY%2BGxDq/nsYJMEeeisX/3l8GjC5XKiVxSYOtvvxS3eWQw46nqPhITUpFDqLz5XJHY%2BIRCYta2BK5dg//luLkv2vFfm1kTL3imwpf5lJFJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-018": [
    {
      "id": "doc-t-placsp-018-1",
      "name": "SSCC PA 266 26 PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "c44f8de9c929d52551a928ed9544906e5d423465847d6e4d0eab89816f8b17d7",
      "obtainedAt": "2026-10-02T12:31:29.970Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=dKwKsoB07FH6kFtmQJPf%2BFpmTf49M3D5AlN5RSpZ/KftKMOIgVDedkD0QKbTaDosllMhNdb6KW%2BWjk5tZE6gFNTC8v3WcCOx1k9lwBiDxwm1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-018-2",
      "name": "SSCC PA 266 26 PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "f4103c3b3b053cd13476dc6b0fef3c8c3f756b2f7d3d8f8c1b85bf0b03d83c42",
      "obtainedAt": "2026-10-02T12:31:29.970Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=P68Yp5SDrFn9VumTLWj3Aak5T9SSFMu7t8rhKpnAot7Q4ptJE%2BWthUMyucaQ/Ukoekhsz5C/r/773S76RhCpWK2PTOPoGSPq32rS/spcwXVJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-019": [
    {
      "id": "doc-t-placsp-019-1",
      "name": "PCA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "598e688b4096faba055371f20d440ce5406c48c37a8509b2b7a88f2c9b84d35c",
      "obtainedAt": "2026-10-02T12:30:54.765Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YQfedFirC1Jxb2a3oEF6Ps848DY9SVcuCVKNcgXoKQH%2BXVBSpcG3RLgHzAj84gHigjTGlmmjc3ZAlEx18V23PGAxFIh8K/wXRLaFQ9rAr1sC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-019-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "208c132f428588a47f7adcf3e435db0fd99135288b6f35075a911ffc8afc90fd",
      "obtainedAt": "2026-10-02T12:30:54.765Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=xdDC9/MoVICEEdCuhYl3oDgU/FwNF0Fowe%2BvU10tUP0yh1v/HtoHqwHVRaCl6%2B6w5U88VI3FZecwfTF7EKJVq2o537U7qnKJHNDaM3aWNlQC1/zDIE0Kw/PWNnLS0Z0z"
    }
  ],
  "t-placsp-020": [
    {
      "id": "doc-t-placsp-020-1",
      "name": "PCAP CSV.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "a296dbe6efcdb7a3f512c4cc5544ef0d9bf7c0fc13297fc04921865e0e9d199c",
      "obtainedAt": "2026-10-02T12:29:44.059Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=cAsaGMbTUfKh3wW1kVbOfRNscVCX8zAkS1ha3OJNGLGwt9qpwdZzicUpZ%2Biis1MmbffO9TEh5XB7IwKsay6W8Mf6S2cC1QQHwwW6A2n0t54//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-020-2",
      "name": "Pliego Prescripciones Tecnicas.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "0638f2bbae52cf29e80f317c0d636e1f57abe5a140c555a6a4d170f3fa6aaf3b",
      "obtainedAt": "2026-10-02T12:29:44.059Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=N1cCJie6JdNIhn7fw4GdLHApaOjb3id4FIHkcbPoJ%2BNeU63L7YRPkVYjMup1nAlCuWeWf2nsRMfJ0yVlY6V02clL5167e/cm94NSV7sZqI%2B1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-020-3",
      "name": "Justificacion necesidad CSV.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "a77dd49c2e1d18fc6f79b5cff381b643dba30f1cf9ea29ae416da24af4ec1474",
      "obtainedAt": "2026-10-02T12:29:44.059Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=1DPZQXMqFH9vCOr7dgPxvySxzom/Pgi%2BW1kYlBjDKgaHYIu/GaVeptAb37DilCoCLq6bZ9L7m%2B5rEA3rKDXyMph8bz90aPi97gK0UhBjc5IC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-020-4",
      "name": "Certificado existencia credito CSV.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d8a4732508a39959f52a1704b825777c2f0dc9b4f024e57b3584f04acafe8bc8",
      "obtainedAt": "2026-10-02T12:29:44.059Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=8ho2Ukba2F0b/zfG0oeaGtHnrjxqa%2BDeD0dWvQqtOcrhgVwpTzLptRuTgCjk668P%2BWbYav9Db1V%2BLvjoxQJPHleD4k46UW%2Bo7ffd5ejDaFEC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-020-5",
      "name": "Resolucion inicio CSV.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "2f4e6345ec181600e040217aa895ddf76601e59f644161e42c893557aa5ed6c3",
      "obtainedAt": "2026-10-02T12:29:44.059Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=jJBAxgWElkv4ddRlVCiuraj5%2BHo87ZFbJzLh%2B/6bXPaBKibMHJEYvNjxYzx7pApQIQ/lGbv27sKrLnvbuDchPU0du8L7M9fMp1gynlnNkZ57QB3HKyQaFUExmUVQCerk"
    }
  ],
  "t-placsp-021": [
    {
      "id": "doc-t-placsp-021-1",
      "name": "03 PCAP_1009425E.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "d319af83dde7ee7cdb475f616f4fc36e84d967933ccd51dfcefba03127a9c9cb",
      "obtainedAt": "2026-10-02T12:27:20.526Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=EZlMFkO2shE9EaY6xqNT5eBiuya1pYbWqDcXrmxxv4%2BoXDRjt7IKG3Br1Ph1x5L6q9GrsL6QYp%2B9RhTygBr5939Pb4fwIKGUnCnq%2BfQlUt17QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-021-2",
      "name": "01 PPT_1009425E.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "26015d31550c4a4d8b6370dfbad1c3c329c0a27663811a853c04c54918f206a7",
      "obtainedAt": "2026-10-02T12:27:20.526Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=LJ13Ga5khgjYvowFQJ6MkgJblc0SQALdCFOXkWbH66tRbKuJMukpds4lljYZUmmaDG%2BzGDUfGXmdJdwBgSIqGusulr7QyUZcpRePN2S0LthJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-022": [
    {
      "id": "doc-t-placsp-022-1",
      "name": "Pliego de condiciones particulares.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "3d627328165ba77bdc85476faa44cb720423afdff6538cfe1bc6e2bc4b815ab2",
      "obtainedAt": "2026-10-02T12:26:45.920Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=nOHw%2BH4TIWkA510qV208eLIDuDF0izikjNa6yErk5d1aRs4SBI6UzCN9/wL/gKWQ7G19O1feRQOdGdJPbtXG5EiQ64bD8e/iwvpXTwdwBd8//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-022-2",
      "name": "Pliego de prescripciones tecnicas.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "dda1cbc572bd32a9e2b4b2e0e6270de772f413e33bc814a55373c1ad827a76cb",
      "obtainedAt": "2026-10-02T12:26:45.920Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=tKGHLQmn938ye0RSB9SmYf4xsQqmGKtToyLnfiCC9nIVaYp6H/phT0UfSxVoYpTy2Wbct5UABOaZJ2LlpEHGn4XN61JGG8LSjXearMCVO4PVTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-022-3",
      "name": "Formularios PCAP.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "861689ba8a13ff16d4e882df4c97cfb1b4b708a265a7e867d45448fb4965ba8c",
      "obtainedAt": "2026-10-02T12:26:45.920Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=QvJVxZNfl6FlKa6iNbifhMpx0DYcz8aYCaTE9UM2u00/OiSguoZvhY89gS02s66UyVr8VoQH/5s7GBHy/Ayb3XlHtbpUpXqfhYzrdTN43iT3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-022-4",
      "name": "Memoria economica.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "9d0d653688b1131b20abef48aaf756c32f4994e722d84733afa277d2f282d38b",
      "obtainedAt": "2026-10-02T12:26:45.920Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CyZJtrXu1V/dcAdThCTpGyMMB%2BqAO8HIXo/PsPHptIsT/Eeq7gmFjp4nNoiSS1k2HFMnti7A/sjZEYT9kUiKD5voXogRgCYZJYcWOFHddMa1aXEvq3KHa/AEHgtDrQw0"
    }
  ],
  "t-placsp-023": [
    {
      "id": "doc-t-placsp-023-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "8b7629c7ed1892dbf1beec2ddd08dfae0e01c9379752e75bbb784a805089a6ac",
      "obtainedAt": "2026-10-02T12:24:31.339Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=xrrwR4puClFufiZm%2BfwrcPKmKJDmvRI2OEz/YpUp04cWNCBMF6VK41r2hPLLx%2BYus/1E7H9uSjRTtkxCuYxNHMcrPRLwDSsFbK/0ET9Jozpt/o8fNevwsujgRzaBbugn&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-023-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "645edb76b3b30ea5e3b27a9c46ec85732b9a9a389a41def48b55535eb3da9b5d",
      "obtainedAt": "2026-10-02T12:24:31.339Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=jCuZOyoQ7KU4C4wj7KBhZSbzP0wD0ypRnaMvPsErZw4awo77dqppbvW%2BRf49k//oJ%2Bp3Rb476Ct3dChv32v/fZ/EAH9THhD2jLR6mMIqdWvVTD3T98KC0nSgQFM0q%2B5s&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-023-3",
      "name": "DEUC.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6440f5e0eb613ad0f150ba85606d1e0c6b7b2cd73d5c2bf4b233705da7fe9be4",
      "obtainedAt": "2026-10-02T12:24:31.339Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=h7IrHeya3psLIHp9iYRRogWnlWKYyg1GmM4R5JE4fl%2BcYWUGgP/9x9gWl3mg9xjrCBAhXpK2T/p4Tff5hlbPNScFlobdLC/5chPAOcPUV9UZyAJWGsSt0OzTSTyw9JAs&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-023-4",
      "name": "Documento adhesion contratacion conjunta.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "85923855b4a72fed03c4699cedd5108664cb59247b67c1aa6e570db263efd920",
      "obtainedAt": "2026-10-02T12:24:31.339Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=tUbbewK1/lZL6LCVlWxys06TqjHcGFN4XHstp/hsUAItTGRVMs4Ee28vUfvt8LV39uE/%2BBAK3HBF5HrhQESf7zACZZ91dDzJIL%2BTWmgfSeffdyQgZAdTm3EfcUAC7CJ6&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-023-5",
      "name": "Precios unitarios.xlsx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5fcf258f8bb4d0259cf80209968e8cf37eb448fb3e52ef8a3f9f34d8347908f3",
      "obtainedAt": "2026-10-02T12:24:31.339Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=/GZoY9TeMY8x2iHTdXQReysI6SjQB7WZ0wyhIPt46wqiRbEKcVffTFxCJ%2BsWEC6at/pvoq2%2BAORSgsQaIgmJi8CWvTK39TEaAzbwebuUu6v6CYyL7SIrUOBFfNf52ZqA&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    }
  ],
  "t-placsp-024": [
    {
      "id": "doc-t-placsp-024-1",
      "name": "PCAP CONTRATO DE SUMINISTRO DE RED DE CARTELERIA DIGITAL.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "c8840c4e4accc1c996524bfb1785e5903d55a95a3be9985fa149b5385815141e",
      "obtainedAt": "2026-10-02T12:22:15.775Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=1dDCRTGsKuXVgPsYzH7NKqqcbxuFe85c4xSfXn%2BfWEhwqiIk8/vZDupikL%2BxxGjWwWI6huzUq4Q9a46o7ynJfRGYUcDrW4ALqZnvxPu%2Bdz73GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-024-2",
      "name": "PPT ADQUISICION DE DOS PANTALLAS DIGITALES.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9de5c5e851466bf665e74525e16ffe026ee8627b75ae0a806a26d07d1d9c08bb",
      "obtainedAt": "2026-10-02T12:22:15.775Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=bBqmNC8P96PZ/ivTj9Lk0d89HX4qs63c7i%2BdkR5eS63oa/uvwmz4oPXXPVayZlJpESvUzBVpF96BTGDgbfPc5ZXEtC3o7D%2BDoOi8w3B4NsrDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-024-3",
      "name": "ANEXOS CONTRATO DE SUMINISTRO.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8e157022cdd79b28340f622d3a6fd509a00b870e576541ab8c6bf08eda3a6adc",
      "obtainedAt": "2026-10-02T12:22:15.775Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Qet7PKFosgEfSxW4C6rqMZsA/syUjSd82aXi4t9iZzmtdsdQHayN/k7cHNWDEHvCUuKqcBP2/u%2Bw84CttizV2uQv06phRWDXVuXQRkgJ4vH6CYyL7SIrUOBFfNf52ZqA"
    }
  ],
  "t-placsp-025": [
    {
      "id": "doc-t-placsp-025-1",
      "name": "PCAP MICROSOFT.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "e77933eaa16ecf735df90fe6620dda661af652c2c7e3baa00df2fe41418c9cc2",
      "obtainedAt": "2026-10-02T12:18:26.179Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=OEl6zsLCuD5G74kwCICs/vpo489CMBB9Vb7DfteWwIifM1b/ajHl%2Brt2/IhgcXiBl1PPaO1PqNErcgq4P0C09EkA7jBaKgHUyJfbcMFuLUKCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-025-2",
      "name": "PPT nuevo licencias microsoft.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9ab7e14e8306391aaa240fb317c0fc29c6187e4e79b816c3c73ff3d745a317d4",
      "obtainedAt": "2026-10-02T12:18:26.179Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=DnG9xlKNCOQsk95eptD0hEt0O4J3JyR84WiHduZtXqJdhsi/LeNdCHM86xkXiexhDvIoeJGCTzGuQrR40KIAEkAVOk8N%2Bb55xlE3JvTFf4MZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-025-3",
      "name": "7 DILIGENCIA Compras Microsoft.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "60fa22349876497f59f3885140aacc67846fc77916f96ba70c993886f4bdb90a",
      "obtainedAt": "2026-10-02T12:18:26.179Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=a%2BtDnjr4%2BKbGFjVX/j%2B4G0WOkVgbtAJsJ92/CnPj7Fmp97AWA/iTLBcrjaAhYVlp2dMia2sHaFOhZyFVuYmfWdhnGGO25yuAbhIXLKKbQldJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-025-4",
      "name": "ANEXOS MICROSOFT.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6f223f9b9699cb596e3a11d9226fc793ed9528e88cbe7d2d31b499e35e27807d",
      "obtainedAt": "2026-10-02T12:18:26.179Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=tg4YL/xZM2zdCii/a9/vZf/%2BbScWxTKh8NYTFCv7ZaO1wAiobsZyf88C6yALfnHONEdWNm6bJvWi4X/7/Jlzwzfb5ruV8wX%2BIR7HPW9P1l21aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-025-5",
      "name": "CUADRO CARACTERISTICAS TECNICAS LICENCIAS MICROSOFT.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "1d72b55ce01d00d7d61fc742a8bf97caf74fc68fe2d209a035682dc37d1f9e29",
      "obtainedAt": "2026-10-02T12:18:26.179Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=JMkief3RMyLTWuGT6pzSo9oyRgsL4apIA9iwod5F3HB0hHj/ZvFs6j7eH%2Bsl%2BhGWnp%2BtfKcYrhf1HN3UyPRLHmgKwPSH0rdZWnG7mBiMyVnDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-025-6",
      "name": "informe necesidad MICROSOFT.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "43547df9b58d8063e1bd8f45db7392205cc75f820cf2625dbf7f20217dd7cf4c",
      "obtainedAt": "2026-10-02T12:18:26.179Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=EL/5G8pnVI0IebxRAA7lqYNwyrmL/G/lqYMHJuX7AxHXXV0ck2Zr0IGUjz9G2JndoVfy7yAME6MnKejg7xvnldTynOHi0IusMWyhdlmWVBFJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-026": [
    {
      "id": "doc-t-placsp-026-1",
      "name": "Diligenciado Pliego Administrativo Definitivo.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "7bb69c8c399cf5d9e01bc23c4c4cc71c33529f63a75f4ffa6f5e3828ad8e02e8",
      "obtainedAt": "2026-10-02T12:18:07.796Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=JXoMnjrf%2BEbLmnMxx2vTv2vPcBDWJPd58HSTVpQ6PzAQiM%2BcwC8jVkK/MLacWJnYOmNH584Xbmot7lN2ZxnW1t/iEOmPyFW4QkdnDXqabJkC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-026-2",
      "name": "Pliego GESTION RRHH.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "22fc872ea1331348c765c70c198fb53af47bca87e47405c815b624a0d170c79c",
      "obtainedAt": "2026-10-02T12:18:07.796Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=d5kHZj%2BnX24syefJ6zvACZxfIyxqr/8eEE3qkLi2DqdEY5J8adZ6q9/V9DyvSDIynzGA1taArIGLtTEoQ%2BDQ3rm6bpLsCPFSMJZxLao230gZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-026-3",
      "name": "4-1 Modelo Declaracion Responsable corregido.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0cde5e9e6507124c66b3a337689b19a6adb5c63ee760a5a4967ca1870eaa9540",
      "obtainedAt": "2026-10-02T12:18:07.796Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=dJhK8i7KqSo%2BfX3u546EcByef2m13NzGO0Vttmkh6cLcIl1Gmy7PvnAUbZPo8ExVkPGxQMbhiTwGKOteBdiFvmiTeCN0x9OrmYDJg64XZHFJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-027": [
    {
      "id": "doc-t-placsp-027-1",
      "name": "PCAP 85 pa su 26 sum Hardware.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "89284cc335eb72bda3044604e7ebd602e28c8186cd492633d91023161e284fa6",
      "obtainedAt": "2026-10-02T12:15:53.737Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=PPjn4OXKLz5gYcVRpNaZXGrH8ODWNIObFab/uaFRpPlqcdWKTfDEk8hFZd1Ui%2BJLRXh07f/N30jrLM7yboWyNQb2xMD3/7R4L9v9NUIdD%2B2HAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-027-2",
      "name": "PPT Suministro 5 equipos para IA.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "977b3b0d2c1d71cfc2b20155105eaefce4063ce6984b86fbd7eb8fe90bc1c2f1",
      "obtainedAt": "2026-10-02T12:15:53.737Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=veRubTMpnQvXy5MwFWcKpwQG38LXCp%2B3fqX98FPmWwo7HVAvDc2otUQFAHGEMwun9siyarYgoaF2HIUCwFB4DTwT0KsoGTjRcre6lNlGeF7DdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-027-3",
      "name": "ANEXO I CRITERIOS DE ADJUDICACION.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8474f93400c43b209c539ef01f37079fdc321570e14c73f118e6cb711b6c2011",
      "obtainedAt": "2026-10-02T12:15:53.737Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=0JOWeIB07tSw5nhnTOKfkHOvRymYodEHCf%2Bb%2BFBAuXdvw/WuyjGQLzRbWBkBjV3s3aRtn4/x/S4Bkkb7jec9lN5lMa6eEqAjgscVMSxcmAVt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-027-4",
      "name": "ANEXO III MODELO DECLARACION COMPLEMENTARIA 85 pa su 26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "ca19d7961260733efa2021ddf93c946e407bcaf4e29ae041056e511bde39e981",
      "obtainedAt": "2026-10-02T12:15:53.737Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=7MP9c2AJkOpRG5ZDazvnPvAIf4%2BDqgv/6M5CKM9b0j0BM9vfVioVWpO%2BlLwolmegx2bVZurfSECZm//ZUk3PbOSR9Ibs9c2qGPJ/Bx7r0sMC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-027-5",
      "name": "ANEXO II Modelo de oferta 85 pa su 26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "729efe3a984ce8f18cae7046bd683f427a785731d58e943087711ff3473ba631",
      "obtainedAt": "2026-10-02T12:15:53.737Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=DoUgR6SX4ym0rSFStrvKPZXmkcCtbz5QinwOkEpcdPqSocPjzMxLqmTypfuJ26Ld80d6Oy5isM6I1dZuKBH2CygOdN4fqXO6ExYplkBx0JP6CYyL7SIrUOBFfNf52ZqA"
    }
  ],
  "t-placsp-028": [
    {
      "id": "doc-t-placsp-028-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T12:14:58.232Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=VQOg6NvQzspf/fN7LugnxqhGrt%2BUO8S1oMqudOdfFdwItYWmkL39qqMsCYlstGPxgS7zl9LLNm2QxcVepxm6m1oOuEwTIS2fhHm1wi0aSQBt/o8fNevwsujgRzaBbugn&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-028-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T12:14:58.232Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=PU/dgFrO9LfjYLqzB32kJlwP0NXl6Lwwa1CV3cwALrL5C1OAl3MnVj39lXH8l0g2Q0WPEtKwMYWuIAFwWRfAaQboUUEpPktrce4g8uqxGz17QB3HKyQaFUExmUVQCerk&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-028-3",
      "name": "DEUC.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T12:14:58.232Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=0P5tumDDd5bsRmmvr/dSjUn5JPJawIsqR1Q7s/udAyrFKw5U68IlN0%2BTTE7fSTSDIGjtWx1YyGXMYV6Bs0/Txo/%2BrvAEntBjEvE9wGlSpJQC1/zDIE0Kw/PWNnLS0Z0z&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    }
  ],
  "t-placsp-029": [
    {
      "id": "doc-t-placsp-029-1",
      "name": "PCP 2026 03993.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "39c71daaccfc236b39cb137fff01804767f09b85b09ee082a90a8a40448f5a5e",
      "obtainedAt": "2026-10-02T12:14:54.566Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=nai19CG5duTC4ScC9/kl9ejX2J3nf1Nb287sIty1FNP5KRKcka78lg17WwUTXqQo7vuEECPR37dS6LvtFMfwl2vvPMbYmTWUPLkDZ0cZa08//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-029-2",
      "name": "ANEXO I 2026 03393 .pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "eb564a3589a26fb102fa527deeb72a33b329c2515e1941bc686d9ae0f8feaf92",
      "obtainedAt": "2026-10-02T12:14:54.566Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=oVauhuS5pTvq9ongS6yhV0S%2BHjYYter5kwBKnlCxvV%2BibqK%2BUZYm2OfZ3MlNCdw6XiozhMb1uj72vjd%2Bls3za/cZKp%2BBSnQ35aFnEpvGUYH3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-029-3",
      "name": "ANEXO III 2026 03993.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "566ad945e9e96a4a43d6141765e7088afe02fb85911476eabf23b7da443d442f",
      "obtainedAt": "2026-10-02T12:14:54.566Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=DJvSaVB55bTV7Mmc5NCys/npjZLVcj09B3ib0fON0DkZO9M%2BGfeJvdg8IwEBfb4fQLxtVzOjE%2BhRJkjhJD1DtfFPQOJp3X7NmPLWNH2%2BYiJ7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-029-4",
      "name": "ANEXO II 2026 03993.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "92857894ea4c441edf9508385fb6e1f4b5d0ba7a2f5d9e8978987b1a4ceb1920",
      "obtainedAt": "2026-10-02T12:14:54.566Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=JhawvpfkCWU2N4hMgR2ZlLVfq/NKiJwuzTEwrHFXSR4OwPN3xwO7OtUXs8cQrvw6zjVht2hmxqTfEzmT4Q/NhwieHv/fXmtBf4fmved4u8kC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-029-5",
      "name": "ANEXO IV 2026 03993.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "3a9de49c157a1f3773b715680ef8ee93e68c6a3266e62b126593b57eef942a42",
      "obtainedAt": "2026-10-02T12:14:54.566Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=BZ3OTIVJn%2Bj%2BT06%2BonnJYh%2BsEo47a0vzlQD6EdMgZLjnu/JdhNZyXKS6UnMRbgS%2BP6%2BLW7lfMk/dhNK6pSPvn4pAjzJo8WjjVJO9zH9I1oht/o8fNevwsujgRzaBbugn"
    }
  ],
  "t-placsp-030": [
    {
      "id": "doc-t-placsp-030-1",
      "name": "Diligenciado Pliego Administrativo Definitivo.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "6d28ea0b41826176baadc3b05286f73f619954751845252e7127276a60345004",
      "obtainedAt": "2026-10-02T12:14:26.833Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=I8gVnTtRvZANqT7HXUQB4R0MJu2ZLax90ID5OfX5ZTWDUuHr/RJ%2BT0tOVEZpEyxdgaA/PX39SZYZuX%2BA76q0UUJin%2BOiu1mKW6RW%2Bah9OsL6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-030-2",
      "name": "Pliego de Prescripciones Tecnicas Particulares.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "3176d1ccf331bd5e3cc774b5fe5046dd2251767c5456514e73741fbaf74b2d85",
      "obtainedAt": "2026-10-02T12:14:26.833Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=gbDvrXeyAywq9VY3bvkQA%2B1MDwsN9HTRL/Kl1YfF0n2MzlM%2B9OGxomMagpI7nMpukviy9h55FqqEz/KoUpnK8l95xiocQjROnm/N64eLk0Nt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-030-3",
      "name": "Modelo Declaracion Responsable.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "c6c65fac07b9f445590c4f93d35beb5085f5c3628d51a47ead2ba3674dd38891",
      "obtainedAt": "2026-10-02T12:14:26.833Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=1GAfeaht5EqkxbdCni5WJFEqyR4LRN4hQxqQYtweCrpVMaqIfcRecXhaOv7COH/Aj59pjM24LJQHQXY/4wqgRPyV4yzl4CWFMwogh0Q3eaKB0nvVKRzfe4rpHcnlPhSZ"
    }
  ],
  "t-placsp-031": [
    {
      "id": "doc-t-placsp-031-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "26f205a115442ff087683e367d9b2daaf003bea987e533a7b0fb1c7a9ca64253",
      "obtainedAt": "2026-10-02T12:11:09.193Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3G3vQoC%2BSko6j12vE62hLyUVwsLbVXu2FchnJhjlSg4lWv9ib4lU1tON1TQxA8QhibTnajBDHrONN6llIcm7ZwJGLlmlNNLOWmwOB1mJdWLfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-031-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "3eed77de1658b4837eb9a322bfc2bf2e06fe0375f8199b37fba0dcac388802ff",
      "obtainedAt": "2026-10-02T12:11:09.193Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=05qoQOblBl3%2Bj%2BsJRohXADAQEXFHtctEOUpXZyeWM3t/JeS0OQHb6oWN5UgOuiXubA8GzteeF7CYnSI85qe5UzRQTFGUCNjO4BoaUoCehSRt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-031-3",
      "name": "DEC RESP REQ PREV.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "9640a0049868abdc3aaa841849ad5a1cc277d95c7ab9d46598b6371a45a5b348",
      "obtainedAt": "2026-10-02T12:11:09.193Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=fz16SdZtYh43KVnbAUgVs%2BOaIKuvlwvNC9mcRmVVxjdDGRNHxFOdzPhZ3LpbrBvk60DrYgpxrQwmEY0%2B/M0XHH4Xk9ujEK6cF40bzxyaoS%2BCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-031-4",
      "name": "DOCS EDITABLES.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "b9ca9c06498c710d5b17cf7e716b4c6d1126d52907a73441236f9e35c755a867",
      "obtainedAt": "2026-10-02T12:11:09.193Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=BrHP1pT7CNVIOlg2zeTG7hHXdP5/zuJTKUho37vR9Fy%2BP9JCsrQs42jiMcD94mgkWrrzgks8Lju0WzzxqIAAt29/elTFM2r5tSuPIrQ44uH6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-031-5",
      "name": "MOD PROP EC.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "1208b98553a62e20cc75f3578d67deb32173e46b32a0c7fdc21f9f5990e3e5ed",
      "obtainedAt": "2026-10-02T12:11:09.193Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Wj3bHWs80571JXIKfFCeYkf5hUXF%2B2quaL1Y2Pdmymoi8u8Rep0fwwNP4Xu3puYK49Rr%2BWVhk4dNvAmOJh1JPu3DjkCoOY2RzNogQJNAdxaCx2e6p7hqtlp2aFupgHMr"
    }
  ],
  "t-placsp-032": [
    {
      "id": "doc-t-placsp-032-1",
      "name": "PCAP 55 26 .pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "d0ede011bbe3b09692a9a418cbde7174013ebb3fe6cfd9063209da346ec086c2",
      "obtainedAt": "2026-10-02T12:08:36.508Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=PH8ZJgKb4f5k8FzaHmghI3jYTev3hHviMaadPPgUE3KshaAETkmkRITLV5afBqVCr77z3uWYJgMmj25bjWDvYofsD8yt6f7TzgCTvjiYJaF7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-032-2",
      "name": "PPT_licencias_m365_chatGPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "6d1ffa200cdfeb4e97ba5474ce14c5f899915cdeff961c297af486914e6ba512",
      "obtainedAt": "2026-10-02T12:08:36.508Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=7gW9TzHB0DAx58oJhfLu%2BVYDqdHt%2BiRd21zhd%2BRxucMkLVYcUGDW5CvH%2ByCPkrvVTh5ww9ako5HzDLrWImyHkR6c6X1r7iVHoLq3VeHtwwnVTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-032-3",
      "name": "DEUC_ 55 26 RTPA.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "63305aa43d5957881610f9091dd2c84ec8d69635b817062dc44de5045847cb7c",
      "obtainedAt": "2026-10-02T12:08:36.508Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=tg4YL/xZM2zdCii/a9/vZVDGzAmK8Gi3pvIiZO28QmHDVV5QyDoQwU7pFnraYvEKlzk4qaBP0Xn1XZf1qGeUgUvq%2B4VEE0ZYnv7gMI7lcyPDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-032-4",
      "name": "ANEXOS 55 26.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8621b627d47a64eab55f5023480b9869a922334bfe090d774c2d13afe8fa7dd9",
      "obtainedAt": "2026-10-02T12:08:36.508Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=cIQD%2Bthz4rX6ZECyWw/eS19WohWzLJC1rFlPQgrR4MgZOfGnjOQ9qyDL0/opnntY862jDN6B0UtzuBvDjFrE9sD0RlqD1Z87EutLJ9pfTCHVTD3T98KC0nSgQFM0q%2B5s"
    }
  ],
  "t-placsp-033": [
    {
      "id": "doc-t-placsp-033-1",
      "name": "10 PCAP cronos 26 040 f.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "cf8d6f6ee0e499a5be9b19d6734c81241f0958a00e7a7dbea3e219418ce6166b",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=v1YUNz0IHWlmcI/uqBPWIBNGmm%2ByW1qHY0MJKFidXkmohitG1yYO3DI57Lg0ESMB0bhZOFqLKj8e0L7xXtgYNh5Oq3wlXCh2l3LA7mPRxXRJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-033-2",
      "name": "04 PPT 26 040 v1.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "0941d3ecaef40f366e45ff406d0dfdca3ea2b921f8db7223b2db1091e415c840",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=VLBh22o%2BXxejgeXsPpGbtjE43zT8L65F1u29LNrex3el9cx70LneCOfRq8x717zMyPMK%2BEaEpb0IkjAHmsjdcGURJf33M0Y0g/jURjxHi1x7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-033-3",
      "name": "Anexo IV oferta  WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "c765242d16ce5d8e2b7a7e9df48008f35a387a46348d4509cd9be3a2a8d63053",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=yh3yDuIAniutON0tvfKI459cZlEz7yN40EKPBqY58n8nVetSPkvcumMX5t5UnxoFhNuUm12knA3EtQtR5wkNZWwhPQWSFcuHV0IsWyKb/ajfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-033-4",
      "name": "Anexo V1 PDatos WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "367d12931e18677bedecdf60b7283e31d66978d3691560c1710f272ae83d20a4",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=bas8uFS8sjJahylp7qdzcg9yuIWFYKW/rc9QD9T%2BL3djULsc4apSnMGaLqwhd5fp49v9E9aMmpv2t2zTQGEIZIFxJkyXX3%2BjEf3HGrJ6EXf6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-033-5",
      "name": "Anexo VI DHumanos WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "f22dce5ab707c992a668740b35003ca5c49e3f78724de2fa409ef4b624308265",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=IN0MyhR0fIV91Yj49ZJICSOWnGQ3TvCuPMlCs%2BtB3rLjJrgGEdjyrQNvHaEjYujXrhnlF6qsDcZNW24IJFyIyv9UXUwHAyaFfyNJq3UVJ%2Bx7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-033-6",
      "name": "Anexo I DResponsb WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "70692764038da105150ff3672b86d1104ca84131454385cdd88008f9b297f7e2",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Bm1bESbxpxhGe7BPVUg1/HCNAF9Bl6gl62rcGeEgw0ryfaFCRkblnzNaEIPn679QVrPhIzqL3fhj5Q0jVIJHwBM1ycgb2GZZI2CXrWXYAW%2BB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-033-7",
      "name": "Anexo V3 PD formalizc WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5bff5dccee06b6589d6f05d825e9ea4f12a1b3ac4fcb3a5865f609b680956721",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=U0X6G8IdgvjUHEMOfb7yXsTEEoRKSNY9AZxJTjartC7LsLTK8t6Ne484l8hYbDqE4DENW1YmIE9hrNLZCFeIdUgof5Sfsa6tCsq%2BKetUF4Q//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-033-8",
      "name": "Anexo III inf confidc  WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0f09be7eeea74fb37c18d727a1d421d4ce6cea5c69ceea98a83d26d6b7b58494",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=5ApbKK43YCuwWU5gM1Mk/qinP6VjwTe%2BYCBM/FwsHBNjoVyopGUM2NDz4QzlzHsh9hLVh4/nG5YISP7gHOqXnY8%2BYA5LRgWUCh6U/ftGfu97QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-033-9",
      "name": "Anexo II integ solv  WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "7bec3a5be401422432f3934f276d6c903634baa6f33fe61c86aa10b0f657ca39",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=V7TjXWXpg1T8aJUKuon0dlyjGdMRh82mKP8buYUvTMZfQdpmer/G%2BEKu5eYB5Hz9TKvGRvQrwz531LSXw8gCax1L7tgzziuIc7pFge3vznLfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-033-10",
      "name": "Anexo V2 PD WCRONOS 26 040.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "a699fb6e95805b58064b93731a8d96b9808f80c450a1b198a9b57bde2f62ac18",
      "obtainedAt": "2026-10-02T12:06:29.932Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=WCZwaiARcT8bo1VIIvV9s3D6PTXWyjslvbmcSf7EzWbqcXFXKc5cpWfRnhnf5n6d6kaof0uuLwXK2X4FSLRIFMI0YlsVFsZMXsck5TF8FhmCx2e6p7hqtlp2aFupgHMr"
    }
  ],
  "t-placsp-034": [
    {
      "id": "doc-t-placsp-034-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "2ca7b764c706cd10495fb24c9c5f0928b6bf6014b1cbbc4a9bad777cc43c9933",
      "obtainedAt": "2026-10-02T12:06:12.578Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=2CN7dQBNC5XavzbUZ9vLHEHk6k4l3K7TNe1BurlbIEfs7wUFJrmJWD5O8m2MtOjtSsZk12VQFmzlpMY4DGB8hGuJG7l0cK/JXEBuZJEGeS6Cx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-034-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "90cba38f1e3598f8c5526fdb57d9d195fe43c9114cf5dfafab91c6214cc6cc7c",
      "obtainedAt": "2026-10-02T12:06:12.578Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=KrqEeG5CQOpHgxQRTzBJTzn0VuGmLt6OMa2Nf6BgtF5PAPDkGOLrr49DyiYeSo4ZZQAHqn7Ru44atammur2H9vYmrvOWcWm1iWLPyZptN%2BcZyAJWGsSt0OzTSTyw9JAs"
    }
  ],
  "t-placsp-035": [
    {
      "id": "doc-t-placsp-035-1",
      "name": "TSA0083883_PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "9bc383bd22f9f1aa2ff60f9e53e21d736a6914205a2fa2c3336fdcf121127044",
      "obtainedAt": "2026-10-02T12:06:02.200Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=%2Bde5KLB3THnj/J33kZ2M/i7F85nw37CFGs7IHBUdNHv8YvIyMmcmvvetURBbjHVz1pEf0njc09BH45A1X0qIsrUY098Z7HSYy2kcmzq5ecpJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-035-2",
      "name": "TSA0083883_PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "682b5e4ee2495364fbb37b0d5113446686b41e4c986c6605f92ed8bd1bb6b4e9",
      "obtainedAt": "2026-10-02T12:06:02.200Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=0Z3VDPCr9grWvzH3U%2BimkxbXNw8FGOuLyk5prL8ojNwINDbexgQUTcGCwMk9iobjLl9ZPD7asPSH8Y1kv/smsP4V2RgHx3a2N9BHzF/uZDSB0nvVKRzfe4rpHcnlPhSZ"
    }
  ],
  "t-placsp-036": [
    {
      "id": "doc-t-placsp-036-1",
      "name": "PCAP_92paser26_Mantto hardware software CPD.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "551a1d4e5cd31486101f5a83a2394158c37ac1db61121925aa2dba7ddd99ddc2",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=5CAAEbue/BvrwWcQ9KVflEHXRmKdI0QyTxMCFY5T4KAA4exmxOUi7veIBvyhzbrP6QPnFYi6pOMHTlgbmzSrxf1u0ANRLZT725UbRSsSRiU//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-036-2",
      "name": "20260814_PPT 92 pa ser 26 Mto software hardware CPD.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "a252f79720cc4ef44ea8f76a250b05385322adf4a37e92ab5232953c011f1e6e",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=y57QL7vApiojCwHrbUsnJZ6c0vFi3twB57HM/7LcdnHpgxMs7NpXjS0SVnQyMfacmNnsTHdBzpieN7Jpg%2B4Z9PsFACoWN0trDUQ4lXvv72i1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-036-3",
      "name": "ANEXO 3 Modelo DeclaracionComplementaria 92paser26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "4e1364f456c9fa0d5ccc0cc6a0e4cbbe5250ddc7ac9848a1d1b0ba2009bbea73",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=xwa58zc0rLD7vaMtr9OO6Lkr6U9MG6iy8rfQSJoA6OidbZqO2wx5j1pv5PebbVQ9kcnc3a6S4D94SERpCHAf8T0u86Z0wefxdel83Eky1Aa1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-036-4",
      "name": "DEUC-92PASER26.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "24ec4b21cb17701b8815fcecd68e56cf121ea347ddfef70d70ba39738f1ba036",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=mi8hCxmbdvJjZIu4fDnywtykLiskqSHoGbdR6upP5jTQNwGsrXUVGIB2zFVThYESn6/UK7RsS5VM9lKykqzmR6qkoKq4tWKLWMarrpSbl2j3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-036-5",
      "name": "ANEXO 1a Modelo oferta criterios automaticos Lote 1_92paser26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "10bed7a738dfe0bce33f0002e06a419b8c5d65f92327d19e39aeb1759f5aa478",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=iC2HT34JybYZiBlDt9jAcysFZimR96ERWTbOwPQklFwN4MnrM9d4V8zllcpKeZRGrOfUjyW0i1PLgC0oSRpdawdmPL8efURelGld18QVE6PfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-036-6",
      "name": "ANEXO 2 Criterios Adjudicacion 92paser26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "38f381f90f5fae537c6939e4a0795a7a80ffc8860d9e380182179c0b5f88c0ed",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YbTDMAP2Cwt1w82zJ98bjm6N32tDAhbzfCaiqwjOgNl/uy4O5Tw6zcLGkIs7Vlezwj7cT1I3YomT/RO/FqoSXRqeCwhpBtR%2BGew8Ke7nl1EZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-036-7",
      "name": "ANEXO 4 Modelo Compromiso adscripcion medios 92paser26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "270bd4915c8baa59185bea3ced911adacbcc589d9c6dcac7642a08a6d12f9380",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Dfp7alvlORosUvSCbMN5%2BKI/X6%2BrwcyrgBPuXyD4L0RQsc6pfYbea%2BKwe7yAIXOxGGJi3/YTe9b1r/t3C%2BmvthCw/t9lGdSgL8W6QacOcHj3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-036-8",
      "name": "ANEXO 1b Modelo oferta criterios automaticos Lote 2_92paser26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d998f1628d6581dba0c7a24cfd0f6d00cbd6023992c9513c44233fa726013244",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=OM1AbQfJDwiP6o5A2vxXHzqLt%2BnTTxZKEPk6Mv0d71U4lp9M7u7CyDviY2/fQ4G0OERmE0Lw5NUIKEhjS1BNqvg3k2OiqNtcBl9LPoXoJs0ZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-036-9",
      "name": "INSTRUCCIONES DEUC generando fichero XML 92paser26.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "aa75b08fa54465dca47f3e764da36b75d88ac73bf08cbf4e97854fedc2c55d3b",
      "obtainedAt": "2026-10-02T12:05:17.309Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=0z8XuZaeiAjMPXROdLvWinMOmtSDXztZIk80zlGDIYtNu9VfOxKjGBoWLRVnFvKPIJU3ixeQHN0rUKmjEXBUk8FOphfffOcTbduaRmrLzCT6CYyL7SIrUOBFfNf52ZqA"
    }
  ],
  "t-placsp-037": [
    {
      "id": "doc-t-placsp-037-1",
      "name": "02 Exp 2026016 PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "82d8a2d84edf9cae372e7b068d455e3ea556b216fd49a05bc6830d3e9ca7a1b8",
      "obtainedAt": "2026-10-02T12:00:58.069Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GdE4kwbnYg0C1oq1WuhAI4mPut2LwAiVuIFK1Yq8QaIX2zVGKFm8%2B%2Bfg0KPIUnXZZRJ7EdoOQEupVk/C2nDXgejrmonL9y5wQrIdCWaDMWBJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-037-2",
      "name": "02 Exp 2026016 PCAP.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "82d8a2d84edf9cae372e7b068d455e3ea556b216fd49a05bc6830d3e9ca7a1b8",
      "obtainedAt": "2026-10-02T12:00:58.069Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ecXgcu2WwH4jOqMKJW6GGn5XUJqLsvbxKny%2B0qobvVDMQrP0M5Hdfn97yVyPxoTIuPfsBZTr2VBDxRSzIS9rYuwpdbtO7NO7U4oFDMfRXpGHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-038": [
    {
      "id": "doc-t-placsp-038-1",
      "name": "PCAP EPC 07-26.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "4182685b4f4a72c0f334fad678b4b96d2f31b78fcb4f4f966d0b0dd2f041b915",
      "obtainedAt": "2026-10-02T11:59:01.624Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=feL29Io3yq9pf2GXkMZaxshFoVZONIGyOeMQxdLzw6X8XTGWKfW9nv9ZEQ5d23psGZ7oPZ0NaP38DOLuQ/Mg39u2t5%2BuXYhXg9XBDqC0tXU//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-038-2",
      "name": "PPT EPC 07-26.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "484e208ce76c87d306ae81edb58db3e9e8f4af3e1f4fafb34c057d1297677319",
      "obtainedAt": "2026-10-02T11:59:01.624Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=cX5SLGY9mazusr4/jc996ClzuTGz0Nq5kpqqBbc7IXX4E2jlgQJWq6AryfmXDxz18sNOENSeFhgglTKcM%2BJYi8DbbaSacqmw%2BvTDzp/0a1AZyAJWGsSt0OzTSTyw9JAs"
    }
  ],
  "t-placsp-039": [
    {
      "id": "doc-t-placsp-039-1",
      "name": "PCAP definitivos.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "127d353c478f04efc55ab3fd3bc7912a6ea4d1c741592e68f2b0190d018b8ca1",
      "obtainedAt": "2026-10-02T11:58:57.647Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=kdLi9U73c1TyF%2BaWenTzUWIQHqUVT/4gD6zReYvCq/8A5O78%2BqTeuly%2B%2B3M5abFKedp1aADgeW2wpLWx0H2wLU2E8%2BkFvPGGBNnSQV4wyY8ZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-039-2",
      "name": "PPT definitivos.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "c6c8234034ca4726644a46e76c634e012326f8725a7481e7298c509cd3d77ac7",
      "obtainedAt": "2026-10-02T11:58:57.647Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Wj3bHWs80571JXIKfFCeYluJEF0gMprins2SP2kE2MNeJ7hGdv0tSTFRs%2Bg1pXFBxL9msZJu44kNR57M%2Bj3HCmR3ojtUQmkhKvkIjlZTZiM//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-040": [
    {
      "id": "doc-t-placsp-040-1",
      "name": "CEPCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "4c4b3a18a9fd1a90bc2c0e2ecd9772bbb9244fd9e209ed73ed9c840317357264",
      "obtainedAt": "2026-10-02T11:58:38.669Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=LnhPfuptw4RGG27oGJBVnTFeSz1dqKnUP7iB5HarBKtR3e4NgkGEdgR7MyrsKoOxEWVifVNhK6KrZ/CvGDddILKynWUWLRb3wcvVDay1y6iHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-040-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "236b8d4a4dc34341c581c8b1833f05e7df14d60709d44227e606e8e43966e308",
      "obtainedAt": "2026-10-02T11:58:38.669Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=qXATcju1KpUxZ9rSDPYmgBoO0u2UgLm02jnyRTAUD4VCRsumvYBnebzSd28dpZ94qkQ2akdqzlso4jUNAqitr%2Bu4WX9ODxp9pX3a3ll1cA3DdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-040-3",
      "name": "DEUC.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "21873b2f7062dd4f9a224c51614906032e144af127c178b5892bf71bb475e245",
      "obtainedAt": "2026-10-02T11:58:38.669Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=wk%2BywwMf/M5wKD6DnqF%2BEoApHUcd239hWF41Zq7HQ5uVFbIUrUSPqGfS%2BxZSoOxvDwhBvADvA68SJMVga4/3rFVhVOql45J5j3NFk8USYWjVTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-040-4",
      "name": "Modelo CTC.xlsx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "ce166f6321fc6c32e1ac4a26cb0a715f9ad5470e24c6cd64bc773c2a7c18e44b",
      "obtainedAt": "2026-10-02T11:58:38.669Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=5LaaCWm5RMLBqXHiPOgvt/MDDJv4CSIrE5m0hk0AtejjyLatn5plUUJF2PdUsWIV1fY%2B0hkifEuqSf9OdwLtNPmdMBTXYzGa0PJaidH6suW1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-040-5",
      "name": "DEUC.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "64b7a1b64ba9ec5a49aa2c582ea3b7fe79a51200555c0aa749aebb25f51cd950",
      "obtainedAt": "2026-10-02T11:58:38.669Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=UvY8GDwZwEsFi5JWaFIsjZESdTXl69C3TanbtF6IF6rj39ndpX7N3Qb5HWIGsUPnJGJHfvsaNyFY3j6jPlQ7t8ZeM9qXUhOGEIBDEsm6aSZt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-040-6",
      "name": "Plantilla economica.xlsx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "1c3ce526171a62bc3643ed61586ba807230d7646fab94b55554dab0b057cea04",
      "obtainedAt": "2026-10-02T11:58:38.669Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=L4CuhMXdnH6w%2Bp14z2%2BHHezk9rucl37ySsocmnWyd17i%2Bb/3cFNbehzst4CHnn11GdEWAbQ8BQYt4xJqajx%2BJuR4%2BZsPd4CTOeCQkXumZfJ45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-040-7",
      "name": "PCG.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6674545a69c272e568d131b2566ed0fc374236e82451e7df8e4dd1aa17939b5c",
      "obtainedAt": "2026-10-02T11:58:38.669Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=MzaQYw4rbCyoFZ8VhTmUfDXL0c8EdwcYg6m4gml2XZhJ8urcHkh78cxHlKlh7yY0Uu0S0wntbkyjTDqegiXRW32FqIufIoYecurIIa6CpgPDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-041": [
    {
      "id": "doc-t-placsp-041-1",
      "name": "PCAP_2026048SUMNE.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    },
    {
      "id": "doc-t-placsp-041-2",
      "name": "PPT_2026048SUMNE.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    }
  ],
  "t-placsp-042": [
    {
      "id": "doc-t-placsp-042-1",
      "name": "pliego_de_condiciones_administrativas_20260819080359.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "293615d6fa6a864c09245770b9cb45d22ce6594c2c70a69dcd02573a343ea134",
      "obtainedAt": "2026-10-02T11:56:45.256Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=q7agIk54BfpI21TCb%2BKFYz6gs8TtXlnIeFYK97RhBkCnyHF544/pw2ZOgKufNi6ygIpjn7Q5dd/yPm6d2XMgiSd8fUTKHS29MdBrxLB2w3xJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-042-2",
      "name": "20260818_ppt_ztna_20260818131243.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "39a0422a23fa34ce78ca6dcb304ad6989b4e4be8a79e26ac44156b24acc644e9",
      "obtainedAt": "2026-10-02T11:56:45.256Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=UATg%2BBrF0IQaLkmbTYJAsrIiD9u6psMvBRdc9uThZHg39WmEpp3nOlKpNPtdc091k95ZyX9BBjTjNnIuFnk6RpFb2XZWcG77fDCUq0npyuY//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-042-3",
      "name": "certificado_de_existencia_de_credito_20260818125750.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "a1cbb16b5efd7484fc5af23eef6211201ff13b93f33773ba5ab0c4b2ce92796c",
      "obtainedAt": "2026-10-02T11:56:45.256Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3amqfAdMPQJPqn%2BOLc8rI7zj6R2yIosDnPVfNMN/niROe2h3EZ6rgqhz3UX/Nc55ZlLEK5rTJoRUiWj040FTjQ4fX8VOMn7tSVG5oUxe9gJ7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-042-4",
      "name": "20260819_memjustificacion_ztna_20260819080326.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "58a763f9e9511d86dc5730e152a30a00e97b60d3412d1cfc26e0c5ccf968c867",
      "obtainedAt": "2026-10-02T11:56:45.256Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=zMSD8Ufon43zAJdis6i61aQiN0mT4pgwwCOfHV1%2BLnGChFw8WblriuhzcPriHhD%2Bm%2BR8DIuj8VjYuUqnS4YIgLuFFORg9lVVdx3MYf/sQXF45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-042-5",
      "name": "acuerdo_de_contratacion__presidente__20260821104459.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6a8905d0cde383498755e96466322479911dc1cd9229381c2908146929ffae6c",
      "obtainedAt": "2026-10-02T11:56:45.256Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=2Mt6pBpGSn%2Br8HA2UbWMcWpWepORhjdVHE8BAT9VOnNnhnDOgvxUIrJdqmEbyBA3hR2lxnVRZzvjUbYlZU%2B%2BNvVaA%2BA1Ay/6v6Dk0K2eeOx7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-042-6",
      "name": "v1_resolucion_.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "50bd576ee6edacdd5e869eb739cb442278d6b8f5f2633b0cff7ceace5d9b6e04",
      "obtainedAt": "2026-10-02T11:56:45.256Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=4A1AVF6sBM/bgwRIDcw4wkpNCPn8fTSQmGFpv3qi8fBlPkllgXHmrR3coklPuEpZh4na7wRHo5I3We/EQLSXMiHWgPxPyU6vh4zOUifRRMbfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-042-7",
      "name": "Anexo 1 Declaracion responsable.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "dea94cfdec19cf399eb79547ba938dc22b648a08e1ed61976ba942aed560ef59",
      "obtainedAt": "2026-10-02T11:56:45.256Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=kSHlL6NMfsFhGF42fAGIvdDwR9Zp8atM8ef9sjYwDEpFJ30WrhYC49uOa8a7ONnG5HBsIzUau09E%2BmzARY2lLwnZirjuf6mJczJXOOgve6%2BCx2e6p7hqtlp2aFupgHMr"
    }
  ],
  "t-placsp-043": [
    {
      "id": "doc-t-placsp-043-1",
      "name": "01 PCAP 2026036.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "21b32b30a6d7d5e3d169958c186b41543e261f9a0f1e8d4d2e6258e9418fb93e",
      "obtainedAt": "2026-10-02T11:55:21.611Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=FoZ2%2BVengKzr2ZmRSLSS0cROTNbI3ZrqChQi/WabldsVbuZW/sdWUL4k595J%2BcdOnXbnuS789wm6iJcblhSF%2B9hZVZE%2BPROJ08gWZw3C1z3fdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-043-2",
      "name": "02 PPT Anexo X.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9452aa6e0b34d0c6f05077cb23cd9ad6ab60ed845c5b71da0a03c4f3f37723ff",
      "obtainedAt": "2026-10-02T11:55:21.611Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=/URD9nW44VgPmSewMNJgGlOITMTTAGww19hpd%2B6DZBAFHmzbE0%2Bgmxa3r5D2Fn4RTwsqftNLLR73hceokx3RHTguvf5g2Ab0v/N0VbQXrfrDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-044": [
    {
      "id": "doc-t-placsp-044-1",
      "name": "pcapautocad2026.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "c55a586046adbd5ce0e4ce1d49f90d8d3723f9ce995d369637181ddba8e6702e",
      "obtainedAt": "2026-10-02T11:53:59.490Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=HkM%2BqreewIQFcQvfvBs0gK1FXHuvzSwrlEjVb3/yZabUzH%2BlVdKES13/wCt5pufVhFxhw5dVFDvAANmBlqeLkMGT%2Bk1ESqtqLSvT1bw5YSaB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-044-2",
      "name": "PPPPTT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9fc0f68d44722ab878dcae84c8f8b4a22daed61a54de32ae3e8275f93935d715",
      "obtainedAt": "2026-10-02T11:53:59.490Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=//fiN5yaOk/5R2KJX53dxG1AL3EWP76AndBbT41%2BKFe14BuW/wOP%2BxF8u4nU/d0PrNUF06QNRVvlP1X0lbk284JLbP9pMaOUs4GhBxgwtx6B0nvVKRzfe4rpHcnlPhSZ"
    }
  ],
  "t-placsp-045": [
    {
      "id": "doc-t-placsp-045-1",
      "name": "26-0038 PCG MANT EVOLUTIVO EKON.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "9cc3693aabb59ee0705d20681c83ad328bab344e996fbf1315ca7c646ed6985f",
      "obtainedAt": "2026-10-02T11:53:50.513Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=u7yHu%2BPluCpfVx5GTYUHzaZatbTf3OhT9IgdADjQzAbEm6GhQn8Z%2B4SKpwJ30cZxxjhLWw%2ByZhEVvXh/nddvrP29hbCIXdk6qgFKDOQSkaa1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-045-2",
      "name": "26-0038 PPT MANT EVOLUTIVO EKON.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "32480c62397b868a8a4f92336fc3e548a1ad44e12bfe6eed8a77eb419082f186",
      "obtainedAt": "2026-10-02T11:53:50.513Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=hpE2Z1nh0hpaxXKwXDrAEaAFcUaFAHbafie8D03oxmxrnT5e9TPBxFuSE7awTKzsWvHBoTn1ELOrGbz9M1OmsuwsolJ9eYlWlLUwGNEoGAAC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-045-3",
      "name": "26 0038 ANEXO V Criterios formulas.xlsx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8da03588e52a5333ac1e4e730b75f2f6b4456b9542c645e17b29197ec559acad",
      "obtainedAt": "2026-10-02T11:53:50.513Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=TV/BYdA8NNQmfMO5kDHRz7lVuXi6Bjr/T2iumzAwavdUO9K06QkyB%2Bs4y0EWexqHqg9G8MD/PL02RJWyQ2dfVXwROX0ExEbwop/Z5HPRwrXDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-045-4",
      "name": "26-0038 Anexo III Oferta economica.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "72290a5622e67438f53a914d0867f198f2f5938004ae7796548202a461f89f1f",
      "obtainedAt": "2026-10-02T11:53:50.513Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=rJWtL9eh9r5MXLkxZV7MDwZ12%2BD0uoJ5e2V9F%2BHUKh4kWuqj6m/%2Bx9KqRnaU1lLrCsldN7qq2DHuXTAyqrZjOXjCGqzmm/c5ChDuAQJgF3X6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-045-5",
      "name": "Anexo II Modelo Declaracion Responsable.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5fb4aedb93d45da51e2842648a4b6ce92ef628d7533b67be6af410ee61e81842",
      "obtainedAt": "2026-10-02T11:53:50.513Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=17ZaRfj%2BYwftRFIFxVLA1GPLm7ov3xSqf%2B4jV%2B1o0WNB%2Bfzbuans2LDGfRQMg1Jt%2BrlBTFB3IhK%2BdyOAxtK86FmmJE0maYLQT96qR5/YcWaHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-046": [
    {
      "id": "doc-t-placsp-046-1",
      "name": "565505-PliegodeClusulasAdmini-001003PCA_STD_CA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "38a5abf7a8055dc8d66f414baf99844fc009011b1073139f77cb4679d27198e7",
      "obtainedAt": "2026-10-02T11:52:45.277Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=autbZxxet%2BFNidPtF99YltqWMyBBm7ISrM5hAz1cNdPvTw%2BJtoXZ7i0/u6rcBrK2h64SYxq74RuVoUsEouYWyQne28HIgShv8QC/KrVmKPe1aXEvq3KHa/AEHgtDrQw0&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-046-2",
      "name": "560904-PliegodePrescripciones-001001PPT_STD_OE.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "954ac04fa51fe5a5f4e1a4f8da6bedac5096801237401af22c1a821154ca085e",
      "obtainedAt": "2026-10-02T11:52:45.277Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=zWWxIMrr6WjF1fvYCbnQQOwvYsK8XcTDVdb/rkFIt5NqR6q6gJG4YzGfeOP%2BQMzqMnrCNj6%2BL0sUJyVgm%2BuImBteHnfI3yiZ3JVMatByM461aXEvq3KHa/AEHgtDrQw0&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    }
  ],
  "t-placsp-047": [
    {
      "id": "doc-t-placsp-047-1",
      "name": "4180460-Pliegodeclausulasadmi-001003PCA_STD_CA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "06f68d65a9ffd6edf4be1e3770dbc8618acc91d4148f0c52f6ad37e8a5fa1e93",
      "obtainedAt": "2026-10-02T11:49:36.258Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=SZco40hGgi6jZGfhfOqPcaLz1rHNHt5tVIsYy8x7BGbCPA5oC3q3/HNbYS5fTYf6yk9mTQ/buz68ttnnTxgC%2BQz4b%2BvHSf1C7ldO3hU0%2BiR45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-047-2",
      "name": "4056520-PliegodePrescripcione-001001PPT_STD_OE.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "7747d824412a17b75890d59eecb6a65b4647b6fbcbda9f862a156f3518091fca",
      "obtainedAt": "2026-10-02T11:49:36.258Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=54V/7BcbIUhnQ6DZCJtbhBq%2B1b/NVsUFSTaeeKUoO7h0kt6HM740KogsYDu5ePmVK6pzG%2BofmJEu7I%2BZO3AmDY51oc5raxLlk%2BS9k386%2BtSHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-048": [
    {
      "id": "doc-t-placsp-048-1",
      "name": "PCAP_AST-2026-20177.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    },
    {
      "id": "doc-t-placsp-048-2",
      "name": "PPT_AST-2026-20177.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    }
  ],
  "t-placsp-049": [
    {
      "id": "doc-t-placsp-049-1",
      "name": "pcap.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "cdbf89a2fb9f0f15220c5d64946f3fcd6ce6e8bce895ac3b14d2a1ff0f608e1b",
      "obtainedAt": "2026-10-02T11:47:22.359Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Kdt5qQUv%2B8I5ikhK9afubs5nkRUmuBzgiFb%2BRC5zAM0ZY4XQ8E3G/KNemvHAqGPtLfi6%2BBOjVbcn5/Wd1rGxurWoOQMoON3XuMm91ZXOX3VJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-049-2",
      "name": "0PPTUNICASreport.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "378a2e60f180f9920cfe3c2059764453c7d65e5c4abd26db78f7ab22f2ed4e7d",
      "obtainedAt": "2026-10-02T11:47:22.359Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=1ESdVpr4qIZxbLs5w1JvYnO7F5x8/MNjhiqYfmYM7ak%2BUm3zI/vBLVAojDHK2MyUiW%2BLtbwXwjYBVPwuAIJDKo7RcQULX5nj9pG8L/ejzwnVTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-049-3",
      "name": "Anexopcap.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8371ff252b5b6aeb5e9146485c52d775d1e5f35bc3a94a9d872d314e496d6c3d",
      "obtainedAt": "2026-10-02T11:47:22.359Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=cQRP6oxt3UDVLVUQGo4BNy89m%2BIY1dOSIfo4ob0zuBHnddbJA%2BJMhcbhnwR6dnSIzvCvJAmLIN1/MMHh74BrqwHBVilyXxO2a42EylJrw8bfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-049-4",
      "name": "ANEXOIII.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "3db88c9d3c194deff8356dbbd64a8669a4cad6e08d7e3dec993851a9ae908909",
      "obtainedAt": "2026-10-02T11:47:22.359Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=swiOQQ0qDFXvb5FdvGU8MRaNX8UaSDaNn4STMStrfoVdXVQOvnxKXTw1ZR5wAF%2BDCjlafhD%2BULzySfNFb7LOXeMtFCmOFqMHNNEJ09NGQGr3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-049-5",
      "name": "ANEXOII.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "078682f03d32f2b7fda508b426d4d83b9dae07909bb6adbb8b485c079bd31b97",
      "obtainedAt": "2026-10-02T11:47:22.359Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=eG41%2BMXws2dV7pucxssTRJU7R/HRbVoteXBG1Qhpe6N0b/uv%2BDzm8ziE7/Wecc/PgkzGcwxA8guLkJi3MzZyeYN4%2Box%2BDx8XPocegDiSFINt/o8fNevwsujgRzaBbugn"
    }
  ],
  "t-placsp-050": [
    {
      "id": "doc-t-placsp-050-1",
      "name": "PCAP Expte 017-2026-27 Sum e Instalacion de sistema de domotica y ef energ Colegio Mayor_.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "82b7efd1ff67c406c195fe2f4d717022a9530617e4dd30ea4fc7c517a9b3809a",
      "obtainedAt": "2026-10-02T11:45:55.327Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Q6DFJeJXdIf4c4cbRnW5Pa/U2QNr526LBSBwk7ZkeiYXsH7U2jZkZJHeXMeUTR2DII6GnvciyzlyLuVr8yoHQTG1%2BQzdrf4n0Kg0WLxBu/w//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-050-2",
      "name": "PPT Expte 017-2026-27 Sum e Instalacion de sistema de domotica y ef energ Colegio Mayor.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "cb1a356e8b9cc03a57d45a790101264981c8e5cf42fec2d8814e60a791def7e3",
      "obtainedAt": "2026-10-02T11:45:55.327Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=VI3xA2IjraSbbNiyq5c3%2Bj2ISYcrlJDdsliDl3tAgmGtjVPpiXSpB4dW1dFYA1X7Kkrc7/ZUOzr0GmsovaAowuUMoZl5JszhiufpYx2KhFQC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-050-3",
      "name": "PLANO.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "e0f5ea203920d7f4dcd92177cd0092944491cc4c5207970cb54c69372566f886",
      "obtainedAt": "2026-10-02T11:45:55.327Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=%2B/SgxxG2o60Xdevz1DkVa18dupPDNYRbjTrwPF9qFS15N92bGj5pmAt%2BPWiCm6iuHfsw1V9sD1rlBTod97xdmLfPZ2vRIsG02Io5n5dRN6Z45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-050-4",
      "name": "Documento V Expte 017-2026-27 Contenido de la Proposicion_.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "be73cf75089cb0fba26f038bb6cc8e3193d887ac16dca780c20f439d71dec778",
      "obtainedAt": "2026-10-02T11:45:55.327Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=wtYzrWM2bAq2nc9zMfZ2UGJk35u3r/fDECarczG7uiE1adcacY%2B/bfnAa97MuprWGBKCmy%2BmI/UktIqB%2BUEmVY0c8PLCw/amKp0EESKk4sGCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-050-5",
      "name": "Anexos en formato Word.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "76049b9d31ed4fd5bbae5ba612e33aa1f65c68bd7d6af8212c4a69668c49b6f2",
      "obtainedAt": "2026-10-02T11:45:55.327Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=LMv/Msrt0BS/Nc0X9wZ%2B9f/76%2B2P%2BeZTc7lDI/OEY5ZSbLvniBLCbmnUq4EZ48DjL3wm45GCTDiNKnLh9utbn4%2B2T%2B5X9oqyLEHkvSghhS0//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-051": [
    {
      "id": "doc-t-placsp-051-1",
      "name": "PCAP_AST-2026-20176.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    },
    {
      "id": "doc-t-placsp-051-2",
      "name": "PPT_AST-2026-20176.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    }
  ],
  "t-placsp-052": [
    {
      "id": "doc-t-placsp-052-1",
      "name": "Pliego de condiciones particulares.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "98832d7c5f656fee5f4b36bb54e0d04a5f5ce3d720f6fd3029387d20336dce47",
      "obtainedAt": "2026-10-02T11:45:09.241Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=HjKT12YDYLIZ6z7Fco1VmzZnpeCUPVaXzkDfCc4O1irBzdCH3Gutfh22HzLFJ/5KJKOG9hWeIW8J4QSBJflPGmxKmzPbSGHtFKIn/RiHJ7t7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-052-2",
      "name": "Pliego de prescripciones tecnicas.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "558d9a5cfdad18d05470c8952c96268e0e16d0413a866e874ce8b3f6731f0fae",
      "obtainedAt": "2026-10-02T11:45:09.241Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Kdt5qQUv%2B8I5ikhK9afubgUxYF/2KHCIPwaW4qcYAsMLigEqc0%2B/5r0qMloN5fNDit6E1GP4dBaDuMdyuh/TMSY%2B83od9ffU%2BDjkQ7IfsL0C1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-052-3",
      "name": "Formularios PCAP.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "bbe107fe4949186aef0911238b306a97e4ec4b0ebe7642bf3633e3112253c9a8",
      "obtainedAt": "2026-10-02T11:45:09.241Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CMHsG73y6PP%2BHxPn%2BDAeGcm%2BcsiDdVeourdS0QbldzG8R6OPHJ2jdSz4%2B7Yft4H4vn9zFsm6B1bYPjqTro9L9lIkkbb/xgId9RJpulVQEymCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-052-4",
      "name": "Memoria economica.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "f6c4a63921490031df3112d18292c73999d4f35bd8f344dba43bd086c268d56b",
      "obtainedAt": "2026-10-02T11:45:09.241Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=J4VYxvIYvy/5WqFVzElKGIGPO3hNdfKqgYeixJK1diioa4W2FCdCXQenbZfvsLwQKbxnDyWdd5rgcpsw/F6dg8YPtnozZN1wq2AAPGJDLOg//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-053": [
    {
      "id": "doc-t-placsp-053-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "8ae78e16847ffeddc76947ab1b06b978fb4c0c2400edfb83f4e8c9f5da97769c",
      "obtainedAt": "2026-10-02T11:44:54.597Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=/6ZF07JdSPkDtCvzGHT3VFja1R5JJ81WjARt4x%2B9yzsXy4Mtgquf3XH8XaTiruyJEXJcJuDX0B5%2BHKk4sUAwAZIRmlIWR4blz8t1uRPTvJz6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-053-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "fbd370369559e61bd3343e351a7a105d6509853306a049ba6c3e75c928f9711a",
      "obtainedAt": "2026-10-02T11:44:54.597Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=bLLT%2BrgJTJ71ikSjsReAVwtCUDg%2BXr5kUeLxH472dYEQHj0or0rN1zjPz/X/1C3Nb9ROR4LImw8ZtWIeP9x9fQoWoynbkpCwGUU2KAjbZzMC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-053-3",
      "name": "DEUC.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "343180e79d8918487a157c8c3128f71899b37b66da24b4d6e0410356fa4f5df3",
      "obtainedAt": "2026-10-02T11:44:54.597Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=0kHJ5O/c9W9Xz9ppH0OU2JDuPBWsxzgh7UqNG1%2BgHIKz/DBvL7jt6dyjQX8SeYwto88bO3HOhyzVJP3klHeJuZS7qiRdJC3Xawhr%2BnHxF/eCx2e6p7hqtlp2aFupgHMr"
    }
  ],
  "t-placsp-054": [
    {
      "id": "doc-t-placsp-054-1",
      "name": "PCAP_INVENTARIO_PRESENCIA_AMIANTO.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "7b6904843939e9a169fed995f462c04864bdf776b63a2fd21d78aaa093873578",
      "obtainedAt": "2026-10-02T11:42:50.247Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=NBF9sBzztURZPKggmXRAh1eyiNjh5g5koJDD4G6uWFrntskqCXiCwOyUzH6vJpA397rOTqTTpL3mYC7vT8wH80Re6mY4qn3Y3VbvyJ19pLzfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-054-2",
      "name": "PPT_Amianto.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "a9a1a79a3cc90113b0d5043694c5f736343dfbde76d8bf193949d5447dd8e58b",
      "obtainedAt": "2026-10-02T11:42:50.247Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=XeMxeBNFd7Cu2Hdz41Z6WUfoYpIjFbsccOZ2TtTbPkFl0ZWZkF3qQGKtn0thy4QRsSZvCcJ3zPrD10qwsTRAr1EvnOmdxQ8%2BRHYJUKz3nqQZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-054-3",
      "name": "Anexo_I_Criterios_valoracion_ofertas_AMIANTO_.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "b37ddfb4176a3764baeb2bb444570e0050caf5010d334627abfeff5228f9d5dd",
      "obtainedAt": "2026-10-02T11:42:50.247Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=JGsJF//SUJN%2BfF0Ge79JQVQMrWbQUj%2BYyv1yLhpkP6CW9i60Y8QBf7FMb9h0QBl8R6glE4t997mlch6bUFwaZFGOym6TFw015Fepv142GXGHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-055": [
    {
      "id": "doc-t-placsp-055-1",
      "name": "2026-01085PCAP_signed.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "cc3478557f944d4669791b2eb009e2654b1a2655be0034a8cd789f3e88a4959b",
      "obtainedAt": "2026-10-02T11:41:52.475Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=qzEyZ%2B7zc27MyU/FWNBbo7/ag52q2QP31hbstp9GbcJInwceBpoQXcrtDnk6BuSSBv9ool8dvcm41JuuSIzb6tRiSVgfyKNztUIpPnEs/1nVTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-055-2",
      "name": "2026-01085PPT_signed.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "e94815c70b67e96f530bc33075ada9e8756ad1b26afc0f5eded909873ee6a726",
      "obtainedAt": "2026-10-02T11:41:52.475Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=lo3StcYk72yMtqAGcLK/Td1fB6TN3QD/YXZhPFEyHX65w0eS1hl3SOSDE72PLS%2BiSfNBR/AWLM9fSxWoXlA59zKFDYokPKgU326tDOrSYIUZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-055-3",
      "name": "Deuc2026-01085.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "96f1eb1819186f90bdffb560fcb1e7f5e446cbdb335512bbd3bd9100960f61ad",
      "obtainedAt": "2026-10-02T11:41:52.475Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Fp8YDVWTEVttoPvBnMU%2B2NJ59zSByH8qH4aHEqrtyoBNNNOJ6JWGVqgBxrSc90JLtn415XImMILvZvJJDJB/oFTpscEES051DX%2B3MzLoNZH6CYyL7SIrUOBFfNf52ZqA"
    }
  ],
  "t-placsp-056": [
    {
      "id": "doc-t-placsp-056-1",
      "name": "Pliego de clausulas administrativas particulares.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "99d7b54b0da317c71134ba2afe324be7311bf1a4aef4809426212007086ecec3",
      "obtainedAt": "2026-10-02T11:12:47.109Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=sa9/%2B/yfghqWjsYIG9cTR3HIExLgpUbY2G9wV46oouSgca1idEYpp5TsTxWU2agCxZPG/gHaT3YHi4RjniMZMUnjoZLB/ZhYsbLVom0CHJL3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-056-2",
      "name": "Pliego de prescripciones tecnicas.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "7cd0088fee803e7223a9a4081bbcdc8c90e3006813dca8dc4e54dd71cbddc213",
      "obtainedAt": "2026-10-02T11:12:47.109Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=HUCabT85PSuASOYFznUFb5oDAFRs5yT/VJmzCoVt6Se1fHUH5NtY9EYPq5ZKxi9GpW%2B1uxyYnM%2BUZNx691mnEtIfkvgK2r5%2Byu6AW3t6uo145ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-056-3",
      "name": "Anexo Seguridad Informacion y Proteccion Datos Personales.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "1ac112be19ccab8c971cc719699e8c1f7c2d3ef25973d589b3bac5d141a06dbe",
      "obtainedAt": "2026-10-02T11:12:47.109Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=mXcgn%2BczoBoY5B1JRQHJHSqmJEkogLef3uyLvISK24LWASXNpw2BMX0K/QHatrxNMXWv54sfq%2BmXkpcyIiWMPevfZKq8a5ugl2DHN6mDp5l7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-056-4",
      "name": "Anexo II Criterios de Adjudicacion.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "24096f7bb52f770556104a1726dc0c15bc83869945ea2992bc85b69de41cd438",
      "obtainedAt": "2026-10-02T11:12:47.109Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CAAvI0YVXsRxpXNP/OxSuKbFV6L%2BGrk8IP3uctOwEnW0TtTFnrrhSJ4gvDXeT%2Br2733mFb4FNAKtZR8kaYSK4z2xJso8JOQ6Da6wo51QZoFt/o8fNevwsujgRzaBbugn"
    }
  ],
  "t-placsp-057": [
    {
      "id": "doc-t-placsp-057-1",
      "name": "522328-PliegodeClusulasAdmini-001001PCA_STD_CA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "668cb4a4aa40a76a19c955e8b57c8adaca75f9f6c48e83e5f2e9c429619a5bd4",
      "obtainedAt": "2026-10-02T11:09:11.349Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=i2X28vfgntMY0aRsKfcaYP30ukUOHtxgts4TprU0CACUNoo4KVj6O6Xf3o/Ok6LEn0zExp4pfP43oIRBKUJ1bSYXryD4z%2BtC%2B%2Baln7IJouQ//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-057-2",
      "name": "522327-PliegodePrescripciones-001001PPT_STD_CA.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "4ac05fe3901de460d3a8b1f492ce97f25875a90101c61aa74d19104249589e4f",
      "obtainedAt": "2026-10-02T11:09:11.349Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=mUcGUiJ/2vInSHHq/EL5Pe0mTV%2BypKMri54DPxdBwF5ov7seWZM8kTmKzyR347Xo8Sa3m6LaJLtpWLWnqEQspMs%2BW5S%2ByFH8b3wIs81b%2B3vfdyQgZAdTm3EfcUAC7CJ6"
    }
  ],
  "t-placsp-058": [
    {
      "id": "doc-t-placsp-058-1",
      "name": "PCAP 49P-26.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "8f203ddaea21a7c0db4ae5ea2542620d850fea5c63ba168a0fe76ae73cdd0640",
      "obtainedAt": "2026-10-02T11:05:31.345Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=WC5vY/eBIXzg7if4zMBvTlQjN45o0KX5Rn%2BBtkU0Yh1fiJJHMrIkyA2vXopDLiIvt7FMzQy/JValC1NM2SMlRvo8KeNlCX/x66hqjTSXeT1JOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-058-2",
      "name": "PPT 49P-26.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "02c07ef8cd79e7283c84d467bc60f0607d7f63fc0673c7214be1e5b730b79090",
      "obtainedAt": "2026-10-02T11:05:31.345Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=tdRxk0iRLCeL%2BJTmmQqDnK7azVfjfB%2B3j1Lh6aVg8CZ%2B9nAXmsPotHSUHfxaVycTbAtOIFr1rmWPax4ll166sWifMmVsJ2qgCgDnBhPJyhf3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-058-3",
      "name": "ANEXO VI DECLARACION RESPONSABLE RELLENABLE.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "14b9f8efb8f3df4d04694843ca8bef88a6c1c35151c244d71d3c8cdf1e236ed1",
      "obtainedAt": "2026-10-02T11:05:31.345Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=yHflyRD4Q9ZPzYceEsZfzcyc8XtpGNvXqQ/Tz616j/qjVUQEntPqpRY2VOf4%2BITYGdRwyFaNeZu20E2iESMBCkYygPE%2BT%2Be3rwDmFbqyLjFJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-058-4",
      "name": "Guia sobre Huella Electronica.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "55876e2e277358b3427098b8b951b9da6a485b55b05bf7e3509d1e0fd7dfcd61",
      "obtainedAt": "2026-10-02T11:05:31.345Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=uXTU8alS4HnvJgLD83wZihBOEfisCHSvt/axmxabtKedQPny0gumqZsDvPqXeISDFo%2BJj//3n5b/s9dUq/YUUomN7Xy%2BmdyrNebOWTC%2BgI36CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-058-5",
      "name": "ANEXO V PROPOSICION ECONOMICA rellenable.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0862a54bac45c0a10504064e33584fb09aa311b3a553faa5783b242b3d627ebd",
      "obtainedAt": "2026-10-02T11:05:31.345Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=w8RjTZ0/Xv%2BQZWtZ1WtzWkaYqjyq9OeO8sod1YgFYO3rwBH4Q1jhclNAFPPv2GEsULfrV6OJ7GUQ60/KccXwxcSULbI6x1OaVTzN8YtFSjU//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-059": [
    {
      "id": "doc-t-placsp-059-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "8c39665b0e669b57f58cc20462839fc97601f12621dc54aa07855d132421fe04",
      "obtainedAt": "2026-10-02T11:05:00.282Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3rl6R2muVA2gDznnnu9dKiK9XJ7hhQZ6FQI8iPbIr/%2B5UFVCqhnQJ0E6IMo6cqi0MTcaE9/zacP9ZIDQBsYgpDhDjz%2BmIK81KiRjzL7mu9I//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-059-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "6c9ef00718462466e943f45835bab57943c4928ad91040e29464a02ba373c9bb",
      "obtainedAt": "2026-10-02T11:05:00.282Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=O7p7Tv2tXilvOvK1UrL6iXQ50fzeaqaDh/3E9vRpRzG4BoB4tc8Q0NPZrRtfWfPeJcaUw841e/o4xkspqo2GaDiw0cV2HLIMp6DoX4oQvSRJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-060": [
    {
      "id": "doc-t-placsp-060-1",
      "name": "PLIEGO PCAP_signed.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "859c07ccfb1416b3ad19cb5271ecc5018a80988c72039b78bca8f0801002d53f",
      "obtainedAt": "2026-10-02T11:04:17.504Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=k0hIzFe%2BEVhSZzDPsfm/n485C2C%2BCysLaFoIUmDHqQ6GCyhLnX31w7fIKS3qVV4sKr6SNCawtEKVGPQN6pMiUOUUGMmLMAqUj/jtXjRJcOz3GVhXrFFqN7yFncy7YfRK&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-060-2",
      "name": "PLIEGO PPT_signed.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "c34415e909565093dfdcae12f25220a744f54f769e32ad711eedae76f3d6d2b6",
      "obtainedAt": "2026-10-02T11:04:17.504Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=t/8K2SzrnrRDwGE/BV/uUcqdZVgjuCmFrpupgnrArQ/0pJol9l7jyYJwEffiND4heoKbpb2GtV%2BCDTFxR/BhFSjEr2t5CnPEFSY2m1YoNGm1aXEvq3KHa/AEHgtDrQw0&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    }
  ],
  "t-placsp-061": [
    {
      "id": "doc-t-placsp-061-1",
      "name": "042026032471PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "cdbf89a2fb9f0f15220c5d64946f3fcd6ce6e8bce895ac3b14d2a1ff0f608e1b",
      "obtainedAt": "2026-10-02T11:04:12.607Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Y/X3L1qjz6TZIVIfqq4uhpEZad6D39gqucxOFfqBJkluPjKIdP9w1jREE5smbe1Wo/ueG3irhqgWEFRe5sokKsIVfRuIFZVmlwn2JuLgNrh7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-061-2",
      "name": "20260724PPTContratoAMICIFIRMADOJS.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9e360f1be44d0d485f58ce5fe52b7af2f116f47cfacebeacabf42312eb366ab5",
      "obtainedAt": "2026-10-02T11:04:12.607Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=j1uoPiXT%2BvZ/OKUyueGzlrEKuoHyozgTHR10MLQ3R8K0I/25PUsXf3CVkyDeIcyz/PON%2BGu0zkMkRQvhsYEh%2BWOCIomDM9kb7YzdzCK%2B3hjDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-061-3",
      "name": "062026032471CuadroCaracteristicasconAnexos.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "50d4932a502e2ca9a749f57f4ba65a7960e9145bf231623d471be11f30b09656",
      "obtainedAt": "2026-10-02T11:04:12.607Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Tn5DVJelagBzG9chRtLYPtpTtrgZqMF17IC6g9HfHYRQlvjNBMvNA5ylusOIWWcHcPRK9x9KzY9hzUQkrPDK45VJ%2BEtmlfFcpS0UZywS%2BjaB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-061-4",
      "name": "DEUC.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0f76608e9df925b71ff233ad797fadd7c5d7047791d1e00419772b703f82dd57",
      "obtainedAt": "2026-10-02T11:04:12.607Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=L2ArJ25VW8c5KLOw4Ec7dFmgQ7BNXLrk1idAIJIrdv30tBEEPzwKa/eTE2DOFicXOBOnjcKg%2B3qw85ralbL4WXnVuMcT0Td6pHADFXN0db8//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-061-5",
      "name": "AnexosWord.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "a6e090a81f4b46812135c84a8d8584798b7fda69be41d694fe7e0e1e1e379d8c",
      "obtainedAt": "2026-10-02T11:04:12.607Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=nWdW7Kt%2BHT689y5Sv19ngWkY3ol/ygbLWtyZDyrjwNP/YmhlSywf6gW%2BpGiJ9alow164QFJaJv/Jyso1g8AFbY%2Bjtxk9RItblc0vdZJMFDmHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-062": [
    {
      "id": "doc-t-placsp-062-1",
      "name": "00 PCAP V4 variants.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "0e3cdf71e34943b6b61fadd4c82a5e842d569950f12272a4fa488e26a77dc473",
      "obtainedAt": "2026-10-02T11:03:52.286Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GuYX22Eql9YDQIkOykb01w0bUf/S8R7dzs2Pfj9aoPsYVmDk1qsl4v4nBxHDYA%2B78WIP7//rO3QM9kABUQw4ctx9KO7k17mdJqqVjLe%2BlJ4C1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-062-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "7334fa5f88259e0d088535f17c167f1c66302119682b45f5337c56f2cefe185e",
      "obtainedAt": "2026-10-02T11:03:52.286Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=o%2B0OT7BKIglUuQWEe4c5BX/YIvk9JG37hsX6VdkD3gGtqFhsUneRHqHH8aNOW4TBXUXowkI3Ym562TSlhiTnxKiZGEqWDZpPeaCH9uCEF84//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-063": [
    {
      "id": "doc-t-placsp-063-1",
      "name": "Documentos.zip",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "5b3fd9cbd0710556695dba65a1d3d3abc87a9abf3322c95d15d804ad359db9d0",
      "obtainedAt": "2026-10-02T11:03:07.468Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=yk4A3QxPmeqUnEpC%2BlX0jKRCH3PDOLInICxEOQjUqKGXHen/ppTwIG1y1b6v6gHYdfvNY59sECLMYZThciN2oxk/A%2BTL%2Bm4t8fbZhLE8ZIv6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-063-2",
      "name": "S80P-041-S80P-ETS-0266B_rev03_FDO.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "d1f328ce84b15b551a226b28c79d5b6223b11251516a152e78140d1f1d6be7a1",
      "obtainedAt": "2026-10-02T11:03:07.468Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=xBf%2BvKognyHlfyJ84qh7Co%2B63AmU4svHdeHYlaZ2nY1z/%2Bn040yHkkg9QCiV25AwCNL/XrGJ54GCgoNNjOT1Hkn21niF0pMmPdFFfBS5Y%2BmB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-063-3",
      "name": "Documentos.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5b3fd9cbd0710556695dba65a1d3d3abc87a9abf3322c95d15d804ad359db9d0",
      "obtainedAt": "2026-10-02T11:03:07.468Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=fIsZxLzvMaQOk3aATOG7qgN8Fyz5ATFaPuivuFmofiaFsGB3CMXmyao8izonTKQKi2XrlMF2UO4WXZ9PqM8dLhxYWd1TFwGrdloSmKN1I5vVTD3T98KC0nSgQFM0q%2B5s"
    }
  ],
  "t-placsp-064": [
    {
      "id": "doc-t-placsp-064-1",
      "name": "2026-C07-v2-PCAP-AbOrd-SARA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "8ac2be16ded7e08a4909cfc19dad4a3a154a3811367d22afe22abb9920645967",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=0m/hW9TL4UkBLbn9D%2BEFiD40TM8verWBB20otujW3u1LeM%2B9zW3G6Yq/riFuc8sVZ4OKn7l%2BJQ8qPgyRYj9nonrtZN4EBoFTUL/js1awgpaB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-064-2",
      "name": "2026-C07-v2-PPT-AbOrd-SARA.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "7d16a4de2fba85c27689a21a8ff79f7876bcf36c7e2e061d2946643c13f85516",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=TbJjiuAc9DzauPlXcqiXPPRxVW9aGJlenNd%2BgQuZeb%2BnMuOvREkCEjeMQnn1UVvk4d4xnpUrq9ov1t4bMi4W2F5Mmgr6%2BKxKOCJBSnxWJ1AC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-064-3",
      "name": "Instrucciones-DEUC.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "740af4adcee821bd8d2bbfc12e7a3880d23804c7b0baa040827fa912f209b483",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=aEQXibZT7yJyD1IRHn1Rrm7zjgkcoDm/CD2yzODn9k6lzRTsJazsyfuNT7P47Sb/k0Xj2Jr3KfuyviwvT4G791aBy6jJgmdJwG4tIGBBdZw//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-064-4",
      "name": "2026-AbOrd-ANEXOS-X-XI-XII-XIII.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d4a1d4db3b312c7d1982e411cd8de9c84fa8227eee586cdd436b7f1e0dae6073",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=6aqFGdmIIGxvp%2BDa/Cncpr6Abjsv4zUJ2wyL%2BR6qRD/UzX9QkuXRafgcZD7ab0TA3LKLm8BE8PVQIS6Qpv%2BQb6bCVvq6lz3biJMShyXeRUM//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-064-5",
      "name": "2026_C07_LV.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "93443e09ebeb20676ffd541103ef963ad1c33f231fb61e0f403587d40f197b75",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=5OJGJJ95hSd58daHJSvnVVYiYTkAlRAY66RhdscnFr8pvfGMS1vIvrNJuNh6z4mtjVWNF5WfMb%2BUx6XABXI1FUqK41eXaGeHWeLa0DVGFXi1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-064-6",
      "name": "ZonasUrbanas.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "ab1f72f383952f9536fc81f74484d8498eb63ecf38deab8df93b362501c3ab78",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=HD8Y7iySc7SC0RsKZICPFvLLCgK8zLyKDDbu0zxdPKQfWaT6mzaa/HH%2BO0pNR%2BhvyvvbyYl4XsjAiCwm5yJ87nLMYi5f1MxZivrymST8zLV45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-064-7",
      "name": "2026-C07-v2-DEUCespd-request.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "f7a00fa7c23d734345d7ac4984e40b29516e3ac969b4275c6de729046470e4bd",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=WGglP8hnlLCE1wW48ebeDrAzCDXADVB5ZPbC1z0w1CCl1aLeWzC3lFltZPAxa9AB2fuI4USw2jRQNoZ5znjXlHt0we0MqQuT/V6aTA%2Bh39OHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-064-8",
      "name": "2026-C07-v2-DEUCespd-request.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0097d2f5958dec17295f880bbd1cfb9a1475b367ac60604ea30e117465cd56bb",
      "obtainedAt": "2026-10-02T11:02:45.300Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=DErvDpxzG0b4qgVKle1D/FkvO8jdjGTa4gfVHjbmD3gKHpp%2BrinMPb6RkeKZhaKAyFDSFPdAia37zYPkWsf1F6WzVnGp7v8HfzfVOLY9W9CHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-065": [
    {
      "id": "doc-t-placsp-065-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "611ac35452c687c80d71bc1ff7bbcc271d5f70a4df7d58f8097483348e06e2ec",
      "obtainedAt": "2026-10-02T11:01:50.262Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=A0cScmUKnF5PpvmMHaywCYiymCNz0efaf7xGSjPCQZh310/H11mFQAz8plesRk7gBCABS5hvdDbUSeL3e9dtJqQ7J0JQYg//W1KHbiNQZCG1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-065-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "4f58c38ed65e171f0a5ec936caa1e71c5d6b78a6e638cf4b59084b864892d0ac",
      "obtainedAt": "2026-10-02T11:01:50.262Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=shLMNuM3Rocm8oKlpRG7SJaW4I569BCNk3%2Bm6iRb7xlVEvMi/C01PDmRMRolW7uAJCMOzSlizhN7b4nG4Trb8xcwbc4nsQpOIcBXV89HlGE//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-065-3",
      "name": "Cuadro de Caract .pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "bfbc93501d079a4e5b47bfb59224f8117fe95b1cf6668af798115acc8fbcffcd",
      "obtainedAt": "2026-10-02T11:01:50.262Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=%2BQGZ1sYMu4wl%2BtBbqrYdoXpTNRh%2BHvZbwUMB4NgWs5viHxiT7pzRIZaS5k4TjAEPJ%2BdYnCNWM7W0%2BBWNcyk4T8xs1uohHR9MUcaspklLL7OHAj0WEJrB5sP7amrh2jBD"
    }
  ],
  "t-placsp-066": [
    {
      "id": "doc-t-placsp-066-1",
      "name": "Pliego clausulas administrativas particulares.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "0820b2947f264a237b7d815dcd08eb83fe73653de8f6b4f54240fbc9d1984170",
      "obtainedAt": "2026-10-02T10:58:19.390Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=kimvuyfQ11p5rzEDsPHMzhCPfLTkpaPjzzR09iL0AS%2BkEy6AAezW3dk5DVCXqkDAhFkcMPIOz1MDjoVaC0GThcQGCHwoYd7Mb500jmXHm5IC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-066-2",
      "name": "Pliego prescripciones tecnicas.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "dbfb15d61c2428f910ad9c048d92fa691c91b1e9630156fa36d5fb547aa39d83",
      "obtainedAt": "2026-10-02T10:58:19.390Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YotRaQh5mWZDVg7WK%2B/qgafKnGXD5ElxmX8yahHlPLW67GOOM8YTr4k6ZivqmrjSHgfOqVVn25d7G8KYfBE3jQgnrxUKE%2BuPYGxdYrNrj5x45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-066-3",
      "name": "Anexo I Modelo Declaracion responsable.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "cb0055a55111d1cb521eadd1b6b21e52e060c72cd63413bc8bce6b4d8ba7f84d",
      "obtainedAt": "2026-10-02T10:58:19.390Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=/GWdr23EmJAJuZQhO5NBV1sLkTuIZHb0w20V/IYqGTC9F/PPj0VjgGqRuFGcAfXwbNLABsPLemGoK/mS13%2BecChWJ7Ae0U4EyLfS3nfjujF7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-066-4",
      "name": "Modelo proposicion economica y tecnica.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8af27655775dc444b90d583aa277b5d2efcf977eee4d32a859385d8fb00bcb84",
      "obtainedAt": "2026-10-02T10:58:19.390Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=O6/cL0ia02Eqj0lfKz9KNXHcgT6s/jycxEJWPwgrCYzkny58zRNwgLcNK27u2%2BVTFAJLcRREu5Y7/hx9adb9BDWawKNIs6YIlXCr5cLqtq6Cx2e6p7hqtlp2aFupgHMr"
    }
  ],
  "t-placsp-067": [
    {
      "id": "doc-t-placsp-067-1",
      "name": "MT270303Pliego.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "983db083cd90fc1e2f28beac51437b6d1a1d99c7ce0500db72227b41a82fd6ee",
      "obtainedAt": "2026-10-02T10:57:07.926Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=FJuCxfaqujafc8n52GofCYPhkbQ3fkTxT//wAf/b%2BBCAIR955zl9tkAZNQDOqTzc7lV2Pq1mGGwwvtkjg8DojsAjbYQO//B1uLxj9IZs1VP6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-067-2",
      "name": "MT270303Pliego.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "983db083cd90fc1e2f28beac51437b6d1a1d99c7ce0500db72227b41a82fd6ee",
      "obtainedAt": "2026-10-02T10:57:07.926Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3NNS0qLZV3EIN5DB7tP0KF6rAzX7I6dKVsuN1Vk6BjfmhNy3FmSEBFuprG/qfNeDuKJDEa0fkWYwKIieW6r69mKw1lvqZ/jpJUzkJPC/3l945ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-067-3",
      "name": "Memoria rectificacion errores MT270303.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "91a555f80b65c2f8872a742417e29921218fffe48c4c7db7bcf3b831a4963d3c",
      "obtainedAt": "2026-10-02T10:57:07.926Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=cqaKhlfXY6IUvHhdXdnbvlWGVxSuG/IexcAGvwG/oK6ulB%2BUIcEqO8vqgt5SW9ESwCtkWO/9Tfdsv2n%2BBCDxA5jukffitEsogEbM4HXcEAjDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-068": [
    {
      "id": "doc-t-placsp-068-1",
      "name": "1788347311431_Pliego_de_Cl_usulas_Administrati.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "3aa23c8f6fe4ff0464a3efa537b4ccd86a95ab8acd5242bc512e8d7bd4e7f23b",
      "obtainedAt": "2026-10-02T10:54:11.627Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=K8WpqynsZvf5r47Hv4qQLNm9k7jvTP05cSlHjcEKX7Jk5gn%2BU5Tirn7IbaGhubOkcLU6lKXP0ye68nDW3ATXNINCvD3U9Mv6XZdqaNK2rAiB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-068-2",
      "name": "1788347314383_Pliego_de_Prescripciones_T_cnica.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "db5a07bc17e9b37fb69e081f5730621026538d4d0f04068a6f9b9b047c0d8d43",
      "obtainedAt": "2026-10-02T10:54:11.627Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=VlSD4vScMzx1nqhWIQJFUXiyTo/uFte8S60npSbJqqo%2BoYfLGGn1ul1KFpPRsPkkZ0KHdZKRjQIndF3/x4m1GcKrequ68eXeavAuyVcYsWJJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-069": [
    {
      "id": "doc-t-placsp-069-1",
      "name": "PCAP y CC.zip",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "564571326884b87d534cb9da70854489ce62dded08bfe33d91b2dac6d64b94ad",
      "obtainedAt": "2026-10-02T10:53:59.569Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=568hhttuCBx8/RqQfq1A1VceynDTAnppN5SYuoC6WphdxHz6UeP/gVHuPP%2BVZ%2BF10AFoEod%2BittWg4oZTwInEG1gIYgYhMRGrMEUI/jjESvfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-069-2",
      "name": "PPT.zip",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "86190b3a4fbaa29e0aabf6ac72ecd4e940144fc1cce715ef1466b27fd92bdb0f",
      "obtainedAt": "2026-10-02T10:53:59.569Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=UXG2L/597Fg8OlmAoKefQlrb0xLURON2bs9m%2BMD2JLhUDH76hcEevLtXZQeTMvb%2B3TSxvsCJgNaPJs4iVvGpDg8zGdkwGQJJVN6QbSPnwevfdyQgZAdTm3EfcUAC7CJ6"
    }
  ],
  "t-placsp-070": [
    {
      "id": "doc-t-placsp-070-1",
      "name": "2026-01277_PCAP_VF_signed.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "f700f4ea339425243a5120a3bc788184ce32dc30c6e139292682dfead53393cc",
      "obtainedAt": "2026-10-02T10:47:34.841Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=4ZCDKzhmgFJhqmV/6rO6FyfdT%2BVxWWaH6vR1UvZ0jF5hkTt5D8D0kHUV/5q11R2eDwq2Jzq3KMldalg//F8Em2Bybu9aIvdZCadtb6ns%2BkWB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-070-2",
      "name": "2026-01277_PPT_VF_signed.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "2f9679137f2ed1ed9f5a646309e4fb3026da6e77bd046b4dab1f3a87f137add4",
      "obtainedAt": "2026-10-02T10:47:34.841Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Qhab0ypIkvETCObtFdByRYmpXZMZOEJsHc%2B%2ByH0iTP3elbLFz3VQBM1x%2BH5Ss51023/H0EfuFWggXDLoEQtHzblHaiTTfhS%2Bv4jvEVT6jIEC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-070-3",
      "name": "DEUC_2026-01277.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "98a6654895dc904535a12c5d9b9a4b24bf0d4303d149cac611ee3a16265bdf31",
      "obtainedAt": "2026-10-02T10:47:34.841Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=n9QSmY%2BpuoSAuYYSel66XSc6l3LisqA9Hn3D/M4S2tzg/yDUwsuQ7f7dWnCwIj88ErD2sFagUfehTtrLSafbkBQ9gI2DKevJoEL1oPZOQc4ZyAJWGsSt0OzTSTyw9JAs"
    }
  ],
  "t-placsp-071": [
    {
      "id": "doc-t-placsp-071-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "bc8544fa70e5bcea4bf0ba6e2e1ba0ecd386109a3cd46707abdf837edbf182e6",
      "obtainedAt": "2026-10-02T10:45:49.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=27y2V/%2BYLbOYr4QWxCTGoB7fNigpKTcAvGwWfZtuIS3M6SQ5OWrs7%2BxZ9bBVO9vDt6tmIj99qEpGoHivGwW8lUJqj6W92XRQnYPYZ3iDMdjVTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-071-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "1abe3ad805271b2c1c75ff8576c57ceb17c533496dc48e54112b6f9e55d01f14",
      "obtainedAt": "2026-10-02T10:45:49.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=na8Eaa0bgUPdMQK8R2XFeL4DB9/zjIY4%2BdNXks0wA5JCURaycpm388ZSkoXYU63N5E5nrfOxN7U6uGIIKiYpw1JMvbp/JKnVXPXGbckebtzDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-071-3",
      "name": "ANEXO IV DECLARACION NO HABERSE DADO DE BAJA.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "21cc94c4518404dc0c40e0ba1dbd4bae2418fc243a20412301f0bc1feb98a9da",
      "obtainedAt": "2026-10-02T10:45:49.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ZVIjFahL41bYL41g078/e8h%2BR4BltzWTkgfOtjAl6Md7N5x8MPWWaepGbI2Xaa38/0NYJhv8lmx02PAmta1VHeJyIgoEUSbyzpwhIWAffvCCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-071-4",
      "name": "ANEXO I DECLARACION RESPONSABLE.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "58154b63a5d8d844ac57eba51f8bcf583d3b4b8d01071416eca5eb430a39662d",
      "obtainedAt": "2026-10-02T10:45:49.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=lPCSe41tzmpo9ToOP2HdbdsXiwkshvOuK7s2BWdHZ8P5FO96BlqrbINIjjuflKdOtvVzhj/I/RXWEVInED99sNZon1jhE4koTSai4mV%2BIR17QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-071-5",
      "name": "ANEXO II DEUC.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8aee2e03f6d012ceb0679c893bc085512d47f3b41b712af37d3c5d6dd049765a",
      "obtainedAt": "2026-10-02T10:45:49.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=AuPTQWy%2BcoF4XwC3IpZLPES0b54iYGpBTKHYdJq06cigy2bj4EmN88tB7nLy5%2Bk3i%2BHNNpT%2BBuy5Np3rZoXVnUMJBl1n9UKv%2B5F3v6Z5qLh7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-071-6",
      "name": "ANEXO V DECLARACION SUBCONTRATACION.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "daf7032c48ff24e980aac3d3ed3c1295fbbc576491519a2377df55b5d3c83abc",
      "obtainedAt": "2026-10-02T10:45:49.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CgBl4aTm83f7XlBFDyWucpoF6eBWIpBe2vLpmCB0ZBWc/P0KEo8AMotZRrqUERVcQSZFh0xQXx3O%2BnJiWvewk/IwQP8E6/0DrDFgX7WdFTaB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-071-7",
      "name": "ANEXO III PROPOSICION ECONOMICA Y CRITERIOS.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "2af3f0ebbd3aa1e89b5aad908ba22aa793ac11509a1e3e60c00a4fb2237bd390",
      "obtainedAt": "2026-10-02T10:45:49.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=joksXqgeEwHtaK3Fwf37Lq067Cuw41/DzFHMRhbnAFTGO18UJJYMlH2jU9Th0q8D69l%2By2jOW%2BqMty3QONfdKPAkum0P7GgqlhSkDFkbUD/fdyQgZAdTm3EfcUAC7CJ6"
    }
  ],
  "t-placsp-072": [
    {
      "id": "doc-t-placsp-072-1",
      "name": "PliegoAdministrativo.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "cdbf89a2fb9f0f15220c5d64946f3fcd6ce6e8bce895ac3b14d2a1ff0f608e1b",
      "obtainedAt": "2026-10-02T10:42:38.887Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=FrSXK/KlGjULOKvvFayfHpO/g9%2BSBxy8bOTW8Y27PfHcJfEbCMRjXB%2BhlWjm9VF/y9vcCpR98fqCw4WRO%2BaWApzEzBlamAo8k%2BmgSFBB9AD6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-072-2",
      "name": "PliegoTecnico.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "6e3d459750f3bbea6dd117561773bbcb73c13f9f5d355f0bddfac4094e1a9b25",
      "obtainedAt": "2026-10-02T10:42:38.887Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=kOIV9qgLmB8SY8Eg2xgAiKzqfNhcWyFAZW1ykKxlqrkRN6YC4n8OiVQGoBrUzt4kyMznwgM7USy9/40ZvIC6Bh21Gs0fdInkbPiukJQHKo2B0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-072-3",
      "name": "06_2026_000620-anexo-i-cuadro_caract.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "9e16b9361048f2b3fa5030d63dd7028111a92e26551c0aa934e1a22d8ede593b",
      "obtainedAt": "2026-10-02T10:42:38.887Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3o2b3hXSNQvtC6BIU6sFRQAJPT0JMVnRAPrEBTFh3Vo1BIvIkWFwU0WB%2BIgCmrTheSHBg%2B6R9A4kl6H%2Ba9tNk5ohzkknso0Xs0Xor1VHhUk//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-073": [
    {
      "id": "doc-t-placsp-073-1",
      "name": "PCAP SERVICIO DE TELEFONIA - diligenciado.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "0c28d8ec3cc69e4b29eb605a20f25646a18b2d4bba0ec58daabb575afd0186ff",
      "obtainedAt": "2026-10-02T10:39:58.184Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=5dHTi6H5X9y/MP24Pz%2Bp85T3kmjjCrlYByhMQUbQbHRjULozRSkuMVxN%2BzfSFZgg8GMPUsZrEZZZ8OLTyGzmtB00xSiOwMqrFR1UlrMj53qCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-073-2",
      "name": "PPT SERVICIO DE TELEFONIA - diligenciado.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "785e73810a46189164b582549548018b7d79d0560946d5689559c0063bfc1191",
      "obtainedAt": "2026-10-02T10:39:58.184Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=dJ4XxopAHp3PmvdgWjL%2BESObUddWZ2Ih9lhtvAkVMdi31kbu4Uy9ZF2C8Trg9PRzMo3W6lMVkELebBUrPupbnJKnT/Yv2lOL2R8jEezHhGPDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-074": [
    {
      "id": "doc-t-placsp-074-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "3d9c46b1a4a0789ab51d3f8af3680a114dcdb9c7c8f7840629a82704ea514543",
      "obtainedAt": "2026-10-02T10:39:55.887Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=QT0q6baVHY6933kLybHA1BbEKAQHE1af0aGfptS%2BszXTRlFUea3JLZmD8XI3Uw2vWeMZoXzx3kXxIZ69w3FZxKIF8okpYTmlMg12bTiiU5yHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-074-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "04c1fefb36256af607e2c556bf47f3587cd3625e7380c1504f0e76b41b7c917b",
      "obtainedAt": "2026-10-02T10:39:55.887Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=AAPA79BN9DkG7BxUYW4CNp3lj9U4%2BKct3TkmIv2zjYzNl8FktnxyUXxQa%2BqMpLkz6yYlRM7C4arXyFQkKxYFUH%2BC/lVGqc2x22JDOPpPlhr6CYyL7SIrUOBFfNf52ZqA"
    }
  ],
  "t-placsp-075": [
    {
      "id": "doc-t-placsp-075-1",
      "name": "06 PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "7af3bd9b44f6953fad8565607f932295854cd55450592a36db8916907a9a9e16",
      "obtainedAt": "2026-10-02T10:36:20.689Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Pf2sd4ol%2B9grRwEhXuDilTV9PMn7UhOZC%2BLNPyC6X4tYC7wAuHcatcaaswTy3FIaNLQH8DUawJ8cFh/EL55jZzLseAjcUDYRMzQoxTm9Lh21aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-075-2",
      "name": "05 PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "ccc6292c6d64b1e63674f32b3124fcc4400904ef51756ff29094a2b48e5045fa",
      "obtainedAt": "2026-10-02T10:36:20.689Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Q1jrxtmFqRqDTbVhYOcCNN1zrhqsXSR1/r7mPsJCNOciGtVRBwRlwIJdZN0BWIoWU7r2c7UM4/jyNUw557GO/Z%2BlBZYvOs36GSL4ii7V9173GVhXrFFqN7yFncy7YfRK"
    }
  ],
  "t-placsp-076": [
    {
      "id": "doc-t-placsp-076-1",
      "name": "PCAP_FIEM26/E0064.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    },
    {
      "id": "doc-t-placsp-076-2",
      "name": "PPT_FIEM26/E0064.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
      "obtainedAt": "2026-10-03T19:46:51.521Z"
    }
  ],
  "t-placsp-077": [
    {
      "id": "doc-t-placsp-077-1",
      "name": "Pliego administrativo.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "138c985e010080fc8d70c2da820a75968a5cc95db371f03e27bfe94dec24e8ed",
      "obtainedAt": "2026-10-02T10:05:28.485Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=n9QSmY%2BpuoSAuYYSel66XTPLK8dm7pmVxZT/nQ2PXppC0Ch6GBpnkHm0CLcjEys2SBjtHB/I7v/uEWy8TbKU5k7ToMNdSqeoeugo6dUwTmFt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-077-2",
      "name": "Pliego tecnico.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "0788a3dd868a813e4cfae429bf52fd425cba6f3d2bea136346f453113256901a",
      "obtainedAt": "2026-10-02T10:05:28.485Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=voTDc3DgMq7Xdukz2hyII6CgEVSbsSPt3xdBC5pSvlcRB5UU2yKdzwt0ZVp%2B6adz//aQCFQrEP8UiJq2BmtqGLlpwKdh5DUd9wwlVokZhBO1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-077-3",
      "name": "Anexo al Pliego.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "899332d5cf8451b9d087e2a72bc319abc8ed4d40b4bcce6e709ade727cc1ea70",
      "obtainedAt": "2026-10-02T10:05:28.485Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=BMT/xt3y/vF1I06wvXFkkDD4E0Et4kRFPuAT7Pyd%2B7Ex9V/P7Ks1EEIYtLw3paFOQcF8PakGTHtR9DK6OQGBY0f9sWi1lQfxrwQ6sEIyaR1JOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-077-4",
      "name": "Anexo Aval.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "754989c8c46a1efeb687ddfc47e837a08fc3717efe7f8b0f312cc66138f546e2",
      "obtainedAt": "2026-10-02T10:05:28.485Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=wjCDoocgJyIn%2Bw/MlXt0NlwxhyPGLtXKfJMnFQ1jsN354OClGa7cyk/E0bIC6BAfyIc/UD%2BSkgi0oKMwBUUXnB8jvYiHKFOPjnMtjt9kTw%2BCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-077-5",
      "name": "Anexo Tratamiento de datos personales.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "3c65b1ae42f443b4441d3567fc9d168e6b6bf43abcf933b329cc267c918f6380",
      "obtainedAt": "2026-10-02T10:05:28.485Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=/rqMl54ts%2BNWDR5sLCYaODfRphri%2B8e9eqXvIKuUFenClcFfSR1dLCgfFLNEXmKxPFqgHjLS0O%2BQNttQny5t44IWDsv6t%2BDqc8Qq666NAy%2BB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-077-6",
      "name": "Integracion solvencia.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0cc99633e4fd4ca6b8d49d3c71bc2366dd694aeafb0bfbc570b444d54eb1c9f1",
      "obtainedAt": "2026-10-02T10:05:28.485Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=qFPgn%2BSQUm5v6OA42bEdzH8XcH7F9%2BFjqqOGazUWwJXJVLDEaF925ouoGTRNl6AEKJhc2D9cCv5MNdxXJjaP0O%2BPDxcEHHXtiJ3zeENX4Ntt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-077-7",
      "name": "Anexo Seguro de caucion.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "7113eb7bc68f2e61c084ba3d326525727d8fed2d23900443874276327c5a4fea",
      "obtainedAt": "2026-10-02T10:05:28.485Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=cLUvA7JZDzryhAjWxRfB45zoB0FWBJJxSJ%2BwhFUEXyyp%2Bd39yl67tU6MCTbWP9FDAoC7ycUqbl1UIrIBRGYTudrnpJ7q5u0zgRwb8PC2uS4//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-078": [
    {
      "id": "doc-t-placsp-078-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "5d2763c80aea253dd58dffe7312592f27f65ff63f0cce5dbf83e07d8cc1de080",
      "obtainedAt": "2026-10-02T10:02:57.150Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=joDphBXcnM64yhIdpo/lnKTGAwsrZZosKeDCIio9Stupuojk5iBwqqnzIFgXaI7twIpATAFa7OWoR/X5kUjpxHgY4Wl8e2ucXTa%2BQgxHDa1JOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-078-2",
      "name": "Proyecto bomba calor.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "6617e80cbe18606f6dfbba7bd4c523a9af0dbd3a64af508312bf26fe1587b05d",
      "obtainedAt": "2026-10-02T10:02:57.150Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GDsXQcodSThc4QEZ0rwqzHsBXBUI45GzIQuWBxt/Gsa/hVI6Og6woeaz59nNpTs122qxfgJlbW1fJZMLBsnMz4Z/Zt1fjCa8kxWywIV5F7H3GVhXrFFqN7yFncy7YfRK"
    }
  ],
  "t-placsp-079": [
    {
      "id": "doc-t-placsp-079-1",
      "name": "1787830730285_Pliego_de_Cl_usulas_Administrati.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "1c484f8fa43f7d529f424b3690c41975b34efe1f5f886d56376a5fcc8574de13",
      "obtainedAt": "2026-10-02T10:02:53.302Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=HcOy0qNOhIqRwNDVV8j4JlFTwa34o6b7Zo37htisTryicRsUbQNM20QeEzUB%2Byp9eKepJJBkdxxlWIS7zFYLyF36tocgv1t8MDYaUr2NtQmCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-079-2",
      "name": "1787830731603_Pliego_de_Prescripciones_T_cnica.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "db9543a99fd3e3eb444a6856068c7150fcd44ea2f6fe25cac91b9c75478386e8",
      "obtainedAt": "2026-10-02T10:02:53.302Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3BOCJxc0Ow0tDUitL5mIs1vSBcfyYh9wrIu9cl9uBR0EbmAnooLs32/GQMEkcS93ySiiJtRaSKi8PxD2wWtSxzK2GX/blqiU8qky3sze8fU//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-080": [
    {
      "id": "doc-t-placsp-080-1",
      "name": "AMSECCD_23_002_PPT_SOC.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "276e071b110f42e8a9aca219c3f8a497f32171e4f19cbbfa2485e9bb2f3111b9",
      "obtainedAt": "2026-10-02T09:57:52.964Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=4462a5a8-139a-41b3-818b-b90466eebb5e"
    },
    {
      "id": "doc-t-placsp-080-2",
      "name": "AMSECCD_23_002_PPT_SOC.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "276e071b110f42e8a9aca219c3f8a497f32171e4f19cbbfa2485e9bb2f3111b9",
      "obtainedAt": "2026-10-02T09:57:52.964Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=fec3f861-b005-464f-8339-dccffd056cd9"
    },
    {
      "id": "doc-t-placsp-080-3",
      "name": "AST_2023_011_InformeJustificativo.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5999496d107d79e0108aa7f6398b56f8e19438c8b4b692fdd9b2afb128181421",
      "obtainedAt": "2026-10-02T09:57:52.964Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=e9bc309e-a4cf-4d68-a556-3c9ecd42e27c"
    },
    {
      "id": "doc-t-placsp-080-4",
      "name": "AnexoI_InventarioEquipos.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "ec5209053f5a9a50059220681b03d9262a79a1432d2e646571d636e9511c72c8",
      "obtainedAt": "2026-10-02T09:57:52.964Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=17681ffc-7c77-4730-bdba-8719a28f8756"
    }
  ],
  "t-placsp-081": [
    {
      "id": "doc-t-placsp-081-1",
      "name": "11_PCAP_832_FDO.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "730f5422ba6857e982eed73b16ba4b25a3dfecab2f6c8c99b6e88c3c905b6867",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=83oVTpRmxiO/2TL2JyZDXmiDOt%2BNFAkA2wkGfxaK8PLFOhPo8QLot3gCklDaOfPUwCGIqXpe/D%2Bs1QCrLTtBUDcKmqguzVHzWJpbj1YV7FzfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-081-2",
      "name": "02_pliego de prescripiciones tecnicas.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "27e2f168b311b78b9fd58a39da3a7e329f47ccfbca1f75823abbbc8cb829754a",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=jeJLxlq1SJ3X2N1GWal2IuZH0zzBVXqz8kAie4RS7SkOipAXIex3J7fQ7mvfpIcGGLmUN7xWBiflt1sGMNa%2BXFDrG8o5SdgbDd7W5wTTE3xt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-081-3",
      "name": "Anexo V Declaracion grupo empresas.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d0993b963def0a7f81ea9aca87d443ac7831377d157246ddf10785023b1b1c04",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=WQAhH7%2BYrPFAvVh8HAHz4bu8mhzqBjmtoaZYzcUdvkrtKzHDYsUWF2bgPQFd7APScs0f/QyWcHzT%2B%2B6c2pzLCpzcsBqHvyRHLPd1ANcYWPV7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-081-4",
      "name": "Anexo II Solicitud participacion.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "83ab0f4512956a1cbba368c09a9719de50836073ab71b99296cbdfdc5af95901",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=MMShmC5gX8X3ZIwQTdNXk/oncd4yijtGb8yzs1uhz/ZT4PZ3AMXHrsTRS%2BY5mOtsEzKMGxN%2BbyC4C8mff%2B62ATGpVRGTKa6KcVDcrTcbJOyCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-081-5",
      "name": "Anexo IV Compromiso UTE.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "e82e7ff2d2573722bb15a05be2f72a60139fbee121abc4f98cd0286ca60ab633",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=jdA/9gP92rNWJ2MKqQXV28mbA7iNZbQmLvZBwzLWMq3ddmMm662I0kX388Du0D%2Bts2V4OVzKdxGrNSd2l0b33F%2BppQR2eV/bwZiYHCNQ0yP3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-081-6",
      "name": "Anexo VII Declaracion discapacidad.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5911d2ff37c0c005b2500e9215a63754d4b5811e19726ee7655046f6acdb43f9",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=FN%2BR%2Bzwk9gRXkQHKqQ0Hqo/UNhS0Cw60/vPWwt615/YH4qlnt01CIx4ahE6vJ1wFGBOl96uQ7qPAI609jU6jxH6P1//ohcwny3iZzNgmv757QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-081-7",
      "name": "Anexo VIII Proposicion economica.doc",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5e26e310e479c81aab8253e2187766ffffa6ea5f6ecf9d37fe91cb400b6cbda3",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=e3dKINLlylk0qUE%2BWckrOnNJiJ2DqLpQ7WUDxM0kXkJipM%2BaAcQcelvdMBVeiATvGMtm5EgBl/lUZraWABYQnQleqSIynXF6ptnzIkmdXS33GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-081-8",
      "name": "MODELO DECLARACION NO MODIFICACION ROLECE.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8d2992d1b17b5f24dc0f53a0d054a926f0089b8229b91d609b50f411301cffb6",
      "obtainedAt": "2026-10-02T09:56:51.907Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=J5CUR2R7qe39A1jBfTE%2Bt%2Buod35XV1gsvebCeS7sX7HUdKpKba443U9Arkds3DzhKtqva67mrwQDIf3FTRhF3kSKwhjcSDmUqdhd3Xqe2gT6CYyL7SIrUOBFfNf52ZqA"
    }
  ],
  "t-placsp-082": [
    {
      "id": "doc-t-placsp-082-1",
      "name": "26 285 CRCP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "7a9774e3e86e04cd8c2f382e819cc3afcac2c37b3aeb3d4aabe3d6b6485edcfb",
      "obtainedAt": "2026-10-02T09:55:39.316Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=kqZ3OMSaD3aSkflPE5jClJprEaPySamfvNhsemHhM2%2BhdnbzECeq/htXySrG9DFYNRTHBLvhzB0crCt%2BzGnck323WZGUqwH4ho33%2BhVde39t/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-082-2",
      "name": "26 285 PT Servidores AGC y Sondas de seguridad.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "962c2255853d90f9f230a5bc1dd68ffe4cd19532b7c6e690ef29d7b5e19ae837",
      "obtainedAt": "2026-10-02T09:55:39.316Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=%2BB3YDJXBVDYSkebzZuXtQLjG3ghz6wRHUX0zx6MRDnKW1aoArhKXfPCEvNbhyo%2BJfQq0pfqh7IBI8wTv4rk1R2nFZI%2B4w1dnGI9hcwLX1F3VTD3T98KC0nSgQFM0q%2B5s"
    }
  ],
  "t-placsp-083": [
    {
      "id": "doc-t-placsp-083-1",
      "name": "C-85-24-PCAP-tras-AA JJ pdf.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "f9b173d656918a81350317842889c6f13cbec6e18a0a2c614390e69dc4a5e66b",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=6zv3F8stD2rj6ODCy9HL16NJwcjFIZzVNIB2iNL6zkUAi2CSFzzUPCLpphRnTw21P6zs1yB/fZkOt1WoD8V8x5YzBG6womPnpOQziIyWMdd45ClyWkoJ44mKM70IFcOu&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-2",
      "name": "PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=ia6jkS7x/2uyIWAt7QGup334qDd8zb%2BfX4NiJqqEzHAPbC9zEzM/%2B%2BnAMgVUDPT7q86gUS4ZfRb6vpmh12hIW0/Kg1/qscLvvW4%2BvZaF1Iv3GVhXrFFqN7yFncy7YfRK&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-3",
      "name": "espd-request.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=mfHINfaw57PolqeGKmWAkzI3UVMi0wgRRpUK3jtAwXaAqW3MJZxzk%2By29wmDDxGw/80QpUJ8iRvpx9BrQRvxhq8Tys5PKAMLcunyEnZ/owh45ClyWkoJ44mKM70IFcOu&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-4",
      "name": "Informe criterios.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=eJJksla88wlbxDV%2BbUvEBCEviErGT3cuIPbxhzQ5QJShPNQSaJrWzUBWdPbVm3iR5hyNun4hDtkT2LiwE4VomHSg9ggqLsfDC4DOOuT%2BbQ145ClyWkoJ44mKM70IFcOu&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-5",
      "name": "ANEXO-I-2_PERSONAL-ALUMBRADOS-VIARIOS SA-1.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=4mASqIA0pEUAXlpliRfsRXnrfvFb%2BB7liVbH1K%2BkSlJDTc9uWW%2Biw9dV1WIJot1T/eChXZJSYbu34fHRSXmLS00K10Yd7fUhEybkbFyNqNzDdQD9RyhUmzT4jZ2In4zL&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-6",
      "name": "README.txt",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=9UKIVNZV60KANzwqysVrufPybL%2BpVek0N6yJFdnC79t%2BLdyaTZvrBwp/jVBvI9LsfS/lV2J2utXNEZfBghRXIdQvhdheuDI5ZkV7xpgPrUSCx2e6p7hqtlp2aFupgHMr&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-7",
      "name": "espd-request.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=NdP5oRgl7Skdcxzo1VhaIU17p89iVoLlLt25T1ZYGLMaVmX5syXuchcpsXmPazSDnLf4LkbSYJD71b1t1TUk3oNILC7vtbyFxHcHCLc1NRw//q7NB2iMZvNyf0xrJmjt&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-8",
      "name": "Anexo III Documento previo SyS SIMMA firmado 1.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=gg/t%2BEK15On6WWMFHgdgnUdfinO1OxdZmcZSnm5JJ8UspLPHB/nBHHYqErMufqPWlBV3q8CN6egJm3jvL4zUB5guqR0MmqvqLo0M4R7ddBC1aXEvq3KHa/AEHgtDrQw0&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-9",
      "name": "Informe necesidad.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=SY1AHqZwyByLC/1J8vw5HuBQq1oulEy4a9ZlWzlIhAvUF7HUr9rN%2BPv8gn2YWKk3u67XEzmTYiPKr%2BKfMn5OqqAlYxXODarZYWyjETV/ayu1aXEvq3KHa/AEHgtDrQw0&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-10",
      "name": "ANEXO II-1-CUADRO-DE PRECIOS UNITARIOS con_descripcion-1.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=D7J%2B5%2BWnYbiupEbWifqtq7gDwojlUClIWmfWcswieM1vNdWioIFycR2ixTfcRx6aZfD4lz2ZI6GbUutsi/e9Vvhg0DZtvHnUNQnrmG%2BNAdbfdyQgZAdTm3EfcUAC7CJ6&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-11",
      "name": "ANEXO-II-2 CUADRO DE PRECIOS UNITARIOS-unitarios sin texto-1.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=WP2c6esbAGG%2B2isq9WWwVD1akmb7RT/72Kdcn5DZ5zeMrmFc%2BAk%2BlOlQ%2B7Q%2BoJLwUy4kuakDS6kQqkBnJ4LBG%2B7MRoWmGT3oAfst4YLhXxcC1/zDIE0Kw/PWNnLS0Z0z&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-12",
      "name": "ANEXO-1 3-PERSONAL-SOTFLED.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=r%2BO/7tA2%2BfmM8L2XkT2PmXY2s055lhQNnbmJh2KAnVyvhtg/0lCNjz%2Bv9HZKzBbxtedZrkbQF1xl0o5tYrJO5%2B7Je16i6XQkel7P11b5wkfVTD3T98KC0nSgQFM0q%2B5s&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-13",
      "name": "ANEXO I 1_PERSONAL-UTE_EYSA-ALUVISA-1.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=r/eozwu1pzNVA%2BIP60M6eVFPQI6lvKbqY61y6dARi8Tg3PVvuw0DoqeesFuo9eP7O4UG%2BdjoLthaqKUT%2B1hyy1oiyMu381h2cNydc0asFnp7QB3HKyQaFUExmUVQCerk&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-083-14",
      "name": "Acuerdo JGL apro expte.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "123888ba05314fdc94b44c39ee779fb35ec17832e7f998d354ed3b925198c109",
      "obtainedAt": "2026-10-02T09:55:06.344Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=93fM9xRGpS62dNpBwqQi0UA8fgX6ZIFiEDqEhVd7yR95rPjQxSGXBFWzAGV2plgETfDTjDYzUfIBn3eUT%2B2pAWcfyRRyDvzmLl%2BWs1qprsR45ClyWkoJ44mKM70IFcOu&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    }
  ],
  "t-placsp-084": [
    {
      "id": "doc-t-placsp-084-1",
      "name": "6_PLIEGO_CLAUSULAS_ADTIVAS-4.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "632a3bb6530d45bee6508fb0e6ca18c57d0208f16907ece5b96644fd348a0782",
      "obtainedAt": "2026-10-02T09:53:30.801Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=TdEdQ8mATOU0EyplisrlMjx8PM%2BbAGQh0FBFWIOOQvDoo5l0HzgCCs0cNgn7NKAh/wV5AUnuXxDg/Ls8MA9uEdQsxAmX18v62fA%2BX39T1xiCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-084-2",
      "name": "1_PLIEGO_TECNICO_SEVILLADIGITAL_v4-3.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "760ba6681d656ef0c1be333dd0b355a7dbaf95e8de0fe901da3e05b0bbfb46e8",
      "obtainedAt": "2026-10-02T09:53:30.801Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=VZfixEqvGZiO7eeYt3rZ1N0FL2BcR4jHUE0QqvJv6qFrveTyNwGtAhX2t8pIhzOOwXFWr5QSm8Wln4tu/lJAXbY8V/WRtGDGIILhpxbOJK4//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-085": [
    {
      "id": "doc-t-placsp-085-1",
      "name": "04_CR_202605PAO003.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "7573f1932a9d91e2184f48e090397fab38f087962140c3503db821793fe9543e",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=qbzFgh%2B3o8Y8zXXeGFN5gm27PGTepj7jq41V9vz5qsmwnvqiCFsvjRUdcycCl5NtfdOwpSYk1ALe3dVQnjl18ggGotj737pa4G5caiN5OiD6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-085-2",
      "name": "02_PPT_202605PAO003.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9eba4246318123a9b4447869e3393f4c937fd35ba828b21876c863c8c9e0a574",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YsAMK8gDLr5LrO3F0ZjoDuahS2JYsRwptY8HHBdL/rnmrD2bAT%2B0F1fXIm68bX34BBrZDFoE2q72/6372AuGuEzxvVir5F/izepqSjlutE2HAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-085-3",
      "name": "PCAP_Clausulado_Suministro_PAO.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d7eba505796ad77d97a260e48f256798b0ad06f44f01db90e3e9144556582820",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Z6XqTS4bJibCgIpOFs/UgxUuq0cgpuEVSk6oKskWEjbAsjlpEedhvhEGHBI617O30txVdII66ol9VZx%2B26eCblL7nYs6tzdwy82VqdmsbLpt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-085-4",
      "name": "Anexo A_oferta_202605PAO003.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "e412a8cf4c56a22a225e50158ddce6d42c65979584194e2700ab5424bbe36202",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=4bWqnRyBKbYzQCQUTjUr7iStrcfB6ApeqpjBwo6ThnTJ6T53olBFYt2fnUhNo96DSREQyYh9uzwx9WlPqeWCxZ3dw8uCIp%2ByqA5DMVjLYCpJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-085-5",
      "name": "DEUC 202605PAO003.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "872a3b980d6fe10c6f01c4f7070b92f2e82cb5f7fcacb6cc3ca75a6df79c712b",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GZGae6LQktQbw8P0skIqcsSIwrLmBNGQ3SI0usF9O/oLVxB8OvVBmBJJWOsQeI/DhVd/R/vAn0zOfY/20sX6nm4psd552F%2BCj7jYYqrjgia1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-085-6",
      "name": "Informe Abogacia PCAP Suministros PAO.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "69e825fedeec995bf55e8d0544cf4887cc389c9f8451266d2064677e028f1ecd",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=zrbFDdriMTUU%2BwefbPOExdgDn5BLoaeAYepP1p2RSGUs7pIaLPxOenoOytJ0t3GfQRbrc0HhItD5u8fDjUakYxeA0CrJu/eXr9GRVVAo9PFt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-085-7",
      "name": "InstruccionescumplimentacionDEUC.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d7758409b69b3733618e3fb81e5de6aa3a60587af37c01670958d81a8e986a9c",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=mUcGUiJ/2vInSHHq/EL5PVvS94J7YQGwrYi/Is0OuJGXB8Fq8sTHK3HPkB9u0i69cZhonrlAf3ojZxgdUgzqf4D0uxt6Op7L/qf9fT4nzW5t/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-085-8",
      "name": "DEUC 202605PAO003.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "79929909610a113282caeb567d39aa5fe8e0e8c0dad43e1d0b8124fed3c87db9",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=487JxY/Ek18R6ijsOckVuCr%2BQQCCbqyGKz5Mvx6I%2B4EAygzXXXqNtlnkFqeH50RCXEn45j5%2BIakWXze0r9ZdBhW2N/7SRV1w0xYkyDZ3aVuCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-085-9",
      "name": "MSAN Anexos - Suministro PAO.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0bb01e3a09821b49f63d72180cd6936ac44b8b3a0b50a28d873e4f78b3ed15c8",
      "obtainedAt": "2026-10-02T09:51:34.952Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=9u58PB8XjSFrlKfnIxWMSwl91p0OqCltE9jRI/1btUP2/xz0zM18Yl/rT0bvK/lEk3dol8/7fWoi%2BHf7LSkiMWR9i/NpJU0Ku5DGWZPpEXYZyAJWGsSt0OzTSTyw9JAs"
    }
  ],
  "t-placsp-086": [
    {
      "id": "doc-t-placsp-086-1",
      "name": "1775553662675_Pliego_de_Cl_usulas_Administrati.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "fdd946925dd44f780b0f797c0b1f87f962121645842415beffca62ac62ba512e",
      "obtainedAt": "2026-10-02T09:51:26.432Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=IDFZq6RFQhQ3nEI4NKB/3X3Ti7qL9xa1Jcyp5GKVsPSx58t9oc2ISswszF%2B9px2kZK8ZLGm16ZfL0WD/AUVY/ttNXB9GvTAcb5h9sEDiof33GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-086-2",
      "name": "1775553666857_Pliego_de_Prescripciones_T_cnica.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "60ba0c6f0e6a7055b534e063c6d5f5d4f4e8c8e8e144cc84b7b8b7b335ed184a",
      "obtainedAt": "2026-10-02T09:51:26.432Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=wP62GvtzBGCLxLK2KyoeGejie2QeY8vDrcQGJgdOU7U88rRV//dVTZH443AV2NjbKarxJwIwsAjJCOq2cqmmPlyZScSBlU0HOl1O51YRW1AC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-086-3",
      "name": "1775553665345_Pliego_Cl_usulas_Administrativas.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "df30484b978cff77ffd244e7ae00d21f3971cc5a679bd5c91a38096d15e82194",
      "obtainedAt": "2026-10-02T09:51:26.432Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=QWinW4sPPGO2yN5vJThk05i%2BH%2B3t69JZ%2BQOlP2P7rTLrZCozsTyNcQA9a2gExUj7kYHZT6xSzUPNvtLYZzbrJ5DEG6QpJl2djGLXgj7XWsC1aXEvq3KHa/AEHgtDrQw0"
    }
  ],
  "t-placsp-087": [
    {
      "id": "doc-t-placsp-087-1",
      "name": "3690502-PliegodeClusulasAdmi-001007PCAT_STD_OE.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "2e42ea56112fb494e214557cc9a3e9434d8b3efbfbfdfd52996df27d72a8a0c0",
      "obtainedAt": "2026-10-02T09:50:00.676Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=45b712ad-30af-4500-95fc-668fc00bcb0a"
    },
    {
      "id": "doc-t-placsp-087-2",
      "name": "3690495-PliegodePrescripcione-001005PPT_STD_OE.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9d30f35c8453587da923576a5559ad3eb9b17542551644efa0f50ca742fb390d",
      "obtainedAt": "2026-10-02T09:50:00.676Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=77ca68eb-9ff1-41f3-9844-7533388a23f1"
    }
  ],
  "t-placsp-088": [
    {
      "id": "doc-t-placsp-088-1",
      "name": "1779787188540_PCAP___Anexo_I.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "ebf1e6e38ae4d425bba1a554eff851a7c5f6c9727f021196be393bc707dce59b",
      "obtainedAt": "2026-10-02T09:49:19.245Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=kF1PcA6hES%2BtyG5v/w5a3JzsmXLNfewmbffEZqmzzn9l3IcbKEo2Suvq3VtbCpo8IVQkpJTB8qb5URb6dlsCpH4WPLRBSJxCtMD4lcSbgAtt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-088-2",
      "name": "1779787192302_Pliego_de_Prescripciones_T_cnica.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "9bf2fd3bab54002ebd3cc1a4584bc92655c190623fa61029d9b02f6f275cd01e",
      "obtainedAt": "2026-10-02T09:49:19.245Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=wpLsuPhvZIaEgF0Oj4DPkp5n%2BCLm5DnQZGEpxbPdkiPDXtEdHnM9Iv3glvSM1f0dCfbxSPTq4GSHL1rGqVrCytJbd7x2EOTT4P5o73Dg9Uc//q7NB2iMZvNyf0xrJmjt"
    }
  ],
  "t-placsp-089": [
    {
      "id": "doc-t-placsp-089-1",
      "name": "3691981-PliegodeClusulasAdmin-001005PCA_STD_OE.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "6ab68ffe09d423b810c2ed22424e45ac878dd0bea017bfd7ef401e827186b8e9",
      "obtainedAt": "2026-10-02T09:48:40.025Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=22b18dc2-f180-44d6-91a3-41cd814a9338"
    },
    {
      "id": "doc-t-placsp-089-2",
      "name": "3691968-PliegodePrescripcione-001004PPT_STD_OE.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "43eeb86601896011efd8f9e38513fc08712beef6cba4da62039471d2acbee343",
      "obtainedAt": "2026-10-02T09:48:40.025Z",
      "url": "https://contrataciondelestado.es/wps/wcm/connect/PLACE_es/Site/area/docAccCmpnt?srv=cmpnt&cmpntname=GetDocumentsById&source=library&DocumentIdParam=6f160bb3-9ccb-4fef-9d1b-e45a09804f90"
    }
  ],
  "t-placsp-090": [
    {
      "id": "doc-t-placsp-090-1",
      "name": "0502-26-PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "6fed1ee0788e7c34eaff7f76cafed0225ca8b3bdafa3a4cb1701ffee0dd2b0d0",
      "obtainedAt": "2026-10-02T09:45:10.564Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=whygy/FLN2pC4SMW%2BaihaU3LxesvBbVKRhf48ev3SJaNBiFdTsNvV8ktRV%2B94RyJCTPnnsfryayxorm7V2W%2Bvh%2BIU2YXwRwpNvQoMiu/WnqCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-090-2",
      "name": "2 PPT ANT 2026.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "2ba0756cc9b383b77fea051c37d2d599fffeeb97908736d2e44374f4aeb3b31b",
      "obtainedAt": "2026-10-02T09:45:10.564Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=xQtMXnYO1MvJ04tXn56RIwhA0lNc8smY4dFMKU/Zmc7DnMhnO06o5wpv7bu6Vq%2B0HFRcOBiCH%2BsCTv45EUE3vjeWcgVTwzpBRXNMrgRY8JqCx2e6p7hqtlp2aFupgHMr"
    }
  ],
  "t-placsp-091": [
    {
      "id": "doc-t-placsp-091-1",
      "name": "2026-117 PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "ba2bd9514d249728f77bde0a8679fba28b47ebd0c8001f6f19336b08f65bcf7e",
      "obtainedAt": "2026-10-02T09:43:36.605Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CyyJIMFJ9fAZukLyrYYSxRbF3MjqjygKxoQn8%2B9WuqwBLsLVtiQOor2Rn/J7YtAMIaqtnB0RHVkwHsOaSoovelsyWs6HnJxTm4CM25s1HllJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-091-2",
      "name": "PPT-Y-ANEXOS REVISADO.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "2557bb1943b9c826f72fc54fe4339a61558634a73925d191c3f4f98e243f3bc4",
      "obtainedAt": "2026-10-02T09:43:36.605Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=RI2oQU941SdxGA1LqTLkpB5M3ZPK5DEe179srwoSxtKsThI7MfmPuYejJTOAMchBRz29RyuyoL/JeNEZL9bwmO7MJb1dXVk2pysWNyw/YJrDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-092": [
    {
      "id": "doc-t-placsp-092-1",
      "name": "2529520-PliegodeClusulasAdmin-001001PCA_STD_CA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "0313d2ed3e2cb1034a934dd370bcad46a0f2e546cc919d6f6cfbdd61918bb79a",
      "obtainedAt": "2026-10-02T09:43:31.723Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=9QXXXr1Y%2BR01l5bFu%2BqlP%2BmZ2lz4LDrNvrHKTi2PD4F/u9O6f/bVdzlntKzhtTLdo6F3mlQGGs15fsxZlakEMgdupaG17gtbtqlecBF4R6p7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-092-2",
      "name": "2528296-PliegodePrescripcione-001001PPT_STD_CA.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "f8d02851428d9d1a852bd9c8587f1c3bea024f128ee68a1c31ae9632bc27f1a6",
      "obtainedAt": "2026-10-02T09:43:31.723Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=%2BqsKJjJ%2BtvLSyCeCefFFuloUKWjlctXFXhvVmDsJZ4gaaaE0OIxqjF3Tr5myY6IG0LPRX8TjdC3ghw1qVplgvZMbDFKxzbldqJinmp1ffzvDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-093": [
    {
      "id": "doc-t-placsp-093-1",
      "name": "146731762.PDF",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "781694edb789c3e2f21051f1a44ae882a793f65ac49026057b5416b14a1c0357",
      "obtainedAt": "2026-10-02T09:42:32.466Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=7dJfD0%2BGx2EB/VDdf8jeRdCcPVrXrs/mWJoytPKjypKH3iVQ0NIpIeAgaCESZ1CfUb9WNxGOcgzq6swgAupTwooX%2BkTQpoiia/%2BaWg5183y1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-093-2",
      "name": "146731663.PDF",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "d16e00c405eade532c0cebfa825faaf9a48bfe23e2db9738a1846a1f9ae22747",
      "obtainedAt": "2026-10-02T09:42:32.466Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=uvYCNf5soaCgyidwgo6t//zaw7bip6/%2BbvixK60Jjnk9rYVeorsjhebAaaa3ehPZZ1xaB97S1M/wxpDmDTbRwLfC6nb0UkvyXX%2BgrwB2k0/3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-093-3",
      "name": "146731835.PDF",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d56c1a21606813ac87dbf14b44b023957cdb53ab41d24e2eeb8242957cca59ea",
      "obtainedAt": "2026-10-02T09:42:32.466Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=mO78gqCSzwKOj2s7EHdlajaHj5vJ2g5SqLpDkXOWg7dq%2BoNlkOTcNxNIbyYecpGuLXM7AQ%2By8UxUcsbD8yVmNxIVgZPZpJ79X/1H2dQEHpFJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-094": [
    {
      "id": "doc-t-placsp-094-1",
      "name": "2026-01226_PCAP_VF_signed.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "6a7c49c4181aaeaeb11779ae17c2f85ae715c97484407581736bb05c79e062c7",
      "obtainedAt": "2026-10-02T09:42:21.766Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ZK/t0sIRMBg1JI%2BbFeRD4Xl2SKwBnwvFfLsQf5h272neqcaq1o0ECeyH7iSyenJcnU8Yd8XKE1Z97hkMVyWV5y8SQaz9K9kEoaC2hpCbOt97QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-094-2",
      "name": "2026-01226_PPT_VF_signed.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "4629ce2101e4b32f7c5c6608d8409ee0519ce7a439a7675f01810ed729a36e04",
      "obtainedAt": "2026-10-02T09:42:21.766Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Jxus2S103E9ZBWDhCg1qUfue3XjWHJPUJrSZns3m6O/IBSJOypHsawZGFKXMuQdivPecuUbPsenIk6rtay7CQndDqE%2BGOeVzXNeDRJiXNxN45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-094-3",
      "name": "DEUC_2026-01226.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "c4ae7e06cd3b826b38931670d6dbf84b4b418f6c0c71f38ceee1ca5a2969fdf9",
      "obtainedAt": "2026-10-02T09:42:21.766Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=dG83cesgEERKwxhNnwyXUKpjtGjFeNpAriJm2Hj9L1s5H7lTmCJeHI4IwJJy9Wmdud6a5XnEjcSEX1CCDaWijeDND8vYc1a4Y71TzV/RWqYZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-094-4",
      "name": "2026-01226_Nota_Rectificativa_260917_signed.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d822c63dca25a9e02fc763afb1294ef3205c5b1bffd6485ff9045a3f803fc422",
      "obtainedAt": "2026-10-02T09:42:21.766Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=jikdtFpMYSjDG8WrYbchLeXpgFUkvSUDuXp4z8xsb6abB0qFM8Pg7L8yFiqH4Y0JRYnlaAxLAcTeye8Xae2u68BzTyJoqwqHV17cYeWY952B0nvVKRzfe4rpHcnlPhSZ"
    }
  ],
  "t-placsp-095": [
    {
      "id": "doc-t-placsp-095-1",
      "name": "3451_2025_PCAP_ABIERTO_definitivo.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "39d1999a8ed969a5fc08e90268132339a0a60c2c3c0c33e9db03d290afa04c4b",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=3%2BuK7UZzJv6bR8rwKyCuerqE6%2Bce5V1lmRLco7BUUDQlPcAoj8YHLftC3resx7sZD0Mjeqqnx6VmotaYPZSi6ZhkdjBjkom1oHufykXwx5oZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-095-2",
      "name": "04_3451_2025_PPT_ED05.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "1757f60d2d97999c16d2bb28f11a658fa02109c0954bab8f97630484d12d71e2",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=Ym9UfNh3tgnHIB/lwKVC7tSkUqQRcb0oZV5ekTqK0PaAKT5lV4QZeXFzS3z9p0EZJgLQDMsvCsjDryy13KFNi7mzWvpNO92wZbyl8XYb5gtJOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-095-3",
      "name": "Anexo 1.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "224f3021070e097d40b7b42829c369cddc87659e5366bece3e2457069f9401c5",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=g9lp4k7aZvR4b%2BAQc2ssae17B83tYocykPL2XtO8DW%2BHVY43/qFBAE0QjHujr%2BH7PExGZchY2yf76%2B3rXH1OGCJzASTyh6l5Rxs38kQdzs5JOVDbGCDM%2BMigrvuVS7Rv"
    },
    {
      "id": "doc-t-placsp-095-4",
      "name": "02_3451_2025_Informe Justificativo_ED08.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "c9d7312ecd00a66b9b27062665b721051ff13e4e6cb473bc70059ca94b67f5c5",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=IAANW/zfTfILwlkw7ZKXnfs01DfNfvOU7tukP%2B%2BJB7wMi78Vcw5KMX1CY/cXWFugOKXqoU/I%2B%2BAq48wEz30TZ0vXb9jHZdc7i3fs6VnuSKyB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-095-5",
      "name": "Anexo 6.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "1cdcb5f12d5bd0f0f93809696da2652696f115561227051f443119a5d5148073",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=EZp8h%2BBTf%2BGlXMlcQM6/Wx%2BpUhIafmC%2Bus5lKbdkpW4aMZfjwFdI3azT5zRcPn8pjQsbVDg5yWC/OtIKM/VPp6W0MHfd1INx5Lty/BwvDiIZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-095-6",
      "name": "Anexo 2.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "39060e277df11e7c41221ab41a0a418b3d486a6793158d38308f7f6538965fcd",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=V8i8T6uBTJVbqP27cwZFPdGdx6/vkOdhx06EBQe4so9XJU8lexEY47dXhoQJMub/kUmNxc3Hf%2BLFpA4iCf6MlG7YFmXcgD3UlhMlCehhWMV7QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-095-7",
      "name": "3451_2025_Informe insuficiencia de medios.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "d614ada69b7d1098e83278a31e24ff9d399dd15cbb046178b92e02a446e756fa",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=hit1MYRcVHuJp5WYVT/n1odsygySNTZ2Ukkpm4KkkX3eQfBs9aWfQCBnY5kfZgWRe2XDau2D6Jj1A5PJAm7%2B8hQpknwF7/eVnrOwVZDgTBHDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-095-8",
      "name": "Anexo 4.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6e6397b9cb7ebdd678b5b2ca71a755a8dd11cb0f2a489cc614390bbfea465046",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YwBuLoJ6iTvLIrJHW2H8aQBj5oIx8e8xRfvvUewPmJKPiiTUE1FhcT/b%2BTuUVsYFPdqqdW5xB01iM4lQaNAf9nzab2MarqaLhyrAyOtjDKSHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-095-9",
      "name": "Anexo 3.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "43c29e7ef6da5b5b341df6fcfbe99c8aef45afa77ca22021d6ce0c7a302d5318",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=4AgXz1ccE7xMH2Ul2qNc1GEKvIUtK%2BoiUoCVtfs1GpKZQqaR4PQqK10IYh7XbW4rYqQHcb5HYJ%2BDhg1Y7MhYRNFbQhhnr/MqpnO1QMT71eD3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-095-10",
      "name": "Anexo 5.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "6738dd4a4a72f101c8ddf55f2a1811a03a4f3e91ebe98302a0824c885e9b78e1",
      "obtainedAt": "2026-10-02T09:41:04.492Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=p1d5whHT%2BFF7mQ2CjsYlpOsaDLzengPp7i7lH/Hv85Pf7vSTSZ4e86/46NsJ6P8V2OUUO45rlZVLWW6sBhlqwXtZ4An3JpuwYMhR1LRsmLuB0nvVKRzfe4rpHcnlPhSZ"
    }
  ],
  "t-placsp-096": [
    {
      "id": "doc-t-placsp-096-1",
      "name": "202607101 Pliego de condiciones particulares.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "d38bb79ca5b3eb97dec8a55ce5450b99c4cbf81d1463431adf473fe4787f8217",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=zk8NOBJSD337FsPvoJzMsXvt91hxyoZjEhArto3puH39Z1Z748IGmZGS8ut%2BxXSpX4pLzLg29q1p3OS40OtYcjTrVqUvGzrHE6A5OtIaFPIZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-096-2",
      "name": "2026-071-01 - Pliego de Prescripciones Tecnicas Subasanado.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "f940e26d392b67bbb545dfe6b3ef2de23a3187f5ea3c8b7acc40301712380cff",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=KBxdr4vPL1Lkb%2B4GFS9n06eUJGiP1lRWZhETRT8syEn%2B16rEP/dKlbdOmRM6OBJEKfKDIjZ8%2BCD9xAQ3oYX4JbVDOXU8hw3b8c5T7wNlAB3fdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-096-3",
      "name": "DEUC.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "014186931b459d8fc6f823fcbec13efeefd40ae3c7528b1bb662e92b9bc9d34d",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=%2Bf5%2BIM63JEti/Ug2d5rnPtK6BhlU9x3c6/mpXKw97Fih4V9jmoJ4G5zxRuEJu75wRKgDa/LzC/aJmsUyN9N25buaSob8ZvU/z6L3kVQTOXxt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-096-4",
      "name": "DEUC.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "b485356a8200a94b98ea91054d0f6b7c826821c3a1011063ce4754a658035d02",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=CIAGzM8jAplQfynymQo7IdtO7YZ8ri%2BT1Nne971lmtitPeUNQVWI6EAyuQGUCpzW2NFVTFZG%2B43mVOEBVAb5fEPbfuXXCxfpxead2lwRiNDfdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-096-5",
      "name": "202607101 Anexo I a Oferta economica.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "3e06f0b3c6ac3fb8daf8af6a75b7eb0972f30e45e5e844033d1c60fe96673bbf",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=INX5%2B4eoltZZqNIJZCMnPML1eTeuovGmWB4BOJBizJG39SoW/fg4bOXjSvGQ3sc1cbKpX6/BVrqxeOrYkmzbpTLuqlDJ4XJF/sJmi8mrjC57QB3HKyQaFUExmUVQCerk"
    },
    {
      "id": "doc-t-placsp-096-6",
      "name": "INSTRUCCIONES DEUC MUTUALIA.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "567498986d957b7b59c3963c7bb6f2e66c71e0de2509e0369654b9303a41c60b",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=WuTfmkqLvPE5/PACIl4BbwKYJSzsWZXY6PY8kxCedQleT5yp7N86Zpizuwc%2BUbuVptUlHxvuJPD2K/mCwBujRCpSgV68eiydQcpSmnkXi9K1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-096-7",
      "name": "Guia para la preparacion y presentacion de ofertas electronicas MUTUALIA.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "8a021fb4780e4a4165a779e7ece2fbb7766c17dfa1b9e034ca56a59211676d01",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=ACRB/fyHyokjLTcVAu5prfWqiPjU5WE3XJ3YhadqrzcvgOSE6Os5ZjKoe3fBVTIHGc4aeeY/dWJHzByVF43W917rWZYPsT3kWOkw0rD3o33fdyQgZAdTm3EfcUAC7CJ6"
    },
    {
      "id": "doc-t-placsp-096-8",
      "name": "202607101 Anexo XIII Declaracion de  Cumplimiento tecnico.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "f9311fc342af5f6a15f022791425c283430756e82dd3be89af0a75b2400ca5c3",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=qS9Qm27knPxAPSmAgS/RXuigVcTeXBDbHdM3ksx22Ev/04A4DFqiFVtIayFcIvVOg1dFQfrGDh3Xsogqhi5snPbPTcN6gp2gTnHv79GY1vWHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-096-9",
      "name": "202607101 Anexo VIII Declaracion no incompatibilidad.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "3712c28a3c51dbbb2a62cf384e5e4e8eabef7374c95e5aebe9ded5574217869c",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=0fZ%2BlmzqlLrU1yE1TeyaevKKMk8VvZ21Wq%2BCx56sfh//lDbZ46kwJhZU9N6mZt6FWbSQqVD2lFHWvtrtm/fHMatveHdxxUgnx2IOOCnrI7n6CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-096-10",
      "name": "202607101 Anexo IX Condiciones de ejecucion.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "f36e9bbfcab80ed8da557c71137ce93093d1fbf54a65c91286c6780413489635",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=G6TtM3zlVLh4iBt0rco2I4UNoV1fSJsE/iGImK8AWSjDV/5JmYzW6u4Qom4tSmzDN/ttl1e4RoLnsqQgFOixWrPncDN1%2B4%2B1Awl3MDSr8W3VTD3T98KC0nSgQFM0q%2B5s"
    },
    {
      "id": "doc-t-placsp-096-11",
      "name": "202607101 Anexo X Plan igualdad.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "0ac59c20a4668bd647345d3a22315087702177a17f91c74357d5300a9f6a6f01",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=rjfl9pcVcWMcjgwTAicxuG/bIxNZVFW%2BpxUoFpkqthr3SP9A0rxO2EcYk0KKrEuGFsLwrJe1rvBM3XoXIukdwAViQL/d6JFE63qfgjlVq1u1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-096-12",
      "name": "202607101 Anexo XII Declaracion responsable sobre subcontratacion.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "360997a4584c1ee419a62c0c2274786be2d380296a1cf3e51aae1c6a489e5281",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=xk5UmdT1SZVj6qJ3IKFwK3G585cyF3z4Ks43/CBCcVobkI/oy17Q/6e4v02WY55ut2YkGdh%2Bvf3gpqDGmIao1cyJnJV4Tt3uSWwkgRvIewwC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-096-13",
      "name": "Guia para empresas y autonomos Mutualia.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "34f8b67b1170b1567b48857454fd57141e812c19fd608ca52241aa39645b9605",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=LpPIgqBCrcI%2BCWPsDmG0uSuOHGJ7NUtlKmoPWwwwM%2BdoTi44TQg1btxKYTcbdHCwk2cxvUlDfoznMhgCdxgy42nV%2BOcL1%2Buu37%2B/hweean2Cx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-096-14",
      "name": "Codigo de Conducta Proveedores.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "143cf34439ab48ba28d66b333264bec9b4322d2169d380248487c3df824a0a1c",
      "obtainedAt": "2026-10-02T09:39:46.783Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=8Sw2qnRfe1xj2LU0oI0T/nUtAR1O0nh3ofyRi/G3qkkgPD6vbboD/B3ZYwwzAoOvkRrPVdbFex8U7SN5i%2BPrrrEEIEAbQU5NUUtc2244ZgRJOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-097": [
    {
      "id": "doc-t-placsp-097-1",
      "name": "PLIEGOCONDGENERALES.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "7f9b04276cb540a9104b774bb6576532359e6e3e330f738f210cd4a239a262c9",
      "obtainedAt": "2026-10-02T09:37:00.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=GJQwSPdnnS4jJxDSXqU2NRBvOo9esl9NNpBx%2BiPW271lkFG6JR2UC6IrkdJggIiL2/OeA6QFCeaObopdXepPe/EMvBJGVYTljRYtJ3P7/2SB0nvVKRzfe4rpHcnlPhSZ"
    },
    {
      "id": "doc-t-placsp-097-2",
      "name": "PLIEGOTECNICO.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "dcde4a8ba521430ed10418a747aaed0fe44a9af7f9020b166939f404e198c4ed",
      "obtainedAt": "2026-10-02T09:37:00.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=rD8t652Sp/9n6ZtuJ3%2B%2BryKZSC%2Bkd9kCJtoru14VApakCYmTv7KwGd6K/w0ua/nXXWEioZ0%2BteMdYiXxMqUiAHWKmGMV86Lxh1sedz4PO7dt/o8fNevwsujgRzaBbugn"
    },
    {
      "id": "doc-t-placsp-097-3",
      "name": "MEMORIA.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "80c613c9b63110872f4ba12d73c7698b35964135943aad500f87d5fe57278020",
      "obtainedAt": "2026-10-02T09:37:00.149Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=DlvsTWsXotGbCRagNNwzzgk4XWsREMayHp0rGl8CQWsuwBy%2BIJ/WmMYdr/m/6OgnxUi%2BcB46TcirIoVPGQxUdJtrR2Z4tgXeoo0fOOJM143fdyQgZAdTm3EfcUAC7CJ6"
    }
  ],
  "t-placsp-098": [
    {
      "id": "doc-t-placsp-098-1",
      "name": "2026-01219_PCAP_signed.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "6a5ffe7a149acd742d297c75392ecf6d83b4c8ca458acde3adc45831ca563ce1",
      "obtainedAt": "2026-10-02T09:36:28.963Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=15Y2PT9h7B9iuAyxQVo0KWGu6hz6Qbaa0EJU7NSZZPA3QTCcppFWfiOz0cyHXSVlTuGlioYumZ08PiAvhNj4kOkLvxfO1/A0OOSym8CmO6YC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-098-2",
      "name": "2026-01219_PPT_signed.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "5638cab543f6e63cece9fa4548cd5c5acd36dde1a89d1efa766802601d9228b7",
      "obtainedAt": "2026-10-02T09:36:28.963Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=wDx8qGpp9OiqfLINOtcIeO0LsANKeMCm9oP5s2umsoCZWxXMurSouFSBlwMe/T18IIvtIB3GoR0bDxFflrC70JuaRBmL7BHG%2B9OHEwaOCeEC1/zDIE0Kw/PWNnLS0Z0z"
    },
    {
      "id": "doc-t-placsp-098-3",
      "name": "DEUC 2026-01219.zip",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "07c45aed78bd36c3a133a518a728d71507e37b8e47b981ebf0cb021901a7ae34",
      "obtainedAt": "2026-10-02T09:36:28.963Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=8Qydkmvn3KycYOwuOPI5X4el6eZTd0CEUjMR2jg4i6PA4IfmccfI4nJi4C4Q5SXxtI%2BYPIwHB2jtZonEfVQ6sHPmHO1Fez8ukEAD9HEUtQ17QB3HKyQaFUExmUVQCerk"
    }
  ],
  "t-placsp-099": [
    {
      "id": "doc-t-placsp-099-1",
      "name": "2025-07 - 09_02_PCAP_Error_Portada_Clausulado_y_Anexos_FE.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "4c69073b4448365bdc6f785ceebd70b3ec377375f2f05d3d272da355c21f985e",
      "obtainedAt": "2026-10-02T09:31:43.243Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=zbdNBF44a8s3YCgIFYhS%2BrmFzI5E4db7czQMvvkJbkEF9B9X8RqgaxBJm%2BPJGfZza4WlXXCA1trgHsjv3fBF6n3UsgSVhd743U2yeEGJ%2BmuCx2e6p7hqtlp2aFupgHMr&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    },
    {
      "id": "doc-t-placsp-099-2",
      "name": "2025-07 - 08_PPT.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "3ccccf7b915220bbbfdafe011ba3359f2147ac0490f5402551dacf8e63278fff",
      "obtainedAt": "2026-10-02T09:31:43.243Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?DocumentIdParam=1dbE7bIuj9uY4CQ1Z2elwrdnJf6GjrUMYV5ycZSglVhUEKLNWPQ12oQ66CgT/r3q4lN2YKOQ0UYKqmZCzhmpj9N8TtvuIk15tztcoqTJkoKCx2e6p7hqtlp2aFupgHMr&cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D"
    }
  ],
  "t-placsp-100": [
    {
      "id": "doc-t-placsp-100-1",
      "name": "PCAP DILIGENCIADO.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "ae59ec15b4e92f0cad06f373ec72dba74b393aa1620e2b1a4ce38e3aa1ee844f",
      "obtainedAt": "2026-10-02T09:31:21.317Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=HHaGcS/4XLMiaZO3TuXacMB/vNJePacJRHUMxSbOLu3McqrrNwlMQVJTu/KjyBN8Q4S9JZyWt5ExjCPSek4pjRgcQAO2VoS2O9E7Kjcp90rDdQD9RyhUmzT4jZ2In4zL"
    },
    {
      "id": "doc-t-placsp-100-2",
      "name": "PPT DILIGENCIADO.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "8301b9fbed40e65bb31da4dcb82c2d677f6e6960b90d85d2789ae96d4511f6d4",
      "obtainedAt": "2026-10-02T09:31:21.317Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=rUQQzeNyLFKyMetTRmEWnQU%2B39r5Bfg8xsy2eZ4IwmRW0JqriD6BfhghbN4Oio6aEe/%2BHCCQbfIP6FT4oyB7yg/W4l0Y5IGffL6Z1G1qop%2B1aXEvq3KHa/AEHgtDrQw0"
    }
  ],
  "t-placsp-101": [
    {
      "id": "doc-t-placsp-101-1",
      "name": "670131-PliegodeClusulasAdmini-001004PCA_STD_CA.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "f5d263c18f9d1caed5a03bd4aaf738572eee295db14cb2ec8b889e36d18e69f6",
      "obtainedAt": "2026-10-02T09:26:41.947Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=iJM4yKuImUAuEuCBJ0q9dW2/0YlhDSfgAiWUMMlyGNP/umbInpUhVnFj1s50UFnOgM56NAms8zU44jEkYRHOiPO0uUhJizwBoP6BGu0bKX0//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-101-2",
      "name": "670026-PliegodePrescripciones-001002PPT_STD_OE.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "32ed5b1dbed80811946ff075622795139f7bd00d90d1292a1ac175c598967da6",
      "obtainedAt": "2026-10-02T09:26:41.947Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=YShO3Zt670GIAlYNSXHLAvJnvGFieSRY6Vxm39bOWHrKGVbEtRqHhxRfpi0k20BJ1YWLxKcG%2BOuHG/UpG0pIKBK%2BO8VVq30EcRANyKyE6R/DdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-102": [
    {
      "id": "doc-t-placsp-102-1",
      "name": "PCAP Abierto v1_ fdo.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "3a9c8e843777fdebb0a98ebc7297ffb042a2ab619f6f665f024deed939a3782e",
      "obtainedAt": "2026-10-02T09:26:36.709Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=DwwgwxAAte2zuCTvaWKkv77ec1DkDA6iWUQkAk5rmvDN0zs6bA/TC1n1TT1Xkw3wlxOsc7/8VRMZwypVJYqSerscqivXhCLLpMJHTHFG3qW1aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-102-2",
      "name": "PPT Mantenimiento LINCE 2027_v4_fdo.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "958fb98ed7e347de69b8f01df25f18f5cf8ad8576c35ac69c00c478b99c5b1da",
      "obtainedAt": "2026-10-02T09:26:36.709Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=5IqVZp0lyHjIIMqHdBfeLWFIkWMyb6vVoOx0MbxknYmTESckAI/RgrAaz8RJh7RPLZlu0VDOWLdGJYSyo%2BFfQnmJfv5w1MU%2BuBdHbkL4eRn3GVhXrFFqN7yFncy7YfRK"
    },
    {
      "id": "doc-t-placsp-102-3",
      "name": "DEUC.xml",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "dbd878f6dab2d51b9afba9dd14b833c7029941838edc9c669e1a9e7717d7d9bf",
      "obtainedAt": "2026-10-02T09:26:36.709Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=4Olo7kYgFvEES5uZIJmlCWh%2BBCBAw81zHSAd2zg8rJsbK54ilmVI3wdp8NdT8kRBfM3wTPk91l/2vWU18tGbafuisBSPRY4MhyN4pvmQPgffdyQgZAdTm3EfcUAC7CJ6"
    }
  ],
  "t-placsp-103": [
    {
      "id": "doc-t-placsp-103-1",
      "name": "PCAP.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "289691a3a8de1a17c767b4a8d9c82b8eac5bde989fe7b03e58fdac99dbe580a5",
      "obtainedAt": "2026-10-02T09:25:15.693Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=4kOXRlqsKdK2RwsDfXDBUxW7sT5507uXyK8euBSKin6EH%2BSjx2Rh/XXuAUq/IFtJ5bJGcD3cMQIUNtFgyEkDYCS1s4Lp5DH76%2Bg2WsnpzpJ45ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-103-2",
      "name": "PPT MOD.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "7237b4309abe637cc28505b44a9425deb1fb147ed2b0787243426c4cb084809f",
      "obtainedAt": "2026-10-02T09:25:15.693Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=MG/IifMdfhgEUI2FZPARM6JnndfL5cyQ65tgXCTjUCkSGNnzzmsYAYkUoKLkFEDmXzjK1htJPlguXWn475rZjTNp4%2BKpAgrP9KCo/XnlOU5JOVDbGCDM%2BMigrvuVS7Rv"
    }
  ],
  "t-placsp-104": [
    {
      "id": "doc-t-placsp-104-1",
      "name": "PCAP 5839.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "17c85eaaf7a74c628334aca861b2c5cce8cb7024863b81776fec335e01a94ee2",
      "obtainedAt": "2026-10-02T09:20:16.263Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=cDtciJjWpIgTzN9xeGrGMJOFIQklFnkxVV9vthMASNWdU%2BfDUJFGskX6drkYQRLLRvDXdWf71pr8cBnmSqS5iLf7VsKe4SoC4kXnid8Z0Kw//q7NB2iMZvNyf0xrJmjt"
    },
    {
      "id": "doc-t-placsp-104-2",
      "name": "Pliego tecnico.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "00236b9828e990031071f696ad833e8308d0a1119fcd2f0dce0a3adf5bf327c1",
      "obtainedAt": "2026-10-02T09:20:16.263Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=qN3vXei%2BLkgDcJI6LVyq%2BeukNSvWMzQSGNC%2Br7h8JENqAKJSq/3wEWOIlyUHlyYRS7DhCKx3V4AS9Vdp0bQelgJgeyKI/0YYYpRawRPSp4J7QB3HKyQaFUExmUVQCerk"
    }
  ],
  "t-placsp-105": [
    {
      "id": "doc-t-placsp-105-1",
      "name": "PCAP 18_26.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "8ee490588b0b293d79234623e6288afbb483d0ab6bd29f08982c2678f406c701",
      "obtainedAt": "2026-10-02T09:19:55.332Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=uB05LXzosyQVD150nEQniOkNt9zfnDNbwMwYVVwZN94Hvhk79cJoNxmaaE%2BtrLSb0k5ej%2BOjTWaMjIhDU6oCw67QYg3TN1GMwrphit0u6IiHAj0WEJrB5sP7amrh2jBD"
    },
    {
      "id": "doc-t-placsp-105-2",
      "name": "PPT Preservacion digital 18_26.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "b896bbe2483fadccd94f402335d9312a3aa9fe470a43aef0a3ff96abf28dee07",
      "obtainedAt": "2026-10-02T09:19:55.332Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=fT5MHVtoOjI2sjd2y3EOt0uzF8qNiBgu8xl6ZRajG8y8fy2I9HihI6B8bcEzg4ggPEdqlVisXDNvEg1B79EQW63Tp413fbsnPkVT%2BP8pMM945ClyWkoJ44mKM70IFcOu"
    },
    {
      "id": "doc-t-placsp-105-3",
      "name": "Anexo 4.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "de68faed76cfc147c4fa21cfc47f7a767571a989f99fa833273175fc30894bdb",
      "obtainedAt": "2026-10-02T09:19:55.332Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=7JSnxwSzgtLVZOhw5cN0SrzukaR5anlPPC7TmqYOccpsZtMB/Y/k3IyUnrQ6xAj92Qi8HwVxCI2w3Ol3TICF9isBjaFpzIRJF3irlZ8Gf1YZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-105-4",
      "name": "Anexo 5.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "5f639a244dfe3f94c3b2964cf8d62c98c91500bbc61b9571df6de93f9b25a834",
      "obtainedAt": "2026-10-02T09:19:55.332Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=VM36n4kFHcuR3E6DPKrqHvotmAkHqfMCJVlMMPRGs9EYPZXjDtqFxS5YiQxcMf2xxlS9ZgjD1SjNcDFuLxWWd06AyV5OWOeB2U3xaObSDM76CYyL7SIrUOBFfNf52ZqA"
    },
    {
      "id": "doc-t-placsp-105-5",
      "name": "Anexo 6.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "2cb40c58fe72d3738504e3c8b7803586a03764501649f16d5121e2821f3ad7ea",
      "obtainedAt": "2026-10-02T09:19:55.332Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=BIGjGjzYb4VH%2BrNTIgAJW3BogrsgByqSApwM/CnVAcDJksTsQb5jPVAVKLT9NRVOnNTy6ONAgNBStprY9IYGtuVDqfK/CvAcSCf9fdtYSKuCx2e6p7hqtlp2aFupgHMr"
    },
    {
      "id": "doc-t-placsp-105-6",
      "name": "Anexo 3.docx",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "565226c14ca978785e0ef15a80f4c67e9a1bb451d427013d9bd11bab71c1d7f7",
      "obtainedAt": "2026-10-02T09:19:55.332Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=nUeFuhiksu6exeuxTiXIDhTTMwZC92C7nKaHTw%2BfQ/G5sy%2ByBnAMzGgFHVrWOKRM1YdYiJSXuV8zdQ2mTMGCAEnn%2BpG9zXmm52HYpHqfL/DDdQD9RyhUmzT4jZ2In4zL"
    }
  ],
  "t-placsp-106": [
    {
      "id": "doc-t-placsp-106-1",
      "name": "PLIEGOCONDGENERALES.pdf",
      "type": "PCA",
      "version": 1,
      "sha256Hash": "921ae09105347bb5a12f3e27772c68a00ffcf8250401fa8c9552ab2202283ca8",
      "obtainedAt": "2026-10-02T09:18:33.114Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=oN6VDaAT%2BPo7fr%2Bc0b%2BkXEI2s0IQQq6i6hy0iorfis//8sNG4jCDkRg3fSr0To6LrbidX07PqFS39UQaGJVf6zYCrugnDNqPQMi71HqLlE21aXEvq3KHa/AEHgtDrQw0"
    },
    {
      "id": "doc-t-placsp-106-2",
      "name": "PLIEGOTECNICO.pdf",
      "type": "PPT",
      "version": 1,
      "sha256Hash": "995909bd23062168d41047bc51557cd718a7d708d233a03955b058a27cc20529",
      "obtainedAt": "2026-10-02T09:18:33.114Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=J5CUR2R7qe39A1jBfTE%2Bt%2BvVzIPgmCej22VZi3IKXf7XPeAD7QG3T/zmUTHEUZaT5/bQNd1UVMwYPXuQSrIRMHBKiPIrI2%2Bf6ii1qaAhVPQZyAJWGsSt0OzTSTyw9JAs"
    },
    {
      "id": "doc-t-placsp-106-3",
      "name": "MEMORIA.pdf",
      "type": "ADENDA",
      "version": 1,
      "sha256Hash": "7a975d6ee3f9d0c8cfbf60deeae63f066021fc984bb43861142b94b545980a25",
      "obtainedAt": "2026-10-02T09:18:33.114Z",
      "url": "https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=h0YZpn4sZVOzGVx7gKGe8Rds/JD2q99bkQhu8tLN3xNv1TxlTNXqsez44tF1tYU%2BsTZEZUYs8mPj1TdGNG3BRmO3emsVgybwjn62u7YEwhYC1/zDIE0Kw/PWNnLS0Z0z"
    }
  ]
};

export const REAL_CLOUD_PORTFOLIO: PortfolioItem[] = [
  {
    "id": "an-t-placsp-081",
    "tenderId": "t-placsp-081",
    "fileReference": "2026/EA12/00000832E",
    "title": "Servicio de mantenimiento correctivo, adaptativo y evolutivo de la plataforma de gestión académica CLOUDMINERVA del Ejército del Aire y del Espacio",
    "contractingAuthority": "Jefatura de la Sección Económico Administrativa 12 - Agrupación del Acuartelamiento Aéreo Tablada",
    "budgetAmount": 86553,
    "currency": "EUR",
    "submissionDeadline": "2026-10-23T19:46:51.520Z",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "decision": "PURSUE",
    "validity": "VALID",
    "hasBlockers": false,
    "evidenceCoveragePercentage": 92,
    "lastAnalysisDate": "2026-10-03T19:46:51.522Z"
  },
  {
    "id": "an-t-placsp-008",
    "tenderId": "t-placsp-008",
    "fileReference": "28861/2025",
    "title": "Servicio de mantenimiento del gestor de contenidos INFO TOURIST CLOUD.",
    "contractingAuthority": "Junta de Gobierno del Ayuntamiento de Orihuela",
    "budgetAmount": 13980,
    "currency": "EUR",
    "submissionDeadline": "2026-10-28T19:46:51.520Z",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "decision": "PURSUE",
    "validity": "VALID",
    "hasBlockers": false,
    "evidenceCoveragePercentage": 88,
    "lastAnalysisDate": "2026-10-03T19:46:51.522Z"
  },
  {
    "id": "an-t-placsp-007",
    "tenderId": "t-placsp-007",
    "fileReference": "2280/2026",
    "title": "La prestación integral de los servicios de consolidación, mantenimiento preventivo, adaptativo, correctivo y evolutivo, desarrollo y soporte funcional y técnico del sistema ERP SAP S/4HANA implantado en el CCS.",
    "contractingAuthority": "Consorcio de Compensación de Seguros",
    "budgetAmount": 1507788,
    "currency": "EUR",
    "submissionDeadline": "2026-10-21T09:59:00.000Z",
    "eligibility": "NEEDS_REVIEW",
    "decision": "REVIEW",
    "validity": "VALID",
    "hasBlockers": true,
    "blockerSummary": "Exige ENS Media en vigor; la empresa lo tiene en estado PENDING_REVIEW",
    "evidenceCoveragePercentage": 75,
    "lastAnalysisDate": "2026-10-03T19:46:51.522Z"
  },
  {
    "id": "an-t-placsp-046",
    "tenderId": "t-placsp-046",
    "fileReference": "18-01/25SDA",
    "title": "Adquisición de licencias y derechos de uso de soluciones de software en la nube\n\n\nAdquisición de licencias y derechos de uso de soluciones de software en la nube.",
    "contractingAuthority": "Rectorado de la Universidad de La Laguna",
    "budgetAmount": 0,
    "currency": "EUR",
    "submissionDeadline": "2026-10-14T19:46:51.520Z",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "decision": "UNDECIDED",
    "validity": "VALID",
    "hasBlockers": false,
    "evidenceCoveragePercentage": 85,
    "lastAnalysisDate": "2026-10-03T19:46:51.522Z"
  },
  {
    "id": "an-t-placsp-082",
    "tenderId": "t-placsp-082",
    "fileReference": "26/285",
    "title": "Suministro de servidores para la renovación del servidor de contingencia para AGC y para dos sondas de seguridad para el CCN-CERT; así como servicios de Puesta en Operación, Soporte técnico, servicios de Mantenimiento preventivo y correctivo y suministro de Actualización de versiones de Software asociado a los mismos.",
    "contractingAuthority": "Comisión de Contratación de la Sociedad Estatal Loterías y Apuestas del Estado, S.M.E., S.A.",
    "budgetAmount": 51000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-26T19:46:51.520Z",
    "eligibility": "NEEDS_REVIEW",
    "decision": "REVIEW",
    "validity": "REQUIRES_REANALYSIS",
    "hasBlockers": true,
    "blockerSummary": "Adenda técnica publicada con rectificación de criterios de solvencia económica",
    "evidenceCoveragePercentage": 70,
    "lastAnalysisDate": "2026-10-03T19:46:51.522Z"
  },
  {
    "id": "an-t-placsp-105",
    "tenderId": "t-placsp-105",
    "fileReference": "18/26",
    "title": "Suministro de un sistema de preservación digital a largo plazo en nube (Software as a Service).",
    "contractingAuthority": "Rectorado de la Universidad de les Illes Balears",
    "budgetAmount": 176000,
    "currency": "EUR",
    "submissionDeadline": "2026-10-31T19:46:51.520Z",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "decision": "PURSUE",
    "validity": "VALID",
    "hasBlockers": false,
    "evidenceCoveragePercentage": 94,
    "lastAnalysisDate": "2026-10-03T19:46:51.522Z"
  }
];

export const REAL_CLOUD_ANALYSES: Record<string, QualificationAnalysis> = {
  "t-placsp-081": {
    "id": "an-t-placsp-081",
    "tenderId": "t-placsp-081",
    "tenantId": "tenant-active",
    "validity": "VALID",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "summary": "Análisis de precalificación para Servicio de mantenimiento correctivo, adaptativo y evolutivo de la plataforma de gestión académica CLOUDMINERVA del Ejército del Aire y del Espacio. La empresa cumple con los requisitos de solvencia técnica y calidad (ISO 9001, ISO 27001). Afinidad tecnológica sobresaliente con el dossier empresarial.",
    "blockers": [],
    "dimensions": {
      "potentialEligibility": {
        "id": "dim-t-placsp-081-1",
        "name": "Elegibilidad Potencial",
        "status": "FAVORABLE",
        "summary": "Habilitación plena conforme al art. 65 LCSP",
        "details": "Verificación contra requisitos de admisión y plazos oficiales de la plataforma."
      },
      "technicalFit": {
        "id": "dim-t-placsp-081-2",
        "name": "Encaje Técnico",
        "status": "FAVORABLE",
        "summary": "Stack tecnológico 100% alineado (Cloud, APIs, Microservicios)",
        "details": "El pliego técnico coincide con la experiencia y acreditaciones declaradas en el dossier."
      },
      "economicFit": {
        "id": "dim-t-placsp-081-3",
        "name": "Encaje Económico",
        "status": "FAVORABLE",
        "summary": "Presupuesto de 86.553 € viable",
        "details": "Margen estimado adecuado según ratios del sector TIC."
      },
      "operationalCapacity": {
        "id": "dim-t-placsp-081-4",
        "name": "Capacidad Operativa",
        "status": "FAVORABLE",
        "summary": "Equipo técnico disponible para asignación inmediata",
        "details": "Disponibilidad de perfiles senior según requerimientos del PPT."
      },
      "contractualRisk": {
        "id": "dim-t-placsp-081-5",
        "name": "Riesgo Contractual",
        "status": "FAVORABLE",
        "summary": "Condiciones de ejecución y SLAs estándar",
        "details": "Pliegos administrativos sin penalizaciones desproporcionadas."
      },
      "deadlineFeasibility": {
        "id": "dim-t-placsp-081-6",
        "name": "Viabilidad de Plazo",
        "status": "FAVORABLE",
        "summary": "Plazo de presentación suficiente",
        "details": "Margen temporal para confeccionar la oferta técnica y económica."
      },
      "evidenceCoverage": {
        "id": "dim-t-placsp-081-7",
        "name": "Cobertura de Evidencia",
        "status": "FAVORABLE",
        "summary": "92% de requisitos respaldados con evidencias",
        "details": "Certificaciones ISO 27001 e ISO 9001 verificadas en dossier."
      }
    },
    "requirements": [
      {
        "id": "req-t-placsp-081-1",
        "category": "TECHNICAL",
        "title": "Certificación ISO/IEC 27001 en Gestión de Seguridad de la Información",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 27001 en vigor expedida por AENOR (VERIFIED).",
        "literalCitation": "Cláusula de solvencia técnica: \"El licitador deberá acreditar solvencia técnica mediante certificación ISO 27001 vigente en el alcance del contrato.\"",
        "documentName": "11_PCAP_832_FDO.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO/IEC 27001 (AENOR)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-081-2",
        "category": "SOLVENCY",
        "title": "Certificación ISO 9001 en Gestión de Calidad",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 9001 en vigor expedida por Bureau Veritas (VERIFIED).",
        "literalCitation": "Cláusula de calidad: \"Disponer de sistema de aseguramiento de calidad según norma ISO 9001 o equivalente.\"",
        "documentName": "11_PCAP_832_FDO.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO 9001 (Bureau Veritas)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-081-3",
        "category": "TECHNICAL",
        "title": "Certificación en Esquema Nacional de Seguridad (ENS) Categoría Media",
        "status": "SUPPORTED",
        "isMandatory": false,
        "confidence": 0.92,
        "reasoning": "Requisito valorable para la puntuación técnica.",
        "literalCitation": "Anexo de ciberseguridad: \"Conformidad con el Esquema Nacional de Seguridad (Real Decreto 311/2022) en nivel Medio.\"",
        "documentName": "02_pliego de prescripiciones tecnicas.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Esquema Nacional de Seguridad (ENS) — Categoría Media",
        "evidenceStatus": "PENDING_REVIEW"
      }
    ],
    "currentDecision": "PURSUE",
    "decisionHistory": [
      {
        "id": "dec-t-placsp-081-1",
        "decision": "PURSUE",
        "decidedBy": "Luis Test (Operador)",
        "decidedAt": "2026-10-03T19:46:51.537Z",
        "mandatoryReason": "Oportunidad prioritaria con alta compatibilidad en ingeniería cloud y arquitecturas públicas.",
        "analysisVersion": 1
      }
    ],
    "documentVersionUsed": 1,
    "createdAt": "2026-10-03T19:46:51.537Z",
    "updatedAt": "2026-10-03T19:46:51.537Z"
  },
  "t-placsp-008": {
    "id": "an-t-placsp-008",
    "tenderId": "t-placsp-008",
    "tenantId": "tenant-active",
    "validity": "VALID",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "summary": "Análisis de precalificación para Servicio de mantenimiento del gestor de contenidos INFO TOURIST CLOUD.. La empresa cumple con los requisitos de solvencia técnica y calidad (ISO 9001, ISO 27001). Afinidad tecnológica sobresaliente con el dossier empresarial.",
    "blockers": [],
    "dimensions": {
      "potentialEligibility": {
        "id": "dim-t-placsp-008-1",
        "name": "Elegibilidad Potencial",
        "status": "FAVORABLE",
        "summary": "Habilitación plena conforme al art. 65 LCSP",
        "details": "Verificación contra requisitos de admisión y plazos oficiales de la plataforma."
      },
      "technicalFit": {
        "id": "dim-t-placsp-008-2",
        "name": "Encaje Técnico",
        "status": "FAVORABLE",
        "summary": "Stack tecnológico 100% alineado (Cloud, APIs, Microservicios)",
        "details": "El pliego técnico coincide con la experiencia y acreditaciones declaradas en el dossier."
      },
      "economicFit": {
        "id": "dim-t-placsp-008-3",
        "name": "Encaje Económico",
        "status": "FAVORABLE",
        "summary": "Presupuesto de 13.980 € viable",
        "details": "Margen estimado adecuado según ratios del sector TIC."
      },
      "operationalCapacity": {
        "id": "dim-t-placsp-008-4",
        "name": "Capacidad Operativa",
        "status": "FAVORABLE",
        "summary": "Equipo técnico disponible para asignación inmediata",
        "details": "Disponibilidad de perfiles senior según requerimientos del PPT."
      },
      "contractualRisk": {
        "id": "dim-t-placsp-008-5",
        "name": "Riesgo Contractual",
        "status": "FAVORABLE",
        "summary": "Condiciones de ejecución y SLAs estándar",
        "details": "Pliegos administrativos sin penalizaciones desproporcionadas."
      },
      "deadlineFeasibility": {
        "id": "dim-t-placsp-008-6",
        "name": "Viabilidad de Plazo",
        "status": "FAVORABLE",
        "summary": "Plazo de presentación suficiente",
        "details": "Margen temporal para confeccionar la oferta técnica y económica."
      },
      "evidenceCoverage": {
        "id": "dim-t-placsp-008-7",
        "name": "Cobertura de Evidencia",
        "status": "FAVORABLE",
        "summary": "88% de requisitos respaldados con evidencias",
        "details": "Certificaciones ISO 27001 e ISO 9001 verificadas en dossier."
      }
    },
    "requirements": [
      {
        "id": "req-t-placsp-008-1",
        "category": "TECHNICAL",
        "title": "Certificación ISO/IEC 27001 en Gestión de Seguridad de la Información",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 27001 en vigor expedida por AENOR (VERIFIED).",
        "literalCitation": "Cláusula de solvencia técnica: \"El licitador deberá acreditar solvencia técnica mediante certificación ISO 27001 vigente en el alcance del contrato.\"",
        "documentName": "PCAP.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO/IEC 27001 (AENOR)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-008-2",
        "category": "SOLVENCY",
        "title": "Certificación ISO 9001 en Gestión de Calidad",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 9001 en vigor expedida por Bureau Veritas (VERIFIED).",
        "literalCitation": "Cláusula de calidad: \"Disponer de sistema de aseguramiento de calidad según norma ISO 9001 o equivalente.\"",
        "documentName": "PCAP.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO 9001 (Bureau Veritas)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-008-3",
        "category": "TECHNICAL",
        "title": "Certificación en Esquema Nacional de Seguridad (ENS) Categoría Media",
        "status": "SUPPORTED",
        "isMandatory": false,
        "confidence": 0.92,
        "reasoning": "Requisito valorable para la puntuación técnica.",
        "literalCitation": "Anexo de ciberseguridad: \"Conformidad con el Esquema Nacional de Seguridad (Real Decreto 311/2022) en nivel Medio.\"",
        "documentName": "PPT.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Esquema Nacional de Seguridad (ENS) — Categoría Media",
        "evidenceStatus": "PENDING_REVIEW"
      }
    ],
    "currentDecision": "PURSUE",
    "decisionHistory": [
      {
        "id": "dec-t-placsp-008-1",
        "decision": "PURSUE",
        "decidedBy": "Luis Test (Operador)",
        "decidedAt": "2026-10-03T19:46:51.537Z",
        "mandatoryReason": "Oportunidad prioritaria con alta compatibilidad en ingeniería cloud y arquitecturas públicas.",
        "analysisVersion": 1
      }
    ],
    "documentVersionUsed": 1,
    "createdAt": "2026-10-03T19:46:51.537Z",
    "updatedAt": "2026-10-03T19:46:51.537Z"
  },
  "t-placsp-007": {
    "id": "an-t-placsp-007",
    "tenderId": "t-placsp-007",
    "tenantId": "tenant-active",
    "validity": "VALID",
    "eligibility": "NEEDS_REVIEW",
    "summary": "Análisis de precalificación para La prestación integral de los servicios de consolidación, mantenimiento preventivo, adaptativo, correctivo y evolutivo, desarrollo y soporte funcional y técnico del sistema ERP SAP S/4HANA implantado en el CCS.. La empresa cumple con los requisitos de solvencia técnica y calidad (ISO 9001, ISO 27001). Exige ENS Media en vigor; la empresa lo tiene en estado PENDING_REVIEW",
    "blockers": [
      "Exige ENS Media en vigor; la empresa lo tiene en estado PENDING_REVIEW"
    ],
    "dimensions": {
      "potentialEligibility": {
        "id": "dim-t-placsp-007-1",
        "name": "Elegibilidad Potencial",
        "status": "WARNING",
        "summary": "Requiere subsanación o revisión humana",
        "details": "Verificación contra requisitos de admisión y plazos oficiales de la plataforma."
      },
      "technicalFit": {
        "id": "dim-t-placsp-007-2",
        "name": "Encaje Técnico",
        "status": "FAVORABLE",
        "summary": "Stack tecnológico 100% alineado (Cloud, APIs, Microservicios)",
        "details": "El pliego técnico coincide con la experiencia y acreditaciones declaradas en el dossier."
      },
      "economicFit": {
        "id": "dim-t-placsp-007-3",
        "name": "Encaje Económico",
        "status": "FAVORABLE",
        "summary": "Presupuesto de 1.507.788 € viable",
        "details": "Margen estimado adecuado según ratios del sector TIC."
      },
      "operationalCapacity": {
        "id": "dim-t-placsp-007-4",
        "name": "Capacidad Operativa",
        "status": "FAVORABLE",
        "summary": "Equipo técnico disponible para asignación inmediata",
        "details": "Disponibilidad de perfiles senior según requerimientos del PPT."
      },
      "contractualRisk": {
        "id": "dim-t-placsp-007-5",
        "name": "Riesgo Contractual",
        "status": "WARNING",
        "summary": "Condiciones de ejecución y SLAs estándar",
        "details": "Pliegos administrativos sin penalizaciones desproporcionadas."
      },
      "deadlineFeasibility": {
        "id": "dim-t-placsp-007-6",
        "name": "Viabilidad de Plazo",
        "status": "FAVORABLE",
        "summary": "Plazo de presentación suficiente",
        "details": "Margen temporal para confeccionar la oferta técnica y económica."
      },
      "evidenceCoverage": {
        "id": "dim-t-placsp-007-7",
        "name": "Cobertura de Evidencia",
        "status": "FAVORABLE",
        "summary": "75% de requisitos respaldados con evidencias",
        "details": "Certificaciones ISO 27001 e ISO 9001 verificadas en dossier."
      }
    },
    "requirements": [
      {
        "id": "req-t-placsp-007-1",
        "category": "TECHNICAL",
        "title": "Certificación ISO/IEC 27001 en Gestión de Seguridad de la Información",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 27001 en vigor expedida por AENOR (VERIFIED).",
        "literalCitation": "Cláusula de solvencia técnica: \"El licitador deberá acreditar solvencia técnica mediante certificación ISO 27001 vigente en el alcance del contrato.\"",
        "documentName": "20261002_Contrato_Pliego de clausulas_2280_2026_PCAP_ED11.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO/IEC 27001 (AENOR)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-007-2",
        "category": "SOLVENCY",
        "title": "Certificación ISO 9001 en Gestión de Calidad",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 9001 en vigor expedida por Bureau Veritas (VERIFIED).",
        "literalCitation": "Cláusula de calidad: \"Disponer de sistema de aseguramiento de calidad según norma ISO 9001 o equivalente.\"",
        "documentName": "20261002_Contrato_Pliego de clausulas_2280_2026_PCAP_ED11.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO 9001 (Bureau Veritas)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-007-3",
        "category": "TECHNICAL",
        "title": "Certificación en Esquema Nacional de Seguridad (ENS) Categoría Media",
        "status": "NOT_SUPPORTED",
        "isMandatory": true,
        "confidence": 0.92,
        "reasoning": "El pliego requiere ENS Media verificada; actualmente en el dossier se encuentra en estado PENDING_REVIEW.",
        "literalCitation": "Anexo de ciberseguridad: \"Conformidad con el Esquema Nacional de Seguridad (Real Decreto 311/2022) en nivel Medio.\"",
        "documentName": "2280_2026_PPT CCS Manto__ SAP ED15.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Esquema Nacional de Seguridad (ENS) — Categoría Media",
        "evidenceStatus": "PENDING_REVIEW"
      }
    ],
    "currentDecision": "REVIEW",
    "decisionHistory": [
      {
        "id": "dec-t-placsp-007-1",
        "decision": "REVIEW",
        "decidedBy": "Luis Test (Operador)",
        "decidedAt": "2026-10-03T19:46:51.537Z",
        "mandatoryReason": "Mantener en revisión hasta confirmar resolución de la certificación ENS Media.",
        "analysisVersion": 1
      }
    ],
    "documentVersionUsed": 1,
    "createdAt": "2026-10-03T19:46:51.537Z",
    "updatedAt": "2026-10-03T19:46:51.537Z"
  },
  "t-placsp-046": {
    "id": "an-t-placsp-046",
    "tenderId": "t-placsp-046",
    "tenantId": "tenant-active",
    "validity": "VALID",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "summary": "Análisis de precalificación para Adquisición de licencias y derechos de uso de soluciones de software en la nube\n\n\nAdquisición de licencias y derechos de uso de soluciones de software en la nube.. La empresa cumple con los requisitos de solvencia técnica y calidad (ISO 9001, ISO 27001). Afinidad tecnológica sobresaliente con el dossier empresarial.",
    "blockers": [],
    "dimensions": {
      "potentialEligibility": {
        "id": "dim-t-placsp-046-1",
        "name": "Elegibilidad Potencial",
        "status": "FAVORABLE",
        "summary": "Habilitación plena conforme al art. 65 LCSP",
        "details": "Verificación contra requisitos de admisión y plazos oficiales de la plataforma."
      },
      "technicalFit": {
        "id": "dim-t-placsp-046-2",
        "name": "Encaje Técnico",
        "status": "FAVORABLE",
        "summary": "Stack tecnológico 100% alineado (Cloud, APIs, Microservicios)",
        "details": "El pliego técnico coincide con la experiencia y acreditaciones declaradas en el dossier."
      },
      "economicFit": {
        "id": "dim-t-placsp-046-3",
        "name": "Encaje Económico",
        "status": "FAVORABLE",
        "summary": "Presupuesto de 0 € viable",
        "details": "Margen estimado adecuado según ratios del sector TIC."
      },
      "operationalCapacity": {
        "id": "dim-t-placsp-046-4",
        "name": "Capacidad Operativa",
        "status": "FAVORABLE",
        "summary": "Equipo técnico disponible para asignación inmediata",
        "details": "Disponibilidad de perfiles senior según requerimientos del PPT."
      },
      "contractualRisk": {
        "id": "dim-t-placsp-046-5",
        "name": "Riesgo Contractual",
        "status": "FAVORABLE",
        "summary": "Condiciones de ejecución y SLAs estándar",
        "details": "Pliegos administrativos sin penalizaciones desproporcionadas."
      },
      "deadlineFeasibility": {
        "id": "dim-t-placsp-046-6",
        "name": "Viabilidad de Plazo",
        "status": "FAVORABLE",
        "summary": "Plazo de presentación suficiente",
        "details": "Margen temporal para confeccionar la oferta técnica y económica."
      },
      "evidenceCoverage": {
        "id": "dim-t-placsp-046-7",
        "name": "Cobertura de Evidencia",
        "status": "FAVORABLE",
        "summary": "85% de requisitos respaldados con evidencias",
        "details": "Certificaciones ISO 27001 e ISO 9001 verificadas en dossier."
      }
    },
    "requirements": [
      {
        "id": "req-t-placsp-046-1",
        "category": "TECHNICAL",
        "title": "Certificación ISO/IEC 27001 en Gestión de Seguridad de la Información",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 27001 en vigor expedida por AENOR (VERIFIED).",
        "literalCitation": "Cláusula de solvencia técnica: \"El licitador deberá acreditar solvencia técnica mediante certificación ISO 27001 vigente en el alcance del contrato.\"",
        "documentName": "565505-PliegodeClusulasAdmini-001003PCA_STD_CA.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO/IEC 27001 (AENOR)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-046-2",
        "category": "SOLVENCY",
        "title": "Certificación ISO 9001 en Gestión de Calidad",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 9001 en vigor expedida por Bureau Veritas (VERIFIED).",
        "literalCitation": "Cláusula de calidad: \"Disponer de sistema de aseguramiento de calidad según norma ISO 9001 o equivalente.\"",
        "documentName": "565505-PliegodeClusulasAdmini-001003PCA_STD_CA.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO 9001 (Bureau Veritas)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-046-3",
        "category": "TECHNICAL",
        "title": "Certificación en Esquema Nacional de Seguridad (ENS) Categoría Media",
        "status": "SUPPORTED",
        "isMandatory": false,
        "confidence": 0.92,
        "reasoning": "Requisito valorable para la puntuación técnica.",
        "literalCitation": "Anexo de ciberseguridad: \"Conformidad con el Esquema Nacional de Seguridad (Real Decreto 311/2022) en nivel Medio.\"",
        "documentName": "560904-PliegodePrescripciones-001001PPT_STD_OE.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Esquema Nacional de Seguridad (ENS) — Categoría Media",
        "evidenceStatus": "PENDING_REVIEW"
      }
    ],
    "currentDecision": "UNDECIDED",
    "decisionHistory": [
      {
        "id": "dec-t-placsp-046-1",
        "decision": "UNDECIDED",
        "decidedBy": "Luis Test (Operador)",
        "decidedAt": "2026-10-03T19:46:51.537Z",
        "mandatoryReason": "Pendiente de asignación de responsable.",
        "analysisVersion": 1
      }
    ],
    "documentVersionUsed": 1,
    "createdAt": "2026-10-03T19:46:51.537Z",
    "updatedAt": "2026-10-03T19:46:51.537Z"
  },
  "t-placsp-082": {
    "id": "an-t-placsp-082",
    "tenderId": "t-placsp-082",
    "tenantId": "tenant-active",
    "validity": "REQUIRES_REANALYSIS",
    "invalidationReason": "Se ha detectado una modificación documental en PLACSP que requiere reanálisis.",
    "eligibility": "NEEDS_REVIEW",
    "summary": "Análisis de precalificación para Suministro de servidores para la renovación del servidor de contingencia para AGC y para dos sondas de seguridad para el CCN-CERT; así como servicios de Puesta en Operación, Soporte técnico, servicios de Mantenimiento preventivo y correctivo y suministro de Actualización de versiones de Software asociado a los mismos.. La empresa cumple con los requisitos de solvencia técnica y calidad (ISO 9001, ISO 27001). Adenda técnica publicada con rectificación de criterios de solvencia económica",
    "blockers": [
      "Adenda técnica publicada con rectificación de criterios de solvencia económica"
    ],
    "dimensions": {
      "potentialEligibility": {
        "id": "dim-t-placsp-082-1",
        "name": "Elegibilidad Potencial",
        "status": "WARNING",
        "summary": "Requiere subsanación o revisión humana",
        "details": "Verificación contra requisitos de admisión y plazos oficiales de la plataforma."
      },
      "technicalFit": {
        "id": "dim-t-placsp-082-2",
        "name": "Encaje Técnico",
        "status": "FAVORABLE",
        "summary": "Stack tecnológico 100% alineado (Cloud, APIs, Microservicios)",
        "details": "El pliego técnico coincide con la experiencia y acreditaciones declaradas en el dossier."
      },
      "economicFit": {
        "id": "dim-t-placsp-082-3",
        "name": "Encaje Económico",
        "status": "FAVORABLE",
        "summary": "Presupuesto de 51.000 € viable",
        "details": "Margen estimado adecuado según ratios del sector TIC."
      },
      "operationalCapacity": {
        "id": "dim-t-placsp-082-4",
        "name": "Capacidad Operativa",
        "status": "FAVORABLE",
        "summary": "Equipo técnico disponible para asignación inmediata",
        "details": "Disponibilidad de perfiles senior según requerimientos del PPT."
      },
      "contractualRisk": {
        "id": "dim-t-placsp-082-5",
        "name": "Riesgo Contractual",
        "status": "WARNING",
        "summary": "Condiciones de ejecución y SLAs estándar",
        "details": "Pliegos administrativos sin penalizaciones desproporcionadas."
      },
      "deadlineFeasibility": {
        "id": "dim-t-placsp-082-6",
        "name": "Viabilidad de Plazo",
        "status": "FAVORABLE",
        "summary": "Plazo de presentación suficiente",
        "details": "Margen temporal para confeccionar la oferta técnica y económica."
      },
      "evidenceCoverage": {
        "id": "dim-t-placsp-082-7",
        "name": "Cobertura de Evidencia",
        "status": "FAVORABLE",
        "summary": "70% de requisitos respaldados con evidencias",
        "details": "Certificaciones ISO 27001 e ISO 9001 verificadas en dossier."
      }
    },
    "requirements": [
      {
        "id": "req-t-placsp-082-1",
        "category": "TECHNICAL",
        "title": "Certificación ISO/IEC 27001 en Gestión de Seguridad de la Información",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 27001 en vigor expedida por AENOR (VERIFIED).",
        "literalCitation": "Cláusula de solvencia técnica: \"El licitador deberá acreditar solvencia técnica mediante certificación ISO 27001 vigente en el alcance del contrato.\"",
        "documentName": "26 285 CRCP.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO/IEC 27001 (AENOR)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-082-2",
        "category": "SOLVENCY",
        "title": "Certificación ISO 9001 en Gestión de Calidad",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 9001 en vigor expedida por Bureau Veritas (VERIFIED).",
        "literalCitation": "Cláusula de calidad: \"Disponer de sistema de aseguramiento de calidad según norma ISO 9001 o equivalente.\"",
        "documentName": "26 285 CRCP.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO 9001 (Bureau Veritas)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-082-3",
        "category": "TECHNICAL",
        "title": "Certificación en Esquema Nacional de Seguridad (ENS) Categoría Media",
        "status": "NOT_SUPPORTED",
        "isMandatory": true,
        "confidence": 0.92,
        "reasoning": "El pliego requiere ENS Media verificada; actualmente en el dossier se encuentra en estado PENDING_REVIEW.",
        "literalCitation": "Anexo de ciberseguridad: \"Conformidad con el Esquema Nacional de Seguridad (Real Decreto 311/2022) en nivel Medio.\"",
        "documentName": "26 285 PT Servidores AGC y Sondas de seguridad.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Esquema Nacional de Seguridad (ENS) — Categoría Media",
        "evidenceStatus": "PENDING_REVIEW"
      }
    ],
    "currentDecision": "REVIEW",
    "decisionHistory": [
      {
        "id": "dec-t-placsp-082-1",
        "decision": "REVIEW",
        "decidedBy": "Luis Test (Operador)",
        "decidedAt": "2026-10-03T19:46:51.537Z",
        "mandatoryReason": "Mantener en revisión hasta confirmar resolución de la certificación ENS Media.",
        "analysisVersion": 1
      }
    ],
    "documentVersionUsed": 1,
    "createdAt": "2026-10-03T19:46:51.537Z",
    "updatedAt": "2026-10-03T19:46:51.537Z"
  },
  "t-placsp-105": {
    "id": "an-t-placsp-105",
    "tenderId": "t-placsp-105",
    "tenantId": "tenant-active",
    "validity": "VALID",
    "eligibility": "POTENTIALLY_ELIGIBLE",
    "summary": "Análisis de precalificación para Suministro de un sistema de preservación digital a largo plazo en nube (Software as a Service).. La empresa cumple con los requisitos de solvencia técnica y calidad (ISO 9001, ISO 27001). Afinidad tecnológica sobresaliente con el dossier empresarial.",
    "blockers": [],
    "dimensions": {
      "potentialEligibility": {
        "id": "dim-t-placsp-105-1",
        "name": "Elegibilidad Potencial",
        "status": "FAVORABLE",
        "summary": "Habilitación plena conforme al art. 65 LCSP",
        "details": "Verificación contra requisitos de admisión y plazos oficiales de la plataforma."
      },
      "technicalFit": {
        "id": "dim-t-placsp-105-2",
        "name": "Encaje Técnico",
        "status": "FAVORABLE",
        "summary": "Stack tecnológico 100% alineado (Cloud, APIs, Microservicios)",
        "details": "El pliego técnico coincide con la experiencia y acreditaciones declaradas en el dossier."
      },
      "economicFit": {
        "id": "dim-t-placsp-105-3",
        "name": "Encaje Económico",
        "status": "FAVORABLE",
        "summary": "Presupuesto de 176.000 € viable",
        "details": "Margen estimado adecuado según ratios del sector TIC."
      },
      "operationalCapacity": {
        "id": "dim-t-placsp-105-4",
        "name": "Capacidad Operativa",
        "status": "FAVORABLE",
        "summary": "Equipo técnico disponible para asignación inmediata",
        "details": "Disponibilidad de perfiles senior según requerimientos del PPT."
      },
      "contractualRisk": {
        "id": "dim-t-placsp-105-5",
        "name": "Riesgo Contractual",
        "status": "FAVORABLE",
        "summary": "Condiciones de ejecución y SLAs estándar",
        "details": "Pliegos administrativos sin penalizaciones desproporcionadas."
      },
      "deadlineFeasibility": {
        "id": "dim-t-placsp-105-6",
        "name": "Viabilidad de Plazo",
        "status": "FAVORABLE",
        "summary": "Plazo de presentación suficiente",
        "details": "Margen temporal para confeccionar la oferta técnica y económica."
      },
      "evidenceCoverage": {
        "id": "dim-t-placsp-105-7",
        "name": "Cobertura de Evidencia",
        "status": "FAVORABLE",
        "summary": "94% de requisitos respaldados con evidencias",
        "details": "Certificaciones ISO 27001 e ISO 9001 verificadas en dossier."
      }
    },
    "requirements": [
      {
        "id": "req-t-placsp-105-1",
        "category": "TECHNICAL",
        "title": "Certificación ISO/IEC 27001 en Gestión de Seguridad de la Información",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 27001 en vigor expedida por AENOR (VERIFIED).",
        "literalCitation": "Cláusula de solvencia técnica: \"El licitador deberá acreditar solvencia técnica mediante certificación ISO 27001 vigente en el alcance del contrato.\"",
        "documentName": "PCAP 18_26.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO/IEC 27001 (AENOR)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-105-2",
        "category": "SOLVENCY",
        "title": "Certificación ISO 9001 en Gestión de Calidad",
        "status": "SUPPORTED",
        "isMandatory": true,
        "confidence": 0.99,
        "reasoning": "La empresa cuenta con ISO 9001 en vigor expedida por Bureau Veritas (VERIFIED).",
        "literalCitation": "Cláusula de calidad: \"Disponer de sistema de aseguramiento de calidad según norma ISO 9001 o equivalente.\"",
        "documentName": "PCAP 18_26.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Certificación ISO 9001 (Bureau Veritas)",
        "evidenceStatus": "VERIFIED"
      },
      {
        "id": "req-t-placsp-105-3",
        "category": "TECHNICAL",
        "title": "Certificación en Esquema Nacional de Seguridad (ENS) Categoría Media",
        "status": "SUPPORTED",
        "isMandatory": false,
        "confidence": 0.92,
        "reasoning": "Requisito valorable para la puntuación técnica.",
        "literalCitation": "Anexo de ciberseguridad: \"Conformidad con el Esquema Nacional de Seguridad (Real Decreto 311/2022) en nivel Medio.\"",
        "documentName": "PPT Preservacion digital 18_26.pdf",
        "documentVersion": 1,
        "evidenceTitle": "Esquema Nacional de Seguridad (ENS) — Categoría Media",
        "evidenceStatus": "PENDING_REVIEW"
      }
    ],
    "currentDecision": "PURSUE",
    "decisionHistory": [
      {
        "id": "dec-t-placsp-105-1",
        "decision": "PURSUE",
        "decidedBy": "Luis Test (Operador)",
        "decidedAt": "2026-10-03T19:46:51.537Z",
        "mandatoryReason": "Oportunidad prioritaria con alta compatibilidad en ingeniería cloud y arquitecturas públicas.",
        "analysisVersion": 1
      }
    ],
    "documentVersionUsed": 1,
    "createdAt": "2026-10-03T19:46:51.537Z",
    "updatedAt": "2026-10-03T19:46:51.537Z"
  }
};
