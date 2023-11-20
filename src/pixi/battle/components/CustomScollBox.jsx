import { ScrollBox } from '@pixi/ui';

class CustomScrollBox extends ScrollBox {
    constructor(options, disableScrolling) {
        super(options);
        this.options = options || {};
        this.disableScrolling = disableScrolling;
        this.makeScrollable();
    }

    onMouseScroll(event) {
        if (!this.disableScrolling) {
            super.onMouseScroll(event);
        }
    }
}

export { CustomScrollBox };
