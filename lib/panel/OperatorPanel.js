'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _panel = require('./panel.css');

var _panel2 = _interopRequireDefault(_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OperatorPanel = function (_React$Component) {
    _inherits(OperatorPanel, _React$Component);

    function OperatorPanel(props) {
        _classCallCheck(this, OperatorPanel);

        return _possibleConstructorReturn(this, (OperatorPanel.__proto__ || Object.getPrototypeOf(OperatorPanel)).call(this, props));
    }

    _createClass(OperatorPanel, [{
        key: 'render',
        value: function render() {
            console.log('fuck~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            return _react2.default.createElement(
                'div',
                { className: _panel2.default.box },
                _react2.default.createElement(
                    'ul',
                    null,
                    _react2.default.createElement('li', { className: _panel2.default.li_a }),
                    _react2.default.createElement('li', { className: _panel2.default.li_b }),
                    _react2.default.createElement('li', { className: _panel2.default.li_c }),
                    _react2.default.createElement('li', { className: _panel2.default.li_d }),
                    _react2.default.createElement('li', { className: _panel2.default.li_e }),
                    _react2.default.createElement('li', { className: _panel2.default.li_f }),
                    _react2.default.createElement('li', { className: _panel2.default.li_j }),
                    _react2.default.createElement(
                        'li',
                        { className: _panel2.default.li_l, id: 'leveDom' },
                        _react2.default.createElement(
                            'div',
                            { className: _panel2.default.li_l_box, id: 'li_l_box' },
                            _react2.default.createElement(
                                'ul',
                                null,
                                _react2.default.createElement('li', { className: _panel2.default.li_l_box_a }),
                                _react2.default.createElement('li', { className: _panel2.default.li_l_box_b }),
                                _react2.default.createElement('li', { className: _panel2.default.li_l_box_c }),
                                _react2.default.createElement('li', { className: _panel2.default.li_l_box_d })
                            )
                        )
                    )
                )
            );
        }
    }]);

    return OperatorPanel;
}(_react2.default.Component);

exports.default = OperatorPanel;
//# sourceMappingURL=OperatorPanel.js.map