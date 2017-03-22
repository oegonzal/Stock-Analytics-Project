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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Annotate = function (_Component) {
	_inherits(Annotate, _Component);

	function Annotate(props) {
		_classCallCheck(this, Annotate);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Annotate).call(this, props));

		_this.annotate = _this.annotate.bind(_this);
		return _this;
	}

	_createClass(Annotate, [{
		key: "annotate",
		value: function annotate(_ref) {
			var xScale = _ref.xScale;
			var chartConfig = _ref.chartConfig;
			var plotData = _ref.plotData;
			var chartId = this.props.chartId;
			var yScale = chartConfig.filter(function (each) {
				return each.id === chartId;
			})[0].yScale;

			this.setState({ plotData: plotData, xScale: xScale, yScale: yScale });
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var plotData = nextProps.plotData;
			var xScale = nextProps.xScale;
			var chartConfig = nextProps.chartConfig;
			var chartId = nextProps.chartId;
			var yScale = chartConfig.filter(function (each) {
				return each.id === chartId;
			})[0].yScale;


			this.setState({ plotData: plotData, xScale: xScale, yScale: yScale });

			var id = nextProps.id;
			var chartCanvasType = nextProps.chartCanvasType;
			var callbackForCanvasDraw = nextProps.callbackForCanvasDraw;
			var getAllCanvasDrawCallback = nextProps.getAllCanvasDrawCallback;


			if (chartCanvasType !== "svg") {
				var temp = getAllCanvasDrawCallback().filter(function (each) {
					return each.type === "annotation";
				}).filter(function (each) {
					return each.id === id;
				});
				if (temp.length === 0) {
					callbackForCanvasDraw({
						id: id,
						type: "annotation",
						draw: this.annotate
					});
				} else {
					callbackForCanvasDraw(temp[0], {
						id: id,
						type: "annotation",
						draw: this.annotate
					});
				}
			}
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			this.componentWillReceiveProps(this.props);
		}
	}, {
		key: "render",
		value: function render() {
			var _state = this.state;
			var yScale = _state.yScale;
			var xScale = _state.xScale;
			var plotData = _state.plotData;
			var _props = this.props;
			var className = _props.className;
			var xAccessor = _props.xAccessor;
			var usingProps = _props.usingProps;
			var Annotation = _props.with;

			var data = helper(this.props, plotData);

			return _react2.default.createElement(
				"g",
				{ className: className },
				data.map(function (d, idx) {
					return _react2.default.createElement(Annotation, _extends({ key: idx
					}, usingProps, {
						xScale: xScale,
						yScale: yScale,
						xAccessor: xAccessor,
						plotData: plotData,
						datum: d }));
				})
			);
		}
	}]);

	return Annotate;
}(_react.Component);

Annotate.propTypes = {
	className: _react.PropTypes.string.isRequired,
	id: _react.PropTypes.number.isRequired,
	chartId: _react.PropTypes.number.isRequired,
	xAccessor: _react.PropTypes.func.isRequired,
	xScale: _react.PropTypes.func.isRequired,
	plotData: _react.PropTypes.array.isRequired,
	with: _react.PropTypes.func,
	when: _react.PropTypes.func,
	usingProps: _react.PropTypes.object
};

Annotate.defaultProps = {
	className: "react-stockcharts-annotate react-stockcharts-default-cursor"
};

function helper(_ref2, plotData) {
	var when = _ref2.when;

	return plotData.filter(when);
}

exports.default = (0, _pure2.default)(Annotate, {
	callbackForCanvasDraw: _react.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: _react.PropTypes.func,
	chartConfig: _react.PropTypes.array.isRequired,
	chartCanvasType: _react.PropTypes.string,
	xScale: _react.PropTypes.func.isRequired,
	xAccessor: _react.PropTypes.func.isRequired,
	plotData: _react.PropTypes.array.isRequired
});