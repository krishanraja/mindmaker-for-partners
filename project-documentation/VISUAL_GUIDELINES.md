# Visual Guidelines

## Color Usage

### Primary Palette
**Purple System (Primary Brand Color)**
- `--primary` (248 73% 67%) - Primary purple #667eea
- Use for: CTAs, links, focus states, primary badges
- Always pair with white text (`--primary-foreground`)

**Light Purple Variations**
- `--primary-100` through `--primary-700` - Tints and shades
- Use for: Backgrounds, hover states, gradients
- Creates visual hierarchy within purple family

**Deep Purple (Accent)**
- `--accent` (264 42% 52%)
- Use for: Secondary actions, alternative CTAs
- Provides contrast to primary purple

### Risk/Status Colors (Hardcoded in Constants)
```javascript
CRITICAL_RISK: 'hsl(0 84% 60%)'    // Red - immediate danger
HIGH_RISK: 'hsl(25 95% 53%)'       // Orange - urgent attention needed
MEDIUM_RISK: 'hsl(48 96% 53%)'     // Yellow - watch closely
LOW_RISK: 'hsl(142 76% 36%)'       // Green - all clear
```

**Usage Rules:**
- Only use for risk badges and heatmap
- Never use for decorative purposes
- Always include text label (not color-only)
- Ensure WCAG AA contrast ratios

### Neutral Palette
```css
Background: hsl(252 100% 98%)      // Soft lavender white
Foreground: hsl(240 18% 20%)       // Deep charcoal (text)
Muted: hsl(252 60% 96%)            // Very light lavender
Border: hsl(252 40% 92%)           // Soft purple border
```

**Usage:**
- Background for body and main containers
- Foreground for all text
- Muted for secondary surfaces
- Border for card edges, dividers

### Semantic Colors
```css
--destructive: hsl(0 84% 60%)      // Red for errors
--success: hsl(142 76% 36%)        // Green for success
```

**When to use:**
- Destructive: Form errors, delete actions, critical warnings
- Success: Form submissions, saved states, confirmations

---

## Typography

### Font Families
**Primary:** Inter (system-ui fallback)
- Clean, modern, highly readable
- Use for: All body text, UI elements

**Display:** Gobold (custom font)
- Bold, impactful
- Use for: Optional hero headlines (not currently in use)

### Type Scale
| Size Class | Mobile | Desktop | Use Case |
|------------|--------|---------|----------|
| Hero | 1.5rem | 2.25rem | Main headlines |
| H1 | 1.25rem | 1.875rem | Page titles |
| H2 | 1.125rem | 1.5rem | Section headers |
| Body | 1rem | 1.125rem | Paragraph text |
| Small | 0.875rem | 0.875rem | Labels, captions |
| Tiny | 0.75rem | 0.75rem | Footnotes |

**Responsive Classes:**
```css
.mobile-text-xl   // Hero text (responsive)
.mobile-text-lg   // Large headlines
.mobile-text-base // Standard body
.mobile-text-sm   // Small text
```

### Line Height
- Headlines: 1.2 (tight for impact)
- Body text: 1.6 (readable for paragraphs)
- UI elements: 1.4 (balanced for buttons, labels)

### Font Weight
- **400** (Regular): Body text
- **500** (Medium): Labels, subtle emphasis
- **600** (Semibold): Buttons, badges, section headers
- **700** (Bold): Headlines, strong emphasis

### Letter Spacing
- Headlines: -0.03em (slightly tight)
- Body text: 0 (normal)
- Badges/labels: 0.025em (slightly loose)

---

## Layout Principles

### Spacing Scale
```css
4px   (0.25rem)  // Tight spacing (badge padding)
8px   (0.5rem)   // Small spacing (between related items)
16px  (1rem)     // Standard spacing (between sections)
24px  (1.5rem)   // Medium spacing
32px  (2rem)     // Large spacing (between major sections)
48px  (3rem)     // XL spacing (section padding)
64px  (4rem)     // XXL spacing (page padding)
```

