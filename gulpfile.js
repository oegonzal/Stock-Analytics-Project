var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jscs = require('gulp-jscs'),
	nodemon = require('gulp-nodemon'),
	gulpMocha = require('gulp-mocha'),
	env = require('gulp-env'),
	supertest = require('supertest');

const browserSync = require('browser-sync').create();  
const reload = browserSync.reload;  
const babel = require('gulp-babel');  
const browserify = require("browserify");  
const fs = require('fs');

var jsFiles = ['*.js', 'src/**/*.js']; //For linter, is it correct? should it be ['*.js', 'public/**/*.js']?

gulp.task('style', function () {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}))
		.pipe(jscs());
});

gulp.task('inject', function () {
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');
	
	var injectSrc = gulp.src(['./public/assets/css/*.css',
							  './public/assets/js/*.js'], {read: false});
	
	var injectOptions = {
		ignorePath: 'public/'
	};
	
	var options = {
		bowerJson: require('./bower.json'),
		directory: './public/assets/lib',
		ignorePath: '../'
	}
	
	return gulp.src('./public/app/*.html')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./public/app'));
});

gulp.task('serve', ['style' ,'inject'], function() {
	var options = {
		script: 'server.js',
		delayTime: 1,
		env: {
			'PORT': 5000
		},
		watch: jsFiles
	};

	browserSync.init({
		server: {
		  baseDir: "./public/app"
		}
	});

	gulp.watch("./public/app/shared/charts/**/*").on("change", function() {
		browserify("./public/app/shared/charts/index.js")
		  .transform("babelify", { presets: ["es2015", "react"] })
		  .bundle()
		  .pipe(fs.createWriteStream("./public/app/index.js"));
	});
	
	return nodemon(options)
		.on('restart', function(ev){
			console.log('Restarting....');
	});
});

gulp.task('transpile', function() {

  browserSync.init({
    server: {
      baseDir: "./public/app"
    }
  });

  gulp.watch("./public/app/shared/charts/**/*").on("change", function() {
    browserify("./public/app/shared/charts/index.js")
      .transform("babelify", { presets: ["es2015", "react", "stage-2"] })
      .bundle()
      .pipe(fs.createWriteStream("./public/app/index.js"));
  });

});

gulp.task('test', function() {
	env({vars: {ENV:'Test'}});
	gulp.src('tests/*.js', {read: false})
	.pipe(gulpMocha({reporter: 'nyan'}));
});