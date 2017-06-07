import breakpoints from '../../../config.breakpoints.js';
import breakpointTracker from '../../../breakpointTracker.js';
import {addClass, getWindowWidth, hasClass, removeClass} from '../../../helpers.js';

let Drawer = function(el) {
    this.element = el;
    this.toggleButton = this.element.querySelector('button[aria-controls], .f-toggle[aria-controls]');
    this.drawerTarget = document.getElementById(this.toggleButton.getAttribute('aria-controls'));
    this.responsiveDrawer = hasClass(el,'f-responsive') === true ? true : false;

    return this.init();
};

Drawer.prototype.init = function() {

    if (this.isExpanded()) {
        this.expand();
    } else {
        this.collapse();
    }

    if (window.addEventListener) {
        this.element.addEventListener('click', this, false);

        // only activate responsive drawer for modern browsers (MQs don't work in IE8)
        if (this.responsiveDrawer) {
            this.update(getWindowWidth());
            breakpointTracker.subscribe(this, this.update);
        }
    } else if (window.attachEvent){
        var that = this;
        this.element.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }

    return this;
};

Drawer.prototype.handleEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    // Drawers can host interactive items, so we need to ensure that
    // we only trigger the drawer when the drawer's toggle button is the element
    // that is clicked
    if (target === this.toggleButton)  {
        if (this.isExpanded()) {
            this.collapse();
        } else {
            this.expand();
        }
    }
};

Drawer.prototype.isExpanded = function() {
    return this.toggleButton.getAttribute('aria-expanded') === 'true';
};

Drawer.prototype.expand = function() {
    this.toggleButton.setAttribute('aria-expanded', 'true');
    this.drawerTarget.style.height = 'auto';
    this.drawerTarget.style.overflow = 'visible';
    this.drawerTarget.removeAttribute('hidden');
    this.drawerTarget.setAttribute('aria-hidden', 'false');
};

Drawer.prototype.collapse = function() {
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.drawerTarget.style.overflow = 'hidden';
    this.drawerTarget.style.height = '0';
    this.drawerTarget.setAttribute('hidden', '');
    this.drawerTarget.setAttribute('aria-hidden', 'true');
};

Drawer.prototype.update = function(windowWidth) {
    // add 1 since breakpoints are identified at 0-based array
    this.viewport = breakpointTracker.identifyBreakpoint(windowWidth) + 1;

    if (this.viewport > 1) {
        // expand content and remove visible "drawer" cues for anything larger than vp1
        this.toggleButton.setAttribute('disabled', 'disabled');
        addClass(this.element, 'f-show');
        this.expand();
    } else {
        // collapse drawer and restore visual cues in vp1
        this.toggleButton.removeAttribute('disabled');
        removeClass(this.element, 'f-show');
        this.collapse();
    }
};

export default Drawer;