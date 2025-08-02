import createCategorySlice from './categorySlice';

const createSkillsSlice = (set, get) => ({
  ...createCategorySlice('skills')(set, get),
});

export default createSkillsSlice;