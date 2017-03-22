"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _makeInteractive = require("./makeInteractive");

var _makeInteractive2 = _interopRequireDefault(_makeInteractive);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Brush = function (_Component) {
	_inherits(Brush, _Component);

	function Brush(props) {
		_classCallCheck(this, Brush);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Brush).call(this, props));

		_this.onMousemove = _this.onMousemove.bind(_this);
		_this.onClick = _this.onClick.bind(_this);
		return _this;
	}

	_createClass(Brush, [{
		key: "terminate",
		value: function terminate() {
			return {
				x1: null, y1: null,
				x2: null, y2: null,
				startItem: null,
				startClick: null,
				status: null
			};
		}
	}, {
		key: "onMousemove",
		value: function onMousemove(state) {
			var mouseXY = state.mouseXY;
			var currentItem = state.currentItem;
			var chartConfig = state.chartConfig;
			var interactiveState = state.interactiveState;
			var _props = this.props;
			var enabled = _props.enabled;
			var xAccessor = _props.xAccessor;
			var x1 = interactiveState.x1;
			var y1 = interactiveState.y1;


			var status = "mousemove";
			if (enabled && (0, _utils.isDefined)(x1) && (0, _utils.isDefined)(y1)) {
				var yScale = chartConfig.yScale;


				var x2 = xAccessor(currentItem);
				var y2 = yScale.invert(mouseXY[1]);

				return _extends({}, interactiveState, { x2: x2, y2: y2, status: status });
			}
			return _extends({}, interactiveState, { status: status, callbackProps: null });
		}
	}, {
		key: "onClick",
		value: function onClick(state) {
			var mouseXY = state.mouseXY;
			var currentItem = state.currentItem;
			var chartConfig = state.chartConfig;
			var interactiveState = state.interactiveState;
			var eventMeta = state.eventMeta;
			var _props2 = this.props;
			var displayXAccessor = _props2.displayXAccessor;
			var xAccessor = _props2.xAccessor;
			var enabled = this.props.enabled;


			if (enabled) {
				var x1 = interactiveState.x1;
				var y1 = interactiveState.y1;
				var startItem = interactiveState.startItem;
				var startClick = interactiveState.startClick;
				var yScale = chartConfig.yScale;


				var xValue = xAccessor(currentItem);
				var yValue = yScale.invert(mouseXY[1]);

				if (interactiveState.status === "brush") {
					return _extends({}, interactiveState, {
						status: null
					});
				} else if ((0, _utils.isDefined)(x1)) {
					var callbackProps = [{
						x1: displayXAccessor(startItem),
						y1: y1,
						x2: displayXAccessor(currentItem),
						y2: yValue,
						startItem: startItem,
						currentItem: currentItem,
						startClick: startClick,
						mouseXY: mouseXY
					}, eventMeta];

					var interactive = {
						// ...interactiveState,
						x1: null, y1: null,
						x2: null, y2: null,
						startItem: null,
						startClick: null,
						status: "brush",
						callbackProps: callbackProps
					};
					// return { interactive: onCompleteBrushCoords, callback: onCompleteCallback };
					return interactive;
				} else if (eventMeta.button === 0) {

					return {
						x1: xValue,
						y1: yValue,
						startItem: currentItem,
						startClick: mouseXY,
						x2: null,
						y2: null,
						status: "start"
					};
				}
			}
			return interactiveState;
		}
	}, {
		key: "render",
		value: function render() {
			var _props3 = this.props;
			var chartConfig = _props3.chartConfig;
			var plotData = _props3.plotData;
			var xScale = _props3.xScale;
			var xAccessor = _props3.xAccessor;
			var interactiveState = _props3.interactiveState;
			var enabled = _props3.enabled;
			var _props4 = this.props;
			var type = _props4.type;
			var fill = _props4.fill;
			var stroke = _props4.stroke;
			var opacity = _props4.opacity;
			var x1 = interactiveState.x1;
			var y1 = interactiveState.y1;
			var x2 = interactiveState.x2;
			var y2 = interactiveState.y2;


			if (enabled && (0, _utils.isDefined)(x1) && (0, _utils.isDefined)(y1) && (0, _utils.isDefined)(x2) && (0, _utils.isDefined)(y2)) {
				var brush = helper(type, plotData, xScale, xAccessor, chartConfig, { x1: x1, y1: y1, x2: x2, y2: y2 });
				return _react2.default.createElement("rect", _extends({ className: "react-stockcharts-avoid-interaction"
				}, brush, { fill: fill, stroke: stroke, fillOpacity: opacity }));
			}
			return null;
		}
	}]);

	return Brush;
}(_react.Component);

function helper(type, plotData, xScale, xAccessor, chartConfig, _ref) {
	var x1 = _ref.x1;
	var y1 = _ref.y1;
	var x2 = _ref.x2;
	var y2 = _ref.y2;
	var yScale = chartConfig.yScale;


	var left = Math.min(x1, x2);
	var right = Math.max(x1, x2);

	var top = Math.max(y1, y2);
	var bottom = Math.min(y1, y2);

	var x = xScale(left);
	var width = xScale(right) - xScale(left);

	var y = type === "1D" ? 0 : yScale(top);
	var height = type === "1D" ? chartConfig.height : yScale(bottom) - yScale(top);

	// console.log(chartConfig);
	return {
		x: x,
		y: y,
		width: width,
		height: height
	};
}

Brush.propTypes = {
	enabled: _react.PropTypes.bool.isRequired,
	onStart: _react.PropTypes.func.isRequired,
	onBrush: _react.PropTypes.func.isRequired,

	type: _react.PropTypes.oneOf(["1D", "2D"]),
	chartCanvasType: _react.PropTypes.string,
	chartConfig: _react.PropTypes.object,
	plotData: _react.PropTypes.array,
	xAccessor: _react.PropTypes.func,
	xScale: _react.PropTypes.func,
	interactive: _react.PropTypes.object,
	stroke: _react.PropTypes.string,
	fill: _react.PropTypes.string,
	opacity: _react.PropTypes.number,
	displayXAccessor: _react.PropTypes.func,
	interactiveState: _react.PropTypes.object
};

Brush.defaultProps = {
	type: "2D",
	stroke: "#000000",
	opacity: 0.3,
	fill: "#3h3h3h",
	onBrush: _utils.noop,
	onStart: _utils.noop
};

exports.default = (0, _makeInteractive2.default)(Brush, {});