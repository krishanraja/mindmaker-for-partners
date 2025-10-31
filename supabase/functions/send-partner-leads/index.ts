import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { intake_id, candidates, partner_info } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create lead records for qualified candidates
    const leadsToInsert = candidates.map((candidate: any) => ({
      source: 'partner_portfolio',
      intake_id: intake_id,
      company: candidate.name,
      contact_email: null,
      notes: JSON.stringify({
        recommendation: candidate.recommendation,
        fit_score: candidate.fit_score,
        partner_firm: partner_info.firm_name,
        partner_type: partner_info.partner_type,
        risk_flags: candidate.risk_flags
      })
    }));

    const { data, error } = await supabaseClient
      .from('leads')
      .insert(leadsToInsert)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, leads_created: data.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending partner leads:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
