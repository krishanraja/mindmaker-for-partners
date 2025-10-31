import { useState } from 'react';
import { PartnerHeroSection } from '@/components/partners/PartnerHeroSection';
import { PartnerIntakeForm, PartnerIntakeData } from '@/components/partners/PartnerIntakeForm';
import { PortfolioScoringTable } from '@/components/partners/PortfolioScoringTable';
import { PartnerPlanResults } from '@/components/partners/PartnerPlanResults';
import { ScoredPortfolioItem } from '@/utils/partnerScoring';

type Step = 'hero' | 'intake' | 'scoring' | 'results';

const Partners = () => {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [intakeData, setIntakeData] = useState<PartnerIntakeData | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<ScoredPortfolioItem[]>([]);
  const [intakeId, setIntakeId] = useState<string | null>(null);

  const handleStartAssessment = () => {
    setCurrentStep('intake');
  };

  const handleIntakeComplete = (data: PartnerIntakeData, id: string) => {
    setIntakeData(data);
    setIntakeId(id);
    setCurrentStep('scoring');
  };

  const handleScoringComplete = (items: ScoredPortfolioItem[]) => {
    setPortfolioItems(items);
    setCurrentStep('results');
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('scoring');
    } else if (currentStep === 'scoring') {
      setCurrentStep('intake');
    } else if (currentStep === 'intake') {
      setCurrentStep('hero');
    }
  };

  if (currentStep === 'hero') {
    return <PartnerHeroSection onStartAssessment={handleStartAssessment} />;
  }

  if (currentStep === 'intake') {
    return (
      <PartnerIntakeForm 
        onSubmit={handleIntakeComplete}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === 'scoring' && intakeData && intakeId) {
    return (
      <PortfolioScoringTable
        intakeData={intakeData}
        intakeId={intakeId}
        onComplete={handleScoringComplete}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === 'results' && intakeData && intakeId) {
    return (
      <PartnerPlanResults
        intakeData={intakeData}
        intakeId={intakeId}
        portfolioItems={portfolioItems}
        onBack={handleBack}
      />
    );
  }

  return null;
};

export default Partners;
