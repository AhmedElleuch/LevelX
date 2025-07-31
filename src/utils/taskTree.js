export const mapTasks = (tasks, fn) => {
  return tasks.map((t) => {
    const updated = fn(t);
    const children = t.children ? mapTasks(t.children, fn) : [];
    return { ...updated, children };
  });
};

export const updateTaskById = (tasks, id, updater) => {
  return tasks.map((t) => {
    if (t.id === id) {
      const updated = updater(t);
      const children = t.children ? updateTaskById(t.children, id, updater) : [];
      return { ...updated, children };
    }
    if (t.children) {
      return { ...t, children: updateTaskById(t.children, id, updater) };
    }
    return t;
  });
};

export const deleteTaskById = (tasks, id) => {
  return tasks
    .filter((t) => t.id !== id)
    .map((t) => (t.children ? { ...t, children: deleteTaskById(t.children, id) } : t));
};

export const addChildTask = (tasks, parentId, child) => {
  return tasks.map((t) => {
    if (t.id === parentId) {
      return { ...t, children: [...(t.children || []), child] };
    }
    if (t.children) {
      return { ...t, children: addChildTask(t.children, parentId, child) };
    }
    return t;
  });
};

export const findTaskById = (tasks, id) => {
  for (const t of tasks) {
    if (t.id === id) return t;
    if (t.children) {
      const found = findTaskById(t.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const flattenTasks = (tasks) => {
  return tasks.reduce(
    (acc, t) => [...acc, t, ...flattenTasks(t.children || [])],
    []
  );
};

export const getTaskDepth = (tasks, id, level = 1) => {
  for (const t of tasks) {
    if (t.id === id) return level;
    if (t.children) {
      const d = getTaskDepth(t.children, id, level + 1);
      if (d) return d;
    }
  }
  return 0;
};

export const reorderTasksByParentId = (tasks, parentId, newOrder) => {
  if (!parentId) return newOrder;
  return tasks.map((t) => {
    if (t.id === parentId) {
      return { ...t, children: newOrder };
    }
    if (t.children) {
      return {
        ...t,
        children: reorderTasksByParentId(t.children, parentId, newOrder),
      };
    }
    return t;
  });
};

export const findTaskPath = (tasks, id, path = []) => {
  for (const t of tasks) {
    if (t.id === id) return [...path, t.id];
    if (t.children) {
      const found = findTaskPath(t.children, id, [...path, t.id]);
      if (found) return found;
    }
  }
  return null;
};
