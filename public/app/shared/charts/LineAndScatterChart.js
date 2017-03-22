"use strict";

// var ReStock = require('../../../assets/js/react-stockcharts.min.js'),
// 	React = require('../../../assets/lib/react/react.js'),
// 	d3 = require('../../../assets/lib/d3/d3.js');

// import React from "../../../assets/lib/react/react.js";
// import d3 from "../../../assets/lib/d3/d3.js";
// import ReStock from "../../../assets/js/react-stockcharts.min.js";

import {React} from "react";
import {d3} from "d3";
import ReStock from "react-stockcharts";


var { ChartCanvas, Chart, EventCapture } = ReStock;

var { LineSeries, ScatterSeries, CircleMarker } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class LineAndScatterChart extends React.Component {
	render() {
		var { data, type, width } = this.props;
		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 2, 2)]}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<LineSeries yAccessor={d => d.close}/>
					<ScatterSeries yAccessor={d => d.close} marker={CircleMarker} markerProps={{ r: 3 }} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</TooltipContainer>
			</ChartCanvas>

		);
	}
}

LineAndScatterChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChart.defaultProps = {
	type: "svg",
};
LineAndScatterChart = fitWidth(LineAndScatterChart);

LineAndScatterChart.displayName = "LineAndScatterChart";

