import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, CheckCircle2, Mail, MessageSquare, ChevronDown, Copy, Check, Zap } from 'lucide-react';
import { ScoredPortfolioItem } from '@/utils/partnerScoring';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OfferPackPreviewProps {
  intakeData: any;
  portfolioItems: ScoredPortfolioItem[];
  artifacts?: any;
}

export const OfferPackPreview: React.FC<OfferPackPreviewProps> = ({ 
  intakeData, 
  portfolioItems,
  artifacts 
}) => {
  const { toast } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  
  const topSector = portfolioItems.length > 0 
    ? portfolioItems[0].sector 
    : intakeData?.sectors_json?.[0] || 'Technology';

  const partnerType = intakeData?.partner_type || 'Partner';

  // Load AI insights on mount
  useEffect(() => {
    const loadInsights = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-partner-insights', {
          body: { intakeData, portfolioItems }
        });

        if (error) throw error;

        if (data?.insights && Array.isArray(data.insights)) {
          setAiInsights(data.insights);
        }
      } catch (error) {
        console.error('Error loading AI insights:', error);
        // Use fallback insights
        setAiInsights([
          `Your portfolio shows strong AI readiness across ${topSector}.`,
          `${portfolioItems.filter(p => p.fit_score >= 70).length} companies are ready for immediate enablement.`,
          `Focus on top candidates to build momentum and demonstrate quick wins.`
        ]);
      } finally {
        setLoadingInsights(false);
      }
    };

    loadInsights();
  }, [intakeData, portfolioItems, topSector]);

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    toast({
      title: "Copied to clipboard",
      description: `${sectionName} copied successfully`,
    });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Tailored bullets based on partner type and sector
  const getBullets = () => {
    const bullets = [
      `Spot which ${topSector.toLowerCase()} teams will waste money before they sign a contract`,
      `Help leaders ask better questions instead of believing vendor promises`,
      `Position yourself as the trusted advisor who prevents bad decisions, not just another vendor`
    ];
    return bullets;
  };

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Stop Your Teams From Wasting Money on Bad AI
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Ready-to-use messages and templates you can send today
        </p>
      </div>

      {/* 3 Key Bullets */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Why This Matters
          </h3>
          <ul className="space-y-3">
            {getBullets().map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <Badge variant="default" className="mt-0.5">{i + 1}</Badge>
                <span className="text-sm text-foreground">{bullet}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* AI-Powered Strategic Insights */}
      <Card className="shadow-sm border rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">What We See In Your Portfolio</h3>
            <Badge variant="secondary" className="ml-auto text-xs">AI Analysis</Badge>
          </div>
          
          {loadingInsights ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {aiInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3 bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          )}
          
          <p className="text-xs text-muted-foreground italic mt-4">
            AI-generated based on your portfolio data and which teams show warning signs.
          </p>
        </CardContent>
      </Card>

      {/* First 30 Days Promise */}
      <Card className="shadow-sm border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-bold text-foreground">What Happens Next</h3>
          <p className="text-sm text-foreground leading-relaxed">
            We'll show you which teams are likely to waste money, why they'll waste it, and exactly what to say to them before they do. 
            You get the tools, the talking points, and co-branding rights. Your teams learn to spot good AI from bad without becoming technical experts.
          </p>
        </CardContent>
      </Card>

      {/* Portfolio Prioritization Memo */}
      <Collapsible defaultOpen={false}>
        <Card className="shadow-sm border rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Internal Memo - Who to Talk To First
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const memoText = `TO: Investment Committee / Partner Team
RE: Which Teams Will Waste Money on AI

OVERVIEW
Assessed ${portfolioItems.length} portfolio companies. Found ${portfolioItems.filter(item => item.recommendation !== 'Low Risk - Let Them Run').length} teams likely to waste money because they can't tell good AI from bad, or they're in panic mode.

TOP PRIORITIES (Next 30 Days)
${portfolioItems.slice(0, 3).map((item, i) => `${i + 1}. ${item.name} - ${item.recommendation}
   → Risk Score: ${item.fit_score}/100 (higher = more likely to waste money)
   → The Issue: ${item.sector || topSector} team will probably ${item.fit_score >= 70 ? 'buy something just to "do AI"' : 'fall for vendor promises'}
   → What to Do: Talk to them before they sign a contract`).join('\n\n')}

NEXT STEPS
Call these 3 teams first. Use the talking points below for your next board meeting or check-in.`;
                    copyToClipboard(memoText, 'Portfolio Memo');
                  }}
                >
                  {copiedSection === 'Portfolio Memo' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground">TO: Investment Committee / Partner Team</p>
                  <p className="font-semibold text-foreground">RE: Which Teams Will Waste Money on AI</p>
                  <div className="pt-2 space-y-2">
                    <p><strong className="text-foreground">OVERVIEW</strong></p>
                    <p>Assessed {portfolioItems.length} portfolio companies. 
                    Found {portfolioItems.filter(item => item.recommendation !== 'Low Risk - Let Them Run').length} teams 
                    likely to waste money because they can't tell good AI from bad, or they're in panic mode.</p>
                    
                    <p className="pt-2"><strong className="text-foreground">TOP PRIORITIES (Next 30 Days)</strong></p>
                    {portfolioItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="pl-4">
                        <p><strong className="text-foreground">{i + 1}. {item.name} - {item.recommendation}</strong></p>
                        <p className="pl-4">→ Risk Score: {item.fit_score}/100 (higher = more likely to waste money)</p>
                        <p className="pl-4">→ The Issue: {item.sector || topSector} team will probably {item.fit_score >= 70 ? 'buy something just to "do AI"' : 'fall for vendor promises'}</p>
                        <p className="pl-4">→ What to Do: Talk to them before they sign a contract</p>
                      </div>
                    ))}
                    
                    <p className="pt-2"><strong className="text-foreground">NEXT STEPS</strong></p>
                    <p>Call these 3 teams first. Use the talking points below for your next board meeting or check-in.</p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>

      {/* Board Meeting Talking Points */}
      <Collapsible defaultOpen={false}>
        <Card className="shadow-sm border rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                What to Say In Your Next Board Meeting
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const talkingPointsText = `FOR: [Company Name] - [Next Board Meeting Date]
TOPIC: Preventing AI Budget Waste

WHAT TO SAY:
→ "We looked at decision patterns across our portfolio to see which teams might waste money on AI"
→ "Based on how [Company] is thinking about this, you scored [X/100] for risk of wasting capital"
→ "Teams with scores like yours usually benefit from talking to someone before they buy anything"

THE ISSUE WE SEE:
→ [${topSector} teams] - ${portfolioItems[0]?.recommendation || 'Higher risk of falling for vendor hype'}
→ Specifically: Team is either believing vendor promises or feeling pressure to "do something" with AI

THE FIX:
→ 15-minute call to help the team ask better questions
→ Not about buying anything - about spotting good AI ideas from bad ones
→ Zero commitment, just a conversation

NEXT STEP:
→ "Would you be open to a quick call with our partner to talk through your AI priorities?"`;
                    copyToClipboard(talkingPointsText, 'Talking Points');
                  }}
                >
                  {copiedSection === 'Talking Points' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground">FOR: [Company Name] - [Next Board Meeting Date]</p>
                  <p className="font-semibold text-foreground">TOPIC: Preventing AI Budget Waste</p>
                  
                  <p className="pt-2"><strong className="text-foreground">WHAT TO SAY:</strong></p>
                  <p>→ "We looked at decision patterns across our portfolio to see which teams might waste money on AI"</p>
                  <p>→ "Based on how [Company] is thinking about this, you scored [X/100] for risk of wasting capital"</p>
                  <p>→ "Teams with scores like yours usually benefit from talking to someone before they buy anything"</p>
                  
                  <p className="pt-2"><strong className="text-foreground">THE ISSUE WE SEE:</strong></p>
                  <p>→ [{topSector} teams] - {portfolioItems[0]?.recommendation || 'Higher risk of falling for vendor hype'}</p>
                  <p>→ Specifically: Team is either believing vendor promises or feeling pressure to "do something" with AI</p>
                  
                  <p className="pt-2"><strong className="text-foreground">THE FIX:</strong></p>
                  <p>→ 15-minute call to help the team ask better questions</p>
                  <p>→ Not about buying anything - about spotting good AI ideas from bad ones</p>
                  <p>→ Zero commitment, just a conversation</p>
                  
                  <p className="pt-2"><strong className="text-foreground">NEXT STEP:</strong></p>
                  <p>→ "Would you be open to a quick call with our partner to talk through your AI priorities?"</p>
                </div>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>

      {/* Executive Summary One-Pager */}
      <Collapsible defaultOpen={false}>
        <Card className="shadow-sm border rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                One-Page Summary (Share With Portfolio Company)
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const summaryText = `[Your Firm Logo] × MindMaker
AI DECISION ASSESSMENT
[Company Name] - ${new Date().toLocaleDateString()}

YOUR SCORE: [X/100] - [Risk Category]

WHAT THIS MEANS:
Based on how your team thinks about AI and makes decisions, we see [some/significant] risk that you'll waste money on the wrong things. This happens when teams either believe vendor promises too easily, or feel pressure to "do something" without a clear way to judge good ideas from bad ones.

WHAT WE RECOMMEND:
A quick conversation to help your team ask better questions before spending money. Not about selling you anything - about making sure you can spot good AI opportunities from bad ones.

WHAT YOU'LL GET:
✓ Clear questions to ask vendors (so you can tell who's real and who's selling hype)
✓ Simple framework to judge AI projects (is this worth your money or not?)
✓ Confidence that you're making smart decisions (not just doing AI to say you did it)

NEXT STEPS:
☐ 15-minute call with MindMaker team
☐ See if this is a fit for your priorities right now
☐ Decide if you want to continue (totally optional)

CONTACT:
[Your contact] - [Your firm]
MindMaker - krish@themindmaker.ai`;
                    copyToClipboard(summaryText, 'Executive Summary');
                  }}
                >
                  {copiedSection === 'Executive Summary' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground text-center">[Your Firm Logo] × MindMaker</p>
                  <p className="font-semibold text-foreground text-center text-lg">AI DECISION ASSESSMENT</p>
                  <p className="text-center">[Company Name] - {new Date().toLocaleDateString()}</p>
                  
                  <p className="pt-2"><strong className="text-foreground">YOUR SCORE: [X/100] - [Risk Category]</strong></p>
                  
                  <p className="pt-2"><strong className="text-foreground">WHAT THIS MEANS:</strong></p>
                  <p>Based on how your team thinks about AI and makes decisions, we see [some/significant] risk that you'll 
                  waste money on the wrong things. This happens when teams either believe vendor promises too easily, or feel 
                  pressure to "do something" without a clear way to judge good ideas from bad ones.</p>
                  
                  <p className="pt-2"><strong className="text-foreground">WHAT WE RECOMMEND:</strong></p>
                  <p>A quick conversation to help your team ask better questions before spending money. Not about selling you 
                  anything - about making sure you can spot good AI opportunities from bad ones.</p>
                  
                  <p className="pt-2"><strong className="text-foreground">WHAT YOU'LL GET:</strong></p>
                  <p>✓ Clear questions to ask vendors (so you can tell who's real and who's selling hype)</p>
                  <p>✓ Simple framework to judge AI projects (is this worth your money or not?)</p>
                  <p>✓ Confidence that you're making smart decisions (not just doing AI to say you did it)</p>
                  
                  <p className="pt-2"><strong className="text-foreground">NEXT STEPS:</strong></p>
                  <p>☐ 15-minute call with MindMaker team</p>
                  <p>☐ See if this is a fit for your priorities right now</p>
                  <p>☐ Decide if you want to continue (totally optional)</p>
                  
                  <p className="pt-2"><strong className="text-foreground">CONTACT:</strong></p>
                  <p>[Your contact] - [Your firm]</p>
                  <p>MindMaker - krish@themindmaker.ai</p>
                </div>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>

      {/* Conversation Guide */}
      <Collapsible defaultOpen={false}>
        <Card className="shadow-sm border rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                How to Have The Conversation
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const guideText = `HOW TO INTRODUCE THIS TO YOUR PORTFOLIO COMPANIES

OPENING:
"We've been looking at decision patterns across our portfolio - trying to spot which teams might waste money on AI before they do. Based on what we see with [Company Name], I think a quick conversation could be really helpful."

COMMON QUESTIONS:

Q: "We're already working on AI stuff"
A: "That's great. This isn't about replacing what you're doing. It's about making sure you can tell the good ideas from the bad ones before you spend serious money. Most teams find 2-3 blind spots they didn't see."

Q: "We don't have budget for consultants"
A: "As your ${partnerType.toLowerCase()}, we're covering the first conversation. This is about whether it's worth your time right now - not money."

Q: "How much time does this take?"
A: "15 minutes to see if it's a fit. If it is, maybe 2 hours with your leadership team. After that, you'll know exactly what makes sense for you."

RED FLAGS - DON'T PUSH IF:
→ No senior leader (CEO/COO) can make time
→ Company is in crisis (fundraising, layoffs, major pivot)
→ Leadership team about to change in next 90 days
→ Just note it and circle back in a quarter`;
                    copyToClipboard(guideText, 'Conversation Guide');
                  }}
                >
                  {copiedSection === 'Conversation Guide' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">OPENING:</p>
                    <p className="italic">"We've been looking at decision patterns across our portfolio - trying to spot which 
                    teams might waste money on AI before they do. Based on what we see with [Company Name], I think a quick 
                    conversation could be really helpful."</p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="font-semibold text-foreground">COMMON QUESTIONS:</p>
                    
                    <div className="pl-4 space-y-2 pt-1">
                      <div>
                        <p className="font-semibold text-foreground">Q: "We're already working on AI stuff"</p>
                        <p>A: "That's great. This isn't about replacing what you're doing. It's about making sure you can tell 
                        the good ideas from the bad ones before you spend serious money. Most teams find 2-3 blind spots they didn't see."</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground">Q: "We don't have budget for consultants"</p>
                        <p>A: "As your {partnerType.toLowerCase()}, we're covering the first conversation. This is about whether 
                        it's worth your time right now - not money."</p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground">Q: "How much time does this take?"</p>
                        <p>A: "15 minutes to see if it's a fit. If it is, maybe 2 hours with your leadership team. After that, 
                        you'll know exactly what makes sense for you."</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="font-semibold text-foreground">RED FLAGS - DON'T PUSH IF:</p>
                    <p>→ No senior leader (CEO/COO) can make time</p>
                    <p>→ Company is in crisis (fundraising, layoffs, major pivot)</p>
                    <p>→ Leadership team about to change in next 90 days</p>
                    <p className="italic">→ Just note it and circle back in a quarter</p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>

      {/* Pre-Work Checklist */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Before You Reach Out - Quick Checklist
          </h3>
          <ul className="space-y-2">
            {[
              'Know when their next board meeting or check-in is',
              'Review what they\'re already doing with AI (if anything)',
              'Identify who the senior decision maker is (CEO/COO level)',
              'Pull their specific risk score and what it means',
              'Make sure your firm is aligned on doing this co-branded'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded" disabled />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
