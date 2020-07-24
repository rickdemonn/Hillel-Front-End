const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');


gulp.task('images',  () => {
	return gulp.src('img/*.*')
			.pipe(imagemin({optimizationLevel: 5}))
			.pipe(gulp.dest('build/img'));
});

gulp.task('js', () => {
	return gulp.src('js/*.js')
			.pipe(babel())
			.pipe(uglify())
			.pipe(concat('app-main.js', {newLine: ';'}))
			.pipe(gulp.dest('build/js'));
});

const defaultTask = () => {
	return gulp.parallel('js', 'styles', 'images');
}

gulp.task('styles', () => {
	return gulp.src('scss/style.scss')
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(gulp.dest('build/css'));

});

gulp.task('default', defaultTask());

gulp.task('watch', () => {
	return gulp.watch(['js/*.js', 'scss/*.scss', 'img/*.*'], {}, defaultTask())
})

