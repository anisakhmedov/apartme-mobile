# Liquid Glass Design System - Implementation Guide

## 1. Liquid Glass Fundamentals

Liquid Glass is a premium aesthetic combining:
- **Translucency**: Semi-transparent surfaces revealing layered depth
- **Frosted Effect**: Soft blur creating glass-like appearance
- **Depth Layering**: Strategic z-index and shadow creates perceived elevation
- **Gentle Highlights**: Subtle inner shadows simulate light refraction
- **Soft Edges**: Rounded corners enhance glass perception

### Core Principle
> Glass is a container for information and interaction, not a replacement for clear UI.

---

## 2. Glass Surface Specifications

### Light Mode Glass

#### Primary Glass Surface
```
Background Color: rgba(255, 255, 255, 0.75)  // 75% opaque white
Backdrop Blur: 8-12px (iOS: blur(12px), Android: approximation)
Border: 1px solid rgba(255, 255, 255, 0.3)   // Subtle inner edge
Shadow: 0 3px 8px rgba(0, 0, 0, 0.08)       // Soft drop shadow
Inner Shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8)  // Top highlight
```

#### Secondary Glass Surface (Less Dominant)
```
Background Color: rgba(240, 240, 240, 0.8)  // 80% opaque gray
Backdrop Blur: 6-8px
Border: None or 0.5px solid rgba(200, 200, 200, 0.2)
Shadow: 0 2px 4px rgba(0, 0, 0, 0.06)
Inner Shadow: Subtle or none
```

#### Accent Glass (Filters, Active States)
```
Background Color: rgba(232, 244, 253, 0.65)  // 65% opaque soft blue
Backdrop Blur: 8px
Border: 1px solid rgba(37, 99, 235, 0.15)   // Brand blue tint
Shadow: 0 2px 6px rgba(37, 99, 235, 0.1)
Inner Shadow: None
```

### Dark Mode Glass

#### Primary Glass Surface
```
Background Color: rgba(30, 30, 30, 0.75)     // 75% opaque dark gray
Backdrop Blur: 8-12px
Border: 1px solid rgba(255, 255, 255, 0.1)  // Subtle light edge
Shadow: 0 3px 8px rgba(0, 0, 0, 0.3)        // Stronger shadow
Inner Shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05)  // Subtle top glow
```

#### Secondary Glass Surface
```
Background Color: rgba(15, 15, 15, 0.8)     // 80% opaque very dark
Backdrop Blur: 6-8px
Border: None or 0.5px solid rgba(100, 100, 100, 0.15)
Shadow: 0 2px 4px rgba(0, 0, 0, 0.4)
Inner Shadow: None
```

#### Accent Glass
```
Background Color: rgba(26, 58, 77, 0.65)    // 65% opaque deep blue
Backdrop Blur: 8px
Border: 1px solid rgba(96, 165, 250, 0.15) // Lighter blue tint
Shadow: 0 2px 6px rgba(96, 165, 250, 0.1)
Inner Shadow: None
```

---

## 3. Blur Implementation Strategy

### Performance-First Approach

#### iOS Implementation
- **Native**: Use `BlurView` from `@react-native-community/blur` for real-time blur
- **Blur Value**: 8-12 for primary surfaces, 6-8 for secondary
- **Overlay Intensity**: 0.2 (20% tint overlay)

#### Android Implementation
- **Static Blur**: Pre-blurred background image (performance priority)
- **Alternative**: Gradient approximation (no real-time blur for performance)
- **Fallback**: Solid colored glass without blur

#### Web (if applicable)
```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```

### Blur Levels Reference

| Level | Effect | Use Case |
|-------|--------|----------|
| **Light (4px)** | Barely perceptible | Hover states |
| **Standard (8px)** | Noticeable frosted effect | Filter bars, floating panels |
| **Medium (10px)** | Clear glass appearance | Card overlays |
| **Heavy (12px)** | Strong depth effect | Modal backgrounds |

---

## 4. Text Rendering on Glass

### Critical for Readability

#### Light Mode - Text on Glass
```
Text: #1A1A1A (Primary black)
Minimum Contrast Ratio: 7:1 (AAA compliant)
Text Shadow: None (already on light background)
Backdrop: If text is white/light on dark glass, add subtle text shadow:
         0 1px 3px rgba(0, 0, 0, 0.3)
```

