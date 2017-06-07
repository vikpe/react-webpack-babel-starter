import {addClass, removeClass, hasClass, getClientRect, getWindowWidth} from '../../../helpers.js';

let PageBar = function(el) {
    this.element = el;
    this.duplicate = this.element.cloneNode(true);
    this.elementTarget = document.querySelectorAll('[data-js-page-bar-target="' + this.duplicate.id + '"]');

    return this.init();
};

PageBar.prototype.init = function() {
    var that = this;
    this.element.removeAttribute('id');
    addClass(this.duplicate, 'f-sticky');
    if (hasClass(this.duplicate, 'f-hidden')) {
        removeClass(this.duplicate, 'f-hidden');
    }
    var tid = setInterval(function () {
        if (document.readyState !== 'complete') return;
        clearInterval(tid);
        document.body.appendChild(that.duplicate);
    }, 100);

    if (window.addEventListener) {
        window.addEventListener('scroll', this, true);
    } else if (window.attachEvent){
        window.attachEvent('onscroll', function() {
            that.handleEvent.call(that);
        });
    }
    return this;
};

PageBar.prototype.handleEvent = function() {
    if (this.elementTarget[0] !== undefined) {
        this.targetOffsetTop = this.elementTarget[0].getBoundingClientRect().bottom;
    } else {
        this.targetOffsetTop = document.body.getBoundingClientRect().top + 800;
    }
    if (this.targetOffsetTop <= 0) {
        this.show();
    } else {
        this.hide();
    }
};

PageBar.prototype.show = function() {
    if (!hasClass(this.duplicate, 'f-show')) {
        addClass(this.duplicate, 'f-show');
    }
};

PageBar.prototype.hide = function() {
    if (hasClass(this.duplicate, 'f-show')) {
        removeClass(this.duplicate, 'f-show');
    }
};

export default PageBar;