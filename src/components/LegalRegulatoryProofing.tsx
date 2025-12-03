import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Building2, Globe, CheckCircle2, Scale, AlertTriangle, Lock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const industryLeaders = [
  {
    name: "Tether Gold (XAUT)",
    aum: "$500M+ AUM",
    points: [
      "Physical gold stored in Swiss vaults",
      "Tether International Limited (SPV) holds legal title",
      "XAUT tokens represent beneficial ownership claims",
      "Switzerland doesn't recognize blockchain tokens as legal gold title"
    ],
    result: "Fully functional, legally compliant, institutionally trusted"
  },
  {
    name: "RealT",
    aum: "$100M+ U.S. Properties",
    points: [
      "Properties owned by individual LLCs (SPVs)",
      "Token holders own membership interests in LLCs",
      "No direct deed tokenization"
    ],
    result: "Regulatory compliant across all U.S. states"
  },
  {
    name: "Reental",
    aum: "€32.5M European Assets",
    points: [
      "Spanish properties held by SPV entities",
      "Tokens represent economic rights, not deeds",
      "Over 22,500 verified investors"
    ],
    result: "Operating successfully across Spain, Mexico, U.S., and LatAm"
  }
];

const countryCompliance = [
  {
    country: "Mexico",
    flag: "🇲🇽",
    project: "Mazunte Project",
    structure: "Mexican SPV (Sociedad Anónima de Capital Variable - S.A. de C.V.)",
    regulations: [
      { label: "CNBV (National Banking and Securities Commission)", desc: "S.A. de C.V. shares are regulated securities" },
      { label: "Property Registry", desc: "Company holds registered title at Registro Público de la Propiedad" },
      { label: "Foreign Investment", desc: "Compliant with Foreign Investment Law (Ley de Inversión Extranjera)" },
      { label: "AMIB Compliance", desc: "Mexican Securities Market Association standards" },
      { label: "Golden Visa Alternative", desc: "Path to permanent residency through investment" },
      { label: "Tax Optimization", desc: "Favorable corporate tax structure for international investors" }
    ],
    precedent: "Multiple international real estate platforms operate successfully in Mexico using identical SPV structures, with Tulum real estate appreciation of 300%+ over recent years"
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    project: "Bahia Project",
    structure: "Brazilian LTDA (Limited Liability Company)",
    regulations: [
      { label: "CVM (Securities Commission)", desc: "LTDA quotas qualify as securities under Brazilian law" },
      { label: "Property Law", desc: "LTDA holds registered property title at local cartório" },
      { label: "Foreign Investment", desc: "Compliant with Lei 4.131/62 for foreign capital" },
      { label: "Token Classification", desc: "Represents LTDA quotas, not direct property rights" },
      { label: "Tax Optimization", desc: "LTDA structure provides favorable corporate tax treatment" }
    ],
    precedent: "Terram tokenized R$50M+ Brazilian real estate using identical SPV structures"
  },
  {
    country: "Greece",
    flag: "🇬🇷",
    project: "Corfu Project",
    structure: "Greek IKE (Private Company)",
    regulations: [
      { label: "HCMC (Hellenic Capital Market Commission)", desc: "IKE shares are recognized securities" },
      { label: "Property Registry", desc: "IKE registered as legal property owner" },
      { label: "Golden Visa Compliance", desc: "Structure supports Greece's €250K residency program" },
      { label: "EU MiCA Preparation", desc: "Forward-compatible with upcoming EU token regulations" },
      { label: "Tax Benefits", desc: "Greek IKE enjoys competitive corporate tax rates (24%)" }
    ],
    precedent: "Greece actively promotes blockchain innovation through regulatory sandbox programs"
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    project: "Mallorca Project",
    structure: "Spanish SL (Sociedad Limitada)",
    regulations: [
      { label: "CNMV (Securities Market Commission)", desc: "SL participaciones are established securities" },
      { label: "Property Registration", desc: "SL holds registered title at Registro de la Propiedad" },
      { label: "EU Passporting", desc: "Structure enables future EU-wide token distribution" },
      { label: "MiCA Compliance", desc: "Spain leads EU's Markets in Crypto-Assets regulation" },
      { label: "Golden Visa Alignment", desc: "€500K investment threshold compatibility" }
    ],
    precedent: "Reental operates identical SL structures across Spain with €32.5M in assets"
  },
  {
    country: "Thailand",
    flag: "🇹🇭",
    project: "Koh Phangan Project",
    structure: "30+30 Year Leasehold via Thai SPV",
    regulations: [
      { label: "SEC Thailand", desc: "Company shares classified as securities under Thai law" },
      { label: "Land Department", desc: "Thai company holds registered leasehold rights" },
      { label: "Foreign Ownership", desc: "Compliant with 49% foreign ownership limits via nominee structure" },
      { label: "BOI Benefits", desc: "Potential Board of Investment incentives for tech innovation" },
      { label: "Renewable Structure", desc: "30+30 year leases provide 60-year economic rights" }
    ],
    precedent: "Multiple international developers use identical leasehold SPV structures in Thailand"
  },
  {
    country: "Turkey",
    flag: "🇹🇷",
    project: "Antalya Project",
    structure: "Turkish SPV (Limited Şirket)",
    regulations: [
      { label: "CMB (Capital Markets Board)", desc: "Company shares are regulated securities" },
      { label: "Land Registry", desc: "Turkish company holds tapu (property title)" },
      { label: "Citizenship Program", desc: "€400K investment qualifies for Turkish citizenship" },
      { label: "Strategic Location", desc: "Bridge between European and Asian markets" },
      { label: "Currency Hedge", desc: "Turkish lira depreciation benefits foreign investors" }
    ],
    precedent: "Turkey's citizenship-by-investment program adds significant value proposition"
  }
];

