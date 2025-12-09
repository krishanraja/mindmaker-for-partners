/**
 * Partner Intake Estimator
 * 
 * Calculates estimated sprint candidates based on intake form data.
 * Used to provide live feedback during the intake process.
 * 
 * @module utils/intakeEstimator
 */

export interface IntakeData {
  objectives: string[];
  pipeline_count: number;
  urgency_window: string;
}

// Calculate estimated sprint candidates for live feedback
export function estimateSprintCandidates(data: IntakeData): number {
  let estimate = 0;
  
  // Objectives weight (30%)
  const objectivesWeight = data.objectives.length * 0.3;
  
  // Pipeline count weight (40%)
  const pipelineWeight = Math.min(data.pipeline_count, 10) * 0.4;
  
  // Urgency multiplier
  let urgencyMultiplier = 1.0;
  if (data.urgency_window === '0-30 days') {
    urgencyMultiplier = 1.5;
  } else if (data.urgency_window === '31-60 days') {
    urgencyMultiplier = 1.2;
  } else if (data.urgency_window === '61-90 days') {
    urgencyMultiplier = 1.0;
  } else {
    urgencyMultiplier = 0.5;
  }
  
  estimate = (objectivesWeight + pipelineWeight) * urgencyMultiplier;
  
  // Round and clamp to reasonable range
  return Math.max(0, Math.min(10, Math.round(estimate)));
}

// Get urgency label from window
export function getUrgencyLabel(window: string): string {
  const labels: Record<string, string> = {
    '0-30 days': 'Immediate',
    '31-60 days': 'High',
    '61-90 days': 'Medium',
    '90+ days': 'Low'
  };
  return labels[window] || 'Unknown';
}