**Responsive Spacing:**
- Mobile: Use smaller end of scale (8px, 16px)
- Desktop: Use larger end (24px, 32px)

### Container Widths
- **Max content width:** 1400px (2xl breakpoint)
- **Optimal reading width:** 42rem (672px) - for text blocks
- **Form width:** 600px max - comfortable form completion

### Grid System
- No explicit grid - use Flexbox and CSS Grid
- Cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Forms: Single column on mobile, 2-column on desktop
- Results: Full-width tabs with responsive content

### White Space Philosophy
- **Generous white space = premium feel**
- Never crowd elements
- Section padding increases on larger screens
- Cards have internal padding: 16px mobile, 24px desktop

---

## Component Styling

### Cards
**Visual Treatment:**
- Background: Pure white (`--card`)
- Border: 1px solid soft purple (`--border / 0.5`)
- Shadow: Subtle at rest (`--shadow-sm`), elevated on hover (`--shadow-md`)
- Border radius: 1.25rem (generous rounding)
- Padding: 1rem mobile, 1.5rem desktop

**Hover State:**
- Shadow increases
- Slight upward translateY(-2px)
- Smooth transition (0.3s ease)

### Buttons
**Primary CTA (Hero Button):**
- Background: `--primary`
- Text: White
- Padding: 1rem 2.5rem
- Border radius: 9999px (full pill)
- Font size: 1.125rem, weight 600
- Shadow: `0 4px 16px hsl(var(--primary) / 0.2)`
- Hover: Darken to `--primary-600`, lift 2px, increase shadow

**Secondary Button:**
- Outline variant
- Border: 1px solid `--border`
- Background: Transparent
- Text: `--foreground`
- Hover: Fill with `--secondary`, no lift

**Destructive Button:**
- Background: `--destructive`
- Text: White
- Use sparingly for delete/cancel actions

### Badges
**Risk Badges:**
- Background: Risk color at 20% opacity
- Text: Risk color at full opacity
- Padding: 0.25rem 0.75rem
- Border radius: 0.5rem
- Font size: 0.75rem, weight 600
- Text transform: uppercase

**Info Badges:**
- Background: `--primary-200`
- Text: `--primary`
- Rounded full (pill shape)

### Forms
**Input Fields:**
- Border: 1px solid `--input`
- Background: White
- Padding: 0.5rem 0.75rem
- Border radius: `--radius` (1.25rem)
- Focus: 2px ring of `--ring`

**Dropdowns:**
- Same styling as inputs
- Chevron icon on right
- Popover: White background, shadow-lg, border

**Labels:**
- Font size: 0.875rem
- Font weight: 500
- Color: `--foreground`
- Margin bottom: 0.5rem

### Tables (Scoring Table)
**Structure:**
- Full-width on desktop
- Scrollable on mobile
- Sticky header row
- Zebra striping (subtle muted background on odd rows)

**Cells:**
- Padding: 1rem
- Border bottom: 1px solid `--border`
- Vertical align: top

**Dropdowns in Cells:**
- Compact padding (0.5rem)
- Full-width of cell
- No border radius (cleaner table look)

### Tooltips
**Visual Style:**
- Background: Dark charcoal (`--foreground`)
- Text: White
- Padding: 0.5rem 0.75rem
- Border radius: 0.5rem
- Font size: 0.875rem
- Shadow: medium

**Arrow:** Matches background color

---

## Iconography

### Icon Library
**Lucide React** - consistent, modern, MIT licensed

**Usage:**
- Size: 1rem (16px) for inline, 1.5rem (24px) for standalone
- Color: Inherits text color
- Stroke width: 2 (default)

**Common Icons:**
- `ArrowRight` - CTAs, forward navigation
- `Building` - Company/firm representation
- `Target` - Goals/objectives
- `CheckCircle` - Success states
- `AlertCircle` - Warnings
- `X` - Close actions

---