const competitiveMatrix = [
  { platform: "Tether Gold", aum: "$500M+", structure: "Swiss SPV", token: "ERC-20", status: "Fully Compliant" },
  { platform: "RealT", aum: "$100M+", structure: "U.S. LLCs", token: "ERC-20", status: "SEC Compliant" },
  { platform: "Reental", aum: "€32.5M", structure: "Spanish SPVs", token: "Proprietary", status: "EU Compliant" },
  { platform: "Ancient", aum: "$24.5M Projected", structure: "Multi-Jurisdiction SPVs", token: "ERC-20/ERC-3643", status: "Enhanced Compliance", highlight: true }
];

const bottomLinePoints = [
  "Proven SPV Framework: Same structure as industry leaders",
  "Multi-Jurisdiction Optimization: Legal arbitrage for maximum protection",
  "Institutional Compliance: Ready for traditional finance integration",
  "Transparent Operations: Blockchain eliminates opacity and manual errors",
  "Automated Governance: Smart contracts reduce counterparty risk"
];

export function LegalRegulatoryProofing() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Scale className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Legal & Regulatory Proofing</h2>
        </div>
        <p className="text-xl text-muted-foreground">Global Real Estate Tokenization Structure</p>
      </div>

      {/* Executive Summary */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Executive Summary: Proven Legal Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Ancient Real Estate operates using the same <span className="text-foreground font-semibold">battle-tested legal structure</span> as $500M+ Tether Gold (XAUT) and leading tokenized real estate platforms globally. Our model doesn't replace property law—it <span className="text-foreground font-semibold">modernizes ownership records, cash flow distribution, and governance</span> through blockchain technology while maintaining full legal compliance.
          </p>
        </CardContent>
      </Card>

      {/* Core Legal Structure - SPV Model */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Core Legal Structure: The SPV Model
          </CardTitle>
          <CardDescription>How Industry Leaders Structure Tokenization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Industry Leaders */}
          <div className="grid md:grid-cols-3 gap-4">
            {industryLeaders.map((leader) => (
              <Card key={leader.name} className="bg-muted/30 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{leader.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{leader.aum}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {leader.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-sm font-medium text-emerald-400">Result: {leader.result}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ancient's Enhanced Structure */}
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-xl">Ancient's Enhanced Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Structure Flow */}
              <div className="flex flex-col items-center gap-3 text-center font-mono">
                <Badge variant="outline" className="px-6 py-2.5 text-sm">Nevis Holding Company (Master Entity)</Badge>
                <span className="text-2xl text-muted-foreground">↓</span>
                <Badge variant="outline" className="px-6 py-2.5 text-sm">Country-Specific SPVs (Property Holders)</Badge>
                <span className="text-2xl text-muted-foreground">↓</span>
                <Badge variant="outline" className="px-6 py-2.5 text-sm">Tokenized Beneficial Ownership (ERC-20/ERC-3643)</Badge>
                <span className="text-2xl text-muted-foreground">↓</span>
                <Badge variant="outline" className="px-6 py-2.5 text-sm">Smart Contract Automation (Cash Flow, Governance, Exits)</Badge>
              </div>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {[
                  { check: true, text: "Bulletproof Legal Chain: Nevis → Local SPV → Property Title" },
                  { check: true, text: "Regulatory Arbitrage: Optimal jurisdiction selection per market" },
                  { check: true, text: "Institutional Grade: Same structure used by billion-dollar assets" },
                  { check: true, text: "Full Transparency: On-chain ownership records and cash flows" },
                  { check: true, text: "Automated Compliance: Smart contracts handle distributions and governance" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Country-Specific Regulatory Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Country-Specific Regulatory Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {countryCompliance.map((country) => (
              <Card key={country.country} className="bg-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <CardTitle className="text-xl">{country.country}</CardTitle>
                      <CardDescription>{country.project}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Legal Structure */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 font-medium">Legal Structure</p>
                    <Badge variant="outline" className="font-mono text-xs">{country.structure}</Badge>
                  </div>

                  {/* Regulatory Framework */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">Regulatory Framework</p>
                    <ul className="space-y-2">
                      {country.regulations.map((reg, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium text-foreground">{reg.label}:</span>{" "}
                          <span className="text-muted-foreground">{reg.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Market Precedent */}
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs">
                      <span className="font-semibold text-primary">Market Precedent:</span>{" "}
                      <span className="text-muted-foreground">{country.precedent}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantage Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Competitive Advantage Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>AUM/Market Cap</TableHead>
                  <TableHead>Legal Structure</TableHead>
                  <TableHead>Token Standard</TableHead>
                  <TableHead>Regulatory Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitiveMatrix.map((row) => (
                  <TableRow key={row.platform} className={row.highlight ? "bg-primary/10" : ""}>
                    <TableCell className="font-medium">{row.platform}</TableCell>
                    <TableCell>{row.aum}</TableCell>
                    <TableCell>{row.structure}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{row.token}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.highlight ? "default" : "secondary"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Line */}
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-400" />
            Bottom Line: Battle-Tested Legal Innovation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-lg">
            Ancient Real Estate doesn't reinvent property law—we <span className="text-foreground font-semibold">modernize it</span>. Our legal structure mirrors billion-dollar assets like Tether Gold while providing enhanced investor protections through:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bottomLinePoints.map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-base font-medium text-emerald-400 pt-4 text-center">
            We're not early-stage experimenters—we're applying proven legal frameworks to high-growth emerging markets with institutional-grade execution.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LegalRegulatoryProofing;
