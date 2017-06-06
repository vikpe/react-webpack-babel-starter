// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('commaSeparatedNumber', function(options) {
        var sum = 0;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "number") {
                sum += arguments[i];
            }
        }

        return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
};