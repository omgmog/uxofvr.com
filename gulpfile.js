var deploy = require('gulp-gh-pages');
var gulp = require('gulp');
var liquid = require('gulp-liquid');
var replaceExtension = require('gulp-ext-replace');
var sass = require('gulp-sass');
var yaml = require('js-yaml');
var fs = require('fs');

var paths = {
  dist: './dist/',
  allDist: './dist/**/*',
  src: './src/',
  allSrc: './src/**/*',
  liquidSrc: './src/*.liquid',
  sassSrc: './src/*.scss',
  ymlSrc: './src/data.yml'
};


gulp.task('build:html', function () {
  var yamlData = yaml.safeLoad(fs.readFileSync(paths.ymlSrc, 'utf8'));
  return gulp.src(paths.liquidSrc)
    .pipe(liquid({
      locals: yamlData
    }))
    .pipe(replaceExtension('.html'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:other', function () {
  return gulp.src([
    paths.src + 'CNAME',
    paths.src + '*.png',
    paths.src + '*.jpg',
    paths.src + '*.js',
    paths.src + 'fonts/*.eot',
    paths.src + 'fonts/*.svg',
    paths.src + 'fonts/*.woff',
    paths.src + 'fonts/*.ttf'
  ])
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:styles', function () {
  return gulp.src(paths.sassSrc)
    .pipe(sass())
    .pipe(replaceExtension('.css'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['build:html', 'build:other', 'build:styles']);

gulp.task('watch', ['build'], function () {
  gulp.watch(paths.allSrc, ['build']);
});

gulp.task('deploy', ['build'], function () {
  return gulp.src(paths.allDist)
    .pipe(deploy());
});
