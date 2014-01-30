module.exports = function(grunt) {

  // Config vars.
  var config = {
    build: {},
    css: {},
    js: {}
  };

  config.build.out = '_src/build/';

  config.css.src = '_src/scss/',
  config.css.out = 'css/',
  config.css.concat = require('./' + config.css.src + 'concat.json');

  config.js.src = '_src/js/',
  config.js.out = 'js/',
  config.js.concat = require('./' + config.js.src + 'concat.json');

  // Project config.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // SASS
    sass: {
      options: {
        loadPath: ['bower_components/foundation/scss']
      },
      dev: {
        options: {
          style: 'expanded',
          lineNumbers: true
        },
        files: [{
          expand: true,
          src: config.css.src + 'main.scss',
          dest: config.build.out,
          ext: '.css',
          flatten: true
        }]
      },
      prod: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          src: config.css.src + 'main.scss',
          dest: config.build.out,
          ext: '.css',
          flatten: true
        }]
      }
    },

    // Concat tasks
    concat: {
      css: {
        src: config.css.concat,
        dest: config.css.out + 'main.css'
      },
      js: {
        src: config.js.concat,
        dest: config.build.out + 'main.js'
      }
    },

    // JS Minification
    uglify: {
      options: {
        report: 'min'
      },
      build: {
        src: config.build.out + 'main.js',
        dest: config.js.out + 'main.min.js'
      }
    },

    copy: {
      dev: {
        files: [ // copies concat'd js file to .min.js for debugging
          { expand: true,
            src: [config.build.out + 'main.js'],
            dest: config.js.out,
            rename: function(dest, src) { return config.js.out + "main.min.js"; }
          }
        ]
      },
    },

    // JSHint
    jshint: {
      files: [config.js.src + '*.js']
    },

    // Testing server using connect
    connect: {
      server: {
        options: {
          port: 8081,
          base: './'
        }
      }
    },

    // Watching
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: [config.css.src + '**/*.scss'],
        tasks: ['sass:dev', 'concat:css']
      },
      js: {
        files: [config.js.src + '**/*.js'],
        tasks: ['jshint', 'concat:js', 'uglify']
      },
      html: {
        files: ['./*.html'],
        tasks: ['dev']
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');


  // Cleaning task
  grunt.registerTask('clean-build', 'Clean task.', function() {

    // Clean build dir
    grunt.file.expand(config.build.out + '*').forEach(function(file) {
      grunt.file.delete(file);
    });

  });

  grunt.registerTask('clean-out', 'Clean task.', function() {

    grunt.file.expand(config.css.out + '*').forEach(function(file) {
      grunt.file.delete(file);
    });

  });

  // Tasks list
  grunt.registerTask('dev', ['sass:dev', 'jshint', 'concat', 'copy:dev', 'clean-build']);
  grunt.registerTask('prod', ['sass:prod', 'jshint', 'concat', 'uglify', 'clean-build']);
  grunt.registerTask('default', ['connect', 'watch']);
};