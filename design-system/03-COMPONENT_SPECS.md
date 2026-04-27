# Component Specifications & Design

## 1. PropertyCard Component

### Purpose
Primary visual component for displaying property listings with strong image focus.

### Layout Structure
```
┌─────────────────────────────────┐
│                                 │
│      Property Image (1:1.2)     │
│                                 │
├─────────────────────────────────┤
│  ❤️ (Favorite Button - Absolute)│
│                                 │
│  Glass Overlay at Bottom        │
│  ┌─────────────────────────────┐│
│  │ $2,500/mo                   ││
│  │ 2BR • 1BA • 850 sqft         ││
│  │ Downtown, City Center       ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

### Specifications

#### Container
- **Width**: Full container width (auto-scaled)
- **Height**: Auto (image maintains aspect ratio 1:1.2)
- **Background**: Surface color
- **Border Radius**: 12px
- **Shadow**: Elevation 2
- **Overflow**: Hidden (clips image corners)

#### Image Section
- **Aspect Ratio**: 1:1.2 (width:height)
- **Content Mode**: Cover
- **Loading State**: Placeholder skeleton
- **Badges**: Absolute positioned (top right)
  - New: 12px badge, rgba(59, 130, 246, 0.9)
  - Verified: Green checkmark

#### Glass Overlay (Bottom Section)
- **Height**: 80px
- **Position**: Absolute, bottom 0
- **Opacity**: 75% (rgba white/dark)
- **Blur**: 8px
- **Gradient**: Fade from transparent at top
- **Padding**: 12px 16px

#### Price Text
- **Font**: Display Medium (28px, 700)
- **Color**: Text Primary
- **Line Height**: 1.1
- **Margin**: 0 0 4px 0

#### Title Text
- **Font**: Body Small (12px, 400)
- **Color**: Text Secondary
- **Margin**: 0 0 2px 0
- **Format**: "2BR • 1BA • 850 sqft"

#### Location Text
- **Font**: Body Small (12px, 400)
- **Color**: Text Tertiary
- **Icon**: Location pin (8px) + text
- **Truncate**: 1 line

#### Favorite Button
- **Position**: Absolute, top 12px, right 12px
- **Size**: 44x44 (touch target)
- **Background**: Glass (rgba white/dark, 0.85)
- **Icon**: Heart (24px)
- **Color**: Inactive #BDBDBD, Active #EC4899
- **Z-Index**: 10
- **Animation**: Scale 0.95 on press, bounce on toggle

### States

#### Default
```
Image: Loaded
Overlay: Glass, full opacity
Favorite: Heart outline
Shadow: Elevation 2
```

#### Hover (Web/Tablet)
```
Image: 1.02x zoom
Shadow: Elevation 3
Favorite: Background brightens
Transition: 150ms ease-out
```

#### Pressed
```
Scale: 0.98
Shadow: Elevation 1
Opacity: 0.9
Favorite: If tapped, heart fills with animation
```

#### Favorite Active
```
Icon: Solid heart
Color: #EC4899
Animation: Spring bounce (duration 300ms)
```

#### Loading
```
Image: Skeleton placeholder (blurred gray)
Overlay: Shimmer effect
Badges: Hidden
Favorite: Disabled
```

#### Error
```
Image: Error icon + retry button
Overlay: Semi-transparent dark
Message: "Unable to load image"
Retry: Tappable action
```

### Accessibility
- **Touch Target**: 44x44 minimum (favorite button meets this)
- **Alternative Text**: Image has descriptive alt
- **Favorite Button Label**: "Toggle favorite"
- **Card Tap**: Screen reader announces property details

### Animation
- **Enter**: Fade in + translateY(12px) over 300ms
- **Favorite Toggle**: Heart fills + scale 1.2 → 1 over 400ms
- **List Scroll**: Parallax subtle shift (iOS)

### Responsive Behavior
- **Mobile**: Full width minus 16px padding on sides
- **Tablet**: 2-3 column grid, 200-240px width
- **Large**: 3-4 column grid, 240-280px width

### Variants

#### Compact (Search Results)
- Height: 200px
- Image Ratio: 16:9
- Overlay: More transparent
- Text: Smaller fonts

#### Large (Detail View)
- Height: 350px
- Image Ratio: 1:1
- Overlay: More prominent
- Text: Larger fonts, more details

#### Horizontal (Favorites List)
- Layout: Horizontal
- Image: 120x120px
- Content: Right side, stacked text
- Favorite: Left aligned

---

## 2. GlassContainer Component

### Purpose
Reusable glass surface for any container needing frosted glass effect.

### Props
```typescript
interface GlassContainerProps {
  opacity?: 0.6 | 0.65 | 0.7 | 0.75 | 0.8 | 0.85;  // Default: 0.75
  blur?: 'light' | 'standard' | 'medium' | 'heavy'; // Default: 'standard'
  variant?: 'primary' | 'secondary' | 'accent';     // Default: 'primary'
  elevation?: 0 | 1 | 2 | 3 | 4;                   // Default: 2
  borderRadius?: 'small' | 'medium' | 'large';      // Default: 'medium'
  children: ReactNode;
  style?: ViewStyle;
  testID?: string;
}
```

### Specifications

#### Light Mode Glass by Variant

**Primary**
- Background: rgba(255, 255, 255, 0.75)
- Blur: 12px
- Border: 1px solid rgba(200, 200, 200, 0.3)
- Shadow: Elevation 2

**Secondary**
- Background: rgba(240, 240, 240, 0.8)
- Blur: 8px
- Border: 0.5px solid rgba(200, 200, 200, 0.2)
- Shadow: Elevation 1

**Accent**
- Background: rgba(232, 244, 253, 0.65)
- Blur: 8px
- Border: 1px solid rgba(37, 99, 235, 0.15)
- Shadow: Elevation 1

#### Dark Mode Glass by Variant

**Primary**
- Background: rgba(30, 30, 30, 0.75)
- Blur: 12px
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Shadow: Elevation 2

**Secondary**
- Background: rgba(15, 15, 15, 0.8)
- Blur: 8px
- Border: 0.5px solid rgba(100, 100, 100, 0.15)
- Shadow: Elevation 1

**Accent**
- Background: rgba(26, 58, 77, 0.65)
- Blur: 8px
- Border: 1px solid rgba(96, 165, 250, 0.15)
- Shadow: Elevation 1

#### Border Radius Options
- **small**: 4px
- **medium**: 8px (default)
- **large**: 12px

### Usage Examples

```jsx
// Filter bar
<GlassContainer variant="accent" blur="standard" elevation={2}>
  <FilterBar />
