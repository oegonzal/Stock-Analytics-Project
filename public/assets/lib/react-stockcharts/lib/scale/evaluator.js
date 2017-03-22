"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	var xAccessor,
	    useWholeData,
	    width,
	    xScale,
	    map,
	    calculator = [],
	    scaleProvider,
	    indexAccessor,
	    indexMutator;

	function evaluate(data) {

		var mappedData = data.map(map);

		var composedCalculator = compose(calculator);
		var calculatedData = composedCalculator(mappedData);

		if ((0, _utils.isDefined)(scaleProvider)) {
			var _scaleProvider = scaleProvider(calculatedData, xAccessor, indexAccessor, indexMutator);

			var finalData = _scaleProvider.data;
			var modifiedXScale = _scaleProvider.xScale;
			var realXAccessor = _scaleProvider.xAccessor;
			var displayXAccessor = _scaleProvider.displayXAccessor;


			return {
				filterData: extentsWrapper(finalData, xAccessor, realXAccessor, width, useWholeData || (0, _utils.isNotDefined)(modifiedXScale.invert)),
				xScale: modifiedXScale,
				xAccessor: realXAccessor,
				displayXAccessor: displayXAccessor,
				lastItem: (0, _utils.last)(finalData)
			};
		}

		return {
			filterData: extentsWrapper(calculatedData, xAccessor, xAccessor, width, useWholeData || (0, _utils.isNotDefined)(xScale.invert)),
			xScale: xScale,
			xAccessor: xAccessor,
			displayXAccessor: xAccessor,
			lastItem: (0, _utils.last)(calculatedData)
		};
	}
	evaluate.xAccessor = function (x) {
		if (!arguments.length) return xAccessor;
		xAccessor = x;
		return evaluate;
	};
	evaluate.map = function (x) {
		if (!arguments.length) return map;
		map = x;
		return evaluate;
	};
	evaluate.indexAccessor = function (x) {
		if (!arguments.length) return indexAccessor;
		indexAccessor = x;
		return evaluate;
	};
	evaluate.indexMutator = function (x) {
		if (!arguments.length) return indexMutator;
		indexMutator = x;
		return evaluate;
	};
	evaluate.scaleProvider = function (x) {
		if (!arguments.length) return scaleProvider;
		scaleProvider = x;
		return evaluate;
	};
	evaluate.xScale = function (x) {
		if (!arguments.length) return xScale;
		xScale = x;
		return evaluate;
	};
	evaluate.useWholeData = function (x) {
		if (!arguments.length) return useWholeData;
		useWholeData = x;
		return evaluate;
	};
	evaluate.width = function (x) {
		if (!arguments.length) return width;
		width = x;
		return evaluate;
	};
	evaluate.calculator = function (x) {
		if (!arguments.length) return calculator;
		calculator = x;
		return evaluate;
	};

	return evaluate;
};

var _utils = require("../utils");

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function extentsWrapper(data, inputXAccessor, realXAccessor, width, useWholeData) {
	function domain(inputDomain, xAccessor, currentPlotData, currentDomain) {
		if (useWholeData) {
			return { plotData: data, domain: inputDomain };
		}

		var left = (0, _utils.first)(inputDomain);
		var right = (0, _utils.last)(inputDomain);

		var filteredData = getFilteredResponse(data, left, right, xAccessor);

		var plotData, domain;
		if (canShowTheseManyPeriods(width, filteredData.length)) {
			plotData = filteredData;
			// domain = subsequent ? inputDomain : [realXAccessor(first(plotData)), realXAccessor(last(plotData))]
			domain = realXAccessor === xAccessor ? inputDomain : [realXAccessor((0, _utils.first)(plotData)), realXAccessor((0, _utils.last)(plotData))];
		} else {
			plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width));
			domain = currentDomain || [realXAccessor((0, _utils.first)(plotData)), realXAccessor((0, _utils.last)(plotData))];
		}

		return { plotData: plotData, domain: domain };
	}

	return domain;
}

function canShowTheseManyPeriods(width, arrayLength) {
	var threshold = 0.75; // number of datapoints per 1 px
	return arrayLength < width * threshold && arrayLength > 1;
}

function showMax(width) {
	var threshold = 0.75; // number of datapoints per 1 px
	return Math.floor(width * threshold);
}

function getFilteredResponse(data, left, right, xAccessor) {
	var newLeftIndex = (0, _utils.getClosestItemIndexes)(data, left, xAccessor).right;
	var newRightIndex = (0, _utils.getClosestItemIndexes)(data, right, xAccessor).left;

	var filteredData = data.slice(newLeftIndex, newRightIndex + 1);
	// console.log(right, newRightIndex, dataForInterval.length);

	return filteredData;
}

function compose(funcs) {
	if (funcs.length === 0) {
		return _utils.identity;
	}

	if (funcs.length === 1) {
		return funcs[0];
	}

	var _funcs = _toArray(funcs);

	var head = _funcs[0];

	var tail = _funcs.slice(1);

	return function (args) {
		return tail.reduce(function (composed, f) {
			return f(composed);
		}, head(args));
	};
}