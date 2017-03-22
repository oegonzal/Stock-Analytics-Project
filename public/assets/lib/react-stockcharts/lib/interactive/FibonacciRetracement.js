"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d2 = require("d3");

var _d3 = _interopRequireDefault(_d2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _makeInteractive = require("./makeInteractive");

var _makeInteractive2 = _interopRequireDefault(_makeInteractive);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FibonacciRetracement = function (_Component) {
	_inherits(FibonacciRetracement, _Component);

	function FibonacciRetracement(props) {
		_classCallCheck(this, FibonacciRetracement);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FibonacciRetracement).call(this, props));

		_this.onMousemove = _this.onMousemove.bind(_this);
		_this.onClick = _this.onClick.bind(_this);
		_this.handleMoveStart = _this.handleMoveStart.bind(_this);
		_this.handleResizeStart = _this.handleResizeStart.bind(_this);

		_this.state = {
			hover: false
		};
		return _this;
	}

	_createClass(FibonacciRetracement, [{
		key: "removeLast",
		value: function removeLast(interactive) {
			var retracements = interactive.retracements;
			var start = interactive.start;

			if (!start && retracements.length > 0) {
				return _extends({}, interactive, { retracements: retracements.slice(0, retracements.length - 1) });
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
		key: "handleMoveStart",
		value: function handleMoveStart(idx, lineIndex, e) {
			var _props = this.props;
			var mouseXY = _props.mouseXY;
			var chartConfig = _props.chartConfig;
			var xAccessor = _props.xAccessor;
			var currentItem = _props.currentItem;
			var yScale = chartConfig.yScale;


			var startY = mouseXY[1];

			this.moveStartPosition = [xAccessor(currentItem), yScale.invert(startY)];

			var win = (0, _utils.d3Window)(this.refs.fib);
			_d3.default.select(win).on(_utils.MOUSEMOVE, this.handleMove.bind(this, idx)).on(_utils.MOUSEUP, this.handleMoveEnd.bind(this, idx));

			e.preventDefault();
		}
	}, {
		key: "handleResizeStart",
		value: function handleResizeStart(idx, line, e) {
			// var { mouseXY } = this.props;

			console.log(idx, line);
			e.preventDefault();
		}
	}, {
		key: "handleMove",
		value: function handleMove(idx) {
			var _props2 = this.props;
			var mouseXY = _props2.mouseXY;
			var interactiveState = _props2.interactiveState;
			var chartConfig = _props2.chartConfig;
			var _props3 = this.props;
			var type = _props3.type;
			var xAccessor = _props3.xAccessor;
			var currentItem = _props3.currentItem;
			var plotData = _props3.plotData;
			var yScale = chartConfig.yScale;

			var endY = mouseXY[1];

			var _moveStartPosition = _slicedToArray(this.moveStartPosition, 2);

			var startXValue = _moveStartPosition[0];
			var startYValue = _moveStartPosition[1];
			var endXValue = xAccessor(currentItem);
			var endYValue = yScale.invert(endY);


			var dx = endXValue - startXValue;
			var dy = endYValue - startYValue;

			var _interactiveState$ret = interactiveState.retracements[idx];
			var start = _interactiveState$ret.start;
			var end = _interactiveState$ret.end;

			var newStart = [start[0] + dx, start[1] + dy];
			var newEnd = [end[0] + dx, end[1] + dy];

			var retracement = generateLine(type, newStart, newEnd, xAccessor, plotData);

			var override = {
				index: idx,
				retracement: retracement,
				start: newStart,
				end: newEnd
			};

			this.setState({
				override: override
			});
		}
	}, {
		key: "handleMoveEnd",
		value: function handleMoveEnd(idx) {
			var _this2 = this;

			var win = (0, _utils.d3Window)(this.refs.fib);
			var _props4 = this.props;
			var overrideInteractive = _props4.overrideInteractive;
			var interactiveState = _props4.interactiveState;
			var override = this.state.override;
			var start = override.start;
			var end = override.end;


			if ((0, _utils.isDefined)(override)) {
				var retracements = interactiveState.retracements.map(function (each, i) {
					return i === idx ? { start: start, end: end } : each;
				});

				overrideInteractive({ retracements: retracements }, function () {
					_this2.setState({
						override: null
					});
				});
			}
			this.moveStartPosition = null;
			_d3.default.select(win).on(_utils.MOUSEMOVE, null).on(_utils.MOUSEUP, null);
		}
	}, {
		key: "isStart",
		value: function isStart(interactive) {
			return interactive.status === "start";
		}
	}, {
		key: "isComplete",
		value: function isComplete(interactive) {
			return interactive.status === "complete";
		}
	}, {
		key: "onMousemove",
		value: function onMousemove(state) {
			var mouseXY = state.mouseXY;
			var currentItem = state.currentItem;
			var chartConfig = state.chartConfig;
			var interactiveState = state.interactiveState;
			var _props5 = this.props;
			var enabled = _props5.enabled;
			var xAccessor = _props5.xAccessor;

			if (enabled) {
				var yScale = chartConfig.yScale;


				var yValue = yScale.invert(mouseXY[1]);
				var xValue = xAccessor(currentItem);

				if (interactiveState.start) {
					var status = "inprogress";
					return _extends({}, interactiveState, { tempEnd: [xValue, yValue], status: status });
				}
			}
			return interactiveState;
		}
	}, {
		key: "onClick",
		value: function onClick(state) {
			var mouseXY = state.mouseXY;
			var currentItem = state.currentItem;
			var chartConfig = state.chartConfig;
			var interactiveState = state.interactiveState;
			var eventMeta = state.eventMeta;
			var _props6 = this.props;
			var enabled = _props6.enabled;
			var xAccessor = _props6.xAccessor;

			if (enabled) {
				var start = interactiveState.start;
				var retracements = interactiveState.retracements;
				var yScale = chartConfig.yScale;


				var yValue = yScale.invert(mouseXY[1]);
				var xValue = xAccessor(currentItem);

				if (start) {
					return _extends({}, interactiveState, {
						start: null,
						tempEnd: null,
						retracements: retracements.concat({ start: start, end: [xValue, yValue] }),
						status: "complete"
					});
				} else if (eventMeta.button === 0) {
					return _extends({}, interactiveState, {
						start: [xValue, yValue],
						tempEnd: null,
						status: "start"
					});
				}
			}
			return interactiveState;
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var _props7 = this.props;
			var chartConfig = _props7.chartConfig;
			var plotData = _props7.plotData;
			var xScale = _props7.xScale;
			var xAccessor = _props7.xAccessor;
			var interactiveState = _props7.interactiveState;
			var _props8 = this.props;
			var stroke = _props8.stroke;
			var opacity = _props8.opacity;
			var fontFamily = _props8.fontFamily;
			var fontSize = _props8.fontSize;
			var fontStroke = _props8.fontStroke;
			var type = _props8.type;
			var enabled = _props8.enabled;
			var override = this.state.override;
			var yScale = chartConfig.yScale;

			var retracements = helper(plotData, type, xAccessor, interactiveState, chartConfig);
			var className = enabled || (0, _utils.isDefined)(override) ? "react-stockcharts-avoid-interaction" : "";
			return _react2.default.createElement(
				"g",
				{ className: className, ref: "fib" },
				retracements.map(function (eachRetracement, idx) {
					if ((0, _utils.isDefined)(override) && idx === override.index) {
						eachRetracement = override.retracement;
					}
					var dir = eachRetracement[0].y1 > eachRetracement[eachRetracement.length - 1].y1 ? 3 : -1.3;

					return _react2.default.createElement(
						"g",
						{ key: idx },
						eachRetracement.map(function (line, i) {
							var text = line.y.toFixed(2) + " (" + line.percent.toFixed(2) + "%)";

							var _ref = enabled ? {} : i === 0 || i === eachRetracement.length - 1 ? {
								className: "react-stockcharts-ns-resize-cursor",
								onMouseDown: _this3.handleResizeStart
							} : {
								className: "react-stockcharts-move-cursor",
								onMouseDown: _this3.handleMoveStart
							};

							var cursorClassName = _ref.className;
							var onMouseDown = _ref.onMouseDown;


							return _react2.default.createElement(EachRetracement, { key: i, idx: idx, lineIndex: i,
								className: cursorClassName,
								onMouseDown: onMouseDown,
								x1: xScale(line.x1),
								x2: xScale(line.x2),
								y: yScale(line.y),
								stroke: stroke,
								opacity: opacity,
								fontFamily: fontFamily,
								fontSize: fontSize,
								fontStroke: fontStroke,
								text: text,
								textX: xScale(Math.min(line.x1, line.x2)) + 10,
								textY: yScale(line.y) + dir * 4
							});
						})
					);
				})
			);
		}
	}]);

	return FibonacciRetracement;
}(_react.Component);

/* eslint-disable react/prop-types */


var EachRetracement = function (_Component2) {
	_inherits(EachRetracement, _Component2);

	function EachRetracement(props) {
		_classCallCheck(this, EachRetracement);

		var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(EachRetracement).call(this, props));

		_this4.handleMouseDown = _this4.handleMouseDown.bind(_this4);
		return _this4;
	}

	_createClass(EachRetracement, [{
		key: "handleMouseDown",
		value: function handleMouseDown(e) {
			var _props9 = this.props;
			var idx = _props9.idx;
			var lineIndex = _props9.lineIndex;
			var onMouseDown = _props9.onMouseDown;

			onMouseDown(idx, lineIndex, e);
		}
	}, {
		key: "render",
		value: function render() {
			var _props10 = this.props;
			var className = _props10.className;
			var x1 = _props10.x1;
			var x2 = _props10.x2;
			var y = _props10.y;
			var stroke = _props10.stroke;
			var opacity = _props10.opacity;
			var fontFamily = _props10.fontFamily;
			var fontSize = _props10.fontSize;
			var fontStroke = _props10.fontStroke;
			var _props11 = this.props;
			var text = _props11.text;
			var textX = _props11.textX;
			var textY = _props11.textY;

			return _react2.default.createElement(
				"g",
				{ className: className,
					onMouseDown: this.handleMouseDown },
				_react2.default.createElement("line", {
					x1: x1, y1: y,
					x2: x2, y2: y,
					stroke: stroke, opacity: opacity }),
				_react2.default.createElement("line", {
					x1: x1, y1: y,
					x2: x2, y2: y,
					stroke: stroke, strokeWidth: 7, opacity: 0 }),
				_react2.default.createElement(
					"text",
					{ x: textX, y: textY,
						fontFamily: fontFamily, fontSize: fontSize, fill: fontStroke },
					text
				)
			);
		}
	}]);

	return EachRetracement;
}(_react.Component);
/* eslint-enable react/prop-types */

