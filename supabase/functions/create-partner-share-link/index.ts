import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates that a string is a valid UUID v4
 */
function isValidUUID(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

/**
 * Sanitizes error messages to prevent information leakage
 */
function sanitizeErrorMessage(error: unknown): string {
  // Don't expose internal error details to clients
  if (error instanceof Error) {
    // Only expose safe, generic error messages
    if (error.message.includes('not found') || error.message.includes('No rows')) {
      return 'Resource not found';
    }
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

    // Validate required fields
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Request body must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { plan_id } = body as { plan_id?: unknown };

    // Validate plan_id is a valid UUID
    if (!isValidUUID(plan_id)) {
      console.warn('Invalid plan_id format received:', typeof plan_id);
      return new Response(
        JSON.stringify({ error: 'Invalid plan_id format. Must be a valid UUID.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First verify the plan exists before updating
    const { data: existingPlan, error: fetchError } = await supabaseClient
      .from('partner_plans')
      .select('id')
      .eq('id', plan_id)
      .single();

    if (fetchError || !existingPlan) {
      console.warn('Plan not found:', plan_id);
      return new Response(
        JSON.stringify({ error: 'Plan not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique slug
    const share_slug = crypto.randomUUID();

    // Update plan with share slug
    const { data, error } = await supabaseClient
      .from('partner_plans')
      .update({ share_slug })
      .eq('id', plan_id)
      .select()
      .single();

    if (error) {
      console.error('Database error updating plan:', error.code);
      throw error;
    }

    console.log('Share link created successfully for plan:', plan_id.substring(0, 8));

    return new Response(
      JSON.stringify({ share_slug }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating share link:', error);
    const errorMessage = sanitizeErrorMessage(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
