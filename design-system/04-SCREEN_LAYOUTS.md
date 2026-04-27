# Screen Layout Specifications & UX Flows

## 1. Home / Discovery Screen

### Purpose
Primary entry point showing trending and personalized property listings with strong visual focus on property cards.

### Layout Structure

```
┌─────────────────────────────┐
│  SafeArea (Top 16px)        │
│                             │
│  [⌚ Time] [Signal] [Battery]│ ← Status bar (system)
│                             │
│  Glass Filter Bar           │ ← Sticky on scroll
│  🔍 Search... [⚙️ Filters] │
│  [Price] [Type] [Size]      │
│                             │
│ ───────────────────────────│
│                             │
│  Section Header             │
│  "Trending Now"             │
│                             │
│  Property Card 1            │ ← Horizontal scroll
│  [Image] [Glass Overlay]    │
│                             │
│  Property Card 2            │
│  [Image] [Glass Overlay]    │
│                             │
│ ───────────────────────────│
│                             │
│  Section Header             │
│  "Near You"                 │
│                             │
│  Property Grid (2 columns)  │
│  [Card] [Card]              │
│  [Card] [Card]              │
│  [Card] [Card]              │
│                             │
│  Load More Button           │
│                             │
├─────────────────────────────┤
│  Glass Tab Navigation       │
│ [🏠 Active] [❤️] [🔔] [👤] │
└─────────────────────────────┘
```

### Specifications

#### Header Area
- **Background**: Surface 0
- **Safe Area Top**: 16px
- **Filter Bar**: Sticks on scroll (z-index 20)
- **Transition**: Smooth collapse/expand on scroll velocity

#### Search Bar (Within Filter Bar)
- **Height**: 44px
- **Placeholder**: "Search by location, type..."
- **Action**: Opens SearchScreen on focus
- **Trailing Icon**: Microphone (voice search)

#### Filter Button
- **Position**: Trailing of search bar
- **Badge**: Shows filter count if active
- **Action**: Opens BottomSheet with filters

#### Filter Chips
- **Behavior**: Horizontal scroll, snap to edges
- **Chip Types**: Price range, Property type, Size, More
- **Persistent**: User's last selection remembered
- **Remove**: Tapping X clears that filter

#### Content Sections

##### Trending Section
- **Title**: "Trending Now" (Heading 2)
- **Layout**: Horizontal ScrollView
- **Card Size**: ~280px width
- **Spacing**: 12px between cards, 16px edges
- **Indicator**: "Swipe for more" on first load (fade after 3 sec)

##### Near You Section
- **Title**: "Near You" (Heading 2)
- **Layout**: 2-column FlatList
- **Column Spacing**: 12px
- **Row Spacing**: 12px
- **Card Size**: Responsive, full width of column

#### Load More
- **Style**: Outlined button, Brand Primary text
- **Loading**: Spinner replaces text
- **Behavior**: Pagination on tap

#### Bottom Tab Navigation
- **Position**: Fixed bottom (above safe area)
- **Style**: Glass Primary, 75% opacity
- **Active Tab**: "Home" highlighted
- **Transition**: 200ms scale animation

### Interaction Flow

```
User Opens App
    ↓
Load Home Screen with trending properties
    ↓
Show Filter Bar (sticky)
    ↓
User scrolls down
    ↓
Filter Bar collapses (saves space)
    ↓
User scrolls back up
    ↓
Filter Bar expands
    ↓
User taps property card
    ↓
Navigate to PropertyDetailScreen
```

### Performance Considerations
- FlatList with `maxToRenderPerBatch={5}`
- Image lazy loading + placeholder
- Horizontal scroll uses `pagingEnabled` for smooth snap
- Avoid rerenders with proper key prop

### State Variations

#### Initial Load
- Skeleton cards while loading
- Staggered fade-in animation

#### Filtered Results
- Apply filters, show filtered count
- Smooth transition to new results
- "No results" message if empty

#### Empty State (No Favorites)
- Message: "Customize your preferences in settings"
- Link to SettingsScreen
- Show random popular properties

#### Network Error
- Error banner at top
- Retry button
- Show cached results if available

### Accessibility
- **Screen Reader**: "Home screen, showing trending properties"
- **Tab Navigation**: Works with keyboard (web)
- **Touch**: All targets 44x44+
- **Color Contrast**: 7:1 on all text

---

## 2. Search & Filters Screen

