var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var path = require('path');
var appName = path.basename(__dirname);
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

plugins.q = require('q');
plugins.runSequence = require('run-sequence');
plugins.url = require('url');

var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

var vars = {
	notifyInfo: notifyInfo,

	plumberErrorHandler: {
		errorHandler: plugins.notify.onError({
			title: notifyInfo.title,
			icon: notifyInfo.icon,
			message: "Error: <%= error.message %>"
		})
	},

	browserSync: browserSync,

	pkg: pkg,

	appName: appName,

	styles: ['src/style/*.scss'],

	editorStyles: ['src/editor/**/*.scss'],

	viewerStyles: ['src/viewer/**/*.scss'],

	stylesVendor: [
		'bower_components/font-awesome/css/font-awesome.css',
		// 'bower_components/do-ck/dist/css/do-ck.min.css',
		// 'bower_components/ckronos/dist/css/ckronos.min.css',
		'bower_components/ackolor/dist/css/aCKolor.min.css',
		// 'bower_components/trumbowyg/dist/ui/trumbowyg.min.css'
	],

	html: ['*.html', 'src/**/**.html', 'src/**/**/**.html'],

	scripts: ['src/**/**.js', 'src/**/**/**.js'],

	scriptsVendor:[
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/angular/angular.min.js',
		'bower_components/angular-cookies/angular-cookies.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-sanitize/angular-sanitize.js',
		'bower_components/angular-route/angular-route.js',
		'bower_components/angular-loader/angular-loader.js',
		'bower_components/angular-animate/angular-animate.min.js',
		'bower_components/ckc-angularjs-utility/dist/utility.min.js',
		'bower_components/ngstorage/ngStorage.min.js',
		'bower_components/ackolor/dist/js/aCKolor.min.js',
		// 'bower_components/ckronos/dist/js/ckronos.min.js',
		// 'bower_components/do-ck/dist/js/do-ck.min.js',
		// 'bower_components/oclazyload/dist/ocLazyLoad.min.js',
		// 'bower_components/angular-ui-router/release/angular-ui-router.min.js',
		// 'bower_components/trumbowyg/dist/trumbowyg.min.js',
		// 'bower_components/trumbowyg-ng/dist/trumbowyg-ng.min.js',
		'bower_components/datashare/dist/js/datashare.min.js',
		// 'bower_components/angular-ui-router/release/angular-ui-router.min.js'
		'bower_components/lodash/dist/lodash.min.js',
	],

	componentsWatch:[
		'src/**/**/*.*'
	],

	moveFonts: ['bower_components/font-awesome/fonts/*.*'],

	moveToLib: [],

	moveToJs: [
		'bower_components/angular/angular.min.js.map'
	],

	buildFiles: [
		// 'lib/bower_components/font-awesome/css/font-awesome.min.css',
		// 'lib/bower_components/font-awesome/css/font-awesome.css.map',
		// 'lib/bower_components/font-awesome/fonts/*.*',
		// 'dist/css/'+ appName +'_vendor.min.css',
		// 'dist/css/'+ appName +'.min.css',
		// 'dist/js/'+ appName +'_vendor.min.js',
		// 'dist/js/'+ appName +'.min.js',
		// 'dist/js/'+ appName +'.min.js.map',
		// 'dist/js/utility.min.js.map',
		// 'favicon.png',
		// 'app.js',
		// 'demo.html',
		// 'index.html',
		// 'assets/**'
		// 'main.js',
		// 'bower_components/**',
		'dist/**',
		'interactive-manifest.json',
		'favicon.ico',
		'index.html',
		'assets/**'
	]
};



