"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = financeDiscontinuousScale;

var _d2 = require("d3");

var _d3 = _interopRequireDefault(_d2);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tickLevels = [{ target: 50e2, level: 0 }, { target: 50e3, level: 1 }, { target: 10e4, level: 2 }, { target: 28e4, level: 3 }, { target: 55e4, level: 4 }, { target: 11e5, level: 5 }, { target: 21e5, level: 6 }, { target: 43e5, level: 7 }, { target: 49e5, level: 8 }, // not tested
{ target: 50e5, level: 9 }, // not tested
{ target: 58e6, level: 10 }, // not tested
{ target: 58e6, level: 11 }, { target: 11e7, level: 12 }, { target: 78e7, level: 13 }, { target: 16e8, level: 14 }, { target: 62e8, level: 15 }, { target: 10e20, level: 16 }];

var tickLevelBisector = _d3.default.bisector(function (d) {
	return d.target;
}).left;

function financeDiscontinuousScale(index, interval) {
	var backingLinearScale = arguments.length <= 2 || arguments[2] === undefined ? _d3.default.scale.linear() : arguments[2];


	if ((0, _utils.isNotDefined)(index) || (0, _utils.isNotDefined)(interval)) throw new Error("Use the discontinuousTimeScaleProvider to create financeDiscontinuousScale");

	function scale(x) {
		return backingLinearScale(x);
	}
	scale.invert = function (x) {
		var inverted = backingLinearScale.invert(x);
		return Math.round(inverted * 10000) / 10000;
	};
	scale.domain = function (x) {
		if (!arguments.length) return backingLinearScale.domain();
		backingLinearScale.domain(x);
		return scale;
	};
	scale.range = function (x) {
		if (!arguments.length) return backingLinearScale.range();
		backingLinearScale.range(x);
		return scale;
	};
	scale.rangeRound = function (x) {
		return backingLinearScale.range(x);
	};
	scale.clamp = function (x) {
		if (!arguments.length) return backingLinearScale.clamp();
		backingLinearScale.clamp(x);
		return scale;
	};
	scale.interpolate = function (x) {
		if (!arguments.length) return backingLinearScale.interpolate();
		backingLinearScale.interpolate(x);
		return scale;
	};
	scale.ticks = function (m) {
		var _backingLinearScale$d = backingLinearScale.domain();

		var _backingLinearScale$d2 = _slicedToArray(_backingLinearScale$d, 2);

		var domainStart = _backingLinearScale$d2[0];
		var domainEnd = _backingLinearScale$d2[1];

		var start = Math.max(Math.ceil(domainStart), 0);
		var end = Math.min(Math.floor(domainEnd), index.length - 1);

		// console.log(index.length, domainStart, domainEnd, start, end)

		var newM = (end - start) / (domainEnd - domainStart) * m;
		// newM = newM <= 0 ? m : newM;
		var target = Math.round((end - start + 1) * interval / newM);

		// var subList = index.slice(start, end + 1);
		var levelIndex = tickLevelBisector(tickLevels, target);
		// console.log(target, levelIndex)
		var level = tickLevels[levelIndex].level;

		// console.log(target, level);

		var backingTicks = backingLinearScale.ticks(m);
		var distance = backingTicks.length > 0 ? ((0, _utils.last)(backingTicks) - (0, _utils.head)(backingTicks)) / (backingTicks.length - 1) / 4 : 1;

		var ticks = [];
		for (var i = start; i < end + 1; i++) {
			if (index[i].level >= level) ticks.push(index[i].index);
		}

		// subList.filter(each => each.level >= level).map(d => d.index);

		var ticksSet = _d3.default.set(ticks);

		for (var _i = 0; _i < ticks.length - 1; _i++) {
			for (var j = _i + 1; j < ticks.length; j++) {
				if (ticks[j] - ticks[_i] < distance) {
					ticksSet.remove(index[ticks[_i]].level >= index[ticks[j]].level ? ticks[j] : ticks[_i]);
				}
			}
		}

		return ticksSet.values().map(function (d) {
			return parseInt(d, 10);
		});
	};
	scale.tickFormat = function () {
		return function (x) {
			var _index$x = index[x];
			var format = _index$x.format;
			var date = _index$x.date;

			return format(date);
		};
	};
	scale.nice = function (m) {
		backingLinearScale.nice(m);
		return scale;
	};
	scale.copy = function () {
		return financeDiscontinuousScale(index, interval, backingLinearScale.copy());
	};
	return scale;
}