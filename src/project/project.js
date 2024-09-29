import "./project.css";

const projectList = new Map();

// create a new project and add it to the project list
// checks here to see if it exists
function createProject(name, todos) {
  projectList.set(name, todos);
}

// add some checks to see if its empty
const getTodos = (projectName) => {
  if (!projectList.has(projectName)) {
    return [];
  }
  return projectList.get(projectName);
};

const addTodo = (projectName, todo) => {
  let todos = projectList.get(projectName);

  if (!todos) {
    // Project doesn't exist, create new array with the todo and add to map
    todos = [todo];
    projectList.set(projectName, todos);
  } else if (!Array.isArray(todos) || todos.length === 0) {
    // Project exists but todos is not an array or is empty
    todos = [todo];
    projectList.set(projectName, todos);
  } else {
    // Project exists and has todos, append the new todo
    todos.push(todo);
  }

  console.log("Todos:", todos);
};

const getProjectNames = () => {
  return Array.from(projectList.keys());
};

export { getProjectNames, addTodo, projectList, getTodos, createProject };
