import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDeadlineDays } from '../lib/formatters';
import { useData } from '../lib/data-context';

export const CatalogPage: React.FC = () => {
  const { tenders } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCpv, setSelectedCpv] = useState<string>('all');
  const navigate = useNavigate();

  const cpvFilters = [
    { id: 'all', label: 'Todos los CPVs' },
    { id: '722', label: 'CPV 722 · Software' },
    { id: '728', label: 'CPV 728 · Auditoría TIC' },
    { id: '384', label: 'CPV 384 · Sensores e IoT' },
  ];

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      searchTerm === '' ||
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.fileReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.contractingAuthority.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCpv =
      selectedCpv === 'all' || tender.cpvCode.startsWith(selectedCpv);

    return matchesSearch && matchesCpv;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Cabecera Unificada */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">
          Catálogo Oficial
        </h1>
        <p className="text-xs text-[#68656A] mt-0.5">
          Oportunidades públicas indexadas en tiempo real desde la Plataforma de Contratación del Sector Público (PLACSP).
        </p>
      </div>

      {/* Buscador amplio + Chips de Filtro Desplegables */}
      <div className="p-4 rounded-[20px] bg-white/75 backdrop-blur-[20px] border border-white/80 shadow-[0_2px_12px_rgba(20,20,30,0.03)] space-y-3 sticky top-[72px] z-20">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8B92]" />
          <input
            type="text"
            placeholder="Buscar licitación por expediente, objeto, ministerio o entidad contratante…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F6F3EF]/70 border border-[rgba(20,20,20,0.06)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:bg-white focus:border-[#695CFF] focus:outline-none transition-all"
          />
        </div>

        {/* Chips de filtro */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-mono text-[#8F8B92] uppercase mr-1">Filtros:</span>
          {cpvFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedCpv(f.id)}
              className={`px-3 py-1 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                selectedCpv === f.id
                  ? 'bg-[#695CFF] text-white shadow-xs'
                  : 'bg-[#F6F3EF] text-[#68656A] hover:bg-[#EEEAE5] hover:text-[#161616] border border-[rgba(20,20,20,0.06)]'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button className="px-3 py-1 rounded-[10px] text-xs font-medium bg-[#F6F3EF] text-[#68656A] hover:bg-[#EEEAE5] border border-[rgba(20,20,20,0.06)] cursor-pointer">
            Territorio ▾
          </button>
          <button className="px-3 py-1 rounded-[10px] text-xs font-medium bg-[#F6F3EF] text-[#68656A] hover:bg-[#EEEAE5] border border-[rgba(20,20,20,0.06)] cursor-pointer">
            Importe ▾
          </button>
          <button className="px-3 py-1 rounded-[10px] text-xs font-medium bg-[#F6F3EF] text-[#68656A] hover:bg-[#EEEAE5] border border-[rgba(20,20,20,0.06)] cursor-pointer">
            Plazo ▾
          </button>
          <button className="px-3 py-1 rounded-[10px] text-xs font-medium bg-[#F6F3EF] text-[#68656A] hover:bg-[#EEEAE5] border border-[rgba(20,20,20,0.06)] cursor-pointer">
            Estado: Abierto ▾
          </button>
        </div>
      </div>

      {/* Resultados con animación táctil viva */}
      <div className="space-y-3">
        {filteredTenders.map((tender) => (
          <motion.div
            key={tender.id}
            whileHover={{ y: -3, scale: 1.008 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            onClick={() => navigate(`/app/oportunidades/${tender.id}`)}
            className="group min-h-[76px] p-5 rounded-[20px] bg-white/80 backdrop-blur-[18px] border border-white/80 hover:border-[#695CFF]/35 shadow-[0_2px_12px_rgba(20,20,30,0.03)] hover:shadow-[0_16px_36px_rgba(20,20,30,0.08)] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Info expediente y ente */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-[8px] bg-[#EEEAE5] text-[#161616] font-semibold">
                  {tender.fileReference}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-[6px] bg-[#EEEAFE] text-[#5749F5] font-semibold">
                  CPV {tender.cpvCode}
                </span>
                {tender.hasActiveAnalysis ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDFBF2] text-[#137A43] border border-[#C6F0D4] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Precalificado
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F6F3EF] text-[#8F8B92] font-medium">
                    Sin Analizar
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#161616] group-hover:text-[#695CFF] transition-colors leading-snug">
                {tender.title}
              </h3>
              <p className="text-xs text-[#68656A]">
                {tender.contractingAuthority}
              </p>
            </div>

            {/* Cifras y flecha animada */}
            <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[rgba(20,20,20,0.06)]">
              <div>
                <span className="text-[10px] text-[#8F8B92] font-mono uppercase tracking-wider block">
                  Presupuesto Base
                </span>
                <span className="text-sm font-bold text-[#161616] font-mono tabular-nums">
                  {formatCurrency(tender.budgetAmount)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#8F8B92] font-mono uppercase tracking-wider block">
                  Plazo Restante
                </span>
                <span className="text-xs text-[#975A16] font-semibold">
                  {formatDeadlineDays(tender.submissionDeadline).label}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#F6F3EF] flex items-center justify-center text-[#8F8B92] group-hover:text-[#695CFF] group-hover:bg-[#EEEAFE] group-hover:translate-x-[3px] transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
