export class Controller {
    public topTouchStartHandler;
    public topTouchEndHandler;
    public topKeyStartHandler;
    public topKeyEndHandler;
    public bottomTouchStartHandler;
    public bottomTouchEndHandler;
    public bottomKeyStartHandler;
    public bottomKeyEndHandler;
    public leftTouchStartHandler;
    public leftKeyStartHandler;
    public rightTouchStartHandler;
    public rightKeyStartHandler;
    public executeTouchStartHandler;
    public executeKeyStartHandler;
    public cancelTouchStartHandler;
    public cancelKeyStartHandler;
    constructor(
        private top,
        private bottom,
        private left,
        private right,
        private execute,
        private cancel,
    ) {}

    setTop(startFunc, endFunc) {

        this.attachHandlers(
            this.top,
            'topTouchStartHandler', 'topTouchEndHandler',
            'topKeyStartHandler', 'topKeyEndHandler',
            ["ArrowUp"],
            startFunc, endFunc
        );
    }

    setBottom(startFunc, endFunc) {

        this.attachHandlers(
            this.bottom,
            'bottomTouchStartHandler', 'bottomTouchEndHandler',
            'bottomKeyStartHandler', 'bottomKeyEndHandler',
            ["ArrowDown"],
            startFunc, endFunc
        );
    }

    setLeft(startFunc, endFunc) {

        this.attachHandlers(
            this.left,
            'leftTouchStartHandler', 'leftTouchEndHandler',
            'leftKeyStartHandler', 'leftKeyEndHandler',
            ["ArrowLeft"],
            startFunc, endFunc
        );
    }

    setRight(startFunc, endFunc) {

        this.attachHandlers(
            this.right,
            'rightTouchStartHandler', 'rightTouchEndHandler',
            'rightKeyStartHandler', 'rightKeyEndHandler',
            ["ArrowRight"],
            startFunc, endFunc
        );
    }

    setExecute(startFunc, endFunc) {

        this.attachHandlers(
            this.execute,
            'executeTouchStartHandler', 'executeTouchEndHandler',
            'executeKeyStartHandler', 'executeKeyEndHandler',
            ["Enter", "Shift"],
            startFunc, endFunc
        );
    }

    setCancel(startFunc, endFunc) {

        this.attachHandlers(
            this.cancel,
            'cancelTouchStartHandler', 'cancelTouchEndHandler',
            'cancelKeyStartHandler', 'cancelKeyEndHandler',
            ["Space"],
            startFunc, endFunc
        );
    }

    attachHandlers(element, touchStartKey, touchEndKey, keyStartKey, keyEndKey, arrowKeys, startFunc, endFunc) {
        const touchStartHandler = (e) => {
            startFunc(e);
            e.stopPropagation();
            e.preventDefault();
        };

        const touchEndHandler = (e) => {
            endFunc(e);
            e.stopPropagation();
            e.preventDefault();
        };

        const keyStartHandler = (e) => arrowKeys.some(key => e.key == key) && startFunc(e);
        const keyEndHandler = (e) => arrowKeys.some(key => e.key == key) && endFunc(e);

        this[touchStartKey] && element.removeEventListener('touchstart', this[touchStartKey]);
        this[touchEndKey] && element.removeEventListener('touchend', this[touchEndKey]);
        this[keyStartKey] && document.removeEventListener('keydown', this[keyStartKey]);
        this[keyEndKey] && document.removeEventListener('keyup', this[keyEndKey]);

        this[touchStartKey] = touchStartHandler;
        this[touchEndKey] = touchEndHandler;
        this[keyStartKey] = keyStartHandler;
        this[keyEndKey] = keyEndHandler;

        element.addEventListener('touchstart', touchStartHandler);
        element.addEventListener('touchend', touchEndHandler);
        document.addEventListener('keydown', keyStartHandler);
        document.addEventListener('keyup', keyEndHandler);
    }
}



