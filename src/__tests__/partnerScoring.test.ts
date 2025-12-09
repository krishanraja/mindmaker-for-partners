/**
 * Partner Scoring Unit Tests
 * 
 * Tests for the cognitive risk scoring engine.
 * Covers all 7 dimension scoring functions and aggregate calculations.
 * 
 * @module __tests__/partnerScoring
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCognitiveRiskScore,
  calculateCapitalAtRisk,
  calculateCognitiveReadiness,
  getRecommendation,
  getRiskFlags,
  scorePortfolio,
  getPortfolioSummary,
  calculateFitScore,
  PortfolioItem,
  ScoredPortfolioItem,
} from '@/utils/partnerScoring';

// ============================================================================
// Test Fixtures
// ============================================================================

const createHighRiskItem = (): PortfolioItem => ({
  name: 'High Risk Corp',
  sector: 'Tech',
  stage: 'Growth',
  hype_vs_discipline: 'All Hype - No Framework',
  mental_scaffolding: 'None - Flying Blind',
  decision_quality: 'Poor - No Rigor',
  vendor_resistance: 'Zero - Believes Everything',
  pressure_intensity: 'Critical - Panic Mode',
  sponsor_thinking: 'Weak - Unclear',
  upgrade_willingness: 'Resistant - Defensive',
});

const createLowRiskItem = (): PortfolioItem => ({
  name: 'Low Risk Corp',
  sector: 'Finance',
  stage: 'Mature',
  hype_vs_discipline: 'Discipline Dominant',
  mental_scaffolding: 'Strong - Clear Frameworks',
  decision_quality: 'Strong - Systematic',
  vendor_resistance: 'High - Deeply Skeptical',
  pressure_intensity: 'Low - No Urgency',
  sponsor_thinking: 'Excellent - Sophisticated',
  upgrade_willingness: 'Eager - Hungry',
});

const createMediumRiskItem = (): PortfolioItem => ({
  name: 'Medium Risk Corp',
  sector: 'Healthcare',
  stage: 'Scale',
  hype_vs_discipline: 'Balanced',
  mental_scaffolding: 'Moderate - Some Structure',
  decision_quality: 'Moderate - Inconsistent',
  vendor_resistance: 'Moderate - Questions Some',
  pressure_intensity: 'Medium - Some Pressure',
  sponsor_thinking: 'Good - Some Depth',
  upgrade_willingness: 'Open - Curious',
});

const createPartialItem = (): PortfolioItem => ({
  name: 'Partial Corp',
  sector: 'Retail',
  stage: '',
  hype_vs_discipline: 'Unknown Value',
  mental_scaffolding: 'Unknown Value',
  decision_quality: 'Unknown Value',
  vendor_resistance: 'Unknown Value',
  pressure_intensity: 'Unknown Value',
  sponsor_thinking: 'Unknown Value',
  upgrade_willingness: 'Unknown Value',
});

// ============================================================================
// calculateCognitiveRiskScore Tests
// ============================================================================

describe('calculateCognitiveRiskScore', () => {
  it('should return maximum risk score for highest risk inputs', () => {
    const item = createHighRiskItem();
    const score = calculateCognitiveRiskScore(item);
    
    // Maximum possible: 25 + 25 + 20 + 15 + 15 + 10 + 5 = 115, capped at 100
    expect(score).toBe(100);
  });

  it('should return minimum risk score for lowest risk inputs', () => {
    const item = createLowRiskItem();
    const score = calculateCognitiveRiskScore(item);
    
    // Minimum possible: 0 + 0 + 0 + 0 + 0 + 0 + 0 = 0
    expect(score).toBe(0);
  });

  it('should return moderate score for balanced inputs', () => {
    const item = createMediumRiskItem();
    const score = calculateCognitiveRiskScore(item);
    
    // 8 + 10 + 8 + 5 + 5 + 3 + 1 = 40
    expect(score).toBe(40);
  });

  it('should handle unknown values with defaults', () => {
    const item = createPartialItem();
    const score = calculateCognitiveRiskScore(item);
    
    // Defaults: 12 + 15 + 12 + 8 + 5 + 6 + 2 = 60
    expect(score).toBe(60);
  });

  it('should clamp score between 0 and 100', () => {
    const item = createHighRiskItem();
    const score = calculateCognitiveRiskScore(item);
    
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ============================================================================
// calculateCapitalAtRisk Tests
// ============================================================================

describe('calculateCapitalAtRisk', () => {
  it('should return maximum capital at risk for critical pressure and all hype', () => {
    const item = createHighRiskItem();
    const score = calculateCapitalAtRisk(item);
    
    // Critical (50) + All Hype (50) = 100
    expect(score).toBe(100);
  });

  it('should return minimum capital at risk for low pressure and discipline', () => {
    const item = createLowRiskItem();
    const score = calculateCapitalAtRisk(item);
    
    // Low (10) + Discipline (5) = 15
    expect(score).toBe(15);
  });

  it('should return moderate score for balanced inputs', () => {
    const item = createMediumRiskItem();
    const score = calculateCapitalAtRisk(item);
    
    // Medium (20) + Balanced (15) = 35
    expect(score).toBe(35);
  });

  it('should clamp at 100 for extreme values', () => {
    const item = createHighRiskItem();
    const score = calculateCapitalAtRisk(item);
    
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ============================================================================
// calculateCognitiveReadiness Tests
// ============================================================================

describe('calculateCognitiveReadiness', () => {
  it('should return maximum readiness for strong scaffolding and quality', () => {
    const item = createLowRiskItem();
    const score = calculateCognitiveReadiness(item);
    
    // Strong scaffolding (50) + Strong quality (50) = 100
    expect(score).toBe(100);
  });

  it('should return minimum readiness for no scaffolding and poor quality', () => {
    const item = createHighRiskItem();
    const score = calculateCognitiveReadiness(item);
    
    // None (0) + Poor (5) = 5
    expect(score).toBe(5);
  });

  it('should return moderate readiness for balanced inputs', () => {
    const item = createMediumRiskItem();
    const score = calculateCognitiveReadiness(item);
    
    // Moderate scaffolding (35) + Moderate quality (30) = 65
    expect(score).toBe(65);
  });
});

// ============================================================================
// getRecommendation Tests
// ============================================================================

describe('getRecommendation', () => {
  it('should return Critical recommendation for high risk and high capital at risk', () => {
    const item = createHighRiskItem();
    const cognitiveRiskScore = 75;
    const capitalAtRisk = 80;
    
    const recommendation = getRecommendation(item, cognitiveRiskScore, capitalAtRisk);
    expect(recommendation).toBe('Critical - Immediate Intervention');
  });

  it('should return High Risk for high cognitive risk only', () => {
    const item = createMediumRiskItem();
    const cognitiveRiskScore = 65;
    const capitalAtRisk = 30;
    
    const recommendation = getRecommendation(item, cognitiveRiskScore, capitalAtRisk);
    expect(recommendation).toBe('High Risk - Scaffolding Required');
  });

  it('should return High Risk for high capital at risk only', () => {
    const item = createMediumRiskItem();
    const cognitiveRiskScore = 40;
    const capitalAtRisk = 75;
    
    const recommendation = getRecommendation(item, cognitiveRiskScore, capitalAtRisk);
    expect(recommendation).toBe('High Risk - Scaffolding Required');
  });

  it('should return Medium Risk for moderate scores', () => {
    const item = createMediumRiskItem();
    const cognitiveRiskScore = 45;
    const capitalAtRisk = 45;
    
    const recommendation = getRecommendation(item, cognitiveRiskScore, capitalAtRisk);
    expect(recommendation).toBe('Medium Risk - Decision Support');
  });

  it('should return Low Risk for low scores', () => {
    const item = createLowRiskItem();
    const cognitiveRiskScore = 20;
    const capitalAtRisk = 15;
    
    const recommendation = getRecommendation(item, cognitiveRiskScore, capitalAtRisk);
    expect(recommendation).toBe('Low Risk - Monitor');
  });
});

// ============================================================================
// getRiskFlags Tests
// ============================================================================

describe('getRiskFlags', () => {
  it('should return all flags for maximum risk item', () => {
    const item = createHighRiskItem();
    const flags = getRiskFlags(item);
    
    expect(flags).toContain('No decision framework - pure hype cycle');
    expect(flags).toContain('Zero mental scaffolding - high waste risk');
    expect(flags).toContain('No vendor skepticism - easy target');
    expect(flags).toContain('Panic mode - will make bad decisions');
    expect(flags).toContain('Sponsor lacks cognitive clarity');
    expect(flags).toContain('Resistant to learning - poor fit');
    expect(flags).toHaveLength(6);
  });

  it('should return empty array for minimum risk item', () => {
    const item = createLowRiskItem();
    const flags = getRiskFlags(item);
    
    expect(flags).toHaveLength(0);
  });

  it('should return specific flags for partial risk items', () => {
    const item: PortfolioItem = {
      ...createMediumRiskItem(),
      hype_vs_discipline: 'All Hype - No Framework',
      pressure_intensity: 'Critical - Panic Mode',
    };
    
    const flags = getRiskFlags(item);
    
    expect(flags).toContain('No decision framework - pure hype cycle');
    expect(flags).toContain('Panic mode - will make bad decisions');
    expect(flags).toHaveLength(2);
  });
});

// ============================================================================
// scorePortfolio Tests
// ============================================================================

describe('scorePortfolio', () => {
  it('should score all items in a portfolio', () => {
    const items = [createHighRiskItem(), createLowRiskItem(), createMediumRiskItem()];
    const scored = scorePortfolio(items);
    
    expect(scored).toHaveLength(3);
    
    scored.forEach(item => {
      expect(item).toHaveProperty('cognitive_risk_score');
      expect(item).toHaveProperty('capital_at_risk');
      expect(item).toHaveProperty('cognitive_readiness');
      expect(item).toHaveProperty('recommendation');
      expect(item).toHaveProperty('risk_flags');
      expect(item).toHaveProperty('fit_score');
    });
  });

  it('should preserve original item properties', () => {
    const items = [createHighRiskItem()];
    const scored = scorePortfolio(items);
    
    expect(scored[0].name).toBe('High Risk Corp');
    expect(scored[0].sector).toBe('Tech');
  });

  it('should calculate fit_score as inverse of cognitive_risk_score', () => {
    const items = [createHighRiskItem(), createLowRiskItem()];
    const scored = scorePortfolio(items);
    
    scored.forEach(item => {
      expect(item.fit_score).toBe(100 - item.cognitive_risk_score);
    });
  });

  it('should return empty array for empty input', () => {
    const scored = scorePortfolio([]);
    expect(scored).toHaveLength(0);
  });
});

// ============================================================================
// getPortfolioSummary Tests
// ============================================================================

describe('getPortfolioSummary', () => {
  it('should correctly summarize a mixed portfolio', () => {
    const items: ScoredPortfolioItem[] = [
      { ...createHighRiskItem(), cognitive_risk_score: 80, capital_at_risk: 90, cognitive_readiness: 10, recommendation: 'Critical - Immediate Intervention', risk_flags: [], fit_score: 20 },
      { ...createHighRiskItem(), cognitive_risk_score: 65, capital_at_risk: 50, cognitive_readiness: 30, recommendation: 'High Risk - Scaffolding Required', risk_flags: [], fit_score: 35 },
      { ...createMediumRiskItem(), cognitive_risk_score: 45, capital_at_risk: 40, cognitive_readiness: 60, recommendation: 'Medium Risk - Decision Support', risk_flags: [], fit_score: 55 },
      { ...createLowRiskItem(), cognitive_risk_score: 15, capital_at_risk: 10, cognitive_readiness: 90, recommendation: 'Low Risk - Monitor', risk_flags: [], fit_score: 85 },
    ];
    
    const summary = getPortfolioSummary(items);
    
    expect(summary.totalCompanies).toBe(4);
    expect(summary.criticalRiskCount).toBe(1);
    expect(summary.highRiskCount).toBe(1);
    expect(summary.mediumRiskCount).toBe(1);
    expect(summary.lowRiskCount).toBe(1);
    expect(summary.averageRiskScore).toBe(51); // (80+65+45+15)/4 = 51.25, rounded to 51
  });

  it('should return top risk candidates sorted by score', () => {
    const items: ScoredPortfolioItem[] = [
      { ...createHighRiskItem(), name: 'Company A', cognitive_risk_score: 70, capital_at_risk: 80, cognitive_readiness: 20, recommendation: 'High Risk - Scaffolding Required', risk_flags: [], fit_score: 30 },
      { ...createHighRiskItem(), name: 'Company B', cognitive_risk_score: 85, capital_at_risk: 90, cognitive_readiness: 10, recommendation: 'Critical - Immediate Intervention', risk_flags: [], fit_score: 15 },
      { ...createLowRiskItem(), name: 'Company C', cognitive_risk_score: 20, capital_at_risk: 15, cognitive_readiness: 85, recommendation: 'Low Risk - Monitor', risk_flags: [], fit_score: 80 },
    ];
    
    const summary = getPortfolioSummary(items);
    
    expect(summary.topRiskCandidates).toHaveLength(2);
    expect(summary.topRiskCandidates[0].name).toBe('Company B');
    expect(summary.topRiskCandidates[1].name).toBe('Company A');
  });

  it('should handle empty portfolio', () => {
    const summary = getPortfolioSummary([]);
    
    expect(summary.totalCompanies).toBe(0);
    expect(summary.averageRiskScore).toBe(0);
    expect(summary.topRiskCandidates).toHaveLength(0);
  });

  it('should limit top risk candidates to 5', () => {
    const items: ScoredPortfolioItem[] = Array.from({ length: 10 }, (_, i) => ({
      ...createHighRiskItem(),
      name: `Company ${i}`,
      cognitive_risk_score: 60 + i,
      capital_at_risk: 70,
      cognitive_readiness: 30,
      recommendation: 'High Risk - Scaffolding Required',
      risk_flags: [],
      fit_score: 40 - i,
    }));
    
    const summary = getPortfolioSummary(items);
    
    expect(summary.topRiskCandidates).toHaveLength(5);
  });
});

// ============================================================================
// calculateFitScore (Legacy) Tests
// ============================================================================

describe('calculateFitScore', () => {
  it('should return inverse of cognitive risk score', () => {
    const highRiskItem = createHighRiskItem();
    const lowRiskItem = createLowRiskItem();
    
    const highRiskFit = calculateFitScore(highRiskItem);
    const lowRiskFit = calculateFitScore(lowRiskItem);
    
    // High risk = low fit, Low risk = high fit
    expect(highRiskFit).toBe(0); // 100 - 100 = 0
    expect(lowRiskFit).toBe(100); // 100 - 0 = 100
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Edge Cases', () => {
  it('should handle item with all empty strings', () => {
    const item: PortfolioItem = {
      name: '',
      sector: '',
      stage: '',
      hype_vs_discipline: '',
      mental_scaffolding: '',
      decision_quality: '',
      vendor_resistance: '',
      pressure_intensity: '',
      sponsor_thinking: '',
      upgrade_willingness: '',
    };
    
    const score = calculateCognitiveRiskScore(item);
    const capitalAtRisk = calculateCapitalAtRisk(item);
    const cognitiveReadiness = calculateCognitiveReadiness(item);
    
    // Should use default values
    expect(score).toBeGreaterThan(0);
    expect(capitalAtRisk).toBeGreaterThan(0);
    expect(cognitiveReadiness).toBeGreaterThanOrEqual(0);
  });

  it('should handle very large portfolio', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      ...createMediumRiskItem(),
      name: `Company ${i}`,
    }));
    
    const scored = scorePortfolio(items);
    const summary = getPortfolioSummary(scored);
    
    expect(scored).toHaveLength(100);
    expect(summary.totalCompanies).toBe(100);
  });
});
