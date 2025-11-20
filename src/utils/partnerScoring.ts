// Partner Portfolio Cognitive Risk Scoring Engine
// Inverted logic: High AI activity + Low cognitive scaffolding = HIGH WASTE RISK

export interface PortfolioItem {
  name: string;
  sector?: string;
  stage?: string;
  hype_vs_discipline: string;
  mental_scaffolding: string;
  decision_quality: string;
  vendor_resistance: string;
  pressure_intensity: string;
  sponsor_thinking: string;
  upgrade_willingness: string;
}

export interface ScoredPortfolioItem extends PortfolioItem {
  cognitive_risk_score: number; // 0-100 where 100 = maximum waste risk
  capital_at_risk: number; // 0-100 based on pressure + hype
  cognitive_readiness: number; // 0-100 based on scaffolding + quality
  recommendation: string;
  risk_flags: string[];
  // Legacy compatibility
  fit_score: number; // Map cognitive_risk_score for backwards compatibility
}

// Hype vs Discipline (INVERTED: More hype = higher risk)
function hypeRiskScore(hype: string): number {
  const scores: Record<string, number> = {
    'All Hype - No Framework': 25, // Maximum risk
    'Hype Dominant': 18,
    'Balanced': 8,
    'Discipline Dominant': 0 // Minimum risk
  };
  return scores[hype] || 12;
}

// Mental Scaffolding (INVERTED: Less scaffolding = higher risk)
function scaffoldingRiskScore(scaffolding: string): number {
  const scores: Record<string, number> = {
    'None - Flying Blind': 25, // Maximum risk
    'Weak - Fragile Models': 18,
    'Moderate - Some Structure': 10,
    'Strong - Clear Frameworks': 0 // Minimum risk
  };
  return scores[scaffolding] || 15;
}

// Decision Quality (INVERTED: Poor quality = higher risk)
function decisionQualityRiskScore(quality: string): number {
  const scores: Record<string, number> = {
    'Poor - No Rigor': 20, // Maximum risk
    'Weak - Ad Hoc': 15,
    'Moderate - Inconsistent': 8,
    'Strong - Systematic': 0 // Minimum risk
  };
  return scores[quality] || 12;
}

// Vendor Resistance (INVERTED: Low resistance = higher risk)
function vendorRiskScore(resistance: string): number {
  const scores: Record<string, number> = {
    'Zero - Believes Everything': 15, // Maximum risk
    'Low - Easily Swayed': 10,
    'Moderate - Questions Some': 5,
    'High - Deeply Skeptical': 0 // Minimum risk
  };
  return scores[resistance] || 8;
}

// Pressure Intensity (More pressure = higher risk of panic decisions)
function pressureRiskScore(pressure: string): number {
  const scores: Record<string, number> = {
    'Low - No Urgency': 0,
    'Medium - Some Pressure': 5,
    'High - Real Urgency': 10,
    'Critical - Panic Mode': 15 // Maximum risk
  };
  return scores[pressure] || 5;
}

// Sponsor Thinking (INVERTED: Weak thinking = higher risk)
function sponsorRiskScore(thinking: string): number {
  const scores: Record<string, number> = {
    'Weak - Unclear': 10, // Maximum risk
    'Basic - Surface Level': 7,
    'Good - Some Depth': 3,
    'Excellent - Sophisticated': 0 // Minimum risk
  };
  return scores[thinking] || 6;
}

// Upgrade Willingness (INVERTED: Resistant = higher risk)
function willingnessRiskScore(willingness: string): number {
  const scores: Record<string, number> = {
    'Resistant - Defensive': 5, // Maximum risk (can't be helped)
    'Reluctant - Skeptical': 3,
    'Open - Curious': 1,
    'Eager - Hungry': 0 // Minimum risk (ready to learn)
  };
  return scores[willingness] || 2;
}

// Calculate Cognitive Risk Score (0-100, where 100 = maximum waste risk)
export function calculateCognitiveRiskScore(item: PortfolioItem): number {
  let riskScore = 0;
  
  riskScore += hypeRiskScore(item.hype_vs_discipline);
  riskScore += scaffoldingRiskScore(item.mental_scaffolding);
  riskScore += decisionQualityRiskScore(item.decision_quality);
  riskScore += vendorRiskScore(item.vendor_resistance);
  riskScore += pressureRiskScore(item.pressure_intensity);
  riskScore += sponsorRiskScore(item.sponsor_thinking);
  riskScore += willingnessRiskScore(item.upgrade_willingness);
  
  return Math.min(100, Math.max(0, riskScore));
}

// Calculate Capital at Risk (pressure + hype)
export function calculateCapitalAtRisk(item: PortfolioItem): number {
  const pressureScore = item.pressure_intensity === 'Critical - Panic Mode' ? 50 :
                        item.pressure_intensity === 'High - Real Urgency' ? 35 :
                        item.pressure_intensity === 'Medium - Some Pressure' ? 20 : 10;
  
  const hypeScore = item.hype_vs_discipline === 'All Hype - No Framework' ? 50 :
                    item.hype_vs_discipline === 'Hype Dominant' ? 35 :
                    item.hype_vs_discipline === 'Balanced' ? 15 : 5;
  
  return Math.min(100, pressureScore + hypeScore);
}

