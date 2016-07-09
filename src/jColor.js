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
            '<div><canvas class="jColor-color-board"></canvas></div>',
            '<div><canvas class="jColor-color-bar"></canvas></div>',
            '<div><canvas class="jColor-color-alpha"></canvas></div>',
            '</div>'
        ].join('');

        document.body.appendChild(board);

        var canvses = ['color-board', 'color-bar', 'color-alpha'];
        for (var i in canvses) {
            var name = canvses[i];
            var jsNames = name.split('-');
            var jsName = jsNames[0] + jsNames[1].replace(/^\w/, function(char) {
                return char.toUpperCase()
            });
            var canvas = board.querySelector('.jColor-' + name);
            var style = getComputedStyle(canvas);
            canvas.height = parseInt(style.height);
            canvas.width = parseInt(style.width);
            this[jsName + 'Ctx'] = canvas.getContext('2d');
        }
    }

    _initCanvas() {
        this._setColorBar();
        this._setColorBoard(0, 255, 255);
        this._setColorAplha();
    }

    _setColorBar() {
        var barCtx = this.colorBarCtx;
        var width = barCtx.canvas.width;
        var height = barCtx.canvas.height;

        var gradient = barCtx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0 / 6, 'rgb(255, 0, 0)');
        gradient.addColorStop(1 / 6, 'rgb(255, 255, 0)');
        gradient.addColorStop(2 / 6, 'rgb(0, 255, 0)');
        gradient.addColorStop(3 / 6, 'rgb(0, 255, 255)');
        gradient.addColorStop(4 / 6, 'rgb(0, 0, 255)');
        gradient.addColorStop(5 / 6, 'rgb(255, 0, 255)');
        gradient.addColorStop(6 / 6, 'rgb(255, 0, 0)');
        barCtx.fillStyle = gradient;
        barCtx.fillRect(0, 0, width, height);
    }

    _setColorBoard(r, g, b) {
        var barCtx = this.colorBoardCtx;
        var width = barCtx.canvas.width;
        var height = barCtx.canvas.height;

        var deltaR = 255 - r;
        var deltaG = 255 - g;
        var deltaB = 255 - b;

        var stepR = deltaR / (width - 1);
        var stepG = deltaG / (width - 1);
        var stepB = deltaB / (width - 1);

        barCtx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        barCtx.fillRect(0, 0, width, height);

        var imgData = barCtx.getImageData(0, 0, width, height);
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
        console.log(firstLine)

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

        barCtx.putImageData(imgData, 0, 0)
    }

    _setColorAplha() {
        var barCtx = this.colorAlphaCtx;
        var width = barCtx.canvas.width;
        var height = barCtx.canvas.height;

        var line = 0;
        var row = 0;
        var gredWidth = 5;

        barCtx.fillStyle = "#bbb";
        while (line <= height / gredWidth) {
            while (row <= width / gredWidth) {
                if ((line + row) % 2 == 0) {
                    barCtx.fillRect(row * gredWidth, line * gredWidth, gredWidth, gredWidth);
                }
                row++;
            }
            row = 0;
            line++;
        }
    }
}

window.jColor = jColor;