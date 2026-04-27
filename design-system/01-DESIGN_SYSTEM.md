# Real Estate App - Design System

## 1. Color Palette

### Light Mode

#### Primary Backgrounds
- **Surface 0**: `#FFFFFF` (Pure white - main backgrounds)
- **Surface 1**: `#FAFAFA` (Subtle off-white - secondary backgrounds)
- **Surface 2**: `#F5F5F5` (Light gray - tertiary backgrounds)

#### Glass Tints (Translucent)
- **Glass Base**: `#FFFFFF` with 70-85% opacity (white glass)
- **Glass Dark**: `#F0F0F0` with 75-85% opacity (warm gray glass)
- **Glass Accent**: `#E8F4FD` with 60-70% opacity (soft blue glass for filters)

#### Text Colors
- **Text Primary**: `#1A1A1A` (Near-black for readability)
- **Text Secondary**: `#666666` (Medium gray for metadata)
- **Text Tertiary**: `#999999` (Light gray for hints)

#### Accent Colors
- **Primary Brand**: `#2563EB` (Professional blue - CTAs, active states)
- **Success**: `#10B981` (Green - confirmation, verified badges)
- **Warning**: `#F59E0B` (Amber - alerts, caution)
- **Danger**: `#EF4444` (Red - cancellations, urgent)

#### Semantic
- **Favorite**: `#EC4899` (Pink - heart interactions)
- **Verified Badge**: `#10B981` (Green)
- **New Badge**: `#3B82F6` (Blue)

### Dark Mode

#### Primary Backgrounds
- **Surface 0**: `#121212` (Deep gray-black)
- **Surface 1**: `#1E1E1E` (Charcoal)
- **Surface 2**: `#2A2A2A` (Medium gray-black)

#### Glass Tints (Translucent)
- **Glass Base**: `#1E1E1E` with 70-80% opacity (dark glass)
- **Glass Dark**: `#0F0F0F` with 65-75% opacity (darker glass)
- **Glass Accent**: `#1A3A4D` with 60-70% opacity (deep blue glass for filters)

#### Text Colors
- **Text Primary**: `#F5F5F5` (Bright white)
- **Text Secondary**: `#BDBDBD` (Medium gray)
- **Text Tertiary**: `#757575` (Light gray)

#### Accent Colors
- **Primary Brand**: `#60A5FA` (Lighter blue)
- **Success**: `#34D399` (Brighter green)
- **Warning**: `#FBBF24` (Brighter amber)
- **Danger**: `#F87171` (Brighter red)

---

## 2. Typography

