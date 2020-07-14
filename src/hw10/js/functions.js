'use strict';
function checkFormToDelete() {
    const form = document.getElementById('form');
    if (form) {
        form.remove();
    }
}

function handleCategoryClick(event) {
    checkFormToDelete();
    event.preventDefault();
    const categoryId = event.target.getAttribute('data-id');

    const selectedCategory = categories.find(function (category) {
        return category.id === categoryId;
    });

    const products = selectedCategory.items;
    showProducts(products, categoryId);
}

function handleProductClick(event) {
    checkFormToDelete();
    event.preventDefault();
    const productId = event.target.getAttribute('data-id');
    const categoryId = event.target.getAttribute('data-category-id');

    const selectedCategory = categories.find(function (category) {
        return category.id === categoryId;
    });

    const selectedProduct = selectedCategory.items.find(function (product) {
        return product.id === productId;
    });

    showProduct(selectedProduct);
}

function showItems(items, parentId, clickHandler, additionalAttributes) {
    const parent = document.getElementById(parentId);
    parent.innerHTML = '';

    const title = document.createElement('h2');
    title.innerHTML = 'Choose Item';
    parent.appendChild(title);
    for (let i = 0; i < items.length; i++) {
        const element = document.createElement('a');
        element.setAttribute('href', items[i].id);
        element.innerText = items[i].name;
        element.setAttribute('data-id', items[i].id);

        if (additionalAttributes && additionalAttributes.length) {
            for (let j = 0; j < additionalAttributes.length; j++) {
                element.setAttribute(additionalAttributes[j].key, additionalAttributes[j].value);
            }
        }

        element.addEventListener('click', clickHandler);

        parent.appendChild(element);
    }
}

function showCategories() {
    showItems(categories, 'categories', handleCategoryClick);
}

function showProducts(items, categoryId) {
    const attributes = [
        {
            key: 'data-category-id',
            value: categoryId,
        }
    ];
    showItems(items, 'products', handleProductClick, attributes);
    document.getElementById('info').innerHTML = '';
}

function showProduct(product) {
    const parent = document.getElementById('info');
    parent.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = product.name;
    parent.appendChild(title);

    const price = document.createElement('div');
    price.textContent = '$' + product.price;
    parent.appendChild(price);

    const buyButton = document.createElement('input');
    buyButton.setAttribute('type', 'button');
    buyButton.setAttribute('id', 'buy-btn');
    buyButton.setAttribute('value', 'Buy');
    buyButton.addEventListener('click', function () {
        wrapper.appendChild(createFormBySelectedProductForBuy(product));
    });
    parent.appendChild(buyButton);
}

