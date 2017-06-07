//http://stackoverflow.com/questions/11924452/iterating-over-basic-for-loop-using-handlebars-js
module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i < to; i += incr) {
            accum += block.fn(i);
        }
        return accum;
    });
}