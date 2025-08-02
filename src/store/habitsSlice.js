import createCategorySlice from './categorySlice';

const createHabitsSlice = (set, get) => ({
  ...createCategorySlice('habits')(set, get),
});

export default createHabitsSlice;