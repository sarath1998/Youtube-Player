/*jslint node: true */
'use strict';

var pkg = require('./package.json');

var createFolderGlobs = function (fileTypePatterns) {
  fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
  var ignore = ['node_modules', 'bower_components', 'dist', 'temp', 'lib'];
  var fs = require('fs');
  return fs.readdirSync(process.cwd())
    .map(function (file) {
      if (ignore.indexOf(file) !== -1 ||
        file.indexOf('.') === 0 || !fs.lstatSync(file).isDirectory()) {
        return null;
      } else {
        return fileTypePatterns.map(function (pattern) {
          return file + '/**/' + pattern;
        });
      }
    })
    .filter(function (patterns) {
      return patterns;
    })
    .concat(fileTypePatterns);
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks("grunt-remove-logging");
  grunt.loadNpmTasks('grunt-stripcomments');
  // Project configuration.
  grunt.initConfig({
    connect: {
      main: {
        options: {
          port: 9001,
          hostname: '0.0.0.0'
        }
      }
    },
    comments: {
      dist: {
        src: "temp/app.full.js", // Each file will be overwritten with the output!
        dest: 'temp/app.full.js',
        options: {
          singleline: true,
          multiline: true,
          keepSpecialComments: false
        }
      }
    },
    removelogging: {
      dist: {
        src: "dist/**/*.js", // Each file will be overwritten with the output!
        options: {
          // see below for options. this is optional.
        }
      }
    },
    watch: {
      main: {
        options: {
          livereload: true,
          livereloadOnError: false,
          spawn: false
        },
        files: [createFolderGlobs(['*.js', '*.less', '*.html']), '!_SpecRunner.html', '!.grunt'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    },
    jshint: {
      main: {
        options: {
          jshintrc: '.jshintrc',
          reporterOutput: ""
        },
        src: createFolderGlobs('*.js')
      }
    },
    clean: {
      options: {
        'force': true
      },
      before: {
        src: ['dist', 'temp']
      },
      after: {
        src: ['temp']
      }
    },
    less: {
      production: {
        options: {},
        files: {
          'temp/app.css': 'app.less'
        }
      }
    },
    ngtemplates: {
      main: {
        options: {
          module: pkg.name,
          htmlmin: '<%= htmlmin.main.options %>'
        },
        src: [createFolderGlobs('*.html'), '!index.html', '!_SpecRunner.html'],
        dest: 'temp/templates.js'
      }
    },
    copy: {
      main: {
        files: [{
            src: ['fonts/**'],
            dest: 'dist/'
          },
          {
            src: ['images/**'],
            dest: 'dist/'
          },
          {
            src: ['bower_components/font-awesome/fonts/**'],
            dest: 'dist/',
            filter: 'isFile',
            expand: true
          },
          {
            src: ['bower_components/bootstrap/fonts/**'],
            dest: 'dist/',
            filter: 'isFile',
            expand: true
          },
          {
            src: ['templates/**'],
            dest: 'dist/',
            filter: 'isFile',
            expand: true
          },
          {
            src: ['lib/**'],
            dest: 'dist/'
          }
        ]
      },
      dev: {
        files: [{
            src: ['config/environments/dev/app.js'],
            dest: 'app.js'
          },
          {
            src: ['config/environments/dev/mixpanelAnalytics.config.js'],
            dest: 'config/mixpanelAnalytics.config.js'
          }
        ]
      },
      staging: {
        files: [{
            src: ['config/environments/staging/app.js'],
            dest: 'app.js'
          },
          {
            src: ['config/environments/staging/mixpanelAnalytics.config.js'],
            dest: 'config/mixpanelAnalytics.config.js'
          }
        ]
      },
      production: {
        files: [{
            src: ['config/environments/production/app.js'],
            dest: 'app.js'
          },
          {
            src: ['config/environments/production/mixpanelAnalytics.config.js'],
            dest: 'config/mixpanelAnalytics.config.js'
          }
        ]
      }
    },

    dom_munger: {
      read: {
        options: {
          read: [{
              selector: 'script[data-concat!="false"]',
              attribute: 'src',
              writeto: 'appjs'
            },
            {
              selector: 'link[rel="stylesheet"][data-concat!="false"]',
              attribute: 'href',
              writeto: 'appcss'
            }
          ]
        },
        src: 'index.html'
      },
      update: {
        options: {
          remove: ['script[data-remove!="false"]', 'link[data-remove!="false"]'],
          append: [{
              selector: 'body',
              html: '<script src="app.full.min.js"></script>'
            },
            {
              selector: 'head',
              html: '<link rel="stylesheet" href="app.full.min.css">'
            }
          ]
        },
        src: 'index.html',
        dest: 'dist/index.html'
      }
    },
    cssmin: {
      options: {
        rebase: false
      },
      main: {
        src: ['temp/app.css', '<%= dom_munger.data.appcss %>'],
        dest: 'dist/app.full.min.css'
      }
    },
    concat: {
      main: {
        src: ['<%= dom_munger.data.appjs %>', '<%= ngtemplates.main.dest %>'],
        dest: 'temp/app.full.js'
      }
    },
    ngAnnotate: {
      main: {
        src: 'temp/app.full.js',
        dest: 'temp/app.full.js'
      }
    },
    ngmin: {
      main: {
        src: 'temp/app.full.js',
        dest: 'temp/app.full.js'
      }
    },
    replace: {

      development: {
        options: {
          patterns: [{
            json: grunt.file.readJSON('./config/environments/dev/development.json')
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['./config/config.js'],
          dest: './service/config/'
        }]
      },


      production: {
        options: {
          patterns: [{
            json: grunt.file.readJSON('./config/environments/production/production.json')
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['./config/config.js'],
          dest: './service/config/'
        }]
      },
      staging: {
        options: {
          patterns: [{
            json: grunt.file.readJSON('./config/environments/staging/staging.json')
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['./config/config.js'],
          dest: './service/config/'
        }]
      }


    },
    uglify: {
      options: {
        mangle: false
      },
      main: {
        src: 'temp/app.full.js',
        dest: 'dist/app.full.min.js'
      }
    },
    htmlmin: {
      main: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },
    karma: {
      options: {
        frameworks: ['jasmine'],
        files: [ //this files data is also updated in the watch handler, if updated change there too
          '<%= dom_munger.data.appjs %>',
          'bower_components/angular-mocks/angular-mocks.js',
          createFolderGlobs('*-spec.js')
        ],
        logLevel: 'ERROR',
        reporters: ['mocha'],
        autoWatch: false, //watching is handled by grunt-contrib-watch
        singleRun: true
      },
      all_tests: {
        browsers: ['PhantomJS', 'Chrome', 'Firefox']
      },
      during_watch: {
        browsers: ['PhantomJS']
      },
    }
  });

  grunt.registerTask('build', ['replace:development', 'copy:dev', 'jshint', 'clean:before', 'less', 'dom_munger', 'ngtemplates', 'cssmin', 'concat', 'ngmin', 'uglify', 'copy', 'htmlmin', 'clean:after']);
  grunt.registerTask('serve', ['replace:development', 'copy:dev', 'dom_munger:read', 'jshint', 'connect', 'watch']);
  grunt.registerTask('test', ['dom_munger:read', 'karma:all_tests']);
  grunt.registerTask('prod_build', ['replace:production', 'copy:production', 'jshint', 'clean:before', 'less', 'dom_munger', 'ngtemplates', 'cssmin', 'concat', 'ngmin', 'uglify', 'copy', 'htmlmin', 'clean:after']);
  grunt.registerTask('staging_build', ['replace:staging', 'copy:staging', 'jshint', 'clean:before', 'less', 'dom_munger', 'ngtemplates', 'cssmin', 'concat', 'ngmin', 'uglify', 'copy', 'htmlmin', 'clean:after']);
  grunt.registerTask('prod_serve', ['replace:production', 'copy:production', 'dom_munger:read', 'jshint', 'connect', 'watch']);
  grunt.registerTask('staging_serve', ['replace:staging', 'copy:staging', 'dom_munger:read', 'jshint', 'connect', 'watch']);


  grunt.registerTask('careerWaze', 'A sample task holder for careerwaze application deployment.', function (arg1) {});

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.event.on('watch', function (action, filepath) {
    //https://github.com/gruntjs/grunt-contrib-watch/issues/156

    var tasksToRun = [];

    if (filepath.lastIndexOf('.js') !== -1 && filepath.lastIndexOf('.js') === filepath.length - 3) {

      //lint the changed js file
      grunt.config('jshint.main.src', filepath);
      tasksToRun.push('jshint');

      //find the appropriate unit test for the changed file
      var spec = filepath;
      if (filepath.lastIndexOf('-spec.js') === -1 || filepath.lastIndexOf('-spec.js') !== filepath.length - 8) {
        spec = filepath.substring(0, filepath.length - 3) + '-spec.js';
      }

      //if the spec exists then lets run it
      if (grunt.file.exists(spec)) {
        var files = [].concat(grunt.config('dom_munger.data.appjs'));
        files.push('bower_components/angular-mocks/angular-mocks.js');
        files.push(spec);
        grunt.config('karma.options.files', files);
        tasksToRun.push('karma:during_watch');
      }
    }

    //if index.html changed, we need to reread the <script> tags so our next run of karma
    //will have the correct environment
    if (filepath === 'index.html') {
      tasksToRun.push('dom_munger:read');
    }

    grunt.config('watch.main.tasks', tasksToRun);

  });
};