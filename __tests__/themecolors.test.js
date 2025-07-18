import { getThemeColors } from '../src/utils/themeColors';

test('getThemeColors returns dark palette', () => {
  const colors = getThemeColors('dark');
  expect(colors.background).toBe('#000');
  expect(colors.text).toBe('#fff');
});
