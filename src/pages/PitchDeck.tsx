import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Maximize2, Minimize2, Home, ZoomIn, ZoomOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function PitchDeck() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50));

  const pdfUrl = "/documents/ancient-pitch-deck.pdf";

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header Controls */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Ancient Protocol Pitch Deck</h1>
              <Badge variant="outline" className="text-xs">CONFIDENTIAL INVESTOR MATERIALS</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Download Button */}
            <a href={pdfUrl} download="Ancient-Protocol-Pitch-Deck.pdf">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </a>

            {/* Fullscreen Toggle */}
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-muted/30" style={{ height: isFullscreen ? 'calc(100vh - 60px)' : 'calc(100vh - 120px)' }}>
        <iframe
          src={`${pdfUrl}#zoom=${zoom}&toolbar=0&navpanes=0`}
          className="w-full h-full border-0"
          title="Ancient Protocol Pitch Deck"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        />
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>23 Pages • Confidential</span>
          <div className="flex items-center gap-4">
            <Link to="/business-model" className="hover:text-primary transition-colors">
              View Business Model →
            </Link>
            <Link to="/investor-report" className="hover:text-primary transition-colors">
              Investment Memo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
