'use strict';

/* This module is strictly meant for one route. This route
 * is responsible for rendering our angular app home page.
 */
var express = require('express');
var path = require('path');
var router = express.Router();
var index_page = path.join(__dirname, '../../public/app/index.html');

/**
 * GET /
 * Render out angular app.
 */
router.get('/', function(req, res) {
  res.sendFile(index_page);
});

router.get('/home', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/dashboard', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/graph', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/screen', function(req, res){
	res.sendFile(index_page);
});

router.get('/investing/simulation/simulationlist', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/simulation/trade/:id', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/simulation/history/:id', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/stock', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/stock/create', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/watchlist', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/stock/stocklist', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/gold', function(req, res) {
  res.sendFile(index_page);
});

router.get('/investing/oil', function(req, res) {
  res.sendFile(index_page);
});

router.get('/blog/main', function(req, res){
  res.sendFile(index_page);
})

module.exports = router;