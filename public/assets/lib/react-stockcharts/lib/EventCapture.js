"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d2 = require("d3");

var _d3 = _interopRequireDefault(_d2);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getTouchProps(touch) {
	if (!touch) return {};
	return {
		pageX: touch.pageX,
		pageY: touch.pageY,
		clientX: touch.clientX,
		clientY: touch.clientY
	};
}

var EventCapture = function (_Component) {
	_inherits(EventCapture, _Component);

	function EventCapture(props) {
		_classCallCheck(this, EventCapture);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventCapture).call(this, props));

		_this.handleEnter = _this.handleEnter.bind(_this);
		_this.handleLeave = _this.handleLeave.bind(_this);
		_this.handleWheel = _this.handleWheel.bind(_this);
		_this.handleMouseMove = _this.handleMouseMove.bind(_this);
		_this.handleMouseDown = _this.handleMouseDown.bind(_this);
		_this.handlePanEnd = _this.handlePanEnd.bind(_this);
		_this.handlePan = _this.handlePan.bind(_this);
		_this.handleTouchStart = _this.handleTouchStart.bind(_this);
		_this.handleTouchMove = _this.handleTouchMove.bind(_this);
		_this.handleTouchEnd = _this.handleTouchEnd.bind(_this);
		_this.lastTouch = {};
		_this.initialPinch = {};
		_this.mouseInteraction = true;
		return _this;
	}

	_createClass(EventCapture, [{
		key: "getChildContext",
		value: function getChildContext() {
			return {
				eventMeta: this.eventMeta
			};
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			if (this.context.onFocus) this.context.onFocus(this.props.defaultFocus);
		}
	}, {
		key: "handleEnter",
		value: function handleEnter(e) {
			var eventMeta = this.props.eventMeta;

			this.eventMeta = eventMeta(e, ["enter"]);

			if (this.context.onMouseEnter) {
				this.context.onMouseEnter(e);
			}
		}
	}, {
		key: "handleLeave",
		value: function handleLeave(e) {
			var eventMeta = this.props.eventMeta;

			this.eventMeta = eventMeta(e, ["exit"]);

			if (this.context.onMouseLeave) this.context.onMouseLeave(e);
		}
	}, {
		key: "handleWheel",
		value: function handleWheel(e) {
			var _props = this.props;
			var zoom = _props.zoom;
			var onZoom = _props.onZoom;
			var zoomMultiplier = _props.zoomMultiplier;
			var eventMeta = _props.eventMeta;


			if (zoom && this.context.onZoom && this.context.focus) {
				// e.stopPropagation();
				e.preventDefault();
				var newPos = (0, _utils.mousePosition)(e);
				var zoomDir = e.deltaY > 0 ? zoomMultiplier : -zoomMultiplier;

				this.eventMeta = eventMeta(e, ["zoom"]);

				this.context.onZoom(zoomDir, newPos, e);

				if (onZoom) {
					onZoom(newPos, e);
				}
			}
		}
	}, {
		key: "handleMouseMove",
		value: function handleMouseMove(e) {
			var _props2 = this.props;
			var eventMeta = _props2.eventMeta;
			var onMouseMove = _props2.onMouseMove;

			this.eventMeta = eventMeta(e, ["mousemove"]);

			var newPos = (0, _utils.mousePosition)(e);

			if (this.mouseInteraction && this.context.onMouseMove && this.props.mouseMove && !this.context.panInProgress) {
				this.context.onMouseMove(newPos, "mouse", e);
			}
			if (onMouseMove) onMouseMove(newPos, e);
		}
	}, {
		key: "handleMouseDown",
		value: function handleMouseDown(e) {
			var mouseEvent = e || _d3.default.event;
			var _props3 = this.props;
			var pan = _props3.pan;
			var eventMeta = _props3.eventMeta;


			this.eventMeta = eventMeta(mouseEvent, ["mousedown"]);

			var _context = this.context;
			var onPanStart = _context.onPanStart;
			var focus = _context.focus;
			var onFocus = _context.onFocus;
			var xScale = _context.xScale;

			if (this.mouseInteraction && pan && onPanStart) {
				var mouseXY = (0, _utils.mousePosition)(mouseEvent);
				this.panStart = mouseXY;

				var dx = mouseEvent.pageX - mouseXY[0],
				    dy = mouseEvent.pageY - mouseXY[1];

				var captureDOM = this.refs.capture;

				var win = (0, _utils.d3Window)(captureDOM);
				_d3.default.select(win).on(_utils.MOUSEMOVE, this.handlePan).on(_utils.MOUSEUP, this.handlePanEnd);

				onPanStart(xScale.domain(), mouseXY, [dx, dy]);
			} else {
				if (!focus && onFocus) onFocus(true);
			}
			mouseEvent.preventDefault();
		}
	}, {
		key: "handleRightClick",
		value: function handleRightClick(e) {
			e.preventDefault();
			// console.log("RIGHT CLICK");
		}
	}, {
		key: "handlePan",
		value: function handlePan() {
			// console.log("handlePan")
			var e = _d3.default.event;

			var eventMeta = this.props.eventMeta;
			var _props4 = this.props;
			var panEnabled = _props4.pan;
			var panListener = _props4.onPan;
			var _context2 = this.context;
			var dxdy = _context2.deltaXY;
			var xScale = _context2.xScale;
			var onPan = _context2.onPan;


			var newPos = [e.pageX - dxdy[0], e.pageY - dxdy[1]];

			this.eventMeta = eventMeta(e, ["pan"]);
			// console.log("moved from- ", startXY, " to ", newPos);
			if (this.mouseInteraction && panEnabled && onPan) {

				onPan(newPos, xScale.domain(), e);
				if (panListener) {
					panListener(newPos, e);
				}
			}
		}
	}, {
		key: "handlePanEnd",
		value: function handlePanEnd() {
			var e = _d3.default.event;

			var _props5 = this.props;
			var panEnabled = _props5.pan;
			var eventMeta = _props5.eventMeta;
			var _context3 = this.context;
			var dxdy = _context3.deltaXY;
			var onPanEnd = _context3.onPanEnd;

			var _panStart = _slicedToArray(this.panStart, 2);

			var startX = _panStart[0];
			var startY = _panStart[1];
			var x = e.pageX - dxdy[0];
			var y = e.pageY - dxdy[1];


			var eventType = startX === x && startY === y ? ["click"] : [];

			this.eventMeta = eventMeta(e, ["mouseup"].concat(eventType));
			this.panStart = null;

			var captureDOM = this.refs.capture;

			var win = (0, _utils.d3Window)(captureDOM);

			if (this.mouseInteraction && panEnabled && onPanEnd) {
				_d3.default.select(win).on(_utils.MOUSEMOVE, null).on(_utils.MOUSEUP, null);
				onPanEnd([x, y], e);
			}
			// e.preventDefault();
		}
	}, {
		key: "handleTouchStart",
		value: function handleTouchStart(e) {
			this.mouseInteraction = false;

			var panEnabled = this.props.pan;
			var dxdy = this.context.deltaXY;
			var _context4 = this.context;
			var onPanStart = _context4.onPanStart;
			var onMouseMove = _context4.onMouseMove;
			var xScale = _context4.xScale;
			var onPanEnd = _context4.onPanEnd;
			var panInProgress = _context4.panInProgress;


			if (e.touches.length === 1) {
				var touch = getTouchProps(e.touches[0]);
				this.lastTouch = touch;
				var touchXY = (0, _utils.touchPosition)(touch, e);
				onMouseMove(touchXY, "touch", e);
				if (panEnabled && onPanStart) {
					var dx = touch.pageX - touchXY[0],
					    dy = touch.pageY - touchXY[1];

					onPanStart(xScale.domain(), touchXY, [dx, dy]);
				}
			} else if (e.touches.length === 2) {
				// pinch zoom begin
				// do nothing pinch zoom is handled in handleTouchMove
				var touch1 = getTouchProps(e.touches[0]);

				if (panInProgress && panEnabled && onPanEnd) {
					// end pan first
					var newPos = [touch1.pageX - dxdy[0], touch1.pageY - dxdy[1]];
					onPanEnd(newPos, e);
					this.lastTouch = null;
				}
			}

			if (e.touches.length !== 2) this.initialPinch = null;
			// var newPos = mousePosition(e);
			// console.log("handleTouchStart", e);
			e.preventDefault();
			// e.stopPropagation();
			// this.context.onMouseMove(newPos, e);
		}
	}, {
		key: "handleTouchMove",
		value: function handleTouchMove(e) {
			var _props6 = this.props;
			var panEnabled = _props6.pan;
			var panListener = _props6.onPan;
			var zoomEnabled = _props6.zoom;
			var _context5 = this.context;
			var dxdy = _context5.deltaXY;
			var xScale = _context5.xScale;
			var onPan = _context5.onPan;
			var onPinchZoom = _context5.onPinchZoom;
			var focus = _context5.focus;
			var panInProgress = _context5.panInProgress;


			if (e.touches.length === 1) {
				// pan
				var touch = this.lastTouch = getTouchProps(e.touches[0]);

				var newPos = [touch.pageX - dxdy[0], touch.pageY - dxdy[1]];
				if (panInProgress && panEnabled && onPan) {
					onPan(newPos, xScale.domain());
					if (panListener) {
						panListener(e);
					}
				}
			} else if (e.touches.length === 2) {
				// pinch zoom
				if (zoomEnabled && onPinchZoom && focus) {
					var touch1 = getTouchProps(e.touches[0]);
					var touch2 = getTouchProps(e.touches[1]);

					var touch1Pos = (0, _utils.touchPosition)(touch1, e);
					var touch2Pos = (0, _utils.touchPosition)(touch2, e);

					if (this.initialPinch === null) {
						this.initialPinch = {
							touch1Pos: touch1Pos,
							touch2Pos: touch2Pos,
							xScale: xScale,
							range: xScale.range()
						};
					} else if (this.initialPinch && !panInProgress) {
						onPinchZoom(this.initialPinch, {
							touch1Pos: touch1Pos,
							touch2Pos: touch2Pos,
							xScale: xScale
						});
					}
				}
			}
			e.preventDefault();

			// console.log("handleTouchMove", e);
		}
	}, {
		key: "handleTouchEnd",
		value: function handleTouchEnd(e) {
			// TODO enableMouseInteraction
			var panEnabled = this.props.pan;
			var _context6 = this.context;
			var dxdy = _context6.deltaXY;
			var onPanEnd = _context6.onPanEnd;
			var panInProgress = _context6.panInProgress;


			if (this.lastTouch) {
				var newPos = [this.lastTouch.pageX - dxdy[0], this.lastTouch.pageY - dxdy[1]];

				this.initialPinch = null;
				if (panInProgress && panEnabled && onPanEnd) {
					onPanEnd(newPos, e);
				}
			}
			// console.log("handleTouchEnd", dxdy, newPos, e);
			this.mouseInteraction = true;
			e.preventDefault();
		}
	}, {
		key: "render",
		value: function render() {
			var className = this.context.panInProgress ? "react-stockcharts-grabbing-cursor" : "react-stockcharts-crosshair-cursor";
			var clipStyle = { "clipPath": "url(#chart-area-clip)" };
			return _react2.default.createElement(
				"g",
				{ style: clipStyle },
				_react2.default.createElement("rect", { ref: "capture",
					className: className,
					width: this.context.width, height: this.context.height, style: { opacity: 0 },
					onMouseEnter: this.handleEnter,
					onMouseLeave: this.handleLeave,
					onMouseMove: this.handleMouseMove,
					onWheel: this.handleWheel,
					onMouseDown: this.handleMouseDown,
					onContextMenu: this.handleRightClick,
					onTouchStart: this.handleTouchStart,
					onTouchEnd: this.handleTouchEnd,
					onTouchMove: this.handleTouchMove }),
				this.props.children
			);
		}
	}]);

	return EventCapture;
}(_react.Component);

