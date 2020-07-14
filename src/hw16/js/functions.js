'use strict';
const start = tasks => {
	if (!localStorage.getItem('tasks')) {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}
	showTasksBoard();
}

const showTasksBoard = () => {
	const wrap = $('#wrapper').html('');
	$('<button/>', {id: 'create-task', text: 'Create new Task'}).click(createNewTask).appendTo(wrap);
	$(wrap).append($('<div/>', {id: 'tasks'}));
	const tasks = JSON.parse(localStorage.getItem('tasks'));
	sendRequest(tasks);
}

const sendRequest = tasks => {
	fetch('priorities-and-statuses.json')
			.then(res => {
				return res.json();
			})
			.then(res => {
				tasks.forEach(task => createTaskBlock(task, res));
			});
}

const createNewTask = () => {
	const wrap = $('#wrapper').html('');
	const newBlock = $('<div/>', {id: 'new-block'}).appendTo(wrap);
	fetch('priorities-and-statuses.json')
			.then(res => {
				return res.json();
			})
			.then(props => {
				createForm(newBlock, 'New', 'Create new Task');
				setSelects(null, props);
				$('<button/>', {id: 'new-btn-save', text: 'Save'}).click(saveNewTask).appendTo(newBlock);
			})
}

const saveNewTask = () => {
	const tasks = JSON.parse(localStorage.getItem('tasks'));
	let maxId = 0;
	tasks.forEach(task => {
		if (task.taskId > maxId) {
			maxId = task.taskId;
		}
	});
	const taskName = $('#task-name').val();
	const statusId = parseInt($('#select-status option:selected').val());
	const priorityId = parseInt($('#select-priority option:selected').val());
	const newTask = new TodoTask(++maxId, taskName, statusId, priorityId);
	tasks.push(newTask);
	localStorage.setItem('tasks', JSON.stringify(tasks));
	showTasksBoard();
}

const createTaskBlock = (task, props) => {
	const {taskId, taskName, statusId, priorityId} = task;

	const taskBlock = $('<div/>', {'data-id': taskId}).addClass('task');
	$('<h5/>', {text: 'Task Name'}).appendTo(taskBlock);
	$('<input/>', {type: 'text', value: taskName}).attr('readonly', true).addClass('input').appendTo(taskBlock);

	setFieldOfTask(statusId, priorityId, taskBlock, props);

	const buttonsOfTaskBlock = $('<div/>').addClass('taskButtons').css('display', 'flex').appendTo(taskBlock);
	$('<button/>', {
		'data-id': taskId,
		text: 'Edit',
		'data-name': taskName
	}).click(editTask).appendTo(buttonsOfTaskBlock);
	$('<button/>', {
		'data-id': taskId,
		text: 'Remove',
		'data-name': taskName
	}).click(removeTask).appendTo(buttonsOfTaskBlock);
	$('#tasks').append(taskBlock);
}

const setFieldOfTask = (statusId, priorityId, taskBlock, props) => {
	let statusName = 'Not Defined';
	let priorityName = 'Not Defined';
	$('<h5/>', {text: 'Task Status'}).appendTo(taskBlock);
	const inpSt = $('<input/>', {type: 'text'}).attr('readonly', true).addClass('input').appendTo(taskBlock);
	$('<h5/>', {text: 'Task Priority'}).appendTo(taskBlock);
	const inpPr = $('<input/>', {type: 'text'}).attr('readonly', true).addClass('input').appendTo(taskBlock);
	props.statuses.forEach(item => {
		if (item.id === statusId) {
			statusName = item.status;
		}
	});
	props.priorities.forEach(item => {
		if (item.id === priorityId) {
			priorityName = item.priority;
		}
	});
	$(inpSt).val(statusName);
	$(inpPr).val(priorityName);
}

const removeTask = event => {
	const id = event.target.dataset.id;
	const name = event.target.dataset.name;
	const questionBlock = $('#wrapper').html('').append($('<div/>', {id: 'question-block'}));
	$('<h2/>', {text: `Remove task ${name}`}).appendTo(questionBlock);
	$('<button/>', {'data-id': id, text: 'Yes'}).click(confirmRemove).appendTo(questionBlock);
	$('<button/>', {'data-id': id, text: 'No'}).click(notConfirmRemove).appendTo(questionBlock);
}

const notConfirmRemove = () => {
	showTasksBoard();
}

const confirmRemove = event => {
	const id = parseInt(event.target.dataset.id);
	const tasks = JSON.parse(localStorage.getItem('tasks'));

	const tasksWithOutRemoved = [];
	tasks.find(function (task) {
		if (task.taskId !== id) {
			tasksWithOutRemoved.push(task);
		}
	})
	localStorage.setItem('tasks', JSON.stringify(tasksWithOutRemoved));
	showTasksBoard();
}

const editTask = event => {
	const id = parseInt(event.target.dataset.id);
	const wrapper = $('#wrapper');
	wrapper.html('').append($('<div/>', {id: 'edit-block'}));
	const tasks = JSON.parse(localStorage.getItem('tasks'));
	const task = tasks.find(task => {
		if (task.taskId === id) {
			return task;
		}
	});
	createFormForEditAndSetFields(task, '#edit-block');
}

const createFormForEditAndSetFields = (task, block) => {
	const {taskName: myTaskName, taskId: myTaskId} = task;

	fetch('priorities-and-statuses.json')
			.then(res => {
				return res.json();
			})
			.then(props => {
				createForm(block, 'Edit', `Edit task ${myTaskName}`);
				$('#task-name').val(myTaskName);
				setSelects(task, props);
				$('<button/>', {id: 'edit-btn-save', 'data-id': myTaskId, text: 'Save'}).click(saveTask).appendTo(block);
			})
}

const createForm = (block, action, title) => {
	$('<h2/>', {text: title}).appendTo(block);
	$('<div/>', {text: 'Task Name'}).appendTo(block);
	$('<input/>', {type: 'text', id: 'task-name'}).appendTo(block);
	$('<div/>', {text: 'Task Status'}).appendTo(block);
	$('<select/>', {id: 'select-status'}).appendTo(block);
	$('<div/>', {text: 'Task Priority'}).appendTo(block);
	$('<select/>', {id: 'select-priority'}).appendTo(block);
}

const setSelects = (task, props) => {
	const statusSelector = $('#select-status');
	const prioritySelector = $('#select-priority');
	props.statuses.forEach(status => {
		const option = $('<option/>', {value: status.id, text: status.status})
		statusSelector.append(option);
		if (task && task.statusId === status.id) {
			$(option).attr('selected', true);
		}
	});
	props.priorities.forEach(priority => {
		const option = $('<option/>', {value: priority.id, text: priority.priority});
		prioritySelector.append(option);
		if (task && task.priorityId === priority.id) {
			$(option).attr('selected', true);
		}
	})
}


const saveTask = event => {
	const id = parseInt(event.target.dataset.id);
	const tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.find(task => {
		if (task.taskId === id) {
			task.taskName = $('#task-name').val();
			task.statusId = parseInt($('#select-status').val());
			task.priorityId = parseInt($('#select-priority').val());
		}
	});
	localStorage.setItem('tasks', JSON.stringify(tasks));
	showTasksBoard();
}