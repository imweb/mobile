/**
 * Created by chriscai on 2014/5/22.
 */


var fs = require('fs'),
    path = require('path');


module.exports = function (grunt){


    grunt.registerMultiTask('copy', 'copy file ' , function (){

        var src = [].concat(this.data.src),
            dest = this.data.dest,
            cwd = this.data.cwd;

        grunt.file.expand(this.data.src).forEach(function (filePath){
            var srcPath = path.resolve(filePath);

            if(grunt.file.isDir(srcPath)){
                return;
            }
            if(cwd){
                filePath = filePath.replace(cwd , '');
            }
            var distPath =   path.resolve(dest + filePath);

            grunt.log.writeln('copy :', srcPath , ' -> ' ,distPath);
            grunt.file.copy( srcPath, distPath);
        });



    });

};