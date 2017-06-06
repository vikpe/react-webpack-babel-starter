// Source: https://gist.github.com/ShirtlessKirk/662c80f6d7335017fa46
//
// Polyfill of ES5 Array methods for IE < 9
//
// global define: false, module: false
// jslint bitwise: true, forin: true
(function arrayModule(definition) { // non-exporting module magic dance
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
}(function arrayPolyfill() {
    'use strict';

    var
        arrayPrototypeFunctions,
        arrayPrototypeFunctionsEnum = {
            EVERY: 'every',
            FILTER: 'filter',
            FOREACH: 'forEach',
            INDEXOF: 'indexOf',
            LASTINDEXOF: 'lastIndexOf',
            MAP: 'map',
            REDUCE: 'reduce',
            REDUCERIGHT: 'reduceRight',
            SOME: 'some'
        },
        hasOwnProperty = Object.prototype.hasOwnProperty,
        keys = Object.keys || function keys(object) {
            var
                array = [],
                key;

            for (key in object) {
                if (hasOwnProperty.call(object, key)) {
                    array.push(key);
                }
            }

            return array;
        },
        noop = function noop() {
            return true;
        },
        toString = Object.prototype.toString, // paranoia: some dumb script might redefine the prototype....
        T = TypeError;

    /**
     * @private
     * @param {Function} fn The function to verify
     * @return {Object}
     */
    function check(fn) {
        if (this === null || this === undefined) {
            throw new T('Array is null or undefined');
        }

        if (typeof fn !== 'function') {
            throw new T(fn + ' is not a function');
        }

        return ({}).valueOf.call(this); // box `this` to make sure it's an object (see: http://www.2ality.com/2011/04/javascript-converting-any-value-to.html)
    }

    /**
     * Array.prototype.reverse is a mutating function, so to keep the original unchanged a copy needs to be made
     * We don't use the simpler <array>.slice(0) method as that doesn't preserve sparse array contents
     * @private
     * @param {Array} array The array to reverse
     * @return {Array}
     */
    function reverse(array) {
        var
            object = ({}).valueOf.call(array), // box the parameter to ensure it's an object in a way that jslint doesn't grumble about
            length = object.length >>> 0,
            cursor = length - 1,
            index = 0,
            result = new Array(length); // jslint complains about using `new Array`, but declaring the container bounds is quicker than pushing to an index

        while (cursor > -1) {
            if (cursor in object) { // only set value in result if original contains value at cursor
                result[index] = object[cursor];
            }

            cursor -= 1;
            index += 1;
        }

        return result;
    }

    /**
     * @private
     * @param {Function} fn The function to run for each iteration
     * @param {?Object|undefined} context The context to run the iteration function in
     * @param {string} type The related type for checking yielded values
     */
    function iterator(fn, context, type) {
        var
            counter,
            length,
            object,
            result,
            value;

        fn = fn || noop;
        object = check.call(this, fn);
        length = object.length >>> 0;
        counter = 0;

        if (type === arrayPrototypeFunctionsEnum.FILTER) { // set up return array
            result = [];
        }

        if (type === arrayPrototypeFunctionsEnum.INDEXOF) { // check fromIndex value and adjust cursor
            result = -1; // default to 'not found' value
            if (context.fromIndex > length) {
                return result;
            }

            counter = Math.max(context.fromIndex >= 0 ? context.fromIndex : length - Math.abs(context.fromIndex), 0);
        }

        if (type === arrayPrototypeFunctionsEnum.LASTINDEXOF) { // check fromIndex value and adjust length
            if (context.fromIndex !== 0) {
                if (context.fromIndex > 0) { // setting endpoint of range from beginning
                    if (context.fromIndex < length) {
                        length = context.fromIndex;
                    }
                } else { // setting endpoint of range from end
                    length -= Math.abs(context.fromIndex);
                    if (length < 1) {
                        return -1;
                    }
                }
            }

            if (context.fromIndex > 0) {
                return iterator.call(this.slice(0, length), null, { fromIndex: 0, search: context.search }, arrayPrototypeFunctionsEnum.LASTINDEXOF);
            }

            result = iterator.call(reverse(this.slice(0, length)), null, context, arrayPrototypeFunctionsEnum.INDEXOF);
            if (result !== -1) {
                result = (length - 1) - result;
            }

            return result;
        }

        if (type === arrayPrototypeFunctionsEnum.MAP) { // set up return array
            result = new Array(length);
        }

        if (type === arrayPrototypeFunctionsEnum.REDUCE || type === arrayPrototypeFunctionsEnum.REDUCERIGHT) { // check for initialValue and set return value
            if (length === 0 && !hasOwnProperty.call(context, 'initialValue')) {
                throw new T('Reduce of empty array with no initial value');
            }

            if (type === arrayPrototypeFunctionsEnum.REDUCERIGHT) {
                return iterator.call(reverse(this.slice(0, length)), fn, { initialValue: context.initialValue }, arrayPrototypeFunctionsEnum.REDUCE);
            }

            result = context.initialValue;
        }

        while (counter < length) {
            if (counter in object) { // don't bother with sparse entries
                value = object[counter];

                if (type === arrayPrototypeFunctionsEnum.EVERY && !fn.call(context, value, counter, object)) { // falsey value check
                    return false;
                }

                if (type === arrayPrototypeFunctionsEnum.FILTER && fn.call(context, value, counter, object)) { // truthy value check
                    result.push(value);
                }

                if (type === arrayPrototypeFunctionsEnum.FOREACH) { // unlike jQuery.each this puppy doesn't care about the return value of fn
                    fn.call(context, value, counter, object);
                }

                if (type === arrayPrototypeFunctionsEnum.INDEXOF && context.search === value) { // absolute equivalence check
                    return counter;
                }

                if (type === arrayPrototypeFunctionsEnum.MAP) { // map to exact same index
                    result[counter] = fn.call(context, value, counter, object);
                }

                if (type === arrayPrototypeFunctionsEnum.REDUCE) {
                    result = (result === undefined && value !== undefined)
                        ? value // if no initialValue then result is first (valid) value
                        : fn(result, value, counter, object);
                }

                if (type === arrayPrototypeFunctionsEnum.SOME && fn.call(context, value, counter, object)) { // truthy value check
                    return true;
                }
            }

            counter += 1;
        }

        return (result !== undefined) // `filter`, `indexOf`, `lastIndexOf`, `map`, `reduce` and `reduceRight` set result
            ? result
            : (type !== arrayPrototypeFunctionsEnum.SOME); // if using `every` or `forEach` then true, if using `some` then false
    }

    /**
     * @param {Function} fn The function to run for each iteration
     * @param {Object} [context] The context to run the function in (optional)
     */
    function every(fn, context) {
        return iterator.call(this, fn, context, arrayPrototypeFunctionsEnum.EVERY);
    }

    /**
     * @param {Function} fn The function to run for each iteration
     * @param {Object} [context] The context to run the function in (optional)
     */
    function filter(fn, context) {
        return iterator.call(this, fn, context, arrayPrototypeFunctionsEnum.FILTER);
    }

    /**
     * @param {Function} fn The function to run for each iteration
     * @param {Object} [context] The context to run the function in (optional)
     */
    function forEach(fn, context) {
        iterator.call(this, fn, context, arrayPrototypeFunctionsEnum.FOREACH);
    }

    /**
     * @param {?(boolean|number|string)} search The primitive value to search for
     * @param {number} [fromIndex=0] fromIndex The index to start searching from (optional, default 0)
     */
    function indexOf(search, fromIndex) {
        return iterator.call(this, null, { fromIndex: fromIndex | 0, search: search }, arrayPrototypeFunctionsEnum.INDEXOF);
    }

    /**
     * @param {?(boolean|number|string)} search The primitive value to search for
     * @param {number} [fromIndex=0] fromIndex The index to start searching from (optional, default 0)
     */
    function lastIndexOf(search, fromIndex) {
        return iterator.call(this, null, { fromIndex: fromIndex | 0, search: search }, arrayPrototypeFunctionsEnum.LASTINDEXOF);
    }

    /**
     * @param {Function} fn The function to run for each iteration
     * @param {Object} [context] The context to run the function in (optional)
     */
    function map(fn, context) {
        return iterator.call(this, fn, context, arrayPrototypeFunctionsEnum.MAP);
    }

    /**
     * @param {Function} fn The function to run for each iteration
     * @param {*} [initialValue] The initial value for the reduction (optional)
     */
    function reduce(fn, initialValue) {
        return iterator.call(this, fn, initialValue !== undefined ? { initialValue: initialValue } : {}, arrayPrototypeFunctionsEnum.REDUCE);
    }

    /**
     * @param {Function} fn The function to run for each iteration
     * @param {*} [initialValue] The initial value for the reduction (optional)
     */
    function reduceRight(fn, initialValue) {
        return iterator.call(this, fn, initialValue !== undefined ? { initialValue: initialValue } : {}, arrayPrototypeFunctionsEnum.REDUCERIGHT);
    }

    /**
     * @param {Function} fn The function to run for each iteration
     * @param {Object} [context] The context to run the function in (optional)
     */
    function some(fn, context) {
        return iterator.call(this, fn, context, arrayPrototypeFunctionsEnum.SOME);
    }

    /**
     * @param {*} object The object to check
     */
    function isArray(object) {
        return toString.call(object) === '[object Array]';
    }

    arrayPrototypeFunctions = {
        every: every,
        filter: filter,
        forEach: forEach,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        map: map,
        reduce: reduce,
        reduceRight: reduceRight,
        some: some
    };

    /**
     * Delegates a method from the arrayPrototypeFunctions object if it doesn't exist on `this`
     * @param {string} fnName The function name to verify
     */
    function dogfood(fnName) {
        if (!hasOwnProperty.call(this, fnName)) {
            this[fnName] = arrayPrototypeFunctions[fnName];
        }
    }

    forEach.call(keys(arrayPrototypeFunctions), dogfood, Array.prototype);

    // static methods
    if (Array.isArray === undefined) {
        Array.isArray = isArray;
    }
}));