function helper(plotData, type, xAccessor, interactive /* , chartConfig */) {
	var retracements = interactive.retracements;
	var start = interactive.start;
	var tempEnd = interactive.tempEnd;


	var temp = retracements;

	if (start && tempEnd) {
		temp = temp.concat({ start: start, end: tempEnd });
	}
	var lines = temp.map(function (each) {
		return generateLine(type, each.start, each.end, xAccessor, plotData);
	});

	return lines;
}

function generateLine(type, start, end, xAccessor, plotData) {
	var dy = end[1] - start[1];
	var retracements = [100, 61.8, 50, 38.2, 23.6, 0].map(function (each) {
		return {
			percent: each,
			x1: type === "EXTEND" ? xAccessor((0, _utils.head)(plotData)) : start[0],
			x2: type === "EXTEND" ? xAccessor((0, _utils.last)(plotData)) : end[0],
			y: end[1] - each / 100 * dy
		};
	});

	return retracements;
}

FibonacciRetracement.propTypes = {
	snap: _react.PropTypes.bool.isRequired,
	enabled: _react.PropTypes.bool.isRequired,
	snapTo: _react.PropTypes.func,
	fontFamily: _react.PropTypes.string.isRequired,
	fontSize: _react.PropTypes.number.isRequired,
	chartCanvasType: _react.PropTypes.string,
	chartConfig: _react.PropTypes.object,
	plotData: _react.PropTypes.array,
	xAccessor: _react.PropTypes.func,
	xScale: _react.PropTypes.func,
	interactive: _react.PropTypes.object,
	width: _react.PropTypes.number,
	stroke: _react.PropTypes.string,
	opacity: _react.PropTypes.number,
	fontStroke: _react.PropTypes.string,
	onStart: _react.PropTypes.func,
	onComplete: _react.PropTypes.func,
	type: _react.PropTypes.oneOf(["EXTEND", // extends from -Infinity to +Infinity
	"BOUND"]).isRequired,
	mouseXY: _react.PropTypes.array,
	currentItem: _react.PropTypes.object,
	interactiveState: _react.PropTypes.object,
	overrideInteractive: _react.PropTypes.func
};

FibonacciRetracement.defaultProps = {
	snap: true,
	enabled: true,
	stroke: "#000000",
	opacity: 0.4,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	fontStroke: "#000000",
	type: "EXTEND"

};

exports.default = (0, _makeInteractive2.default)(FibonacciRetracement, { retracements: [] });