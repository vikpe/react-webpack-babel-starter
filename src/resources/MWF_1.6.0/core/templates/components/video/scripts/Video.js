
import {addClass, removeClass, addEventListeners, getClientRect} from '../../../helpers.js';
import Slider from '../../slider/scripts/Slider.js';

let Video = function(el) {
    this.element = el;
    this.videoObj = this.element.getElementsByClassName('f-video-player');
    this.videoControls = this.element.querySelector('.f-video-controls');
    if (this.videoObj[0].canPlayType && this.videoControls !== null) {
        return this.init();
    }
    return null;
};

Video.prototype.init = function() {
    this.videoEl = this.element.querySelector('video');
    this.playButton = this.element.querySelector('.f-play-pause');
    this.playTooltip = this.playButton.querySelector('span');
    this.fullScreenButton = this.element.querySelector('.f-full-screen');
    this.fsTooltip = this.fullScreenButton.querySelector('span');
    this.seekSlider = this.element.querySelector('.c-slider.f-progress');
    this.seekBar = this.element.querySelector('.f-seek-bar');
    this.volumeButton = this.element.querySelector('.f-volume-button');
    this.volumeSliderContainer = this.element.querySelector('.f-volume-slider');
    this.volumeCSlider = this.element.querySelector('.f-volume-slider .c-slider');
    this.timeCurr = this.element.querySelector('.f-timecode');
    this.timeDur = this.element.querySelector('.f-timecode span');
    this.optionsButton = this.element.querySelector('.f-options');
    this.optionsContainer = this.element.querySelector('.f-options-dialog');
    this.optionsDialogInit();

    this.eventHandlerReferences = {};

    //Initialize Sliders Manually -- force sliders to be in ltr mode and update
    this.progressSlider = new Slider(this.seekSlider);
    this.progressSlider.primaryDirection = 'left';
    this.progressSlider.update();
    this.progressSlider.setCallback(this, this.returnCurrentTime);
    this.volumeSlider = new Slider(this.volumeCSlider);
    this.volumeSlider.primaryDirection = 'left';
    this.volumeSlider.update();
    this.volumeOn = true;
    this.volumeLevel = 1;

    //Seek Bar Slider Controls & Volume Slider
    this.thumb = this.element.querySelector('.f-progress button');
    this.tooltip = this.element.querySelector('.f-progress button span');
    this.mockSlider = this.element.querySelector('.f-progress div');
    this.dimensions = getClientRect(this.mockSlider);
    this.maxThumbOffset = this.dimensions.width - this.thumb.clientWidth;
    this.track = this.mockSlider.querySelectorAll('span');
    this.volumeBar = this.element.querySelector('.c-slider .f-volume-bar');
    this.volumeBarButton = this.element.querySelector('.f-volume-slider button');
    this.volumeBarTooltip = this.element.querySelector('.c-slider span');

    addEventListeners(this.playButton, 'click', this);
    addEventListeners(this.playButton, 'mouseover', this);
    addEventListeners(this.playButton, 'mouseout', this);
    addEventListeners(this.videoEl, 'click', this);
    addEventListeners(this.videoEl, 'timeupdate', this);
    addEventListeners(this.videoEl, 'mouseup', this);
    addEventListeners(this.fullScreenButton, 'click', this);
    addEventListeners(this.fullScreenButton, 'mouseover', this);
    addEventListeners(this.fullScreenButton, 'mouseout', this);
    addEventListeners(this.seekBar, 'onchange', this);
    addEventListeners(this.thumb, 'mousedown', this);
    addEventListeners(this.volumeButton, 'click', this);
    addEventListeners(this.volumeButton, 'mouseover', this);
    addEventListeners(this.volumeButton, 'mouseout', this);
    addEventListeners(this.volumeBarButton, 'mouseup', this);
    addEventListeners(this.volumeBarButton, 'mouseout', this);
    addEventListeners(this.volumeBarButton, 'mousemove', this);
    addEventListeners(this.volumeSliderContainer, 'mouseup', this);
    addEventListeners(this.volumeSliderContainer, 'mouseover', this);
    addEventListeners(this.volumeSliderContainer, 'mouseout', this);
    addEventListeners(this.volumeBarTooltip, 'mouseup', this);
    addEventListeners(this.volumeBarTooltip, 'mouseout', this);
    addEventListeners(this.optionsButton, 'click', this);

    var that = this;
    if (window.addEventListener) {
        that.element.addEventListener('mouseover', function() {
            that.cpMouseEvents();
        }.bind(that), false);
        that.element.addEventListener('mouseout', function() {
            that.cpMouseEvents();
        }.bind(that), false);
        window.addEventListener('resize', function() {
            that.handleResize();
        }, true);
        window.addEventListener('scroll', function() {
            that.handleResize();
        }, true);
    } else if (window.attachEvent) {
        that.element.attachEvent('onmouseover', function() {
            that.cpMouseEvents();
        }.bind(that), false);
        that.element.attachEvent('onmouseout', function() {
            that.cpMouseEvents();
        }.bind(that), false);
        window.attachEvent('onresize', function() {
            that.handleResize();
        });
        window.attachEvent('onscroll', function() {
            that.handleResize();
        });
    }

    this.cpTimer = window.setTimeout(function(){that.panelTimer();}, 3500);
    this.cpActive = true;

    window.onload = function() {
        // Safari volume slider needs to be updated after the components load
        // otherwise the slider dimensions are incorrect
        that.volumeSlider.setupDimensions();
    };

    return this;
};

