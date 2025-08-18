import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InvestorPortal from "./pages/InvestorPortal";
import Portfolio from "./pages/Portfolio";
import Banking from "./pages/Banking";
import TravelerPortal from "./pages/TravelerPortal";
import Community from "./pages/Community";
import Developers from "./pages/Developers";
import SmartContractTest from "./pages/SmartContractTest";
import LegalPortal from "./pages/LegalPortal";
import AdminProjects from "./pages/AdminProjects";
import TestRoute from "./pages/TestRoute";
import NotFound from "./pages/NotFound";
import BusinessModel from "./pages/BusinessModel";
import { WalletProvider } from "@/contexts/WalletContext";
import ChatBot from "@/components/ChatBot";
import { Navigate } from "react-router-dom";

function App() {
  // Create query client inside component but with useMemo to prevent recreation
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }), []);

  return (
    <div className="min-h-screen">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WalletProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/investor-portal" element={<InvestorPortal />} />
                <Route path="/investor" element={<InvestorPortal />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/banking" element={<Banking />} />
                <Route path="/traveler" element={<TravelerPortal />} />
                <Route path="/community" element={<Community />} />
                <Route path="/developers" element={<Developers />} />
                <Route path="/legal-portal" element={<LegalPortal />} />
                <Route path="/legal" element={<LegalPortal />} />
                <Route path="/business-model" element={<BusinessModel />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/test-route" element={<TestRoute />} />
                <Route path="/test" element={<SmartContractTest />} />
                <Route path="/investor-report" element={<Navigate to="/portfolio?tab=platform" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBot />
            </BrowserRouter>
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
