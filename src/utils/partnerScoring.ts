/**
 * Partner Portfolio Cognitive Risk Scoring Engine
 * 
 * Calculates cognitive risk scores for portfolio companies to identify
 * which teams are likely to waste money on poor AI decisions.
 * 
 * Scoring Logic: High AI activity + Low cognitive scaffolding = HIGH WASTE RISK
 * 
 * @module utils/partnerScoring
 * 
 * @example
 * ```typescript
 * import { scorePortfolio, getPortfolioSummary } from '@/utils/partnerScoring';
 * 
 * const items = [{ name: 'Acme', hype_vs_discipline: 'Balanced', ... }];
 * const scored = scorePortfolio(items);
 * const summary = getPortfolioSummary(scored);
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Raw portfolio item before scoring
 */
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

/**
 * Portfolio item with calculated risk scores and recommendations
 */
export interface ScoredPortfolioItem extends PortfolioItem {
  /** Overall cognitive risk score (0-100, higher = more risk) */
  cognitive_risk_score: number;
  /** Capital at risk based on pressure and hype (0-100) */
  capital_at_risk: number;
  /** Cognitive readiness based on scaffolding and quality (0-100) */
  cognitive_readiness: number;
  /** Text recommendation for action */
  recommendation: string;
  /** Array of specific risk flags */
  risk_flags: string[];
  /** Legacy compatibility score (inverse of cognitive_risk_score) */
  fit_score: number;
}

/**
 * Summary statistics for a scored portfolio
 */
export interface PortfolioSummary {
  totalCompanies: number;
  criticalRiskCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageRiskScore: number;
  topRiskCandidates: ScoredPortfolioItem[];
}

// ============================================================================
// Dimension Scoring Functions
// Each function maps a string input to a numeric risk score.
// Higher scores = higher risk.
// ============================================================================

/**
 * Score hype vs discipline dimension
 * More hype = higher risk of poor decisions
 * 
 * @param hype - The hype_vs_discipline field value
 * @returns Risk score (0-25)
 */
function hypeRiskScore(hype: string): number {
  const scores: Record<string, number> = {
    'All Hype - No Framework': 25,
    'Hype Dominant': 18,
    'Balanced': 8,
    'Discipline Dominant': 0
  };
  return scores[hype] ?? 12; // Default to moderate risk
}

/**
 * Score mental scaffolding dimension
 * Less scaffolding = higher risk of cognitive blind spots
 * 
 * @param scaffolding - The mental_scaffolding field value
 * @returns Risk score (0-25)
 */
function scaffoldingRiskScore(scaffolding: string): number {
  const scores: Record<string, number> = {
    'None - Flying Blind': 25,
    'Weak - Fragile Models': 18,
    'Moderate - Some Structure': 10,
    'Strong - Clear Frameworks': 0
  };
  return scores[scaffolding] ?? 15;
}

/**
 * Score decision quality dimension
 * Poor quality = higher risk of bad outcomes
 * 
 * @param quality - The decision_quality field value
 * @returns Risk score (0-20)
 */
function decisionQualityRiskScore(quality: string): number {
  const scores: Record<string, number> = {
    'Poor - No Rigor': 20,
    'Weak - Ad Hoc': 15,
    'Moderate - Inconsistent': 8,
    'Strong - Systematic': 0
  };
  return scores[quality] ?? 12;
}

/**
 * Score vendor resistance dimension
 * Low resistance = higher risk of being sold bad solutions
 * 
 * @param resistance - The vendor_resistance field value
 * @returns Risk score (0-15)
 */
function vendorRiskScore(resistance: string): number {
  const scores: Record<string, number> = {
    'Zero - Believes Everything': 15,
    'Low - Easily Swayed': 10,
    'Moderate - Questions Some': 5,
    'High - Deeply Skeptical': 0
  };
  return scores[resistance] ?? 8;
}

/**
 * Score pressure intensity dimension
 * More pressure = higher risk of panic decisions
 * 
 * @param pressure - The pressure_intensity field value
 * @returns Risk score (0-15)
 */
function pressureRiskScore(pressure: string): number {
  const scores: Record<string, number> = {
    'Low - No Urgency': 0,
    'Medium - Some Pressure': 5,
    'High - Real Urgency': 10,
    'Critical - Panic Mode': 15
  };
  return scores[pressure] ?? 5;
}

/**
 * Score sponsor thinking dimension
 * Weak thinking = higher risk of misdirected investment
 * 
 * @param thinking - The sponsor_thinking field value
 * @returns Risk score (0-10)
 */
function sponsorRiskScore(thinking: string): number {
  const scores: Record<string, number> = {
    'Weak - Unclear': 10,
    'Basic - Surface Level': 7,
    'Good - Some Depth': 3,
    'Excellent - Sophisticated': 0
  };
  return scores[thinking] ?? 6;
}

