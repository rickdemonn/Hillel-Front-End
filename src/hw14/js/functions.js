"use strict";

function appStart() {
	const selector = '#wrapper';
	$(selector).html('');
	showButtons(selector);
	if (checkStorage()) {
		localStorage.setItem('cars', JSON.stringify(cars));
		localStorage.setItem('users', JSON.stringify(users));
		localStorage.setItem('companies', JSON.stringify(companies));
	}
}

function checkStorage() {
	return !localStorage.getItem('cars') ||
			!localStorage.getItem('users') ||
			!localStorage.getItem('companies');
}

function showButtons(selector) {
	for (let i = 0; i < buttons.length; i++) {
		$(selector).append($('<button/>', {
			id: buttons[i].btnId,
			value: buttons[i].value,
			name: buttons[i].name,
			type: 'button',
			text: buttons[i].value,
			'data-id': buttons[i].dataId,
		}).click(showElementBlock));
	}
}

function showElementBlock(event, nameFromOtherResource) {
	let name = event.currentTarget.name;
	if (name === 'undefined' || name === '') {
		name = nameFromOtherResource;
	}
	const idSelector = '#' + name;
	const wrapSelector = '#wrapper';
	$(wrapSelector).html('');

	showButtons(wrapSelector);

	$('<div/>', {
		id: name,
	}).appendTo(wrapSelector);

	$('<h2/>', {
		id: 'title',
		text: name
	}).appendTo(idSelector);

	const elementsFromLocalStorage = JSON.parse(localStorage.getItem(name));

	setObjsToShowFromLocalStorage(elementsFromLocalStorage, idSelector, name);
}

function setObjsToShowFromLocalStorage(elements, idSelector, name) {
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		$(createObjWithButtons(element)).appendTo(idSelector);
	}
	$('<button/>', {
		name: name,
		type: 'button',
		text: 'Create ' + name,
	}).click(createObj).appendTo(idSelector);
}

function createObjWithButtons(element) {
	const nameOrModel = element.name || element.model;

	const userWithButtonsBlockSelector = $('<div/>', {'class': 'element'});

	$('<div>', {text: nameOrModel}).appendTo(userWithButtonsBlockSelector);

	createBtnForObjBlock('btn-view', 'View', element.id, handleViewClick, userWithButtonsBlockSelector);
	createBtnForObjBlock('btn-edit', 'Edit', element.id, handleEditClick, userWithButtonsBlockSelector);
	createBtnForObjBlock('btn-remove', 'Remove', element.id, handleRemoveClick, userWithButtonsBlockSelector);

	return userWithButtonsBlockSelector;
}

function createBtnForObjBlock(id, text, elementId, handler, elementToAppend) {
	$('<button/>', {
		id: id,
		type: 'button',
		text: text,
		'data-id': elementId,
	}).click(handler).appendTo(elementToAppend);
}

function handleViewClick(event) {
	$('#form').remove();
	const selectedElement = getSelectedObjForHandler(event);
	showViewForm(selectedElement);
}


function handleEditClick(event) {
	$('#form').remove();
	const selectedElement = getSelectedObjForHandler(event);
	showObjEditForm(selectedElement);
}

function showViewForm(objElement) {
	const nameOrModel = objElement.name || objElement.model;

	const viewUserTitleSelector = $('<h2/>', {id: 'view-' + objElement + '-title', text: nameOrModel + '`s Info'})

	const form = createFormForObj(viewUserTitleSelector, objElement);

	setFormFields(form, objElement);

	$(form).find('[id=btn-save]').addClass('hidden');
	$(form).children().attr("readonly", true);

	$('#wrapper').append(form);
}

function createFormForObj(titleSelector, objElement, clickHandler, objName, objId) {
	const form = $('<form/>', {id: 'form'});
	if (titleSelector) {
		$(titleSelector).appendTo(form);
	}

	for (let index in objElement) {
		$('<div/>', {html: [index + '']}).appendTo(form);
		$(createInput(index + '')).appendTo(form);
	}

	$('<input/>', {id: 'btn-save', type: 'button', value: 'Save', 'data-id': objId, 'name': objName})
			.click(clickHandler).appendTo(form);

	return form;
}

