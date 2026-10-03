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
  Briefcase,
  Users,
  Coins,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useData } from '../lib/data-context';
import { DossierStatusBadge } from '../components/ui/StatusBadge';
import { Drawer } from '../components/ui/Drawer';
import { Certification, BusinessEvidence, EvidenceStatus } from '../types/dossier';
import { formatCurrency } from '../lib/formatters';

export const DossierPage: React.FC = () => {
  const { user, activeTenant, canPerformAction } = useAuth();
  const {
    profile,
    certifications,
    evidences,
    addCertification,
    updateCertification,
    updateProfile,
    addEvidence,
  } = useData();

  const [activeTab, setActiveTab] = useState<'perfil' | 'certificaciones' | 'evidencias'>('certificaciones');

  const [searchTerm, setSearchTerm] = useState('');
  const [evidenceSearchTerm, setEvidenceSearchTerm] = useState('');
  const [evidenceCategory, setEvidenceCategory] = useState<
    'ALL' | 'PREVIOUS_CONTRACTS' | 'TEAM_QUALIFICATION' | 'TECHNICAL_MEANS' | 'FINANCIAL_SOLVENCY'
  >('ALL');

  // Estado del Drawer de adición de evidencia
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [evFormCategory, setEvFormCategory] = useState<BusinessEvidence['category']>('PREVIOUS_CONTRACTS');
  const [evFormTitle, setEvFormTitle] = useState('');
  const [evFormDesc, setEvFormDesc] = useState('');
  const [evFormDocRef, setEvFormDocRef] = useState('');
  const [evFormAmount, setEvFormAmount] = useState<string>('');
  const [evFormValidUntil, setEvFormValidUntil] = useState('');

  // Estado del Drawer de edición / adición de certificación (Sección 48)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Formulario en el drawer de certificación
  const [formName, setFormName] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formValidUntil, setFormValidUntil] = useState('');
  const [formDocRef, setFormDocRef] = useState('');

  // Estado del Drawer de edición de perfil de organización
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [profileDesc, setProfileDesc] = useState('');
  const [profileSolvency, setProfileSolvency] = useState<number>(0);
  const [profileTeamSize, setProfileTeamSize] = useState<number>(0);

  const canEdit = canPerformAction('edit_dossier');

  const handleOpenProfileDrawer = () => {
    setProfileDesc(profile?.description || '');
    setProfileSolvency(profile?.maxEconomicSolvency ?? 0);
    setProfileTeamSize(profile?.averageTeamSize ?? 1);
    setIsProfileDrawerOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      description: profileDesc.trim(),
      maxEconomicSolvency: Number(profileSolvency) || 0,
      averageTeamSize: Number(profileTeamSize) || 0,
    });
    setIsProfileDrawerOpen(false);
  };

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

    if (selectedCert) {
      updateCertification(selectedCert.id, {
        name: formName.trim(),
        issuer: formIssuer.trim(),
        expiresAt: formValidUntil ? new Date(formValidUntil).toISOString() : '',
        certificateNumber: formDocRef.trim(),
      });
    } else {
      addCertification({
        name: formName.trim(),
        issuer: formIssuer.trim(),
        certificateNumber: formDocRef.trim(),
        issuedAt: new Date().toISOString(),
        expiresAt: formValidUntil ? new Date(formValidUntil).toISOString() : '',
      });
    }

    setIsDrawerOpen(false);
  };

  const handleOpenEvidenceDrawer = () => {
    setEvFormCategory('PREVIOUS_CONTRACTS');
    setEvFormTitle('');
    setEvFormDesc('');
    setEvFormDocRef('');
    setEvFormAmount('');
    setEvFormValidUntil('');
    setIsEvidenceDrawerOpen(true);
  };

  const handleSaveEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evFormTitle.trim() || !evFormDesc.trim()) return;

    addEvidence({
      category: evFormCategory,
      title: evFormTitle.trim(),
      description: evFormDesc.trim(),
      documentReference: evFormDocRef.trim() || 'Documento_acreditativo.pdf',
      verifiedAmount: evFormAmount ? Number(evFormAmount) : undefined,
      validUntil: evFormValidUntil ? new Date(evFormValidUntil).toISOString() : undefined,
    });

    setIsEvidenceDrawerOpen(false);
  };

  // Metadatos y filtros de categoría de evidencias
  const categoryFilters = [
    { id: 'ALL', label: 'Todas', count: evidences.length },
    { id: 'PREVIOUS_CONTRACTS', label: 'Contratos previos', count: evidences.filter((e) => e.category === 'PREVIOUS_CONTRACTS').length },
    { id: 'TEAM_QUALIFICATION', label: 'Cualificación de equipo', count: evidences.filter((e) => e.category === 'TEAM_QUALIFICATION').length },
    { id: 'TECHNICAL_MEANS', label: 'Medios técnicos', count: evidences.filter((e) => e.category === 'TECHNICAL_MEANS').length },
    { id: 'FINANCIAL_SOLVENCY', label: 'Solvencia financiera', count: evidences.filter((e) => e.category === 'FINANCIAL_SOLVENCY').length },
  ] as const;

  const getEvidenceCategoryMeta = (category: BusinessEvidence['category']) => {
    switch (category) {
      case 'PREVIOUS_CONTRACTS':
        return { label: 'Contrato previo', icon: Briefcase, color: 'text-[#218a58] bg-[#e8f7ef]' };
      case 'TEAM_QUALIFICATION':
        return { label: 'Equipo técnico', icon: Users, color: 'text-[#685cff] bg-[#eeeaff]' };
      case 'TECHNICAL_MEANS':
        return { label: 'Medio técnico', icon: Cpu, color: 'text-[#2563eb] bg-[#eff6ff]' };
      case 'FINANCIAL_SOLVENCY':
        return { label: 'Solvencia económica', icon: Coins, color: 'text-[#ca8517] bg-[#fff3db]' };
      default:
        return { label: 'Evidencia', icon: FileText, color: 'text-[var(--ink-secondary)] bg-[var(--surface-2)]' };
    }
  };

  // Filtrado de evidencias por categoría y buscador
  const filteredEvidences = evidences.filter((ev) => {
    const matchesCategory = evidenceCategory === 'ALL' || ev.category === evidenceCategory;
    const matchesSearch =
      evidenceSearchTerm === '' ||
      ev.title.toLowerCase().includes(evidenceSearchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(evidenceSearchTerm.toLowerCase()) ||
      ev.documentReference.toLowerCase().includes(evidenceSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          <nav className="text-xs text-[var(--ink-tertiary)] flex items-center gap-1.5 mb-1.5">
            <Link to="/app/inicio" className="hover:text-[var(--ink)] transition-colors">
              Inicio
            </Link>
            <span>›</span>
            <span className="text-[var(--ink)] font-medium">Dossier</span>
          </nav>

          <h1 className="app-page-title text-[var(--ink)]">
            Dossier
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-1 max-w-xl">
            La información de tu organización utilizada para analizar los pliegos.
          </p>
        </div>

        {/* Botón Editar Perfil */}
        <div>
          <button
            onClick={handleOpenProfileDrawer}
            className="px-4 py-2 rounded-[11px] bg-white hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--ink)] border border-[var(--hairline)] transition-colors shadow-xs cursor-pointer"
          >
            Editar perfil
          </button>
        </div>
      </div>

      {/* Resumen factual: una única superficie abierta, no un mosaico de tarjetas. */}
      <section className="dossier-summary-strip" aria-label="Resumen del dossier">
        <div className="dossier-summary-piece">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">
              Organización autorizada
            </span>
            <h2 className="text-lg font-bold text-[var(--ink)] tracking-tight">
              {activeTenant?.name || 'Mi Organización Licitadora'}
            </h2>
            <p className="text-xs text-[var(--ink-secondary)]">
              {profile?.description || 'Entidad licitadora en contratación pública'}
            </p>
            <p className="text-xs text-[var(--ink-tertiary)] mt-0.5">
              España · CIF: {activeTenant?.taxId || 'No asignado'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-[14px] bg-[#eeeaff] text-[#685cff] flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Fondo documental y acreditaciones: recuentos factuales, sin porcentajes inventados. */}
        <div className="dossier-summary-piece">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">
              Fondo Documental
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--ink)] font-ui tabular-nums tracking-tight">
              {certifications.length + evidences.length}{' '}
              <span className="text-sm font-medium text-[var(--ink-secondary)]">acreditaciones</span>
            </div>
            <p className="text-xs text-[var(--ink-secondary)]">
              {certifications.length} certificaciones en vigor · {evidences.length} evidencias registradas
            </p>
            <p className="text-xs text-[var(--ink-tertiary)] mt-0.5">
              {certifications.length === 0
                ? 'Sin acreditaciones registradas todavía. Añade certificaciones y solvencias para habilitar el cotejo con pliegos.'
                : certifications.filter((c) => c.status === 'EXPIRED').length > 0
                ? `${certifications.filter((c) => c.status === 'EXPIRED').length} certificación requiere renovación`
                : 'Expediente documental completo para análisis de solvencia'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-[14px] bg-[#e8f7ef] text-[#218a58] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* 44 & 56. NAVEGACIÓN INTERNA: 3 TABS REALES */}
      <div className="border-b border-[var(--hairline)] overflow-x-auto">
        <div className="dossier-tabs flex gap-7 min-h-[46px] whitespace-nowrap min-w-max">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative ${
              activeTab === 'perfil'
                ? 'text-[var(--ink)] font-semibold active'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            Perfil
          </button>

          <button
            onClick={() => setActiveTab('certificaciones')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative flex items-center gap-1.5 ${
              activeTab === 'certificaciones'
                ? 'text-[var(--ink)] font-semibold active'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            <span>Certificaciones</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#eeeaff] text-[#685cff]">
              {certifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('evidencias')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative flex items-center gap-1.5 ${
              activeTab === 'evidencias'
                ? 'text-[var(--ink)] font-semibold active'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            <span>Evidencias</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--surface-2)] text-[var(--ink-secondary)]">
              {evidences.length}
            </span>
          </button>
        </div>
      </div>

      {/* 43. TAB CONTENT: PERFIL CORPORATIVO DE LA ORGANIZACIÓN */}
      {activeTab === 'perfil' && (
        <div className="space-y-4">
          <div className="surface p-6 sm:p-7 rounded-[18px] border border-[var(--hairline)] space-y-6 bg-[var(--surface-1)] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[var(--hairline)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--primary)] font-semibold">
                  Entidad Mercantil Licitadora
                </span>
                <h3 className="text-xl font-bold text-[var(--ink)] mt-1">
                  {activeTenant?.name || profile?.companyName || 'Mi Organización'}
                </h3>
                <p className="text-xs text-[var(--ink-secondary)] mt-1 max-w-xl leading-relaxed">
                  {profile?.description || 'Entidad licitadora en contratación pública española.'}
                </p>
              </div>

              <button
                onClick={handleOpenProfileDrawer}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span>Editar datos de solvencia</span>
              </button>
            </div>

            {/* Grid de Atributos del Perfil */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--hairline)] space-y-1">
                <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">
                  Identificador Fiscal (CIF/NIF)
                </span>
                <p className="text-sm font-bold text-[var(--ink)] font-mono">
                  {activeTenant?.taxId || profile?.taxId || 'No asignado'}
                </p>
                <p className="text-[11px] text-[var(--ink-secondary)]">
                  Registro oficial mercantil
                </p>
              </div>

              <div className="p-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--hairline)] space-y-1">
                <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">
                  Solvencia Económica Declarada
                </span>
                <p className="text-sm font-bold text-[var(--ink)] font-mono">
                  {formatCurrency(profile?.maxEconomicSolvency || 0)}
                </p>
                <p className="text-[11px] text-[var(--ink-secondary)]">
                  Facturación anual o volumen acumulado de negocio
                </p>
              </div>

              <div className="p-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--hairline)] space-y-1">
                <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">
                  Equipo Técnico en Plantilla
                </span>
                <p className="text-sm font-bold text-[var(--ink)] font-mono">
                  {profile?.averageTeamSize || 1} profesionales
                </p>
                <p className="text-[11px] text-[var(--ink-secondary)]">
                  Capacidad de asignación a proyectos
                </p>
              </div>

              <div className="p-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--hairline)] space-y-1">
                <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">
                  Ámbito Geográfico
                </span>
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {profile?.geographicalScope?.join(', ') || 'Ámbito Estatal'}
                </p>
                <p className="text-[11px] text-[var(--ink-secondary)]">
                  Cobertura territorial de ejecución
                </p>
              </div>

              <div className="p-4 rounded-[12px] bg-[var(--surface-2)] border border-[var(--hairline)] space-y-1 md:col-span-2">
                <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">
                  Códigos CPV de Especialidad Principal
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(profile?.primaryCpvCodes || ['72000000-5 · Servicios TIC']).map((cpv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-[8px] bg-[var(--surface-1)] border border-[var(--hairline)] text-xs text-[var(--ink)] font-mono"
                    >
                      {cpv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Aviso informativo si el dossier está vacío */}
            {certifications.length === 0 && evidences.length === 0 && (
              <div className="p-4 rounded-[12px] bg-[#fff3db] dark:bg-[#78350f]/20 border border-[#ca8517]/30 text-xs text-[#ca8517] dark:text-[#fbbf24] flex items-start gap-3">
                <Building2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Perfil recién creado:</strong> Completa tu dossier añadiendo certificaciones (ISO 27001, ENS) y contratos previos en las pestañas siguientes para habilitar la precalificación automática en el Catálogo de Licitaciones.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 45. TAB CONTENT: CERTIFICACIONES (Secciones 45, 46, 47) */}
      {activeTab === 'certificaciones' && (
        <div className="space-y-4">
          {/* Toolbar de certificaciones */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-tertiary)]" />
              <input
                type="text"
                placeholder="Buscar certificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-[var(--surface-1)] focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] rounded-[11px] text-xs text-[var(--ink)] placeholder-[#929097] focus:outline-none shadow-xs transition-all"
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
          {filteredCertifications.length === 0 ? (
            <div className="surface p-10 rounded-[18px] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--ink-secondary)] flex items-center justify-center mx-auto text-xl">
                <ShieldCheck className="w-6 h-6 text-[#685cff]" />
              </div>
              <h3 className="font-editorial text-2xl text-[var(--ink)]">
                {searchTerm ? 'No hay certificaciones que coincidan' : 'Sin certificaciones registradas'}
              </h3>
              <p className="text-xs text-[var(--ink-secondary)] max-w-md mx-auto leading-relaxed">
                {searchTerm
                  ? 'Prueba a cambiar el término de búsqueda para localizar tu acreditación.'
                  : `Añade las certificaciones oficiales de ${activeTenant?.name || 'tu empresa'} (como ISO/IEC 27001, Esquema Nacional de Seguridad ENS, ISO 9001 o certificaciones técnicas) para que el motor de precalificación las coteje automáticamente contra los pliegos.`}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => handleOpenDrawer()}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[#171719] hover:bg-[#28282b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir primera certificación</span>
                </button>
              )}
            </div>
          ) : (
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
                      <div className="w-10 h-10 rounded-[10px] bg-[var(--surface-2)] border border-[var(--hairline)] flex items-center justify-center text-[#685cff] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-[var(--ink)]">
                            {cert.name}
                          </h3>
                          <DossierStatusBadge status={cert.status} />
                        </div>
                        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                          Emisor: <span className="text-[var(--ink)]">{cert.issuer}</span>
                        </p>
                        {cert.certificateNumber && (
                          <span className="text-[11px] text-[var(--ink-tertiary)] font-mono mt-1 block">
                            Nº Certificado: {cert.certificateNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Estado de Validez y Acciones */}
                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-[var(--ink-tertiary)] block">
                          {isExpired ? 'Caducada el' : 'Válida hasta'}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isExpired ? 'text-[#ca8517]' : 'text-[var(--ink)]'
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
                          onClick={() => handleOpenDrawer(cert)}
                          className="px-3 py-1.5 rounded-[9px] bg-white hover:bg-[var(--surface-2)] text-[var(--ink)] border border-[rgba(30,24,38,0.1)] text-xs font-medium transition-colors cursor-pointer"
                        >
                          Ver acreditación
                        </button>

                        <button
                          onClick={() => handleOpenDrawer(cert)}
                          className="p-1.5 rounded-lg text-[var(--ink-tertiary)] hover:text-[var(--ink)] hover:bg-black/[0.04] transition-colors cursor-pointer"
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
          )}
        </div>
      )}

      {/* TAB PERFIL */}
      {activeTab === 'perfil' && (
        <div className="surface p-6 rounded-[20px] space-y-4 max-w-3xl">
          <h3 className="text-sm font-semibold text-[var(--ink)] pb-2 border-b border-[var(--hairline)]">
            Datos Corporativos de la Organización
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[var(--ink-tertiary)] block">Razón Social</span>
              <span className="font-semibold text-[var(--ink)]">{activeTenant?.name}</span>
            </div>
            <div>
              <span className="text-[var(--ink-tertiary)] block">Identificación Fiscal</span>
              <span className="font-mono font-semibold text-[var(--ink)]">{activeTenant?.taxId}</span>
            </div>
            <div>
              <span className="text-[var(--ink-tertiary)] block">Sector de Actividad</span>
              <span className="text-[var(--ink)]">{profile?.description || 'Tecnología e Infraestructuras'}</span>
            </div>
            <div>
              <span className="text-[var(--ink-tertiary)] block">Facturación Anual Auditada</span>
              <span className="font-mono text-[var(--ink)] tabular-nums">
                {formatCurrency(profile?.maxEconomicSolvency || 1450000)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB EVIDENCIAS CON FILTRADO POR CATEGORÍA (Opción A) */}
      {activeTab === 'evidencias' && (
        <div className="space-y-4">
          {/* Toolbar de evidencias: Buscador y Botón Añadir */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-tertiary)]" />
              <input
                type="text"
                placeholder="Buscar evidencias por título, descripción o archivo..."
                value={evidenceSearchTerm}
                onChange={(e) => setEvidenceSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-[var(--surface-1)] focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] rounded-[11px] text-xs text-[var(--ink)] placeholder-[#929097] focus:outline-none shadow-xs transition-all"
              />
            </div>

            <button
              onClick={handleOpenEvidenceDrawer}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[11px] bg-[#171719] hover:bg-[#28282b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir evidencia</span>
            </button>
          </div>

          {/* Chips de filtro por categoría */}
          <div className="dossier-evidence-filters flex items-center gap-1 overflow-x-auto pb-1 min-w-max">
            {categoryFilters.map((filter) => {
              const isSelected = evidenceCategory === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setEvidenceCategory(filter.id)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#eeeaff] text-[#685cff] font-semibold'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-white/70'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-[#685cff]' : 'text-[var(--ink-tertiary)]'
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Lista de Evidencias */}
          {filteredEvidences.length === 0 ? (
            <div className="surface p-10 rounded-[18px] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--ink-secondary)] flex items-center justify-center mx-auto text-xl">
                <Briefcase className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="font-editorial text-2xl text-[var(--ink)]">
                {evidenceSearchTerm || evidenceCategory !== 'ALL'
                  ? 'No hay evidencias que coincidan con estos filtros'
                  : 'Sin evidencias o solvencias registradas'}
              </h3>
              <p className="text-xs text-[var(--ink-secondary)] max-w-md mx-auto leading-relaxed">
                {evidenceSearchTerm || evidenceCategory !== 'ALL'
                  ? 'Prueba a cambiar el filtro de categoría o limpiar el término de búsqueda.'
                  : `Registra contratos previos ejecutados, solvencia económica auditada o cualificaciones del equipo técnico para demostrar la solvencia de ${activeTenant?.name || 'tu empresa'}.`}
              </p>
              {!evidenceSearchTerm && evidenceCategory === 'ALL' && (
                <button
                  onClick={handleOpenEvidenceDrawer}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[#171719] hover:bg-[#28282b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir primera evidencia</span>
                </button>
              )}
            </div>
          ) : (
            <div className="dossier-evidence-list" role="list" aria-label="Evidencias del dossier">
              {filteredEvidences.map((ev) => {
                const meta = getEvidenceCategoryMeta(ev.category);
                const IconComponent = meta.icon;

                return (
                  <div
                    key={ev.id}
                    role="listitem"
                    className="dossier-evidence-row"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`dossier-evidence-mark ${meta.color}`}>
                        <IconComponent className="w-[18px] h-[18px]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">
                            {meta.label}
                          </span>
                          <h4 className="text-sm font-semibold text-[var(--ink)]">
                            {ev.title}
                          </h4>
                          <DossierStatusBadge status={ev.status} />
                        </div>
                        <p className="text-xs text-[var(--ink-secondary)] max-w-2xl">
                          {ev.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[var(--ink-tertiary)] pt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <FileText className="w-3 h-3" />
                            {ev.documentReference}
                          </span>
                          {ev.validUntil && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Válido hasta: {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(ev.validUntil))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="dossier-evidence-value text-left sm:text-right shrink-0">
                      {ev.verifiedAmount && (
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[var(--ink-tertiary)] block">
                            Importe acreditado
                          </span>
                          <span className="text-sm font-mono font-bold text-[var(--ink)] tabular-nums block">
                            {formatCurrency(ev.verifiedAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              className="px-3.5 py-2 rounded-[10px] bg-white hover:bg-[var(--surface-2)] text-xs font-medium text-[var(--ink)] border border-[var(--hairline)] transition-colors cursor-pointer"
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
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Nombre de la certificación
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ej: ISO 27001 o ENS Nivel Medio"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Entidad emisora
            </label>
            <input
              type="text"
              required
              value={formIssuer}
              onChange={(e) => setFormIssuer(e.target.value)}
              placeholder="Ej: AENOR, TÜV Rheinland, BSI"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Fecha de caducidad / validez
            </label>
            <input
              type="date"
              value={formValidUntil}
              onChange={(e) => setFormValidUntil(e.target.value)}
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Referencia documental / Hash del archivo
            </label>
            <input
              type="text"
              value={formDocRef}
              onChange={(e) => setFormDocRef(e.target.value)}
              placeholder="Ej: Certificado_ISO27001_2026.pdf"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all font-mono"
            />
          </div>

          {/* Nota de integridad y seguridad */}
          <div className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--hairline)] text-[11px] text-[var(--ink-secondary)] leading-relaxed">
            <span className="font-semibold text-[var(--ink)]">Aviso de Integridad:</span> Todas las nuevas acreditaciones se registran con estado <span className="font-mono text-[#685cff]">DECLARED</span> hasta su verificación documental. Los usuarios no pueden forzar unilateralmente el estado de verificación.
          </div>
        </form>
      </Drawer>

      {/* DRAWER DE EDICIÓN DE PERFIL */}
      <Drawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        title="Editar perfil empresarial"
        subtitle="Actualiza la solvencia económica auditada y datos del dossier"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(false)}
              className="px-3.5 py-2 rounded-[10px] bg-white hover:bg-[var(--surface-2)] text-xs font-medium text-[var(--ink)] border border-[var(--hairline)] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-[10px] bg-[#171719] hover:bg-[#28282b] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
            >
              Guardar cambios
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Razón Social (Inmutable por Tenant)
            </label>
            <input
              type="text"
              disabled
              value={activeTenant?.name || ''}
              className="w-full h-10 px-3 rounded-[11px] bg-stone-100 text-[var(--ink-tertiary)] border border-[var(--hairline)] text-xs cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Sector / Descripción de Actividad
            </label>
            <input
              type="text"
              required
              value={profileDesc}
              onChange={(e) => setProfileDesc(e.target.value)}
              placeholder="Ej: Consultoría TI y Servicios Cloud"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Solvencia Económica Máxima (€ / año)
            </label>
            <input
              type="number"
              required
              value={profileSolvency}
              onChange={(e) => setProfileSolvency(Number(e.target.value))}
              placeholder="Ej: 1450000"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Plantilla media de profesionales
            </label>
            <input
              type="number"
              required
              value={profileTeamSize}
              onChange={(e) => setProfileTeamSize(Number(e.target.value))}
              placeholder="Ej: 28"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all font-mono"
            />
          </div>
        </form>
      </Drawer>

      {/* DRAWER PARA AÑADIR EVIDENCIA (Opción A) */}
      <Drawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        title="Nueva Evidencia Documental"
        subtitle="Añade un contrato, solvencia técnica o económica al dossier empresarial"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsEvidenceDrawerOpen(false)}
              className="px-3.5 py-2 rounded-[10px] bg-white hover:bg-[var(--surface-2)] text-xs font-medium text-[var(--ink)] border border-[var(--hairline)] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveEvidence}
              className="px-4 py-2 rounded-[10px] bg-[#171719] hover:bg-[#28282b] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
            >
              Guardar declaración
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveEvidence} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Categoría de la evidencia
            </label>
            <select
              value={evFormCategory}
              onChange={(e) => setEvFormCategory(e.target.value as BusinessEvidence['category'])}
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all"
            >
              <option value="PREVIOUS_CONTRACTS">Contrato previo (experiencia pública/privada)</option>
              <option value="TEAM_QUALIFICATION">Cualificación de equipo técnico</option>
              <option value="TECHNICAL_MEANS">Medios técnicos e infraestructura</option>
              <option value="FINANCIAL_SOLVENCY">Solvencia financiera / Cuentas anuales</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Título de la evidencia
            </label>
            <input
              type="text"
              required
              value={evFormTitle}
              onChange={(e) => setEvFormTitle(e.target.value)}
              placeholder="Ej: Contrato de soporte cloud con la Agencia Tributaria"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Descripción o alcance
            </label>
            <textarea
              required
              rows={3}
              value={evFormDesc}
              onChange={(e) => setEvFormDesc(e.target.value)}
              placeholder="Detalla los servicios prestados, destinatario y certificados de buena ejecución asociados."
              className="w-full p-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Referencia documental / Nombre de archivo
            </label>
            <input
              type="text"
              required
              value={evFormDocRef}
              onChange={(e) => setEvFormDocRef(e.target.value)}
              placeholder="Ej: Certificado_Buena_Ejecucion_AEAT_2025.pdf"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Importe acreditado (€ opcional)
            </label>
            <input
              type="number"
              value={evFormAmount}
              onChange={(e) => setEvFormAmount(e.target.value)}
              placeholder="Ej: 350000"
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1">
              Fecha de validez (opcional)
            </label>
            <input
              type="date"
              value={evFormValidUntil}
              onChange={(e) => setEvFormValidUntil(e.target.value)}
              className="w-full h-10 px-3 rounded-[11px] bg-[var(--surface-2)]/80 focus:bg-white border border-[var(--hairline)] focus:border-[#685cff] text-xs text-[var(--ink)] focus:outline-none transition-all font-mono"
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};
