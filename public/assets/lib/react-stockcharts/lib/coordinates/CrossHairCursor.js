"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _pure = require("../pure");

var _pure2 = _interopRequireDefault(_pure);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CrossHairCursor = function (_Component) {
	_inherits(CrossHairCursor, _Component);

	function CrossHairCursor() {
		_classCallCheck(this, CrossHairCursor);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(CrossHairCursor).apply(this, arguments));
	}

	_createClass(CrossHairCursor, [{
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
			this.componentWillReceiveProps(this.props, this.props);
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var draw = drawOnCanvasStatic.bind(null, nextProps);

			var temp = nextProps.getAllCanvasDrawCallback().filter(function (each) {
				return (0, _utils.isNotDefined)(each.chartId);
			}).filter(function (each) {
				return each.type === "mouse";
			}).filter(function (each) {
				return each.subType === "crosshair";
			});
			if (temp.length === 0) {
				nextProps.callbackForCanvasDraw({
					type: "mouse",
					subType: "crosshair",
					draw: draw
				});
			} else {
				nextProps.callbackForCanvasDraw(temp[0], {
					type: "mouse",
					subType: "crosshair",
					draw: draw
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props;
			var chartCanvasType = _props2.chartCanvasType;
			var mouseXY = _props2.mouseXY;
			var xScale = _props2.xScale;
			var currentItem = _props2.currentItem;
			var show = _props2.show;

			if (chartCanvasType !== "svg") return null;

			var lines = helper(this.props, mouseXY, xScale, currentItem, show);

			if ((0, _utils.isNotDefined)(lines)) return null;

			return _react2.default.createElement(
				"g",
				{ className: "CrossHairCursor " },
				lines.map(function (each, idx) {
					return _react2.default.createElement("line", _extends({ key: idx }, each));
				})
			);
		}
	}]);

	return CrossHairCursor;
}(_react.Component);

CrossHairCursor.propTypes = {
	height: _react.PropTypes.number.isRequired,
	width: _react.PropTypes.number.isRequired,
	mouseXY: _react.PropTypes.array.isRequired,
	show: _react.PropTypes.bool,
	xScale: _react.PropTypes.func.isRequired,
	chartCanvasType: _react.PropTypes.string.isRequired,
	chartConfig: _react.PropTypes.array.isRequired,
	currentItem: _react.PropTypes.object,
	currentCharts: _react.PropTypes.arrayOf(_react.PropTypes.number),
	getCanvasContexts: _react.PropTypes.func,
	callbackForCanvasDraw: _react.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: _react.PropTypes.func

};

CrossHairCursor.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	strokeDasharray: "4, 2",
	snapX: true
};

function helper(props, mouseXY, xScale, currentItem, show) {
	var height = props.height;
	var width = props.width;
	var xAccessor = props.xAccessor;
	var snapX = props.snapX;
	var stroke = props.stroke;
	var opacity = props.opacity;
	var strokeDasharray = props.strokeDasharray;


	if (!show || (0, _utils.isNotDefined)(currentItem)) return null;

	var line1 = {
		x1: 0,
		x2: width,
		y1: mouseXY[1],
		y2: mouseXY[1],
		stroke: stroke, strokeDasharray: strokeDasharray, opacity: opacity
	};
	var x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];
	var line2 = {
		x1: x,
		x2: x,
		y1: 0,
		y2: height,
		stroke: stroke, strokeDasharray: strokeDasharray, opacity: opacity
	};
	return [line1, line2];
}
function drawOnCanvas(canvasContext, props) {
	var mouseXY = props.mouseXY;
	var currentCharts = props.currentCharts;
	var chartConfig = props.chartConfig;
	var currentItem = props.currentItem;
	var xScale = props.xScale;
	var show = props.show;

	// console.log(props.currentCharts);

	drawOnCanvasStatic(props, canvasContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem);
}

function drawOnCanvasStatic(props, ctx, show, xScale, mouseXY, currentCharts, chartConfig, currentItem) {
	var margin = props.margin;


	var lines = helper(props, mouseXY, xScale, currentItem, show);

	if ((0, _utils.isDefined)(lines)) {
		var originX = margin.left;
		var originY = 0.5 + margin.top;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(originX, originY);

		lines.forEach(function (line) {

			ctx.strokeStyle = (0, _utils.hexToRGBA)(line.stroke, line.opacity);
			var dashArray = line.strokeDasharray.split(",").map(function (d) {
				return +d;
			});
			ctx.setLineDash(dashArray);
			ctx.beginPath();
			ctx.moveTo(line.x1, line.y1);
			ctx.lineTo(line.x2, line.y2);
			ctx.stroke();
		});

		ctx.restore();
	}
}

exports.default = (0, _pure2.default)(CrossHairCursor, {
	width: _react.PropTypes.number.isRequired,
	height: _react.PropTypes.number.isRequired,
	margin: _react.PropTypes.object.isRequired,
	show: _react.PropTypes.bool,
	mouseXY: _react.PropTypes.array,

	xScale: _react.PropTypes.func.isRequired,
	xAccessor: _react.PropTypes.func.isRequired,
	chartCanvasType: _react.PropTypes.string.isRequired,
	chartConfig: _react.PropTypes.array.isRequired,
	currentItem: _react.PropTypes.object,
	currentCharts: _react.PropTypes.arrayOf(_react.PropTypes.number),

	getCanvasContexts: _react.PropTypes.func,
	callbackForCanvasDraw: _react.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: _react.PropTypes.func
});