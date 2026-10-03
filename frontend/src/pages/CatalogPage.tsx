import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Bookmark,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';
import { useData } from '../lib/data-context';
import { StatusBadge } from '../components/ui/StatusBadge';

function getTenderTerritory(authority: string): string {
  const lower = (authority || '').toLowerCase();
  if (lower.includes('valenciana') || lower.includes('valencia')) return 'C. Valenciana';
  if (lower.includes('andaluz') || lower.includes('andalucía') || lower.includes('andalucia')) return 'Andalucía';
  if (lower.includes('catalunya') || lower.includes('cataluña') || lower.includes('barcelona')) return 'Cataluña';
  if (lower.includes('madrid') && lower.includes('ayuntamiento')) return 'Madrid Capital';
  if (lower.includes('galicia')) return 'Galicia';
  if (lower.includes('euskadi') || lower.includes('vasco')) return 'País Vasco';
  return 'Estatal';
}

export const CatalogPage: React.FC = () => {
  const { tenders } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCpv, setSelectedCpv] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'date'>('deadline');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filtros y ordenación deterministas reales
  const filteredTenders = tenders
    .filter((tender) => {
      const matchesSearch =
        searchTerm === '' ||
        (tender.title && tender.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tender.fileReference && tender.fileReference.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tender.contractingAuthority && tender.contractingAuthority.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tender.cpvCode && tender.cpvCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCpv =
        selectedCpv === 'all' || (tender.cpvCode && tender.cpvCode.startsWith(selectedCpv));

      const matchesState =
        selectedState === 'all' || tender.status === selectedState;

      return matchesSearch && matchesCpv && matchesState;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        const timeA = a.submissionDeadline ? new Date(a.submissionDeadline).getTime() : 0;
        const timeB = b.submissionDeadline ? new Date(b.submissionDeadline).getTime() : 0;
        return timeA - timeB;
      }
      if (sortBy === 'amount') {
        return b.budgetAmount - a.budgetAmount;
      }
      if (sortBy === 'date') {
        const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
        const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCpv('all');
    setSelectedState('all');
  };

  return (
    <div className="space-y-6 select-none">
      {/* 19. HEADER DE CATÁLOGO (Sección 19) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="text-xs text-[#929097] flex items-center gap-1.5 mb-1.5">
            <Link to="/app/inicio" className="hover:text-[#171719] transition-colors">
              Inicio
            </Link>
            <span>›</span>
            <span className="text-[#171719] font-medium">Catálogo</span>
          </nav>

          <h1 className="app-page-title text-[#171719]">
            Catálogo
          </h1>
          <p className="text-xs sm:text-sm text-[#69666d] mt-1 max-w-xl">
            Encuentra oportunidades públicas relevantes y analiza su potencial para tu organización.
          </p>
        </div>
      </div>

      {/* 20 & 21. SEARCH & FILTROS (Secciones 20 y 21) */}
      <div className="space-y-3">
        {/* Search Input: height 48px, max-w-640px, radius 14px (Sección 20) */}
        <div className="relative max-w-[640px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#929097]" />
          <input
            type="text"
            placeholder="Buscar por título, expediente, organismo, CPV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-white/70 hover:bg-white focus:bg-white border border-[rgba(30,24,38,0.06)] focus:border-[#685cff] rounded-[14px] text-xs sm:text-sm text-[#171719] placeholder-[#929097] transition-all shadow-xs focus:outline-none"
          />
        </div>

        {/* Chips de Filtro: height 34px, radius 999px (Sección 21) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* CPV Oficiales TIC */}
          <select
            value={selectedCpv}
            onChange={(e) => setSelectedCpv(e.target.value)}
            className="h-[34px] px-3.5 rounded-full bg-white/65 hover:bg-white border border-[rgba(30,24,38,0.06)] text-xs text-[#171719] cursor-pointer focus:outline-none shadow-xs"
          >
            <option value="all">CPV: Todos los sectores TIC ▾</option>
            <option value="72">CPV 72* · Servicios TIC y Consultoría ▾</option>
            <option value="48">CPV 48* · Paquetes de Software y Sistemas ▾</option>
            <option value="722">CPV 722* · Desarrollo y Mantenimiento de Software ▾</option>
            <option value="728">CPV 728* · Auditoría TIC y Ciberseguridad ▾</option>
          </select>

          {/* Estado */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="h-[34px] px-3.5 rounded-full bg-white/65 hover:bg-white border border-[rgba(30,24,38,0.06)] text-xs text-[#171719] cursor-pointer focus:outline-none shadow-xs"
          >
            <option value="all">Estado: Todos ▾</option>
            <option value="PUBLISHED">Estado: Abierto (Publicado) ▾</option>
            <option value="EVALUATION">Estado: En Evaluación ▾</option>
          </select>

          {(selectedCpv !== 'all' || selectedState !== 'all' || searchTerm !== '') && (
            <button
              onClick={clearFilters}
              className="h-[34px] px-3 rounded-full bg-[#ffeded] text-[#e44848] text-xs font-semibold hover:bg-[#fcd2d2] transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* TOOLBAR DEL CATÁLOGO */}
      <div className="flex items-center justify-between text-xs text-[#69666d] pt-2 pb-1 border-b border-[rgba(30,24,38,0.055)]">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#171719]">
            {filteredTenders.length} {filteredTenders.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>Ordenar por</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#171719] font-medium cursor-pointer focus:outline-none"
            >
              <option value="deadline">Fecha presentación ▾</option>
              <option value="date">Fecha publicación ▾</option>
              <option value="amount">Importe licitación ▾</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-[rgba(30,24,38,0.08)]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-[#171719] shadow-xs'
                  : 'text-[#929097] hover:text-[#171719]'
              }`}
              title="Vista de lista"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#171719] shadow-xs'
                  : 'text-[#929097] hover:text-[#171719]'
              }`}
              title="Vista de cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 22, 23, 24. FILAS DE CATÁLOGO (Secciones 22-24) */}
      {filteredTenders.length === 0 ? (
        <div className="surface p-12 rounded-[20px] text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#f5f1ed] text-[#69666d] flex items-center justify-center mx-auto text-xl">
            ◈
          </div>
          <h3 className="font-editorial text-2xl text-[#171719]">
            No encontramos oportunidades con estos filtros.
          </h3>
          <p className="text-xs text-[#69666d] leading-relaxed">
            Prueba eliminando alguno de los filtros o ampliando los términos de búsqueda.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[#171719] text-white text-xs font-semibold hover:bg-[#28282b] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenders.map((tender) => (
            <div
              key={tender.id}
              onClick={() => navigate(`/app/oportunidades/${tender.id}`)}
              className="surface p-5 rounded-[18px] flex flex-col justify-between interactive-card cursor-pointer group space-y-4 hover:border-[#685cff]/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#eeeaff] text-[#685cff] font-semibold border border-[#d5ccfe]/60">
                    {tender.fileReference}
                  </span>
                  <StatusBadge
                    tone={tender.status === 'EVALUATION' ? 'warning' : 'success'}
                    icon={tender.status === 'EVALUATION' ? 'clock' : 'check'}
                  >
                    {tender.status === 'EVALUATION' ? 'En Evaluación' : 'Abierto'}
                  </StatusBadge>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#171719] line-clamp-2 group-hover:text-[#685cff] transition-colors leading-snug">
                    {tender.title}
                  </h3>
                  <p className="text-xs text-[#69666d] truncate mt-1">
                    {tender.contractingAuthority}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f5f1ed] text-[#69666d] border border-[rgba(30,24,38,0.06)]">
                    {tender.cpvCode ? tender.cpvCode.split(' · ')[0] : 'TIC'}
                  </span>
                  <span className="text-[11px] text-[#929097] truncate">
                    {tender.cpvCode && tender.cpvCode.includes(' · ')
                      ? tender.cpvCode.split(' · ')[1]
                      : tender.cpvCode && tender.cpvCode.startsWith('48')
                      ? 'Paquetes de software'
                      : 'Servicios TIC'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(30,24,38,0.06)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#171719] tabular-nums font-mono block">
                    {formatCurrency(tender.budgetAmount)}
                  </span>
                  <span className="text-[11px] text-[#69666d] block">
                    {formatDeadlineDays(tender.submissionDeadline).label}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/oportunidades/${tender.id}`);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] bg-white group-hover:bg-[#171719] text-[#171719] group-hover:text-white border border-[rgba(30,24,38,0.12)] group-hover:border-[#171719] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <span>Detalle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Encabezado visible en desktop */}
          <div className="hidden lg:grid grid-cols-[76px_minmax(320px,1.6fr)_100px_115px_125px_110px_120px] gap-4 px-3.5 text-[11px] font-mono uppercase text-[#929097] select-none">
            <span>Expediente</span>
            <span>Objeto / Entidad</span>
            <span>Importe</span>
            <span>Plazo Límite</span>
            <span>Territorio</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="surface rounded-[18px] overflow-hidden divide-y divide-[rgba(30,24,38,0.055)] shadow-xs">
            {filteredTenders.map((tender) => {
              const deadlineDays = Math.ceil(
                (new Date(tender.submissionDeadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              const isCritical = deadlineDays <= 7 && deadlineDays > 0;

              return (
                <div
                  key={tender.id}
                  onClick={() => navigate(`/app/oportunidades/${tender.id}`)}
                  className="tender-row group cursor-pointer"
                >
                  {/* 22. Thumbnail 76x54px con degradado arquitectónico suave (Sección 22 & 39) */}
                  <div className="w-[76px] h-[54px] rounded-[10px] bg-gradient-to-br from-[#f8f5f2] via-[#eee9f2] to-[#e7e1ff] border border-[rgba(30,24,38,0.06)] flex items-center justify-center text-[#685cff] shrink-0">
                    <FileText className="w-5 h-5 opacity-70" />
                  </div>

                  {/* Título y Organismo */}
                  <div className="min-w-0 pr-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#171719] truncate group-hover:text-[#685cff] transition-colors">
                      {tender.title}
                    </h3>
                    <p className="text-xs text-[#69666d] truncate mt-0.5">
                      {tender.contractingAuthority}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f5f1ed] text-[#69666d] border border-[rgba(30,24,38,0.06)]">
                        {tender.cpvCode ? tender.cpvCode.split(' · ')[0] : 'TIC'}
                      </span>
                      <span className="text-[11px] text-[#929097] truncate">
                        {tender.cpvCode && tender.cpvCode.includes(' · ')
                          ? tender.cpvCode.split(' · ')[1]
                          : tender.cpvCode && tender.cpvCode.startsWith('48')
                          ? 'Paquetes de software y sistemas'
                          : 'Servicios TIC'}
                      </span>
                    </div>
                  </div>

                  {/* Importe en tabular-nums */}
                  <div className="hidden lg:block">
                    <span className="text-xs sm:text-sm font-semibold text-[#171719] tabular-nums font-mono">
                      {formatCurrency(tender.budgetAmount)}
                    </span>
                    <span className="block text-[10px] text-[#929097]">
                      Presupuesto base
                    </span>
                  </div>

                  {/* 24. Plazo Crítico: fecha oscura, solo los días en rojo */}
                  <div className="hidden lg:block">
                    <span className="text-xs text-[#171719] font-medium block">
                      {tender.submissionDeadline
                        ? new Intl.DateTimeFormat('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }).format(new Date(tender.submissionDeadline))
                        : 'Sin fecha límite'}
                    </span>
                    <span
                      className={`text-[11px] tabular-nums ${
                        isCritical
                          ? 'text-[#e44848] font-semibold'
                          : 'text-[#69666d]'
                      }`}
                    >
                      {formatDeadlineDays(tender.submissionDeadline).label}
                    </span>
                  </div>

                  {/* Territorio */}
                  <div className="hidden lg:block text-xs text-[#69666d]">
                    {getTenderTerritory(tender.contractingAuthority)}
                  </div>

                  {/* Estado Oficial */}
                  <div className="hidden lg:block">
                    <StatusBadge
                      tone={tender.status === 'EVALUATION' ? 'warning' : 'success'}
                      icon={tender.status === 'EVALUATION' ? 'clock' : 'check'}
                    >
                      {tender.status === 'EVALUATION' ? 'En Evaluación' : 'Abierto'}
                    </StatusBadge>
                  </div>

                  {/* Botón Ver Detalle */}
                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/oportunidades/${tender.id}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white group-hover:bg-[#171719] text-[#171719] group-hover:text-white border border-[rgba(30,24,38,0.12)] group-hover:border-[#171719] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Ver detalle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
