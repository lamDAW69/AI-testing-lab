import { EligibilityStatus, HumanDecision, AnalysisValidity } from './qualification';

export interface PortfolioItem {
  id: string; // analysis ID
  tenderId: string;
  fileReference: string;
  title: string;
  contractingAuthority: string;
  budgetAmount: number;
  currency: string;
  submissionDeadline: string;
  eligibility: EligibilityStatus;
  decision: HumanDecision;
  validity: AnalysisValidity;
  hasBlockers: boolean;
  blockerSummary?: string;
  evidenceCoveragePercentage: number;
  lastAnalysisDate: string;
}

export interface PortfolioMetrics {
  totalAnalyzed: number;
  activeOpportunities: number;
  requiringReanalysis: number;
  decisions: {
    pursue: number;
    review: number;
    discard: number;
    undecided: number;
  };
  deadlinesSoon: number; // Menos de 7 días
}
