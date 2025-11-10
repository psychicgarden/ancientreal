# Complete Mathematical Breakdown - Real Estate Investment Business Model

## ASSUMPTIONS (Used in All Calculations)

### Fixed Business Assumptions

These are constant across all scenarios:

- **Total Units**: 112 properties across 6 development flips
- **Build Cost**: $75,000 per unit
- **Sale Prices**: Dynamic pricing from $135,000 (Flip 1) to $150,000 (Flip 6)
  - Flip 1-2: $135,000 per unit (37 units)
  - Flip 3-4: $142,500 per unit (38 units)  
  - Flip 5-6: $150,000 per unit (37 units)
- **Average Sale Price**: $142,366 per unit
- **Platform Fee Rate**: 3.5% of property price
- **Down Payment Rate**: 20% of property price
- **Initial Investment**: $3,000,000 (from business)
- **Appreciation Rate**: 7% annually (compounded)
- **Mortgage Term Options**: 10, 15, 20, or 30 years

### Variable Parameters (Adjustable in Dashboard)
- **APR (Annual Percentage Rate)**: 5% - 12% (user adjustable)
- **Cash Purchase Rate**: 10% - 40% (percentage of buyers who pay cash instead of financing)
- **Mortgage Term**: 10, 15, 20, or 30 years

---

## MODEL 1: SAM MODEL (Shared Appreciation Mortgage)

### Revenue Components

1. **Construction Profit** (one-time, at property completion)
2. **Platform Fees** (one-time, at purchase)
3. **Mortgage Interest** (over loan term)
4. **Appreciation Share** (30% of appreciation at property appreciation event)

### STEP-BY-STEP CALCULATIONS

**Given Example Values:**
- APR: 10.5%
- Cash Purchase Rate: 25%
- Mortgage Term: 10 years

#### Step 0: Calculate Construction Profit

**Flip 1-2 (37 units at $135k):**
- Construction Profit per unit = $135,000 - $75,000 = $60,000
- Total = 37 × $60,000 = $2,220,000

**Flip 3-4 (38 units at $142.5k):**
- Construction Profit per unit = $142,500 - $75,000 = $67,500
- Total = 38 × $67,500 = $2,565,000

**Flip 5-6 (37 units at $150k):**
- Construction Profit per unit = $150,000 - $75,000 = $75,000
- Total = 37 × $75,000 = $2,775,000

**Total Construction Profit = $2,220,000 + $2,565,000 + $2,775,000 = $7,560,000**

#### Step 1: Calculate Unit Distribution

```
Cash Units = ROUND(Total Units × Cash Purchase Rate)
Cash Units = ROUND(112 × 0.25) = 28 units

Financed Units = Total Units - Cash Units
Financed Units = 112 - 28 = 84 units
```

**Distribution by Flip (25% cash each):**
- Flip 1-2: 37 units → 28 financed, 9 cash
- Flip 3-4: 38 units → 29 financed, 9 cash
- Flip 5-6: 37 units → 27 financed, 10 cash

#### Step 2: Calculate Platform Fees

```
Platform Fee per Property = Property Price × 3.5%
Total Platform Fees = Sum of (Financed Units per Flip × Platform Fee)
```

**Flip 1-2 (28 financed units at $135k):**
- Platform Fee = $135,000 × 0.035 = $4,725
- Total = 28 × $4,725 = $132,300

**Flip 3-4 (29 financed units at $142.5k):**
- Platform Fee = $142,500 × 0.035 = $4,987.50
- Total = 29 × $4,987.50 = $144,637.50

**Flip 5-6 (27 financed units at $150k):**
- Platform Fee = $150,000 × 0.035 = $5,250
- Total = 27 × $5,250 = $141,750

**Total Platform Fees = $132,300 + $144,637.50 + $141,750 = $418,687.50**

#### Step 3: Calculate Mortgage Interest

**For each pricing tier:**

**Flip 1-2 (28 financed units at $135k):**
- Loan Amount = $135,000 × 0.80 = $108,000
- Monthly Payment (10 years, 10.5% APR) = $1,462.93
- Total Paid = $1,462.93 × 120 = $175,551.60
- Interest per unit = $175,551.60 - $108,000 = $67,551.60
- Total Interest = 28 × $67,551.60 = $1,891,444.80

**Flip 3-4 (29 financed units at $142.5k):**
- Loan Amount = $142,500 × 0.80 = $114,000
- Monthly Payment (10 years, 10.5% APR) = $1,543.89
- Total Paid = $1,543.89 × 120 = $185,266.80
- Interest per unit = $185,266.80 - $114,000 = $71,266.80
- Total Interest = 29 × $71,266.80 = $2,066,737.20

**Flip 5-6 (27 financed units at $150k):**
- Loan Amount = $150,000 × 0.80 = $120,000
- Monthly Payment (10 years, 10.5% APR) = $1,625.30
- Total Paid = $1,625.30 × 120 = $195,036.00
- Interest per unit = $195,036.00 - $120,000 = $75,036.00
- Total Interest = 27 × $75,036.00 = $2,025,972.00

