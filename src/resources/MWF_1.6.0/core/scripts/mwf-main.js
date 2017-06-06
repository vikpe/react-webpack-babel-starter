"use strict";

// This simply tests for IE8 as Hammer does not support IE8
// This prevents Hammer from being required in IE8
if(document.addEventListener){
    var hammer = require('./vendor/hammer.min.js');
}

var pictureFill = require('./vendor/picturefill.min.js');

import Alert from './mwf/modules/alert/scripts/Alert.js';
import AutoSuggest from './mwf/components/auto-suggest/scripts/AutoSuggest.js'
import BackToTop from './mwf/modules/back-to-top/scripts/BackToTop.js';
import Carousel from './mwf/components/carousel/scripts/Carousel.js';
import Checkbox from './mwf/components/checkbox/scripts/Checkbox.js';
import Combo from './mwf/components/combo/scripts/Combo.js';
import CompareChart from './mwf/modules/compare-chart/scripts//CompareChart.js';
import ContentToggle from './mwf/components/content-toggle/scripts/ContentToggle.js';
import DateTimePicker from './mwf/components/datetime-picker/scripts/DateTimePicker.js';
import Dialog from './mwf/components/dialog/scripts/Dialog.js';
import Drawer from './mwf/components/drawer/scripts/Drawer.js';
import File from './mwf/components/file/scripts/File.js';
import Flyout from './mwf/components/flyout/scripts/Flyout.js';
import InPageNavigation from './mwf/components/in-page-navigation/scripts/InPageNavigation.js';
import PageBar from './mwf/modules/page-bar/scripts/PageBar.js';
import Pagination from './mwf/components/pagination/scripts/Pagination.js';
import Pivot from './mwf/components/pivot/scripts/Pivot.js';
import MosaicPlacement from './mwf/components/mosaic-placement/scripts/MosaicPlacement.js';
import ProductPlacement from './mwf/modules/product-placement/scripts/ProductPlacementModule.js';
import RefineItem from './mwf/components/refine-item/scripts/RefineItem.js';
import RefineMenu from './mwf/components/refine-menu/scripts/RefineMenu.js';
import SelectButton from './mwf/components/select-button/scripts/SelectButton.js';
import SelectMenu from './mwf/components/select-menu/scripts/SelectMenu.js';
import Social from './mwf/modules/social/scripts/Social.js';
import Slider from './mwf/components/slider/scripts/Slider.js';
import SupplementalNav from './mwf/components/supplemental-navigation/scripts/SupplementalNav.js';
import Table from './mwf/components/table/scripts/Table.js';
import Toggle from './mwf/components/toggle/scripts/Toggle.js';
import Tooltip from './mwf/components/tooltip/scripts/Tooltip.js';
import UniversalHeader from './mwf/components/universal-header/scripts/UniversalHeader.js';
import Video from './mwf/components/video/scripts/Video.js';
import bind from './vendor/bind-polyfill.js';
import {removeFocus} from './mwf/helpers.js';
import handleImgError from './mwf/handle-img-error.js';
import indexOf from './vendor/indexOf-polyfill.js';

// The getElementsByClassName method is faster than querySelectorAll but is not
// supported in ie8. If it exists, we should use it. Otherwise, use querySelectorAll
// We should switch to only using getElementsByClassName with task #6687534
if (document.getElementsByClassName) {
    var alerts              = document.querySelectorAll('.c-alert, .m-alert');
    var autoSuggests        = document.getElementsByClassName('c-auto-suggest');
    var backToTops          = document.querySelectorAll('.c-back-to-top, .m-back-to-top');
    var carousels           = document.getElementsByClassName('c-carousel');
    var checkboxes          = document.getElementsByClassName('c-checkbox');
    var combo               = document.getElementsByClassName('c-combo');
    var compareChart        = document.querySelectorAll('.c-compare-chart, .m-compare-chart');
    var contentToggles      = document.getElementsByClassName('c-content-toggle');
    var dateTimePicker      = document.getElementsByClassName('c-date-time-picker');
    var dialogs             = document.getElementsByClassName('c-dialog');
    var drawers             = document.getElementsByClassName('c-drawer');
    var files               = document.getElementsByClassName('c-file');
    var flyouts             = document.getElementsByClassName('c-flyout');
    var inPageNavigation    = document.getElementsByClassName('c-in-page-navigation');
    var pageBar             = document.getElementsByClassName('m-page-bar');
    var paginations         = document.getElementsByClassName('c-pagination');
    var pivots              = document.getElementsByClassName('c-pivot');
    var mosaicPlacement     = document.getElementsByClassName('c-mosaic-placement');
    var productPlacement    = document.getElementsByClassName('m-product-placement');
    var refineMenus         = document.getElementsByClassName('c-refine-menu');
    var selectButtons       = document.getElementsByClassName('c-select-button');
    var selectMenus         = document.querySelectorAll('.c-select-menu, .c-select-menu .c-menu-item.f-sub-menu');
    var socials             = document.querySelectorAll('.c-social, .m-social');
    var sliders             = document.getElementsByClassName('c-slider');
    var supplementalNavs    = document.getElementsByClassName('c-supplemental-nav');
    var tables              = document.getElementsByClassName('c-table');
    var toggles             = document.getElementsByClassName('c-toggle');
    var tooltips            = document.getElementsByClassName('c-tooltip');
    var universalHeaders    = document.getElementsByClassName('c-universal-header');
    var videos              = document.getElementsByClassName('c-video');
} else {
    var alerts              = document.querySelectorAll('.c-alert, .m-alert');
    var autoSuggests        = document.querySelectorAll('.c-auto-suggest');
    var backToTops          = document.querySelectorAll('.c-back-to-top, .m-back-to-top');
    var carousels           = document.querySelectorAll('.c-carousel');
    var checkboxes          = document.querySelectorAll('.c-checkbox');
    var combo               = document.querySelectorAll('.c-combo');
    var compareChart        = document.querySelectorAll('.c-compare-chart, .m-compare-chart');
    var contentToggles      = document.querySelectorAll('.c-content-toggle');
    var dateTimePicker      = document.querySelectorAll('.c-date-time-picker');
    var dialogs             = document.querySelectorAll('.c-dialog');
    var drawers             = document.querySelectorAll('.c-drawer');
    var files               = document.querySelectorAll('.c-file');
    var flyouts             = document.querySelectorAll('.c-flyout');
    var inPageNavigation    = document.querySelectorAll('.c-in-page-navigation');
    var pageBar             = document.querySelectorAll('.m-page-bar');
    var paginations         = document.querySelectorAll('.c-pagination');
    var pivots              = document.querySelectorAll('.c-pivot');
    var mosaicPlacement     = document.querySelectorAll('.c-mosaic-placement');
    var productPlacement    = document.querySelectorAll('.m-product-placement');
    var refineMenus         = document.querySelectorAll('.c-refine-menu');
    var selectButtons       = document.querySelectorAll('.c-select-button');
    var selectMenus         = document.querySelectorAll('.c-select-menu, .c-select-menu .c-menu-item.f-sub-menu');
    var socials             = document.querySelectorAll('.c-social, .m-social');
    var supplementalNavs    = document.querySelectorAll('.c-supplemental-nav');
    var tables              = document.querySelectorAll('.c-table');
    var toggles             = document.querySelectorAll('.c-toggle');
    var tooltips            = document.querySelectorAll('.c-tooltip');
    var universalHeaders    = document.querySelectorAll('.c-universal-header');
    var sliders             = document.querySelectorAll('.c-slider');
    var videos              = document.querySelectorAll('.c-video');
}

