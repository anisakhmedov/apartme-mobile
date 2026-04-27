# Interaction Patterns & Animation Guidelines

## 1. Core Animation Principles

### Easing Curves

All animations follow one of three easing curves for consistency:

#### Standard Easing (Default)
```
cubic-bezier(0.4, 0, 0.2, 1)
Use for: General transitions, state changes
Effect: Smooth acceleration and deceleration
```

#### Ease Out (Enter animations)
```
cubic-bezier(0, 0, 0.2, 1)
Use for: Elements entering screen
Effect: Quick start, smooth finish
Feeling: Responsive, crisp
```

#### Ease In (Exit animations)
```
cubic-bezier(0.4, 0, 1, 1)
Use for: Elements leaving screen
Effect: Smooth start, quick finish
Feeling: Purposeful, final
```

### Duration Guidelines

| Animation Type | Duration | Easing | Use Case |
|---|---|---|---|
| **Micro** | 75-150ms | Standard | Hover, quick feedback |
| **Quick** | 150-200ms | Ease Out | Tab switches, toggles |
| **Standard** | 250-350ms | Standard | Screen transitions, modals |
| **Slow** | 400-500ms | Ease In | Complex transitions, theme switch |

### Choreography Principles

1. **Stagger Effect**: 50-100ms delay between elements
2. **Cascade**: Child elements follow parent animation
3. **Parallax**: Different layers move at different speeds
4. **Anticipation**: Slight reverse animation before main movement
5. **Follow-through**: Elements settle after animation completes

---

## 2. Navigation Transitions

### Screen Push (Forward Navigation)

When navigating to detail/child screen:

```
Incoming Screen:
  Transform: translateX(100%) → translateX(0)
  Opacity: 0 → 1
  Duration: 350ms
  Easing: Ease Out

Outgoing Screen:
  Transform: translateX(0) → translateX(-30%)
  Opacity: 1 → 0.9 (subtle fade)
  Duration: 350ms
  Easing: Ease Out
  Blur: 0px → 4px (optional, light)
```

### Screen Pop (Back Navigation)

When returning to previous screen:

```
Incoming Screen (Previous):
  Transform: translateX(-30%) → translateX(0)
  Opacity: 0.9 → 1
  Blur: 4px → 0px
  Duration: 300ms
  Easing: Ease Out

Outgoing Screen (Current):
  Transform: translateX(0) → translateX(100%)
  Opacity: 1 → 0
  Duration: 300ms
  Easing: Ease In
```

### Tab Switch (Lateral Navigation)

When switching between bottom tabs:

```
Active Tab Changes
Outgoing Content:
  Opacity: 1 → 0
  Scale: 1 → 0.98
  Duration: 200ms
  Easing: Ease In

Incoming Content:
  Opacity: 0 → 1
  Scale: 1.02 → 1
  Duration: 250ms
  Easing: Ease Out
  Delay: 50ms (start after outgoing begins)
```

### Modal Entry (Bottom Sheet)

```
Modal Background:
  Opacity: 0 → 0.4
  Duration: 350ms
  Easing: Ease Out

Modal Sheet:
  Transform: translateY(100%) → translateY(0)
  Opacity: 0 → 1
  Duration: 350ms
  Easing: Ease Out
  Blur (background): 0px → 4px (parallel)
```

### Modal Exit (Swipe Dismiss)

```
Modal Sheet:
  Transform: translateY(0) → translateY(100%)
  Opacity: 1 → 0
  Duration: 250ms
  Easing: Ease In
  Velocity-based: Faster if user swipes fast

Modal Background:
  Opacity: 0.4 → 0
  Duration: 250ms
  Easing: Ease In
  Blur: 4px → 0px
```

---

## 3. List & Scroll Interactions

### List Item Entry

When items appear in list (initial load or pagination):

```
Staggered Entry:
  Base Delay: 0ms for first item
  Stagger: +50ms per item
  Max Stagger: Cap at 300ms (don't wait too long)

Per Item:
  Transform: translateY(20px) → translateY(0)
  Opacity: 0 → 1
  Duration: 300ms
  Easing: Ease Out
```

### Pull-to-Refresh

