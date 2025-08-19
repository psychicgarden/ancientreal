import React from 'react';
import { ValidatedForm } from '@/components/ui/validated-form';
import { TextField, NumberField, SelectField, CheckboxField } from '@/components/ui/form-fields';
import { fractionalInvestmentSchema, FractionalInvestmentForm } from '@/lib/validation-schemas';
import { api } from '@/lib/api';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, AlertTriangle } from 'lucide-react';

interface EnhancedFractionalInvestmentFormProps {
  property: {
    id: string;
    name: string;
    location: string;
    currentSpeculationPrice: number;
    minInvestment: number;
    totalTokensAvailable: number;
    tokensSold: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export const EnhancedFractionalInvestmentForm: React.FC<EnhancedFractionalInvestmentFormProps> = ({
  property,
  onSuccess,
  onCancel
}) => {
  const { account } = useWallet();

  const handleSubmit = async (data: FractionalInvestmentForm) => {
    const result = await api.supabase.createFractionalInvestment({
      property_id: data.propertyId,
      investor_wallet_address: account,
      investment_amount: data.investmentAmount,
      token_amount: (data.investmentAmount / property.currentSpeculationPrice) * property.totalTokensAvailable,
      ownership_percentage: data.ownershipPercentage,
      original_property_price: property.currentSpeculationPrice,
      speculation_price: property.currentSpeculationPrice,
      status: 'active'
    });

    if (!result.success) {
      throw new Error(result.error || 'Investment failed');
    }

    onSuccess();
  };

  const defaultValues: Partial<FractionalInvestmentForm> = {
    propertyId: property.id,
    investmentAmount: property.minInvestment,
    acceptTerms: false,
    riskDisclosure: false,
  };

  const calculateOwnership = (amount: number) => {
    return property.currentSpeculationPrice > 0 
      ? (amount / property.currentSpeculationPrice) * 100 
      : 0;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Invest in {property.name}
        </DialogTitle>
      </DialogHeader>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Property Summary */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Property:</span>
                <span className="ml-2 font-medium">{property.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <span className="ml-2 font-medium">{property.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Current Price:</span>
                <span className="ml-2 font-medium">${property.currentSpeculationPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Min Investment:</span>
                <span className="ml-2 font-medium">${property.minInvestment}</span>
              </div>
            </div>
          </div>

          <ValidatedForm
            schema={fractionalInvestmentSchema}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            resetOnSuccess={false}
            successMessage="Investment completed successfully!"
            loadingMessage="Processing your investment..."
            submitText="Complete Investment"
            showSubmitButton={false}
          >
            {(form) => (
              <div className="space-y-6">
                {/* Investment Amount */}
                <NumberField
                  form={form}
                  name="investmentAmount"
                  label="Investment Amount"
                  currency
                  min={property.minInvestment}
                  placeholder={property.minInvestment.toString()}
                  description={`Minimum investment: $${property.minInvestment}`}
                  required
                />

                {/* Calculated Ownership */}
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ownership Percentage:</span>
                      <Badge variant="secondary">
                        {calculateOwnership(form.watch('investmentAmount') || 0).toFixed(4)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tokens Received:</span>
                      <span className="text-sm font-medium">
                        {Math.round(((form.watch('investmentAmount') || 0) / property.currentSpeculationPrice) * property.totalTokensAvailable).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Risk Disclosure */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-orange-800">Investment Risk Disclosure</h4>
                      <p className="text-sm text-orange-700">
                        Real estate investments carry inherent risks including market volatility, 
                        property depreciation, and potential loss of principal. Past performance 
                        does not guarantee future results.
                      </p>
                    </div>
                  </div>

                  <CheckboxField
                    form={form}
                    name="riskDisclosure"
                    label="Risk Disclosure"
                    text="I acknowledge and understand the investment risks"
                    description="Required to proceed with investment"
                    required
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-800">Terms & Conditions</h4>
                      <p className="text-sm text-blue-700">
                        By investing, you agree to our investment terms, platform fees (3%), 
                        and fractional ownership structure. Investments are subject to 
                        regulatory compliance and may have holding period requirements.
                      </p>
                    </div>
                  </div>

                  <CheckboxField
                    form={form}
                    name="acceptTerms"
                    label="Terms & Conditions"
                    text="I accept the terms and conditions"
                    description="Required to complete investment"
                    required
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                    className="flex-1"
                  >
                    {form.formState.isSubmitting ? 'Processing...' : 'Complete Investment'}
                  </Button>
                </div>
              </div>
            )}
          </ValidatedForm>
        </div>
      </DialogContent>
    </>
  );
};