#### Dark Mode - Text on Glass
```
Text: #F5F5F5 (Bright white)
Minimum Contrast Ratio: 7:1 (AAA compliant)
Text Shadow: 0 1px 2px rgba(0, 0, 0, 0.5) for additional clarity
Backdrop: Glass is dark enough; no additional tint needed
```

#### On Thin/Weak Glass Surfaces
If contrast is insufficient, add a tint layer:
```
Light Mode: Semi-opaque white background (rgba(255, 255, 255, 0.3))
Dark Mode: Semi-opaque dark background (rgba(0, 0, 0, 0.2))
```

---

## 5. Glass Container Variations

### Floating Panel (Primary Use)
- **Opacity**: 75%
- **Blur**: 12px
- **Border**: 1px subtle inner edge
- **Elevation**: 3 (shadow depth)
- **Padding**: 16px (lg)
- **Example**: Filter bar, bottom sheet header

### Filter Chip (Secondary Use)
- **Opacity**: 70%
- **Blur**: 8px
- **Border**: None or very subtle
- **Elevation**: 1 (minimal shadow)
- **Padding**: 8px 12px
- **Shape**: Rounded corners (8-16px)
- **Example**: Tag filters, toggle buttons

### Card Overlay (Minimal Use)
- **Opacity**: 65-70%
- **Blur**: 8px
- **Position**: Absolute, bottom of card
- **Height**: 60-80px
- **Fade**: Gradient fade at top
- **Example**: Price overlay on property image

### Background Tint (Enhancement)
- **Coverage**: Full screen behind modal
- **Opacity**: 40% (light) / 50% (dark)
- **Blur**: Optional (4-6px if performance allows)
- **Color**: Current theme surface color
- **Purpose**: Depth and modal focus

---

## 6. Glass Placement Rules

### ✅ APPROPRIATE Uses

1. **Filter/Search Bars**
   - Top of screen (sticky)
   - Light overlay with rounded corners
   - Quick filtering UI

2. **Bottom Sheets**
   - Header area with action buttons
   - Floating handle indicator
   - Glass bar at top

3. **Floating Action Buttons (FAB)**
   - Round, elevated containers
   - Minimal glass style
   - Shadow for depth

4. **Navigation Elements**
   - Tab bar overlays
   - Navigation header
   - Sticky controls

5. **Modal Headers**
   - Top section with title/controls
   - Slight blur enhancement
   - Clear action buttons

6. **Quick Info Overlays**
   - Price tags on property images
   - Location badges
   - Quick action buttons

### ❌ INAPPROPRIATE Uses

1. **Long Text Content**
   - Reading articles, descriptions
   - Dense information blocks
   - Use solid backgrounds instead

2. **Input Fields**
   - Text input, text areas
   - Search input (glass bar OK, not field itself)
   - Use solid with subtle border

3. **Large Cards**
   - Property detail cards
   - Review/comment cards
   - Use solid with shadow

4. **Data Tables**
   - Lists of information
   - Dense metadata
   - Use solid backgrounds

5. **Full-Screen Overlays**
   - Forms, detailed screens
   - Use semi-transparent solid, not glass

---

## 7. Animation on Glass Surfaces

### Enter Animation (Into View)
```
Duration: 300ms
Easing: cubic-bezier(0.0, 0, 0.2, 1)  // Ease out
Properties:
  - Opacity: 0 → 1
  - Transform: translateY(20px) → translateY(0)
  - Blur: 0px → 8px (optional simultaneous blur)
```

### Exit Animation (Out of View)
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 1, 1)  // Ease in
Properties:
  - Opacity: 1 → 0
  - Transform: translateY(0) → translateY(-10px)
  - Blur: 8px → 0px (optional)
```

### Hover/Press State (Interactive)
```
Duration: 150ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)  // Ease in out
Properties:
  - Opacity: Adjust ±10%
  - Scale: 0.98 (subtle press feedback)
  - Shadow: Elevation shift (±1 level)
```

---

## 8. Light Refraction & Polish Details

### Highlight Effect (Simulated Light)
Place subtle white overlay at top of glass surface:
```
Position: Absolute, top: 0, left: 0
Height: 1-2px
Background: rgba(255, 255, 255, 0.4)  // Light mode
Background: rgba(255, 255, 255, 0.05) // Dark mode
Blur: 1px
Opacity: 0.5
```

### Inner Shadow (Depth Illusion)
```
Light Mode: inset 0 1px 0 rgba(255, 255, 255, 0.8)
            inset 0 -1px 2px rgba(0, 0, 0, 0.05)

