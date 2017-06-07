module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('vp', function(index, modifier) {
        var breakpoints = [320, 540, 768, 1084, 1400, 1779];

        if (typeof index !== 'number') {
            throw new TypeError("Breakpoint index must be a number between 1 and " + breakpoints.length);
        }

        var breakpoint = null;

        switch (modifier) {
            case 'max':
                breakpoint = breakpoints[index] - 1;
                break;
            default:
                breakpoint = breakpoints[index - 1];
        }

        return breakpoint;
    });
};