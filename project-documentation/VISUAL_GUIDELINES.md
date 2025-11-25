# Visual Guidelines

**Last Updated:** 2025-11-25

---

## Visual Principles

1. **Bold, Not Busy** - Strong elements, generous white space
2. **Functional, Not Decorative** - Every visual serves purpose
3. **Professional, Not Corporate** - Clean but not sterile
4. **Modern, Not Trendy** - Timeless design

---

## Button Styles

### Primary CTA (Mint)
```tsx
<Button className="bg-mint text-ink hover:bg-mint/90 shadow-lg hover:scale-105">
```

### Secondary (Ink)
```tsx
<Button className="bg-ink text-white hover:bg-ink/90">
```

---

## Color Application

### Text Hierarchy
- Primary text: `text-foreground` (ink)
- Secondary text: `text-muted-foreground` (mid-grey)
- Headings: `text-foreground` (ink)

### Background Usage
- Page: `bg-background` (off-white)
- Card: `bg-card` (white)
- Dark sections: `bg-ink`
- Accent: `bg-mint/10`

---

## Accessibility

### Focus States
```css
focus-visible:ring-2 focus-visible:ring-mint
```

### Color Contrast
- Ink on Off-White = 12.6:1 ✅
- Mint on White = 1.9:1 (accent only, not text)

---

**End of VISUAL_GUIDELINES**