### Purpose
Detailed search and filtering interface for discovering properties by specific criteria.

### Layout Structure

```
┌─────────────────────────────┐
│  Header with Back Button    │ ← Sticky
│  Search Bar (Persistent)    │
│                             │
├─────────────────────────────┤
│  Advanced Filters           │
│  (BottomSheet or Full Page) │
│                             │
│  ┌─────────────────────────┐│
│  │ Price Range             ││
│  │ Low [$] [──●──] High [$]││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ Property Type           ││
│  │ [Apartment] [House] ... ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ Bedrooms                ││
│  │ [Studio] [1] [2] [3+]   ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ Amenities               ││
│  │ [WiFi] [Parking] ...    ││
│  └─────────────────────────┘│
│                             │
│  [Clear All] [Apply Filters]│
│                             │
├─────────────────────────────┤
│  Results View               │
│  "567 properties found"     │
│                             │
│  Sorting Options            │
│  [Recommended ▾] [Map View] │
│                             │
│  Results Grid/List          │
│  [Property Cards]           │
│                             │
│  [Load More]                │
│                             │
└─────────────────────────────┘
```

### Filter Panel Specifications

#### Container
- **Background**: Surface 1
- **Padding**: 16px
- **Spacing**: 20px between sections
- **Scrollable**: If filters exceed screen height

#### Filter Section
Each filter group has:
- **Title**: Heading 3 (18px, 600)
- **Description**: Optional hint text (Body Small)
- **Controls**: Specific to filter type
- **Divider**: 1px solid Surface 2 after each section

#### Filter Types

##### Price Range Slider
```
Label: "Price per Month"
Range: $500 - $5000
Display: "Low: $X, High: $Y"
Slider: 2-thumb slider with glass background
Input Fields: Optional tap to enter exact price
Glass Style: Semi-transparent with 8px blur
```

##### Property Type (Multi-Select Chips)
```
Options: Apartment, House, Condo, Villa, Townhouse
Layout: Wrap (multiple rows)
Chip Style: Glass Secondary, glass accent when selected
Selection: Multiple allowed
```

##### Bedroom/Bathroom (Button Group)
```
Bedrooms: Studio, 1, 2, 3, 4+
Bathrooms: Similar
Layout: Single row, scrollable if needed
Style: Glass buttons, toggle behavior
```

##### Size Range (Dual Input)
```
Min/Max sqft input fields
Placeholder: "Min" "Max"
Background: Solid white (clarity for input)
Border: 1px solid Surface 2
```

##### Amenities (Checkbox Chips)
```
Options: WiFi, Parking, Gym, Pool, Balcony, Garden...
Layout: Wrap
Style: Glass chips with checkmark
Scrollable: If > 8 items
Search: Optional search within amenities
```

##### Date Range (For Booking)
```
Start Date: Calendar picker
End Date: Calendar picker
Style: Glass background with date icons
Duration: Shows selected range length
```

#### Action Buttons
- **"Clear All"**: Outlined button, left-aligned
- **"Apply Filters"**: Solid primary button, right-aligned
- **Layout**: Horizontal, equal width, 48px height
- **Position**: Sticky bottom (glass background)
- **Spacing**: 8px between buttons

### Results Display

#### Results Header
- **Count**: "567 properties found"
- **Style**: Body 14px, Text Secondary
- **Filter Indicator**: Show active filters as chips

#### Sort Options
- **Default**: "Recommended"
- **Options**: 
  - Recommended
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Most Popular
  - Distance: Closest
- **Display**: Dropdown or segmented control
- **Position**: Sticky below filter chips

#### View Options (Right of Sort)
- **Icons**: List view [≡], Grid view [⊞], Map view [🗺]
- **Active**: Highlighted
- **Action**: Changes results layout
- **Persistent**: Remembers last choice

#### Results Layout

**Grid View** (Default)
```
2-column layout
Cards: PropertyCard component
Spacing: 12px
```

**List View**
```
Horizontal card layout
Compact: Image 100x100, details right side
Spacing: 8px vertical
```

**Map View**
```
Full-screen map
Card overlay for selected property
Marker clusters for dense areas
```

### State Variations

#### Applying Filters
- Skeleton loaders while loading
- Smooth fade transition to results

#### No Results
```
Message: "No properties match your criteria"
Suggestion: "Try adjusting your filters"
Button: "Reset Filters"
Image: Illustration
```