</GlassContainer>

// Modal header
<GlassContainer variant="primary" blur="medium">
  <ModalHeader />
</GlassContainer>

// Bottom sheet
<GlassContainer variant="primary" blur="heavy" borderRadius="large">
  <BottomSheetContent />
</GlassContainer>
```

### Performance Considerations
- Use `memo()` to prevent unnecessary re-renders
- Blur effect disabled on low-end devices automatically
- Optional platform-specific blur implementation

---

## 3. FilterChip Component

### Purpose
Interactive selection chip for filtering, with glass style.

### Layout
```
┌─────────────────────┐
│ 🏠 2-3 Bedrooms   ✕ │
└─────────────────────┘
```

### Specifications

#### Container
- **Height**: 32px
- **Padding**: 8px 12px
- **Border Radius**: 16px (pill)
- **Background**: Glass Secondary (70% opacity)
- **Border**: None (unless active)
- **Touch Target**: Min 44px height (add vertical padding)

#### Inactive State
- **Background**: rgba(240, 240, 240, 0.7) (Light) / rgba(15, 15, 15, 0.8) (Dark)
- **Text Color**: Text Secondary
- **Icon**: 14px, gray
- **Shadow**: Elevation 0

#### Active State
- **Background**: Glass Accent (65% opacity)
- **Border**: 1px solid rgba(37, 99, 235, 0.3) (Light) / rgba(96, 165, 250, 0.2) (Dark)
- **Text Color**: Brand Primary
- **Icon**: 14px, brand color
- **Shadow**: Elevation 1
- **Animation**: 150ms scale 1.05

#### Hover State (Web/Tablet)
- **Opacity**: +10%
- **Scale**: 1.02
- **Transition**: 150ms ease-out

#### Press State
- **Scale**: 0.95
- **Opacity**: -10%
- **Shadow**: Elevation 0

#### Close Button (if removable)
- **Size**: 20x20
- **Margin**: 0 -4px 0 4px
- **Icon**: X (12px)
- **Color**: Text Tertiary
- **Tap Area**: 44x44 (extends beyond visible chip)

### Animation
- **Enter**: Scale 0.8 → 1, opacity 0 → 1 over 200ms
- **Exit**: Scale 1 → 0.8, opacity 1 → 0 over 200ms
- **Toggle**: Scale 0.95 → 1.05 → 1 over 300ms

### Accessibility
- **Role**: Button/toggle
- **Label**: Chip text + "filter"
- **Keyboard**: Spacebar to toggle
- **Focus**: Visible focus ring (2px, offset 2px)

### Variants

#### Size
- **Small**: 24px height, 6px 10px padding (for dense layouts)
- **Standard**: 32px height, 8px 12px padding
- **Large**: 40px height, 10px 14px padding

#### Type
- **Filter**: Default, shows label
- **Closable**: With X button for removal
- **Icon Only**: Just icon, no label (24x24)

---

## 4. ImageCarousel Component

### Purpose
Full-screen image gallery for property details with glass overlays for actions.

### Layout
```
┌────────────────────────────┐
│      Image (Full Width)     │
│                             │
│   Glass Action Overlay      │ ← Absolute, top-right
│   [Favorite] [Share] [More] │
│                             │
│   Page Indicator            │ ← Glass dot indicators
│   •••••                     │
└────────────────────────────┘
```

### Specifications

#### Container
- **Width**: Full screen
- **Height**: 60% of screen (adjustable)
- **Aspect Ratio**: 1:1
- **Background**: Surface 1 (loading state)

#### Image
- **Content Mode**: AspectFill
- **Cache**: Local + network cache
- **Loading**: Skeleton placeholder
- **Zoom**: Pinch-to-zoom enabled (iOS/Android)

#### Action Overlay (Top Right)
- **Position**: Absolute, top 16px, right 16px
- **Background**: Glass Secondary, 75% opacity
- **Layout**: Horizontal, spacing 8px
- **Padding**: 8px
- **Border Radius**: 8px
- **Shadow**: Elevation 2

#### Action Buttons
- **Size**: 44x44 each
- **Icon**: 24px
- **Background**: Transparent on glass
- **States**: Hover (opacity +10%), Press (scale 0.95)

#### Page Indicator
- **Position**: Absolute, bottom 16px, center
- **Background**: Glass Secondary, 70% opacity
- **Layout**: Horizontal dots
- **Padding**: 6px 12px
- **Border Radius**: 12px
- **Dots**: 6px diameter, 4px spacing
- **Active**: Brand Primary, others Text Tertiary

#### Swipe Gesture
- **Swipe Left**: Next image
- **Swipe Right**: Previous image
- **Animation**: 300ms snap-to-position
- **Velocity**: Fling to next image if swipe > 20px

### States

#### Loaded
- Image visible
- Overlays interactive
- Page indicator shows current

#### Loading
- Skeleton placeholder
- Disabled interactions
- Spinner in center

#### Error
- Error icon
- Retry button
- Message: "Could not load image"

#### Fullscreen Mode (Optional)
- Hide overlays on tap
- Double-tap to zoom
- Swipe down to close

### Accessibility
- **Alt Text**: Each image has description
- **Page Indicator**: Announces "Image 3 of 10"
- **Buttons**: Labeled (Favorite, Share, More options)
- **Keyboard**: Arrow keys for navigation

### Performance
- **Lazy Loading**: Load adjacent images only
- **Memory**: Cache last 3 images max
- **Decode**: Async image decoding

---

## 5. ContactCTA Component

### Purpose
Primary call-to-action section (solid, NOT glass) for property contact/booking.

### Layout
```
┌─────────────────────────────────┐
│                                 │
│  Quick Actions (Glass Buttons)  │
│  [📞 Call] [💬 Message] [📅 Visit]
│                                 │
│  Primary CTA (Solid Button)     │
│  ┌─────────────────────────────┐│
│  │  Book Now / Contact Agent   ││
│  └─────────────────────────────┘│
│                                 │
│  Secondary Action (Link)        │
│  → Report Listing              │
│                                 │
└─────────────────────────────────┘
```

### Specifications

#### Container
- **Width**: Full width minus 16px padding
- **Padding**: 16px
- **Background**: Surface 2 (NOT glass for clarity)
- **Border Radius**: 12px
- **Shadow**: Elevation 1
- **Margin**: 16px bottom (sticky or float)

#### Quick Action Buttons (Glass Style)
- **Layout**: 3 equal columns
- **Height**: 48px
- **Background**: Glass Secondary
- **Icon**: 20px
- **Text**: Label 12px
- **Border Radius**: 8px
- **Gap**: 8px between buttons

#### Primary CTA Button (Solid)
- **Width**: Full width
- **Height**: 56px
- **Background**: Brand Primary (#2563EB)
- **Text**: Label 16px, 600 weight, white
- **Border Radius**: 8px
- **Shadow**: Elevation 1
- **Animation**: Press scales to 0.98, animation duration 150ms

#### Secondary Action (Link)
- **Text**: Body 14px, Brand Primary
- **Icon**: Small arrow (8px)
- **Background**: Transparent
- **Padding**: 12px
- **Margin Top**: 12px
- **Touch Target**: Full width

### States

#### Default
- All buttons interactive
- CTA button at full opacity
- Secondary link visible

#### Loading
- CTA button shows spinner
- Text: "Processing..."
- Buttons disabled
- Spinner color: white

#### Success
- Checkmark icon + "Sent!"
- Animation: Pulse + slide-out
- Auto-dismiss: 3 seconds
- Redirect to confirmation

#### Error
- Red background (#EF4444)
- Error icon + message
- "Unable to process, try again"
- Manual dismiss required

### Accessibility
- **Touch Target**: All buttons 48x48 minimum
- **Labels**: Each action is descriptive
- **Loading**: Announces "Processing your request"
- **Focus**: Visible focus indicators (2px offset)

### Variants

#### Minimal (Guest View)
- Quick actions only
- CTA: "Contact Agent"

#### Full (Logged In)
- Quick actions
- CTA: "Book Now"
- Pricing breakdown link

#### Hosted (Owner View)
- Actions: Message, Mark Unavailable, Edit
- CTA: "View Analytics"

---

## 6. BottomSheet Component

### Purpose
Modal overlay for detailed filters, actions, or secondary content.

### Layout
```
┌─────────────────────────────────┐
│                                 │  ← Handle indicator (glass pill)
│ ╌╌╌╌╌╌╌╌╌╌╌╌                    │
│                                 │
│ Filter Heading                  │
│                                 │
│ [Content Area - Scrollable]     │
│                                 │
│ Glass Container                 │
│ [Cancel] [Apply]                │
│                                 │
└─────────────────────────────────┘
```

### Specifications

#### Container
- **Position**: Bottom sheet (animates from bottom)
- **Width**: Full screen
- **Max Height**: 85% of screen (iPad: 60%)
- **Background**: Surface color
- **Border Radius**: 16px top corners only
- **Shadow**: Elevation 4

#### Handle Indicator
- **Size**: 36px wide, 4px tall
- **Position**: Top center, 12px margin
- **Background**: Glass Secondary
- **Border Radius**: 2px
- **Opacity**: 60%

#### Header
- **Padding**: 16px
- **Background**: Transparent (or subtle glass)
- **Title**: Heading 2 (20px, 600)
- **Close Button**: X icon, top-right

#### Content Area
- **Padding**: 0 16px 16px 16px
- **Overflow**: Scrollable (FlatList/ScrollView)
- **Max Scrollable Height**: Remaining height - header - footer

#### Footer (Action Buttons)
- **Position**: Sticky bottom (glass background)
- **Layout**: 2 columns (Cancel | Apply)
- **Height**: 60px + 16px padding
- **Background**: Glass Primary or Surface 1
- **Buttons**: Equal width, 44px height

#### Backdrop
- **Background**: rgba(0, 0, 0, 0.4) (Light) / rgba(0, 0, 0, 0.6) (Dark)
- **Blur**: 4px (optional)
- **Dismissible**: Tap to close
- **Z-Index**: 100

### Animation

#### Open
```
Duration: 400ms
Easing: Ease out
Properties:
  - Transform: translateY(100%) → translateY(0)
  - Opacity: 0 → 1
  - Backdrop: Fade in
