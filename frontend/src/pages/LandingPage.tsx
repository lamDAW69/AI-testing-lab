import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
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
  Cpu
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const handleLaunchDemo = () => {
    loginAsDemo();
    navigate('/app/inicio');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#171719] font-sans selection:bg-[#685cff]/20 selection:text-[#685cff]">
      {/* 1. NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-50 bg-[#FBF9F5]/85 backdrop-blur-md border-b border-[rgba(30,24,38,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#685cff] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#171719] leading-none">
                Pliego AI
              </span>
              <span className="text-[10px] font-mono text-[#929097] tracking-wider uppercase mt-0.5">
                LicitaIA
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#69666d]">
            <a href="#como-funciona" className="hover:text-[#171719] transition-colors">¿Cómo funciona?</a>
            <a href="#metodologia" className="hover:text-[#171719] transition-colors">Metodología</a>
            <a href="#dossier" className="hover:text-[#171719] transition-colors">Dossier de Empresa</a>
            <a href="#seguridad" className="hover:text-[#171719] transition-colors">Seguridad Militar</a>
            <a href="#faq" className="hover:text-[#171719] transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleLaunchDemo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#eeeaff] text-[#685cff] hover:bg-[#d5ccfe]/50 text-xs font-semibold transition-all cursor-pointer"
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
              className="px-4 py-2 rounded-[12px] bg-[#171719] hover:bg-[#2b2b2e] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Registrar Empresa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO PRINCIPAL */}
      <section className="relative pt-16 sm:pt-24 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge de conexión oficial */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(30,24,38,0.08)] shadow-2xs mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#423d4c] uppercase">
              Conectado a la Plataforma de Contratación del Estado (PLACSP)
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#171719] leading-[1.1] max-w-4xl mx-auto">
            De la licitación pública a la oferta adjudicada.<br />
            <span className="text-[#685cff]">Sin perder semanas leyendo pliegos.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-[#69666d] max-w-2xl mx-auto leading-relaxed">
            Pliego AI monitoriza el feed oficial de licitaciones públicas, sella criptográficamente cada pliego con hash SHA-256 inmutable y precalifica en segundos la solvencia técnica, económica y riesgos frente a tu dossier empresarial.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/registro"
              className="w-full sm:w-auto px-6 py-3.5 rounded-[14px] bg-[#171719] hover:bg-[#2b2b2e] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all group"
            >
              <span>Comenzar Registro Corporativo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-[14px] bg-white hover:bg-white/80 border border-[rgba(30,24,38,0.12)] text-[#171719] text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#685cff]" />
              <span>Explorar Demo en Vivo (Sin Registro)</span>
            </button>
          </div>

          {/* Microgarantías de seguridad */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#929097]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              PostgreSQL RLS Multi-Tenant
            </span>
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#685cff]" />
              Cero Alucinaciones con Citas Físicas
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#171719]" />
              Tokens en Memoria (Anti-XSS)
            </span>
          </div>
        </div>

        {/* 3. SIMULACIÓN DE PRODUCTO EN VIVO (HERO INTERFACE PREVIEW) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
          <div className="rounded-[24px] bg-white border border-[rgba(30,24,38,0.1)] shadow-[0_25px_60px_-15px_rgba(20,20,30,0.12)] overflow-hidden">
            {/* Barra superior de ventana */}
            <div className="bg-[#171719] text-white px-5 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
                <span className="text-xs font-mono text-white/50 ml-3">
                  expediente_157_2026_valdetorres.pdf · SHA-256: d147c06d...
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
                ● Sellado Físico Verificado
              </span>
            </div>

            {/* Contenido del mock representativo */}
            <div className="p-6 sm:p-8 bg-[#FAF8F5] grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6">
              {/* Lado izquierdo: Análisis de la oportunidad */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-[18px] border border-[rgba(30,24,38,0.06)] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#685cff] font-bold">EXP: 020/2026-DGT</span>
                    <span className="text-[11px] font-bold text-[#218a58] bg-[#e8f7ef] px-2.5 py-1 rounded-full">
                      POTENCIALMENTE ELEGIBLE
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#171719]">
                    Servicio de desarrollo y modernización de plataforma cloud para la DGT
                  </h3>
                  <p className="text-xs text-[#69666d]">
                    Presupuesto base de licitación: <strong className="text-[#171719]">850.000,00 €</strong> · Plazo de presentación: <strong className="text-[#e44848]">14 días restantes</strong>
                  </p>
                </div>

                {/* Requisito con cita física verificada */}
                <div className="bg-white p-5 rounded-[18px] border-l-4 border-l-[#685cff] border border-[rgba(30,24,38,0.06)] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171719] flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-[#685cff]" />
                      Requisito Económico Obligatorio
                    </span>
                    <span className="text-[10px] font-mono text-[#929097]">Offsets [25960, 26153)</span>
                  </div>
                  <blockquote className="text-xs italic text-[#423d4c] bg-[#F6F4FB] p-3 rounded-[10px] border border-[#685cff]/15">
                    «El licitador deberá acreditar un volumen anual de negocios no inferior a 1,5 veces el presupuesto base de licitación en el año de mayor volumen de los tres últimos concluidos.»
                  </blockquote>
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-[#218a58] font-semibold flex items-center gap-1">
                      ✓ Cubierto por Dossier (Facturación: 2.100.000 €)
                    </span>
                    <span className="text-[11px] text-[#685cff] font-medium">Ver en pliego original →</span>
                  </div>
                </div>
              </div>

              {/* Lado derecho: Matriz de 7 Dimensiones */}
              <div className="bg-white p-5 rounded-[18px] border border-[rgba(30,24,38,0.06)] shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#929097] mb-3">
                    Matriz de Viabilidad (7 Dimensiones)
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-[rgba(30,24,38,0.04)]">
                      <span className="text-[#423d4c]">1. Elegibilidad Determinista</span>
                      <span className="font-bold text-[#218a58]">SUPERADA (Sin bloqueo)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[rgba(30,24,38,0.04)]">
                      <span className="text-[#423d4c]">2. Encaje Técnico (CPV 72000000)</span>
                      <span className="font-bold text-[#685cff]">ALTO (100%)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[rgba(30,24,38,0.04)]">
                      <span className="text-[#423d4c]">3. Solvencia Económica</span>
                      <span className="font-bold text-[#218a58]">SUFICIENTE</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[rgba(30,24,38,0.04)]">
                      <span className="text-[#423d4c]">4. Capacidad y Certificaciones</span>
                      <span className="font-bold text-[#171719]">ISO 27001 / ENS ALTO</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[rgba(30,24,38,0.04)]">
                      <span className="text-[#423d4c]">5. Riesgo Contractual y Penalidades</span>
                      <span className="font-bold text-[#ca8517]">BAJO (Estándar DGT)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[rgba(30,24,38,0.06)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#929097] block">Recomendación Estratégica</span>
                    <span className="text-sm font-extrabold text-[#218a58]">PRESENTAR OFERTA (PURSUE)</span>
                  </div>
                  <button
                    onClick={handleLaunchDemo}
                    className="px-3 py-1.5 rounded-[10px] bg-[#685cff] text-white text-xs font-semibold hover:bg-[#5544ea] transition-colors cursor-pointer"
                  >
                    Probar análisis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-white border-y border-[rgba(30,24,38,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#685cff] font-bold">
              Flujo Operativo
            </span>
            <h2 className="text-3xl font-extrabold text-[#171719] tracking-tight mt-2">
              De la publicación oficial a la decisión estratégica en 4 fases
            </h2>
            <p className="text-xs sm:text-sm text-[#69666d] mt-3">
              Un pipeline técnico robusto que sustituye el escaneo manual de cientos de páginas por análisis asistido por IA determinista.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Paso 1 */}
            <div className="p-6 rounded-[20px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[12px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="text-sm font-bold text-[#171719] mb-2">
                  Ingesta Oficial de PLACSP
                </h3>
                <p className="text-xs text-[#69666d] leading-relaxed">
                  Sondeo automático del feed CODICE XML de Hacienda. Normalización a céntimos enteros, clasificación de códigos CPV y detección inmediata de pliegos PCAP y PPT.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(30,24,38,0.06)] text-[11px] font-mono text-[#929097]">
                Feed ATOM / XML
              </div>
            </div>

            {/* Paso 2 */}
            <div className="p-6 rounded-[20px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[12px] bg-[#e8f7ef] text-[#218a58] flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="text-sm font-bold text-[#171719] mb-2">
                  Sellado Dual SHA-256
                </h3>
                <p className="text-xs text-[#69666d] leading-relaxed">
                  Descarga protegida contra SSRF. Se calcula el hash inmutable tanto del PDF binario como del texto plano extraído en volúmenes privados de disco.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(30,24,38,0.06)] text-[11px] font-mono text-[#929097]">
                Integridad Inmutable
              </div>
            </div>

            {/* Paso 3 */}
            <div className="p-6 rounded-[20px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[12px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="text-sm font-bold text-[#171719] mb-2">
                  Precalificación y Matching
                </h3>
                <p className="text-xs text-[#69666d] leading-relaxed">
                  Puertas deterministas descartan pliegos con solvencia inalcanzable sin gastar IA. Si es viable, el motor evalúa encaje en 7 dimensiones y cita las páginas exactas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(30,24,38,0.06)] text-[11px] font-mono text-[#929097]">
                7 Dimensiones Explicables
              </div>
            </div>

            {/* Paso 4 */}
            <div className="p-6 rounded-[20px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[12px] bg-[#fff3db] text-[#ca8517] flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="text-sm font-bold text-[#171719] mb-2">
                  Invalidez por Adendas
                </h3>
                <p className="text-xs text-[#69666d] leading-relaxed">
                  Si el organismo publica una rectificación del pliego, el sistema invalida el análisis previo de forma atómica y alerta al equipo para su reevaluación inmediata.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(30,24,38,0.06)] text-[11px] font-mono text-[#929097]">
                Auditoría Antifraude
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DOSSIER EMPRESARIAL */}
      <section id="dossier" className="py-20 bg-[#FBF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#218a58] font-bold">
                Tu Empresa Licitadora
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171719] tracking-tight mt-2">
                Un único Dossier centralizado para todas tus licitaciones
              </h2>
              <p className="text-xs sm:text-sm text-[#69666d] mt-4 leading-relaxed">
                Olvídate de buscar certificados tributarios o memorias de proyectos pasados en carpetas compartidas. LicitaIA almacena y estructura las capacidades de tu organización bajo tres categorías canónicas:
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#e8f7ef] text-[#218a58] flex items-center justify-center shrink-0 text-xs font-bold">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#171719]">Solvencia Económica y Financiera</h4>
                    <p className="text-xs text-[#69666d] mt-0.5">Volumen anual de facturación, patrimonio neto y límites máximos de contrato.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center shrink-0 text-xs font-bold">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#171719]">Solvencia Técnica y Proyectos Similares</h4>
                    <p className="text-xs text-[#69666d] mt-0.5">Relación de servicios ejecutados con clientes públicos y privados con importes y fechas verificables.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#fff3db] text-[#ca8517] flex items-center justify-center shrink-0 text-xs font-bold">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#171719]">Acreditaciones Oficiales</h4>
                    <p className="text-xs text-[#69666d] mt-0.5">Esquema Nacional de Seguridad (ENS), ISO 27001, ISO 9001 e ISO 14001 con vigencias auditadas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-white border border-[rgba(30,24,38,0.08)] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(30,24,38,0.06)]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#685cff]" />
                  <span className="text-xs font-bold text-[#171719]">Dossier Corporativo · TechConsulting Soluciones S.L.</span>
                </div>
                <span className="text-[10px] font-mono text-[#218a58] bg-[#e8f7ef] px-2 py-0.5 rounded-full font-bold">
                  B-88776655
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#171719] block">Esquema Nacional de Seguridad (ENS) - Categoría ALTA</span>
                    <span className="text-[11px] text-[#69666d]">Emitido por CCN-CERT · Vigente hasta 2027</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#218a58]">VERIFICADO</span>
                </div>

                <div className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#171719] block">Desarrollo de Software Cloud para Ministerio de Justicia</span>
                    <span className="text-[11px] text-[#69666d]">Importe: 420.000 € · Finalizado con éxito</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#218a58]">EVIDENCIA VÁLIDA</span>
                </div>

                <div className="p-3 rounded-[12px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#171719] block">ISO 27001:2022 Gestión de Seguridad</span>
                    <span className="text-[11px] text-[#69666d]">AENOR · Auditoría anual superada</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#218a58]">VERIFICADO</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[rgba(30,24,38,0.06)] flex justify-end">
                <button
                  onClick={handleLaunchDemo}
                  className="text-xs font-bold text-[#685cff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explorar dossier interactivo en la demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN SEGURIDAD MILITAR */}
      <section id="seguridad" className="py-20 bg-[#171719] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#10b981] font-bold">
              Seguridad de Grado Militar
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              Seguridad empresarial y defensa en profundidad
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-3">
              Construido siguiendo los estándares de seguridad más estrictos: prevención total contra BOLA/IDOR, inyección y robo de sesión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[20px] bg-white/5 border border-white/10 space-y-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#10b981]/20 text-[#10b981] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">PostgreSQL RLS por Fila</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Ninguna consulta se ejecuta sin encadenar el <code className="text-[#10b981]">tenant_id</code>. El inquilino A no puede ver ni modificar datos del inquilino B bajo ninguna circunstancia.
              </p>
            </div>

            <div className="p-6 rounded-[20px] bg-white/5 border border-white/10 space-y-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#685cff]/20 text-[#685cff] flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Tokens JWT en Memoria</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Inmunidad total contra ataques XSS: las credenciales nunca se almacenan en <code className="text-[#685cff]">localStorage</code> ni cookies vulnerables; viven exclusivamente en la memoria JavaScript activa.
              </p>
            </div>

            <div className="p-6 rounded-[20px] bg-white/5 border border-white/10 space-y-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#ffbd2e]/20 text-[#ffbd2e] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Cero Alucinaciones de IA</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                El motor LLM está forzado a anclar cada criterio extraído a offsets exactos de caracteres en el snapshot oficial del pliego, impidiendo invenciones o falsas interpretaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (FAQ) */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#685cff] font-bold">
              Preguntas Frecuentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171719] tracking-tight mt-2">
              Todo lo que necesitas saber antes de empezar
            </h2>
          </div>

          <div className="space-y-4">
            <details className="p-5 rounded-[16px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] group">
              <summary className="text-xs sm:text-sm font-bold text-[#171719] cursor-pointer list-none flex items-center justify-between">
                <span>¿De dónde provienen las licitaciones públicas mostradas?</span>
                <ChevronRight className="w-4 h-4 text-[#929097] group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-xs text-[#69666d] mt-3 leading-relaxed">
                Se ingieren en tiempo real directamente desde los feeds oficiales CODICE XML de la Plataforma de Contratación del Sector Público (PLACSP), gestionada por el Ministerio de Hacienda de España. Incluye licitaciones de la Administración General del Estado, Comunidades Autónomas y Entidades Locales.
              </p>
            </details>

            <details className="p-5 rounded-[16px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] group">
              <summary className="text-xs sm:text-sm font-bold text-[#171719] cursor-pointer list-none flex items-center justify-between">
                <span>¿Cómo evalúa Pliego AI si mi empresa cumple con los requisitos?</span>
                <ChevronRight className="w-4 h-4 text-[#929097] group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-xs text-[#69666d] mt-3 leading-relaxed">
                El sistema cruza los requisitos obligatorios del pliego (solvencia económica mínima, certificaciones técnicas requeridas y trabajos previos) contra los datos registrados en el Dossier de tu empresa. Las puertas deterministas descartan automáticamente expedientes que tu empresa no puede licitar legalmente, ahorrándote tiempo.
              </p>
            </details>

            <details className="p-5 rounded-[16px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] group">
              <summary className="text-xs sm:text-sm font-bold text-[#171719] cursor-pointer list-none flex items-center justify-between">
                <span>¿Qué ocurre si el organismo licitador modifica o rectifica un pliego?</span>
                <ChevronRight className="w-4 h-4 text-[#929097] group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-xs text-[#69666d] mt-3 leading-relaxed">
                El detector de adendas identifica la publicación de nuevos documentos oficiales, degrada el estado del análisis a <code>REQUIRES_REANALYSIS</code> y emite una alerta operativa en tu panel para que tu equipo revise los cambios antes de presentar la oferta.
              </p>
            </details>

            <details className="p-5 rounded-[16px] bg-[#FAF8F5] border border-[rgba(30,24,38,0.06)] group">
              <summary className="text-xs sm:text-sm font-bold text-[#171719] cursor-pointer list-none flex items-center justify-between">
                <span>¿Puedo probar la herramienta antes de crear una cuenta corporativa?</span>
                <ChevronRight className="w-4 h-4 text-[#929097] group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-xs text-[#69666d] mt-3 leading-relaxed">
                Sí. Puedes pulsar en cualquier momento el botón <strong>"Demo Interactiva"</strong> para acceder al catálogo, ver expedientes reales de la DGT o el Ministerio de Justicia y comprobar el funcionamiento de la matriz de viabilidad sin necesidad de registrarte.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="py-20 bg-gradient-to-b from-[#FAF8F5] to-[#EDE7DF] border-t border-[rgba(30,24,38,0.06)] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171719] tracking-tight">
            Empieza a precalificar licitaciones con rigor militar
          </h2>
          <p className="mt-3 text-sm text-[#69666d] max-w-xl mx-auto">
            Configura el dossier de tu empresa en menos de 5 minutos y detecta las oportunidades que verdaderamente puedes ganar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/registro"
              className="w-full sm:w-auto px-6 py-3.5 rounded-[14px] bg-[#171719] hover:bg-[#2b2b2e] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <span>Dar de Alta tu Empresa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-[14px] bg-white hover:bg-white/80 border border-[rgba(30,24,38,0.12)] text-[#171719] text-xs font-semibold shadow-xs cursor-pointer"
            >
              Probar Demo Interactiva
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-8 bg-white border-t border-[rgba(30,24,38,0.06)] text-xs text-[#929097]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#171719]">Pliego AI</span>
            <span>· Plataforma de Inteligencia y Precalificación de Contratación Pública</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-[#171719]">Acceso Clientes</Link>
            <Link to="/registro" className="hover:text-[#171719]">Registro</Link>
            <span>© 2026 LicitaIA / Pliego AI. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
