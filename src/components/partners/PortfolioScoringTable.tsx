import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';
import { PartnerIntakeData } from './PartnerIntakeForm';
import { calculateFitScore, getRecommendation, getRiskFlags, ScoredPortfolioItem } from '@/utils/partnerScoring';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HeatmapVisualization } from './HeatmapVisualization';

interface PortfolioScoringTableProps {
  intakeData: PartnerIntakeData;
  intakeId: string;
  onComplete: (items: ScoredPortfolioItem[]) => void;
  onBack: () => void;
}

interface PortfolioItemInput {
  name: string;
  sector: string;
  stage: string;
  ai_posture: string;
  data_posture: string;
  value_pressure: string;
  decision_cadence: string;
  sponsor_strength: string;
  willingness_60d: string;
}

export const PortfolioScoringTable: React.FC<PortfolioScoringTableProps> = ({
  intakeData,
  intakeId,
  onComplete,
  onBack
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parse company names
  const companyNames = intakeData.pipeline_names
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0)
    .slice(0, 10);

  // Initialize portfolio items
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemInput[]>(
    companyNames.map(name => ({
      name,
      sector: '',
      stage: '',
      ai_posture: '',
      data_posture: '',
      value_pressure: '',
      decision_cadence: '',
      sponsor_strength: '',
      willingness_60d: ''
    }))
  );

  // Calculate progress (percentage of filled fields)
  const totalFields = portfolioItems.length * 8; // 8 scoring fields per company
  const filledFields = portfolioItems.reduce((count, item) => {
    return count + [
      item.sector, item.stage, item.ai_posture, item.data_posture,
      item.value_pressure, item.decision_cadence, item.sponsor_strength, item.willingness_60d
    ].filter(val => val !== '').length;
  }, 0);
  const progress = Math.round((filledFields / totalFields) * 100);

  // Live scoring
  const [scoredItems, setScoredItems] = useState<ScoredPortfolioItem[]>([]);

  useEffect(() => {
    const scored = portfolioItems
      .filter(item => item.ai_posture && item.data_posture && item.value_pressure && 
                      item.decision_cadence && item.sponsor_strength && item.willingness_60d)
      .map(item => {
        const fit_score = calculateFitScore(item);
        const recommendation = getRecommendation(item, fit_score);
        const risk_flags = getRiskFlags(item);
        return { ...item, fit_score, recommendation, risk_flags };
      });
    setScoredItems(scored);
  }, [portfolioItems]);

  const updateItem = (index: number, field: keyof PortfolioItemInput, value: string) => {
    setPortfolioItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    // Validate all items are complete
    const incomplete = portfolioItems.some(item => 
      !item.sector || !item.stage || !item.ai_posture || !item.data_posture ||
      !item.value_pressure || !item.decision_cadence || !item.sponsor_strength || !item.willingness_60d
    );

    if (incomplete) {
      toast({
        title: 'Incomplete Data',
        description: 'Please fill in all fields for all companies',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate scores for all items
      const fullyScored = portfolioItems.map(item => {
        const fit_score = calculateFitScore(item);
        const recommendation = getRecommendation(item, fit_score);
        const risk_flags = getRiskFlags(item);
        return { ...item, fit_score, recommendation, risk_flags };
      });

      // Save to database
      const itemsToInsert = fullyScored.map(item => ({
        intake_id: intakeId,
        name: item.name,
        sector: item.sector,
        stage: item.stage,
        ai_posture: item.ai_posture,
        data_posture: item.data_posture,
        value_pressure: item.value_pressure,
        decision_cadence: item.decision_cadence,
        sponsor_strength: item.sponsor_strength,
        willingness_60d: item.willingness_60d,
        fit_score: item.fit_score,
        recommendation: item.recommendation,
        risk_flags_json: item.risk_flags
      }));

      const { error } = await supabase
        .from('partner_portfolio_items' as any)
        .insert(itemsToInsert);

      if (error) throw error;

      onComplete(fullyScored);
    } catch (error) {
      console.error('Error saving portfolio items:', error);
      toast({
        title: 'Error',
        description: 'Failed to save portfolio data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Button variant="outline" onClick={onBack} className="rounded-xl">
          ← Back
        </Button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 pt-12 sm:pt-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Step 2: Portfolio Scoring
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-4">
            Score each company across key dimensions. Your heatmap updates live as you go.
          </p>
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Scoring Table */}
          <div className="lg:col-span-2 space-y-4">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="shadow-sm border rounded-xl">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-foreground mb-4">{item.name}</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Sector */}
                    <div className="space-y-2">
                      <Label className="text-sm">Sector</Label>
                      <select
                        value={item.sector}
                        onChange={(e) => updateItem(index, 'sector', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Stage */}
                    <div className="space-y-2">
                      <Label className="text-sm">Stage</Label>
                      <select
                        value={item.stage}
                        onChange={(e) => updateItem(index, 'stage', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Seed">Seed</option>
                        <option value="Growth">Growth</option>
                        <option value="Mature">Mature</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>

                    {/* AI Posture */}
                    <div className="space-y-2">
                      <Label className="text-sm">AI Posture</Label>
                      <select
                        value={item.ai_posture}
                        onChange={(e) => updateItem(index, 'ai_posture', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="None">None</option>
                        <option value="Exploring">Exploring</option>
                        <option value="Active">Active</option>
                        <option value="Leading">Leading</option>
                      </select>
                    </div>

                    {/* Data Posture */}
                    <div className="space-y-2">
                      <Label className="text-sm">Data Posture</Label>
                      <select
                        value={item.data_posture}
                        onChange={(e) => updateItem(index, 'data_posture', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Disconnected">Disconnected</option>
                        <option value="Scattered">Scattered</option>
                        <option value="Connected">Connected</option>
                        <option value="Optimized">Optimized</option>
                      </select>
                    </div>

                    {/* Value Pressure */}
                    <div className="space-y-2">
                      <Label className="text-sm">Value Pressure</Label>
                      <select
                        value={item.value_pressure}
                        onChange={(e) => updateItem(index, 'value_pressure', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    {/* Decision Cadence */}
                    <div className="space-y-2">
                      <Label className="text-sm">Decision Cadence</Label>
                      <select
                        value={item.decision_cadence}
                        onChange={(e) => updateItem(index, 'decision_cadence', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Slow">Slow</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Fast">Fast</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>

                    {/* Sponsor Strength */}
                    <div className="space-y-2">
                      <Label className="text-sm">Sponsor Strength</Label>
                      <select
                        value={item.sponsor_strength}
                        onChange={(e) => updateItem(index, 'sponsor_strength', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="None">None</option>
                        <option value="Weak">Weak</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Strong">Strong</option>
                      </select>
                    </div>

                    {/* Willingness 60d */}
                    <div className="space-y-2">
                      <Label className="text-sm">Willingness (60d)</Label>
                      <select
                        value={item.willingness_60d}
                        onChange={(e) => updateItem(index, 'willingness_60d', e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-sm border rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Live Heatmap</h3>
                  {scoredItems.length > 0 ? (
                    <HeatmapVisualization portfolioItems={scoredItems} compact />
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Complete scoring fields to see preview
                    </div>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p><strong>{scoredItems.length}</strong> of {portfolioItems.length} companies scored</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <Button
            variant="cta"
            className="w-full rounded-xl"
            onClick={handleSubmit}
            disabled={isSubmitting || progress < 100}
          >
            {isSubmitting ? 'Generating Plan...' : 'Generate Partner Plan'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
