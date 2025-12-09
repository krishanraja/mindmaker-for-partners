/**
 * Generate Partner Insights Edge Function
 * 
 * Uses OpenAI to generate portfolio insights based on assessment data.
 * Includes Zod validation for LLM output.
 * 
 * @module functions/generate-partner-insights
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// Zod Schema for LLM Response Validation
// ============================================================================

const PartnerInsightsSchema = z.object({
  insights: z.array(z.string()).min(1).max(5)
});

type PartnerInsights = z.infer<typeof PartnerInsightsSchema>;

/**
 * Validate and parse LLM response
 * Returns validated data or fallback on failure
 */
function parseInsightsResponse(
  content: string,
  fallbackInsights: string[]
): { success: boolean; data: PartnerInsights; parseError?: string } {
  try {
    // Try to extract JSON if wrapped in markdown code blocks
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    
    const parsed = JSON.parse(jsonStr);
    const result = PartnerInsightsSchema.safeParse(parsed);
    
    if (result.success) {
      console.log('LLM response validated successfully');
      return { success: true, data: result.data };
    }
    
    console.error('LLM response failed schema validation:', result.error.errors);
    return { 
      success: false, 
      data: { insights: fallbackInsights },
      parseError: `Schema validation failed: ${result.error.errors.map(e => e.message).join(', ')}`
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown parse error';
    console.error('Failed to parse LLM response as JSON:', errorMessage);
    return { 
      success: false, 
      data: { insights: fallbackInsights },
      parseError: errorMessage
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const { intakeData, portfolioItems, sessionId } = await req.json();

    console.log('=== Generate Partner Insights ===');
    console.log('Session ID:', sessionId || 'not provided');
    console.log('Firm:', intakeData?.firm_name);
    console.log('Portfolio size:', portfolioItems?.length);

    // Validate required inputs
    if (!portfolioItems || portfolioItems.length === 0) {
      throw new Error('No portfolio items provided');
    }

    // Build context for LLM
    const topCandidates = portfolioItems
      .filter((item: Record<string, unknown>) => 
        item.recommendation === 'Critical - Immediate Intervention' || 
        item.recommendation === 'High Risk - Scaffolding Required'
      )
      .slice(0, 5);

    const sectors = [...new Set(portfolioItems.map((item: Record<string, unknown>) => item.sector))].filter(Boolean).join(', ') || 'Various';
    const avgScore = Math.round(
      portfolioItems.reduce((sum: number, item: Record<string, unknown>) => sum + (Number(item.cognitive_risk_score) || 0), 0) / portfolioItems.length
    );
    
    // Build prompt
    const prompt = `You're helping a partner figure out which companies in their portfolio are about to waste money on bad AI decisions.

Partner Context:
- Firm: ${intakeData?.firm_name || 'Partner'}
- Type: ${intakeData?.partner_type || 'Investment Firm'}
- Portfolio Sectors: ${sectors}
- Companies Assessed: ${portfolioItems.length}
- Average Risk Score: ${avgScore}/100 (higher = more likely to waste money)
- Timeline: ${intakeData?.urgency_window || 'Next 90 days'}
- Main Concerns: ${Array.isArray(intakeData?.objectives_json) ? intakeData.objectives_json.join(', ') : intakeData?.objectives_json || 'Teams wasting AI budget'}

Companies Most Likely to Waste Money:
${topCandidates.length > 0 
  ? topCandidates.map((c: Record<string, unknown>, i: number) => 
      `${i + 1}. ${c.name} (${c.sector || 'Unknown'}) - Risk Score: ${c.cognitive_risk_score}/100, Status: ${c.recommendation}`
    ).join('\n')
  : 'No critical risk companies identified'}

Write 3 short, direct insights (2-3 sentences each) that:
1. Tell them which teams will blow money fast and why
2. Point out specific thinking problems you see (like believing vendor hype, or panic buying)
3. Suggest who to talk to first and what to say

Write like you're talking to a friend over coffee, not writing a consultant report. Be specific - reference the actual data. Focus on preventing waste, not on technology. Sound like a real human who cares about their money.

IMPORTANT: Return ONLY valid JSON with no markdown formatting:
{"insights": ["Insight 1 text here", "Insight 2 text here", "Insight 3 text here"]}`;

    // Call OpenAI
    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You help investors spot which companies will waste money on AI. Write in plain English like you\'re talking to a friend. Be specific and direct. No jargon, no consultant-speak. Return valid JSON only - no markdown, no code blocks.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const tokenUsage = data.usage;
    
    console.log('Raw AI response:', content);
    console.log('Token usage:', tokenUsage);
    
    // Fallback insights in case of parse failure
    const fallbackInsights = [
      `You've got ${avgScore >= 50 ? 'several teams at risk' : 'a manageable risk profile'} across ${sectors}. The main issue: they're excited about AI but don't know how to tell good ideas from bad ones.`,
      `${topCandidates.length} teams are most likely to waste money because they'll believe vendor promises or buy something just to "do AI". They need help asking better questions first.`,
      `Start with ${topCandidates[0]?.name || 'your highest-risk team'} - they're most likely to blow budget in the next 30 days. Talk to them before they sign a contract.`
    ];
    
    // Parse and validate response
    const parseResult = parseInsightsResponse(content, fallbackInsights);
    
    const duration = Date.now() - startTime;
    console.log('=== Request Complete ===');
    console.log('Duration:', duration, 'ms');
    console.log('Validation success:', parseResult.success);
    if (parseResult.parseError) {
      console.log('Parse error:', parseResult.parseError);
    }

    return new Response(JSON.stringify({
      ...parseResult.data,
      _meta: {
        validated: parseResult.success,
        model: 'gpt-4o-mini',
        tokenUsage,
        processingTimeMs: duration,
        sessionId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Error generating insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        insights: [
          'Complete your assessment to see which teams are likely to waste money on AI.',
          'Your portfolio data will show which leaders can spot good AI from bad, and which will fall for vendor hype.',
          'Contact support if this issue persists.'
        ],
        _meta: {
          validated: false,
          error: errorMessage,
          processingTimeMs: duration
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