Video.prototype.optionsDialogInit = function () {
    this.odParent = this.optionsContainer.querySelector('ul');
    this.odDimensions = getClientRect(this.odParent);
    this.optionsContainer.style.height = this.odDimensions.height + "px";
    this.odSubActive = null;

    var that = this;
    if (window.addEventListener) {
        that.odParent.addEventListener('click', function() {
            that.odMouseEvents();
        }.bind(that), false);
    } else if (window.attachEvent) {
        that.odParent.attachEvent('onclick', function() {
            that.odMouseEvents();
        }.bind(that), false);
    }
};

Video.prototype.odMouseEvents = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    this.odDimensions = getClientRect(this.odParent);
    this.videoDimensions = getClientRect(this.element);
    var nextMenuName = target.getAttribute('data-video-options');
    if (nextMenuName && nextMenuName !== "back") {
        var nextMenu = this.optionsContainer.querySelector('.' + nextMenuName);
        nextMenu.style.display = "block";
        var nextHeight = this.calcHeight(nextMenu);
        this.optionsContainer.style.height = nextHeight + "px";
        this.odParent.style.left = "-160px";
        this.odSubActive = nextMenu;
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    } else if(nextMenuName) {
        this.optionsContainer.style.height = this.odDimensions.height + "px";
        this.odParent.style.left = "0";
        this.odResetSubActive();
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    if (target.getAttribute('data-video-selectable')) {
        var siblings = target.parentNode.parentNode.querySelectorAll('a');
        for (var j=0; j<siblings.length; j++) {
            removeClass(siblings[j], 'glyph-check-mark');
        }
        addClass(target, 'glyph-check-mark');
    }
};

Video.prototype.calcHeight = function (nextEl) {
    var nextHeight = getClientRect(nextEl).height;
    if (nextHeight > this.videoDimensions.height - 46) {
        this.optionsContainer.style.overflowY = "scroll";
        return this.videoDimensions.height - 46;
    } else {
        this.optionsContainer.style.overflowY = "hidden";
        return nextHeight;
    }
};

Video.prototype.panelTimer = function () {
    this.cpActive = false;
    this.controlPanelToggle();
    window.clearTimeout(this.cpTimer);
};

