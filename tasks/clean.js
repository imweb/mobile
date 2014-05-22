/**
 * Created by chriscai on 2014/5/22.
 */


var fs = require('fs'),
    path = require('path');


module.exports = function (grunt){


    grunt.registerMultiTask('clean', 'clean file ' , function (){
        var abDir = path.resolve(this.data);

        if(grunt.file.exists(abDir)){
            grunt.file.delete(abDir);
        }
        if(!grunt.file.exists(abDir)){
            grunt.file.mkdir(abDir);
        }



    });

};