Dark Mode:  inset 0 1px 0 rgba(255, 255, 255, 0.1)
            inset 0 -1px 2px rgba(0, 0, 0, 0.3)
```

### Edge Definition (Frosted Edge)
```
Border: 1px solid (theme-dependent)
Light Mode: rgba(200, 200, 200, 0.3)
Dark Mode:  rgba(255, 255, 255, 0.1)
```

---

## 9. Glass Theme Transitions

### Light ↔ Dark Mode Toggle

When user switches themes:
```
Duration: 400ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)

Properties:
  - Background Color: Fade to new color
  - Opacity: Maintain (no flicker)
  - Border Color: Fade to new color
  - Text Color: Fade to new color
  - Shadow: Adjust intensity smoothly
```

### Implementation Tip
Use `useEffect` to track theme changes and animate all glass surfaces simultaneously for cohesion.

---

## 10. Accessibility on Glass

### Contrast Verification
- Minimum WCAG AA: 4.5:1 for text
- Target WCAG AAA: 7:1 for primary text
- Use contrast checker tools for glass combinations

### High Contrast Mode Support
If system has high contrast enabled:
```
Disable blur effects (performance + clarity)
Increase opacity to 90%+
Increase border visibility (2px, higher opacity)
Add text shadow for clarity
```

### Motion Accessibility
- Respect `prefers-reduced-motion`
- Disable animations if this setting is active
- Keep interactions instant and clear

### Dynamic Type Support
- Text scales with system font size
- Glass container adjusts padding proportionally
- Test at 140% and 200% font sizes

---

## 11. Performance Optimization

### iOS Specific
```swift
// Use rasterization for complex glass hierarchies
shouldRasterize: true
rasterizationScale: UIScreen.main.scale
```

### Android Specific
- Avoid real-time blur, use pre-rendered assets
- Gradient fallback instead of blur
- Test on mid-range devices (Snapdragon 8 Gen 1 equivalent)

### General Optimization
- Limit simultaneous blur effects (max 3-4 on screen)
- Use `will-change` sparingly
- Cache blurred backgrounds
- Lazy load glass effects during scroll

### Memory Considerations
- Blur is memory-intensive; monitor heap usage
- Release blur effects when component unmounts
- Use `shouldComponentUpdate` to prevent unnecessary re-renders

---

## 12. Testing Checklist for Glass Implementation

- [ ] Blur renders smoothly at 60fps (iOS) / 90fps (Android)
- [ ] Text contrast meets WCAG AAA on all glass surfaces
- [ ] Transitions between light/dark mode are smooth
- [ ] Glass effects respect `prefers-reduced-motion`
- [ ] Touch targets remain ≥44x44 in glass containers
- [ ] No jank during list scrolling with glass overlays
- [ ] Image visibility not compromised by glass layers
- [ ] Glass edges are crisp and defined
- [ ] Animations feel premium, not slow
- [ ] Battery impact acceptable (test on low-power mode)
- [ ] Tested on actual devices (not just simulators)

---

## 13. Color Palettes for Glass Context

### Property Card Glass Overlay (Light Mode)
```
Background: rgba(255, 255, 255, 0.8)
Price Text: #1A1A1A (Primary)
Location: #666666 (Secondary)
Border: rgba(200, 200, 200, 0.2)
```

### Filter Bar Glass (Light Mode)
```
Background: rgba(232, 244, 253, 0.7)
Active Chip: rgba(37, 99, 235, 0.15) + border
Text: #1A1A1A
Icon: #2563EB
```

### Modal Background Glass (Dark Mode)
```
Background: rgba(30, 30, 30, 0.8)
Backdrop Overlay: rgba(0, 0, 0, 0.5)
Text: #F5F5F5
Border: rgba(255, 255, 255, 0.1)
```

---

## Implementation Priority

1. **Phase 1 (MVP)**: Static glass containers (no blur)
2. **Phase 2**: Light blur on iOS, gradient fallback on Android
3. **Phase 3**: Advanced effects (highlights, inner shadows)
4. **Phase 4**: Performance optimization for all devices

