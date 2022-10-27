module.exports = (grunt) => {

    "use strict";

    // Set Date for a zip folder
    var d = new Date();
    var todayDate = (d.getDate() < 10) ? '0' + d.getDate().toString() : d.getDate().toString();
    var thisYear = d.getFullYear();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var thisMonth = months[d.getMonth()];
    var time24Format = d.getHours() + '' + d.getMinutes();
    var folderName = todayDate + thisMonth + thisYear + time24Format;



    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        meta: {
            banner: "/*!\n * <%= pkg.name %>\n * <%= pkg.description %>\n * @version <%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd\') %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n */\n"
        },
        jshint: {
            all: {
                src: ["app/*.js"],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        },
        apidoc: {
            matchstick: {
                src: 'app/',
                dest: 'apiDoc/',
                // template: 'apidoc-template/',
                options: {
                    debug: true,
                    log: true,
                    excludeFilters: ["node_modules/", "src"]
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: folderName + '.zip',
                    level: 4,
                    pretty: true
                },
                files: [
                    { src: ['routes/*', 'public/*', 'app/*', 'server.js', 'package.json', 'Gruntfile.js', '.hgignore', 'process.json'], dest: folderName, store: false } // includes files in path
                ]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: 5000,
                    colors: true,
                    captureFile: 'logs/test_results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/*.js']
            }
        }
    });

    // Load grunt tasks from npm packages
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-apidoc");
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-mocha-test');


    // task.
    // grunt.registerTask("default", ["mochaTest", "jshint", "apidoc", "compress"]);
    // grunt.registerTask("production", ["mochaTest", "jshint", "apidoc", "compress"]);
    grunt.registerTask("default", ["apidoc"]);


};
