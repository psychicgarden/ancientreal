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
import { WalletProvider } from "@/contexts/WalletContext";
import { Navigate } from "react-router-dom";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/investor" element={<InvestorPortal />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/traveler" element={<TravelerPortal />} />
            
            <Route path="/community" element={<Community />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/legal" element={<LegalPortal />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            
            <Route path="/test-route" element={<TestRoute />} />
            <Route path="/test" element={<SmartContractTest />} />
            <Route path="/investor-report" element={<Navigate to="/portfolio?tab=platform" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
