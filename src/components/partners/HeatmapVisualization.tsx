import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ScoredPortfolioItem } from '@/utils/partnerScoring';

interface HeatmapVisualizationProps {
  portfolioItems: ScoredPortfolioItem[];
  compact?: boolean;
}

export const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({ 
  portfolioItems,
  compact = false 
}) => {
  // Transform data for scatter plot
  const chartData = portfolioItems.map(item => ({
    name: item.name,
    fitScore: item.fit_score,
    urgency: item.willingness_60d === 'High' ? 100 : item.willingness_60d === 'Medium' ? 65 : 30,
    recommendation: item.recommendation,
    sponsor: item.sponsor_strength,
    pressure: item.value_pressure
  }));

  // Color by recommendation
  const getColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Exec Bootcamp': return 'hsl(var(--primary))';
      case 'Literacy Sprint': return 'hsl(var(--chart-2))';
      case 'Diagnostic': return 'hsl(var(--chart-3))';
      default: return 'hsl(var(--muted))';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-bold text-sm">{data.name}</p>
          <p className="text-xs text-muted-foreground">Fit Score: {data.fitScore}</p>
          <p className="text-xs text-muted-foreground">Recommendation: {data.recommendation}</p>
          <p className="text-xs text-muted-foreground">Sponsor: {data.sponsor}</p>
          <p className="text-xs text-muted-foreground">Pressure: {data.pressure}</p>
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
            dataKey="fitScore" 
            name="Fit Score" 
            unit=""
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={!compact ? { value: 'Fit Score', position: 'insideBottom', offset: -10, style: { fontSize: 12 } } : undefined}
          />
          <YAxis 
            type="number" 
            dataKey="urgency" 
            name="Urgency" 
            unit=""
            domain={[0, 110]}
            tick={{ fontSize: 12 }}
            label={!compact ? { value: 'Urgency', angle: -90, position: 'insideLeft', style: { fontSize: 12 } } : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          {!compact && (
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value: string) => {
                switch(value) {
                  case 'Exec Bootcamp': return 'Exec Bootcamp';
                  case 'Literacy Sprint': return 'Literacy Sprint';
                  case 'Diagnostic': return 'Diagnostic';
                  default: return value;
                }
              }}
            />
          )}
          
          {/* Group by recommendation */}
          {['Exec Bootcamp', 'Literacy Sprint', 'Diagnostic', 'Not now'].map(rec => {
            const filtered = chartData.filter(d => d.recommendation === rec);
            if (filtered.length === 0) return null;
            
            return (
              <Scatter
                key={rec}
                name={rec}
                data={filtered}
                fill={getColor(rec)}
                shape="circle"
              />
            );
          })}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
