import {addClass, removeClass} from '../../../helpers.js';

let Social = function (el) {
    this.element = el;

    return this.init();
};

Social.prototype.init = function () {
    this.icons = this.element.querySelectorAll('a[itemprop="sameAs"]');
    this.toggle = this.element.querySelector('button[aria-expanded]');
    this.hidden = true;
    this.overflowLength = 4;
    this.maxIconShowCount = 3;

    if (this.toggle !== null) {
        if (window.addEventListener) {
            this.toggle.addEventListener('click', this, false);
        } else if (window.attachEvent) {
            var that = this;
            this.toggle.attachEvent('onclick', function () {
                that.handleEvent.call(that);
            });
        }

        if (this.icons.length > this.overflowLength) {
            this.toggle.setAttribute('aria-hidden', 'false');
            this.expand();
            this.hide();
        }

        return this;
    }
};

Social.prototype.handleEvent = function (e) {

    if (this.hidden) {
        this.show();
        this.collapse();
    }
    else if (!this.hidden) {
        this.hide();
        this.expand();
    }
};

Social.prototype.hide = function () {

    if (!this.hidden) {
        for (var i=0; i < this.maxIconShowCount; i++) {
            removeClass(this.icons[i], "f-hide");
        }
    }

    for (var j=this.maxIconShowCount; j < this.icons.length; j++) {
        addClass(this.icons[j], "f-hide");
    }

    this.hidden = true;
};

Social.prototype.show = function () {
    this.hidden = false;

    for (var k=0; k < this.maxIconShowCount; k++) {
        addClass(this.icons[k], "f-hide");
    }

    for (var m=this.maxIconShowCount; m < this.icons.length; m++) {
        removeClass(this.icons[m], "f-hide");
    }
};

Social.prototype.expand = function () {
    this.toggle.setAttribute('aria-expanded', 'false');
};
Social.prototype.collapse = function () {
    this.toggle.setAttribute('aria-expanded', 'true');
};

export default Social;