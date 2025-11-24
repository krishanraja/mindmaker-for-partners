# Architecture

## System Overview

**Stack:** React + TypeScript + Vite + Supabase + Tailwind CSS

**Architecture Pattern:** Linear workflow with serverless backend

---

## Frontend Architecture

### Routing (React Router)
```
/ → Partners (hero → intake → scoring → results)
/partners → Partners (same)
/partners/plan/:shareSlug → PartnerPlanShare (public view)
* → NotFound
```

### Component Hierarchy
```
App
├── Partners (main workflow)
│   ├── PartnerHeroSection
│   ├── PartnerIntakeForm
│   ├── PortfolioScoringTable
│   │   └── PortfolioScoringRow (per company)
│   └── PartnerPlanResults
│       ├── HeatmapVisualization
│       ├── CoDeliveryPlan
│       └── ExportActions
└── PartnerPlanShare (public sharing)
```

### State Management
- Local state (useState) for workflow steps
- No global state management (Redux/Zustand)
- React Query for async data fetching
- Supabase for data persistence

### Data Flow
1. User completes intake → Save to `partner_intakes` table → Get `intake_id`
2. User scores companies → Save to `partner_portfolio_items` table → Link to `intake_id`
3. User generates results → Call `generate-partner-insights` edge function → Display AI output
4. User creates share link → Call `create-partner-share-link` edge function → Get `share_slug`

---

## Backend Architecture (Supabase)

### Database Schema

**partner_intakes**
```sql
id UUID PRIMARY KEY
partner_type TEXT
firm_name TEXT
role TEXT
region TEXT
sectors_json JSONB
objectives_json JSONB
engagement_model TEXT
pipeline_count INTEGER
pipeline_names TEXT
urgency_window TEXT
resources_enablement_bandwidth TEXT
consent BOOLEAN
created_at TIMESTAMP
```

**partner_portfolio_items**
```sql
id UUID PRIMARY KEY
intake_id UUID REFERENCES partner_intakes(id)
company_name TEXT
-- New cognitive assessment fields:
hype_vs_discipline TEXT
mental_scaffolding TEXT
decision_quality TEXT
vendor_resistance TEXT
pressure_intensity TEXT
sponsor_thinking TEXT
upgrade_willingness TEXT
-- Calculated scores:
cognitive_risk_score INTEGER (0-100)
capital_at_risk INTEGER
cognitive_readiness INTEGER (0-100)
-- Legacy fields (nullable):
ai_posture TEXT
pressure_urgency TEXT
thinking_depth TEXT
recommendation TEXT
created_at TIMESTAMP
```

**partner_plans**
```sql
id UUID PRIMARY KEY
intake_id UUID REFERENCES partner_intakes(id)
share_slug TEXT UNIQUE
insights_json JSONB
created_at TIMESTAMP
```

### Edge Functions

**generate-partner-insights**
- Input: `intake_id`
- Fetches intake + portfolio items
- Calls OpenAI GPT-4 with structured prompt
- Returns AI-generated insights
- Environment: Deno, requires `OPENAI_API_KEY`

**create-partner-share-link**
- Input: `plan_id`
- Generates unique UUID slug
- Updates `partner_plans.share_slug`
- Returns slug for public URL

**send-partner-leads**
- Input: `intake_id`, `candidates`, `partner_info`
- Creates entries in `leads` table
- Links high-risk companies to CRM

---

## Scoring Logic

Located in `src/utils/partnerScoring.ts`:

```typescript
function calculateCognitiveRiskScore(item: PortfolioItem): number {
  // 7 dimensions, each scored 0-3
  const dimensions = [
    scoreHypeVsDiscipline(item.hype_vs_discipline),
    scoreMentalScaffolding(item.mental_scaffolding),
    // ... 5 more dimensions
  ];
  
  // Invert: lower raw score = higher risk
  const invertedSum = dimensions.reduce((sum, score) => sum + (3 - score), 0);
  
  // Normalize to 0-100 scale
  return Math.round((invertedSum / 21) * 100);
}
```

**Capital at Risk Calculation:**
```typescript
// Proxy based on risk score + pressure
// Higher risk + higher pressure = more capital exposure
capital_at_risk = cognitive_risk_score * pressure_multiplier * base_amount
```

---

## Key Utilities

**intakeEstimator.ts**
- Calculates estimated sprint candidates
- Based on objectives + pipeline count + urgency
- Used for live feedback in intake form

**partnerScoring.ts**
- Core scoring logic
- Maps dropdown options to numeric scores
- Calculates risk, capital, readiness

**recommendationHelpers.ts**
- Maps risk scores to recommendation types
- Provides badge variants and colors
- Generates pre-work lists

---

## Security

### Authentication
- Currently: No authentication (public tool)
- Future: Supabase Auth for user accounts

### RLS Policies
- Not yet implemented
- Future: Row-level security per user

### API Keys
- OpenAI key stored in Supabase secrets
- Edge functions use service role key

---

## Performance

### Optimization Strategies
- Lazy loading for results tab
- Debounced dropdown changes
- React Query caching
- Minimal re-renders

### Bundle Size
- Vite code splitting
- Dynamic imports for heavy components
- Tree-shaking enabled

---

## Deployment

### Frontend
- Lovable hosting (automatic)
- Updates via Lovable publish button
- Git integration for version control

### Backend
- Edge functions deploy automatically
- Database migrations via Supabase CLI
- No manual deployment needed

---

## Dependencies

### Core
- react, react-dom, react-router-dom
- @supabase/supabase-js
- @tanstack/react-query

### UI
- @radix-ui/* (component primitives)
- tailwindcss, tailwindcss-animate
- lucide-react (icons)
- recharts (heatmap)

### Forms
- react-hook-form
- zod (validation)
- @hookform/resolvers

---

## Environment Variables

```bash
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

**Edge Function Secrets:**
```bash
OPENAI_API_KEY=[key]
SUPABASE_URL=[same as frontend]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```
