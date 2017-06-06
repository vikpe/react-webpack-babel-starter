import { addClass } from '../../../helpers.js';

let SelectButton = function(el) {
    this.element = el;

    return this.init();
};

SelectButton.prototype.setPressed = function() {
    this.element.setAttribute('aria-pressed', 'true');
};

SelectButton.prototype.removePressed = function(howMany) {
    if (howMany === "all") {
        var name = this.element.getAttribute('name');
        var associatedButtons = document.querySelectorAll('.c-select-button[name="' + name + '"]');

        for (var i = 0; i < associatedButtons.length; i++) {
            associatedButtons[i].setAttribute('aria-pressed', 'false');
        }
    } else if (howMany === "single") {
        this.element.setAttribute('aria-pressed', 'false');
        this.element.blur();
    }

};

SelectButton.prototype.isPressed = function() {
    return this.element.getAttribute('aria-pressed') === 'true';
};

SelectButton.prototype.init = function() {
    if (window.addEventListener) {
        this.element.addEventListener('click', this, false);
    } else if (window.attachEvent) {
        var that = this;
        this.element.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }

    this.prepareSwatches();

    return this;
};

SelectButton.prototype.prepareSwatches = function() {
    if (this.element.getAttribute('data-select-button-swatch')) {
        var hexVal = this.element.getAttribute('data-select-button-swatch');

        this.element.style.backgroundColor = "#" + hexVal;

        if (this.element.disabled) {
            var r = parseInt(hexVal.substring(0, 2), 16);
            var g = parseInt(hexVal.substring(2, 4), 16);
            var b = parseInt(hexVal.substring(4, 6), 16);
            var disableOverlay = this.detectContrast(r, g, b);

            //Add diagonal line class to disabled swatches
            addClass(this.element, "f-swatch-disabled");
            if (disableOverlay === "light") {
                //Make diagonal line light, the color is dark
                addClass(this.element, "f-swatch-disabled-dark");
            }
        }
    }
};

SelectButton.prototype.detectContrast = function(red, green, blue) {
    //http://stackoverflow.com/questions/5650924/javascript-color-contraster
    var brightness = ((red * 299) + (green * 587) + (blue * 114)) / 255000;

    if (brightness >= 0.5) {
        return "dark";
    } else {
        return "light";
    }
};

SelectButton.prototype.handleEvent = function() {
    if (this.element.getAttribute('data-select-button-multiselect')) {
        if (this.isPressed()) {
            this.removePressed("single");
        } else {
            this.setPressed();
        }
    } else {
        this.removePressed("all");
        this.setPressed();
    }
};

export default SelectButton;