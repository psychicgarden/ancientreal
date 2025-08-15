import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-8 border-t border-border/30 bg-card/30 backdrop-blur-sm", className)}>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Link to="/" className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Ancient
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Conscious real estate for a modern, nomadic life. Elegance, community, and sound finance.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Platform</p>
              <Link to="/investor" className="hover-scale text-foreground/80 hover:text-foreground">Invest</Link>
              <Link to="/portfolio" className="hover-scale text-foreground/80 hover:text-foreground">Portfolio</Link>
              <Link to="/banking" className="hover-scale text-foreground/80 hover:text-foreground">Banking</Link>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Explore</p>
              <Link to="/traveler" className="hover-scale text-foreground/80 hover:text-foreground">Travel</Link>
              <Link to="/community" className="hover-scale text-foreground/80 hover:text-foreground">Community</Link>
              <Link to="/developers" className="hover-scale text-foreground/80 hover:text-foreground">Developers</Link>
            </div>
          </nav>

          <div className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Newsletter</p>
            <p className="text-muted-foreground">Join for curated properties and market notes.</p>
            <form className="flex gap-2">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="flex-1 rounded-lg bg-background/70 border border-border/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                aria-label="Email address"
              />
              <button className="rounded-lg px-4 py-2 text-sm bg-gradient-primary text-primary-foreground hover:shadow-button transition-all">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div className="mt-8 pt-6 border-t border-border/20">
          <div className="space-y-4 text-xs text-muted-foreground">
            <div className="bg-card/50 p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Investment Risk Disclosure</h4>
              <p className="leading-relaxed">
                All investments carry risk of loss. Real estate investments are subject to market fluctuations, 
                property damage, vacancy risk, and regulatory changes. Past performance does not guarantee future results. 
                Projected returns are estimates based on current market conditions and are not guaranteed.
              </p>
            </div>
            
            <div className="bg-card/50 p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Demo Environment Notice</h4>
              <p className="leading-relaxed">
                This platform displays demonstration data for educational purposes. Property values, returns, 
                and projections shown may not reflect actual market conditions. Consult licensed professionals 
                before making investment decisions.
              </p>
            </div>
            
            <div className="bg-card/50 p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Regulatory Compliance</h4>
              <p className="leading-relaxed">
                Securities offerings subject to regulatory approval. Not an offer of securities in jurisdictions 
                where prohibited. Investments may be limited to accredited investors. Consult legal and tax 
                advisors regarding your specific situation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ancient. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/legal" className="hover:text-foreground">Legal</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
