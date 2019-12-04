var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	var lines = data.split('\n');
	console.log(lines);
	var wire1 = lines[0].split(',');
	var wire2 = lines[1].split(',');

	var mindistance = -1;

	var p1 = {'x' : 0, 'y' : 0, 'd' : 0};
	var c1 = {'x' : 0, 'y' : 0, 'd' : 0};
	for ( var i = 0 ; i < wire1.length ; ++i ) {
		var dir1 = wire1[i].substring(0,1);
		var d1 = wire1[i].substring(1)*1;

		c1.x += (dir1 == "R" ? d1 : (dir1 == "L" ? -d1 : 0));
		c1.y += (dir1 == "U" ? d1 : (dir1 == "D" ? -d1 : 0));
		c1.d += d1;

		var p2 = {'x' : 0, 'y' : 0, 'd' : 0};
		var c2 = {'x' : 0, 'y' : 0, 'd' : 0};
		for ( var j = 0 ; j < wire2.length ; ++j ) {
			var dir2 = wire2[j].substring(0,1);
			var d2 = wire2[j].substring(1)*1;

			c2.x += (dir2 == "R" ? d2 : (dir2 == "L" ? -d2 : 0));
			c2.y += (dir2 == "U" ? d2 : (dir2 == "D" ? -d2 : 0));
			c2.d += d2;

			var intersection = {'x' : 0, 'y' : 0, 'd' : -1};

			switch ( dir1+dir2 ) {
				case "UL": if ( (p1.y <= p2.y && p2.y <= c1.y) && (c2.x <= p1.x && p1.x <= p2.x) ) {
						intersection.x = p1.x;
						intersection.y = p2.y;
						intersection.d = p1.d + p2.d + (p2.y - p1.y) + (p2.x - p1.x);
					} break;
				case "UR": if ( (p1.y <= p2.y && p2.y <= c1.y) && (p2.x <= p1.x && p1.x <= c2.x) ) {
						intersection.x = p1.x;
						intersection.y = p2.y;
						intersection.d = p1.d + p2.d + (p2.y - p1.y) + (p1.x - p2.x);
					} break;
				case "LU": if ( (c1.x <= p2.x && p2.x <= p1.x) && (p2.y <= p1.y && p1.y <= c2.y) ) {
						intersection.x = p2.x;
						intersection.y = p1.y;
						intersection.d = p1.d + p2.d + (p1.x - p2.x) + (p1.y - p2.y);
					} break;
				case "LD": if ( (c1.x <= p2.x && p2.x <= p1.x) && (c2.y <= p1.y && p1.y <= p2.y) ) {
						intersection.x = p2.x;
						intersection.y = p1.y;
						intersection.d = p1.d + p2.d + (p1.x - p2.x) + (p2.y - p1.y);
					} break;
				case "RU": if ( (p1.x <= p2.x && p2.x <= c1.x) && (p2.y <= p1.y && p1.y <= c2.y) ) {
						intersection.x = p2.x;
						intersection.y = p1.y;
						intersection.d = p1.d + p2.d + (p2.x - p1.x) + (p2.y - p2.y);
					} break;
				case "RD": if ( (p1.x <= p2.x && p2.x <= c1.x) && (c2.y <= p1.y && p1.y <= p2.y) ) {
						intersection.x = p2.x;
						intersection.y = p1.y;
						intersection.d = p1.d + p2.d + (p2.x - p1.x) + (p2.y - p1.y);
					} break;
				case "DL": if ( (c1.y <= p2.y && p2.y <= p1.y) && (c2.x <= p1.x && p1.x <= p2.x) ) {
						intersection.x = p1.x;
						intersection.y = p2.y;
						intersection.d = p1.d + p2.d + (p1.y - p2.y) + (p2.x - p1.x);
					} break;
				case "DR": if ( (c1.y <= p2.y && p2.y <= p1.y) && (p2.x <= p1.x && p1.x <= c2.x) ) {
						intersection.x = p1.x;
						intersection.y = p2.y;
						intersection.d = p1.d + p2.d + (p1.y - p2.y) + (p1.x - p2.x);
					} break;
				case "UU": if ( p1.x == p2.x && (c1.y >= p2.y || c2.y >= p1.y) ) {
						console.log("UNSUPPORTED COLLISION TYPE UU");
					}	break;
				case "UD": if ( p1.x == p2.x && (c1.y >= p2.y || c2.y <= p1.y) ) {
						console.log("UNSUPPORTED COLLISION TYPE UD");
					}	break;
				case "LL": if ( p1.y == p2.y && (c1.x <= p2.x || c2.x <= p1.x) ) {
						console.log("UNSUPPORTED COLLISION TYPE LL");
					}	break;
				case "LR": if ( p1.y == p2.y && (c1.x <= p2.x || c2.x >= p1.x) ) {
						console.log("UNSUPPORTED COLLISION TYPE LR");
					}	break;
				case "RL": if ( p1.y == p2.y && (c1.x >= p2.x || c2.x <= p1.x) ) {
						console.log("UNSUPPORTED COLLISION TYPE RL");
					}	break;
				case "RR": if ( p1.y == p2.y && (c1.x >= p2.x || c2.x >= p1.x) ) {
						console.log("UNSUPPORTED COLLISION TYPE RR");
					}	break;
				case "DU": if ( p1.x == p2.x && (c1.y <= p2.y || c2.y >= p1.y) ) {
						console.log("UNSUPPORTED COLLISION TYPE DU");
					}	break;
				case "DD": if ( p1.x == p2.x && (c1.y <= p2.y || c2.y <= p1.y) ) {
						console.log("UNSUPPORTED COLLISION TYPE DD");
					}	break;
			}

			if ( intersection.x != 0 || intersection.y != 0 ) {
				if ( mindistance == -1 || intersection.d < mindistance ) {
					mindistance = intersection.d;
					console.log(`New mindistance [${intersection.d}] at (${intersection.x}, ${intersection.y})`);
				} else {
					console.log(`Further intersection at (${intersection.x}, ${intersection.y}) [${intersection.d}]`);
				}
			}

			p2.x = c2.x; p2.y = c2.y; p2.d = c2.d;
		}

		p1.x = c1.x; p1.y = c1.y; p1.d = c1.d;
	}

	console.log(`Resulting minimal distance is (${mindistance})`);
});
