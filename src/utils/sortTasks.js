export const sortTasks = (tasks) => {
  const priorities = ['High', 'Medium', 'Low'];
  return [...tasks].sort((a, b) => {
    if (a.isStarted !== b.isStarted) return a.isStarted ? -1 : 1;
    return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
  });
};
