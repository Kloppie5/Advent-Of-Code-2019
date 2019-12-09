var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;

	data = data.split('').slice(0,-1);

	var width = 25;
	var height = 6;

	var image = {};

	for ( var i = 0 ; i*width*height < data.length ; ++i ) {
		var layer = data.slice(i*width*height, (i+1)*width*height);
		for ( var j = 0 ; j < layer.length ; ++j )
			if ( image[j] != 0 && image[j] != 1 )
		    image[j] = layer[j];
	}
	for ( var y = 0 ; y < height ; ++y ) {
		var line = "";
		for ( var x = 0 ; x < width ; ++x ) {
			line += (image[y*width+x]==0 ? "-" : "X");
		}
		console.log(line);
	}
});
