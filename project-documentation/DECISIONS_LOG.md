# Decisions Log

## Major Architectural Decisions

### ADR-001: Use Supabase for Backend
**Date:** August 2025  
**Status:** Accepted  
**Context:** Need database + edge functions + auth  
**Decision:** Use Supabase (PostgreSQL + Deno edge functions)  
**Consequences:**
- ✅ Fast setup, generous free tier
- ✅ Built-in auth, RLS policies
- ❌ Vendor lock-in
- ❌ Limited to PostgreSQL

**Alternatives Considered:**
- Firebase (rejected: prefer SQL)
- Custom Node.js backend (rejected: too much setup)

---

### ADR-002: Linear Workflow (No Skip-Ahead)
**Date:** August 2025  
**Status:** Accepted  
**Context:** Ensure data quality, prevent incomplete assessments  
**Decision:** Force sequential completion (hero → intake → scoring → results)  
**Consequences:**
- ✅ Complete data every time
- ✅ Simpler state management
- ❌ Can't save mid-workflow
- ❌ Can't edit previous steps without starting over

**Alternatives Considered:**
- Multi-page form with save/resume (rejected: complexity)
- Single-page all-in-one (rejected: overwhelming)

---

### ADR-003: Plain English Over Academic Terminology
**Date:** January 2025  
**Status:** Accepted (reversed previous decision)  
**Context:** Users found "cognitive readiness", "mental scaffolding" alienating  
**Decision:** Complete rewrite to plain English, empathetic tone  
**Consequences:**
- ✅ Users complete assessments faster
- ✅ Matches how users actually think
- ✅ Feels like conversation, not exam
- ❌ Less "sophisticated" sounding

**Previous Decision:** Use cognitive psychology terminology (August-December 2025)  
**Why Reversed:** User feedback indicated confusion, intimidation

---

### ADR-004: HSL Color Format Only
**Date:** August 2025  
**Status:** Accepted  
**Context:** Need alpha channel support, Tailwind compatibility  
**Decision:** All colors in HSL format with CSS variables  
**Consequences:**
- ✅ Easy alpha transparency (`hsl(var(--primary) / 0.5)`)
- ✅ Theme switching support
- ✅ Consistent across project
- ❌ Requires conversion from hex colors

**Alternatives Considered:**
- RGB (rejected: verbose with alpha)
- Hex (rejected: no alpha channel)

---

### ADR-005: No Authentication for MVP
**Date:** August 2025  
**Status:** Accepted (temporary)  
**Context:** Reduce friction for pilot users  
**Decision:** Launch without auth, anyone can use tool  
**Consequences:**
- ✅ Zero onboarding friction
- ✅ Faster validation of core value
- ❌ No user accounts
- ❌ No historical tracking
- ❌ Can't save drafts

**Future:** Add Supabase Auth once core value validated

---

### ADR-006: AI Insights via Edge Function (Not Client-Side)
**Date:** September 2025  
**Status:** Accepted  
**Context:** Need to call OpenAI API securely  
**Decision:** Server-side edge function with API key in secrets  
**Consequences:**
- ✅ API key stays secure
- ✅ Can add rate limiting later
- ✅ Centralized prompt management
- ❌ Slower than client-side (network round-trip)
- ❌ Requires edge function deployment

**Alternatives Considered:**
- Client-side with user's API key (rejected: poor UX)
- Third-party AI service (rejected: cost)

---

### ADR-007: Single Database Table for Portfolio Items
**Date:** August 2025 (Updated January 2025)  
**Status:** Accepted  
**Context:** Store company assessments with link to intake  
**Decision:** One table (`partner_portfolio_items`) with nullable legacy columns  
**Consequences:**
- ✅ Simple schema
- ✅ Easy to query
- ❌ Mix of old + new columns during transition
- ❌ Manual migration needed for legacy data

**Migration Note:** Added new cognitive fields January 2025, made old fields nullable

---

### ADR-008: React Query for Data Fetching
**Date:** September 2025  
**Status:** Accepted  
**Context:** Need caching, loading states, error handling  
**Decision:** Use TanStack React Query  
**Consequences:**
- ✅ Automatic caching and refetching
- ✅ Built-in loading/error states
- ✅ Deduplication of requests
- ❌ Learning curve for team
- ❌ Additional dependency

**Alternatives Considered:**
- SWR (rejected: prefer React Query API)
- Plain fetch (rejected: too much boilerplate)

---

### ADR-009: Hardcode Risk Colors (Not Theme Tokens)
**Date:** November 2025  
**Status:** Accepted  
**Context:** Risk colors must be universal, not theme-dependent  
**Decision:** Define risk colors in constants file, not CSS variables  
**Consequences:**
- ✅ Consistent risk signaling across themes
- ✅ Colors match universal conventions (red=danger, green=safe)
- ❌ Not customizable per user
- ❌ Two color systems to maintain

**Rationale:** Risk colors are semantic, not aesthetic

---

### ADR-010: No PDF Export in MVP
**Date:** December 2025  
**Status:** Accepted (temporary)  
**Context:** PDF generation complex, uncertain demand  
**Decision:** Show export buttons but don't implement functionality  
**Consequences:**
- ✅ Faster MVP launch
- ✅ Can validate demand first
- ❌ User expectation not met (button exists)
- ❌ Must manually screenshot results

**Future:** Implement if users frequently request

---

## Design Decisions

### DD-001: Purple as Primary Brand Color
**Rationale:** Premium feel, distinct from competitors, associates with trust/innovation  
**Alternatives:** Blue (rejected: too common), Green (rejected: too financial)

### DD-002: Generous Border Radius (1.25rem)
**Rationale:** Friendly, modern, premium aesthetic  
**Alternatives:** Sharp corners (rejected: too harsh), Extreme rounding (rejected: too playful)

### DD-003: Inter Font Family
**Rationale:** Excellent readability, modern, professional  
**Alternatives:** Poppins (rejected: overused), SF Pro (rejected: platform-specific)

### DD-004: Mobile-First Responsive Design
**Rationale:** Many partners use mobile for quick checks  
**Approach:** Base styles for mobile, scale up with breakpoints

---

## Process Decisions

### PD-001: Lovable for Development
**Rationale:** Fast iteration, no local setup, automatic deployment  
**Trade-off:** Less control over build process

### PD-002: Git Integration via GitHub
**Rationale:** Version control, collaboration, backup  
**Setup:** Bidirectional sync between Lovable and GitHub

### PD-003: Documentation in Markdown
**Rationale:** Easy to read, edit, version control  
**Location:** `/project-documentation` folder in repo