Video.prototype.controlPanelToggle = function () {
    if (this.cpActive) {
        removeClass(this.videoControls, 'f-slideout');
        addClass(this.videoControls, 'f-slidein');
    } else {
        removeClass(this.videoControls, 'f-slidein');
        addClass(this.videoControls, 'f-slideout');
        this.volumeSliderContainer.setAttribute('aria-hidden','true');
        this.optionsContainer.style.height = this.odDimensions.height + "px";
        this.odParent.style.left = "0";
        this.odResetSubActive();
        this.optionsContainer.setAttribute('aria-hidden','true');
    }
};

Video.prototype.odResetSubActive = function () {
    if (this.odSubActive) {
        this.odSubActive.style.display = "none";
        this.odSubActive = null;
    }
};

Video.prototype.cpMouseEvents = function (e) {
    e = e || window.event;
    this.cpActive = true;

    var that = this;
    if (e.type === "mouseover") {
        window.clearTimeout(that.cpTimer);
        this.controlPanelToggle();
    } else if (e.type === "mouseout") {
        e = e.toElement || e.relatedTarget;
        while (e && e.parentNode && e.parentNode !== window) {
            if (e.parentNode === this || e === this) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;
            }
            e = e.parentNode;
        }
        that.cpTimer = window.setTimeout(function(){that.panelTimer();}, 3500);
    }
};

Video.prototype.handleEvent = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (e.type === "click") {
        target.blur();
    }

    switch (target) {
        case this.playButton:
            this.playPause(e);
            this.closeOpenDialogs(e);
            break;

        case this.fullScreenButton:
            this.fullScreen(e);
            this.closeOpenDialogs(e);
            break;

        case this.seekBar:
            this.updateSeekBar();
            this.closeOpenDialogs(e);
            break;

        case this.videoEl:
            this.videoMethods(e);
            this.closeOpenDialogs(e);
            break;

        case this.thumb:
            this.seekVideo(e);
            this.closeOpenDialogs(e);
            break;

        case this.volumeButton:
            if (e.type === "click") {
                this.muteUnmute();
            } else {
                this.volumeToggle(e);
            }
            break;

        case this.optionsButton:
            this.toggleDialogs(this.optionsContainer);
            break;

        case this.volumeSliderContainer:
            if (e.type === "mouseover") {
                this.hoverVolume();
            } else {
                this.updateVolume();
            }
            break;

        case this.volumeBarButton:
        case this.volumeBarTooltip:
            this.updateVolume();
            break;
    }

};

Video.prototype.handleResize = function () {
    this.dimensions = getClientRect(this.mockSlider);
    this.maxThumbOffset = this.dimensions.width - this.thumb.clientWidth;
    this.updateSeekBar();
    this.optionsContainer.setAttribute('aria-hidden','true');
};

Video.prototype.playPause = function (e) {
    if (e.type === 'click') {
        if (this.videoObj[0].paused === true) {
            this.videoObj[0].play();
            removeClass(this.playButton, 'glyph-play');
            this.playButton.setAttribute('aria-label', "Pause");
            addClass(this.playButton, 'glyph-pause');
            this.playTooltip.innerHTML = "Pause";
            this.updateVolume();
        } else {
            this.videoObj[0].pause();
            removeClass(this.playButton, 'glyph-pause');
            this.playButton.setAttribute('aria-label', "Play");
            addClass(this.playButton, 'glyph-play');
            this.playTooltip.innerHTML = "Play";
        }
    } else if (e.type === 'mouseover') {
        this.playTooltip.setAttribute('aria-hidden', 'false');
    } else if (e.type === 'mouseout') {
        this.playTooltip.setAttribute('aria-hidden', 'true');
    }
};

Video.prototype.fullScreen = function (e) {
    if (e.type === 'click') {
        if (this.videoObj[0].requestFullscreen) {
            this.videoObj[0].requestFullscreen();
        } else if (this.videoObj[0].mozRequestFullScreen) {
            this.videoObj[0].mozRequestFullScreen();
        } else if (this.videoObj[0].webkitRequestFullscreen) {
            this.videoObj[0].webkitRequestFullscreen();
        }
    } else if (e.type === 'mouseover') {
        this.fsTooltip.setAttribute('aria-hidden', 'false');
    } else if (e.type === 'mouseout') {
        this.fsTooltip.setAttribute('aria-hidden', 'true');
    }
};

