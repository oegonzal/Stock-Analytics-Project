var express = require('express');
var stockRouter = express.Router();

var Stock = require('../../models/stock.model');
var stockCtrl = require('./stock-api.controller.js')(Stock);

///////////////////////////////// Yahoo API ////////////////////////////////////////////
stockRouter.post('/yahoo-api', stockCtrl.getData);

///////////////////////////////////// articles //////////////////////////////////////
//Articles
stockRouter.get('/get-stored-articles/:id', stockCtrl.getArticles); //CHANGE: to get stored aricles for this category id
stockRouter.get('/get-articles', stockCtrl.getNewsArticlesFromSearchEngine );
stockRouter.post('/get-articles-text', stockCtrl.getArticlesText);
stockRouter.post('/save-articles', stockCtrl.saveArticles );

///////////////////////////////// dashboard /////////////////////////////////////////
//dashboard
stockRouter.use('/dashboard/:id', stockCtrl.findDashboardById)

//stock dashboard id...
stockRouter.route('/dashboard/:id')
	.get(stockCtrl.getDashboardById);

//send articles to phone -> text to speech audio file
stockRouter.route('/dashboard/:id/sendArticles')
	.get(stockCtrl.sendArticlesToPhone);

//////////////////////////////////  Simulation ///////////////////////////////////////
//simulation route...
stockRouter.route('/simulation')
	.post(stockCtrl.createSimulation)
	.get(stockCtrl.getSimulations);

//Middleware... (to prevent repeat code)
stockRouter.use('/simulation/:simulationid', stockCtrl.findSimulationById);

stockRouter.route('/simulation/:simulationid')
	.get(stockCtrl.getSimulationById)
	.put(stockCtrl.updateSimulation);

//////////////////////////////////// stock routes //////////////////////////////////
//stocks route...
stockRouter.route('/stock')
	.post(stockCtrl.post)
	.get(stockCtrl.get);

//Middleware... (to prevent repeat code)
stockRouter.use('/stock/:stockid', stockCtrl.findById);

//stock Id route...
stockRouter.route('/stock/:stockid')
	.get(stockCtrl.getStockId)
	.put(stockCtrl.putStockId)
	.patch(stockCtrl.patchStockId)
	.delete(stockCtrl.deleteStockId);


////////////////////////////////////////////////////////////////////////////////////

module.exports = stockRouter;