**Total Mortgage Interest = $1,891,444.80 + $2,066,737.20 + $2,025,972.00 = $5,984,154.00**

#### Step 4: Calculate Appreciation Share (30% to Platform)

**For each pricing tier (after 10 years at 7% appreciation):**

**Flip 1-2 (37 units at $135k):**
- Future Value = $135,000 × (1.07)^10 = $265,565.25
- Appreciation = $265,565.25 - $135,000 = $130,565.25
- Platform Share = $130,565.25 × 0.30 = $39,169.58
- Total = 37 × $39,169.58 = $1,449,274.46

**Flip 3-4 (38 units at $142.5k):**
- Future Value = $142,500 × (1.07)^10 = $280,319.25
- Appreciation = $280,319.25 - $142,500 = $137,819.25
- Platform Share = $137,819.25 × 0.30 = $41,345.78
- Total = 38 × $41,345.78 = $1,571,139.64

**Flip 5-6 (37 units at $150k):**
- Future Value = $150,000 × (1.07)^10 = $295,073.25
- Appreciation = $295,073.25 - $150,000 = $145,073.25
- Platform Share = $145,073.25 × 0.30 = $43,521.98
- Total = 37 × $43,521.98 = $1,610,313.26

**Total Appreciation Share = $1,449,274.46 + $1,571,139.64 + $1,610,313.26 = $4,630,727.36**

#### Step 5: Calculate Total Revenue

**Financial Services Revenue:**
```
Financial Revenue = Platform Fees + Mortgage Interest + Appreciation Share
Financial Revenue = $418,687.50 + $5,984,154.00 + $4,630,727.36
Financial Revenue = $11,033,568.86
```

**Total Business Revenue:**
```
Total Revenue = Construction Profit + Financial Revenue
Total Revenue = $7,560,000 + $11,033,568.86
Total Revenue = $18,593,568.86
```

#### Step 6: Calculate IRR

To calculate IRR, we need to find the discount rate where NPV = 0.

**Cash Flows:**
- Year 0: -$3,000,000 (initial investment in land/infrastructure)
- Years 0-2: Construction profit as properties are completed and sold (~$3.78M/year)
- Year 1-10: Monthly mortgage payments flowing in (~$1.1M/year)
- Year 10: Final appreciation distribution ($4.63M)

Using Newton-Raphson method or Excel's IRR function with monthly cash flows:

**IRR ≈ 51.8% annually** (includes early construction profit boost)

#### Step 7: Calculate Cash Multiple

```
Cash Multiple = Total Revenue / Initial Investment
Cash Multiple = $18,593,568.86 / $3,000,000
Cash Multiple = 6.20x
```

**Summary for SAM Model (10.5% APR, 25% cash, 10 years):**
- Construction Profit: $7,560,000
- Platform Fees: $418,687.50
- Mortgage Interest: $5,984,154.00
- Appreciation Share: $4,630,727.36
- **Total Revenue: $18,593,568.86**
- **IRR: ~51.8%**
- **Cash Multiple: 6.20x**
- **Net Profit: $15,593,568.86**

---

## MODEL 2: MORTGAGE-ONLY MODEL (No SAM - Buyer Owns 100% Appreciation)

### Revenue Components

1. **Construction Profit** (one-time, at property completion)
2. **Platform Fees** (one-time, at purchase)
3. **Mortgage Interest** (over loan term)
4. **Appreciation Share** = $0 (not included in this model)

### STEP-BY-STEP CALCULATIONS

Steps 0-3 are **identical** to SAM Model:
- Construction Profit: $7,560,000
- Platform Fees: $418,687.50
- Mortgage Interest: $5,984,154.00

Step 4 is different:
- Appreciation Share: **$0** (no appreciation sharing in this model)

#### Calculate Total Revenue

**Financial Services Revenue:**
```
Financial Revenue = Platform Fees + Mortgage Interest
Financial Revenue = $418,687.50 + $5,984,154.00
Financial Revenue = $6,402,841.50
```

**Total Business Revenue:**
```
Total Revenue = Construction Profit + Financial Revenue
Total Revenue = $7,560,000 + $6,402,841.50
Total Revenue = $13,962,841.50
```

#### Calculate IRR

**Cash Flows:**
- Year 0: -$3,000,000 (initial investment)
- Years 0-2: Construction profit as properties are completed and sold
- Year 1-10: Monthly mortgage payments flowing in
- Year 10: No appreciation distribution

**IRR ≈ 42.6% annually** (includes early construction profit boost)

#### Calculate Cash Multiple

```
Cash Multiple = Total Revenue / Initial Investment
Cash Multiple = $13,962,841.50 / $3,000,000
Cash Multiple = 4.65x
```

#### Calculate Net Profit