```
Pull Gesture:
  Icon Rotation: 0° → 180° (as user pulls)
  Opacity: 0.5 → 1 (fades in)

Release (Refresh):
  Icon: Spinner animation (continuous rotation)
  Duration: Until data loads
  
Completion:
  Icon: Checkmark animation
  Transform: Scale 1 → 1.2 → 1
  Duration: 300ms
  Then auto-dismiss: 500ms after
```

### Infinite Scroll (Load More)

```
Loading Indicator (at bottom):
  Opacity: 0 → 1 as user scrolls into view
  Duration: 150ms
  
Spinner:
  Continuous rotation, 1 rotation per 1 second
  
Items Appear:
  Same stagger pattern as initial load
  But delayed to after spinner appears
```

### Parallax Scroll (Optional Enhancement)

For property images on detail screen:

```
As User Scrolls Down:
  Image: Slight upward movement (slower than scroll)
  Image Speed: 0.5x of scroll speed
  Creates depth illusion
  Subtle: Noticeable but not jarring
```

---

## 4. Button & Input Interactions

### Button Press Animation

```
Press Down:
  Scale: 1 → 0.95
  Duration: 100ms
  Easing: Ease In Out

Release (Success):
  Scale: 0.95 → 1.05 (overshoot)
  Scale: 1.05 → 1 (settle)
  Duration: 200ms
  Easing: Ease Out

Haptic Feedback:
  Light impact on press
  Selection on release
```

### Button Loading State

```
Transition:
  Text: Fade out
  Spinner: Fade in
  Duration: 150ms
  
Spinner:
  Rotation: Continuous (360°/1s)
  Color: Matches button text
```

### Button Success State

```
Checkmark Icon:
  Scale: 0 → 1.2 → 1
  Rotation: -45° → 0° (slight rotation)
  Duration: 400ms
  Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce)
  
Auto-dismiss: 2 seconds
  Then: Fade out + reset
  Duration: 300ms
```

### Text Input Focus

```
Border:
  Color: Surface 2 → Brand Primary
  Width: 1px → 2px
  Duration: 150ms
  
Background:
  Opacity: 0% → 5% (subtle tint)
  
Label (if floating):
  Scale: 1 → 0.85
  Transform: translateY(0) → translateY(-24px)
  Color: Text Tertiary → Brand Primary
  Duration: 200ms
  Easing: Ease Out
```

### Checkbox Toggle

```
Unchecked → Checked:
  Scale: 1 → 1.3 (overshoot)
  Checkmark: Draw animation (stroke)
  Duration: 300ms
  Easing: Ease Out
  
Checked → Unchecked:
  Scale: 1 → 0.9
  Checkmark: Fade out
  Duration: 200ms
```

### Slider Thumb

```
Press Down:
  Scale: 1 → 1.3
  Shadow: Elevation 1 → 2
  
Drag:
  Value updates in real-time
  Thumb follows finger
  
Release:
  Scale: 1.3 → 1
  Snap to nearest tick (if discrete)
  Duration: 150ms
```

---

## 5. Overlay & Toast Animations

### Toast Notification

```
Entry (Bottom):
  Transform: translateY(100%) + translate(0, -16px) → translateY(0)
  Opacity: 0 → 1
  Duration: 300ms
  Easing: Ease Out
  
Display: 3-4 seconds visible

Exit (Bottom):
  Transform: translateY(0) → translateY(120%)
  Opacity: 1 → 0
  Duration: 200ms
  Easing: Ease In
```

### Alert Dialog

```
Backdrop:
  Opacity: 0 → 0.4
  Blur: 0px → 4px
  Duration: 300ms
  
Dialog Box:
  Scale: 0.9 → 1.05 → 1 (bounce)
  Opacity: 0 → 1
  Duration: 400ms
  Easing: Ease Out
  
Dismiss:
  Reverse animation
  Duration: 250ms
```

### Menu/Dropdown

```
Open:
  Opacity: 0 → 1
  Transform: scale(0.95) + translateY(-8px) → scale(1) + translateY(0)
  Duration: 200ms
  Easing: Ease Out
  Origin: Top of menu
  
Items (staggered):
  Opacity: 0 → 1
  Transform: translateY(-4px) → translateY(0)
  Stagger: +30ms per item
  
Close:
  Opacity: 1 → 0
  Transform: scale(1) → scale(0.95)
  Duration: 150ms
  Easing: Ease In
```

### Favorite Heart Animation

