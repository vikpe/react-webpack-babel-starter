
import breakpointTracker from '../../../breakpointTracker.js';
import breakpoints from '../../../config.breakpoints.js';
import RefineItem from '../../refine-item/scripts/RefineItem.js';

let RefineMenu = function (el) {
    this.element = el;
    this.collapseButton = this.element.querySelector('.c-heading + button.c-action-trigger');
    this.expandButton = this.element.querySelector('[data-mobile-target] + button.c-action-trigger');
    this.mobileTarget = this.element.querySelector('[data-mobile-target]');

    this.refineItems = [];
    var elementList = this.element.querySelectorAll('.c-refine-item');

    for (var i = 0; i < elementList.length; i++) {
        this.refineItems.push(new RefineItem(elementList[i]));
    }

    return this.init();
};

RefineMenu.prototype.init = function () {

    breakpointTracker.subscribe(this, this.update);

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

RefineMenu.prototype.stateNames = {
    expanded: {
        data: 'expanded'
    },
    collapsed: {
        data: 'collapsed'
    }
};

RefineMenu.prototype.handleEvent = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (target === this.collapseButton) {
        this.collapse();
    }
    else if(target === this.expandButton){
        this.expand();
    }
    else {
        var refineGroup = null,
            normalizedTarget = null;

        // Because the span inside of the button can be the click target,
        // we need to normalize our checks against the button element.
        if (target.nodeName === 'SPAN') {
            refineGroup = target.parentNode.parentNode;
            normalizedTarget = target.parentNode;
        } else {
            refineGroup = target.parentNode;
            normalizedTarget = target;
        }

        //each category will have only one item selected at once if category is radio grouped
        for (var i = 0; i < this.refineItems.length; i++) {
            if (this.refineItems[i].element.parentNode === refineGroup && this.refineItems[i].element !== normalizedTarget && refineGroup.getAttribute('role') === 'radiogroup') {
                this.refineItems[i].deselect();
            }
        }
    }
};

RefineMenu.prototype.update = function (breakPoint) {
    if (breakPoint <= breakpoints[1]) {
        this.collapse();
    } else {
        this.expand();
    }
};

RefineMenu.prototype.isExpanded = function () {
    return this.mobileTarget.getAttribute('aria-expanded') === 'true';
};

RefineMenu.prototype.expand = function () {
    this.mobileTarget.style.overflow = 'visible';
    this.mobileTarget.style.height = 'auto';
    this.mobileTarget.setAttribute('aria-hidden', 'false');

    this.expandButton.setAttribute('aria-expanded', 'true');
    this.collapseButton.setAttribute('aria-expanded', 'true');
    this.expandButton.style.display = 'none';
};

RefineMenu.prototype.collapse = function () {
    this.mobileTarget.style.overflow = 'hidden';
    this.mobileTarget.style.height = 0;
    this.mobileTarget.setAttribute('aria-hidden', 'true');

    this.expandButton.setAttribute('aria-expanded', 'false');
    this.collapseButton.setAttribute('aria-expanded', 'false');
    this.expandButton.style.display = 'block';
};

export default RefineMenu;