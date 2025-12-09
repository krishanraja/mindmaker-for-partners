import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';
import { PartnerIntakeData } from './PartnerIntakeForm';
import { 
  calculateCognitiveRiskScore, 
  calculateCapitalAtRisk,
  calculateCognitiveReadiness,
  getRecommendation, 
  getRiskFlags, 
  ScoredPortfolioItem,
  PortfolioItem 
} from '@/utils/partnerScoring';
import { insertPortfolioItems } from '@/services/partnerService';
import { useToast } from '@/hooks/use-toast';
import { HeatmapVisualization } from './HeatmapVisualization';
import { PortfolioScoringRow } from './PortfolioScoringRow';
import { logger } from '@/lib/logger';

interface PortfolioScoringTableProps {
  intakeData: PartnerIntakeData;
  intakeId: string;
  onComplete: (items: ScoredPortfolioItem[]) => void;
  onBack: () => void;
}

interface PortfolioItemInput {
  name: string;
  sector: string;
  hype_vs_discipline: string;
  mental_scaffolding: string;
  decision_quality: string;
  vendor_resistance: string;
  pressure_intensity: string;
  sponsor_thinking: string;
  upgrade_willingness: string;
}

export const PortfolioScoringTable: React.FC<PortfolioScoringTableProps> = ({
  intakeData,
  intakeId,
  onComplete,
  onBack
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parse company names - limit to pipeline_count (ensure it's a number)
  const pipelineLimit = typeof intakeData.pipeline_count === 'string' 
    ? parseInt(intakeData.pipeline_count, 10) 
    : intakeData.pipeline_count;
  
  const companyNames = intakeData.pipeline_names
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0)
    .slice(0, pipelineLimit);

  // Initialize portfolio items with new cognitive fields
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemInput[]>(
    companyNames.map(name => ({
      name,
      sector: '',
      hype_vs_discipline: '',
      mental_scaffolding: '',
      decision_quality: '',
      vendor_resistance: '',
      pressure_intensity: '',
      sponsor_thinking: '',
      upgrade_willingness: ''
    }))
  );

  // Calculate progress (percentage of filled fields)
  const totalFields = portfolioItems.length * 8; // 8 scoring fields per company
  const filledFields = portfolioItems.reduce((count, item) => {
    return count + [
      item.sector, item.hype_vs_discipline, item.mental_scaffolding, item.decision_quality,
      item.vendor_resistance, item.pressure_intensity, item.sponsor_thinking, item.upgrade_willingness
    ].filter(val => val !== '').length;
  }, 0);
  const progress = Math.round((filledFields / totalFields) * 100);

  // Live scoring
  const [scoredItems, setScoredItems] = useState<ScoredPortfolioItem[]>([]);

  useEffect(() => {
    const scored = portfolioItems
      .filter(item => 
        item.hype_vs_discipline && item.mental_scaffolding && item.decision_quality && 
        item.vendor_resistance && item.pressure_intensity && item.sponsor_thinking && 
        item.upgrade_willingness
      )
      .map(item => {
        const portfolioItem: PortfolioItem = {
          ...item,
          stage: '' // Not used in new model
        };
        const cognitive_risk_score = calculateCognitiveRiskScore(portfolioItem);
        const capital_at_risk = calculateCapitalAtRisk(portfolioItem);
        const cognitive_readiness = calculateCognitiveReadiness(portfolioItem);
        const recommendation = getRecommendation(portfolioItem, cognitive_risk_score, capital_at_risk);
        const risk_flags = getRiskFlags(portfolioItem);
        
        return { 
          ...portfolioItem, 
          cognitive_risk_score,
          capital_at_risk,
          cognitive_readiness,
          recommendation, 
          risk_flags,
          fit_score: 100 - cognitive_risk_score // Legacy compatibility
        };
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
      !item.sector || !item.hype_vs_discipline || !item.mental_scaffolding || 
      !item.decision_quality || !item.vendor_resistance || !item.pressure_intensity || 
      !item.sponsor_thinking || !item.upgrade_willingness
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

    // Calculate scores for all items
    const fullyScored: ScoredPortfolioItem[] = portfolioItems.map(item => {
      const portfolioItem: PortfolioItem = {
        ...item,
        stage: '' // Not used in new model
      };
      const cognitive_risk_score = calculateCognitiveRiskScore(portfolioItem);
      const capital_at_risk = calculateCapitalAtRisk(portfolioItem);
      const cognitive_readiness = calculateCognitiveReadiness(portfolioItem);
      const recommendation = getRecommendation(portfolioItem, cognitive_risk_score, capital_at_risk);
      const risk_flags = getRiskFlags(portfolioItem);
      
      return { 
        ...portfolioItem, 
        cognitive_risk_score,
        capital_at_risk,
        cognitive_readiness,
        recommendation, 
        risk_flags,
        fit_score: 100 - cognitive_risk_score
      };
    });

    // Save to database using service layer
    const result = await insertPortfolioItems(intakeId, fullyScored);

    if (!result.success) {
      logger.logError('Failed to save portfolio items', result.error, {
        intakeId,
        itemCount: fullyScored.length
      });
      
      toast({
        title: 'Error',
        description: result.error?.message || 'Failed to save portfolio data. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    logger.info('Portfolio items saved successfully', {
      intakeId,
      itemCount: fullyScored.length
    });
    
    onComplete(fullyScored);
    setIsSubmitting(false);
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
            Step 2: Cognitive Risk Assessment
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-4">
            Assess each leadership team's cognitive readiness. Your risk heatmap updates live as you score.
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
              <PortfolioScoringRow
                key={index}
                item={item}
                index={index}
                onChange={updateItem}
              />
            ))}
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-sm border rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Live Risk Heatmap</h3>
                  {scoredItems.length > 0 ? (
                    <HeatmapVisualization portfolioItems={scoredItems} compact />
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Complete assessment to see risk preview
                    </div>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p><strong>{scoredItems.length}</strong> of {portfolioItems.length} companies assessed</p>
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
            {isSubmitting ? 'Generating Cognitive Diagnostic...' : 'Generate Cognitive Diagnostic'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
