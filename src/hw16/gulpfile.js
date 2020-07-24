const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const livereload = require('gulp-livereload');

gulp.task('js', () => {
	return gulp.src('js/*.js')
			.pipe(babel())
			.pipe(uglify())
			.pipe(concat('app-main.js', {newLine: ';'}))
			.pipe(gulp.dest('build/js'));
});

const defaultTask = () => {
	return gulp.parallel('js', 'styles');
}

gulp.task('styles', () => {
	return gulp.src('scss/style.scss')
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(gulp.dest('build/css'));

});

gulp.task('default', defaultTask());

gulp.task('watch', () => {
	return gulp.watch(['js/*.js', 'scss/*.scss'], {}, defaultTask())
})

