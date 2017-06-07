let Dialog = function(el) {
    this.element = el;
    return this.init();
};

Dialog.prototype.show = function() {
    this.shown = true;
    this.dialog.setAttribute('aria-hidden', 'false');
    this.dialogContent.focus();
    document.body.style.overflow = 'hidden';

    var openID = this.dialogID;
    var openDialogContent = this.dialogContent;
    var openEl = document.getElementById(openID);
    var inputs = this.dialogInputs;
    var firstInput = inputs[0];
    var lastInput = inputs[inputs.length-1];

    document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which;
        var target = e.target || e.srcElement;
        var theEvent = e;

        switch (keyCode) {

            //enter keystroke
            case 13:
                if (target.getAttribute('data-js-dialog-hide') !== null) {
                    e.preventDefault();
                    Dialog.prototype.escape(openEl);
                }
                break;

            //escape keystroke
            case 27:
                e.preventDefault();
                Dialog.prototype.escape(openEl);
                break;

            //tab keystroke
            case 9:
            
            if (inputs.length === 1){
                e.preventDefault();
                firstInput.focus();
            }
            else {
                lastInput.onkeydown = function (e) {
                   if ((e.which === 9 && !e.shiftKey)) {
                       e.preventDefault();
                       firstInput.focus();
                   }
                };
                firstInput.onkeydown = function (e) {
                    if ((e.which === 9 && e.shiftKey)) {
                        e.preventDefault();
                        lastInput.focus();
                    }
                };
            }
                break;
            default:
                break;
        }
    };
};

Dialog.prototype.escape = function(el) {
    this.dialog = el;
    this.hide();
};

Dialog.prototype.hide = function() {
    this.shown = false;
    this.dialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
};

Dialog.prototype.init = function() {
    this.dialog = this.element;
    this.dialogID = this.element.getAttribute('id');
    this.openButton = document.querySelectorAll("[data-js-dialog-show=" + this.dialogID + "]");
    this.closeButton = this.element.querySelector("#" + this.dialogID + " button[data-js-dialog-hide]");
    this.closeGlyph = this.element.querySelector("#" + this.dialogID + " .c-glyph[data-js-dialog-hide]");
    this.dialogContent = this.element.querySelector("#" + this.dialogID + " div[role='dialog']");
    this.backdrop = this.element.querySelector("#" + this.dialogID + ".c-dialog div[role='presentation']");
    this.dialogInputs = this.element.querySelectorAll('select, input, textarea, button, a, .c-glyph[data-js-dialog-hide]');
    this.firstInput = this.dialogInputs[0];
    this.lastInput = this.dialogInputs[this.dialogInputs.length-1];
    this.shown = false;

    if (window.addEventListener) {
        for (var i=0; i < this.openButton.length; i++) {
            this.openButton[i].addEventListener('click', this, false);
        }
        if (this.closeButton !== null){
            this.closeButton.addEventListener('click', this, false);
        }
        if (this.closeGlyph !== null){
            this.closeGlyph.addEventListener('click', this, false);
        }
        if (this.backdrop !== null){
            this.backdrop.addEventListener('click', this, false);
        }
    } else if (window.attachEvent){
        var that = this;
        var handleEvent = function() {
            that.handleEvent.call(that);
        }; 
        for (var j=0; j < this.openButton.length; j++) {
            this.openButton[j].attachEvent('onclick', handleEvent);
        }

        if (this.closeButton !== null){
            this.closeButton.attachEvent('onclick', handleEvent);
        }
        if (this.closeGlyph !== null){
            this.closeGlyph.attachEvent('onclick', handleEvent);
        }
        if (this.backdrop !== null){
            this.backdrop.attachEvent('onclick', handleEvent);
        }
    }

    return this;
};

Dialog.prototype.handleEvent = function(e) {
    var target = e.target || e.srcElement;

    //dialog closing elements
    if ((target == this.closeButton) || (target == this.closeGlyph) || (target == this.backdrop)) {
        this.hide();
    }
    //dialog opening elements
    else if (this.openButton.length > 1) {
        for (var i=0; i < this.openButton.length; i++) {
            if (target == this.openButton[i]) {
                this.show();
            }
        }
    }
    else if (target == this.openButton[0]){
        this.show();
    }
};

export default Dialog;