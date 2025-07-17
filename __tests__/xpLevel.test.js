import { useUserStore } from '../src/store/userStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

test('completeTask awards xp and levels up', () => {
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  useUserStore.setState({
    tasks: [{ id: '1', title: 'Task', isStarted: true, isCompleted: false }],
    activeTaskId: '1',
    xp: 90,
    dailyXp: 0,
    level: 1,
    streak: 1,
    lastCompleteDate: yesterday,
  });

  useUserStore.getState().completeTask('1');

  const state = useUserStore.getState();
  expect(state.xp).toBe(115);
  expect(state.level).toBe(2);
  expect(state.streak).toBe(2);
});
