import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building, ArrowRight, Target } from 'lucide-react';
import { estimateSprintCandidates } from '@/utils/intakeEstimator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OBJECTIVE_OPTIONS, URGENCY_WINDOWS } from '@/constants/partnerConstants';

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

    try {
      const { data: intake, error } = await supabase
        .from('partner_intakes' as any)
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
        } as any)
        .select()
        .single();

      if (error) {
        // Check if this is a "table doesn't exist" error
        const errorMsg = error.message || '';
        const is404 = errorMsg.includes('relation') || errorMsg.includes('does not exist') || error.code === '42P01';
        
        console.error('Database error:', {
          message: errorMsg,
          code: error.code,
          hint: error.hint,
          details: error.details
        });
        
        if (is404) {
          toast({
            title: 'Database Setup Required',
            description: 'Tables need to be created. Check the console for SQL script.',
            variant: 'destructive',
            duration: 10000
          });
          
          console.error(`
╔══════════════════════════════════════════════════════════════╗
║  DATABASE TABLES MISSING - SETUP REQUIRED                   ║
╚══════════════════════════════════════════════════════════════╝

The 'partner_intakes' table doesn't exist in your Supabase database.

📋 SETUP INSTRUCTIONS:

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/bkyuxvschuwngtcdhsyg/sql
2. Copy and paste the SQL below into the SQL Editor
3. Click "Run" to execute
4. Try submitting the form again

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Partner Assessment Database Tables
CREATE TABLE partner_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  firm_name TEXT NOT NULL,
  pipeline_count INTEGER NOT NULL CHECK (pipeline_count >= 1 AND pipeline_count <= 10),
  pipeline_names TEXT NOT NULL,
  objectives_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  urgency_window TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  partner_type TEXT,
  role TEXT,
  region TEXT,
  sectors_json JSONB DEFAULT '[]'::jsonb,
  engagement_model TEXT,
  resources_enablement_bandwidth TEXT
);

CREATE TABLE partner_portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  intake_id UUID NOT NULL REFERENCES partner_intakes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sector TEXT,
  stage TEXT,
  hype_vs_discipline TEXT,
  mental_scaffolding TEXT,
  decision_quality TEXT,
  vendor_resistance TEXT,
  pressure_intensity TEXT,
  sponsor_thinking TEXT,
  upgrade_willingness TEXT,
  cognitive_risk_score INTEGER,
  capital_at_risk INTEGER,
  cognitive_readiness INTEGER,
  fit_score INTEGER,
  recommendation TEXT,
  risk_flags_json JSONB DEFAULT '[]'::jsonb,
  ai_posture TEXT,
  data_posture TEXT,
  value_pressure TEXT,
  decision_cadence TEXT,
  sponsor_strength TEXT,
  willingness_60d TEXT
);

CREATE TABLE partner_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  intake_id UUID NOT NULL REFERENCES partner_intakes(id) ON DELETE CASCADE,
  share_slug TEXT UNIQUE NOT NULL,
  firm_name TEXT NOT NULL,
  objectives_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  urgency_window TEXT NOT NULL,
  pipeline_count INTEGER NOT NULL,
  total_companies INTEGER NOT NULL DEFAULT 0,
  exec_bootcamp_count INTEGER NOT NULL DEFAULT 0,
  literacy_sprint_count INTEGER NOT NULL DEFAULT 0,
  diagnostic_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_portfolio_items_intake ON partner_portfolio_items(intake_id);
CREATE INDEX idx_plans_slug ON partner_plans(share_slug);
CREATE INDEX idx_plans_intake ON partner_plans(intake_id);

ALTER TABLE partner_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_intakes" ON partner_intakes FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_intakes" ON partner_intakes FOR SELECT USING (true);
CREATE POLICY "public_insert_portfolio" ON partner_portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_portfolio" ON partner_portfolio_items FOR SELECT USING (true);
CREATE POLICY "public_insert_plans" ON partner_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_plans" ON partner_plans FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_intakes_timestamp BEFORE UPDATE ON partner_intakes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_portfolio_timestamp BEFORE UPDATE ON partner_portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_plans_timestamp BEFORE UPDATE ON partner_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          `);
          
          throw new Error('Database tables not found. See console for setup instructions.');
        }
        
        throw error;
      }

      onSubmit(intakeData, (intake as any).id);
    } catch (error) {
      console.error('Error saving intake:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save. Please try again.',
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
