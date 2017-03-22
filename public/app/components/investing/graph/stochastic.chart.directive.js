(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('stochasticChart', function(api, $timeout){
		return {
			restrict: 'E',
			require: '^^graphPage',
			replace: 'false',
			scope: { 
				chartOptions: '=chartOptions' 
			},
			link: function(scope, element, attrs, pageCtrl){

				var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

				var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

				function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

				function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

				function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

				var _ReStock = ReStock;
				var ChartCanvas = _ReStock.ChartCanvas;
				var Chart = _ReStock.Chart;
				var series = _ReStock.series;
				var scale = _ReStock.scale;
				var coordinates = _ReStock.coordinates;
				var tooltip = _ReStock.tooltip;
				var axes = _ReStock.axes;
				var indicator = _ReStock.indicator;
				var helper = _ReStock.helper;
				var CandlestickSeries = series.CandlestickSeries;
				var BarSeries = series.BarSeries;
				var LineSeries = series.LineSeries;
				var AreaSeries = series.AreaSeries;
				var StochasticSeries = series.StochasticSeries;
				var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
				var CrossHairCursor = coordinates.CrossHairCursor;
				var MouseCoordinateX = coordinates.MouseCoordinateX;
				var MouseCoordinateY = coordinates.MouseCoordinateY;
				var CurrentCoordinate = coordinates.CurrentCoordinate;
				var EdgeIndicator = coordinates.EdgeIndicator;
				var OHLCTooltip = tooltip.OHLCTooltip;
				var MovingAverageTooltip = tooltip.MovingAverageTooltip;
				var StochasticTooltip = tooltip.StochasticTooltip;
				var XAxis = axes.XAxis;
				var YAxis = axes.YAxis;
				var stochasticOscillator = indicator.stochasticOscillator;
				var ema = indicator.ema;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var CandleStickChartWithFullStochasticsIndicator = function (_React$Component) {
					_inherits(CandleStickChartWithFullStochasticsIndicator, _React$Component);

					function CandleStickChartWithFullStochasticsIndicator() {
						_classCallCheck(this, CandleStickChartWithFullStochasticsIndicator);

						return _possibleConstructorReturn(this, (CandleStickChartWithFullStochasticsIndicator.__proto__ || Object.getPrototypeOf(CandleStickChartWithFullStochasticsIndicator)).apply(this, arguments));
					}

					_createClass(CandleStickChartWithFullStochasticsIndicator, [{
						key: "render",
						value: function render() {
							var height = 750;
							var _props = this.props;
							var data = _props.data;
							var type = _props.type;
							var width = _props.width;
							var ratio = _props.ratio;


							var margin = { left: 70, right: 70, top: 20, bottom: 30 };

							var gridHeight = height - margin.top - margin.bottom;
							var gridWidth = width - margin.left - margin.right;

							var showGrid = true;
							var yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 } : {};
							var xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 } : {};

							var ema20 = ema().id(0).windowSize(20).merge(function (d, c) {
								d.ema20 = c;
							}).accessor(function (d) {
								return d.ema20;
							});

							var ema50 = ema().id(2).windowSize(50).merge(function (d, c) {
								d.ema50 = c;
							}).accessor(function (d) {
								return d.ema50;
							});

							var slowSTO = stochasticOscillator().windowSize(14).kWindowSize(1).merge(function (d, c) {
								d.slowSTO = c;
							}).accessor(function (d) {
								return d.slowSTO;
							});
							var fastSTO = stochasticOscillator().windowSize(14).kWindowSize(3).merge(function (d, c) {
								d.fastSTO = c;
							}).accessor(function (d) {
								return d.fastSTO;
							});
							var fullSTO = stochasticOscillator().windowSize(14).kWindowSize(3).dWindowSize(4).merge(function (d, c) {
								d.fullSTO = c;
							}).accessor(function (d) {
								return d.fullSTO;
							});

							return React.createElement(
								ChartCanvas,
								{ ratio: ratio, width: width, height: 750,
									margin: margin, type: type,
									seriesName: "MSFT",
									data: data, calculator: [ema20, ema50, slowSTO, fastSTO, fullSTO],
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider,
									xExtents: [new Date(2012, 0, 1), new Date(2012, 6, 2)] },
								React.createElement(
									Chart,
									{ id: 1, height: 325,
										yExtents: function yExtents(d) {
											return [d.high, d.low];
										},
										padding: { top: 10, bottom: 20 } },
									React.createElement(YAxis, _extends({ axisAt: "right", orient: "right", ticks: 5 }, yGrid)),
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom", showTicks: false, outerTickSize: 0 }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(CandlestickSeries, null),
									React.createElement(LineSeries, { yAccessor: ema20.accessor(), stroke: ema20.stroke() }),
									React.createElement(LineSeries, { yAccessor: ema50.accessor(), stroke: ema50.stroke() }),
									React.createElement(CurrentCoordinate, { yAccessor: ema20.accessor(), fill: ema20.stroke() }),
									React.createElement(CurrentCoordinate, { yAccessor: ema50.accessor(), fill: ema50.stroke() }),
									React.createElement(EdgeIndicator, { itemType: "last", orient: "right", edgeAt: "right",
										yAccessor: function yAccessor(d) {
											return d.close;
										}, fill: function fill(d) {
											return d.close > d.open ? "#6BA583" : "#FF0000";
										} }),
									React.createElement(OHLCTooltip, { origin: [-40, -10] }),
									React.createElement(MovingAverageTooltip, { onClick: function onClick(e) {
											return console.log(e);
										}, origin: [-38, 15],
										calculators: [ema20, ema50] })
								),
								React.createElement(
									Chart,
									{ id: 2,
										yExtents: function yExtents(d) {
											return d.volume;
										},
										height: 100, origin: function origin(w, h) {
											return [0, h - 475];
										} },
									React.createElement(YAxis, { axisAt: "left", orient: "left", ticks: 5, tickFormat: d3.format(".0s") }),
									React.createElement(MouseCoordinateY, {
										at: "left",
										orient: "left",
										displayFormat: d3.format(".4s") }),
									React.createElement(BarSeries, { yAccessor: function yAccessor(d) {
											return d.volume;
										}, fill: function fill(d) {
											return d.close > d.open ? "#6BA583" : "#FF0000";
										} })
								),
								React.createElement(
									Chart,
									{ id: 3,
										yExtents: slowSTO.domain(),
										height: 125, origin: function origin(w, h) {
											return [0, h - 375];
										}, padding: { top: 10, bottom: 10 } },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom", showTicks: false, outerTickSize: 0 }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 2, tickValues: slowSTO.tickValues() }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(StochasticSeries, { calculator: slowSTO }),
									React.createElement(
										StochasticTooltip,
										{ calculator: slowSTO, origin: [-38, 15] },
										"Fast STO"
									)
								),
								React.createElement(
									Chart,
									{ id: 4,
										yExtents: fastSTO.domain(),
										height: 125, origin: function origin(w, h) {
											return [0, h - 250];
										}, padding: { top: 10, bottom: 10 } },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom", showTicks: false, outerTickSize: 0 }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 2, tickValues: fastSTO.tickValues() }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(StochasticSeries, { calculator: fastSTO }),
									React.createElement(
										StochasticTooltip,
										{ calculator: fastSTO, origin: [-38, 15] },
										"Slow STO"
									)
								),
								React.createElement(
									Chart,
									{ id: 5,
										yExtents: fullSTO.domain(),
										height: 125, origin: function origin(w, h) {
											return [0, h - 125];
										}, padding: { top: 10, bottom: 10 } },
									React.createElement(XAxis, _extends({ axisAt: "bottom", orient: "bottom" }, xGrid)),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 2, tickValues: fullSTO.tickValues() }),
									React.createElement(MouseCoordinateX, {
										at: "bottom",
										orient: "bottom",
										displayFormat: d3.timeFormat("%Y-%m-%d") }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(StochasticSeries, { calculator: fullSTO }),
									React.createElement(
										StochasticTooltip,
										{ calculator: fullSTO, origin: [-38, 15] },
										"Full STO"
									)
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return CandleStickChartWithFullStochasticsIndicator;
				}(React.Component);

				CandleStickChartWithFullStochasticsIndicator.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				CandleStickChartWithFullStochasticsIndicator.defaultProps = {
					type: "svg"
				};
				CandleStickChartWithFullStochasticsIndicator = fitWidth(CandleStickChartWithFullStochasticsIndicator);

				var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
				d3["tsv"]("//rrag.github.io/react-stockcharts/data/MSFT.tsv", function (err, data) {
					/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */
					data.forEach(function (d, i) {
						d.date = new Date(d3.timeParse("%Y-%m-%d")(d.date).getTime());
						d.open = +d.open;
						d.high = +d.high;
						d.low = +d.low;
						d.close = +d.close;
						d.volume = +d.volume;
						// console.log(d);
					});
					/* change the type from hybrid to svg to compare the performance between svg and canvas */
					ReactDOM.render(React.createElement(
						TypeChooser,
						{ type: "hybrid" },
						function (type) {
							return React.createElement(CandleStickChartWithFullStochasticsIndicator, { data: data, type: type });
						}
					), element[0]);
				});

			}
		};
	});
}());