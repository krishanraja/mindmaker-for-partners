import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building, ArrowRight, Target } from 'lucide-react';
import { estimateSprintCandidates } from '@/utils/intakeEstimator';
import { insertPartnerIntake } from '@/services/partnerService';
import { useToast } from '@/hooks/use-toast';
import { OBJECTIVE_OPTIONS, URGENCY_WINDOWS } from '@/constants/partnerConstants';
import { logger } from '@/lib/logger';

export interface PartnerIntakeData {
  partner_type: string;
  firm_name: string;
  role: string;
  region: string;
  sectors: string[];
  objectives: string[];
  engagement_model: string;
  pipeline_count: number;
  pipeline_names: string;
  urgency_window: string;
  resources_enablement_bandwidth: string;
  consent: boolean;
}

interface PartnerIntakeFormProps {
  onSubmit: (data: PartnerIntakeData, intakeId: string) => void;
  onBack?: () => void;
}

export const PartnerIntakeForm: React.FC<PartnerIntakeFormProps> = ({ onSubmit, onBack }) => {
  const { toast } = useToast();
  const [intakeData, setIntakeData] = useState<PartnerIntakeData>({
    partner_type: '',
    firm_name: '',
    role: '',
    region: '',
    sectors: [],
    objectives: [],
    engagement_model: '',
    pipeline_count: 0,
    pipeline_names: '',
    urgency_window: '',
    resources_enablement_bandwidth: '',
    consent: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerIntakeData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedCandidates = estimateSprintCandidates({
    objectives: intakeData.objectives,
    pipeline_count: intakeData.pipeline_count,
    urgency_window: intakeData.urgency_window
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PartnerIntakeData, string>> = {};
    
    if (!intakeData.firm_name.trim()) newErrors.firm_name = 'Firm name is required';
    if (intakeData.objectives.length === 0) newErrors.objectives = 'Select at least one goal';
    if (intakeData.pipeline_count < 1 || intakeData.pipeline_count > 10) {
      newErrors.pipeline_count = 'Must be between 1 and 10';
    }
    if (!intakeData.pipeline_names.trim()) newErrors.pipeline_names = 'Company names are required';
    if (!intakeData.urgency_window) newErrors.urgency_window = 'Timeline is required';
    if (!intakeData.consent) newErrors.consent = 'Consent is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Please complete all fields',
        description: 'Fill in the required information to continue',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    const result = await insertPartnerIntake(intakeData);
    
    if (!result.success || !result.data) {
      const errorMessage = result.error?.message || 'Failed to save intake';
      
      logger.logError('Partner intake submission failed', result.error, {
        firmName: intakeData.firm_name
      });
      
      // Check if this is a table not found error
      if (errorMessage.includes('Database tables not found')) {
        toast({
          title: 'Database Setup Required',
          description: 'Tables need to be created. Check the console for SQL script.',
          variant: 'destructive',
          duration: 10000
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
      
      setIsSubmitting(false);
      return;
    }

    logger.info('Partner intake submitted successfully', {
      intakeId: result.data.id,
      firmName: intakeData.firm_name
    });
    
    onSubmit(intakeData, result.data.id);
    setIsSubmitting(false);
  };

  const handleInputChange = <K extends keyof PartnerIntakeData>(field: K, value: PartnerIntakeData[K]) => {
    setIntakeData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleObjective = (value: string) => {
    const current = intakeData.objectives;
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    handleInputChange('objectives', updated);
  };

  return (
    <div className="bg-background min-h-screen relative overflow-hidden">
      {onBack && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <Button variant="outline" onClick={onBack} className="rounded-xl">
            ← Back
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8 pt-12 sm:pt-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Quick Portfolio Check
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Tell us about your portfolio - we'll show you who's likely to waste money
          </p>
          
          {estimatedCandidates > 0 && (
            <div className="mt-4 flex justify-center">
              <Badge variant="secondary" className="text-base px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                Teams at risk: ~{estimatedCandidates}
              </Badge>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border rounded-xl">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Firm Name */}
                <div className="space-y-2">
                  <Label htmlFor="firm_name" className="text-foreground font-medium text-sm">
                    <Building className="h-4 w-4 inline mr-2" />
                    Firm Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firm_name"
                    value={intakeData.firm_name}
                    onChange={(e) => handleInputChange('firm_name', e.target.value)}
                    className="rounded-xl"
                    placeholder="Your firm name"
                  />
                  {errors.firm_name && <p className="text-destructive text-sm">{errors.firm_name}</p>}
                </div>

                {/* Number of Companies */}
                <div className="space-y-2">
                  <Label htmlFor="pipeline_count" className="text-foreground font-medium text-sm">
                    Number of Companies to Assess (max 10) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pipeline_count"
                    type="number"
                    min="1"
                    max="10"
                    value={intakeData.pipeline_count || ''}
                    onChange={(e) => handleInputChange('pipeline_count', parseInt(e.target.value) || 0)}
                    className="rounded-xl"
                  />
                  {errors.pipeline_count && <p className="text-destructive text-sm">{errors.pipeline_count}</p>}
                </div>

                {/* Company Names */}
                <div className="space-y-2">
                  <Label htmlFor="pipeline_names" className="text-foreground font-medium text-sm">
                    Company Names <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">Comma-separated (e.g., Acme Corp, TechStart Inc)</p>
                  <Textarea
                    id="pipeline_names"
                    value={intakeData.pipeline_names}
                    onChange={(e) => handleInputChange('pipeline_names', e.target.value)}
                    className="rounded-xl"
                    rows={3}
                    placeholder="Company A, Company B, Company C..."
                  />
                  {errors.pipeline_names && <p className="text-destructive text-sm">{errors.pipeline_names}</p>}
                </div>

                {/* Primary Goal */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">
                    What are you worried about? <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Pick what keeps you up at night</p>
                  <div className="flex flex-wrap gap-2">
                    {OBJECTIVE_OPTIONS.map(objective => (
                      <Badge
                        key={objective}
                        variant={intakeData.objectives.includes(objective) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleObjective(objective)}
                      >
                        {objective}
                      </Badge>
                    ))}
                  </div>
                  {errors.objectives && <p className="text-destructive text-sm">{errors.objectives}</p>}
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">
                    How soon will they spend money? <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-2">
                    {URGENCY_WINDOWS.map(window => (
                      <label key={window} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency_window"
                          value={window}
                          checked={intakeData.urgency_window === window}
                          onChange={(e) => handleInputChange('urgency_window', e.target.value)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{window}</span>
                      </label>
                    ))}
                  </div>
                  {errors.urgency_window && <p className="text-destructive text-sm">{errors.urgency_window}</p>}
                </div>

                {/* Consent */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={intakeData.consent}
                      onChange={(e) => handleInputChange('consent', e.target.checked)}
                      className="mt-1 h-4 w-4 rounded"
                    />
                    <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                      I consent to Mindmaker storing this data for co-delivery coordination <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  {errors.consent && <p className="text-destructive text-sm">{errors.consent}</p>}
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  className="w-full rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Continue to Risk Assessment'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
