import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Building2, FileCheck, Clock, Gavel, CheckCircle2 } from "lucide-react";

const countryStructures = [
  {
    country: "Peru",
    flag: "🇵🇪",
    structure: "Reserva de Dominio (Title Retention)",
    howItWorks: "Ancient retains full legal title to the property until the buyer makes the final mortgage payment. The buyer receives possession and beneficial use, but the deed stays with Ancient.",
    protection: "No court needed. Ancient already owns the asset. Simply revoke access NFT and activate STR rental pool.",
    timeline: "30-60 days",
    traditionalTimeline: "2-3 years",
    legalBasis: "Peruvian Civil Code Art. 1583-1585",
    color: "red"
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    structure: "Alienação Fiduciária (Fiduciary Alienation)",
    howItWorks: "Property is held in fiduciary trust with automatic reversion clause. Buyer has equitable ownership; legal title reverts on default.",
    protection: "Extrajudicial (non-court) recovery process via notary public. No eviction lawsuit required.",
    timeline: "60-90 days",
    traditionalTimeline: "3-5 years",
    legalBasis: "Law 9.514/97 (Brazilian Real Estate Financing Law)",
    color: "green"
  },
  {
    country: "Greece",
    flag: "🇬🇷",
    structure: "Greek IKE SPV (Private Company)",
    howItWorks: "Property held in Greek IKE (private company). Buyer purchases shares, not direct property. Ancient controls the company.",
    protection: "Share transfer revocation—no property transfer needed. Serviced accommodation model bypasses EU tenant protection.",
    timeline: "30-60 days",
    traditionalTimeline: "2-4 years",
    legalBasis: "Greek Law 4072/2012 (IKE Companies)",
    color: "blue"
  },
  {
    country: "Thailand",
    flag: "🇹🇭",
    structure: "30+30 Year Leasehold",
    howItWorks: "Foreigners cannot own Thai land freehold. Pre-paid 30-year lease with 30-year renewal option provides de facto ownership.",
    protection: "Lease termination clause—no land title transfer was ever made.",
    timeline: "30-45 days",
    traditionalTimeline: "1-3 years",
    legalBasis: "Thai Civil and Commercial Code, Section 540",
    color: "purple"
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    structure: "SAPI + Fideicomiso (Bank Trust)",
    howItWorks: "Coastal/border properties require bank trust (Fideicomiso) for foreign ownership. SAPI corporate structure holds trust beneficial rights.",
    protection: "Trust beneficiary substitution—bank transfers rights to Ancient without court.",
    timeline: "60-90 days",
    traditionalTimeline: "2-4 years",
    legalBasis: "Mexican Foreign Investment Law Art. 10-A, 11",
    color: "amber"
  },
  {
    country: "Turkey",
    flag: "🇹🇷",
    structure: "Turkish SPV (Limited Company)",
    howItWorks: "Property held in Turkish limited company (Ltd. Şti.). Buyer purchases company shares. Citizenship pathway bonus for $400K+ properties.",
    protection: "Share transfer revocation—corporate level, not property level.",
    timeline: "45-60 days",
    traditionalTimeline: "2-3 years",
    legalBasis: "Turkish Commercial Code No. 6102",
    color: "rose"
  }
];

