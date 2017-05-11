'use strict'; //eslint-disable-line strict

// Inspired from the babel gulpfile: https://github.com/babel/babel/blob/685006433b0231dbf4b9d306e43c46ed7bcdacad/Gulpfile.js

const path = require('path');

const babel = require('gulp-babel');
const gulp = require('gulp');
const newer = require('gulp-newer');
const through = require('through2');
const watch = require('gulp-watch');

const base = path.join(__dirname, 'packages');
const scripts = ['./packages/*/src/**/*.js', '!./packages/*/src/**/__tests__/**/*'];

function swapSrcWithLib(srcPath) {
    const parts = srcPath.split(path.sep);
    parts[1] = 'lib';
    return parts.join(path.sep);
}

gulp.task('default', ['build']);

gulp.task('build', function () {
    return gulp.src(scripts, {base})
        .pipe(newer({
            dest: base,
            map: swapSrcWithLib
        }))
        .pipe(babel())
        .pipe(through.obj(function (file, enc, callback) {
            // Passing 'file.relative' because newer() above uses a relative path and this keeps it consistent.
            file.path = path.resolve(file.base, swapSrcWithLib(file.relative));
            callback(null, file);
        }))
        .pipe(gulp.dest(base));
});

gulp.task('watch', ['build'], function () {
    watch(scripts, {debounceDelay: 200}, function () {
        gulp.start('build');
    });
});
