import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { intakeData, portfolioItems } = await req.json();

    console.log('Generating insights for:', intakeData?.firm_name);

    // Build context-rich prompt
    const topCandidates = portfolioItems
      .filter((item: any) => item.recommendation === 'Exec Bootcamp' || item.recommendation === 'Literacy Sprint')
      .slice(0, 5);

    const sectors = [...new Set(portfolioItems.map((item: any) => item.sector))].join(', ');
    const avgScore = Math.round(portfolioItems.reduce((sum: number, item: any) => sum + item.fit_score, 0) / portfolioItems.length);
    
    const prompt = `You are a senior AI strategy consultant analyzing a partner's portfolio for AI enablement opportunities. 

Partner Context:
- Firm: ${intakeData?.firm_name || 'Partner'}
- Type: ${intakeData?.partner_type || 'Investment Firm'}
- Portfolio Sectors: ${sectors}
- Companies Assessed: ${portfolioItems.length}
- Average Fit Score: ${avgScore}/100
- Timeline: ${intakeData?.urgency_window || 'Next 90 days'}
- Key Objectives: ${intakeData?.objectives_json?.join(', ') || 'AI enablement'}

Top Candidates:
${topCandidates.map((c: any, i: number) => 
  `${i + 1}. ${c.name} (${c.sector}, ${c.stage}) - Score: ${c.fit_score}/100, Rec: ${c.recommendation}`
).join('\n')}

Generate 3 highly specific, actionable strategic insights that:
1. Reference specific portfolio patterns (sectors, stages, readiness levels)
2. Identify concrete opportunities or risks visible in the data
3. Suggest tactical next steps that feel personalized and weapons-grade

Each insight should be 2-3 sentences maximum. Write like a trusted advisor who deeply understands this portfolio. Be specific, not generic. Use data points from above.

Format as JSON:
{
  "insights": [
    "Insight 1 text here",
    "Insight 2 text here", 
    "Insight 3 text here"
  ]
}`;

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
            content: 'You are a senior AI strategy consultant. Generate specific, data-driven insights in valid JSON format only. No markdown, no code blocks, just pure JSON.'
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
    
    console.log('Raw AI response:', content);
    
    // Parse JSON from response
    let insights;
    try {
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      insights = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      // Fallback to generic insights
      insights = {
        insights: [
          `Your portfolio shows ${avgScore >= 70 ? 'strong' : 'emerging'} AI readiness across ${sectors}.`,
          `${topCandidates.length} companies are ready for immediate AI enablement programs.`,
          `Focus on ${topCandidates[0]?.name || 'top candidates'} to build momentum and demonstrate ROI quickly.`
        ]
      };
    }

    console.log('Parsed insights:', insights);

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        insights: [
          'Complete your portfolio assessment to unlock AI-powered insights.',
          'Your portfolio data will drive personalized strategic recommendations.',
          'Contact support if this issue persists.'
        ]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
