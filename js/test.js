// UIs
const taskForm = document.querySelector('#task-form')
const taskInput = document.querySelector('#task-input')
const tasksFilter = document.querySelector('#filter')
let tasksList = document.querySelector('.tasks-list')
const deleteTask = document.querySelector('.delete-task')
const clearTasksBtn = document.querySelector('.clear-tasks')

// Event listeners
// 5. Get tasks from localStorage
document.addEventListener('DOMContentLoaded', getTasks)
// 1. Add a new task
taskForm.addEventListener('submit', addTask)
// 2. Delete task
tasksList.addEventListener('click', deleteCurrentTask)
// 3. Clear all tasks
clearTasksBtn.addEventListener('click', clearTasks)
// 4. Filter tasks
tasksFilter.addEventListener('keyup', filterTasks)

// Get tasks from localStorage
function getTasks() {
	let tasks

	if (!localStorage.getItem('tasks')) {
		tasks = []
	} else {
		tasks = JSON.parse(localStorage.getItem('tasks'))
	}

	tasks.forEach(task => {
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

function addTask(e) {
	e.preventDefault()

	if (!taskInput.value) {
		alert('Empty task! Please add your task...')
	}

	tasksList.insertAdjacentHTML(
		'beforeend',
		`
  <li class="collection-item">
    ${taskInput.value}
    <a class="delete-task secondary-content">
      <i class="fa fa-remove"></i>
    </a>
  </li>
  `
	)

	// Store task in the localStorage
	addTaskToLocalStorage(taskInput.value)

	// UX: Clear input after adding the task
	taskInput.value = ''
}

function addTaskToLocalStorage(task) {
	let tasks

	if (!localStorage.getItem('tasks')) {
		tasks = []
	} else {
		tasks = JSON.parse(localStorage.getItem('tasks'))
	}

	if (task) tasks.push(task)
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Delete current task (On click)
function deleteCurrentTask(e) {
	e.preventDefault()

	if (e.target.parentElement.classList.contains('delete-task')) {
		// console.log(e.target) // UT
		e.target.parentElement.parentElement.remove()
	}

	// Delete task from localStorage
	deleteTaskFromLocalStorage(e.target.parentElement.parentElement)
}

function deleteTaskFromLocalStorage(task) {
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

	// Override localStorage data
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Clear all tasks
function clearTasks(e) {
	e.preventDefault()

	// Simplest way but the slowest
	/* if (confirm('Want to delete all tasks?')) {
		tasksList.innerHTML = ''
	} */

	const allTasks = document.querySelectorAll('.collection-item')
	console.log(allTasks.length)

	if (allTasks.length > 0) {
		if (confirm('Want to delete all tasks?')) {
			while (tasksList.firstChild) {
				tasksList.removeChild(tasksList.firstChild)
			}
		}
	}

	clearTasksFromLocalStorage()
}

function clearTasksFromLocalStorage() {
	localStorage.clear()
}

// Filter tasks
function filterTasks(e) {
	const term = e.target.value.toLowerCase()
	const allTasks = document.querySelectorAll('.collection-item')

	allTasks.forEach(task => {
		if (task.firstChild.textContent.indexOf(term) !== -1) {
			task.style.display = 'block'
		} else {
			task.style.display = 'none'
		}
	})
	// console.log(searchInput) // UT
}
