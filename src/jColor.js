import Tools from './tools.js';
import CSS from './jColor.scss';

var tools = new Tools();
// console.log(1)
class jColor {
    constructor(dom, options) {

        var appName = this.appName = this.constructor.name;

        if (!dom) {
            tools.error('param dom is nessary \n e.g. \n new ' + appName + '(Dom)');
        };

        this.dom = dom;
        this.options = options || {};

        this.finalColor = [255, 0, 0, 1];

        this.boardCursorPos = {
            left: 1,
            top: 0
        };
        this.barPos = {
            left: 1
        }

        this._initDoms();
        this._initEvent();
        this._initCanvas();
        this.set(this.options.value, false);
    }

    set(color, update) {
        // console.warn(711, this.finalColor)
        if (!color) return false;
        var self = this;
        var finalColor = color.slice();
        var color = color;
        var alpha = color.splice(3, 1);
        /*
            _____________________________  C[255,63,0]
           |     B[255,175,149]          |    ↑   ↑
           |                ↑ Min(to 0)  |  color bar's left
           |                             |
           |     A[153,105,90]           |
           |        ↑ Max(to 255)        |
            -----------------------------
        */

        var max = {
            value: -Infinity,
            index: 0
        };
        var min = {
            value: Infinity,
            index: 0,
        }
        color.map(function(item, index) {
            if (item > max.value && index < 3) {
                max.value = item;
                max.index = index;
            }
            if (item < min.value && index < 3) {
                min.value = item;
                min.index = index;
            }
        });

        // 1(A). get the board cursor's top
        // top = 1 - maxValue / 255;
        var borderCurosrTop = 1 - max.value / 255;
        this.boardCursorPos.top = borderCurosrTop;
        color[max.index] = 255;

        // 2(B). get the board cursor's left
        // left = 1 - minValue / 255;
        var borderCurosrLeft = 1 - min.value / 255;
        this.boardCursorPos.left = borderCurosrLeft;
        color[min.index] = 0;

        // 3(C). get the color bar's left
        // this.finalColor = options.value[3];
        var barLeft = this._colorToBarLeft(color);
        this.barPos.left = barLeft;

        //
        var btns = ['colorBoard', 'colorBar', 'colorAlpha'];
        btns.map(function(value) {
            var obj = self[value + 'Btn'];
            var dom = obj.dom;
            var canvas = obj.canvas;
            switch (value) {
                case 'colorBoard':
                    dom.style.left = canvas.width * self.boardCursorPos.left + 'px';
                    dom.style.top = canvas.height * self.boardCursorPos.top + 'px';
                    break;
                case 'colorBar':
                    dom.style.left = canvas.width * self.barPos.left + 'px';
                    break;
                case 'colorAlpha':
                    dom.style.left = canvas.width * finalColor[3] + 'px';
                    break;
            }
        });
        self._setColorBoard();
        self._setFinalColor(finalColor, !update);
    }

    _setFinalColor(color, init) {
        var ctx = this.target.getContext('2d');
        ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';
        // console
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.finalColor = color;
        if (!init) {
            // get the color ;
            this.options && this.options.change && this.options.change(this.finalColor);
        }
    }

