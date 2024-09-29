const createTodo = ({
  title,
  description,
  dueDate,
  priority,
  notes,
  checklist,
  project,
}) => ({
  title,
  description,
  dueDate,
  priority,
  notes,
  checklist,
  project,
  getNotes() {
    return this.notes;
  },
});

export { createTodo };
