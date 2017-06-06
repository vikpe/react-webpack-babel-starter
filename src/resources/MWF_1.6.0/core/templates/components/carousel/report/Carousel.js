import {hasClass, addClass, removeClass, getClientRect} from '../../../helpers.js';

let Carousel = function(el) {
    this.element = el;
    return this.init();
};

Carousel.prototype.init = function() {

    /*
    * Use .f-previous and .f-next
    * .f-left and f-left deprecated v1.3.0
    */

    this.previousButton = this.element.querySelector('.c-flipper.f-previous');
    if (this.previousButton === null) {
        this.previousButton = this.element.querySelector('.c-flipper.f-left');
    }
    this.nextButton = this.element.querySelector('.c-flipper.f-next');
    if (this.nextButton === null) {
        this.nextButton = this.element.querySelector('.c-flipper.f-right');
    }
    this.activeIndex = null;
    this.slides = [];
    this.multiSlide = hasClass(this.element, 'f-multi-slide');
    this.sequenceIndicators = null;
    this.singleSlideWidth = null;
    this.touchManager = null;
    this.primaryDirection = document.querySelector('html').getAttribute('dir').toLowerCase() === 'rtl' ? 'right' : 'left';
    this.itemsContainer = this.element.querySelector('.c-group');

    if (this.multiSlide) {
        var children = this.element.querySelectorAll('ul > li');

        for (var i = 0, ii = children.length; i < ii; i++) {
            var item = children[i];
            this.slides.push(item);

            if (hasClass(item, 'f-active')) {
                this.activeIndex = this.slides.length - 1;
            }
        }
    } else {
        this.activeIndex = 0;
        this.slides[this.activeIndex] = this.element.querySelector('ul');
    }


    if (this.slides[this.activeIndex].hasAttribute('data-f-theme')) {
        addClass(this.element, 'theme-' + this.slides[this.activeIndex].getAttribute('data-f-theme'));
    }

    // Configure options specific to carousel type
    if (this.multiSlide) {
        this.sequenceIndicators = this.element.querySelectorAll('.c-sequence-indicator button');
    } else {
        this.singleSlideWidth = this.slides[this.activeIndex].clientWidth;
    }

    // Show flippers if necessary
    if (this.isScrollablePrevious()) {
        this.showPreviousFlipper();
    }

    if (this.isScrollableNext()) {
        this.showNextFlipper();
    }

    // Bind events
    var that = this;
    var handleTouchEvent = function(e) {
        that.handleEvent.call(that, e);
    };

    var handleIeEvent = function() {
        that.handleEvent.call(that);
    };

    if (typeof Hammer !== 'undefined') {
        this.touchManager = new Hammer(this.element);
        this.touchManager.on("swipeleft", handleTouchEvent);
        this.touchManager.on("swiperight", handleTouchEvent);
    }

    if (window.addEventListener) {
        this.previousButton.addEventListener('click', this, false);
        this.nextButton.addEventListener('click', this, false);
        window.addEventListener('resize', function() {
            that.handleResize();
        }, true);

        if (this.multiSlide) {
            for (var j = 0, jj = this.sequenceIndicators.length; j < jj; j++) {
                this.sequenceIndicators[j].addEventListener('click', this, false);
            }
        }
    } else if (window.attachEvent){
        this.previousButton.attachEvent('onclick', handleIeEvent);
        this.nextButton.attachEvent('onclick', handleIeEvent);
        window.attachEvent('onresize', function() {
            that.handleResize();
        });

        if (this.multiSlide) {
            for (var k = 0, kk = this.sequenceIndicators.length; k < kk; k++) {
                this.sequenceIndicators[k].attachEvent('onclick', handleIeEvent);
            }
        }
    }
    this.handleResize();

    return this;
};

Carousel.prototype.handleEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var type = e.type;
    var swipeLeft = this.primaryDirection === 'left' ? 'swipeleft' : 'swiperight';
    var swipeRight = this.primaryDirection === 'left' ? 'swiperight' : 'swipeleft';

    if (target === this.previousButton || type === swipeRight) {
        if (this.multiSlide) {
            this.previousSlide();
        } else {
            this.scrollPrevious();
        }
    } else if (target === this.nextButton || type === swipeLeft) {
        if(this.multiSlide) {
            this.nextSlide();
        } else {
            this.scrollNext();
        }
    } else if (hasClass(target.parentNode, 'c-sequence-indicator')) {
        var id = target.getAttribute("aria-controls");

        for (var i = 0, ii = this.slides.length; i < ii; i++) {
            if (id === this.slides[i].getAttribute('id')) {
                this.setActiveSlide(i);
            }
        }
    }
};

