// Speech prototype for ProBoards
// Note:  If using on http, it will not remember the permission.
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html

class Speech {

	constructor(){
		if(typeof webkitSpeechRecognition == "undefined"){
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

	add_gramma(gramma){
		this.gramma_list.addFromString(gramma);
		this.recognition.grammas = this.gramma_list;
	}

	// All the events can be overwritten, I added them all in just for completeness :P

	start(){
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

	on_audio_start(evt){

	}

	// Sound has been detected

	on_sound_start(evt){

	}

	// Speech recognition has started

	on_speech_start(evt){

	}

	// Speech recognition has ended

	on_speech_end(evt){

	}

	// Sound no longer detected

	on_sound_end(evt){

	}

	// User agent has finished capturing audio

	on_audio_end(evt){

	}

	// Speech recogniser returned a result

	on_result(evt){

	}

	//No recognition hypothesis that meet or exceed the confidence threshold

	on_no_match(evt){

	}

	// Speech recognition error

	on_error(evt){

	}

	// Recognition service has begun to listen to the audio with the intention of recognising

	on_start(evt){

	}

	// Service has been disconnected

	on_end(evt){

	}
}

class ProBoards_Speech extends Speech {

	constructor(){
		super();
	}

	listen(){
		this.start();
	}

	on_result(event){
		for(let i = event.resultIndex; i < event.results.length; i ++){
			if(event.results[i].isFinal){
				if(parseFloat(event.results[i][0].confidence) > 0.6){;
					let speech = event.results[i][0].transcript;

					console.log(speech);

					if(speech && speech.length > 1){
						if(speech.match(/(\w+)\s? (\w+)(\s(\w+))?/i)){
							let type = RegExp.$1.toLowerCase();
							let command = RegExp.$2.toLowerCase();
							let option = (RegExp.$3)? RegExp.$3 : null;

							if(type == "go"){
								switch(command){

									case "bottom" :
									case "top" :
										let speed = (option && (~~ option))? (~~ option) : 1000;

										$('html, body').animate({

											scrollTop: (command == "bottom")? $(document).height() : 0

										}, speed);

										break;

									case "home" :
										location.href = "/";
										break;

									case "profile" :
										location.href = "/user/";
										break;

									case "search" :
										location.href = "/search/";
										break;

									case "messages" :
										location.href = "/conversations/";
										break;
								}
							} else if(type == "open"){
								switch(command){

									case "participated" :
										let $recent_threads_button = $("a.recent-threads-button:first");

										if($recent_threads_button.length == 1){
											$recent_threads_button.trigger("click");
										}

										break;

								}
							} else if(type == "close"){
								switch(command){

									case "participated" :
										let $recent_threads = $("div#recent-threads");

										if($recent_threads.length == 1){
											let $close_button = $recent_threads.parent().find("a.ui-dialog-titlebar-close[role=button]");

											if($close_button.length == 1){
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

}

let speech = new ProBoards_Speech();

$(function(){
	$("#speech-prototype-listen").on("click", function(){
		speech.listen();
	}).parent().show();
});