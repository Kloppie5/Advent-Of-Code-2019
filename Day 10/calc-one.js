var fs = require('fs');

function run () {
	test ( "Test 1", "./test1.txt", 33 );
	test ( "Test 2", "./test2.txt", 35 );
	test ( "Test 3", "./test3.txt", 41 );
	test ( "Test 4", "./test4.txt", 210 );
	find_best_station_location("./input.txt", console.log );
}

function test ( test_name, filename, expected_result ) {
	find_best_station_location(filename, (result) => {
		if (result == expected_result)
			return;

		console.log(`${test_name} failed, expected '${expected_result}' but got '${result}'.`);
	});
}

function find_best_station_location ( filename, callback ) {
	fs.readFile(filename, {encoding: "utf8"}, function(err, data) {
		if(err) throw err;
		data = data.split('\n').slice(0,-1).map(line => line.split(''));

		var asteroids = [];

		for ( var y  = 0; y < data.length ; ++y )
			for ( var x = 0 ; x < data[0].length ; ++x )
				if ( data[y][x] == "#" )
					asteroids.push({ 'x' : x, 'y' : y, 'v' : 0, 's' : [] });

		for ( var a1 = 0; a1 < asteroids.length ; ++a1 ) {
			for ( var a2 = 0 ; a2 < asteroids.length ; ++a2 ) {
				if ( a1 == a2 ) continue;
				var dy = asteroids[a2].y-asteroids[a1].y;
				var dx = asteroids[a2].x-asteroids[a1].x;
				var d = Math.abs(gcd(dy,dx));
				if (asteroids[a1].s.filter(a => a.dy == dy/d && a.dx == dx/d).length == 0) {
					asteroids[a1].v++;
					asteroids[a1].s.push({ 'dy' : dy/d, 'dx' : dx/d });
				}
			}
			// console.log(asteroids[a1]);
		}

		callback(asteroids.map(asteroid => asteroid.v).reduce((l, r) => l > r ? l : r));
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
