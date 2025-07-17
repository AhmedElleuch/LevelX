export const sortTasks = (tasks) => {
  const priorities = ['High', 'Medium', 'Low'];
  return [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
  });
};
