"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _EdgeCoordinate = require("./EdgeCoordinate");

var _EdgeCoordinate2 = _interopRequireDefault(_EdgeCoordinate);

var _pure = require("../pure");

var _pure2 = _interopRequireDefault(_pure);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseCoordinateX = function (_Component) {
	_inherits(MouseCoordinateX, _Component);

	function MouseCoordinateX() {
		_classCallCheck(this, MouseCoordinateX);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseCoordinateX).apply(this, arguments));
	}

	_createClass(MouseCoordinateX, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _props = this.props;
			var chartCanvasType = _props.chartCanvasType;
			var getCanvasContexts = _props.getCanvasContexts;


			if (chartCanvasType !== "svg" && (0, _utils.isDefined)(getCanvasContexts)) {
				var contexts = getCanvasContexts();
				if (contexts) drawOnCanvas(contexts.mouseCoord, this.props);
			}
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			this.componentDidMount();
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			this.componentWillReceiveProps(this.props);
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var draw = drawOnCanvasStatic.bind(null, nextProps);
			var id = nextProps.id;
			var chartId = nextProps.chartId;


			if (!(0, _utils.shallowEqual)(this.props, nextProps)) {
				var temp = nextProps.getAllCanvasDrawCallback().filter(function (each) {
					return each.type === "mouse";
				}).filter(function (each) {
					return each.subType === "MouseCoordinateX";
				}).filter(function (each) {
					return each.chartId === chartId;
				}).filter(function (each) {
					return each.id === id;
				});

				if (temp.length === 0) {
					nextProps.callbackForCanvasDraw({
						type: "mouse",
						subType: "MouseCoordinateX",
						id: id, chartId: chartId, draw: draw
					});
				} else {
					nextProps.callbackForCanvasDraw(temp[0], {
						type: "mouse",
						subType: "MouseCoordinateX",
						id: id, chartId: chartId, draw: draw
					});
				}
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props;
			var chartCanvasType = _props2.chartCanvasType;
			var chartConfig = _props2.chartConfig;
			var currentItem = _props2.currentItem;
			var xScale = _props2.xScale;
			var mouseXY = _props2.mouseXY;

			if (chartCanvasType !== "svg") return null;

			var props = helper(this.props, xScale, chartConfig, mouseXY, currentItem);
			if ((0, _utils.isNotDefined)(props)) return null;

			return _react2.default.createElement(_EdgeCoordinate2.default, _extends({
				className: "horizontal"
			}, props));
		}
	}]);

	return MouseCoordinateX;
}(_react.Component);

MouseCoordinateX.propTypes = {
	id: _react.PropTypes.number.isRequired,
	displayFormat: _react.PropTypes.func.isRequired,

	chartCanvasType: _react.PropTypes.string.isRequired,
	getCanvasContexts: _react.PropTypes.func,
	chartConfig: _react.PropTypes.object.isRequired,
	mouseXY: _react.PropTypes.array,
	xScale: _react.PropTypes.func.isRequired,
	currentCharts: _react.PropTypes.arrayOf(_react.PropTypes.number),
	currentItem: _react.PropTypes.object
};

MouseCoordinateX.defaultProps = {
	yAxisPad: 0,
	rectWidth: 80,
	rectHeight: 20,
	orient: "bottom",
	at: "bottom",

	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
	snapX: true
};

function helper(props, xScale, _ref, mouseXY, currentItem) {
	var yScale = _ref.yScale;

	if ((0, _utils.isNotDefined)(currentItem)) return null;

	var xAccessor = props.xAccessor;
	var height = props.height;
	var show = props.show;
	var snapX = props.snapX;
	var orient = props.orient;
	var at = props.at;
	var rectWidth = props.rectWidth;
	var rectHeight = props.rectHeight;
	var displayFormat = props.displayFormat;
	var displayXAccessor = props.displayXAccessor;
	var fill = props.fill;
	var opacity = props.opacity;
	var fontFamily = props.fontFamily;
	var fontSize = props.fontSize;
	var textFill = props.textFill;


	var x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];
	var edgeAt = at === "bottom" ? height : 0;

	var coordinate = snapX ? displayFormat(displayXAccessor(currentItem)) : displayFormat(xScale.invert(x));
	var type = "vertical";
	var y1 = 0,
	    y2 = height;
	var hideLine = true;

	var coordinateProps = {
		coordinate: coordinate,
		show: show,
		type: type,
		orient: orient,
		edgeAt: edgeAt,
		hideLine: hideLine,
		fill: fill, opacity: opacity, fontFamily: fontFamily, fontSize: fontSize, textFill: textFill,
		rectWidth: rectWidth,
		rectHeight: rectHeight,
		x1: x,
		x2: x,
		y1: y1,
		y2: y2
	};
	return coordinateProps;
}

function drawOnCanvas(canvasContext, props) {
	var chartConfig = props.chartConfig;
	var currentItem = props.currentItem;
	var xScale = props.xScale;
	var mouseXY = props.mouseXY;
	var currentCharts = props.currentCharts;
	var show = props.show;


	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
}

// mouseContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem
function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var canvasOriginX = props.canvasOriginX;
	var canvasOriginY = props.canvasOriginY;


	var edgeProps = helper(props, xScale, chartConfig, mouseXY, currentItem);

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	_EdgeCoordinate2.default.drawOnCanvasStatic(ctx, edgeProps);

	ctx.restore();
}

exports.default = (0, _pure2.default)(MouseCoordinateX, {
	show: _react.PropTypes.bool.isRequired,
	currentItem: _react.PropTypes.object,
	chartConfig: _react.PropTypes.object.isRequired,
	mouseXY: _react.PropTypes.array, // this is to avoid the flicker
	canvasOriginX: _react.PropTypes.number,
	canvasOriginY: _react.PropTypes.number,

	height: _react.PropTypes.number.isRequired,
	displayXAccessor: _react.PropTypes.func.isRequired,

	xAccessor: _react.PropTypes.func.isRequired,
	xScale: _react.PropTypes.func.isRequired,
	chartId: _react.PropTypes.number.isRequired,
	getCanvasContexts: _react.PropTypes.func,
	margin: _react.PropTypes.object.isRequired,
	callbackForCanvasDraw: _react.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: _react.PropTypes.func,
	chartCanvasType: _react.PropTypes.string.isRequired
});