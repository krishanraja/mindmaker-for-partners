import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import {
  SECTOR_OPTIONS,
  STAGE_OPTIONS,
  AI_POSTURE_OPTIONS,
  DATA_POSTURE_OPTIONS,
  VALUE_PRESSURE_OPTIONS,
  DECISION_CADENCE_OPTIONS,
  SPONSOR_STRENGTH_OPTIONS,
  WILLINGNESS_OPTIONS
} from '@/constants/partnerConstants';

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

interface PortfolioScoringRowProps {
  item: PortfolioItemInput;
  index: number;
  onChange: (index: number, field: keyof PortfolioItemInput, value: string) => void;
}

const tooltips = {
  sector: "The primary industry vertical this company operates in",
  stage: "The company's current maturity level and growth stage",
  ai_posture: "Leadership understanding and decision-making clarity around AI, not deployment status",
  data_posture: "Leadership clarity on data decisions and governance, not technical stack quality",
  value_pressure: "Urgency to demonstrate measurable ROI and business value from initiatives",
  decision_cadence: "Typical speed of decision-making and ability to move projects forward",
  sponsor_strength: "Does the sponsor have mental scaffolding to make clean AI decisions, or just pressure to 'do something'?",
  willingness_60d: "Team's openness to upgrade thinking before spending, not just 'yes' to any AI initiative"
};

export const PortfolioScoringRow: React.FC<PortfolioScoringRowProps> = ({ item, index, onChange }) => {
  return (
    <TooltipProvider>
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-bold text-foreground mb-4">{item.name}</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Sector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Sector</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{tooltips.sector}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            <select
              value={item.sector}
              onChange={(e) => onChange(index, 'sector', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {SECTOR_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Stage</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.stage}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <select
              value={item.stage}
              onChange={(e) => onChange(index, 'stage', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {STAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* AI Posture */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">AI Posture</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.ai_posture}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <select
              value={item.ai_posture}
              onChange={(e) => onChange(index, 'ai_posture', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {AI_POSTURE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Data Posture */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Data Posture</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.data_posture}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <select
              value={item.data_posture}
              onChange={(e) => onChange(index, 'data_posture', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {DATA_POSTURE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Value Pressure */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Value Pressure</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.value_pressure}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <select
              value={item.value_pressure}
              onChange={(e) => onChange(index, 'value_pressure', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {VALUE_PRESSURE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Decision Cadence */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Decision Cadence</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.decision_cadence}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <select
              value={item.decision_cadence}
              onChange={(e) => onChange(index, 'decision_cadence', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {DECISION_CADENCE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Sponsor Strength */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Sponsor Strength</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.sponsor_strength}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <select
              value={item.sponsor_strength}
              onChange={(e) => onChange(index, 'sponsor_strength', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {SPONSOR_STRENGTH_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Willingness 60d */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Willingness (60d)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.willingness_60d}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <select
              value={item.willingness_60d}
              onChange={(e) => onChange(index, 'willingness_60d', e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {WILLINGNESS_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};
