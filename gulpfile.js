var deploy = require('gulp-gh-pages');
var gulp = require('gulp');
var liquid = require('gulp-liquid');
var replaceExtension = require('gulp-ext-replace');
var sass = require('gulp-sass');
var yaml = require('js-yaml');
var fs = require('fs');
var cleanCSS = require('gulp-clean-css');

var paths = {
  dist: './dist/',
  allDist: './dist/**/*',
  src: './src/',
  allSrc: './src/**/*',
  liquidSrc: './src/*.liquid',
  sassSrc: './src/assets/*.scss',
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
    paths.src + 'CNAME'
  ])
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:assets', function () {
  return gulp.src([
    paths.src + 'assets/**/*.*',
    '!' + paths.src + 'assets/**/*.scss'
  ])
    .pipe(gulp.dest(paths.dist + 'assets/'));
});

gulp.task('build:styles', function () {
  return gulp.src(paths.sassSrc)
    .pipe(sass())
    .pipe(replaceExtension('.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(paths.dist + 'assets/'));
});

gulp.task('build', ['build:html', 'build:assets', 'build:other', 'build:styles']);

gulp.task('watch', ['build'], function () {
  gulp.watch(paths.allSrc, ['build']);
});

gulp.task('deploy', ['build'], function () {
  return gulp.src(paths.allDist)
    .pipe(deploy());
});
