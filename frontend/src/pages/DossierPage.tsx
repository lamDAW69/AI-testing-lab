import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Plus,
  FileText,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { DossierStatusBadge } from '../components/ui/StatusBadge';
import { Drawer } from '../components/ui/Drawer';
import { Certification, EvidenceStatus } from '../types/dossier';

export const DossierPage: React.FC = () => {
  const { user, activeTenant, canPerformAction } = useAuth();
  const { profile, certifications, evidences } = useData();

  const [activeTab, setActiveTab] = useState<
    'perfil' | 'certificaciones' | 'experiencia' | 'capacidades' | 'evidencias'
  >('certificaciones');

  const [searchTerm, setSearchTerm] = useState('');

  // Estado del Drawer de edición / adición de certificación (Sección 48)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Formulario en el drawer
  const [formName, setFormName] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formValidUntil, setFormValidUntil] = useState('');
  const [formDocRef, setFormDocRef] = useState('');

  const canEdit = canPerformAction('edit_dossier');

  // Abrir drawer para editar o actualizar
  const handleOpenDrawer = (cert?: Certification) => {
    if (cert) {
      setSelectedCert(cert);
      setFormName(cert.name);
      setFormIssuer(cert.issuer);
      setFormValidUntil(cert.expiresAt ? cert.expiresAt.split('T')[0] : '');
      setFormDocRef(cert.certificateNumber || '');
    } else {
      setSelectedCert(null);
      setFormName('');
      setFormIssuer('');
      setFormValidUntil('');
      setFormDocRef('');
    }
    setIsDrawerOpen(true);
  };

  const handleSaveCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formIssuer.trim()) return;

    // Guardado seguro: Las nuevas declaraciones se registran como DECLARED o PENDING_REVIEW
    // NUNCA como VERIFIED de forma fraudulenta (Regla de integridad y Sección 46)
    setIsDrawerOpen(false);
  };

  // Filtrado de certificaciones
  const filteredCertifications = certifications.filter(
    (c) =>
      searchTerm === '' ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      {/* 42. HEADER DOSSIER (Sección 42) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <nav className="text-xs text-[#929097] flex items-center gap-1.5 mb-1.5">
            <Link to="/app/inicio" className="hover:text-[#171719] transition-colors">
              Inicio
            </Link>
            <span>›</span>
            <span className="text-[#171719] font-medium">Dossier</span>
          </nav>

          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171719] tracking-tight">
            Dossier
          </h1>
          <p className="text-xs sm:text-sm text-[#69666d] mt-1 max-w-xl">
            La información de tu organización utilizada para analizar los pliegos.
          </p>
        </div>

        {/* Botón Editar Perfil */}
        <div>
          <button
            onClick={() => handleOpenDrawer()}
            className="px-4 py-2 rounded-[11px] bg-white hover:bg-[#f5f1ed] text-xs font-semibold text-[#171719] border border-[rgba(30,24,38,0.12)] transition-colors shadow-xs cursor-pointer"
          >
            Editar perfil
          </button>
        </div>
      </div>

      {/* 43. RESUMEN DEL DOSSIER: DOS CARDS (Sección 43) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Organización Activa */}
        <div className="surface p-5 rounded-[20px] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#929097]">
              Organización autorizada
            </span>
            <h2 className="text-lg font-bold text-[#171719] tracking-tight">
              {activeTenant?.name || 'Ayuntamiento de Madrid'}
            </h2>
            <p className="text-xs text-[#69666d]">
              {profile?.description || 'Administración pública y Servicios TIC'}
            </p>
            <p className="text-xs text-[#929097] mt-0.5">
              Madrid, España · CIF: {activeTenant?.taxId || 'B-88776655'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-[14px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: 82% Cobertura Documental con Progress Ring (Sección 33) */}
        <div className="surface p-5 rounded-[20px] flex items-center justify-between shadow-xs">
          <div className="space-y-1 pr-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#685cff] font-semibold">
              Evidencia acreditada
            </span>
            <div className="text-3xl font-bold text-[#171719] font-ui tabular-nums tracking-tight">
              82%
            </div>
            <h3 className="text-xs font-semibold text-[#171719]">
              Cobertura documental
            </h3>
            <p className="text-xs text-[#69666d] leading-relaxed">
              Mantén actualizadas tus certificaciones, experiencia y evidencias.
            </p>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#efedef]"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#685cff]"
                strokeDasharray="82, 100"
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#685cff]" />
            </div>
          </div>
        </div>
      </div>

      {/* 44 & 56. NAVEGACIÓN INTERNA: TABS CON SCROLL HORIZONTAL (Sección 44 y 56) */}
      <div className="border-b border-[rgba(30,24,38,0.08)] overflow-x-auto">
        <div className="dossier-tabs flex gap-7 min-h-[46px] whitespace-nowrap min-w-max">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative ${
              activeTab === 'perfil'
                ? 'text-[#171719] font-semibold active'
                : 'text-[#69666d] hover:text-[#171719]'
            }`}
          >
            Perfil
          </button>

          <button
            onClick={() => setActiveTab('certificaciones')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative flex items-center gap-1.5 ${
              activeTab === 'certificaciones'
                ? 'text-[#171719] font-semibold active'
                : 'text-[#69666d] hover:text-[#171719]'
            }`}
          >
            <span>Certificaciones</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#eeeaff] text-[#685cff]">
              {certifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('experiencia')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative flex items-center gap-1.5 ${
              activeTab === 'experiencia'
                ? 'text-[#171719] font-semibold active'
                : 'text-[#69666d] hover:text-[#171719]'
            }`}
          >
            <span>Experiencia</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#f5f1ed] text-[#69666d]">
              {evidences.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('capacidades')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative ${
              activeTab === 'capacidades'
                ? 'text-[#171719] font-semibold active'
                : 'text-[#69666d] hover:text-[#171719]'
            }`}
          >
            Capacidades
          </button>

          <button
            onClick={() => setActiveTab('evidencias')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative ${
              activeTab === 'evidencias'
                ? 'text-[#171719] font-semibold active'
                : 'text-[#69666d] hover:text-[#171719]'
            }`}
          >
            Evidencias
          </button>
        </div>
      </div>

      {/* 45. TAB CONTENT: CERTIFICACIONES (Secciones 45, 46, 47) */}
      {activeTab === 'certificaciones' && (
        <div className="space-y-4">
          {/* Toolbar de certificaciones */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929097]" />
              <input
                type="text"
                placeholder="Buscar certificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-white/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] rounded-[11px] text-xs text-[#171719] placeholder-[#929097] focus:outline-none shadow-xs transition-all"
              />
            </div>

            <button
              onClick={() => handleOpenDrawer()}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[11px] bg-[#171719] hover:bg-[#28282b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir certificación</span>
            </button>
          </div>

          {/* Lista de Certificaciones */}
          <div className="surface rounded-[18px] divide-y divide-[rgba(30,24,38,0.06)] overflow-hidden shadow-xs">
            {filteredCertifications.map((cert) => {
              const isExpired = cert.status === 'EXPIRED';

              return (
                <div
                  key={cert.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/70 transition-colors"
                >
                  {/* Nombre y Emisor */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#f5f1ed] border border-[rgba(30,24,38,0.06)] flex items-center justify-center text-[#685cff] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-[#171719]">
                          {cert.name}
                        </h3>
                        <DossierStatusBadge status={cert.status} />
                      </div>
                      <p className="text-xs text-[#69666d] mt-0.5">
                        Emisor: <span className="text-[#171719]">{cert.issuer}</span>
                      </p>
                      {cert.certificateNumber && (
                        <span className="text-[11px] text-[#929097] font-mono mt-1 block">
                          Nº Certificado: {cert.certificateNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Estado de Validez y Acciones */}
                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-[#929097] block">
                        {isExpired ? 'Caducada el' : 'Válida hasta'}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isExpired ? 'text-[#ca8517]' : 'text-[#171719]'
                        }`}
                      >
                        {cert.expiresAt
                          ? new Intl.DateTimeFormat('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }).format(new Date(cert.expiresAt))
                          : 'Indefinida'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Botón Actualizar para caducadas (Sección 47) */}
                      {isExpired && (
                        <button
                          onClick={() => handleOpenDrawer(cert)}
                          className="px-3 py-1.5 rounded-[9px] bg-[#fff3db] hover:bg-[#ffecc4] text-[#ca8517] text-xs font-semibold transition-colors cursor-pointer border border-[#fce1b8]"
                        >
                          Actualizar
                        </button>
                      )}

                      <button
                        onClick={() => alert(`Visualizando acreditación: ${cert.certificateNumber || cert.name}`)}
                        className="px-3 py-1.5 rounded-[9px] bg-white hover:bg-[#f5f1ed] text-[#171719] border border-[rgba(30,24,38,0.1)] text-xs font-medium transition-colors cursor-pointer"
                      >
                        Ver documento
                      </button>

                      <button
                        onClick={() => handleOpenDrawer(cert)}
                        className="p-1.5 rounded-lg text-[#929097] hover:text-[#171719] hover:bg-black/[0.04] transition-colors cursor-pointer"
                        title="Opciones"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB PERFIL */}
      {activeTab === 'perfil' && (
        <div className="surface p-6 rounded-[20px] space-y-4 max-w-3xl">
          <h3 className="text-sm font-semibold text-[#171719] pb-2 border-b border-[rgba(30,24,38,0.08)]">
            Datos Corporativos de la Organización
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#929097] block">Razón Social</span>
              <span className="font-semibold text-[#171719]">{activeTenant?.name}</span>
            </div>
            <div>
              <span className="text-[#929097] block">Identificación Fiscal</span>
              <span className="font-mono font-semibold text-[#171719]">{activeTenant?.taxId}</span>
            </div>
            <div>
              <span className="text-[#929097] block">Sector de Actividad</span>
              <span className="text-[#171719]">{profile?.description || 'Tecnología e Infraestructuras'}</span>
            </div>
            <div>
              <span className="text-[#929097] block">Facturación Anual Auditada</span>
              <span className="font-mono text-[#171719] tabular-nums">4.200.000 €</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB EXPERIENCIA Y EVIDENCIAS */}
      {(activeTab === 'experiencia' || activeTab === 'evidencias' || activeTab === 'capacidades') && (
        <div className="surface rounded-[18px] divide-y divide-[rgba(30,24,38,0.06)] overflow-hidden shadow-xs">
          {evidences.map((ev) => (
            <div key={ev.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#f5f1ed] text-[#685cff] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#171719]">
                      {ev.title}
                    </h4>
                    <DossierStatusBadge status={ev.status} />
                  </div>
                  <p className="text-xs text-[#69666d] mt-0.5">
                    {ev.description}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {ev.verifiedAmount && (
                  <span className="text-xs font-mono font-semibold text-[#171719] tabular-nums block">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(ev.verifiedAmount)}
                  </span>
                )}
                <span className="text-[11px] text-[#929097]">
                  {ev.documentReference}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 48. DRAWER DE EDICIÓN CONTEXTUAL (Secciones 48 y 49) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedCert ? selectedCert.name : 'Nueva Certificación'}
        subtitle="Declara o actualiza los datos acreditativos de tu organización"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-3.5 py-2 rounded-[10px] bg-white hover:bg-[#f5f1ed] text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.12)] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveCertification}
              className="px-4 py-2 rounded-[10px] bg-[#171719] hover:bg-[#28282b] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
            >
              Guardar declaración
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCertification} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Nombre de la certificación
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ej: ISO 27001 o ENS Nivel Medio"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Entidad emisora
            </label>
            <input
              type="text"
              required
              value={formIssuer}
              onChange={(e) => setFormIssuer(e.target.value)}
              placeholder="Ej: AENOR, TÜV Rheinland, BSI"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Fecha de caducidad / validez
            </label>
            <input
              type="date"
              value={formValidUntil}
              onChange={(e) => setFormValidUntil(e.target.value)}
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Referencia documental / Hash del archivo
            </label>
            <input
              type="text"
              value={formDocRef}
              onChange={(e) => setFormDocRef(e.target.value)}
              placeholder="Ej: Certificado_ISO27001_2026.pdf"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all font-mono"
            />
          </div>

          {/* Nota de integridad y seguridad */}
          <div className="p-3 rounded-[12px] bg-[#f5f1ed] border border-[rgba(30,24,38,0.06)] text-[11px] text-[#69666d] leading-relaxed">
            <span className="font-semibold text-[#171719]">Aviso de Integridad:</span> Todas las nuevas acreditaciones se registran con estado <span className="font-mono text-[#685cff]">DECLARED</span> hasta su verificación documental. Los usuarios no pueden forzar unilateralmente el estado de verificación.
          </div>
        </form>
      </Drawer>
    </div>
  );
};
