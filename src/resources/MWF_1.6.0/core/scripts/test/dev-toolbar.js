"use strict";
/* ==========================================================================
 MwfToolbar:
    This is a development aid to assist in developing and debugging components.
    To extend the toolbar with menu items, create a new method on the toolbar
    that returns a button element configured to run whatever scripts necessary,
    and then append that button to `toolbarItems` inside of the
    `assignToolbarActions` method.
========================================================================== */
var Stylesheet = function () {
    /*jslint browser:true */
    this.element = null;

    this.toggleTheme = function () {
        var theme = this.isDefaultTheme() ? "alt" : "default";
        this.element.setAttribute("data-theme", theme);
    };

    this.setDirection = function (direction) {
        this.element.setAttribute("data-dir", direction);
    };

    this.isDefaultTheme = function () {
        return this.element.getAttribute("data-theme") === "default";
    };

    this.isLTR = function () {
        return this.element.getAttribute("data-dir") === "ltr";
    };

    this.getMarket = function () {
        return this.element.getAttribute("data-market");
    };

    this.setMarket = function (market) {
        return this.element.setAttribute("data-market", market);
    };

    this.getDir = function () {
        return this.element.getAttribute("data-dir");
    };

    this.getTheme = function () {
        return this.element.getAttribute("data-theme");
    };

    this.getPartner = function () {
        return this.element.getAttribute("data-partner");
    };

    /**
    *  If the market and the direction do not match (eg arabic in ltr) then update the
    *  css filepath with the fallback. eg. arabic in ltr may fall back to ltr-west-european market
    *  or a similar ltr market. In this case, the fonts will likely be wrong, but layout should
    *  still be accurate.
    */
    this.updateCssWithFallbackPath = function () {
        var defaultStyleSheetPathByThemeDir = this.element.getAttribute('data-' + this.getTheme() + '-' + this.getDir());
        this.element.setAttribute("href", defaultStyleSheetPathByThemeDir);
    };

    this.isIe8 = document.getElementById("primary-stylesheet-ie8") ? true : false;

    this.updateCssFilePath = function () {
        var filePath = '/css/' + this.getMarket() + "-" + this.getTheme();
        filePath += this.isIe8 ? "-ie8.css" : ".css";
        this.element.setAttribute("href", filePath);
    };

    this.marketMatchesDirection = function () {
        // same as String.startsWith... because startsWith() not available in ie8/android
        return this.getMarket().split("-")[1].indexOf(this.getDir()) === 0;
    };

    this.init = function () {
        this.element = this.isIe8 ?
                document.getElementById("primary-stylesheet-ie8") :
                document.getElementById("primary-stylesheet");

        // Set Direction from local storage
        if(localStorage.getItem('langDir')) {
            if(this.getDir() !== localStorage.getItem('langDir')) {
                //Switch to localStorage dir
                var defaultBdo = document.getElementsByTagName("html")[0];
                defaultBdo.setAttribute("dir", localStorage.getItem('langDir'));
                this.setDirection(localStorage.getItem('langDir'));

                //Market and dir might not match so pull the default rtl/ltr.
                if (this.marketMatchesDirection()) {
                    this.updateCssFilePath();
                } else {
                    var market = null;
                    if (this.getDir()==="rtl") {
                        market = this.getPartner() + '-rtl-arabic';
                    } else {
                        market = this.getPartner() + '-ltr-west-european';
                    }
                    this.setMarket(market);
                    MwfToolbar.previousMarket = null;
                }
            }
        } else {
            localStorage.setItem('langDir', this.getDir());
        }

        return this;
    };

    return this.init();
};

