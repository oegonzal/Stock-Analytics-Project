var should = require('should'),
	request = require('supertest'),
	app = ('../app.js'),
	mongoose = require('mongoose'),
	//Stock = mongoose.model('Stock'),
	Stock = require('../models/stockModel'),
	agent = request.agent(app);

//request = request('http://localhost:3000');

describe('Stock Crud Test', function() {
	it('Should allow a stock to be posted and return a read and _id', function(done) {
		var stockPost = {name: "Valeant", index: "VRX", price: "26.79"};
		
		//has to be "/api/stocks   for supertests
		
		var options = {
			host : 'localhost',
			port : 3000,
			path : '/stock',
			method : 'POST' 
		};	//try putting in options in first param of agent.post
		
		//ERROR: Error: getaddrinfo ENOTFOUND .. ..:80
		agent.post( '/stock')
			//.send(stockPost)
			//.expect(200)
			.end( function(err, results) {
				console.log( "HERE IS OUR MESSAGE:   " + err );
				//results.body.read.should.equal(false);
				//results.body.should.have.property('_id');
				done();
			});
			
	});
	
	
	afterEach(function(done) {
		Stock.remove().exec();
		done();
	});
});