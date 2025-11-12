# Implementation Plan - Database Schema Setup

## Checkpoint 0: Plan Approval ✓
**Action**: Document schema and provide SQL script
**Expected Result**: Complete SQL ready for execution
**Verification**: SQL script includes all tables, indexes, RLS policies

## Checkpoint 1: Database Schema Creation
**Action**: User executes SQL script in Supabase SQL Editor
**Expected Result**: 
- 3 tables created: `partner_intakes`, `partner_portfolio_items`, `partner_plans`
- Indexes created for performance
- RLS enabled with public access policies
**Verification Method**:
1. Check Supabase Dashboard → Table Editor → See 3 new tables
2. Test form submission → Should no longer return 404
3. Check browser network tab → POST should return 201 Created

## Checkpoint 2: Core Feature Verification
**Action**: Submit intake form with test data
**Expected Result**:
- Form saves successfully
- Toast shows success message
- Redirects to portfolio scoring page
**Verification Method**:
1. Fill form with: Firm="Test Firm", Companies=2, Goals=1+, Timeline=selected
2. Click "Continue to Portfolio Scoring"
3. Check network: POST /partner_intakes returns 201 with `{id: "uuid"}`
4. Check Supabase: Query `SELECT * FROM partner_intakes` shows new row

## Checkpoint 3: Secondary Feature Verification
**Action**: Complete portfolio scoring and create share link
**Expected Result**:
- Portfolio items save to database
- Share link generates successfully
**Verification Method**:
1. Complete scoring for all companies
2. Generate share link
3. Check: `SELECT * FROM partner_portfolio_items` shows rows
4. Check: `SELECT * FROM partner_plans` shows row with share_slug

## Checkpoint 4: Regression Test
**Action**: Repeat full flow 3 times with different data
**Expected Result**: All submissions succeed consistently
**Verification Method**:
- Test 1: Minimal data (1 company, 1 goal)
- Test 2: Maximum data (10 companies, multiple goals)
- Test 3: Edge case (special characters in company names)

## SQL Script Files
✅ Complete SQL script ready in message
✅ Includes all table definitions
✅ Includes proper RLS policies (public access for MVP)
✅ Includes indexes for performance
✅ Includes triggers for updated_at timestamps
