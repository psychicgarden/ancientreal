import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  title?: string;
  type?: 'investment' | 'demo' | 'general';
}

export const DisclaimerModal = ({ 
  isOpen, 
  onAccept, 
  onDecline, 
  title = "Investment Risk Disclosure",
  type = 'investment'
}: DisclaimerModalProps) => {
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAcknowledged(false);
    }
  }, [isOpen]);

  const getDisclaimerContent = () => {
    switch (type) {
      case 'investment':
        return {
          title: "Investment Risk Disclosure",
          content: [
            "All investments carry risk of loss and are not guaranteed.",
            "Real estate investments are subject to market fluctuations, property damage, vacancy risk, and regulatory changes.",
            "Projected returns are estimates based on current market conditions and are not guaranteed.",
            "Past performance does not guarantee future results.",
            "You may lose some or all of your investment.",
            "Securities offerings are subject to regulatory approval and may be restricted to accredited investors.",
            "This is a demonstration environment - consult licensed professionals before making actual investments."
          ]
        };
      case 'demo':
        return {
          title: "Demo Environment Notice",
          content: [
            "This platform displays demonstration data for educational purposes only.",
            "Property values, returns, and projections shown may not reflect actual market conditions.",
            "No real transactions will be processed in demo mode.",
            "Actual investment opportunities may differ significantly from demo projections.",
            "Consult licensed financial, legal, and tax advisors before making investment decisions."
          ]
        };
      default:
        return {
          title: "Important Disclaimers",
          content: [
            "This platform provides educational information only.",
            "Not financial, legal, or investment advice.",
            "Consult professionals before making investment decisions.",
            "All projections are estimates and not guaranteed."
          ]
        };
    }
  };

  const { title: modalTitle, content } = getDisclaimerContent();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {title || modalTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Please read and acknowledge the following:</h4>
            <ul className="space-y-2 text-sm">
              {content.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <Checkbox 
              id="acknowledge" 
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
            <label 
              htmlFor="acknowledge" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I acknowledge that I have read, understood, and agree to these disclaimers and risks
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onDecline}>
              Decline
            </Button>
            <Button 
              onClick={onAccept}
              disabled={!acknowledged}
              className="bg-destructive hover:bg-destructive/90"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};