```

#### Close
```
Duration: 300ms
Easing: Ease in
Properties:
  - Transform: translateY(0) → translateY(100%)
  - Opacity: 1 → 0
  - Backdrop: Fade out
```

#### Drag (Native Feel)
- Pan gesture to drag down
- Snap points: 0% (open) / 100% (closed)
- Velocity-based: Fast drag auto-closes
- Haptic feedback on snap

### Accessibility
- **Role**: Dialog/modal
- **Label**: Sheet title announced
- **Focus**: Trap within sheet
- **Escape/Back**: Closes sheet
- **Scroll**: Announces position

### Variants

#### Filter Sheet
- Header: "Filter"
- Content: Filter options (chips, sliders, dates)
- Footer: Cancel | Apply Filters

#### Details Sheet
- Header: "More Information"
- Content: Scrollable content
- Footer: Single "Done" button

#### Confirmation Sheet
- Header: Action title
- Content: Confirmation message
- Footer: Cancel | Confirm

---

## 7. Navigation Tab Bar (Glass Style)

### Purpose
Bottom navigation with glass aesthetic for modern feel.

### Layout
```
┌─────────────────────────────────┐
│                                 │
│ Glass Tab Container             │  ← Translucent
│ ┌─────────────────────────────┐ │
│ │  [🏠] [❤️] [🔔] [👤]       │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Specifications

