'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

require('fabric');

var _matrix = require('./matrix');

var _matrix2 = _interopRequireDefault(_matrix);

var _tran = require('./tran.js');

var _tran2 = _interopRequireDefault(_tran);

var _filter = require('./filter.js');

var _filter2 = _interopRequireDefault(_filter);

require('babel-polyfill');

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by fenghuitao on 17-8-28.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Header = _antd.Layout.Header,
    Content = _antd.Layout.Content,
    Footer = _antd.Layout.Footer,
    Sider = _antd.Layout.Sider;

// import OperatorPanel from './panel/OperatorPanel'


var ReactFabricEditor = function (_React$Component) {
  _inherits(ReactFabricEditor, _React$Component);

  function ReactFabricEditor(props) {
    var _this2 = this;

    _classCallCheck(this, ReactFabricEditor);

    var _this = _possibleConstructorReturn(this, (ReactFabricEditor.__proto__ || Object.getPrototypeOf(ReactFabricEditor)).call(this, props));

    _this.applyFilter = function (index, filter) {
      var obj = _this.state.canvas.getActiveObject();
      obj.filters[index] = filter;
      obj.applyFilters();
      _this.state.canvas.renderAll();
    };

    _this.getFilter = function (index) {
      var obj = _this.state.canvas.getActiveObject();
      return obj.filters[index];
    };

    _this.applyFilterValue = function (index, prop, value) {
      var obj = _this.state.canvas.getActiveObject();
      if (obj.filters[index]) {
        obj.filters[index][prop] = value;
        var timeStart = +new Date();
        obj.applyFilters();
        _this.state.canvas.renderAll();
      }
    };

    _this.lock = function () {
      var cob = _this.state.canvas.getActiveObject();
      cob.lockMovementX = !cob.lockMovementX;
      cob.lockMovementY = !cob.lockMovementY;
      cob.lockRotation = !cob.lockRotation;
      cob.lockScalingFlip = !cob.lockScalingFlip;
      cob.lockScalingX = !cob.lockScalingX;
      cob.lockScalingY = !cob.lockScalingY;
      cob.lockUniScaling = !cob.lockUniScaling;
    };

    _this.reverse = function () {
      var c = _this.state.canvas.getActiveObject();
      if (c && !c.lockMovementX) {
        c.set('scaleX', -1);
        c.setCoords();
        _this.state.canvas.renderAll();
      }
    };

    _this.cloneHandle = function () {
      var c = _this.state.canvas.getActiveObject();
      var copyData = JSON.parse(JSON.stringify(c.toObject()));
      fabric.util.enlivenObjects([copyData], function (objects) {
        objects.forEach(function (o) {
          o.set('top', o.top + 15);
          o.set('left', o.left + 15);
          _this.state.canvas.add(o);
          o.setCoords();
        });
        _this.state.canvas.renderAll();
      });
    };

    _this.upAndDown = function () {
      var cob = _this.state.canvas.getActiveObject();
      _this.state.canvas.bringForward(cob);
    };

    _this.deleteSelect = function () {
      _this.state.canvas.remove(_this.state.canvas.getActiveObject());
      _this.state.canvas.renderAll();
    };

    _this.reset = function () {
      _this.state.canvas.clear();
    };

    _this.crop = function () {
      _this.state.canvas.remove(_this.el);
      _this.state.canvas.renderAll();
      console.log(_this.state.canvas);
      if (_this.state.canvas.getActiveObject()) {
        _this.cob = _this.state.canvas.getActiveObject();
        if (_this.cob.type === 'sprite') {
          alert("所选对象不可裁剪。");
          return;
        } else {
          if (_this.lastActive !== _this.cob) {
            console.log('different object');
          } else {
            console.log('same object');
          }
          if (_this.lastActive && _this.lastActive !== _this.cob) {
            _this.lastActive.clipTo = null;
          }

          //生成一个和待裁剪元素相同大小的矩形用于框选裁剪区域
          _this.el = new fabric.Rect({
            fill: 'rgba(0,0,0,0)',
            originX: 'left',
            originY: 'top',
            stroke: '#ccc',
            strokeDashArray: [2, 2],
            strokWidth: 5,
            opacity: 1,
            width: 1,
            height: 1,
            borderColor: '#36fd00',
            cornerColor: 'green',
            hasRotatingPoint: false,
            selectable: true
          });

          _this.el.left = _this.cob.left;
          _this.selection_object_left = _this.cob.left;
          _this.selection_object_top = _this.cob.top;
          _this.el.top = _this.cob.top;
          _this.el.width = _this.cob.width * _this.cob.scaleX;
          _this.el.height = _this.cob.height * _this.cob.scaleY;
          _this.state.canvas.add(_this.el);
          _this.state.canvas.setActiveObject(_this.el);
        }
        _this.isCropping = true;
      } else if (_this.isCropping) {
        var left = _this.el.left - _this.cob.left;
        var top = _this.el.top - _this.cob.top;

        left *= 1;
        top *= 1;

        var width = _this.el.width * 1;
        var height = _this.el.height * 1;

        _this.state.canvas.remove(_this.cob);
        _this.state.canvas.remove(_this.state.canvas.getActiveObject());

        //将当前帧导出到一个新的canvas中并执行裁剪，在此期间暂停记录历史记录。
        _this.cropImage(_this.cob, _this.el.left, _this.el.top, parseInt(_this.el.scaleY * height), parseInt(width * _this.el.scaleX));

        _this.lastActive = _this.cob;
        _this.state.canvas.renderAll();

        _this.isCropping = false;
      }
    };

    _this.cropImage = function (png, left, top, height, width) {
      //将图片放进一个新的canvas中，经裁剪后导出一个新的图片。
      //如果用户选框大于原图片，则将选框缩至原图片大小
      if (top < png.top) {
        height = height - (png.top - top);
        top = png.top;
      }
      if (left < png.left) {
        width = width - (png.left - left);
        left = png.left;
      }
      if (top + height > png.top + png.height * png.scaleY) height = png.top + png.height * png.scaleY - top;
      if (left + width > png.left + png.width * png.scaleX) width = png.left + png.width * png.scaleX - left;

      var canvas_crop = new fabric.Canvas("canvas_crop");

      fabric.Image.fromURL(canvas.toDataURL('png'), function (img) {
        img.set('left', -(left + 1));
        img.set('top', -(top + 1));
        canvas_crop.add(img);
        canvas_crop.setHeight(height);
        canvas_crop.setWidth(width);
        canvas_crop.renderAll();
        fabric.Image.fromURL(canvas_crop.toDataURL('png'), function (croppedImg) {
          croppedImg.set('left', left);
          croppedImg.set('top', top);
          _this.state.canvas.add(croppedImg).renderAll();
        });
      });
    };

    _this.saveTran = function () {
      var canvas = document.getElementById('canvas_tran');
      var ctx = canvas.getContext('2d');
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(_filter2.default.trim(imgData), 0, 0);

      var a = document.createElement('a');
      a.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
      a.click();
    };

    _this.saveCrop = function () {
      var canvasEl = document.getElementById('canvas_tran');
      var ctx = canvasEl.getContext('2d');
      var imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
      var cropObj = _filter2.default.crop(imgData);

      var img = new Image();
      img.src = canvasEl.toDataURL();
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      canvasEl.width = cropObj.sw;
      canvasEl.height = cropObj.sh;
      setTimeout(function () {
        ctx.drawImage(img, cropObj.sx, cropObj.sy, cropObj.sw, cropObj.sh, 0, 0, canvasEl.width, canvasEl.height);
      }, 0);
    };

    _this.save = function () {
      var json = _this.state.canvas.toJSON();
      console.log(JSON.stringify(json));
    };

    _this.onChange = function (value) {
      _this.setState({
        inputValue: value > 0 ? "+" + value : value
      });
    };

    _this.tranformHandler = function () {
      _this.setState({ isTran: true, tranItem: _this.state.canvas.getActiveObject() });
    };

    _this.tranformSave = function () {

      var canvasEl = document.getElementById('canvas_tran');
      var ctx = canvasEl.getContext('2d');
      var imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
      var cropObj = _filter2.default.crop(imgData);

      var img = new Image();
      img.src = canvasEl.toDataURL();
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      canvasEl.width = cropObj.sw;
      canvasEl.height = cropObj.sh;
      _this.setState({ isTran: false });
      setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ctx.drawImage(img, cropObj.sx, cropObj.sy, cropObj.sw, cropObj.sh, 0, 0, canvasEl.width, canvasEl.height);
                _context.next = 3;
                return _this.state.onUploadFun({ "imgData": canvasEl.toDataURL() });

              case 3:
                data = _context.sent;

                if (_this.state.readPath) {
                  _this.state.canvas.getActiveObject().setSrc(_this.state.readPath + data.md5list[0], function () {
                    _this.state.canvas.renderAll();
                    var temp = document.getElementById('canvas_tran');
                    temp.setAttribute('width', 800 + 'px');
                    temp.setAttribute('height', 600 + 'px');
                  });
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      })), 0);
    };

    _this.filterHandler = function () {
      if (_this.state.filterVisible) return;
      var c = _this.state.canvas.getActiveObject();
      if (c) {
        _this.applyFilter(0, new fabric.Image.filters.Brightness());
        _this.applyFilter(1, new fabric.Image.filters.Contrast());
        _this.applyFilter(2, new fabric.Image.filters.Saturation());
        _this.applyFilter(3, new fabric.Image.filters.Blur());
      }
    };

    _this.onBrightnessChange = function (v) {
      _this.setState({ brightness: v });
      _this.applyFilterValue(0, 'brightness', v / 200);
    };

    _this.onContrastChange = function (v) {
      _this.setState({ contrast: v });
      _this.applyFilterValue(1, 'contrast', v / 200);
    };

    _this.onSaturationChange = function (v) {
      _this.setState({ saturation: v });
      _this.applyFilterValue(2, 'saturation', v * .8);
    };

    _this.onBlurChange = function (v) {
      _this.setState({ blur: v });
      _this.applyFilterValue(3, 'blur', v / 100);
    };

    _this.onHueChange = function (v) {
      _this.setState({ hue: v });
      _this.applyFilterValue(4, 'rotation', v);
    };

    _this.onOpacityChange = function (v) {
      _this.setState({ opacity: v });
      _this.state.canvas.getActiveObject().set('opacity', Math.round(100 - .9 * v) / 100);
      _this.state.canvas.renderAll();
    };

    _this.itemClickHandler = function (v) {
      console.log(v);
      var option = { abc: v };
      fabric.Image.fromURL(v, function (oImg) {
        _this.state.canvas.add(oImg);
        console.log(option);
        _this.state.canvas.renderAll();
      }, option);
    };

    _this.renderItem = function (index, key) {
      var names = _this.state.accounts[index].split('/');
      return _react2.default.createElement(
        'div',
        { style: { height: 65 }, onClick: function onClick() {
            return _this.itemClickHandler(_this.state.accounts[index]);
          }, key: _this.state.accounts[index] },
        _react2.default.createElement('img', { src: _this.state.accounts[index], style: { width: 50, height: 60, marginLeft: "10px" } }),
        _react2.default.createElement(
          'span',
          { style: { marginLeft: "10px", display: !_this.state.collapsed ? '' : "none" } },
          names[names.length - 1]
        )
      );
    };

    _this.onCollapse = function (collapsed) {
      console.log(collapsed);
      _this.setState({ collapsed: collapsed });
    };

    _this.tranformRet = function () {

      if (_this.state.isTran) {
        _this.setState({ isTran: false });
      } else {
        _this.state.canvas.getContext('2d').restore();
      }
    };

    _this.uploadOpus = function () {
      _this.state.onAddFun && _this.state.onAddFun({ "item": { "value": JSON.stringify(_this.state.canvas.toJSON()) } });
      // let data = await api("http://127.0.0.1:22222/System/addItem", { "item": { "value": JSON.stringify(this.state.canvas.toJSON()) } });
      // console.log(data, '------------------------');
    };

    _this.showPop = function () {
      _this.setState({
        filterVisible: !_this.state.filterVisible
      });
    };

    _this.state = {
      url: '', //父级点击传给的数据rul
      filterVisible: false,
      collapsed: false,
      canvas: null,
      isTran: false,
      tranItem: null,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      hue: 0,
      opacity: 0,
      data: _this.props.data,
      pselectUrl: _this.props.pselectUrl,
      onSelectFun: _this.props.onSelectFun,
      onUploadFun: _this.props.onUploadFun,
      readPath: _this.props.readPath,
      onAddFun: _this.props.onAddFun
    };
    _this.dots = [];
    _this.dotscopy = null;
    _this.idots = null;
    _this.count = 10;
    _this.el, _this.lastActive, _this.cob;
    _this.selection_object_left = 0;
    _this.selection_object_top = 0;
    _this.isCropping = false;
    return _this;
  }

  _createClass(ReactFabricEditor, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (nextProps.pselectUrl !== '') {
        fabric.Image.fromURL(nextProps.pselectUrl, function (oImg) {
          _this3.state.canvas.add(oImg);
          _this3.state.canvas.renderAll();
        }, {});
      }
      if (nextProps.data) {
        this.state.canvas.loadFromJSON(nextProps.data, function () {
          console.log('恢复完毕！');
        });
      }
    }

    // static propTypes = {
    //   onSelectFun: React.PropTypes.func.isRequired,//点击回调父级方法
    //   uploadUrl: React.PropTypes.string.isRequired,//保存数据url
    //   dataUrl: React.PropTypes.string.isRequired,//获得数据rul
    // };


  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      if (!this.state.canvas) {
        var webglBackend = new fabric.WebglFilterBackend();
        var canvas2dBackend = new fabric.Canvas2dFilterBackend();

        fabric.filterBackend = webglBackend;
        fabric.Object.prototype.transparentCorners = false;

        var _canvas = new fabric.Canvas("canvas");
        _canvas.on('object:selected', function (e) {
          if (_this4.state.onSelectFun && e.target.getSrc) {
            _this4.state.onSelectFun(e.target.getSrc());
          }
        });
        _canvas.preserveObjectStacking = true;
        _canvas.stateful = true;
        this.setState({ canvas: _canvas });
        _canvas.setWidth(1103);
        _canvas.setHeight(500);
        _canvas.loadFromJSON(this.state.data, function () {
          console.log('恢复完毕！');
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.isTran) {
        _tran2.default.getWin(document.getElementById("canvas_tran"), this.state.tranItem);
      } else {
        _tran2.default.delectMouse();
      }
    }

    //reverse


    //clone


    //剪切

  }, {
    key: 'render',
    value: function render() {
      var sh = document.body.clientHeight - 53;
      var content = _react2.default.createElement(
        'div',
        { style: { lineHeight: '32px' } },
        _react2.default.createElement(
          _antd.Row,
          null,
          _react2.default.createElement(
            _antd.Col,
            { span: 4 },
            _react2.default.createElement(
              'div',
              null,
              '\u4EAE\u5EA6'
            )
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 18 },
            _react2.default.createElement(_antd.Slider, { min: -100, max: +100, onChange: this.onBrightnessChange, value: this.state.brightness })
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 2 },
            _react2.default.createElement(
              'div',
              { style: { marginLeft: 5 } },
              this.state.brightness
            )
          )
        ),
        _react2.default.createElement(
          _antd.Row,
          null,
          _react2.default.createElement(
            _antd.Col,
            { span: 4 },
            _react2.default.createElement(
              'div',
              null,
              '\u5BF9\u6BD4\u5EA6'
            )
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 18 },
            _react2.default.createElement(_antd.Slider, { min: -100, max: +100, onChange: this.onContrastChange, value: this.state.contrast })
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 2 },
            _react2.default.createElement(
              'div',
              { style: { marginLeft: 5 } },
              this.state.contrast
            )
          )
        ),
        _react2.default.createElement(
          _antd.Row,
          null,
          _react2.default.createElement(
            _antd.Col,
            { span: 4 },
            _react2.default.createElement(
              'div',
              null,
              '\u9971\u548C\u5EA6'
            )
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 18 },
            _react2.default.createElement(_antd.Slider, { min: -100, max: +100, onChange: this.onSaturationChange, value: this.state.saturation })
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 2 },
            _react2.default.createElement(
              'div',
              { style: { marginLeft: 5 } },
              this.state.saturation
            )
          )
        ),
        _react2.default.createElement(
          _antd.Row,
          null,
          _react2.default.createElement(
            _antd.Col,
            { span: 4 },
            _react2.default.createElement(
              'div',
              null,
              '\u6E05\u6670\u5EA6'
            )
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 18 },
            _react2.default.createElement(_antd.Slider, { min: 0, max: 100, onChange: this.onBlurChange, value: this.state.blur })
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 2 },
            _react2.default.createElement(
              'div',
              { style: { marginLeft: 5 } },
              this.state.blur
            )
          )
        ),
        _react2.default.createElement(
          _antd.Row,
          null,
          _react2.default.createElement(
            _antd.Col,
            { span: 4 },
            _react2.default.createElement(
              'div',
              null,
              '\u8272\u5F69'
            )
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 18 },
            _react2.default.createElement(_antd.Slider, { min: -100, max: +100, onChange: this.onHueChange, value: this.state.hue })
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 2 },
            _react2.default.createElement(
              'div',
              { style: { marginLeft: 5 } },
              this.state.hue
            )
          )
        ),
        _react2.default.createElement(
          _antd.Row,
          null,
          _react2.default.createElement(
            _antd.Col,
            { span: 4 },
            _react2.default.createElement(
              'div',
              null,
              '\u900F\u660E\u5EA6'
            )
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 18 },
            _react2.default.createElement(_antd.Slider, { min: 0, max: +100, onChange: this.onOpacityChange, value: this.state.opacity })
          ),
          _react2.default.createElement(
            _antd.Col,
            { span: 2 },
            _react2.default.createElement(
              'div',
              { style: { marginLeft: 5 } },
              this.state.opacity,
              '%'
            )
          )
        )
      );
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _antd.Layout,
          null,
          _react2.default.createElement(
            Content,
            { style: { margin: '0 16px' } },
            _react2.default.createElement(
              _antd.Breadcrumb,
              { style: { margin: '12px 0' } },
              _react2.default.createElement(
                _antd.Breadcrumb.Item,
                null,
                'User'
              ),
              _react2.default.createElement(
                _antd.Breadcrumb.Item,
                null,
                'Bill'
              )
            ),
            _react2.default.createElement(
              'div',
              { style: { padding: 24, background: '#fff', minHeight: 360 } },
              _react2.default.createElement(
                _antd.Popover,
                { content: content, title: null, visible: this.state.filterVisible, onClick: this.showPop, overlayStyle: { width: '300px' } },
                _react2.default.createElement(
                  _antd.Button,
                  { onClick: this.filterHandler },
                  '\u6EE4\u955C'
                )
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.crop },
                '\u526A\u5207'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.cloneHandle },
                '\u590D\u5236'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.reverse },
                '\u53CD\u8F6C'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.lock },
                '\u9501\u5B9A'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.upAndDown },
                '\u5C42\u7EA7'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.tranformHandler },
                '\u53D8\u5F62'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.save },
                '\u4FDD\u5B58'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.saveTran },
                ' \u53BB\u9664\u767D\u8272&\u4E0B\u8F7D'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.tranformRet.bind(this) },
                '\u8FD8\u539F'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.tranformSave },
                '\u4FDD\u5B58\u53D8\u5F62'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.uploadOpus },
                '\u4E0A\u4F20\u4F5C\u54C1'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.deleteSelect },
                '\u5220\u9664'
              ),
              _react2.default.createElement(
                _antd.Button,
                { onClick: this.reset },
                '\u91CD\u7F6E'
              ),
              _react2.default.createElement(
                'div',
                { style: { position: "relative" } },
                _react2.default.createElement('canvas', { id: 'canvas',
                  width: '800', height: '600', style: {
                    border: '1px solid grey',
                    'borderRadius': '2px'
                  } }),
                _react2.default.createElement('canvas', { style: {
                    visibility: "hidden", position: "absolute", left: "0px", display: "inline-block",
                    top: "0px"
                  }, id: 'canvas_crop' }),
                _react2.default.createElement('canvas', { id: 'canvas_tran', width: '800', height: '600', visibility: false, style: _defineProperty({
                    position: "absolute", left: "-5px", display: "inline-block",
                    top: "0px",
                    margin: 'auto',
                    border: '1px solid grey',
                    'borderRadius': '2px'
                  }, 'display', this.state.isTran ? 'block' : "none") })
              )
            )
          )
        )
      );
    }
  }]);

  return ReactFabricEditor;
}(_react2.default.Component);

exports.default = ReactFabricEditor;
//# sourceMappingURL=ReactFabricEditor.js.map