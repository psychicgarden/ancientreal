# Complete Mathematical Breakdown - Real Estate Investment Business Model

## ASSUMPTIONS (Used in All Calculations)

### Fixed Business Assumptions
- **Total Units**: 112 properties
- **Average Property Price**: $143,000 per unit
- **Platform Fee Rate**: 3.5% (0.035) on all sales
- **Down Payment Rate**: 20% (buyer pays 20% down, platform finances 80%)
- **Initial Platform Investment**: $3,000,000 (used to finance properties)
- **Property Appreciation Rate**: 7% annually (compounding)
- **SAM (Shared Appreciation Mortgage) Share**: 30% of total appreciation (SAM model only)

### Variable Parameters (Adjustable in Dashboard)
- **APR (Annual Percentage Rate)**: 5% - 12% (user adjustable)
- **Cash Purchase Rate**: 10% - 40% (percentage of buyers who pay cash instead of financing)
- **Mortgage Term**: 10 - 30 years

---

## MODEL 1: SAM MODEL (Shared Appreciation Mortgage)

### Revenue Components
1. **Platform Fees** (immediate, upfront)
2. **Mortgage Interest** (over term years)
3. **Appreciation Share** (30% of property appreciation at end of term)

### STEP-BY-STEP CALCULATIONS

#### Example Input Values (from screenshot):
- APR: 10.5%
- Cash Purchase Rate: 25%
- Term: 10 years

#### Step 1: Unit Distribution
```
Cash Units = ROUND(Total Units × Cash Purchase Rate)
Cash Units = ROUND(112 × 0.25) = 28 units

Financed Units = Total Units - Cash Units
Financed Units = 112 - 28 = 84 units
```

#### Step 2: Platform Fees (All Sales)
```
Total Sales Value = Total Units × Avg Property Price
Total Sales Value = 112 × $143,000 = $16,016,000

Platform Fees = Total Sales Value × Platform Fee Rate
Platform Fees = $16,016,000 × 0.035 = $560,560
Platform Fees = $0.56M
```

#### Step 3: Mortgage Interest Revenue

**3a. Calculate Loan Amount**
```
Loan Per Unit = Avg Property Price × (1 - Down Payment Rate)
Loan Per Unit = $143,000 × (1 - 0.20)
Loan Per Unit = $143,000 × 0.80 = $114,400

Total Loan Amount = Financed Units × Loan Per Unit
Total Loan Amount = 84 × $114,400 = $9,609,600
```

**3b. Calculate Monthly Payment (Standard Amortization Formula)**
```
Monthly Rate (r) = APR / 100 / 12
Monthly Rate = 10.5 / 100 / 12 = 0.00875

Number of Payments (n) = Term Years × 12
Number of Payments = 10 × 12 = 120 payments

Monthly Payment Formula:
M = P × [r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
- M = Monthly payment
- P = Principal (total loan amount)
- r = Monthly interest rate
- n = Number of payments

M = $9,609,600 × [0.00875 × (1.00875)^120] / [(1.00875)^120 - 1]
M = $9,609,600 × [0.00875 × 2.8395] / [2.8395 - 1]
M = $9,609,600 × [0.024846] / [1.8395]
M = $9,609,600 × 0.013509
M = $129,824.57 per month (total for all 84 units)
```

**3c. Calculate Total Interest**
```
Total Paid Over Loan Term = Monthly Payment × Number of Payments
Total Paid = $129,824.57 × 120 = $15,578,948

Mortgage Interest = Total Paid - Principal
Mortgage Interest = $15,578,948 - $9,609,600 = $5,969,348
Mortgage Interest = $5.97M
```

#### Step 4: Appreciation Share (30% SAM)

**4a. Calculate Property Appreciation**
```
Final Property Value = Total Units × Avg Price × (1 + Appreciation Rate)^Term Years
Final Property Value = 112 × $143,000 × (1.07)^10
Final Property Value = $16,016,000 × 1.9672
Final Property Value = $31,506,675

Total Appreciation = Final Value - Initial Value
Total Appreciation = $31,506,675 - $16,016,000 = $15,490,675
```

