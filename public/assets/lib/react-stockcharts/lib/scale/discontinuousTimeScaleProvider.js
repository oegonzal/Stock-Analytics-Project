"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _d2 = require("d3");

var _d3 = _interopRequireDefault(_d2);

var _financeDiscontinuousScale = require("./financeDiscontinuousScale");

var _financeDiscontinuousScale2 = _interopRequireDefault(_financeDiscontinuousScale);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yearFormat = _d3.default.time.format("%Y");
var quarterFormat = _d3.default.time.format("%b %Y");
var monthFormat = _d3.default.time.format("%b");
var weekFormat = _d3.default.time.format("%d %b");
var dayFormat = _d3.default.time.format("%a %d");
var hourFormat = _d3.default.time.format("%_I %p");
var minuteFormat = _d3.default.time.format("%I:%M %p");
var secondFormat = _d3.default.time.format("%I:%M:%S %p");
// const milliSecondFormat = d3.time.format("%L");

var levelDefinition = [

/* eslint-disable no-unused-vars */
/* 17 */function (d, date, i) {
	return d.startOfYear && date.getFullYear() % 2 === 0 && yearFormat;
},
/* 16 */function (d, date, i) {
	return d.startOfYear && yearFormat;
},
/* 15 */function (d, date, i) {
	return d.startOfQuarter && quarterFormat;
},
/* 14 */function (d, date, i) {
	return d.startOfMonth && monthFormat;
},
/* 13 */function (d, date, i) {
	return d.startOfWeek && weekFormat;
},
/* 12 */function (d, date, i) {
	return d.startOfDay && i % 2 === 0 && dayFormat;
},
/* 11 */function (d, date, i) {
	return d.startOfDay && dayFormat;
},
/* 10 */function (d, date, i) {
	return d.startOfHalfDay && hourFormat;
}, // 12h
/*  9 */function (d, date, i) {
	return d.startOfQuarterDay && hourFormat;
}, // 6h
/*  8 */function (d, date, i) {
	return d.startOfEighthOfADay && hourFormat;
}, // 3h
/*  7 */function (d, date, i) {
	return d.startOfHour && date.getHours() % 2 === 0 && hourFormat;
}, // 2h -- REMOVE THIS
/*  6 */function (d, date, i) {
	return d.startOfHour && hourFormat;
}, // 1h
/*  5 */function (d, date, i) {
	return d.startOf30Minutes && minuteFormat;
},
/*  4 */function (d, date, i) {
	return d.startOf15Minutes && minuteFormat;
},
/*  3 */function (d, date, i) {
	return d.startOf5Minutes && minuteFormat;
},
/*  2 */function (d, date, i) {
	return d.startOfMinute && minuteFormat;
},
/*  1 */function (d, date, i) {
	return d.startOf30Seconds && secondFormat;
},
/*  0 */function (d, date, i) {
	return secondFormat;
}];

function evaluateLevel(d, date, i) {
	return levelDefinition.map(function (l, idx) {
		return { level: levelDefinition.length - idx - 1, format: l(d, date, i) };
	}).find(function (l) {
		return !!l.format;
	});
}

var discontinuousIndexCalculator = (0, _utils.slidingWindow)().windowSize(2).undefinedValue(function (d) {
	var i = 0;
	var row = {
		date: d,
		startOf30Seconds: false,
		startOfMinute: false,
		startOf5Minutes: false,
		startOf15Minutes: false,
		startOf30Minutes: false,
		startOfHour: false,
		startOfEighthOfADay: false,
		startOfQuarterDay: false,
		startOfHalfDay: false,
		startOfDay: true,
		startOfWeek: false,
		startOfMonth: false,
		startOfQuarter: false,
		startOfYear: false
	};
	var level = evaluateLevel(row, d, i);
	return _extends({}, row, { index: i }, level);
});

