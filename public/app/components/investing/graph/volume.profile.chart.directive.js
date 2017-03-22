(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('volumeProfileChart', ['helperService', function(helperService){
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
				var VolumeProfileSeries = series.VolumeProfileSeries;
				var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
				var EdgeIndicator = coordinates.EdgeIndicator;
				var CrossHairCursor = coordinates.CrossHairCursor;
				var MouseCoordinateX = coordinates.MouseCoordinateX;
				var MouseCoordinateY = coordinates.MouseCoordinateY;
				var CurrentCoordinate = coordinates.CurrentCoordinate;
				var OHLCTooltip = tooltip.OHLCTooltip;
				var MovingAverageTooltip = tooltip.MovingAverageTooltip;
				var XAxis = axes.XAxis;
				var YAxis = axes.YAxis;
				var ema = indicator.ema;
				var sma = indicator.sma;
				var change = indicator.change;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var VolumeProfileChart = function (_React$Component) {
					_inherits(VolumeProfileChart, _React$Component);

					function VolumeProfileChart() {
						_classCallCheck(this, VolumeProfileChart);

						return _possibleConstructorReturn(this, (VolumeProfileChart.__proto__ || Object.getPrototypeOf(VolumeProfileChart)).apply(this, arguments));
					}

					_createClass(VolumeProfileChart, [{
						key: "render",
						value: function render() {
							var _props = this.props;
							var data = _props.data;
							var type = _props.type;
							var width = _props.width;
							var ratio = _props.ratio;
							
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

							var changeCalculator = change();

							return React.createElement(
								ChartCanvas,
								{ ratio: ratio, width: width, height: 400,
									margin: { left: 80, right: 80, top: 10, bottom: 30 }, type: type,
									seriesName: "MSFT",
									data: data, calculator: [ema20, ema50, changeCalculator],
									//xExtents: [new Date(2014, 9, 1), new Date(2015, 2, 2)],
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider },
								React.createElement(
									Chart,
									{ id: 2,
										yExtents: [function (d) {
											return d.volume;
										}],
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
										},
										widthRatio: 0.95,
										opacity: 0.3,
										fill: function fill(d) {
											return d.close > d.open ? "#6BA583" : "#FF0000";
										} })
								),
								React.createElement(
									Chart,
									{ id: 1,
										yExtents: [function (d) {
											return [d.high, d.low];
										}, ema20.accessor(), ema50.accessor()],
										padding: { top: 40, bottom: 20 } },
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
									React.createElement(VolumeProfileSeries, null),
									React.createElement(CandlestickSeries, null),
									React.createElement(LineSeries, { yAccessor: ema20.accessor(), stroke: ema20.stroke() }),
									React.createElement(LineSeries, { yAccessor: ema50.accessor(), stroke: ema50.stroke() }),
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
										calculators: [ema20, ema50] })
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return VolumeProfileChart;
				}(React.Component);

				VolumeProfileChart.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				VolumeProfileChart.defaultProps = {
					type: "hybrid"
				};
				VolumeProfileChart = fitWidth(VolumeProfileChart);

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
							return React.createElement(VolumeProfileChart, { data: data, type: type });
						}
					), element[0]);
				});

			}
		};
	}]);
}());

