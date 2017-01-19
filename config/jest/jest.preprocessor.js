const babelJest = require('babel-jest');

module.exports = {
    process(src, path) {
        const isJsFile = (path.endsWith('.js') || path.endsWith('.jsx'));

        if ( isJsFile ) {
            return babelJest.process(src, path);
        }
        else {
            return src;
        }
    },
};