### Font Family
- **Primary**: 'Inter' or system font stack (San Francisco on iOS, Roboto on Android)
- **Fallback**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`

### Type Scale

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| **Display Large** | 32px | 700 | 40px | Screen titles (rare) |
| **Display Medium** | 28px | 700 | 36px | Section headers |
| **Heading 1** | 24px | 700 | 32px | Screen titles |
| **Heading 2** | 20px | 600 | 28px | Section titles |
| **Heading 3** | 18px | 600 | 26px | Card titles |
| **Body Large** | 16px | 400 | 24px | Property descriptions, body text |
| **Body** | 14px | 400 | 22px | Default body text |
| **Body Small** | 12px | 400 | 20px | Metadata, secondary text |
| **Label** | 12px | 600 | 18px | Buttons, badges, tags |
| **Overline** | 11px | 600 | 16px | Section labels, hints |

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## 3. Spacing Scale

Consistent 4px base unit (8pt grid system)

| Size | Value | Usage |
|------|-------|-------|
| **xs** | 4px | Micro spacing, internal padding |
| **sm** | 8px | Tight spacing, icon margins |
| **md** | 12px | Standard padding (components) |
| **lg** | 16px | Card padding, section spacing |
| **xl** | 24px | Screen margin, large gaps |
| **2xl** | 32px | Major section spacing |
| **3xl** | 48px | Full-screen spacing |

---

## 4. Elevation & Depth System

### Shadow Tokens (Light Mode)

| Level | Shadow | Usage |
|-------|--------|-------|
| **Elevation 0** | `none` | Flat elements |
| **Elevation 1** | `0 1px 3px rgba(0,0,0,0.12)` | Subtle lift |
| **Elevation 2** | `0 3px 8px rgba(0,0,0,0.15)` | Cards, modals |
| **Elevation 3** | `0 8px 16px rgba(0,0,0,0.12)` | Floating actions, bottom sheets |
| **Elevation 4** | `0 12px 24px rgba(0,0,0,0.15)` | Modals, overlays |

### Shadow Tokens (Dark Mode)
- **Elevation 1**: `0 1px 3px rgba(0,0,0,0.3)`
- **Elevation 2**: `0 3px 8px rgba(0,0,0,0.4)`
- **Elevation 3**: `0 8px 16px rgba(0,0,0,0.45)`
- **Elevation 4**: `0 12px 24px rgba(0,0,0,0.5)`

---

## 5. Border Radius

| Size | Value | Usage |
|------|-------|-------|
| **None** | 0px | Sharp edges |
| **Small** | 4px | Icon buttons, small tags |
| **Medium** | 8px | Cards, input fields, buttons |
| **Large** | 12px | Large cards, modals |
| **Extra Large** | 16px | Bottom sheets, full-width components |
| **Full** | 9999px | Circular, pill buttons |

---

## 6. Border Width

| Size | Value | Usage |
|------|-------|-------|
| **Subtle** | 0.5px | Dividers, faint borders |
| **Standard** | 1px | Card borders, input borders |
| **Emphasis** | 2px | Active states, focus indicators |

---

## 7. Touch Targets

- **Minimum**: 44x44 (iOS) / 48x48 (Android)
- **Comfortable**: 48x48
- **Large buttons**: 56x56

---

## 8. Motion & Animation

### Duration Scale
- **Short**: 150ms (quick feedback)
- **Standard**: 300ms (transitions)
- **Long**: 500ms (complex transitions)

### Easing Functions
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)` (default)
- **Ease Out**: `cubic-bezier(0.0, 0, 0.2, 1)` (entry animations)
- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)` (exit animations)

---

## 9. Z-Index System

| Layer | Value | Components |
|-------|-------|------------|
| **Base** | 0 | Main content |
| **Elevated** | 10 | Cards, floating buttons |
| **Sticky** | 20 | Headers, sticky filters |
| **Modal** | 100 | Bottom sheets, modals |
| **Overlay** | 200 | Backdrop, full overlays |
| **Toast/Alert** | 300 | Notifications, toasts |

---

## 10. Opacity Scale

| Name | Value | Usage |
|------|-------|-------|
| **Disabled** | 0.5 | Inactive states |
| **Hover** | 0.8 | Hover states |
| **Active** | 1 | Default, active states |
| **Overlay** | 0.4 | Backdrop overlay |
| **Subtle Tint** | 0.08 | Subtle backgrounds |

---

## 11. Responsive Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| **Mobile** | 320px | Minimum width |
| **Tablet** | 600px | Large phones, tablets |
| **Large** | 800px | Large tablets, landscape |

---

## 12. Color Variables (CSS/SCSS Format)

### Light Mode
```css
--color-surface-0: #FFFFFF;
--color-surface-1: #FAFAFA;
--color-surface-2: #F5F5F5;
--color-text-primary: #1A1A1A;
--color-text-secondary: #666666;
--color-text-tertiary: #999999;
--color-brand-primary: #2563EB;
--color-brand-success: #10B981;
--color-brand-warning: #F59E0B;
--color-brand-danger: #EF4444;
--color-favorite: #EC4899;
```

### Dark Mode
```css
--color-surface-0: #121212;
--color-surface-1: #1E1E1E;
--color-surface-2: #2A2A2A;
--color-text-primary: #F5F5F5;
--color-text-secondary: #BDBDBD;
--color-text-tertiary: #757575;
--color-brand-primary: #60A5FA;
--color-brand-success: #34D399;
--color-brand-warning: #FBBF24;
--color-brand-danger: #F87171;
--color-favorite: #EC4899;
```

---

## 13. Grid & Layout

### Safe Area Margins
- **Top**: 16px (accounting for status bar)
- **Bottom**: 16px (accounting for home indicator)
- **Sides**: 16px minimum

### Content Widths
- **Single Column**: Full width - 32px padding (max 350px on very large screens)
- **Multi Column**: 2+ columns at 600px+ breakpoint

---

## Design Principles Applied

1. **Clarity First**: All visual effects serve readability
2. **Trust Through Precision**: Exact alignment and consistent spacing
3. **Depth Without Distraction**: Layering enhances organization, not decoration
4. **Performance Optimized**: Blur and effects are hardware-accelerated where possible
5. **Accessible by Default**: High contrast, readable text, proper touch targets
6. **Dark Mode Native**: Not an afterthought, designed in parallel

