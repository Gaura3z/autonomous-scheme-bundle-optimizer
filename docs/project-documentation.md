# System Architecture & Technical Documentation

## 1. Algorithmic Pipeline & Decision Support

The myScheme Autonomous Optimizer uses a multi-tier deterministic pipeline:

```
Citizen Demographics + Livelihood Attributes
                   │
                   ▼
┌──────────────────────────────────────┐
│  Tier 1: Gazette Rule Filtering      │  -> Eliminates ineligible schemes based on age,
│  (Deterministic Criteria Matcher)    │     caste, state of domicile, landholding, income.
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Tier 2: Exclusion & Conflict Matrix │  -> Evaluates mutual exclusivity (e.g. Dual scholarship
│  (Pairwise Disqualification Engine)  │     bans, PM-KISAN institutional farmer clauses).
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Tier 3: Benefit Utility Optimizer   │  -> Solves integer bundle optimization to maximize
│  (Maximum Value Net Yield)           │     total monetary DBT and collateral-free loan leverage.
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Tier 4: Phased Application Roadmap  │  -> Constructs minimal common document inventory
│  (Milestone & Prerequisite Sequencer)│     (Aadhaar, Land record 7/12, Income cert) with links.
└──────────────────────────────────────┘
```

## 2. Key Data Models

### Citizen Profile
- `age`: integer
- `gender`: 'Male' | 'Female' | 'Transgender'
- `state`: string (e.g., 'Gujarat', 'Maharashtra', 'Karnataka')
- `casteCategory`: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
- `annualIncome`: number (INR)
- `employmentStatus`: 'Farmer' | 'Student' | 'Self-Employed' | 'Unemployed' | 'Salaried'
- `landHoldingAcres`: number (for agricultural schemes)
- `isDifferentlyAbled`: boolean

### Scheme Object
- `id`: string unique identifier
- `name`: string
- `ministry`: string
- `type`: 'Central Sector' | 'Centrally Sponsored' | 'State'
- `benefitAmount`: number (annual INR value)
- `benefitSummary`: string
- `requiredDocuments`: string[]
- `conflictsWith`: string[] (Array of conflicting scheme IDs)
- `applicationPortal`: string URL

## 3. Exclusion Matrix Logic
When two schemes $S_a$ and $S_b$ share a mutual exclusion constraint:
$$\text{Conflict}(S_a, S_b) = \text{True}$$
The optimizer resolves the conflict by:
1. Evaluating statutory penalty vs net benefit.
2. Ranking by Net Annual Utility:
   $$\text{Utility}(S) = \text{FinancialBenefit}(S) + \text{SocialSecurityWeight}(S)$$
3. Retaining the highest yielding non-conflicting subset.
