import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, Target, Download, Share2, Send } from 'lucide-react';
import { PartnerIntakeData } from './PartnerIntakeForm';
import { ScoredPortfolioItem, getPortfolioSummary } from '@/utils/partnerScoring';
import { HeatmapVisualization } from './HeatmapVisualization';
import { OfferPackPreview } from './OfferPackPreview';
import { CoDeliveryPlan } from './CoDeliveryPlan';
import { ExportActions } from './ExportActions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface PartnerPlanResultsProps {
  intakeData: PartnerIntakeData;
  intakeId: string;
  portfolioItems: ScoredPortfolioItem[];
  onBack: () => void;
}

export const PartnerPlanResults: React.FC<PartnerPlanResultsProps> = ({
  intakeData,
  intakeId,
  portfolioItems,
  onBack
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('heatmap');
  const [planId, setPlanId] = useState<string | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [planCreationAttempted, setPlanCreationAttempted] = useState(false);

  const summary = getPortfolioSummary(portfolioItems);

  useEffect(() => {
    // Only create plan once to prevent flashing errors
    if (planCreationAttempted) return;
    
    const createPlan = async () => {
      setPlanCreationAttempted(true);
      try {
        const { data: plan, error } = await supabase
          .from('partner_plans' as any)
          .insert({
            intake_id: intakeId,
            top_candidates_json: summary.topRiskCandidates
          } as any)
          .select()
          .single();

        if (error) throw error;
        setPlanId((plan as any).id);
      } catch (error) {
        console.error('Error creating plan:', error);
        // Only show toast once
        toast({
          title: "Plan creation failed",
          description: "Unable to save plan. You can still view and export your results.",
          variant: "destructive"
        });
      }
    };

    createPlan();
  }, [intakeId, summary.topRiskCandidates, toast, planCreationAttempted]);

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Button variant="outline" onClick={onBack} className="rounded-xl">
          ← Back
        </Button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your Capital Risk Map
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
            See which teams will waste money, and what to say to them before they do.
          </p>
          
          {/* Export Actions */}
          {planId && (
            <ExportActions
              planId={planId}
              intakeId={intakeId}
              intakeData={intakeData}
              portfolioItems={portfolioItems}
              summary={summary}
              onShareCreated={(slug) => setShareSlug(slug)}
            />
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 gap-2 h-auto p-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
            <TabsTrigger 
              value="heatmap"
              className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Risk Map</span>
            </TabsTrigger>
            <TabsTrigger 
              value="offerpack"
              className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <FileText className="h-4 w-4" />
              <span>The Brief</span>
            </TabsTrigger>
            <TabsTrigger 
              value="plan"
              className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Target className="h-4 w-4" />
              <span>Your Plan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap">
            <Card className="shadow-sm border rounded-xl">
              <CardContent className="p-6 sm:p-8">
                <HeatmapVisualization portfolioItems={portfolioItems} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offerpack">
            <OfferPackPreview 
              intakeData={intakeData}
              portfolioItems={portfolioItems}
              artifacts={{ summary }}
            />
          </TabsContent>

          <TabsContent value="plan">
            <CoDeliveryPlan 
              topCandidates={summary.topRiskCandidates}
              artifacts={{ summary }}
            />
          </TabsContent>
        </Tabs>

        {/* Share Link Display */}
        {shareSlug && (
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="shadow-sm border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 text-center space-y-3">
                <p className="text-sm font-medium text-foreground">Share Link Created!</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/partners/plan/${shareSlug}`}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/partners/plan/${shareSlug}`);
                      toast({ title: 'Copied!', description: 'Share link copied to clipboard' });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next Steps CTA */}
        <div className="max-w-3xl mx-auto mt-12">
          <Card className="shadow-lg border-2 border-primary/20 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/5">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Want Help With This?</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Let's talk about which teams to focus on first, and what to say to them.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  variant="default"
                  className="rounded-xl"
                  onClick={() => window.open('https://calendly.com/mindmaker/partner-discussion', '_blank')}
                >
                  <Target className="mr-2 h-5 w-5" />
                  Book a Call
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => window.location.href = 'mailto:partners@mindmaker.ai?subject=Partnership Opportunity&body=Hi, I just completed the portfolio assessment and would like to discuss next steps.'}
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send an Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
