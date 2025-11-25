# Design System

**Last Updated:** 2025-11-25

---

## Color System

### Primary Palette
```
Ink:  #0e1a2b (HSL: 210 58% 11%)  - Main structure, typography
Mint: #7ef4c2 (HSL: 158 82% 73%) - Highlights, sparingly
```

### Neutrals
```
Off-White:   #F7F7F5 (HSL: 60 9% 96%)  - Background
Light Grey:  #E5E5E3 (HSL: 60 5% 90%)  - Borders
Mid Grey:    #9AA0A6 (HSL: 210 7% 62%) - Secondary text
Graphite:    #333639 (HSL: 200 5% 21%) - Strong text
```

### Semantic Mappings
```css
--background: var(--off-white)
--foreground: var(--ink)
--muted: var(--light-grey)
--muted-foreground: var(--mid-grey)
--primary: var(--ink)
--accent: var(--mint)
--ring: var(--mint)
```

---

## Typography

### Font Families
```
Primary: 'Inter' - Body text, UI
Display: 'Gobold' - Headlines, hero text (use sparingly)
```

### Scale
```
Hero:     text-5xl to text-6xl (48-60px)
H1:       text-4xl to text-5xl (36-48px)
H2:       text-3xl to text-4xl (30-36px)
H3:       text-2xl (24px)
Body:     text-base (16px)
Small:    text-sm (14px)
Tiny:     text-xs (12px)
```

---

## Spacing System

### Scale (Tailwind)
```
0.5  = 2px   | 1  = 4px  | 2  = 8px  | 3  = 12px
4    = 16px  | 6  = 24px | 8  = 32px | 12 = 48px
16   = 64px  | 20 = 80px
```

---

## Component Patterns

### Buttons
- **Primary (Mint):** `bg-mint text-ink hover:bg-mint/90`
- **Secondary (Ink):** `bg-ink text-white hover:bg-ink/90`
- **Outline:** `border-mint text-mint hover:bg-mint/20`

### Cards
- **Premium:** White bg, 2px border, shadow-lg
- **Minimal:** Card bg, 1px border
- **Glass:** White/95 opacity, backdrop-blur-12

---

## Design Tokens Location

**File:** `src/index.css`  
**Config:** `tailwind.config.ts`

**Never hardcode colors** - always use tokens.

---

**End of DESIGN_SYSTEM**
