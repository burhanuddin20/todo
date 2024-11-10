// Todo factory function
const createTodo = (data) => {
    // Handle both string input and object input
    const todoData = typeof data === 'string' ? { text: data } : data;
    
    return {
        id: Date.now().toString(),
        text: todoData.text,
        description: todoData.description || '',
        dueDate: todoData.dueDate || null,
        priority: todoData.priority || 'low',
        completed: false,
        createdAt: new Date(),
        toggleComplete() {
            this.completed = !this.completed;
        },
        toJSON() {
            return {
                id: this.id,
                text: this.text,
                description: this.description,
                dueDate: this.dueDate,
                priority: this.priority,
                completed: this.completed,
                createdAt: this.createdAt
            };
        }
    };
};

export { createTodo }; 