var discontinuousIndexCalculatorLocalTime = discontinuousIndexCalculator.accumulator(function (_ref, i) {
	var _ref2 = _slicedToArray(_ref, 2);

	var prevDate = _ref2[0];
	var nowDate = _ref2[1];

	var startOf30Seconds = nowDate.getSeconds() % 30 === 0;

	var startOfMinute = nowDate.getMinutes() !== prevDate.getMinutes();
	var startOf5Minutes = startOfMinute && nowDate.getMinutes() % 5 <= prevDate.getMinutes() % 5;
	var startOf15Minutes = startOfMinute && nowDate.getMinutes() % 15 <= prevDate.getMinutes() % 15;
	var startOf30Minutes = startOfMinute && nowDate.getMinutes() % 30 <= prevDate.getMinutes() % 30;

	var startOfHour = nowDate.getHours() !== prevDate.getHours();

	var startOfEighthOfADay = startOfHour && nowDate.getHours() % 3 === 0;
	var startOfQuarterDay = startOfHour && nowDate.getHours() % 6 === 0;
	var startOfHalfDay = startOfHour && nowDate.getHours() % 12 === 0;

	var startOfDay = nowDate.getDay() !== prevDate.getDay();
	// According to ISO calendar
	// Sunday = 0, Monday = 1, ... Saturday = 6
	// day of week of today < day of week of yesterday then today is start of week
	var startOfWeek = nowDate.getDay() < prevDate.getDay();
	// month of today != month of yesterday then today is start of month
	var startOfMonth = nowDate.getMonth() !== prevDate.getMonth();
	// if start of month and month % 3 === 0 then it is start of quarter
	var startOfQuarter = startOfMonth && nowDate.getMonth() % 3 <= prevDate.getMonth() % 3;
	// year of today != year of yesterday then today is start of year
	var startOfYear = nowDate.getYear() !== prevDate.getYear();

	var row = {
		date: nowDate,
		startOf30Seconds: startOf30Seconds,
		startOfMinute: startOfMinute,
		startOf5Minutes: startOf5Minutes,
		startOf15Minutes: startOf15Minutes,
		startOf30Minutes: startOf30Minutes,
		startOfHour: startOfHour,
		startOfEighthOfADay: startOfEighthOfADay,
		startOfQuarterDay: startOfQuarterDay,
		startOfHalfDay: startOfHalfDay,
		startOfDay: startOfDay,
		startOfWeek: startOfWeek,
		startOfMonth: startOfMonth,
		startOfQuarter: startOfQuarter,
		startOfYear: startOfYear
	};
	var level = evaluateLevel(row, nowDate, i);
	return _extends({}, row, { index: i }, level);
});

function discontinuousTimeScaleProvider(data, dateAccessor, indexAccessor, indexMutator) {

	var calculate = discontinuousIndexCalculatorLocalTime.source(dateAccessor);
	var index = calculate(data);
	// var interval1 = Math.round((dateAccessor(last(data)) - dateAccessor(head(data))) / data.length)
	// console.log(interval, interval1);

	var map = _d3.default.map();
	for (var i = 0; i < data.length - 1; i++) {

		var nextDate = dateAccessor(data[i + 1]);
		var nowDate = dateAccessor(data[i]);
		var diff = nextDate - nowDate;

		if (map.has(diff)) {
			var count = parseInt(map.get(diff), 10) + 1;
			map.set(diff, count);
		} else {
			map.set(diff, 1);
		}
	}

	var entries = map.entries().sort(function (a, b) {
		return a.value < b.value;
	});

	// For Renko/p&f
	var interval = entries[0].value === 1 ? Math.round((dateAccessor((0, _utils.last)(data)) - dateAccessor((0, _utils.head)(data))) / data.length) : parseInt(entries[0].key, 10);

	// console.log(interval, entries[0].key);

	var xScale = (0, _financeDiscontinuousScale2.default)(index, interval);

	// console.log(index);
	var mergedData = (0, _utils.zipper)().combine(indexMutator);

	var finalData = mergedData(data, index);

	return {
		data: finalData,
		xScale: xScale,
		xAccessor: function xAccessor(d) {
			return d && indexAccessor(d).index;
		},
		displayXAccessor: dateAccessor
	};
}

discontinuousTimeScaleProvider.utc = function (data, dateAccessor, indexAccessor, indexMutator) {
	var utcDateAccessor = function utcDateAccessor(d) {
		var date = dateAccessor(d);
		// The getTimezoneOffset() method returns the time-zone offset from UTC, in minutes, for the current locale.
		var offsetInMillis = date.getTimezoneOffset() * 60 * 1000;
		return new Date(date.getTime() + offsetInMillis);
	};
	return discontinuousTimeScaleProvider(data, utcDateAccessor, indexAccessor, indexMutator);
};

exports.default = discontinuousTimeScaleProvider;