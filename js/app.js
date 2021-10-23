/**
 * Features & UX improvements:
 * 1. Don't add empty tasks (#)
 * 2. Show a confirmation message when deleting a task (#)
 * 3. Show a confirmation message when deleting all tasks (#)
 * 4. Show an alert if no tasks and the user clicked clearTasksBtn (#)
 * 5. Print a html element under tasksFilter when no tasks match the search (?)
 * 6. Make remove task button clickable (#)
 */

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
 * Get tasks from localStorage (Document has been opened)
 * Submit the form event (To add tasks)
 * Click on remove task button
		- Event delegation, we put the event to the tasks list because we've multiple tasks with a 'delete-task' class, and they're dynamic and we can add more of them
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

// Get stored tasks from localStorage
function getTasks() {
	let tasks

	if (!localStorage.getItem('tasks')) {
		tasks = []
	} else {
		tasks = JSON.parse(localStorage.getItem('tasks'))
	}

	tasks.forEach(task => {
		/* const taskElement = document.createElement('li')
     taskElement.className = 'collection-item'

     const taskContent = document.createTextNode(task)
     taskElement.appendChild(taskContent)

     const taskRemover = document.createElement('a')
     taskRemover.className = 'delete-task secondary-content'
     taskRemover.innerHTML = '<i class="fa fa-remove fa-2x"></i>'

     taskElement.appendChild(taskRemover)

     // show task in the DOM
     tasksList.appendChild(taskElement) */

		tasksList.insertAdjacentHTML(
			'beforeend',
			`
     <li class="collection-item">
       ${task}
       <a class="delete-task secondary-content">
         <i class="fa fa-remove"></i>
       </a>
     </li>
     `
		)
	})
}

/**
 * tasksForm => @submit
 * Create a new task in the DOM
 * Store created task in the localStorage
 */
function addTask(e) {
	e.preventDefault()

	/**
	 * Create single task <li>
	 * Create a button to delete the task <a>
	 * Add the element to tasks list
	 */

	// Substituted with insertAdjacentHTML method
	/* const taskElement = document.createElement('li')
   taskElement.className = 'collection-item'

   const taskContent = document.createTextNode(taskInput.value)
   taskElement.appendChild(taskContent)

   const taskRemover = document.createElement('a')
   taskRemover.className = 'delete-task secondary-content'
   taskRemover.innerHTML = '<i class="fa fa-remove fa-2x"></i>'

   taskElement.appendChild(taskRemover) */

	// Add task to the tasks list (prevent empty task)
	if (taskInput.value) {
		// tasksList.appendChild(taskElement) // Substituted with addAdjacentHTML
		tasksList.insertAdjacentHTML(
			'beforeend',
			`
     <li class="collection-item">
       ${taskInput.value}
       <a class="delete-task secondary-content">
         <i class="fa fa-remove"></i>
       </a>
     </li>`
		)
	} else {
		alert('Empty task! Please add task content...')
	}

	// Store task in local storage
	storeTaskInLocalStorage(taskInput.value)

	// UX: Clear input after adding the task
	taskInput.value = ''
}

function storeTaskInLocalStorage(task) {
	let tasks

	if (!localStorage.getItem('tasks')) {
		tasks = []
	} else {
		tasks = JSON.parse(localStorage.getItem('tasks'))
	}

	/**
	 * If taskInput.value, add the task to tasks array
	 * localStorage accepts string data only
	 * localStorage.setItem('tasks', JSON.stringify(tasks)), the first 'tasks' is the name in the localStorage, the second 'tasks' is the array of tasks
	 */
	if (task) tasks.push(task)
	localStorage.setItem('tasks', JSON.stringify(tasks))

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

	tasks.forEach((item, index) => {
		if (task.textContent === item) {
			tasks.splice(index, 1)
		}
	})

	// Update the tasks in localStorage after deleting the task item
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

/**
 * (clearTasksBtn @click)
 * Clear all tasks from DOM
 * Clear all tasks from local storage
 */
function clearTasks(e) {
	// Simplest but the slowest
	/* if (e.target) {
		if (confirm('Want to delete all tasks?')) {
			tasksList.innerHTML = ''
		}
	} */

	// tasksList.style.display = 'none' // not recommended

	const allTasks = document.querySelectorAll('.collection-item')
	// console.log(allTasks.length) // UT

	// Faster
	if (allTasks.length > 0) {
		if (confirm('Want to delete all tasks?')) {
			while (tasksList.firstChild) {
				tasksList.removeChild(tasksList.firstChild)
			}
		}
	} else {
		// UX: Show an alert when no tasks and the user clicked clearTasksBtn
		alert('No tasks to be deleted!')
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
	allTasks.forEach(task => {
		// What's inside each task in allTasks
		const taskItem = task.firstChild.textContent
		// console.log(taskItem) // Refactor later
		if (taskItem.toLowerCase().indexOf(filterText) !== -1) {
			task.style.display = 'block'
		} else {
			task.style.display = 'none'
			tasksList.insertAdjacentHTML(
				'beforeend',
				`
			<li class="collection-item">No tasks match your search term!</li>
			`
			)
		}
	})
}
