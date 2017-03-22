(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('bollingerChart', function(helperService){
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
				var BollingerSeries = series.BollingerSeries;
				var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
				var EdgeIndicator = coordinates.EdgeIndicator;
				var CrossHairCursor = coordinates.CrossHairCursor;
				var MouseCoordinateX = coordinates.MouseCoordinateX;
				var MouseCoordinateY = coordinates.MouseCoordinateY;
				var CurrentCoordinate = coordinates.CurrentCoordinate;
				var OHLCTooltip = tooltip.OHLCTooltip;
				var MovingAverageTooltip = tooltip.MovingAverageTooltip;
				var BollingerBandTooltip = tooltip.BollingerBandTooltip;
				var XAxis = axes.XAxis;
				var YAxis = axes.YAxis;
				var ema = indicator.ema;
				var sma = indicator.sma;
				var bollingerBand = indicator.bollingerBand;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var CandleStickChartWithBollingerBandOverlay = function (_React$Component) {
					_inherits(CandleStickChartWithBollingerBandOverlay, _React$Component);

					function CandleStickChartWithBollingerBandOverlay() {
						_classCallCheck(this, CandleStickChartWithBollingerBandOverlay);

						return _possibleConstructorReturn(this, (CandleStickChartWithBollingerBandOverlay.__proto__ || Object.getPrototypeOf(CandleStickChartWithBollingerBandOverlay)).apply(this, arguments));
					}

					_createClass(CandleStickChartWithBollingerBandOverlay, [{
						key: "render",
						value: function render() {
							var _props = this.props;
							var data = _props.data;
							var type = _props.type;
							var width = _props.width;
							var ratio = _props.ratio;


							var ema20 = ema().windowSize(20) // optional will default to 10
							.sourcePath("close") // optional will default to close as the source
							.skipUndefined(true) // defaults to true
							.merge(function (d, c) {
								d.ema20 = c;
							}) // Required, if not provided, log a error
							.accessor(function (d) {
								return d.ema20;
							}) // Required, if not provided, log an error during calculation
							.stroke("blue"); // Optional

							var sma20 = sma().windowSize(20).sourcePath("close").merge(function (d, c) {
								d.sma20 = c;
							}).accessor(function (d) {
								return d.sma20;
							});

							var ema50 = ema().windowSize(50).sourcePath("close").merge(function (d, c) {
								d.ema50 = c;
							}).accessor(function (d) {
								return d.ema50;
							});

							var smaVolume50 = sma().windowSize(50).sourcePath("volume").merge(function (d, c) {
								d.smaVolume50 = c;
							}).accessor(function (d) {
								return d.smaVolume50;
							}).stroke("#4682B4").fill("#4682B4");

							var bb = bollingerBand().merge(function (d, c) {
								d.bb = c;
							}).accessor(function (d) {
								return d.bb;
							});
							return React.createElement(
								ChartCanvas,
								{ ratio: ratio, width: width, height: 400,
									margin: { left: 70, right: 70, top: 10, bottom: 30 }, type: type,
									seriesName: "MSFT",
									data: data, calculator: [sma20, ema20, ema50, smaVolume50, bb],
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider,
									//xExtents: [new Date(2012, 0, 1), new Date(2012, 6, 2)] 
								},
								React.createElement(
									Chart,
									{ id: 1,
										yExtents: [function (d) {
											return [d.high, d.low];
										}, sma20.accessor(), ema20.accessor(), ema50.accessor(), bb.accessor()],
										padding: { top: 10, bottom: 20 } },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom" }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 5 }),
									React.createElement(MouseCoordinateX, {
										at: "bottom",
										orient: "bottom",
										displayFormat: d3.timeFormat("%Y-%m-%d") }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(CandlestickSeries, null),
									React.createElement(LineSeries, { yAccessor: sma20.accessor(), stroke: sma20.stroke() }),
									React.createElement(LineSeries, { yAccessor: ema20.accessor(), stroke: ema20.stroke() }),
									React.createElement(LineSeries, { yAccessor: ema50.accessor(), stroke: ema50.stroke() }),
									React.createElement(BollingerSeries, { calculator: bb }),
									React.createElement(CurrentCoordinate, { yAccessor: sma20.accessor(), fill: sma20.stroke() }),
									React.createElement(CurrentCoordinate, { yAccessor: ema20.accessor(), fill: ema20.stroke() }),
									React.createElement(CurrentCoordinate, { yAccessor: ema50.accessor(), fill: ema50.stroke() }),
									React.createElement(OHLCTooltip, { origin: [-40, 0] }),
									React.createElement(MovingAverageTooltip, { onClick: function onClick(e) {
											return console.log(e);
										}, origin: [-38, 15],
										calculators: [sma20, ema20, ema50] }),
									React.createElement(BollingerBandTooltip, { origin: [-38, 60], calculator: bb })
								),
								React.createElement(
									Chart,
									{ id: 2,
										yExtents: [function (d) {
											return d.volume;
										}, smaVolume50.accessor()],
										height: 150, origin: function origin(w, h) {
											return [0, h - 150];
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
									React.createElement(AreaSeries, { yAccessor: smaVolume50.accessor(), stroke: smaVolume50.stroke(), fill: smaVolume50.fill() }),
									React.createElement(CurrentCoordinate, { yAccessor: smaVolume50.accessor(), fill: smaVolume50.stroke() }),
									React.createElement(CurrentCoordinate, { yAccessor: function yAccessor(d) {
											return d.volume;
										}, fill: "#9B0A47" })
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return CandleStickChartWithBollingerBandOverlay;
				}(React.Component);

				CandleStickChartWithBollingerBandOverlay.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				CandleStickChartWithBollingerBandOverlay.defaultProps = {
					type: "hybrid"
				};
				CandleStickChartWithBollingerBandOverlay = fitWidth(CandleStickChartWithBollingerBandOverlay);

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
							return React.createElement(CandleStickChartWithBollingerBandOverlay, { data: data, type: type });
						}
					), element[0]);
				});
				

			}
		};
	});
}());