"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d2 = require("d3");

var _d3 = _interopRequireDefault(_d2);

var _makeInteractive = require("./makeInteractive");

var _makeInteractive2 = _interopRequireDefault(_makeInteractive);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getYValue(values, currentValue) {
	var diff = values.map(function (each) {
		return each - currentValue;
	}).reduce(function (diff1, diff2) {
		return Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2;
	});
	return currentValue + diff;
}

var TrendLine = function (_Component) {
	_inherits(TrendLine, _Component);

	function TrendLine(props) {
		_classCallCheck(this, TrendLine);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TrendLine).call(this, props));

		_this.onMousemove = _this.onMousemove.bind(_this);
		_this.onClick = _this.onClick.bind(_this);

		_this.handleEnter = _this.handleEnter.bind(_this);
		_this.handleLeave = _this.handleLeave.bind(_this);
		_this.handleEdgeMouseDown = _this.handleEdgeMouseDown.bind(_this);
		_this.handleEdgeDrag = _this.handleEdgeDrag.bind(_this);
		_this.handleEdgeDrop = _this.handleEdgeDrop.bind(_this);

		_this.handleLineMouseDown = _this.handleLineMouseDown.bind(_this);

		_this.state = {
			hover: null
		};
		return _this;
	}

	_createClass(TrendLine, [{
		key: "removeLast",
		value: function removeLast(interactive) {
			var trends = interactive.trends;
			var start = interactive.start;

			if (!start && trends.length > 0) {
				return _extends({}, interactive, { trends: trends.slice(0, trends.length - 1) });
			}
			return interactive;
		}
	}, {
		key: "terminate",
		value: function terminate(interactive) {
			var start = interactive.start;

			if (start) {
				return _extends({}, interactive, { start: null });
			}
			return interactive;
		}
	}, {
		key: "onMousemove",
		value: function onMousemove(state) {
			var mouseXY = state.mouseXY;
			var currentItem = state.currentItem;
			var chartConfig = state.chartConfig;
			var interactiveState = state.interactiveState;
			var eventMeta = state.eventMeta;
			var yScale = chartConfig.yScale;

			var currentPos = currentPosition(this.props, { eventMeta: eventMeta, mouseXY: mouseXY, currentItem: currentItem, yScale: yScale });
			var status = "inprogress";

			return _extends({}, interactiveState, { currentPos: currentPos, status: status });
		}
	}, {
		key: "onClick",
		value: function onClick(state) {
			var mouseXY = state.mouseXY;
			var currentItem = state.currentItem;
			var chartConfig = state.chartConfig;
			var interactiveState = state.interactiveState;
			var eventMeta = state.eventMeta;
			var _props = this.props;
			var enabled = _props.enabled;
			var snapTo = _props.snapTo;
			var snap = _props.snap;
			var shouldDisableSnap = _props.shouldDisableSnap;
			var xAccessor = this.props.xAccessor;


			if (enabled) {
				var start = interactiveState.start;
				var trends = interactiveState.trends;
				var yScale = chartConfig.yScale;

				var _xy = xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale);

				var _xy2 = _slicedToArray(_xy, 2);

				var xValue = _xy2[0];
				var yValue = _xy2[1];


				if ((0, _utils.isDefined)(start)) {
					return _extends({}, interactiveState, {
						start: null,
						currentPos: null,
						trends: trends.concat({ start: start, end: [xValue, yValue] }),
						status: "complete"
					});
				} else if (eventMeta.button === 0) {
					return _extends({}, interactiveState, {
						start: [xValue, yValue],
						status: "start"
					});
				}
			}
			return interactiveState;
		}
	}, {
		key: "handleEnter",
		value: function handleEnter(idx) {
			this.setState({
				hover: idx
			});
		}
	}, {
		key: "handleLeave",
		value: function handleLeave() {
			this.setState({
				hover: null
			});
		}
	}, {
		key: "handleLineMouseDown",
		value: function handleLineMouseDown(idx, e) {
			var captureDOM = this.refs.trend;

			var _props2 = this.props;
			var mouseXY = _props2.mouseXY;
			var chartConfig = _props2.chartConfig;
			var xAccessor = _props2.xAccessor;
			var currentItem = _props2.currentItem;
			var yScale = chartConfig.yScale;


			var startY = mouseXY[1];
			this.moveStartPosition = [xAccessor(currentItem), yScale.invert(startY)];

			var win = (0, _utils.d3Window)(captureDOM);
			_d3.default.select(win).on(_utils.MOUSEMOVE, this.handleLineDrag.bind(this, idx)).on(_utils.MOUSEUP, this.handleLineDrop.bind(this, idx));
			e.preventDefault();
		}
	}, {
		key: "handleLineDrag",
		value: function handleLineDrag(idx) {
			var _props3 = this.props;
			var mouseXY = _props3.mouseXY;
			var chartConfig = _props3.chartConfig;
			var xAccessor = _props3.xAccessor;
			var currentItem = _props3.currentItem;
			var interactiveState = _props3.interactiveState;
			var yScale = chartConfig.yScale;


			var endXValue = xAccessor(currentItem);
			var endYValue = yScale.invert(mouseXY[1]);

			var _moveStartPosition = _slicedToArray(this.moveStartPosition, 2);

			var startXValue = _moveStartPosition[0];
			var startYValue = _moveStartPosition[1];


			var dx = endXValue - startXValue;
			var dy = endYValue - startYValue;

			var _interactiveState$tre = interactiveState.trends[idx];
			var start = _interactiveState$tre.start;
			var end = _interactiveState$tre.end;


			this.setState({
				hover: idx,
				override: {
					index: idx,
					x1: start[0] + dx,
					y1: start[1] + dy,
					x2: end[0] + dx,
					y2: end[1] + dy
				}
			});
		}
	}, {
		key: "handleLineDrop",
		value: function handleLineDrop(idx) {
			var _this2 = this;

			var _props4 = this.props;
			var overrideInteractive = _props4.overrideInteractive;
			var interactiveState = _props4.interactiveState;
			var override = this.state.override;


			if ((0, _utils.isDefined)(override)) {
				var x1 = override.x1;
				var y1 = override.y1;
				var x2 = override.x2;
				var y2 = override.y2;

				var newTrend = {
					start: [x1, y1],
					end: [x2, y2]
				};

				var trends = interactiveState.trends.map(function (each, i) {
					return i === idx ? newTrend : each;
				});

				overrideInteractive({ trends: trends }, function () {
					_this2.setState({
						override: null,
						hover: null
					});
				});
			}

			this.moveStartPosition = null;
			var captureDOM = this.refs.trend;
			var win = (0, _utils.d3Window)(captureDOM);
			_d3.default.select(win).on(_utils.MOUSEMOVE, null).on(_utils.MOUSEUP, null);
		}
	}, {
		key: "handleEdgeMouseDown",
		value: function handleEdgeMouseDown(side, idx, e) {
			var captureDOM = this.refs.trend;

			var win = (0, _utils.d3Window)(captureDOM);
			_d3.default.select(win).on(_utils.MOUSEMOVE, this.handleEdgeDrag.bind(this, side, idx)).on(_utils.MOUSEUP, this.handleEdgeDrop.bind(this, side, idx));
			e.preventDefault();
		}
	}, {
		key: "handleEdgeDrag",
		value: function handleEdgeDrag(side, idx) {
			var _props5 = this.props;
			var mouseXY = _props5.mouseXY;
			var chartConfig = _props5.chartConfig;
			var xAccessor = _props5.xAccessor;
			var currentItem = _props5.currentItem;
			var yScale = chartConfig.yScale;


			var xValue = xAccessor(currentItem);
			var yValue = yScale.invert(mouseXY[1]);

			if (side === "left") {
				this.setState({
					hover: idx,
					override: {
						index: idx,
						x1: xValue,
						y1: yValue
					}
				});
			} else {
				this.setState({
					hover: idx,
					override: {
						index: idx,
						x2: xValue,
						y2: yValue
					}
				});
			}

			// console.log("DRAG", side, idx, mouseXY)
		}
	}, {
		key: "handleEdgeDrop",
		value: function handleEdgeDrop(side, idx) {
			var _this3 = this;

			// console.log("DROP", side, idx)

			var captureDOM = this.refs.trend;
			var _props6 = this.props;
			var overrideInteractive = _props6.overrideInteractive;
			var interactiveState = _props6.interactiveState;


			var trend = interactiveState.trends[idx];
			var newTrend = trend;

			var override = this.state.override;

			if ((0, _utils.isDefined)(override)) {
				var x1 = override.x1;
				var y1 = override.y1;
				var x2 = override.x2;
				var y2 = override.y2;

				if ((0, _utils.isDefined)(x1) && (0, _utils.isDefined)(y1)) {
					newTrend = {
						start: [x1, y1],
						end: trend.end
					};
				} else if ((0, _utils.isDefined)(x2) && (0, _utils.isDefined)(y2)) {
					newTrend = {
						start: trend.start,
						end: [x2, y2]
					};
				}

				var trends = interactiveState.trends.map(function (each, i) {
					return i === idx ? newTrend : each;
				});

				overrideInteractive({ trends: trends }, function () {
					_this3.setState({
						override: null,
						hover: null
					});
				});
			}

			var win = (0, _utils.d3Window)(captureDOM);
			_d3.default.select(win).on(_utils.MOUSEMOVE, null).on(_utils.MOUSEUP, null);
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var _props7 = this.props;
			var enabled = _props7.enabled;
			var endPointCircleFill = _props7.endPointCircleFill;
			var endPointCircleRadius = _props7.endPointCircleRadius;
			var _props8 = this.props;
			var xScale = _props8.xScale;
			var chartConfig = _props8.chartConfig;
			var plotData = _props8.plotData;
			var xAccessor = _props8.xAccessor;
			var interactiveState = _props8.interactiveState;
			var show = _props8.show;
			var yScale = chartConfig.yScale;
			var _props9 = this.props;
			var currentPositionStroke = _props9.currentPositionStroke;
			var currentPositionStrokeWidth = _props9.currentPositionStrokeWidth;
			var currentPositionOpacity = _props9.currentPositionOpacity;
			var currentPositionRadius = _props9.currentPositionRadius;
			var _props10 = this.props;
			var stroke = _props10.stroke;
			var opacity = _props10.opacity;
			var type = _props10.type;
			var currentPos = interactiveState.currentPos;


			var circle = currentPos && enabled && show ? _react2.default.createElement("circle", { className: "react-stockcharts-avoid-interaction", cx: xScale(currentPos[0]), cy: yScale(currentPos[1]),
				stroke: currentPositionStroke,
				opacity: currentPositionOpacity,
				fill: "none",
				strokeWidth: currentPositionStrokeWidth,
				r: currentPositionRadius }) : null;

			var lines = helper(plotData, type, xAccessor, interactiveState);
			var adjustClassName = !enabled ? "react-stockcharts-move-cursor" : "";

			var _state = this.state;
			var override = _state.override;
			var hover = _state.hover;


			var className = enabled || (0, _utils.isDefined)(override) ? "react-stockcharts-avoid-interaction" : "";

			return _react2.default.createElement(
				"g",
				{ ref: "trend", className: className },
				circle,
				lines.map(function (coords, idx) {
					var x1 = xScale(getCoordinate(idx, override, coords, "x1"));
					var y1 = yScale(getCoordinate(idx, override, coords, "y1"));
					var x2 = xScale(getCoordinate(idx, override, coords, "x2"));
					var y2 = yScale(getCoordinate(idx, override, coords, "y2"));

					var circleOpacity = hover === idx ? 0.5 : 0.1;
					var strokeWidth = hover === idx ? 2 : 1;

					return _react2.default.createElement(
						"g",
						{ key: idx },
						_react2.default.createElement("line", { className: adjustClassName,
							x1: x1, y1: y1, x2: x2, y2: y2,
							stroke: stroke, strokeWidth: strokeWidth,
							opacity: opacity }),
						_react2.default.createElement(ClickableLine, { className: adjustClassName, idx: idx,
							onMouseEnter: _this4.handleEnter,
							onMouseLeave: _this4.handleLeave,
							onMouseDown: _this4.handleLineMouseDown,
							x1: x1, y1: y1, x2: x2, y2: y2,
							stroke: stroke, strokeWidth: 8, opacity: 0 }),
						_react2.default.createElement(ClickableCircle, { className: adjustClassName, idx: idx, side: "left",
							onMouseEnter: _this4.handleEnter,
							onMouseLeave: _this4.handleLeave,
							onMouseDown: _this4.handleEdgeMouseDown,
							cx: x1, cy: y1, r: endPointCircleRadius,
							fill: endPointCircleFill, opacity: circleOpacity }),
						_react2.default.createElement(ClickableCircle, { className: adjustClassName, idx: idx, side: "right",
							onMouseEnter: _this4.handleEnter,
							onMouseLeave: _this4.handleLeave,
							onMouseDown: _this4.handleEdgeMouseDown,
							cx: x2, cy: y2, r: endPointCircleRadius,
							fill: endPointCircleFill, opacity: circleOpacity })
					);
				})
			);
		}
	}]);

	return TrendLine;
}(_react.Component);

