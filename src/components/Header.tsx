import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Ancient
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/investor" className="text-foreground/80 hover:text-foreground transition-colors">
              Investor
            </a>
            <a href="/traveler" className="text-foreground/80 hover:text-foreground transition-colors">
              Travel
            </a>
            <a href="/host" className="text-foreground/80 hover:text-foreground transition-colors">
              Host
            </a>
            <a href="#developers" className="text-foreground/80 hover:text-foreground transition-colors">
              Developers
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline">Connect Wallet</Button>
            <Button variant="ghost">Sign In</Button>
            <Button variant="default">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              <a href="/investor" className="text-foreground/80 hover:text-foreground transition-colors">
                Investor
              </a>
              <a href="/traveler" className="text-foreground/80 hover:text-foreground transition-colors">
                Travel
              </a>
              <a href="/host" className="text-foreground/80 hover:text-foreground transition-colors">
                Host
              </a>
              <a href="#developers" className="text-foreground/80 hover:text-foreground transition-colors">
                Developers
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline">Connect Wallet</Button>
                <Button variant="ghost">Sign In</Button>
                <Button variant="default">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;