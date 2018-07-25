/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/jColor.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/jColor.js":
/*!***********************!*\
  !*** ./src/jColor.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _tools_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools.js */ \"./src/tools.js\");\n\n\nvar tools = new _tools_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\nclass jColor {\n    constructor(dom, options) {\n\n        var appName = this.appName = this.constructor.name;\n\n        if (!dom) {\n            tools.error('param dom is nessary \\n e.g. \\n new ' + appName + '(Dom)');\n        };\n\n        this.dom = dom;\n        this.options = options || {};\n\n        this.finalColor = [255, 0, 0, 1];\n\n        this.boardCursorPos = {\n            left: 1,\n            top: 0\n        };\n        this.barPos = {\n            left: 1\n        }\n\n        this._initDoms();\n        this._initEvent();\n        this._initCanvas();\n        this.set(this.options.value, false);\n    }\n\n    set(color, update) {\n        if (!color) return false;\n        var self = this;\n        var finalColor = color.slice();\n        var color = color;\n        color.splice(3, 1);\n        /*\n            _____________________________  C[255,63,0]\n           |     B[255,175,149]          |    ↑   ↑\n           |                ↑ Min(to 0)  |  color bar's left\n           |                             |\n           |     A[153,105,90]           |\n           |        ↑ Max(to 255)        |\n            -----------------------------\n        */\n\n        var max = {\n            value: -Infinity,\n            index: 0\n        };\n        var min = {\n            value: Infinity,\n            index: 0,\n        }\n        color.map(function(item, index) {\n            if (item > max.value && index < 3) {\n                max.value = item;\n                max.index = index;\n            }\n        });\n        color.map(function(item, index) {\n            if (item < min.value && index < 3) {\n                min.value = item;\n                min.index = index;\n            }\n        });\n\n        // 1(A). get the board cursor's top\n        // top = 1 - maxValue / 255;\n        var borderCurosrTop = 1 - max.value / 255;\n        this.boardCursorPos.top = borderCurosrTop;\n        color[max.index] = 255;\n        \n        // 2(B). get the board cursor's left\n        // left = 1 - minValue / 255;\n        var borderCurosrLeft = 1 - min.value / 255;\n        this.boardCursorPos.left = borderCurosrLeft;\n        color[min.index] = 0;\n\n        // 3(C). get the color bar's left\n        // this.finalColor = options.value[3];\n        var barLeft = this._colorToBarLeft(color);\n        this.barPos.left = barLeft;\n\n        //\n        var btns = ['colorBoard', 'colorBar', 'colorAlpha'];\n        btns.map(function(value) {\n            var obj = self[value + 'Btn'];\n            var dom = obj.dom;\n            var canvas = obj.canvas;\n            switch (value) {\n                case 'colorBoard':\n                    dom.style.left = canvas.width * self.boardCursorPos.left + 'px';\n                    dom.style.top = canvas.height * self.boardCursorPos.top + 'px';\n                    break;\n                case 'colorBar':\n                    dom.style.left = canvas.width * self.barPos.left + 'px';\n                    break;\n                case 'colorAlpha':\n                    dom.style.left = canvas.width * finalColor[3] + 'px';\n                    break;\n            }\n        });\n        self._setColorBoard();\n        self._setFinalColor(finalColor, !update);\n    }\n\n    _setFinalColor(color, init) {\n        var ctx = this.target.getContext('2d');\n        ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';\n        // console\n        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\n        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);\n\n        if (!init) {\n            this.finalColor = color;\n            // get the color ;\n            this.options && this.options.change && this.options.change(this.finalColor);\n        }\n\n    }\n\n    _initDoms() {\n        // init target\n        var target = this.target = document.createElement('canvas');\n        target.className = 'jColor-target';\n        this.dom.appendChild(target);\n\n        // init color board\n        var board = document.createElement('div');\n        board.innerHTML = [\n            '<div class=\"jColor-board\">',\n            '   <div class=\"jColor-arrow-up\"></div>',\n            '   <div class=\"jColor-arrow-left\"></div>',\n            '   <div class=\"jColor-arrow-right\"></div>',\n            '   <div class=\"jColor-arrow-down\"></div>',\n            '   <div class=\"jColor-color-board\">',\n            '       <span></span>',\n            '       <canvas></canvas>',\n            '   </div>',\n            '   <div class=\"jColor-color-bar\">',\n            '       <span></span>',\n            '       <canvas></canvas>',\n            '   </div>',\n            '   <div class=\"jColor-color-alpha\">',\n            '       <span></span>',\n            '       <canvas></canvas>',\n            '   </div>',\n            '</div>'\n        ].join('');\n\n        this.board = board.querySelector('.jColor-board');\n\n\n        document.body.appendChild(board);\n\n        var canvses = ['color-board', 'color-bar', 'color-alpha'];\n        for (var i in canvses) {\n            var name = canvses[i];\n            var jsNames = name.split('-');\n            var jsName = jsNames[0] + jsNames[1].replace(/^\\w/, function(char) {\n                return char.toUpperCase();\n            });\n\n            var blockDom = board.querySelector('.jColor-' + name);\n            var blockWidth = parseInt(getComputedStyle(blockDom).width);\n            var blockHeight = parseInt(getComputedStyle(blockDom).height);\n\n            var canvas = blockDom.querySelector('canvas');\n            if (canvas) {\n                var style = getComputedStyle(canvas);\n                canvas.height = parseInt(style.height);\n                canvas.width = parseInt(style.width);\n                this[jsName + 'Ctx'] = canvas.getContext('2d');\n            }\n\n            //\n            var button = blockDom.querySelector('span');\n            this[jsName + 'Btn'] = {\n                canvas: canvas,\n                dom: button,\n                maxWidth: blockWidth,\n                maxHeight: name == 'color-board' ? blockHeight : 0,\n            };\n        }\n        this._setFinalColor(this.finalColor, true);\n    }\n\n    _initEvent() {\n        var self = this;\n        var btns = [{\n            name: 'colorBoard',\n            cb: function(pos) {\n                self.boardCursorPos = pos;\n                self._setColorAplha();\n                self._getColorOnBoard();\n            }\n        }, {\n            name: 'colorBar',\n            cb: function(pos) {\n                self.barPos.left = pos.left;\n\n                self._setColorBoard();\n                self._setColorAplha();\n                self._getColorOnBoard();\n            }\n        }, {\n            name: 'colorAlpha',\n            cb: function(pos) {\n                self.finalColor.splice(3, 1, pos.left);\n                self._setFinalColor(self.finalColor);\n            }\n        }];\n\n        var activeBtn = null;\n        var mouseStartX = null;\n        var mouseStartY = null;\n        var btnStartX = null;\n        var btnStartY = null;\n        var btnMaxWidth = null;\n        var btnMaxHeight = null;\n        var callback = null;\n        var activeBoard = false;\n\n        this.target.addEventListener('click', function(e) {\n            activeBoard = true;\n            var dom = e.target;\n            var offset = tools.getOffset(dom);\n            // let's say the color show on the buttom of the target\n            // TODO: the color can appear in left/top/right/bottom of the target, \n            //       depend the space of the window\n            var top = offset.top + dom.offsetHeight + 10;\n            var left = offset.left + dom.offsetWidth / 2 - 25;\n            self.board.style.left = left + 'px';\n            self.board.style.top = top + 'px';\n            self.board.style.display = 'block';\n            self.board.querySelector('.jColor-arrow-up').style.display = 'block';\n        });\n\n        btns.map(function(item) {\n            var btnDom = self[item.name + 'Btn'].dom;\n            var canvasDom = self[item.name + 'Ctx'].canvas;\n            var maxWidth = self[item.name + 'Btn'].maxWidth;\n            var maxHeight = self[item.name + 'Btn'].maxHeight;\n            var cbfn = item.cb;\n\n            canvasDom.addEventListener('mousedown', function(e) {\n                activeBtn = btnDom;\n                mouseStartX = e.pageX;\n                mouseStartY = e.pageY;\n                btnStartX = e.offsetX;\n                btnStartY = e.offsetY;\n                btnMaxWidth = maxWidth;\n                btnMaxHeight = maxHeight;\n                callback = cbfn;\n                fitHandle(btnStartX, btnStartY, callback)\n            });\n\n            btnDom.addEventListener('mousedown', function(e) {\n                activeBtn = btnDom;\n                mouseStartX = e.pageX;\n                mouseStartY = e.pageY;\n                btnStartX = parseInt(getComputedStyle(activeBtn).left);\n                btnStartY = parseInt(getComputedStyle(activeBtn).top);\n                btnMaxWidth = maxWidth;\n                btnMaxHeight = maxHeight;\n                callback = cbfn;\n                fitHandle(btnStartX, btnStartY, callback)\n            });\n        });\n\n        window.addEventListener('mousemove', function(e) {\n            if (!activeBtn) return false;\n            var deltaX = e.pageX - mouseStartX;\n            var deltaY = e.pageY - mouseStartY;\n            var left = btnStartX + deltaX;\n            var top = btnStartY + deltaY;\n            fitHandle(left, top, callback)\n\n            e.preventDefault();\n            e.stopPropagation();\n            return false;\n        });\n\n        window.addEventListener('mousedown', function(e) {\n            if (!activeBoard) return false;\n            var dom = e.target;\n            var close = true;\n            while (dom) {\n                if (dom == self.board || dom == self.target) {\n                    close = false;\n                    break;\n                }\n                dom = dom.parentElement;\n            }\n            if (close) {\n                self.board.style.display = 'none';\n                self.options && self.options.choosed && self.options.choosed(self.finalColor);\n                activeBoard = false;\n            }\n        });\n\n        function fitHandle(left, top, callback) {\n            left = Math.max(0, left);\n            left = Math.min(btnMaxWidth, left);\n            top = Math.max(0, top);\n            top = Math.min(btnMaxHeight, top);\n            var leftPersent = left / btnMaxWidth;\n            var topPersent = top / btnMaxHeight;\n            activeBtn.style.left = left + 'px';\n            activeBtn.style.top = top + 'px';\n\n            callback && callback({\n                left: leftPersent,\n                top: topPersent\n            });\n            activeBtn.style.left = left + 'px';\n            activeBtn.style.top = top + 'px';\n        }\n\n        window.addEventListener('mouseup', function(e) {\n            if (!activeBtn) return false;\n            activeBtn = null;\n        });\n    }\n\n    _initCanvas() {\n        this._setColorBar();\n        this._setColorBoard();\n        this._setColorAplha();\n    }\n\n    _setColorBar() {\n        var ctx = this.colorBarCtx;\n        var width = ctx.canvas.width;\n        var height = ctx.canvas.height;\n\n        var gradient = ctx.createLinearGradient(0, 0, width, 0);\n        gradient.addColorStop(0 / 6, 'rgb(255, 0, 0)');\n        gradient.addColorStop(1 / 6, 'rgb(255, 255, 0)');\n        gradient.addColorStop(2 / 6, 'rgb(0, 255, 0)');\n        gradient.addColorStop(3 / 6, 'rgb(0, 255, 255)');\n        gradient.addColorStop(4 / 6, 'rgb(0, 0, 255)');\n        gradient.addColorStop(5 / 6, 'rgb(255, 0, 255)');\n        gradient.addColorStop(6 / 6, 'rgb(255, 0, 0)');\n        ctx.fillStyle = gradient;\n        ctx.fillRect(0, 0, width, height);\n    }\n\n    _setColorBoard() {\n        var barColor = this._getColorOnBar();\n        // console.log(barColor)\n        var r = barColor[0];\n        var g = barColor[1];\n        var b = barColor[2];\n        var ctx = this.colorBoardCtx;\n        var width = ctx.canvas.width;\n        var height = ctx.canvas.height;\n\n        var deltaR = 255 - r;\n        var deltaG = 255 - g;\n        var deltaB = 255 - b;\n\n        var stepR = deltaR / (width - 1);\n        var stepG = deltaG / (width - 1);\n        var stepB = deltaB / (width - 1);\n\n        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';\n        ctx.fillRect(0, 0, width, height);\n\n        var imgData = ctx.getImageData(0, 0, width, height);\n        var firstLine = []\n        for (var i = 0; i < width; i++) {\n            var R = 255 - i * stepR;\n            var G = 255 - i * stepG;\n            var B = 255 - i * stepB;\n            firstLine.push({\n                r: R,\n                g: G,\n                b: B,\n                stepRByRow: R / height,\n                stepGByRow: G / height,\n                stepBByRow: B / height\n            });\n        };\n        var count = 0;\n        for (var i = 0; i < imgData.data.length; i += 4) {\n            var lineNum = Math.floor(count / width);\n            var rowNum = Math.ceil(count % width);\n            count++;\n\n            var newR = firstLine[rowNum].r - firstLine[rowNum].stepRByRow * lineNum;\n            var newG = firstLine[rowNum].g - firstLine[rowNum].stepGByRow * lineNum;\n            var newB = firstLine[rowNum].b - firstLine[rowNum].stepBByRow * lineNum;\n            imgData.data[i] = newR;\n            imgData.data[i + 1] = newG;\n            imgData.data[i + 2] = newB;\n        }\n\n        ctx.putImageData(imgData, 0, 0)\n    }\n\n    _setColorAplha() {\n        var r = this.finalColor[0];\n        var g = this.finalColor[1];\n        var b = this.finalColor[2];\n\n        var ctx = this.colorAlphaCtx;\n        var width = ctx.canvas.width;\n        var height = ctx.canvas.height;\n\n        var line = 0;\n        var row = 0;\n        var gredWidth = 5;\n        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\n        ctx.fillStyle = \"#bbb\";\n        while (line <= height / gredWidth) {\n            while (row <= width / gredWidth) {\n                if ((line + row) % 2 == 0) {\n                    ctx.fillRect(row * gredWidth, line * gredWidth, gredWidth, gredWidth);\n                }\n                row++;\n            }\n            row = 0;\n            line++;\n        }\n\n        var gradient = ctx.createLinearGradient(0, 0, width, 0);\n        gradient.addColorStop(0, 'rgba(' + r + ',' + g + ', ' + b + ',0)');\n        gradient.addColorStop(1, 'rgba(' + r + ',' + g + ', ' + b + ',1)');\n        ctx.fillStyle = gradient;\n\n        ctx.fillRect(0, 0, width, height)\n    }\n\n    _getColorOnBoard() {\n        var pos = this.boardCursorPos;\n        // console.log(pos)\n        var self = this;\n        var topColor = this._getColorOnBar().map((color) => {\n            var setp = 255 - color;\n            return parseInt(color + setp * (1 - pos.left));\n        });\n        var color = [];\n        var finalColor = topColor.map((_color, index) => {\n            var _color = parseInt(_color * (1 - pos.top));\n            color[index] = _color\n            return _color;\n        });\n        this._setFinalColor([color[0], color[1], color[2], this.finalColor[3]]);\n    }\n\n    _getColorOnBar() {\n        var present = this.barPos.left;\n        var step = (1 / 6);\n        var level = Math.floor(present / step);\n        var leverPresent = present % step / step;\n\n        if (level > 5) {\n            level = 0;\n            leverPresent = 0;\n        }\n\n        var r = g = b = 0;\n        switch (level) {\n            case 0:\n                r = 255;\n                g = 255 * leverPresent;\n                b = 0;\n                break;\n            case 1:\n                r = 255 * (1 - leverPresent);\n                g = 255;\n                b = 0;\n                break;\n            case 2:\n                r = 0;\n                g = 255;\n                b = 255 * leverPresent;\n                break;\n            case 3:\n                r = 0;\n                g = 255 * (1 - leverPresent);\n                b = 255;\n                break;\n            case 4:\n                r = 255 * leverPresent;\n                g = 0;\n                b = 255;\n                break;\n            case 5:\n            default:\n                r = 255;\n                g = 0;\n                b = 255 * (1 - leverPresent);\n                break;\n        }\n        return [parseInt(r), parseInt(g), parseInt(b)]\n    }\n\n    _colorToBarLeft(color) {\n        var map = {};\n        color.map(function(value, index) {\n            map[value == '255' ? 'max' : value == '0' ? 'min' : 'middle'] = index;\n        });\n\n        /*\n            0:R 1:G 2:B\n               * R=255            \n               * G=0-255\n               * B=0\n               max=0           max=1         max=1          max=2          max=2           max=0\n               mid=1           mid=0         mid=2          mid=1          mid=0           mid=2\n                 ↓               ↓             ↓              ↓              ↓               ↓  \n          ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐\n        1,0,0          1,1,0          0,1,0          0,1,1          0,0,1          1,0,1          1,0,0\n        255,0,0        255,255,0      0,255,0        0,255,255      0,0,255        255,0,255      255,0,0\n        */\n\n        var step = (1 / 6);\n        var basicPresent;\n        var stepPresent;\n        var present;\n        if (map.max == 0) {\n            switch (map.middle) {\n                case 1:\n                    basicPresent = 0 * step;\n                    stepPresent = (color[map.middle] / 255) * step;\n                    present = basicPresent + stepPresent;\n                    break;\n                case 2:\n                    basicPresent = 5 * step;\n                    stepPresent = (1 - color[map.middle] / 255) * step;\n                    present = basicPresent + stepPresent;\n                    break;\n                default:\n                    present = 0;\n                    break;\n            }\n        } else if (map.max == 1) {\n            switch (map.middle) {\n                case 0:\n                    basicPresent = 1 * step;\n                    stepPresent = (1 - color[map.middle] / 255) * step;\n                    present = basicPresent + stepPresent;\n                    break;\n                case 2:\n                    basicPresent = 2 * step;\n                    stepPresent = (color[map.middle] / 255) * step;\n                    present = basicPresent + stepPresent;\n                    break;\n                default:\n                    present = 2 * step;\n                    break;\n            }\n        } else if (map.max == 2) {\n            switch (map.middle) {\n                case 0:\n                    basicPresent = 4 * step;\n                    stepPresent = (color[map.middle] / 255) * step;\n                    present = basicPresent + stepPresent;\n                    break;\n                case 1:\n                    basicPresent = 3 * step;\n                    stepPresent = (1 - color[map.middle] / 255) * step;\n                    present = basicPresent + stepPresent;\n                    break;\n                default:\n                    present = 2 * step;\n                    break;\n            }\n        } else {\n            present = 0;\n        }\n\n        return present;\n    }\n}\n\nwindow.jColor = jColor;\n\n//# sourceURL=webpack:///./src/jColor.js?");

/***/ }),

/***/ "./src/tools.js":
/*!**********************!*\
  !*** ./src/tools.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Tools {\n    error() {\n        throw new Error('[' + appName + '] ' + txt);\n    }\n\n    getOffset(dom) {\n        var left = 0;\n        var top = 0;\n        while (dom.offsetParent) {\n            left += dom.offsetLeft;\n            top += dom.offsetTop;\n            dom = dom.offsetParent\n        }\n        return {\n            left: left,\n            top: top\n        }\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Tools);\n\n//# sourceURL=webpack:///./src/tools.js?");

/***/ })

/******/ });