/* eslint-disable react/prop-types */


var ClickableLine = function (_Component2) {
	_inherits(ClickableLine, _Component2);

	function ClickableLine(props) {
		_classCallCheck(this, ClickableLine);

		var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ClickableLine).call(this, props));

		_this5.handleMouseEnter = _this5.handleMouseEnter.bind(_this5);
		_this5.handleMouseLeave = _this5.handleMouseLeave.bind(_this5);
		_this5.handleMouseDown = _this5.handleMouseDown.bind(_this5);
		return _this5;
	}

	_createClass(ClickableLine, [{
		key: "handleMouseEnter",
		value: function handleMouseEnter(e) {
			var _props11 = this.props;
			var idx = _props11.idx;
			var onMouseEnter = _props11.onMouseEnter;

			onMouseEnter(idx, e);
		}
	}, {
		key: "handleMouseLeave",
		value: function handleMouseLeave(e) {
			var _props12 = this.props;
			var idx = _props12.idx;
			var onMouseLeave = _props12.onMouseLeave;

			onMouseLeave(idx, e);
		}
	}, {
		key: "handleMouseDown",
		value: function handleMouseDown(e) {
			var _props13 = this.props;
			var idx = _props13.idx;
			var onMouseDown = _props13.onMouseDown;

			onMouseDown(idx, e);
		}
	}, {
		key: "render",
		value: function render() {
			var _props14 = this.props;
			var className = _props14.className;
			var x1 = _props14.x1;
			var x2 = _props14.x2;
			var y1 = _props14.y1;
			var y2 = _props14.y2;
			var stroke = _props14.stroke;
			var strokeWidth = _props14.strokeWidth;
			var opacity = _props14.opacity;


			return _react2.default.createElement("line", { className: className,
				onMouseEnter: this.handleEnter,
				onMouseLeave: this.handleLeave,
				onMouseDown: this.handleMouseDown,
				x1: x1, y1: y1, x2: x2, y2: y2,
				stroke: stroke, strokeWidth: strokeWidth, opacity: opacity });
		}
	}]);

	return ClickableLine;
}(_react.Component);

