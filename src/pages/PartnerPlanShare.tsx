import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import mindmakerLogo from '@/assets/mindmaker-logo.png';
import { HeatmapVisualization } from '@/components/partners/HeatmapVisualization';
import { OfferPackPreview } from '@/components/partners/OfferPackPreview';
import { CoDeliveryPlan } from '@/components/partners/CoDeliveryPlan';

const PartnerPlanShare = () => {
  const { shareSlug } = useParams<{ shareSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanData = async () => {
      if (!shareSlug) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const { data: plan, error: planError } = await supabase
          .from('partner_plans')
          .select(`
            *,
            partner_intakes (*)
          `)
          .eq('share_slug', shareSlug)
          .single();

        if (planError || !plan) {
          setError('Plan not found');
          setLoading(false);
          return;
        }

        // Fetch portfolio items
        const { data: portfolioItems, error: itemsError } = await supabase
          .from('partner_portfolio_items')
          .select('*')
          .eq('intake_id', plan.intake_id);

        if (itemsError) {
          setError('Error loading portfolio data');
          setLoading(false);
          return;
        }

        setPlanData({
          ...plan,
          portfolioItems: portfolioItems || []
        });
        setLoading(false);
      } catch (err) {
        setError('Error loading plan');
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [shareSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading plan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !planData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Plan Not Found</h2>
            <p className="text-muted-foreground">{error || 'The plan you\'re looking for doesn\'t exist.'}</p>
            <Button variant="cta" className="rounded-xl" onClick={() => window.location.href = '/partners'}>
              Create Your Own Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const artifacts = planData.artifacts_json || {};
  const intake = planData.partner_intakes;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <img src={mindmakerLogo} alt="MindMaker" className="w-32 h-auto" />
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Shared Plan</p>
              <p className="text-xs text-muted-foreground">{intake?.firm_name || 'Partner'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Portfolio Readiness & Co-Delivery Plan
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {intake?.partner_type} partner analysis • {planData.portfolioItems?.length || 0} companies assessed
            </p>
          </div>

          {/* Portfolio Heatmap */}
          <Card className="shadow-sm border rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Portfolio Heatmap</h2>
              <HeatmapVisualization portfolioItems={planData.portfolioItems || []} />
            </CardContent>
          </Card>

          {/* Offer Pack */}
          <Card className="shadow-sm border rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Partner Offer Pack</h2>
              <OfferPackPreview 
                intakeData={intake}
                portfolioItems={planData.portfolioItems || []}
                artifacts={artifacts}
              />
            </CardContent>
          </Card>

          {/* Co-Delivery Plan */}
          <Card className="shadow-sm border rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Co-Delivery Plan</h2>
              <CoDeliveryPlan 
                topCandidates={planData.top_candidates_json || []}
                artifacts={artifacts}
              />
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <Card className="shadow-sm border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-xl font-bold text-foreground">Ready to build your own plan?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Create a customized portfolio readiness assessment for your partner ecosystem in under 15 minutes.
              </p>
              <Button 
                variant="cta" 
                className="rounded-xl"
                onClick={() => window.location.href = '/partners'}
              >
                Create Your Plan
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-12 py-8 bg-white/50 dark:bg-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold">MindMaker</span> • Building AI confidence where it compounds
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Contact: <a href="https://calendly.com/krish-raja/mindmaker-meeting" className="underline" target="_blank" rel="noopener noreferrer">Book a session</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerPlanShare;
