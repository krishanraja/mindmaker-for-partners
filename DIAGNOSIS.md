# Database Error Diagnosis - Partner Intakes

## Problem Statement
Form submission fails with "Failed to save. Please try again." error.

## Evidence
### Network Request Analysis
- **Endpoint**: POST `/rest/v1/partner_intakes?select=*`
- **Status**: 404 Not Found
- **Response**: `{}`
- **Request Payload**: Valid JSON with all required fields

### Console Logs
```
Error saving intake: {}
```

## Root Cause
**Primary Issue**: Database table `partner_intakes` does not exist in Supabase project.

### Verification Steps Taken
1. ✅ Checked network requests - confirmed 404 from Supabase REST API
2. ✅ Verified migrations folder - no migration files found
3. ✅ Checked table schema tool - failed to retrieve schema (no tables exist)

## Architecture Map
```
PartnerIntakeForm.tsx (line 90-107)
  ↓ handleSubmit()
  ↓ supabase.from('partner_intakes' as any).insert()
  ↓ Network: POST /rest/v1/partner_intakes
  ↓ Supabase Response: 404 (table not found)
  ↓ catch(error) → toast error message
```

## Required Tables
Based on code analysis:
1. **partner_intakes** - Stores intake form data
2. **partner_portfolio_items** - Stores scoring data (referenced in PortfolioScoringTable.tsx)
3. **partner_plans** - Stores share links (referenced in PartnerPlanResults.tsx)

## Files Affected
- `src/components/partners/PartnerIntakeForm.tsx` (lines 90-107)
- `src/components/partners/PortfolioScoringTable.tsx` (lines 139-141)
- `src/components/partners/PartnerPlanResults.tsx` (share link creation)
- `src/pages/PartnerPlanShare.tsx` (public view)

## Impact Assessment
- **Severity**: Critical - entire partner assessment flow broken
- **User Impact**: Cannot save any form data
- **Scope**: All database operations fail (insert, select)
