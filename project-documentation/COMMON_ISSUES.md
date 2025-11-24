# Common Issues

## Recurring Bugs

### 1. Database Schema Mismatch
**Symptom:** Data not saving, silent failures, missing fields in results

**Root Cause:** Frontend code references columns that don't exist in database (or vice versa)

**Solution:**
- Always run migrations after schema changes
- Check `partner_portfolio_items` table schema matches `partnerScoring.ts` expectations
- Verify old columns are nullable if still referenced

**Prevention:** Update both database migration AND TypeScript types simultaneously

---

### 2. Edge Function Timeout
**Symptom:** AI insights fail to generate, spinning loader never stops

**Root Cause:**
- OpenAI API slow response
- Missing `OPENAI_API_KEY` secret
- Network timeout (default 60s)

**Solution:**
- Check edge function logs in Supabase dashboard
- Verify `OPENAI_API_KEY` is set in secrets
- Add error handling with user-friendly message

**Prevention:** Implement retry logic, show error state, allow regeneration

---

### 3. Risk Score Not Updating
**Symptom:** User changes dropdown but score doesn't recalculate

**Root Cause:**
- Debounce delay too long
- State not propagating correctly
- React not detecting state change

**Solution:**
- Check `PortfolioScoringRow` dropdown onChange handler
- Verify `calculateCognitiveRiskScore` is being called
- Use React DevTools to inspect state

**Prevention:** Add unit tests for scoring logic

---

### 4. Heatmap Not Rendering
**Symptom:** Blank space where heatmap should be

**Root Cause:**
- Missing data (companies not scored)
- Recharts dependency issue
- Invalid data format

**Solution:**
- Verify all companies have scores
- Check console for Recharts errors
- Validate data structure matches HeatmapVisualization props

**Prevention:** Add loading state, show message if no data

---

### 5. Share Link 404
**Symptom:** Public share link returns 404

**Root Cause:**
- `share_slug` not saved to database
- Edge function failed silently
- Wrong URL format

**Solution:**
- Check `partner_plans` table for `share_slug` value
- Verify edge function returned successfully
- Ensure URL is `/partners/plan/:shareSlug` (not `/plan/:slug`)

**Prevention:** Add error toast if share link creation fails

---

## Architectural Pain Points

### 1. No Save Mid-Workflow
**Problem:** User must complete entire assessment in one session

**Impact:** Lost work if browser closes, no resume capability

**Workaround:** None currently

**Future Fix:** Add draft save functionality with local storage or database persistence

---

### 2. No Historical Tracking
**Problem:** Can't compare portfolio assessments over time

**Impact:** No trend analysis, can't see if interventions worked

**Workaround:** Manual note-taking outside tool

**Future Fix:** Add versioning to `partner_plans` table, show history view

---

### 3. Single-User Only
**Problem:** No collaboration, can't share work-in-progress with team

**Impact:** Each partner works in isolation

**Workaround:** Share results link after completion

**Future Fix:** Add multi-user workspace with Supabase Auth

---

### 4. No Mobile Optimization for Scoring Table
**Problem:** Scoring table difficult on mobile (horizontal scroll)

**Impact:** Poor mobile UX for core feature

**Workaround:** Use desktop for scoring step

**Future Fix:** Collapse table to cards on mobile, one company at a time

---

## Prior Decisions That Caused Issues

### Decision: Use Academic Terminology
**When:** November 2025  
**Why:** Sounded sophisticated and professional  
**Issue:** Alienated target users, felt like research paper  
**Fix:** Complete copy rewrite to plain English (January 2025)

### Decision: Combined Old + New Schema
**When:** January 2025 (during redesign)  
**Why:** Preserve existing data  
**Issue:** Created confusion, dual code paths  
**Fix:** Made old columns nullable, prioritized new columns, removed references to old fields

### Decision: No Validation on Scoring Table
**When:** Initial implementation  
**Why:** Trusted users to complete all fields  
**Issue:** Incomplete assessments broke results page  
**Fix:** Added validation, disable "Generate Plan" until complete

---

## Debug Checklist

When something breaks:

1. **Check Console Logs** - Frontend errors appear here
2. **Check Edge Function Logs** - Supabase dashboard → Edge Functions → Logs
3. **Check Database Data** - Supabase dashboard → Table Editor
4. **Check Secrets** - Supabase dashboard → Edge Functions → Secrets
5. **Check Migrations** - Ensure all migrations applied
6. **Check Network Tab** - Failed API calls show here
7. **Clear Browser Cache** - Sometimes old assets cause issues

---

## Known Limitations

1. **No PDF Export** - UI exists, functionality not implemented
2. **No CRM Integration** - Placeholder only
3. **No Email Sending** - No edge function for this
4. **No Real-Time Collaboration** - Single-user sessions
5. **No Undo/Redo** - Changes are immediate and permanent
6. **No Bulk Edit** - Must score companies one-by-one
7. **No Custom Dimensions** - Fixed 7-dimension assessment

---

## Support Resources

- **Supabase Dashboard:** [project-url].supabase.co
- **Edge Function Docs:** https://supabase.com/docs/guides/functions
- **React Query Docs:** https://tanstack.com/query/latest
- **Tailwind Docs:** https://tailwindcss.com/docs
