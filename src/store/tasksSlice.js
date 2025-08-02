import createCategorySlice from './categorySlice';

const createTasksSlice = (set, get) => ({
  taskTitle: '',
  setTaskTitle: (title) => set({ taskTitle: title }),
  priority: 'Medium',
  setPriority: (p) => set({ priority: p }),
  ...createCategorySlice('tasks')(set, get),
});

export default createTasksSlice;