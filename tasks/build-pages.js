var hyd = require('hydrolysis');

gulp.task('test', function(done) {
  hyd.Analyzer.analyze('app/elements/elements.html')
  .then(function(analyzer) {
    analyzer.elements.forEach((item) => {
      if (!item.jsdoc.description) {
        return;
      }
      console.log('==============');
      console.log(item.is);
      console.log();
    });

    //console.log(analyzer.elementsByTagName['arc-controller-behavior']);
    //gutil.log(analyzer);
    done();
  });
});
