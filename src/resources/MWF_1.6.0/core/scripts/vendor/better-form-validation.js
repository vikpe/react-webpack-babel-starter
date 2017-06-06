/**
 * better-form-validation: Form validation for better-dom
 * @version 1.4.1 Sat, 18 Oct 2014 18:16:46 GMT
 * @link https://github.com/chemerisuk/better-form-validation
 * @copyright 2014 Maksim Chemerisuk
 * @license MIT
 */
(function(DOM, VALIDITY_KEY, I18N_MISMATCH, undefined) {
    "use strict";

    var patterns = {};
    var invalidTypes = [null, "file", "image", "submit", "fieldset", "reset", "button"];

    patterns.required = /\S/;
    patterns.number = /^-?[0-9]*(\.[0-9]+)?$/;
    patterns.email = /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i;
    patterns.url = /^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#&+_\?\/\w \.\-=]*$/i;
    patterns.tel = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

    DOM.extend("[name]", function(el)  {return invalidTypes.indexOf(el.get("type")) < 0}, {
        constructor: function() {
            var type = this.get("type");

            if (type !== "checkbox" && type !== "radio") {
                this.on("input", this.onValidityCheck);
            }

            this.on("change", this.onValidityUpdate);
        },
        validity: function(errors) {var this$0 = this;
            if (errors !== undefined) {
                this.set(VALIDITY_KEY, errors);
            } else {
                errors = this.get(VALIDITY_KEY);
            }

            if (this.get("novalidate") != null) return [];

            var type = this.get("type"),
                required = this.get("required"),
                regexp, pattern, msg;

            if (typeof errors === "function") errors = errors.call(this);
            if (typeof errors === "string") errors = [errors];

            if (typeof required === "string") {
                // handle boolean attribute in browsers that do not support it
                required = required === "" || required === "required";
            }

            errors = errors || [];

            if (!errors.length) {
                switch(type) {
                case "radio":
                    if (!required) break;

                    var elements = this.closest("form").findAll("[name]"),
                        hasCheckedRadio = function(el)  {return el.get("name") === this$0.get("name") && el.get("checked")};

                    if (elements.some(hasCheckedRadio)) break;
                    /* falls through */
                case "checkbox":
                    if (required && !this.get("checked")) {
                        errors.push("can't be empty");
                    }
                    break;

                default:
                    var value = this.get("value");
                    // pattern/type validations ignore blank values
                    if (value) {
                        pattern = this.get("pattern");

                        if (pattern) {
                            // make the pattern string
                            pattern = "^(?:" + pattern + ")$";

                            if (pattern in patterns) {
                                regexp = patterns[pattern];
                            } else {
                                regexp = new RegExp(pattern);
                                // cache regexp internally
                                patterns[pattern] = regexp;
                            }

                            msg = this.get("title") || "illegal value format";
                        } else {
                            regexp = patterns[type];
                            msg = I18N_MISMATCH[type];
                        }
                    }

                    if (required && !regexp) {
                        regexp = patterns.required;
                        msg = "can't be empty";
                    }

                    if (regexp && !regexp.test(value)) {
                        errors.push(msg);
                    }
                }
            }

            return errors;
        },
        onValidityCheck: function() {
            var value = this.get(),
                maxlength = this.get("maxlength");

            if (maxlength >= 0 && value.length > maxlength) {
                this.set(value.substr(0, maxlength));
            }

            var form = DOM.constructor(this.get("form"));

            if (this.get("novalidate") != null || form.get("novalidate") != null) return;

            if (this.get("aria-invalid")) {
                var errors = this.validity();

                if (errors.length) {
                    this.fire("validity:fail", errors);
                } else {
                    this.fire("validity:ok");
                }
            }
        },
        onValidityUpdate: function() {
            var form = DOM.constructor(this.get("form"));

            if (this.get("novalidate") != null || form.get("novalidate") != null) return;

            var errors = this.validity();

            if (errors.length) {
                this.fire("validity:fail", errors);
            } else {
                this.fire("validity:ok");
            }
        }
    });

    DOM.extend("form", {
        constructor: function() {var this$0 = this;
            if (typeof this.get("noValidate") === "boolean") {
                var timeoutId;

                this.on("invalid", ["target"], function()  {
                    if (!timeoutId) {
                        timeoutId = setTimeout(function()  {
                            // trigger submit event manually
                            this$0.fire("submit");

                            timeoutId = null;
                        });
                    }

                    return false; // don't show tooltips
                });
            }

            this
                .on("submit", this.onFormSubmit)
                .on("reset", this.onFormReset);
        },
        validity: function(errors) {
            if (errors !== undefined) {
                this.set(VALIDITY_KEY, errors);
            } else {
                errors = this.get(VALIDITY_KEY);
            }

            if (this.get("novalidate") != null) return {length: 0};

            if (typeof errors === "function") errors = errors.call(this);
            if (typeof errors === "string") errors = {0: errors, length: 1};

            if (errors) {
                errors.length = errors.length || 0;
            } else {
                errors = {length: 0};
            }

            this.findAll("[name]").forEach(function(el)  {
                var name = el.get("name");

                if (!(name in errors)) {
                    errors[name] = el.validity && el.validity();
                }

                if (errors[name] && errors[name].length) {
                    errors.length += errors[name].length;
                } else {
                    delete errors[name];
                }
            });

            return errors;
        },
        onFormSubmit: function() {
            var errors = this.validity();

            if (errors.length) {
                // fire event on form level
                this.fire("validity:fail", errors);

                return false;
            }
        },
        onFormReset: function() {
            this.findAll("[name]").forEach(function(el)  {
                el.set("aria-invalid", null).popover().hide();
            });
        }
    });

    DOM.on("validity:ok", ["target", "defaultPrevented"], function(target, cancel)  {
        target.set("aria-invalid", false);

        if (!cancel) target.popover().hide();
    });

    DOM.on("validity:fail", [1, 2, "target", "defaultPrevented"], function(errors, coef, target, cancel)  {
        target.set("aria-invalid", true);

        if (cancel || !errors.length) return;

        if (target.matches("form")) {
            Object.keys(errors).forEach(function(name, index)  {
                target.find("[name=\"" + name + "\"]")
                    .fire("validity:fail", errors[name], index + 1);
            });
        } else {
            var popover = target.popover(void 0, "left", "bottom"),
                delay = 0;

            // hiding the tooltip to show later with a small delay
            if (!popover.hasClass("better-validity-tooltip")) {
                popover.addClass("better-validity-tooltip");

                popover.on("click", function()  {
                    target.fire("focus");
                    // hide with delay to fix issue in IE10-11
                    // which trigger input event on focus
                    setTimeout(function()  { popover.hide() }, delay);
                });
            }
            // set error message
            popover.l10n(typeof errors === "string" ? errors : errors[0]);

            delay = popover.hide().css("transition-duration");

            if (coef && delay) {
                // parse animation duration value
                delay = parseFloat(delay) * (delay.slice(-2) === "ms" ? 1 : 1000);
                // use extra delay for each next form melement
                delay = delay * coef / target.get("form").length;
            }

            // use a small delay if several tooltips are going to be displayed
            setTimeout(function()  { popover.show() }, delay);
        }
    });
}(window.DOM, "_validity", {
    email: "should be a valid email",
    url: "should be a valid URL",
    tel: "should be a valid phone number",
    number: "should be a numeric value"
}));

