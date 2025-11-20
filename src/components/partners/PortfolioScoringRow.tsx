import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import {
  HYPE_VS_DISCIPLINE_OPTIONS,
  MENTAL_SCAFFOLDING_OPTIONS,
  DECISION_QUALITY_OPTIONS,
  VENDOR_RESISTANCE_OPTIONS,
  PRESSURE_INTENSITY_OPTIONS,
  SPONSOR_THINKING_OPTIONS,
  UPGRADE_WILLINGNESS_OPTIONS,
  SECTOR_OPTIONS
} from '@/constants/partnerConstants';

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

interface PortfolioScoringRowProps {
  item: PortfolioItemInput;
  index: number;
  onChange: (index: number, field: keyof PortfolioItemInput, value: string) => void;
}

const tooltips = {
  hype_vs_discipline: "Does leadership chase AI hype or have disciplined thinking frameworks? Hype = high waste risk.",
  mental_scaffolding: "What mental models exist for judging AI decisions? None = flying blind, high waste risk.",
  decision_quality: "How rigorous is their decision-making process? Poor rigor = high waste risk.",
  vendor_resistance: "How skeptical are they of vendor promises? Low skepticism = easy target for waste.",
  pressure_intensity: "How urgent is their pressure to deploy AI? Panic mode = bad decisions, high waste.",
  sponsor_thinking: "How sophisticated is the executive sponsor's thinking? Weak thinking = high waste risk.",
  upgrade_willingness: "Are they open to upgrading their thinking frameworks? Resistant = poor intervention fit."
};

export const PortfolioScoringRow: React.FC<PortfolioScoringRowProps> = ({ item, index, onChange }) => {
  return (
    <Card className="shadow-sm border rounded-xl">
      <CardContent className="p-4 space-y-4">
        <div className="pb-2 border-b">
          <h3 className="font-bold text-foreground">{item.name}</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Sector */}
          <div className="space-y-2">
            <Label htmlFor={`sector-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              Sector
            </Label>
            <select
              id={`sector-${index}`}
              value={item.sector}
              onChange={(e) => onChange(index, 'sector', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {SECTOR_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Hype vs Discipline */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor={`hype-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-help">
                    Hype vs Discipline
                    <HelpCircle className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.hype_vs_discipline}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <select
              id={`hype-${index}`}
              value={item.hype_vs_discipline}
              onChange={(e) => onChange(index, 'hype_vs_discipline', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {HYPE_VS_DISCIPLINE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Mental Scaffolding */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor={`scaffolding-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-help">
                    Mental Scaffolding
                    <HelpCircle className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.mental_scaffolding}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <select
              id={`scaffolding-${index}`}
              value={item.mental_scaffolding}
              onChange={(e) => onChange(index, 'mental_scaffolding', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {MENTAL_SCAFFOLDING_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Decision Quality */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor={`quality-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-help">
                    Decision Quality
                    <HelpCircle className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.decision_quality}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <select
              id={`quality-${index}`}
              value={item.decision_quality}
              onChange={(e) => onChange(index, 'decision_quality', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {DECISION_QUALITY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Vendor Resistance */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor={`resistance-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-help">
                    Vendor Resistance
                    <HelpCircle className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.vendor_resistance}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <select
              id={`resistance-${index}`}
              value={item.vendor_resistance}
              onChange={(e) => onChange(index, 'vendor_resistance', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {VENDOR_RESISTANCE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Pressure Intensity */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor={`pressure-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-help">
                    Pressure Intensity
                    <HelpCircle className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.pressure_intensity}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <select
              id={`pressure-${index}`}
              value={item.pressure_intensity}
              onChange={(e) => onChange(index, 'pressure_intensity', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {PRESSURE_INTENSITY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Sponsor Thinking Quality */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor={`sponsor-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-help">
                    Sponsor Thinking Quality
                    <HelpCircle className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.sponsor_thinking}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <select
              id={`sponsor-${index}`}
              value={item.sponsor_thinking}
              onChange={(e) => onChange(index, 'sponsor_thinking', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {SPONSOR_THINKING_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Upgrade Willingness */}
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor={`willingness-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-help">
                    Willingness to Upgrade Thinking
                    <HelpCircle className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltips.upgrade_willingness}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <select
              id={`willingness-${index}`}
              value={item.upgrade_willingness}
              onChange={(e) => onChange(index, 'upgrade_willingness', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-background"
            >
              <option value="">Select...</option>
              {UPGRADE_WILLINGNESS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
