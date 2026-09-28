export type HumanDecision = 'UNDECIDED' | 'PURSUE' | 'REVIEW' | 'DISCARD';
export type EligibilityStatus = 'POTENTIALLY_ELIGIBLE' | 'NEEDS_REVIEW' | 'POTENTIALLY_INELIGIBLE';
export type AnalysisValidity = 'VALID' | 'STALE' | 'REQUIRES_REANALYSIS';
export type RequirementStatus = 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'NOT_SUPPORTED' | 'UNKNOWN';

export interface DimensionEvaluation {
  id: string;
  name: string;
  status: 'FAVORABLE' | 'WARNING' | 'BLOCKER' | 'UNKNOWN';
  score?: number; // 0 a 100 indicativo, pero nunca score mágico que tape bloqueos
  summary: string;
  details: string;
}

export interface EvaluatedRequirement {
  id: string;
  category: 'SOLVENCY' | 'TECHNICAL' | 'ECONOMIC' | 'ADMINISTRATIVE' | 'ESG';
  title: string;
  status: RequirementStatus;
  isMandatory: boolean;
  confidence: number; // 0.0 a 1.0
  reasoning: string;
  literalCitation: string; // Cita textual inmutable del pliego
  documentName: string;
  documentVersion: number;
  evidenceId?: string;
  evidenceTitle?: string;
  evidenceStatus?: 'DECLARED' | 'VERIFIED' | 'EXPIRED' | 'PENDING_REVIEW';
}

export interface DecisionRecord {
  id: string;
  decision: HumanDecision;
  decidedBy: string;
  decidedAt: string;
  mandatoryReason: string; // Entre 5 y 5.000 caracteres
  analysisVersion: number;
}

export interface QualificationAnalysis {
  id: string; // UUIDv7
  tenderId: string;
  tenantId: string;
  validity: AnalysisValidity;
  invalidationReason?: string;
  eligibility: EligibilityStatus;
  summary: string;
  blockers: string[];
  dimensions: {
    potentialEligibility: DimensionEvaluation;
    technicalFit: DimensionEvaluation;
    economicFit: DimensionEvaluation;
    operationalCapacity: DimensionEvaluation;
    contractualRisk: DimensionEvaluation;
    deadlineFeasibility: DimensionEvaluation;
    evidenceCoverage: DimensionEvaluation;
  };
  requirements: EvaluatedRequirement[];
  currentDecision: HumanDecision;
  decisionHistory: DecisionRecord[];
  documentVersionUsed: number;
  createdAt: string;
  updatedAt: string;
}
