/**
 * Created by fenghuitao on 17-8-28.
 */
import React, { Component } from 'react';
import { Button, Popover } from 'antd';
import 'fabric';
import matrix from './matrix';
import Tran from './tran.js';
import ImgFilter from './filter.js';
import { Slider, Input, Row, Col, Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import 'babel-polyfill';
import test from './test';
// import OperatorPanel from './panel/OperatorPanel'



class ReactFabricEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',//父级点击传给的数据rul
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
      data: this.props.data,
      pselectUrl: this.props.pselectUrl,
      onSelectFun: this.props.onSelectFun,
      onUploadFun: this.props.onUploadFun,
      readPath: this.props.readPath,
      onAddFun: this.props.onAddFun,
    };
    this.dots = [];
    this.dotscopy = null;
    this.idots = null;
    this.count = 10;
    this.el, this.lastActive, this.cob;
    this.selection_object_left = 0;
    this.selection_object_top = 0;
    this.isCropping = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pselectUrl !== '') {
      fabric.Image.fromURL(nextProps.pselectUrl, (oImg) => {
        this.state.canvas.add(oImg);
        this.state.canvas.renderAll();
      }, {});
    }
    if(nextProps.data){
      this.state.canvas.loadFromJSON(nextProps.data, () => { console.log('恢复完毕！') })
    }
  }

  // static propTypes = {
  //   onSelectFun: React.PropTypes.func.isRequired,//点击回调父级方法
  //   uploadUrl: React.PropTypes.string.isRequired,//保存数据url
  //   dataUrl: React.PropTypes.string.isRequired,//获得数据rul
  // };


  applyFilter = (index, filter) => {
    var obj = this.state.canvas.getActiveObject();
    obj.filters[index] = filter;
    obj.applyFilters();
    this.state.canvas.renderAll();
  }

  getFilter = (index) => {
    var obj = this.state.canvas.getActiveObject();
    return obj.filters[index];
  }

  applyFilterValue = (index, prop, value) => {
    var obj = this.state.canvas.getActiveObject();
    if (obj.filters[index]) {
      obj.filters[index][prop] = value;
      var timeStart = +new Date();
      obj.applyFilters();
      this.state.canvas.renderAll();
    }
  }

  componentDidMount() {
    if (!this.state.canvas) {
      let webglBackend = new fabric.WebglFilterBackend();
      let canvas2dBackend = new fabric.Canvas2dFilterBackend();

      fabric.filterBackend = webglBackend;
      fabric.Object.prototype.transparentCorners = false;

      let canvas = new fabric.Canvas("canvas");
      canvas.on('object:selected', (e) => {
        if (this.state.onSelectFun && e.target.getSrc) {
          this.state.onSelectFun(e.target.getSrc());
        }
      });
      canvas.preserveObjectStacking = true;
      canvas.stateful = true;
      this.setState({ canvas });
      canvas.setWidth(1103);
      canvas.setHeight(500);
      canvas.loadFromJSON(this.state.data, () => { console.log('恢复完毕！') })
    }
  }

  componentDidUpdate() {
    if (this.state.isTran) {
      Tran.getWin(document.getElementById("canvas_tran"), this.state.tranItem);
    }
    else {
      Tran.delectMouse();
    }
  }

  lock = () => {
    let cob = this.state.canvas.getActiveObject();
    cob.lockMovementX = !cob.lockMovementX
    cob.lockMovementY = !cob.lockMovementY;
    cob.lockRotation = !cob.lockRotation;
    cob.lockScalingFlip = !cob.lockScalingFlip;
    cob.lockScalingX = !cob.lockScalingX;
    cob.lockScalingY = !cob.lockScalingY;
    cob.lockUniScaling = !cob.lockUniScaling;
  }

  //reverse
  reverse = () => {
    let c = this.state.canvas.getActiveObject();
    if (c && !c.lockMovementX) {
      c.set('scaleX', -1);
      c.setCoords();
      this.state.canvas.renderAll();
    }
  }

  //clone
  cloneHandle = () => {
    let c = this.state.canvas.getActiveObject();
    let copyData = JSON.parse(JSON.stringify(c.toObject()));
    fabric.util.enlivenObjects([copyData], (objects) => {
      objects.forEach((o) => {
        o.set('top', o.top + 15);
        o.set('left', o.left + 15);
        this.state.canvas.add(o);
        o.setCoords();
      });
      this.state.canvas.renderAll();
    });
  }
  upAndDown = () => {
    let cob = this.state.canvas.getActiveObject();
    this.state.canvas.bringForward(cob)
  }

  deleteSelect = () => {
    this.state.canvas.remove(this.state.canvas.getActiveObject());
    this.state.canvas.renderAll();
  }
  reset = () => {
    this.state.canvas.clear();
  }

  //剪切
  crop = () => {
    this.state.canvas.remove(this.el);
    this.state.canvas.renderAll();
    console.log(this.state.canvas, )
    if (this.state.canvas.getActiveObject()) {
      this.cob = this.state.canvas.getActiveObject();
      if (this.cob.type === 'sprite') {
        alert("所选对象不可裁剪。");
        return;
      } else {
        if (this.lastActive !== this.cob) {
          console.log('different object');
        } else {
          console.log('same object');
        }
        if (this.lastActive && this.lastActive !== this.cob) {
          this.lastActive.clipTo = null;
        }

        //生成一个和待裁剪元素相同大小的矩形用于框选裁剪区域
        this.el = new fabric.Rect({
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

        this.el.left = this.cob.left;
        this.selection_object_left = this.cob.left;
        this.selection_object_top = this.cob.top;
        this.el.top = this.cob.top;
        this.el.width = this.cob.width * this.cob.scaleX;
        this.el.height = this.cob.height * this.cob.scaleY;
        this.state.canvas.add(this.el);
        this.state.canvas.setActiveObject(this.el);
      }
      this.isCropping = true;
    } else if (this.isCropping) {
      let left = this.el.left - this.cob.left;
      let top = this.el.top - this.cob.top;

      left *= 1;
      top *= 1;

      let width = this.el.width * 1;
      let height = this.el.height * 1;

      this.state.canvas.remove(this.cob);
      this.state.canvas.remove(this.state.canvas.getActiveObject());

      //将当前帧导出到一个新的canvas中并执行裁剪，在此期间暂停记录历史记录。
      this.cropImage(this.cob, this.el.left, this.el.top, parseInt(this.el.scaleY * height), parseInt(width * this.el.scaleX));

      this.lastActive = this.cob;
      this.state.canvas.renderAll();

      this.isCropping = false;
    }
  }
  cropImage = (png, left, top, height, width) => {
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
    if (top + height > png.top + png.height * png.scaleY)
      height = png.top + png.height * png.scaleY - top;
    if (left + width > png.left + png.width * png.scaleX)
      width = png.left + png.width * png.scaleX - left;

    let canvas_crop = new fabric.Canvas("canvas_crop");

    fabric.Image.fromURL(canvas.toDataURL('png'), (img) => {
      img.set('left', -(left + 1));
      img.set('top', -(top + 1));
      canvas_crop.add(img)
      canvas_crop.setHeight(height);
      canvas_crop.setWidth(width);
      canvas_crop.renderAll();
      fabric.Image.fromURL(canvas_crop.toDataURL('png'), (croppedImg) => {
        croppedImg.set('left', left);
        croppedImg.set('top', top);
        this.state.canvas.add(croppedImg).renderAll();
      });
    });
  }

  saveTran = () => {
    var canvas = document.getElementById('canvas_tran');
    let ctx = canvas.getContext('2d');
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    ctx.putImageData(ImgFilter.trim(imgData), 0, 0)

    let a = document.createElement('a');
    a.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
    a.click();
  }
  saveCrop = () => {
    let canvasEl = document.getElementById('canvas_tran');
    let ctx = canvasEl.getContext('2d');
    let imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)
    let cropObj = ImgFilter.crop(imgData)

    let img = new Image()
    img.src = canvasEl.toDataURL();
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    canvasEl.width = cropObj.sw
    canvasEl.height = cropObj.sh
    setTimeout(() => {
      ctx.drawImage(img, cropObj.sx, cropObj.sy, cropObj.sw, cropObj.sh, 0, 0, canvasEl.width, canvasEl.height);
    }, 0);
  }

  save = () => {
    let json = this.state.canvas.toJSON();
    console.log(JSON.stringify(json));
  }

  onChange = (value) => {
    this.setState({
      inputValue: value > 0 ? "+" + value : value,
    });
  }

  tranformHandler = () => {
    this.setState({ isTran: true, tranItem: this.state.canvas.getActiveObject() });
  }

  tranformSave = () => {

    let canvasEl = document.getElementById('canvas_tran');
    let ctx = canvasEl.getContext('2d');
    let imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)
    let cropObj = ImgFilter.crop(imgData)

    let img = new Image();
    img.src = canvasEl.toDataURL();
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    canvasEl.width = cropObj.sw;
    canvasEl.height = cropObj.sh;
    this.setState({ isTran: false });
    setTimeout(async () => {
      ctx.drawImage(img, cropObj.sx, cropObj.sy, cropObj.sw, cropObj.sh, 0, 0, canvasEl.width, canvasEl.height);
      let data = await this.state.onUploadFun({ "imgData": canvasEl.toDataURL() });
      if (this.state.readPath) {
        this.state.canvas.getActiveObject().setSrc(this.state.readPath + data.md5list[0], () => {
          this.state.canvas.renderAll();
          let temp = document.getElementById('canvas_tran');
          temp.setAttribute('width', 800 + 'px');
          temp.setAttribute('height',600+'px');
        });
      }
    }, 0);
  }


  filterHandler = () => {
    if (this.state.filterVisible) return;
    let c = this.state.canvas.getActiveObject();
    if (c) {
      this.applyFilter(0, new fabric.Image.filters.Brightness());
      this.applyFilter(1, new fabric.Image.filters.Contrast());
      this.applyFilter(2, new fabric.Image.filters.Saturation());
      this.applyFilter(3, new fabric.Image.filters.Blur());
    }
  }
  onBrightnessChange = (v) => {
    this.setState({ brightness: v })
    this.applyFilterValue(0, 'brightness', v / 200);
  }
  onContrastChange = (v) => {
    this.setState({ contrast: v })
    this.applyFilterValue(1, 'contrast', v / 200);
  }
  onSaturationChange = (v) => {
    this.setState({ saturation: v })
    this.applyFilterValue(2, 'saturation', v * .8);
  }
  onBlurChange = (v) => {
    this.setState({ blur: v })
    this.applyFilterValue(3, 'blur', v / 100);
  }
  onHueChange = (v) => {
    this.setState({ hue: v })
    this.applyFilterValue(4, 'rotation', v);
  }
  onOpacityChange = (v) => {
    this.setState({ opacity: v })
    this.state.canvas.getActiveObject().set('opacity', Math.round(100 - .9 * v) / 100);
    this.state.canvas.renderAll();
  }

  itemClickHandler = (v) => {
    console.log(v);
    let option = { abc: v };
    fabric.Image.fromURL(v, (oImg) => {
      this.state.canvas.add(oImg);
      console.log(option);
      this.state.canvas.renderAll();
    }, option);
  }
  renderItem = (index, key) => {
    let names = this.state.accounts[index].split('/');
    return <div style={{ height: 65 }} onClick={() => this.itemClickHandler(this.state.accounts[index])} key={this.state.accounts[index]}><img src={this.state.accounts[index]} style={{ width: 50, height: 60, marginLeft: "10px" }} /><span style={{ marginLeft: "10px", display: !this.state.collapsed ? '' : "none" }} >{names[names.length - 1]}</span></div>;
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  tranformRet = () => {

    if (this.state.isTran) {
      this.setState({ isTran: false });
    } else {
      this.state.canvas.getContext('2d').restore();
    }
  }

  uploadOpus = () => {
      this.state.onAddFun && this.state.onAddFun({ "item": { "value": JSON.stringify(this.state.canvas.toJSON()) } })
    // let data = await api("http://127.0.0.1:22222/System/addItem", { "item": { "value": JSON.stringify(this.state.canvas.toJSON()) } });
    // console.log(data, '------------------------');
  }

  showPop = () => {
    this.setState({
      filterVisible: !this.state.filterVisible,
    });
  }

  render() {
    let sh = document.body.clientHeight - 53;
    const content = (
      <div style={{ lineHeight: '32px' }}>
        <Row>
          <Col span={4}>
            <div >亮度</div>
          </Col>
          <Col span={18}>
            <Slider min={-100} max={+100} onChange={this.onBrightnessChange} value={this.state.brightness} />
          </Col>
          <Col span={2}>
            <div style={{ marginLeft: 5 }}>{this.state.brightness}</div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div >对比度</div>
          </Col>
          <Col span={18}>
            <Slider min={-100} max={+100} onChange={this.onContrastChange} value={this.state.contrast} />
          </Col>
          <Col span={2}>
            <div style={{ marginLeft: 5 }}>{this.state.contrast}</div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div >饱和度</div>
          </Col>
          <Col span={18}>
            <Slider min={-100} max={+100} onChange={this.onSaturationChange} value={this.state.saturation} />
          </Col>
          <Col span={2}>
            <div style={{ marginLeft: 5 }}>{this.state.saturation}</div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div >清晰度</div>
          </Col>
          <Col span={18}>
            <Slider min={0} max={100} onChange={this.onBlurChange} value={this.state.blur} />
          </Col>
          <Col span={2}>
            <div style={{ marginLeft: 5 }}>{this.state.blur}</div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div >色彩</div>
          </Col>
          <Col span={18}>
            <Slider min={-100} max={+100} onChange={this.onHueChange} value={this.state.hue} />
          </Col>
          <Col span={2}>
            <div style={{ marginLeft: 5 }}>{this.state.hue}</div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div >透明度</div>
          </Col>
          <Col span={18}>
            <Slider min={0} max={+100} onChange={this.onOpacityChange} value={this.state.opacity} />
          </Col>
          <Col span={2}>
            <div style={{ marginLeft: 5 }}>{this.state.opacity}%</div>
          </Col>
        </Row>
      </div>
    );
    return (
      <div>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Popover content={content} title={null} visible={this.state.filterVisible} onClick={this.showPop} overlayStyle={{ width: '300px' }}>
                <Button onClick={this.filterHandler}>滤镜</Button>
              </Popover>
              {/* <OperatorPanel/> */}
              <Button onClick={this.crop}>剪切</Button>
              <Button onClick={this.cloneHandle}>复制</Button>
              <Button onClick={this.reverse}>反转</Button>
              <Button onClick={this.lock}>锁定</Button>
              <Button onClick={this.upAndDown}>层级</Button>
              <Button onClick={this.tranformHandler}>变形</Button>

              <Button onClick={this.save}>保存</Button>
              <Button onClick={this.saveTran}> 去除白色&下载</Button>
              <Button onClick={this.tranformRet.bind(this)}>还原</Button>

              <Button onClick={this.tranformSave}>保存变形</Button>
              <Button onClick={this.uploadOpus}>上传作品</Button>
              <Button onClick={this.deleteSelect} >删除</Button>
              <Button onClick={this.reset}>重置</Button>
              <div style={{ position: "relative" }}>
                <canvas id='canvas'
                  width="800" height="600" style={{
                    border: '1px solid grey',
                    'borderRadius': '2px'
                  }}></canvas>
                <canvas style={{
                  visibility: "hidden", position: "absolute", left: "0px", display: "inline-block",
                  top: "0px"
                }} id="canvas_crop"></canvas>
                <canvas id="canvas_tran" width="800" height="600" visibility={false} style={{
                  position: "absolute", left: "-5px", display: "inline-block",
                  top: "0px",
                  margin: 'auto',
                  border: '1px solid grey',
                  'borderRadius': '2px',
                  display: this.state.isTran ? 'block' : "none",
                }}></canvas>

              </div>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default ReactFabricEditor
