// Partner Portfolio Scoring Engine
// Pure functions for calculating fit scores, recommendations, and risk flags

export interface PortfolioItem {
  name: string;
  sector?: string;
  stage?: string;
  ai_posture: string;
  data_posture: string;
  value_pressure: string;
  decision_cadence: string;
  sponsor_strength: string;
  willingness_60d: string;
}

export interface ScoredPortfolioItem extends PortfolioItem {
  fit_score: number;
  recommendation: string;
  risk_flags: string[];
}

// AI Posture scoring (0-20 points)
function aiPostureScore(posture: string): number {
  const scores: Record<string, number> = {
    'None': 0,
    'Exploring': 8,
    'Active': 15,
    'Leading': 20
  };
  return scores[posture] || 0;
}

// Data Posture scoring (0-20 points)
function dataPostureScore(posture: string): number {
  const scores: Record<string, number> = {
    'Disconnected': 0,
    'Scattered': 8,
    'Connected': 15,
    'Optimized': 20
  };
  return scores[posture] || 0;
}

// Value Pressure scoring (0-20 points)
function pressureScore(pressure: string): number {
  const scores: Record<string, number> = {
    'Low': 5,
    'Medium': 12,
    'High': 18,
    'Critical': 20
  };
  return scores[pressure] || 0;
}

// Decision Cadence scoring (0-15 points)
function cadenceScore(cadence: string): number {
  const scores: Record<string, number> = {
    'Slow': 3,
    'Moderate': 8,
    'Fast': 12,
    'Urgent': 15
  };
  return scores[cadence] || 0;
}

// Sponsor Strength scoring (0-15 points)
function sponsorScore(strength: string): number {
  const scores: Record<string, number> = {
    'None': 0,
    'Weak': 5,
    'Moderate': 10,
    'Strong': 15
  };
  return scores[strength] || 0;
}

// Willingness scoring (0-10 points)
function willingnessScore(willingness: string): number {
  const scores: Record<string, number> = {
    'Low': 0,
    'Medium': 6,
    'High': 10
  };
  return scores[willingness] || 0;
}

// Calculate total fit score (0-100)
export function calculateFitScore(item: PortfolioItem): number {
  let score = 0;
  
  score += aiPostureScore(item.ai_posture);
  score += dataPostureScore(item.data_posture);
  score += pressureScore(item.value_pressure);
  score += cadenceScore(item.decision_cadence);
  score += sponsorScore(item.sponsor_strength);
  score += willingnessScore(item.willingness_60d);
  
  return Math.min(100, Math.max(0, score));
}

// Get recommendation based on fit score and other factors
export function getRecommendation(item: PortfolioItem, fitScore: number): string {
  // Red flags: no sponsor OR data disconnected → Diagnostic first
  if (item.sponsor_strength === 'None' || item.data_posture === 'Disconnected') {
    return 'Diagnostic';
  }
  
  // High fit + willing → Exec Bootcamp
  if (fitScore >= 70 && ['Medium', 'High'].includes(item.willingness_60d)) {
    return 'Exec Bootcamp';
  }
  
  // Medium fit → Literacy Sprint
  if (fitScore >= 55 && fitScore < 70) {
    return 'Literacy Sprint';
  }
  
  // Low fit → Not ready
  return 'Not now';
}

// Get risk flags for a portfolio item
export function getRiskFlags(item: PortfolioItem): string[] {
  const flags: string[] = [];
  
  if (item.sponsor_strength === 'None') {
    flags.push('No exec sponsor');
  }
  
  if (item.data_posture === 'Disconnected') {
    flags.push('Data not accessible');
  }
  
  if (item.value_pressure && item.value_pressure.toLowerCase().includes('compliance')) {
    flags.push('Compliance sensitivity');
  }
  
  return flags;
}

// Score an entire portfolio
export function scorePortfolio(items: PortfolioItem[]): ScoredPortfolioItem[] {
  return items.map(item => {
    const fit_score = calculateFitScore(item);
    const recommendation = getRecommendation(item, fit_score);
    const risk_flags = getRiskFlags(item);
    
    return {
      ...item,
      fit_score,
      recommendation,
      risk_flags
    };
  });
}

// Get summary statistics for a scored portfolio
export interface PortfolioSummary {
  totalCompanies: number;
  execBootcampCount: number;
  literacySprintCount: number;
  diagnosticCount: number;
  averageFitScore: number;
  topCandidates: ScoredPortfolioItem[];
}

export function getPortfolioSummary(scoredItems: ScoredPortfolioItem[]): PortfolioSummary {
  const execBootcampCount = scoredItems.filter(i => i.recommendation === 'Exec Bootcamp').length;
  const literacySprintCount = scoredItems.filter(i => i.recommendation === 'Literacy Sprint').length;
  const diagnosticCount = scoredItems.filter(i => i.recommendation === 'Diagnostic').length;
  
  const averageFitScore = scoredItems.length > 0
    ? Math.round(scoredItems.reduce((sum, item) => sum + item.fit_score, 0) / scoredItems.length)
    : 0;
  
  // Top candidates are Exec Bootcamp + Literacy Sprint, sorted by fit score
  const topCandidates = scoredItems
    .filter(i => ['Exec Bootcamp', 'Literacy Sprint'].includes(i.recommendation))
    .sort((a, b) => b.fit_score - a.fit_score)
    .slice(0, 3);
  
  return {
    totalCompanies: scoredItems.length,
    execBootcampCount,
    literacySprintCount,
    diagnosticCount,
    averageFitScore,
    topCandidates
  };
}