var ClickableCircle = function (_Component3) {
	_inherits(ClickableCircle, _Component3);

	function ClickableCircle(props) {
		_classCallCheck(this, ClickableCircle);

		var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ClickableCircle).call(this, props));

		_this6.handleMouseEnter = _this6.handleMouseEnter.bind(_this6);
		_this6.handleMouseLeave = _this6.handleMouseLeave.bind(_this6);
		_this6.handleMouseDown = _this6.handleMouseDown.bind(_this6);
		return _this6;
	}

	_createClass(ClickableCircle, [{
		key: "handleMouseEnter",
		value: function handleMouseEnter(e) {
			var _props15 = this.props;
			var idx = _props15.idx;
			var onMouseEnter = _props15.onMouseEnter;

			onMouseEnter(idx, e);
		}
	}, {
		key: "handleMouseLeave",
		value: function handleMouseLeave(e) {
			var _props16 = this.props;
			var idx = _props16.idx;
			var onMouseLeave = _props16.onMouseLeave;

			onMouseLeave(idx, e);
		}
	}, {
		key: "handleMouseDown",
		value: function handleMouseDown(e) {
			var _props17 = this.props;
			var idx = _props17.idx;
			var side = _props17.side;
			var onMouseDown = _props17.onMouseDown;

			onMouseDown(side, idx, e);
		}
	}, {
		key: "render",
		value: function render() {
			var _props18 = this.props;
			var className = _props18.className;
			var cx = _props18.cx;
			var cy = _props18.cy;
			var r = _props18.r;
			var fill = _props18.fill;
			var opacity = _props18.opacity;


			return _react2.default.createElement("circle", { className: className,
				onMouseEnter: this.handleMouseEnter,
				onMouseLeave: this.handleMouseLeave,
				onMouseDown: this.handleMouseDown,
				cx: cx, cy: cy, r: r,
				fill: fill, opacity: opacity });
		}
	}]);

	return ClickableCircle;
}(_react.Component);
/* eslint-enable react/prop-types */

