
import {addClass, removeClass} from '../../../helpers.js';

let Toggle = function(el) {
    this.element = el;
    return this.init();
};

Toggle.prototype.setChecked = function() {
    this.toggleButton.setAttribute('aria-checked', 'true');
    this.checkedIndicator.innerHTML = this.checkedString;
};

Toggle.prototype.setUnchecked = function() {
    this.toggleButton.setAttribute('aria-checked', 'false');
    this.checkedIndicator.innerHTML = this.uncheckedString;
};

Toggle.prototype.isChecked = function() {
    return this.toggleButton.getAttribute('aria-checked') == 'true';
};

Toggle.prototype.isDisabled = function() {
    return this.toggleButton.hasAttribute("disabled");
};

Toggle.prototype.setDisabled = function() {
    addClass(this.element, "f-disabled");
};

Toggle.prototype.setEnabled = function() {
    removeClass(this.element, "f-disabled");
    this.checkedIndicator.addEventListener('click', this, false);
};

Toggle.prototype.init = function() {
    this.toggleButton = this.element.querySelector("button");
    this.checkedIndicator = this.element.querySelector("button + span");
    this.checkedString = this.checkedIndicator.getAttribute("data-on-string");
    this.uncheckedString = this.checkedIndicator.getAttribute("data-off-string");

    if (this.isDisabled()){
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

    } else if (window.attachEvent){
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

Toggle.prototype.handleEvent = function(e) {
    if (!this.isChecked()) {
        this.setChecked();
    }
    else {
        this.setUnchecked();
    }
};

export default Toggle;