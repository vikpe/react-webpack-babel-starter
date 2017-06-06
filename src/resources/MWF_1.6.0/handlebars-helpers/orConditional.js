module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('orCond', function(v1, v2, v3, options) {
        if (v1 || v2 || v3 ) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
};