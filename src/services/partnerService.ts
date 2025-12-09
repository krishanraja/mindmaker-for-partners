/**
 * Partner Service Module
 * 
 * Provides type-safe database operations for partner-related tables.
 * All functions return a standardized { data, error, success } response.
 * 
 * @module services/partnerService
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  PartnerIntakeData,
  PartnerIntakeInsert,
  PartnerIntakeRow,
  PartnerPortfolioItemInsert,
  PartnerPortfolioItemRow,
  PartnerPlanInsert,
  PartnerPlanRow,
  ServiceResponse,
} from '@/types/partner';
import type { ScoredPortfolioItem } from '@/utils/partnerScoring';
import { createSuccessResponse, createErrorResponse } from '@/types/partner';

// ============================================================================
// Partner Intakes
// ============================================================================

/**
 * Insert a new partner intake record
 */
export async function insertPartnerIntake(
  intakeData: PartnerIntakeData
): Promise<ServiceResponse<PartnerIntakeRow>> {
  const startTime = Date.now();
  
  try {
    const payload: PartnerIntakeInsert = {
      partner_type: intakeData.partner_type || null,
      firm_name: intakeData.firm_name,
      role: intakeData.role || null,
      region: intakeData.region || null,
      sectors_json: intakeData.sectors,
      objectives_json: intakeData.objectives,
      engagement_model: intakeData.engagement_model || null,
      pipeline_count: intakeData.pipeline_count,
      pipeline_names: intakeData.pipeline_names,
      urgency_window: intakeData.urgency_window,
      resources_enablement_bandwidth: intakeData.resources_enablement_bandwidth || null,
      consent: intakeData.consent
    };

    // Use type assertion for table name since it's not in the generated types
    const { data, error } = await supabase
      .from('partner_intakes' as 'ai_conversations')
      .insert(payload as never)
      .select()
      .single();

    const duration = Date.now() - startTime;

    if (error) {
      logger.logDbOperation('insert', 'partner_intakes', false, {
        error: error.message,
        code: error.code,
        durationMs: duration
      });
      
      // Check for table not found error
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return createErrorResponse(
          new Error('Database tables not found. Please run the setup SQL script.')
        );
      }
      
      return createErrorResponse(error);
    }

    logger.logDbOperation('insert', 'partner_intakes', true, {
      intakeId: (data as unknown as PartnerIntakeRow)?.id,
      firmName: intakeData.firm_name,
      durationMs: duration
    });

    return createSuccessResponse(data as unknown as PartnerIntakeRow);
  } catch (err) {
    logger.logError('Failed to insert partner intake', err, {
      firmName: intakeData.firm_name
    });
    return createErrorResponse(err instanceof Error ? err : new Error('Unknown error'));
  }
}

/**
 * Get a partner intake by ID
 */
export async function getPartnerIntake(
  intakeId: string
): Promise<ServiceResponse<PartnerIntakeRow>> {
  try {
    const { data, error } = await supabase
      .from('partner_intakes' as 'ai_conversations')
      .select('*')
      .eq('id', intakeId)
      .single();

    if (error) {
      logger.logDbOperation('select', 'partner_intakes', false, {
        intakeId,
        error: error.message
      });
      return createErrorResponse(error);
    }

    logger.logDbOperation('select', 'partner_intakes', true, { intakeId });
    return createSuccessResponse(data as unknown as PartnerIntakeRow);
  } catch (err) {
    logger.logError('Failed to get partner intake', err, { intakeId });
    return createErrorResponse(err instanceof Error ? err : new Error('Unknown error'));
  }
}

// ============================================================================
// Partner Portfolio Items
// ============================================================================

/**
 * Insert portfolio items for an intake
 */
export async function insertPortfolioItems(
  intakeId: string,
  items: ScoredPortfolioItem[]
): Promise<ServiceResponse<PartnerPortfolioItemRow[]>> {
  const startTime = Date.now();
  
  try {
    const itemsToInsert: PartnerPortfolioItemInsert[] = items.map(item => ({
      intake_id: intakeId,
      name: item.name,
      sector: item.sector || null,
      stage: item.stage || null,
      hype_vs_discipline: item.hype_vs_discipline || null,
      mental_scaffolding: item.mental_scaffolding || null,
      decision_quality: item.decision_quality || null,
      vendor_resistance: item.vendor_resistance || null,
      pressure_intensity: item.pressure_intensity || null,
      sponsor_thinking: item.sponsor_thinking || null,
      upgrade_willingness: item.upgrade_willingness || null,
      cognitive_risk_score: item.cognitive_risk_score,
      capital_at_risk: item.capital_at_risk,
      cognitive_readiness: item.cognitive_readiness,
      fit_score: item.fit_score,
      recommendation: item.recommendation || null,
      risk_flags_json: item.risk_flags
    }));

    const { data, error } = await supabase
      .from('partner_portfolio_items' as 'ai_conversations')
      .insert(itemsToInsert as never[])
      .select();

    const duration = Date.now() - startTime;

    if (error) {
      logger.logDbOperation('insert', 'partner_portfolio_items', false, {
        intakeId,
        itemCount: items.length,
        error: error.message,
        durationMs: duration
      });
      return createErrorResponse(error);
    }

    logger.logDbOperation('insert', 'partner_portfolio_items', true, {
      intakeId,
      itemCount: items.length,
      durationMs: duration
    });

    return createSuccessResponse(data as unknown as PartnerPortfolioItemRow[]);
  } catch (err) {
    logger.logError('Failed to insert portfolio items', err, {
      intakeId,
      itemCount: items.length
    });
    return createErrorResponse(err instanceof Error ? err : new Error('Unknown error'));
  }
}

