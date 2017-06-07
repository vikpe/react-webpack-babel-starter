import {hasClass} from '../../../helpers.js';

let SelectMenu = function(el) {
    this.element = el;
    this.trigger = el.querySelector('[aria-haspopup="true"]');
    this.menu = el.querySelector('.c-menu');
    this.linkList = el.querySelectorAll('.c-menu-item a');

    return this.init();
};

SelectMenu.prototype.init = function() {
    this.changeCallback = [];
    if (!this.isExpanded()) {
        this.collapse();
    }
    this.persist = hasClass(this.element, 'f-persist');

    this.addDefaultListener();

    return this;
};

SelectMenu.prototype.expand = function() {
    this.trigger.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');
};

SelectMenu.prototype.collapse = function() {
    this.trigger.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
};

SelectMenu.prototype.isExpanded = function() {
    if (this.trigger.getAttribute('aria-expanded') === 'true' && this.menu.getAttribute('aria-hidden') === 'false') {
        return true;
    } else {
        return false;
    }
};

SelectMenu.prototype.addDefaultListener = function() {
    var that = this;

    if (window.addEventListener) {
        this.trigger.addEventListener('click', this, false);
        for (var i=0; i < this.linkList.length; i++){
            this.linkList[i].addEventListener('click', this, false);
        }

        document.addEventListener('click', function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = that.element.contains(target);
            if (!isClickInside) {
                if (target !== that.menu) {
                    if (parent !== that.menu) {
                        that.collapse();
                    }
                }
            }
        });
    } else if (window.attachEvent){
        this.ieClick = function() {
            that.handleEvent.call(that);
        };

        this.trigger.attachEvent('onclick', this.ieClick);
        for (var j = 0; j < this.linkList.length; j++){
            this.linkList[j].attachEvent('onclick', this.ieClick);
        }

        document.attachEvent('onclick', function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = that.element.contains(target);
            if (!isClickInside) {
                if (target !== that.menu) {
                    if (parent !== that.menu) {
                        that.collapse();
                    }
                }
            }
        });
    }
};

SelectMenu.prototype.removeDefaultListener = function() {
    if (window.addEventListener) {
        this.trigger.removeEventListener('click', this, false);
    } else if (window.attachEvent){
        this.trigger.detachEvent('onclick', this.ieClick);
    }
};

SelectMenu.prototype.handleEvent = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (target.getAttribute('aria-haspopup')) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        if (this.isExpanded()) {
            this.collapse();
        } else {
            this.expand();
        }
    } else {
        if (this.persist) {
            var text = target.innerText || target.textContent;
            this.trigger.innerHTML = text;
            this.collapse();
        }
        this.executeCallback();
    }
};

SelectMenu.prototype.registerCallback = function (callback, options, callbackObj) {
    this.changeCallback.push({
        options: options,
        callback: callback,
        callbackObj: callbackObj
    });
};

SelectMenu.prototype.executeCallback = function () {
    if (this.changeCallback.length > 0) {
        for (var i = 0; i < this.changeCallback.length; i++) {
            if (typeof this.changeCallback[i].callback === "function") {
                this.changeCallback[i].callback.call(this.changeCallback[i].callbackObj, this.changeCallback[i].options);
            }
        }
    }
};

export default SelectMenu;