function createInput(name) {
	return $('<input/>', {type: 'text', name: name});
}

function setFormFields(form, objElement) {
	for (let index in objElement) {
		if (!isEmpty(objElement[index + ''])) {
			$(form).find('[name=' + index + ']').val(objElement[index + '']);
		}
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
	const wrapSelector = '#wrapper';
	$(wrapSelector).html('');

	showButtons(wrapSelector);
	const elementName = event.target.parentNode.parentElement.id;
	const objId = event.target.getAttribute('data-id');
	const objs = JSON.parse(localStorage.getItem(elementName));
	const obj = objs.find(function (obj) {
		if (obj.id === objId) {
			return obj;
		}
	})
	const nameOrModel = obj.name || obj.model;

	$('<div/>', {id: 'confirm-remove-block'})
			.append($('<h2/>', {text: 'Remove object : ' + nameOrModel + ' ?'}))
			.append($('<button/>', {name: elementName, 'data-id': objId, text: 'yes', type: 'button'}).click(handleConfirmRemoveClick))
			.append($('<button/>', {name: elementName,'data-id': objId, text: 'no', type: 'button'}).click(handleDoNotConfirmRemoveClick))
			.appendTo(wrapSelector);
}

function createObj(event) {
	$('#form').remove();
	const objName = event.target.parentNode.id;
	const objs = JSON.parse(localStorage.getItem(objName));
	let maxId = 1;
	objs.find(function (obj) {
		const idInNum = parseInt(obj.id);
		if (idInNum > maxId) {
			maxId = idInNum;
		}
	});
	let objElem = objs[0];
	if (objs.length === 0) {
		if (objName === 'users') {
			objElem = users[0];
		} else if (objName === 'cars') {
			objElem = cars[0];
		} else {
			objElem = companies[0];
		}
	}
	const autoGeneratedId = maxId + 1 + '';
	const createObjTitleSelector = $('<h2/>', {text: 'Create New element in ' + objName});
	const form = createFormForObj(createObjTitleSelector, objElem, handleSaveNewUser, objName);
	$(form).find('[name=id]').val(autoGeneratedId).attr("readonly", true);
	$(form).appendTo('#wrapper');
}

function handleSaveNewUser(event) {
	const form = event.target.parentNode;
	const objName = $(form).find('[id=btn-save]').attr('name');
	const objs = JSON.parse(localStorage.getItem(objName));

	const isMistake = validate(form, objName);

	if (!isMistake) {
		let newObj;
		if (objName === 'users') {
			newObj = new User(form.elements[0].value,
					form.elements[1].value,
					form.elements[2].value,
					form.elements[3].value,
					form.elements[4].value,
					form.elements[5].value,
					form.elements[6].value,
					form.elements[7].value
			);
		}

		if (objName === 'cars') {
			newObj = new Car(form.elements[0].value,
					form.elements[1].value,
					form.elements[2].value,
					form.elements[3].value,
					form.elements[4].value
			);
		}

		if (objName === 'companies') {
			newObj = new Company(form.elements[0].value,
					form.elements[1].value,
					form.elements[2].value,
					form.elements[3].value
			);
		}
		objs.push(newObj);
		localStorage.setItem(objName, JSON.stringify(objs));
		showElementBlock(event, objName);
	}
}

function validate(form, objName) {
	const idPattern = /^\d{1,}$/;
	const namePattern = /[A-Z][a-z]{1,} [A-Z][a-z]{1,}/;
	const nameCompany = /[A-Za-z]{1,}/;
	const agePattern = /^\d{1,2}$/;
	const mailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	const phonePattern = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
	const cardPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
	const balancePattern = /^\d{1,}$/;
	const pricePattern = /^\d{1,}$/;
	const modelPattern = /w{1,}/;
	const isInGaragePattern = /w{4,5}/;
	const ownerPattern = /w{1,}/;

	// const patterns = {
	// 	id: /^\d{1,}$/,
	// 	name: /[A-Z][a-z]{1,} [A-Z][a-z]{1,}/,
	// 	compName: /[A-Za-z]{1,}/,
	// 	age: /^\d{1,2}$/,
	// 	mail: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
	// 	phone: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
	// 	card: /^\d{4}-\d{4}-\d{4}-\d{4}$/,
	// 	balance: /^\d{1,}$/,
	// 	price: /^\d{1,}$/,
	// 	model: /w{1,}/,
	// 	isInGarage: /w{4,5}/,
	// 	owner: /w{1,}/,
	// } //TODO

	const validationsUser = {
		id: function (field) {
			return idPattern.test(field.value);
		},
		name: function (field) {
			return namePattern.test(field.value);
		},
		age: function (field) {
			return agePattern.test(field.value);
		},
		mail: function (field) {
			return mailPattern.test(field.value);
		},
		phone: function (field) {
			return phonePattern.test(field.value);
		},
		card: function (field) {
			return cardPattern.test(field.value);
		},
		balance: function (field) {
			return balancePattern.test(field.value);
		},
		cars: function (field) {
			return true;
		}
	}

	const validationsCar = {
		id: function (field) {
			return idPattern.test(field.value);
		},
		name: function (field) {
			return modelPattern.test(field.value);
		},
		age: function (field) {
			return isInGaragePattern.test(field.value);
		},
		mail: function (field) {
			return pricePattern.test(field.value);
		},
		phone: function (field) {
			return ownerPattern.test(field.value);
		}
	}

	const validationsCompany = {
		id: function (field) {
			return idPattern.test(field.value);
		},
		name: function (field) {
			return nameCompany.test(field.value);
		},
		cars: function (field) {
			return true;
		},
		balance: function (field) {
			return balancePattern.test(field.value);
		}
	}
	let isMistake = false;

	let validations;
	let validationDelta;
	if (objName === 'users') {
		validations = validationsUser;
		validationDelta = 2;
	} else if (objName === 'cars') {
		validations = validationsCar;
		validationDelta = 1;
	} else {
		validations = validationsCompany;
		validationDelta = 2;
	}

	for (let i = 0; i < form.elements.length - validationDelta; i++) {
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
	const id = event.target.getAttribute('data-id');
	const form = event.target.parentNode;
	const objName = event.target.parentNode.previousSibling.id;
	const objs = JSON.parse(localStorage.getItem(objName));
	const isMistake = validate(form);
	const isUniqId = checkUniqIdForUpdate(form, objs, id);
	if (!isMistake && isUniqId) {
		let fields = {};
		// 	objs.find(function (obj) {
		// 		if (obj.id === id) {
		// 			console.log(obj);
		// 			$(form).find('[type=text]').each(item => {
		// 							fields[item.name] = $(item).val();
		// 						});
		// 						obj = {fields: fields};
		// 		}
		// 	});
		// }
		// localStorage.setItem(objName, JSON.stringify(objs));
		// showElementBlock(event, objName);//TODO

		if (objName === 'users') {
			objs.find(function (user) {
				if (user.id === id) {
					user.id = form.elements.id.value;
					user.name = form.elements.name.value;
					user.age = form.elements.age.value;
					user.mail = form.elements.mail.value;
					user.phone = form.elements.phone.value;
					user.card = form.elements.card.value;
					user.balance = form.elements.balance.value;
					user.cars = form.elements.cars.value;
				}
			});

			localStorage.setItem('users', JSON.stringify(objs));
			showElementBlock(event, 'users');
		}
		if (objName === 'cars') {
			objs.find(function (car) {
				if (car.id === id) {
					car.id = form.elements.id.value;
					car.model = form.elements.model.value;
					car.isInGarage = form.elements.isInGarage.value;
					car.price = form.elements.price.value;
					car.owner = form.elements.owner.value;
				}
			});
			localStorage.setItem('cars', JSON.stringify(objs));
			showElementBlock(event, 'cars');
		}
		if (objName === 'companies') {
			objs.find(function (company) {
				if (company.id === id) {
					company.id = form.elements.id.value;
					company.name = form.elements.name.value;
					company.cars = form.elements.cars.value;
					company.balance = form.elements.balance.value;
				}
			});
			localStorage.setItem('companies', JSON.stringify(objs));
			showElementBlock(event, 'companies');
		}
	}
}

function checkUniqIdForUpdate(form, objs, id) {
	let isUniqId = true;
	const formIdValue = form.elements.id.value;
	objs.find(function (obj) {
		if (formIdValue === obj.id && formIdValue !== id) {
			isUniqId = false;
			form.elements.id.classList.add('error');
		}
	});
	return isUniqId;
}

function handleDoNotConfirmRemoveClick(event) {
	const name = event.currentTarget.id;
	showElementBlock(event, name);
}

function handleConfirmRemoveClick(event) {
	const objId = event.target.getAttribute('data-id');
	const name = event.target.name;
	const objs = JSON.parse(localStorage.getItem(name));
	const newObjs = [];

	objs.find(function (obj) {
		if (obj.id !== objId) {
			newObjs.push(obj);
		}
	});

	localStorage.setItem(name, JSON.stringify(newObjs));
	showElementBlock(event, name);
}

function showObjEditForm(obj) {
	const objName = event.target.parentNode.parentNode.id;

	const nameOrModel = obj.name || obj.model;

	const EditUserTitleSelect = $('<h2/>', {id: 'view-user-title', text: nameOrModel + '`s Edit Form'});

	const form = createFormForObj(EditUserTitleSelect, obj, handlerSaveClick, objName, obj.id);

	setFormFields(form, obj);

	if (objName !== 'cars') {
		$('<button/>', {type: 'button', 'data-id': obj.id, 'data-name': objName, text: 'Buy Car'})
				.click(handleBuyCar).appendTo(form);
	}

	$('#wrapper').append(form);
}


function handleBuyCar(event) {
	const objsName = event.target.dataset.name;
	const objId = event.target.dataset.id;

	const cars = JSON.parse(localStorage.getItem('cars'));
	const carsBlock = $('<div/>', {id: 'cars-block'});

	cars.forEach(car => {
		if (car.isInGarage) {
			$(carsBlock).append(
					$('<div/>', {text: car.model + ' ' + car.price}).addClass('car-block').append(
							$('<button/>',
									{
										type: 'button',
										'data-id': car.id,
										'data-objid': objId,
										'data-objsname': objsName,
										text: 'select'
									}).click(handleSelectCarForBuy)
					)
			).appendTo('#wrapper');
		}
	});
}

function handleSelectCarForBuy(event) {
	const objsName = event.target.dataset.objsname;
	const objId = event.target.dataset.objid;
	const carId = event.target.dataset.id;
	const objs = JSON.parse(localStorage.getItem(objsName));
	const cars = JSON.parse(localStorage.getItem('cars'));

	const currentTargetObj = objs.find(obj => {
		if (obj.id === objId) {
			return obj;
		}
	});

	const currentTargetCar = cars.find(car => {
		if (car.id === carId) {
			return car;
		}
	});

	if (currentTargetObj.balance > currentTargetCar.price) {
		currentTargetObj.cars = currentTargetCar.model;
		currentTargetCar.isInGarage = false;
		currentTargetCar.owner = currentTargetObj.name;
		currentTargetObj.balance -= currentTargetCar.price;
		localStorage.setItem(objsName, JSON.stringify(objs));
		localStorage.setItem('cars', JSON.stringify(cars));
		showElementBlock(event, objsName);
	} else {
		$('<div/>', {text: 'No Money No Honey'}).appendTo('#wrapper');
	}

}

function isEmpty(obj) {
	for (let prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			return false;
		}
	}

	return JSON.stringify(obj) === JSON.stringify({});
}
