import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createTimerSlice from './timerSlice';
import createTasksSlice from './tasksSlice';
import createHabitsSlice from './habitsSlice';
import createSkillsSlice from './skillsSlice';
import createProfileSlice from './profileSlice';

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...createTimerSlice(set, get),
      ...createTasksSlice(set, get),
      ...createHabitsSlice(set, get),
      ...createSkillsSlice(set, get),
      ...createProfileSlice(set, get),
    }),
    {
      name: 'levelx-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { isFocusModeVisible, ...rest } = state;
        return rest;
      },
    }
  )
);
