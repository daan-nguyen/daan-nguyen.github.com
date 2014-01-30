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
  config.css.copy = require('./' + config.css.src + 'copy.json'),
  config.css.concat = require('./' + config.css.src + 'concat.json');

  // config.js.path = '_src/js/',
  // config.js.copy =
  // config.js.concat =

  // Project config.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // SASS
    sass: {
      dist: {
        options: {
          style: 'expanded',
          loadPath: ['bower_components/foundation/scss/foundation']
        },
        files: [{
          expand: true,
          src: [config.css.src + '*.scss'],
          dest: config.build.out,
          ext: '.css',
          flatten: true
        }]
      }
    },

    // Copy tasks
    copy: {
      css: {
        files: [
          { expand: true,
            src: config.css.copy,
            dest: config.build.out,
            flatten: true
          }
        ]
      }
    },

    // Concat tasks
    concat: {
      css: {
        src: config.css.concat.map(function(file) { return config.build.out + file; }),
        dest: config.css.out + 'main.css'
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
  grunt.registerTask('build', ['sass', 'copy', 'concat']);
};