export function addClass(el, classNames) {
    var addedClasses = [];
    classNames = classNames.split(",");

    for (var i = 0; i < classNames.length; i++) {
        var trimmedClass = string.trim(classNames[i]);
        if (el.className.indexOf(trimmedClass) === -1) {
            el.className += " " + trimmedClass;
            addedClasses.push(trimmedClass);
        }
    }

    return addedClasses;
}

export function removeClass(el, classNames) {
    var removedClasses = [];
    classNames = classNames.split(",");

    for (var i = 0; i < classNames.length; i++) {
        var trimmedClass = string.trim(classNames[i]);
        if (el.className.indexOf(trimmedClass) !== -1) {
            el.className = string.trim(el.className.replace(trimmedClass, ""));
            removedClasses.push(trimmedClass);
        }
    }
}

export function hasClass(el, className) {
    if (!el.className) {
        return false;
    } else {
        var classes = ' ' + el.className + ' ',
            testClass = ' ' + className + ' ';
        return classes.indexOf(testClass) !== -1;
    }
}

export const string = {
    // Remove preceding and trailing whitespaces. This is necessary as
    // IE8 does not support String.trim.
    trim: function(string) {
        return string.replace(/^\s+|\s+$/g, '');
    }
};

export function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
}

export function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth;
}

export function addEventListeners (obj, type, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, function () {
            return fn.handleEvent.call(fn);
        });
    }
}

export function removeEventListeners( obj, type, fn ) {
    if ( obj.detachEvent ) {
        obj.detachEvent( 'on' + type, obj[type + fn] );
        obj[type + fn] = null;
    } else {
        obj.removeEventListener( type, fn, false );
    }
}

export function getClientRect(element) {
    var box = element.getBoundingClientRect(),
        clone = {};

    for (var property in box) {
        // ClientRect's hasOwnProperty fails so we can't use it to check
        // our copy. This just coppies directly
        clone[property] = box[property];
    }

    if (typeof clone.width === 'undefined') {
        clone.width = element.offsetWidth;
    }

    if (typeof clone.height === 'undefined') {
        clone.height = element.offsetHeight;
    }

    return clone;
}

export function isObjectEmpty(obj) {
    //IE8 cannot use Object.getOwnPropertyNames(obj).length
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)){
            return false;
        }
    }

    return true;
}

// Required by design to remove focus state outline on whitelisted components on click and touch events, while still allowing keyboard focus outline
export function removeFocus() {
    // Whitelist of elements that should not recieve focus
    var actionComponentList = [
        '.c-action-trigger',
        '.c-button',
        '.c-button > span',
        '.c-call-to-action',
        '.c-content-toggle button[aria-controls]',
        '.c-checkbox [type=checkbox]',
        '.c-drawer > button',
        '.c-drawer > header > button',
        '.c-dialog .c-glyph.glyph-cancel',
        '.c-flipper',
        '.c-hyperlink',
        '.c-hyperlink > span',
        '.c-in-page-navigation a',
        '.c-menu-item',
        '.c-pagination a',
        '.c-pivot a',
        '.c-product-placement > a',
        '.m-product-placement-item > a',
        '.c-radio [type=radio]',
        '.c-rating button',
        '.c-refine-item',
        'button.c-refine-item',
        '.c-select-button',
        '.c-select-menu > a',
        '.c-select-menu > button',
        '.c-sequence-indicator button[role=radio]',
        '.c-social',
        '.m-social',
        '.c-slider button',
        '.c-supplemental-nav a',
        '.c-table',
        '.c-toggle button',
        '.c-video'
    ];
    var actionComponents = document.querySelectorAll(actionComponentList);
    var outline = null;

    for (var i = 0; i < actionComponents.length; i++) {
        if (window.addEventListener) {
            actionComponents[i].addEventListener("mousedown", bindFocusEvent, false);
            actionComponents[i].addEventListener("mouseup", bindBlurEvent, false);
            actionComponents[i].addEventListener("click", bindFocusClick, false);
        } else if (window.attachEvent) {
            actionComponents[i].attachEvent("onmousedown", bindFocusEvent, false);
            actionComponents[i].attachEvent("onmouseup", bindBlurEvent, false);
            actionComponents[i].attachEvent("onclick", bindFocusClick, false);
        }
    }

    function bindFocusEvent (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var parent = target.parentNode;
        outline = target.style.outline;
        if (!(target.type === 'text' || target.type === 'textarea' || target.type === 'password')) {
            target.style.outline = 'transparent';
            parent.style.outline = 'transparent';
        }
    }

    function bindBlurEvent (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var parent = target.parentNode;
        if (!(target.type === 'text' || target.type === 'textarea' || target.type === 'password')) {
            target.blur();
            target.style.outline = outline;
            parent.style.outline = 'transparent';
        }
    }

    function bindFocusClick (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        if (target.type === 'checkbox' || target.type === 'radio') {
            target.blur();
        }
    }
}
