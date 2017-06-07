let Alert = function(el) {
    this.element = el;

    return this.init();
};

Alert.prototype.init = function() {
    this.closeButton = this.element.querySelector('button.c-action-trigger.glyph-cancel');
    if (window.addEventListener) {
        this.closeButton.addEventListener('click', this, true);
    } else if (window.attachEvent){
        var that = this;
        this.closeButton.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }
    return this;
};

Alert.prototype.handleEvent = function() {
    if (window.addEventListener) {
        this.closeButton.removeEventListener('click', this, false);
    } else if (window.attachEvent){
        var that = this;
        this.closeButton.detachEvent('onclick', that);
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
};

export default Alert;