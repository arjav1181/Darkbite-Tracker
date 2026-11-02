# Calorie Tracking App - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based with Health/Fitness App Patterns

Drawing inspiration from leading calorie tracking apps like MyFitnessPal, Cronometer, and Samsung Health, adapted for a modern dark theme aesthetic. The design prioritizes data clarity, quick input methods, and seamless food logging while maintaining visual appeal in the specified dark color scheme.

**Core Design Principles:**
- Information hierarchy that makes daily totals immediately scannable
- Frictionless food entry with prominent upload and description options
- Clear visual separation between input methods and tracking data
- Mobile-first approach with touch-optimized interaction targets

---

## Typography System

**Font Stack:** Inter (via Google Fonts CDN)
- **Display/Headers:** font-semibold to font-bold
- **Body Text:** font-normal with leading-relaxed for readability on dark backgrounds
- **Data/Numbers:** font-mono for calorie counts and nutritional values

**Type Scale:**
- Hero Numbers (daily totals): text-5xl to text-6xl, font-bold
- Section Headers: text-2xl, font-semibold
- Card Titles: text-lg, font-medium
- Body/Descriptions: text-base
- Secondary Info: text-sm
- Metadata/Timestamps: text-xs

---

## Layout & Spacing System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8, etc.)

**Container Structure:**
- Main app container: max-w-7xl mx-auto
- Content sections: px-4 md:px-6 lg:px-8
- Dashboard cards: p-6
- Food entry forms: p-4 to p-6
- List items: py-3 to py-4

**Grid Patterns:**
- Single column on mobile (base)
- Two-column layout for dashboard stats (md:grid-cols-2)
- Three-column for nutritional breakdown cards (lg:grid-cols-3)

**Vertical Rhythm:**
- Section spacing: space-y-6 to space-y-8
- Card grids: gap-4 to gap-6
- List items: space-y-2 to space-y-3

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with h-16, shadow-lg
- Logo/app name on left (text-xl font-bold)
- Date selector in center with prev/next navigation
- User profile icon on right
- Mobile: Hamburger menu with drawer navigation

### Dashboard Components

**Daily Summary Card (Hero Section):**
- Prominent circular progress indicator showing calories consumed vs. goal
- Large display of remaining calories (text-6xl font-bold)
- Percentage breakdown below main number
- Horizontal macros bar showing protein/carbs/fat distribution
- Minimal padding (p-8) to emphasize data

**Quick Action Buttons:**
- Two primary CTAs in horizontal layout (grid-cols-2 gap-4)
- "Upload Photo" button with camera icon from Heroicons
- "Describe Food" button with text icon
- Both buttons: h-32, rounded-2xl, flex flex-col items-center justify-center
- Icon above text layout, gap-3
- Subtle backdrop blur effect when on photo backgrounds

**Meal Timeline:**
- Segmented by meal type (Breakfast, Lunch, Dinner, Snacks)
- Collapsible sections with chevron indicators
- Each meal shows: time badge, food items list, total calories
- Empty state with dashed border and add prompt

### Food Entry Components

**Photo Upload Interface:**
- Drag-and-drop zone: min-h-64, border-2 border-dashed, rounded-xl
- Preview thumbnail grid after upload (grid-cols-3 gap-2)
- Delete button overlay on hover (absolute top-2 right-2)
- Loading spinner during AI analysis (centered with text-lg status)
- Supported formats text: text-xs below upload area

**Text Description Form:**
- Single textarea: min-h-24, rounded-lg, p-4
- Character counter: text-xs, absolute bottom-2 right-2
- Submit button: w-full mt-4, h-12, rounded-lg, font-medium
- Quick suggestions chips below (common foods as clickable pills)

**AI Analysis Result Card:**
- Appears after photo/text analysis
- Food name as header (text-xl font-semibold)
- Confidence indicator badge (e.g., "95% confident")
- Nutritional grid: 2x2 layout showing calories, protein, carbs, fat
- Edit button to adjust values manually
- Add to log CTA button (w-full, h-12)

### Food Log Components

**Individual Food Entry Card:**
- Horizontal layout: thumbnail (if photo) | content | calories
- Thumbnail: w-16 h-16, rounded-lg, object-cover
- Content: Food name (text-base font-medium), portion size (text-sm), time (text-xs)
- Calorie count: text-lg font-bold, aligned right
- Swipe-to-delete interaction hint on mobile
- Edit/delete icons on desktop (hover reveal)

**Daily Log View:**
- Date header with navigation arrows
- Total calories for day (text-4xl font-bold)
- Grouped by meals with subtotals
- Infinite scroll for history
- Pull-to-refresh on mobile

### Data Visualization

**Progress Rings/Charts:**
- Circular progress for daily calorie goal
- Horizontal stacked bars for macro breakdown
- Mini sparkline charts for weekly trends
- All using percentage-based widths for responsiveness

**Stats Dashboard:**
- Grid of metric cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: min-h-32, p-6, rounded-xl
- Metric value (text-3xl font-bold)
- Label below (text-sm)
- Trend indicator (up/down arrow with percentage)

---

## Iconography

**Icon Library:** Heroicons (via CDN)

**Primary Icons:**
- Camera (photo upload)
- PencilSquare (text description)
- Calendar (date selection)
- ChartBar (statistics)
- Clock (meal timing)
- TrashCan (delete entry)
- PencilIcon (edit)
- CheckCircle (confirmation)
- XCircle (error states)

**Icon Sizes:**
- Large action buttons: w-8 h-8
- List items: w-5 h-5
- Status indicators: w-4 h-4

---

## Interactive States

**Buttons:**
- Default: rounded-lg, px-6, py-3, font-medium
- Primary CTA: larger with h-12 to h-14
- Icon buttons: p-3, rounded-full
- Disabled: opacity-50, cursor-not-allowed

**Form Inputs:**
- Default: border rounded-lg, px-4, py-3
- Focus: ring-2 offset-2
- Error: border-red-500, text-red-500
- Success: border-green-500

**Cards:**
- Default: rounded-xl, shadow-md
- Interactive cards: transform transition, hover:scale-[1.02]
- Pressed state: scale-[0.98]

---

## Images

**Profile/Food Photos:**
- Food thumbnails in log: 64x64px, rounded-lg, object-cover
- Upload preview: 200x200px, rounded-xl
- Placeholder states: dashed border with icon centered

**No Hero Image Required** - The app focuses on data density and quick actions. The dashboard's circular progress indicator and large calorie numbers serve as the visual anchor.

---

## Responsive Behavior

**Mobile (base to md):**
- Single column layouts
- Full-width cards and buttons
- Sticky header and bottom navigation
- Touch-optimized targets (min h-12)
- Swipe gestures for deletion

**Tablet (md to lg):**
- Two-column grid for dashboard
- Side-by-side upload options
- Expanded meal timeline view

**Desktop (lg+):**
- Three-column stats layout
- Sidebar navigation option
- Hover states for interactive elements
- Keyboard shortcuts enabled

---

## Accessibility

- Minimum touch target: 44x44px (h-11 to h-12)
- Form labels always visible
- Error messages with icons and text
- Loading states with text announcements
- Semantic HTML structure throughout
- Tab navigation order optimized for workflow
- ARIA labels on icon-only buttons
- Color contrast ratios exceed WCAG AA standards

---

## Animation Principles

**Use Sparingly:**
- Smooth transitions for modals/drawers (300ms ease-in-out)
- Progress ring animations on page load
- Subtle scale transforms on card interactions (100ms)
- Loading spinners during AI analysis

**Avoid:**
- Excessive page transitions
- Distracting scroll animations
- Auto-playing content