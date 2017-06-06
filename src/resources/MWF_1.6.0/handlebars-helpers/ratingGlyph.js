module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('ratingGlyph', function(rating, low, high, options) {
        if (rating > low && rating < high) {
            return "f-half";
        } else if (rating >= high) {
            return "f-full";
        } else {
            return "f-none";
        }
    });
};