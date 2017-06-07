// https://github.com/assemble/grunt-assemble/issues/22
// There is currently a bug in Assemble where the {{#each array}} does not
// create the @index, @key, and @first variables when it used inside
// of a partial file.
module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('eachInPartial', function(array, options) {
        var buffer = '';
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            item.index = i + 1;
            buffer += options.fn(item);
        }

        return buffer;
    });
};