function getCoordinate(idx, override, coords, key) {
	if ((0, _utils.isDefined)(override)) {
		var index = override.index;

		if (index === idx) {
			if ((0, _utils.isDefined)(override[key])) {
				return override[key];
			}
		}
	}
	return coords[key];
}

function currentPosition(_ref, _ref2) {
	var enabled = _ref.enabled;
	var snapTo = _ref.snapTo;
	var snap = _ref.snap;
	var shouldDisableSnap = _ref.shouldDisableSnap;
	var xAccessor = _ref.xAccessor;
	var eventMeta = _ref2.eventMeta;
	var mouseXY = _ref2.mouseXY;
	var currentItem = _ref2.currentItem;
	var yScale = _ref2.yScale;

	if (enabled && eventMeta && currentItem) {

		return xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale);
	}
}

function xy(snapTo, snap, shouldDisableSnap, xAccessor, eventMeta, currentItem, mouseXY, yScale) {
	var yValue = snap && !shouldDisableSnap(eventMeta) ? getYValue(snapTo(currentItem), yScale.invert(mouseXY[1])) : yScale.invert(mouseXY[1]);
	var xValue = xAccessor(currentItem);

	return [xValue, yValue];
}

function helper(plotData, type, xAccessor, interactive /* , chartConfig */) {
	var currentPos = interactive.currentPos;
	var start = interactive.start;
	var trends = interactive.trends;

	var temp = trends;
	if (start && currentPos) {
		temp = temp.concat({ start: start, end: currentPos });
	}
	var lines = temp.filter(function (each) {
		return each.start[0] !== each.end[0];
	}).map(function (each) {
		return generateLine(type, each.start, each.end, xAccessor, plotData);
	});

	return lines;
}

