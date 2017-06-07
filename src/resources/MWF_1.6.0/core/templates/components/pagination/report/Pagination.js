import {hasClass, addClass, removeClass} from '../../../helpers.js';

let Pagination = function(el) {
    this.element = el;
    return this.init();
};

Pagination.prototype.init = function () {
    this.activeItem = this.element.querySelector('.f-active');
    this.activeItem.activeLink = document.createElement('a');

    //this attribute would eventually set by some outside system that preserves the url on the current page
    this.activeItem.activeLink.setAttribute('href', '#');
    this.activeItem.activeLink.innerHTML = this.activeItem.firstChild.innerHTML;
    this.activeItem.activeLink.setAttribute('aria-label', this.activeItem.getAttribute('data-label'));

    var buttons = this.element.querySelectorAll('.c-glyph');
    this.previousButtonLink = buttons[0];
    this.nextButtonLink = buttons[1];

    this.updateButtonViews(this.activeItem);

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

Pagination.prototype.handleEvent = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (!hasClass(target, 'c-glyph')) {
        var listItem = target.parentNode;

        this.updateButtonViews(listItem);

        if (!hasClass(listItem, 'f-active')) {

            //swap labels of active
            var dataLabel = this.activeItem.firstChild.getAttribute('aria-label');
            this.activeItem.setAttribute('data-label', this.activeItem.firstChild.getAttribute('aria-label'));
            this.activeItem.innerHTML = this.activeItem.activeLink.outerHTML;
            removeClass(this.activeItem, 'f-active');

            //swap current selected item labels and inject span
            var ariaLabel = listItem.getAttribute('data-label');
            var listItemSpan = document.createElement('span');

            listItem.setAttribute('data-label', listItem.firstChild.getAttribute('aria-label'));
            listItemSpan.setAttribute('aria-label', ariaLabel);
            listItemSpan.innerHTML = listItem.firstChild.innerHTML;

            listItem.activeLink = listItem.firstChild;
            listItem.innerHTML = "";
            listItem.appendChild(listItemSpan);

            addClass(listItem, 'f-active');
            this.activeItem = listItem;
        }
    }
};

Pagination.prototype.isFirstPage = function (el) {
    return (el === this.element.children[1]);
};

Pagination.prototype.isLastPage = function (el) {
    return (el === this.element.children[this.element.children.length - 2]);
};

Pagination.prototype.updateButtonViews = function (el) {
    if (this.isFirstPage(el)) {
        addClass(this.previousButtonLink.parentElement, 'f-hide');
    } else {
        removeClass(this.previousButtonLink.parentElement, 'f-hide');
    }

    if (this.isLastPage(el)) {
        addClass(this.nextButtonLink.parentElement, 'f-hide');
    } else {
        removeClass(this.nextButtonLink.parentElement, 'f-hide');
    }
};

export default Pagination;