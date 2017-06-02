var buildConf = require('./build');
var path = require('path');

var tmplConf = buildConf.template || {};

var building = buildConf.building || {};

var copyDevTasks = [], copyBuildTasks = [], copyDocsTasks = [];

var reg_end_org = /\$Org$/, reg_end_min = /\$Min$/;

for (var taskId in building.copy) {
    if (taskId == "Docs") {
        copyDocsTasks.push("copy:"+taskId);
    } else if (reg_end_min.test(taskId)) {
        copyBuildTasks.push("copy:"+taskId);
    } else {
        copyDevTasks.push("copy:"+taskId);
    }
}

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            // dev clean
            dev: [buildConf.dir.destOrg],
            // build clean
            all: [buildConf.dir.dest],
            yfjs: [path.join(buildConf.dir.dest, "yfjs.js")],
            // doc clean
            doc: [buildConf.dir.destDoc]
        },
        template: {
            yfjsTest: {
                options: {
                    data: {
                        building: tmplConf.building,
                        require: tmplConf.require
                    }
                },
                files: tmplConf.yfjsTest
            },
            yfjs: {
                options: {
                    data: {
                        version: '<%= pkg.version %>'
                    }
                },
                files: tmplConf.yfjs
            },
            requireConf: {
                options: {
                    data: buildConf.require
                },
                files: tmplConf.requireConf
            }
        },
        concat: building.concat,
        copy: building.copy,
        cssmin: {
            options: {
                compatibility : 'ie8',  // 设置兼容模式
                noAdvanced : true,      // 取消高级特性
                keepSpecialComments: 0  // 删除所有的注释
            },
            base: {
                src: path.join(buildConf.dir.destOrgStyles, "base.css"),
                dest: path.join(buildConf.dir.destMinStyles, "base.css")
            },
            modules: {
                expand: true,
                cwd: buildConf.dir.destOrgModules,
                src: '**/*.css',
                dest: buildConf.dir.destMinModules
            }
        },
        uglify: {
            yfjs: {
                src: path.join(buildConf.dir.srcScripts, "yfjs.js"),
                dest: path.join(buildConf.dir.dest, "yfjs.js")
            },
            core: {
                src: buildConf.dir.destOrgCore,
                dest: buildConf.dir.destMinCore
            },
            modules: {
                expand: true,
                cwd: buildConf.dir.destOrgModules,
                src: ['**/*.js'],
                dest: buildConf.dir.destMinModules
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('cleanDev', ['clean:dev', 'clean:yfjs']);
    grunt.registerTask('copyDev', copyDevTasks);

    grunt.registerTask('dev', ['template', 'cleanDev', 'concat', 'copyDev', 'uglify:yfjs']);

    grunt.registerTask('cleanBuild', ['clean:all', 'clean:yfjs', 'clean:doc']);
    grunt.registerTask('copyBuild', ['copyDev'].concat(copyBuildTasks));

    grunt.registerTask('copyDocs', copyDocsTasks);

    grunt.registerTask('build', ['template', 'cleanBuild', 'concat', 'copyBuild', 'cssmin', 'uglify', 'copyDocs']);

    grunt.registerTask('default', ['dev']);
};