#### Container
- **Height**: 64px (including safe area)
- **Position**: Fixed bottom
- **Background**: Glass Primary (75% opacity)
- **Border Radius**: 16px top corners
- **Shadow**: Elevation 3
- **Safe Area**: Bottom inset padding

#### Tab Items
- **Count**: 4 tabs
- **Width**: Equal (25% each)
- **Height**: 48px (within 64px container)
- **Layout**: Centered, vertical stack (icon + label)

#### Tab Icon
- **Size**: 24px
- **Color**: Text Tertiary (inactive), Brand Primary (active)
- **Animation**: Scale 1.2 on active
- **Margin Bottom**: 2px

#### Tab Label
- **Font**: Overline (11px, 600)
- **Color**: Text Tertiary (inactive), Text Primary (active)
- **Truncate**: 1 line
- **Animation**: Opacity fade on state change

#### Active Tab State
- **Background**: Glass Accent (65% opacity, optional)
- **Icon Color**: Brand Primary
- **Label Color**: Text Primary
- **Border Bottom**: 2px solid Brand Primary (or just color change)

#### Inactive Tab State
- **Icon Color**: Text Tertiary
- **Label Color**: Text Tertiary
- **Background**: Transparent

#### Badge (Notifications)
- **Position**: Absolute, top-right of icon
- **Size**: 18x18 (circle)
- **Background**: Danger (red)
- **Text**: Count, 10px, bold, white
- **Z-Index**: 10

