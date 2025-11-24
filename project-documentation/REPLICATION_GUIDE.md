# Replication Guide

## From Empty Repo to Working Build

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Git

---

## Step 1: Clone Repository

```bash
git clone [repo-url]
cd [project-name]
npm install
```

---

## Step 2: Set Up Supabase Project

### 2.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Note down:
   - Project URL (e.g., `https://abc123.supabase.co`)
   - Anon/Public key
   - Service role key

### 2.2 Run Database Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref [your-project-id]

# Run all migrations
supabase db push
```

**Migrations create:**
- `partner_intakes` table
- `partner_portfolio_items` table
- `partner_plans` table
- `leads` table (for future CRM)

### 2.3 Deploy Edge Functions
```bash
# Deploy all functions
supabase functions deploy generate-partner-insights
supabase functions deploy create-partner-share-link
supabase functions deploy send-partner-leads
```

### 2.4 Set Secrets
```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=[your-key]

# Verify secrets
supabase secrets list
```

---

## Step 3: Configure Environment

### 3.1 Create `.env` file
```bash
# In project root
cp .env.example .env
```

### 3.2 Add Supabase credentials
```bash
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

---

## Step 4: Install Dependencies

```bash
npm install
```

**Key dependencies installed:**
- React + React Router
- Supabase JS client
- TanStack React Query
- Radix UI components
- Tailwind CSS
- Recharts
- Lucide icons

---

## Step 5: Start Development Server

```bash
npm run dev
```

**Should see:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open http://localhost:5173/ in browser.

---

## Step 6: Verify Everything Works

### 6.1 Frontend Checklist
- [ ] Hero page loads
- [ ] "Start Assessment" button works
- [ ] Intake form renders
- [ ] Can submit intake form
- [ ] Scoring table loads with company rows
- [ ] Dropdowns work, scores calculate
- [ ] Can save portfolio items
- [ ] Results page loads
- [ ] Tabs switch correctly

### 6.2 Backend Checklist
- [ ] Data saves to `partner_intakes` table
- [ ] Data saves to `partner_portfolio_items` table
- [ ] AI insights generate (check edge function logs)
- [ ] Share link creates successfully
- [ ] Public share URL works

### 6.3 Edge Function Testing
```bash
# Test generate-partner-insights locally
supabase functions serve generate-partner-insights

# Call it
curl -X POST http://localhost:54321/functions/v1/generate-partner-insights \
  -H "Content-Type: application/json" \
  -d '{"intake_id": "[test-uuid]"}'
```

---

## Step 7: Deploy to Production

### 7.1 Build Frontend
```bash
npm run build
```

**Outputs to:** `dist/` folder

### 7.2 Deploy via Lovable (Recommended)
1. Connect GitHub repo to Lovable project
2. Click "Publish" in Lovable dashboard
3. Frontend + edge functions deploy automatically

### 7.3 Manual Deploy (Alternative)
```bash
# Deploy to Vercel
vercel deploy

# Or Netlify
netlify deploy --prod

# Edge functions already deployed via Supabase CLI
```

---

## Troubleshooting

### Issue: "Supabase client not initialized"
**Fix:** Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: "OpenAI API error"
**Fix:** Verify `OPENAI_API_KEY` secret set in Supabase:
```bash
supabase secrets list
```

### Issue: "Migrations failed"
**Fix:** Check Supabase dashboard → SQL Editor for error messages. May need to drop tables and re-run.

### Issue: "Edge function timeout"
**Fix:** Check edge function logs in Supabase dashboard → Edge Functions → Logs

### Issue: "Data not saving"
**Fix:** Verify database schema matches code expectations. Check `partner_portfolio_items` has all new cognitive fields.

---

## Database Schema Reference

### partner_intakes
```sql
CREATE TABLE partner_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_type TEXT,
  firm_name TEXT NOT NULL,
  role TEXT,
  region TEXT,
  sectors_json JSONB,
  objectives_json JSONB,
  engagement_model TEXT,
  pipeline_count INTEGER,
  pipeline_names TEXT,
  urgency_window TEXT,
  resources_enablement_bandwidth TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

### partner_portfolio_items
```sql
CREATE TABLE partner_portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID REFERENCES partner_intakes(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  -- New cognitive fields
  hype_vs_discipline TEXT,
  mental_scaffolding TEXT,
  decision_quality TEXT,
  vendor_resistance TEXT,
  pressure_intensity TEXT,
  sponsor_thinking TEXT,
  upgrade_willingness TEXT,
  -- Calculated scores
  cognitive_risk_score INTEGER,
  capital_at_risk INTEGER,
  cognitive_readiness INTEGER,
  -- Legacy fields (nullable)
  ai_posture TEXT,
  pressure_urgency TEXT,
  thinking_depth TEXT,
  recommendation TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### partner_plans
```sql
CREATE TABLE partner_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID REFERENCES partner_intakes(id) ON DELETE CASCADE,
  share_slug TEXT UNIQUE,
  insights_json JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## Testing the Full Flow

1. **Navigate to** http://localhost:5173/
2. **Click** "Start Assessment"
3. **Fill intake form:**
   - Firm name: "Test VC"
   - Objectives: Select 2-3
   - Pipeline count: 3
   - Company names: "Company A, Company B, Company C"
   - Urgency: "0-30 days"
   - Check consent
4. **Click** "Continue"
5. **Score each company** (select all 7 dropdowns per row)
6. **Click** "Generate Plan"
7. **View results** - should see heatmap, brief, plan tabs
8. **Generate AI insights** - should call edge function, show insights
9. **Create share link** - should generate public URL

---

## Common Mistakes

❌ Forgetting to run migrations  
✅ Always run `supabase db push` after cloning

❌ Missing `.env` file  
✅ Create `.env` with Supabase credentials

❌ Not deploying edge functions  
✅ Run `supabase functions deploy [function-name]`

❌ Missing OpenAI API key  
✅ Set via `supabase secrets set OPENAI_API_KEY=[key]`

❌ Using wrong Supabase key in edge functions  
✅ Edge functions use service role key (auto-configured)

---

## Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev/
- **React Router Docs:** https://reactrouter.com/
- **Tailwind Docs:** https://tailwindcss.com/
- **Project Documentation:** `/project-documentation/` folder
