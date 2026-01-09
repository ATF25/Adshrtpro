# AdShrtPro Design Guidelines

## Design Approach
**Reference-Based:** Drawing from Bitly's clean, utility-focused aesthetic combined with modern SaaS patterns from Linear and Stripe. This approach prioritizes clarity, efficiency, and professional minimalism suitable for a productivity tool.

## Typography System

**Font Families:**
- Primary: Inter (Google Fonts) - for UI elements, buttons, labels
- Secondary: Plus Jakarta Sans (Google Fonts) - for headings and emphasis

**Hierarchy:**
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Subsection Headers: text-xl to text-2xl, font-medium
- Body Text: text-base, font-normal, leading-relaxed
- Small Text/Labels: text-sm, font-medium
- Tiny Text/Captions: text-xs

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12 consistently
- Tight spacing: p-2, gap-2
- Standard spacing: p-4, gap-4, m-4
- Section spacing: p-6, py-8
- Large spacing: p-12, py-16

**Container Strategy:**
- Page containers: max-w-7xl mx-auto px-4
- Content sections: max-w-6xl
- Form containers: max-w-md to max-w-lg
- Dashboard cards: Full width with consistent padding (p-6)

## Component Library

### Navigation
- Fixed top navigation bar with subtle shadow
- Left-aligned logo, right-aligned auth buttons/user menu
- Mobile: Hamburger menu with slide-in drawer
- Height: h-16

### URL Shortener (Home Hero)
- Centered, prominent input group
- Single-line input with inline submit button
- Input height: h-14 to h-16 for easy mobile tapping
- Custom alias toggle below main input
- Recent links section below (for logged-in users)

### Dashboard Cards
- Rounded corners: rounded-lg
- Consistent padding: p-6
- Subtle elevation with shadow-sm
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

### Data Tables
- Striped rows for readability
- Hover state on rows
- Compact cell padding: px-4 py-3
- Action buttons aligned right
- Mobile: Card-based layout instead of table

### Analytics Display
- Large metric cards with icon, number, label
- Grid: grid-cols-2 md:grid-cols-4 gap-4
- Charts use simple, readable visualizations
- Locked state: Blurred overlay with centered unlock CTA

### Forms
- Input fields: h-12, rounded-md, px-4
- Labels: text-sm font-medium mb-2
- Helper text: text-xs below inputs
- Error states: Red text and border treatment
- Submit buttons: Full width on mobile, inline on desktop

### Buttons
- Primary: h-12, px-6, rounded-md, font-medium
- Secondary: Same size, outlined style
- Icon buttons: Square aspect ratio, p-3
- Implement standard hover/active states

### Admin Panel
- Sidebar navigation (desktop): w-64, fixed
- Main content: ml-64 on desktop, full width on mobile
- Stats grid at top: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Management tables below stats

### Blog
- Blog listing: Card grid, grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Featured image aspect ratio: aspect-video
- Post page: max-w-3xl centered, generous line-height
- Publish date and reading time metadata

### Modals/Overlays
- Centered overlay with backdrop blur
- Max width: max-w-md to max-w-lg
- Padding: p-6 to p-8
- Close button: top-right corner

### QR Code Section
- Centered display with preview
- Color picker below preview
- Download button (requires unlock) prominent
- Preview size: w-64 h-64

## Icons
**Library:** Heroicons (via CDN)
- Navigation: outline variants
- Actions: solid variants
- Consistent sizing: w-5 h-5 for inline, w-6 h-6 for prominent

## Images

**Hero Section:**
No large hero image. The home page leads with the URL shortener interface itself - this is a utility-first design where the tool is the hero.

**Blog Posts:**
- Featured images required for each post
- Aspect ratio: 16:9 (aspect-video)
- Position: Above title in listing cards, full width in post view

**Dashboard:**
- Illustrations for empty states (placeholder comments)
- Small icons within metric cards

## Responsive Breakpoints
- Mobile: Base styles
- Tablet: md: (768px)
- Desktop: lg: (1024px)
- Wide: xl: (1280px)

## Key UX Patterns

**Analytics Unlock Flow:**
- Locked: Blurred chart preview with centered unlock button
- Countdown timer when unlocked (top-right corner)
- Clear visual feedback on unlock success

**Link Management:**
- Copy button with instant feedback (checkmark animation)
- Quick actions dropdown on each link row
- Bulk selection for logged-in users

**Empty States:**
- Centered icon and message
- Clear CTA to take first action
- Helpful context text

**Rate Limiting Feedback:**
- Persistent banner when approaching limit
- Clear counter showing remaining links

This design system creates a professional, efficient interface that prioritizes user productivity while maintaining visual polish suitable for a modern SaaS product.