**4b. Platform's Share (30% SAM)**
```
Appreciation Share = Total Appreciation × SAM Share
Appreciation Share = $15,490,675 × 0.30 = $4,647,202
Appreciation Share = $4.65M
```

#### Step 5: Total Revenue (SAM Model)
```
Total Revenue = Platform Fees + Mortgage Interest + Appreciation Share
Total Revenue = $0.56M + $5.97M + $4.65M = $11.18M
```

#### Step 6: IRR Calculation (Internal Rate of Return)

**Cash Flow Structure:**
- **Year 0**: +$0.56M (platform fees) - $3.00M (initial investment) = **-$2.44M**
- **Years 1-9**: +$0.597M per year (mortgage interest)
- **Year 10**: +$0.597M + $4.65M (appreciation share) = **+$5.247M**

**IRR Formula (Newton-Raphson Method):**

Find the discount rate (r) where Net Present Value (NPV) = 0:
```
NPV = -2.44 / (1+r)^0 + 0.597 / (1+r)^1 + 0.597 / (1+r)^2 + ... + 5.247 / (1+r)^10 = 0
```

Using iterative Newton-Raphson method:
```
IRR ≈ 25.3% (from your screenshot)
```

#### Step 7: Cash Multiple (ROI)
```
Cash Multiple = Total Revenue / Initial Investment
Cash Multiple = $11.18M / $3.00M = 3.73x
```

---

## MODEL 2: MORTGAGE-ONLY MODEL (No SAM - Buyer Owns 100% Appreciation)

### Revenue Components
1. **Platform Fees** (immediate, upfront) - SAME
2. **Mortgage Interest** (over term years) - SAME
3. **Appreciation Share** - **$0** (buyer keeps 100%)

### STEP-BY-STEP CALCULATIONS

Using same example inputs: APR 10.5%, Cash Rate 25%, Term 10 years

#### Steps 1-3: IDENTICAL to SAM Model
```
Platform Fees = $0.56M (same)
Mortgage Interest = $5.97M (same)
Appreciation Share = $0 (REMOVED)
```

#### Step 4: Total Revenue (Mortgage-Only)
```
Total Revenue = Platform Fees + Mortgage Interest
Total Revenue = $0.56M + $5.97M = $6.53M
```

**Revenue Difference:**
```
SAM Model Revenue: $11.18M
Mortgage-Only Revenue: $6.53M
Revenue Loss: $4.65M (the 30% appreciation share)
Percentage Loss: 41.6%
```

#### Step 5: IRR Calculation (Mortgage-Only)

**Cash Flow Structure:**
- **Year 0**: +$0.56M - $3.00M = **-$2.44M**
- **Years 1-10**: +$0.597M per year (mortgage interest only)
- **NO appreciation windfall at Year 10**

**IRR Formula:**
```
NPV = -2.44 / (1+r)^0 + 0.597 / (1+r)^1 + 0.597 / (1+r)^2 + ... + 0.597 / (1+r)^10 = 0
```

Using Newton-Raphson method:
```
IRR ≈ 20.7% (from your screenshot)
```

#### Step 6: Cash Multiple
```
Cash Multiple = $6.53M / $3.00M = 2.18x
```

#### Step 7: Net Profit
```
Net Profit = Total Revenue - Initial Investment
Net Profit = $6.53M - $3.00M = $3.53M
```

#### Step 8: Total Return %
```
Total Return = (Total Revenue / Initial Investment - 1) × 100%
Total Return = ($6.53M / $3.00M - 1) × 100%
Total Return = (2.18 - 1) × 100% = 117.7%
```

---

## KEY FORMULAS REFERENCE

### 1. Monthly Mortgage Payment (Amortization)
```
M = P × [r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
M = Monthly payment
P = Principal loan amount
r = Monthly interest rate (APR / 12 / 100)
n = Total number of payments (years × 12)
```

### 2. Compound Appreciation
```
Final Value = Initial Value × (1 + annual_rate)^years
```

