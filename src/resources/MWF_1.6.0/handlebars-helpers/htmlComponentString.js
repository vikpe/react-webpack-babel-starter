var minify = require('html-minifier').minify;
var beautify_html = require('js-beautify').html;

var minify_options = {
    collapseWhitespace: true
};

var beautify_options = {
    unformatted: [] // All new elements should be placed on a new line
};

module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('htmlComponentString', function(template, data, options) {
        template = template.replace(/\//g, '_');
        // Get the partial template string
        var partial_template = Handlebars.partials[template];
        var partial_compiler = null;

        if (!partial_template) {
            return "Partial not found";
        }

        if (typeof partial_template === "string") {
            partial_compiler = Handlebars.compile(partial_template);
        } else {
            partial_compiler = partial_template;
        }

        var template_string = partial_compiler(data);
        minified = minify(template_string, minify_options);
        pretty = beautify_html(minified, beautify_options);

        return pretty;
    });
};