"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

var _utils = require("./utils");

var _ChartDataUtil = require("./utils/ChartDataUtil");

var _EventHandler = require("./EventHandler");

var _EventHandler2 = _interopRequireDefault(_EventHandler);

var _CanvasContainer = require("./CanvasContainer");

var _CanvasContainer2 = _interopRequireDefault(_CanvasContainer);

var _evaluator = require("./scale/evaluator");

var _evaluator2 = _interopRequireDefault(_evaluator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CANDIDATES_FOR_RESET = ["seriesName", /* "data",*/
"xScaleProvider", /* "xAccessor",*/"map", "indexAccessor", "indexMutator"];

function shouldResetChart(thisProps, nextProps) {
	return !CANDIDATES_FOR_RESET.every(function (key) {
		var result = (0, _utils.shallowEqual)(thisProps[key], nextProps[key]);
		// console.log(key, result);
		return result;
	});
}

function getDimensions(props) {
	return {
		height: props.height - props.margin.top - props.margin.bottom,
		width: props.width - props.margin.left - props.margin.right
	};
}

function calculateFullData(props) {
	var inputData = props.data;
	var calculator = props.calculator;
	var plotFull = props.plotFull;
	var xScaleProp = props.xScale;
	var inputXAccesor = props.xAccessor;
	var map = props.map;
	var xScaleProvider = props.xScaleProvider;
	var indexAccessor = props.indexAccessor;
	var indexMutator = props.indexMutator;


	var wholeData = (0, _utils.isDefined)(plotFull) ? plotFull : inputXAccesor === _utils.identity;

	// xScale = discontinuousTimeScaleProvider(data);
	var dimensions = getDimensions(props);
	var evaluate = (0, _evaluator2.default)()
	// .allowedIntervals(allowedIntervals)
	// .intervalCalculator(intervalCalculator)
	.xAccessor(inputXAccesor)
	// .discontinuous(discontinuous)
	.indexAccessor(indexAccessor).indexMutator(indexMutator).map(map).useWholeData(wholeData).width(dimensions.width).scaleProvider(xScaleProvider).xScale(xScaleProp).calculator(calculator);

	var _evaluate = evaluate(inputData);

	var xAccessor = _evaluate.xAccessor;
	var displayXAccessor = _evaluate.displayXAccessor;
	var xScale = _evaluate.xScale;
	var filterData = _evaluate.filterData;
	var lastItem = _evaluate.lastItem;


	return { xAccessor: xAccessor, displayXAccessor: displayXAccessor, xScale: xScale, filterData: filterData, lastItem: lastItem };
}

function calculateState(props) {
	var inputXAccesor = props.xAccessor;
	var xExtentsProp = props.xExtents;
	var data = props.data;


	var extent = typeof xExtentsProp === "function" ? xExtentsProp(data) : _d2.default.extent(xExtentsProp.map(function (d) {
		return _d2.default.functor(d);
	}).map(function (each) {
		return each(data, inputXAccesor);
	}));

	var _calculateFullData = calculateFullData(props);

	var xAccessor = _calculateFullData.xAccessor;
	var displayXAccessor = _calculateFullData.displayXAccessor;
	var xScale = _calculateFullData.xScale;
	var filterData = _calculateFullData.filterData;
	var lastItem = _calculateFullData.lastItem;

	var _filterData = filterData(extent, inputXAccesor);

	var plotData = _filterData.plotData;
	var domain = _filterData.domain;


	return {
		plotData: plotData,
		filterData: filterData,
		xScale: xScale.domain(domain),
		xAccessor: xAccessor,
		displayXAccessor: displayXAccessor,
		dataAltered: false,
		lastItem: lastItem
	};
}

function getCursorStyle(children) {
	var style = "\n\t.react-stockcharts-grabbing-cursor {\n\t\tcursor: grabbing;\n\t\tcursor: -moz-grabbing;\n\t\tcursor: -webkit-grabbing;\n\t}\n\t.react-stockcharts-crosshair-cursor {\n\t\tcursor: crosshair;\n\t}\n\t.react-stockcharts-toottip-hover {\n\t\tpointer-events: all;\n\t\tcursor: pointer;\n\t}";
	var tooltipStyle = "\n\t.react-stockcharts-avoid-interaction {\n  \t\tpointer-events: none;\n\t}\n\t.react-stockcharts-default-cursor {\n\t\tcursor: default;\n\t}\n\t.react-stockcharts-move-cursor {\n\t\tcursor: move;\n\t}\n\t.react-stockcharts-ns-resize-cursor {\n\t\tcursor: ns-resize;\n\t}\n\t.react-stockcharts-ew-resize-cursor {\n\t\tcursor: ew-resize;\n\t}";
	/* return (<style
 	type="text/css"
 	dangerouslySetInnerHTML={{
 		__html: shouldShowCrossHairStyle(children) ? style + tooltipStyle : tooltipStyle
 	}}></style>);*/
	return _react2.default.createElement(
		"style",
		{ type: "text/css" },
		(0, _ChartDataUtil.shouldShowCrossHairStyle)(children) ? style + tooltipStyle : tooltipStyle
	);
}

var ChartCanvas = function (_Component) {
	_inherits(ChartCanvas, _Component);

	function ChartCanvas() {
		_classCallCheck(this, ChartCanvas);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChartCanvas).call(this));

		_this.getDataInfo = _this.getDataInfo.bind(_this);
		_this.getCanvases = _this.getCanvases.bind(_this);
		return _this;
	}

	_createClass(ChartCanvas, [{
		key: "getDataInfo",
		value: function getDataInfo() {
			return this.refs.chartContainer.getDataInfo();
		}
	}, {
		key: "getCanvases",
		value: function getCanvases() {
			if (this.refs && this.refs.canvases) {
				return this.refs.canvases.getCanvasContexts();
			}
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			this.setState(calculateState(this.props));
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var reset = shouldResetChart(this.props, nextProps);
			// console.log("shouldResetChart =", reset);

			/*
   plotData,
   filterData,
   xScale: xScale.domain(domain),
   xAccessor,
   dataAltered: false,
   lastItem, */

			if (reset) {
				if (process.env.NODE_ENV !== "production") console.log("RESET CHART, one or more of these props changed", CANDIDATES_FOR_RESET);
				this.setState(calculateState(nextProps));
			} else if (!(0, _utils.shallowEqual)(this.props.xExtents, nextProps.xExtents)) {
				if (process.env.NODE_ENV !== "production") console.log("xExtents changed");
				// since the xExtents changed update plotData, xScale, filterData to state

				var _calculateState = calculateState(nextProps);

				var plotData = _calculateState.plotData;
				var xScale = _calculateState.xScale;
				var xAccessor = _calculateState.xAccessor;
				var filterData = _calculateState.filterData;
				var lastItem = _calculateState.lastItem;

				this.setState({ plotData: plotData, xScale: xScale, xAccessor: xAccessor, filterData: filterData, lastItem: lastItem, dataAltered: false });
			} else if (this.props.data !== nextProps.data) {
				if (process.env.NODE_ENV !== "production") console.log("data is changed but seriesName did not");
				// this means there are more points pushed/removed or existing points are altered

				var _calculateFullData2 = calculateFullData(nextProps);

				var _xScale = _calculateFullData2.xScale;
				var _xAccessor = _calculateFullData2.xAccessor;
				var _filterData2 = _calculateFullData2.filterData;
				var _lastItem = _calculateFullData2.lastItem;

				this.setState({ xScale: _xScale, xAccessor: _xAccessor, filterData: _filterData2, lastItem: _lastItem, dataAltered: true });
			} else if (!(0, _utils.shallowEqual)(this.props.calculator, nextProps.calculator)) {
				if (process.env.NODE_ENV !== "production") console.log("calculator changed");
				// data did not change but calculator changed, so update only the filterData to state

				var _calculateFullData3 = calculateFullData(nextProps);

				var _xAccessor2 = _calculateFullData3.xAccessor;
				var _filterData3 = _calculateFullData3.filterData;
				var _lastItem2 = _calculateFullData3.lastItem;

				this.setState({ xAccessor: _xAccessor2, filterData: _filterData3, lastItem: _lastItem2, dataAltered: false });
			} else {
				if (process.env.NODE_ENV !== "production") console.log("Trivial change, may be width/height or type changed, but that does not matter");
			}
		}
	}, {
		key: "render",
		value: function render() {
			var cursor = getCursorStyle(this.props.children);

			var _props = this.props;
			var type = _props.type;
			var height = _props.height;
			var width = _props.width;
			var margin = _props.margin;
			var className = _props.className;
			var zIndex = _props.zIndex;
			var postCalculator = _props.postCalculator;
			var flipXScale = _props.flipXScale;
			var padding = this.props.padding;
			var _state = this.state;
			var plotData = _state.plotData;
			var filterData = _state.filterData;
			var xScale = _state.xScale;
			var xAccessor = _state.xAccessor;
			var dataAltered = _state.dataAltered;
			var lastItem = _state.lastItem;
			var displayXAccessor = _state.displayXAccessor;

			var dimensions = getDimensions(this.props);
			// var stateProps = { fullData, plotData, showingInterval, xExtentsCalculator, xScale, xAccessor, dataAltered };
			var props = { padding: padding, type: type, margin: margin, postCalculator: postCalculator };
			var stateProps = { plotData: plotData, filterData: filterData, xScale: xScale, xAccessor: xAccessor, dataAltered: dataAltered, lastItem: lastItem, displayXAccessor: displayXAccessor };
			return _react2.default.createElement(
				"div",
				{ style: { position: "relative", height: height, width: width }, className: className },
				_react2.default.createElement(_CanvasContainer2.default, { ref: "canvases", width: width, height: height, type: type, zIndex: zIndex }),
				_react2.default.createElement(
					"svg",
					{ className: className, width: width, height: height, style: { position: "absolute", zIndex: zIndex + 5 } },
					cursor,
					_react2.default.createElement(
						"defs",
						null,
						_react2.default.createElement(
							"clipPath",
							{ id: "chart-area-clip" },
							_react2.default.createElement("rect", { x: "0", y: "0", width: dimensions.width, height: dimensions.height })
						)
					),
					_react2.default.createElement(
						"g",
						{ transform: "translate(" + (margin.left + 0.5) + ", " + (margin.top + 0.5) + ")" },
						_react2.default.createElement(
							_EventHandler2.default,
							_extends({ ref: "chartContainer"
							}, props, stateProps, {
								direction: flipXScale ? -1 : 1,
								dimensions: dimensions,
								canvasContexts: this.getCanvases }),
							this.props.children
						)
					)
				)
			);
		}
	}]);

	return ChartCanvas;
}(_react.Component);

