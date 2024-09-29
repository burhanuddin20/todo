import "./ui.css";
import { createTodo } from "../todo/todo.js";
import * as project from "../project/project.js";

export { renderProjectList, createNewTodoModal, renderCreateTodoButton };

function createTodoObj() {
  console.log("create todo");
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;
  const notes = document.getElementById("notes").value;
  const checklist = document.getElementById("checklist").checked;
  const project = document.getElementById("project").value;

  // Create a to-do object using factory function

  const todo = createTodo({
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist,
    project,
  });

  console.log("Todo Object:", todo);
  return todo;
}

function renderCreateTodoButton() {
  console.log("rendering create todo button");
  const todoSection = document.querySelector(".top-content");
  const createTodoButton = document.createElement("button");
  createTodoButton.classList.add("create-todo");
  createTodoButton.textContent = "Create Todo";
  createTodoButton.onclick = createNewTodoModal;
  // append to start of the todo section
  todoSection.prepend(createTodoButton);
  return createTodoButton;
}

function createNewTodoModal() {
  console.log("create new todo modal");
  // Create the form
  const form = document.createElement("form");
  form.setAttribute("id", "todo-form");

  // Create input fields for Title, Description, Due Date, Priority, Notes
  const titleDiv = createLabelInput("Title", "text", "title");
  const descriptionDiv = createLabelInput("Description", "text", "description");
  const dueDateDiv = createLabelInput("Due Date", "date", "due-date");
  const notesDiv = createLabelInput("Notes", "text", "notes");
  const projectDiv = createLabelInput("Project", "text", "project");

  // Create a select field for Priority
  const priorityDiv = document.createElement("div");
  const priorityLabel = document.createElement("label");
  priorityLabel.setAttribute("for", "priority");
  priorityLabel.textContent = "Priority";
  priorityDiv.appendChild(priorityLabel);

  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("id", "priority");
  const priorityOptions = ["low", "medium", "high"];
  priorityOptions.forEach((option) => {
    const priorityOption = document.createElement("option");
    priorityOption.setAttribute("value", option);
    priorityOption.textContent = option;
    prioritySelect.appendChild(priorityOption);
  });
  priorityDiv.appendChild(prioritySelect);

  // Create a div for checklist
  const checklistDiv = document.createElement("div");
  const checklistLabel = document.createElement("label");
  checklistLabel.setAttribute("for", "checklist");
  checklistLabel.textContent = "Checklist";
  checklistDiv.appendChild(checklistLabel);

  const checklistInput = document.createElement("input");
  checklistInput.setAttribute("type", "checkbox");
  checklistInput.setAttribute("id", "checklist");
  checklistDiv.appendChild(checklistInput);

  // Create the modal container
  const modal = document.createElement("div");
  modal.setAttribute("id", "modal");
  modal.classList.add("modal");

  // Create the modal content div
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Add close button to the modal

  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.textContent = "×";
  closeButton.onclick = () => {
    modal.style.display = "none";
    modal.remove();
  };

  // Create the submit button
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.classList.add("todo-submit-button");

  submitButton.textContent = "Submit";

  // Append all the created elements to the form
  form.appendChild(titleDiv);
  form.appendChild(descriptionDiv);
  form.appendChild(dueDateDiv);
  form.appendChild(priorityDiv);
  form.appendChild(notesDiv);
  form.appendChild(projectDiv);
  form.appendChild(checklistDiv);
  form.appendChild(submitButton);

  modalContent.appendChild(closeButton);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Show the modal
  modal.style.display = "block";

  listenToDoSubmit();

  return modal;
}

// Function to create a label and input pair
const createLabelInput = (labelText, inputType, inputId) => {
  const div = document.createElement("div");

  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelText;

  const input = document.createElement("input");
  input.setAttribute("type", inputType);
  input.setAttribute("id", inputId);

  div.appendChild(label);
  div.appendChild(input);
  return div;
};

// function to listen for submit-button click

function listenToDoSubmit() {
  const submitButton = document.querySelector(".todo-submit-button");
  if (submitButton) {
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      const todo = createTodoObj();
      project.addTodo(todo.project, todo);
      const modal = document.getElementById("modal");
      if (modal) {
        modal.style.display = "none";
        modal.remove();
      }
      renderProjectList();
    });
  } else {
    console.warn("Todo submit button not found");
  }
}

