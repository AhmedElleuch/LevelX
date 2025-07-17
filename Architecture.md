# Architecture Overview

This document explains the main structure of the LevelX React Native app. It references key modules and describes how navigation, state, and timers work together.

## Navigation Setup

- **`App.js`** sets up a bottom tab navigator using `@react-navigation/native` and `@react-navigation/bottom-tabs`.
- Two screens are registered: `Home` (`HomeScreen`) and `Config` (`ConfigScreen`).
- **`index.js`** registers `App` as the root component so Expo can bootstrap the app.

```
NavigationContainer
  └─ Tab.Navigator
      ├─ Home → HomeScreen
      └─ Config → ConfigScreen
```

## State Management with Zustand

Global state lives in **`src/store/userStore.js`** using the `zustand` library. The store keeps:

- Production timer flags (`isProductionActive`, `productionStartTime`, `productionSeconds`)
- Task details (`taskTitle`, `priority`, `tasks`)
- Focus timer values (`focusMinutes`, `isTimerRunning`, `secondsLeft`, `intervalId`)
- Setter functions for each field

Screens and components call these setters to update state and subscribe to changes with `useUserStore()`.

State is persisted with the `persist` middleware so tasks and timer values survive app restarts using AsyncStorage.

## Timers

Timer logic lives in **`src/services/timer.js`**.

- `startProductionTimer` and `stopProductionTimer` manage a long running production timer. They update the store every second with the elapsed time.
- `startTimer` starts a focus session for a task. It sets `secondsLeft` and counts down until zero, then shows an alert.
- `ProductionTimer` and `TimerDisplay` components read timer values from the store and render the UI.

## Key Components

- **`ProductionTimer.js`** – Displays the active production timer.
- **`TimerDisplay.js`** – Shows the countdown for a focus session.
- **`TaskCard.js`** – Represents a single task and starts a timer when the user taps *Start*.
- **`ConfigMenu.js`** – Allows editing the focus minutes used for new timers.

## Screens

- **`HomeScreen.js`** – Main interface where tasks are added and timers are started. It renders `TimerDisplay`, `ProductionTimer`, and the list of `TaskCard` components.
- **`ConfigScreen.js`** – Presents the `ConfigMenu` for adjusting settings.

## Data Flow

1. **User interaction** – Pressing buttons or entering text on `HomeScreen` or `ConfigScreen`.
2. **Store update** – Components call setters from `useUserStore` or timer functions (`startProductionTimer`, `startTimer`, `stopProductionTimer`).
3. **Timers** – `setInterval` in `timer.js` updates values such as `productionSeconds` or `secondsLeft` in the store.
4. **UI refresh** – Components that subscribe to the store (`ProductionTimer`, `TimerDisplay`, `TaskCard`, etc.) automatically re-render with the new data.

This cycle keeps the UI in sync with user actions and background timers while remaining simple to reason about.