function createFormBySelectedProductForBuy(selectedProduct) {
    const form = createElementWithAttribute('form', 'name', 'form');
    form.setAttribute('id', 'form');
    const formTitle = createElementWithAttribute('h2', 'id', 'form-title');
    formTitle.innerHTML = 'Form to buy ' + selectedProduct.name;
    form.appendChild(formTitle);

    form.appendChild(createInputTextField('Enter your Fio * ', 'fio', 'Name & Last Name'));

    const cities = ['Odessa', 'Kiev', 'Chernigov'];
    form.appendChild(createCitySelectInput(cities));

    form.appendChild(createInputTextField('Enter post number * ', 'post', 'Number of Post unit'));

    form.appendChild(createRadios());

    const cost = document.createElement('div');
    form.appendChild(createCountField(selectedProduct, cost));

    form.appendChild(createComment());

    const formButton = createElementWithAttribute('button', 'type', 'button');
    formButton.setAttribute('id', 'form-button');
    formButton.innerHTML = 'Buy';

    formButton.addEventListener('click', function () {
        let isMistake = false;

        if (form.elements.fio.value === '') {
            form.elements.fio.className = 'error';
            isMistake = true;
        } else {
            form.elements.fio.className = '';
        }

        if (form.elements.city.value === '0') {
            form.elements.city.className = 'error';
            isMistake = true;
        } else {
            form.elements.city.className = '';
        }

        if (form.elements.post.value === '') {
            form.elements.post.className = 'error';
            isMistake = true;
        } else {
            form.elements.post.className = '';
        }

        const valueOfCountProduct = form.elements['count-of-product'].value;
        if (valueOfCountProduct === '' || isNaN(valueOfCountProduct) || parseInt(valueOfCountProduct) < 1) {
            form.elements['count-of-product'].className = 'error';
            isMistake = true;
        } else {
            form.elements['count-of-product'].className = '';
        }

        const radios = document.getElementById('radios');
        if (form.elements['pay-method'].value === '') {
            radios.className = 'error';
            isMistake = true;
        } else {
            radios.className = '';
        }

        if (!isMistake) {
            wrapper.innerHTML = '';
            const result = createElementWithAttribute('div', 'id', 'result');
            result.style.backgroundColor = 'chartreuse';
            result.style.margin = '0 auto';
            result.innerHTML = 'You buy ' + selectedProduct.name + ' in quantity: '
                + form.elements['count-of-product'].value + ' successfully!';
            //send to server request
            wrapper.appendChild(result);
        }
    });

    form.appendChild(cost);
    form.appendChild(formButton);

    return form;
}

function createElementWithAttribute(element, attribute, value) {
    const newElement = document.createElement(element);
    newElement.setAttribute(attribute, value);
    return newElement;
}

function createRadios() {
    const radios = createElementWithAttribute('div', 'id', 'radios');
    radios.appendChild(createRadio('N', 'Nal Pay'));
    radios.appendChild(createRadio('O', 'Online pay'));
    return radios;
}

function createInputTextField(innerText, name, placeholder) {
    const fioWrap = document.createElement('div');
    fioWrap.innerText = innerText;
    const fio = createElementWithAttribute('input', 'type', 'text');
    fio.setAttribute('name', name);
    fio.setAttribute('placeholder', placeholder);
    fioWrap.appendChild(fio);
    return fioWrap;
}

function createCitySelectInput(cities) {
    const cityWrap = document.createElement('div');
    cityWrap.innerText = 'Choose your city * ';

    const city = createElementWithAttribute('select', 'name', 'city');
    const defaultCity = createElementWithAttribute('option', 'value', '0');
    defaultCity.innerHTML = '---select city---';
    city.appendChild(defaultCity);

    for (let i = 0; i < cities.length; i++) {
        const currentCity = createElementWithAttribute('option', 'value', cities[i]);
        currentCity.innerHTML = cities[i];
        city.appendChild(currentCity);
    }

    cityWrap.appendChild(city);
    return cityWrap;
}

function createRadio(value, text) {
    const radio = document.createElement('div');
    const radioOption = createElementWithAttribute('input', 'type', 'radio');
    radioOption.setAttribute('name', 'pay-method');
    radioOption.setAttribute('value', value);
    radio.innerText = text;
    radio.appendChild(radioOption);
    return radio;
}

function createCountField(selectedProduct, cost) {
    const countWrap = document.createElement('div');
    countWrap.innerText = 'Enter count of products ';
    const countOfProduct = createElementWithAttribute('input', 'type', 'number');
    countOfProduct.setAttribute('name', 'count-of-product');
    countOfProduct.setAttribute('placeholder', 'count of product');
    countOfProduct.setAttribute('value', '1');
    countOfProduct.addEventListener('input', function () {
        cost.innerText = 'Price is ' + selectedProduct.price * countOfProduct.value;
    });
    countWrap.appendChild(countOfProduct);
    return countWrap;
}

function createComment() {
    const commentWrap = document.createElement('div');
    commentWrap.innerText = 'Your Comment ';
    const comment = createElementWithAttribute('textarea', 'name', 'comment');
    commentWrap.appendChild(comment);
    return commentWrap;
}