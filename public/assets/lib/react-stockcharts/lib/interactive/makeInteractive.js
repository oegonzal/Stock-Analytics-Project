"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = makeInteractive;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _pure = require("../pure");

var _pure2 = _interopRequireDefault(_pure);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

function makeInteractive(InteractiveComponent, initialState) {
	var InteractiveComponentWrapper = function (_Component) {
		_inherits(InteractiveComponentWrapper, _Component);

		function InteractiveComponentWrapper(props) {
			_classCallCheck(this, InteractiveComponentWrapper);

			// this.subscription = this.subscription.bind(this);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InteractiveComponentWrapper).call(this, props));

			_this.updateInteractiveState = _this.updateInteractiveState.bind(_this);
			// var { subscribe, chartId } = props;

			// this.subscriptionIds = subscription.map(each => subscribe(chartId, each, this.subscription.bind(this, each)));
			_this.panHandler = _this.panHandler.bind(_this);
			_this.overrideInteractive = _this.overrideInteractive.bind(_this);
			return _this;
		}

		_createClass(InteractiveComponentWrapper, [{
			key: "panHandler",
			value: function panHandler(propOverride) {
				var _props = this.props;
				var forChart = _props.forChart;
				var id = _props.id;
				var getInteractiveState = _props.getInteractiveState;
				var chartConfig = propOverride.chartConfig;


				var singleChartConfig = chartConfig.filter(function (each) {
					return each.id === forChart;
				})[0];

				this.setState(_extends({}, propOverride, {
					chartConfig: singleChartConfig,
					interactiveState: getInteractiveState(forChart, id, initialState)
				}));
			}
		}, {
			key: "updateInteractiveState",
			value: function updateInteractiveState(interactive) {
				var _props2 = this.props;
				var setInteractiveState = _props2.setInteractiveState;
				var id = _props2.id;
				var forChart = _props2.forChart;

				setInteractiveState(id, forChart, interactive);
			}
		}, {
			key: "overrideInteractive",
			value: function overrideInteractive(newInteractiveState) {
				var callback = arguments.length <= 1 || arguments[1] === undefined ? _utils.noop : arguments[1];

				this.updateInteractiveState(newInteractiveState);

				this.setState({
					interactiveState: newInteractiveState
				}, callback);
			}
		}, {
			key: "componentWillMount",
			value: function componentWillMount() {
				this.componentWillReceiveProps(this.props);
			}
		}, {
			key: "componentWillReceiveProps",
			value: function componentWillReceiveProps(nextProps) {
				var _this2 = this;

				var plotData = nextProps.plotData;
				var xScale = nextProps.xScale;
				var chartConfig = nextProps.chartConfig;
				var forChart = nextProps.forChart;
				var id = nextProps.id;
				var getInteractiveState = nextProps.getInteractiveState;
				var mouseXY = nextProps.mouseXY;
				var currentItem = nextProps.currentItem;
				var currentCharts = nextProps.currentCharts;
				var eventMeta = nextProps.eventMeta;


				var singleChartConfig = chartConfig.filter(function (each) {
					return each.id === forChart;
				})[0];
				var interactiveState = getInteractiveState(forChart, id, initialState);

				var newState = {
					xScale: xScale,
					plotData: plotData,
					mouseXY: mouseXY,
					currentCharts: currentCharts,
					currentItem: currentItem,
					chartConfig: singleChartConfig,
					interactiveState: interactiveState,
					eventMeta: eventMeta
				};

				if ((0, _utils.isDefined)(eventMeta)) {
					// console.log(eventMeta.type)
					eventMeta.type.forEach(function (each) {
						var invoke = _this2.refs.interactive["on" + (0, _utils.capitalizeFirst)(each)];
						if ((0, _utils.isDefined)(invoke)) {
							interactiveState = invoke(newState);
						}
					});
				}

				this.updateInteractiveState(interactiveState);

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
							draw: this.panHandler
						});
					} else {
						callbackForCanvasDraw(temp[0], {
							id: id,
							type: "annotation",
							draw: this.panHandler
						});
					}
				}

				this.setState(_extends({}, newState, {
					interactiveState: interactiveState
				}), function () {
					if ((0, _utils.isDefined)(interactiveState)) {
						var _interactiveState = interactiveState;
						var status = _interactiveState.status;
						var callbackProps = _interactiveState.callbackProps;

						if ((0, _utils.isDefined)(status)) {
							var callback = "on" + (0, _utils.capitalizeFirst)(status);

							if ((0, _utils.isDefined)(_this2.props[callback])) {

								_this2.props[callback].apply(null, callbackProps);
							}
						}
					}
				});
			}
		}, {
			key: "removeLast",
			value: function removeLast() {
				var _props3 = this.props;
				var id = _props3.id;
				var forChart = _props3.forChart;
				var getInteractiveState = _props3.getInteractiveState;

				var interactive = getInteractiveState(forChart, id, initialState);

				if (this.refs.interactive.removeLast) {
					var newInteractive = this.refs.interactive.removeLast(interactive);
					this.updateInteractiveState(newInteractive);

					this.setState({
						interactiveState: newInteractive
					});
				}
			}
		}, {
			key: "terminate",
			value: function terminate() {
				var _props4 = this.props;
				var id = _props4.id;
				var forChart = _props4.forChart;
				var getInteractiveState = _props4.getInteractiveState;

				var interactive = getInteractiveState(forChart, id, initialState);

				if (this.refs.interactive.terminate) {
					var newInteractive = this.refs.interactive.terminate(interactive);
					this.updateInteractiveState(newInteractive);

					this.setState({
						interactiveState: newInteractive
					});
				}
			}
		}, {
			key: "render",
			value: function render() {
				/* var { id, forChart, getInteractiveState } = this.props;
    var interactive = getInteractiveState(forChart, id, initialState);
    	console.log(interactive)*/
				return _react2.default.createElement(InteractiveComponent, _extends({
					ref: "interactive"
				}, this.props, this.state, {
					overrideInteractive: this.overrideInteractive }));
				// return null;
			}
		}]);

		return InteractiveComponentWrapper;
	}(_react.Component);

	InteractiveComponentWrapper.displayName = getDisplayName(InteractiveComponent);

	InteractiveComponentWrapper.propTypes = {
		id: _react.PropTypes.number.isRequired,
		enabled: _react.PropTypes.bool.isRequired,
		forChart: _react.PropTypes.number.isRequired,

		/* comes from pure converted from context to prop - START */
		getInteractiveState: _react.PropTypes.func.isRequired,
		getCanvasContexts: _react.PropTypes.func,
		callbackForCanvasDraw: _react.PropTypes.func.isRequired,
		getAllCanvasDrawCallback: _react.PropTypes.func,
		chartCanvasType: _react.PropTypes.string.isRequired,
		setInteractiveState: _react.PropTypes.func.isRequired,
		plotData: _react.PropTypes.array.isRequired,
		xAccessor: _react.PropTypes.func.isRequired,
		xScale: _react.PropTypes.func.isRequired,
		chartConfig: _react.PropTypes.array.isRequired,
		currentItem: _react.PropTypes.object,
		show: _react.PropTypes.bool.isRequired,
		displayXAccessor: _react.PropTypes.func.isRequired
	};

	return (0, _pure2.default)(InteractiveComponentWrapper, {
		callbackForCanvasDraw: _react.PropTypes.func.isRequired,
		getAllCanvasDrawCallback: _react.PropTypes.func,
		chartCanvasType: _react.PropTypes.string,

		getInteractiveState: _react.PropTypes.func.isRequired,
		setInteractiveState: _react.PropTypes.func.isRequired,
		plotData: _react.PropTypes.array.isRequired,
		xAccessor: _react.PropTypes.func.isRequired,
		xScale: _react.PropTypes.func.isRequired,
		chartConfig: _react.PropTypes.array.isRequired,
		mouseXY: _react.PropTypes.array,
		currentItem: _react.PropTypes.object,
		currentCharts: _react.PropTypes.arrayOf(_react.PropTypes.number),
		eventMeta: _react.PropTypes.object,
		show: _react.PropTypes.bool.isRequired,
		displayXAccessor: _react.PropTypes.func.isRequired
	});
}
exports.default = makeInteractive;