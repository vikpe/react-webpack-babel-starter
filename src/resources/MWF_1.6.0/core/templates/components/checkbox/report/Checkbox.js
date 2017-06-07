let Checkbox = function(el) {
    this.element = el;
    return this.init();
};

Checkbox.prototype.init = function() {
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
    for (var i=0; i < indeterminateCheckboxes.length; i++) {
        indeterminateCheckboxes[i].indeterminate = true;
    }
}

export default Checkbox;