```
Tap to Favorite:
  Heart Icon: Outline → Solid (fill)
  Scale: 1 → 1.3 → 1 (bounce)
  Rotation: 0° → -15° → 0° (slight twist)
  Color: Gray → Brand Favorite (#EC4899)
  Duration: 500ms
  Easing: Ease Out
  
Additional: Particle burst effect (optional)
  Small hearts scale 0 → 1 and fade out
  Radiate outward from tap point
  8 particles, 400ms each
```

### Swipe Delete (List Item)

```
User Swipes Left:
  Item: Slide left over 250ms
  Reveal Button (red delete): Slides in from right
  
Button Appears:
  Opacity: 0 → 1
  Scale: 0.8 → 1
  Duration: 200ms
  
User Taps Delete:
  Item: Slide out fully (off-screen)
  Color Fade: Red tint spreads
  Duration: 300ms
  
Undo Available: For 5 seconds
  Toast with undo button
  Tap to restore (reverse animation)
```

---

## 6. Theme Transition Animation

When user switches between Light and Dark modes:

```
All Colors Fade:
  Duration: 400ms
  Easing: Ease In Out
  Affected Elements:
    - Background colors
    - Text colors
    - Glass surface colors
    - Shadow intensities
    - Border colors

Simultaneous Changes:
  No stagger, everything animates together
  Creates cohesive theme transition
  
Blur Adjustments:
  If blur intensity differs per theme
  Animate blur value: duration 300ms (slightly faster)

Avoid:
  Screen flashing
  Sudden color snaps
  Lag/jank during animation
```

### Implementation Tips

```javascript
// React Native example
useEffect(() => {
  Animated.parallel([
    Animated.timing(backgroundColor, {
      toValue: isDarkMode ? darkBg : lightBg,
      duration: 400,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false
    }),
    Animated.timing(textColor, {
      toValue: isDarkMode ? darkText : lightText,
      duration: 400,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false
    }),
    // ... other animated values
  ]).start();
}, [isDarkMode]);
```

---

## 7. Gesture Interactions

### Swipe Gestures

#### Horizontal Swipe (Image Gallery)
```
Threshold: 20px
Velocity: >500px/s to trigger snap
Deceleration: Ease Out
Navigation: 300ms to settle
```

#### Vertical Swipe (Modal Dismiss)
```
Threshold: 40px down
Velocity: >300px/s to auto-dismiss
Otherwise: Snap back to open
Momentum: Natural feeling, velocity-based
```

#### Long Press
```
Duration: 500ms
Feedback: Haptic (medium impact)
Visual: Slight scale increase (1 → 1.05)
Effect: Menu appears or action activates
```

### Pinch Gesture

#### Image Zoom (Detail Screen)
```
Min Scale: 1x (original size)
Max Scale: 3x (3x zoom)
Center: Pinch point
Momentum: Continues zooming briefly after pinch ends
Reset: Double-tap to zoom out
```

### Drag & Drop

#### Reorder List Items
```
Press: Item lifts (scale 1.05, shadow increases)
Drag: Item follows finger, others reorder
Release: Item settles in new position
Animation: 200ms snap to final position
Haptic: Light tap when order changes
```

---

## 8. Loading States

### Skeleton Loader

```
Animation: Shimmer effect
  From: Light gray
  To: Lighter gray (subtle pulse)
  Duration: 1 second
  Easing: Ease In Out
  Repeat: Infinite
  
Effect:
  Background: Gradient left-to-right
  Gradient: Sweeps across at 1s intervals
  Creates: Shimmer appearance
  
Replacement: Fade out skeleton, fade in real content
  Duration: 300ms
  Stagger: 50ms between items
```

### Spinner Loader

```
Rotation: Continuous
  360° rotation per second
  Linear easing (constant speed)
  
Color: Brand Primary (or contextual)

Size Variants:
  Small: 24px (buttons)
  Medium: 36px (screens)
  Large: 48px (full-screen)
```

### Progress Indicator

```
Linear Progress Bar:
  Width: 0% → 100%
  Duration: Animation duration
  
Indeterminate Progress:
  Width: 0% → 100% → 0%
  Repeats until done
  Creates flowing effect
  
Color: Brand Primary
Height: 4px (subtle)
```

---

## 9. Microinteractions

### Form Submission

