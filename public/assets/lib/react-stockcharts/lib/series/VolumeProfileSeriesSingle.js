"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

var _wrap = require("./wrap");

var _wrap2 = _interopRequireDefault(_wrap);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VolumeProfileSeries = function (_Component) {
	_inherits(VolumeProfileSeries, _Component);

	function VolumeProfileSeries() {
		_classCallCheck(this, VolumeProfileSeries);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(VolumeProfileSeries).apply(this, arguments));
	}

	_createClass(VolumeProfileSeries, [{
		key: "render",
		value: function render() {
			var _props = this.props;
			var className = _props.className;
			var opacity = _props.opacity;
			var yScale = _props.yScale;
			var plotData = _props.plotData;


			var rects = helper(this.props, yScale, plotData);

			return _react2.default.createElement(
				"g",
				{ className: className },
				rects.map(function (d, i) {
					return _react2.default.createElement(
						"g",
						{ key: i },
						_react2.default.createElement("rect", { x: d.x, y: d.y,
							width: d.w1, height: d.height,
							fill: d.fill1, stroke: d.stroke1, fillOpacity: opacity }),
						_react2.default.createElement("rect", { x: d.x + d.w1, y: d.y,
							width: d.w2, height: d.height,
							fill: d.fill2, stroke: d.stroke2, fillOpacity: opacity })
					);
				})
			);
		}
	}]);

	return VolumeProfileSeries;
}(_react.Component);

VolumeProfileSeries.propTypes = {
	className: _react.PropTypes.string,
	opacity: _react.PropTypes.number,
	yScale: _react.PropTypes.func,
	plotData: _react.PropTypes.array
};

VolumeProfileSeries.defaultProps = {
	opacity: 0.2,
	className: "line ",
	bins: 50,
	maxProfileWidthPercent: 50,
	source: function source(d) {
		return d.close;
	},
	volume: function volume(d) {
		return d.volume;
	},
	absoluteChange: function absoluteChange(d) {
		return d.absoluteChange;
	},
	/* eslint-disable no-unused-vars */
	sessionStart: function sessionStart(_ref) {
		var d = _ref.d;
		var i = _ref.i;
		var index = _ref.index;
		var plotData = _ref.plotData;
		return i === 0;
	},
	/* eslint-enable no-unused-vars */
	orient: "left",
	fill: function fill(_ref2) {
		var type = _ref2.type;
		return type === "up" ? "#6BA583" : "#FF0000";
	},
	stroke: "#FFFFFF"
};

function helper(props, yScale, plotData) {
	var stroke = props.stroke;
	var width = props.width;
	var bins = props.bins;
	var maxProfileWidthPercent = props.maxProfileWidthPercent;
	var source = props.source;
	var volume = props.volume;
	var absoluteChange = props.absoluteChange;
	var orient = props.orient;
	var fill = props.fill;


	var histogram = _d2.default.layout.histogram().value(source).bins(bins);

	var rollup = _d2.default.nest().key(function (d) {
		return d.direction;
	}).sortKeys(orient === "right" ? _d2.default.descending : _d2.default.ascending).rollup(function (leaves) {
		return _d2.default.sum(leaves, function (d) {
			return d.volume;
		});
	});

	var values = histogram(plotData);
	var volumeInBins = values.map(function (arr) {
		return arr.map(function (d) {
			return absoluteChange(d) > 0 ? { direction: "up", volume: volume(d) } : { direction: "down", volume: volume(d) };
		});
	}).map(function (arr) {
		return rollup.entries(arr);
	});

	var volumeValues = volumeInBins.map(function (each) {
		return _d2.default.sum(each.map(function (d) {
			return d.values;
		}));
	});

	var base = function base(xScale) {
		return (0, _utils.head)(xScale.range());
	};

	var _ref3 = orient === "right" ? [0, width * maxProfileWidthPercent / 100] : [width, width * (100 - maxProfileWidthPercent) / 100];

	var _ref4 = _slicedToArray(_ref3, 2);

	var start = _ref4[0];
	var end = _ref4[1];


	var xScale = _d2.default.scale.linear().domain([0, _d2.default.max(volumeValues)]).range([start, end]);

	var rects = _d2.default.zip(values, volumeInBins).map(function (_ref5) {
		var _ref6 = _slicedToArray(_ref5, 2);

		var d = _ref6[0];
		var volumes = _ref6[1];

		var totalVolume = _d2.default.sum(volumes, function (d) {
			return d.values;
		});
		var totalVolumeX = xScale(totalVolume);
		var width = base(xScale) - totalVolumeX;

		var x = width < 0 ? totalVolumeX + width : totalVolumeX;
		var ws = volumes.map(function (d) {
			return {
				type: d.key,
				width: d.values * Math.abs(width) / totalVolume
			};
		});
		var w1 = ws[0] || { type: "up", width: 0 };
		var w2 = ws[1] || { type: "down", width: 0 };

		/* if (totalVolume === 0) {
  	console.log(d.x, d.x + d.dx);
  }*/
		// console.log(totalVolume, x, width, d.x, d.x + d.dx);
		// console.log(width, ws.map(d => d.type))

		return {
			y: yScale(d.x + d.dx),
			height: yScale(d.x - d.dx) - yScale(d.x),
			x: x,
			width: width,
			w1: w1.width,
			w2: w2.width,
			stroke1: _d2.default.functor(stroke)(w1),
			stroke2: _d2.default.functor(stroke)(w2),
			fill1: _d2.default.functor(fill)(w1),
			fill2: _d2.default.functor(fill)(w2)
		};
	});
	return rects;
}

VolumeProfileSeries.drawOnCanvas = function (props, ctx, xScale, yScale, plotData) {
	var opacity = props.opacity;


	var rects = helper(props, yScale, plotData);

	console.log(rects);
	rects.forEach(function (each) {
		var x = each.x;
		var y = each.y;
		var height = each.height;
		var w1 = each.w1;
		var w2 = each.w2;
		var stroke1 = each.stroke1;
		var stroke2 = each.stroke2;
		var fill1 = each.fill1;
		var fill2 = each.fill2;


		if (w1 > 0) {
			ctx.fillStyle = (0, _utils.hexToRGBA)(fill1, opacity);
			if (stroke1 !== "none") ctx.strokeStyle = stroke1;

			ctx.beginPath();
			ctx.rect(x, y, w1, height);
			ctx.closePath();
			ctx.fill();

			if (stroke1 !== "none") ctx.stroke();
		}

		if (w2 > 0) {
			ctx.fillStyle = (0, _utils.hexToRGBA)(fill2, opacity);
			if (stroke2 !== "none") ctx.strokeStyle = stroke2;

			ctx.beginPath();
			ctx.rect(x + w1, y, w2, height);
			ctx.closePath();
			ctx.fill();

			if (stroke2 !== "none") ctx.stroke();
		}
	});
};

exports.default = (0, _wrap2.default)(VolumeProfileSeries);