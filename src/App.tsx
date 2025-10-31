import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Partners from "./pages/Partners";
import PartnerPlanShare from "./pages/PartnerPlanShare";
import NotFound from "./pages/NotFound";
import { testGoogleSheetsSync, testMainSyncFunction } from "./utils/testGoogleSheetsSync";
import { processPendingSyncs } from "./utils/processPendingSyncs";
import { 
  testBasicOpenAIConnection, 
  testAIAssessmentChat, 
  testExecutiveInsightsGeneration,
  testCompleteOpenAIIntegration,
  diagnoseOpenAIIssues,
  testAdvisorySprintNotification
} from "./utils/testOpenAIIntegration";

// Temporarily expose test functions to global scope for debugging
(window as any).testGoogleSheetsSync = testGoogleSheetsSync;
(window as any).testMainSyncFunction = testMainSyncFunction;
(window as any).processPendingSyncs = processPendingSyncs;
(window as any).testBasicOpenAIConnection = testBasicOpenAIConnection;
(window as any).testAIAssessmentChat = testAIAssessmentChat;
(window as any).testExecutiveInsightsGeneration = testExecutiveInsightsGeneration;
(window as any).testCompleteOpenAIIntegration = testCompleteOpenAIIntegration;
(window as any).diagnoseOpenAIIssues = diagnoseOpenAIIssues;
(window as any).testAdvisorySprintNotification = testAdvisorySprintNotification;

const queryClient = new QueryClient();

const App = () => (
  <div className="min-h-screen bg-background">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/plan/:shareSlug" element={<PartnerPlanShare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </div>
);

export default App;