### 3. IRR (Internal Rate of Return)
```
Solve for r where:
Σ [CF_t / (1 + r)^t] = 0

CF_t = Cash flow in year t
t = Time period (0 to n years)
r = IRR (discount rate)

Solved using Newton-Raphson iterative method
```

### 4. Cash Multiple
```
Cash Multiple = Total Cash Returned / Initial Investment
```

### 5. Net Present Value (NPV)
```
NPV = Σ [CF_t / (1 + discount_rate)^t]
```

---

## VERIFICATION CHECKLIST

### Does your business model match these assumptions?

**Portfolio Assumptions:**
- [ ] Do you have 112 properties?
- [ ] Is average property price $143,000?
- [ ] Are you charging 3.5% platform fee?
- [ ] Do buyers pay 20% down?

**Financial Assumptions:**
- [ ] Do you have $3M initial capital to deploy?
- [ ] Are you expecting 7% annual property appreciation?
- [ ] Is the SAM model sharing 30% of appreciation with platform?

**Revenue Sources:**
- [ ] Platform earns upfront fees on ALL sales (cash + financed)?
- [ ] Platform earns mortgage interest on FINANCED units only?
- [ ] Platform earns appreciation share ONLY in SAM model?

**Cash vs Financed:**
- [ ] Cash buyers pay full price but NO mortgage (platform only gets 3.5% fee)?
- [ ] Financed buyers pay 20% down + mortgage (platform gets 3.5% fee + interest)?

**Mortgage Mechanics:**
- [ ] Are you using standard amortization (not interest-only)?
- [ ] Are monthly payments fixed over the term?
- [ ] Is APR the same for all financed buyers?

---

## COMMON ISSUES TO CHECK

### 1. **Are cash buyers included in platform fees?**
Current model: YES - Platform earns 3.5% on ALL 112 units
If only financed units pay fees: Platform fees would be LOWER

### 2. **Is the $3M investment used for down payments or full financing?**
Current model: $3M is total capital deployed (not per property)
If $3M per property: Numbers would be MUCH higher

### 3. **Is appreciation calculated on original or current value?**
Current model: Compounding on original purchase price
Alternative: Year-over-year compounding on current value (same result)

### 4. **Are financed units 100% of non-cash, or subset?**
Current model: ALL non-cash buyers get financing
If some buy without platform financing: Interest revenue lower

### 5. **Is SAM share on total appreciation or platform's financed portion?**
Current model: 30% of TOTAL portfolio appreciation (all 112 units)
Alternative: 30% only on financed units' appreciation (would be lower)

---

## SUMMARY COMPARISON TABLE

| Metric | SAM Model (10.5% APR, 25% cash, 10Y) | Mortgage-Only Model |
|--------|--------------------------------------|---------------------|
| Platform Fees | $0.56M | $0.56M |
| Mortgage Interest | $5.97M | $5.97M |
| Appreciation Share | $4.65M | $0.00M |
| **Total Revenue** | **$11.18M** | **$6.53M** |
| **IRR** | **25.3%** | **20.7%** |
| **Cash Multiple** | **3.73x** | **2.18x** |
| **Net Profit** | **$8.18M** | **$3.53M** |

---

## QUESTIONS TO VERIFY

1. **Initial Capital**: Is $3M the total platform investment, or per-property?
2. **Platform Fees**: Do ALL buyers (cash + financed) pay 3.5% fee?
3. **Mortgage Provision**: Does platform provide 80% financing to buyers?
4. **Appreciation Rights**: In SAM model, does platform get 30% of ALL properties' appreciation, or only financed ones?
5. **Down Payment**: Who keeps the 20% down payment - platform or seller?
6. **Property Acquisition**: Does platform BUY properties first, then sell to buyers?
7. **Cash Flow Timing**: Are platform fees received upfront at sale, or over time?

---

**Generated:** Based on calculations in `src/lib/revenueScenarios.ts`
**Verified Against:** Screenshot showing 10.5% APR, 25% cash rate, 10-year term
**Calculator Values:** Mortgage-Only Dashboard ($6.53M revenue, 20.7% IRR, 2.18x multiple)
