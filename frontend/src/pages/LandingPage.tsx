import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { SilkBackground } from '../components/layout/SilkBackground';
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Building2,
  Search,
  Scale,
  Database,
  Cpu,
  Fingerprint,
  RefreshCw,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  Zap,
  Play,
  Activity,
  Radio,
  FileSearch,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Barra de progreso de lectura / scroll suave con física de resorte
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Estado del Simulador Interactivo en Vivo del Hero
  const [selectedCriterion, setSelectedCriterion] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Estado del Simulador Interactivo de Adendas en Fase 4
  const [simulatedAdendaState, setSimulatedAdendaState] = useState<'INITIAL' | 'ADENDA_DETECTED' | 'REANALYZED'>('INITIAL');

  const handleLaunchDemo = () => {
    loginAsDemo();
    navigate('/app/inicio');
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText?.('8f9a2b4c107e3d1982b6e82af0c399b1a5e4d28e71fa0c399b1a5e8f9a2b4c10');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleTriggerScan = (idx: number) => {
    if (idx === selectedCriterion && !isScanning) {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 450);
      return;
    }
    setSelectedCriterion(idx);
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 450);
  };

  // Criterios interactivos del pliego de la DGT para auditar en directo
  const heroCriteria = [
    {
      id: 0,
      name: 'Certificación ENS Alta',
      category: 'Seguridad y Cumplimiento',
      chipColor: '#218a58',
      pageRef: 'PCAP Pág. 14, caracteres 4210-4380',
      pliegoQuote: '...el adjudicatario deberá acreditar que los sistemas ofertados disponen de certificación en el Esquema Nacional de Seguridad (ENS) en categoría ALTA conforme al RD 311/2022...',
      dossierProof: 'TechConsulting Soluciones S.L. dispone de Certificado ENS-2024-9912 emitido por CCN-CERT. Válido hasta 2027.',
      status: 'SUPPORTED',
      statusLabel: 'Cumple al 100%',
      confidence: 99,
      latencyMs: 142,
    },
    {
      id: 1,
      name: 'Solvencia Económica (>500k€)',
      category: 'Solvencia Financiera',
      chipColor: '#218a58',
      pageRef: 'PCAP Pág. 8, caracteres 1890-2040',
      pliegoQuote: '...volumen anual de negocios en el ámbito de telemática por importe igual o superior a 500.000,00 € en el mejor de los tres últimos ejercicios fiscales...',
      dossierProof: 'Facturación anual acreditada en el Registro Mercantil: 1.250.000,00 € (Ejercicio 2024). Supera el umbral exigido con 250% de cobertura.',
      status: 'SUPPORTED',
      statusLabel: 'Solvencia Acreditada',
      confidence: 100,
      latencyMs: 118,
    },
    {
      id: 2,
      name: 'Equipo Técnico Senior (DevOps)',
      category: 'Habilitación Técnica',
      chipColor: '#218a58',
      pageRef: 'PPT Pág. 22, caracteres 6740-6920',
      pliegoQuote: '...se exigirá al menos 3 ingenieros con titulación superior y certificación en infraestructuras cloud con experiencia mínima de 4 años en el sector público...',
      dossierProof: 'El dossier incluye 4 ingenieros senior certificados con proyectos demostrables en la DGT y el Ministerio de Justicia.',
      status: 'SUPPORTED',
      statusLabel: 'Equipo Homologado',
      confidence: 96,
      latencyMs: 165,
    }
  ];

  const currentCriterion = heroCriteria[selectedCriterion];

  const pipelineSteps = [
    {
      id: 0,
      badge: 'Fase 1',
      title: 'Sindicación Oficial PLACSP',
      shortDesc: 'Monitorización del feed oficial CODICE XML del Ministerio de Hacienda.',
      semantic: 'Ingesta Continua',
      color: '#685cff',
      icon: <RefreshCw className="w-4 h-4 text-[#685cff]" />,
      content: {
        tag: 'INGESTA EN TIEMPO REAL',
        heading: 'Sondeo CODICE XML continuo cada 15 min',
        desc: 'El conector normaliza importes a céntimos exactos, clasifica códigos CPV de 8 dígitos y extrae fechas de fin de plazo en marcas de tiempo UTC.',
        metrics: [
          { label: 'Formato', value: 'CODICE 2.04 XML' },
          { label: 'Frecuencia', value: 'Cada 15 minutos' },
          { label: 'Precisión', value: 'Céntimos exactos' }
        ],
        codeSnippet: `<cac:ProcurementProject>
  <cbc:ID>DGT-2026-EXP-8891</cbc:ID>
  <cbc:Name>Mantenimiento Plataforma Cloud DGT</cbc:Name>
  <cbc:TotalAmount currencyID="EUR">850000.00</cbc:TotalAmount>
  <cac:RequiredCommodityClassification>
    <cbc:ItemClassificationCode>72000000</cbc:ItemClassificationCode>
  </cac:RequiredCommodityClassification>
</cac:ProcurementProject>`
      }
    },
    {
      id: 1,
      badge: 'Fase 2',
      title: 'Sellado Criptográfico SHA-256',
      shortDesc: 'Sellado dual del pliego original (PDF binario y texto extraído).',
      semantic: 'Inmutabilidad Certificada',
      color: '#218a58',
      icon: <Fingerprint className="w-4 h-4 text-[#218a58]" />,
      content: {
        tag: 'INTEGRIDAD INMUTABLE',
        heading: 'Hash SHA-256 dual verificado',
        desc: 'Cada pliego administrativo (PCAP) y técnico (PPT) queda sellado de forma inmutable. Nadie puede alterar las condiciones del concurso una vez publicado.',
        metrics: [
          { label: 'Algoritmo', value: 'SHA-256 FIPS 180-4' },
          { label: 'Modo', value: 'Dual (Binario + Texto)' },
          { label: 'Garantía', value: 'Anti-Tampering' }
        ],
        codeSnippet: `// Certificado de integridad criptográfica
Documento: PCAP_Pliego_Clausulas_DGT_v1.pdf
SHA-256 Binario:  8f9a2b4c107e3d1982b6e82af0c399b1a5e...
SHA-256 Normalizado: 4d28e71fa0c399b1a5e8f9a2b4c107e...
Timestamp TSA:    2026-10-02T10:15:32Z (Verificado)`
      }
    },
    {
      id: 2,
      badge: 'Fase 3',
      title: 'Precalificación con Gemini 3.1 Flash',
      shortDesc: 'Cruce del dossier frente a requisitos con offsets exactos de página y texto.',
      semantic: 'Cero Alucinaciones',
      color: '#685cff',
      icon: <Scale className="w-4 h-4 text-[#685cff]" />,
      content: {
        tag: 'AUDITORÍA ESTRICTA',
        heading: 'Evaluación semántica a temperatura 0',
        desc: 'Puertas deterministas descartan licitaciones no viables en 0 ms. Gemini 3.1 Flash y GPT Terra contrastan los criterios exigiendo citas exactas con offsets de caracteres en el pliego.',
        metrics: [
          { label: 'Motor Inferencia', value: 'Gemini 3.1 Flash' },
          { label: 'Auditoría', value: 'Página y Caracteres' },
          { label: 'Descarte 0 ms', value: 'Determinista' }
        ],
        codeSnippet: `// Invocación a Gemini 3.1 Flash (temperature: 0)
[REQUISITO EVALUADO]: Certificación de Seguridad ENS Alta
[ESTADO RESULTANTE]: SUPPORTED (Cumple solvencia técnica)
[CITA AUDITADA]: PCAP pág. 14, caracteres 4210-4380:
"...el adjudicatario deberá acreditar nivel ALTO en el Esquema Nacional de Seguridad..."
[EVIDENCIA DOSSIER]: Certificado ENS-2024-9912 (Válido hasta 2027)`
      }
    },
    {
      id: 3,
      badge: 'Fase 4',
      title: 'Centinela de Adendas y Cartera',
      shortDesc: 'Invalidación atómica y alerta inmediata si el organismo modifica el pliego.',
      semantic: 'Protección Dinámica',
      color: '#ca8517',
      icon: <AlertTriangle className="w-4 h-4 text-[#ca8517]" />,
      content: {
        tag: 'PROTECCIÓN CONTINUA',
        heading: 'Detección atómica de rectificaciones en PLACSP',
        desc: 'Si la mesa de contratación publica una adenda o rectificación, el sistema invalida atómicamente el análisis previo y genera una alerta de reanálisis para no presentar una oferta desfasada.',
        metrics: [
          { label: 'Detección', value: 'Payload Hash diff' },
          { label: 'Estado', value: 'REQUIRES_REANALYSIS' },
          { label: 'Acción', value: 'Reanálisis con 1 clic' }
        ],
        codeSnippet: `ALERTA CRÍTICA: DOCUMENT_CHANGE (Adenda v2 detectada en PLACSP)
Expediente: DGT-2026-EXP-8891
Nuevo Pliego: PCAP_Modificado_Aclaracion_Lote_2.pdf
Hash anterior: 8f9a2b... -> Hash nuevo: a3f19c...
Acción ejecutada: Invalidez atómica de análisis an-001.
Recomendación: Ejecutar reanálisis con Gemini 3.1 Flash v2.`
      }
    }
  ];

  const faqs = [
    {
      q: '¿Cómo se conecta Pliego AI a la Plataforma de Contratación del Sector Público (PLACSP)?',
      a: 'Pliego AI consulta de forma automatizada y periódica el feed oficial CODICE XML publicado por el Ministerio de Hacienda. Los expedientes se descargan, se normalizan importes a céntimos enteros y fechas a UTC, y los pliegos PDF adjuntos se descargan y sellan criptográficamente con SHA-256 en tiempo real.'
    },
    {
      q: '¿Qué modelos de Inteligencia Artificial ejecutan las extracciones y comparaciones?',
      a: 'El sistema utiliza Google Gemini 3.1 Flash mediante su API directa (generateContent) a temperatura 0 para la extracción estructurada masiva y el matching semántico de requisitos con el dossier de la empresa. Para razonamiento jurídico complejo y ponderación de criterios subjetivos, se coordina con GPT Terra/Sol bajo esquemas estrictos de validación Zod.'
    },
    {
      q: '¿Por qué garantizáis "cero alucinaciones" en la precalificación técnica?',
      a: 'Porque la IA tiene una regla matemática inviolable en el backend: ninguna conclusión de idoneidad se acepta si no viene acompañada de una cita textual exacta con su número de página y offset físico de caracteres contrastado byte a byte contra el snapshot del pliego sellado.'
    },
    {
      q: '¿Qué diferencia hay entre la cuenta del operador y el dossier de la empresa?',
      a: 'Siguiendo la Regla 10 de nuestra arquitectura, la cuenta personal del operador gestiona las credenciales de acceso seguro (correo, contraseña, sesión en memoria volátil de JS), mientras que el Dossier representa la entidad jurídica mercantil que licita (CIF/NIF, solvencia económica, certificaciones ISO 27001/ENS y experiencia en contratos públicos previos).'
    },
    {
      q: '¿Puedo probar la plataforma antes de conectar los datos de mi empresa?',
      a: 'Por supuesto. Al pulsar en "Explorar Demo en Vivo" accedes a un entorno de demostración completamente funcional con la empresa simulada TechConsulting Soluciones S.L. (CIF B-88776655), donde podrás explorar expedientes reales, el sellado SHA-256 y la precalificación con IA.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#010102] text-[#f7f8f8] font-sans selection:bg-[#5e6ad2]/30 selection:text-white overflow-x-hidden">
      {/* 0. BARRA SUPERIOR INDICADORA DE SCROLL CON FÍSICA DE RESORTE */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5e6ad2] via-[#828fff] to-[#10b981] origin-left z-[60] pointer-events-none shadow-[0_0_14px_rgba(94,106,210,0.6)]"
      />

      {/* 1. FONDO AMBIENTAL DE CRISTAL LÍQUIDO */}
      <SilkBackground />

      {/* 2. NAVEGACIÓN SUPERIOR TRANSLÚCIDA CON CHROME DARK (LINEAR AESTHETIC) */}
      <header className="sticky top-0 z-50 bg-[#010102]/80 backdrop-blur-xl border-b border-[#23252a] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-[#5e6ad2] to-[#828fff] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_14px_rgba(94,106,210,0.4)] group-hover:scale-105 transition-transform">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#f7f8f8] leading-none">
                Pliego AI
              </span>
              <span className="text-[10px] font-mono text-[#8a8f98] tracking-wider uppercase mt-0.5">
                Contratación Pública Inteligente
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#8a8f98]">
            <a href="#como-funciona" className="hover:text-[#f7f8f8] transition-colors">¿Cómo funciona?</a>
            <a href="#dossier" className="hover:text-[#f7f8f8] transition-colors">Dossier de Empresa</a>
            <a href="#seguridad" className="hover:text-[#f7f8f8] transition-colors">Seguridad y Cumplimiento</a>
            <a href="#faq" className="hover:text-[#f7f8f8] transition-colors">Preguntas Frecuentes</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#5e6ad2]/15 text-[#828fff] hover:bg-[#5e6ad2]/25 border border-[#5e6ad2]/30 text-xs font-semibold transition-all cursor-pointer active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Interactiva</span>
            </button>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-[10px] text-xs font-semibold text-[#d0d6e0] hover:text-white hover:bg-white/5 transition-all"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="hidden sm:inline-flex px-4 py-2 rounded-[10px] bg-[#f7f8f8] hover:bg-white text-[#010102] text-xs font-semibold shadow-[0_0_14px_rgba(255,255,255,0.2)] transition-all items-center gap-1.5 active:scale-98"
            >
              <span>Registrar Empresa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SPLIT-SCREEN CON CONSOLA DE INSPECCIÓN LEGAL DUAL */}
      <section className="relative pt-10 sm:pt-14 pb-14 lg:pb-18 z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda (7 cols): Mensaje Editorial y Acciones */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Baliza PLACSP viva con ping de telemetría activa */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f1011] backdrop-blur-md border border-[#23252a] shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#10b981] uppercase">
                PLACSP · Sindicación Activa (CODICE XML)
              </span>
            </div>

            {/* Titular Principal con Tipografía Tight y Alta Densidad */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-[-0.03em] text-[#f7f8f8] leading-[1.08] text-balance">
              De la licitación pública a la oferta adjudicada.{' '}
              <span className="text-[#828fff] block sm:inline font-normal italic">
                Sin perder semanas leyendo pliegos.
              </span>
            </h1>

            {/* Subtexto conciso */}
            <p className="text-sm sm:text-base text-[#8a8f98] max-w-[50ch] leading-relaxed">
              Monitorización oficial del Estado, sellado inmutable SHA-256 y precalificación técnica en 7 dimensiones frente a tu dossier empresarial.
            </p>

            {/* Acciones Principales con estados táctiles */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/registro"
                className="px-6 py-3.5 rounded-[12px] bg-[#5e6ad2] hover:bg-[#828fff] active:scale-98 text-white text-sm font-semibold shadow-[0_0_24px_rgba(94,106,210,0.35)] flex items-center justify-center gap-2 transition-all group"
              >
                <span>Comenzar Registro Corporativo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={handleLaunchDemo}
                className="px-6 py-3.5 rounded-[12px] bg-[#0f1011] hover:bg-[#141516] active:scale-98 border border-[#23252a] hover:border-[#34343a] text-[#f7f8f8] text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#828fff]" />
                <span>Explorar Demo en Vivo (Sin Registro)</span>
              </button>
            </div>

            {/* Tira de Métricas Factuales Verificables con Cifras Tabulares */}
            <div className="pt-6 border-t border-[#23252a] grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-[#f7f8f8] tracking-tight tabular-nums font-mono">
                  850.000 €
                </span>
                <span className="text-[11px] font-medium text-[#8a8f98] leading-tight block mt-0.5">
                  Expediente DGT en vivo
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold tracking-tight text-[#10b981] tabular-nums font-mono">
                  100%
                </span>
                <span className="text-[11px] font-medium text-[#8a8f98] leading-tight block mt-0.5">
                  Citas físicas auditables
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold tracking-tight text-[#828fff] font-mono">
                  Gemini 3.1
                </span>
                <span className="text-[11px] font-medium text-[#8a8f98] leading-tight block mt-0.5">
                  Matching semántico
                </span>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha (5 cols): CONSOLA DE INSPECCIÓN LEGAL EN VIVO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-[20px] bg-[#0f1011] border border-[#23252a] hover:border-[#34343a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all p-5 group">
              
              {/* Animación de escaneo láser en vivo cuando se audita */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ top: '-10%', opacity: 0 }}
                    animate={{ top: '110%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5e6ad2] to-transparent shadow-[0_0_14px_#5e6ad2] z-30 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Cabecera del expediente */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#23252a]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8a8f98]">
                    DGT-2026-EXP-8891 · INSPECCIÓN EN VIVO
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-[6px] border border-[#10b981]/30 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  PURSUE
                </span>
              </div>

              {/* Título de la licitación */}
              <div className="py-3.5 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="uppercase tracking-widest text-[#828fff] font-bold">
                    DIRECCIÓN GENERAL DE TRÁFICO
                  </span>
                  <span className="text-[#8a8f98] tabular-nums">Presupuesto: 850.000 €</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#f7f8f8] leading-snug">
                  Migración y securización en la nube para telemática vial
                </h3>
              </div>

              {/* SELECTOR INTERACTIVO DE REQUISITOS */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f98] font-bold">
                    Prueba en directo el cruce con Gemini:
                  </span>
                  <span className="text-[10px] text-[#828fff] font-mono font-semibold flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-spin" />
                    <span>Latencia: {currentCriterion.latencyMs} ms</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {heroCriteria.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => handleTriggerScan(idx)}
                      className={`px-2 py-1.5 rounded-[8px] text-[11px] font-medium transition-all text-left cursor-pointer border ${
                        selectedCriterion === idx
                          ? 'bg-[#5e6ad2] text-white border-[#5e6ad2] shadow-[0_0_12px_rgba(94,106,210,0.4)]'
                          : 'bg-[#141516] hover:bg-[#18191a] text-[#8a8f98] hover:text-[#f7f8f8] border-[#23252a]'
                      }`}
                    >
                      <div className="truncate font-semibold">{c.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RESULTADO VIVO DEL ANÁLISIS DE GEMINI 3.1 FLASH */}
              <div className="mt-3 p-3.5 rounded-[12px] bg-[#141516] border border-[#23252a] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#f7f8f8] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span>{currentCriterion.name}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-[6px] border border-[#10b981]/30">
                    SUPPORTED · {currentCriterion.confidence}% Confianza
                  </span>
                </div>

                {/* Cita Física del Pliego */}
                <div className="p-2 rounded-[8px] bg-[#010102] border border-[#23252a] text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#8a8f98] font-mono">
                    <span>CITA FÍSICA AUDITADA</span>
                    <span className="text-[#828fff] font-semibold">{currentCriterion.pageRef}</span>
                  </div>
                  <p className="italic text-[#d0d6e0] leading-tight font-mono text-[10.5px]">
                    "{currentCriterion.pliegoQuote}"
                  </p>
                </div>

                {/* Evidencia contrastada del dossier de la empresa */}
                <div className="text-[11px] text-[#8a8f98] flex items-start gap-1.5 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="text-[#f7f8f8]">Evidencia del Dossier: </strong>
                    {currentCriterion.dossierProof}
                  </span>
                </div>
              </div>

              {/* Sello criptográfico SHA-256 */}
              <div className="mt-3 flex items-center justify-between p-2 rounded-[8px] bg-[#010102] border border-[#23252a] text-[10px] font-mono">
                <span className="text-[#8a8f98] flex items-center gap-1 truncate">
                  <Fingerprint className="w-3.5 h-3.5 text-[#828fff] shrink-0" />
                  <span className="truncate">SHA-256: 8f9a2b4c107e3d1982b6e82af0c399b1a5e...</span>
                </span>
                <button
                  onClick={handleCopyHash}
                  className="shrink-0 text-[#828fff] hover:text-white font-semibold ml-2 cursor-pointer flex items-center gap-1"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Botón hacia la demo real */}
              <div className="pt-3">
                <button
                  onClick={handleLaunchDemo}
                  className="w-full py-2.5 rounded-[10px] bg-[#5e6ad2] hover:bg-[#828fff] active:scale-98 text-white text-xs font-semibold shadow-[0_0_16px_rgba(94,106,210,0.3)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Abrir Expediente DGT en la Demo Interactiva</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. CÓDIGO CROMÁTICO (ANIMACIÓN DE ENTRADA AL SCROLLEAR) */}
      <section className="py-6 z-10 relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="p-4 sm:p-5 rounded-[20px] bg-[#0f1011] backdrop-blur-xl border border-[#23252a] shadow-xs grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          <motion.div whileHover={{ y: -2 }} className="p-3.5 rounded-[12px] bg-[#141516] border border-[#23252a] hover:border-[#34343a] space-y-1 transition-all">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5e6ad2]" />
              <span className="text-[11px] font-bold text-[#f7f8f8]">Lavanda (#5E6AD2)</span>
            </div>
            <p className="text-[11px] text-[#8a8f98] leading-tight">
              <strong>Inferencia y Motor IA:</strong> Gemini 3.1 Flash y GPT Terra/Sol, análisis CODICE XML y Structured Outputs.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-3.5 rounded-[12px] bg-[#141516] border border-[#23252a] hover:border-[#34343a] space-y-1 transition-all">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-[11px] font-bold text-[#f7f8f8]">Esmeralda (#10B981)</span>
            </div>
            <p className="text-[11px] text-[#8a8f98] leading-tight">
              <strong>Conformidad y Éxito:</strong> Requisito cumplido (<code className="text-[#10b981] font-mono">SUPPORTED</code>), oferta apta (<code className="text-[#10b981] font-mono">PURSUE</code>) y hash SHA-256 verificado.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-3.5 rounded-[12px] bg-[#141516] border border-[#23252a] hover:border-[#34343a] space-y-1 transition-all">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-[11px] font-bold text-[#f7f8f8]">Ámbar (#F59E0B)</span>
            </div>
            <p className="text-[11px] text-[#8a8f98] leading-tight">
              <strong>Centinela de Adendas:</strong> Modificación detectada en PLACSP, alerta activa y necesidad de reanálisis (<code className="text-[#f59e0b] font-mono">REQUIRES_REANALYSIS</code>).
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-3.5 rounded-[12px] bg-[#141516] border border-[#23252a] hover:border-[#34343a] space-y-1 transition-all">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="text-[11px] font-bold text-[#f7f8f8]">Rojo Coral (#EF4444)</span>
            </div>
            <p className="text-[11px] text-[#8a8f98] leading-tight">
              <strong>Bloqueo Determinista:</strong> Presupuesto inviable, plazo vencido o requisito obligatorio no soportado (<code className="text-[#ef4444] font-mono">DISCARD</code>).
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. PIPELINE ARQUITECTÓNICO INTERACTIVO (#como-funciona) CON SCROLL-REVEAL */}
      <section id="como-funciona" className="py-16 sm:py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f7f8f8] tracking-[-0.03em]">
              Arquitectura determinista de 4 fases
            </h2>
            <p className="text-xs sm:text-sm text-[#8a8f98] mt-2">
              Haz clic en cada fase para ver el flujo real y prueba el simulador interactivo de adendas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Lista interactiva de fases (5 cols) con scroll reveal */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 space-y-3"
            >
              {pipelineSteps.map((step) => {
                const isSelected = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-[16px] transition-all cursor-pointer flex items-start gap-3.5 border ${
                      isSelected
                        ? 'bg-[#0f1011] shadow-[0_0_24px_rgba(94,106,210,0.18)] border-[#5e6ad2]/50 ring-1 ring-[#5e6ad2]/30'
                        : 'bg-[#0f1011]/60 hover:bg-[#0f1011] border-[#23252a] hover:border-[#34343a]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#5e6ad2]/20 text-[#828fff]' : 'bg-[#141516] text-[#8a8f98]'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#828fff]">
                          {step.badge}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#8a8f98]">
                          · {step.semantic}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#f7f8f8]">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#8a8f98] leading-relaxed">
                        {step.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </motion.div>

            {/* Visualizador de Telemetría Dinámico (7 cols) con scroll reveal */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 sm:p-8 rounded-[20px] bg-[#0f1011] backdrop-blur-xl border border-[#23252a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[#23252a] pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#828fff] font-bold">
                        {pipelineSteps[activeStep].content.tag}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#f7f8f8] mt-0.5 tracking-tight">
                        {pipelineSteps[activeStep].content.heading}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#141516] border border-[#23252a] flex items-center justify-center text-xs font-mono font-bold text-[#828fff]">
                      0{activeStep + 1}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    {pipelineSteps[activeStep].content.desc}
                  </p>

                  {/* FASE 4: SIMULADOR INTERACTIVO DE ADENDA EN VIVO */}
                  {activeStep === 3 && (
                    <div className="p-4 rounded-[14px] bg-[#141516] border border-[#f59e0b]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#f59e0b] flex items-center gap-1.5 font-mono">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Simulador de Detección de Rectificaciones en Vivo</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#f59e0b] bg-[#f59e0b]/15 px-2 py-0.5 rounded-[6px] border border-[#f59e0b]/30">
                          ESTADO: {simulatedAdendaState}
                        </span>
                      </div>

                      {simulatedAdendaState === 'INITIAL' && (
                        <div className="space-y-2">
                          <p className="text-xs text-[#8a8f98]">
                            El pliego actual se encuentra sellado y validado en estado <strong className="text-[#10b981]">VALID (PURSUE)</strong>. Pulsa para simular que el organismo publica una adenda en el portal de contratación:
                          </p>
                          <button
                            onClick={() => setSimulatedAdendaState('ADENDA_DETECTED')}
                            className="px-3.5 py-2 rounded-[8px] bg-[#f59e0b] hover:bg-[#d97706] text-[#010102] text-xs font-bold transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)] cursor-pointer flex items-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Simular Publicación de Adenda en PLACSP</span>
                          </button>
                        </div>
                      )}

                      {simulatedAdendaState === 'ADENDA_DETECTED' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2.5 p-3.5 rounded-[10px] bg-[#010102] border border-[#ef4444]/40"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-[#ef4444]">
                            <AlertCircle className="w-4 h-4" />
                            <span>¡ALERTA CRÍTICA! Se detectó nuevo hash de pliego en PLACSP.</span>
                          </div>
                          <p className="text-xs text-[#8a8f98]">
                            El análisis anterior ha sido invalidado atómicamente a <strong className="text-[#f59e0b]">REQUIRES_REANALYSIS</strong> para protegerte de ofertar con datos obsoletos.
                          </p>
                          <button
                            onClick={() => setSimulatedAdendaState('REANALYZED')}
                            className="px-3.5 py-2 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white text-xs font-bold transition-all shadow-[0_0_14px_rgba(94,106,210,0.35)] cursor-pointer flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reanalizar con Gemini 3.1 Flash (Motor v2)</span>
                          </button>
                        </motion.div>
                      )}

                      {simulatedAdendaState === 'REANALYZED' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2 p-3.5 rounded-[10px] bg-[#010102] border border-[#10b981]/40"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-[#10b981]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Reanálisis v2 completado con éxito</span>
                          </div>
                          <p className="text-xs text-[#10b981]">
                            Nuevo hash sellado, cita auditada integrada y expediente restaurado a estado <strong className="font-bold">VALID (PURSUE)</strong>.
                          </p>
                          <button
                            onClick={() => setSimulatedAdendaState('INITIAL')}
                            className="text-[11px] font-semibold text-[#828fff] hover:underline cursor-pointer pt-1"
                          >
                            ← Reiniciar simulación
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Métricas clave de la fase */}
                  <div className="grid grid-cols-3 gap-3">
                    {pipelineSteps[activeStep].content.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-[10px] bg-[#141516] border border-[#23252a]">
                        <span className="text-[10px] text-[#8a8f98] font-medium block">
                          {m.label}
                        </span>
                        <span className="text-xs font-bold text-[#f7f8f8] mt-0.5 block tabular-nums font-mono">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Consola de Código y Telemetría Real */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f98] font-bold">
                      Evidencia en tiempo de ejecución:
                    </span>
                    <pre className="p-4 rounded-[12px] bg-[#010102] border border-[#23252a] text-[#828fff] font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
                      <code>{pipelineSteps[activeStep].content.codeSnippet}</code>
                    </pre>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 6. DOSSIER DE EMPRESA Y SEPARACIÓN DE IDENTIDADES (#dossier) CON SCROLL-REVEAL */}
      <section id="dossier" className="py-16 sm:py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f7f8f8] tracking-[-0.03em]">
              Dossier corporativo y separación de identidades
            </h2>
            <p className="text-xs sm:text-sm text-[#8a8f98] mt-2">
              Tus credenciales personales nunca se mezclan con la solvencia jurídica de tu empresa licitadora.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarjeta A: Identidad del Operador (con reveal) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="p-6 sm:p-8 rounded-[20px] bg-[#0f1011] backdrop-blur-xl border border-[#23252a] hover:border-[#34343a] shadow-xs space-y-4 transition-all"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#5e6ad2]/20 text-[#828fff] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#f7f8f8]">
                  1. Cuenta del Operador (Personal)
                </h3>
                <p className="text-xs text-[#8a8f98] mt-1 leading-relaxed">
                  Gestiona el acceso seguro a la plataforma, tokens de sesión criptográficos en memoria activa y preferencias individuales de notificaciones.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-[#d0d6e0]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Autenticación robusta con Supabase Auth</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Tokens JWT volátiles sin persistencia en localStorage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Gestión de invitaciones a miembros del equipo</span>
                </li>
              </ul>
            </motion.div>

            {/* Tarjeta B: Entidad Mercantil Licitadora (con reveal retrasado) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="p-6 sm:p-8 rounded-[20px] bg-[#0f1011] backdrop-blur-xl border border-[#23252a] hover:border-[#34343a] shadow-xs space-y-4 transition-all"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#10b981]/20 text-[#10b981] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#f7f8f8]">
                  2. Entidad Jurídica Licitadora (Dossier & Tenant)
                </h3>
                <p className="text-xs text-[#8a8f98] mt-1 leading-relaxed">
                  Almacena el CIF empresarial, solvencia económica (cifra de negocios), solvencia técnica y certificaciones oficiales requeridas en los pliegos.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-[#d0d6e0]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Certificaciones ENS Categoría Alta y Esquemas ISO 27001 / 9001</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Acreditación de solvencia técnica con proyectos en AAPP</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Aislamiento estricto por fila (RLS en PostgreSQL)</span>
                </li>
              </ul>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 7. SECCIÓN DE SEGURIDAD Y CUMPLIMIENTO ENS / RGPD (#seguridad) CON SCROLL-REVEAL */}
      <section id="seguridad" className="py-16 sm:py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 sm:p-12 rounded-[24px] bg-gradient-to-br from-[#0f1011] via-[#141516] to-[#010102] text-white border border-[#23252a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-10"
          >
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#10b981] font-bold">
                Cumplimiento Normativo y Garantías
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f7f8f8] tracking-[-0.03em] mt-1.5">
                Seguridad empresarial y alineación con el ENS y RGPD
              </h2>
              <p className="text-xs sm:text-sm text-[#8a8f98] mt-2 leading-relaxed">
                Diseñado para organismos públicos y empresas licitadoras que manejan datos sensibles de contratación estatal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-[16px] bg-[#010102] border border-[#23252a] space-y-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#10b981]/20 text-[#10b981] flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#f7f8f8]">Aislamiento Anti-BOLA & Anti-IDOR</h4>
                <p className="text-xs text-[#8a8f98] leading-relaxed">
                  Prohibición absoluta de consultar datos sin encadenar el <code className="text-[#10b981] font-mono">tenant_id</code>. Ningún usuario puede acceder a recursos de otra empresa licitadora.
                </p>
              </div>

              <div className="p-5 rounded-[16px] bg-[#010102] border border-[#23252a] space-y-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#5e6ad2]/20 text-[#828fff] flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#f7f8f8]">100% SQL Parametrizado</h4>
                <p className="text-xs text-[#8a8f98] leading-relaxed">
                  Cero concatenación de cadenas en base de datos. Consultas preparadas e índices compuestos <code className="text-[#828fff] font-mono">(tenant_id, id)</code> para máxima velocidad y protección.
                </p>
              </div>

              <div className="p-5 rounded-[16px] bg-[#010102] border border-[#23252a] space-y-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#f7f8f8]">Esquemas Zod Estrictos</h4>
                <p className="text-xs text-[#8a8f98] leading-relaxed">
                  Validación defensiva con esquemas Zod en todas las capas. Se descarta automáticamente cualquier intento de inyección de campos no autorizados.
                </p>
              </div>

            </div>

          </motion.div>
        </div>
      </section>

      {/* 8. PREGUNTAS FRECUENTES INTERACTIVAS (#faq) CON STAGGER AL SCROLLEAR */}
      <section id="faq" className="py-16 sm:py-20 z-10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f7f8f8] tracking-[-0.03em]">
              Preguntas Frecuentes
            </h2>
            <p className="text-xs sm:text-sm text-[#8a8f98]">
              Todo lo que necesitas saber antes de empezar a precalificar pliegos.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[16px] bg-[#0f1011] backdrop-blur-xl border border-[#23252a] hover:border-[#34343a] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#f7f8f8]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8a8f98] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#828fff]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs text-[#8a8f98] leading-relaxed border-t border-[#23252a] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. CTA FINAL CONVERTIDOR CON ENTRADA SUAVE */}
      <section className="py-16 sm:py-24 z-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 sm:p-12 rounded-[24px] bg-gradient-to-b from-[#0f1011] to-[#010102] border border-[#23252a] shadow-[0_0_50px_rgba(94,106,210,0.12)] text-center space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 text-[#828fff] text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Inmediato sin Compromiso</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#f7f8f8] tracking-[-0.03em] max-w-2xl mx-auto leading-tight">
              Comienza hoy a precalificar licitaciones con la máxima solvencia técnica
            </h2>

            <p className="text-xs sm:text-sm text-[#8a8f98] max-w-xl mx-auto leading-relaxed">
              Explora el expediente de la DGT en la demo o da de alta a tu empresa para monitorizar el feed oficial de PLACSP.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/registro"
                className="w-full sm:w-auto px-6 py-3.5 rounded-[12px] bg-[#5e6ad2] hover:bg-[#828fff] active:scale-98 text-white text-sm font-semibold shadow-[0_0_24px_rgba(94,106,210,0.35)] flex items-center justify-center gap-2 transition-all"
              >
                <span>Registrar Empresa Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                onClick={handleLaunchDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-[12px] bg-[#141516] hover:bg-[#18191a] active:scale-98 border border-[#23252a] hover:border-[#34343a] text-[#f7f8f8] text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#828fff]" />
                <span>Probar Demo Guiada</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. PIE DE PÁGINA EDITORIAL */}
      <footer className="py-8 z-10 relative border-t border-[#23252a] bg-[#010102] text-xs text-[#8a8f98]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[6px] bg-[#5e6ad2] text-white flex items-center justify-center text-[10px] font-bold">
              ✦
            </div>
            <span className="font-semibold text-[#f7f8f8]">Pliego AI</span>
            <span>·</span>
            <span>Plataforma de Contratación Pública Inteligente</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#10b981] font-medium font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              PLACSP Feed: Conectado
            </span>
            <span>·</span>
            <Link to="/login" className="hover:text-[#f7f8f8] transition-colors">Iniciar sesión</Link>
            <span>·</span>
            <Link to="/registro" className="hover:text-[#f7f8f8] transition-colors">Registrar Empresa</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
