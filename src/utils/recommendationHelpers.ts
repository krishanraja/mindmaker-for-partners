// Recommendation Helpers - Consolidated logic for colors and badges
import { Badge } from '@/components/ui/badge';
import { RECOMMENDATION_TYPES, RECOMMENDATION_COLORS } from '@/constants/partnerConstants';

export function getRecommendationColor(recommendation: string): string {
  switch (recommendation) {
    case RECOMMENDATION_TYPES.EXEC_BOOTCAMP:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.EXEC_BOOTCAMP];
    case RECOMMENDATION_TYPES.LITERACY_SPRINT:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.LITERACY_SPRINT];
    case RECOMMENDATION_TYPES.DIAGNOSTIC:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.DIAGNOSTIC];
    default:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.NOT_NOW];
  }
}

export function getRecommendationBadgeVariant(recommendation: string): 'default' | 'secondary' | 'outline' {
  switch (recommendation) {
    case RECOMMENDATION_TYPES.EXEC_BOOTCAMP:
      return 'default';
    case RECOMMENDATION_TYPES.LITERACY_SPRINT:
      return 'secondary';
    case RECOMMENDATION_TYPES.DIAGNOSTIC:
      return 'outline';
    default:
      return 'outline';
  }
}

export function getPreWorkList(recommendation: string): string[] {
  switch (recommendation) {
    case RECOMMENDATION_TYPES.EXEC_BOOTCAMP:
      return [
        'Validate executive sponsor understands AI decision frameworks',
        'Surface leadership team AI thinking tensions',
        'Schedule cognitive readiness discussion'
      ];
    case RECOMMENDATION_TYPES.LITERACY_SPRINT:
      return [
        'Identify leaders needing decision scaffolding',
        'Map current mental models around AI',
        'Schedule thinking framework session'
      ];
    case RECOMMENDATION_TYPES.DIAGNOSTIC:
      return [
        'Assess baseline leadership AI cognition',
        'Surface blind spots in AI decision-making',
        'Schedule readiness assessment call'
      ];
    default:
      return ['Further cognitive readiness qualification needed'];
  }
}
