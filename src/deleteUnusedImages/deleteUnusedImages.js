var path = require('path'),
	fs = require('fs');

module.exports = function(grunt){
	grunt.registerTask('deleteUnusedImage', function(){
		var assets = [],
	        links = [],
	        ref = grunt.config.get('ref');

	    // Get list of images
	    grunt.file.expand({
	        filter: 'isFile',
	        cwd: ref.pack // image path
	    }, ['**/*.png', '**/*.jpg', '**/*.gif']).forEach(function(file){
	    	// collect all image
	        assets.push(file);
	    });

	    // Find images in content
	    grunt.file.expand({
	        filter: 'isFile',
	        cwd: ref.pack
	    }, ['**/*.js', '**/*.html']).forEach(function(file){ // Change this to narrow down the search
	        var content = grunt.file.read(path.join(ref.pack, file));
	        assets.forEach(function(asset){
	            if(content.search(asset) !== -1){
	                links.push(asset);
	            }
	        });
	    });

	    console.log('============================================');
	    // Output unused images
	    var unused = grunt.util._.difference(assets, links);
	    console.log('Found '+ unused.length +' unused images:');
	    unused.forEach(function(el){
	    	grunt.file.expand({
		        filter: 'isFile',
		        cwd: ref.pack // Change this to your images dir
		    }, ['**/*.png', '**/*.jpg', '**/*.gif']).forEach(function(file){
		        if(el == file){
		        	// 删除无用图片
		        	fs.unlink(path.join(ref.pack, file));
		        }
		    });
	    });

	    // 删除空目录
	    var deleteEmptyDir = function(dir){
	    	if(fs.existsSync(dir)){
	    		var subFile = fs.readdirSync(dir);
	    		if(subFile.length === 0){
	    			fs.rmdir(dir);
	    		}
	    	}
	    };

	    // 过滤目录
	    grunt.file.expand({
	    	filter: 'isDirectory',
	    	cwd: ref.pack
	    }, ['**']).forEach(function(directory){
	    	deleteEmptyDir(path.join(ref.pack, directory));
	    })
	});

	return {
	    deleteImage: {
	    }
	};
};