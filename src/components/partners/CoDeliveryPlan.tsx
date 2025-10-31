import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, AlertCircle, ExternalLink } from 'lucide-react';
import { ScoredPortfolioItem } from '@/utils/partnerScoring';

interface CoDeliveryPlanProps {
  topCandidates: ScoredPortfolioItem[];
  artifacts?: any;
}

const CALENDLY_URL = 'https://calendly.com/krish-raja/mindmaker-meeting';

export const CoDeliveryPlan: React.FC<CoDeliveryPlanProps> = ({ topCandidates, artifacts }) => {
  if (!topCandidates || topCandidates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Complete portfolio scoring to generate your co-delivery plan</p>
      </div>
    );
  }

  const getRecommendationBadge = (rec: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'Exec Bootcamp': 'default',
      'Literacy Sprint': 'secondary',
      'Diagnostic': 'outline'
    };
    return <Badge variant={variants[rec] || 'outline'}>{rec}</Badge>;
  };

  const getPreWorkList = (recommendation: string) => {
    switch (recommendation) {
      case 'Exec Bootcamp':
        return [
          'Confirm CEO/COO sponsor availability',
          'Secure 90-day objective definition',
          'Schedule kickoff within 14 days'
        ];
      case 'Literacy Sprint':
        return [
          'Identify team leads for sprint',
          'Map initial AI use cases',
          'Schedule 60-min alignment call'
        ];
      case 'Diagnostic':
        return [
          'Secure data access contact',
          'Define current AI baseline',
          'Schedule diagnostic session'
        ];
      default:
        return ['Further qualification needed'];
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="shadow-sm border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{topCandidates.length}</p>
              <p className="text-sm text-muted-foreground">Top Candidates</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">
                {topCandidates.filter(c => c.recommendation === 'Exec Bootcamp').length}
              </p>
              <p className="text-sm text-muted-foreground">Bootcamp Ready</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">
                {Math.round(topCandidates.reduce((sum, c) => sum + c.fit_score, 0) / topCandidates.length)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Fit Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Candidates */}
      <div className="space-y-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Priority Candidates
        </h3>
        
        {topCandidates.map((candidate, index) => (
          <Card key={index} className="shadow-sm border rounded-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-lg">{candidate.name}</h4>
                  <p className="text-sm text-muted-foreground">{candidate.sector} • {candidate.stage}</p>
                </div>
                <div className="text-right space-y-1">
                  {getRecommendationBadge(candidate.recommendation)}
                  <p className="text-sm text-muted-foreground">Fit: {candidate.fit_score}/100</p>
                </div>
              </div>

              {/* Risk Flags */}
              {candidate.risk_flags && candidate.risk_flags.length > 0 && (
                <div className="flex items-start gap-2 bg-destructive/10 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Risk Flags:</p>
                    <ul className="text-xs text-destructive/80 mt-1 space-y-1">
                      {candidate.risk_flags.map((flag, i) => (
                        <li key={i}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Pre-Work */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Pre-Work:</p>
                <ul className="space-y-1.5">
                  {getPreWorkList(candidate.recommendation).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 rounded" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Session */}
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => window.open(CALENDLY_URL, '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Session for {candidate.name}
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-foreground">Immediate Next Steps</h3>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-sm text-foreground">
              <strong>Week 1:</strong> Outreach to top 3 candidates using templates
            </li>
            <li className="text-sm text-foreground">
              <strong>Week 2:</strong> Complete pre-work checklists with interested parties
            </li>
            <li className="text-sm text-foreground">
              <strong>Week 3:</strong> Schedule kickoff sessions
            </li>
            <li className="text-sm text-foreground">
              <strong>Week 4:</strong> Begin delivery with co-brand materials
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
