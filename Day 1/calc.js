var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	var lines = data.split('\r\n');

	console.log(lines);

	var r = 0;

	var day2 = true;

	for ( var i = 0; i < lines.length; ++i ) {
		if ( lines[i] <= 0 ) continue;
		var sa = (Math.floor(lines[i] / 3) - 2);
		console.log("Basic fuel requirement; " + sa);
		r += sa;

		if (day2)
			while (sa >= 9) {
				var si = (Math.floor(sa / 3) - 2);
				r += si;
				sa = si;
				console.log("Additional fuel requirement; " + si);
			}
	}

	console.log("For a total of; " + r);
});
