# Root Cause Analysis

## Issue Category
**Configuration Issue**: Missing database schema

## Root Cause
The Supabase database does not contain the required tables (`partner_intakes`, `partner_portfolio_items`, `partner_plans`).

## Why This Happened
1. Migration folder is read-only in Lovable projects
2. No initial database setup was performed in Supabase dashboard
3. Application code assumes tables exist but they were never created

## Why 404 Instead of Other Errors
- Supabase REST API returns 404 when a table/resource doesn't exist
- This is different from 403 (permission denied) or 400 (validation error)
- Empty response body `{}` is characteristic of missing table errors

## Schema Requirements
Based on code analysis, the tables need:

### partner_intakes
- `id` (UUID, primary key)
- `firm_name` (TEXT, required)
- `pipeline_count` (INTEGER, 1-10)
- `pipeline_names` (TEXT, required)
- `objectives_json` (JSONB, array)
- `urgency_window` (TEXT, required)
- `consent` (BOOLEAN, required)
- Optional metadata fields for future use

### partner_portfolio_items
- `id` (UUID, primary key)
- `intake_id` (UUID, foreign key → partner_intakes)
- Company info + 6 scoring dimensions
- Computed results (fit_score, recommendation, risk_flags)

### partner_plans
- `id` (UUID, primary key)
- `intake_id` (UUID, foreign key → partner_intakes)
- `share_slug` (TEXT, unique)
- Denormalized summary data for fast public access

## Resolution Path
Since migrations are read-only, user must execute SQL directly in Supabase dashboard.