/*
var rs = ReStock.default;
var { ChartCanvas, Chart, EventCapture } = rs;

var { BarSeries, LineSeries, AreaSeries, ScatterSeries, CircleMarker } = rs.series;
var { discontinuousTimeScaleProvider } = rs.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = rs.coordinates;

var { TooltipContainer, OHLCTooltip } = rs.tooltip;
var { XAxis, YAxis } = rs.axes;
var { fitWidth, TypeChooser } = rs.helper;

class LineAndScatterChart extends React.Component {
	render() {
		var { data, type, width } = this.props;
		console.log("Inside transpile code");
		return (

			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 2, 2)]}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<LineSeries yAccessor={d => d.close}/>
					<ScatterSeries yAccessor={d => d.close} marker={CircleMarker} markerProps={{ r: 3 }} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</TooltipContainer>
			</ChartCanvas>

		);
	}
}

LineAndScatterChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChart.defaultProps = {
	type: "svg",
};

LineAndScatterChart = fitWidth(LineAndScatterChart);

//var data = [{"date":"2009-01-05T08:00:00.000Z","open":20.2,"high":20.67,"low":20.06,"close":20.52,"volume":61475200},{"date":"2009-01-06T08:00:00.000Z","open":20.75,"high":21,"low":20.61,"close":20.76,"volume":58083400},{"date":"2009-01-07T08:00:00.000Z","open":20.19,"high":20.29,"low":19.48,"close":19.51,"volume":72709900},{"date":"2009-01-08T08:00:00.000Z","open":19.63,"high":20.19,"low":19.55,"close":20.12,"volume":70255400},{"date":"2009-01-09T08:00:00.000Z","open":20.17,"high":20.3,"low":19.41,"close":19.52,"volume":49815300},{"date":"2009-01-12T08:00:00.000Z","open":19.71,"high":19.79,"low":19.3,"close":19.47,"volume":52163500},{"date":"2009-01-13T08:00:00.000Z","open":19.52,"high":19.99,"low":19.52,"close":19.82,"volume":65843500},{"date":"2009-01-14T08:00:00.000Z","open":19.53,"high":19.68,"low":19.01,"close":19.09,"volume":80257500},{"date":"2009-01-15T08:00:00.000Z","open":19.07,"high":19.3,"low":18.52,"close":19.24,"volume":96169800},{"date":"2009-01-16T08:00:00.000Z","open":19.63,"high":19.91,"low":19.15,"close":19.71,"volume":79634100},{"date":"2009-01-20T08:00:00.000Z","open":19.46,"high":19.62,"low":18.37,"close":18.48,"volume":89873000},{"date":"2009-01-21T08:00:00.000Z","open":18.87,"high":19.45,"low":18.46,"close":19.38,"volume":68340900},{"date":"2009-01-22T08:00:00.000Z","open":18.05,"high":18.18,"low":17.07,"close":17.11,"volume":222436600},{"date":"2009-01-23T08:00:00.000Z","open":16.97,"high":17.49,"low":16.75,"close":17.2,"volume":117020600},{"date":"2009-01-26T08:00:00.000Z","open":17.29,"high":17.81,"low":17.23,"close":17.63,"volume":92476500},{"date":"2009-01-27T08:00:00.000Z","open":17.78,"high":17.97,"low":17.43,"close":17.66,"volume":61695000},{"date":"2009-01-28T08:00:00.000Z","open":17.8,"high":18.31,"low":17.76,"close":18.04,"volume":64145500},{"date":"2009-01-29T08:00:00.000Z","open":17.78,"high":17.96,"low":17.56,"close":17.59,"volume":49192800},{"date":"2009-01-30T08:00:00.000Z","open":17.74,"high":17.79,"low":17.1,"close":17.1,"volume":62370900},{"date":"2009-02-02T08:00:00.000Z","open":17.03,"high":18.13,"low":17,"close":17.83,"volume":88871700},{"date":"2009-02-03T08:00:00.000Z","open":17.85,"high":18.61,"low":17.6,"close":18.5,"volume":86865100},{"date":"2009-02-04T08:00:00.000Z","open":18.54,"high":19,"low":18.5,"close":18.63,"volume":75618000},{"date":"2009-02-05T08:00:00.000Z","open":18.51,"high":19.14,"low":18.25,"close":19.04,"volume":75195200},{"date":"2009-02-06T08:00:00.000Z","open":19.16,"high":19.93,"low":19.06,"close":19.66,"volume":86746000},{"date":"2009-02-09T08:00:00.000Z","open":19.64,"high":19.77,"low":19.26,"close":19.44,"volume":52196400},{"date":"2009-02-10T08:00:00.000Z","open":19.25,"high":19.8,"low":18.7,"close":18.8,"volume":83953200},{"date":"2009-02-11T08:00:00.000Z","open":18.94,"high":19.49,"low":18.92,"close":19.21,"volume":58599000},{"date":"2009-02-12T08:00:00.000Z","open":18.97,"high":19.32,"low":18.54,"close":19.26,"volume":75323200},{"date":"2009-02-13T08:00:00.000Z","open":19.27,"high":19.47,"low":19.04,"close":19.09,"volume":47416000},{"date":"2009-02-17T08:00:00.000Z","open":18.49,"high":18.5,"low":17.89,"close":18.09,"volume":75853300},{"date":"2009-02-18T08:00:00.000Z","open":18.22,"high":18.45,"low":18,"close":18.12,"volume":54946900},{"date":"2009-02-19T08:00:00.000Z","open":18.3,"high":18.38,"low":17.81,"close":17.91,"volume":49195600},{"date":"2009-02-20T08:00:00.000Z","open":17.77,"high":18.19,"low":17.66,"close":18,"volume":69413800},{"date":"2009-02-23T08:00:00.000Z","open":18.02,"high":18.15,"low":17.16,"close":17.21,"volume":70803400},{"date":"2009-02-24T08:00:00.000Z","open":17.03,"high":17.35,"low":16.36,"close":17.17,"volume":122674500},{"date":"2009-02-25T08:00:00.000Z","open":17.01,"high":17.24,"low":16.46,"close":16.96,"volume":105894600},{"date":"2009-02-26T08:00:00.000Z","open":17.05,"high":17.08,"low":16.42,"close":16.42,"volume":83219500},{"date":"2009-02-27T08:00:00.000Z","open":16.29,"high":16.52,"low":16.1,"close":16.15,"volume":93428000},{"date":"2009-03-02T08:00:00.000Z","open":15.96,"high":16.25,"low":15.72,"close":15.79,"volume":80602100},{"date":"2009-03-03T08:00:00.000Z","open":16.03,"high":16.24,"low":15.64,"close":15.88,"volume":80476600}];
//ReactDOM.render(<TypeChooser type="hybrid">{type => <LineAndScatterChart data={data} type={type} />}</TypeChooser>, document.getElementById("chart"));

LineAndScatterChart.displayName = "LineAndScatterChart";


*/


///////////////////////////OLD STUFF////////////////////////////////////
/*
"use strict";

import React from "react";
import d3 from "d3";
import ReStock from "react-stockcharts";

var { ChartCanvas, Chart, EventCapture } = ReStock;

var { BarSeries, LineSeries, AreaSeries, ScatterSeries, CircleMarker } = ReStock.series;
var { discontinuousTimeScaleProvider } = ReStock.scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = ReStock.coordinates;

var { TooltipContainer, OHLCTooltip } = ReStock.tooltip;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth } = ReStock.helper;

class LineAndScatterChart extends React.Component {
	render() {
		var { data, type, width } = this.props;
		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 2, 2)]}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateX id={0}
						at="bottom"
						orient="bottom"
						displayFormat={d3.time.format("%Y-%m-%d")} />
					<MouseCoordinateY id={0}
						at="right"
						orient="right"
						displayFormat={d3.format(".2f")} />

					<LineSeries yAccessor={d => d.close}/>
					<ScatterSeries yAccessor={d => d.close} marker={CircleMarker} markerProps={{ r: 3 }} />
				</Chart>
				<CrossHairCursor />
				<EventCapture mouseMove zoom pan />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</TooltipContainer>
			</ChartCanvas>

		);
	}
}

LineAndScatterChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChart.defaultProps = {
	type: "svg",
};
LineAndScatterChart = fitWidth(LineAndScatterChart);

*/

