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

      {/* Email Template */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Outreach Template
          </h3>
          <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3 font-mono">
            <p><strong>Subject:</strong> Accelerate AI Readiness — Quick Portfolio Check</p>
            <div className="space-y-2 text-muted-foreground">
              <p>Hi [Name],</p>
              <p>
                Quick question: Where does <strong>{'{company}'}</strong> stand on AI readiness? 
                We're running a 15-minute diagnostic to help {topSector.toLowerCase()} leaders 
                identify their highest-impact AI opportunities.
              </p>
              <p>
                No selling — just a clear view of where AI can compound value in your business. 
                Interested in a quick call this week?
              </p>
              <p>Best,<br />[Your Name]</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DM Template */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            LinkedIn DM Template
          </h3>
          <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-2 font-mono text-muted-foreground">
            <p>
              Hey [Name] — saw <strong>{'{company}'}</strong> is in {topSector.toLowerCase()}. 
              We've been helping similar orgs find their AI quick wins. 15-min diagnostic? 
              Zero pitch, just clarity. Worth a chat?
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Work Checklist */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Pre-Work Checklist
          </h3>
          <ul className="space-y-2">
            {[
              'Confirm exec sponsor (CEO/COO level)',
              'Secure data contact (CTO/Head of Data)',
              'Define 90-day objective (cost, speed, quality, or capability)'
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