### Animation
- **Tab Switch**: Scale 0.8 → 1 + fade in (200ms)
- **Badge**: Pulse when count increases
- **Swipe**: Parallax effect as user swipes

### Accessibility
- **Role**: Tablist
- **Touch Target**: Full width section (>48px)
- **Label**: Tab name announced
- **Keyboard**: Left/Right arrows to navigate
- **Current**: aria-selected for active tab

---

## 8. FilterBar Component (Floating Glass)

### Purpose
Persistent floating filter controls at top of search/list screens.

### Layout
```
┌─────────────────────────────────┐
│  Glass Filter Container         │
│  ┌───────────────────────────┐  │
│  │ 🔍 Search... [⚙️ Filters] │  │
│  └───────────────────────────┘  │
│  [Price] [Type] [Size] [More ▾] │
│  ┴────────────────────────────┴  
```

### Specifications

#### Container
- **Position**: Sticky/fixed top (below header)
- **Width**: Full width
- **Background**: Glass Primary (75% opacity)
- **Padding**: 12px 16px
- **Gap**: 12px vertical
- **Z-Index**: 20 (below nav, above content)
- **Shadow**: Elevation 2

#### Search Bar
- **Height**: 44px
- **Background**: Surface color (solid, NOT glass)
- **Border Radius**: 8px
- **Padding**: 0 12px
- **Icon**: Magnifying glass (16px)
- **Placeholder**: "Search by location..."
- **Text**: Body 14px
- **Focus**: Border 2px Brand Primary