Video.prototype.seekVideo = function (e) {
    if (e.type === "mousedown") {
        this.videoObj[0].pause();
        this.eventHandlerReferences.mouseMove = this.seekMouseMove.bind(this);
        this.eventHandlerReferences.mouseUp = this.removeMouseMove.bind(this);
        if (window.addEventListener) {
            document.addEventListener('mousemove', this.eventHandlerReferences.mouseMove, false);
            document.addEventListener('mouseup', this.eventHandlerReferences.mouseUp, false);
        } else if (window.attachEvent) {
            document.attachEvent('onmousemove', this.eventHandlerReferences.mouseMove);
            document.attachEvent('onmouseup', this.eventHandlerReferences.mouseUp);
        }
    }
};

Video.prototype.seekMouseMove = function() {
    var time = this.timeFormat((this.seekBar.value * this.videoObj[0].duration) / 100);
    this.tooltip.innerHTML = time;
};

Video.prototype.removeMouseMove = function() {
    this.updateSeekBar();
    if (window.addEventListener) {
        document.removeEventListener('mousemove', this.eventHandlerReferences.mouseMove, false);
        document.removeEventListener('mouseup', this.eventHandlerReferences.mouseUp, false);
    } else if (window.attachEvent) {
        document.detachEvent('onmousemove', this.eventHandlerReferences.mouseMove);
        document.detachEvent('onmouseup', this.eventHandlerReferences.mouseUp);
    }
};

Video.prototype.returnCurrentTime = function (value) {
    this.videoObj[0].pause();
    this.tooltip.innerHTML = this.timeFormat((value * this.videoObj[0].duration) / 100);
    var time = (value * this.videoObj[0].duration) / 100;
    this.videoObj[0].currentTime = time;
};

Video.prototype.updateSeekBar = function () {
    var time = (this.seekBar.value * this.videoObj[0].duration) / 100;
    this.track[0].innerHTML = this.timeFormat(time.toFixed(0));
    var offsetValue = Math.floor((this.videoObj[0].currentTime * this.maxThumbOffset) / this.videoObj[0].duration);
    this.thumb.style.left = offsetValue + 'px';
    this.track[1].style.width = offsetValue + 'px';
};

Video.prototype.videoMethods = function (e) {
    //Update timecode
    this.timeCurr.childNodes[0].nodeValue = this.timeFormat(this.videoObj[0].currentTime.toFixed(0));
    this.timeDur.innerHTML = " / " + this.timeFormat(this.videoObj[0].duration.toFixed(0));

    //Move seekbar with video
    var offsetValue = Math.floor((this.videoObj[0].currentTime * this.maxThumbOffset) / this.videoObj[0].duration);
    this.thumb.style.left = offsetValue + 'px';
    this.track[1].style.width = offsetValue + 'px';
    this.track[0].innerHTML = this.timeFormat(this.videoObj[0].currentTime.toFixed(0));
    this.seekBar.setAttribute('value', this.videoObj[0].currentTime.toFixed(0));

    if (e.type === 'click') {
        this.playPause(e);
        if (this.volumeSliderContainer.getAttribute('aria-hidden') === 'false') {
            this.volumeSliderContainer.setAttribute('aria-hidden','true');
        }
    } else if (e.type === 'mouseup') {
        this.updateVolume();
    }
};

Video.prototype.updateVolume = function () {
    if (!this.volumeOn) {
        this.videoObj[0].volume = 0;
        return;
    }
    this.videoObj[0].volume = this.volumeBar.value / 100;
    this.volumeLevel = this.videoObj[0].volume;
    this.muteUnmuteGlyph();
};

