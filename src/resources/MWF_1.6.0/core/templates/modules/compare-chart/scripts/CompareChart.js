import {getClientRect, addEventListeners} from '../../../helpers.js';

let CompareChart = function(el) {
    this.element = el;
    var that = this;
    if (window.addEventListener) {
        window.addEventListener('load', function() {
            //Equalize only after all content has loaded otherwise
            // the rows are off if items haven't fully loaded
            return that.init();
        });
    } else if (window.attachEvent) {
        window.attachEvent('onload', function() {
            return that.init();
        });
    }
};

CompareChart.prototype.init = function() {
    this.columns = this.element.querySelectorAll('.f-column');

    this.getHeights();
    this.attachEvents();
};

CompareChart.prototype.attachEvents = function() {
    addEventListeners(window, 'resize', this);
};

CompareChart.prototype.handleEvent = function() {
    this.getHeights();
};

CompareChart.prototype.getHeights = function() {
    this.contentHeights = [];
    for (var i = 0; i < this.columns.length; i++) {
        var rowEls = this.columns[i].querySelectorAll('.f-row');
        var heights = [];

        for (var j = 0; j < rowEls.length; j++) {
            rowEls[j].style.height = 'auto';
            heights.push({
                element: rowEls[j],
                height: getClientRect(rowEls[j]).height
            });
        }

        this.contentHeights.push(heights);
    }
    this.equalizeHeights();
};

CompareChart.prototype.equalizeHeights = function() {
    for (var l = 0; l < this.columns.length; l++) {
        var tempHeight = null;
        var tempEl = [];
        for (var m = 0; m < this.columns.length; m++) {
            tempEl.push(this.contentHeights[m][l].element);
            if (this.contentHeights[m][l].height > tempHeight || tempHeight === null) {
                tempHeight = this.contentHeights[m][l].height;
            }
        }
        this.equalizeColumns(tempHeight, tempEl);
    }
};

CompareChart.prototype.equalizeColumns = function(height, el) {
    for (var n = 0; n < el.length; n++) {
        el[n].style.height = height + 'px';
    }
};

export default CompareChart;