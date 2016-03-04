module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-minify-polymer');
  grunt.loadNpmTasks('grunt-vulcanize');

  grunt.initConfig({
    minifyPolymer: {
      options: {
        warnings: true,
        comments: false,
        empty: true,
        cdata: false,
        spare: true
      },
      default: {
        files: [{
          expand: true,
          cwd: 'app/bower_components/',
          src: ['**/*.html'],
          dest: 'build/bower_components/'
        }]
      }
    },
    vulcanize: {
      default: {
        options: {
          //csp: 'build/build-csp.js',
          stripComments: true,
          inlineScripts: true,
          excludes: [
            'app/bower_components/polymer/polymer.html',
            'bower_components/polymer/polymer.html'
          ]
        },
        files: {
          // Where index.html includes bower_components imports
          'build/build.html': 'app/index.html'
        }
      }
    }
  });

  grunt.registerTask('default', ['minifyPolymer', 'vulcanize']);
};
