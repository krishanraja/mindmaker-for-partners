import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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

export const PortfolioScoringRow: React.FC<PortfolioScoringRowProps> = ({ item, index, onChange }) => {
  return (
    <Card className="shadow-sm border rounded-xl">
      <CardContent className="p-4 sm:p-6">
        <h3 className="font-bold text-foreground mb-4">{item.name}</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Sector */}
          <div className="space-y-2">
            <Label className="text-sm">Sector</Label>
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
            <Label className="text-sm">Stage</Label>
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
            <Label className="text-sm">AI Posture</Label>
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
            <Label className="text-sm">Data Posture</Label>
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
            <Label className="text-sm">Value Pressure</Label>
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
            <Label className="text-sm">Decision Cadence</Label>
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
            <Label className="text-sm">Sponsor Strength</Label>
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
            <Label className="text-sm">Willingness (60d)</Label>
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
  );
};