//ReactDOM.render(<TypeChooser type="hybrid">{type => <LineAndScatterChart data={data} type={type} />}</TypeChooser>, document.getElementById("chart"));
/*
//Make a new render now for TypeChooser, and instead pass in data to that. make another level of render and
//put that as angular.value(...) and use LineAndScatterChart as the class to make an element to render
//like the declarations at the very top are being used to render LineAndScatterChart
class LineChart extends React.Component {
	render() {
		var { data, width } = this.props;
		return (
			<TypeChooser type="hybrid">{type => <LineAndScatterChart data={data} type={type} />}</TypeChooser>
		);
	}
}

*/

/*
LineAndScatterChart.displayName = 'LineAndScatterChart';
export default LineAndScatterChart;
*/

/*

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rs = ReStock.default;
var ChartCanvas = rs.ChartCanvas;
var Chart = rs.Chart;
var EventCapture = rs.EventCapture;
var _rs$series = rs.series;
var BarSeries = _rs$series.BarSeries;
var LineSeries = _rs$series.LineSeries;
var AreaSeries = _rs$series.AreaSeries;
var ScatterSeries = _rs$series.ScatterSeries;
var CircleMarker = _rs$series.CircleMarker;
var discontinuousTimeScaleProvider = rs.scale.discontinuousTimeScaleProvider;
var _rs$coordinates = rs.coordinates;
var CrossHairCursor = _rs$coordinates.CrossHairCursor;
var MouseCoordinateX = _rs$coordinates.MouseCoordinateX;
var MouseCoordinateY = _rs$coordinates.MouseCoordinateY;
var _rs$tooltip = rs.tooltip;
var TooltipContainer = _rs$tooltip.TooltipContainer;
var OHLCTooltip = _rs$tooltip.OHLCTooltip;
var _rs$axes = rs.axes;
var XAxis = _rs$axes.XAxis;
var YAxis = _rs$axes.YAxis;
var _rs$helper = rs.helper;
var fitWidth = _rs$helper.fitWidth;
var TypeChooser = _rs$helper.TypeChooser;

var LineAndScatterChart = (function (_React$Component) {
	_inherits(LineAndScatterChart, _React$Component);

	function LineAndScatterChart() {
		_classCallCheck(this, LineAndScatterChart);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(LineAndScatterChart).apply(this, arguments));
	}

	_createClass(LineAndScatterChart, [{
		key: "render",
		value: function render() {
			var _props = this.props;
			var data = _props.data;
			var type = _props.type;
			var width = _props.width;

			return React.createElement(
				ChartCanvas,
				{ width: width, height: 400,
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
					React.createElement(MouseCoordinateX, { id: 0,
						at: "bottom",
						orient: "bottom",
						displayFormat: d3.time.format("%Y-%m-%d") }),
					React.createElement(MouseCoordinateY, { id: 0,
						at: "right",
						orient: "right",
						displayFormat: d3.format(".2f") }),
					React.createElement(LineSeries, { yAccessor: function yAccessor(d) {
							return d.close;
						} }),
					React.createElement(ScatterSeries, { yAccessor: function yAccessor(d) {
							return d.close;
						}, marker: CircleMarker, markerProps: { r: 3 } })
				),
				React.createElement(CrossHairCursor, null),
				React.createElement(EventCapture, { mouseMove: true, zoom: true, pan: true }),
				React.createElement(
					TooltipContainer,
					null,
					React.createElement(OHLCTooltip, { forChart: 1, origin: [-40, 0] })
				)
			);
		}
	}]);

	return LineAndScatterChart;
})(React.Component);

LineAndScatterChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
};
LineAndScatterChart.defaultProps = {
	type: "svg"
};
LineAndScatterChart = fitWidth(LineAndScatterChart);

var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
d3["tsv"]("//rrag.github.io/react-stockcharts/data/MSFT.tsv", function (err, data) {
	// change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points 
	data.forEach(function (d, i) {
		d.date = new Date(d3.time.format("%Y-%m-%d").parse(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	//change the type from hybrid to svg to compare the performance between svg and canvas 
	ReactDOM.render(React.createElement(
		TypeChooser,
		{ type: "hybrid" },
		function (type) {
			return React.createElement(LineAndScatterChart, { data: data, type: type });
		}
	), document.getElementById("chart"));
});



Strategy:
	For ngReact I am not using the directive I need to call, I am just making the vars

	Children adding in ngReact:
	https://github.com/ngReact/ngReact/blob/master/examples/table/app.js

*/

