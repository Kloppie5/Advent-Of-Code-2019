var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;

	data = data.split('').slice(0,-1);

	var width = 25;
	var height = 6;

	var min_counts = { '0' : width*height };

	for ( var i = 0 ; i*width*height < data.length ; ++i ) {
		var layer = data.slice(i*width*height, (i+1)*width*height);
		var counts = {};
		for ( var j = 0 ; j < layer.length ; ++j )
		    counts[layer[j]] = 1 + (counts[layer[j]] || 0);
		if (counts[0] < min_counts[0])
			min_counts = counts;
	}
	console.log(min_counts[1]*min_counts[2]);
});
