/**
 * Read UIs
 * The form to write a task
 * The input value
 * The tasks list
 * The clear tasks button
*/
const taskForm = document.querySelector('#task-form')
const taskInput = document.querySelector('#task-input')
const tasksList = document.querySelector('.tasks-list')
const tasksFilter = document.querySelector('#filter')
const clearTasksBtn = document.querySelector('.clear-tasks')

/**
 * Load all events
 * Opening the html document event
 * Submit the form event
 * Click on remove task button
 * Click on clear tasks button
 * Start searching tasks to filter tasks
 */
loadEventListeners()

function loadEventListeners() {
  document.addEventListener('DOMContentLoaded', getTasks)
  taskForm.addEventListener('submit', addTask)
  tasksList.addEventListener('click', removeTask)
  clearTasksBtn.addEventListener('click', clearTasks)
  tasksFilter.addEventListener('keyup', filterTasks)
}

// Get stored tasks from local storage
function getTasks() {
  let tasks
  if (!localStorage.getItem('tasks')) {
    tasks = []
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'))
  }

  tasks.forEach((task) => {
    const taskElement = document.createElement('li')
    taskElement.className = 'collection-item'

    const taskContent = document.createTextNode(task)
    taskElement.appendChild(taskContent)

    const taskRemover = document.createElement('a')
    taskRemover.className = 'delete-task secondary-content'
    taskRemover.innerHTML = '<i class="fa fa-remove fa-2x"></i>'

    taskElement.appendChild(taskRemover)

    // show task in the DOM
    tasksList.appendChild(taskElement)
  })
}

/**
 * (tasksForm @submit)
    * Create a new task in the DOM
    * Store created task in local storage
 */
function addTask(e) {
  e.preventDefault()

  /**
   * Create single task <li>
   * Create a button to delete the task <a>
   * Add the element to tasks list
   */

  const taskElement = document.createElement('li')
  taskElement.className = 'collection-item'

  const taskContent = document.createTextNode(taskInput.value)
  taskElement.appendChild(taskContent)

  const taskRemover = document.createElement('a')
  taskRemover.className = 'delete-task secondary-content'
  taskRemover.innerHTML = '<i class="fa fa-remove fa-2x"></i>'

  taskElement.appendChild(taskRemover)

  // add task to tasks list (prevent empty task)
  if (taskInput.value) {
    tasksList.appendChild(taskElement)
  } else {
    alert('Empty task! Please add task content...')
  }

  // store task in local storage
  storeTaskInLocalStorage(taskInput.value)

  taskInput.value = ''
}

function storeTaskInLocalStorage(task) {
  let tasks // init tasks var

  // read tasks value
  if (!localStorage.getItem('tasks')) {
    tasks = []
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'))
  }

  if (task) tasks.push(task)
  localStorage.setItem('tasks', JSON.stringify(tasks)) // local storage uses string data type only

  // tasks.forEach(task => console.log(task)) // UT
}

/**
 * (taskRemover @click)
    * Delete the task from DOM
    * Delete the task from local storage
 */
function removeTask(e) {
  e.preventDefault()

  // remove task item when clicking on (x: delete-task)
  if (e.target.parentElement.classList.contains('delete-task')) {
    if (confirm(`Want to delete ${e.target.parentElement.parentElement.textContent}`)) {
      e.target.parentElement.parentElement.remove()
    }
  }

  removeTaskFromLocalStorage(e.target.parentElement.parentElement)
}

function removeTaskFromLocalStorage(task) {
  let tasks

  if (!localStorage.getItem('tasks')) {
    tasks = []
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'))
  }

  tasks.forEach((taskItem, index) => {
    if (task.textContent === taskItem) {
      tasks.splice(index, 1)
    }
  })

  localStorage.setItem('tasks', JSON.stringify(tasks))
}

/**
 * (clearTasksBtn @click)
    * Clear all tasks from DOM
    * Clear all tasks from local storage
 */
function clearTasks() {
  // console.log(tasksList)
  // tasksList.innerHTML = '' // slower
  // tasksList.style.display = 'none' // not recommended

  // Faster
  if (confirm('Want to delete all tasks?')) {
    while (tasksList.firstChild) {
      tasksList.removeChild(tasksList.firstChild)
    }
  }

  clearTasksFromLocalStorage()
}

function clearTasksFromLocalStorage() {
  localStorage.clear()
}

// Filter tasks
function filterTasks(e) {
  const filterText = e.target.value.toLowerCase()

  const allTasks = document.querySelectorAll('.collection-item')
  allTasks.forEach((task) => {
    const taskItem = task.firstChild.textContent
    // console.log(taskItem) // Refactor later
    if (taskItem.toLowerCase().indexOf(filterText) !== -1) {
      task.style.display = 'block'
    } else {
      task.style.display = 'none'
    }
  })
}
