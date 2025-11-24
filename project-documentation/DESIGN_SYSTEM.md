# Design System

## Design Tokens

All design tokens are defined in `src/index.css` and extended in `tailwind.config.ts`.

### Color System (HSL Format)

#### Base Colors
```css
--background: 252 100% 98%        /* Soft lavender white #F8F7FF */
--foreground: 240 18% 20%         /* Deep charcoal for text */
--muted: 252 60% 96%              /* Very light lavender */
--muted-foreground: 215 28% 25%   /* Muted gray #2e3a4d */
```

#### Brand System (Primary Purple)
```css
--primary: 248 73% 67%            /* Primary purple #667eea */
--primary-100: 252 80% 97%        /* Ultra light purple */
--primary-200: 252 75% 92%        /* Very light purple */
--primary-300: 252 73% 85%        /* Light purple */
--primary-400: 252 72% 78%        /* Medium-light purple */
--primary-600: 252 70% 62%        /* Medium purple */
--primary-700: 252 68% 54%        /* Darker purple */
--primary-foreground: 0 0% 100%   /* White on primary */
```

#### Accent System (Deep Purple)
```css
--accent: 264 42% 52%             /* Deep purple */
--accent-400: 264 40% 62%         /* Lighter accent */
--accent-foreground: 0 0% 100%    /* White on accent */
```

#### Semantic Colors
```css
--destructive: 0 84% 60%          /* Red for errors/danger */
--destructive-foreground: 0 0% 100%
--success: 142 76% 36%            /* Green for success */
--success-foreground: 0 0% 100%
```

#### Surface Colors
```css
--card: 0 0% 100%                 /* Pure white for cards */
--card-foreground: var(--foreground)
--border: 252 40% 92%             /* Soft purple border */
--ring: 252 71% 70%               /* Focus ring color */
--input: 252 40% 92%              /* Input border */
--popover: 0 0% 100%              /* Popover background */
--secondary: 252 60% 96%          /* Secondary surface */
```

#### Risk Recommendation Colors (Hardcoded)
```css
/* Defined in src/constants/partnerConstants.ts */
CRITICAL_RISK: 'hsl(0 84% 60%)'    /* Red */
HIGH_RISK: 'hsl(25 95% 53%)'       /* Orange */
MEDIUM_RISK: 'hsl(48 96% 53%)'     /* Yellow */
LOW_RISK: 'hsl(142 76% 36%)'       /* Green */
```

#### Dark Mode Colors
```css
.dark {
  --background: 222 47% 7%
  --foreground: 210 40% 98%
  --muted: 222 32% 12%
  --card: 222 47% 9%
  --border: 222 28% 18%
  /* etc. */
}
```

---

## Typography

### Font Families
```css
/* Default sans-serif stack */
font-family: 'Inter', system-ui, sans-serif;

/* Display/heading font (if needed) */
font-family: 'Gobold', 'Impact', 'Arial Black', sans-serif;
```

**Note:** Gobold is custom font loaded from `/public/fonts/Gobold_Bold.otf`

### Font Scales (Responsive)
Defined as utility classes in `src/index.css`:

```css
.mobile-text-sm   { text-sm sm:text-base md:text-lg }
.mobile-text-base { text-base sm:text-lg md:text-xl }
.mobile-text-lg   { text-lg sm:text-xl md:text-2xl }
.mobile-text-xl   { text-xl sm:text-2xl md:text-3xl }
```

---

## Spacing

### Layout Spacing
```css
.section-padding {
  @apply py-8 sm:py-12 md:py-20 lg:py-24;
}

.container-width {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.mobile-spacing {
  @apply space-y-4 sm:space-y-6 md:space-y-8;
}

.mobile-padding {
  @apply p-4 sm:p-6 md:p-8;
}
```

### Safe Area Utilities (Mobile)
```css
.pt-safe-top {
  padding-top: max(1rem, env(safe-area-inset-top));
}

.pb-safe-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

---

## Border Radius

```css
--radius: 1.25rem;  /* Generous rounded corners */

/* Tailwind utilities */
border-radius-lg: var(--radius)
border-radius-md: calc(var(--radius) - 2px)
border-radius-sm: calc(var(--radius) - 4px)
```

---

## Shadows

```css
--shadow-sm: 0 2px 8px hsl(252 71% 70% / 0.08)
--shadow-md: 0 4px 16px hsl(252 71% 70% / 0.12)
--shadow-lg: 0 8px 32px hsl(252 71% 70% / 0.16)
```

**Usage:**
- `--shadow-sm` for cards at rest
- `--shadow-md` for cards on hover
- `--shadow-lg` for modals, popovers

---

## Component Patterns

### Card Pattern
```css
.card {
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border) / 0.5);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Icon Badge
```css
.icon-badge {
  background: hsl(var(--primary-100));
  color: hsl(var(--primary));
  border-radius: 1rem;
  padding: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Glass Morphism
```css
.glass-card {
  background: hsl(var(--background) / 0.95) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid hsl(var(--border) / 0.3) !important;
  border-radius: 1rem !important;
  box-shadow: 0 8px 32px hsl(var(--foreground) / 0.08) !important;
}
```

### Premium Badge
```css
.premium-badge {
  background: hsl(var(--primary-200));
  color: hsl(var(--primary));
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}
```

### Hero CTA Button
```css
.btn-hero-cta {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px hsl(var(--primary) / 0.2);
}

