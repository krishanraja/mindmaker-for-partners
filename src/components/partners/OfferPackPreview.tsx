import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, Mail, MessageSquare } from 'lucide-react';
import { ScoredPortfolioItem } from '@/utils/partnerScoring';

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
  const topSector = portfolioItems.length > 0 
    ? portfolioItems[0].sector 
    : intakeData?.sectors_json?.[0] || 'Technology';

  const partnerType = intakeData?.partner_type || 'Partner';

  // Tailored bullets based on partner type and sector
  const getBullets = () => {
    const bullets = [
      `Accelerate AI confidence in your ${topSector.toLowerCase()} portfolio`,
      `Qualify exec-ready opportunities through proven diagnostic framework`,
      `Co-brand deliverables that position your firm as the AI enablement leader`
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
            Accelerate AI confidence where it compounds
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Co-brand ready messaging and templates for your {partnerType.toLowerCase()} engagement model
        </p>
      </div>

      {/* 3 Key Bullets */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Why This Partnership Works
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

      {/* First 30 Days Promise */}
      <Card className="shadow-sm border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-bold text-foreground">First 30 Days</h3>
          <p className="text-sm text-foreground leading-relaxed">
            We'll run a portfolio diagnostic across your top candidates, identify 3-5 exec-ready opportunities, 
            and co-create a 90-day AI enablement roadmap. Your team gets full access to frameworks, templates, 
            and co-brand rights.
          </p>
        </CardContent>
      </Card>

      {/* Portfolio Prioritization Memo */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Portfolio Prioritization Memo (Internal Use)
          </h3>
          <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
            <div className="space-y-2 text-muted-foreground">
              <p className="font-semibold text-foreground">TO: Investment Committee / Partner Team</p>
              <p className="font-semibold text-foreground">RE: AI Readiness Portfolio Assessment</p>
              <div className="pt-2 space-y-2">
                <p><strong className="text-foreground">OVERVIEW</strong></p>
                <p>Completed diagnostic assessment across {portfolioItems.length} portfolio companies. 
                Identified {portfolioItems.filter(item => item.recommendation !== 'Not Now').length} high-priority 
                opportunities for AI enablement.</p>
                
                <p className="pt-2"><strong className="text-foreground">TOP PRIORITIES (Next 30 Days)</strong></p>
                {portfolioItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="pl-4">
                    <p><strong className="text-foreground">{i + 1}. {item.name} - {item.recommendation}</strong></p>
                    <p className="pl-4">→ Fit Score: {item.fit_score}/100</p>
                    <p className="pl-4">→ Key Opportunity: {item.sector || topSector} optimization with {item.ai_posture} AI posture</p>
                    <p className="pl-4">→ Recommended Action: Schedule board-level introduction</p>
                  </div>
                ))}
                
                <p className="pt-2"><strong className="text-foreground">NEXT STEPS</strong></p>
                <p>Prioritize board meeting introductions for top 3 companies. Use Board Meeting Talking Points 
                (below) to frame the conversation during scheduled check-ins.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Board Meeting Talking Points */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Board Meeting Talking Points (Warm Introduction)
          </h3>
          <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
            <div className="space-y-2 text-muted-foreground">
              <p className="font-semibold text-foreground">FOR: [Company Name] - [Next Board Meeting Date]</p>
              <p className="font-semibold text-foreground">AGENDA ITEM: AI Readiness & Quick Win Identification</p>
              
              <p className="pt-2"><strong className="text-foreground">CONTEXT TO SHARE:</strong></p>
              <p>→ "We ran a portfolio-wide AI diagnostic to help our companies identify high-impact opportunities"</p>
              <p>→ "Based on [Company]'s current stage, data maturity, and goals, you scored [X/100] for AI readiness"</p>
              <p>→ "This puts you in the top tier of our portfolio for AI enablement"</p>
              
              <p className="pt-2"><strong className="text-foreground">KEY OPPORTUNITY IDENTIFIED:</strong></p>
              <p>→ [Specific recommendation from scoring: Exec Bootcamp/Literacy Sprint/Diagnostic]</p>
              <p>→ Rationale: Strong {topSector.toLowerCase()} positioning with exec-level engagement potential</p>
              
              <p className="pt-2"><strong className="text-foreground">VALUE PROPOSITION:</strong></p>
              <p>→ 90-day sprint focused on measurable business outcomes</p>
              <p>→ Co-branded deliverable showing our firm's AI enablement leadership</p>
              <p>→ Zero-commitment diagnostic to validate fit</p>
              
              <p className="pt-2"><strong className="text-foreground">NEXT STEP:</strong></p>
              <p>→ "Would you be open to a 15-minute intro call with our partner MindMaker to explore this further?"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary One-Pager */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Executive Summary One-Pager (Share with Portfolio Company)
          </h3>
          <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
            <div className="space-y-2 text-muted-foreground">
              <p className="font-semibold text-foreground text-center">[Your Firm Logo] × MindMaker</p>
              <p className="font-semibold text-foreground text-center text-lg">AI READINESS ASSESSMENT</p>
              <p className="text-center">[Company Name] - {new Date().toLocaleDateString()}</p>
              
              <p className="pt-2"><strong className="text-foreground">YOUR SCORE: [X/100] - [Recommendation Category]</strong></p>
              
              <p className="pt-2"><strong className="text-foreground">WHAT THIS MEANS:</strong></p>
              <p>Your company demonstrates strong readiness for AI enablement in the {topSector.toLowerCase()} sector. 
              Based on current capabilities, data maturity, and executive engagement, you're positioned to capture 
              high-impact AI opportunities within a 90-day sprint.</p>
              
              <p className="pt-2"><strong className="text-foreground">RECOMMENDED NEXT STEP: [Program Name]</strong></p>
              <p>A focused 90-day engagement to identify, validate, and deploy your highest-ROI AI opportunities. 
              Includes executive alignment, technical diagnostic, and co-branded deliverables.</p>
              
              <p className="pt-2"><strong className="text-foreground">EXPECTED OUTCOMES (90 Days):</strong></p>
              <p>✓ 3-5 validated AI opportunities mapped to business objectives</p>
              <p>✓ Executive team aligned on AI strategy and priorities</p>
              <p>✓ 90-day implementation roadmap with clear ownership</p>
              
              <p className="pt-2"><strong className="text-foreground">NEXT STEPS:</strong></p>
              <p>☐ 15-minute discovery call with MindMaker team</p>
              <p>☐ Review diagnostic framework and methodology</p>
              <p>☐ Schedule kickoff (if aligned)</p>
              
              <p className="pt-2"><strong className="text-foreground">CONTACT:</strong></p>
              <p>[Your contact] - [Your firm]</p>
              <p>MindMaker - krish@themindmaker.ai</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Guide */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Conversation Guide (Internal Reference)
          </h3>
          <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3">
            <div className="space-y-3 text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">OPENING THE CONVERSATION:</p>
                <p className="italic">"We've been running AI readiness assessments across our portfolio to help companies 
                identify where AI can create the most value. Based on your current operations, I think there might be 
                a strong fit for [Company Name]."</p>
              </div>
              
              <div className="pt-2">
                <p className="font-semibold text-foreground">COMMON QUESTIONS & RESPONSES:</p>
                
                <div className="pl-4 space-y-2 pt-1">
                  <div>
                    <p className="font-semibold text-foreground">Q: "We're already exploring AI internally"</p>
                    <p>A: "That's great. This isn't about replacing what you're doing—it's about validating your 
                    priorities and ensuring you're focused on the highest-ROI opportunities first. Most companies 
                    find 2-3 blind spots they weren't considering."</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">Q: "We don't have budget for this right now"</p>
                    <p>A: "As your {partnerType.toLowerCase()}, we're covering the initial diagnostic. The question 
                    is whether this is a strategic priority for the next 90 days—not budget."</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">Q: "How much time commitment?"</p>
                    <p>A: "15-minute intro call to assess fit, then a 2-hour diagnostic workshop with your exec team. 
                    After that, we'll show you a 90-day roadmap and you decide if you want to proceed."</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="font-semibold text-foreground">RED FLAGS (Don't Push):</p>
                <p>→ No exec sponsor available (CEO/COO level)</p>
                <p>→ Company in crisis mode (fundraising, layoffs, pivot)</p>
                <p>→ Leadership team turnover expected in next 90 days</p>
                <p className="italic">→ Wait 1-2 quarters and revisit</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Work Checklist */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Pre-Work Checklist (Before Portfolio Company Introduction)
          </h3>
          <ul className="space-y-2">
            {[
              'Confirm next board meeting or scheduled check-in date',
              'Review company\'s current AI initiatives (if any documented)',
              'Identify exec sponsor for introduction (CEO/COO level)',
              'Prepare company-specific talking points from their score',
              'Secure internal approval to proceed with co-branded engagement'
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
