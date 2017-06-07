let File = function(el) {
    this.element = el;
    return this.init();
};

File.prototype.init = function() {

    this.fileInput = this.element.querySelector('input[type="file"]');
    this.textInput = this.element.querySelector('input[type="text"]');
    this.fileButton = this.element.querySelector('button');

    if (window.addEventListener) {

        this.fileInput.addEventListener('change', this, false);
        this.textInput.addEventListener('click', this, false);
        this.fileButton.addEventListener('click', this, false);

    } else if (window.attachEvent){
        var that = this;

        this.fileInput.attachEvent('onchange', function() {
            that.handleEvent.call(that);
        });
        this.textInput.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
        this.fileButton.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }

    return this;
};

File.prototype.handleEvent = function(e) {
    e = e || window.event;
    e.preventDefault();

    if (e.type === 'click') {

        // click adjacent file input to open native file picker
        this.fileInput.click();

        return false;

    } else if (e.type === 'change') {

        this.fileValue = this.fileInput.value;

        // clean up browser security string for user clarity
        this.fileValue = this.fileValue.replace('C:\\fakepath\\', '');

        // display selected file in readonly textbox
        // TODO carrisa #6911960: make this work in IE8 (nextElementSibling not supported)
        this.textInput = this.fileInput.nextElementSibling;
        this.textInput.value = this.fileValue;
    }
};

export default File;