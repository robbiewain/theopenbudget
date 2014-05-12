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
                expand: true,
                dot: true,
                cwd: '.tmp/data',
                dest: '<%= config.dist %>/data/',
                src: '*.*'
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
            options: {
                limit: 10
            },
            server: [
                'sass:server',
                'copy:styles',
                'copy:data'
            ],
            dist: [
                'sass',
                'copy:styles',
                'copy:data',
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
        'convert',
        'processJSON',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy', [
        'default',
        'rsync:dist'
    ]);

    grunt.loadNpmTasks('grunt-convert');
    grunt.loadNpmTasks('grunt-rsync');

    grunt.registerTask('processJSON', 'A task that creates a hierarchial json format.', function() {
        var csvData = JSON.parse(grunt.file.read('.tmp/data/budgetcsv.json'));
        var data = {
            i: 0,
            n: 'total',
            v1: 0,
            v2: 0,
            v3: 0,
            v4: 0,
            v5: 0,
            children: []
        };
        var portfolioNames = [];
        var departmentNames = [];
        var outcomeNames = [];
        var programNames = [];
        var descriptionNames = [];

        function lookup(arr, name) {
            for(var i = 0, len = arr.length; i < len; i++) {
                if(arr[i].n === name) {
                    return true;
                }
            }
            return false;
        }

        csvData.forEach(function(row, id) {
            var portfolio = row.Portfolio;
            var department = row['Department/Agency'];
            var outcome = row.Outcome;
            var program = row.Program;
            var expenseType = row['Expense type'];
            var appropriationType = row['Appropriation type'];
            var description = row.Description;
            var value1 = parseFloat(row['2013-14']) || 0;
            var value2 = parseFloat(row['2014-15']) || 0;
            var value3 = parseFloat(row['2015-16']) || 0;
            var value4 = parseFloat(row['2016-17']) || 0;
            var value5 = parseFloat(row['2017-18']) || 0;
            var sourceDocument = row['Source document'];
            var sourceTable = row['Source table'];
            var url = row.URL;
            id ++;

            // If description is blank use expense/appropriation type
            if (program && !description) {
                description = expenseType + ' - ' + appropriationType;
            }

            function getDescription() {
                return {
                    i: id,
                    n: description,
                    v1: value1,
                    v2: value2,
                    v3: value3,
                    v4: value4,
                    v5: value5,
                    sd: sourceDocument,
                    st: sourceTable,
                    u: url,
                    children: []
                };
            }
            function getProgram() {
                var p = {
                    i: id,
                    n: program,
                    v1: value1,
                    v2: value2,
                    v3: value3,
                    v4: value4,
                    v5: value5
                };
                if (description) {
                    p.children = [getDescription()]
                } else {
                    p.sd = sourceDocument;
                    p.st = sourceTable;
                    p.u = url;
                    p.children = [];
                }
                return p;
            }
            function getOutcome() {
                var o = {
                    i: id,
                    n: outcome,
                    v1: value1,
                    v2: value2,
                    v3: value3,
                    v4: value4,
                    v5: value5
                };
                if (program) {
                    o.children = [getProgram()];
                } else {
                    o.sd = sourceDocument;
                    o.st = sourceTable;
                    o.u = url;
                    o.children = [];
                }
                return o;
            }
            function getDepartment() {
                var d = {
                    i: id,
                    n: department,
                    v1: value1,
                    v2: value2,
                    v3: value3,
                    v4: value4,
                    v5: value5
                };
                if (outcome) {
                    d.children = [getOutcome()];
                } else {
                    d.sd = sourceDocument;
                    d.st = sourceTable;
                    d.u = url;
                    d.children = [];
                }
                return d;
            }
            function getPortfolio() {
                var p = {
                    i: id,
                    n: portfolio,
                    v1: value1,
                    v2: value2,
                    v3: value3,
                    v4: value4,
                    v5: value5
                };
                if (department) {
                    p.children = [getDepartment()];
                } else {
                    p.sd = sourceDocument;
                    p.st = sourceTable;
                    p.u = url;
                    p.children = [];
                }
                return p;
            }

            // Add to total
            data.v1 += value1;
            data.v2 += value2;
            data.v3 += value3;
            data.v4 += value4;
            data.v5 += value5;

            var portfolios = data.children;
            // Create portfolio level if it doesnt exist
            if (!lookup(portfolios, portfolio)) {
                portfolios.push(getPortfolio());
                portfolioNames.push({ t: portfolio, i: id });
                departmentNames.push({ t: department, i: id });
                outcomeNames.push({ t: outcome, i: id });
                programNames.push({ t: program, i: id });
                descriptionNames.push({ t: description, i: id });
            } else {
                // Add to the cummulative portfolio total
                for(var i = 0; i < portfolios.length; i++) {
                    if(portfolios[i].n === portfolio) {
                        portfolios[i].v1 += value1;
                        portfolios[i].v2 += value2;
                        portfolios[i].v3 += value3;
                        portfolios[i].v4 += value4;
                        portfolios[i].v5 += value5;

                        var departments = portfolios[i].children;
                        // Create department level if it doesnt exist
                        if (!lookup(departments, department)) {
                            departments.push(getDepartment());
                            departmentNames.push({ t: department, i: id });
                            outcomeNames.push({ t: outcome, i: id });
                            programNames.push({ t: program, i: id });
                            descriptionNames.push({ t: description, i: id });
                        } else {
                            // Add to the cummulative department total
                            for(var j = 0; j < departments.length; j++) {
                                if(departments[j].n === department) {
                                    departments[j].v1 += value1;
                                    departments[j].v2 += value2;
                                    departments[j].v3 += value3;
                                    departments[j].v4 += value4;
                                    departments[j].v5 += value5;

                                    var outcomes = departments[j].children;
                                    // Create outcome level if it doesnt exist
                                    if (!lookup(outcomes, outcome)) {
                                        outcomes.push(getOutcome());
                                        outcomeNames.push({ t: outcome, i: id });
                                        programNames.push({ t: program, i: id });
                                        descriptionNames.push({ t: description, i: id });
                                    } else {
                                        // Add to the cummulative outcome total
                                        for(var k = 0; k < outcomes.length; k++) {
                                            if(outcomes[k].n === outcome) {
                                                outcomes[k].v1 += value1;
                                                outcomes[k].v2 += value2;
                                                outcomes[k].v3 += value3;
                                                outcomes[k].v4 += value4;
                                                outcomes[k].v5 += value5;

                                                var programs = outcomes[k].children;
                                                // Create program level if it doesnt exist
                                                if (!lookup(programs, program)) {
                                                    programs.push(getProgram());
                                                    programNames.push({ t: program, i: id });
                                                    descriptionNames.push({ t: description, i: id });
                                                } else {
                                                    // Add to the cummulative program total
                                                    for(var l = 0; l < programs.length; l++) {
                                                        if(programs[l].n === program) {
                                                            programs[l].v1 += value1;
                                                            programs[l].v2 += value2;
                                                            programs[l].v3 += value3;
                                                            programs[l].v4 += value4;
                                                            programs[l].v5 += value5;

                                                            // Always add program even if its a duplicate
                                                            var descriptions = programs[l].children;
                                                            // Create Description
                                                            descriptions.push(getDescription());
                                                            descriptionNames.push({ t: description, i: id });
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

        grunt.file.write('.tmp/data/budget.json', JSON.stringify(data));
        grunt.file.write('.tmp/data/portfolios.json', JSON.stringify(portfolioNames));
        grunt.log.ok(portfolioNames.length + ' portfolios');
        grunt.file.write('.tmp/data/departments.json', JSON.stringify(departmentNames));
        grunt.log.ok(departmentNames.length + ' departments');
        grunt.file.write('.tmp/data/outcomes.json', JSON.stringify(outcomeNames));
        grunt.log.ok(outcomeNames.length + ' outcomes');
        grunt.file.write('.tmp/data/programs.json', JSON.stringify(programNames));
        grunt.log.ok(programNames.length + ' programs');
        grunt.file.write('.tmp/data/descriptions.json', JSON.stringify(descriptionNames));
        grunt.log.ok(descriptionNames.length + ' descriptions');

        grunt.log.ok('Json files created ' + 'OK'.green);
    });
};
