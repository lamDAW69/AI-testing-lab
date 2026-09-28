import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  AlertCircle,
  FileText,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { EligibilityBadge, DecisionBadge, ValidityBadge } from '../components/ui/Badge';
import { formatCurrency, formatDate, formatDeadlineDays } from '../lib/formatters';
import { useData } from '../lib/data-context';
import { PortfolioItem } from '../types/portfolio';

export const PortfolioPage: React.FC = () => {
  const { portfolio } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string>('all');
  const [onlyBlockers, setOnlyBlockers] = useState<boolean>(false);
  const navigate = useNavigate();

  const filteredItems = portfolio.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractingAuthority.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDecision =
      selectedDecision === 'all' || item.decision === selectedDecision;

    const matchesBlockers = !onlyBlockers || item.hasBlockers;

    return matchesSearch && matchesDecision && matchesBlockers;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Cabecera Unificada */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[rgba(20,20,20,0.06)]">
        <div>
          <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">
            Portfolio
          </h1>
          <p className="text-xs text-[#68656A] mt-0.5">
            {portfolio.length} oportunidades analizadas frente al Dossier privado de tu empresa
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<FileText className="w-3.5 h-3.5" />}
          onClick={() => navigate('/app/catalogo')}
        >
          Añadir del Catálogo
        </Button>
      </div>

      {/* Barra de Filtros con Glassmorphism translúcido */}
      <div className="p-4 rounded-[20px] bg-white/70 backdrop-blur-[20px] border border-white/80 shadow-[0_4px_20px_rgba(20,20,30,0.04)] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8B92]" />
            <input
              type="text"
              placeholder="Buscar por expediente, título u órgano contratante…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/70 border border-[rgba(20,20,20,0.08)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:bg-white focus:border-[#695CFF] focus:outline-none transition-all"
            />
          </div>

          {/* Chips de filtro interactivos con micro-animaciones */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDecision('all')}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                selectedDecision === 'all' && !onlyBlockers
                  ? 'bg-[#161616] text-white shadow-xs'
                  : 'bg-white/80 text-[#68656A] hover:text-[#161616] border border-[rgba(20,20,20,0.06)]'
              }`}
            >
              Todas
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedDecision('REVIEW');
                setOnlyBlockers(false);
              }}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                selectedDecision === 'REVIEW'
                  ? 'bg-[#FEF7EC] text-[#975A16] border border-[#FCE1B8] shadow-xs'
                  : 'bg-white/80 text-[#68656A] hover:text-[#161616] border border-[rgba(20,20,20,0.06)]'
              }`}
            >
              Revisión ▾
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedDecision('PURSUE');
                setOnlyBlockers(false);
              }}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                selectedDecision === 'PURSUE'
                  ? 'bg-[#EDFBF2] text-[#137A43] border border-[#C6F0D4] shadow-xs'
                  : 'bg-white/80 text-[#68656A] hover:text-[#161616] border border-[rgba(20,20,20,0.06)]'
              }`}
            >
              Pursue (Go) ▾
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOnlyBlockers(!onlyBlockers)}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyBlockers
                  ? 'bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2] shadow-xs'
                  : 'bg-white/80 text-[#68656A] hover:text-[#161616] border border-[rgba(20,20,20,0.06)]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Con Bloqueos</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabla Operativa con Filas Vivas al pasar el ratón */}
      <div className="rounded-[22px] bg-white/85 backdrop-blur-[20px] border border-white/80 shadow-[0_4px_24px_rgba(20,20,30,0.04)] overflow-hidden">
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-8 h-8 text-[#8F8B92]" />}
            title="No hay oportunidades con estos filtros"
            description="Modifica los filtros o explora nuevas licitaciones en el catálogo oficial."
            actionText="Restablecer Filtros"
            onAction={() => {
              setSearchTerm('');
              setSelectedDecision('all');
              setOnlyBlockers(false);
            }}
          />
        ) : (
          <div className="divide-y divide-[rgba(20,20,20,0.06)]">
            {/* Header de Columnas */}
            <div className="px-6 py-3.5 bg-[#F6F3EF]/60 text-[11px] font-mono uppercase tracking-wider text-[#8F8B92] grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 md:col-span-5">Oportunidad / Expediente</div>
              <div className="hidden md:block md:col-span-2">Elegibilidad</div>
              <div className="hidden md:block md:col-span-2">Decisión Equipo</div>
              <div className="hidden md:block md:col-span-1">Plazo</div>
              <div className="hidden md:block md:col-span-2 text-right">Vigencia</div>
            </div>

            {/* Filas con micro-animaciones */}
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 1)', x: 2 }}
                transition={{ duration: 0.14 }}
                onClick={() => navigate(`/app/portfolio/${item.tenderId}`)}
                className={`px-6 py-4.5 transition-all cursor-pointer grid grid-cols-12 gap-4 items-center group ${
                  item.hasBlockers
                    ? 'border-l-[4px] border-l-[#F25A5A]'
                    : 'border-l-[4px] border-l-transparent'
                }`}
              >
                {/* Oportunidad */}
                <div className="col-span-12 md:col-span-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#161616]">
                      {item.fileReference}
                    </span>
                    {item.hasBlockers && (
                      <span className="px-2 py-0.2 rounded-full bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2] text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Bloqueo
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#161616] group-hover:text-[#695CFF] transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#68656A] truncate">
                    {item.contractingAuthority}
                  </p>
                </div>

                {/* Elegibilidad */}
                <div className="col-span-6 md:col-span-2">
                  <EligibilityBadge status={item.eligibility} />
                </div>

                {/* Decisión */}
                <div className="col-span-6 md:col-span-2">
                  <DecisionBadge decision={item.decision} />
                </div>

                {/* Plazo */}
                <div className="col-span-6 md:col-span-1 text-xs font-semibold text-[#975A16]">
                  {formatDeadlineDays(item.submissionDeadline).label}
                </div>

                {/* Vigencia & Acción animada */}
                <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-3 text-right">
                  <ValidityBadge validity={item.validity} />
                  <ArrowRight className="w-4 h-4 text-[#8F8B92] group-hover:text-[#695CFF] group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