// Helper function to initialize sets of UI components obtained
// from getElementsByClassName/querySelectorAll
function initializeUI(elementList, init) {
    var storage = [];

    for (var i = 0; i < elementList.length; i++) {
        storage.push(new init(elementList[i]));
    }

    return storage;
}

// Helper function to stop initializing UI components if
// it is a child of another component
function isDescendant(childElements, parentElements) {
    if (parentElements.length > 0) {
        for (var i = 0; i < childElements.length; i++ ) {
            var node = childElements[i].parentNode;
            while (node !== null) {
                for (var j = 0; j < parentElements.length; j++ ) {
                    if (node === parentElements[i]) {
                        return true;
                    }
                    node = node.parentNode;
                }
            }
            return false;
        }
    } else {
        return false;
    }
}

// If we've found elements that correspond to our javascript components,
// initialize them.
if (alerts.length) {
    alerts = initializeUI(alerts, Alert);
}

if (autoSuggests.length) {
    autoSuggests = initializeUI(autoSuggests, AutoSuggest);
}

if (backToTops.length) {
    backToTops = initializeUI(backToTops, BackToTop);
}

if (carousels.length) {
    carousels = initializeUI(carousels, Carousel);
}

if (checkboxes.length) {
    checkboxes = initializeUI(checkboxes, Checkbox);
}

if (combo.length) {
    combo = initializeUI(combo, Combo);
}

if (compareChart.length) {
    compareChart = initializeUI(compareChart, CompareChart);
}

if (contentToggles.length) {
    contentToggles = initializeUI(contentToggles, ContentToggle);
}

if (dateTimePicker.length) {
    dateTimePicker = initializeUI(dateTimePicker, DateTimePicker);
}

if (dialogs.length) {
    dialogs = initializeUI(dialogs, Dialog);
}

if (drawers.length) {
    drawers = initializeUI(drawers, Drawer);
}

if (files.length) {
    files = initializeUI(files, File);
}

if (flyouts.length) {
    flyouts = initializeUI(flyouts, Flyout);
}

if (inPageNavigation.length) {
    inPageNavigation = initializeUI(inPageNavigation, InPageNavigation);
}

if (pageBar.length) {
    pageBar = initializeUI(pageBar, PageBar);
}

if (paginations.length) {
    paginations = initializeUI(paginations, Pagination);
}

if (pivots.length) {
    pivots = initializeUI(pivots, Pivot);
}

if (mosaicPlacement.length) {
    mosaicPlacement = initializeUI(mosaicPlacement, MosaicPlacement);
}

if (productPlacement.length) {
    productPlacement = initializeUI(productPlacement, ProductPlacement);
}

if (refineMenus.length) {
    refineMenus = initializeUI(refineMenus, RefineMenu);
}

if (selectButtons.length) {
    selectButtons = initializeUI(selectButtons, SelectButton);
}

if (selectMenus.length) {
    selectMenus = initializeUI(selectMenus, SelectMenu);
}

if (socials.length) {
    socials = initializeUI(socials, Social);
}

if (supplementalNavs.length) {
    supplementalNavs = initializeUI(supplementalNavs, SupplementalNav);
}

if (tables.length) {
    tables = initializeUI(tables, Table);
}

if (toggles.length) {
    toggles = initializeUI(toggles, Toggle);
}

if (tooltips.length) {
    tooltips = initializeUI(tooltips, Tooltip);
}

if (universalHeaders.length) {
    universalHeaders = initializeUI(universalHeaders, UniversalHeader);
}

if (sliders.length) {
    if (!isDescendant(sliders, videos)) {
        sliders = initializeUI(sliders, Slider);
    }
}

if (videos.length) {
    videos = initializeUI(videos, Video);
}

// Remove focus state from elements onclick and ontouch
removeFocus();