#### Network Error
```
Banner: "Unable to load results"
Action: Retry button
Option: Show last cached results
```

### Interaction Flow

```
User taps Search on Home
    ↓
Navigate to SearchScreen
    ↓
Search bar focused (keyboard shows)
    ↓
User types location
    ↓
Show autocomplete suggestions
    ↓
User taps suggestion or submits
    ↓
Show matching results
    ↓
User adjusts filters (optional)
    ↓
Results update in real-time (debounced)
    ↓
User taps property card
    ↓
Navigate to PropertyDetailScreen
```

### Accessibility
- **Filter Labels**: All inputs have labels
- **Keyboard Navigation**: Tab through all controls
- **Screen Reader**: "Filter panel, 8 sections"
- **Focus Ring**: Visible on all interactive elements

---

## 3. Property Detail Screen

### Purpose
Comprehensive property information, gallery, actions, and contact/booking CTA.

### Layout Structure

```
┌─────────────────────────────┐
│  Header (Transparent)       │ ← Over image
│  [← Back] [Share] [More...]│
│                             │
│  Image Carousel             │
│  [Full Screen Gallery]      │
│  Page indicator (•••)       │
│                             │
│  Glass Action Overlay       │
│  [❤️ Favorite] [📞 Call] ...│
│                             │
├─────────────────────────────┤
│  Property Header            │
│  Price (Display)            │
│  Title / Type               │
│  Location with badge        │
│  Rating (⭐ 4.8)            │
│                             │
├─────────────────────────────┤
│  Quick Info Cards           │
│  [Bedrooms] [Bathrooms]     │
│  [Size] [Type]              │
│                             │
├─────────────────────────────┤
│  Description Section        │
│  "About this property..."   │
│  [Read More] (if truncated) │
│                             │
├─────────────────────────────┤
│  Amenities Section          │
│  [WiFi ✓] [Parking ✓] ...  │
│  [Show More Amenities]      │
│                             │
├─────────────────────────────┤
│  Location & Map             │
│  Small map with pin         │
│  [View on Map] (enlarges)   │
│                             │
├─────────────────────────────┤
│  Host/Agent Section         │
│  [Profile Image] Name       │
│  Verified badge             │
│  "Member since 2022"        │
│  [Message Host] [View Profile]
│                             │
├─────────────────────────────┤
│  Recent Reviews Section     │
│  ⭐⭐⭐⭐⭐ "Great place!"    │
│  [View All Reviews]         │
│                             │
├─────────────────────────────┤
│  Contact CTA Section        │
│  [📞 Call] [💬 Message] ... │
│  ┌───────────────────────┐  │
│  │ [Book Now / Contact]  │  │
│  └───────────────────────┘  │
│  → Report Listing           │
│                             │
└─────────────────────────────┘
```

### Section Specifications

#### Header (Over Image)
- **Position**: Absolute top, safe area inset
- **Layout**: Between icon button and icon button
- **Style**: Transparent (text shows over image)
- **Icons**: 
  - Back: 24px, white with shadow
  - Share: 24px, white with shadow
  - More (menu): 24px, white with shadow
- **Background**: Semi-transparent (optional blur)
- **Z-Index**: 50

#### Image Carousel Section
- **Height**: 60% of screen min, full width
- **Component**: ImageCarousel
- **Gestures**: Swipe to next, pinch to zoom
- **Page Indicator**: Glass dots at bottom
- **Actions**: Glass overlay with favorite, call, message

#### Property Header
- **Padding**: 16px
- **Background**: Surface 0

**Price**
- **Font**: Display Medium (28px, 700)
- **Color**: Brand Primary
- **Format**: "$2,500/mo" or "$250,000"
- **Suffix**: "(avg per night)" if booking

**Title**
- **Font**: Heading 2 (20px, 600)
- **Color**: Text Primary
- **Format**: "Beautiful 2BR Apartment Downtown"

**Location**
- **Font**: Body Small (12px, 400)
- **Icon**: Location pin (12px)
- **Format**: "Downtown, City Center • 2.3 km from center"
- **Color**: Text Secondary

**Rating** (if applicable)
- **Icon**: Star (14px, filled)
- **Font**: Body Small (12px)
- **Format**: "⭐ 4.8 (245 reviews)" → tappable
- **Color**: Brand Primary for star, Text Secondary for count

