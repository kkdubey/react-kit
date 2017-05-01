/*eslint-disable*/
var gulp = require('gulp');
var psi = require('psi');
var ngrok = require('ngrok');
var sequence = require('run-sequence');
var site = '';
var key = '';

gulp.task('ngrok-url', function (cb) {
  return ngrok.connect(3000, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('psi-seq', function (cb) {
  return sequence(
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

gulp.task('psi', ['psi-seq'], function () {
  console.log('Check out your page speed scores!');
  process.exit();
});

gulp.task('psi-mobile', function () {
  return psi.output(site, {
    // key: key
    nokey: 'true',
    strategy: 'mobile',
    threshold: 1
  });

});

gulp.task('psi-desktop', function () {
  return psi.output(site, {
    nokey: 'true',
    strategy: 'desktop',
    threshold: 1
  });
});

gulp.task('default', ['mobile']);
/*eslint-enable*/
