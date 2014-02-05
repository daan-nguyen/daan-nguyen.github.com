module.exports = function(grunt) {

  // Config vars.
  var config = {
    build: {
      out: '_src/build/'
    },
    css: {
      src: '_src/scss/',
      out: 'css/'
    },
    js: {
      src: '_src/js/',
      out: 'js/'
    }
  };
  config.css.concat = require('./' + config.css.src + 'concat.json'),
  config.js.concat = require('./' + config.js.src + 'concat.json');

  // Project config.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Compass
    compass: {
      options: {
        sassDir: config.css.src,
        cssDir: config.build.out,
        importPath: ['bower_components/foundation/scss']
      },
      dev: {
        options: {
          outputStyle: 'expanded',
        }
      },
      prod: {
        options: {
          outputStyle: 'compressed'
        }
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
          hostname: '*',
          port: 8081,
          base: './'
        }
      }
    },

    // Combine media queries
    cmq: {
      options: {
        log: true,
      },
      css: {
        files: [
          {
            expand: true,
            src: [config.build.out + 'main.css'],
            dest: config.build.out,
            flatten: true
          }
        ]
      }
    },

    // Watching
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: [config.css.src + '**/*.scss'],
        tasks: ['compass:dev', 'cmq', 'concat:css']
      },
      js: {
        files: [config.js.src + '**/*.js'],
        tasks: ['jshint', 'concat:js', 'copy:dev']
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
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-combine-media-queries');


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
  grunt.registerTask('dev', ['compass:dev', 'cmq', 'jshint', 'concat', 'copy:dev', 'clean-build']);
  grunt.registerTask('prod', ['compass:prod', 'cmq', 'jshint', 'concat', 'uglify', 'clean-build']);
  grunt.registerTask('default', ['connect', 'watch']);
};