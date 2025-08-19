import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EnhancedPortfolioReset } from "@/components/admin/EnhancedPortfolioReset";
import { DeveloperProjectResetTools } from "@/components/admin/DeveloperProjectResetTools";
import { PlatformAnalytics } from "@/components/PlatformAnalytics";
import { DEMO_CONFIG } from '@/config/demo';
import { Badge } from "@/components/ui/badge";
import { Shield, Settings, BarChart3, Database } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              {DEMO_CONFIG.isEnabled && (
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  Demo Mode Testing
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Platform administration, analytics, and testing tools
            </p>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reset-tools" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Reset Tools
              </TabsTrigger>
              <TabsTrigger value="project-tools" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Project Tools
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <PlatformAnalytics />
            </TabsContent>

            <TabsContent value="reset-tools" className="space-y-6">
              <EnhancedPortfolioReset />
            </TabsContent>

            <TabsContent value="project-tools" className="space-y-6">
              <DeveloperProjectResetTools />
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="text-center text-muted-foreground py-12">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">System Configuration</h3>
                <p>Advanced system configuration tools coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;