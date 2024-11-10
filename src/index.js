import './style.css';
import { createTodo } from './todo/todo';

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('add-task-form');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const cardContainer = document.querySelector('.card-container');
    const cancelBtn = document.querySelector('.cancel-task');

    // Restore existing tasks
    tasks.forEach(taskData => {
        const todo = createTodo({
            text: taskData.text,
            description: taskData.description || '',
            dueDate: taskData.dueDate || null,
            priority: taskData.priority || 'low'
        });
        todo.id = taskData.id;
        todo.completed = taskData.completed;
        todo.createdAt = new Date(taskData.createdAt);
        const taskElement = createTaskElement(todo);
        taskList.appendChild(taskElement);
    });

    // Show card when input is focused
    taskInput.addEventListener('focus', () => {
        const container = document.querySelector('.todo-container');
        container.classList.add('expanded');
        // Small delay to ensure smooth transition
        setTimeout(() => {
            cardContainer.classList.remove('hidden');
        }, 50);
    });

    // Hide card when cancel is clicked
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cardContainer.classList.add('hidden');
        // Wait for card animation to finish before shrinking container
        setTimeout(() => {
            document.querySelector('.todo-container').classList.remove('expanded');
        }, 600);
        addTaskForm.reset();
    });

    // Handle form submission
    addTaskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskData = {
            text: taskInput.value.trim(),
            description: document.getElementById('task-description').value.trim(),
            dueDate: document.getElementById('task-due-date').value,
            priority: document.getElementById('task-priority').value
        };

        if(taskData.text) {
            const todo = createTodo(taskData);
            tasks.push(todo);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            const taskElement = createTaskElement(todo);
            taskList.appendChild(taskElement);
            addTaskForm.reset();
            cardContainer.classList.add('hidden');
        }
    });

    // Close card when clicking outside
    document.addEventListener('click', (e) => {
        const addTaskForm = document.getElementById('add-task-form');
        const cardContainer = document.querySelector('.card-container');
        
        if (!addTaskForm.contains(e.target) && !cardContainer.classList.contains('hidden')) {
            cardContainer.classList.add('hidden');
            
            setTimeout(() => {
                document.querySelector('.todo-container').classList.remove('expanded');
            }, 600);
            
            addTaskForm.reset();
        }
    });
});

function createTaskElement(todo) {
    const newTask = document.createElement('li');
    newTask.classList.toggle('completed', todo.completed);
    newTask.dataset.id = todo.id;
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    taskContent.innerHTML = `
        <div class="task-main">
            <span class="task-text">${todo.text}</span>
            <button class="done-btn">delete</button>
        </div>
        <div class="task-details-view">
            <p class="task-description">${todo.description || 'No description'}</p>
            <div class="task-meta">
                <span class="priority ${todo.priority}">${todo.priority} priority</span>
                <span class="due-date">${todo.dueDate || 'No due date'}</span>
            </div>
        </div>
    `;

    // Add click handler for details section
    const detailsView = taskContent.querySelector('.task-details-view');
    detailsView.addEventListener('click', (e) => {
        // Prevent triggering when clicking the title or done button
        if (!e.target.closest('.task-text') && !e.target.closest('.done-btn')) {
            openEditCard(todo, newTask);
        }
    });

    newTask.appendChild(taskContent);

    taskContent.querySelector('.task-text').addEventListener('click', () => {
        todo.toggleComplete();
        newTask.classList.toggle('completed');
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    taskContent.querySelector('.done-btn').addEventListener('click', () => {
        const taskIndex = tasks.findIndex(task => task.id === todo.id);
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        newTask.remove();
    });
    
    return newTask;
}

function openEditCard(todo, taskElement) {
    const editCard = document.createElement('div');
    editCard.className = 'edit-card';
    
    editCard.innerHTML = `
        <div class="edit-card-content">
            <textarea class="edit-description" placeholder="Description">${todo.description || ''}</textarea>
            <select class="edit-priority">
                <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low Priority</option>
                <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium Priority</option>
                <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High Priority</option>
            </select>
            <input type="date" class="edit-due-date" value="${todo.dueDate || ''}">
            <div class="edit-actions">
                <button type="button" class="save-edit">Save</button>
                <button type="button" class="cancel-edit">Cancel</button>
            </div>
        </div>
    `;

    const saveBtn = editCard.querySelector('.save-edit');
    const cancelBtn = editCard.querySelector('.cancel-edit');

    saveBtn.addEventListener('click', () => {
        const taskIndex = tasks.findIndex(t => t.id === todo.id);
        if (taskIndex !== -1) {
            todo.description = editCard.querySelector('.edit-description').value.trim();
            todo.priority = editCard.querySelector('.edit-priority').value;
            todo.dueDate = editCard.querySelector('.edit-due-date').value;
            
            tasks[taskIndex] = todo;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            const detailsView = taskElement.querySelector('.task-details-view');
            detailsView.innerHTML = `
                <p class="task-description">${todo.description || 'No description'}</p>
                <div class="task-meta">
                    <span class="priority ${todo.priority}">${todo.priority} priority</span>
                    <span class="due-date">${todo.dueDate || 'No due date'}</span>
                </div>
            `;
        }
        editCard.remove();
    });

    cancelBtn.addEventListener('click', () => editCard.remove());
    editCard.addEventListener('click', (e) => {
        if (e.target === editCard) editCard.remove();
    });

    document.body.appendChild(editCard);
}
    