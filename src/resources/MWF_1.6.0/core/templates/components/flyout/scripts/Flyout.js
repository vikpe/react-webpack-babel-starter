import {getClientRect} from '../../../helpers.js';
import ViewportCollision from '../../../viewport-collision.js';

let Flyout = function(el) {
    this.element = el;

    return this.init();
};

Flyout.prototype.hide = function() {
    this.shown = false;
    this.flyout.setAttribute('aria-hidden', 'true');
};

Flyout.prototype.escape = function(el) {
    this.flyout = el;
    this.hide();
};

Flyout.prototype.open = function() {
    var flyoutEl = this.flyout;
    var openEl = this.openButton;
    var that = this;

    if (window.addEventListener) {
        document.addEventListener("click", function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = flyoutEl.contains(target);
            if (!isClickInside) {
                if (target !== openEl) {
                    if (parent !== openEl) {
                        that.escape(flyoutEl);
                    }
                }
            }
        });
    } else if (window.attachEvent) {
        document.attachEvent("onclick", function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = flyoutEl.contains(target);
            if (!isClickInside) {
                if (target !== openEl) {
                    if (parent !== openEl) {
                        that.escape(flyoutEl);
                    }
                }
            }
        });
    }
};

Flyout.prototype.show = function() {
    this.shown = true;
    this.flyout.setAttribute('aria-hidden', 'false');
    this.placement = this.flyout.getAttribute('data-js-flyout-placement');
    this.dimensions = getClientRect(this.openButton);
    this.offsetLeft = this.openButton.offsetLeft;
    this.offsetTop = this.openButton.offsetTop;
    this.width = this.openButton.offsetWidth;
    this.height = this.openButton.offsetHeight;
    this.gutter = 8;
    this.flyOutHeight = this.flyout.offsetHeight;
    this.flyOutWidth = this.flyout.offsetWidth;

    if (this.placement == 'right'){
        this.placeRight();
    }
    else if (this.placement == 'top'){
        this.placeTop();
    }
    else if (this.placement == 'left'){
        this.placeLeft();
    }
    else if (this.placement == 'bottom'){
        this.placeBottom();
    }

    if (ViewportCollision.collidesWith(this.flyout)) {
        this.placeLeft();
        if (ViewportCollision.collidesWith(this.flyout)) {
            this.placeRight();
            if (ViewportCollision.collidesWith(this.flyout)) {
                this.placeBottom();
                if (ViewportCollision.collidesWith(this.flyout)) {
                    this.placeTop();
                    if (ViewportCollision.collidesWith(this.flyout)) {
                        this.placeBottomFinal();
                        if (ViewportCollision.collidesWith(this.flyout)) {
                            this.placeTopFinal();
                        }
                    }
                }
            }
        }
    }

    this.open();
};

Flyout.prototype.placeTopFinal = function() {
    this.flyout.style.top  = this.offsetTop - this.flyOutHeight - this.gutter + 'px';
    this.flyout.style.left = this.gutter + 'px';
};

Flyout.prototype.placeBottomFinal = function() {
    this.flyout.style.top  = this.offsetTop + this.height + this.gutter + 'px';
    this.flyout.style.left = this.gutter + 'px';
};

Flyout.prototype.placeBottom = function() {
    this.flyout.style.top  = this.offsetTop + this.height + this.gutter + 'px';
    this.flyout.style.left = ((this.width - this.flyOutWidth) / 2) + this.offsetLeft + 'px';
};

Flyout.prototype.placeLeft = function() {
    this.flyout.style.left = this.offsetLeft - this.flyOutWidth - this.gutter + 'px';
    this.flyout.style.top = ((this.height - this.flyOutHeight) / 2) + this.offsetTop + 'px';
};

Flyout.prototype.placeTop = function() {
    this.flyout.style.top  = this.offsetTop - this.flyOutHeight - this.gutter + 'px';
    this.flyout.style.left = ((this.width - this.flyOutWidth) / 2) + this.offsetLeft + 'px';
};

Flyout.prototype.placeRight = function() {
    this.flyout.style.left = this.width + this.offsetLeft + this.gutter + 'px';
    this.flyout.style.top = ((this.height - this.flyOutHeight) / 2) + this.offsetTop + 'px';
};

Flyout.prototype.init = function() {
    this.flyout = this.element;
    this.flyoutID = this.flyout.getAttribute('id');
    this.openButton = document.querySelector("[data-js-flyout=" + this.flyoutID + "]");
    this.shown = false;

    if (window.addEventListener) {
        this.openButton.addEventListener('click', this, false);
        window.addEventListener('resize', this, false);
    } else if (window.attachEvent){
        var that = this;
        var handleEvent = function() {
            that.handleEvent.call(that);
        };

        this.openButton.attachEvent('onclick', handleEvent);
        window.attachEvent("onresize", handleEvent);
    }

    return this;
};

Flyout.prototype.handleEvent = function(e) {
    e = e || window.event;

    if (e.type === 'resize') {
        this.hide();
    }
    else if (this.shown) {
        this.hide();
    }
    else {
        this.show();
    }
};

export default Flyout;