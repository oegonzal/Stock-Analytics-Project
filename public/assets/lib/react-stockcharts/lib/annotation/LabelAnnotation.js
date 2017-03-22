"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defaultProps = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.helper = helper;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LabelAnnotation = function (_Component) {
	_inherits(LabelAnnotation, _Component);

	function LabelAnnotation(props) {
		_classCallCheck(this, LabelAnnotation);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LabelAnnotation).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(LabelAnnotation, [{
		key: "handleClick",
		value: function handleClick(e) {
			var onClick = this.props.onClick;


			if (onClick) {
				var _props = this.props;
				var xScale = _props.xScale;
				var yScale = _props.yScale;
				var datum = _props.datum;

				onClick({ xScale: xScale, yScale: yScale, datum: datum }, e);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props;
			var className = _props2.className;
			var textAnchor = _props2.textAnchor;
			var fontFamily = _props2.fontFamily;
			var fontSize = _props2.fontSize;
			var opacity = _props2.opacity;
			var rotate = _props2.rotate;
			var _props3 = this.props;
			var xAccessor = _props3.xAccessor;
			var xScale = _props3.xScale;
			var yScale = _props3.yScale;

			var _helper = helper(this.props, xAccessor, xScale, yScale);

			var xPos = _helper.xPos;
			var yPos = _helper.yPos;
			var fill = _helper.fill;
			var text = _helper.text;
			var tooltip = _helper.tooltip;


			return _react2.default.createElement(
				"g",
				{ className: className },
				_react2.default.createElement(
					"title",
					null,
					tooltip
				),
				_react2.default.createElement(
					"text",
					{ x: xPos, y: yPos,
						fontFamily: fontFamily, fontSize: fontSize,
						fill: fill,
						opacity: opacity,
						transform: "rotate(" + rotate + ", " + xPos + ", " + yPos + ")",
						onClick: this.handleClick,
						textAnchor: textAnchor },
					text
				)
			);
		}
	}]);

	return LabelAnnotation;
}(_react.Component);

function helper(props, xAccessor, xScale, yScale) {
	var x = props.x;
	var y = props.y;
	var datum = props.datum;
	var fill = props.fill;
	var text = props.text;
	var tooltip = props.tooltip;
	var plotData = props.plotData;


	var xFunc = _d2.default.functor(x);
	var yFunc = _d2.default.functor(y);

	var xPos = xFunc({ xScale: xScale, xAccessor: xAccessor, datum: datum, plotData: plotData });
	var yPos = yFunc({ yScale: yScale, datum: datum, plotData: plotData });


	return {
		xPos: xPos,
		yPos: yPos,
		text: _d2.default.functor(text)(datum),
		fill: _d2.default.functor(fill)(datum),
		tooltip: _d2.default.functor(tooltip)(datum)
	};
}

LabelAnnotation.propTypes = {
	className: _react.PropTypes.string,
	text: _react.PropTypes.string,
	textAnchor: _react.PropTypes.string,
	fontFamily: _react.PropTypes.string,
	fontSize: _react.PropTypes.number,
	opacity: _react.PropTypes.number,
	rotate: _react.PropTypes.number,
	onClick: _react.PropTypes.func,
	xAccessor: _react.PropTypes.func,
	xScale: _react.PropTypes.func,
	yScale: _react.PropTypes.func,
	datum: _react.PropTypes.object,
	x: _react.PropTypes.func,
	y: _react.PropTypes.func
};

var defaultProps = exports.defaultProps = {
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	opacity: 1,
	rotate: 0,
	x: function x(_ref) {
		var xScale = _ref.xScale;
		var xAccessor = _ref.xAccessor;
		var datum = _ref.datum;
		return xScale(xAccessor(datum));
	}
};

LabelAnnotation.defaultProps = _extends({}, defaultProps, {
	className: "react-stockcharts-labelannotation"
});

exports.default = LabelAnnotation;