gulp.task('bower', require('./tasks/bower')(gulp, plugins, vars));
gulp.task('browser-sync', require('./tasks/browsersync')(gulp, plugins, vars));
gulp.task('index', require('./tasks/index')(gulp, plugins, vars));
gulp.task('move_fonts', require('./tasks/move_fonts')(gulp, plugins, vars));
gulp.task('move_to_js', require('./tasks/move_to_js')(gulp, plugins, vars));
gulp.task('move_to_build', require('./tasks/move_to_build')(gulp, plugins, vars));
gulp.task('move_to_lib', require('./tasks/move_to_lib')(gulp, plugins, vars));
gulp.task('package', function(){
	var path = require('path');
	var fs = require('fs');

	vars.pkg.name = path.basename(__dirname);
	fs.writeFileSync("./package.json", JSON.stringify(vars.pkg, null, "\t"));
	vars.pkg = require('./package.json');
});
gulp.task('scripts_vendor', require('./tasks/scripts_vendor')(gulp, plugins, vars));
// gulp.task('scripts_components', require('./tasks/scripts_components')(gulp, plugins, vars));
gulp.task('scripts', require('./tasks/scripts')(gulp, plugins, vars));
gulp.task('styles_vendor', require('./tasks/styles_vendor')(gulp, plugins, vars));
gulp.task('styles', require('./tasks/styles')(gulp, plugins, vars));
gulp.task('styles_viewer', require('./tasks/styles_viewer')(gulp, plugins, vars));
gulp.task('styles_editor', require('./tasks/styles_editor')(gulp, plugins, vars));
// gulp.task('styles_components', require('./tasks/styles_components')(gulp, plugins, vars));
// gulp.task('aws_publish', require('./tasks/aws_publish')(gulp, plugins, vars));
// gulp.task('zip', require('./tasks/zip')(gulp, plugins, vars));


gulp.task('build', function() {
    gulp.src(vars.buildFiles, {base: './'})
	.pipe(gulp.dest('build'));
});

gulp.task('zip', function() {
	gulp.src([
		'./build/**'
	])
	.pipe(plugins.zip('Flynet Editor.interactive'))
	.pipe(gulp.dest(''));
});


gulp.task('reloadBrowser', function(){
	return vars.browserSync.reload;
});



/* INSTALL
* Updates package.json name
* Creates index.html
* Creates an nginx.conf file if needed
* Creates bower.json
*/

gulp.task('install', ['package', 'index', 'bower']);




/* LIVE
* Watches for file changes
*/

var reloadTimer;

var doReload = function doReload() {
	clearTimeout(reloadTimer);
	reloadTimer = setTimeout(function () {
		console.log(vars.browserSync);
		vars.browserSync.reload;
	}, 2000);
};

gulp.task('live', function() {
	plugins.livereload.listen();
	// gulp.watch(vars.styles, ['styles']);
	// gulp.watch(vars.stylesVender, ['styles_vendor']);
	// gulp.watch(vars.moveFonts, ['move_fonts']);
	// gulp.watch(vars.scriptsVendor, ['scripts_vendor']);
	// gulp.watch(vars.componentsWatch, ['scripts_components', 'styles_components']);
	// gulp.watch(vars.scripts, ['scripts']);
	// gulp.watch(vars.html, ['scripts']);
	// gulp.watch(vars.moveToLib, ['move_to_lib']);
	// gulp.watch(vars.moveToJs, ['move_to_js']);
	// gulp.watch(['src/*.*', 'src/**/*.*', 'src/**/**/*.*'], ['move_to_js']);
	// gulp.watch("dist/**").on('change', vars.browserSync.reload);



	gulp.watch("src/**", [
		'move_to_lib',
		'move_to_js',
		'move_fonts',
		'styles',
		'styles_vendor',
		'styles_viewer',
		'styles_editor',
		'scripts_vendor',
		'scripts'
	]);
	//gulp.watch("dist/**").on('change', doReload);
});

gulp.task('default', [
	'move_to_lib',
	'move_to_js',
	'move_fonts',
	'styles',
	'styles_vendor',
	'styles_viewer',
	'styles_editor',
	'scripts_vendor',
	'scripts',
	'browser-sync',
	'live'
], function(){});