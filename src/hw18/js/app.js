const url = 'answers.json';

const startSendButtonListener = () => {
	$('#send-btn').click(sendButtonListener);
}

const intervalForGoodBue = setInterval(() => {
	const rnd = rand(1, 100);
	if (rnd > 50 && rnd < 55) {
		const textField = $('#text-field');
		const wrap = $('#wrapper');
		goodBue(textField, wrap);
		clearInterval(intervalForGoodBue);
	}
}, 3000);

const sendButtonListener = () => {
	const textField = $('#text-field');
	const message = textField.val();
	textField.val('');

	const wrap = $('#wrapper');

	const userBlock = $('<div/>', {text: message}).addClass('user-block');

	if (!message) {
		return;
	} else if (message === 'My watch has ended') {
		goodBue(textField, wrap, userBlock);
		clearInterval(intervalForGoodBue);
		return;
	}

	userBlock.appendTo(wrap);
	wrap.stop().animate({
		scrollTop: wrap[0].scrollHeight
	}, 800);

	startBot().then(block => {
		wrap.append(block);
	});
}

const startBot = async () => {
	const messages = await fetch('answers.json')
			.then(response => response.json());
	return await createAnswer(messages);
}

const createAnswer = messages => {
	const wrap = $('#wrapper');
	return new Promise(done => {
		const botBlock = $('<div/>').addClass('bot-block');
		setTimeout(() => {
			done(botBlock.text(messages[rand(1, 10)]));
			wrap.stop().animate({
				scrollTop: wrap[0].scrollHeight
			}, 800);
		}, rand(1, 5) * 1000);
		return botBlock;
	});
}

const rand = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const goodBue = (textField, wrap, userBlock) => {
	textField.attr('readonly', true);
	$('#send-btn').prop('disabled', true);

	if (userBlock) {
		userBlock.text('My watch has ended').appendTo(wrap);
		wrap.stop().animate({
			scrollTop: wrap[0].scrollHeight
		}, 800);
	}

	setTimeout(() => {
		fetch(url)
				.then(res => res.json())
				.then(messages => {
					$('<div/>', {text: messages[0]}).addClass('bot-block').appendTo(wrap);
					wrap.stop().animate({
						scrollTop: wrap[0].scrollHeight
					}, 800);
				});
	}, 2000);
}

startSendButtonListener();
