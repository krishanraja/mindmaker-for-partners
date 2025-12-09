/**
 * Partner Domain Types
 * 
 * Centralized type definitions for partner-related data structures.
 * These types are used across the partner assessment flow.
 * 
 * @module types/partner
 */

import type { Json } from '@/integrations/supabase/types';

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * Partner intake form data
 */
export interface PartnerIntakeData {
  partner_type: string;
  firm_name: string;
  role: string;
  region: string;
  sectors: string[];
  objectives: string[];
  engagement_model: string;
  pipeline_count: number;
  pipeline_names: string;
  urgency_window: string;
  resources_enablement_bandwidth: string;
  consent: boolean;
}

/**
 * Portfolio item input (before scoring)
 */
export interface PortfolioItemInput {
  name: string;
  sector?: string;
  hype_vs_discipline: string;
  mental_scaffolding: string;
  decision_quality: string;
  vendor_resistance: string;
  pressure_intensity: string;
  sponsor_thinking: string;
  upgrade_willingness: string;
}

/**
 * Portfolio item with all required fields for scoring
 */
export interface PortfolioItem extends PortfolioItemInput {
  stage?: string;
}

/**
 * Scored portfolio item with calculated metrics
 */
export interface ScoredPortfolioItem extends PortfolioItem {
  cognitive_risk_score: number;
  capital_at_risk: number;
  cognitive_readiness: number;
  recommendation: string;
  risk_flags: string[];
  fit_score: number; // Legacy compatibility
}

/**
 * Portfolio summary statistics
 */
export interface PortfolioSummary {
  totalCompanies: number;
  criticalRiskCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageRiskScore: number;
  topRiskCandidates: ScoredPortfolioItem[];
}

// ============================================================================
// Database Row Types (for Supabase operations)
// ============================================================================

/**
 * partner_intakes table row
 */
export interface PartnerIntakeRow {
  id: string;
  created_at: string;
  updated_at: string;
  firm_name: string;
  pipeline_count: number;
  pipeline_names: string;
  objectives_json: Json;
  urgency_window: string;
  consent: boolean;
  partner_type: string | null;
  role: string | null;
  region: string | null;
  sectors_json: Json | null;
  engagement_model: string | null;
  resources_enablement_bandwidth: string | null;
}

/**
 * partner_intakes insert payload
 */
export interface PartnerIntakeInsert {
  firm_name: string;
  pipeline_count: number;
  pipeline_names: string;
  objectives_json: Json;
  urgency_window: string;
  consent: boolean;
  partner_type?: string | null;
  role?: string | null;
  region?: string | null;
  sectors_json?: Json | null;
  engagement_model?: string | null;
  resources_enablement_bandwidth?: string | null;
}

/**
 * partner_portfolio_items table row
 */
export interface PartnerPortfolioItemRow {
  id: string;
  created_at: string;
  updated_at: string;
  intake_id: string;
  name: string;
  sector: string | null;
  stage: string | null;
  hype_vs_discipline: string | null;
  mental_scaffolding: string | null;
  decision_quality: string | null;
  vendor_resistance: string | null;
  pressure_intensity: string | null;
  sponsor_thinking: string | null;
  upgrade_willingness: string | null;
  cognitive_risk_score: number | null;
  capital_at_risk: number | null;
  cognitive_readiness: number | null;
  fit_score: number | null;
  recommendation: string | null;
  risk_flags_json: Json | null;
}

/**
 * partner_portfolio_items insert payload
 */
export interface PartnerPortfolioItemInsert {
  intake_id: string;
  name: string;
  sector?: string | null;
  stage?: string | null;
  hype_vs_discipline?: string | null;
  mental_scaffolding?: string | null;
  decision_quality?: string | null;
  vendor_resistance?: string | null;
  pressure_intensity?: string | null;
  sponsor_thinking?: string | null;
  upgrade_willingness?: string | null;
  cognitive_risk_score?: number | null;
  capital_at_risk?: number | null;
  cognitive_readiness?: number | null;
  fit_score?: number | null;
  recommendation?: string | null;
  risk_flags_json?: Json | null;
}

/**
 * partner_plans table row
 */
export interface PartnerPlanRow {
  id: string;
  created_at: string;
  updated_at: string;
  intake_id: string;
  share_slug: string;
  firm_name: string;
  objectives_json: Json;
  urgency_window: string;
  pipeline_count: number;
  total_companies: number;
  exec_bootcamp_count: number;
  literacy_sprint_count: number;
  diagnostic_count: number;
}

/**
 * partner_plans insert payload
 */
export interface PartnerPlanInsert {
  intake_id: string;
  share_slug: string;
  firm_name: string;
  objectives_json: Json;
  urgency_window: string;
  pipeline_count: number;
  total_companies?: number;
  exec_bootcamp_count?: number;
  literacy_sprint_count?: number;
  diagnostic_count?: number;
}

// ============================================================================
// Service Response Types
// ============================================================================

/**
 * Standard service response shape
 * All async service functions return this shape for consistency
 */
export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

/**
 * Create a successful service response
 */
export function createSuccessResponse<T>(data: T): ServiceResponse<T> {
  return { data, error: null, success: true };
}

/**
 * Create an error service response
 */
export function createErrorResponse<T>(error: Error | string): ServiceResponse<T> {
  return { 
    data: null, 
    error: error instanceof Error ? error : new Error(error), 
    success: false 
  };
}
