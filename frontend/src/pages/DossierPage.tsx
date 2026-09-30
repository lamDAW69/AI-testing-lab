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
    setProfileSolvency(profile?.maxEconomicSolvency || 1450000);
    setProfileTeamSize(profile?.averageTeamSize || 28);
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
        return { label: 'Evidencia', icon: FileText, color: 'text-[#69666d] bg-[#f5f1ed]' };
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
            onClick={handleOpenProfileDrawer}
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

        {/* Card 2: Fondo Documental y Acreditaciones (Sin porcentajes ficticios) */}
        <div className="surface p-5 rounded-[20px] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#929097]">
              Fondo Documental
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#171719] font-ui tabular-nums tracking-tight">
              {certifications.length + evidences.length}{' '}
              <span className="text-sm font-medium text-[#69666d]">acreditaciones</span>
            </div>
            <p className="text-xs text-[#69666d]">
              {certifications.length} certificaciones en vigor · {evidences.length} evidencias registradas
            </p>
            <p className="text-xs text-[#929097] mt-0.5">
              {certifications.filter((c) => c.status === 'EXPIRED').length > 0
                ? `${certifications.filter((c) => c.status === 'EXPIRED').length} certificación requiere renovación`
                : 'Expediente documental completo para análisis de solvencia'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-[14px] bg-[#e8f7ef] text-[#218a58] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 44 & 56. NAVEGACIÓN INTERNA: 3 TABS REALES */}
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
            onClick={() => setActiveTab('evidencias')}
            className={`dossier-tab text-xs sm:text-sm font-medium transition-colors cursor-pointer pb-2.5 relative flex items-center gap-1.5 ${
              activeTab === 'evidencias'
                ? 'text-[#171719] font-semibold active'
                : 'text-[#69666d] hover:text-[#171719]'
            }`}
          >
            <span>Evidencias</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#f5f1ed] text-[#69666d]">
              {evidences.length}
            </span>
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
                        onClick={() => handleOpenDrawer(cert)}
                        className="px-3 py-1.5 rounded-[9px] bg-white hover:bg-[#f5f1ed] text-[#171719] border border-[rgba(30,24,38,0.1)] text-xs font-medium transition-colors cursor-pointer"
                      >
                        Ver acreditación
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
              <span className="font-mono text-[#171719] tabular-nums">
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
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929097]" />
              <input
                type="text"
                placeholder="Buscar evidencias por título, descripción o archivo..."
                value={evidenceSearchTerm}
                onChange={(e) => setEvidenceSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-white/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] rounded-[11px] text-xs text-[#171719] placeholder-[#929097] focus:outline-none shadow-xs transition-all"
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-max">
            {categoryFilters.map((filter) => {
              const isSelected = evidenceCategory === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setEvidenceCategory(filter.id)}
                  className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#171719] text-white shadow-xs font-semibold'
                      : 'bg-white hover:bg-[#f5f1ed] text-[#69666d] border border-[rgba(30,24,38,0.08)]'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#f5f1ed] text-[#929097]'
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
            <div className="surface p-8 rounded-[18px] text-center space-y-2">
              <p className="text-xs font-semibold text-[#171719]">No hay evidencias que coincidan con la búsqueda</p>
              <p className="text-xs text-[#69666d]">Prueba a cambiar el filtro de categoría o limpiar el término de búsqueda.</p>
            </div>
          ) : (
            <div className="surface rounded-[18px] divide-y divide-[rgba(30,24,38,0.06)] overflow-hidden shadow-xs">
              {filteredEvidences.map((ev) => {
                const meta = getEvidenceCategoryMeta(ev.category);
                const IconComponent = meta.icon;

                return (
                  <div
                    key={ev.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/70 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-[10px] ${meta.color} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#929097] bg-black/[0.03] px-2 py-0.5 rounded-[5px]">
                            {meta.label}
                          </span>
                          <h4 className="text-sm font-semibold text-[#171719]">
                            {ev.title}
                          </h4>
                          <DossierStatusBadge status={ev.status} />
                        </div>
                        <p className="text-xs text-[#69666d] max-w-2xl">
                          {ev.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#929097] pt-0.5">
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

                    <div className="text-left sm:text-right shrink-0">
                      {ev.verifiedAmount && (
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#929097] block">
                            Importe acreditado
                          </span>
                          <span className="text-sm font-mono font-bold text-[#171719] tabular-nums block">
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
              className="px-3.5 py-2 rounded-[10px] bg-white hover:bg-[#f5f1ed] text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.12)] transition-colors cursor-pointer"
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
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Razón Social (Inmutable por Tenant)
            </label>
            <input
              type="text"
              disabled
              value={activeTenant?.name || ''}
              className="w-full h-10 px-3 rounded-[11px] bg-stone-100 text-[#929097] border border-[rgba(30,24,38,0.08)] text-xs cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Sector / Descripción de Actividad
            </label>
            <input
              type="text"
              required
              value={profileDesc}
              onChange={(e) => setProfileDesc(e.target.value)}
              placeholder="Ej: Consultoría TI y Servicios Cloud"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Solvencia Económica Máxima (€ / año)
            </label>
            <input
              type="number"
              required
              value={profileSolvency}
              onChange={(e) => setProfileSolvency(Number(e.target.value))}
              placeholder="Ej: 1450000"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Plantilla media de profesionales
            </label>
            <input
              type="number"
              required
              value={profileTeamSize}
              onChange={(e) => setProfileTeamSize(Number(e.target.value))}
              placeholder="Ej: 28"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all font-mono"
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
              className="px-3.5 py-2 rounded-[10px] bg-white hover:bg-[#f5f1ed] text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.12)] transition-colors cursor-pointer"
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
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Categoría de la evidencia
            </label>
            <select
              value={evFormCategory}
              onChange={(e) => setEvFormCategory(e.target.value as BusinessEvidence['category'])}
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all"
            >
              <option value="PREVIOUS_CONTRACTS">Contrato previo (experiencia pública/privada)</option>
              <option value="TEAM_QUALIFICATION">Cualificación de equipo técnico</option>
              <option value="TECHNICAL_MEANS">Medios técnicos e infraestructura</option>
              <option value="FINANCIAL_SOLVENCY">Solvencia financiera / Cuentas anuales</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Título de la evidencia
            </label>
            <input
              type="text"
              required
              value={evFormTitle}
              onChange={(e) => setEvFormTitle(e.target.value)}
              placeholder="Ej: Contrato de soporte cloud con la Agencia Tributaria"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Descripción o alcance
            </label>
            <textarea
              required
              rows={3}
              value={evFormDesc}
              onChange={(e) => setEvFormDesc(e.target.value)}
              placeholder="Detalla los servicios prestados, destinatario y certificados de buena ejecución asociados."
              className="w-full p-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Referencia documental / Nombre de archivo
            </label>
            <input
              type="text"
              required
              value={evFormDocRef}
              onChange={(e) => setEvFormDocRef(e.target.value)}
              placeholder="Ej: Certificado_Buena_Ejecucion_AEAT_2025.pdf"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Importe acreditado (€ opcional)
            </label>
            <input
              type="number"
              value={evFormAmount}
              onChange={(e) => setEvFormAmount(e.target.value)}
              placeholder="Ej: 350000"
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171719] mb-1">
              Fecha de validez (opcional)
            </label>
            <input
              type="date"
              value={evFormValidUntil}
              onChange={(e) => setEvFormValidUntil(e.target.value)}
              className="w-full h-10 px-3 rounded-[11px] bg-[#f5f1ed]/80 focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] text-xs text-[#171719] focus:outline-none transition-all font-mono"
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};
