'use strict';

var start = function start(tasks) {
	if (!localStorage.getItem('tasks')) {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}
	showTasksBoard();
};

var showTasksBoard = function showTasksBoard() {
	var wrap = $('#wrapper').html('');
	$('<button/>', { id: 'create-task', text: 'Create new Task' }).click(createNewTask).appendTo(wrap);
	$(wrap).append($('<div/>', { id: 'tasks' }));
	var tasks = JSON.parse(localStorage.getItem('tasks'));
	sendRequest(tasks);
};

var sendRequest = function sendRequest(tasks) {
	fetch('priorities-and-statuses.json').then(function (res) {
		return res.json();
	}).then(function (res) {
		tasks.forEach(function (task) {
			return createTaskBlock(task, res);
		});
	});
};

var createNewTask = function createNewTask() {
	var wrap = $('#wrapper').html('');
	var newBlock = $('<div/>', { id: 'new-block' }).appendTo(wrap);
	fetch('priorities-and-statuses.json').then(function (res) {
		return res.json();
	}).then(function (props) {
		createForm(newBlock, 'New', 'Create new Task');
		setSelects(null, props);
		$('<button/>', { id: 'new-btn-save', text: 'Save' }).click(saveNewTask).appendTo(newBlock);
	});
};

var saveNewTask = function saveNewTask() {
	var tasks = JSON.parse(localStorage.getItem('tasks'));
	var maxId = 0;
	tasks.forEach(function (task) {
		if (task.taskId > maxId) {
			maxId = task.taskId;
		}
	});
	var taskName = $('#task-name').val();
	var statusId = parseInt($('#select-status option:selected').val());
	var priorityId = parseInt($('#select-priority option:selected').val());
	var newTask = new TodoTask(++maxId, taskName, statusId, priorityId);
	tasks.push(newTask);
	localStorage.setItem('tasks', JSON.stringify(tasks));
	showTasksBoard();
};

var createTaskBlock = function createTaskBlock(task, props) {
	var taskId = task.taskId,
	    taskName = task.taskName,
	    statusId = task.statusId,
	    priorityId = task.priorityId;


	var taskBlock = $('<div/>', { 'data-id': taskId }).addClass('task');
	$('<h5/>', { text: 'Task Name' }).appendTo(taskBlock);
	$('<input/>', { type: 'text', value: taskName }).attr('readonly', true).addClass('input').appendTo(taskBlock);

	setFieldOfTask(statusId, priorityId, taskBlock, props);

	var buttonsOfTaskBlock = $('<div/>').addClass('taskButtons').css('display', 'flex').appendTo(taskBlock);
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
};

var setFieldOfTask = function setFieldOfTask(statusId, priorityId, taskBlock, props) {
	var statusName = 'Not Defined';
	var priorityName = 'Not Defined';
	$('<h5/>', { text: 'Task Status' }).appendTo(taskBlock);
	var inpSt = $('<input/>', { type: 'text' }).attr('readonly', true).addClass('input').appendTo(taskBlock);
	$('<h5/>', { text: 'Task Priority' }).appendTo(taskBlock);
	var inpPr = $('<input/>', { type: 'text' }).attr('readonly', true).addClass('input').appendTo(taskBlock);
	props.statuses.forEach(function (item) {
		if (item.id === statusId) {
			statusName = item.status;
		}
	});
	props.priorities.forEach(function (item) {
		if (item.id === priorityId) {
			priorityName = item.priority;
		}
	});
	$(inpSt).val(statusName);
	$(inpPr).val(priorityName);
};

var removeTask = function removeTask(event) {
	var id = event.target.dataset.id;
	var name = event.target.dataset.name;
	var questionBlock = $('#wrapper').html('').append($('<div/>', { id: 'question-block' }));
	$('<h2/>', { text: 'Remove task ' + name }).appendTo(questionBlock);
	$('<button/>', { 'data-id': id, text: 'Yes' }).click(confirmRemove).appendTo(questionBlock);
	$('<button/>', { 'data-id': id, text: 'No' }).click(notConfirmRemove).appendTo(questionBlock);
};

var notConfirmRemove = function notConfirmRemove() {
	showTasksBoard();
};

var confirmRemove = function confirmRemove(event) {
	var id = parseInt(event.target.dataset.id);
	var tasks = JSON.parse(localStorage.getItem('tasks'));

	var tasksWithOutRemoved = [];
	tasks.find(function (task) {
		if (task.taskId !== id) {
			tasksWithOutRemoved.push(task);
		}
	});
	localStorage.setItem('tasks', JSON.stringify(tasksWithOutRemoved));
	showTasksBoard();
};

var editTask = function editTask(event) {
	var id = parseInt(event.target.dataset.id);
	var wrapper = $('#wrapper');
	wrapper.html('').append($('<div/>', { id: 'edit-block' }));
	var tasks = JSON.parse(localStorage.getItem('tasks'));
	var task = tasks.find(function (task) {
		if (task.taskId === id) {
			return task;
		}
	});
	createFormForEditAndSetFields(task, '#edit-block');
};

var createFormForEditAndSetFields = function createFormForEditAndSetFields(task, block) {
	var myTaskName = task.taskName,
	    myTaskId = task.taskId;


	fetch('priorities-and-statuses.json').then(function (res) {
		return res.json();
	}).then(function (props) {
		createForm(block, 'Edit', 'Edit task ' + myTaskName);
		$('#task-name').val(myTaskName);
		setSelects(task, props);
		$('<button/>', { id: 'edit-btn-save', 'data-id': myTaskId, text: 'Save' }).click(saveTask).appendTo(block);
	});
};

var createForm = function createForm(block, action, title) {
	$('<h2/>', { text: title }).appendTo(block);
	$('<div/>', { text: 'Task Name' }).appendTo(block);
	$('<input/>', { type: 'text', id: 'task-name' }).appendTo(block);
	$('<div/>', { text: 'Task Status' }).appendTo(block);
	$('<select/>', { id: 'select-status' }).appendTo(block);
	$('<div/>', { text: 'Task Priority' }).appendTo(block);
	$('<select/>', { id: 'select-priority' }).appendTo(block);
};

var setSelects = function setSelects(task, props) {
	var statusSelector = $('#select-status');
	var prioritySelector = $('#select-priority');
	props.statuses.forEach(function (status) {
		var option = $('<option/>', { value: status.id, text: status.status });
		statusSelector.append(option);
		if (task && task.statusId === status.id) {
			$(option).attr('selected', true);
		}
	});
	props.priorities.forEach(function (priority) {
		var option = $('<option/>', { value: priority.id, text: priority.priority });
		prioritySelector.append(option);
		if (task && task.priorityId === priority.id) {
			$(option).attr('selected', true);
		}
	});
};

var saveTask = function saveTask(event) {
	var id = parseInt(event.target.dataset.id);
	var tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.find(function (task) {
		if (task.taskId === id) {
			task.taskName = $('#task-name').val();
			task.statusId = parseInt($('#select-status').val());
			task.priorityId = parseInt($('#select-priority').val());
		}
	});
	localStorage.setItem('tasks', JSON.stringify(tasks));
	showTasksBoard();
};