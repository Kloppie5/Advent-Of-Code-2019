var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	var lines = data.split('\n');
	console.log(lines);
	var wire1 = lines[0].split(',');
	var wire2 = lines[1].split(',');

	var mindistance = -1;

	var p1 = {'x' : 0, 'y' : 0};
	var c1 = {'x' : 0, 'y' : 0};
	for ( var i = 0 ; i < wire1.length ; ++i ) {
		var dir1 = wire1[i].substring(0,1);
		var d1 = wire1[i].substring(1)*1;

		var up ={'x' : 0, 'y' : 0};
		var left = {'x' : 0, 'y' : 0};
		var right = {'x' : 0, 'y' : 0};
		var down = {'x' : 0, 'y' : 0};

		switch(dir1) {
			case "U":
				c1.y += d1;
				up = c1;
				down = p1;
				break;
			case "D":
				c1.y -= d1;
				up = p1;
				down = c1;
				break;
			case "L":
				c1.x -= d1;
				left = c1;
				right = p1;
				break;
			case "R":
				c1.x += d1;
				left = p1;
				right = c1;
				break;
			default: console.log("CRITICAL ERROR"); break;
		}

		var p2 = {'x' : 0, 'y' : 0};
		var c2 = {'x' : 0, 'y' : 0};
		for ( var j = 0 ; j < wire2.length ; ++j ) {
			var dir2 = wire2[j].substring(0,1);
			var d2 = wire2[j].substring(1)*1;

			switch(dir2) {
				case "U":
					c2.y += d2;
					if ( dir1 == "U" || dir1 == "D" )
						break;
					up = c2;
					down = p2;
					break;
				case "D":
					c2.y -= d2;
					if ( dir1 == "U" || dir1 == "D" )
						break;
					up = p2;
					down = c2;
					break;
				case "L":
					c2.x -= d2;
					if ( dir1 == "L" || dir1 == "R" )
						break;
					left = c2;
					right = p2;
					break;
				case "R":
					c2.x += d2;
					if ( dir1 == "L" || dir1 == "R" )
						break;
					left = p2;
					right = c2;
					break;
				default: console.log("CRITICAL ERROR"); break;
			}
			//console.log(`ULRD (${up.x}, ${up.y}) (${left.x}, ${left.y}) (${right.x}, ${right.y}) (${down.x}, ${down.y})`);
			if ( left.x <= down.x && down.x <= right.x
			&&   down.y <= left.y && left.y <= up.y ) {
				if ( down.x == 0 && left.y == 0 ) {
					console.log(`Skipping intersection at origin.`);
				} else {
					var distance = Math.abs(down.x)+Math.abs(left.y)
					if ( mindistance == -1 || distance < mindistance ) {
						mindistance = distance;
						console.log(`New mindistance [${distance}] at (${down.x}, ${left.y})`);
					} else {
						console.log(`Further intersection at (${down.x}, ${left.y}) [${distance}]`);
					}
				}
			}

			p2.x = c2.x;
			p2.y = c2.y;
		}

		p1.x = c1.x;
		p1.y = c1.y;
	}

	console.log(`Resulting minimal distance is (${mindistance})`);
});