/**
 * Score upgrade willingness dimension
 * Resistant = higher risk (can't be helped)
 * 
 * @param willingness - The upgrade_willingness field value
 * @returns Risk score (0-5)
 */
function willingnessRiskScore(willingness: string): number {
  const scores: Record<string, number> = {
    'Resistant - Defensive': 5,
    'Reluctant - Skeptical': 3,
    'Open - Curious': 1,
    'Eager - Hungry': 0
  };
  return scores[willingness] ?? 2;
}

// ============================================================================
// Aggregate Calculation Functions
// ============================================================================

/**
 * Calculate the overall cognitive risk score
 * Sums all dimension scores and clamps to 0-100
 * 
 * @param item - Portfolio item to score
 * @returns Cognitive risk score (0-100, higher = more waste risk)
 */
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

/**
 * Calculate capital at risk based on pressure and hype
 * High pressure + high hype = money will be spent rashly
 * 
 * @param item - Portfolio item to score
 * @returns Capital at risk score (0-100)
 */
export function calculateCapitalAtRisk(item: PortfolioItem): number {
  const pressureScore = item.pressure_intensity === 'Critical - Panic Mode' ? 50 :
                        item.pressure_intensity === 'High - Real Urgency' ? 35 :
                        item.pressure_intensity === 'Medium - Some Pressure' ? 20 : 10;
  
  const hypeScore = item.hype_vs_discipline === 'All Hype - No Framework' ? 50 :
                    item.hype_vs_discipline === 'Hype Dominant' ? 35 :
                    item.hype_vs_discipline === 'Balanced' ? 15 : 5;
  
  return Math.min(100, pressureScore + hypeScore);
}

/**
 * Calculate cognitive readiness
 * Strong scaffolding + good decision quality = ready to make good choices
 * 
 * @param item - Portfolio item to score
 * @returns Cognitive readiness score (0-100, higher = more ready)
 */
export function calculateCognitiveReadiness(item: PortfolioItem): number {
  const scaffoldingScore = item.mental_scaffolding === 'Strong - Clear Frameworks' ? 50 :
                           item.mental_scaffolding === 'Moderate - Some Structure' ? 35 :
                           item.mental_scaffolding === 'Weak - Fragile Models' ? 15 : 0;
  
  const qualityScore = item.decision_quality === 'Strong - Systematic' ? 50 :
                       item.decision_quality === 'Moderate - Inconsistent' ? 30 :
                       item.decision_quality === 'Weak - Ad Hoc' ? 15 : 5;
  
  return Math.min(100, scaffoldingScore + qualityScore);
}

/**
 * Generate a recommendation based on risk scores
 * 
 * @param item - Portfolio item
 * @param cognitiveRiskScore - Calculated cognitive risk score
 * @param capitalAtRisk - Calculated capital at risk score
 * @returns Recommendation string
 */
export function getRecommendation(
  item: PortfolioItem, 
  cognitiveRiskScore: number, 
  capitalAtRisk: number
): string {
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

/**
 * Generate specific risk flags for a portfolio item
 * Identifies critical issues that need attention
 * 
 * @param item - Portfolio item to analyze
 * @returns Array of risk flag strings
 */
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

// ============================================================================
// Portfolio-Level Functions
// ============================================================================

/**
 * Score an entire portfolio of items
 * Applies all scoring logic and generates recommendations
 * 
 * @param items - Array of portfolio items to score
 * @returns Array of scored portfolio items
 */
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

/**
 * Get summary statistics for a scored portfolio
 * 
 * @param scoredItems - Array of scored portfolio items
 * @returns Portfolio summary with counts and top risks
 */
export function getPortfolioSummary(scoredItems: ScoredPortfolioItem[]): PortfolioSummary {
  const criticalRiskCount = scoredItems.filter(
    i => i.recommendation === 'Critical - Immediate Intervention'
  ).length;
  
  const highRiskCount = scoredItems.filter(
    i => i.recommendation === 'High Risk - Scaffolding Required'
  ).length;
  
  const mediumRiskCount = scoredItems.filter(
    i => i.recommendation === 'Medium Risk - Decision Support'
  ).length;
  
  const lowRiskCount = scoredItems.filter(
    i => i.recommendation === 'Low Risk - Monitor'
  ).length;
  
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

// ============================================================================
// Legacy Compatibility
// ============================================================================

/**
 * Calculate legacy fit score (inverse of cognitive risk)
 * Maintained for backwards compatibility with existing code
 * 
 * @param item - Portfolio item to score
 * @returns Fit score (0-100, higher = better fit)
 * @deprecated Use calculateCognitiveRiskScore instead
 */
export function calculateFitScore(item: PortfolioItem): number {
  return 100 - calculateCognitiveRiskScore(item);
}
