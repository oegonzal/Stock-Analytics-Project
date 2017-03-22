(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('forceChart', function(api, $timeout){
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
				var StraightLine = series.StraightLine;
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
				//console.log(indicator);

				var forceIndex = indicator.forceIndex;
				var ema = indicator.ema;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var CandleStickChartWithForceIndexIndicator = function (_React$Component) {
					_inherits(CandleStickChartWithForceIndexIndicator, _React$Component);

					function CandleStickChartWithForceIndexIndicator() {
						_classCallCheck(this, CandleStickChartWithForceIndexIndicator);

						return _possibleConstructorReturn(this, (CandleStickChartWithForceIndexIndicator.__proto__ || Object.getPrototypeOf(CandleStickChartWithForceIndexIndicator)).apply(this, arguments));
					}

					_createClass(CandleStickChartWithForceIndexIndicator, [{
						key: "render",
						value: function render() {
							var _props = this.props;
							var data = _props.data;
							var type = _props.type;
							var width = _props.width;
							var ratio = _props.ratio;


							var fi = forceIndex().merge(function (d, c) {
								d.fi = c;
							}).accessor(function (d) {
								return d.fi;
							});

							var fiEMA13 = ema().id(1).windowSize(13).sourcePath("fi").merge(function (d, c) {
								d.fiEMA13 = c;
							}).accessor(function (d) {
								return d.fiEMA13;
							});

							return React.createElement(
								ChartCanvas,
								{ ratio: ratio, width: width, height: 550,
									margin: { left: 70, right: 70, top: 20, bottom: 30 }, type: type,
									seriesName: "MSFT",
									data: data, calculator: [fi, fiEMA13],
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider,
									xExtents: [new Date(2012, 0, 1), new Date(2012, 6, 2)] },
								React.createElement(
									Chart,
									{ id: 1, height: 300,
										yExtents: function yExtents(d) {
											return [d.high, d.low];
										},
										padding: { top: 10, right: 0, bottom: 20, left: 0 } },
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 5 }),
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom", showTicks: false, outerTickSize: 0 }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".2f") }),
									React.createElement(CandlestickSeries, null),
									React.createElement(EdgeIndicator, { itemType: "last", orient: "right", edgeAt: "right",
										yAccessor: function yAccessor(d) {
											return d.close;
										}, fill: function fill(d) {
											return d.close > d.open ? "#6BA583" : "#FF0000";
										} }),
									React.createElement(OHLCTooltip, { origin: [-40, -10] })
								),
								React.createElement(
									Chart,
									{ id: 2, height: 150,
										yExtents: function yExtents(d) {
											return d.volume;
										},
										origin: function origin(w, h) {
											return [0, h - 350];
										} },
									React.createElement(YAxis, { axisAt: "left", orient: "left", ticks: 5, tickFormat: d3.format(".0s") }),
									React.createElement(MouseCoordinateY, {
										at: "left",
										orient: "left",
										displayFormat: d3.format(".4s") }),
									React.createElement(BarSeries, {
										yAccessor: function yAccessor(d) {
											return d.volume;
										},
										fill: function fill(d) {
											return d.close > d.open ? "#6BA583" : "#FF0000";
										},
										opacity: 0.5 })
								),
								React.createElement(
									Chart,
									{ id: 3, height: 100,
										yExtents: fi.accessor(),
										origin: function origin(w, h) {
											return [0, h - 200];
										},
										padding: { top: 10, right: 0, bottom: 10, left: 0 } },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom", showTicks: false, outerTickSize: 0 }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 4, tickFormat: d3.format(".0s") }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".4s") }),
									React.createElement(AreaSeries, { baseAt: function baseAt(scale) {
											return scale(0);
										}, yAccessor: fi.accessor() }),
									React.createElement(StraightLine, { yValue: 0 }),
									React.createElement(SingleValueTooltip, {
										yAccessor: fi.accessor(),
										yLabel: "ForceIndex (1)",
										yDisplayFormat: d3.format(".4s"),
										origin: [-40, 15] })
								),
								React.createElement(
									Chart,
									{ id: 4, height: 100,
										yExtents: fiEMA13.accessor(),
										origin: function origin(w, h) {
											return [0, h - 100];
										},
										padding: { top: 10, right: 0, bottom: 10, left: 0 } },
									React.createElement(XAxis, { axisAt: "bottom", orient: "bottom" }),
									React.createElement(YAxis, { axisAt: "right", orient: "right", ticks: 4, tickFormat: d3.format(".0s") }),
									React.createElement(MouseCoordinateX, {
										at: "bottom",
										orient: "bottom",
										displayFormat: d3.timeFormat("%Y-%m-%d") }),
									React.createElement(MouseCoordinateY, {
										at: "right",
										orient: "right",
										displayFormat: d3.format(".4s") }),
									React.createElement(AreaSeries, { baseAt: function baseAt(scale) {
											return scale(0);
										}, yAccessor: fiEMA13.accessor() }),
									React.createElement(StraightLine, { yValue: 0 }),
									React.createElement(SingleValueTooltip, {
										yAccessor: fiEMA13.accessor(),
										yLabel: "ForceIndex (" + fiEMA13.windowSize() + ")",
										yDisplayFormat: d3.format(".4s"),
										origin: [-40, 15] })
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return CandleStickChartWithForceIndexIndicator;
				}(React.Component);

				;

				CandleStickChartWithForceIndexIndicator.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				CandleStickChartWithForceIndexIndicator.defaultProps = {
					type: "svg"
				};
				CandleStickChartWithForceIndexIndicator = fitWidth(CandleStickChartWithForceIndexIndicator);

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
							return React.createElement(CandleStickChartWithForceIndexIndicator, { data: data, type: type });
						}
					), element[0]);
				});

			}
		};
	});
}());