"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("../utils");

var _pure = require("../pure");

var _pure2 = _interopRequireDefault(_pure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HoverTooltip = function (_Component) {
	_inherits(HoverTooltip, _Component);

	function HoverTooltip() {
		_classCallCheck(this, HoverTooltip);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(HoverTooltip).apply(this, arguments));
	}

	_createClass(HoverTooltip, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _props = this.props;
			var getCanvasContexts = _props.getCanvasContexts;
			var chartCanvasType = _props.chartCanvasType;


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

			var temp = nextProps.getAllCanvasDrawCallback().filter(function (each) {
				return each.type === "mouse";
			}).filter(function (each) {
				return each.subType === "HoverTooltip";
			});
			if (temp.length === 0) {
				nextProps.callbackForCanvasDraw({
					type: "mouse",
					subType: "HoverTooltip",
					draw: draw
				});
			} else {
				nextProps.callbackForCanvasDraw(temp[0], {
					type: "mouse",
					subType: "HoverTooltip",
					draw: draw
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var backgroundShapeSVG = this.props.backgroundShapeSVG;
			var _props2 = this.props;
			var chartConfig = _props2.chartConfig;
			var currentItem = _props2.currentItem;
			var height = _props2.height;
			var mouseXY = _props2.mouseXY;
			var _props3 = this.props;
			var chartCanvasType = _props3.chartCanvasType;
			var show = _props3.show;
			var xScale = _props3.xScale;
			var bgFill = _props3.bgFill;
			var bgOpacity = _props3.bgOpacity;


			if (chartCanvasType !== "svg") return null;
			var pointer = helper(this.props, show, xScale, mouseXY, chartConfig, currentItem);

			if ((0, _utils.isNotDefined)(pointer)) return null;
			var x = pointer.x;
			var y = pointer.y;
			var content = pointer.content;
			var centerX = pointer.centerX;
			var drawWidth = pointer.drawWidth;


			return _react2.default.createElement(
				"g",
				null,
				_react2.default.createElement("rect", { x: centerX - drawWidth / 2, y: 0, width: drawWidth, height: height, fill: bgFill, opacity: bgOpacity }),
				_react2.default.createElement(
					"g",
					{ className: "react-stockcharts-tooltip-content", transform: "translate(" + x + ", " + y + ")" },
					backgroundShapeSVG(this.props),
					tooltipSVG(this.props, content)
				)
			);
		}
	}]);

	return HoverTooltip;
}(_react.Component);

HoverTooltip.propTypes = {
	// forChart: PropTypes.number.isRequired,
	getCanvasContexts: _react.PropTypes.func,
	chartCanvasType: _react.PropTypes.string,
	chartConfig: _react.PropTypes.array.isRequired,
	currentItem: _react.PropTypes.object,
	width: _react.PropTypes.number.isRequired,
	height: _react.PropTypes.number.isRequired,
	mouseXY: _react.PropTypes.array,
	show: _react.PropTypes.bool,
	xScale: _react.PropTypes.func.isRequired,

	backgroundShapeSVG: _react.PropTypes.func,
	bgwidth: _react.PropTypes.number.isRequired,
	bgheight: _react.PropTypes.number.isRequired,
	bgFill: _react.PropTypes.string.isRequired,
	bgOpacity: _react.PropTypes.number.isRequired,
	tooltipContent: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]).isRequired,
	origin: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.func]).isRequired,
	fontFamily: _react.PropTypes.string,
	fontSize: _react.PropTypes.number
};

HoverTooltip.defaultProps = {
	bgwidth: 150,
	bgheight: 50,
	tooltipSVG: tooltipSVG,
	tooltipCanvas: tooltipCanvas,
	origin: origin,
	fill: "#D4E2FD",
	bgFill: "#D4E2FD",
	bgOpacity: 0.5,
	stroke: "#9B9BFF",
	fontFill: "#000000",
	opacity: 0.8,
	backgroundShapeSVG: backgroundShapeSVG,
	backgroundShapeCanvas: backgroundShapeCanvas,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12
};

var PADDING = 5;

/* eslint-disable react/prop-types */
function backgroundShapeSVG(_ref) {
	var bgheight = _ref.bgheight;
	var bgwidth = _ref.bgwidth;
	var fill = _ref.fill;
	var stroke = _ref.stroke;
	var opacity = _ref.opacity;

	return _react2.default.createElement("rect", { height: bgheight, width: bgwidth, fill: fill, opacity: opacity, stroke: stroke });
}

function tooltipSVG(_ref2, content) {
	var fontFamily = _ref2.fontFamily;
	var fontSize = _ref2.fontSize;
	var fontFill = _ref2.fontFill;

	var tspans = [];
	for (var i = 0; i < content.y.length; i++) {
		var y = content.y[i];
		tspans.push(_react2.default.createElement(
			"tspan",
			{ key: "L-" + i, x: 10, dy: fontSize, fill: y.stroke },
			y.label
		));
		tspans.push(_react2.default.createElement(
			"tspan",
			{ key: "" + i },
			": "
		));
		tspans.push(_react2.default.createElement(
			"tspan",
			{ key: "V-" + i },
			y.value
		));
	}
	return _react2.default.createElement(
		"text",
		{ fontFamily: fontFamily, fontSize: fontSize, fill: fontFill },
		_react2.default.createElement(
			"tspan",
			{ x: 10, y: 15 },
			content.x
		),
		tspans
	);
}
/* eslint-enable react/prop-types */

