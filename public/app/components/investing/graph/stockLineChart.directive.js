(function(){
	'use strict';

	var module = angular.module('psOptimize');

	module.directive('stockLineChart', function(api, $timeout){
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
				var helper = _ReStock.helper;
				var BarSeries = series.BarSeries;
				var LineSeries = series.LineSeries;
				var AreaSeries = series.AreaSeries;
				var ScatterSeries = series.ScatterSeries;
				var CircleMarker = series.CircleMarker;
				var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
				var CrossHairCursor = coordinates.CrossHairCursor;
				var MouseCoordinateX = coordinates.MouseCoordinateX;
				var MouseCoordinateY = coordinates.MouseCoordinateY;
				var OHLCTooltip = tooltip.OHLCTooltip;
				var XAxis = axes.XAxis;
				var YAxis = axes.YAxis;
				var fitWidth = helper.fitWidth;
				var TypeChooser = helper.TypeChooser;

				var LineAndScatterChart = function (_React$Component) {
					_inherits(LineAndScatterChart, _React$Component);

					function LineAndScatterChart() {
						_classCallCheck(this, LineAndScatterChart);

						return _possibleConstructorReturn(this, (LineAndScatterChart.__proto__ || Object.getPrototypeOf(LineAndScatterChart)).apply(this, arguments));
					}

					_createClass(LineAndScatterChart, [{
						key: "render",
						value: function render() {
							var _props = this.props;
							var data = _props.data;
							var type = _props.type;
							var width = _props.width;
							var ratio = _props.ratio;

							return React.createElement(
								ChartCanvas,
								{ ratio: ratio, width: width, height: 400,
									margin: { left: 70, right: 70, top: 20, bottom: 30 }, type: type,
									seriesName: "MSFT",
									data: data,
									xAccessor: function xAccessor(d) {
										return d.date;
									}, xScaleProvider: discontinuousTimeScaleProvider,
									xExtents: [new Date(2012, 0, 1), new Date(2012, 2, 2)] },
								React.createElement(
									Chart,
									{ id: 1,
										yExtents: function yExtents(d) {
											return [d.high, d.low];
										} },
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
									React.createElement(LineSeries, { yAccessor: function yAccessor(d) {
											return d.close;
										} }),
									React.createElement(ScatterSeries, { yAccessor: function yAccessor(d) {
											return d.close;
										}, marker: CircleMarker, markerProps: { r: 3 } }),
									React.createElement(OHLCTooltip, { forChart: 1, origin: [-40, 0] })
								),
								React.createElement(CrossHairCursor, null)
							);
						}
					}]);

					return LineAndScatterChart;
				}(React.Component);

				LineAndScatterChart.propTypes = {
					data: React.PropTypes.array.isRequired,
					width: React.PropTypes.number.isRequired,
					ratio: React.PropTypes.number.isRequired,
					type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
				};

				LineAndScatterChart.defaultProps = {
					type: "svg"
				};
				LineAndScatterChart = fitWidth(LineAndScatterChart);

				var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
				d3["tsv"]("//rrag.github.io/react-stockcharts/data/MSFT.tsv", function (err, data) {
					/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */
				//d3["json"]("/api/investing/stock/" + scope.chartOptions.index + "?type=index", function (err, response) {
						/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */

					//var data = flipArray(response.data.slice(0, scope.chartOptions.range));
					data.forEach(function (d, i) {
						d.date = new Date(d3.timeParse("%Y-%m-%d")(d.date).getTime());
						d.open = +d.open;
						d.high = +d.high;
						d.low = +d.low;
						d.close = +d.close;
						d.volume = +d.volume;
						//console.log("From tsv: " + JSON.stringify(d));
					});
					/* change the type from hybrid to svg to compare the performance between svg and canvas */

					//data = [{"date":"2010-01-04T08:00:00.000Z","open":25.436282332605284,"high":25.835021381744056,"low":25.411360259406774,"close":25.710416,"volume":38409100,"split":"","dividend":""},{"date":"2010-01-05T08:00:00.000Z","open":25.627344939513726,"high":25.83502196495549,"low":25.452895407434543,"close":25.718722,"volume":49749600,"split":"","dividend":""},{"date":"2010-01-06T08:00:00.000Z","open":25.65226505944465,"high":25.81840750861228,"low":25.353210976925574,"close":25.560888,"volume":58182400,"split":"","dividend":""},{"date":"2010-01-07T08:00:00.000Z","open":25.444587793771767,"high":25.502739021094353,"low":25.079077898061875,"close":25.295062,"volume":50559700,"split":"","dividend":""},{"date":"2010-01-08T08:00:00.000Z","open":25.153841756996414,"high":25.6522649488092,"low":25.120612602739726,"close":25.46951,"volume":51197400,"split":"","dividend":""},{"date":"2010-01-11T08:00:00.000Z","open":25.511044730573705,"high":25.55258096597291,"low":25.02092861663475,"close":25.145534,"volume":68754700,"split":"","dividend":""},{"date":"2010-01-12T08:00:00.000Z","open":25.045848646491518,"high":25.253525666777517,"low":24.84647870701696,"close":24.979392,"volume":65912100,"split":"","dividend":""},{"date":"2010-01-13T08:00:00.000Z","open":25.13722727051071,"high":25.353211377924218,"low":24.929550244151567,"close":25.211991,"volume":51863500,"split":"","dividend":""},{"date":"2010-01-14T08:00:00.000Z","open":25.178761733851413,"high":25.83502196495549,"low":25.137227159471163,"close":25.718722,"volume":63228100,"split":"","dividend":""},{"date":"2010-01-15T08:00:00.000Z","open":25.818406945612217,"high":25.95132023748152,"low":25.51104412745638,"close":25.635652,"volume":79913200,"split":"","dividend":""},{"date":"2010-01-19T08:00:00.000Z","open":25.544274163987136,"high":25.95132113440514,"low":25.486124596784563,"close":25.835022,"volume":46575700,"split":"","dividend":""},{"date":"2010-01-20T08:00:00.000Z","open":25.59411494568944,"high":25.702108656795026,"low":25.17876090842236,"close":25.41136,"volume":54849500,"split":"","dividend":""},{"date":"2010-01-21T08:00:00.000Z","open":25.427975689088637,"high":25.51935191837554,"low":24.92124291902699,"close":24.92955,"volume":73086700,"split":"","dividend":""},{"date":"2010-01-22T08:00:00.000Z","open":24.921242227943445,"high":25.087384673504477,"low":23.9576208617963,"close":24.057305,"volume":102004600,"split":"","dividend":""},{"date":"2010-01-25T08:00:00.000Z","open":24.289904353342425,"high":24.63880174829468,"low":24.17360522169168,"close":24.356361,"volume":63373000,"split":"","dividend":""},{"date":"2010-01-26T08:00:00.000Z","open":24.256677400199628,"high":24.796636835593223,"low":24.165298678305085,"close":24.505889,"volume":66639900,"split":"","dividend":""},{"date":"2010-01-27T08:00:00.000Z","open":24.381282411526794,"high":24.771715213346813,"low":24.107148742163798,"close":24.647109,"volume":63949500,"split":"","dividend":""},{"date":"2010-01-28T08:00:00.000Z","open":24.788329503429356,"high":24.813251576935805,"low":23.999155984106725,"close":24.223448,"volume":117513700,"split":"","dividend":""},{"date":"2010-01-29T08:00:00.000Z","open":24.838171916252662,"high":24.854786078069555,"low":22.977385792760824,"close":23.409354,"volume":193888500,"split":"","dividend":""},{"date":"2010-02-01T08:00:00.000Z","open":23.583802007377084,"high":23.658566566701865,"low":23.193370033086943,"close":23.600417,"volume":85931100,"split":"","dividend":""},{"date":"2010-02-02T08:00:00.000Z","open":23.567188934614894,"high":23.675180153730853,"low":23.376124415817756,"close":23.641951,"volume":54413700,"split":"","dividend":""},{"date":"2010-02-03T08:00:00.000Z","open":23.47581083464236,"high":23.916086957012187,"low":23.359512531703963,"close":23.783172,"volume":61397900,"split":"","dividend":""},{"date":"2010-02-04T08:00:00.000Z","open":23.575494533516057,"high":23.67518033405172,"low":23.101990926835022,"close":23.126913,"volume":77850000,"split":"","dividend":""},{"date":"2010-02-05T08:00:00.000Z","open":23.259826837972874,"high":23.492425937060705,"low":22.90262235438972,"close":23.276441,"volume":80960100,"split":"","dividend":""},{"date":"2010-02-08T08:00:00.000Z","open":23.268134182833126,"high":23.326283750587436,"low":22.902622614091726,"close":23.027228,"volume":52820600,"split":"","dividend":""}];
					//console.log("Here is the data for stockLinechart: " + JSON.stringify(data));
					ReactDOM.render(React.createElement(
						TypeChooser,
						{ type: "hybrid" },
						function (type) {
							return React.createElement(LineAndScatterChart, { data: data, type: type });
						}
					), element[0]);
				});

				function flipArray(array){
					var length = array.length;

					for(var i = 0; i < (length - 1)/2; i++){
						var temp = array[i];
						array[i] = array[length - i - 1];
						array[length - i -1] = temp;
					}
					return array;
				}
			}
		};
	});
}());