    _initDoms() {
        // init target
        var target = this.target = document.createElement('canvas');
        target.className = 'jColor-target';
        this.dom.appendChild(target);

        // init color board
        var board = document.createElement('div');
        board.innerHTML = [
            '<div class="jColor-board">',
            '   <div class="jColor-arrow-up"></div>',
            '   <div class="jColor-arrow-left"></div>',
            '   <div class="jColor-arrow-right"></div>',
            '   <div class="jColor-arrow-down"></div>',
            '   <div class="jColor-color-board">',
            '       <span></span>',
            '       <canvas></canvas>',
            '   </div>',
            '   <div class="jColor-color-bar">',
            '       <span></span>',
            '       <canvas></canvas>',
            '   </div>',
            '   <div class="jColor-color-alpha">',
            '       <span></span>',
            '       <canvas></canvas>',
            '   </div>',
            '</div>'
        ].join('');

        this.board = board.querySelector('.jColor-board');


        document.body.appendChild(board);

        var canvses = ['color-board', 'color-bar', 'color-alpha'];
        for (var i in canvses) {
            var name = canvses[i];
            var jsNames = name.split('-');
            var jsName = jsNames[0] + jsNames[1].replace(/^\w/, function(char) {
                return char.toUpperCase();
            });

            var blockDom = board.querySelector('.jColor-' + name);
            var blockWidth = parseInt(getComputedStyle(blockDom).width);
            var blockHeight = parseInt(getComputedStyle(blockDom).height);

            var canvas = blockDom.querySelector('canvas');
            if (canvas) {
                var style = getComputedStyle(canvas);
                canvas.height = parseInt(style.height);
                canvas.width = parseInt(style.width);
                this[jsName + 'Ctx'] = canvas.getContext('2d');
            }

            //
            var button = blockDom.querySelector('span');
            this[jsName + 'Btn'] = {
                canvas: canvas,
                dom: button,
                maxWidth: blockWidth,
                maxHeight: name == 'color-board' ? blockHeight : 0,
            };
        }
        this._setFinalColor(this.finalColor, true);
    }

