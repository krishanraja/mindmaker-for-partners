/**
 * Zod Schemas for LLM Response Validation
 * 
 * Defines schemas for validating LLM outputs to prevent hallucinations
 * and ensure structured data integrity.
 * 
 * @module lib/schemas
 */

import { z } from 'zod';

// ============================================================================
// Partner Insights Schema
// ============================================================================

/**
 * Schema for partner insights response from LLM
 */
export const PartnerInsightsSchema = z.object({
  insights: z.array(z.string()).min(1).max(5).describe('Array of 1-5 insight strings')
});

export type PartnerInsights = z.infer<typeof PartnerInsightsSchema>;

/**
 * Validate and parse partner insights response
 * Returns validated data or fallback on failure
 */
export function parsePartnerInsights(
  data: unknown, 
  fallbackInsights: string[] = []
): { success: boolean; data: PartnerInsights; errors?: z.ZodError } {
  const result = PartnerInsightsSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { 
    success: false, 
    data: { insights: fallbackInsights },
    errors: result.error
  };
}

// ============================================================================
// Assessment Analyzer Schema (for future LLM modes)
// ============================================================================

/**
 * Schema for dimension scores
 */
export const DimensionScoreSchema = z.object({
  dimension: z.string(),
  score: z.number().min(0).max(100),
  label: z.string()
});

/**
 * Schema for assessment analysis response
 */
export const AssessmentAnalysisSchema = z.object({
  summary: z.string().describe('Synthesis of the assessment, not just a recap'),
  key_actions: z.array(z.object({
    action: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    tied_to: z.string().describe('Specific input or score this action relates to')
  })).min(1).max(5),
  surprise_or_tension: z.string().describe('Contradictions, blind spots, or non-obvious links'),
  scores: z.array(DimensionScoreSchema),
  data_updates: z.array(z.object({
    field: z.string(),
    value: z.unknown(),
    reason: z.string()
  })).optional()
});

export type AssessmentAnalysis = z.infer<typeof AssessmentAnalysisSchema>;

// ============================================================================
// Portfolio Analyzer Schema
// ============================================================================

/**
 * Schema for portfolio analysis response
 */
export const PortfolioAnalysisSchema = z.object({
  rankings: z.array(z.object({
    name: z.string(),
    rank: z.number(),
    riskLevel: z.enum(['critical', 'high', 'medium', 'low']),
    primaryConcern: z.string()
  })),
  flags: z.array(z.object({
    type: z.enum(['warning', 'opportunity', 'urgent']),
    message: z.string(),
    affectedCompanies: z.array(z.string())
  })),
  recommendedRoute: z.object({
    immediate: z.array(z.string()),
    shortTerm: z.array(z.string()),
    longTerm: z.array(z.string())
  })
});

export type PortfolioAnalysis = z.infer<typeof PortfolioAnalysisSchema>;

// ============================================================================
// Generic LLM Response Wrapper
// ============================================================================

/**
 * Wrap any schema with common LLM response metadata
 */
export function createLLMResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    model: z.string().optional(),
    tokenUsage: z.object({
      prompt: z.number(),
      completion: z.number()
    }).optional(),
    processingTimeMs: z.number().optional()
  });
}

/**
 * Safe parse with logging
 */
export function safeParseLLMResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): { success: true; data: T } | { success: false; error: z.ZodError; data: null } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  console.error(`LLM response validation failed for ${context}:`, {
    errors: result.error.errors,
    receivedData: data
  });
  
  return { success: false, error: result.error, data: null };
}