```
1. User taps submit button
   → Button press animation (scale 0.95)

2. Loading begins
   → Spinner replaces text (fade transition)
   → Button disabled (opacity 0.6)
   → Field frozen

3. Network request...

4a. Success
   → Spinner → Checkmark (scale bounce)
   → Toast: "Success!" appears
   → 2s delay, auto-dismiss
   → Reset form or navigate

4b. Error
   → Spinner → Error icon (scale bounce, red)
   → Red error message fades in
   → Button re-enables
   → User can retry
```

### Notification Badge Update

```
Badge Appears:
  Scale: 0 → 1.2 → 1
  Opacity: 0 → 1
  Duration: 300ms
  Easing: Ease Out
  
Badge Number Changes (increment):
  Scale: 1 → 1.3 → 1
  Rotation: 0° → 10° → 0° (slight twist)
  Duration: 300ms
  
Animation: Repeats each time count increases
Effect: Draws attention to notification
```

### Filter Chip Selection

```
On Select:
  Background: Glass Secondary → Glass Accent
  Scale: 1 → 1.08
  Duration: 200ms
  
Border appears:
  Opacity: 0 → 1
  Duration: 150ms
  
Text color:
  Text Secondary → Brand Primary
  Duration: 200ms
  
Result: Smooth highlight animation
```

### Card Favorite Action (Tap)

```
When user taps heart icon:

1. Icon pulses (scale animation)
   Scale: 1 → 1.3 → 1
   Duration: 300ms

2. Color changes
   Color: Gray → Pink (#EC4899)
   Duration: 200ms

3. Particle effect (optional)
   8 small hearts burst outward
   Fade to transparent
   Duration: 400ms
   
4. Badge updates
   Count increments with pulse
   
User sees: Immediate visual feedback
Feeling: Rewarding, responsive
```

---

## 10. Motion Accessibility

### Respecting Preferences

```javascript
import { useWindowDimensions, AccessibilityInfo } from 'react-native';

// Check for reduced motion preference
const prefersReducedMotion = useSharedValue(false);

useEffect(() => {
  AccessibilityInfo.boldTextEnabled().then(enabled => {
    // Disable complex animations if needed
    prefersReducedMotion.value = !enabled;
  });
}, []);

// Apply in animations
const duration = prefersReducedMotion.value ? 0 : 300;
const scale = prefersReducedMotion.value ? 1 : 1.1;

Animated.timing(animatedValue, {
  toValue: 1,
  duration,
  useNativeDriver: true
}).start();
```

### Guidelines

1. **Disable Complex Animations**: If `prefers-reduced-motion` is enabled
2. **Instant Feedback**: Use color changes instead of scale animations
3. **Simplified Transitions**: Quick cross-fades instead of complex paths
4. **Haptic Over Animation**: Rely more on haptic feedback
5. **No Auto-play**: Don't auto-start animations on load

---

## 11. Performance Optimization

### Animation Best Practices

```javascript
// ✅ DO: Use native driver for performance
Animated.timing(value, {
  useNativeDriver: true  // Offloads to native thread
}).start();

// ❌ DON'T: Animate layout-affecting properties
// Instead of animating width, use scaleX

// ✅ DO: Use requestAnimationFrame for complex calculations
useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: withSpring(x.value) }
    ]
  };
});

// ❌ DON'T: Create new animated values in render
// Instead: Create once and reuse

// ✅ DO: Stop animations when component unmounts
useEffect(() => {
  return () => {
    animation.stop();
  };
}, []);
```

### Testing Animations

1. **FPS Monitoring**: Use React Native Perf Monitor
2. **Device Testing**: Test on actual mid-range devices
3. **Profiling**: Use React DevTools Profiler
4. **Memory**: Monitor heap size during animations
5. **Battery**: Check power usage during looping animations

---

## 12. Animation Checklist

- [ ] All transitions use defined easing curves
- [ ] Animations under 500ms (avoid feeling slow)
- [ ] Native driver enabled for performance
- [ ] Haptic feedback on key interactions
- [ ] Reduced motion respected
- [ ] No jank during list scroll
- [ ] Animations feel premium, not rigid
- [ ] Staggered animations for visual appeal
- [ ] Tested on low-end devices
- [ ] Memory leaks prevented (cleanup on unmount)
- [ ] Loading states have animations (not static)
- [ ] Error/success states animated clearly

