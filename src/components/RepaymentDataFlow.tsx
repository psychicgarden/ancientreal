import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Fingerprint, CheckCircle, Award, Database, ArrowDown } from "lucide-react";

export default function RepaymentDataFlow() {
  const steps = [
    { icon: Clock, label: "A timestamp", color: "text-blue-500 bg-blue-500/10" },
    { icon: Fingerprint, label: "A wallet signature", color: "text-purple-500 bg-purple-500/10" },
    { icon: CheckCircle, label: "A verified payment onchain", color: "text-green-500 bg-green-500/10" },
    { icon: Award, label: "A repayment NFT", color: "text-amber-500 bg-amber-500/10" },
    { icon: Database, label: "A permanent credit entry", color: "text-primary bg-primary/10" },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-5 py-1.5 border-primary/50 text-primary">
            The Data
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            What the Data Looks Like
          </h2>
          <p className="text-lg text-muted-foreground">
            Each repayment from a buyer produces:
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="flex flex-col items-center gap-3 max-w-md mx-auto mb-12">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className={`w-full flex items-center gap-4 p-5 rounded-xl border border-border/50 ${step.color.split(' ')[1]}`}>
                <div className={`p-2 rounded-lg ${step.color}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium text-foreground">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Conclusion */}
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            The buyer's credit profile grows with each payment.
          </p>
          <p className="text-lg text-muted-foreground">
            Credit products become accessible once borrowers demonstrate repayment behavior.
          </p>
          <p className="text-xl font-medium text-primary mt-6">
            This solves the global credit gap through real-world proof, not speculation.
          </p>
        </div>
      </div>
    </section>
  );
}