export function LegalRegulatoryProofing() {
  return (
    <div className="space-y-12">
      {/* Executive Summary */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            <Shield className="h-8 w-8 inline-block mr-3 text-primary" />
            Legal & Regulatory Proofing
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Battle-tested legal framework across 6 jurisdictions
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 rounded-xl border border-border/50 text-center">
              <Gavel className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold text-lg">Zero Foreclosure Courts</p>
              <p className="text-sm text-muted-foreground mt-1">Title retention across all markets</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-border/50 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold text-lg">30-90 Day Recovery</p>
              <p className="text-sm text-muted-foreground mt-1">vs. 2-5 years traditional</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-border/50 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold text-lg">$500M+ Proven</p>
              <p className="text-sm text-muted-foreground mt-1">Structures used by Tether Gold, RealT</p>
            </div>
          </div>

          <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
            <p className="text-center text-lg font-medium">
              "We don't replace property law — we modernize it with blockchain rails"
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Each jurisdiction uses existing legal structures that have been battle-tested by the $500M+ tokenization industry
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Global Legal Architecture Grid */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-8">Global Legal Architecture</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countryStructures.map((country) => (
            <Card key={country.country} className="hover:shadow-lg transition-shadow border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{country.flag}</span>
                    <div>
                      <CardTitle className="text-xl">{country.country}</CardTitle>
                      <Badge className="mt-1" variant="outline">{country.structure}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* How It Works */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-sm">How It Works</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{country.howItWorks}</p>
                </div>

                {/* Investor Protection */}
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <p className="font-semibold text-sm text-green-400">On Default</p>
                  </div>
                  <p className="text-sm text-green-300/90">{country.protection}</p>
                </div>

                {/* Recovery Timeline Comparison */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Ancient Recovery:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {country.timeline}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Traditional Foreclosure:</span>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                      {country.traditionalTimeline}
                    </Badge>
                  </div>
                </div>

                {/* Legal Basis */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Legal Basis:</span> {country.legalBasis}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Recovery Timeline Comparison</CardTitle>
          <p className="text-center text-sm text-muted-foreground">Ancient vs. Traditional Foreclosure</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Country</th>
                  <th className="text-left py-3 px-4">Legal Structure</th>
                  <th className="text-center py-3 px-4">Ancient Recovery</th>
                  <th className="text-center py-3 px-4">Traditional</th>
                  <th className="text-center py-3 px-4">Time Saved</th>
                </tr>
              </thead>
              <tbody>
                {countryStructures.map((country) => {
                  const ancientDays = parseInt(country.timeline.split('-')[1]);
                  const traditionalYears = parseInt(country.traditionalTimeline.split('-')[1]);
                  const traditionalDays = traditionalYears * 365;
                  const timeSaved = Math.round((traditionalDays - ancientDays) / 30);
                  
                  return (
                    <tr key={country.country} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-medium">{country.country}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{country.structure}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {country.timeline}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                          {country.traditionalTimeline}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-semibold text-green-400">~{timeSaved} months</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="bg-gradient-to-r from-primary/10 via-background to-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            <CheckCircle2 className="h-6 w-6 inline-block mr-2 text-primary" />
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-background/50 rounded-xl border border-border/50">
              <Gavel className="h-8 w-8 mb-3 text-primary" />
              <h4 className="font-semibold text-lg mb-2">Zero Court Dependency</h4>
              <p className="text-sm text-muted-foreground">
                All structures avoid foreclosure courts entirely. Recovery happens through title retention, 
                corporate action, or lease termination—not judicial processes.
              </p>
            </div>
            <div className="p-6 bg-background/50 rounded-xl border border-border/50">
              <Clock className="h-8 w-8 mb-3 text-primary" />
              <h4 className="font-semibold text-lg mb-2">90-Day Maximum Recovery</h4>
              <p className="text-sm text-muted-foreground">
                Worst-case recovery timeline is 90 days (Brazil). Best-case is 30 days (Peru, Greece). 
                Average 60 days across all jurisdictions vs. 2-4 years traditional.
              </p>
            </div>
            <div className="p-6 bg-background/50 rounded-xl border border-border/50">
              <Building2 className="h-8 w-8 mb-3 text-primary" />
              <h4 className="font-semibold text-lg mb-2">Battle-Tested Structures</h4>
              <p className="text-sm text-muted-foreground">
                Each structure is proven by $500M+ tokenization platforms (Tether Gold, RealT, Lofty). 
                We modernize existing property law—we don't replace it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Foreign Ownership Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">Foreign Ownership Status by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <h4 className="font-semibold text-green-400 mb-3">✓ Unrestricted Foreign Ownership</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-xl">🇵🇪</span>
                  <span>Peru - Full freehold ownership allowed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🇧🇷</span>
                  <span>Brazil - Full freehold ownership allowed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🇬🇷</span>
                  <span>Greece - Full freehold ownership allowed (EU rules)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🇹🇷</span>
                  <span>Turkey - Full freehold ownership allowed</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <h4 className="font-semibold text-amber-400 mb-3">⚠️ Restricted (Workarounds Used)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-xl">🇹🇭</span>
                  <span>Thailand - Leasehold structure (30+30 years)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🇲🇽</span>
                  <span>Mexico - Bank trust (Fideicomiso) for coastal zones</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