/*
							lastItem={last(data)}

*/

ChartCanvas.propTypes = {
	width: _react.PropTypes.number.isRequired,
	height: _react.PropTypes.number.isRequired,
	margin: _react.PropTypes.object,
	// interval: PropTypes.oneOf(["D", "W", "M"]), // ,"m1", "m5", "m15", "W", "M"
	type: _react.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	data: _react.PropTypes.array.isRequired,
	// initialDisplay: PropTypes.number,
	calculator: _react.PropTypes.arrayOf(_react.PropTypes.func).isRequired,
	xAccessor: _react.PropTypes.func,
	xExtents: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.func]).isRequired,
	// xScale: PropTypes.func.isRequired,
	className: _react.PropTypes.string,
	seriesName: _react.PropTypes.string.isRequired,
	zIndex: _react.PropTypes.number,
	children: _react.PropTypes.node.isRequired,
	xScaleProvider: function xScaleProvider(props, propName /* , componentName */) {
		if ((0, _utils.isDefined)(props[propName]) && typeof props[propName] === "function" && (0, _utils.isDefined)(props.xScale)) {
			return new Error("Do not define both xScaleProvider and xScale choose only one");
		}
	},
	xScale: function xScale(props, propName /* , componentName */) {
		if ((0, _utils.isDefined)(props[propName]) && typeof props[propName] === "function" && (0, _utils.isDefined)(props.xScaleProvider)) {
			return new Error("Do not define both xScaleProvider and xScale choose only one");
		}
	},
	postCalculator: _react.PropTypes.func.isRequired,
	flipXScale: _react.PropTypes.bool.isRequired,
	padding: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.shape({
		left: _react.PropTypes.number,
		right: _react.PropTypes.number
	})]).isRequired
};

ChartCanvas.defaultProps = {
	margin: { top: 20, right: 30, bottom: 30, left: 80 },
	indexAccessor: function indexAccessor(d) {
		return d.idx;
	},
	indexMutator: function indexMutator(d, idx) {
		return _extends({}, d, { idx: idx });
	},
	map: _utils.identity,
	type: "hybrid",
	calculator: [],
	className: "react-stockchart",
	zIndex: 1,
	xExtents: [_d2.default.min, _d2.default.max],
	// dataEvaluator: evaluator,
	postCalculator: _utils.identity,
	padding: 0,
	xAccessor: _utils.identity,
	flipXScale: false
};

ChartCanvas.ohlcv = function (d) {
	return { date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume };
};

exports.default = ChartCanvas;