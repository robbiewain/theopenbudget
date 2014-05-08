// Generated on 2014-05-06 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '<%= config.dist %>/scripts/*',
                        '<%= config.dist %>/styles/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ['<%= config.app %>/index.html'],
                exclude: ['bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js']
            },
            sass: {
                src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}']
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '<%= config.dist %>/images/{,*/}*.*',
                        '<%= config.dist %>/styles/fonts/{,*/}*.*',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //     dist: {
        //         files: {
        //             '<%= config.dist %>/styles/main.css': [
        //                 '.tmp/styles/{,*/}*.css',
        //                 '<%= config.app %>/styles/{,*/}*.css'
        //             ]
        //         }
        //     }
        // },
        // uglify: {
        //     dist: {
        //         files: {
        //             '<%= config.dist %>/scripts/scripts.js': [
        //                 '<%= config.dist %>/scripts/scripts.js'
        //             ]
        //         }
        //     }
        // },
        // concat: {
        //     dist: {}
        // },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*'
                    ]
                }]
            },
            data: {
                src: '.tmp/data/budget.json',
                dest: '<%= config.dist %>/data/budget.json'
            },
            csv: {
                src: '<%= config.app %>/data/budget.csv',
                dest: '<%= config.dist %>/data/budget.csv'
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        rsync: {
            options: {
                args: ['--verbose'],
                exclude: ['.git*','*.scss','node_modules'],
                recursive: true
            },
            dist: {
                options: {
                    src: '<%= config.dist %>/',
                    dest: '/home/ubuntu/theopenbudget',
                    host: 'theopenbudget',
                    syncDestIgnoreExcl: true
                }
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'sass:server',
                'copy:styles',
                'copy:data'
            ],
            dist: [
                'sass',
                'copy:styles',
                'copy:data',
                'copy:csv',
                'imagemin',
                'svgmin'
            ]
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                loadPath: [
                    'bower_components'
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: ['*.scss'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: ['*.scss'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            }
        },

        convert: {
            options: {
                explicitArray: false,
            },
            csv2json: {
                src: '<%= config.app %>/data/budget.csv',
                dest: '.tmp/data/budgetcsv.json'
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'convert',
            'processJSON',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'convert',
        'processJSON',
        'copy:dist',
        'copy:data',
        'copy:csv',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);

    grunt.registerTask('deploy', [
        'default',
        'rsync:dist'
    ]);

    grunt.loadNpmTasks('grunt-convert');
    grunt.loadNpmTasks('grunt-rsync');

    grunt.registerTask('processJSON', 'A task that creates a hierarchial json format.', function() {
        var src = '.tmp/data/budgetcsv.json';
        var dest = '.tmp/data/budget.json';
        var csvData = JSON.parse(grunt.file.read(src));
        var data = {
            name: 'total',
            value1213: 0,
            value1314: 0,
            value1415: 0,
            value1516: 0,
            value1617: 0,
            children: []
        };

        function lookup(arr, name) {
            for(var i = 0, len = arr.length; i < len; i++) {
                if(arr[i].name === name) {
                    return true;
                }
            }
            return false;
        }

        csvData.forEach(function(row) {
            var portfolio = row.Portfolio;
            var department = row['Department/Agency'];
            var outcome = row.Outcome;
            var program = row.Program;
            var expenseType = row['Expense type'];
            var appropriationType = row['Appropriation type'];
            var description = row.Description || 'Other';
            var value1213 = parseFloat(row['2012-13']) || 0;
            var value1314 = parseFloat(row['2013-14']) || 0;
            var value1415 = parseFloat(row['2014-15']) || 0;
            var value1516 = parseFloat(row['2015-16']) || 0;
            var value1617 = parseFloat(row['2016-17']) || 0;
            var sourceDocument = row['Source document'];
            var sourceTable = row['Source table'];
            var url = row.URL;

            function getDescription() {
                return {
                    name: description,
                    value1213: value1213,
                    value1314: value1314,
                    value1415: value1415,
                    value1516: value1516,
                    value1617: value1617,
                    expenseType: expenseType,
                    appropriationType: appropriationType,
                    sourceDocument: sourceDocument,
                    sourceTable: sourceTable,
                    url: url
                };
            }
            function getProgram() {
                return {
                    name: program,
                    alue1213: value1213,
                    value1314: value1314,
                    value1415: value1415,
                    value1516: value1516,
                    value1617: value1617,
                    children: [getDescription()]
                };
            }
            function getOutcome() {
                return {
                    name: outcome,
                    value1213: value1213,
                    value1314: value1314,
                    value1415: value1415,
                    value1516: value1516,
                    value1617: value1617,
                    children: [getProgram()]
                };
            }
            function getDepartment() {
                return {
                    name: department,
                    value1213: value1213,
                    value1314: value1314,
                    value1415: value1415,
                    value1516: value1516,
                    value1617: value1617,
                    children: [getOutcome()]
                };
            }
            function getPortfolio() {
                return {
                    name: portfolio,
                    value1213: value1213,
                    value1314: value1314,
                    value1415: value1415,
                    value1516: value1516,
                    value1617: value1617,
                    children: [getDepartment()]
                };
            }

            // Add to total
            data.value1213 += value1213;
            data.value1314 += value1314;
            data.value1415 += value1415;
            data.value1516 += value1516;
            data.value1617 += value1617;

            var portfolios = data.children;
            // Create portfolio level if it doesnt exist
            if (!lookup(portfolios, portfolio)) {
                portfolios.push(getPortfolio());
            } else {
                // Add to the cummulative portfolio total
                for(var i = 0; i < portfolios.length; i++) {
                    if(portfolios[i].name === portfolio) {
                        portfolios[i].value1213 += value1213;
                        portfolios[i].value1314 += value1314;
                        portfolios[i].value1415 += value1415;
                        portfolios[i].value1516 += value1516;
                        portfolios[i].value1617 += value1617;

                        var departments = portfolios[i].children;
                        // Create department level if it doesnt exist
                        if (!lookup(departments, department)) {
                            departments.push(getDepartment());
                        } else {
                            // Add to the cummulative department total
                            for(var j = 0; j < departments.length; j++) {
                                if(departments[j].name === department) {
                                    departments[j].value1213 += value1213;
                                    departments[j].value1314 += value1314;
                                    departments[j].value1415 += value1415;
                                    departments[j].value1516 += value1516;
                                    departments[j].value1617 += value1617;

                                    var outcomes = departments[j].children;
                                    // Create outcome level if it doesnt exist
                                    if (!lookup(outcomes, outcome)) {
                                        outcomes.push(getOutcome());
                                    } else {
                                        // Add to the cummulative outcome total
                                        for(var k = 0; k < outcomes.length; k++) {
                                            if(outcomes[k].name === outcome) {
                                                outcomes[k].value1213 += value1213;
                                                outcomes[k].value1314 += value1314;
                                                outcomes[k].value1415 += value1415;
                                                outcomes[k].value1516 += value1516;
                                                outcomes[k].value1617 += value1617;

                                                var programs = outcomes[k].children;
                                                // Create program level if it doesnt exist
                                                if (!lookup(programs, program)) {
                                                    programs.push(getProgram());
                                                } else {
                                                    // Add to the cummulative program total
                                                    for(var l = 0; l < programs.length; l++) {
                                                        if(programs[l].name === program) {
                                                            programs[l].value1213 += value1213;
                                                            programs[l].value1314 += value1314;
                                                            programs[l].value1415 += value1415;
                                                            programs[l].value1516 += value1516;
                                                            programs[l].value1617 += value1617;

                                                            // Always add program even if its a duplicate
                                                            var descriptions = programs[l].children;
                                                            // Create Description
                                                            descriptions.push(getDescription());
                                                            break;
                                                        }
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        });

        grunt.file.write(dest, JSON.stringify(data));

        grunt.log.ok('File ' + src + ' converted to ' + dest + ' OK'.green);
    });
};
