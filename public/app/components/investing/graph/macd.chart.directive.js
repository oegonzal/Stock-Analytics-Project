(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('macdChart', ['helperService', function(helperService){
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
				var MACDSeries = series.MACDSeries;
				var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
				var CrossHairCursor = coordinates.CrossHairCursor;
				var MouseCoordinateX = coordinates.MouseCoordinateX;
				var MouseCoordinateY = coordinates.MouseCoordinateY;
				var CurrentCoordinate = coordinates.CurrentCoordinate;
				var EdgeIndicator = coordinates.EdgeIndicator;
				var OHLCTooltip = tooltip.OHLCTooltip;
				var MovingAverageTooltip = tooltip.MovingAverageTooltip;
				var MACDTooltip = tooltip.MACDTooltip;
				var XAxis = axes.XAxis;
				var YAxis = axes.YAxis;
				var macd = indicator.macd;
				var ema = indicator.ema;
				var sma = indicator.sma;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var CandleStickChartWithMACDIndicator = function (_React$Component) {
					_inherits(CandleStickChartWithMACDIndicator, _React$Component);

					function CandleStickChartWithMACDIndicator() {
						_classCallCheck(this, CandleStickChartWithMACDIndicator);

						return _possibleConstructorReturn(this, (CandleStickChartWithMACDIndicator.__proto__ || Object.getPrototypeOf(CandleStickChartWithMACDIndicator)).apply(this, arguments));
					}

					_createClass(CandleStickChartWithMACDIndicator, [{
						key: "getChartCanvas",
						value: function getChartCanvas() {
							return this.refs.chartCanvas;
						}
					}, {
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

							var macdCalculator = macd().fast(12).slow(26).signal(9).merge(function (d, c) {
								d.macd = c;
							}).accessor(function (d) {
								return d.macd;
							});

							var smaVolume50 = sma().id(3).windowSize(10).sourcePath("volume").merge(function (d, c) {
								d.smaVolume50 = c;
							}).accessor(function (d) {
								return d.smaVolume50;
							});

							return React.createElement(
								ChartCanvas,
								{ ref: "chartCanvas", ratio: ratio, width: width, height: 600,
									margin: { left: 70, right: 70, top: 20, bottom: 30 }, type: type,
									seriesName: "MSFT",
									data: data, calculator: [ema26, ema12, smaVolume50, macdCalculator],
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider },
								React.createElement(
									Chart,
									{ id: 1, height: 400,
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
											return [0, h - 300];
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
									{ id: 3, height: 150,
										yExtents: macdCalculator.accessor(),
										origin: function origin(w, h) {
											return [0, h - 150];
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
									React.createElement(MACDSeries, { calculator: macdCalculator }),
									React.createElement(MACDTooltip, { origin: [-38, 15], calculator: macdCalculator })
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return CandleStickChartWithMACDIndicator;
				}(React.Component);

				CandleStickChartWithMACDIndicator.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				CandleStickChartWithMACDIndicator.defaultProps = {
					type: "hybrid"
				};

				CandleStickChartWithMACDIndicator = fitWidth(CandleStickChartWithMACDIndicator);

				var flag = true;
				try{
					if(typeof scope.chartOptions === "undefined") throw "Undefined";
					if(typeof scope.chartOptions.index === "undefined" ) throw "Index is not defined";
					if(typeof scope.chartOptions.index !== "string" ) throw "Index is not a string";
					if(typeof scope.chartOptions.range === "undefined") throw "Date range is undefined";
				}
				catch(e){
					console.log("ERROR: " + e);
					flag = false;
					//scope.chartOptions.index = "NUGT";
				}

				if(flag){
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
							{ type: "hybrid" }, //ERROR WAS THAT THIS WAS IN SVG!!
							function (type) {
								return React.createElement(CandleStickChartWithMACDIndicator, { data: data, type: type });
							}
						), element[0]);
					});
				}
			}
		};
	}]);
}());