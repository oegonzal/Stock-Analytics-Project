"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

var _wrap = require("./wrap");

var _wrap2 = _interopRequireDefault(_wrap);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VolumeProfileSeries = function (_Component) {
	_inherits(VolumeProfileSeries, _Component);

	function VolumeProfileSeries() {
		_classCallCheck(this, VolumeProfileSeries);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(VolumeProfileSeries).apply(this, arguments));
	}

	_createClass(VolumeProfileSeries, [{
		key: "render",
		value: function render() {
			var _props = this.props;
			var className = _props.className;
			var opacity = _props.opacity;
			var xScale = _props.xScale;
			var yScale = _props.yScale;
			var plotData = _props.plotData;
			var _props2 = this.props;
			var showSessionBackground = _props2.showSessionBackground;
			var sessionBackGround = _props2.sessionBackGround;
			var sessionBackGroundOpacity = _props2.sessionBackGroundOpacity;

			var _helper = helper(this.props, xScale, yScale, plotData);

			var rects = _helper.rects;
			var sessionBg = _helper.sessionBg;


			var sessionBgSvg = showSessionBackground ? sessionBg.map(function (d, idx) {
				return _react2.default.createElement("rect", _extends({ key: idx }, d, { opacity: sessionBackGroundOpacity, fill: sessionBackGround }));
			}) : null;

			return _react2.default.createElement(
				"g",
				{ className: className },
				sessionBgSvg,
				rects.map(function (d, i) {
					return _react2.default.createElement(
						"g",
						{ key: i },
						_react2.default.createElement("rect", { x: d.x, y: d.y,
							width: d.w1, height: d.height,
							fill: d.fill1, stroke: d.stroke1, fillOpacity: opacity }),
						_react2.default.createElement("rect", { x: d.x + d.w1, y: d.y,
							width: d.w2, height: d.height,
							fill: d.fill2, stroke: d.stroke2, fillOpacity: opacity })
					);
				})
			);
		}
	}]);

	return VolumeProfileSeries;
}(_react.Component);

VolumeProfileSeries.propTypes = {
	className: _react.PropTypes.string,
	opacity: _react.PropTypes.number,
	xScale: _react.PropTypes.func,
	yScale: _react.PropTypes.func,
	plotData: _react.PropTypes.array,
	showSessionBackground: _react.PropTypes.bool,
	sessionBackGround: _react.PropTypes.string,
	sessionBackGroundOpacity: _react.PropTypes.number
};

VolumeProfileSeries.defaultProps = {
	opacity: 0.5,
	className: "line ",
	bins: 20,
	maxProfileWidthPercent: 50,
	source: function source(d) {
		return d.close;
	},
	volume: function volume(d) {
		return d.volume;
	},
	absoluteChange: function absoluteChange(d) {
		return d.absoluteChange;
	},
	bySession: false,
	/* eslint-disable no-unused-vars */
	sessionStart: function sessionStart(_ref) {
		var d = _ref.d;
		var i = _ref.i;
		var plotData = _ref.plotData;
		return d.idx.startOfMonth;
	},
	/* eslint-enable no-unused-vars */
	orient: "left",
	fill: function fill(_ref2) {
		var type = _ref2.type;
		return type === "up" ? "#6BA583" : "#FF0000";
	},
	// fill: ({ type }) => { var c = type === "up" ? "#6BA583" : "#FF0000"; console.log(type, c); return c },
	// stroke: ({ type }) =>  type === "up" ? "#6BA583" : "#FF0000",
	// stroke: "none",
	stroke: "#FFFFFF",
	showSessionBackground: false,
	sessionBackGround: "#4682B4",
	sessionBackGroundOpacity: 0.3,
	partialStartOK: false,
	partialEndOK: true
};