/**
 * Get portfolio items for an intake
 */
export async function getPortfolioItems(
  intakeId: string
): Promise<ServiceResponse<PartnerPortfolioItemRow[]>> {
  try {
    const { data, error } = await supabase
      .from('partner_portfolio_items' as 'ai_conversations')
      .select('*')
      .eq('intake_id' as 'id', intakeId);

    if (error) {
      logger.logDbOperation('select', 'partner_portfolio_items', false, {
        intakeId,
        error: error.message
      });
      return createErrorResponse(error);
    }

    logger.logDbOperation('select', 'partner_portfolio_items', true, {
      intakeId,
      itemCount: data?.length ?? 0
    });

    return createSuccessResponse(data as unknown as PartnerPortfolioItemRow[]);
  } catch (err) {
    logger.logError('Failed to get portfolio items', err, { intakeId });
    return createErrorResponse(err instanceof Error ? err : new Error('Unknown error'));
  }
}

// ============================================================================
// Partner Plans
// ============================================================================

/**
 * Insert a new partner plan
 */
export async function insertPartnerPlan(
  plan: PartnerPlanInsert
): Promise<ServiceResponse<PartnerPlanRow>> {
  const startTime = Date.now();
  
  try {
    const { data, error } = await supabase
      .from('partner_plans' as 'ai_conversations')
      .insert(plan as never)
      .select()
      .single();

    const duration = Date.now() - startTime;

    if (error) {
      logger.logDbOperation('insert', 'partner_plans', false, {
        intakeId: plan.intake_id,
        error: error.message,
        durationMs: duration
      });
      return createErrorResponse(error);
    }

    logger.logDbOperation('insert', 'partner_plans', true, {
      planId: (data as unknown as PartnerPlanRow)?.id,
      intakeId: plan.intake_id,
      durationMs: duration
    });

    return createSuccessResponse(data as unknown as PartnerPlanRow);
  } catch (err) {
    logger.logError('Failed to insert partner plan', err, {
      intakeId: plan.intake_id
    });
    return createErrorResponse(err instanceof Error ? err : new Error('Unknown error'));
  }
}

/**
 * Get a partner plan by share slug
 */
export async function getPartnerPlanBySlug(
  shareSlug: string
): Promise<ServiceResponse<PartnerPlanRow>> {
  try {
    const { data, error } = await supabase
      .from('partner_plans' as 'ai_conversations')
      .select('*')
      .eq('share_slug' as 'id', shareSlug)
      .single();

    if (error) {
      logger.logDbOperation('select', 'partner_plans', false, {
        shareSlug,
        error: error.message
      });
      return createErrorResponse(error);
    }

    logger.logDbOperation('select', 'partner_plans', true, { shareSlug });
    return createSuccessResponse(data as unknown as PartnerPlanRow);
  } catch (err) {
    logger.logError('Failed to get partner plan by slug', err, { shareSlug });
    return createErrorResponse(err instanceof Error ? err : new Error('Unknown error'));
  }
}

/**
 * Get a partner plan by intake ID
 */
export async function getPartnerPlanByIntakeId(
  intakeId: string
): Promise<ServiceResponse<PartnerPlanRow>> {
  try {
    const { data, error } = await supabase
      .from('partner_plans' as 'ai_conversations')
      .select('*')
      .eq('intake_id' as 'id', intakeId)
      .single();

    if (error) {
      logger.logDbOperation('select', 'partner_plans', false, {
        intakeId,
        error: error.message
      });
      return createErrorResponse(error);
    }

    logger.logDbOperation('select', 'partner_plans', true, { intakeId });
    return createSuccessResponse(data as unknown as PartnerPlanRow);
  } catch (err) {
    logger.logError('Failed to get partner plan by intake ID', err, { intakeId });
    return createErrorResponse(err instanceof Error ? err : new Error('Unknown error'));
  }
}
