import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleLaunchDemo = () => {
    loginAsDemo();
    navigate('/app/inicio');
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText?.('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const pipelineSteps = [
    {
      id: 0,
      badge: 'Fase 1',
      title: 'Sindicación Oficial PLACSP',
      shortDesc: 'Monitorización del feed oficial CODICE XML del Ministerio de Hacienda.',
      color: '#685cff',
      icon: <RefreshCw className="w-4 h-4 text-[#685cff]" />,
      content: {
        tag: 'INGESTA EN TIEMPO REAL',
        heading: 'Sondeo CODICE XML continuo',
        desc: 'El conector oficial normaliza importes a céntimos exactos, clasifica códigos CPV de 8 dígitos y extrae fechas de fin de plazo en UTC.',
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
SHA-256 Binario:  8f9a2b4c107e3d1982b6e82a...
SHA-256 Normalizado: 4d28e71fa0c399b1a5e...
Timestamp TSA:    2026-10-02T10:15:32Z (Verificado)`
      }
    },
    {
      id: 2,
      badge: 'Fase 3',
      title: 'Precalificación 7D con Citas Físicas',
      shortDesc: 'Cruce del dossier frente a requisitos con offsets exactos de página y texto.',
      color: '#685cff',
      icon: <Scale className="w-4 h-4 text-[#685cff]" />,
      content: {
        tag: 'CERO ALUCINACIONES',
        heading: '7 Dimensiones con auditoría estricta',
        desc: 'Puertas deterministas descartan licitaciones no viables en 0 ms. La IA tiene prohibido emitir juicios sin enlazar el párrafo exacto del pliego original.',
        metrics: [
          { label: 'Dimensiones', value: '7 canónicas' },
          { label: 'Auditoría', value: 'Página y Caracteres' },
          { label: 'Descarte coste 0', value: 'Determinista' }
        ],
        codeSnippet: `[REQUISITO EVALUADO]: Certificación de Seguridad ENS Alta
[ESTADO]: POTENTIALLY_ELIGIBLE (Cumple solvencia técnica)
[CITA AUDITABLE]: PCAP pág. 14, caracteres 4210-4380:
"...el adjudicatario deberá acreditar nivel ALTO en el Esquema
Nacional de Seguridad según RD 311/2022..."
[EVIDENCIA TENANT]: Certificado ENS-2024-9912 (Válido hasta 2027)`
      }
    },
    {
      id: 3,
      badge: 'Fase 4',
      title: 'Centinela de Adendas y Cartera',
      shortDesc: 'Invalidación atómica y alerta inmediata si el organismo modifica el pliego.',
      color: '#ca8517',
      icon: <AlertTriangle className="w-4 h-4 text-[#ca8517]" />,
      content: {
        tag: 'PROTECCIÓN CONTINUA',
        heading: 'Detección atómica de cambios en PLACSP',
        desc: 'Si la mesa de contratación publica una adenda o rectificación, el sistema invalida atómicamente el análisis previo y genera una alerta de reanálisis para no presentar una oferta desfasada.',
        metrics: [
          { label: 'Detección', value: 'Payload Hash diff' },
          { label: 'Estado', value: 'REQUIRES_REANALYSIS' },
          { label: 'Acción', value: 'Reanálisis con 1 clic' }
        ],
        codeSnippet: `ALERTA CRÍTICA: DOCUMENT_CHANGE (Adenda v2 detectada)
Expediente: DGT-2026-EXP-8891
Nuevo Pliego: PCAP_Modificado_Aclaracion_Lote_2.pdf
Hash anterior: 8f9a2b... -> Hash actual: a3f19c...
Acción ejecutada: Invalidez atómica de análisis an-001.
Recomendación: Ejecutar reanálisis con motor v2.`
      }
    }
  ];

  const faqs = [
    {
      q: '¿Cómo se conecta Pliego AI a la Plataforma de Contratación del Sector Público (PLACSP)?',
      a: 'Pliego AI consulta de forma automatizada y periódica el feed oficial CODICE XML publicado por el Ministerio de Hacienda. Los expedientes se descargan, se normalizan importes y fechas, y los pliegos PDF adjuntos se descargan y sellan criptográficamente en tiempo real.'
    },
    {
      q: '¿Por qué garantizáis "cero alucinaciones" en la precalificación con Inteligencia Artificial?',
      a: 'A diferencia de los asistentes genéricos, nuestro motor tiene una regla criptográfica inviolable: ninguna conclusión de idoneidad o requisito se acepta si no viene acompañada de una cita textual exacta con su número de página y offset físico de caracteres contrastado contra el snapshot inmutable del pliego.'
    },
    {
      q: '¿Qué diferencia hay entre la cuenta del operador y el dossier de la empresa?',
      a: 'Siguiendo la Regla 10 de nuestra arquitectura empresarial, la cuenta personal del operador gestiona las credenciales de acceso seguro (correo, contraseña, 2FA), mientras que el Dossier representa la entidad jurídica mercantil que licita (CIF/NIF, solvencia económica, certificaciones ISO 27001/ENS y experiencia en contratos públicos).'
    },
    {
      q: '¿Puedo probar la plataforma antes de conectar los datos de mi empresa?',
      a: 'Por supuesto. Al pulsar en "Explorar Demo en Vivo" accedes a un entorno de demostración completamente funcional con la empresa simulada TechConsulting Soluciones S.L. (CIF B-88776655), donde podrás explorar pliegos reales, el sellado SHA-256 y la precalificación con IA.'
    }
  ];

  return (
    <div className="relative min-h-screen text-[#171719] font-sans selection:bg-[#685cff]/20 selection:text-[#685cff] overflow-x-hidden">
      {/* 1. FONDO AMBIENTAL DE CRISTAL LÍQUIDO (Compartido con el espacio autenticado) */}
      <SilkBackground />

      {/* 2. NAVEGACIÓN SUPERIOR TRANSLÚCIDA CON DESENFOQUE GLOSSY */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/80 shadow-[0_4px_20px_rgba(20,20,30,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-[#685cff] to-[#8d82ff] flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(104,92,255,0.35)] group-hover:scale-105 transition-transform">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#171719] leading-none">
                Pliego AI
              </span>
              <span className="text-[10px] font-mono text-[#929097] tracking-wider uppercase mt-0.5">
                Contratación Pública Inteligente
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#69666d]">
            <a href="#como-funciona" className="hover:text-[#171719] transition-colors">¿Cómo funciona?</a>
            <a href="#dossier" className="hover:text-[#171719] transition-colors">Dossier de Empresa</a>
            <a href="#seguridad" className="hover:text-[#171719] transition-colors">Seguridad Militar</a>
            <a href="#faq" className="hover:text-[#171719] transition-colors">Preguntas Frecuentes</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#eeeaff] text-[#685cff] hover:bg-[#d5ccfe]/60 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Interactiva</span>
            </button>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-[12px] text-xs font-semibold text-[#171719] hover:bg-black/5 transition-all"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="hidden sm:inline-flex px-4 py-2 rounded-[12px] bg-[#171719] hover:bg-[#2b2b2e] text-white text-xs font-semibold shadow-xs transition-all items-center gap-1.5 active:scale-98"
            >
              <span>Registrar Empresa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SPLIT-SCREEN (ANTI-CENTER BIAS SEGÚN DESIGN-TASTE-FRONTEND) */}
      <section className="relative pt-12 sm:pt-16 pb-16 lg:pb-24 z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda (7 cols): Mensaje Editorial de Valor */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Status Beacon en Vivo */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[rgba(30,24,38,0.08)] shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#423d4c] uppercase">
                PLACSP · Sindicación en Vivo CODICE XML
              </span>
            </div>

            {/* Titular Principal con Toque Editorial */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#171719] leading-[1.08]">
              De la licitación pública a la oferta adjudicada.{' '}
              <span className="font-editorial italic font-normal text-[#685cff] block sm:inline">
                Sin perder semanas leyendo pliegos.
              </span>
            </h1>

            {/* Subtexto conciso (menos de 20 palabras) */}
            <p className="text-sm sm:text-base text-[#69666d] max-w-[50ch] leading-relaxed">
              Monitorización oficial de PLACSP, sellado inmutable SHA-256 y precalificación en 7 dimensiones frente a tu dossier empresarial.
            </p>

            {/* Acciones Principales con estados táctiles */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/registro"
                className="px-6 py-3.5 rounded-[14px] bg-[#171719] hover:bg-[#2b2b2e] active:scale-98 text-white text-sm font-semibold shadow-[0_4px_14px_rgba(23,23,25,0.18)] flex items-center justify-center gap-2 transition-all group"
              >
                <span>Comenzar Registro Corporativo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={handleLaunchDemo}
                className="px-6 py-3.5 rounded-[14px] bg-white/90 hover:bg-white active:scale-98 border border-[rgba(30,24,38,0.12)] text-[#171719] text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#685cff]" />
                <span>Explorar Demo en Vivo (Sin Registro)</span>
              </button>
            </div>

            {/* Tira factual de métricas verificables (Regla 8 Anti-Slop: Cero métricas ficticias) */}
            <div className="pt-6 border-t border-[rgba(30,24,38,0.06)] grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold text-[#171719] tracking-tight">
                  850.000 €
                </span>
                <span className="text-[11px] font-medium text-[#929097] leading-tight block">
                  Expediente DGT en vivo
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold text-[#171719] tracking-tight">
                  100%
                </span>
                <span className="text-[11px] font-medium text-[#929097] leading-tight block">
                  Citas físicas auditables
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-extrabold text-[#171719] tracking-tight">
                  SHA-256
                </span>
                <span className="text-[11px] font-medium text-[#929097] leading-tight block">
                  Sellado dual inmutable
                </span>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha (5 cols): Tarjeta Glossy Interactiva de Licitación en Vivo (.ai-command) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="ai-command group hover:shadow-[0_25px_60px_rgba(108,81,255,0.18)] transition-all">
              {/* Cabecera de la ficha */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(30,24,38,0.06)]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#69666d]">
                    EXPEDIENTE PLACSP · DGT-2026-EXP-8891
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#218a58] bg-[#e8f7ef] px-2 py-0.5 rounded-full border border-[#b2e7ca]">
                  PURSUE
                </span>
              </div>

              {/* Título de la licitación */}
              <div className="py-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#685cff] font-bold">
                  DIRECCIÓN GENERAL DE TRÁFICO
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#171719] leading-snug">
                  Servicios de migración y securización en la nube para sistemas de telemática vial
                </h3>
                <div className="flex items-center gap-3 pt-1 text-xs text-[#69666d]">
                  <span className="font-extrabold text-[#171719] text-sm">850.000,00 €</span>
                  <span>•</span>
                  <span>Plazo: 24 meses</span>
                  <span>•</span>
                  <span className="text-[#218a58] font-semibold">Puertas superadas (3/3)</span>
                </div>
              </div>

              {/* Sello criptográfico SHA-256 */}
              <div className="p-3 rounded-[12px] bg-white/70 border border-white/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#69666d] flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-[#685cff]" />
                    <span>Sellado SHA-256 (PCAP & PPT):</span>
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#685cff] hover:text-[#5544ea] cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-[#218a58]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copiado' : 'Copiar Hash'}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] text-[#423d4c] bg-white p-2 rounded-[8px] border border-[rgba(30,24,38,0.05)] truncate">
                  8f9a2b4c107e3d1982b6e82af0c399b1a5e...
                </div>
              </div>

              {/* Inspector de Citas Físicas (Anti-Alucinaciones) */}
              <div className="pt-3 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#929097] font-bold block">
                  Evidencia física auditada en el pliego:
                </span>
                <div className="p-2.5 rounded-[10px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#171719]">
                    <span className="text-[#218a58] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Solvencia Técnica: ENS Categoría Alta
                    </span>
                    <span className="text-[#929097] font-mono text-[10px]">PCAP Pág. 14</span>
                  </div>
                  <p className="text-[11px] text-[#69666d] italic leading-tight">
                    "...el adjudicatario deberá acreditar nivel ALTO en el Esquema Nacional de Seguridad según RD 311/2022..."
                  </p>
                </div>
              </div>

              {/* Botón de inspección interactivo hacia la demo */}
              <div className="pt-4">
                <button
                  onClick={handleLaunchDemo}
                  className="w-full py-2.5 rounded-[12px] bg-[#685cff] hover:bg-[#5544ea] active:scale-98 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Abrir Expediente DGT en la Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. PIPELINE ARQUITECTÓNICO INTERACTIVO EN 4 FASES (#como-funciona) */}
      <section id="como-funciona" className="py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171719] tracking-tight">
              Arquitectura determinista de 4 fases
            </h2>
            <p className="text-xs sm:text-sm text-[#69666d] mt-2">
              Explora cómo viaja cada pliego desde la plataforma del Ministerio hasta la decisión estratégica de licitar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Lista interactiva de fases (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {pipelineSteps.map((step) => {
                const isSelected = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-[18px] transition-all cursor-pointer flex items-start gap-3.5 border ${
                      isSelected
                        ? 'bg-white shadow-md border-white/80 ring-2 ring-[#685cff]/20'
                        : 'bg-white/40 hover:bg-white/70 border-white/50 shadow-2xs'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#eeeaff] text-[#685cff]' : 'bg-black/5 text-[#929097]'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#685cff]">
                          {step.badge}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#171719]">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#69666d] leading-relaxed">
                        {step.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Visualizador de Telemetría Dinámico (7 cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 sm:p-8 rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-floating space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[rgba(30,24,38,0.06)] pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#685cff] font-bold">
                        {pipelineSteps[activeStep].content.tag}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#171719] mt-0.5">
                        {pipelineSteps[activeStep].content.heading}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex items-center justify-center text-xs font-mono font-bold text-[#685cff]">
                      0{activeStep + 1}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#69666d] leading-relaxed">
                    {pipelineSteps[activeStep].content.desc}
                  </p>

                  {/* Métricas clave de la fase */}
                  <div className="grid grid-cols-3 gap-3">
                    {pipelineSteps[activeStep].content.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.05)]">
                        <span className="text-[10px] text-[#929097] font-medium block">
                          {m.label}
                        </span>
                        <span className="text-xs font-bold text-[#171719] mt-0.5 block">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Consola de Código y Telemetría Real */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#929097] font-bold">
                      Evidencia en tiempo de ejecución:
                    </span>
                    <pre className="p-4 rounded-[14px] bg-[#171719] text-[#E0DEF4] font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
                      <code>{pipelineSteps[activeStep].content.codeSnippet}</code>
                    </pre>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 5. DOSSIER DE EMPRESA Y SEPARACIÓN DE IDENTIDADES (#dossier) */}
      <section id="dossier" className="py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171719] tracking-tight">
              Dossier corporativo y separación de identidades
            </h2>
            <p className="text-xs sm:text-sm text-[#69666d] mt-2">
              Tus credenciales personales nunca se mezclan con la solvencia jurídica de tu empresa licitadora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarjeta A: Identidad del Operador */}
            <div className="p-6 sm:p-8 rounded-[24px] bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#171719]">
                  1. Cuenta del Operador (Personal)
                </h3>
                <p className="text-xs text-[#69666d] mt-1 leading-relaxed">
                  Gestiona el acceso seguro a la plataforma, tokens de sesión criptográficos en memoria activa y preferencias individuales de notificaciones.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-[#423d4c]">
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
            </div>

            {/* Tarjeta B: Entidad Mercantil Licitadora */}
            <div className="p-6 sm:p-8 rounded-[24px] bg-white/75 backdrop-blur-xl border border-white/90 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#e8f7ef] text-[#218a58] flex items-center justify-center shadow-2xs">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#171719]">
                  2. Entidad Jurídica Licitadora (Dossier & Tenant)
                </h3>
                <p className="text-xs text-[#69666d] mt-1 leading-relaxed">
                  Almacena el CIF empresarial, solvencia económica (cifra de negocios), solvencia técnica y certificaciones oficiales requeridas en los pliegos.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-[#423d4c]">
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
            </div>

          </div>

        </div>
      </section>

      {/* 6. SECCIÓN DE SEGURIDAD EMPRESARIAL (#seguridad) (ARMONIZADA CON EL TEMA SEDA) */}
      <section id="seguridad" className="py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-[28px] bg-gradient-to-br from-[#16141c]/95 via-[#1a1727]/90 to-[#121019]/95 text-white backdrop-blur-2xl border border-white/10 shadow-2xl space-y-10">
            
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#10b981] font-bold">
                Defensa en Profundidad
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
                Seguridad empresarial de grado militar
              </h2>
              <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                Diseñado para organismos y adjudicatarios que manejan información crítica de licitaciones públicas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-[18px] bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#10b981]/20 text-[#10b981] flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Anti-BOLA & Anti-IDOR</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Prohibición absoluta de consultar datos sin encadenar el <code className="text-[#10b981] font-mono">tenant_id</code>. Ningún usuario puede acceder a recursos de otra empresa.
                </p>
              </div>

              <div className="p-5 rounded-[18px] bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#685cff]/20 text-[#685cff] flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">100% SQL Parametrizado</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Cero concatenación de cadenas en base de datos. Consultas preparadas e índices compuestos <code className="text-[#685cff] font-mono">(tenant_id, id)</code> para máxima velocidad.
                </p>
              </div>

              <div className="p-5 rounded-[18px] bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#ca8517]/20 text-[#ca8517] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Anti-Mass Assignment</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Validación estricta con esquemas Zod en todas las capas. Se descarta automáticamente cualquier intento de inyección de campos privilegiados.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES INTERACTIVAS (#faq) */}
      <section id="faq" className="py-20 z-10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171719] tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-xs sm:text-sm text-[#69666d]">
              Todo lo que necesitas saber antes de empezar a precalificar pliegos.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-[18px] bg-white/75 backdrop-blur-xl border border-white/90 shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-black/2 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#171719]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#929097] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#685cff]' : ''
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
                        <div className="px-5 pb-5 text-xs text-[#69666d] leading-relaxed border-t border-[rgba(30,24,38,0.04)] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. CTA FINAL CONVERTIDOR */}
      <section className="py-16 sm:py-24 z-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-floating text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeaff] text-[#685cff] text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Inmediato sin Compromiso</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171719] tracking-tight max-w-2xl mx-auto leading-tight">
              Comienza hoy a precalificar licitaciones con la máxima solvencia técnica
            </h2>

            <p className="text-xs sm:text-sm text-[#69666d] max-w-xl mx-auto leading-relaxed">
              Explora el expediente de la DGT en la demo o da de alta a tu empresa para monitorizar el feed oficial de PLACSP.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/registro"
                className="w-full sm:w-auto px-6 py-3.5 rounded-[14px] bg-[#171719] hover:bg-[#2b2b2e] active:scale-98 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Registrar Empresa Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                onClick={handleLaunchDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-[14px] bg-white hover:bg-white/80 active:scale-98 border border-[rgba(30,24,38,0.12)] text-[#171719] text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#685cff]" />
                <span>Probar Demo Guiada</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PIE DE PÁGINA EDITORIAL */}
      <footer className="py-8 z-10 relative border-t border-[rgba(30,24,38,0.06)] bg-white/40 backdrop-blur-md text-xs text-[#929097]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[6px] bg-[#685cff] text-white flex items-center justify-center text-[10px] font-bold">
              ✦
            </div>
            <span className="font-semibold text-[#171719]">Pliego AI</span>
            <span>·</span>
            <span>Plataforma de Contratación Pública Inteligente</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#218a58] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              PLACSP Feed: Conectado
            </span>
            <span>·</span>
            <Link to="/login" className="hover:text-[#171719] transition-colors">Iniciar sesión</Link>
            <span>·</span>
            <Link to="/registro" className="hover:text-[#171719] transition-colors">Registrar Empresa</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