#### Quick Info Cards (Glass Style)
- **Layout**: 2x2 grid
- **Card Style**: Glass Secondary, 70% opacity
- **Height**: 80px
- **Padding**: 12px
- **Center Content**: Icon (24px) + Value (16px bold) + Label (12px)

**Cards**:
- Bedrooms: "2 BR"
- Bathrooms: "1 BA"
- Size: "850 sqft"
- Property Type: "Apartment"

#### Description Section
- **Title**: "About this property"
- **Font**: Body 14px
- **Height**: 120px (truncated)
- **Overflow**: "Read More" link
- **Expanded**: Full height, "Show Less" link
- **Background**: Transparent
- **Padding**: 16px

#### Amenities Section
- **Title**: "Amenities"
- **Layout**: Grid, 2 columns
- **Chip Style**: Glass accent, 65% opacity
- **Icon + Text**: 16px icon, 12px label
- **Count**: Show first 8, "+ X More" button
- **Modal**: Tapping "More" shows full list in BottomSheet

#### Location & Map
- **Title**: "Location"
- **Map**: Small map view (200px height)
- **Provider**: Google Maps / Apple Maps
- **Pin**: Current property location
- **Gesture**: Tap to expand full-screen
- **Button**: "View on Map" (below or overlay)

#### Host/Agent Section
- **Layout**: Horizontal
- **Image**: 48x48 circular profile photo
- **Name**: Heading 3 (18px, 600)
- **Metadata**: "Member since 2022" + Verified badge
- **Badge Style**: Green checkmark, solid (NOT glass)
- **Actions**: 2 buttons below
  - Message: Glass style
  - View Profile: Link style
- **Background**: Surface 1 with slight padding

#### Reviews Section
- **Title**: "Recent Reviews"
- **Card Style**: Solid, not glass
- **Review Item**:
  - Rating: Stars (16px)
  - Author: Body 12px
  - Date: "2 weeks ago"
  - Text: Body Small
  - Truncate: 3 lines, "Read More"
- **Count**: Show 2 reviews, "View All" link
- **Empty State**: "No reviews yet"

#### Contact CTA Section
- **Style**: Solid background (NOT glass)
- **Component**: ContactCTA
- **Actions**: Call, Message, Schedule Visit
- **Primary**: "Book Now" or "Contact Agent"
- **Secondary**: "Report Listing" link

### State Variations

#### Loading
- Skeleton for all sections
- Image: Placeholder
- Staggered fade-in

#### Favorite Toggle
- Heart icon animates + color changes
- Badge count updates
- Toast: "Added to favorites"

#### Contact Actions
- Call: Triggers native phone app
- Message: Opens ChatThreadScreen
- Visit: Opens DatePicker or scheduling
- Report: Opens ReportBottomSheet

### Interaction Flow

```
User taps property card on Home
    ↓
Navigate to PropertyDetailScreen
    ↓
Load and display full property details
    ↓
User scrolls through sections
    ↓
User swipes through image gallery
    ↓
User can favorite, view on map, or read reviews
    ↓
User taps Contact CTA
    ↓
Choose action: Call → phone app, Message → chat, Book → scheduling
```

### Accessibility
- **Screen Reader**: Announces property title, price, location
- **Image Alt Text**: Each image has description
- **Actions**: All buttons clearly labeled
- **Map**: Interactive map has accessibility features
- **Zoom**: Pinch-to-zoom works with accessibility zoom

---

## 4. Map View Screen

### Purpose
Interactive map for browsing properties with location context.

### Layout Structure

```
┌─────────────────────────────┐
│  Header Bar (Glass)         │ ← Sticky, translucent
│  [← Back] Search [Filters] ⚙️│
│                             │
├─────────────────────────────┤
│                             │
│      Full Screen Map        │
│      [Pin Cluster]          │
│      [Pin Cluster]          │
│      [Pin]                  │
│                             │
│  Floating Card (Glass)      │ ← Selected property
│  [Property Preview]         │
│  [Image] Price Location     │
│  [→ View Details]           │
│                             │
│  Map Controls (Glass)       │ ← Right side
│  [+ Zoom]                   │
│  [- Zoom]                   │
│  [Current Location]         │
│                             │
│  Filter Bar (Glass)         │ ← Sticky bottom
│  [Price ▾] [Type ▾] ...     │
│                             │
└─────────────────────────────┘
```

### Specifications

#### Header
- **Height**: 56px + safe area
- **Background**: Glass Primary (75% opacity)
- **Style**: Shows search bar and filter toggle
- **Sticky**: Stays on top when zooming
- **Z-Index**: 20

