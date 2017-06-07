// Source: https://gist.github.com/ShirtlessKirk/ba797df9ccd8156b5948
//
// @preserve Function.bind polyfill for IE8
//
// global define: false, module: false
(function functionModule(definition) { // non-exporting module magic dance
    'use strict';

    var
        amd = 'amd',
        exports = 'exports'; // keeps the method names for CommonJS / AMD from being compiled to single character variable

    if (typeof define === 'function' && define[amd]) {
        define(function definer() {
            return definition();
        });
    } else if (typeof module === 'function' && module[exports]) {
        module[exports] = definition();
    } else {
        definition();
    }
}(function functionPolyfill() {
    'use strict';

    var
        slice = Array.prototype.slice;

    if (Function.prototype.bind) {
        return;
    }

    function bind(context) {
        var
            args = slice.call(arguments, 1),
            self = this;

        function Noop() { // this has to be internal to ensure that the prototype stays specific to the context
            return this;
        }

        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        function bound() {
            return self.apply(this instanceof Noop ? this : context, args.concat(slice.call(arguments)));
        }

        Noop.prototype = this.prototype;
        bound.prototype = new Noop();

        return bound;
    }

    Function.prototype.bind = bind;
}));