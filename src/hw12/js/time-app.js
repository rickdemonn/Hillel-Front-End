"use strict";
showClock();

function createImage(digit) {
	const img = document.createElement('img');
	img.setAttribute('src','clock-images/' + digit + '.png');
	img.className = 'clock-img';
	return img;
}

function showClock(){
	const date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

	hours = (hours < 10) ? '0' + hours : hours;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = (seconds < 10) ? '0' + seconds : seconds;

	const firstDigitOfHours = parseInt(hours / 10);
	const secondDigitOfHours = parseInt(hours % 10);
	const firstDigitOfMinutes = parseInt(minutes / 10);
	const secondDigitOfMinutes = parseInt(minutes % 10);
	const firstDigitOfSeconds = parseInt(seconds / 10);
	const secondDigitOfSeconds = parseInt(seconds % 10);

	const doubleDotsImgName = 'dots';

	const clock = document.getElementById("clock");
	clock.innerHTML = '';

	clock.appendChild(createImage(firstDigitOfHours));
	clock.appendChild(createImage(secondDigitOfHours));
	clock.appendChild(createImage(doubleDotsImgName));
	clock.appendChild(createImage(firstDigitOfMinutes));
	clock.appendChild(createImage(secondDigitOfMinutes));
	clock.appendChild(createImage(doubleDotsImgName));
	clock.appendChild(createImage(firstDigitOfSeconds));
	clock.appendChild(createImage(secondDigitOfSeconds));

	setTimeout(showClock, 1000);
}