#### Map View
- **Provider**: Google Maps (Android/Web) or Apple Maps (iOS)
- **Gesture**: Pinch to zoom, pan, rotate (optional)
- **Zoom Range**: 10 (city) to 20 (street level)
- **Initial**: Centered on user location or city center

#### Map Markers

**Cluster (Multiple Properties)**
```
Icon: Circle with count
Style: Glass-like background
Size: Based on count (28-40px)
Color: Brand Primary
Text: White, bold, count
Tap: Zoom to cluster bounds
```

**Single Property Pin**
```
Icon: Custom property icon (house/apartment)
Style: Brand Primary, slightly elevated
Size: 32x32
Badge: Verification status (optional checkmark)
Tap: Show preview card
Shadow: Elevation 2
```

**Selected Pin**
```
Style: Highlighted/pulsing animation
Icon: Larger + glow
Animation: Scale pulse every 2 seconds
Indicates: Currently selected property
```

#### Floating Preview Card (Glass)
- **Position**: Bottom center or side (responsive)
- **Size**: 280px width, 160px height (compact)
- **Style**: Glass Primary, 75% opacity
- **Layout**: Horizontal image + vertical content
- **Image**: 120x120, property thumbnail
- **Content**: Price, title, rating
- **Action**: Tap card for full details
- **Gesture**: Swipe to next nearby property

#### Map Controls (Floating, Right Side)
- **Position**: Fixed right, 16px from edge
- **Z-Index**: 15 (below header, above map)
- **Style**: Glass Secondary (70% opacity)
- **Layout**: Vertical stack

**Controls**:
- Zoom In: + button (44x44)
- Zoom Out: - button (44x44)
- Current Location: Pin icon (44x44), centers map on user

#### Bottom Filter Bar
- **Height**: 56px
- **Position**: Floating bottom
- **Style**: Glass Primary (75% opacity)
- **Layout**: Horizontal scroll filter chips
- **Spacing**: 8px
- **Actions**: Apply filters to map markers

### Interaction Flow

```
User opens MapScreen
    ↓
Show full map with property clusters
    ↓
User pinches to zoom in
    ↓
Clusters separate into individual pins
    ↓
User taps pin
    ↓
Show preview card at bottom
    ↓
User swipes card left/right
    ↓
Shows adjacent properties
    ↓
User taps preview card or "View Details"
    ↓
Navigate to PropertyDetailScreen
```

### Performance Optimizations
- Marker clustering for >100 markers
- Lazy load marker details on zoom
- Debounce filter changes
- Cache map tiles
- Reduce marker count based on zoom level

### Accessibility
- **Map**: Keyboard navigation (arrow keys to zoom/pan)
- **Markers**: Announced via screen reader
- **Focus**: Manages focus on preview card
- **Gestures**: Alternative buttons for zoom/pan

---

## 5. Favorites Screen

### Purpose
User's bookmarked properties with easy removal and sorting.

### Layout Structure

```
┌─────────────────────────────┐
│  Header                     │ ← Sticky
│  "Saved Properties"         │
│  [12 items]                 │
│                             │
│  Sorting & View Options     │ ← Sticky
│  [Recently Saved ▾] [≡ | ⊞] │
│                             │
├─────────────────────────────┤
│                             │
│  Property List (2 col)      │
│  [Favorite Card 1]          │
│  [Favorite Card 2]          │
│  [Favorite Card 3]          │
│                             │
│  [Load More]                │
│                             │
├─────────────────────────────┤
│  Glass Tab Navigation       │
│ [🏠] [❤️ Active] [🔔] [👤] │
└─────────────────────────────┘
```

### Specifications

#### Header
- **Title**: "Saved Properties"
- **Subtitle**: "12 items"
- **Styling**: Heading 1 (24px, 700)

#### Sorting & View Options
- **Sort Dropdown**: 
  - Recently Saved
  - Price: Low to High
  - Price: High to Low
  - Most Popular
  - Distance: Closest
- **View Options**: List/Grid toggle

#### Favorite Card Variant
- **Layout**: Column (image top, info below)
- **Image**: Full width, 200px height
- **Overlay**: Same glass overlay as PropertyCard
- **Remove Action**: Swipe left reveals delete button
  - Animation: Slide in delete button (red)
  - Tap: Confirm remove with toast
  - Undo: Auto-revert if not confirmed in 5 seconds

