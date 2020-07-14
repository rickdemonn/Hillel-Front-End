"use strict";
function appStart() {
	const wrap = document.getElementById('wrapper');
	wrap.appendChild(createButton('btn-users', 'Show Users', '1', showElementBlock, users, 'users'));
	wrap.appendChild(createButton('btn-companies', 'Show Companies', '2', showElementBlock, companies, 'companies'));
	wrap.appendChild(createButton('btn-cars', 'Show Cars', '3', showElementBlock, cars, 'cars'));
}

function showElementBlock(event) {
	const name = event.currentTarget.name;
	const obj = event.currentTarget.obj;
	checkElementToRemove('users');
	checkElementToRemove('cars');
	checkElementToRemove('companies');
	checkElementToRemove('form');
	checkElementToRemove('confirm-remove-block');
	const wrap = document.getElementById('wrapper');
	const block = createElement('div', [{name: 'id', value: name}]);
	const title = createElement('h2', [{name: 'id', value: 'title'}], name.toUpperCase());
	block.appendChild(title);

	if (!localStorage.getItem(name)) {
		localStorage.setItem(name, JSON.stringify(obj));
	}

	const elementsFromLocalStorage = JSON.parse(localStorage.getItem(name));

	for (let i = 0; i < elementsFromLocalStorage.length; i++) {
		const element = elementsFromLocalStorage[i];
		block.appendChild(createObjWithButtons(element));
	}
	block.appendChild(createButton('create-' + name, 'Create ' + name, '', createUser));
	wrap.appendChild(block);
}


function createObjWithButtons(element) {
	const userWithButtonsBlock = createElement('div', [{name: 'class', value: 'element'}]);

	const nameOrModel = element.name || element.model;
	const userElem = createElement('div', null, nameOrModel);

	userWithButtonsBlock.appendChild(userElem);

	userWithButtonsBlock.appendChild(createButton('btn-view', 'View', element.id, handleViewClick));
	userWithButtonsBlock.appendChild(createButton('btn-edit', 'Edit', element.id, handleEditClick));
	userWithButtonsBlock.appendChild(createButton('btn-remove', 'Remove', element.id, handleRemoveClick));

	return userWithButtonsBlock;
}

function handleViewClick(event) {
	checkElementToRemove('form');
	const selectedElement = getSelectedObjForHandler(event);
	showViewForm(selectedElement);
}


function handleEditClick(event) {
	checkElementToRemove('form');
	const selectedElement = getSelectedObjForHandler(event);
	showObjEditForm(selectedElement);
}

function showViewForm(objElement) {
	const wrap = document.getElementById('wrapper');
	const nameOrModel = objElement.name || objElement.model;
	const viewUserTitle = createElement('h2',
			[{name: 'id', value: 'view-' + objElement + '-title'}],
			nameOrModel + '`s Info');

	const form = createFormForObj(viewUserTitle, objElement);

	setFormFields(form, objElement);

	form.elements['btn-save'].style.display = 'none';

	for (let i = 0; i < form.elements.length; i++) {
		form.elements[i].readOnly = true;
	}

	wrap.appendChild(form);
}

function createFormForObj(title, objElement, clickHandler) {
	const form = createElement('form', [{name: 'id', value: 'form'}], null);
	if (title) {
		form.appendChild(title);
	}

	for (let index in objElement) {
		form.appendChild(createElement('div', null, [index + '']));
		form.appendChild(createInput(index));
	}

	const nameOrModel = objElement.name || objElement.model;
	form.appendChild(createButton('btn-save', 'Save', nameOrModel, clickHandler));

	return form;
}

function setFormFields(form, objElement) {
	for (let index in objElement) {
		form.elements[index].value = objElement[index];
	}
}

function getSelectedObjForHandler(event) {
	const elemId = event.target.getAttribute('data-id');
	const elementName = event.target.parentNode.parentElement.id;
	const objElements = JSON.parse(localStorage.getItem(elementName));
	return objElements.find(function (objElement) {
		return objElement.id === elemId;
	});
}

function handleRemoveClick(event) {
	checkElementToRemove('users');
	checkElementToRemove('cars');
	checkElementToRemove('companies');
	checkElementToRemove('form');
	const elementName = event.target.parentNode.parentElement.id;
	const objId = event.target.getAttribute('data-id');
	const wrap = document.getElementById('wrapper');
	const objs = JSON.parse(localStorage.getItem(elementName));
	const obj = objs.find(function (obj) {
		if (obj.id === objId) {
			return obj;
		}
	})
	const nameOrModel = obj.name || obj.model;
	const removeObjTitle = createElement('h2', null, 'Remove object : ' + nameOrModel + ' ?');
	const confirmRemove = createElement('div', [{name: 'id', value: 'confirm-remove-block'}]);
	confirmRemove.appendChild(removeObjTitle);
	confirmRemove.appendChild(createButton('yes', 'yes', objId, handleConfirmRemoveClick, obj, name));
	confirmRemove.appendChild(createButton('no', 'no', objId, handleDoNotConfirmRemoveClick));
	wrap.appendChild(confirmRemove);
}

