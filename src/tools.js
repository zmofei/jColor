class Tools {
    error() {
        throw new Error('[' + appName + '] ' + txt);
    }

    getOffset(dom) {
        var left = 0;
        var top = 0;
        while (dom.offsetParent) {
            left += dom.offsetLeft;
            top += dom.offsetTop;
            dom = dom.offsetParent
        }
        return {
            left: left,
            top: top
        }
    }
};

export default Tools;