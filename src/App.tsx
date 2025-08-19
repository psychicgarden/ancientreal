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
import AdminDashboard from "./pages/AdminDashboard";
import TestRoute from "./pages/TestRoute";
import NotFound from "./pages/NotFound";
import BusinessModel from "./pages/BusinessModel";
import { WalletProvider } from "@/contexts/WalletContext";
import { UIProvider } from "@/contexts/UIContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import ChatBot from "@/components/ChatBot";
import { Navigate } from "react-router-dom";

// Create query client outside component to avoid hook issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <WalletProvider>
            <UIProvider>
              <div className="min-h-screen">
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
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/test-route" element={<TestRoute />} />
                <Route path="/test" element={<SmartContractTest />} />
                <Route path="/investor-report" element={<Navigate to="/portfolio?tab=platform" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBot />
            </BrowserRouter>
              </div>
            </UIProvider>
          </WalletProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;