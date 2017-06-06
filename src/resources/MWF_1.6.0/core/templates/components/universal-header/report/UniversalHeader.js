
import {addClass, removeClass, hasClass} from '../../../helpers.js';

var UniversalHeader = function(el) {
    this.element = el;
    this.mobileNav = document.querySelector('.c-universal-header > nav');
    this.hamburger = document.querySelector('.c-universal-header .c-action-trigger.glyph-global-nav-button');
};

UniversalHeader.prototype.init = function() {
    if (window.addEventListener) {
        this.hamburger.addEventListener('click', this, false);
    } else if (window.attachEvent){
        var that = this;
        this.hamburger.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }
};

UniversalHeader.prototype.handleEvent = function(e) {
    if (this.mobileNavShowing()) {
        this.hideMobileNav();
    } else {
        this.showMobileNav();
    }
};

UniversalHeader.prototype.showMobileNav = function() {
    removeClass(this.mobileNav, "f-closed");
    this.mobileNav.setAttribute("aria-hidden", "false");
};

UniversalHeader.prototype.hideMobileNav = function() {
    addClass(this.mobileNav, "f-closed");
    this.mobileNav.setAttribute("aria-hidden", "true");
};

UniversalHeader.prototype.mobileNavShowing = function() {
    if (hasClass(this.mobileNav, "f-closed") && this.mobileNav.getAttribute("aria-hidden") == "true") {
        return false;
    } else {
        return true;
    }
};

export default UniversalHeader;
