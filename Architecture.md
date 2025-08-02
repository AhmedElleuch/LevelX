# LevelX Architecture & Design

## Overview
LevelX is a React Native app built with Expo that helps users track tasks, habits, skills and focused work sessions. The project combines local state, timed sessions and progress tracking to encourage productivity.

## Tech Stack
- **React Native & Expo** for cross-platform mobile development.
- **React Navigation** (bottom tabs + native stack) for screen flow.
- **Zustand** with slice composition and **AsyncStorage** for persistent global state.
- **Expo Notifications** and **react-native-gesture-handler** for user interaction and alerts.

## Folder Organization
```
/ (root)
├── App.js                # navigation setup
├── index.js              # Expo entry point
├── src/
│   ├── components/
│   │   ├── Home/         # components used on Home screen
│   │   ├── Performance/  # components for Performance screen
│   │   └── common/       # shared UI pieces
│   ├── navigation/       # navigation helpers
│   ├── screens/
│   │   ├── Home/         # Home screen files
│   │   └── Performance/  # Performance screen files
│   ├── services/         # timer logic
│   ├── store/            # Zustand slices
│   └── utils/            # helpers and constants
```

## Navigation & Screen Flow
`App.js` configures a bottom tab navigator with **Home** and **Performance** tabs. A stack navigator wraps the tabs and provides additional screens:
```
NavigationContainer
  └─ Stack.Navigator
      ├─ Main → Tab.Navigator
      │   ├─ Home → HomeScreen
      │   └─ Performance → PerformanceScreen
      ├─ Task → TaskScreen
      └─ Focus → FocusScreen
```
The home header shows timers (`ProductionTimer`, `TimerDisplay`, `BreakTimer`). A dropdown menu in the header offers settings and other actions.

## Component Hierarchy
- **HomeScreen**: renders timers, suggestions and three `TaskBrowser` lists (projects, habits, skills).
- **TaskBrowser**: lists hierarchical tasks using `TaskCard` and handles adding subtasks.
- **TaskScreen**: detailed view for a task with notes, blocking relationships and navigation to subtasks.
- **PerformanceScreen**: displays XP progress, production vs. waste chart and completed missions.

## Key Components
- **ProductionTimer.js** – Displays the active production timer.
- **TimerDisplay.js** – Shows the countdown for a focus session.
- **TaskCard.js** – Represents a single task and starts a timer when the user taps *Start*.
- **TaskScreen.js** – Screen for viewing and editing any task's details. Opens from the three-dot menu on each card and supports projects, habits and skills.
- **ConfigMenu.js** – Allows editing the focus minutes used for new timers.

## State Management
Global state is created via `useUserStore` which composes slices:
- `timerSlice` – production/waste/break timers and focus session data.
- `tasksSlice`, `habitsSlice`, `skillsSlice` – task trees for each category.
- `profileSlice` – user XP, level, streak and theme settings.
State persists with `persist` and `AsyncStorage`, letting timers and tasks resume after app restarts.

## Services & Timers
Two service modules encapsulate timing logic:
- `productionTimer.js` manages production, waste, inactivity and break timers.
- `focusTimer.js` runs focused work sessions, awards XP and transitions to breaks.
Both services update the store every second and use `expo-notifications` to alert when sessions end.

## Data Flow
1. **User interaction** – Pressing buttons or entering text on `HomeScreen` or the dropdown menu.
2. **Store update** – Components call setters from `useUserStore` or timer functions (`startProductionTimer`, `startTimer`, `stopProductionTimer`).
3. **Timers** – `setInterval` in the timer services updates values such as `productionSeconds` or `secondsLeft` in the store.
4. **UI refresh** – Components that subscribe to the store (`ProductionTimer`, `TimerDisplay`, `TaskCard`, etc.) automatically re-render with the new data.

## Data Models
### Task
```
{
  id: string,
  title: string,
  priority: 'Low' | 'Medium' | 'High',
  isStarted: boolean,
  isCompleted: boolean,
  isManuallyLocked: boolean,
  dateCreated: ISOString,
  dateStarted: ISOString | null,
  dateFinished: ISOString | null,
  description: string,
  dod: string,
  userNotes: string[],
  blockingTasks: string[],
  children: Task[]
}
```
Tasks, habits and skills share this structure and are stored as nested trees.

### Profile
```
{
  name: string,
  activeTaskId: string | null,
  xp: number,
  dailyXp: number,
  level: number,
  streak: number,
  theme: 'light' | 'dark',
  difficulty: string
}
```

### Timer State
```
{
  isProductionActive: boolean,
  productionSeconds: number,
  isWasteActive: boolean,
  wasteSeconds: number,
  focusMinutes: number,
  breakMinutes: number,
  breakSeconds: number,
  isOnBreak: boolean,
  secondsLeft: number
}
```

## Planned API Integration
Future releases will sync tasks, profiles and timer history with a backend service. Planned endpoints include:
- `POST /tasks` – create/update task trees
- `POST /sessions` – upload production and focus session metrics
- `GET /profile` – retrieve user XP, level and theme across devices
API integration will rely on fetch-based services and merge server data into the store.

## Key Design Decisions
- **Slice-based store** keeps logic modular and testable.
- **Service modules** isolate timing side effects from UI components.
- **Flat task trees** are manipulated through utility helpers to enforce lock and blocking rules.
- **Theming** uses a color helper that extends React Navigation themes.
- **Navigation ref** enables timer services to open the Focus screen programmatically.

## Roadmap
- Add authentication and remote sync of tasks and progress.
- Replace in-memory timers with a background-friendly solution.
- Expand analytics with charts and history.
- Introduce accessibility improvements and localization.
- Convert codebase to TypeScript for stronger type safety.

