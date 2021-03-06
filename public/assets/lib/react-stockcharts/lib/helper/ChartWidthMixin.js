"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChartWidthMixin = {
	handleWindowResize: function handleWindowResize() {
		var el = _reactDom2.default.findDOMNode(this);
		// console.log(this.refs, el, this);

		var w = el.parentNode.clientWidth;
		// console.log("width = ", w);
		this.setState({
			width: w
		});
	},
	componentWillUnmount: function componentWillUnmount() {
		// console.log("unmounting...")
		window.removeEventListener("resize", this.handleWindowResize);
	},
	componentDidMount: function componentDidMount() {
		window.addEventListener("resize", this.handleWindowResize);
		var el = _reactDom2.default.findDOMNode(this);
		// console.log(this.refs, el);
		var w = el.parentNode.clientWidth;

		/* eslint-disable react/no-did-mount-set-state */
		this.setState({
			width: w
		});
		/* eslint-enable react/no-did-mount-set-state */
	}
};

exports.default = ChartWidthMixin;