    _initEvent() {
        var self = this;
        var btns = [{
            name: 'colorBoard',
            cb: function(pos) {
                self.boardCursorPos = pos;
                self._setColorAplha();
                self._getColorOnBoard();
            }
        }, {
            name: 'colorBar',
            cb: function(pos) {
                self.barPos.left = pos.left;
                self._setColorBoard();
                self._setColorAplha();
                self._getColorOnBoard();
            }
        }, {
            name: 'colorAlpha',
            cb: function(pos) {
                self.finalColor.splice(3, 1, pos.left);
                self._setFinalColor(self.finalColor);
            }
        }];

        var activeBtn = null;
        var mouseStartX = null;
        var mouseStartY = null;
        var btnStartX = null;
        var btnStartY = null;
        var btnMaxWidth = null;
        var btnMaxHeight = null;
        var callback = null;
        var activeBoard = false;

        this.target.addEventListener('click', function(e) {
            activeBoard = true;
            var dom = e.target;
            var offset = tools.getOffset(dom);
            // let's say the color show on the buttom of the target
            // TODO: the color can appear in left/top/right/bottom of the target, 
            //       depend the space of the window
            var top = offset.top + dom.offsetHeight + 10;
            var left = offset.left + dom.offsetWidth / 2 - 25;
            self.board.style.left = left + 'px';
            self.board.style.top = top + 'px';
            self.board.style.display = 'block';
            self.board.querySelector('.jColor-arrow-up').style.display = 'block';
        });

        btns.map(function(item) {
            var btnDom = self[item.name + 'Btn'].dom;
            var canvasDom = self[item.name + 'Ctx'].canvas;
            var maxWidth = self[item.name + 'Btn'].maxWidth;
            var maxHeight = self[item.name + 'Btn'].maxHeight;
            var cbfn = item.cb;

            canvasDom.addEventListener('mousedown', function(e) {
                activeBtn = btnDom;
                mouseStartX = e.pageX;
                mouseStartY = e.pageY;
                btnStartX = e.offsetX;
                btnStartY = e.offsetY;
                btnMaxWidth = maxWidth;
                btnMaxHeight = maxHeight;
                callback = cbfn;
                fitHandle(btnStartX, btnStartY, callback)
            });

            btnDom.addEventListener('mousedown', function(e) {
                activeBtn = btnDom;
                mouseStartX = e.pageX;
                mouseStartY = e.pageY;
                btnStartX = parseInt(getComputedStyle(activeBtn).left);
                btnStartY = parseInt(getComputedStyle(activeBtn).top);
                btnMaxWidth = maxWidth;
                btnMaxHeight = maxHeight;
                callback = cbfn;
                fitHandle(btnStartX, btnStartY, callback)
            });
        });

        window.addEventListener('mousemove', function(e) {
            if (!activeBtn) return false;
            var deltaX = e.pageX - mouseStartX;
            var deltaY = e.pageY - mouseStartY;
            var left = btnStartX + deltaX;
            var top = btnStartY + deltaY;
            fitHandle(left, top, callback)

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        window.addEventListener('mousedown', function(e) {
            if (!activeBoard) return false;
            var dom = e.target;
            var close = true;
            while (dom) {
                if (dom == self.board || dom == self.target) {
                    close = false;
                    break;
                }
                dom = dom.parentElement;
            }
            if (close) {
                self.board.style.display = 'none';
                self.options && self.options.choosed && self.options.choosed(self.finalColor);
                activeBoard = false;
            }
        });

        function fitHandle(left, top, callback) {
            left = Math.max(0, left);
            left = Math.min(btnMaxWidth, left);
            top = Math.max(0, top);
            top = Math.min(btnMaxHeight, top);
            var leftPersent = left / btnMaxWidth;
            var topPersent = top / btnMaxHeight;
            activeBtn.style.left = left + 'px';
            activeBtn.style.top = top + 'px';

            callback && callback({
                left: leftPersent,
                top: topPersent
            });
            activeBtn.style.left = left + 'px';
            activeBtn.style.top = top + 'px';
        }

        window.addEventListener('mouseup', function(e) {
            if (!activeBtn) return false;
            activeBtn = null;
        });
    }

    _initCanvas() {
        this._setColorBar();
        this._setColorBoard();
        this._setColorAplha();
    }

    _setColorBar() {
        var ctx = this.colorBarCtx;
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;

        var gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0 / 6, 'rgb(255, 0, 0)');
        gradient.addColorStop(1 / 6, 'rgb(255, 255, 0)');
        gradient.addColorStop(2 / 6, 'rgb(0, 255, 0)');
        gradient.addColorStop(3 / 6, 'rgb(0, 255, 255)');
        gradient.addColorStop(4 / 6, 'rgb(0, 0, 255)');
        gradient.addColorStop(5 / 6, 'rgb(255, 0, 255)');
        gradient.addColorStop(6 / 6, 'rgb(255, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    _setColorBoard() {
        var barColor = this._getColorOnBar();
        // console.log(barColor)
        var r = barColor[0];
        var g = barColor[1];
        var b = barColor[2];
        var ctx = this.colorBoardCtx;
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;

        var deltaR = 255 - r;
        var deltaG = 255 - g;
        var deltaB = 255 - b;

        var stepR = deltaR / (width - 1);
        var stepG = deltaG / (width - 1);
        var stepB = deltaB / (width - 1);

        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        ctx.fillRect(0, 0, width, height);

        var imgData = ctx.getImageData(0, 0, width, height);
        var firstLine = []
        for (var i = 0; i < width; i++) {
            var R = 255 - i * stepR;
            var G = 255 - i * stepG;
            var B = 255 - i * stepB;
            firstLine.push({
                r: R,
                g: G,
                b: B,
                stepRByRow: R / height,
                stepGByRow: G / height,
                stepBByRow: B / height
            });
        };
        var count = 0;
        for (var i = 0; i < imgData.data.length; i += 4) {
            var lineNum = Math.floor(count / width);
            var rowNum = Math.ceil(count % width);
            count++;

            var newR = firstLine[rowNum].r - firstLine[rowNum].stepRByRow * lineNum;
            var newG = firstLine[rowNum].g - firstLine[rowNum].stepGByRow * lineNum;
            var newB = firstLine[rowNum].b - firstLine[rowNum].stepBByRow * lineNum;
            imgData.data[i] = newR;
            imgData.data[i + 1] = newG;
            imgData.data[i + 2] = newB;
        }

        ctx.putImageData(imgData, 0, 0)
    }

    _setColorAplha() {
        var r = this.finalColor[0];
        var g = this.finalColor[1];
        var b = this.finalColor[2];

        var ctx = this.colorAlphaCtx;
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;

        var line = 0;
        var row = 0;
        var gredWidth = 5;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#bbb";
        while (line <= height / gredWidth) {
            while (row <= width / gredWidth) {
                if ((line + row) % 2 == 0) {
                    ctx.fillRect(row * gredWidth, line * gredWidth, gredWidth, gredWidth);
                }
                row++;
            }
            row = 0;
            line++;
        }

        var gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(' + r + ',' + g + ', ' + b + ',0)');
        gradient.addColorStop(1, 'rgba(' + r + ',' + g + ', ' + b + ',1)');
        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, width, height)
    }

    _getColorOnBoard() {
        var pos = this.boardCursorPos;
        // console.log(pos)
        var self = this;
        var topColor = this._getColorOnBar().map((color) => {
            var setp = 255 - color;
            return parseInt(color + setp * (1 - pos.left));
        });
        var color = [];
        var finalColor = topColor.map((_color, index) => {
            var _color = parseInt(_color * (1 - pos.top));
            color[index] = _color
            return _color;
        });
        this._setFinalColor([color[0], color[1], color[2], this.finalColor[3]]);
    }

    _getColorOnBar() {
        var present = this.barPos.left;
        var step = (1 / 6);
        var level = Math.floor(present / step);
        var leverPresent = present % step / step;

        if (level > 5) {
            level = 0;
            leverPresent = 0;
        }

        var r = 0;
        var g = 0;
        var b = 0;
        switch (level) {
            case 0:
                r = 255;
                g = 255 * leverPresent;
                b = 0;
                break;
            case 1:
                r = 255 * (1 - leverPresent);
                g = 255;
                b = 0;
                break;
            case 2:
                r = 0;
                g = 255;
                b = 255 * leverPresent;
                break;
            case 3:
                r = 0;
                g = 255 * (1 - leverPresent);
                b = 255;
                break;
            case 4:
                r = 255 * leverPresent;
                g = 0;
                b = 255;
                break;
            case 5:
            default:
                r = 255;
                g = 0;
                b = 255 * (1 - leverPresent);
                break;
        }
        return [parseInt(r), parseInt(g), parseInt(b)]
    }

    _colorToBarLeft(color) {
        var map = {};
        color.forEach(function(value, index) {
            map[value == '255' ? 'max' : value == '0' ? 'min' : 'middle'] = index;
        });
        /*
            0:R 1:G 2:B
               * R=255            
               * G=0-255
               * B=0
               max=0           max=1         max=1          max=2          max=2           max=0
               mid=1           mid=0         mid=2          mid=1          mid=0           mid=2
                 ↓               ↓             ↓              ↓              ↓               ↓  
          ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
        1,0,0          1,1,0          0,1,0          0,1,1          0,0,1          1,0,1          1,0,0
        255,0,0        255,255,0      0,255,0        0,255,255      0,0,255        255,0,255      255,0,0
        */

        var step = (1 / 6);
        var basicPresent;
        var stepPresent;
        var present;
        if (map.max == 0) {
            switch (map.middle) {
                case 1:
                    basicPresent = 0 * step;
                    stepPresent = (color[map.middle] / 255) * step;
                    present = basicPresent + stepPresent;
                    break;
                case 2:
                    basicPresent = 5 * step;
                    stepPresent = (1 - color[map.middle] / 255) * step;
                    present = basicPresent + stepPresent;
                    break;
                default:
                    present = 0;
                    break;
            }
        } else if (map.max == 1) {
            switch (map.middle) {
                case 0:
                    basicPresent = 1 * step;
                    stepPresent = (1 - color[map.middle] / 255) * step;
                    present = basicPresent + stepPresent;
                    break;
                case 2:
                    basicPresent = 2 * step;
                    stepPresent = (color[map.middle] / 255) * step;
                    present = basicPresent + stepPresent;
                    break;
                default:
                    present = 2 * step;
                    break;
            }
        } else if (map.max == 2) {
            switch (map.middle) {
                case 0:
                    basicPresent = 4 * step;
                    stepPresent = (color[map.middle] / 255) * step;
                    present = basicPresent + stepPresent;
                    break;
                case 1:
                    basicPresent = 3 * step;
                    stepPresent = (1 - color[map.middle] / 255) * step;
                    present = basicPresent + stepPresent;
                    break;
                default:
                    present = 2 * step;
                    break;
            }
        } else {
            present = 0;
        }

        return present;
    }
}

window.jColor = jColor;

export default jColor;