import {removeEventListeners, addEventListeners, addClass, removeClass, hasClass} from '../../../helpers.js';

let DateTimePicker = function(el) {
    this.element = el;

    if (this.element !== null) {
        return this.init();
    }

    return null;
};

DateTimePicker.prototype.init = function() {
    var datetimeControl = this.element.getAttribute('data-date-time-picker');
    this.cancelButton = "";
    this.firstSelection = "";
    if (datetimeControl === "date") {
        this.dateSelector = this.element.querySelector("[data-date-time-picker='date-selector']");
        this.monthColumn = this.dateSelector.querySelector("[data-date-time-picker='month'] ul");
        this.dayColumn = this.dateSelector.querySelector("[data-date-time-picker='day'] ul");
        this.yearColumn = this.dateSelector.querySelector("[data-date-time-picker='year'] ul");
        this.cancelButton = this.dateSelector.querySelector("[data-date-time-picker='cancel']");

        this.totalMonths = 12;
        this.totalDays = null;
        this.dateData = [];
        this.months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var days = ["",31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        for ( var h = 0; h <= 12; h++ ) {
            this.dateData[h] = {
                "month" : this.months[h],
                "days" : days[h]
            };
        }
        this.clearColumn(this.monthColumn);
        this.clearColumn(this.dayColumn);
        this.clearColumn(this.yearColumn);
        this.buildSelector(this.monthColumn, "month", null);
        this.buildSelector(this.dayColumn, "day", null);
        this.buildSelector(this.yearColumn, "year", null);
    } else if (datetimeControl === "time") {
        this.ampmSelection = ["AM","PM"];
        this.timeSelector = this.element.querySelector("[data-date-time-picker='time-selector12']");
        this.hourColumn = this.timeSelector.querySelector("[data-date-time-picker='hour'] ul");
        this.minuteColumn = this.timeSelector.querySelector("[data-date-time-picker='minute'] ul");
        this.ampmColumn = this.timeSelector.querySelector("[data-date-time-picker='ampm'] ul");
        this.cancelButton = this.timeSelector.querySelector("[data-date-time-picker='cancel']");
        this.clearColumn(this.hourColumn);
        this.clearColumn(this.minuteColumn);
        this.buildSelector(this.hourColumn, "hour", null);
        this.buildSelector(this.minuteColumn, "minute", null);
        this.buildAMPM(this.ampmColumn);
    } else if (datetimeControl === "time24") {
        this.timeSelector24 = this.element.querySelector("[data-date-time-picker='time-selector24']");
        this.hour24Column = this.timeSelector24.querySelector("[data-date-time-picker='hour24'] ul");
        this.minute24Column = this.timeSelector24.querySelector("[data-date-time-picker='minute24'] ul");
        this.cancelButton = this.timeSelector24.querySelector("[data-date-time-picker='cancel']");
        this.clearColumn(this.hour24Column);
        this.clearColumn(this.minute24Column);
        this.buildSelector(this.hour24Column, "hour24", null);
        this.buildSelector(this.minute24Column, "minute24", null);
    }

    this.attachEvents(this.element);
};

DateTimePicker.prototype.attachEvents = function(el) {
    addEventListeners(el, 'keydown', this);
    addEventListeners(el, 'click', this);

    var scrollButtons = null;
    if (typeof this.dateSelector !== typeof undefined) {
        scrollButtons = this.dateSelector.querySelectorAll('button');
    } else if (typeof this.timeSelector !== typeof undefined) {
        scrollButtons = this.timeSelector.querySelectorAll('button');
    } else if (typeof this.timeSelector24 !== typeof undefined) {
        scrollButtons = this.timeSelector24.querySelectorAll('button');
    }

    for (var k = 0; k < scrollButtons.length; k++) {
        if (hasClass(scrollButtons[k], 'c-glyph') === false ) {
            addEventListeners(scrollButtons[k], 'mouseenter', this);
            addEventListeners(scrollButtons[k], 'mouseleave', this);
        }
    }
};

DateTimePicker.prototype.handleEvent = function (e) {
    e = e || window.event;
    var keyCode = e.keyCode || e.which;
    if(e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.returnValue = false;
    }
    var target = e.target || e.srcElement;
    var targetAttributeValue = target.getAttribute('data-date-time-picker');
    var ariaLabel = target.getAttribute('aria-label');

    var selectorType = null;
    if (typeof this.dateSelector !== typeof undefined) {
        selectorType = this.dateSelector;
    } else if (typeof this.timeSelector !== typeof undefined) {
        selectorType = this.timeSelector;
    } else if (typeof this.timeSelector24 !== typeof undefined) {
        selectorType = this.timeSelector24;
    }

    //Open Date Selector
    if (selectorType.getAttribute('aria-hidden') === 'true') {
        this.firstSelection = selectorType.querySelector("[aria-checked='true']");
        if (targetAttributeValue === "month" || targetAttributeValue === "day" || targetAttributeValue === "year") {
            this.clearColumn(this.monthColumn);
            this.clearColumn(this.dayColumn);
            this.clearColumn(this.yearColumn);
            this.buildSelector(this.monthColumn, "month", null);
            this.buildSelector(this.dayColumn, "day", null);
            this.buildSelector(this.yearColumn, "year", null);
            selectorType.setAttribute('aria-hidden', 'false');
            selectorType.querySelector("[aria-checked='true']").focus();
            addEventListeners(window, 'click', this);
        } else if (targetAttributeValue === "hour" || targetAttributeValue === "minute" || targetAttributeValue === "ampm") {
            this.clearColumn(this.hourColumn);
            this.clearColumn(this.minuteColumn);
            this.buildSelector(this.hourColumn, "hour", null);
            this.buildSelector(this.minuteColumn, "minute", null);
            this.selectAMPM(null);
            selectorType.setAttribute('aria-hidden', 'false');
            selectorType.querySelector("[aria-checked='true']").focus();
            addEventListeners(window, 'click', this);
        } else if (targetAttributeValue === "hour24" || targetAttributeValue === "minute24") {
            this.clearColumn(this.hour24Column);
            this.clearColumn(this.minute24Column);
            this.buildSelector(this.hour24Column, "hour24", null);
            this.buildSelector(this.minute24Column, "minute24", null);
            selectorType.setAttribute('aria-hidden', 'false');
            selectorType.querySelector("[aria-checked='true']").focus();
            addEventListeners(window, 'click', this);
        }
        return;
    } else {
        //Keyup Events
        if (e.type === "keydown") {
            this.keyColumnEl = target.parentNode.parentNode;
        }
        switch (keyCode) {

            // Esc
            case 27:
                selectorType.setAttribute('aria-hidden', 'true');
                removeEventListeners(window, 'click', this);
                return;

            //Enter
            case 13:
                this.updatePicker();
                selectorType.setAttribute('aria-hidden', 'true');
                removeEventListeners(window, 'click', this);
                return;

            //Left Arrow
            case 37:
                if (this.keyColumnEl !== null) {
                    this.keyColumnEl.previousElementSibling.querySelector('[aria-checked]').focus();
                }
                return;

            //Right Arrow
            case 39:
                if (this.keyColumnEl.nextElementSibling !== null) {
                    this.keyColumnEl.nextElementSibling.querySelector('[aria-checked]').focus();
                }
                return;

            //Up Arrow
            case 38:
                this.scrollColumn(this.keyColumnEl.querySelector("button"), "Scroll Up");
                return;

            //Down Arrow
            case 40:
                this.scrollColumn(this.keyColumnEl.querySelector("button"), "Scroll Down");
                return;

            //Tab + Shift
            case 9:
                this.cancelButton.onkeydown = function (e) {
                   if ((e.which === 9 && !e.shiftKey)) {
                       selectorType.setAttribute('aria-hidden', 'true');
                       removeEventListeners(window, 'click', this);
                   }
                };
                this.firstSelection.onkeydown = function (e) {
                    if ((e.which === 9 && e.shiftKey)) {
                        selectorType.setAttribute('aria-hidden', 'true');
                        removeEventListeners(window, 'click', this);
                    }
                };
                return;

            default:
                break;
        }
    }

    //Clicked Apply or Cancel
     if (targetAttributeValue === "cancel" && e.type === "click" ) {
        selectorType.setAttribute('aria-hidden', 'true');
        removeEventListeners(window, 'click', this);
        return;
    } else if (targetAttributeValue === "apply" && e.type === "click" ) {
        this.updatePicker();
        selectorType.setAttribute('aria-hidden', 'true');
        removeEventListeners(window, 'click', this);
        return;
    }

    if (ariaLabel === "Scroll Up" || ariaLabel === "Scroll Down") {
        //Control repeated scrolling action
        var that = this;
        if (e.type === 'mouseenter') {
            that.scrollDelay = setTimeout(function(){
                that.scrollInterval = false;
                clearTimeout(that.scrollDelay);
                that.scrollDelay = false;
                that.scrollInterval = setInterval(function(){
                   that.scrollColumn(target, ariaLabel);
               }, 300);
           }, 150);
           return;
       } else if (e.type === 'mouseleave') {
           clearTimeout(that.scrollDelay);
           clearInterval(that.scrollInterval);
           that.scrollInterval = false;
           this.thirtyOneDays(target);
           return;
       }

       //Scroll Column
        if (ariaLabel !== null) {
            this.scrollColumn(target, ariaLabel);
        }
    } else if (target.type === "") {
        //Item clicked, rebuild columns
        var columnType = target.parentNode.parentNode.getAttribute('data-date-time-picker');
        if (columnType === "ampm") {
            this.selectAMPM(ariaLabel);
        } else  {
            var targetCol = target.parentNode;
            this.clearColumn(target.parentNode);
            this.buildSelector(selectorType.querySelector("[data-date-time-picker='"+columnType+"'] ul"), columnType, ariaLabel);
            this.thirtyOneDays(targetCol);
        }
        return;
    }

    //Clicked outside of date selector while open
    if (this.element.contains(target) === false && selectorType.getAttribute('aria-hidden') === 'false') {
        this.updatePicker();
        selectorType.setAttribute('aria-hidden', 'true');
        removeEventListeners(window, 'click', this);
        return;
    }
};

DateTimePicker.prototype.scrollColumn = function (target, ariaButton) {
    var li = target.parentNode.querySelector("ul li");
    var ul = target.parentNode.querySelector("ul");
    var newText = null;
    var colType = target.parentNode.getAttribute('data-date-time-picker');

    if (colType === "ampm") {
        if (ariaButton === "Scroll Up"){
            this.selectAMPM("AM");
        } else if (ariaButton === "Scroll Down"){
            this.selectAMPM("PM");
        }
        return;
    }

    if (ariaButton === "Scroll Up"){
        newText = this.newContent(target.parentNode, "up");
        this.prependChildren(li, newText[2]);
        this.isLastInList(ul, newText[0], "up", newText[1]);
        this.removeChildren(target.parentNode, "bottom");
    } else if (ariaButton === "Scroll Down"){
        this.removeChildren(target.parentNode, "top");
        newText = this.newContent(target.parentNode, "down");
        this.appendChildren(ul, newText[2]);
        this.isLastInList(ul, newText[0], "down", newText[1]);
    }
};

DateTimePicker.prototype.buildSelector = function (columnEl, dateTime, clickedSelected) {
    var selected = null;
    if (clickedSelected === null) {
        selected = this.element.querySelector('[data-date-time-picker="'+dateTime+'"]').getAttribute('aria-label');
    } else {
        selected = clickedSelected;
    }

    switch (dateTime) {

        case "month":
            var monthPos = this.months.indexOf(selected, 0);
            this.buildNodes(monthPos, columnEl, 12, "month", false);
            this.setFocus(columnEl);
        break;

        case "day":
            var currentMonth = this.element.querySelector("[aria-checked]").getAttribute('aria-label');
            var dataKey = this.months.indexOf(currentMonth, 0);
            var totalDays = this.dateData[dataKey].days;
            this.buildNodes(parseInt(selected), columnEl, totalDays, null, false);
            this.setFocus(columnEl);
        break;

        case "year":
            this.buildNodes(parseInt(selected), columnEl, null, null, true);
            this.setFocus(columnEl);
        break;

        case "hour":
            this.buildNodes(parseInt(selected), columnEl, 12, null, false);
            this.setFocus(columnEl);
        break;

        case "minute":
            this.buildNodes(parseInt(selected), columnEl, 60, null, true);
            this.setFocus(columnEl);
        break;

        case "ampm":
            var ampmPos = this.ampmSelection.indexOf(selected, 0);
            this.buildAMPM(ampmPos, columnEl);
        break;

        case "hour24":
            this.buildNodes(parseInt(selected), columnEl, 24, null, true);
            this.setFocus(columnEl);
        break;

        case "minute24":
            this.buildNodes(parseInt(selected), columnEl, 60, null, true);
            this.setFocus(columnEl);
        break;
    }
};

DateTimePicker.prototype.buildNodes = function (selectedPos, columnEl, totalEl, colType, zerobased) {
    var lastEl;
    if (zerobased) {
        lastEl = totalEl - 1;
    } else {
        lastEl = totalEl;
    }

    for ( var i = selectedPos - 5; i < selectedPos + 6; i++ ) {
        var posNum, innerContent;

        if (i === 0 && zerobased) {
            posNum = 0;
        } else if (i === totalEl && zerobased) {
            posNum = 0;
        } else if (i < 1) {
            posNum = i + totalEl;
        } else if (i > totalEl) {
             posNum = i - totalEl;
        } else {
            posNum = i;
        }

        if (colType === "month") {
            innerContent = this.dateData[posNum].month;
        } else {
            innerContent = posNum;
        }

        this.appendChildren(columnEl, innerContent);

        if (i === selectedPos) {
            columnEl.lastChild.setAttribute('aria-checked','true');
            columnEl.lastChild.setAttribute('tabindex','0');
        }

        if (lastEl === posNum) {
            addClass(columnEl.lastChild, 'f-js-last');
        }
    }
};

DateTimePicker.prototype.appendChildren = function (nodeEl, innerContent) {
    var node = document.createElement('li');
    node.appendChild(document.createTextNode(innerContent));
    node.setAttribute('aria-label',innerContent);
    nodeEl.appendChild(node);
};

DateTimePicker.prototype.prependChildren = function (nodeEl, innerContent) {
    var node = document.createElement('li');
    node.appendChild(document.createTextNode(innerContent));
    node.setAttribute('aria-label',innerContent);
    nodeEl.parentNode.insertBefore(node, nodeEl);
};

DateTimePicker.prototype.buildAMPM = function (columnEl) {
    this.appendChildren(columnEl, "AM");
    columnEl.lastChild.setAttribute('aria-checked','true');
    columnEl.lastChild.setAttribute('tabindex','0');
    this.appendChildren(columnEl, "PM");
};

DateTimePicker.prototype.selectAMPM = function (selected) {
    if (selected === null ) {
        selected = this.element.querySelector('[data-date-time-picker="ampm"]').getAttribute('aria-label').toUpperCase();
    }
    if (typeof this.ampmColumn.querySelector('[aria-checked]') !== typeof undefined ) {
        this.ampmColumn.querySelector('[aria-checked]').removeAttribute('tabindex');
        this.ampmColumn.querySelector('[aria-checked]').removeAttribute('aria-checked');
    }
    if (selected === "AM") {
        removeClass(this.ampmColumn, "f-js-pm");
        this.ampmColumn.querySelector('[aria-label="AM"]').setAttribute('aria-checked', "true");
        this.ampmColumn.querySelector('[aria-label="AM"]').setAttribute('tabindex', "0");
    } else {
        addClass(this.ampmColumn, "f-js-pm");
        this.ampmColumn.querySelector('[aria-label="PM"]').setAttribute('aria-checked', "true");
        this.ampmColumn.querySelector('[aria-label="PM"]').setAttribute('tabindex', "0");
    }
};

DateTimePicker.prototype.newContent = function (el, dir) {
    var currentSelected = el.querySelector('[aria-checked]').getAttribute('aria-label');
    var column = el.getAttribute("data-date-time-picker");
    var returnArray = [];
    var nc = null;
    var stagedPos = null;

    if (column === "month") {
        this.removeAriaSelected(this.monthColumn);
        var monthPos = this.months.indexOf(currentSelected, 0);
        nc = this.nextCurrent(monthPos, dir, this.totalMonths, false);
        this.setAriaSelected(this.monthColumn, this.months[nc]);
        stagedPos = this.stagedElement(this.monthColumn, nc, dir, this.totalMonths, false);
        returnArray[0] = stagedPos[1];
        returnArray[1] = this.totalMonths;
        returnArray[2] = this.months[stagedPos[0]];
        return returnArray;
    } else if (column === "day") {
        var currentMonth = this.monthColumn.querySelector("[aria-checked]").getAttribute('aria-label');
        var dataKey = this.months.indexOf(currentMonth, 0);
        var totalDays = this.dateData[dataKey].days;
        this.removeAriaSelected(this.dayColumn);
        nc = this.nextCurrent(parseInt(currentSelected), dir, totalDays, false);
        this.setAriaSelected(this.dayColumn, nc);
        stagedPos = this.stagedElement(this.dayColumn, nc, dir, totalDays, false);
        returnArray[0] = stagedPos[1];
        returnArray[1] = totalDays;
        returnArray[2] = stagedPos[0];
        return returnArray;
    } else if (column === "year") {
        this.removeAriaSelected(this.yearColumn);
        nc = this.nextCurrent(parseInt(currentSelected), dir, 9999, true);
        this.setAriaSelected(this.yearColumn, nc);
        stagedPos = this.stagedElement(this.yearColumn, nc, dir, 9999, true);
        returnArray[0] = stagedPos[1];
        returnArray[1] = 9999;
        returnArray[2] = stagedPos[0];
        return returnArray;
    } else if (column === "hour") {
        this.removeAriaSelected(this.hourColumn);
        nc = this.nextCurrent(parseInt(currentSelected), dir, 12, false);
        this.setAriaSelected(this.hourColumn, nc);
        stagedPos = this.stagedElement(this.hourColumn, nc, dir, 12, false);
        returnArray[0] = stagedPos[1];
        returnArray[1] = 12;
        returnArray[2] = stagedPos[0];
        return returnArray;
    } else if (column === "minute") {
        this.removeAriaSelected(this.minuteColumn);
        nc = this.nextCurrent(parseInt(currentSelected), dir, 60, true);
        this.setAriaSelected(this.minuteColumn, nc);
        stagedPos = this.stagedElement(this.minuteColumn, nc, dir, 60, true);
        returnArray[0] = stagedPos[1];
        returnArray[1] = 59;
        returnArray[2] = stagedPos[0];
        return returnArray;
    } else if (column === "hour24") {
        this.removeAriaSelected(this.hour24Column);
        nc = this.nextCurrent(parseInt(currentSelected), dir, 24, true);
        this.setAriaSelected(this.hour24Column, nc);
        stagedPos = this.stagedElement(this.hour24Column, nc, dir, 24, true);
        returnArray[0] = stagedPos[1];
        returnArray[1] = 23;
        returnArray[2] = stagedPos[0];
        return returnArray;
    } else if (column === "minute24") {
        this.removeAriaSelected(this.minute24Column);
        nc = this.nextCurrent(parseInt(currentSelected), dir, 60, true);
        this.setAriaSelected(this.minute24Column, nc);
        stagedPos = this.stagedElement(this.minute24Column, nc, dir, 60, true);
        returnArray[0] = stagedPos[1];
        returnArray[1] = 59;
        returnArray[2] = stagedPos[0];
        return returnArray;
    }
};

DateTimePicker.prototype.removeAriaSelected = function (columnEl) {
    columnEl.querySelector('[aria-checked]').removeAttribute('tabindex');
    columnEl.querySelector('[aria-checked]').removeAttribute('aria-checked');
};

DateTimePicker.prototype.setAriaSelected = function (columnEl, el) {
    columnEl.querySelector('[aria-label="'+el+'"]').setAttribute('aria-checked', 'true');
    columnEl.querySelector('[aria-label="'+el+'"]').setAttribute('tabindex', '0');
    columnEl.querySelector('[aria-label="'+el+'"]').focus();
};

DateTimePicker.prototype.setFocus = function (columnEl) {
    if (columnEl.style.display !== "") {
        columnEl.querySelector('[aria-checked]').focus();
    }
};

DateTimePicker.prototype.nextCurrent = function (currentSelected, dir, total, zerobased) {
    if (dir === "up") {
        if (zerobased === true && currentSelected - 1 === 0) {
            return 0;
        } else if (currentSelected - 1 <= 0) {
            if (zerobased === true) {
                return total - 1;
            } else {
                return total;
            }
        } else {
            return currentSelected - 1;
        }
    } else if (dir === "down") {
        if (zerobased === true && currentSelected + 1 === total) {
            return 0;
        } else if (currentSelected + 1 > total) {
            return 1;
        } else {
            return currentSelected + 1;
        }
    }
    return false;
};

DateTimePicker.prototype.stagedElement = function (el, newContent, dir, total, zerobased) {
    var nextNum = [];
    if (dir === "down"){
        newContent = newContent + 5;
    } else if (dir === "up") {
        newContent = newContent - 5;
    }

    if ((zerobased === true && newContent === 0) || (zerobased === true && newContent === total)) {
        nextNum[0] = 0;
        nextNum[1] = total;
    } else if (newContent < 1) {
         nextNum[0] = nextNum[1] = newContent + total;
    } else if (newContent > total) {
         nextNum[0] = nextNum[1] = newContent - total;
    } else {
        nextNum[0] = nextNum[1] = newContent;
    }
    return nextNum;
};

DateTimePicker.prototype.isLastInList = function (el, nc, dir, total) {

    // Source: https://github.com/Alhadis/Snippets/blob/master/js/polyfills/IE8-child-elements.js
    if(!("firstElementChild" in document.documentElement)){
        Object.defineProperty(Element.prototype, "firstElementChild", {
            get: function(){
                for (var nodes = this.children, n, i = 0, l = nodes.length; i < l; ++i) {
                    if (n = nodes[i], 1 === n.nodeType) { return n; }
                }
                return null;
            }
        });
    }

    // Source: https://github.com/Alhadis/Snippets/blob/master/js/polyfills/IE8-child-elements.js
    if(!("lastElementChild" in document.documentElement)){
        Object.defineProperty(Element.prototype, "lastElementChild", {
            get: function(){
                for (var nodes = this.children, n, i = nodes.length - 1; i >= 0; --i) {
                    if (n = nodes[i], 1 === n.nodeType) { return n; }
                }
                return null;
            }
        });
    }

    if (nc === total) {
        if (dir === "down"){
            addClass(el.lastElementChild, 'f-js-last');
        } else if (dir === "up") {
            addClass(el.firstElementChild, 'f-js-last');
        }
    }
};

DateTimePicker.prototype.removeChildren = function (columnEl, listPos) {
    var liList = columnEl.querySelectorAll('li');
    if (listPos === "top") {
        liList[0].parentNode.removeChild(liList[0]);
    } else if (listPos === "bottom") {
        var lastLi = liList.length - 1;
        liList[0].parentNode.removeChild(liList[lastLi]);
    }
};

DateTimePicker.prototype.clearColumn = function (columnEl) {
    columnEl.innerHTML = "";
};

DateTimePicker.prototype.updatePicker = function () {
    var datetimeControl = this.element.getAttribute('data-date-time-picker');
    if (datetimeControl === "date") {
        this.changeText(this.element.querySelector('[data-date-time-picker="month"]'), this.monthColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="month"]').setAttribute('aria-label', this.monthColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));

        this.changeText(this.element.querySelector('[data-date-time-picker="day"]'), this.dayColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="day"]').setAttribute('aria-label', this.dayColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));

        this.changeText(this.element.querySelector('[data-date-time-picker="year"]'), this.yearColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="year"]').setAttribute('aria-label', this.yearColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
    } else if (datetimeControl === "time") {
        this.changeText(this.element.querySelector('[data-date-time-picker="hour"]'), this.hourColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="hour"]').setAttribute('aria-label', this.hourColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));

        this.changeText(this.element.querySelector('[data-date-time-picker="minute"]'), this.minuteColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="minute"]').setAttribute('aria-label', this.minuteColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));

        this.changeText(this.element.querySelector('[data-date-time-picker="ampm"]'), this.ampmColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="ampm"]').setAttribute('aria-label', this.ampmColumn.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
    } else if (datetimeControl === "time24") {
        this.changeText(this.element.querySelector('[data-date-time-picker="hour24"]'), this.hour24Column.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="hour24"]').setAttribute('aria-label', this.hour24Column.querySelector('[aria-checked="true"]').getAttribute('aria-label'));

        this.changeText(this.element.querySelector('[data-date-time-picker="minute24"]'), this.minute24Column.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
        this.element.querySelector('[data-date-time-picker="minute24"]').setAttribute('aria-label', this.minute24Column.querySelector('[aria-checked="true"]').getAttribute('aria-label'));
    }
};

DateTimePicker.prototype.changeText = function (el, changeVal) {
    if (typeof el.textContent !== "undefined") {
        el.textContent = changeVal;
    } else {
        el.innerText = changeVal;
    }
};

DateTimePicker.prototype.thirtyOneDays = function (target) {
    var colType = target.parentNode.getAttribute('data-date-time-picker');

    if (colType !== "month") {
        return;
    }

    var selectedDay = parseInt(this.dayColumn.querySelector('[aria-checked]').getAttribute('aria-label'));
    var currentMonth = target.parentNode.querySelector("[aria-checked]").getAttribute('aria-label');
    var dataKey = this.months.indexOf(currentMonth, 0);
    var totalDays = this.dateData[dataKey].days;

    if (selectedDay === 31 && totalDays < 31) {
        this.clearColumn(this.dayColumn);
        this.buildNodes(totalDays, this.dayColumn, totalDays, null, false);
    } else {
        this.clearColumn(this.dayColumn);
        this.buildNodes(selectedDay, this.dayColumn, totalDays, null, false);
    }

};

export default DateTimePicker;