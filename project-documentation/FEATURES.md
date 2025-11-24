# Core Features

## Feature Overview

The app consists of a **4-step linear workflow** with **3 output modules**.

---

## Step 1: Hero/Landing Page

### Purpose
Introduce the tool and set expectations.

### Components
- Hero headline with shimmer animation
- Value proposition statement
- "Start Assessment" CTA button
- Mindmaker branding (logo, favicon)

### User Actions
- Click "Start Assessment" → proceeds to intake form

---

## Step 2: Partner Intake Form

### Purpose
Collect partner context and portfolio overview.

### Fields Collected
1. **Partner Type** - VC, PE, Consultant, etc. (dropdown)
2. **Firm Name** - Text input
3. **Role** - Optional text input
4. **Region** - Optional text input
5. **Sectors** - Multi-select (Technology, Healthcare, Finance, etc.)
6. **Objectives** - Multi-select checkboxes:
   - Stop teams from wasting AI money
   - Spot bad decisions before they happen
   - See which leaders will believe vendor hype
   - Help teams ask better questions
   - Prevent panic buying
   - Avoid throwing money at problems
7. **Engagement Model** - Optional textarea
8. **Pipeline Count** - Number (1-10) of companies to assess
9. **Company Names** - Textarea (comma-separated list)
10. **Urgency Window** - Dropdown (0-30 days, 31-60 days, etc.)
11. **Resources/Bandwidth** - Optional textarea
12. **Consent Checkbox** - Required

### Dynamic Feedback
- Real-time calculation of "Estimated Sprint Candidates"
- Based on objectives + pipeline count + urgency
- Visual progress indicators

### Validation
- Firm name required
- At least 1 objective required
- Pipeline count 1-10
- Company names required
- Urgency window required
- Consent required

### Data Storage
- Saves to `partner_intakes` table in Supabase
- Returns `intake_id` for subsequent steps

### User Actions
- Back button → return to hero
- Continue → proceed to scoring

---

## Step 3: Portfolio Scoring Table

### Purpose
Assess each portfolio company across 7 cognitive risk dimensions.

### Table Structure
- One row per company (auto-populated from intake)
- 7 assessment columns + calculated fields

### Assessment Dimensions (Dropdowns)

1. **Vendor Story Susceptibility**
   - "Are they buying vendor stories or asking hard questions?"
   - Options: Buying completely → Very skeptical

2. **Thinking Clarity**
   - "How clear is their thinking?"
   - Options: Unclear/winging it → Clear frameworks

3. **Decision Process**
   - "How do they make big decisions?"
   - Options: No process/reacting → Thoughtful/systematic

4. **BS Detection**
   - "Will they believe vendor promises?"
   - Options: Believe anything → Deeply skeptical

5. **Urgency Level**
   - "How urgent is the pressure?"
   - Options: No rush → Panic mode

6. **Sponsor Sophistication**
   - "How sophisticated is sponsor thinking?"
   - Options: Fuzzy thinking → Deep thinking

7. **Coachability**
   - "Will they listen to advice?"
   - Options: Defensive → Hungry for help

### Calculated Fields (Auto-Generated)
- **Cognitive Risk Score** (0-100) - Higher = more waste risk
- **Capital at Risk** - Estimated dollars (based on risk + company size proxy)
- **Cognitive Readiness** (0-100) - Ability to spot BS

### Scoring Logic
Located in `src/utils/partnerScoring.ts`:
- Each dimension scored 0-3 (worst to best)
- Inverted for risk score (3 = low risk, 0 = high risk)
- Weighted average across 7 dimensions
- Normalized to 0-100 scale

### Row-Level Actions
- Tooltips on each dimension explain what to look for
- Real-time recalculation as dropdowns change
- Color-coded risk badges

### Data Storage
- Saves to `partner_portfolio_items` table
- Links to `intake_id`
- Stores both raw assessments and calculated scores

### User Actions
- Back → return to intake form
- Generate Plan → proceed to results (requires all companies scored)

---

## Step 4: Results Dashboard

### Purpose
Display risk analysis and intervention recommendations.

### Tab 1: Capital Risk Map (Heatmap)

**Visualization:**
- X-axis: Pressure to Spend (low → panic)
- Y-axis: Can They Spot BS? (no → yes)
- Each bubble = one company
- Bubble size = capital at risk
- Bubble color = risk level (green → red)

**Quadrants:**
- Top-right: "Safe - Let them run"
- Top-left: "Low urgency but clear thinkers"
- Bottom-right: "HIGH RISK - Will waste money fast"
- Bottom-left: "Moderate risk - need guidance"

**Interactions:**
- Hover over bubble → see company details
- Click bubble → highlight in other tabs

### Tab 2: Diagnostic Brief

**AI-Generated Insights:**
- Calls `generate-partner-insights` edge function
- Uses GPT-4 to analyze assessment data
- Generates company-by-company analysis

**Output Format:**
```
Company X: HIGH RISK
- Believes vendor promises + board pressure
- Will waste money in next 30 days
- Immediate intervention required

Company Y: Moderate Risk
- Asking some questions but no framework
- Give them a decision checklist
- Schedule call in 2 weeks
```

**Regenerate Button:**
- Calls edge function again if insights unsatisfactory
- Uses same data, new API call

### Tab 3: Intervention Plan

**Pre-Work Lists:**
- Companies grouped by risk level
- Sorted by urgency + capital at risk
- Actionable next steps for each company

**Co-Delivery Templates:**
- Executive memo template
- Board talking points
- Conversation guide
- Email templates

**Export Options:**
- Generate shareable link (unique slug)
- Copy link to clipboard
- Download PDF (placeholder - not implemented)
- Send to CRM (placeholder - not implemented)

---

## Supporting Features

### Share Links
- Edge function: `create-partner-share-link`
- Generates unique UUID slug
- Updates `partner_plans.share_slug` in database
- Public URL: `/partners/plan/:shareSlug`
- No authentication required (public sharing)

### Lead Generation
- Edge function: `send-partner-leads`
- Creates `leads` table entries for high-risk companies
- Links back to intake_id
- Used for internal follow-up

### Navigation
- Linear workflow (hero → intake → scoring → results)
- Back button on each step (except hero)
- No skip-ahead (must complete in order)
- No persistent navigation (full-screen steps)

### Responsive Design
- Mobile-first layout
- Touch-friendly dropdowns and buttons
- Collapsible table on mobile
- Stacked layout for narrow screens

---

## Technical Features

### Real-Time Calculation
- Scores recalculated on every dropdown change
- No "save" button needed (auto-save on blur)
- Optimistic UI updates

### Error Handling
- Form validation with inline error messages
- Toast notifications for success/failure
- Retry logic for edge function calls
- Graceful degradation if AI insights fail

### Data Persistence
- All data stored in Supabase
- Edge functions use service role key
- RLS policies for data security (if auth added later)

### Performance
- Lazy loading for results tab (only fetches when visible)
- Debounced dropdown changes to reduce DB writes
- Minimal re-renders using React Query

---

## Feature Dependencies

| Feature | Depends On |
|---------|------------|
| Scoring Table | Intake form completed |
| Results Dashboard | Scoring table completed |
| AI Insights | OpenAI API key in secrets |
| Share Links | `partner_plans` table schema |
| Heatmap | Recharts library |

---

## Not Yet Implemented

- PDF export (UI exists, no backend)
- CRM integration (UI exists, no backend)
- Email sending (no edge function)
- User authentication (public tool)
- Multi-user collaboration (single session)
- Historical tracking (no versioning)
- Notifications (no alerts)
