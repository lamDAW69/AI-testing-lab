import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  Bookmark,
  SlidersHorizontal,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';
import { useData } from '../lib/data-context';
import { StatusBadge } from '../components/ui/StatusBadge';

export const CatalogPage: React.FC = () => {
  const { tenders } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCpv, setSelectedCpv] = useState<string>('all');
  const [selectedTerritory, setSelectedTerritory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('PUBLISHED');
  const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'date'>('deadline');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filtros interactivos
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      searchTerm === '' ||
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.fileReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.contractingAuthority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.cpvCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCpv =
      selectedCpv === 'all' || tender.cpvCode.startsWith(selectedCpv);

    const matchesState =
      selectedState === 'all' || tender.status === selectedState;

    return matchesSearch && matchesCpv && matchesState;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCpv('all');
    setSelectedTerritory('all');
    setSelectedState('all');
  };

  return (
    <div className="space-y-6 select-none">
      {/* 23. HEADER DE CATÁLOGO (Sección 23) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Breadcrumb discreto */}
          <nav className="text-xs text-[#929097] flex items-center gap-1.5 mb-1.5">
            <Link to="/app/inicio" className="hover:text-[#171719] transition-colors">
              Inicio
            </Link>
            <span>›</span>
            <span className="text-[#171719] font-medium">Catálogo</span>
          </nav>

          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171719] tracking-tight">
            Catálogo
          </h1>
          <p className="text-xs sm:text-sm text-[#69666d] mt-1 max-w-xl">
            Encuentra oportunidades públicas relevantes y analiza su potencial para tu organización.
          </p>
        </div>

        {/* Botones de acción derecha */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (tenders.length > 0) {
                navigate(`/app/oportunidades/${tenders[0].id}`);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] bg-[#eeeaff] hover:bg-[#e7e1ff] text-xs font-semibold text-[#685cff] border border-[#d5ccfe] transition-all cursor-pointer shadow-xs"
          >
            <span>✦</span>
            <span>Buscar con IA</span>
          </button>
          <button
            onClick={() => alert('Búsqueda guardada en tu perfil.')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] bg-white hover:bg-[#f5f1ed] text-xs font-medium text-[#171719] border border-[rgba(30,24,38,0.12)] transition-all cursor-pointer shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#69666d]" />
            <span>Guardar búsqueda</span>
          </button>
        </div>
      </div>

      {/* 24 & 25. SEARCH & FILTROS (Secciones 24 y 25) */}
      <div className="space-y-3">
        {/* Search Input principal: height 48px, radius 14px, max-w-640px */}
        <div className="relative max-w-[640px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#929097]" />
          <input
            type="text"
            placeholder="Buscar por título, organismo, CPV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-white/85 hover:bg-white focus:bg-white border border-[rgba(30,24,38,0.08)] focus:border-[#685cff] rounded-[14px] text-xs sm:text-sm text-[#171719] placeholder-[#929097] transition-all shadow-xs focus:outline-none"
          />
        </div>

        {/* Filter Pills / Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* CPV */}
          <select
            value={selectedCpv}
            onChange={(e) => setSelectedCpv(e.target.value)}
            className="filter-chip h-9 px-3.5 rounded-full bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.08)] text-xs text-[#171719] cursor-pointer focus:outline-none"
          >
            <option value="all">CPV: Todos los sectores ▾</option>
            <option value="722">CPV 72200000 · Software ▾</option>
            <option value="728">CPV 72800000 · Auditoría TIC ▾</option>
            <option value="384">CPV 38400000 · Sensores IoT ▾</option>
          </select>

          {/* Organismo */}
          <button className="filter-chip h-9 px-3.5 rounded-full bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.08)] text-xs text-[#69666d] hover:text-[#171719] transition-colors cursor-pointer flex items-center gap-1">
            <span>Organismo</span>
            <ChevronDown className="w-3 h-3 text-[#929097]" />
          </button>

          {/* Territorio */}
          <select
            value={selectedTerritory}
            onChange={(e) => setSelectedTerritory(e.target.value)}
            className="filter-chip h-9 px-3.5 rounded-full bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.08)] text-xs text-[#171719] cursor-pointer focus:outline-none"
          >
            <option value="all">Territorio: Nacional ▾</option>
            <option value="madrid">Comunidad de Madrid ▾</option>
            <option value="valencia">Comunitat Valenciana ▾</option>
            <option value="cataluna">Cataluña ▾</option>
          </select>

          {/* Importe */}
          <button className="filter-chip h-9 px-3.5 rounded-full bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.08)] text-xs text-[#69666d] hover:text-[#171719] transition-colors cursor-pointer flex items-center gap-1">
            <span>Importe</span>
            <ChevronDown className="w-3 h-3 text-[#929097]" />
          </button>

          {/* Plazo */}
          <button className="filter-chip h-9 px-3.5 rounded-full bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.08)] text-xs text-[#69666d] hover:text-[#171719] transition-colors cursor-pointer flex items-center gap-1">
            <span>Plazo</span>
            <ChevronDown className="w-3 h-3 text-[#929097]" />
          </button>

          {/* Estado */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="filter-chip h-9 px-3.5 rounded-full bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.08)] text-xs text-[#171719] cursor-pointer focus:outline-none"
          >
            <option value="all">Estado: Todos ▾</option>
            <option value="PUBLISHED">Estado: Abierto (Publicado) ▾</option>
            <option value="EVALUATION">Estado: En Evaluación ▾</option>
          </select>
        </div>
      </div>

      {/* 26. TOOLBAR DEL CATÁLOGO (Sección 26) */}
      <div className="flex items-center justify-between text-xs text-[#69666d] pt-2 pb-1 border-b border-[rgba(30,24,38,0.06)]">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#171719]">
            {filteredTenders.length} {filteredTenders.length === 1 ? 'resultado' : 'resultados'}
          </span>
          <button
            onClick={() => alert('Filtros guardados.')}
            className="text-[#685cff] hover:underline cursor-pointer font-medium"
          >
            Guardar filtros
          </button>
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

      {/* 27, 28, 29. RESULTADOS DE CATÁLOGO (Sección 27-29) */}
      {filteredTenders.length === 0 ? (
        /* 30. Estado Vacío Catálogo (Sección 30) */
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
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[#171719] text-white text-xs font-medium hover:bg-[#28282b] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header visible en desktop para la tabla de catálogo */}
          <div className="hidden lg:grid grid-cols-[80px_minmax(260px,1.7fr)_0.55fr_0.65fr_0.65fr_0.65fr_auto] gap-4 px-3.5 text-[11px] font-mono uppercase text-[#929097] select-none">
            <span>Expediente</span>
            <span>Objeto / Entidad</span>
            <span>Importe</span>
            <span>Plazo Límite</span>
            <span>Territorio</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="surface rounded-[18px] overflow-hidden divide-y divide-[rgba(30,24,38,0.06)] shadow-xs">
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
                  {/* Imagen / Placeholder contextual (Sección 63) */}
                  <div className="w-14 h-12 rounded-[10px] bg-gradient-to-br from-[#f5f1ed] to-[#eeeaff] border border-[rgba(30,24,38,0.06)] flex items-center justify-center text-[#685cff] shrink-0">
                    <FileText className="w-5 h-5 opacity-80" />
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
                        {tender.cpvCode.split(' · ')[0]}
                      </span>
                      <span className="text-[11px] text-[#929097] truncate">
                        {tender.cpvCode.split(' · ')[1] || 'Servicios'}
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

                  {/* Plazo Crítico (Sección 29): fecha oscura, solo los días en rojo */}
                  <div className="hidden lg:block">
                    <span className="text-xs text-[#171719] font-medium block">
                      {new Intl.DateTimeFormat('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(tender.submissionDeadline))}
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
                    Nacional
                  </div>

                  {/* Estado Oficial */}
                  <div className="hidden lg:block">
                    <StatusBadge tone="success" icon="check">
                      Abierto
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
