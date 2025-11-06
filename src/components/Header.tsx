import { Button } from "@/components/ui/button";
import { Menu, X, Settings, Beaker, User, ChevronDown } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useUI } from "@/contexts/UIContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

function Header() {
  // Use centralized UI state instead of local state
  const { state, togglePanel } = useUI();
  const { 
    isConnected, 
    account, 
    chainId,
    networkName,
    isLoading, 
    connectWallet, 
    disconnectWallet,
    isDemoMode,
    toggleDemoMode,
    usdtBalance,
    ethBalance,
    getTestTokens
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      {/* Subtle Live Mode Indicator */}
      {!isDemoMode && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-500/80 to-orange-500/80 backdrop-blur-sm border-b border-amber-200/30">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-white">
                <div className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"></div>
                Live Mode - Demo recommended for testing
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 text-xs px-3 h-6"
                onClick={toggleDemoMode}
              >
                Switch to Demo
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <header className={`fixed left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/30 shadow-sm ${!isDemoMode ? 'top-8' : 'top-0'}`}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-all duration-300 tracking-tight">
                Ancient
              </Link>
            </div>

            {/* Primary Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <div className="flex items-center space-x-1 bg-muted/50 rounded-full p-1">
                <Link to="/investor" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-background rounded-full transition-all duration-200">
                  Invest
                </Link>
                <Link to="/portfolio" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-background rounded-full transition-all duration-200">
                  Portfolio
                </Link>
                <Link to="/banking" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-background rounded-full transition-all duration-200">
                  Banking
                </Link>
              </div>
              
              <div className="w-px h-6 bg-border/50 mx-4"></div>
              
              <div className="flex items-center space-x-1">
                <Link to="/traveler" className="px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Travel
                </Link>
                <Link to="/community" className="px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Community
                </Link>
                <Link to="/developers" className="px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Developers
                </Link>
                <Link to="/business-model" className="px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Business Model
                </Link>
                <Link to="/mobile-demo" className="px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Mobile Demo
                </Link>
                <Link to="/admin/projects" className="px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Admin
                </Link>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Demo Mode Indicator */}
              {isDemoMode && (
                <Badge variant="outline" className="hidden md:flex bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium">
                  Demo Mode
                </Badge>
              )}

              {/* User Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 h-9">
                    {isConnected ? (
                      <>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-medium">{account ? formatAddress(account) : "Connected"}</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        <span className="text-sm">Account</span>
                      </>
                    )}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-background/95 backdrop-blur-xl border-border/50" align="end">
                  <div className="space-y-4">
                    {/* Wallet Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Wallet</h4>
                        {isConnected && (
                          <Button variant="outline" size="sm" onClick={disconnectWallet} className="h-7 text-xs">
                            Disconnect
                          </Button>
                        )}
                      </div>
                      
                      {isConnected ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Address</span>
                            <span className="text-xs font-mono">{account ? formatAddress(account) : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Network</span>
                            <span className="text-xs">{networkName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">USDT</span>
                            <span className="text-xs font-mono">{usdtBalance}</span>
                          </div>
                          {!isDemoMode && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">ETH</span>
                              <span className="text-xs font-mono">{ethBalance}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button onClick={connectWallet} disabled={isLoading} className="w-full h-8 text-sm">
                          {isLoading ? "Connecting..." : "Connect Wallet"}
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Developer Tools */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        <span className="font-semibold text-sm">Developer Tools</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Demo Mode</div>
                          <div className="text-xs text-muted-foreground">Use test tokens</div>
                        </div>
                        <Switch checked={isDemoMode} onCheckedChange={toggleDemoMode} />
                      </div>

                      {isDemoMode && (
                        <div className="space-y-2 pt-2 border-t border-border/50">
                          <Button onClick={getTestTokens} disabled={isLoading} size="sm" className="w-full h-8 text-xs">
                            {isLoading ? "Getting..." : "Get Test Tokens"}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Test tokens for development only
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Sign In */}
                    <Button variant="default" className="w-full h-9">
                      Sign In
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => togglePanel('mobileMenu')}
              >
                {state.panels.mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {state.panels.mobileMenu && (
          <div className="lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-6">
              <nav className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Primary
                  </div>
                  <Link to="/investor" className="block px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    Invest
                  </Link>
                  <Link to="/portfolio" className="block px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    Portfolio
                  </Link>
                  <Link to="/banking" className="block px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    Banking
                  </Link>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    More
                  </div>
                  <Link to="/traveler" className="block px-3 py-2 text-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    Travel
                  </Link>
                  <Link to="/community" className="block px-3 py-2 text-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    Community
                  </Link>
                   <Link to="/developers" className="block px-3 py-2 text-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                     Developers
                   </Link>
                   <Link to="/business-model" className="block px-3 py-2 text-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                     Business Model
                   </Link>
                   <Link to="/mobile-demo" className="block px-3 py-2 text-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                     Mobile Demo
                   </Link>
                   <Link to="/admin/projects" className="block px-3 py-2 text-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                     Admin
                   </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;