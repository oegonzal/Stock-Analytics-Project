var	nodemailer = require('nodemailer');

//Email mailer...
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'enfav8@gmail.com',
		pass: 'Og978145'
	},
	secure: true
});

var mailOptions = 
	{
		from: 'enfav8@gmail.com',
		to:	'enfav8@gmail.com',
		subject: 'This is a test',
		text: 'Hello world!',
		html: '<b>Hello world html!</b>'
	};
transporter.sendMail(mailOptions, function(error, info) {
	if(error){
		console.log(error);
	}
	else
	{
		console.log("Message sent: " + info.response);
	}
});