// Calculate Cognitive Readiness (scaffolding + decision quality)
export function calculateCognitiveReadiness(item: PortfolioItem): number {
  const scaffoldingScore = item.mental_scaffolding === 'Strong - Clear Frameworks' ? 50 :
                           item.mental_scaffolding === 'Moderate - Some Structure' ? 35 :
                           item.mental_scaffolding === 'Weak - Fragile Models' ? 15 : 0;
  
  const qualityScore = item.decision_quality === 'Strong - Systematic' ? 50 :
                       item.decision_quality === 'Moderate - Inconsistent' ? 30 :
                       item.decision_quality === 'Weak - Ad Hoc' ? 15 : 5;
  
  return Math.min(100, scaffoldingScore + qualityScore);
}

// Get recommendation based on cognitive risk score
export function getRecommendation(item: PortfolioItem, cognitiveRiskScore: number, capitalAtRisk: number): string {
  // Critical: High risk + High capital at risk
  if (cognitiveRiskScore >= 70 && capitalAtRisk >= 60) {
    return 'Critical - Immediate Intervention';
  }
  
  // High Risk: Either high cognitive risk OR high capital at risk
  if (cognitiveRiskScore >= 60 || capitalAtRisk >= 70) {
    return 'High Risk - Scaffolding Required';
  }
  
  // Medium Risk: Moderate risk levels
  if (cognitiveRiskScore >= 40 || capitalAtRisk >= 40) {
    return 'Medium Risk - Decision Support';
  }
  
  // Low Risk: Everything else
  return 'Low Risk - Monitor';
}

// Get risk flags for a portfolio item
export function getRiskFlags(item: PortfolioItem): string[] {
  const flags: string[] = [];
  
  if (item.hype_vs_discipline === 'All Hype - No Framework') {
    flags.push('No decision framework - pure hype cycle');
  }
  
  if (item.mental_scaffolding === 'None - Flying Blind') {
    flags.push('Zero mental scaffolding - high waste risk');
  }
  
  if (item.vendor_resistance === 'Zero - Believes Everything') {
    flags.push('No vendor skepticism - easy target');
  }
  
  if (item.pressure_intensity === 'Critical - Panic Mode') {
    flags.push('Panic mode - will make bad decisions');
  }
  
  if (item.sponsor_thinking === 'Weak - Unclear') {
    flags.push('Sponsor lacks cognitive clarity');
  }
  
  if (item.upgrade_willingness === 'Resistant - Defensive') {
    flags.push('Resistant to learning - poor fit');
  }
  
  return flags;
}

// Score an entire portfolio
export function scorePortfolio(items: PortfolioItem[]): ScoredPortfolioItem[] {
  return items.map(item => {
    const cognitive_risk_score = calculateCognitiveRiskScore(item);
    const capital_at_risk = calculateCapitalAtRisk(item);
    const cognitive_readiness = calculateCognitiveReadiness(item);
    const recommendation = getRecommendation(item, cognitive_risk_score, capital_at_risk);
    const risk_flags = getRiskFlags(item);
    
    return {
      ...item,
      cognitive_risk_score,
      capital_at_risk,
      cognitive_readiness,
      recommendation,
      risk_flags,
      // Legacy compatibility - invert the score so high risk = low "fit"
      fit_score: 100 - cognitive_risk_score
    };
  });
}

// Get summary statistics for a scored portfolio
export interface PortfolioSummary {
  totalCompanies: number;
  criticalRiskCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageRiskScore: number;
  topRiskCandidates: ScoredPortfolioItem[];
}

export function getPortfolioSummary(scoredItems: ScoredPortfolioItem[]): PortfolioSummary {
  const criticalRiskCount = scoredItems.filter(i => i.recommendation === 'Critical - Immediate Intervention').length;
  const highRiskCount = scoredItems.filter(i => i.recommendation === 'High Risk - Scaffolding Required').length;
  const mediumRiskCount = scoredItems.filter(i => i.recommendation === 'Medium Risk - Decision Support').length;
  const lowRiskCount = scoredItems.filter(i => i.recommendation === 'Low Risk - Monitor').length;
  
  const averageRiskScore = scoredItems.length > 0
    ? Math.round(scoredItems.reduce((sum, item) => sum + item.cognitive_risk_score, 0) / scoredItems.length)
    : 0;
  
  // Top risk candidates are Critical + High Risk, sorted by cognitive risk score
  const topRiskCandidates = scoredItems
    .filter(i => ['Critical - Immediate Intervention', 'High Risk - Scaffolding Required'].includes(i.recommendation))
    .sort((a, b) => b.cognitive_risk_score - a.cognitive_risk_score)
    .slice(0, 5);
  
  return {
    totalCompanies: scoredItems.length,
    criticalRiskCount,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    averageRiskScore,
    topRiskCandidates
  };
}

// Legacy compatibility export
export function calculateFitScore(item: PortfolioItem): number {
  return 100 - calculateCognitiveRiskScore(item);
}
