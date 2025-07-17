import { sortTasks } from '../src/utils/sortTasks';

describe('sortTasks', () => {
  test('places incomplete tasks before completed ones', () => {
    const tasks = [
      { id: '1', priority: 'Medium', isCompleted: false },
      { id: '2', priority: 'Low', isCompleted: true },
      { id: '3', priority: 'High', isCompleted: false },
    ];
    const sorted = sortTasks(tasks);
    expect(sorted.map((t) => t.id)).toEqual(['3', '1', '2']);
  });

  test('orders by priority when completion is equal', () => {
    const tasks = [
      { id: '1', priority: 'Low', isCompleted: false },
      { id: '2', priority: 'High', isCompleted: false },
      { id: '3', priority: 'Medium', isCompleted: false },
    ];
    const sorted = sortTasks(tasks);
    expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1']);
  });
});

// Feature under development
// Expected to pause the production timer without resetting the elapsed time
// when implemented.
test.todo('pauseProductionTimer stops interval and keeps elapsed time');