'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by fenghuitao on 17-8-28.
 */

/**
 * 原始getImageData.data 用数组存储rgba信息，转化成pixels对象存储信息，便于操作
 */
function array2pixelData(data) {
    var pixels = [];
    for (var i = 0, len = data.length; i < len; i += 4) {
        pixels.push({
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: data[i + 3]
        });
    }
    return pixels;
}

/**
 * pixels对象数据还原为getImageData.data 数组格式数据
 */
function pixel2arrayData(pixels, imgData) {
    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = pixels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var pixel = _step.value;

            imgData.data[i++] = pixel.r;
            imgData.data[i++] = pixel.g;
            imgData.data[i++] = pixel.b;
            imgData.data[i++] = pixel.a;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return imgData;
}

/**
 * 空白像素处理算法
 * step1: 扫描并标记出可疑白点(flag = 1)
 * step2: 从alpha=0的透明点出发，一旦发现可疑白点直接擦除
 */
function trimPixels(pixels, options) {
    var width = options.width;
    var height = options.height;
    var getDirectionPixel = function getDirectionPixel(direction, p) {
        var x = p.index / width;
        var y = p.index % width;
        var res = null;
        switch (direction) {
            case 'left':
                x > 0 ? res = pixels[p.index - 1] : undefined;
                break;
            case 'top':
                y > 0 ? res = pixels[p.index - width] : undefined;
                break;
            case 'right':
                x + 1 < width ? res = pixels[p.index + 1] : undefined;
                break;
            case 'bottom':
                y + 1 < height ? res = pixels[p.index + width] : undefined;
                break;
            default:
                alert('impossible!');
        }
        return res;
    };

    // 扫描并标记出可疑白点
    var limit = 255 - options.threshold;
    var distance = options.distance;
    var abs = Math.abs;
    var i = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = pixels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var p = _step2.value;

            p.index = i++;
            if (p.r > limit && p.g > limit && p.b > limit && abs(p.r - p.g) < distance && abs(p.r - p.b) < distance && abs(p.g - p.b) < distance) {
                p.flag = 1;
            }
        }

        // 擦除点
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = pixels[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _p = _step3.value;

            // if (p.a === 0) //非png 的抠图
            {
                var pl = getDirectionPixel('left', _p);
                var pt = getDirectionPixel('top', _p);
                var pr = getDirectionPixel('right', _p);
                var pb = getDirectionPixel('bottom', _p);
                pl && (pl.flag === 1 || !pl.a && !pl.flag) ? pl.a = 0 : undefined;
                pt && (pt.flag === 1 || !pt.a && !pt.flag) ? pt.a = 0 : undefined;
                pr && (pr.flag === 1 || !pr.a && !pr.flag) ? pr.a = 0 : undefined;
                pb && (pb.flag === 1 || !pb.a && !pb.flag) ? pb.a = 0 : undefined;
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return pixels;
}

exports.default = {
    /**
     * 图像trim算法
     */
    trim: function trim(imgData) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
            threshold: 30,
            distance: 20
        };

        var pixels = array2pixelData(imgData.data);
        options.width = imgData.width;
        options.height = imgData.height;
        pixel2arrayData(trimPixels(pixels, options), imgData);
        return imgData;
    },

    /**
     * 图像crop裁切，去掉多余的空白背景，按指定尺寸切边
     */
    crop: function crop(imgData) {
        var width = imgData.width;
        var height = imgData.height;
        var pixels = array2pixelData(imgData.data);
        var len = pixels.length;
        var getVertex = function getVertex(d) {
            // 获取上下左右最边上的点, d(direction) = top|right|bottom|left
            var isHorizontal = function isHorizontal(d) {
                return d === 'top' || d === 'bottom';
            };
            var isStartDirct = function isStartDirct(d) {
                return d === 'top' || d === 'left';
            };
            var i = void 0,
                j = void 0,
                p = void 0;
            for (d === 'bottom' ? i = height - 1 : d === 'right' ? i = width - 1 : i = 0; d === 'top' ? i < height : d === 'left' ? i < width : i > 0; isStartDirct(d) ? i++ : i--) {
                for (j = 0; isHorizontal(d) ? j < width : j < height; j++) {
                    p = isHorizontal(d) ? pixels[j + i * width] : pixels[i + j * width];
                    if (p.a !== 0) {
                        p.x = isHorizontal(d) ? j : i;
                        p.y = isHorizontal(d) ? i : j;
                        return p;
                    }
                }
            }
            return isStartDirct(d) ? Object.assign({
                x: 0,
                y: 0
            }, pixels[0]) : Object.assign({
                x: width - 1,
                y: height - 1
            }, pixels[len - 1]);
        };

        var pt = getVertex('top');
        var pl = getVertex('left');
        var pb = getVertex('bottom');
        var pr = getVertex('right');
        var res = {
            imgData: imgData
        };
        res.sx = pt.x < pl.x ? pt.x : pl.x; // 需要截取的起始点x坐标
        res.sy = pt.y < pl.y ? pt.y : pl.y; // 需要截取的起始点y坐标
        res.dx = pr.x > pb.x ? pr.x : pb.x; // 需要截取的终点x坐标
        res.dy = pr.y > pb.y ? pr.y : pb.y; // 需要截取的终点y坐标
        res.sw = res.dx - res.sx + 1; // 截取空白之后留下的有效宽度
        res.sh = res.dy - res.sy + 1; // 截取空白之后留下的有效高度

        return res;
    }
};
//# sourceMappingURL=filter.js.map