## Visual Effects

### Shadows
**Elevation System:**
- **Level 0:** No shadow (flat surface)
- **Level 1:** `--shadow-sm` (cards at rest)
- **Level 2:** `--shadow-md` (cards on hover, dropdowns)
- **Level 3:** `--shadow-lg` (modals, popovers, dialogs)

### Animations
**Hero Text Shimmer:**
- Linear gradient animation
- 8s duration, infinite loop
- Subtle, not distracting
- Use sparingly (hero only)

**Fade-In-Up (Entry Animation):**
- Opacity 0 → 1
- TranslateY 30px → 0
- Duration: 0.6s ease-out
- Use for page transitions

**Hover Transitions:**
- Duration: 0.3s
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Apply to: background, shadow, transform

**Collapsible Accordion:**
- Height animation (Radix UI built-in)
- Smooth expand/collapse
- 0.3s duration

### Reduced Motion
**Accessibility:**
```css
@media (prefers-reduced-motion: reduce) {
  * { 
    animation-duration: 0.01ms !important; 
    animation-iteration-count: 1 !important; 
  }
}
```
All animations respect user preference.

---

## Responsive Behavior

### Breakpoints
```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
```

### Mobile-Specific Patterns
**Navigation:**
- No persistent nav (full-screen steps)
- Back button in top-left
- Logo in top-center

**Forms:**
- Single column layout
- Full-width inputs
- Larger touch targets (min 44px)

**Tables:**
- Horizontal scroll
- Or collapse to cards (future enhancement)

**Modals:**
- Full-screen on mobile
- Centered dialog on desktop

---

## Branding Assets

### Logo
**Files:**
- `public/mindmaker-favicon.png` - Favicon (32x32)
- `src/assets/mindmaker-logo.png` - Dark logo
- `src/assets/mindmaker-logo-white.png` - Light logo (on dark backgrounds)

**Usage:**
- Hero section: Center-aligned, medium size
- Header (if added): Left-aligned, small size
- Footer (if added): Left-aligned, small size

**Clear Space:**
- Minimum 16px padding on all sides

### Favicon
- 32x32px PNG
- Simple, recognizable at small size
- Located at `public/mindmaker-favicon.png`

---

## Accessibility Standards

### Color Contrast (WCAG AA)
- **Normal text:** 4.5:1 minimum
- **Large text (18pt+):** 3:1 minimum
- **UI components:** 3:1 minimum

**Passing Combinations:**
- `--foreground` on `--background` ✅
- `--primary-foreground` on `--primary` ✅
- Risk badge text on risk background ✅

### Focus States
- All interactive elements have visible focus ring
- Ring color: `--ring` (purple)
- Ring width: 2px
- Never remove outline without replacement

### Touch Targets
- Minimum size: 44x44px on mobile
- Buttons, dropdowns, checkboxes all meet minimum
- Adequate spacing between targets (8px min)

---

## Visual Consistency Checklist

When adding new UI, verify:
1. ✅ Uses design tokens (not hardcoded colors)
2. ✅ Matches existing component patterns
3. ✅ Responsive at all breakpoints
4. ✅ Meets contrast ratios
5. ✅ Has hover/focus states
6. ✅ Respects reduced motion preferences
7. ✅ Uses semantic HTML
8. ✅ Includes ARIA labels where needed

---

## Common Visual Mistakes to Avoid

❌ **Don't:**
- Use `text-white` or `bg-black` (use tokens)
- Mix color formats (HSL only)
- Create new spacing values (use scale)
- Add animations without reduced-motion check
- Use color-only to convey meaning
- Make tiny touch targets on mobile
- Remove focus outlines
- Use more than 2-3 font weights per page

✅ **Do:**
- Use semantic tokens everywhere
- Maintain visual hierarchy
- Test on mobile device (not just browser responsive mode)
- Ensure keyboard navigation works
- Add loading states for async actions
- Provide clear error messages
- Use consistent spacing throughout
