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
    
    const prompt = `You're helping a partner figure out which companies in their portfolio are about to waste money on bad AI decisions.

Partner Context:
- Firm: ${intakeData?.firm_name || 'Partner'}
- Type: ${intakeData?.partner_type || 'Investment Firm'}
- Portfolio Sectors: ${sectors}
- Companies Assessed: ${portfolioItems.length}
- Average Risk Score: ${avgScore}/100 (higher = more likely to waste money)
- Timeline: ${intakeData?.urgency_window || 'Next 90 days'}
- Main Concerns: ${intakeData?.objectives_json?.join(', ') || 'Teams wasting AI budget'}

Companies Most Likely to Waste Money:
${topCandidates.map((c: any, i: number) => 
  `${i + 1}. ${c.name} (${c.sector}) - Risk Score: ${c.fit_score}/100, Status: ${c.recommendation}`
).join('\n')}

Write 3 short, direct insights (2-3 sentences each) that:
1. Tell them which teams will blow money fast and why
2. Point out specific thinking problems you see (like believing vendor hype, or panic buying)
3. Suggest who to talk to first and what to say

Write like you're talking to a friend over coffee, not writing a consultant report. Be specific - reference the actual data. Focus on preventing waste, not on technology. Sound like a real human who cares about their money.

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
      // Fallback to simple insights
      insights = {
        insights: [
          `You've got ${avgScore >= 70 ? 'some smart teams' : 'several teams at risk'} in ${sectors}. The main issue: they're excited about AI but don't know how to tell good ideas from bad ones.`,
          `${topCandidates.length} teams are likely to waste money because they'll believe vendor promises or buy something just to "do AI". They need help asking better questions first.`,
          `Start with ${topCandidates[0]?.name || 'your highest-risk team'} - they're most likely to blow budget in the next 30 days. Talk to them before they sign a contract.`
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
          'Complete your assessment to see which teams are likely to waste money on AI.',
          'Your portfolio data will show which leaders can spot good AI from bad, and which will fall for vendor hype.',
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
