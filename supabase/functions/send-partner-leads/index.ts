import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates that a string is a valid UUID
 */
function isValidUUID(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

/**
 * Validates a candidate object has required fields
 */
function isValidCandidate(candidate: unknown): candidate is {
  name: string;
  recommendation: string;
  fit_score: number;
  risk_flags: string[];
} {
  if (!candidate || typeof candidate !== 'object') return false;
  const c = candidate as Record<string, unknown>;
  return (
    typeof c.name === 'string' && c.name.length > 0 && c.name.length <= 200 &&
    typeof c.recommendation === 'string' && c.recommendation.length <= 500 &&
    typeof c.fit_score === 'number' && c.fit_score >= 0 && c.fit_score <= 100 &&
    Array.isArray(c.risk_flags) && c.risk_flags.every((f: unknown) => typeof f === 'string')
  );
}

/**
 * Validates partner info object
 */
function isValidPartnerInfo(info: unknown): info is {
  firm_name: string;
  partner_type: string;
} {
  if (!info || typeof info !== 'object') return false;
  const i = info as Record<string, unknown>;
  return (
    typeof i.firm_name === 'string' && i.firm_name.length > 0 && i.firm_name.length <= 200 &&
    typeof i.partner_type === 'string' && i.partner_type.length > 0 && i.partner_type.length <= 100
  );
}

/**
 * Sanitizes a string for safe storage
 */
function sanitizeString(value: string, maxLength: number = 500): string {
  return value.slice(0, maxLength).replace(/[<>]/g, '');
}

/**
 * Sanitizes error messages to prevent information leakage
 */
function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return 'Access denied';
    }
  }
  return 'An unexpected error occurred';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      console.error('Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Request body must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { intake_id, candidates, partner_info } = body as {
      intake_id?: unknown;
      candidates?: unknown;
      partner_info?: unknown;
    };

    // Validate intake_id
    if (!isValidUUID(intake_id)) {
      console.warn('Invalid intake_id format');
      return new Response(
        JSON.stringify({ error: 'Invalid intake_id format. Must be a valid UUID.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate candidates array
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'candidates must be a non-empty array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit number of candidates to prevent abuse
    if (candidates.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Maximum 100 candidates allowed per request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate each candidate
    for (let i = 0; i < candidates.length; i++) {
      if (!isValidCandidate(candidates[i])) {
        console.warn(`Invalid candidate at index ${i}`);
        return new Response(
          JSON.stringify({ error: `Invalid candidate data at index ${i}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate partner_info
    if (!isValidPartnerInfo(partner_info)) {
      return new Response(
        JSON.stringify({ error: 'Invalid partner_info format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify intake exists before creating leads
    const { data: existingIntake, error: intakeError } = await supabaseClient
      .from('partner_intakes')
      .select('id')
      .eq('id', intake_id)
      .single();

    if (intakeError || !existingIntake) {
      console.warn('Intake not found:', intake_id);
      return new Response(
        JSON.stringify({ error: 'Intake not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create lead records for qualified candidates with sanitized data
    const leadsToInsert = (candidates as Array<{
      name: string;
      recommendation: string;
      fit_score: number;
      risk_flags: string[];
    }>).map((candidate) => ({
      source: 'partner_portfolio',
      intake_id: intake_id,
      company: sanitizeString(candidate.name, 200),
      contact_email: null,
      notes: JSON.stringify({
        recommendation: sanitizeString(candidate.recommendation, 500),
        fit_score: Math.min(100, Math.max(0, Math.round(candidate.fit_score))),
        partner_firm: sanitizeString(partner_info.firm_name, 200),
        partner_type: sanitizeString(partner_info.partner_type, 100),
        risk_flags: candidate.risk_flags.slice(0, 10).map((f: string) => sanitizeString(f, 200))
      })
    }));

    const { data, error } = await supabaseClient
      .from('leads')
      .insert(leadsToInsert)
      .select();

    if (error) {
      console.error('Database error inserting leads:', error.code);
      throw error;
    }

    console.log(`Created ${data?.length || 0} leads for intake ${intake_id.substring(0, 8)}`);

    return new Response(
      JSON.stringify({ success: true, leads_created: data?.length || 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending partner leads:', error);
    const errorMessage = sanitizeErrorMessage(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
