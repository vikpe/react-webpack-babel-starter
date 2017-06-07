// Helper to allow the use of operators for values in handlebars
// Mainly used in conjunction with 'if', instead of always evaluating to true/false,
// This allows values to be compared. (example in pagination partial)
// Usage: eq val1 val2 (determines if values are equal to each other)

module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper({
        eq: function (v1, v2) {
            return v1 === v2;
        },
        ne: function (v1, v2) {
            return v1 !== v2;
        },
        lt: function (v1, v2) {
            return v1 < v2;
        },
        gt: function (v1, v2) {
            return v1 > v2;
        },
        lte: function (v1, v2) {
            return v1 <= v2;
        },
        gte: function (v1, v2) {
            return v1 >= v2;
        },
        and: function (v1, v2) {
            return v1 && v2;
        },
        or: function (v1, v2) {
            return v1 || v2;
        }
    });
};