// Partner Constants - Centralized configuration
// All hardcoded strings, colors, and options consolidated here

export const RECOMMENDATION_TYPES = {
  EXEC_BOOTCAMP: 'Exec Bootcamp',
  LITERACY_SPRINT: 'Literacy Sprint',
  DIAGNOSTIC: 'Diagnostic',
  NOT_NOW: 'Not now'
} as const;

export const RECOMMENDATION_COLORS = {
  [RECOMMENDATION_TYPES.EXEC_BOOTCAMP]: 'hsl(var(--primary))',
  [RECOMMENDATION_TYPES.LITERACY_SPRINT]: 'hsl(var(--chart-2))',
  [RECOMMENDATION_TYPES.DIAGNOSTIC]: 'hsl(var(--chart-3))',
  [RECOMMENDATION_TYPES.NOT_NOW]: 'hsl(var(--muted))'
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
  'Enable portfolio AI adoption',
  'Generate co-delivery pipeline',
  'Qualify exec bootcamp leads',
  'Build partner credibility',
  'Identify quick wins',
  'Risk mitigation'
] as const;

export const URGENCY_WINDOWS = [
  '0-30 days',
  '31-60 days',
  '61-90 days',
  '90+ days'
] as const;

export const STAGE_OPTIONS = [
  'Seed',
  'Growth',
  'Mature',
  'Enterprise'
] as const;

export const AI_POSTURE_OPTIONS = [
  'None',
  'Exploring',
  'Active',
  'Leading'
] as const;

export const DATA_POSTURE_OPTIONS = [
  'Disconnected',
  'Scattered',
  'Connected',
  'Optimized'
] as const;

export const VALUE_PRESSURE_OPTIONS = [
  'Low',
  'Medium',
  'High',
  'Critical'
] as const;

export const DECISION_CADENCE_OPTIONS = [
  'Slow',
  'Moderate',
  'Fast',
  'Urgent'
] as const;

export const SPONSOR_STRENGTH_OPTIONS = [
  'None',
  'Weak',
  'Moderate',
  'Strong'
] as const;

export const WILLINGNESS_OPTIONS = [
  'Low',
  'Medium',
  'High'
] as const;

export const CALENDLY_URL = 'https://calendly.com/krish-raja/mindmaker-meeting';
export const MINDMAKER_EMAIL = 'krish@themindmaker.ai';
