// Partner Constants - Centralized configuration
// All hardcoded strings, colors, and options consolidated here

// Cognitive Risk Categories (based on waste risk level)
export const RECOMMENDATION_TYPES = {
  CRITICAL_RISK: 'Critical - Immediate Intervention',
  HIGH_RISK: 'High Risk - Scaffolding Required',
  MEDIUM_RISK: 'Medium Risk - Decision Support',
  LOW_RISK: 'Low Risk - Monitor'
} as const;

export const RECOMMENDATION_COLORS = {
  [RECOMMENDATION_TYPES.CRITICAL_RISK]: 'hsl(0 84% 60%)', // Red
  [RECOMMENDATION_TYPES.HIGH_RISK]: 'hsl(25 95% 53%)', // Orange
  [RECOMMENDATION_TYPES.MEDIUM_RISK]: 'hsl(48 96% 53%)', // Yellow
  [RECOMMENDATION_TYPES.LOW_RISK]: 'hsl(142 76% 36%)' // Green
} as const;

export const PARTNER_TYPES = [
  'Consulting Firm',
  'System Integrator',
  'Technology Vendor',
  'VC/PE Firm',
  'Accelerator/Incubator',
  'Advisory Network'
] as const;

export const SECTOR_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Professional Services',
  'Other'
] as const;

export const OBJECTIVE_OPTIONS = [
  'De-risk AI capital allocation',
  'Prevent vendor theatre in portfolio',
  'Identify cognitive readiness gaps',
  'Upgrade decision quality across portfolio',
  'Surface leadership thinking patterns',
  'Risk mitigation'
] as const;

export const URGENCY_WINDOWS = [
  '0-30 days',
  '31-60 days',
  '61-90 days',
  '90+ days'
] as const;

// New Cognitive Assessment Dimensions
export const HYPE_VS_DISCIPLINE_OPTIONS = [
  'All Hype - No Framework',
  'Hype Dominant',
  'Balanced',
  'Discipline Dominant'
] as const;

export const MENTAL_SCAFFOLDING_OPTIONS = [
  'None - Flying Blind',
  'Weak - Fragile Models',
  'Moderate - Some Structure',
  'Strong - Clear Frameworks'
] as const;

export const DECISION_QUALITY_OPTIONS = [
  'Poor - No Rigor',
  'Weak - Ad Hoc',
  'Moderate - Inconsistent',
  'Strong - Systematic'
] as const;

export const VENDOR_RESISTANCE_OPTIONS = [
  'Zero - Believes Everything',
  'Low - Easily Swayed',
  'Moderate - Questions Some',
  'High - Deeply Skeptical'
] as const;

export const PRESSURE_INTENSITY_OPTIONS = [
  'Low - No Urgency',
  'Medium - Some Pressure',
  'High - Real Urgency',
  'Critical - Panic Mode'
] as const;

export const SPONSOR_THINKING_OPTIONS = [
  'Weak - Unclear',
  'Basic - Surface Level',
  'Good - Some Depth',
  'Excellent - Sophisticated'
] as const;

export const UPGRADE_WILLINGNESS_OPTIONS = [
  'Resistant - Defensive',
  'Reluctant - Skeptical',
  'Open - Curious',
  'Eager - Hungry'
] as const;

export const CALENDLY_URL = 'https://calendly.com/krish-raja/mindmaker-meeting';
export const MINDMAKER_EMAIL = 'krish@themindmaker.ai';
