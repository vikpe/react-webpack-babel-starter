import {hasClass} from '../../../helpers.js';

let AutoSuggest = function(el) {
    this.element = el;

    return this.init();
};

AutoSuggest.prototype.init = function() {
    var that = this;
    this.id = this.element.getAttribute('id');
    this.input = document.querySelector('[aria-controls=' + this.id + ']');
    this.menu = this.element.querySelector('ul');
    this.noResults = this.element.querySelector('ul.f-auto-suggest-no-results');
    this.matched = false;

    if (window.addEventListener) {
        this.input.addEventListener('focus', this, true);

        document.addEventListener('click', function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = that.element.contains(target);
            if (!isClickInside) {
                if (target !== this.menu) {
                    if (parent !== this.menu) {
                        that.menu.setAttribute('aria-hidden', 'true');
                    }
                }
            }
        });
    } else if (window.attachEvent){
        this.input.attachEvent('onfocus', function() {
            that.handleEvent.call(that);
        });

        document.attachEvent('onclick', function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = that.element.contains(target);
            if (!isClickInside) {
                if (target !== this.menu) {
                    if (parent !== this.menu) {
                        that.menu.setAttribute('aria-hidden', 'true');
                    }
                }
            }
        });
    }

    return this;
};

AutoSuggest.prototype.handleEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    this.keypress(target);
};

AutoSuggest.prototype.keypress = function(target) {
    var currentMenu = this.menu;
    var noResults = this.noResults;
    var currentTarget = target;
    var inputTextValue;

    currentTarget.onkeyup = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        inputTextValue = target.value;

        if (inputTextValue === ''){
            noResults.setAttribute('aria-hidden', 'true');
            AutoSuggest.prototype.hide(currentMenu, inputTextValue);
        }
        else {
            if (AutoSuggest.prototype.contains(currentMenu, inputTextValue)){
                currentMenu.setAttribute('aria-hidden', 'true');
                noResults.setAttribute('aria-hidden', 'true');
                AutoSuggest.prototype.show(currentMenu, inputTextValue);
            }
            else {
                currentMenu.setAttribute('aria-hidden', 'true');
                noResults.setAttribute('aria-hidden', 'false');
            }
        }
    };
};

AutoSuggest.prototype.contains = function(menu, val) {
    this.menu = menu;
    var autoCompleteOptions = this.menu.querySelectorAll('span, a');

    for (var i=0; i < autoCompleteOptions.length; i++){
        var string = autoCompleteOptions[i].innerText;

        for (var j=0; j < string.length; j++){
            var res = string.split(val);

            if (res[0] === ''){
                return true;
            }
        }
    }
};

AutoSuggest.prototype.show = function(menu, val) {
    this.menu = menu;
    this.menu.setAttribute('aria-hidden', 'false');
    var autoCompleteOptions = this.menu.querySelectorAll('span, a');
    var itemScrollCount = 5;

    for (var i=0; i < autoCompleteOptions.length; i++){
        var string = autoCompleteOptions[i].innerText;

        if (autoCompleteOptions.length >= itemScrollCount){
            if(hasClass(this.menu, 'f-auto-suggest-scroll')){
                var maxHeight = 0;

                for (var l=0; l < itemScrollCount; l++){
                    maxHeight += autoCompleteOptions[i].offsetHeight;
                }
                this.menu.style.maxHeight = maxHeight + 'px';
            }
        }

        for (var j=0; j < string.length; j++){
            var result = string.split(val);

            if (result[0] === ''){
                this.matched = true;
                autoCompleteOptions[i].innerHTML = "<strong>" + val + "</strong>" + result[1];
            }
        }
    }
};

AutoSuggest.prototype.hide = function(menu, val) {
    this.menu = menu;
    this.matched = false;
    var autoCompleteOptions = this.menu.querySelectorAll('span');

    for (var i=0; i < autoCompleteOptions.length; i++){
        autoCompleteOptions[i].innerHTML= autoCompleteOptions[i].innerText;
    }
    this.menu.setAttribute('aria-hidden', 'true');
};

export default AutoSuggest;