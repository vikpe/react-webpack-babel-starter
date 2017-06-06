/* 
* Global namespacing
*
* Components Included: 
* Select Menu
* Dialog
* Flyout
* Drawer
* In Page Navigation
* Pivot
* Table
* Toggle
* ToolTip
* Checkbox
*/
(function(MWF) {

    /*
    * Constants
    */

    const ViewportCollision = {
        collidesWith: function(el) {
            var elRect = getClientRect(el);
            var collisionDetected = {};
            //Detecting width to account for lingering listeners and hidden elements - without it collision would be detected at 0,0 (top,left) for hidden elements or non removed listeners.
            if (elRect.width !== 0) {
                if (elRect.top <= 0) {
                    collisionDetected.top = true;
                }
                if (elRect.bottom >= (window.innerHeight || document.documentElement.clientHeight)) {
                    collisionDetected.bottom = true;
                }
                if (elRect.left <= 0) {
                    collisionDetected.left = true;
                }
                if (elRect.right >= (window.innerWidth || document.documentElement.clientWidth)) {
                    collisionDetected.right = true;
                }
            }

            if (isObjectEmpty(collisionDetected) === false) {
                return collisionDetected;
            }

            return false;
        }
    };
    
    const string = {
        // Remove preceding and trailing whitespaces. This is necessary as
        // IE8 does not support String.trim.
        trim: function(string) {
            return string.replace(/^\s+|\s+$/g, '');
        }
    };

    /*
    * Utilities
    */

    function getClientRect(element) {
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

    function addClass(el, classNames) {
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

    function removeClass(el, classNames) {
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

    function hasClass(el, className) {
        if (!el.className) {
            return false;
        } else {
            var classes = ' ' + el.className + ' ',
                testClass = ' ' + className + ' ';
            return classes.indexOf(testClass) !== -1;
        }
    }
    
    function getWindowWidth() {
        return window.innerWidth || document.documentElement.clientWidth;
    }
    
    function isObjectEmpty(obj) {
        //IE8 cannot use Object.getOwnPropertyNames(obj).length
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)){
                return false;
            }
        }

        return true;
    }

    /*
    * Select Menu
    */

    MWF.SelectMenu = function(el) {
        this.element = el;
        this.trigger = el.querySelector('[aria-haspopup="true"]');
        this.menu = el.querySelector('.c-menu');
        this.linkList = el.querySelectorAll('.c-menu-item a');

        return this.init();
    };

    MWF.SelectMenu.prototype.init = function() {
        this.changeCallback = [];
        if (!this.isExpanded()) {
            this.collapse();
        }

        this.addDefaultListener();

        return this;
    };

    MWF.SelectMenu.prototype.expand = function() {
        this.trigger.setAttribute('aria-expanded', 'true');
        this.menu.setAttribute('aria-hidden', 'false');
    };

    MWF.SelectMenu.prototype.collapse = function() {
        this.trigger.setAttribute('aria-expanded', 'false');
        this.menu.setAttribute('aria-hidden', 'true');
    };

    MWF.SelectMenu.prototype.isExpanded = function() {
        if (this.trigger.getAttribute('aria-expanded') === 'true' && this.menu.getAttribute('aria-hidden') === 'false') {
            return true;
        } else {
            return false;
        }
    };

    MWF.SelectMenu.prototype.addDefaultListener = function() {
        if (window.addEventListener) {
            this.trigger.addEventListener('click', this, false);
            for (var i = 0; i < this.linkList.length; i++) {
                this.linkList[i].addEventListener('click', this, false);
            }
        } else if (window.attachEvent) {
            var that = this;
            this.ieClick = function() {
                that.handleEvent.call(that);
            };

            this.trigger.attachEvent('onclick', this.ieClick);
            for (var j = 0; j < this.linkList.length; j++) {
                this.linkList[j].attachEvent('onclick', this.ieClick);
            }
        }
    };

    MWF.SelectMenu.prototype.removeDefaultListener = function() {
        if (window.addEventListener) {
            this.trigger.removeEventListener('click', this, false);
        } else if (window.attachEvent) {
            this.trigger.detachEvent('onclick', this.ieClick);
        }
    };

    MWF.SelectMenu.prototype.handleEvent = function(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var target = e.target || e.srcElement;

        if (target.getAttribute('aria-haspopup')) {
            if (this.isExpanded()) {
                this.collapse();
            } else {
                this.expand();
            }
        } else {
            this.executeCallback();
        }
    };

    MWF.SelectMenu.prototype.registerCallback = function(callback, options, callbackObj) {
        this.changeCallback.push({
            options: options,
            callback: callback,
            callbackObj: callbackObj
        });
    };

    MWF.SelectMenu.prototype.executeCallback = function() {
        if (this.changeCallback.length > 0) {
            for (var i = 0; i < this.changeCallback.length; i++) {
                if (typeof this.changeCallback[i].callback === "function") {
                    this.changeCallback[i].callback.call(this.changeCallback[i].callbackObj, this.changeCallback[i].options);
                }
            }
        }
    };


    /*
    * Dialog
    */

    MWF.Dialog = function(el) {
        this.element = el;
        return this.init();
    };

    MWF.Dialog.prototype.show = function() {
        this.shown = true;
        this.dialog.setAttribute('aria-hidden', 'false');
        this.dialogContent.focus();
        document.body.style.overflow = 'hidden';

        var openID = this.dialogID;
        var openDialogContent = this.dialogContent;
        var openEl = document.getElementById(openID);
        var inputs = this.dialogInputs;
        var firstInput = inputs[0];
        var lastInput = inputs[inputs.length - 1];

        document.onkeydown = function(e) {
            var keyCode = e.keyCode || e.which;
            var target = e.target || e.srcElement;
            var theEvent = e;

            switch (keyCode) {

                //enter keystroke
                case 13:
                    if (target.getAttribute('data-js-dialog-hide') !== null) {
                        e.preventDefault();
                        Dialog.prototype.escape(openEl);
                    }
                    break;

                //escape keystroke
                case 27:
                    e.preventDefault();
                    Dialog.prototype.escape(openEl);
                    break;

                //tab keystroke
                case 9:

                    if (inputs.length === 1) {
                        e.preventDefault();
                        firstInput.focus();
                    }
                    else {
                        lastInput.onkeydown = function(e) {
                            if ((e.which === 9 && !e.shiftKey)) {
                                e.preventDefault();
                                firstInput.focus();
                            }
                        };
                        firstInput.onkeydown = function(e) {
                            if ((e.which === 9 && e.shiftKey)) {
                                e.preventDefault();
                                lastInput.focus();
                            }
                        };
                    }
                    break;
                default:
                    break;
            }
        };
    };

    MWF.Dialog.prototype.escape = function(el) {
        this.dialog = el;
        this.hide();
    };

    MWF.Dialog.prototype.hide = function() {
        this.shown = false;
        this.dialog.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    };

    MWF.Dialog.prototype.init = function() {
        this.dialog = this.element;
        this.dialogID = this.element.getAttribute('id');
        this.openButton = document.querySelectorAll("[data-js-dialog-show=" + this.dialogID + "]");
        this.closeButton = this.element.querySelector("#" + this.dialogID + " button[data-js-dialog-hide]");
        this.closeGlyph = this.element.querySelector("#" + this.dialogID + " .c-glyph[data-js-dialog-hide]");
        this.dialogContent = this.element.querySelector("#" + this.dialogID + " div[role='dialog']");
        this.backdrop = this.element.querySelector("#" + this.dialogID + ".c-dialog div[role='presentation']");
        this.dialogInputs = this.element.querySelectorAll('select, input, textarea, button, a, .c-glyph[data-js-dialog-hide]');
        this.firstInput = this.dialogInputs[0];
        this.lastInput = this.dialogInputs[this.dialogInputs.length - 1];
        this.shown = false;

        if (window.addEventListener) {
            for (var i = 0; i < this.openButton.length; i++) {
                this.openButton[i].addEventListener('click', this, false);
            }
            if (this.closeButton !== null) {
                this.closeButton.addEventListener('click', this, false);
            }
            if (this.closeGlyph !== null) {
                this.closeGlyph.addEventListener('click', this, false);
            }
            if (this.backdrop !== null) {
                this.backdrop.addEventListener('click', this, false);
            }
        } else if (window.attachEvent) {
            var that = this;
            var handleEvent = function() {
                that.handleEvent.call(that);
            };
            for (var j = 0; j < this.openButton.length; j++) {
                this.openButton[j].attachEvent('onclick', handleEvent);
            }

            if (this.closeButton !== null) {
                this.closeButton.attachEvent('onclick', handleEvent);
            }
            if (this.closeGlyph !== null) {
                this.closeGlyph.attachEvent('onclick', handleEvent);
            }
            if (this.backdrop !== null) {
                this.backdrop.attachEvent('onclick', handleEvent);
            }
        }

        return this;
    };

    MWF.Dialog.prototype.handleEvent = function(e) {
        var target = e.target || e.srcElement;

        //dialog closing elements
        if ((target == this.closeButton) || (target == this.closeGlyph) || (target == this.backdrop)) {
            this.hide();
        }
        //dialog opening elements
        else if (this.openButton.length > 1) {
            for (var i = 0; i < this.openButton.length; i++) {
                if (target == this.openButton[i]) {
                    this.show();
                }
            }
        }
        else if (target == this.openButton[0]) {
            this.show();
        }
    };

    /*
    * Flyout
    */

    MWF.Flyout = function(el) {
        this.element = el;

        return this.init();
    };

    MWF.Flyout.prototype.hide = function() {
        this.shown = false;
        this.flyout.setAttribute('aria-hidden', 'true');
    };

    MWF.Flyout.prototype.escape = function(el) {
        this.flyout = el;
        this.hide();
    };

    MWF.Flyout.prototype.open = function() {
        var bodyEl = document.querySelector("body");
        var flyoutEl = this.flyout;
        var openEl = this.openButton;
        var that = this;

        if (window.addEventListener) {
            document.addEventListener("click", function(e) {
                var target = e.target || e.srcElement;
                var parent = target.parentNode;
                var isClickInside = flyoutEl.contains(target);
                if (!isClickInside) {
                    if (target !== openEl) {
                        if (parent !== openEl) {
                            that.escape(flyoutEl);
                        }
                    }
                }
            });
        } else if (window.attachEvent) {
            document.attachEvent("onclick", function(e) {
                var target = e.target || e.srcElement;
                var parent = target.parentNode;
                var isClickInside = flyoutEl.contains(target);
                if (!isClickInside) {
                    if (target !== openEl) {
                        if (parent !== openEl) {
                            that.escape(flyoutEl);
                        }
                    }
                }
            });
        }
    };

    MWF.Flyout.prototype.show = function() {
        this.shown = true;
        this.flyout.setAttribute('aria-hidden', 'false');
        this.placement = this.flyout.getAttribute('data-js-flyout-placement');
        this.dimensions = getClientRect(this.openButton);
        this.offsetLeft = this.openButton.offsetLeft;
        this.offsetTop = this.openButton.offsetTop;
        this.width = this.openButton.offsetWidth;
        this.height = this.openButton.offsetHeight;
        this.gutter = 8;
        this.flyOutHeight = this.flyout.offsetHeight;
        this.flyOutWidth = this.flyout.offsetWidth;

        if (this.placement == 'right') {
            this.placeRight();
        }
        else if (this.placement == 'top') {
            this.placeTop();
        }
        else if (this.placement == 'left') {
            this.placeLeft();
        }
        else if (this.placement == 'bottom') {
            this.placeBottom();
        }

        if (ViewportCollision.collidesWith(this.flyout)) {
            this.placeLeft();
            if (ViewportCollision.collidesWith(this.flyout)) {
                this.placeRight();
                if (ViewportCollision.collidesWith(this.flyout)) {
                    this.placeBottom();
                    if (ViewportCollision.collidesWith(this.flyout)) {
                        this.placeTop();
                        if (ViewportCollision.collidesWith(this.flyout)) {
                            this.placeBottomFinal();
                            if (ViewportCollision.collidesWith(this.flyout)) {
                                this.placeTopFinal();
                            }
                        }
                    }
                }
            }
        }

        this.open();
    };

    MWF.Flyout.prototype.placeTopFinal = function() {
        this.flyout.style.top = this.offsetTop - this.flyOutHeight - this.gutter + 'px';
        this.flyout.style.left = this.gutter + 'px';
    };

    MWF.Flyout.prototype.placeBottomFinal = function() {
        this.flyout.style.top = this.offsetTop + this.height + this.gutter + 'px';
        this.flyout.style.left = this.gutter + 'px';
    };

    MWF.Flyout.prototype.placeBottom = function() {
        this.flyout.style.top = this.offsetTop + this.height + this.gutter + 'px';
        this.flyout.style.left = ((this.width - this.flyOutWidth) / 2) + this.offsetLeft + 'px';
    };

    MWF.Flyout.prototype.placeLeft = function() {
        this.flyout.style.left = this.offsetLeft - this.flyOutWidth - this.gutter + 'px';
        this.flyout.style.top = ((this.height - this.flyOutHeight) / 2) + this.offsetTop + 'px';
    };

    MWF.Flyout.prototype.placeTop = function() {
        this.flyout.style.top = this.offsetTop - this.flyOutHeight - this.gutter + 'px';
        this.flyout.style.left = ((this.width - this.flyOutWidth) / 2) + this.offsetLeft + 'px';
    };

    MWF.Flyout.prototype.placeRight = function() {
        this.flyout.style.left = this.width + this.offsetLeft + this.gutter + 'px';
        this.flyout.style.top = ((this.height - this.flyOutHeight) / 2) + this.offsetTop + 'px';
    };

    MWF.Flyout.prototype.init = function() {
        this.flyout = this.element;
        this.flyoutID = this.flyout.getAttribute('id');
        this.openButton = document.querySelector("[data-js-flyout=" + this.flyoutID + "]");
        this.shown = false;

        if (window.addEventListener) {
            this.openButton.addEventListener('click', this, false);
            window.addEventListener('resize', this, false);
        } else if (window.attachEvent) {
            var that = this;
            var handleEvent = function() {
                that.handleEvent.call(that);
            };

            this.openButton.attachEvent('onclick', handleEvent);
            window.attachEvent("onresize", handleEvent);
        }

        return this;
    };

    MWF.Flyout.prototype.handleEvent = function(e) {
        e = e || window.event;

        if (e.type === 'resize') {
            this.hide();
        }
        else if (this.shown) {
            this.hide();
        }
        else {
            this.show();
        }
    };

    /*
    * Drawer
    */

    MWF.Drawer = function(el) {
        this.element = el;
        this.toggleButton = this.element.querySelector('button[aria-controls]');
        this.drawerTarget = document.getElementById(this.toggleButton.getAttribute('aria-controls'));
        return this.init();
    };

    MWF.Drawer.prototype.init = function() {
        if (this.isExpanded()) {
            this.expand();
        } else {
            this.collapse();
        }

        if (window.addEventListener) {
            this.element.addEventListener('click', this, false);
        } else if (window.attachEvent) {
            var that = this;
            this.element.attachEvent('onclick', function() {
                that.handleEvent.call(that);
            });
        }

        return this;
    };

    MWF.Drawer.prototype.handleEvent = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        // Drawers can host interactive items, so we need to ensure that
        // we only trigger the drawer when the drawer's toggle button is the element
        // that is clicked
        if (target === this.toggleButton) {
            if (this.isExpanded()) {
                this.collapse();
            } else {
                this.expand();
            }
        }
    };

    MWF.Drawer.prototype.isExpanded = function() {
        return this.toggleButton.getAttribute('aria-expanded') === 'true';
    };

    MWF.Drawer.prototype.expand = function() {
        this.toggleButton.setAttribute('aria-expanded', 'true');
        this.drawerTarget.style.height = 'auto';
        this.drawerTarget.style.overflow = 'visible';
        this.drawerTarget.removeAttribute('hidden');
        this.drawerTarget.setAttribute('aria-hidden', 'false');
    };

    MWF.Drawer.prototype.collapse = function() {
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.drawerTarget.style.overflow = 'hidden';
        this.drawerTarget.style.height = '0';
        this.drawerTarget.setAttribute('hidden', '');
        this.drawerTarget.setAttribute('aria-hidden', 'true');
    };

    /*
    * In Page Navigation
    */

    MWF.InPageNavigation = function(el) {
        this.element = el;

        return this.init();
    };

    MWF.InPageNavigation.prototype.init = function() {
        var that = this;

        if (window.addEventListener) {
            window.addEventListener('resize', function() {
                that.resize();
            }, false);
        } else if (window.attachEvent) {
            window.attachEvent('onresize', function() {
                that.handleEvent.call(that.resize);
            });
        }

        this.checkCollapse();
        this.setOffsetTop();
        this.setAnchorPositions();
        this.setStickyLinks();
    };

    MWF.InPageNavigation.prototype.resize = function() {
        this.checkCollapse();
        this.setWidth(true);
        this.setOffsetTop();
        this.setAnchorPositions();
    };

    MWF.InPageNavigation.prototype.checkCollapse = function() {
        this.listItems = this.element.querySelectorAll('li');
        this.elementWidth = getClientRect(this.element.parentElement).width;
        this.lastItemLoc = undefined;

        if (!hasClass(this.element, 'f-dropdown') && !hasClass(this.element, 'f-vertical')) {
            this.lastItemLoc = getClientRect(this.listItems[this.listItems.length - 1]).right;
        } else if (hasClass(this.element, 'f-dropdown') && !hasClass(this.element, 'f-vertical')) {
            for (var i = 0; i < this.element.parentElement.children.length; i++) {
                this.listItems = this.element.parentElement.children[i].querySelectorAll('li');
                if (!hasClass(this.element.parentElement.children[i], 'f-dropdown')) {
                    this.lastItemLoc = getClientRect(this.listItems[this.listItems.length - 1]).right;
                }
            }
        }

        if (hasClass(this.element, 'f-vertical')) {
            if (getWindowWidth() < 100 + this.elementWidth) {
                this.convertMenu('dropdown');
            } else {
                this.convertMenu('vertical');
            }
        } else {
            if (this.lastItemLoc > this.elementWidth || this.lastItemLoc === 0) {
                this.convertMenu('dropdown');
            } else {
                this.convertMenu('horizontal');
            }
        }
    };

    MWF.InPageNavigation.prototype.convertMenu = function(format) {
        if (format === 'dropdown') {
            if (hasClass(this.element, 'f-dropdown')) {
                if (hasClass(this.element, 'f-hide')) {
                    removeClass(this.element, 'f-hide');
                }
            } else {
                if (!hasClass(this.element, 'f-hide')) {
                    addClass(this.element, 'f-hide');
                }
            }
        } else {
            if (!hasClass(this.element, 'f-dropdown')) {
                if (hasClass(this.element, 'f-hide')) {
                    removeClass(this.element, 'f-hide');
                }
            } else {
                if (!hasClass(this.element, 'f-hide')) {
                    addClass(this.element, 'f-hide');
                }
            }
        }
    };

    MWF.InPageNavigation.prototype.setOffsetTop = function() {
        if (document.querySelector('[data-js-in-page-navigation-wrapper]') !== null && document.querySelector('[data-js-in-page-navigation-wrapper]') !== undefined) {
            this.stickyOffsetTop = getClientRect(this.element).top + window.scrollY;
            if (this.stickyOffsetTop < 0) {
                addClass(this.element, 'f-sticky');
                this.stickyOffsetTop = this.stickyOffsetTop - getClientRect(document.body).top;
                this.element.style.marginLeft = this.stickyOffsetLeft;
            }
        } else {
            this.stickyOffsetTop = 0;
        }
    };

    MWF.InPageNavigation.prototype.getAnchorElements = function() {
        this.anchorElements = [];
        var anchors = this.element.querySelectorAll('a');
        for (var i = 0; i < anchors.length; i++) {
            var tempId = anchors[i].getAttribute('href').split("#")[1];
            this.anchorElements.push(document.getElementById(tempId));
        }
        return this.anchorElements;
    };

    MWF.InPageNavigation.prototype.setAnchorPositions = function() {
        this.anchorElements = this.getAnchorElements();
        this.anchorPositions = [];
        for (var l = 0; l < this.anchorElements.length; l++) {
            this.anchorPositions[this.anchorElements[l].id] = getClientRect(this.anchorElements[l]).top - getClientRect(document.body).top;
        }
    };

    MWF.InPageNavigation.prototype.setStickyLinks = function() {
        this.stickyLinks = this.element.querySelectorAll('ul a');
        this.dropdownLink = undefined;

        if (hasClass(this.element, 'f-dropdown')) {
            this.dropdownLink = this.element.querySelector('a');
            this.attachEvents(undefined, this.dropdownLink);
        }

        for (var i = 0; i < this.stickyLinks.length; i++) {
            this.attachEvents(i);
        }
    };

    MWF.InPageNavigation.prototype.setWidth = function(resize) {
        var stickyElement = this.element;
        var stickElementList = stickyElement.querySelector('ul');
        var isSticky = hasClass(stickyElement, 'f-sticky');
        var scroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        this.stickyOffsetTop = getClientRect(this.element.parentElement).top + window.scrollY;
        this.stickyOffsetLeft = getClientRect(this.element.parentElement).left;
        this.elementWidth = getClientRect(this.element.parentElement).width;

        if (resize === true && hasClass(stickyElement, 'f-sticky')) {
            stickElementList.style.width = this.elementWidth + "px";
            stickElementList.style.marginLeft = this.stickyOffsetLeft + "px";
        }

        if (document.querySelector('[data-js-in-page-navigation-wrapper]') !== null && document.querySelector('[data-js-in-page-navigation-wrapper]') !== undefined) {
            if (this.stickyOffsetTop < scroll) {
                if (!hasClass(stickyElement, 'f-sticky')) {
                    addClass(stickyElement, 'f-sticky');
                    stickElementList.style.width = this.elementWidth + "px";
                    stickElementList.style.marginLeft = this.stickyOffsetLeft + "px";
                }
            } else if (isSticky !== false) {
                removeClass(stickyElement, 'f-sticky');
                if (stickElementList.style.removeProperty) {
                    stickElementList.style.removeProperty('margin-left');
                    stickElementList.style.removeProperty('width');
                } else {
                    stickElementList.style.removeAttribute('margin-left');
                    stickElementList.style.removeAttribute('width');
                }
            }
        }
    };

    MWF.InPageNavigation.prototype.attachEvents = function(i, dropdownLink) {
        var that = this;

        if (i === undefined) {
            if (window.addEventListener) {
                dropdownLink.addEventListener('click', this, false);
            } else if (window.attachEvent) {
                dropdownLink.attachEvent('onclick', function() {
                    that.handleEvent.call(that);
                });
            }
        } else {
            if (window.addEventListener) {
                this.stickyLinks[i].addEventListener('click', this, false);
                window.addEventListener('scroll', this, false);
            } else if (window.attachEvent) {
                this.stickyLinks[i].attachEvent('onclick', function() {
                    that.handleEvent.call(that);
                });
                window.attachEvent('scroll', function() {
                    that.handleEvent.call(that);
                });
            }
        }
    };

    MWF.InPageNavigation.prototype.handleEvent = function(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        this.anchorElements = this.getAnchorElements();
        this.collapse = false;
        var stickyElement = this.element;
        var target = e.target || e.srcElement;
        var dropdownMenu = this.element.querySelector('ul');
        var visible = dropdownMenu.getAttribute('aria-hidden');

        if (document.querySelector('[data-js-in-page-navigation-wrapper]') !== null && document.querySelector('[data-js-in-page-navigation-wrapper]') !== undefined) {
            document.querySelector('[data-js-in-page-navigation-wrapper]').style.top = this.element.offsetHeight + "px";
            for (var k = this.anchorElements.length - 1; k >= 0; k--) {
                if (this.anchorElements[k].getBoundingClientRect().top <= 50) {
                    this.updateLinks(stickyElement.getElementsByTagName('a')[k]);
                    break;
                }
            }
        }

        if (e.type === "scroll") {
            if (visible === 'false' || visible === false) dropdownMenu.setAttribute('aria-hidden', true);
            this.setWidth();
        } else if (e.type === "click") {
            var anchor = target.getAttribute('href').split("#")[1];

            if (hasClass(e.target, 'f-dropdown-link')) {
                if (visible === 'true' || visible === true) dropdownMenu.setAttribute('aria-hidden', false);
                if (visible === 'false' || visible === false) dropdownMenu.setAttribute('aria-hidden', true);
            } else {
                if (!hasClass(stickyElement, 'f-vertical')) {
                    if (document.querySelector('[data-js-in-page-navigation-wrapper]') !== null && document.querySelector('[data-js-in-page-navigation-wrapper]') !== undefined) {
                        window.scrollTo(0, this.anchorPositions[anchor] - 50);
                    } else {
                        window.scrollTo(0, this.anchorPositions[anchor]);
                    }
                } else {
                    if (document.querySelector('[data-js-in-page-navigation-wrapper]') !== null && document.querySelector('[data-js-in-page-navigation-wrapper]') !== undefined) {
                        if (hasClass(this.element, 'f-dropdown')) {
                            window.scrollTo(0, this.anchorPositions[anchor] - 50);
                        } else {
                            window.scrollTo(0, this.anchorPositions[anchor]);
                        }
                    } else {
                        window.scrollTo(0, this.anchorPositions[anchor]);
                    }
                }
                this.updateLinks(target);
            }
        }
    };

    MWF.InPageNavigation.prototype.updateLinks = function(target) {
        for (var j = 0; j < this.stickyLinks.length; j++) {
            this.stickyLinks[j].blur();
            removeClass(this.stickyLinks[j], 'f-active');
        }
        addClass(target, 'f-active');
        if (hasClass(this.element, 'f-dropdown')) {
            var activeItem = this.element.querySelector('a');
            activeItem.setAttribute('href', target.getAttribute('href'));
            activeItem.innerHTML = target.innerHTML;
        }
    };

    /*
    * Pivot
    */

    MWF.Pivot = function(el) {
        this.element = el;
        this.contentSections = this.element.getElementsByTagName("section");
        this.activePivotHeader = this.element.querySelector(".f-active");
        return this.init();
    };

    MWF.Pivot.prototype.init = function() {
        if (this.activePivotHeader !== null) {
            this.update(document.getElementById(this.activePivotHeader.getAttribute("aria-controls")));

            this.headerElement = this.element.querySelector('header');

            if (window.addEventListener) {
                this.headerElement.addEventListener('click', this, false);
            } else if (window.attachEvent) {
                var that = this;
                this.headerElement.attachEvent('onclick', function() {
                    that.handleEvent.call(that);
                });
            }

            return this;
        }
    };

    MWF.Pivot.prototype.handleEvent = function(e) {
        e = e || window.event;
        e.preventDefault();
        var target = e.target || e.srcElement;

        removeClass(this.activePivotHeader, "f-active");
        addClass(target, "f-active");
        this.activePivotHeader = target;

        this.update(document.getElementById(target.getAttribute("aria-controls")));
    };

    MWF.Pivot.prototype.update = function(target) {
        for (var i = 0; i < this.contentSections.length; i++) {
            var section = this.contentSections[i];
            if (target === section) {
                this.show(section);

            } else {
                this.hide(section);
            }
        }
    };

    MWF.Pivot.prototype.show = function(section) {
        section.setAttribute("aria-hidden", false);
    };

    MWF.Pivot.prototype.hide = function(section) {
        section.setAttribute("aria-hidden", true);
    };

    /*
    * Table
    */

    MWF.Table = function(el) {
        this.element = el;

        this.tableToSort = this.element.querySelector('[data-f-sort="true"]');

        if (this.tableToSort !== null) {
            return this.init();
        }

        return null;
    };

    MWF.Table.prototype.init = function() {
        this.tableCells = [];
        this.thSortable = [];
        this.tableContent = this.tableToSort.querySelectorAll("tbody");

        var rows = this.tableToSort.querySelectorAll("tbody > tr");
        this.rowLength = rows.length;
        var cellLength, cell;
        for (var i = 0; i < this.rowLength; i++) {
            cell = rows[i].cells;
            cellLength = cell.length;
            this.tableCells[i] = [];
            for (var j = 0; j < cellLength; j++) {
                this.tableCells[i][j] = {
                    "html": cell[j].innerHTML,
                    "txt": this.convertToRawVal(cell[j])
                };
            }
        }

        this.thSortable = this.tableToSort.querySelectorAll("thead .f-sortable");
        for (var k = 0; k < this.thSortable.length; k++) {
            var sortButton = this.thSortable[k].querySelector("button");
            addClass(sortButton, 'c-glyph');
            this.thSortable[k].ts = {
                "asc": 1,
                "col": k
            };
            this.attachEvents(sortButton);
        }
    };

    MWF.Table.prototype.attachEvents = function(thClickable) {
        var that = this;
        if (window.addEventListener) {
            thClickable.addEventListener('click', this, false);
        } else if (window.attachEvent) {
            thClickable.attachEvent('onclick', function() {
                that.handleEvent.call(that);
            });
        }
    };

    MWF.Table.prototype.clearArrows = function() {
        for (var l = 0; l < this.thSortable.length; l++) {
            this.thSortable[l].setAttribute('aria-sort', 'none');
            var sortButton = this.thSortable[l].querySelector("button");
            removeClass(sortButton, 'f-descending');
            removeClass(sortButton, 'f-ascending');
        }
    };

    MWF.Table.prototype.handleEvent = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetParent = target.parentElement;
        this.clearArrows();
        this.performSort(targetParent.ts.col, targetParent.ts.asc);

        if (targetParent.ts.asc === 1) {
            targetParent.setAttribute('aria-sort', 'ascending');
            addClass(target, 'f-ascending');
            targetParent.ts.asc = -1;
        } else {
            targetParent.setAttribute('aria-sort', 'descending');
            addClass(target, 'f-descending');
            targetParent.ts.asc = 1;
        }
    };

    MWF.Table.prototype.performSort = function(col, asc) {
        this.tableCells.sort(function(a, b) {
            var retval = 0;
            var aVal = a[col].txt;
            var bVal = b[col].txt;
            var fA = parseFloat(aVal);
            var fB = parseFloat(bVal);
            if (aVal !== bVal) {
                if ((fA === aVal) && (fB === bVal)) {
                    retval = (fA > fB) ? asc : -1 * asc;
                } else {
                    retval = (aVal > bVal) ? asc : -1 * asc;
                }
            }
            return retval;
        });

        this.rebuildTable();
    };

    MWF.Table.prototype.rebuildTable = function() {
        for (var rowidx = 0; rowidx < this.rowLength; rowidx++) {
            for (var colidx = 0; colidx < this.tableCells[rowidx].length; colidx++) {
                this.tableContent[0].rows[rowidx].cells[colidx].innerHTML = this.tableCells[rowidx][colidx].html;
            }
        }
    };

    MWF.Table.prototype.convertToRawVal = function(content) {
        var retVal;

        //Find numerical values and strip everything except the int
        if (hasClass(content, "f-numerical")) {

            //set free item to 0
            if (content.querySelectorAll('[content="0.00"]').length > 0) {
                retVal = 0;
            } else {
                var regx = /\d+|\.\d{0,2}|\,\d{0,2}$/g;
                var str = this.extractRawValue(content);
                var intVal;
                var intArr = [];
                while ((intVal = regx.exec(str)) !== null) {
                    intArr.push(intVal);
                }
                retVal = intArr.join("");
            }

        } else if (content === ' ') {
            //Put empty cells on top or bottom
            retVal = -1;

        } else {
            //Not a numerical value or empty, return full raw string
            retVal = this.extractRawValue(content);
        }

        return retVal;
    };

    MWF.Table.prototype.extractRawValue = function(content) {
        return content.textContent || content.innerText;
    };

    /*
    * Toggle
    */

    MWF.Toggle = function(el) {
        this.element = el;
        return this.init();
    };

    MWF.Toggle.prototype.setChecked = function() {
        this.toggleButton.setAttribute('aria-checked', 'true');
        this.checkedIndicator.innerHTML = this.checkedString;
    };

    MWF.Toggle.prototype.setUnchecked = function() {
        this.toggleButton.setAttribute('aria-checked', 'false');
        this.checkedIndicator.innerHTML = this.uncheckedString;
    };

    MWF.Toggle.prototype.isChecked = function() {
        return this.toggleButton.getAttribute('aria-checked') == 'true';
    };

    MWF.Toggle.prototype.isDisabled = function() {
        return this.toggleButton.hasAttribute("disabled");
    };

    MWF.Toggle.prototype.setDisabled = function() {
        addClass(this.element, "f-disabled");
    };

    MWF.Toggle.prototype.setEnabled = function() {
        removeClass(this.element, "f-disabled");
        this.checkedIndicator.addEventListener('click', this, false);
    };

    MWF.Toggle.prototype.init = function() {
        this.toggleButton = this.element.querySelector("button");
        this.checkedIndicator = this.element.querySelector("button + span");
        this.checkedString = this.checkedIndicator.getAttribute("data-on-string");
        this.uncheckedString = this.checkedIndicator.getAttribute("data-off-string");

        if (this.isDisabled()) {
            this.setDisabled();
        }
        else {
            this.setEnabled();
        }

        if (this.isChecked()) {
            this.checkedIndicator.innerHTML = this.checkedString;
        }
        else {
            this.checkedIndicator.innerHTML = this.uncheckedString;
        }

        if (window.addEventListener) {
            this.toggleButton.addEventListener('click', this, false);
            //this.checkedIndicator.addEventListener('click', this, false);

        } else if (window.attachEvent) {
            var that = this;
            this.toggleButton.attachEvent('onclick', function() {
                that.handleEvent.call(that);
            });
            this.checkedIndicator.attachEvent('onclick', function() {
                that.handleEvent.call(that);
            });
        }
        return this;
    };

    MWF.Toggle.prototype.handleEvent = function(e) {
        if (!this.isChecked()) {
            this.setChecked();
        }
        else {
            this.setUnchecked();
        }
    };

    /*
    * ToolTip
    */

    MWF.Tooltip = function(el) {
        this.element = el;

        return this.init();
    };

    MWF.Tooltip.prototype.init = function() {
        this.controller = document.querySelector("[aria-describedby=" + this.element.getAttribute('id') + "]");
        this.isVisible = false;
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);

        if (window.addEventListener) {
            this.controller.addEventListener('mouseover', this, false);

        } else if (window.attachEvent) {
            var that = this;

            this.controller.attachEvent('onmouseover', function() {
                that.handleEvent.call(that);
            });
        }

        return this;
    };

    MWF.Tooltip.prototype.handleEvent = function(e) {
        e = e || window.event;

        if (e.type === "mouseover") {
            this.timer = window.setTimeout(this.show, 800);

            if (window.addEventListener) {
                this.controller.addEventListener('mouseout', this, false);
                document.addEventListener('mousemove', this, false);
            } else if (window.attachEvent) {
                var that = this;

                this.controller.attachEvent('onmouseout', function() {
                    that.handleEvent.call(that);
                });
                this.controller.attachEvent('onmousmove', function() {
                    that.handleEvent.call(that);
                });
            }
        }
        else if (e.type === "mouseout") {
            if (this.timer) {
                window.clearTimeout(this.timer);
                this.timer = null;
            }
            this.hide();
        }
        else if (e.type === "mousemove") {
            this.xPosition = e.x;
            this.yPosition = e.y;

            if (this.isVisible) {
                this.setTooltipToMousePosition();
            }
        }
    };

    MWF.Tooltip.prototype.setTooltipToMousePosition = function() {
        this.element.style.left = this.xPosition + 'px';
        this.element.style.top = this.yPosition + 'px';
    };

    MWF.Tooltip.prototype.show = function() {
        this.isVisible = true;
        this.setTooltipToMousePosition();
        this.element.setAttribute('aria-hidden', 'false');
    };

    MWF.Tooltip.prototype.hide = function() {
        this.isVisible = false;
        this.element.setAttribute('aria-hidden', 'true');

        if (window.removeEventListener) {
            document.removeEventListener('mousemove', this, false);
        } else if (window.detachEvent) {
            var that = this;
            document.detachEvent('onmousemove', function() {
                that.handleEvent.call(that);
            });
        }
    };

    /*
    * Checkbox
    */

    MWF.Checkbox = function(el) {
        this.element = el;
        return this.init();
    };

    MWF.Checkbox.prototype.init = function() {
        if (window.addEventListener) {
            window.addEventListener("load", function() {
                setIndeterminateCheckboxes();
            });
        }
        else if (window.attachEvent) {
            window.attachEvent("onload", function() {
                setIndeterminateCheckboxes();
            });
        }
    };

    function setIndeterminateCheckboxes() {
        var indeterminateCheckboxes = document.querySelectorAll('[data-js-checkbox="indeterminate"]');
        for (var i = 0; i < indeterminateCheckboxes.length; i++) {
            indeterminateCheckboxes[i].indeterminate = true;
        }
    }

} (window.MWF = window.MWF || {}));