.btn-hero-cta:hover {
  background: hsl(var(--primary-600));
  transform: translateY(-2px);
  box-shadow: 0 8px 24px hsl(var(--primary) / 0.3);
}
```

---

## Animations

### Keyframe Definitions
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%, 90%, 100% { background-position: calc(-100% - 100px) 0 }
  30%, 60% { background-position: calc(100% + 100px) 0 }
}

@keyframes collapsible-down {
  from { height: 0; opacity: 0; }
  to { height: var(--radix-collapsible-content-height); opacity: 1; }
}

@keyframes collapsible-up {
  from { height: var(--radix-collapsible-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
}
```

### Animation Utilities
```css
.fade-in-up { animation: fade-in-up 0.6s ease-out; }
.animate-shimmer { animation: shimmer 8s ease-in-out infinite; }
.animate-collapsible-down { animation: collapsible-down 0.3s ease-out; }
.animate-collapsible-up { animation: collapsible-up 0.3s ease-out; }
```

### Premium Hero Text Shimmer
```css
.premium-hero-text {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.5rem;  /* 2.25rem on md, 1.875rem on sm */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.03em;
  text-align: center;
  max-width: 42rem;
  margin: 0 auto;
  
  background: linear-gradient(
    110deg,
    hsl(var(--primary)),
    45%,
    hsl(var(--primary-400)),
    55%,
    hsl(var(--primary))
  );
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 8s ease-in-out infinite;
}
```

---

## Shadcn UI Components

### Component Variants Used
- **Button:** default, destructive, outline, secondary, ghost, link
- **Badge:** default, secondary, destructive, outline
- **Card:** CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Form:** Form, FormField, FormItem, FormLabel, FormControl, FormMessage
- **Input:** text, number, textarea
- **Select:** dropdown with options
- **Tabs:** TabsList, TabsTrigger, TabsContent
- **Tooltip:** TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
- **Alert:** Alert, AlertTitle, AlertDescription
- **Progress:** linear progress bar
- **Separator:** horizontal/vertical dividers

### Component File Locations
All shadcn components in `src/components/ui/`

### Customization Approach
- Base components use design tokens from index.css
- Custom variants added via `cva()` (class-variance-authority)
- No inline styles - all styling via Tailwind classes
- Responsive by default

---

## Accessibility

### Focus States
```css
button:focus-visible, 
a:focus-visible, 
input:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px hsl(var(--ring)) !important;
}
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * { 
    animation-duration: 0.01ms !important; 
    animation-iteration-count: 1 !important; 
  }
}
```

---

## Usage Guidelines

### DO's
- Always use design tokens (e.g., `hsl(var(--primary))` not `#667eea`)
- Use semantic color names (`--foreground` not `--text-black`)
- Apply responsive utilities (`mobile-text-lg` not fixed sizes)
- Use component classes (`.card` not manual styles)
- Maintain HSL color format for all colors

### DON'Ts
- Never use raw hex colors in components
- Don't use `text-white`, `bg-black` - use semantic tokens
- Don't create one-off spacing values - use scale
- Don't skip accessibility patterns
- Don't use RGB color format (incompatible with alpha)

---

## Component Token Reference

| Element | Token | Usage |
|---------|-------|-------|
| Page background | `--background` | Body, main containers |
| Text | `--foreground` | All text by default |
| Cards | `--card` | Card backgrounds |
| Borders | `--border` | Card borders, dividers |
| Primary actions | `--primary` | CTAs, links |
| Secondary surfaces | `--secondary` | Muted cards, backgrounds |
| Hover states | `--accent` | Interactive elements |
| Error states | `--destructive` | Validation errors |
| Success states | `--success` | Confirmations |
| Disabled | `--muted-foreground` | Inactive elements |

---

## Responsive Breakpoints

```javascript
// From tailwind.config.ts
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
}
```

**Mobile-first approach:** All base styles target mobile, use `sm:`, `md:`, `lg:` for larger screens.

---

## Custom Scrollbar
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--primary) / 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.5);
}
```

---

## Future Enhancements

Potential additions to design system:
- Loading skeleton patterns
- Empty state illustrations
- Multi-step form progress indicators
- Data visualization color scales
- Status indicator dots
- Avatar component variants
