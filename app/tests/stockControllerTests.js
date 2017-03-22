var should = require('should'),
	sinon = require('sinon');

describe('Stock Controller Tests:', function() {
	describe('Post', function() {
		it('Should not allow an empty name on post', function() {
			var Stock = function(stock) { this.save = function (){} };
			
			var req = {
				body: { 
					price: '4.55'
				}
			};
			
			var res = {
				status: sinon.spy(),
				send: sinon.spy()
			};
			
			var stockController = require('../routes/stock/stock.controller')(Stock);
			
			stockController.post(req, res);
			
			//TEST FAIL: not getting correct result!
			res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
			res.send.calledWith('Name is required').should.equal(true);
		});
	});
});