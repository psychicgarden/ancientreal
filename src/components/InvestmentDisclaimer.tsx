import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvestmentDisclaimerProps {
  variant?: 'warning' | 'info';
  compact?: boolean;
  className?: string;
}

export const InvestmentDisclaimer = ({ 
  variant = 'warning', 
  compact = false,
  className = ''
}: InvestmentDisclaimerProps) => {
  const Icon = variant === 'warning' ? AlertTriangle : Info;
  
  if (compact) {
    return (
      <div className={`text-xs text-muted-foreground p-2 bg-muted/30 rounded ${className}`}>
        <p className="flex items-center gap-1">
          <Icon className="w-3 h-3" />
          Investment risk: Past performance does not guarantee future results. All investments carry risk of loss.
        </p>
      </div>
    );
  }

  return (
    <Alert className={`border-destructive/50 ${className}`}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="space-y-2">
        <div className="font-semibold">Investment Risk Disclosure</div>
        <ul className="text-sm space-y-1 ml-4">
          <li>• All investments carry risk of loss and are not guaranteed</li>
          <li>• Real estate investments subject to market fluctuations and vacancy risk</li>
          <li>• Projected returns are estimates and may not be achieved</li>
          <li>• Past performance does not guarantee future results</li>
          <li>• Demo environment - consult professionals before investing</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};