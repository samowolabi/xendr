# AI Design Skill Brief: Design Brief

> Build-ready design skill brief for Claude Code
> Tool: **Claude Code**
> Save this as a markdown file in your project and reference it in Claude Code to match this design language.

---

## Overall Read

Functional Minimalism. The interface conveys a Precise, Controlled, Efficient mood. Type: app.

## Layout Archetype

Editor / Configuration Panel. Fixed sidebar on the right for controls, fluid canvas area on the left, global top bar for application actions.. Density: Medium density in the sidebar, characterized by consistent vertical rhythm and clear grouping of related settings. Low density on the canvas..

## Information Flow

Primary interaction flows from left-to-right (canvas to controls) and top-to-bottom within control sections. Changes in the right panel reflect on the left canvas.

## Spacing Rhythm

Primarily an 8px and 16px soft grid. Internal padding within components like input fields is around 8-12px. Vertical spacing between logical sections (e.g., 'Grid' to 'Marks') is larger, around 24-32px, to create clear visual breaks. Horizontal spacing within input groups is around 16px.. Section separation: Sections within the control panel are separated by bolded heading text and generous top padding, creating distinct visual blocks without explicit dividers or borders..

## Navigation Behavior

Top-bar utility navigation with content-specific actions and a fixed right-sidebar for granular controls.. Visibility: Always visible top bar and right control panel.. Depth: Top bar is single-level. Right panel controls are primarily single-level, organized into logical collapsible sections (implied by the visual separation, though not explicitly collapsible in the screenshot).. Utility actions: Top-left for primary application actions (Export), top-right for content-specific actions (export format dropdown, possibly settings or profile)..

## Card & Surface Treatment

Surfaces: No explicit 'cards' as distinct UI elements, rather the control panel acts as a single, unified surface.. Borders: Consistent 4px border-radius on all interactive elements (buttons, input fields, toggles) and main containers, providing a soft, rounded aesthetic.. Shadows: Minimal to no shadows; the interface relies on background color and subtle borders for element separation. There is a very faint 1px shadow/border at the bottom of the top bar.. Container separation: Sections within the control panel are separated by strong typography (heading bolding and increased spacing) rather than visual dividers or distinct containers. The right control panel itself is separated from the canvas by a vertical divider line and different background color..

## Component Recurrence

- Segmented buttons
- Slider inputs
- Text input fields with labels
- Toggle switches
- Color pickers
- Export buttons (icon + text/text only)

Recurrence: High recurrence of input fields, sliders, and segmented controls for parameter adjustments.. Consistency: Very high consistency in sizing, spacing, border-radius, and interactive states across all components. For example, all input fields share the same height and border treatment..

## CTA Hierarchy

Primary: Prominently placed, rectangular, filled button with the accent color (orange for 'Export PNG') or a functional color (red for 'Export'). Clear icon and text label. High visual weight.. Secondary: Text-only buttons or low-fill buttons acting as segmented controls (e.g., 'PNG' next to 'Export', 'Dot' vs 'Field'). Lower visual weight, often using gray or border-only styles.. Frequency: Low frequency for primary CTAs (only 'Export' prominently displayed). High frequency for secondary interaction controls within the right panel.. Emphasis: Primary CTAs use color fill and position for emphasis. Secondary CTAs use subtle background fills, borders, or are text-only to blend into the control panel..

## Information Density

Medium to High in the control panel, Low in the canvas area

## Typography System

Modern Humanist Sans-serif (e.g., Inter, Rubik, system font). Headings: Semi-bold, 14-16px dark gray for section titles, distinguished by ample vertical spacing.. Body: Regular weight, 12-14px grey for labels and input values. Lighter grey for secondary information.. Hierarchy strength: Strong due to clear differentiation between section headers, labels, and input values via font-weight, size, and color..

## Color Strategy

Monochromatic base (white, light gray, dark gray) with a singular high-contrast accent color (vibrant orange #FF4800) and a secondary functional red for export.. Accent behavior: Used for primary call-to-actions, active states of interactive elements (toggles, selected buttons), and visual indicators of current settings.. Contrast: High contrast between text and background for readability (dark grey on white). Moderate contrast for secondary elements (light grey on white). High contrast for accent elements to draw attention..

## Interaction Style

Direct manipulation of parameters through form controls (sliders, input fields, toggles) with immediate visual feedback on the main canvas.. Hover feedback: Implied hover states would likely involve subtle background color changes or border highlights on interactive elements like buttons and input fields.. Motion intensity: Minimal, with the 'Motion' section suggesting configurable animation properties for the canvas elements, but the UI itself appears static and performance-focused..

## Data Visualization

The main canvas is a grid of dots, serving as a configurable visual output rather than a traditional data visualization.. Chart style: N/A - not a traditional chart interface.. Data density: The canvas has a configurable density of dots (Cells R 20 C 20 indicates a 20x20 grid), which can represent data points, although it is not inherently presenting external data..

## Build Guidance

Configuration tools, data visualization builders, creative design applications, developer interfaces

## Avoid

Content-heavy blogs, highly narrative websites, playful or whimsical brand identities

## Do Not Copy

Do not reproduce the exact layout, brand identity, or copy from the source design.
Use the extracted design language only as inspiration for creating a new interface.
