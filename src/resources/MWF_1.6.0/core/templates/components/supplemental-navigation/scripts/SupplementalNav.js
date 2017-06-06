import {addClass, removeClass} from '../../../helpers.js';

let SupplementalNav = function (el) {
    this.element = el;
    this.activeLink = this.element.querySelector(".f-active");
    return this.init();
};

SupplementalNav.prototype.init = function () {
    var triggers = this.element.querySelectorAll("a[data-state]");
    var expandedNavID = this.activeLink.parentNode.getAttribute('id');

    for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getAttribute("aria-controls") === expandedNavID) {
            this.expand(triggers[i]);
            this.activeTrigger = triggers[i];
        } else {
            this.collapse(triggers[i]);
        }
    }

    if (window.addEventListener) {
        this.element.addEventListener('click', this, false);
    } else if (window.attachEvent) {
        var that = this;
        this.element.attachEvent('onclick', function () {
            that.handleEvent.call(that);
        });
    }

    return this;
};

SupplementalNav.prototype.handleEvent = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (this.isParent(target)) {
        this.collapse(this.activeTrigger);
        this.expand(target);
    } else {
        removeClass(this.activeLink, "f-active");
        addClass(target, "f-active");
        this.activeLink = target;
    }
};

SupplementalNav.prototype.stateNames = {
    expanded: {
        data: "expanded"
    },
    collapsed: {
        data: "collapsed"
    }
};

SupplementalNav.prototype.isExpanded = function (el) {
    return el.getAttribute("data-state") === this.stateNames.expanded.data ? true : false;
};

SupplementalNav.prototype.expand = function (el) {
    var targetNav = document.getElementById(el.getAttribute("aria-controls"));
    el.setAttribute("data-state", this.stateNames.expanded.data);
    targetNav.setAttribute("aria-hidden", false);
    targetNav.style.height = "auto";
    targetNav.style.overflow = "visible";
    this.activeTrigger = el;
};

SupplementalNav.prototype.collapse = function (el) {
    var targetNav = document.getElementById(el.getAttribute("aria-controls"));
    el.setAttribute("data-state", this.stateNames.collapsed.data);
    targetNav.setAttribute("aria-hidden", true);
    targetNav.style.overflow = "hidden";
    targetNav.style.height = "0";
};

SupplementalNav.prototype.isParent = function (el) {
    return (el.hasAttribute("data-state") && el.hasAttribute("aria-controls")) ? true : false;
};

export default SupplementalNav;