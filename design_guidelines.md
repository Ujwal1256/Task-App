# Task Board Application - Design Guidelines

## Design Approach
**Selected Approach**: Modern Productivity Tool (inspired by Linear + Todoist)
- Clean, focused interface prioritizing task completion flow
- Subtle animations that enhance usability without distraction
- Contemporary aesthetic with depth and visual hierarchy

## Typography
- **Primary Font**: Inter (Google Fonts) - modern, readable
- **Hierarchy**:
  - App title/header: text-2xl font-bold
  - Task text: text-base font-medium
  - Progress labels: text-sm font-normal
  - Stats/counts: text-xs font-semibold uppercase tracking-wide

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Container: max-w-2xl mx-auto (centered, focused width)
- Section padding: p-8 on desktop, p-4 on mobile
- Component gaps: gap-4 for vertical stacking, gap-2 for inline elements
- Card padding: p-6

## Core Components

### Header Section
- App title with icon (left-aligned or centered)
- Task statistics display: "X of Y tasks completed"
- Subtle elevation with border-b treatment

### Input Section
- Single-row layout: flex input + button
- Text input: flex-1, rounded-lg, focus ring treatment
- "Add Task" button: prominent, rounded-lg px-6 py-3
- Keyboard support indicator (subtle "Press Enter" hint)

### Progress Indicator
- Full-width progress bar component
- Height: h-3, rounded-full
- Inner fill animates with transition-all duration-500
- Percentage text displayed prominently above bar
- Position: Between input and task list

### Task List
- Vertical stack with gap-3
- **Individual Task Card**:
  - Rounded-lg with subtle border and shadow-sm
  - Hover: shadow-md transition
  - Layout: flex items-center justify-between p-4
  - Left side: checkbox + task title (flex gap-3)
  - Right side: delete button
  - Completed state: opacity-60 with line-through on text

### Task Item Elements
- **Checkbox**: w-5 h-5, rounded, custom styling with checkmark
- **Task Title**: flex-1, truncate on overflow
- **Delete Button**: Icon-only (trash icon), hover:bg treatment, rounded p-2

### Empty State
- Center-aligned content when no tasks
- Illustration or icon (task/clipboard theme)
- Friendly message: "No tasks yet. Add one to get started!"
- Muted text styling

### Stats Display
- Horizontal layout showing:
  - Total tasks count
  - Completed count
  - Completion percentage
- Use badge/pill styling with rounded-full

## Animations
**Minimal, purposeful only**:
- Task add: slide-in from top (duration-300)
- Task delete: fade-out + slide-out (duration-200)
- Checkbox toggle: scale animation
- Progress bar: smooth width transition (duration-500)
- Hover states: scale-105 or shadow changes

## Component Library
- **Icons**: Heroicons (via CDN) - use Check, Trash, Plus icons
- **Input**: Standard text input with focus:ring-2 treatment
- **Buttons**: Solid primary style, rounded-lg, hover:scale-[1.02] transition
- **Cards**: Subtle borders, shadow-sm default, shadow-md on hover

## Unique Differentiators
1. **Progress visualization**: Animated gradient progress bar with glow effect
2. **Task completion celebration**: Subtle confetti or check animation on task complete
3. **Smooth micro-interactions**: All state changes animate elegantly
4. **Visual task grouping**: Completed tasks visually separated or grouped
5. **Keyboard-first**: Enter to add, Space to toggle, Delete for removal with visual feedback

## Images
**No images required** - This is a utility-focused task management app where imagery would be distracting. Focus on clean typography, spacing, and iconography.

## Layout Structure
```
┌─────────────────────────────┐
│  Header (Title + Stats)      │
├─────────────────────────────┤
│  Input + Add Button          │
│  Progress Bar (animated)     │
├─────────────────────────────┤
│  Task List                   │
│  □ Task 1    [Delete]        │
│  ☑ Task 2    [Delete]        │
│  □ Task 3    [Delete]        │
└─────────────────────────────┘
```

**Responsive Behavior**:
- Desktop: Fixed max-width container, generous padding
- Mobile: Full-width with reduced padding, stack all elements
- Task cards maintain readability on all screen sizes