
let RefineItem = function(el) {
    this.element = el;

    return this.init();
};

RefineItem.prototype.init = function() {
    this.isRadio = this.element.getAttribute('role') === 'radio';

    if (this.isSelected()) {
        this.select();
    } else {
        this.deselect();
    }

    // Attach window listener
    if (window.addEventListener) {
        this.element.addEventListener('click', this, false);
    } else if (window.attachEvent){
        var that = this;
        this.element.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }

    return this;
};

RefineItem.prototype.handleEvent = function(e) {
    if (this.isSelected()) {
        this.deselect();
    } else {
        this.select();
    }
};

RefineItem.prototype.isSelected = function() {
    if (this.isRadio) {
        return this.element.getAttribute('aria-checked') === 'true';
    } else {
        return this.element.getAttribute('aria-selected') === 'true';
    }
};

RefineItem.prototype.select = function() {
    if (this.isRadio) {
        this.element.setAttribute('aria-checked', 'true');
    } else {
        this.element.setAttribute('aria-selected', 'true');
    }
};

RefineItem.prototype.deselect = function() {
    if (this.isRadio) {
        this.element.setAttribute('aria-checked', 'false');
    } else {
        this.element.setAttribute('aria-selected', 'false');
    }
};

export default RefineItem;