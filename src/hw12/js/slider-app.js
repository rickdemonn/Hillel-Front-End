"use strict";
showSlider();

function showSlider() {
	let imageNumber = 1;
	const startNumOfImage = 1;
	const countOfImages = 5;
	const timeMs = 3000;

	const parent = document.getElementById('wrapper');

	const prevBtn = createBtn('prev-btn', 'PREV');

	const nextBtn = createBtn('next-btn', 'NEXT');

	const img = document.createElement('img');
	img.setAttribute('id', 'img');
	setImage(img, imageNumber);

	parent.appendChild(prevBtn);

	parent.appendChild(img);

	parent.appendChild(nextBtn);

	let myInterval = setInterval(nextImg, timeMs);

	prevBtn.addEventListener('click', function () {
		clearInterval(myInterval);
		imageNumber === startNumOfImage ? imageNumber = countOfImages : --imageNumber;
		setImage(img, imageNumber);
		myInterval = setInterval(nextImg, timeMs);
	});

	nextBtn.addEventListener('click', function () {
		clearInterval(myInterval);
		imageNumber === countOfImages ? imageNumber = startNumOfImage : ++imageNumber;
		setImage(img, imageNumber);
		myInterval = setInterval(nextImg, timeMs);
	});

	function nextImg() {
		imageNumber === countOfImages ? imageNumber = startNumOfImage : ++imageNumber;
		setImage(img, imageNumber);
	}
}

function setImage(elem, digit) {
	elem.setAttribute('src', 'images/' + digit + '.png');
}

function createBtn(id, text) {
	const btn = document.createElement('button');
	btn.setAttribute('id', id);
	btn.textContent = text;
	return btn;
}