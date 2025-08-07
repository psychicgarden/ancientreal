import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface PropertyAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    location: string;
    value: number;
    equity?: number;
    monthlyIncome?: number;
    occupancyRate?: number;
  };
}

export const PropertyAnalyticsModal = ({
  isOpen,
  onClose,
  property
}: PropertyAnalyticsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {property.title} - Analytics & Documents
          </DialogTitle>
          <p className="text-muted-foreground">{property.location}</p>
        </DialogHeader>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Legal & Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div className="text-sm font-medium">Current Value</div>
                  </div>
                  <div className="text-2xl font-bold">${property.value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12.5% this year</p>
                </CardContent>
              </Card>

              {property.equity && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <div className="text-sm font-medium">Your Equity</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">${property.equity.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+8.2% this month</p>
                  </CardContent>
                </Card>
              )}

              {property.monthlyIncome && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <div className="text-sm font-medium">Monthly Income</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">${property.monthlyIncome.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+5.1% vs last month</p>
                  </CardContent>
                </Card>
              )}

              {property.occupancyRate && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <div className="text-sm font-medium">Occupancy</div>
                    </div>
                    <div className="text-2xl font-bold">{property.occupancyRate}%</div>
                    <p className="text-xs text-muted-foreground">Above market avg</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Revenue Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month</span>
                      <Badge variant="secondary">${property.monthlyIncome?.toLocaleString() || "N/A"}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Month</span>
                      <Badge variant="outline">${((property.monthlyIncome || 0) * 0.95).toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">3 Month Avg</span>
                      <Badge variant="outline">${((property.monthlyIncome || 0) * 0.98).toLocaleString()}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Booking Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Repeat Guests</span>
                      <Badge>45%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Stay Duration</span>
                      <Badge variant="secondary">5.2 days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Guest Rating</span>
                      <Badge className="bg-green-100 text-green-800">4.8/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+18.2%</div>
                      <div className="text-sm text-muted-foreground">YTD Return</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">$12,450</div>
                      <div className="text-sm text-muted-foreground">Total Income YTD</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">92%</div>
                      <div className="text-sm text-muted-foreground">Avg Occupancy</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Your Property</p>
                      <p className="text-sm text-muted-foreground">Performance vs market</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+15% above market</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Market Average</p>
                      <p className="text-sm text-muted-foreground">{property.location} area</p>
                    </div>
                    <Badge variant="secondary">Baseline</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal & Investment Documents</CardTitle>
                <p className="text-sm text-muted-foreground">
                  All documents related to your investment in {property.title}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Property Investment Agreement</div>
                      <div className="text-sm text-muted-foreground">Legal contract for {property.title}</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Property Deed</div>
                      <div className="text-sm text-muted-foreground">Ownership documentation</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Insurance Policy</div>
                      <div className="text-sm text-muted-foreground">Property coverage details</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Tax Documents</div>
                      <div className="text-sm text-muted-foreground">Annual statements for {new Date().getFullYear()}</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Rental Management Agreement</div>
                      <div className="text-sm text-muted-foreground">Property management terms</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Compliance Certificates</div>
                      <div className="text-sm text-muted-foreground">Regulatory compliance docs</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Contract Address</p>
                      <p className="text-sm font-mono text-muted-foreground">0x742...d4e2</p>
                    </div>
                    <Button size="sm" variant="outline">View on Explorer</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Token ID</p>
                      <p className="text-sm font-mono text-muted-foreground">#{property.id.slice(-6)}</p>
                    </div>
                    <Badge>NFT</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};