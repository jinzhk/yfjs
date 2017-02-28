module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            // test clean
            test: ['<%= pkg.destTestDir %>'],
            // build clean
            All: ['<%= pkg.destOrgDir %>','<%= pkg.destMinifyDir %>'],
            yfjs: ['<%= pkg.destOrgDir %>/scripts/yfjs-original.js']
        },
        concat: {
            // test concat
            baseTest: {
                src: ['<%= pkg.srcDir %>/styles/*.css'],
                dest: '<%= pkg.destTestDir %>/styles/base.css'
            },
            yfjsTest: {
                src: [
                    '<%= pkg.srcDir %>/scripts/core/modernizr/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/requirejs/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/jquery/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/jquery-plugins/**/*.js',
                    '<%= pkg.srcDir %>/scripts/core/core.js',
                    '<%= pkg.srcDir %>/scripts/core/requireConf.js'
                ],
                dest: '<%= pkg.destTestDir %>/scripts/yfjs.js'
            },
            appTest: {
                src: [
                    '<%= pkg.srcDir %>/scripts/modules/spa/**.js',
                    '<%= pkg.srcDir %>/scripts/modules/spa/*/**.js'
                ],
                dest: '<%= pkg.destTestDir %>/scripts/spa/spa.js'
            },
            // build concat
            base: {
                src: ['<%= pkg.srcDir %>/styles/*.css'],
                dest: '<%= pkg.destOrgDir %>/styles/base.css'
            },
            yfjs: {
                src: [
                    '<%= pkg.srcDir %>/scripts/core/modernizr/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/requirejs/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/jquery/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/jquery-plugins/**/*.js',
                    '<%= pkg.srcDir %>/scripts/core/core.js',
                    '<%= pkg.srcDir %>/scripts/core/requireConf.js'
                ],
                dest: '<%= pkg.destOrgDir %>/scripts/yfjs.js'
            },
            yfjsOrg: {
                src: [
                    '<%= pkg.srcDir %>/scripts/core/modernizr/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/requirejs/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/jquery/*/*.js',
                    '<%= pkg.srcDir %>/scripts/core/jquery-plugins/**/*.js',
                    '<%= pkg.srcDir %>/scripts/core/core.js',
                    '<%= pkg.srcDir %>/scripts/core/requireConf.js'
                ],
                dest: '<%= pkg.destOrgDir %>/scripts/yfjs-original.js'
            },
            app: {
                src: [
                    '<%= pkg.srcDir %>/scripts/modules/spa/**.js',
                    '<%= pkg.srcDir %>/scripts/modules/spa/*/**.js'
                ],
                dest: '<%= pkg.destOrgDir %>/scripts/spa/spa.js'
            }
        },
        copy: {
            // copy test
            fontsTest: {
                expand: true,
                cwd: '<%= pkg.srcDir %>/fonts/',
                src: '**',
                dest: '<%= pkg.destTestDir %>/fonts/'
            },
            modulesTest: {
                expand: true,
                cwd: '<%= pkg.srcDir %>/scripts/modules/',
                src: ['**', '!spa/**'],
                dest: '<%= pkg.destTestDir %>/scripts/'
            },
            // copy build
            fonts: {
                expand: true,
                cwd: '<%= pkg.srcDir %>/fonts/',
                src: '**',
                dest: '<%= pkg.destOrgDir %>/fonts/'
            },
            modules: {
                expand: true,
                cwd: '<%= pkg.srcDir %>/scripts/modules/',
                src: ['**', '!spa/**'],
                dest: '<%= pkg.destOrgDir %>/scripts/'
            },
            fonts2Minify: {
                expand: true,
                cwd: '<%= pkg.srcDir %>/fonts/',
                src: '**',
                dest: '<%= pkg.destMinifyDir %>/fonts/'
            },
            modules2Minify: {
                expand: true,
                cwd: '<%= pkg.srcDir %>/scripts/modules/',
                src: ['**', '!spa/**', '!**/*.{css,js,html}'],
                dest: '<%= pkg.destMinifyDir %>/scripts/'
            }
        },
        cssmin: {
            options: {
                compatibility : 'ie8',  // 设置兼容模式
                noAdvanced : true,      // 取消高级特性
                keepSpecialComments: 0  // 删除所有的注释
            },
            base: {
                src: '<%= pkg.destOrgDir %>/styles/base.css',
                dest: '<%= pkg.destMinifyDir %>/styles/base.css'
            },
            modules: {
                expand: true,
                cwd: '<%= pkg.destOrgDir %>/scripts/',
                src: '**/*.css',
                dest: '<%= pkg.destMinifyDir %>/scripts/'
            }
        },
        uglify: {
            yfjs: {
                src: '<%= pkg.destOrgDir %>/scripts/yfjs-original.js',
                dest: '<%= pkg.destMinifyDir %>/scripts/yfjs.js'
            },
            modules: {
                expand: true,
                cwd: '<%= pkg.destOrgDir %>/scripts/',
                src: ['**/*.js', '!yfjs*.js'],
                dest: '<%= pkg.destMinifyDir %>/scripts/'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('concatTest', ['concat:baseTest', 'concat:yfjsTest', 'concat:appTest']);
    grunt.registerTask('copyTest', ['copy:fontsTest', 'copy:modulesTest']);

    grunt.registerTask('test', ['clean:test', 'concatTest', 'copyTest']);

    grunt.registerTask('concatBuild', ['concat:base', 'concat:yfjs', 'concat:yfjsOrg', 'concat:app']);
    grunt.registerTask('copyBuild', ['copy:fonts', 'copy:modules', 'copy:fonts2Minify', 'copy:modules2Minify']);

    grunt.registerTask('build', ['clean:All', 'concatBuild', 'uglify:yfjs', 'clean:yfjs', 'copyBuild', 'cssmin', 'uglify:modules']);

    grunt.registerTask('default', ['test']);
};