function backgroundShapeCanvas(_ref3, ctx) {
	var bgheight = _ref3.bgheight;
	var bgwidth = _ref3.bgwidth;
	var fill = _ref3.fill;
	var stroke = _ref3.stroke;
	var opacity = _ref3.opacity;

	ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
	ctx.strokeStyle = stroke;
	ctx.beginPath();
	ctx.rect(0, 0, bgwidth, bgheight);
	ctx.fill();
	ctx.stroke();
}

function tooltipCanvas(_ref4, content, ctx) {
	var fontFamily = _ref4.fontFamily;
	var fontSize = _ref4.fontSize;
	var fontFill = _ref4.fontFill;

	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = fontFill;
	ctx.textAlign = "left";

	var X = 10;
	var Y = 15;
	ctx.fillText(content.x, X, Y);

	for (var i = 0; i < content.y.length; i++) {
		var y = content.y[i];
		var textY = Y + fontSize * (i + 1);
		ctx.fillStyle = y.stroke || fontFill;
		ctx.fillText(y.label, X, textY);

		ctx.fillStyle = fontFill;
		ctx.fillText(": " + y.value, X + ctx.measureText(y.label).width, textY);
	}
}

function origin(_ref5) {
	var mouseXY = _ref5.mouseXY;
	var bgheight = _ref5.bgheight;
	var bgwidth = _ref5.bgwidth;
	var xAccessor = _ref5.xAccessor;
	var currentItem = _ref5.currentItem;
	var xScale = _ref5.xScale;

	var y = (0, _utils.last)(mouseXY);

	var snapX = xScale(xAccessor(currentItem));
	var originX = snapX - bgwidth - PADDING * 2 < 0 ? snapX + PADDING : snapX - bgwidth - PADDING;
	// originX = (x - width - PADDING * 2 < 0) ? x + PADDING : x - width - PADDING;

	var originY = y - bgheight / 2;
	return [originX, originY];
}

function drawOnCanvas(canvasContext, props) {
	var mouseXY = props.mouseXY;
	var chartConfig = props.chartConfig;
	var currentItem = props.currentItem;
	var xScale = props.xScale;
	var show = props.show;

	// console.log(props.

	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, null, chartConfig, currentItem);
}

function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var height = props.height;
	var margin = props.margin;
	var bgFill = props.bgFill;
	var bgOpacity = props.bgOpacity;
	var backgroundShapeCanvas = props.backgroundShapeCanvas;
	var tooltipCanvas = props.tooltipCanvas;


	var pointer = helper(props, show, xScale, mouseXY, chartConfig, currentItem);

	if (!pointer) return;

	var originX = 0.5 + margin.left;
	var originY = 0.5 + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(originX, originY);

	var x = pointer.x;
	var y = pointer.y;
	var content = pointer.content;
	var centerX = pointer.centerX;
	var drawWidth = pointer.drawWidth;


	ctx.fillStyle = (0, _utils.hexToRGBA)(bgFill, bgOpacity);
	ctx.beginPath();
	ctx.rect(centerX - drawWidth / 2, 0, drawWidth, height);
	ctx.fill();

	ctx.translate(x, y);
	backgroundShapeCanvas(props, ctx);
	tooltipCanvas(props, content, ctx);

	ctx.restore();
}

function helper(props, show, xScale, mouseXY, chartConfig, currentItem) {
	var origin = props.origin;
	var tooltipContent = props.tooltipContent;
	var xAccessor = props.xAccessor;
	var displayXAccessor = props.displayXAccessor;
	var plotData = props.plotData;


	if (!show || (0, _utils.isNotDefined)(currentItem)) return;

	var xValue = xAccessor(currentItem);

	if (!show || (0, _utils.isNotDefined)(xValue)) return;

	var _origin = origin(_extends({}, props, { show: show, xScale: xScale, mouseXY: mouseXY, chartConfig: chartConfig, currentItem: currentItem }));

	var _origin2 = _slicedToArray(_origin, 2);

	var x = _origin2[0];
	var y = _origin2[1];


	var content = tooltipContent({ currentItem: currentItem, xAccessor: displayXAccessor });
	var centerX = xScale(xValue);
	var drawWidth = Math.abs(xScale(xAccessor((0, _utils.last)(plotData))) - xScale(xAccessor((0, _utils.first)(plotData)))) / (plotData.length - 1);

	return { x: x, y: y, content: content, centerX: centerX, drawWidth: drawWidth };
}

exports.default = (0, _pure2.default)(HoverTooltip, {
	margin: _react.PropTypes.object.isRequired,
	width: _react.PropTypes.number.isRequired,
	height: _react.PropTypes.number.isRequired,

	getCanvasContexts: _react.PropTypes.func,
	getAllCanvasDrawCallback: _react.PropTypes.func,
	chartCanvasType: _react.PropTypes.string,
	chartConfig: _react.PropTypes.array.isRequired,
	currentItem: _react.PropTypes.object,
	mouseXY: _react.PropTypes.array,
	xScale: _react.PropTypes.func.isRequired,
	xAccessor: _react.PropTypes.func.isRequired,
	displayXAccessor: _react.PropTypes.func.isRequired,
	show: _react.PropTypes.bool,
	plotData: _react.PropTypes.array,
	callbackForCanvasDraw: _react.PropTypes.func.isRequired
});