#### Filter Button
- **Width**: 44px (square)
- **Height**: 44px
- **Background**: Glass Secondary (70% opacity)
- **Border Radius**: 8px
- **Icon**: Slider/settings (18px)
- **Color**: Brand Primary
- **Badge**: Count badge if filters applied

#### Filter Chips Row
- **Layout**: Horizontal scroll
- **Spacing**: 8px
- **Chip Variants**: See FilterChip component

#### Collapse/Expand Animation
- **Trigger**: User scrolls down (collapse), up (expand)
- **Duration**: 200ms
- **Effect**: Chips fade out, search bar becomes compact

### State

#### Expanded
- Search bar visible
- Filter chips visible
- Full height (120px approx)

#### Collapsed
- Only chip indicators visible
- Search bar hidden
- Compact height (44px)
- Show active filter count

#### Sticky Behavior
- Stick to top when scrolling down
- Collapse to save space
- Expand when user scrolls back up

### Accessibility
- **Search Input**: Clear label, autocomplete disabled
- **Filter Button**: "Open filters dialog"
- **Chips**: Each is a button, removable
- **Keyboard**: Tab through all controls

---

## Design Token Implementation (React Native)

Create a central `theme.ts` file:

```typescript
// src/theme.ts
export const colors = {
  light: {
    surface: {
      0: '#FFFFFF',
      1: '#FAFAFA',
      2: '#F5F5F5',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      tertiary: '#999999',
    },
    glass: {
      primary: 'rgba(255, 255, 255, 0.75)',
      secondary: 'rgba(240, 240, 240, 0.8)',
      accent: 'rgba(232, 244, 253, 0.65)',
    },
    brand: {
      primary: '#2563EB',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      favorite: '#EC4899',
    },
  },
  dark: {
    // ... dark theme colors
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

export const typography = {
  displayLarge: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  // ... other scales
};

export const shadows = {
  elevation: {
    0: 'none',
    1: '0 1px 3px rgba(0,0,0,0.12)',
    2: '0 3px 8px rgba(0,0,0,0.15)',
    3: '0 8px 16px rgba(0,0,0,0.12)',
    4: '0 12px 24px rgba(0,0,0,0.15)',
  },
};

export const borderRadius = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  full: 9999,
};
```

