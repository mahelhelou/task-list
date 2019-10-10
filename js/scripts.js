// UI Vars
const form = document.querySelector('#task-form')
const taskInput = document.querySelector('#task-input')
const filter = document.querySelector('#filter')
const tasksList = document.querySelector('.tasks-list')
const clearBtn = document.querySelector('.clear-tasks')

function loadEventListeners() {
    document.addEventListener('DOMContentLoaded', getTasks)
    form.addEventListener('submit', addTask)
    tasksList.addEventListener('click', removeTask)
    clearBtn.addEventListener('click', clearTasks)
    filter.addEventListener('keyup', filterTasks)
}

loadEventListeners() // load all event listeners

// Get Stored Tasks (from locasStorage)
function getTasks() {
    let tasks
    if (localStorage.getItem('tasks') === null) {
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    tasks.forEach(function (task) {
        // Create li element
        const li = document.createElement('li')
        li.className = 'collection-item'
        li.appendChild(document.createTextNode(task))
        
        // Create link element
        const link = document.createElement('a')
        link.className = 'delete-item secondary-content'
        link.innerHTML = '<i class="fa fa-remove"></i>'
        
        li.appendChild(link)
        tasksList.appendChild(li)
    })
}

// Add Task
function addTask(e) {
    if (!taskInput.value) {
        alert('Task is empty! \n Please add a task in the field.')
    }

    // Create li element (task)
    const li = document.createElement('li')
    li.className = 'collection-item'
    
    // Create remove task icon (remove button for one task)
    const link = document.createElement('a')
    link.className = 'delete-item secondary-content'
    link.innerHTML = '<i class="fa fa-remove"></i>'
    
    // Fill li content [actual task, remove icon]
    li.appendChild(document.createTextNode(taskInput.value))
    li.appendChild(link)

    // Push task (li) to tasks list (ul)
    if (taskInput.value) {
        tasksList.appendChild(li)
    }

    // Storing task in local storage
    storeTaskInLocalStorage(taskInput.value)

    taskInput.value = ''

    e.preventDefault()
}

function storeTaskInLocalStorage(task) {
    let tasks
    if (localStorage.getItem('tasks') === null) {
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    // Push task to local storage
    if (task) {
        tasks.push(task)
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
    
    // TESTING: Print all tasks in the console
    // tasks.forEach(task => console.log(task))
}

function removeTask(e) {
    if (e.target.parentElement.classList.contains('delete-item')) { // elems: (i -> a)
        if (confirm(`Are you sure you want to delete the task? \n ${e.target.parentElement.parentElement.textContent}`)) {
            e.target.parentElement.parentElement.remove() // elems: (i -> a -> li)
        }

        removeTaskFromLocasStorage(e.target.parentElement.parentElement)
    }
}

function removeTaskFromLocasStorage(taskItem) {
    // console.log(taskItem)
    let tasks
    if (localStorage.getItem('tasks') === null) {
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    tasks.forEach((task, index) => {
        if (taskItem.textContent === task) {
            tasks.splice(index, 1)
        }
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function clearTasks(e) {
    // if (confirm('Are you sure you want to delete all tasks?')) {
    //     tasksList.innerHTML = ''
    // }

    // Faster
    while (tasksList.firstChild) {
        tasksList.removeChild(tasksList.firstChild)
    }

    clearTasksFromLocalStorage()
}

function clearTasksFromLocalStorage() {
    localStorage.clear()
}

function filterTasks(e) {
    const text = e.target.value.toLowerCase()

    document.querySelectorAll('.collection-item').forEach(task => {
        const item = task.firstChild.textContent
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'block'
        } else {
            task.style.display = 'none'
        }
    })
}