Carousel.prototype.handleResize = function() {
    if(!this.itemsContainer){
        return;
    }
    var containerWidth = getClientRect(this.element);
    var carouselWidth = getClientRect(this.itemsContainer);
    if( carouselWidth.width < containerWidth.width ) {
        this.disableScrollableNext();
        this.disableScrollablePrevious();
    } else {
        if (this.isScrollableNext()) {
            this.showNextFlipper();
        }

        if (this.isScrollableNext()) {
            this.showNextFlipper();
        }
    }
};

Carousel.prototype.isScrollablePrevious = function() {
    if (this.multiSlide) {
        return true;
    } else {
        var offset = this.slides[this.activeIndex].style[this.primaryDirection];

        if (offset === "0" || offset === "" || offset === "0px") {
            return false;
        } else {
            return true;
        }
    }
};

Carousel.prototype.isScrollableNext = function() {
    if (this.multiSlide) {
        return true;
    } else {
        var offset = parseInt(this.slides[this.activeIndex].style[this.primaryDirection], 10);
        var carouselWidth = this.element.clientWidth;
        var itemSize = this.getScrollItemSize();

        if (isNaN(offset)) {
            offset = 0;
        }

        if ((carouselWidth + Math.abs(offset) + itemSize.gutter) >= this.singleSlideWidth) {
            return false;
        } else {
            return true;
        }
    }
};

Carousel.prototype.showPreviousFlipper = function() {
    addClass(this.element, 'f-scrollable-previous');
};

Carousel.prototype.showNextFlipper = function() {
    addClass(this.element, 'f-scrollable-next');
};

Carousel.prototype.disableScrollablePrevious = function() {
    removeClass(this.element, 'f-scrollable-previous');
};

Carousel.prototype.disableScrollableNext = function() {
    removeClass(this.element, 'f-scrollable-next');
};

// Multi-slide functions
Carousel.prototype.setActiveSlide = function(index, direction) {
    // Remove active class from current slide
    removeClass(this.slides[this.activeIndex], 'f-active');
    // Remove checked status from sequence indicator
    this.sequenceIndicators[this.activeIndex].setAttribute("aria-checked", "false");
    // remove animation classes

    removeClass(this.slides[this.activeIndex], 'f-animate-next');
    removeClass(this.slides[this.activeIndex], 'f-animate-previous');

    // Remove theme classes if there are any
    if (hasClass(this.element, 'theme-light')) {
        removeClass(this.element, 'theme-light');
    }

    if (hasClass(this.element, 'theme-dark')) {
        removeClass(this.element, 'theme-dark');
    }

    // Add active class to incoming slide
    addClass(this.slides[index], 'f-active');
    // Add checked state to sequence indicator
    this.sequenceIndicators[index].setAttribute("aria-checked", "true");
    // Add theme class if there is one
    if (this.slides[index].hasAttribute('data-f-theme')) {
        addClass(this.element, 'theme-' + this.slides[index].getAttribute('data-f-theme'));
    }

    if (direction === 'next') {
        addClass(this.slides[index], 'f-animate-next');
    } else {
        addClass(this.slides[index], 'f-animate-previous');
    }

    this.activeIndex = index;

    if (this.isScrollableNext()) {
        if (!hasClass('f-scrollable-next')) {
            this.showNextFlipper();
        }
    } else {
        this.disableScrollableNext();
    }

    if (this.isScrollablePrevious()) {
        if (!hasClass('f-scrollable-previous')) {
            this.showPreviousFlipper();
        }
    } else {
        this.disableScrollablePrevious();
    }
};

Carousel.prototype.nextSlide = function() {
    var nextIndex = this.activeIndex + 1;

    if (nextIndex >= this.slides.length) {
        nextIndex = 0;
    }

    this.setActiveSlide(nextIndex, 'next');

    return true;
};

Carousel.prototype.previousSlide = function() {
    var previousIndex = this.activeIndex - 1;

    if (previousIndex < 0) {
        previousIndex = this.slides.length - 1;
    }

    this.setActiveSlide(previousIndex, 'previous');

    return true;
};