EventCapture.propTypes = {
	mouseMove: _react.PropTypes.bool.isRequired,
	zoom: _react.PropTypes.bool.isRequired,
	zoomMultiplier: _react.PropTypes.number.isRequired,
	pan: _react.PropTypes.bool.isRequired,
	panSpeedMultiplier: _react.PropTypes.number.isRequired,
	defaultFocus: _react.PropTypes.bool.isRequired,
	useCrossHairStyle: _react.PropTypes.bool.isRequired,
	onZoom: _react.PropTypes.func,
	onPan: _react.PropTypes.func,
	onMouseMove: _react.PropTypes.func,
	eventMeta: _react.PropTypes.func,
	children: _react.PropTypes.node
};

EventCapture.defaultProps = {
	mouseMove: false,
	zoom: false,
	zoomMultiplier: 1,
	pan: false,
	panSpeedMultiplier: 1,
	defaultFocus: false,
	useCrossHairStyle: true,
	eventMeta: function eventMeta(e, type) {
		var button = e.button;
		var shiftKey = e.shiftKey;
		return { button: button, shiftKey: shiftKey, type: type };
	}
};

EventCapture.contextTypes = {
	width: _react.PropTypes.number.isRequired,
	height: _react.PropTypes.number.isRequired,
	panInProgress: _react.PropTypes.bool,
	focus: _react.PropTypes.bool.isRequired,
	chartConfig: _react.PropTypes.array,
	xScale: _react.PropTypes.func.isRequired,
	xAccessor: _react.PropTypes.func.isRequired,
	deltaXY: _react.PropTypes.arrayOf(Number),

	onMouseMove: _react.PropTypes.func,
	onMouseEnter: _react.PropTypes.func,
	onMouseLeave: _react.PropTypes.func,
	onZoom: _react.PropTypes.func,
	onPinchZoom: _react.PropTypes.func,
	onPanStart: _react.PropTypes.func,
	onPan: _react.PropTypes.func,
	onPanEnd: _react.PropTypes.func,
	onFocus: _react.PropTypes.func
};

EventCapture.childContextTypes = {
	eventMeta: _react.PropTypes.object
};

exports.default = EventCapture;