import {getWindowWidth} from './helpers.js';
import breakpoints from './config.breakpoints.js';
var BreakpointTracker = {};

BreakpointTracker.identifyBreakpoint = function(windowWidth) {
    for (var i = breakpoints.length - 1; i >= 0; i--) {
        if (windowWidth >= breakpoints[i]) {
            return i;  // array is 0-based, add 1 if you need to look up the viewport (i.e. "vp1")
        }
    }
};

BreakpointTracker.subscribe = function(subscriber, callback) {
    this.subscribers.push({
        subscriber: subscriber,
        callback: callback
    });
};

BreakpointTracker.unsubscribe = function(subscriber) {
    var index = this.subscribers.indexOf(subscriber);

    if (index !== -1) {
        this.subscribers.splice(index, 1);
    }
};

BreakpointTracker.trigger = function() {
    for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i].callback.call(this.subscribers[i].subscriber, breakpoints[this.currentBreakpoint]);
    }
};

BreakpointTracker.handleEvent = function(e) {
    this.checkBreakpoint();
};

BreakpointTracker.checkBreakpoint = function() {
    var newBreakpoint = this.identifyBreakpoint(getWindowWidth());

    if (this.currentBreakpoint !== newBreakpoint) {
        this.currentBreakpoint = newBreakpoint;
        this.trigger();
    }
};

BreakpointTracker.getCurrentBreakpoint = function() {
    return this.identifyBreakpoint(getWindowWidth());
};

BreakpointTracker.init = function() {
    this.subscribers = [];

    // Set currentBreakpoint
    this.currentBreakpoint = this.identifyBreakpoint(getWindowWidth());

    // Attach window listener
    if (window.addEventListener) {
        window.addEventListener('resize', this, false);
    } else if (window.attachEvent){
        var that = this;
        window.attachEvent('onresize', function() {
            that.handleEvent.call(that);
        });
    }
};

BreakpointTracker.init();

export default BreakpointTracker;