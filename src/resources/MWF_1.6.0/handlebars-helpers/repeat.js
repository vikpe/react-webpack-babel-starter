// Helper to repeat n number of times, useful in cases where an array is not needed.
// Instead of iterating over a JSON array just repeat n times. (see pagination partial for sample usage)
// Also allows access to the index value with @index

module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper("repeat", function (times, opts) {
        var out = "";
        var i;
        var data = {};

        if ( times ) {
            for ( i = 0; i < times; i += 1 ) {
                data.index = i;
                out += opts.fn(this, {
                    data: data
                });
            }
        } else {

            out = opts.inverse(this);
        }

        return out;
    });
};