#### Empty State
```
Message: "You haven't saved any properties yet"
Icon: Heart outline (60px)
Action: "Start exploring" button → back to Home
Alternative: "Browse featured" link
```

#### Loading State
- Skeleton cards (5-6 placeholders)
- Staggered fade-in on load

### Interaction Flow

```
User navigates to Favorites
    ↓
Show saved properties list
    ↓
User can:
  - Tap card → PropertyDetailScreen
  - Swipe card left → Delete with undo
  - Sort by different criteria
  - Toggle view (list/grid)
```

### Accessibility
- **List Announcement**: "12 saved properties"
- **Card Actions**: "Double tap to view, swipe left to remove"
- **Keyboard**: Tab through cards, Enter to open, Delete key to remove

---

## 6. Profile Screen

### Purpose
User profile management and account settings.

### Layout Structure

```
┌─────────────────────────────┐
│  Header with Safe Area      │
│  "Profile"                  │
│                             │
├─────────────────────────────┤
│  Profile Card (Glass Accents)
│  [Profile Image - 80x80]    │
│  Name (Heading 2)           │
│  "member_since"             │
│  ┌─────────────────────────┐│
│  │ [Verified ✓] [⭐ 4.8]  ││
│  └─────────────────────────┘│
│                             │
│  [Edit Profile]             │
│                             │
├─────────────────────────────┤
│  Quick Stats (Glass)        │
│  [Saved (12)] [Reviews (8)] │
│  [Bookings (3)]             │
│                             │
├─────────────────────────────┤
│  Menu Sections              │
│                             │
│  ┌─────────────────────────┐│
│  │ 👤 My Listings          ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ 📅 My Bookings          ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ ⭐ My Reviews           ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ 🔔 Notifications        ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ ⚙️  Settings            ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ 📞 Help & Support       ││
│  └─────────────────────────┘│
│                             │
│  Logout Button (Outline)    │
│                             │
└─────────────────────────────┘
```

### Specifications

#### Profile Header
- **Layout**: Centered
- **Image**: 80x80 circle, bordered with Glass effect
- **Name**: Heading 2 (20px, 700)
- **Member Since**: Body Small (12px)
- **Badges**: Glass-styled, below name

#### Quick Stats (Glass Cards)
- **Layout**: 3 columns
- **Card Style**: Glass Secondary, 70% opacity
- **Content**: Icon (24px) + Count (16px bold) + Label (10px)
- **Height**: 80px
- **Stats**:
  - Saved properties count
  - Reviews written
  - Active bookings

#### Menu Items (Solid Cards)
- **Layout**: Single column, full width
- **Style**: Surface 1 with subtle border bottom
- **Height**: 56px
- **Icon**: 24px left-aligned
- **Label**: Body 14px
- **Chevron**: Right-aligned gray arrow
- **Padding**: 16px
- **Tap**: Navigate to respective screen

#### Logout Button
- **Style**: Outlined, Danger color
- **Width**: Full width minus padding
- **Height**: 48px
- **Position**: Bottom with padding
- **Confirmation**: Alert before logout

### State Variations

#### Logged In
- Full profile displayed
- All menu items available
- Logout button visible

#### Loading Profile
- Skeleton for profile section
- Menu items hidden
- Loading spinner in center

#### Edit Mode
- Profile photo: Tap to change
- Name/Email: Editable text fields
- Save button appears

### Accessibility
- **Menu**: Screen reader announces each item
- **Focus**: Tab through all menu items
- **Images**: Profile photo has alt text
- **Logout**: Confirmation dialog prevents accidents

---

## Navigation Flow Summary

```
                    ┌──────────────┐
                    │   Splash     │
                    └──────┬───────┘
                           │ (if logged in)
                           ↓
        ┌──────────────────────────────────┐
        │      Bottom Tab Navigation       │
        └──────────────────────────────────┘
               ↙          ↓         ↘
          HOME      FAVORITES    PROFILE
            │           │           │
            ├──→ Search  │           │
            │   Map      │           │
            │   Detail   │           │
            │            │           │
            │      Detail Screen     │
            │                        │
            │                  My Bookings
            │                  Settings
            │                  Help
```

### Deep Linking
- Property: `app://property/{id}`
- Search: `app://search?q={query}`
- Favorites: `app://favorites`
- Profile: `app://profile`
- Booking: `app://booking/{id}`

