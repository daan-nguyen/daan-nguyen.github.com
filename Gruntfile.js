module.exports = function(grunt) {

  // Project config.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          style: 'expanded',
          loadPath: ['bower_components/foundation/scss/foundation']
        },
        files: [{
          expand: true,
          src: ['_src/scss/*.scss'],
          dest: 'css',
          ext: '.css',
          flatten: true
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
};