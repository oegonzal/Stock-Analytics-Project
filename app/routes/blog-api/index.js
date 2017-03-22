var express = require('express'),
	blogRouter = express.Router(),
	blogCtrl = require('./blog-api.controller.js');

blogRouter.get('/', blogCtrl.get);
blogRouter.post('/', blogCtrl.post)

module.exports = blogRouter;