function generateLine(type, start, end, xAccessor, plotData) {
	/* if (end[0] - start[0] === 0) {
 	// vertical line
 	throw new Error("Trendline cannot be a vertical line")
 } */
	var m /* slope */ = (end[1] - start[1]) / (end[0] - start[0]);
	var b /* y intercept */ = -1 * m * end[0] + end[1];
	// y = m * x + b
	var x1 = type === "XLINE" ? xAccessor(plotData[0]) : start[0]; // RAY or LINE start is the same

	var y1 = m * x1 + b;

	var x2 = type === "XLINE" ? xAccessor((0, _utils.last)(plotData)) : type === "RAY" ? end[0] > start[0] ? xAccessor((0, _utils.last)(plotData)) : xAccessor((0, _utils.head)(plotData)) : end[0];
	var y2 = m * x2 + b;
	return { x1: x1, y1: y1, x2: x2, y2: y2 };
}

TrendLine.propTypes = {
	snap: _react.PropTypes.bool.isRequired,
	show: _react.PropTypes.bool,
	enabled: _react.PropTypes.bool.isRequired,
	snapTo: _react.PropTypes.func,
	shouldDisableSnap: _react.PropTypes.func.isRequired,
	chartCanvasType: _react.PropTypes.string,
	chartConfig: _react.PropTypes.object,
	plotData: _react.PropTypes.array,
	xScale: _react.PropTypes.func,
	xAccessor: _react.PropTypes.func,
	onStart: _react.PropTypes.func.isRequired,
	onComplete: _react.PropTypes.func.isRequired,
	interactive: _react.PropTypes.object,
	currentPositionStroke: _react.PropTypes.string,
	currentPositionStrokeWidth: _react.PropTypes.number,
	currentPositionOpacity: _react.PropTypes.number,
	currentPositionRadius: _react.PropTypes.number,
	stroke: _react.PropTypes.string,
	opacity: _react.PropTypes.number,
	type: _react.PropTypes.oneOf(["XLINE", // extends from -Infinity to +Infinity
	"RAY", // extends to +/-Infinity in one direction
	"LINE"]),
	interactiveState: _react.PropTypes.object,
	currentItem: _react.PropTypes.object,
	mouseXY: _react.PropTypes.array,
	overrideInteractive: _react.PropTypes.func,
	endPointCircleFill: _react.PropTypes.string,
	endPointCircleRadius: _react.PropTypes.number
};

TrendLine.defaultProps = {
	stroke: "#000000",
	type: "XLINE",
	opacity: 0.7,
	onStart: _utils.noop,
	onComplete: _utils.noop,
	shouldDisableSnap: function shouldDisableSnap(e) {
		return e.button === 2 || e.shiftKey;
	},
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,
	endPointCircleFill: "#000000",
	endPointCircleRadius: 5
};

exports.default = (0, _makeInteractive2.default)(TrendLine, { trends: [] });