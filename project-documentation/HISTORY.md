# History

## Project Evolution

### Phase 1: Initial Concept (August 2025)
**Goal:** Build partner portfolio assessment tool

**Implementation:**
- Created basic intake form
- Simple scoring table
- Manual risk assessment
- No AI insights

**Issues:**
- Too generic, lacked focus
- Unclear value proposition
- Academic tone

---

### Phase 2: AI Integration (September 2025)
**Goal:** Add AI-generated insights

**Implementation:**
- Added `generate-partner-insights` edge function
- OpenAI GPT-4 integration
- Results dashboard with tabs
- Heatmap visualization

**Issues:**
- AI insights too academic
- Tone mismatch with target users
- Complex jargon throughout

---

### Phase 3: Cognitive Framework (November 2025)
**Goal:** Shift from generic assessment to cognitive risk focus

**Implementation:**
- Introduced 7 cognitive dimensions
- Renamed fields to cognitive terms
- Updated scoring logic
- Added capital-at-risk calculation

**Issues:**
- CRITICAL: Used intellectual language ("cognitive readiness", "mental scaffolding")
- Alienated target users (busy partners)
- Felt like academic research, not practical tool

---

### Phase 4: Complete Redesign (January 2025)
**Goal:** Plain English, empathetic, real-world tone

**Major Changes:**
1. **Database Migration:**
   - Added new columns for cognitive assessments
   - Made old columns nullable
   - Migrated to new schema

2. **Copy Overhaul:**
   - "Cognitive risk assessment" → "Who's about to waste money?"
   - "Mental scaffolding" → "How clear is their thinking?"
   - "Hype vs discipline" → "Are they buying vendor stories?"
   - All academic jargon removed

3. **Question Redesign:**
   - Questions now feel conversational
   - Focus on practical scenarios
   - Business-focused outcomes

4. **Output Redesign:**
   - "Cognitive Risk Heatmap" → "Capital Risk Map"
   - "Diagnostic Brief" → "The Brief"
   - "Scaffolding Roadmap" → "Your Plan"

5. **AI Prompt Rewrite:**
   - Generate actionable insights, not academic analysis
   - Focus on capital waste prevention
   - Plain English recommendations

**Result:**
- Tool now sounds like trusted advisor
- Target users can complete in 15 minutes
- Outputs are immediately actionable

---

## Architecture Decisions

### Why No Authentication?
**Decision:** Launch as public tool  
**Rationale:** Reduce friction for pilot users  
**Trade-off:** No user accounts, no historical tracking  
**Future:** Add Supabase Auth once validated

### Why Linear Workflow?
**Decision:** Hero → Intake → Scoring → Results (no skip-ahead)  
**Rationale:** Ensures data quality, prevents incomplete assessments  
**Trade-off:** Can't save progress mid-flow  
**Future:** Add save/resume capability

### Why Supabase?
**Decision:** Use Supabase for backend  
**Rationale:** Fast setup, Edge Functions, generous free tier  
**Trade-off:** Vendor lock-in  
**Future:** Acceptable for MVP, could migrate if needed

### Why No PDF Export?
**Decision:** UI exists but not implemented  
**Rationale:** Focus on MVP core features first  
**Trade-off:** Users must screenshot results  
**Future:** Add when user demand proven

---

## Key Milestones

- **Aug 2025:** Initial prototype
- **Sep 2025:** AI insights added
- **Nov 2025:** Cognitive framework implemented
- **Jan 2025:** Complete tone/copy redesign
- **Jan 2025:** Documentation created
