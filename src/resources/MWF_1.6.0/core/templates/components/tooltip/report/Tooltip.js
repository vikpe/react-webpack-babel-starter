
let Tooltip = function(el) {
    this.element = el;

    return this.init();
};

Tooltip.prototype.init = function() {
    this.controller = document.querySelector("[aria-describedby=" + this.element.getAttribute('id') + "]");
    this.isVisible = false;
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    if (window.addEventListener) {
        this.controller.addEventListener('mouseover', this, false);

    } else if (window.attachEvent) {
        var that = this;

        this.controller.attachEvent('onmouseover', function() {
            that.handleEvent.call(that);
        });
    }

    return this;
};

Tooltip.prototype.handleEvent = function(e) {
    e = e || window.event;

    if (e.type === "mouseover") {
        this.timer = window.setTimeout(this.show, 800);

        if (window.addEventListener) {
            this.controller.addEventListener('mouseout', this, false);
            document.addEventListener('mousemove', this, false);
        } else if (window.attachEvent) {
            var that = this;

            this.controller.attachEvent('onmouseout', function() {
                that.handleEvent.call(that);
            });
            this.controller.attachEvent('onmousmove', function() {
                that.handleEvent.call(that);
            });
        }
    }
    else if (e.type === "mouseout") {
        if (this.timer){
            window.clearTimeout(this.timer);
            this.timer = null;
        }
        this.hide();
    }
    else if (e.type === "mousemove") {
        this.xPosition = e.x;
        this.yPosition = e.y;

        if (this.isVisible) {
            this.setTooltipToMousePosition();
        }
    }
};

Tooltip.prototype.setTooltipToMousePosition = function() {
    this.element.style.left = this.xPosition + 'px';
    this.element.style.top = this.yPosition + 'px';
};

Tooltip.prototype.show = function() {
    this.isVisible = true;
    this.setTooltipToMousePosition();
    this.element.setAttribute('aria-hidden', 'false');
};

Tooltip.prototype.hide = function() {
    this.isVisible = false;
    this.element.setAttribute('aria-hidden', 'true');

    if (window.removeEventListener) {
        document.removeEventListener('mousemove', this, false);
    } else if (window.detachEvent) {
        var that = this;
        document.detachEvent('onmousemove', function() {
            that.handleEvent.call(that);
        });
    }
};

export default Tooltip;