DOM.importStyles(".better-validity-tooltip", "position:absolute;cursor:pointer;color:#ff3329;background:#FFF;font-weight:700;text-transform:uppercase;font-size:.75em;line-height:1;padding:.5em;border:1px solid;border-radius:.25em;-webkit-box-shadow:0 0 .25em;box-shadow:0 0 .25em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:.925;-webkit-transform:scale(1,1);-ms-transform:scale(1,1);transform:scale(1,1);-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;-webkit-transition:.3s ease-in-out;transition:.3s ease-in-out;-webkit-transition-property:-webkit-transform,opacity;transition-property:transform,opacity");
DOM.importStyles(".better-validity-tooltip[aria-hidden=true]", "opacity:0;-webkit-transform:scale(2,2);-ms-transform:scale(2,2);transform:scale(2,2)");
DOM.importStyles("input[aria-invalid]", "background:none no-repeat right center / auto 100% content-box");
DOM.importStyles("input[aria-invalid=false]", "background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxwYXRoIGZpbGw9IiM0MkIzMDAiIGQ9Ik0xNiAzYy03LjE4IDAtMTMgNS44Mi0xMyAxM3M1LjgyIDEzIDEzIDEzIDEzLTUuODIgMTMtMTMtNS44Mi0xMy0xMy0xM3pNMjMuMjU4IDEyLjMwN2wtOS40ODYgOS40ODVjLTAuMjM4IDAuMjM3LTAuNjIzIDAuMjM3LTAuODYxIDBsLTAuMTkxLTAuMTkxLTAuMDAxIDAuMDAxLTUuMjE5LTUuMjU2Yy0wLjIzOC0wLjIzOC0wLjIzOC0wLjYyNCAwLTAuODYybDEuMjk0LTEuMjkzYzAuMjM4LTAuMjM4IDAuNjI0LTAuMjM4IDAgMGwzLjY4OSAzIDcuNzU2LTcuNzU2YzAuMjM4LTAuMjM4IDAuNjI0LTAuMjM4IDAgMGwxLjI5NCAxLjI5NGMwLjIzOSAwIDAgMCAwIDAuODYyeiIvPjwvc3ZnPg==)");
DOM.importStyles("input[aria-invalid=true]", "background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxwYXRoIGZpbGw9IiNGRjMzMjkiIGQ9Ik0xNS41IDMuNWMtNy4xOCAwLTEzIDUuODItMTMgMTNzNS44MiAxMyAxMyAxMyAxMy01LjgyIDEzLTEzLTUuODItMTMtMTMtMTN6TTE1LjUgMjMuODc1Yy0wLjgyOSAwLTEuNS0wLjY3Mi0xLjUtMS41czAuNjcxLTEuNSAxLjUtMS41YzAuODI4IDAgMSAwIDEgMS41cy0wLjY3MiAxLjUtMS41IDEuNXpNMTcgMTcuMzc1YzAgMC44MjgtMC42NzIgMS41LTEuNSAxLjUtMC44MjkgMC0xLjUtMC42NzItMS41LTEuNXYtN2MwLTAuODI5IDAuNjcxLTEuNSAxLjUtMS41IDAgMCAxIDAgMSAxLjV2N3oiLz48L3N2Zz4=)");
DOM.importStyles("input[aria-invalid][type=checkbox],input[aria-invalid][type=radio]", "background:none");
DOM.importStyles("input[aria-invalid]::-ms-clear,input[aria-invalid]::-ms-reveal", "display:none");
DOM.importStyles(":invalid", "outline:inherit;-webkit-box-shadow:inherit;box-shadow:inherit");