function MwfToolbar() {
    var partner = stylesheet.getPartner();
    /*global google*/ //jslint hint

    this.toolbarItems = [];
    this.language = "English";

    // Map Google translate languages to OneUI markets
    var languageToMarketMap = {
        "Arabic" : partner + "-rtl-arabic",
        "Armenian" : partner + "-ltr-armenian",
        "Azerbaijani" : partner + "-ltr-east-european",
        "Chinese (Simplified)" : partner + "-ltr-chinese-simplified",
        "Chinese (Traditional)" : partner + "-ltr-chinese-traditional",
        "English" : partner + "-ltr-west-european",
        "Finnish" : partner + "-ltr-west-european",
        "French" : partner + "-ltr-west-european",
        "Georgian" : partner + "-ltr-georgian",
        "German" : partner + "-ltr-west-european",
        "Greek" : partner + "-ltr-greek",
        "Hebrew" : partner + "-rtl-hebrew",
        "Hindi" : partner + "-ltr-indian",
        "Japanese" : partner + "-ltr-japanese",
        "Korean" : partner + "-ltr-korean",
        "Mongolian" : partner + "-ltr-cyrillic",
        "Persian" : partner + "-rtl-arabic",
        "Polish": partner + "-ltr-east-european",
        "Russian" : partner + "-ltr-cyrillic",
        "Spanish" : partner + "-ltr-west-european",
        "Thai" : partner + "-ltr-thai",
        "Turkish": partner + "-ltr-east-european",
        "Vietnamese" : partner + "-ltr-vietnamese"
    };

    /**
    * Builds the select button for the Google Translate
    */
    this.getTranslateSelectButton = function () {
        var toggleDiv = document.createElement("div"),
            style = {
                element: document.createElement("style"),
                content: '#google_translate_element {display: inline-block;} #google_translate_element .goog-te-gadget-simple {padding: 8px 4px 7px; border: 1px solid black; background-color: transparent;}'
            },
            script = document.createElement("script"),
            initFunction = {
                element: document.createElement("script"),
                content: this.googleTranslateElementInit
            };

        toggleDiv.setAttribute("id", "google_translate_element");

        script.src = "http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        try {
            // doesn't work on ie...
            initFunction.element.appendChild(document.createTextNode(initFunction.content));
        } catch (e) {
            // IE has funky script nodes
            initFunction.element.text = initFunction.content;
        }

        try {
            style.element.appendChild(document.createTextNode(style.content));
        } catch (e) {
            style.element.text = style.content;
        }

        document.body.appendChild(script);
        document.body.appendChild(initFunction.element);
        document.body.appendChild(style.element);

        return toggleDiv;
    };

    /**
    * Callback for Google translate - this is called and initializes the Google translate button.
    */
    this.googleTranslateElementInit = function googleTranslateElementInit() {
        google.translate.TranslateElement({
            pageLanguage: "en",
            includedLanguages: 'ar,hy,az,zh-CN,zh-TW,en,fi,fr,ka,de,el,iw,hi,ja,ko,mn,fa,pl,ru,es,th,tr,vi',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, "google_translate_element");
    };

    this.getLanguageFromToolbar = function () {
        if (document.querySelectorAll('.goog-te-menu-value span')[0] !== null && document.querySelectorAll('.goog-te-menu-value span')[0] !== undefined) {
            return document.querySelectorAll('.goog-te-menu-value span')[0].innerHTML;
        }
    };

    /**
    * Watches the google translate button and detects when the language is changed.
    * The current translation language lives in a obfuscated variable in an iframe
    * so we need to poll the DOM for changes.
    */
    this.watchForLanguageChange = function () {
        var that = this;
        setInterval(function () {
            var toolbarLanguage = that.getLanguageFromToolbar();
            if (toolbarLanguage && toolbarLanguage !== "Select Language" && that.language !== toolbarLanguage) {
                that.language = toolbarLanguage;
                that.handleLanguageChange();
            }
        }, 250);
    };

    /**
    * Event handler for Language Changed
    * Handles cases where the market does not support ltr/rtl.
    */
    this.handleLanguageChange = function () {
        var market = languageToMarketMap[this.getLanguageFromToolbar()];

        if (!market) {
            return;
        }

        stylesheet.setMarket(market);

        // markets might not match current dir.
        if (!stylesheet.marketMatchesDirection()) {
            this.toggleDirection();
        }
        localStorage.setItem('langDir', stylesheet.getDir());

        // dir and market are in sync, so we can clean the previousMarket
        this.previousMarket = null;

        stylesheet.updateCssFilePath();
    };

    /**
    * Provide a toolbar button that toggles the theme
    */
    this.getToggleThemeButton = function () {
        var toggleButton = document.createElement("button");

        toggleButton.innerHTML = "Toggle theme";
        toggleButton.setAttribute("class", "c-button notranslate");

        toggleButton.onclick = function () {
            stylesheet.toggleTheme();

            // Market and dir might not match so pull the default rtl/ltr alt theme.
            if (stylesheet.marketMatchesDirection()) {
                stylesheet.updateCssFilePath();
            } else {
                stylesheet.updateCssWithFallbackPath();
            }
        };

        return toggleButton;
    };

    /*
    * Provide a toolbar button to allow switching the BDO (Bi-directional override) for Language
    * to account for RTL (Right to left) and LTR (left to right) language sets.
    */
    this.getToggleDirectionButton = function () {
        var that = this,
            toggleButton = document.createElement("button"),
            defaultBdo = document.getElementsByTagName("html")[0];

        defaultBdo.setAttribute("dir", stylesheet.getDir());
        toggleButton.setAttribute("id", "toggle-dir-button");
        toggleButton.setAttribute("class", "c-button notranslate hide-button");
        toggleButton.innerHTML = "Toggle "+ stylesheet.getDir().split('').reverse().join('').toUpperCase();
        toggleButton.onclick = function () {
            that.toggleDirection();

            // Update local storage and reload the page
            localStorage.setItem('langDir', stylesheet.getDir());
            location.reload();
        };
        return toggleButton;
    };

    /*
    * Toggle the direction associated with the page for both the BDO
    * and the stylesheet
    */
    this.toggleDirection = function () {
        var defaultBdo = document.getElementsByTagName("html")[0],
            dir = stylesheet.getDir(),
            primaryDir = "ltr",
            secondaryDir = "rtl";

        document.getElementById('toggle-dir-button').innerHTML = "Toggle " + dir.toUpperCase();
        if (dir !== null) {
            dir = dir === primaryDir ? secondaryDir : primaryDir;
        } else {
            dir = primaryDir;
        }

        defaultBdo.setAttribute("dir", dir);
        stylesheet.setDirection(dir);
    };

    /*
    * Places the various buttons into the toolbar object.
    */
    this.assignToolbarActions = function () {
        this.toolbarItems.push(this.getToggleThemeButton());
        this.toolbarItems.push(this.getToggleDirectionButton());
        this.toolbarItems.push(this.getTranslateSelectButton());
    };

    /*
    * Build the toolbar
    */
    this.createToolbar = function () {
        // Create stylesheet
        var style = document.createElement('style');
        style.innerHTML = '.dev-toolbar button.hide-button { display: none; } .dev-toolbar { position: fixed; z-index: 2; bottom: 0; left: 0; width: 100%; padding: 4px 0; margin: 0; } .dev-toolbar button, .dev-toolbar div { margin: 0 4px 0 0; }';
        document.getElementsByTagName('head')[0].appendChild(style);

        // Create Toolbar Element
        var toolbar = document.createElement("menu");
        toolbar.setAttribute("dir", "ltr"); // Prevent buttons from jumping around when RTL is toggled
        toolbar.setAttribute("class", "theme-light dev-toolbar");
        document.body.appendChild(toolbar);

        this.assignToolbarActions();

        for (var i = 0; i < this.toolbarItems.length; ++i) {
            toolbar.appendChild(this.toolbarItems[i]);
        }

        // Add padding to the bottom of the body equal to the height of the toolbar so we can scroll
        document.body.setAttribute("style", "padding-bottom:" + (toolbar.offsetHeight + 48) + "px;");
    };

    // Init on instantiation
    this.createToolbar();
    this.watchForLanguageChange();
    return this;
}

var stylesheet = new Stylesheet();
var toolbar = new MwfToolbar();