Carousel.prototype.getScrollItemSize = function() {
    var child = this.slides[this.activeIndex].querySelector('li > *'),
        childStyles = child.currentStyle || window.getComputedStyle(child);

    return {
        width: child.offsetWidth,
        gutter: this.primaryDirection === 'left' ? parseInt(childStyles.marginRight, 10) : parseInt(childStyles.marginLeft, 10)
    };
};
// Single Slide functions
Carousel.prototype.scrollNext = function() {
    var currentOffset = parseInt(this.slides[this.activeIndex].style[this.primaryDirection], 10),
        itemDimensions = this.getScrollItemSize(),
        maxScrollCount = Math.floor(this.element.clientWidth / (itemDimensions.width + itemDimensions.gutter)),
        maxScrollDistance = null;

    if (isNaN(currentOffset)) {
        currentOffset = 0;
    }

    if (maxScrollCount === 0) {
        // We should always ensure that this is at least one. Otherwise,
        // if the content is wider then the container, it won't scroll at all
        maxScrollCount = 1;
    }
        // If we can fit exactly a number in a set, we should subtract one element so the last element becomes the first
    maxScrollCount = (this.element.clientWidth % (itemDimensions.width + itemDimensions.gutter)) === 0 ? maxScrollCount - 1 : maxScrollCount;
    maxScrollDistance = maxScrollCount * (itemDimensions.width + itemDimensions.gutter);
    var distanceToEdge = this.singleSlideWidth - this.element.clientWidth + currentOffset;
    // if we can scroll the distance of elements * scrollcount without going past the edge, we should

    if (maxScrollDistance <= distanceToEdge) {
        this.slides[this.activeIndex].style[this.primaryDirection] = ((maxScrollDistance * -1 ) + currentOffset) + "px";
    } else {
        this.slides[this.activeIndex].style[this.primaryDirection] = ((distanceToEdge * -1) + currentOffset + itemDimensions.gutter) + "px";
    }

    if (this.isScrollableNext()) {
        if (!hasClass('f-scrollable-next')) {
            this.showNextFlipper();
        }
    } else {
        this.disableScrollableNext();
    }

    if (this.isScrollablePrevious()) {
        if (!hasClass('f-scrollable-previous')) {
            this.showPreviousFlipper();
        }
    } else {
        this.disableScrollablePrevious();
    }
};

Carousel.prototype.scrollPrevious = function() {
    var currentOffset = parseInt(this.slides[this.activeIndex].style[this.primaryDirection], 10),
        itemDimensions = this.getScrollItemSize(),
        maxScrollCount = Math.floor(this.element.clientWidth / (itemDimensions.width + itemDimensions.gutter)),
        maxScrollDistance = null;

    if (isNaN(currentOffset)) {
        currentOffset = 0;
    }

    if (maxScrollCount === 0) {
        // We should always ensure that this is at least one. Otherwise,
        // if the content is wider then the container, it won't scroll at all
        maxScrollCount = 1;
    }

    // If we can fit exactly a number in a set, we should subtract one element so the last element becomes the first
    maxScrollCount = (this.element.clientWidth % (itemDimensions.width + itemDimensions.gutter)) === 0 ? maxScrollCount - 1 : maxScrollCount;
    maxScrollDistance = maxScrollCount * (itemDimensions.width + itemDimensions.gutter);
    var distanceToEdge = Math.abs(currentOffset);
    // if we can scroll the distance of elements * scrollcount without going past the edge, we should

    if (maxScrollDistance <= distanceToEdge) {
        this.slides[this.activeIndex].style[this.primaryDirection] = (maxScrollDistance + currentOffset) + "px";
    } else {
        this.slides[this.activeIndex].style[this.primaryDirection] = (distanceToEdge + currentOffset) + "px";
    }

    if (this.isScrollableNext()) {
        if (!hasClass('f-scrollable-next')) {
            this.showNextFlipper();
        }
    } else {
        this.disableScrollableNext();
    }

    if (this.isScrollablePrevious()) {
        if (!hasClass('f-scrollable-previous')) {
            this.showPreviousFlipper();
        }
    } else {
        this.disableScrollablePrevious();
    }
};

export default Carousel;