function helper(props, realXScale, yScale, plotData) {
	var xAccessor = props.xAccessor;
	var width = props.width;
	var sessionStart = props.sessionStart;
	var bySession = props.bySession;
	var partialStartOK = props.partialStartOK;
	var partialEndOK = props.partialEndOK;
	var bins = props.bins;
	var maxProfileWidthPercent = props.maxProfileWidthPercent;
	var source = props.source;
	var volume = props.volume;
	var absoluteChange = props.absoluteChange;
	var orient = props.orient;
	var fill = props.fill;
	var stroke = props.stroke;


	var sessionBuilder = (0, _utils.accumulatingWindow)().discardTillStart(!partialStartOK).discardTillEnd(!partialEndOK).accumulateTill(function (d, i) {
		return sessionStart({ d: d, i: i, plotData: plotData });
	}).accumulator(_utils.identity);

	var dx = plotData.length > 1 ? realXScale(xAccessor(plotData[1])) - realXScale(xAccessor((0, _utils.head)(plotData))) : 0;

	var sessions = bySession ? sessionBuilder(plotData) : [plotData];

	var allRects = sessions.map(function (session) {

		var begin = bySession ? realXScale(xAccessor((0, _utils.head)(session))) : 0;
		var finish = bySession ? realXScale(xAccessor((0, _utils.last)(session))) : width;
		var sessionWidth = finish - begin + dx;

		var histogram = _d2.default.layout.histogram().value(source).bins(bins);

		var rollup = _d2.default.nest().key(function (d) {
			return d.direction;
		}).sortKeys(orient === "right" ? _d2.default.descending : _d2.default.ascending).rollup(function (leaves) {
			return _d2.default.sum(leaves, function (d) {
				return d.volume;
			});
		});

		var values = histogram(session);
		var volumeInBins = values.map(function (arr) {
			return arr.map(function (d) {
				return absoluteChange(d) > 0 ? { direction: "up", volume: volume(d) } : { direction: "down", volume: volume(d) };
			});
		}).map(function (arr) {
			return rollup.entries(arr);
		});

		var volumeValues = volumeInBins.map(function (each) {
			return _d2.default.sum(each.map(function (d) {
				return d.values;
			}));
		});

		var base = function base(xScale) {
			return (0, _utils.head)(xScale.range());
		};

		var _ref3 = orient === "right" ? [begin, begin + sessionWidth * maxProfileWidthPercent / 100] : [finish, finish - sessionWidth * (100 - maxProfileWidthPercent) / 100];

		var _ref4 = _slicedToArray(_ref3, 2);

		var start = _ref4[0];
		var end = _ref4[1];


		var xScale = _d2.default.scale.linear().domain([0, _d2.default.max(volumeValues)]).range([start, end]);

		var totalVolumes = volumeInBins.map(function (volumes) {

			var totalVolume = _d2.default.sum(volumes, function (d) {
				return d.values;
			});
			var totalVolumeX = xScale(totalVolume);
			var width = base(xScale) - totalVolumeX;
			var x = width < 0 ? totalVolumeX + width : totalVolumeX;

			var ws = volumes.map(function (d) {
				return {
					type: d.key,
					width: d.values * Math.abs(width) / totalVolume
				};
			});
			return { x: x, ws: ws, totalVolumeX: totalVolumeX };
		});

		var rects = _d2.default.zip(values, totalVolumes).map(function (_ref5) {
			var _ref6 = _slicedToArray(_ref5, 2);

			var d = _ref6[0];
			var _ref6$ = _ref6[1];
			var x = _ref6$.x;
			var ws = _ref6$.ws;

			var w1 = ws[0] || { type: "up", width: 0 };
			var w2 = ws[1] || { type: "down", width: 0 };

			return {
				y: yScale(d.x + d.dx),
				height: yScale(d.x - d.dx) - yScale(d.x),
				x: x,
				width: width,
				w1: w1.width,
				w2: w2.width,
				stroke1: _d2.default.functor(stroke)(w1),
				stroke2: _d2.default.functor(stroke)(w2),
				fill1: _d2.default.functor(fill)(w1),
				fill2: _d2.default.functor(fill)(w2)
			};
		});

		var sessionBg = {
			x: begin,
			y: (0, _utils.last)(rects).y,
			height: (0, _utils.head)(rects).y - (0, _utils.last)(rects).y + (0, _utils.head)(rects).height,
			width: sessionWidth
		};

		return { rects: rects, sessionBg: sessionBg };
	});

	return {
		rects: _d2.default.merge(allRects.map(function (d) {
			return d.rects;
		})),
		sessionBg: allRects.map(function (d) {
			return d.sessionBg;
		})
	};
}

VolumeProfileSeries.drawOnCanvas = function (props, ctx, xScale, yScale, plotData) {
	var opacity = props.opacity;
	var sessionBackGround = props.sessionBackGround;
	var sessionBackGroundOpacity = props.sessionBackGroundOpacity;
	var showSessionBackground = props.showSessionBackground;

	var _helper2 = helper(props, xScale, yScale, plotData);

	var rects = _helper2.rects;
	var sessionBg = _helper2.sessionBg;


	if (showSessionBackground) {
		ctx.fillStyle = (0, _utils.hexToRGBA)(sessionBackGround, sessionBackGroundOpacity);

		sessionBg.forEach(function (each) {
			var x = each.x;
			var y = each.y;
			var height = each.height;
			var width = each.width;


			ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.closePath();
			ctx.fill();
		});
	}

	rects.forEach(function (each) {
		var x = each.x;
		var y = each.y;
		var height = each.height;
		var w1 = each.w1;
		var w2 = each.w2;
		var stroke1 = each.stroke1;
		var stroke2 = each.stroke2;
		var fill1 = each.fill1;
		var fill2 = each.fill2;


		if (w1 > 0) {
			ctx.fillStyle = (0, _utils.hexToRGBA)(fill1, opacity);
			if (stroke1 !== "none") ctx.strokeStyle = stroke1;

			ctx.beginPath();
			ctx.rect(x, y, w1, height);
			ctx.closePath();
			ctx.fill();

			if (stroke1 !== "none") ctx.stroke();
		}

		if (w2 > 0) {
			ctx.fillStyle = (0, _utils.hexToRGBA)(fill2, opacity);
			if (stroke2 !== "none") ctx.strokeStyle = stroke2;

			ctx.beginPath();
			ctx.rect(x + w1, y, w2, height);
			ctx.closePath();
			ctx.fill();

			if (stroke2 !== "none") ctx.stroke();
		}
	});
};

exports.default = (0, _wrap2.default)(VolumeProfileSeries);