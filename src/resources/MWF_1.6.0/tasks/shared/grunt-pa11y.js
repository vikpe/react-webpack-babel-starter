/**
*  grunt-pa11y.js - Wraps the pa11y accessibility testing tool in a nice grunt burrito.
*
*  For more information see https://github.com/nature/pa11y
*  Inspired by grunt-pa11y: https://github.com/cbaigorri/grunt-pa11y
*  Pa11y was chosen for utilizing HTML_CodeSniffer which validates for both Section508 and WCAG2AA
*
*  Grunt task options: https://github.com/nature/pa11y 
*/
var task = function(grunt){
    grunt.registerMultiTask('pa11y', function(){
        var done = this.async();
        
        var pa11y = require('pa11y'),    
            reporter = require('pa11y/reporter/cli'),
            async = require('async');
        
        // Options
        var options = this.options({
            standard: 'WCAG2AA',
            level: ['error', 'warning'],
            htmlcs: 'http://squizlabs.github.io/HTML_CodeSniffer/build/HTMLCS.js'
        });
         
        if(typeof options.urls === 'string'){
            options.urls = [options.urls];
        }

        if(typeof options.level === 'string'){
            options.level = [options.level];
        }

        // Test
        var hasAccessibilityErrors = false;
        
        var test = pa11y(options);

        async.eachSeries(options.urls, function(url, callback){ 
            test.run(url, function(err, results){
                if (err){
                    callback(err);
                }

                reporter.results(results, url);

                hasAccessibilityErrors = results.some(function(result){
                    return options.level.some(function(level){
                        return result.type === level;
                    });
                });

                callback();
            });
        }, 
        function(err){
            if(err){
                grunt.log.error(err);
                done(false);
            }
            if (hasAccessibilityErrors){
                grunt.log.error('The test failed with accessibility errors');
                done(false);
            }
            done();
        });
    });
};

module.exports = task;