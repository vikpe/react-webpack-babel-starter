import {addClass, removeClass} from '../../../helpers.js';

let Pivot = function (el) {
    this.element = el;
    this.contentSections = this.element.getElementsByTagName("section");
    this.activePivotHeader = this.element.querySelector(".f-active");
    return this.init();
};

Pivot.prototype.init = function () {
    if (this.activePivotHeader !== null) {
        this.update(document.getElementById(this.activePivotHeader.getAttribute("aria-controls")));

        this.headerElement = this.element.querySelector('header');

        if (window.addEventListener) {
            this.headerElement.addEventListener('click', this, false);
        } else if (window.attachEvent) {
            var that = this;
            this.headerElement.attachEvent('onclick', function () {
                that.handleEvent.call(that);
            });
        }

        return this;
    }
};

Pivot.prototype.handleEvent = function (e) {
    e = e || window.event;

    //If IE8, use returnValue instead as preventDefault not supported.
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }

    var target = e.target || e.srcElement;

    if (target.nodeName === 'A'){
        removeClass(this.activePivotHeader, "f-active");
        addClass(target, "f-active");
        this.activePivotHeader = target;

        this.update(document.getElementById(target.getAttribute("aria-controls")));
    }
};

Pivot.prototype.update = function (target) {
    for (var i = 0; i < this.contentSections.length; i++) {
        var section = this.contentSections[i];
        if (target === section) {
            this.show(section);

        } else {
            this.hide(section);
        }
    }
};

Pivot.prototype.show = function (section) {
    section.setAttribute("aria-hidden", false);
};

Pivot.prototype.hide = function (section) {
    section.setAttribute("aria-hidden", true);
};

export default Pivot;