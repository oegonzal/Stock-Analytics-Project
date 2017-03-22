"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.discontinuousTimeScaleProvider = undefined;
exports.defaultScaleProvider = defaultScaleProvider;

var _discontinuousTimeScaleProvider = require("./discontinuousTimeScaleProvider");

var _discontinuousTimeScaleProvider2 = _interopRequireDefault(_discontinuousTimeScaleProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.discontinuousTimeScaleProvider = _discontinuousTimeScaleProvider2.default;
/*
import financeEODCalculator from "./financeEODCalculator";
import financeEODDiscontinuousScale from "./financeEODDiscontinuousScale";
import eodIntervalCalculator from "./eodIntervalCalculator";
import identityIntervalCalculator from "./identityIntervalCalculator";
import financeIntradayDiscontinuousScale from "./financeIntradayDiscontinuousScale";
import financeIntradayCalculator from "./financeIntradayCalculator";
import intradayIntervalCalculator from "./intradayIntervalCalculator";
*/

function defaultScaleProvider(xScale) {
	return function (data, xAccessor) {
		return { data: data, xScale: xScale, xAccessor: xAccessor, displayXAccessor: xAccessor };
	};
}