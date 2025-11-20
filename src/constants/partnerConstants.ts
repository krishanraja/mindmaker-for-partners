// Partner Constants - Centralized configuration
// All hardcoded strings, colors, and options consolidated here

// Risk Categories - Plain English
export const RECOMMENDATION_TYPES = {
  CRITICAL_RISK: 'HIGH RISK - Will Waste Money Fast',
  HIGH_RISK: 'At Risk - Need Help Soon',
  MEDIUM_RISK: 'Some Risk - Worth Watching',
  LOW_RISK: 'Low Risk - Let Them Run'
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
  'Stop teams from wasting AI money',
  'Spot bad decisions before they happen',
  'See which leaders will believe vendor hype',
  'Help teams ask better questions',
  'Prevent panic buying',
  'Avoid throwing money at problems'
] as const;

export const URGENCY_WINDOWS = [
  '0-30 days',
  '31-60 days',
  '61-90 days',
  '90+ days'
] as const;

// Assessment Questions - Plain English
export const HYPE_VS_DISCIPLINE_OPTIONS = [
  'Buying the vendor story completely',
  'Mostly believing vendor promises',
  'Asking some hard questions',
  'Very skeptical, challenging everything'
] as const;

export const MENTAL_SCAFFOLDING_OPTIONS = [
  'Unclear thinking - winging it',
  'Basic ideas but no real framework',
  'Some structure to their thinking',
  'Clear frameworks and decision models'
] as const;

export const DECISION_QUALITY_OPTIONS = [
  'No real process - just reacting',
  'Making it up as they go',
  'Inconsistent - depends on the day',
  'Thoughtful, systematic approach'
] as const;

export const VENDOR_RESISTANCE_OPTIONS = [
  'Will believe anything vendors say',
  'Easily convinced by sales pitches',
  'Question some things, not others',
  'Deeply skeptical of all claims'
] as const;

export const PRESSURE_INTENSITY_OPTIONS = [
  'No rush - exploring calmly',
  'Some urgency from above',
  'Real pressure to do something',
  'Panic mode - will buy anything'
] as const;

export const SPONSOR_THINKING_OPTIONS = [
  'Fuzzy thinking - can\'t articulate clearly',
  'Surface level understanding only',
  'Decent grasp of the issues',
  'Deep, sophisticated thinking'
] as const;

export const UPGRADE_WILLINGNESS_OPTIONS = [
  'Defensive - don\'t tell me what to do',
  'Skeptical - not interested in advice',
  'Open minded - willing to learn',
  'Hungry for help and guidance'
] as const;

export const CALENDLY_URL = 'https://calendly.com/krish-raja/mindmaker-meeting';
export const MINDMAKER_EMAIL = 'krish@themindmaker.ai';
