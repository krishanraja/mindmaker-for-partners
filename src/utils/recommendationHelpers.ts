// Recommendation Helpers - Consolidated logic for colors and badges
import { Badge } from '@/components/ui/badge';
import { RECOMMENDATION_TYPES, RECOMMENDATION_COLORS } from '@/constants/partnerConstants';

export function getRecommendationColor(recommendation: string): string {
  switch (recommendation) {
    case RECOMMENDATION_TYPES.CRITICAL_RISK:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.CRITICAL_RISK];
    case RECOMMENDATION_TYPES.HIGH_RISK:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.HIGH_RISK];
    case RECOMMENDATION_TYPES.MEDIUM_RISK:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.MEDIUM_RISK];
    case RECOMMENDATION_TYPES.LOW_RISK:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.LOW_RISK];
    default:
      return RECOMMENDATION_COLORS[RECOMMENDATION_TYPES.LOW_RISK];
  }
}

export function getRecommendationBadgeVariant(recommendation: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (recommendation) {
    case RECOMMENDATION_TYPES.CRITICAL_RISK:
      return 'destructive';
    case RECOMMENDATION_TYPES.HIGH_RISK:
      return 'destructive';
    case RECOMMENDATION_TYPES.MEDIUM_RISK:
      return 'secondary';
    case RECOMMENDATION_TYPES.LOW_RISK:
      return 'outline';
    default:
      return 'outline';
  }
}

export function getPreWorkList(recommendation: string): string[] {
  switch (recommendation) {
    case RECOMMENDATION_TYPES.CRITICAL_RISK:
      return [
        'Immediate cognitive diagnostic before any capital deployment',
        'Map leadership thinking patterns and identify blind spots',
        'Schedule emergency scaffolding intervention call'
      ];
    case RECOMMENDATION_TYPES.HIGH_RISK:
      return [
        'Assess current mental models for AI decision-making',
        'Build decision quality frameworks before capital allocation',
        'Schedule cognitive scaffolding session'
      ];
    case RECOMMENDATION_TYPES.MEDIUM_RISK:
      return [
        'Review existing decision frameworks and identify gaps',
        'Surface leadership thinking tensions around AI',
        'Schedule decision quality discussion'
      ];
    case RECOMMENDATION_TYPES.LOW_RISK:
      return [
        'Monitor for changes in cognitive readiness',
        'Check in quarterly on thinking patterns',
        'Maintain relationship for future needs'
      ];
    default:
      return ['Further cognitive readiness qualification needed'];
  }
}
