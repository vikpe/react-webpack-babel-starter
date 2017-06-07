// This is a module ONLY js file for the Product Placement module
// The module is located in /core/templates/modules/product-placement
// Task # 7690437 is active to track any future js needs for modules and refactor

import {getClientRect} from '../../../helpers.js';

let ProductPlacement = function(el) {
    this.element = el;

    return this.init();
};

ProductPlacement.prototype.init = function() {
    this.seeAll = this.element.querySelector('[class^="c-heading"] .c-hyperlink[aria-label]');
    this.container = this.element.querySelector('.c-carousel');
    this.carousel = this.element.querySelector('.c-carousel ul');

    var that = this;
    if (window.addEventListener) {
        window.addEventListener('resize', function() {
            that.handleResize();
        }, true);
    } else if (window.attachEvent) {
        window.attachEvent('onresize', function() {
            that.handleResize();
        });
    }
    this.handleResize();
    return this;
};

ProductPlacement.prototype.handleResize = function() {
    var containerWidth = getClientRect(this.container);
    var carouselWidth = getClientRect(this.carousel);
    if( carouselWidth.width < containerWidth.width ) {
        this.seeAll.setAttribute('aria-hidden','true');
    } else {
        this.seeAll.removeAttribute('aria-hidden');
    }
};

export default ProductPlacement;