import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScoredPortfolioItem, PortfolioSummary } from '@/utils/partnerScoring';
import { RECOMMENDATION_TYPES } from '@/constants/partnerConstants';

interface ExportActionsProps {
  planId: string;
  intakeId: string;
  intakeData: any;
  portfolioItems: ScoredPortfolioItem[];
  summary: PortfolioSummary;
  onShareCreated: (slug: string) => void;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  planId,
  intakeId,
  intakeData,
  portfolioItems,
  summary,
  onShareCreated
}) => {
  const { toast } = useToast();
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const [isSendingLeads, setIsSendingLeads] = useState(false);

  const handleCreateShareLink = async () => {
    setIsCreatingShare(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-partner-share-link', {
        body: { plan_id: planId }
      });

      if (error) throw error;

      onShareCreated(data.share_slug);
      toast({
        title: 'Share Link Created',
        description: 'Your plan is now shareable!'
      });
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: 'Error',
        description: 'Failed to create share link',
        variant: 'destructive'
      });
    } finally {
      setIsCreatingShare(false);
    }
  };

  const handleSendToMindmaker = async () => {
    setIsSendingLeads(true);
    try {
      // Get candidates with Exec Bootcamp or Literacy Sprint recommendations
      const qualifiedCandidates = portfolioItems.filter(
        item => item.recommendation === RECOMMENDATION_TYPES.EXEC_BOOTCAMP || 
                item.recommendation === RECOMMENDATION_TYPES.LITERACY_SPRINT
      );

      if (qualifiedCandidates.length === 0) {
        toast({
          title: 'No Qualified Leads',
          description: 'No companies meet the criteria for submission',
          variant: 'destructive'
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-partner-leads', {
        body: {
          intake_id: intakeId,
          candidates: qualifiedCandidates,
          partner_info: {
            firm_name: intakeData.firm_name,
            partner_type: intakeData.partner_type,
            contact_role: intakeData.role
          }
        }
      });

      if (error) throw error;

      toast({
        title: 'Leads Sent Successfully!',
        description: `${qualifiedCandidates.length} qualified leads sent to Mindmaker`
      });
    } catch (error) {
      console.error('Error sending leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to send leads',
        variant: 'destructive'
      });
    } finally {
      setIsSendingLeads(false);
    }
  };

  const handleExportPDF = () => {
    toast({
      title: 'Export Coming Soon',
      description: 'PDF export will be available shortly'
    });
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant="outline"
        className="rounded-xl"
        onClick={handleExportPDF}
      >
        <Download className="h-4 w-4 mr-2" />
        Export PDF
      </Button>

      <Button
        variant="outline"
        className="rounded-xl"
        onClick={handleCreateShareLink}
        disabled={isCreatingShare}
      >
        <Share2 className="h-4 w-4 mr-2" />
        {isCreatingShare ? 'Creating...' : 'Create Share Link'}
      </Button>

      <Button
        variant="cta"
        className="rounded-xl"
        onClick={handleSendToMindmaker}
        disabled={isSendingLeads}
      >
        <Send className="h-4 w-4 mr-2" />
        {isSendingLeads ? 'Sending...' : 'Send to Mindmaker'}
      </Button>
    </div>
  );
};
