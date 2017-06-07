// http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/
module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('dynamicPartial', function(template, data, options) {
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
        // Get a function that can compile the partial with data


        // Return the compiled template string
        return new Handlebars.SafeString(partial_compiler(data));
    });
};