import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Settings, Beaker } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeveloperPanelOpen, setIsDeveloperPanelOpen] = useState(false);
  const { 
    isConnected, 
    account, 
    isLoading, 
    connectWallet, 
    disconnectWallet,
    isDemoMode,
    toggleDemoMode,
    usdtBalance,
    getTestTokens
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Ancient
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/investor" className="text-foreground/80 hover:text-foreground transition-colors">
              Invest
            </Link>
            <Link to="/portfolio" className="text-foreground/80 hover:text-foreground transition-colors">
              Portfolio
            </Link>
            <Link to="/traveler" className="text-foreground/80 hover:text-foreground transition-colors">
              Travel
            </Link>
            <Link to="/community" className="text-foreground/80 hover:text-foreground transition-colors">
              Community
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-full">
                  {formatAddress(account!)}
                </span>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={connectWallet}
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}

            {/* Demo Mode Controls - Subtle */}
            {isDemoMode && (
              <Popover open={isDeveloperPanelOpen} onOpenChange={setIsDeveloperPanelOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-60 hover:opacity-100">
                    <Settings className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        Developer Tools
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        Demo
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Demo Mode</div>
                        <div className="text-xs text-muted-foreground">
                          Test environment
                        </div>
                      </div>
                      <Switch
                        checked={isDemoMode}
                        onCheckedChange={toggleDemoMode}
                      />
                    </div>

                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Test Balance:</span>
                        <span className="text-sm font-mono">{usdtBalance} USDT</span>
                      </div>
                      
                      <Button 
                        onClick={getTestTokens}
                        disabled={isLoading}
                        size="sm"
                        className="w-full"
                      >
                        {isLoading ? "Getting..." : "Get Test Tokens"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <Button variant="default" size="sm">Sign In</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              <Link to="/investor" className="text-foreground/80 hover:text-foreground transition-colors">
                Invest
              </Link>
              <Link to="/portfolio" className="text-foreground/80 hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <Link to="/traveler" className="text-foreground/80 hover:text-foreground transition-colors">
                Travel
              </Link>
              <Link to="/community" className="text-foreground/80 hover:text-foreground transition-colors">
                Community
              </Link>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-border/50">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-2 rounded">
                      {formatAddress(account!)}
                    </div>
                    <Button variant="outline" onClick={disconnectWallet} className="w-full">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                )}
                
                {/* Demo Mode Toggle for Mobile */}
                {isDemoMode && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Demo Mode</span>
                    <Switch
                      checked={isDemoMode}
                      onCheckedChange={toggleDemoMode}
                    />
                  </div>
                )}
                
                <Button variant="default" className="w-full">Sign In</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;