function createButton(btnId, value, dataId, handler, obj, name) {
	const attributes = [{
		name: 'data-id', value: dataId
	}, {
		name: 'type', value: 'button'
	}, {
		name: 'name', value: 'button'
	}, {
		name: 'value', value: value
	}, {
		name: 'id', value: btnId
	}];
	const btn = createElement('input', attributes, null);
	btn.obj = obj;
	btn.name = name;

	btn.addEventListener('click', handler);
	return btn;
}

function createUser() {
	checkElementToRemove('form');
	const users = JSON.parse(localStorage.getItem('users'));
	let maxId = 1;
	users.find(function (user) {
		const idInNum = parseInt(user.id);
		if (idInNum > maxId) {
			maxId = idInNum;
		}
	});
	const autoGeneratedId = maxId + 1 + '';
	const wrap = document.getElementById('wrapper');
	const createUserTitle = createElement('h2', null, 'Create New user');
	const form = createFormForObj(createUserTitle, autoGeneratedId, handleSaveNewUser);
	form.elements.userId.value = autoGeneratedId;
	form.elements.userId.readOnly = true;
	wrap.appendChild(form);
}

function handleSaveNewUser(event) {
	const form = event.target.parentNode;
	const users = JSON.parse(localStorage.getItem('users'));

	const isMistake = validate(form);

	if (!isMistake) {
		const newUser = {
			id: form.elements.userId.value,
			name: form.elements.userName.value,
			age: form.elements.userAge.value,
			mail: form.elements.userMail.value,
			phone: form.elements.userPhone.value,
			card: form.elements.userCard.value
		}
		users.push(newUser);
		localStorage.setItem('users', JSON.stringify(users));
		showElementBlock(users);
	}
}

function validate(form) {
	const idPattern = /^\d{1,}$/;
	const namePattern = /[A-Z][a-z]{1,} [A-Z][a-z]{1,}/;
	const agePattern = /^\d{1,2}$/;
	const mailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	const phonePattern = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
	const cardPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

	const validations = {
		userId: function (field) {
			return idPattern.test(field.value);
		},
		userName: function (field) {
			return namePattern.test(field.value);
		},
		userAge: function (field) {
			return agePattern.test(field.value);
		},
		userMail: function (field) {
			return mailPattern.test(field.value);
		},
		userPhone: function (field) {
			return phonePattern.test(field.value);
		},
		userCard: function (field) {
			return cardPattern.test(field.value);
		}
	}
	let isMistake = false;

	for (let i = 0; i < form.elements.length - 1; i++) {
		const field = form.elements[i];
		const validator = validations[field.name];
		if (validator && !validator(field)) {
			field.classList.add('error');
			isMistake = true;
		} else {
			field.classList.remove('error');
		}
	}

	return isMistake;
}

function handlerSaveClick(event) {
	const userId = event.target.getAttribute('data-id');
	const form = event.target.parentNode;
	const users = JSON.parse(localStorage.getItem('users'));
	const isMistake = validate(form);
	const isUniqId = checkUniqIdForUpdate(form, users, userId);
	if (!isMistake && isUniqId) {
		users.find(function (user) {
			if (user.id === userId) {
				user.id = form.elements.userId.value;
				user.name = form.elements.userName.value;
				user.age = form.elements.userAge.value;
				user.mail = form.elements.userMail.value;
				user.phone = form.elements.userPhone.value;
				user.card = form.elements.userCard.value;
			}
		});

		localStorage.setItem('users', JSON.stringify(users));
		showElementBlock(users);
	}
}

function checkUniqIdForUpdate(form, users, userId) {
	let isUniqId = true;
	const formIdValue = form.elements.userId.value;
	users.find(function (user) {
		if (formIdValue === user.id && formIdValue !== userId) {
			isUniqId = false;
			form.elements.userId.classList.add('error');
		}
	});
	return isUniqId;
}

function handleDoNotConfirmRemoveClick() {
	appStart();
}

function handleConfirmRemoveClick(event) {
	const objId = event.target.getAttribute('data-id');
	const objName = event.target.name;
	const objs = JSON.parse(localStorage.getItem(objName));
	const newObjs = [];

	objs.find(function (obj) {
		if (obj.id !== objId) {
			newObjs.push(obj);
		}
	});

	localStorage.setItem(objName, JSON.stringify(newObjs));
	showElementBlock(newObjs);
}


function checkElementToRemove(id) {
	const elem = document.getElementById(id);
	if (elem) {
		elem.remove();
	}
}

function showObjEditForm(user) {
	const wrap = document.getElementById('wrapper');

	const EditUserTitle = createElement('h2',
			[{name: 'id', value: 'view-user-title'}],
			user.name + '`s Edit Form');

	const form = createFormForObj(EditUserTitle, user.id, handlerSaveClick);

	setFormFields(form, user);

	wrap.appendChild(form);
}

function createInput(name) {
	const inputField = document.createElement('input');
	inputField.type = 'text';
	inputField.setAttribute('name', name);
	return inputField;
}

function createElement(element, attributes, innerHTML) {
	const newElement = document.createElement(element);
	if (attributes) {
		for (let i = 0; i < attributes.length; i++) {
			newElement.setAttribute(attributes[i].name, attributes[i].value);
		}
	}
	if (innerHTML) {
		newElement.innerHTML = innerHTML;
	}
	return newElement;
}
