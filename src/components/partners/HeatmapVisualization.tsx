import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ScoredPortfolioItem } from '@/utils/partnerScoring';
import { getRecommendationColor } from '@/utils/recommendationHelpers';
import { RECOMMENDATION_TYPES } from '@/constants/partnerConstants';

interface HeatmapVisualizationProps {
  portfolioItems: ScoredPortfolioItem[];
  compact?: boolean;
}

export const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({ 
  portfolioItems,
  compact = false 
}) => {
  // Transform data for scatter plot - NEW: Capital at Risk vs Cognitive Readiness
  const chartData = portfolioItems.map(item => ({
    name: item.name,
    capitalAtRisk: item.capital_at_risk || 50,
    cognitiveReadiness: item.cognitive_readiness || 50,
    recommendation: item.recommendation,
    riskScore: item.cognitive_risk_score || item.fit_score,
    riskFlags: item.risk_flags?.length || 0
  }));


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-bold text-sm">{data.name}</p>
          <p className="text-xs text-muted-foreground">Cognitive Risk: {data.riskScore}/100</p>
          <p className="text-xs text-muted-foreground">Capital at Risk: {data.capitalAtRisk}/100</p>
          <p className="text-xs text-muted-foreground">Readiness: {data.cognitiveReadiness}/100</p>
          <p className="text-xs text-destructive">{data.recommendation}</p>
          {data.riskFlags > 0 && (
            <p className="text-xs text-destructive">⚠️ {data.riskFlags} risk flags</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        No data to display
      </div>
    );
  }

  return (
    <div className={compact ? 'h-64' : 'h-96'}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={compact ? { top: 10, right: 10, bottom: 20, left: 0 } : { top: 20, right: 20, bottom: 40, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            dataKey="capitalAtRisk" 
            name="Capital at Risk" 
            unit=""
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={!compact ? { value: 'Capital at Risk →', position: 'insideBottom', offset: -10, style: { fontSize: 12 } } : undefined}
          />
          <YAxis 
            type="number" 
            dataKey="cognitiveReadiness" 
            name="Cognitive Readiness" 
            unit=""
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={!compact ? { value: '← Cognitive Readiness', angle: -90, position: 'insideLeft', style: { fontSize: 12 } } : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          {!compact && (
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value: string) => {
                switch(value) {
                  case 'Critical - Immediate Intervention': return 'Critical Risk';
                  case 'High Risk - Scaffolding Required': return 'High Risk';
                  case 'Medium Risk - Decision Support': return 'Medium Risk';
                  case 'Low Risk - Monitor': return 'Low Risk';
                  default: return value;
                }
              }}
            />
          )}
          
          {/* Group by risk level */}
          {[
            RECOMMENDATION_TYPES.CRITICAL_RISK,
            RECOMMENDATION_TYPES.HIGH_RISK,
            RECOMMENDATION_TYPES.MEDIUM_RISK,
            RECOMMENDATION_TYPES.LOW_RISK
          ].map(rec => {
            const filtered = chartData.filter(d => d.recommendation === rec);
            if (filtered.length === 0) return null;
            
            return (
              <Scatter
                key={rec}
                name={rec}
                data={filtered}
                fill={getRecommendationColor(rec)}
                shape="circle"
              />
            );
          })}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
