import {addClass, removeClass, hasClass, getClientRect, getWindowWidth} from '../../../helpers.js';

let InPageNavigation = function(el) {
    this.element = el;

    return this.init();
};

InPageNavigation.prototype.init = function() {
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

InPageNavigation.prototype.resize = function() {
    this.checkCollapse();
    this.setWidth(true);
    this.setOffsetTop();
    this.setAnchorPositions();
};

InPageNavigation.prototype.checkCollapse = function() {
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

InPageNavigation.prototype.convertMenu = function(format) {
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

InPageNavigation.prototype.setOffsetTop = function() {
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

InPageNavigation.prototype.getAnchorElements = function() {
    this.anchorElements = [];
    var anchors = this.element.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
        var tempId = anchors[i].getAttribute('href').split("#")[1];
        this.anchorElements.push(document.getElementById(tempId));
    }
    return this.anchorElements;
};

InPageNavigation.prototype.setAnchorPositions = function() {
    this.anchorElements = this.getAnchorElements();
    this.anchorPositions = [];
    for (var l = 0; l < this.anchorElements.length; l++) {
        this.anchorPositions[this.anchorElements[l].id] = getClientRect(this.anchorElements[l]).top - getClientRect(document.body).top;
    }
};

InPageNavigation.prototype.setStickyLinks = function() {
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

InPageNavigation.prototype.setWidth = function(resize) {
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

InPageNavigation.prototype.attachEvents = function(i, dropdownLink) {
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

InPageNavigation.prototype.handleEvent = function(e) {
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

InPageNavigation.prototype.updateLinks = function(target) {
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

export default InPageNavigation;