function listenProjectSubmit() {
  const submitProjectButton = document.querySelector(".submit-project-button");
  if (submitProjectButton) {
    submitProjectButton.addEventListener("click", (event) => {
      event.preventDefault();
      const projectName = document.getElementById("name").value;
      project.createProject(projectName, []);
      const modal = document.getElementById("modal");
      if (modal) {
        modal.style.display = "none";
        modal.remove();
      }
      renderProjectList();
    });
  } else {
    console.warn("Project submit button not found");
  }
}

// Function to render the project list
function renderProjectList() {
  console.log("rendering project list");
  const projectList = document.querySelector(".project");
  // Clear the project list
  projectList.innerHTML = "";
  const projects = project.getProjectNames();
  console.log("Projects:", projects);
  projects.forEach((projectName) => {
    console.log("Project name:", projectName);

    const projectElement = document.createElement("div");
    projectElement.classList.add("project");
    projectElement.textContent = projectName;
    projectElement.onclick = () => {
      console.log("Project clicked:", projectName);
      var todoList = project.getTodos(projectName);
      console.log("Todos:", todoList);
      renderTodos(todoList);
    };
    projectList.appendChild(projectElement);
  });
}

// Function to render the todos
function renderTodos(todoList) {
  console.log("rendering todos");
  const todoSection = document.querySelector(".todos");
  // Clear the todos
  todoSection.innerHTML = "";
  todoList.forEach((todo) => {
    // render the title,description, due date, priority, notes, checklist, project
    const todoElement = document.createElement("div");
    todoElement.classList.add("todo-obj");
    todoElement.textContent = todo.title;
    todoSection.appendChild(todoElement);
    // need null checks here probably do this as a separate function
    // const todoDetails = document.createElement("div");
    // todoDetails.classList.add("todo-details");
    // todoDetails.textContent = todo.description;

    // todoElement.appendChild(todoDetails);

    // const dueDate = document.createElement("div");
    // dueDate.classList.add("due-date");
    // dueDate.textContent = todo.dueDate;
    // todoElement.appendChild(dueDate);

    // const priority = document.createElement("div");
    // priority.classList.add("priority");
    // priority.textContent = todo.priority;
    // todoElement.appendChild(priority);

    // const notes = document.createElement("div");
    // notes.classList.add("notes");
    // notes.textContent = todo.notes;
    // todoElement.appendChild(notes);

    // const checklist = document.createElement("div");
    // checklist.classList.add("checklist");
    // checklist.textContent = todo.checklist;
    // todoElement.appendChild(checklist);

    const project = document.createElement("div");
    project.classList.add("project");
    project.textContent = todo.project;
    todoElement.appendChild(project);
  });
}

export const renderCreateProjectButton = () => {
  console.log("rendering create project  button");
  const projectSection = document.querySelector(".top");
  const createProjectButton = document.createElement("button");
  createProjectButton.classList.add("create-project");
  createProjectButton.textContent = "Create Project";
  createProjectButton.onclick = createNewProjectModal;
  // append to start of the todo section
  projectSection.append(createProjectButton);
  // this might be not needed
  return createProjectButton;
};

function createNewProjectModal() {
  console.log("create new project modal");
  // Create the form
  const form = document.createElement("form");
  form.setAttribute("id", "project-form");

  // Create input fields for Title, Description, Due Date, Priority, Notes
  const nameDiv = createLabelInput("Name", "text", "name");

  // Create the modal container
  const modal = document.createElement("div");
  modal.setAttribute("id", "modal");
  modal.classList.add("modal");

  // Create the modal content div
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Add close button to the modal

  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.textContent = "×";
  closeButton.onclick = () => {
    modal.style.display = "none";
    modal.remove();
  };

  // Create the submit button
  const submitButton = document.createElement("button");
  submitButton.classList.add("submit-project-button");

  submitButton.setAttribute("type", "submit");
  submitButton.textContent = "Submit";

  // Append all the created elements to the form
  form.appendChild(nameDiv);
  form.appendChild(submitButton);

  modalContent.appendChild(closeButton);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Show the modal
  modal.style.display = "block";

  listenProjectSubmit();

  return modal;
}
