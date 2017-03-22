(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('compareChart', function(helperService){
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
				var CompareSeries = series.CompareSeries;
				var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
				var CrossHairCursor = coordinates.CrossHairCursor;
				var MouseCoordinateX = coordinates.MouseCoordinateX;
				var MouseCoordinateY = coordinates.MouseCoordinateY;
				var CurrentCoordinate = coordinates.CurrentCoordinate;
				var EdgeIndicator = coordinates.EdgeIndicator;
				var OHLCTooltip = tooltip.OHLCTooltip;
				var SingleValueTooltip = tooltip.SingleValueTooltip;
				var XAxis = axes.XAxis;
				var YAxis = axes.YAxis;
				var compare = indicator.compare;
				var sma = indicator.sma;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var CandleStickChartWithCompare = function (_React$Component) {
					_inherits(CandleStickChartWithCompare, _React$Component);

					function CandleStickChartWithCompare() {
						_classCallCheck(this, CandleStickChartWithCompare);

						return _possibleConstructorReturn(this, (CandleStickChartWithCompare.__proto__ || Object.getPrototypeOf(CandleStickChartWithCompare)).apply(this, arguments));
					}

					_createClass(CandleStickChartWithCompare, [{
						key: "render",
						value: function render() {
							var _props = this.props;
							var data = _props.data;
							var type = _props.type;
							var width = _props.width;
							var ratio = _props.ratio;


							var compareCalculator = compare().base(function (d) {
								return d.close;
							}).mainKeys(["open", "high", "low", "close"]).compareKeys(["AAPLClose", "SP500Close", "GEClose"]).accessor(function (d) {
								return d.compare;
							}).merge(function (d, c) {
								d.compare = c;
							});

							var smaVolume50 = sma().id(3).windowSize(10).sourcePath("volume").merge(function (d, c) {
								d.smaVolume50 = c;
							}).accessor(function (d) {
								return d.smaVolume50;
							});

							return React.createElement(
								ChartCanvas,
								{ ratio: ratio, width: width, height: 400,
									margin: { left: 70, right: 70, top: 20, bottom: 30 }, type: type,
									seriesName: "MSFT",
									data: data, calculator: [smaVolume50], postCalculator: compareCalculator,
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider,
									xExtents: [new Date(2012, 0, 1), new Date(2012, 6, 2)] },
								React.createElement(
									Chart,
									{ id: 1,
										yExtents: function yExtents(d) {
											return d.compare;
										} },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom" }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 5, tickFormat: d3.format(".0%") }),
									React.createElement(MouseCoordinateX, {
										at: "bottom",
										orient: "bottom",
										displayFormat: d3.timeFormat("%Y-%m-%d") }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(CandlestickSeries, { yAccessor: function yAccessor(d) {
											return d.compare;
										} }),
									React.createElement(LineSeries, { yAccessor: function yAccessor(d) {
											return d.compare.AAPLClose;
										}, stroke: "#ff7f0e" }),
									React.createElement(LineSeries, { yAccessor: function yAccessor(d) {
											return d.compare.GEClose;
										}, stroke: "#aa7f0e" }),
									React.createElement(LineSeries, { yAccessor: function yAccessor(d) {
											return d.compare.SP500Close;
										}, stroke: "#2ca02c" }),
									React.createElement(EdgeIndicator, { itemType: "last", orient: "right", edgeAt: "right",
										yAccessor: function yAccessor(d) {
											return d.compare.AAPLClose;
										}, fill: "#ff7f0e",
										displayFormat: d3.format(".0%") }),
									React.createElement(EdgeIndicator, { itemType: "last", orient: "right", edgeAt: "right",
										yAccessor: function yAccessor(d) {
											return d.compare.GEClose;
										}, fill: "#aa7f0e",
										displayFormat: d3.format(".0%") }),
									React.createElement(EdgeIndicator, { itemType: "last", orient: "right", edgeAt: "right",
										yAccessor: function yAccessor(d) {
											return d.compare.SP500Close;
										}, fill: "#2ca02c",
										displayFormat: d3.format(".0%") }),
									React.createElement(EdgeIndicator, { itemType: "last", orient: "right", edgeAt: "right",
										yAccessor: function yAccessor(d) {
											return d.compare.close;
										}, fill: function fill(d) {
											return d.close > d.open ? "#6BA583" : "#FF0000";
										},
										displayFormat: d3.format(".0%") }),
									React.createElement(OHLCTooltip, { origin: [-40, 0] }),
									React.createElement(SingleValueTooltip, {
										yAccessor: function yAccessor(d) {
											return d.AAPLClose;
										},
										yLabel: "AAPL",
										yDisplayFormat: d3.format(".2f"),
										valueStroke: "#ff7f0e"
										/* labelStroke="#4682B4" - optional prop */
										, origin: [-40, 20] }),
									React.createElement(SingleValueTooltip, {
										yAccessor: function yAccessor(d) {
											return d.AAPLClose;
										},
										yLabel: "GE",
										yDisplayFormat: d3.format(".2f"),
										valueStroke: "#aa7f0e"
										/* labelStroke="#4682B4" - optional prop */
										, origin: [-40, 35] }),
									React.createElement(SingleValueTooltip, {
										yAccessor: function yAccessor(d) {
											return d.SP500Close;
										},
										yLabel: "S&P 500",
										yDisplayFormat: d3.format(".2f"),
										valueStroke: "#2ca02c"
										/* labelStroke="#4682B4" - optional prop */
										, origin: [-40, 50] })
								),
								React.createElement(
									Chart,
									{ id: 2,
										yExtents: function yExtents(d) {
											return d.volume;
										},
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
										} })
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return CandleStickChartWithCompare;
				}(React.Component);
				
				CandleStickChartWithCompare.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				CandleStickChartWithCompare.defaultProps = {
					type: "hybrid"
				};
				CandleStickChartWithCompare = fitWidth(CandleStickChartWithCompare);

				var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
				d3["tsv"]("//rrag.github.io/react-stockcharts/data/comparison.tsv", function (err, data) {
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
							return React.createElement(CandleStickChartWithCompare, { data: data, type: type });
						}
					), element[0]);
				});

			}
		};
	});
}());