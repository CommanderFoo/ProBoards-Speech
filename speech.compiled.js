// Speech prototype for ProBoards

// Babel used to compile to ES5

// Note:  If using on http, it will not remember the permission.
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Speech prototype for ProBoards
// Note:  If using on http, it will not remember the permission.
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html

var Speech = function () {
	function Speech() {
		_classCallCheck(this, Speech);

		if (typeof webkitSpeechRecognition == "undefined") {
			console.log("No support, sorry :(");
		} else {
			this.recognition = new webkitSpeechRecognition();
			this.gramma_list = new webkitSpeechGrammarList();

			this.recognition.lang = "en-GB"; // Should really get this from the agent
			this.recognition.continuous = true;
			this.recognition.interimResults = false;
			this.recognition.maxAlternatives = 1;
		}
	}

	// I don't think Chrome has support for gramma, I couldn't get it to work
	// even though the properties and methods exist.

	_createClass(Speech, [{
		key: "add_gramma",
		value: function add_gramma(gramma) {
			this.gramma_list.addFromString(gramma);
			this.recognition.grammas = this.gramma_list;
		}

		// All the events can be overwritten, I added them all in just for completeness :P

	}, {
		key: "start",
		value: function start() {
			this.recognition.onaudiostart = this.on_audio_start;
			this.recognition.onsoundstart = this.on_sound_start;
			this.recognition.onspeechstart = this.on_speech_start;
			this.recognition.onspeechend = this.on_speech_end;
			this.recognition.onsoundend = this.on_sound_end;
			this.recognition.onaudioend = this.on_audio_end;
			this.recognition.onresult = this.on_result;
			this.recognition.onnomatch = this.on_no_match;
			this.recognition.onerror = this.on_error;
			this.recognition.onstart = this.on_start;
			this.recognition.onend = this.on_end;

			this.recognition.start();
		}

		// User agent has started to capture audio

	}, {
		key: "on_audio_start",
		value: function on_audio_start(evt) {}

		// Sound has been detected

	}, {
		key: "on_sound_start",
		value: function on_sound_start(evt) {}

		// Speech recognition has started

	}, {
		key: "on_speech_start",
		value: function on_speech_start(evt) {}

		// Speech recognition has ended

	}, {
		key: "on_speech_end",
		value: function on_speech_end(evt) {}

		// Sound no longer detected

	}, {
		key: "on_sound_end",
		value: function on_sound_end(evt) {}

		// User agent has finished capturing audio

	}, {
		key: "on_audio_end",
		value: function on_audio_end(evt) {}

		// Speech recogniser returned a result

	}, {
		key: "on_result",
		value: function on_result(evt) {}

		//No recognition hypothesis that meet or exceed the confidence threshold

	}, {
		key: "on_no_match",
		value: function on_no_match(evt) {}

		// Speech recognition error

	}, {
		key: "on_error",
		value: function on_error(evt) {}

		// Recognition service has begun to listen to the audio with the intention of recognising

	}, {
		key: "on_start",
		value: function on_start(evt) {}

		// Service has been disconnected

	}, {
		key: "on_end",
		value: function on_end(evt) {}
	}]);

	return Speech;
}();

var ProBoards_Speech = function (_Speech) {
	_inherits(ProBoards_Speech, _Speech);

	function ProBoards_Speech() {
		_classCallCheck(this, ProBoards_Speech);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ProBoards_Speech).call(this));
	}

	_createClass(ProBoards_Speech, [{
		key: "listen",
		value: function listen() {
			this.start();
		}
	}, {
		key: "on_result",
		value: function on_result(event) {
			for (var i = event.resultIndex; i < event.results.length; i++) {
				if (event.results[i].isFinal) {
					if (parseFloat(event.results[i][0].confidence) > 0.6) {
						;
						var _speech = event.results[i][0].transcript;

						console.log(_speech);

						if (_speech && _speech.length > 1) {
							if (_speech.match(/(\w+)\s? (\w+)(\s(\w+))?/i)) {
								var type = RegExp.$1.toLowerCase();
								var command = RegExp.$2.toLowerCase();
								var option = RegExp.$3 ? RegExp.$3 : null;

								if (type == "go") {
									switch (command) {

										case "bottom":
										case "top":
											var speed = option && ~ ~option ? ~ ~option : 1000;

											$('html, body').animate({

												scrollTop: command == "bottom" ? $(document).height() : 0

											}, speed);

											break;

										case "home":
											location.href = "/";
											break;

										case "profile":
											location.href = "/user/";
											break;

										case "search":
											location.href = "/search/";
											break;

										case "messages":
											location.href = "/conversations/";
											break;
									}
								} else if (type == "open") {
									switch (command) {

										case "participated":
											var $recent_threads_button = $("a.recent-threads-button:first");

											if ($recent_threads_button.length == 1) {
												$recent_threads_button.trigger("click");
											}

											break;

									}
								} else if (type == "close") {
									switch (command) {

										case "participated":
											var $recent_threads = $("div#recent-threads");

											if ($recent_threads.length == 1) {
												var $close_button = $recent_threads.parent().find("a.ui-dialog-titlebar-close[role=button]");

												if ($close_button.length == 1) {
													$close_button.trigger("click");
												}
											}

											break;

									}
								}
							}
						}
					}
				}
			}
		}
	}]);

	return ProBoards_Speech;
}(Speech);

var speech = new ProBoards_Speech();

$(function () {
	$("#speech-prototype-listen").on("click", function () {
		speech.listen();
	}).parent().show();
});