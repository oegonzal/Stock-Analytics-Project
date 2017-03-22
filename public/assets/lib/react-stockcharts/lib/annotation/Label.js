"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _pure = require("../pure");

var _pure2 = _interopRequireDefault(_pure);

var _utils = require("../utils");

var _LabelAnnotation = require("./LabelAnnotation");

var _LabelAnnotation2 = _interopRequireDefault(_LabelAnnotation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Label = function (_Component) {
	_inherits(Label, _Component);

	function Label() {
		_classCallCheck(this, Label);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Label).apply(this, arguments));
	}

	_createClass(Label, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _props = this.props;
			var selectCanvas = _props.selectCanvas;
			var getCanvasContexts = _props.getCanvasContexts;
			var chartConfig = _props.chartConfig;
			var chartCanvasType = _props.chartCanvasType;

			if (chartCanvasType !== "svg") {
				var ctx = selectCanvas(getCanvasContexts());
				var yScale = getYScale(chartConfig);

				drawOnCanvas2(_extends({}, this.props, { yScale: yScale, text: getText(this.props) }), ctx);
			}
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			this.componentDidMount();
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props;
			var chartConfig = _props2.chartConfig;
			var chartCanvasType = _props2.chartCanvasType;

			if (chartCanvasType !== "svg") return null;

			return _react2.default.createElement(_LabelAnnotation2.default, _extends({ yScale: getYScale(chartConfig) }, this.props, { text: getText(this.props) }));
		}
	}]);

	return Label;
}(_react.Component);

function getText(props) {
	return _d2.default.functor(props.text)(props);
}

function getYScale(chartConfig) {
	return Array.isArray(chartConfig) ? undefined : chartConfig.yScale;
}

Label.propTypes = {
	className: _react.PropTypes.string,
	selectCanvas: _react.PropTypes.func.isRequired,
	getCanvasContexts: _react.PropTypes.func,
	chartCanvasType: _react.PropTypes.string,
	chartConfig: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]).isRequired,
	text: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]).isRequired
};

Label.defaultProps = _extends({}, _LabelAnnotation.defaultProps, {
	selectCanvas: function selectCanvas(canvases) {
		return canvases.bg;
	}
});

function drawOnCanvas2(props, ctx) {
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	var canvasOriginX = props.canvasOriginX;
	var canvasOriginY = props.canvasOriginY;
	var margin = props.margin;


	if ((0, _utils.isDefined)(canvasOriginX)) ctx.translate(canvasOriginX, canvasOriginY);else ctx.translate(margin.left + 0.5, margin.top + 0.5);

	drawOnCanvas(props, ctx);

	ctx.restore();
}

function drawOnCanvas(props, ctx) {
	var textAnchor = props.textAnchor;
	var fontFamily = props.fontFamily;
	var fontSize = props.fontSize;
	var opacity = props.opacity;
	var xAccessor = props.xAccessor;
	var xScale = props.xScale;
	var yScale = props.yScale;
	var rotate = props.rotate;

	var _helper = (0, _LabelAnnotation.helper)(props, xAccessor, xScale, yScale);

	var xPos = _helper.xPos;
	var yPos = _helper.yPos;
	var fill = _helper.fill;
	var text = _helper.text;


	var radians = rotate / 180 * Math.PI;
	ctx.save();
	ctx.translate(xPos, yPos);
	ctx.rotate(radians);

	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	ctx.beginPath();
	ctx.fillText(text, 0, 0);
	ctx.restore();
}

exports.default = (0, _pure2.default)(Label, {
	xScale: _react.PropTypes.func,
	canvasOriginX: _react.PropTypes.number,
	canvasOriginY: _react.PropTypes.number,
	xAccessor: _react.PropTypes.func,
	chartConfig: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]).isRequired,
	chartCanvasType: _react.PropTypes.string,
	getCanvasContexts: _react.PropTypes.func,
	interval: _react.PropTypes.string,
	plotData: _react.PropTypes.array,
	margin: _react.PropTypes.object
});