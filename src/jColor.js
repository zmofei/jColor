import Tools from './tools.js';

var tools = new Tools();

class jColor {
    constructor(dom, options) {
        var appName = this.appName = this.constructor.name;

        if (!dom) {
            tools.error('param dom is nessary \n e.g. \n new ' + appName + '(Dom)');
        };

        this.dom = dom;
        this.options = options;

        this._initDoms();
        this._initEvent();
        this._initCanvas();
    }

    _initDoms() {
        // init target
        var target = this.target = document.createElement('canvas');
        target.className = 'jColor-target';
        dom.appendChild(target);

        // init color board
        var board = this.board = document.createElement('div');
        board.innerHTML = [
            '<div class="jColor-board">',
            '   <div class="jColor-color-board">',
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

        document.body.appendChild(board);

        var canvses = ['color-board', 'color-bar', 'color-alpha'];
        for (var i in canvses) {
            var name = canvses[i];
            var jsNames = name.split('-');
            var jsName = jsNames[0] + jsNames[1].replace(/^\w/, function(char) {
                return char.toUpperCase();
            });
            var canvas = board.querySelector('.jColor-' + name + ' canvas');
            var style = getComputedStyle(canvas);
            canvas.height = parseInt(style.height);
            canvas.width = parseInt(style.width);
            this[jsName + 'Ctx'] = canvas.getContext('2d');
            this[jsName + 'Btn'] = board.querySelector('.jColor-' + name + ' span');
        }
    }

    _initEvent() {
        var self = this;
        var btns = ['colorBarBtn', 'colorAlphaBtn'];
        btns.map(function(item) {
            var dom = self[item];
            dom.addEventListener('mousedown', function(e) {
                console.log(e.pageX)
            });
        });

        window.addEventListener('mousemove', function(e) {})
    }

    _initCanvas() {
        this._setColorBar();
        this._setColorBoard(0, 255, 255);
        this._setColorAplha(0, 255, 255);
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

    _setColorBoard(r, g, b) {
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

    _setColorAplha(r, g, b) {
        var ctx = this.colorAlphaCtx;
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;

        var line = 0;
        var row = 0;
        var gredWidth = 5;

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
}

window.jColor = jColor;