# Scheme Data Dictionary & Evaluation Schemas

This directory contains the verified schema definitions and structured gazette datasets utilized by the Autonomous Decision Engine.

## Schema Specification (`Scheme`)

Each scheme record contains:
- `id`: Unique identifier (e.g., `pm-kisan-01`)
- `name`: Full title of the program
- `ministry`: Administering central or state ministry
- `level`: `Central Sector` | `Centrally Sponsored` | `State Government`
- `category`: Core sector (Agriculture, Education, Health, Housing, Skills, Business)
- `financialBenefit`: Direct monetary DBT in INR
- `eligibilityCriteria`:
  - `minAge`, `maxAge`
  - `gender`: Target gender (`All` | `Female` | `Male`)
  - `domicileState`: State restriction (`All` or specific state code)
  - `casteCategory`: Required categories
  - `maxAnnualIncome`: Income cap in INR
  - `isFarmerOnly`: Boolean flag
  - `maxLandHoldingAcres`: Land ceiling
- `conflictsWith`: Array of conflicting scheme IDs
- `requiredDocuments`: Array of official verification documents
- `officialUrl`: Direct portal link
