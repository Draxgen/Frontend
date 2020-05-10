// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// Event Listeners
document.addEventListener('DOMContentLoaded', getLocalTodos);
todoButton.addEventListener('click', addTodoFromButton);
todoList.addEventListener('click', deleteCheck)
filterOption.addEventListener('change', filterTodo);

// Load ToDo List from Local Storage
// getLocalTodos();


// Functions
function addTodoFromButton(event) {
    // Prevent form submitting
    event.preventDefault();

    addTodo(todoInput.value);
    // // ToDo DIV
    // const todoDiv = document.createElement('div')
    // todoDiv.classList.add('todo');

    // // Create LI
    // const newTodo = document.createElement('li');
    // newTodo.innerText = todoInput.value;
    // newTodo.classList.add('todo-item');
    // todoDiv.appendChild(newTodo);

    // // Check Mark Button
    // const completedButton = document.createElement('button');
    // completedButton.innerHTML = '<i class="fas fa-check"></i>';
    // completedButton.classList.add('complete-btn');
    // todoDiv.appendChild(completedButton);

    // // Trash Button
    // const trashButton = document.createElement('button');
    // trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    // trashButton.classList.add('trash-btn');
    // todoDiv.appendChild(trashButton);

    // // Append to ToDo list
    // todoList.appendChild(todoDiv);

    // Save ToDo list
    saveLocalTodos(todoInput.value);

    // Clear todo input value
    todoInput.value = '';
}

function addTodo(todoValue) {
    // ToDo DIV
    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo');

    // Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todoValue;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    // Check Mark Button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    // Trash Button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    // Append to ToDo list
    todoList.appendChild(todoDiv);
}

function deleteCheck(event) {
    const item = event.target;
    // Delete Todo
    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        todo.classList.add('fall');
        todo.addEventListener('transitionend', function () {
            removeLocalTodo(todo.childNodes[0].innerHTML)
            todo.remove();
        });
    }

    //Check Todo
    if (item.classList[0] === 'complete-btn') {
        item.parentElement.classList.toggle('completed');
    }

}

function filterTodo(event) {
    // Get values
    const todos = todoList.childNodes;

    // loop through every item and show or hide it accordingly 
    todos.forEach(function (item, index) {
        item.classList.remove('hide');
        switch (event.target.value) {
            case 'all':
                item.classList.remove('hide');
                break;
            case 'completed':
                if (!item.classList.contains('completed')) item.classList.add('hide');
                break;
            case 'uncompleted':
                if (item.classList.contains('completed')) item.classList.add('hide');
                break;
        }
    });
}

function saveLocalTodos(todo) {
    // check if todo is not saved already
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos))
    return;
}

function getLocalTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        return;
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
        // todos.splice(todos.indexOf(todo), 1);
    }
    todos.forEach(function (todo) {
        addTodo(todo);
    });
}

function removeLocalTodo(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        return;
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
        if (todos.indexOf(todo) >= 0) {
            todos.splice(todos.indexOf(todo), 1);
            localStorage.setItem('todos', JSON.stringify(todos))
        }
    }
}