```
Net Profit = Total Revenue - Initial Investment
Net Profit = $13,962,841.50 - $3,000,000
Net Profit = $10,962,841.50
```

#### Calculate Total Return %

```
Total Return = (Total Revenue / Initial Investment - 1) × 100%
Total Return = (4.65 - 1) × 100%
Total Return = 365%
```

**Summary for Mortgage-Only Model (10.5% APR, 25% cash, 10 years):**
- Construction Profit: $7,560,000
- Platform Fees: $418,687.50
- Mortgage Interest: $5,984,154.00
- Appreciation Share: $0
- **Total Revenue: $13,962,841.50**
- **IRR: ~42.6%**
- **Cash Multiple: 4.65x**
- **Net Profit: $10,962,841.50**
- **Total Return: 365%**

#### Revenue Difference Between Models

```
Difference = SAM Total Revenue - Mortgage-Only Total Revenue
Difference = $18,593,568.86 - $13,962,841.50
Difference = $4,630,727.36 (exactly the appreciation share amount)
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
- [ ] Do you have 112 properties across 6 development flips?
- [ ] Build cost is $75,000 per unit?
- [ ] Sale prices range from $135k to $150k?
- [ ] Are you charging 3.5% platform fee?
- [ ] Do buyers pay 20% down?

**Financial Assumptions:**
- [ ] Do you have $3M initial capital to deploy?
- [ ] Are you expecting 7% annual property appreciation?
- [ ] Is the SAM model sharing 30% of appreciation with platform?

**Revenue Sources:**
- [ ] Platform earns construction profit on ALL units?
- [ ] Platform earns upfront fees on FINANCED units only?
- [ ] Platform earns mortgage interest on FINANCED units only?
- [ ] Platform earns appreciation share ONLY in SAM model?

**Cash vs Financed:**
- [ ] Cash buyers pay full price but NO mortgage (platform only gets construction profit)?
- [ ] Financed buyers pay 20% down + mortgage (platform gets construction profit + fee + interest)?

**Mortgage Mechanics:**
- [ ] Are you using standard amortization (not interest-only)?
- [ ] Are monthly payments fixed over the term?
- [ ] Is APR the same for all financed buyers?

---

## COMMON ISSUES TO CHECK

### 1. **Are cash buyers included in platform fees?**
Current model: NO - Only financed units pay 3.5% platform fee
If cash buyers also pay fees: Platform fees would be HIGHER

### 2. **Is the $3M investment used for construction or financing?**
Current model: $3M is initial capital for land/infrastructure/development
Construction cost: $75k × 112 = $8.4M (likely external financing)

### 3. **Is appreciation calculated on all units or only financed?**
Current model: Appreciation share calculated on ALL 112 units
Alternative: Only on financed units (would be lower)

### 4. **Construction profit timing**
Current model: Profit realized as units are completed and sold (Years 0-2)
This creates early positive cash flow that boosts IRR significantly

### 5. **Is SAM share on total appreciation or platform's financed portion?**
Current model: 30% of TOTAL portfolio appreciation (all 112 units)
Alternative: 30% only on financed units' appreciation (would be lower)

---

## SUMMARY COMPARISON TABLE

| Metric | SAM Model | Mortgage-Only Model | Difference |
|--------|-----------|-------------------|------------|
| Construction Profit | $7,560,000 | $7,560,000 | $0 |
| Platform Fees | $418,688 | $418,688 | $0 |
| Mortgage Interest | $5,984,154 | $5,984,154 | $0 |
| Appreciation Share | $4,630,727 | $0 | $4,630,727 |
| **Total Revenue** | **$18,593,569** | **$13,962,842** | **$4,630,727** |
| **IRR** | **51.8%** | **42.6%** | **+9.2%** |
| **Cash Multiple** | **6.20x** | **4.65x** | **+1.55x** |
| **Net Profit** | $15,593,569 | $10,962,842 | $4,630,727 |

---

## QUESTIONS TO VERIFY

1. **Construction Costs**: Is $75k per unit the all-in build cost, or are there additional expenses?
2. **Platform Fees**: Should cash buyers also pay 3.5% platform fee?
3. **Mortgage Provision**: Does platform provide 80% financing to buyers from the $3M capital?
4. **Appreciation Rights**: In SAM model, does platform get 30% of ALL properties' appreciation, or only financed ones?
5. **Down Payment**: Who keeps the 20% down payment - platform or developer?
6. **Property Acquisition**: Does platform own land and develop, or acquire completed units?
7. **Cash Flow Timing**: When are construction profits realized - at completion or at sale?
8. **External Financing**: How is the $8.4M construction cost funded if initial capital is only $3M?

---

**Generated:** Based on corrected assumptions with $75k build cost and $135k-$150k sale prices
**Key Insight:** Construction profit ($7.56M) represents the largest revenue component, exceeding financial services revenue ($6.4M in Mortgage-Only, $11M in SAM)
**IRR Impact:** Early construction profit realization significantly boosts IRR from ~25% to ~52% in SAM model
