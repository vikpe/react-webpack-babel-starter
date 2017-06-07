import {hasClass, addClass, removeClass, getWindowHeight} from '../../../helpers.js';

let BackToTop = function(el){
    this.element = el;

    return this.init();
};

BackToTop.prototype.init = function(){
    var that = this;

    if (window.addEventListener) {
        window.addEventListener('scroll', function() {
            that.handleEvent();
        }, false);
    } else if (window.attachEvent) {
       window.attachEvent('onscroll', function() {
           that.handleEvent.call(that.handleEvent);
       });
    }
};

BackToTop.prototype.handleEvent = function(e){
    var scrollBarPosition = window.pageYOffset || document.body.scrollTop;
    var h = getWindowHeight();

    if (scrollBarPosition >= (2 * h)){
        this.show();
    } else {
        this.hide();
    }
};

BackToTop.prototype.show = function(){
    this.element.setAttribute("aria-disabled", false);
};

BackToTop.prototype.hide = function(){
    this.element.setAttribute("aria-disabled", true);
};

export default BackToTop;