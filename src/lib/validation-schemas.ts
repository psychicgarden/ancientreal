import { z } from 'zod';

// Common validation patterns
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number');
export const walletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address');
export const positiveNumberSchema = z.number().positive('Must be a positive number');
export const currencyAmountSchema = z.number().min(0.01, 'Amount must be at least $0.01');

// Investment validation schemas
export const investmentAmountSchema = z.object({
  amount: currencyAmountSchema.min(50, 'Minimum investment is $50'),
  currency: z.enum(['USDT', 'USDC', 'USD']).default('USDT'),
});

export const fractionalInvestmentSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  investmentAmount: currencyAmountSchema.min(50, 'Minimum investment is $50'),
  ownershipPercentage: z.number().min(0.001).max(100, 'Ownership must be between 0.001% and 100%'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  riskDisclosure: z.boolean().refine(val => val === true, 'You must acknowledge the risk disclosure'),
});

export const propertyPurchaseSchema = z.object({
  propertyId: z.number().positive('Invalid property ID'),
  purchasePrice: currencyAmountSchema.min(10000, 'Minimum purchase price is $10,000'),
  downPayment: currencyAmountSchema.min(1000, 'Minimum down payment is $1,000'),
  mortgageTerms: z.object({
    termMonths: z.number().min(12).max(360, 'Term must be between 12 and 360 months'),
    aprBps: z.number().min(100).max(3000, 'APR must be between 1% and 30%'),
  }),
  walletAddress: walletAddressSchema,
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
});

export const mortgagePaymentSchema = z.object({
  propertyId: z.number().positive('Invalid property ID'),
  paymentAmount: currencyAmountSchema.min(1, 'Payment amount must be at least $1'),
  paymentType: z.enum(['scheduled', 'extra_principal', 'full_payoff']),
  walletAddress: walletAddressSchema,
});

// Staking validation schemas
export const stakingSchema = z.object({
  amount: currencyAmountSchema.min(10, 'Minimum staking amount is $10'),
  stakingPeriod: z.enum(['flexible', '30d', '90d', '180d', '365d']),
  autoReinvest: z.boolean().default(false),
  walletAddress: walletAddressSchema,
});

// Project submission schemas
export const projectSubmissionSchema = z.object({
  // Basic Information
  projectTitle: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  projectDescription: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description must be less than 5000 characters'),
  projectCategory: z.enum(['development', 'renovation', 'infrastructure', 'community']),
  
  // Financial Information
  targetFunding: currencyAmountSchema.min(10000, 'Minimum target funding is $10,000'),
  minInvestment: currencyAmountSchema.min(100, 'Minimum investment must be at least $100'),
  maxInvestment: currencyAmountSchema.optional(),
  estimatedYield: z.number().min(1).max(100, 'Estimated yield must be between 1% and 100%'),
  
  // Timeline and Contact
  timeline: z.string().min(10, 'Timeline description required'),
  fundingDeadline: z.date().min(new Date(), 'Funding deadline must be in the future'),
  
  // Creator Information
  creatorName: z.string().min(2, 'Creator name required'),
  creatorEmail: emailSchema,
  creatorWalletAddress: walletAddressSchema,
  
  // Legal and Compliance
  businessPlan: z.object({
    summary: z.string().min(100, 'Business plan summary required'),
    marketAnalysis: z.string().min(100, 'Market analysis required'),
    revenueModel: z.string().min(50, 'Revenue model required'),
  }),
  
  complianceStatus: z.enum(['pending', 'in_review', 'approved']).default('pending'),
  legalStructure: z.string().min(10, 'Legal structure information required'),
  
  // Optional fields
  githubRepoUrl: z.string().url('Invalid GitHub URL').optional(),
  demoUrl: z.string().url('Invalid demo URL').optional(),
});

// User profile schemas
export const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  investorType: z.enum(['retail', 'accredited', 'institutional']),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']),
  preferredCommunication: z.enum(['email', 'sms', 'both']).default('email'),
});

// KYC validation schemas
export const kycPersonalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  dateOfBirth: z.date().max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'Must be at least 18 years old'),
  nationality: z.string().min(2, 'Nationality required'),
  phoneNumber: phoneSchema,
  email: emailSchema,
});

export const kycAddressSchema = z.object({
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State/Province required'),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
});

export const kycDocumentSchema = z.object({
  documentType: z.enum(['passport', 'drivers_license', 'national_id']),
  documentNumber: z.string().min(5, 'Document number required'),
  expiryDate: z.date().min(new Date(), 'Document must not be expired'),
  documentImages: z.array(z.string().url()).min(1, 'At least one document image required'),
});

export const kycFinancialSchema = z.object({
  employmentStatus: z.enum(['employed', 'self_employed', 'unemployed', 'retired', 'student']),
  annualIncome: z.enum(['under_50k', '50k_100k', '100k_250k', '250k_500k', 'over_500k']),
  sourceOfFunds: z.enum(['salary', 'business', 'investments', 'inheritance', 'other']),
  investmentExperience: z.enum(['none', 'limited', 'moderate', 'extensive']),
  netWorth: z.enum(['under_100k', '100k_500k', '500k_1m', '1m_5m', 'over_5m']),
});

// Trading schemas
export const secondaryOrderSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  orderType: z.enum(['market', 'limit']),
  side: z.enum(['buy', 'sell']),
  tokenAmount: positiveNumberSchema,
  pricePerToken: currencyAmountSchema.optional(),
  timeInForce: z.enum(['GTC', 'IOC', 'FOK', '1d', '7d', '30d']).default('GTC'),
  slippageTolerance: z.number().min(0.1).max(10, 'Slippage must be between 0.1% and 10%').default(0.5),
});

// Chat and support schemas
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  context: z.object({
    page: z.string().optional(),
    userAction: z.string().optional(),
    walletConnected: z.boolean().optional(),
  }).optional(),
});

// Form validation helpers
export type InvestmentAmountForm = z.infer<typeof investmentAmountSchema>;
export type FractionalInvestmentForm = z.infer<typeof fractionalInvestmentSchema>;
export type PropertyPurchaseForm = z.infer<typeof propertyPurchaseSchema>;
export type MortgagePaymentForm = z.infer<typeof mortgagePaymentSchema>;
export type StakingForm = z.infer<typeof stakingSchema>;
export type ProjectSubmissionForm = z.infer<typeof projectSubmissionSchema>;
export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type KycPersonalInfoForm = z.infer<typeof kycPersonalInfoSchema>;
export type KycAddressForm = z.infer<typeof kycAddressSchema>;
export type KycDocumentForm = z.infer<typeof kycDocumentSchema>;
export type KycFinancialForm = z.infer<typeof kycFinancialSchema>;
export type SecondaryOrderForm = z.infer<typeof secondaryOrderSchema>;
export type ChatMessageForm = z.infer<typeof chatMessageSchema>;