const gulp = require('gulp');

const sass = require('gulp-sass');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const wait = require('gulp-wait');
const del = require('del');

const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const browserSync = require('browser-sync').create();

const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const paths = {
    root: './build',
    templates: {
        pages: 'src/templates/pages/*.html',
        src: 'src/templates/**/*.html'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles/'
    },  
    images: {
        src: 'src/images/**/*.*',
        svg: 'src/images/svg/*.svg',
        dest: 'build/assets/images/'
    },
    scripts: {
        src: 'src/scripts/app.js',
        dest: 'build/assets/scripts/'
    },
    libs: {
      src: 'src/scripts/libs/*.js',
      dest: 'build/assets/scripts/libs/'
    },
    phpfiles: {
      src: 'src/php/*.php',
      dest: 'build/'
    },
    fonts: {
        src: 'src/fonts/**/*.*',
        dest: 'build/assets/fonts'
    }
}

function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(gulp.dest(paths.root));
}

function styles() {
    return gulp.src('./src/styles/main.scss')
        .pipe(wait(200))
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(
            {
                outputStyle: 'compressed' 
            }
        ))
        .pipe(
            autoprefixer({
              overrideBrowserslist: ["last 10 versions"],
              grid: true            
            })
        )
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
}

function clean() {
    return del(paths.root);
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(gulpWebpack(webpackConfig, webpack)) 
        .pipe(gulp.dest(paths.scripts.dest));
}

function libs() {
  return gulp.src(paths.libs.src)
  .pipe(gulp.dest(paths.libs.dest));
}

function phpfiles() {
  return gulp.src(paths.phpfiles.src)
    .pipe(gulp.dest(paths.phpfiles.dest));
}

function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

function svg(done) {
  const prettySvgs = () => {
    return gulp
      .src(paths.images.svg)
      .pipe(
        svgmin({
          js2svg: {
            pretty: true
          }
        })
      )
      .pipe(
        cheerio({
          run($) {
            $("[fill], [stroke]")
              .removeAttr("fill")
              .removeAttr("stroke")
          },
          parserOptions: { xmlMode: true }
        })
      )
      .pipe(replace("&gt;", ">"));
  };

  prettySvgs()
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      })
    )
    .pipe(gulp.dest(paths.images.dest + '/sprite'));

  done();
}

function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
}

exports.templates = templates;
exports.styles = styles;
exports.libs = libs;
exports.phpfiles = phpfiles;
exports.clean = clean;
exports.images = images;
exports.svg = svg;
exports.fonts = fonts;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(templates, styles, images, libs, scripts, phpfiles, svg, fonts),
    gulp.parallel(watch, server)
));