Video.prototype.muteUnmute = function () {
    if (this.videoObj[0].volume > 0) {
        this.volumeOn = false;
        this.volumeLevel = this.videoObj[0].volume;
        this.videoObj[0].volume = 0;
    } else {
        this.volumeOn = true;
        this.videoObj[0].volume = this.volumeLevel;
    }
    this.muteUnmuteGlyph();
};

Video.prototype.volumeToggle = function (e) {
    if (e.type === "mouseover") {
        this.volumeContainerClosed = false;
    } else if (e.type === "mouseout") {
        if (this.volumeContainerClosed){
            return;
        }
        this.volumeContainerClosed = true;
    }
    if (this.volumeOn) {
        this.volumeSliderContainer.setAttribute('aria-hidden',this.volumeContainerClosed);
    }
    this.onlyOneDialog(this.volumeSliderContainer);
};

Video.prototype.hoverVolume = function () {
    this.volumeContainerClosed = false;
    if (this.volumeOn) {
        this.volumeSliderContainer.setAttribute('aria-hidden','false');
    }
};

Video.prototype.muteUnmuteGlyph = function () {
    if (this.videoObj[0].volume === 0) {
        removeClass(this.volumeButton, 'glyph-volume');
        addClass(this.volumeButton, 'glyph-mute');
        this.volumeSliderContainer.setAttribute('aria-hidden','true');
    } else {
        removeClass(this.volumeButton, 'glyph-mute');
        addClass(this.volumeButton, 'glyph-volume');
        this.volumeSliderContainer.setAttribute('aria-hidden','false');
    }
};

Video.prototype.closeOpenDialogs = function (e) {
    if (this.volumeSliderContainer.getAttribute('aria-hidden') === 'false' && e.type === "click") {
        this.volumeSliderContainer.setAttribute('aria-hidden','true');
    }
    if (this.optionsContainer.getAttribute('aria-hidden') === 'false' && e.type === "click") {
        this.optionsContainer.setAttribute('aria-hidden','true');
        this.optionsContainer.style.height = this.odDimensions.height + "px";
        this.odParent.style.left = "0";
        this.odResetSubActive();
    }
};

Video.prototype.toggleDialogs = function (el) {
    if (el.getAttribute('aria-hidden') === 'false') {
        el.setAttribute('aria-hidden','true');
        this.optionsContainer.style.height = this.odDimensions.height + "px";
        this.odParent.style.left = "0";
        this.odResetSubActive();
    } else {
        el.setAttribute('aria-hidden','false');

    }
    this.onlyOneDialog(el);
};

Video.prototype.onlyOneDialog = function (el) {
    if (this.optionsContainer.getAttribute('aria-hidden') === 'false' && this.volumeSliderContainer.getAttribute('aria-hidden') === 'false') {
        if (el === this.optionsContainer) {
            this.volumeSliderContainer.setAttribute('aria-hidden','true');
        } else {
            this.optionsContainer.setAttribute('aria-hidden','true');
            this.optionsContainer.style.height = this.odDimensions.height + "px";
            this.odParent.style.left = "0";
            this.odResetSubActive();
        }
    }
};

Video.prototype.timeFormat = function (time) {
    var retTime = "";
    time = Number(time);
    var hour = Math.floor(time / 3600);
    var min = Math.floor(time % 3600 / 60);
    var sec = Math.floor(time % 3600 % 60);

    if (hour > 0) {
        retTime = hour + ":";
    }
    if (min < 10 && min !== 0) {
        retTime = retTime + "0" + min + ":";
    } else if (min > 9) {
        retTime = retTime + min + ":";
    } else if (min === 0) {
        retTime = retTime + "00:";
    }
    if (sec < 10 && sec !== 0) {
        retTime = retTime + "0" + sec;
    } else if (sec > 9) {
        retTime = retTime + sec;
    } else if (sec === 0) {
        retTime = retTime + "00";
    }
    if (retTime === "") {
        retTime = "00:00";
    }

    return retTime;
};

export default Video;