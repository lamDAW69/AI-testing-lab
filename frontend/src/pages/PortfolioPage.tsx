import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MoreVertical,
  FolderOpen,
} from 'lucide-react';
import { useData } from '../lib/data-context';
import {
  StatusBadge,
  EligibilityBadge,
  DecisionBadge,
  ValidityBadge,
} from '../components/ui/StatusBadge';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';

export const PortfolioPage: React.FC = () => {
  const { portfolio } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeSegment, setActiveSegment] = useState<
    'all' | 'in_progress' | 'attention' | 'eligible' | 'discarded'
  >('all');
  const [decisionFilter, setDecisionFilter] = useState<string>('all');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>('all');
  const [validityFilter, setValidityFilter] = useState<string>('all');
  const [onlyBlockers, setOnlyBlockers] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Mayor densidad operativa

  // 27. Segmentación rápida (No son filtros, primera fila)
  const countAll = portfolio.length;
  const countAttention = portfolio.filter(
    (p) => p.hasBlockers || p.validity === 'REQUIRES_REANALYSIS'
  ).length;
  const countEligible = portfolio.filter(
    (p) => p.eligibility === 'POTENTIALLY_ELIGIBLE'
  ).length;
  const countDiscarded = portfolio.filter((p) => p.decision === 'DISCARD').length;
  const countInProgress = portfolio.filter(
    (p) => p.decision === 'REVIEW' || p.decision === 'UNDECIDED'
  ).length;

  const filteredItems = portfolio.filter((item) => {
    // Búsqueda en portfolio
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractingAuthority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileReference.toLowerCase().includes(searchTerm.toLowerCase());

    // Segmentos superiores
    let matchesSegment = true;
    if (activeSegment === 'attention') {
      matchesSegment = item.hasBlockers || item.validity === 'REQUIRES_REANALYSIS';
    } else if (activeSegment === 'eligible') {
      matchesSegment = item.eligibility === 'POTENTIALLY_ELIGIBLE';
    } else if (activeSegment === 'discarded') {
      matchesSegment = item.decision === 'DISCARD';
    } else if (activeSegment === 'in_progress') {
      matchesSegment = item.decision === 'REVIEW' || item.decision === 'UNDECIDED';
    }

    // 28. Filtros operativos inferiores
    const matchesDecision =
      decisionFilter === 'all' || item.decision === decisionFilter;
    const matchesEligibility =
      eligibilityFilter === 'all' || item.eligibility === eligibilityFilter;
    const matchesValidity =
      validityFilter === 'all' || item.validity === validityFilter;
    const matchesBlockers = !onlyBlockers || item.hasBlockers;

    return (
      matchesSearch &&
      matchesSegment &&
      matchesDecision &&
      matchesEligibility &&
      matchesValidity &&
      matchesBlockers
    );
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 select-none">
      {/* HEADER PORTFOLIO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="text-xs text-[#929097] flex items-center gap-1.5 mb-1.5">
            <Link to="/app/inicio" className="hover:text-[#171719] transition-colors">
              Inicio
            </Link>
            <span>›</span>
            <span className="text-[#171719] font-medium">Portfolio</span>
          </nav>

          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171719] tracking-tight">
            Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-[#69666d] mt-1">
            Todas las oportunidades analizadas por tu organización.
          </p>
        </div>

        {/* Búsqueda dentro de la página (Sección 12: en Portfolio la búsqueda pertenece a la vista) */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929097]" />
          <input
            type="text"
            placeholder="Buscar en tu portfolio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white/70 focus:bg-white border border-[rgba(30,24,38,0.06)] focus:border-[#685cff] rounded-[11px] text-xs text-[#171719] placeholder-[#929097] transition-all focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* 27. FILA 1: SEGMENTOS PORTFOLIO (Sección 27) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            setActiveSegment('all');
            setCurrentPage(1);
          }}
          className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSegment === 'all'
              ? 'text-[#685cff] bg-[#eeeaff] border border-[#685cff]/20 font-semibold'
              : 'text-[#69666d] hover:text-[#171719] bg-white/60 hover:bg-white border border-transparent'
          }`}
        >
          Todas {countAll}
        </button>

        <button
          onClick={() => {
            setActiveSegment('in_progress');
            setCurrentPage(1);
          }}
          className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSegment === 'in_progress'
              ? 'text-[#685cff] bg-[#eeeaff] border border-[#685cff]/20 font-semibold'
              : 'text-[#69666d] hover:text-[#171719] bg-white/60 hover:bg-white border border-transparent'
          }`}
        >
          En análisis {countInProgress}
        </button>

        <button
          onClick={() => {
            setActiveSegment('attention');
            setCurrentPage(1);
          }}
          className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSegment === 'attention'
              ? 'text-[#e44848] bg-[#ffeded] border border-[#e44848]/25 font-semibold'
              : 'text-[#69666d] hover:text-[#e44848] bg-white/60 hover:bg-white border border-transparent'
          }`}
        >
          Requieren atención {countAttention}
        </button>

        <button
          onClick={() => {
            setActiveSegment('eligible');
            setCurrentPage(1);
          }}
          className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSegment === 'eligible'
              ? 'text-[#218a58] bg-[#e8f7ef] border border-[#218a58]/25 font-semibold'
              : 'text-[#69666d] hover:text-[#218a58] bg-white/60 hover:bg-white border border-transparent'
          }`}
        >
          Elegibles {countEligible}
        </button>

        <button
          onClick={() => {
            setActiveSegment('discarded');
            setCurrentPage(1);
          }}
          className={`h-[34px] px-3.5 rounded-[9px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeSegment === 'discarded'
              ? 'text-[#69666d] bg-[#efedef] border border-[rgba(30,24,38,0.12)] font-semibold'
              : 'text-[#69666d] hover:text-[#171719] bg-white/60 hover:bg-white border border-transparent'
          }`}
        >
          Descartadas {countDiscarded}
        </button>
      </div>

      {/* 28. FILA 2: FILTROS OPERATIVOS REALES (Sección 28) */}
      <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
        {/* Decisión */}
        <select
          value={decisionFilter}
          onChange={(e) => {
            setDecisionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="h-8 px-2.5 rounded-[8px] bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.06)] text-[#171719] focus:outline-none cursor-pointer shadow-xs"
        >
          <option value="all">Decisión: Todas ▾</option>
          <option value="PURSUE">Pursue (Avanzar)</option>
          <option value="REVIEW">Review (En revisión)</option>
          <option value="DISCARD">Descartada</option>
          <option value="UNDECIDED">Sin decisión</option>
        </select>

        {/* Elegibilidad */}
        <select
          value={eligibilityFilter}
          onChange={(e) => {
            setEligibilityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="h-8 px-2.5 rounded-[8px] bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.06)] text-[#171719] focus:outline-none cursor-pointer shadow-xs"
        >
          <option value="all">Elegibilidad: Todas ▾</option>
          <option value="POTENTIALLY_ELIGIBLE">Potencialmente Elegible</option>
          <option value="NEEDS_REVIEW">Necesita revisión</option>
          <option value="POTENTIALLY_INELIGIBLE">Potencialmente Inelegible</option>
        </select>

        {/* Vigencia */}
        <select
          value={validityFilter}
          onChange={(e) => {
            setValidityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="h-8 px-2.5 rounded-[8px] bg-white/70 hover:bg-white border border-[rgba(30,24,38,0.06)] text-[#171719] focus:outline-none cursor-pointer shadow-xs"
        >
          <option value="all">Vigencia: Todas ▾</option>
          <option value="VALID">Análisis Vigente</option>
          <option value="REQUIRES_REANALYSIS">Requiere reanálisis</option>
          <option value="STALE">Desactualizado</option>
        </select>

        {/* Con bloqueos Toggle */}
        <button
          onClick={() => {
            setOnlyBlockers(!onlyBlockers);
            setCurrentPage(1);
          }}
          className={`h-8 px-3 rounded-[8px] border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
            onlyBlockers
              ? 'bg-[#ffeded] border-[#e44848]/30 text-[#e44848] font-semibold'
              : 'bg-white/70 hover:bg-white border-[rgba(30,24,38,0.06)] text-[#69666d]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              onlyBlockers ? 'bg-[#e44848]' : 'bg-[#ca8517]'
            }`}
          />
          <span>Con bloqueos</span>
        </button>

        {(decisionFilter !== 'all' ||
          eligibilityFilter !== 'all' ||
          validityFilter !== 'all' ||
          onlyBlockers) && (
          <button
            onClick={() => {
              setDecisionFilter('all');
              setEligibilityFilter('all');
              setValidityFilter('all');
              setOnlyBlockers(false);
              setCurrentPage(1);
            }}
            className="text-[#685cff] hover:underline text-xs ml-2 cursor-pointer font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* 29 & 31. TABLA OPERATIVA DE ALTA DENSIDAD (Filas 50-58px, Sección 29) */}
      {filteredItems.length === 0 ? (
        <div className="surface p-12 rounded-[20px] text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#f5f1ed] text-[#69666d] flex items-center justify-center mx-auto text-xl">
            ◈
          </div>
          <h3 className="font-editorial text-2xl text-[#171719]">
            Todavía no has analizado ninguna oportunidad.
          </h3>
          <p className="text-xs text-[#69666d] leading-relaxed">
            Explora el catálogo oficial de licitaciones públicas y abre tu primer análisis.
          </p>
          <button
            onClick={() => navigate('/app/catalogo')}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[#171719] text-white text-xs font-semibold hover:bg-[#28282b] transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Explorar catálogo</span>
          </button>
        </div>
      ) : (
        <div className="surface rounded-[16px] overflow-hidden border border-[rgba(30,24,38,0.06)] shadow-xs">
          {/* Encabezado de columnas de la tabla (Desktop) */}
          <div className="hidden lg:grid grid-cols-[minmax(260px,1.8fr)_0.85fr_0.9fr_0.75fr_0.65fr_0.85fr_36px] gap-3 px-3.5 py-2.5 bg-[#f8f5f2]/80 border-b border-[rgba(30,24,38,0.06)] text-[11px] font-mono uppercase text-[#929097] select-none">
            <span>Oportunidad</span>
            <span>Estado</span>
            <span>Elegibilidad</span>
            <span>Decisión</span>
            <span>Plazo</span>
            <span>Vigencia</span>
            <span className="text-right">···</span>
          </div>

          {/* Filas operativas de 50-58px (.portfolio-row) */}
          <div className="divide-y divide-[rgba(30,24,38,0.055)]">
            {paginatedItems.map((item) => {
              const isCritical =
                item.hasBlockers || item.validity === 'REQUIRES_REANALYSIS';

              const deadlineDays = Math.ceil(
                (new Date(item.submissionDeadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              const isCriticalDeadline = deadlineDays <= 7 && deadlineDays > 0;

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/app/portfolio/${item.tenderId}`)}
                  className={`portfolio-row cursor-pointer ${
                    isCritical ? 'critical' : ''
                  }`}
                >
                  {/* Columna 1: Oportunidad */}
                  <div className="min-w-0 pr-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#171719] truncate hover:text-[#685cff] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#69666d] truncate">
                      {item.contractingAuthority}
                    </p>
                    <span className="text-[10px] font-mono text-[#929097] tabular-nums">
                      {item.fileReference} · {formatCurrency(item.budgetAmount)}
                    </span>
                  </div>

                  {/* Columna 2: Estado */}
                  <div className="hidden lg:block">
                    {item.hasBlockers ? (
                      <StatusBadge tone="danger" icon="warning">
                        Requiere atención
                      </StatusBadge>
                    ) : item.validity === 'REQUIRES_REANALYSIS' ? (
                      <StatusBadge tone="warning" icon="warning">
                        Reanálisis
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="success" icon="check">
                        En curso
                      </StatusBadge>
                    )}
                  </div>

                  {/* Columna 3: Elegibilidad */}
                  <div className="hidden lg:block">
                    <EligibilityBadge status={item.eligibility} />
                  </div>

                  {/* Columna 4: Decisión humana */}
                  <div className="hidden lg:block">
                    <DecisionBadge decision={item.decision} />
                  </div>

                  {/* Columna 5: Plazo */}
                  <div className="hidden lg:block">
                    <div
                      className={`text-xs font-semibold tabular-nums leading-tight ${
                        isCriticalDeadline ? 'text-[#e44848]' : 'text-[#171719]'
                      }`}
                    >
                      {formatDeadlineDays(item.submissionDeadline).label}
                    </div>
                    <div className="text-[10px] text-[#929097]">
                      {new Intl.DateTimeFormat('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      }).format(new Date(item.submissionDeadline))}
                    </div>
                  </div>

                  {/* Columna 6: Vigencia / Cambio Documental */}
                  <div className="hidden lg:block">
                    <ValidityBadge validity={item.validity} />
                  </div>

                  {/* Columna 7: Acción */}
                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/portfolio/${item.tenderId}`);
                      }}
                      className="p-1 rounded-md text-[#929097] hover:text-[#171719] hover:bg-black/[0.04] transition-colors"
                      title="Abrir análisis completo"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINACIÓN */}
          <div className="p-3 bg-[#f8f5f2]/70 border-t border-[rgba(30,24,38,0.055)] flex items-center justify-between text-xs text-[#69666d]">
            <div>
              Mostrando{' '}
              <span className="font-semibold text-[#171719]">
                {filteredItems.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
                –{Math.min(currentPage * itemsPerPage, filteredItems.length)}
              </span>{' '}
              de{' '}
              <span className="font-semibold text-[#171719]">
                {filteredItems.length}
              </span>{' '}
              resultados
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-[7px] border border-[rgba(30,24,38,0.06)] bg-white disabled:opacity-40 hover:bg-[#f5f1ed] text-[#171719] flex items-center justify-center cursor-pointer transition-colors"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-[7px] text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#685cff] text-white shadow-xs'
                      : 'bg-white hover:bg-[#f5f1ed] text-[#171719] border border-[rgba(30,24,38,0.06)]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 rounded-[7px] border border-[rgba(30,24,38,0.06)] bg-white disabled:opacity-40 hover:bg-[#f5f1ed] text-[#171719] flex items-center justify-center cursor-pointer transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
