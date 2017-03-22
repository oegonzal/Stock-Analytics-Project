(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('rsiChart', function(helperService){
		return {
			restrict: 'E',
			require: '^^graphPage',
			replace: 'false',
			scope: { 
				chartOptions: '=chartOptions' 
			},
			link: function(scope, element, attrs, pageCtrl){

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
				var RSISeries = series.RSISeries;
				var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
				var CrossHairCursor = coordinates.CrossHairCursor;
				var MouseCoordinateX = coordinates.MouseCoordinateX;
				var MouseCoordinateY = coordinates.MouseCoordinateY;
				var CurrentCoordinate = coordinates.CurrentCoordinate;
				var EdgeIndicator = coordinates.EdgeIndicator;
				var OHLCTooltip = tooltip.OHLCTooltip;
				var MovingAverageTooltip = tooltip.MovingAverageTooltip;
				var SingleValueTooltip = tooltip.SingleValueTooltip;
				var RSITooltip = tooltip.RSITooltip;
				var XAxis = axes.XAxis;
				var YAxis = axes.YAxis;
				var rsi = indicator.rsi;
				var atr = indicator.atr;
				var ema = indicator.ema;
				var sma = indicator.sma;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var CandleStickChartWithRSIIndicator = function (_React$Component) {
					_inherits(CandleStickChartWithRSIIndicator, _React$Component);

					function CandleStickChartWithRSIIndicator() {
						_classCallCheck(this, CandleStickChartWithRSIIndicator);

						return _possibleConstructorReturn(this, (CandleStickChartWithRSIIndicator.__proto__ || Object.getPrototypeOf(CandleStickChartWithRSIIndicator)).apply(this, arguments));
					}

					_createClass(CandleStickChartWithRSIIndicator, [{
						key: "render",
						value: function render() {
							var _props = this.props;
							var data = _props.data;
							var type = _props.type;
							var width = _props.width;
							var ratio = _props.ratio;

							var ema26 = ema().id(0).windowSize(26).merge(function (d, c) {
								d.ema26 = c;
							}).accessor(function (d) {
								return d.ema26;
							});

							var ema12 = ema().id(1).windowSize(12).merge(function (d, c) {
								d.ema12 = c;
							}).accessor(function (d) {
								return d.ema12;
							});

							var smaVolume50 = sma().id(1).windowSize(10).sourcePath("volume").merge(function (d, c) {
								d.smaVolume50 = c;
							}).accessor(function (d) {
								return d.smaVolume50;
							});

							var rsiCalculator = rsi().windowSize(14).merge(function (d, c) {
								d.rsi = c;
							}).accessor(function (d) {
								return d.rsi;
							});

							var atr14 = atr().windowSize(14).merge(function (d, c) {
								d.atr14 = c;
							}).accessor(function (d) {
								return d.atr14;
							});

							return React.createElement(
								ChartCanvas,
								{ ratio: ratio, width: width, height: 600,
									margin: { left: 70, right: 70, top: 20, bottom: 30 }, type: type,
									seriesName: "MSFT",
									data: data, calculator: [ema26, ema12, smaVolume50, rsiCalculator, atr14],
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider,
									//xExtents: [new Date(2012, 0, 1), new Date(2012, 6, 2)] 
								},
								React.createElement(
									Chart,
									{ id: 1, height: 300,
										yExtents: [function (d) {
											return [d.high, d.low];
										}, ema26.accessor(), ema12.accessor()],
										padding: { top: 10, bottom: 20 } },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom", showTicks: false, outerTickSize: 0 }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 5 }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(CandlestickSeries, null),
									React.createElement(LineSeries, { yAccessor: ema26.accessor(), stroke: ema26.stroke() }),
									React.createElement(LineSeries, { yAccessor: ema12.accessor(), stroke: ema12.stroke() }),
									React.createElement(CurrentCoordinate, { yAccessor: ema26.accessor(), fill: ema26.stroke() }),
									React.createElement(CurrentCoordinate, { yAccessor: ema12.accessor(), fill: ema12.stroke() }),
									React.createElement(EdgeIndicator, { itemType: "last", orient: "right", edgeAt: "right",
										yAccessor: function yAccessor(d) {
											return d.close;
										}, fill: function fill(d) {
											return d.close > d.open ? "#6BA583" : "#FF0000";
										} }),
									React.createElement(OHLCTooltip, { origin: [-40, 0] }),
									React.createElement(MovingAverageTooltip, { onClick: function onClick(e) {
											return console.log(e);
										}, origin: [-38, 15],
										calculators: [ema26, ema12] })
								),
								React.createElement(
									Chart,
									{ id: 2, height: 150,
										yExtents: [function (d) {
											return d.volume;
										}, smaVolume50.accessor()],
										origin: function origin(w, h) {
											return [0, h - 400];
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
										} }),
									React.createElement(AreaSeries, { yAccessor: smaVolume50.accessor(), stroke: smaVolume50.stroke(), fill: smaVolume50.fill() })
								),
								React.createElement(
									Chart,
									{ id: 3,
										yExtents: rsiCalculator.domain(),
										height: 125, origin: function origin(w, h) {
											return [0, h - 250];
										} },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom", showTicks: false, outerTickSize: 0 }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 2, tickValues: rsiCalculator.tickValues() }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(RSISeries, { calculator: rsiCalculator }),
									React.createElement(RSITooltip, { origin: [-38, 15], calculator: rsiCalculator })
								),
								React.createElement(
									Chart,
									{ id: 8,
										yExtents: atr14.accessor(),
										height: 125, origin: function origin(w, h) {
											return [0, h - 125];
										}, padding: { top: 10, bottom: 10 } },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom" }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 2 }),
									React.createElement(MouseCoordinateX, {
										at: "bottom",
										orient: "bottom",
										displayFormat: d3.timeFormat("%Y-%m-%d") }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(LineSeries, { yAccessor: atr14.accessor(), stroke: atr14.stroke() }),
									React.createElement(SingleValueTooltip, {
										yAccessor: atr14.accessor(),
										yLabel: "ATR (" + atr14.windowSize() + ")",
										yDisplayFormat: d3.format(".2f")
										/* valueStroke={atr14.stroke()} - optional prop */
										/* labelStroke="#4682B4" - optional prop */
										, origin: [-40, 15] })
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return CandleStickChartWithRSIIndicator;
				}(React.Component);

				CandleStickChartWithRSIIndicator.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				CandleStickChartWithRSIIndicator.defaultProps = {
					type: "hybrid"
				};
				CandleStickChartWithRSIIndicator = fitWidth(CandleStickChartWithRSIIndicator);

				var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
				d3["json"]("/api/investing/stock/" + scope.chartOptions.index + "?type=index", function (err, response) {
					var data = helperService.flipArray(response.data.slice(0, scope.chartOptions.range));
					data.forEach(function (d, i) {
						d.date = new Date(d3.timeParse("%Y-%m-%d")(d.date).getTime());
						d.open = +d.open;
						d.high = +d.high;
						d.low = +d.low;
						d.close = +d.close;
						d.volume = +d.volume;
					});
					
					ReactDOM.render(React.createElement(
						TypeChooser,
						{ type: "hybrid" },
						function (type) {
							return React.createElement(CandleStickChartWithRSIIndicator, { data: data, type: type });
						}
					), element[0]);
				});

			}
		};
	});
}());