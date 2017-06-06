
import {addClass, hasClass, getClientRect} from '../../../helpers.js';

let Slider = function(el) {
    this.element = el;

    return this.init();
};

Slider.prototype.init = function() {
    this.input = this.element.querySelector('input[type="range"]');
    this.primaryDirection = document.querySelector('html').getAttribute('dir').toLowerCase() === 'rtl' ? 'right' : 'left';
    this.verticalSlider = hasClass(this.input,'f-vertical') === true ? true : false;
    this.subscribers = [];
    this.eventHandlerReferences = {};

    // Create replacement elements
    this.mockSlider = document.createElement('div');
    this.mockSlider.setAttribute('aria-hidden', true);
    this.thumb = document.createElement('button');
    this.valueTooltip = document.createElement('span');
    this.track = document.createElement('span');

    // Combine replacement elements
    this.thumb.appendChild(this.valueTooltip);
    this.mockSlider.appendChild(this.thumb);
    this.mockSlider.appendChild(this.track);

    // Hide input element and add new component elements to DOM
    addClass(this.input, 'x-screen-reader');
    this.element.appendChild(this.mockSlider);

    this.max = parseInt(this.input.getAttribute('max'), 10) || 100;
    this.min = parseInt(this.input.getAttribute('min'), 10) || 0;

    this.setupDimensions();

    this.update();

    var that = this;
    if (window.addEventListener) {
        this.element.addEventListener('mousedown', this, false);
        this.thumb.addEventListener('keydown', this, false);
        window.addEventListener('resize', function() {
            that.setupDimensions();
        }, true);

        window.addEventListener('scroll', function() {
            that.setupDimensions();
        }, true);
    } else if (window.attachEvent) {
        this.element.attachEvent('onmousedown', function () {
            that.handleEvent.call(that);
        });

        this.thumb.attachEvent('onkeydown', function () {
            that.handleEvent.call(that);
        });

        window.attachEvent('onresize', function() {
            that.setupDimensions();
        });

        window.attachEvent('onscroll', function() {
            that.setupDimensions();
        });

    }

};

Slider.prototype.setupDimensions = function () {
    this.dimensions = getClientRect(this.mockSlider);
    this.maxThumbOffset = this.verticalSlider === false ? this.dimensions.width - this.thumb.clientWidth : this.dimensions.height - this.thumb.clientWidth;
    this.thumbOffset = null;

    var initValue = parseInt(this.input.getAttribute('value'), 10);
    this.thumbOffset = (initValue / this.max) * this.maxThumbOffset;
};

Slider.prototype.handleEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (target === this.thumb) {
        if (typeof e.which !== 'undefined' && e.which === 39 || e.which === 37) {
            // Keyboard accessability
            switch (e.which) {
                case 39: // Right key
                    this.thumbOffset = this.normalizeThumbOffset(this.thumbOffset + 10);
                    this.update();
                    break;
                case 37: // Left key
                    this.thumbOffset = this.normalizeThumbOffset(this.thumbOffset - 10);
                    this.update();
                    break;
            }
        } else {
            this.eventHandlerReferences.mouseMove = this.handleMouseMove.bind(this);
            this.eventHandlerReferences.mouseUp = this.removeMouseMove.bind(this);

            if (window.addEventListener) {
                document.addEventListener('mousemove', this.eventHandlerReferences.mouseMove, false);
                document.addEventListener('mouseup', this.eventHandlerReferences.mouseUp, false);
            } else if (window.attachEvent) {
                document.attachEvent('onmousemove', this.eventHandlerReferences.mouseMove);
                document.attachEvent('onmouseup', this.eventHandlerReferences.mouseUp);
            }
        }
    } else {
        var pixelOffset = e.clientX - this.dimensions[this.primaryDirection];

        // Invert RTL because max value is to the left of 0
        if (this.primaryDirection === 'right') {
            pixelOffset = pixelOffset * -1;
        }

        this.thumbOffset = this.normalizeThumbOffset(pixelOffset);
        this.update();
    }
};

Slider.prototype.normalizeThumbOffset = function(px) {
    if (px < 0) {
        return 0;
    }

    return px > this.maxThumbOffset ? this.maxThumbOffset : px;
};

Slider.prototype.setCallback = function(subscriber, callback) {
    this.subscribers.push({
        subscriber: subscriber,
        callback: callback
    });
};

Slider.prototype.setValue = function() {
    var value = Math.floor((this.thumbOffset / this.maxThumbOffset) * 100);
    this.input.setAttribute('value', value);
    if (this.subscribers.length > 0) {
        this.subscribers[0].callback.call(this.subscribers[0].subscriber, value);
    } else {
        this.valueTooltip.innerHTML = value;
    }
};

Slider.prototype.update = function() {
    this.thumb.style[this.primaryDirection] = this.thumbOffset + 'px';
    this.track.style.width = this.thumbOffset + 'px';
    this.setValue();
};

Slider.prototype.handleMouseMove = function(e) {
    e = e || window.event;

    var clientDir = null;
    var isLessThanMin = null;
    var isGreaterThanMax = null;
    if (this.verticalSlider === false) {
        clientDir = e.clientX;
        // if e.x is greater than the right edge do nothing
        // if e.x is less than the left edge do nothing
        isLessThanMin = this.primaryDirection === 'left' ?
            e.clientX < this.dimensions[this.primaryDirection] :
            e.clientX > this.dimensions[this.primaryDirection];

        isGreaterThanMax = this.primaryDirection === 'right' ?
            e.clientX > (this.dimensions[this.primaryDirection] + this.dimensions.width) :
            e.clientX < (this.dimensions[this.primaryDirection] - this.dimensions.width);
    } else {
        clientDir = e.clientY;
        isLessThanMin = e.clientY < this.dimensions.top;
        isGreaterThanMax = e.clientY >  this.dimensions.bottom;
    }

    if (isLessThanMin || isGreaterThanMax) {
        return;
    } else {
        var offset;

        if (this.verticalSlider === false) {
            // otherwise, calculate the offset from current x  and set UI to that
            offset = e.clientX - (this.dimensions[this.primaryDirection]);

            // Invert RTL because max value is to the left of 0
            if (this.primaryDirection === 'right') {
                offset = offset * -1;
            }
        } else {
            offset = this.dimensions.bottom - e.clientY;
        }

        this.thumbOffset = this.normalizeThumbOffset(offset);
        this.update();
    }
};

Slider.prototype.removeMouseMove = function() {
    if (window.addEventListener) {
        document.removeEventListener('mousemove', this.eventHandlerReferences.mouseMove, false);
        document.removeEventListener('mouseup', this.eventHandlerReferences.mouseUp, false);
    } else if (window.attachEvent) {
        document.detachEvent('onmousemove', this.eventHandlerReferences.mouseMove);
        document.detachEvent('onmouseup', this.eventHandlerReferences.mouseUp);
    }
};

export default Slider;