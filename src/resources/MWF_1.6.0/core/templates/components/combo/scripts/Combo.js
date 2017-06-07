let Combo = function(el) {
    this.element = el;

    return this.init();
};

Combo.prototype.init = function() {
    this.input = this.element.querySelector('input');
    this.button = this.element.querySelector('button');
    this.menu = this.element.querySelector('ul');
    this.listItems = this.menu.querySelectorAll('span, a');
    this.matched = false;
    this.changeCallback = [];

    if (window.addEventListener) {
        var that = this;
        this.input.addEventListener('focus', this, true);
        this.input.addEventListener('keydown', this, true);
        this.input.addEventListener('blur', this, true);
        this.input.addEventListener('click', this, true);
        this.button.addEventListener('click', this, true);

        for (var i = 0; i < this.listItems.length; i++) {
            this.listItems[i].addEventListener('mousedown', this, true);
            this.listItems[i].addEventListener('keyup', this, true);
            if (this.listItems.length - 1 === i) {
                this.listItems[i].addEventListener('blur', this, true);
            }
        }

        document.addEventListener('click', function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = that.element.contains(target);
            if (!isClickInside) {
                if (target !== this.menu) {
                    if (parent !== this.menu) {
                        that.menu.setAttribute('aria-hidden', 'true');
                        that.input.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });

    } else if (window.attachEvent){
        var handleEvent = function() {
            that.handleEvent.call(that);
        };
        this.input.attachEvent('onfocus', handleEvent);
        this.input.attachEvent('onkeydown', handleEvent);
        this.input.attachEvent('onblur', handleEvent);
        this.input.attachEvent('onclick', handleEvent);
        this.button.attachEvent('onclick', handleEvent);

        for (var j = 0; j < this.listItems.length; j++) {
            this.listItems[j].attachEvent('onmousedown', handleEvent);
            this.listItems[j].attachEvent('onkeyup', handleEvent);
            if (this.listItems.length - 1 === j) {
                this.listItems[j].attachEvent('blur', handleEvent);
            }
        }

        document.attachEvent('onclick', function(e) {
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var isClickInside = that.element.contains(target);
            if (!isClickInside) {
                if (target !== this.menu) {
                    if (parent !== this.menu) {
                        that.menu.setAttribute('aria-hidden', 'true');
                        that.input.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    }
    return this;
};

Combo.prototype.handleEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (e.type === 'blur') {
        this.onblur(e, target);
    } else if (e.type === 'focus' || e.type === 'keydown') {
        this.keydown(e, target);
    } else if (e.type === 'click') {
        this.onclick(e, target);
    } else if (e.type === 'mousedown') {
        this.onmousedown(target);
    } else if (e.type === 'keyup') {
        this.onkeyup(e, target);
    }
};

Combo.prototype.onclick = function(e, target) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    var menu = this.menu;
    var input = this.input;
    var listItems = this.listItems;
    var inputTextValue = target.value;

    if (menu.getAttribute('aria-hidden') === 'true') {
        menu.setAttribute('aria-hidden', 'false');
        input.setAttribute('aria-expanded', 'true');
        this.show(menu, listItems, inputTextValue);
    } else {
        menu.setAttribute('aria-hidden', 'true');
        input.setAttribute('aria-expanded', 'false');
        this.hide(menu, listItems);
    }
};

Combo.prototype.onmousedown = function(target) {
    var menu = this.menu;
    var listItems = this.listItems;

    this.setActive(menu, listItems, target);
    this.input.value = this.getActive(listItems);
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('aria-expanded', 'false');
    this.hide(menu, listItems);
    this.executeCallback();
};

Combo.prototype.onblur = function(e) {
    var currentMenu = this.menu;
    var input = this.input;
    var listItems = this.listItems;

    currentMenu.setAttribute('aria-hidden', 'true');
    input.setAttribute('aria-expanded', 'false');
    this.hide(currentMenu, listItems);
    this.executeCallback();
};

Combo.prototype.onkeyup = function(event, target) {
    var currentMenu = this.menu;
    var listItems = this.listItems;
    var key = event.which || event.keyCode || event.charCode;

    if (key === 9) {
        this.setActive(currentMenu, listItems, target);
    } else if (key === 13) {
        this.input.value = this.getActive(listItems);
        this.hide(currentMenu, listItems);
    }
};

Combo.prototype.keydown = function(event, target) {
    var that = this;
    var currentMenu = this.menu;
    var listItems = this.listItems;
    var currentTarget = target;
    var inputTextValue;
    var showMenu = true;
    var key = event.which || event.keyCode || event.charCode;
    var activeItem;

    if (key === 13) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        activeItem = this.getActive(listItems);

        if (activeItem !== undefined) {
            this.input.value = this.getActive(listItems);
        }

        this.hide(currentMenu, listItems);
        showMenu = false;
        this.executeCallback();
    } else {
        showMenu = true;
    }

    currentTarget.onkeyup = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        inputTextValue = target.value;

        if (that.input.value === '') {
            showMenu = false;
            that.hide(currentMenu, listItems);
        }

        if (showMenu === true) {
            that.show(currentMenu, listItems, inputTextValue);
        }
    };
};

Combo.prototype.setActive = function(menu, listItems, item) {
    this.menu = menu;
    this.listItems = listItems;
    var activeItem = item;
    var activeItemOffsetTop;

    for (var i = 0; i < listItems.length; i++) {
        if (listItems[i] !== activeItem && listItems[i].className === 'active') {
            listItems[i].className = '';
            break;
        }
    }

    if (activeItem !== undefined) {
        activeItem.className = 'active';
        activeItemOffsetTop = activeItem.offsetTop;
        this.menu.scrollTop = activeItemOffsetTop;
    }

};

Combo.prototype.getActive = function(listItems) {
    for (var i = 0; i < listItems.length; i++) {
        if (listItems[i].className === 'active') {
            return listItems[i].innerHTML;
        }
    }
};

Combo.prototype.show = function(menu, listItems, val) {
    this.menu = menu;
    this.menu.setAttribute('aria-hidden', 'false');
    this.input.setAttribute('aria-expanded', 'true');
    this.listItems = listItems;
    var itemScrollCount = 5;

    for (var i=0; i < listItems.length; i++){
        var string = listItems[i].innerText;
        var substring = '';
        if (val !== undefined) {
            substring = string.slice(0, val.length);
        }

        if (listItems.length >= itemScrollCount){
            var maxHeight = 0;

            for (var l=0; l < itemScrollCount; l++){
                maxHeight += listItems[i].offsetHeight;
            }
            this.menu.style.maxHeight = maxHeight + 'px';
        }

        if (substring === val && substring !== '') {
            this.setActive(menu, listItems, listItems[i]);
            break;
        } else {
            this.setActive(menu, listItems, undefined);
        }
    }
};

Combo.prototype.hide = function(menu, listItems) {
    this.menu = menu;
    this.listItems = listItems;

    this.setActive(menu, listItems, undefined);
    this.menu.setAttribute('aria-hidden', 'true');
    this.input.setAttribute('aria-expanded', 'false');
};

Combo.prototype.registerCallback = function (callback, options, callbackObj) {
    this.changeCallback.push({
        options: options,
        callback: callback,
        callbackObj: callbackObj
    });
};

Combo.prototype.executeCallback = function () {
    if (this.changeCallback.length > 0) {
        for (var i = 0; i < this.changeCallback.length; i++) {
            if (typeof this.changeCallback[i].callback === "function") {
                this.changeCallback[i].callback.call(this.changeCallback[i].callbackObj, this.changeCallback[i].options);
            }
        }
    }
};

export default Combo;