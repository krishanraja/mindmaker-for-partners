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
        'Confirm CEO/COO sponsor availability',
        'Secure 90-day objective definition',
        'Schedule kickoff within 14 days'
      ];
    case RECOMMENDATION_TYPES.LITERACY_SPRINT:
      return [
        'Identify team leads for sprint',
        'Map initial AI use cases',
        'Schedule 60-min alignment call'
      ];
    case RECOMMENDATION_TYPES.DIAGNOSTIC:
      return [
        'Secure data access contact',
        'Define current AI baseline',
        'Schedule diagnostic session'
      ];
    default:
      return ['Further qualification needed'];
  }
}
