/*
* Initialize selectors
*/

var selectMenu = document.querySelector('.c-select-menu');
var selectMenuItem = new MWF.SelectMenu(selectMenu);

var dialog = document.querySelector('.c-dialog');
var dialogItem = new MWF.Dialog(dialog);

var flyout = document.querySelector('.c-flyout');
var flyoutItem = new MWF.Flyout(flyout);

var drawer = document.querySelector('.c-drawer');
var drawerItem = new MWF.Drawer(drawer);

var inPageNavigation = document.querySelector('.c-in-page-navigation');
var inPageNavigationItem = new MWF.InPageNavigation(inPageNavigation);

var pivot = document.querySelector('.c-pivot');
var pivotItem = new MWF.Pivot(pivot);

var table = document.querySelector('.c-table');
var tableItem = new MWF.Table(table);

var toggle = document.querySelector('.c-toggle');
var vItem = new MWF.Toggle(toggle);

var tooltip = document.querySelector('.c-tooltip');
var tooltipItem = new MWF.Tooltip(tooltip);

var checkbox = document.querySelector('.c-checkbox');
var checkboxItem = new MWF.Checkbox(checkbox);