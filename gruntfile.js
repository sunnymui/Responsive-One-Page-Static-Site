module.exports = function(grunt) {

    /*
    ===========
    PLUGINS
    ===========
    1. watch - watch and run grunt when changes made
    2. uglify - minify and concat js
    3. imagemin - compress images
    4. bower - download and manage dependencies
    5. bower-installer (see bower.json for config) - clean up and move bower downloaded repos to designated directory
    6. newer - lets designated plugins only run on updated files
    7. connect - create a static server so you can view stuff onlineish
    8. responsive images - create multiple size images for responsive use

    ============
    TASK TARGETS
    ============
    dev: (default)
    runs tasks that matter just for dev environment

    build:
    runs tasks to make the production ready version of the project

    */

    var mozjpeg = require('imagemin-mozjpeg'); //plugin for imagemin

    // configure tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // watch plugin
        watch: {
            js: {
                files: ['src/*.{js}'], // which files to watch for changes
                tasks: ['uglify:dev'] // what tasks to run when changes made
            },
            img: {
                files: ['img/*.{png,jpg,gif}'], // which files to watch for changes
                tasks: ['responsive_images', 'imagemin'] // make responsive images from originals then optimize
            }
        },

        // uglify plugin
        uglify: {
            // define build task for uglify does every minification task to the js
            build: {
                src: 'src/*.js',
                dest: 'js/script.min.js'
            },
            // define dev task for uglify to only concatenate the js files into a single file
            // so it's one file, but you can still read everything while developing
            dev: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                },
                src: 'src/*.js',
                dest: 'js/script.min.js'
            }
        },

        // imagemin plugin - optimize image compression
        imagemin: {
            dynamic: { // target
                options: {
                    optimizationLevel: 7, // max optimize pngs
                    progressive: true, // progressive jpgs
                    interlaced: true, // progressive gifs
                    use: [mozjpeg()] // use the mojpeg optimizer plugin for imagemin because its better
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'img/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match, case SENSITIVE
                    dest: 'img/' // Destination path prefix
                }]
            }
        },

        // grunt connect plugin - web server
        connect: {
            server: {
                options: {
                    port: 1337,
                    base: 'src',
                }
            }
        },

        // responive images plugin - generate multiple sizes of images
        responsive_images: {
            dev: {
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,gif,png}'],
                    cwd: 'images_src/',
                    dest: 'img/'
                }]
            }
        },

    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-responsive-images');


    // Register tasks
    // you can add multiple tasks to run in each square bracket array
    // just add a comm and the othe rplugin name taks ex 'plugin: build','plugin:build'
    grunt.registerTask('default', [
        'uglify:dev',
    ]); // default is dev version of tasks
    grunt.registerTask('build', [
        'uglify:build',
        'responsive_images',
        'newer:imagemin', // newer argument activates plugin for only updated files
    ]); // create a build task for grunt


};
