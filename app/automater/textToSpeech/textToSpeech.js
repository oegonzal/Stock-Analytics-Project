var Ivona = require('./main'),
	fs = require('fs'),
	vars = require('../../../config/vars.js');

var text_to_speech = function(){
	//Ivona Account for turning text-to-speech
	var ivona = new Ivona({
	      accessKey: vars.accessKey,
	      secretKey: vars.secretKey
	  }); 

	function text_to_speech(text, callback){
	  var store_location = 'app/automater/reports/text.mp3';
	  var stream = ivona.createVoice(text, {
	      body: {
	          voice: {
	              name: 'Salli',
	              language: 'en-US',
	              gender: 'Female'
	          }
	      }
	  }).pipe(fs.createWriteStream(store_location)); //text.mp3 //text.aac

	  stream.on('finish', function(){
	  	console.log("------Done with the pipe of the text to speech");
	  	var media_url = '/reports/text.mp3';
	  	callback(media_url);
	  });
	};

	return {
		text_to_speech: text_to_speech
	}
}

module.exports = text_to_speech();