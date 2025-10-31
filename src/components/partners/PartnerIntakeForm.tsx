import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Building, ArrowRight, Target, Users } from 'lucide-react';
import { estimateSprintCandidates } from '@/utils/intakeEstimator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const OBJECTIVE_OPTIONS = [
  'Enable portfolio AI adoption',
  'Generate co-delivery pipeline',
  'Qualify exec bootcamp leads',
  'Build partner credibility',
  'Identify quick wins',
  'Risk mitigation'
];

const SECTOR_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Professional Services',
  'Other'
];

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
    
    if (!intakeData.partner_type) newErrors.partner_type = 'Partner type is required';
    if (!intakeData.firm_name.trim()) newErrors.firm_name = 'Firm name is required';
    if (!intakeData.role.trim()) newErrors.role = 'Role is required';
    if (intakeData.objectives.length === 0) newErrors.objectives = 'Select at least one objective';
    if (!intakeData.engagement_model) newErrors.engagement_model = 'Engagement model is required';
    if (intakeData.pipeline_count < 1 || intakeData.pipeline_count > 10) {
      newErrors.pipeline_count = 'Pipeline count must be between 1 and 10';
    }
    if (!intakeData.pipeline_names.trim()) newErrors.pipeline_names = 'Pipeline names are required';
    if (!intakeData.urgency_window) newErrors.urgency_window = 'Urgency window is required';
    if (!intakeData.resources_enablement_bandwidth) newErrors.resources_enablement_bandwidth = 'Enablement bandwidth is required';
    if (!intakeData.consent) newErrors.consent = 'Consent is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save intake data to Supabase
      const { data: intake, error } = await supabase
        .from('partner_intakes')
        .insert({
          partner_type: intakeData.partner_type,
          firm_name: intakeData.firm_name,
          role: intakeData.role,
          region: intakeData.region,
          sectors_json: intakeData.sectors,
          objectives_json: intakeData.objectives,
          engagement_model: intakeData.engagement_model,
          pipeline_count: intakeData.pipeline_count,
          pipeline_names: intakeData.pipeline_names,
          urgency_window: intakeData.urgency_window,
          resources_enablement_bandwidth: intakeData.resources_enablement_bandwidth,
          consent: intakeData.consent
        })
        .select()
        .single();

      if (error) throw error;

      onSubmit(intakeData, intake.id);
    } catch (error) {
      console.error('Error saving intake:', error);
      toast({
        title: 'Error',
        description: 'Failed to save intake data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = <K extends keyof PartnerIntakeData>(field: K, value: PartnerIntakeData[K]) => {
    setIntakeData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleArrayItem = (field: 'objectives' | 'sectors', value: string) => {
    const current = intakeData[field];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    handleInputChange(field, updated);
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
            Step 1: Partner Context
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Tell us about your firm and portfolio so we can tailor the assessment and recommendations.
          </p>
          
          {estimatedCandidates > 0 && (
            <div className="mt-4 flex justify-center">
              <Badge variant="secondary" className="text-base px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                Estimated Sprint candidates: {estimatedCandidates}
              </Badge>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border rounded-xl">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Partner Type */}
                <div className="space-y-2">
                  <Label htmlFor="partner_type" className="text-foreground font-medium text-sm">
                    <Users className="h-4 w-4 inline mr-2" />
                    Partner Type <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="partner_type"
                    value={intakeData.partner_type}
                    onChange={(e) => handleInputChange('partner_type', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select type</option>
                    <option value="Consulting Firm">Consulting Firm</option>
                    <option value="System Integrator">System Integrator</option>
                    <option value="Technology Vendor">Technology Vendor</option>
                    <option value="VC/PE Firm">VC/PE Firm</option>
                    <option value="Accelerator/Incubator">Accelerator/Incubator</option>
                    <option value="Advisory Network">Advisory Network</option>
                  </select>
                  {errors.partner_type && <p className="text-destructive text-sm">{errors.partner_type}</p>}
                </div>

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

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground font-medium text-sm">
                    <User className="h-4 w-4 inline mr-2" />
                    Your Role <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="role"
                    value={intakeData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="rounded-xl"
                    placeholder="e.g., Partner, BD Director"
                  />
                  {errors.role && <p className="text-destructive text-sm">{errors.role}</p>}
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-foreground font-medium text-sm">
                    Primary Region
                  </Label>
                  <Input
                    id="region"
                    value={intakeData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="rounded-xl"
                    placeholder="e.g., North America, EMEA"
                  />
                </div>

                {/* Sectors */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">
                    Key Sectors (select all that apply)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {SECTOR_OPTIONS.map(sector => (
                      <Badge
                        key={sector}
                        variant={intakeData.sectors.includes(sector) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem('sectors', sector)}
                      >
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Objectives */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">
                    Primary Objectives <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {OBJECTIVE_OPTIONS.map(objective => (
                      <Badge
                        key={objective}
                        variant={intakeData.objectives.includes(objective) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem('objectives', objective)}
                      >
                        {objective}
                      </Badge>
                    ))}
                  </div>
                  {errors.objectives && <p className="text-destructive text-sm">{errors.objectives}</p>}
                </div>

                {/* Engagement Model */}
                <div className="space-y-2">
                  <Label htmlFor="engagement_model" className="text-foreground font-medium text-sm">
                    Engagement Model <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="engagement_model"
                    value={intakeData.engagement_model}
                    onChange={(e) => handleInputChange('engagement_model', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select model</option>
                    <option value="Referral">Referral</option>
                    <option value="Co-delivery">Co-delivery</option>
                    <option value="White-label">White-label</option>
                    <option value="Channel">Channel</option>
                  </select>
                  {errors.engagement_model && <p className="text-destructive text-sm">{errors.engagement_model}</p>}
                </div>

                {/* Pipeline Count */}
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

                {/* Pipeline Names */}
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

                {/* Urgency Window */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">
                    Urgency Window <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-2">
                    {['0-30 days', '31-60 days', '61-90 days', '90+ days'].map(window => (
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

                {/* Enablement Bandwidth */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">
                    Enablement Bandwidth <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-2">
                    {['Low', 'Medium', 'High'].map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="bandwidth"
                          value={level}
                          checked={intakeData.resources_enablement_bandwidth === level}
                          onChange={(e) => handleInputChange('resources_enablement_bandwidth', e.target.value)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                  {errors.resources_enablement_bandwidth && <p className="text-destructive text-sm">{errors.resources_enablement_bandwidth}</p>}
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
                      I consent to receiving portfolio insights and co-delivery recommendations from MindMaker.
                    </Label>
                  </div>
                  {errors.consent && <p className="text-destructive text-sm ml-7">{errors.consent}</p>}
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  className="w-full rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Continue to Portfolio Scoring'}
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
