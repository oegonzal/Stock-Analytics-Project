var vars = require('../../../config/vars.js'),
    twilio = require('twilio'),
    client = new twilio.RestClient(vars.accountSid, vars.authToken); 

var sms = function(){

  function receiveSMS(req, res){
    console.log("Inside Twilio recieve message-----------------");
    var twiml = new twilio.TwimlResponse();
    if (req.body.Body == 'Hello') {
        twiml.message('Hi!');
    } else if(req.body.Body == 'Bye') {
        twiml.message('Goodbye');
    } else {
        twiml.message('No Body param match, Twilio sends this in the request to your server.');
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  }

  function sendMMS(to, body, mediaUrl, callback){
    client.messages.create({ 
        to: to, //'+14159026651' // '+17147234319'
        from:'+18582120724',
        body: body,
        mediaUrl: mediaUrl, //"http://b8ac504c.ngrok.io/reports/text.mp3" //"http://b8ac504c.ngrok.io/public/assets/img/cat.jpg" //https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg
    }, function(error, message) {
        if (!error) {
          console.log('Success! The SID for this SMS message is: ' + message.sid);
          console.log('Message sent on date: ' + message.dateSent);
          console.log("From: " + message.from);
          console.log("numMedia: " + message.numMedia);
          console.log("numSegments: " + message.numSegments);
          console.log("Status: "+message.status);
          console.log("Error Code: " + message.errorCode);
          console.log("Error Message: " + message.errorMessage);
          console.log("Price: " + message.price);
          console.log("Price unit: " + message.priceUnit);
          console.log("ApI version: " + message.apiVersion);
          console.log("URI: " + message.uri); //https://api.twilio.com
          console.log("Subresource URI: " +  message.subresourceUri);

          callback();
        } 
        else {
            console.log('Oops! There was an error.');
            console.log(error);
        }
    });
  };

  return {
    sendMMS: sendMMS,
    receiveSMS: receiveSMS
  }
}

module.exports = sms();
