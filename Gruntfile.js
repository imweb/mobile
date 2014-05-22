module.exports = function (grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat : {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'src/tools/tools.core.js',
                    'src/tools/tools.bom.js',
                    'src/tools/tools.cookie.js',
                    'src/tools/tools.event.js',
                    'src/tools/tools.html.js',
                    'src/tools/tools.render.js',
                    'src/tools/tools.storage.js',
                    'src/tools/tools.str.js',
                    'src/tools/tools.report.js'
                ],
                dest: 'dist/tools.js'
            }
        },
        copy : {
            dist : {
                src : ['src/**' , '!src/tools/**'],
                dest : 'dist',
                cwd : 'src'
            }
        },

        clean : {
            dist : 'dist'
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadTasks("tasks");



    // 默认被执行的任务列表。
    grunt.registerTask('default', ['clean:dist' , 'copy:dist'  , 'concat:dist']);

};