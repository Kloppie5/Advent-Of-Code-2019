var fs = require('fs');

function run () {
	test ( "Test 4", "./test4.txt", { 'x' : 11, 'y' : 13 }, { 'x' : 8, 'y' : 2 } );
	find_200th_asteroid("./input.txt", { 'x' : 26, 'y' : 29 }, console.log );
}

function test ( test_name, filename, location, expected_result ) {
	find_200th_asteroid(filename, location, (result) => {
		if (result.x == expected_result.x && result.y == expected_result.y)
			return;

		console.log(`${test_name} failed, expected '(${expected_result.x}, ${expected_result.y})' but got '(${result.x}, ${result.y})'.`);
	});
}

function find_200th_asteroid ( filename, location, callback ) {
	fs.readFile(filename, {encoding: "utf8"}, function(err, data) {
		if(err) throw err;
		data = data.split('\n').slice(0,-1).map(line => line.split(''));

		var destroyed = 0;

		while (true) {

			var asteroids = [];

			for ( var y  = 0; y < data.length ; ++y ) {
				for ( var x = 0 ; x < data[0].length ; ++x ) {
					if ( x == location.x & y == location.y ) continue;
					if ( data[y][x] == "#" ) {
						var dy = y-location.y;
						var dx = x-location.x;
						var d = Math.abs(gcd(dy,dx));
						if (asteroids.filter(a => a.dy == dy/d && a.dx == dx/d).length == 0) {
							asteroids.push({ 'x' : x, 'y' : y, 'dy' : dy/d, 'dx' : dx/d, 'a' : (Math.atan2(dy, dx)/Math.PI*180+360+90)%360 });
						}
					}
				}
			}
			// console.log(asteroids);
			if ( asteroids.length == 0 ) return { 'status' : "ERROR" };
			if ( asteroids.length < 200-destroyed ) {
				destroyed += asteroids.length;
				asteroids.forEach(a => {data[a.y][a.x] = 'B'});
				continue;
			}

			asteroids.sort((l, r) => l.a > r.a ? 1 : -1);
			callback(asteroids[200-destroyed-1]);
			return;
		}
	});
}

function gcd ( a, b ) {
	while ( b != 0 ) {
  	var r = a % b;
    a = b;
    b = r;
  }
  return a;
}

run();
