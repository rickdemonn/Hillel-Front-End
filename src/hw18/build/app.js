'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var startSendButtonListener = function startSendButtonListener() {
	$('#send-btn').click(sendButtonListener);
};

var sendButtonListener = function sendButtonListener() {
	var textField = $('#text-field');
	var message = textField.val();
	textField.text('');
	if (!message) {
		return;
	}

	$('<div/>', { text: message }).addClass('user-block').appendTo($('#wrapper'));

	startBot();
};

var startBot = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		var messages, answer;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return fetch('answers.json').then(function (response) {
							return response.json();
						});

					case 2:
						messages = _context.sent;
						_context.next = 5;
						return createAnswer(messages);

					case 5:
						answer = _context.sent;
						_context.t0 = $('#wrapper');
						_context.next = 9;
						return answer;

					case 9:
						_context.t1 = _context.sent;

						_context.t0.append.call(_context.t0, _context.t1);

					case 11:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function startBot() {
		return _ref.apply(this, arguments);
	};
}();

var createAnswer = function createAnswer(messages) {
	var botBlock = $('<div/>').addClass('bot-block');
	setTimeout(function () {
		botBlock.text(messages[rand(1, 2)]);
	}, rand(1, 5) * 1000);
	return botBlock;
};

var rand = function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

startSendButtonListener();