
/**
 * Created by fenghuitao on 17-8-28.
 */

import matrix from './matrix.js';

function getWin(cas, item) {
    let count = 10;
    let tranCanvas = cas;
    if (!tranCanvas) {
        return;
    }
    let ctx = tranCanvas.getContext("2d");

    let dots = [];
    let dotscopy, idots;

    let img = new Image();
    img.src = item.getSrc();

    img.onload = function () {
        let img_w = img.width;
        let img_h = img.height;
        let left = (tranCanvas.width - img_w) / 2;
        let top = (tranCanvas.height - img_h) / 2;

        img.width = img_w;
        img.height = img_h;

        dots = [
            { x: left, y: top },
            { x: left + img_w, y: top },
            { x: left + img_w, y: top + img_h },
            { x: left, y: top + img_h }
        ];

        //保存一份不变的拷贝
        dotscopy = [
            { x: left, y: top },
            { x: left + img_w, y: top },
            { x: left + img_w, y: top + img_h },
            { x: left, y: top + img_h }
        ];

        //获得所有初始点坐标
        idots = rectsplit(count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);

        /**
         * 鼠标拖动事件绑定
         * @param e
         */
        window.onmousedown = function (e) {
            if (!dots.length) return;

            let area = getArea(e);

            let dot, i;
            //鼠标事件触发区域
            let qy = 40;

            for (i = 0; i < dots.length; i++) {
                dot = dots[i];
                if (area.t >= (dot.y - qy) && area.t <= (dot.y + qy) && area.l >= (dot.x - qy) && area.l <= (dot.x + qy)) {
                    break;
                } else {
                    dot = null;
                }
            }

            if (!dot) return;

            window.onmousemove = function (e) {
                let narea = getArea(e);
                let nx = narea.l - area.l;
                let ny = narea.t - area.t;

                dot.x += nx;
                dot.y += ny;

                area = narea;

                render();
            };

            window.onmouseup = function () {
                window.onmousemove = null;
                window.onmouseup = null;
            }
        };
        render()
    };



    /**
     * 获取鼠标点击/移过的位置
     * @param e
     * @returns {{t: number, l: number}}
     */
    function getArea(e) {
        e = e || window.event;
        return {
            t: e.layerY - tranCanvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop,
            l: e.layerX - tranCanvas.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        }
    }

    /**
     * 画布渲染
     */
    function render() {
        ctx.clearRect(0, 0, tranCanvas.width, tranCanvas.height);
        ctx.globalCompositeOperation = 'lighter'

        let ndots = rectsplit(count, dots[0], dots[1], dots[2], dots[3]);

        ndots.forEach(function (d, i) {
            //获取平行四边形的四个点
            let dot1 = ndots[i];
            let dot2 = ndots[i + 1];
            let dot3 = ndots[i + count + 2];
            let dot4 = ndots[i + count + 1];

            //获取初始平行四边形的四个点
            let idot1 = idots[i];
            let idot2 = idots[i + 1];
            let idot3 = idots[i + count + 2];
            let idot4 = idots[i + count + 1];

            if (dot2 && dot3 && i % (count + 1) < count) {
                //绘制三角形的下半部分
                renderImage(idot3, dot3, idot2, dot2, idot4, dot4);
                //绘制三角形的上半部分
                renderImage(idot1, dot1, idot2, dot2, idot4, dot4);
            }
            if (true) {
                ctx.save();
                ctx.fillStyle = "rgba(255,255,255,0)";
                ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
                ctx.save();
            }
        });
    }

    /**
     * 计算矩阵，同时渲染图片
     * @param arg_1
     * @param _arg_1
     * @param arg_2
     * @param _arg_2
     * @param arg_3
     * @param _arg_3
     */
    function renderImage(arg_1, _arg_1, arg_2, _arg_2, arg_3, _arg_3) {
        ctx.save();
        // 根据变换后的坐标创建剪切区域
        ctx.beginPath();
        ctx.moveTo(_arg_1.x, _arg_1.y);
        ctx.lineTo(_arg_2.x, _arg_2.y);
        ctx.lineTo(_arg_3.x, _arg_3.y);
        ctx.closePath();
        if (true) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(255,255,255,0)";
            ctx.stroke();
        }
        ctx.clip();

        if (true) {
            //传入变换前后的点坐标，计算变换矩阵
            let result = matrix.getMatrix.apply(this, arguments);

            //变形
            ctx.transform(result.a, result.b, result.c, result.d, result.e, result.f);

            //绘制图片
            ctx.drawImage(img, idots[0].x, idots[0].y, img.width, img.height);
        }

        ctx.restore();
    }


    /**
     * 将abcd四边形分割成n的n次方份，获取n等分后的所有点坐标
     * @param n     多少等分
     * @param a     a点坐标
     * @param b     b点坐标
     * @param c     c点坐标
     * @param d     d点坐标
     * @returns {Array}
     */
    function rectsplit(n, a, b, c, d) {
        //ad向量方向n等分
        let ad_x = (d.x - a.x) / n;
        let ad_y = (d.y - a.y) / n;
        //bc向量方向n等分
        let bc_x = (c.x - b.x) / n;
        let bc_y = (c.y - b.y) / n;

        let ndots = [];
        let x1, y1, x2, y2, ab_x, ab_y;

        //左边点递增，右边点递增，获取每一次递增后的新的向量，继续n等分，从而获取所有点坐标
        for (let i = 0; i <= n; i++) {
            //获得ad向量n等分后的坐标
            x1 = a.x + ad_x * i;
            y1 = a.y + ad_y * i;
            //获得bc向量n等分后的坐标
            x2 = b.x + bc_x * i;
            y2 = b.y + bc_y * i;

            for (let j = 0; j <= n; j++) {
                //ab向量为：[x2 - x1 , y2 - y1]，所以n等分后的增量为除于n
                ab_x = (x2 - x1) / n;
                ab_y = (y2 - y1) / n;

                ndots.push({
                    x: x1 + ab_x * j,
                    y: y1 + ab_y * j
                })
            }
        }
        return ndots;
    }
}
function delectMouse() { window.onmousedown = null };

export default { getWin, delectMouse };