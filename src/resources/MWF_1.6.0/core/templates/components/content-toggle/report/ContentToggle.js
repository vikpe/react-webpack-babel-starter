let ContentToggle = function(el) {
    this.element = el;

    return this.init();
};

ContentToggle.prototype.init = function() {
    this.target = this.element.getElementsByTagName("p")[0];
    this.trigger = this.element.getElementsByTagName('button')[0];
    this.strings = {
        moreText: this.trigger.getAttribute('data-f-more'),
        lessText: this.trigger.getAttribute('data-f-less')
    };

    if (this.isExpanded()) {
        this.expand();
    } else {
        this.collapse();
    }

    if (window.addEventListener) {
        this.trigger.addEventListener('click', this, false);
    } else if (window.attachEvent){
        var that = this;
        this.trigger.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }

    return this;
};

ContentToggle.prototype.handleEvent = function (e) {
    if (this.isExpanded()) {
        this.collapse();
    } else {
        this.expand();
    }
};

ContentToggle.prototype.isExpanded = function() {
    return this.trigger.getAttribute("aria-expanded") === 'true';
};

ContentToggle.prototype.expand = function() {
    this.target.setAttribute('data-f-expanded', true);
    this.trigger.setAttribute('aria-expanded', true);
    this.trigger.innerHTML = this.strings.lessText;
};

ContentToggle.prototype.collapse = function() {
    this.target.setAttribute('data-f-expanded', false);
    this.trigger.setAttribute('aria-expanded', false);
    this.trigger.innerHTML = this.strings.moreText;
};

export default ContentToggle;