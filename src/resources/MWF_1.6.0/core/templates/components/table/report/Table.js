import {addClass, removeClass, hasClass} from '../../../helpers.js';

let Table = function(el) {
    this.element = el;

    this.tableToSort = this.element.querySelector('[data-f-sort="true"]');

    if (this.tableToSort !== null) {
        return this.init();
    }

    return null;
};

Table.prototype.init = function() {
    this.tableCells = [];
    this.thSortable = [];
    this.tableContent = this.tableToSort.querySelectorAll("tbody");

    var rows = this.tableToSort.querySelectorAll("tbody > tr");
    this.rowLength = rows.length;
    var cellLength, cell;
    for (var i = 0; i < this.rowLength; i++) {
        cell = rows[i].cells;
        cellLength = cell.length;
        this.tableCells[i] = [];
        for (var j = 0; j < cellLength; j++) {
            this.tableCells[i][j] = {
                "html": cell[j].innerHTML,
                "txt": this.convertToRawVal(cell[j])
            };
        }
    }

    this.thSortable = this.tableToSort.querySelectorAll("thead .f-sortable");
    for (var k = 0; k < this.thSortable.length; k++) {
        var sortButton = this.thSortable[k].querySelector("button");
        addClass(sortButton, 'c-glyph');
        this.thSortable[k].ts = {
            "asc" : 1,
            "col" : k
        };
        this.attachEvents(sortButton);
    }
};

Table.prototype.attachEvents = function (thClickable) {
    var that = this;
    if (window.addEventListener) {
        thClickable.addEventListener('click', this, false);
    } else if (window.attachEvent){
        thClickable.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }
};

Table.prototype.clearArrows = function () {
    for (var l = 0; l < this.thSortable.length; l++) {
        this.thSortable[l].setAttribute('aria-sort', 'none');
        var sortButton = this.thSortable[l].querySelector("button");
        removeClass(sortButton, 'f-descending');
        removeClass(sortButton, 'f-ascending');
    }
};

Table.prototype.handleEvent = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var targetParent = target.parentElement;
    this.clearArrows();
    this.performSort(targetParent.ts.col, targetParent.ts.asc);

    if (targetParent.ts.asc === 1) {
        targetParent.setAttribute('aria-sort', 'ascending');
        addClass(target, 'f-ascending');
        targetParent.ts.asc = -1;
    } else {
        targetParent.setAttribute('aria-sort', 'descending');
        addClass(target, 'f-descending');
        targetParent.ts.asc = 1;
    }
};

Table.prototype.performSort = function(col, asc) {
    this.tableCells.sort(function(a, b) {
        var retval = 0;
        var aVal = a[col].txt;
        var bVal = b[col].txt;
        var fA = parseFloat(aVal);
        var fB = parseFloat(bVal);
        if (aVal !== bVal) {
            if ((fA === aVal) && (fB === bVal)) {
                retval = (fA > fB) ? asc : -1 * asc;
            } else {
                retval = (aVal > bVal) ? asc : -1 * asc;
            }
        }
        return retval;
    });

    this.rebuildTable();
};

Table.prototype.rebuildTable = function() {
    for (var rowidx = 0; rowidx < this.rowLength; rowidx++) {
        for (var colidx = 0; colidx < this.tableCells[rowidx].length; colidx++) {
            this.tableContent[0].rows[rowidx].cells[colidx].innerHTML = this.tableCells[rowidx][colidx].html;
        }
    }
};

Table.prototype.convertToRawVal = function(content) {
    var retVal;

    //Find numerical values and strip everything except the int
    if (hasClass(content, "f-numerical")) {

        //set free item to 0
        if (content.querySelectorAll('[content="0.00"]').length > 0) {
            retVal = 0;
        } else {
            var regx = /\d+|\.\d{0,2}|\,\d{0,2}$/g;
            var str = this.extractRawValue(content);
            var intVal;
            var intArr = [];
            while ((intVal = regx.exec(str)) !== null ) {
                intArr.push(intVal);
            }
            retVal = intArr.join("");
        }

    } else if (content === ' ') {
        //Put empty cells on top or bottom
        retVal = -1;

    } else {
        //Not a numerical value or empty, return full raw string
        retVal = this.extractRawValue(content);
    }

    return retVal;
};

Table.prototype.extractRawValue = function(content) {
    return content.textContent || content.innerText;
};

export default Table;