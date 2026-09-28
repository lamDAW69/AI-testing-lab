export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertType = 'DOCUMENT_CHANGE' | 'DEADLINE_APPROACHING' | 'ANALYSIS_INVALIDATED' | 'REQUIREMENT_UPDATE';

export interface TenantAlert {
  id: string; // UUIDv7
  tenantId: string;
  tenderId: string;
  tenderTitle: string;
  fileReference: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  requiresReanalysis: boolean;
}
