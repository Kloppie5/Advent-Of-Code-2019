var fs = require('fs');

(function () {
	test ( "Test 4", "./test4.txt", 84462026 );
	test ( "Test 5", "./test5.txt", 78725270 );
	test ( "Test 6", "./test6.txt", 53553731 );
	run ("./input.txt", console.log );
}());

function run ( filename, callback ) {
	fs.readFile(filename, {encoding: "utf8"}, function(err, data) {
		if(err) throw err;
		data = data.split('').slice(0,-1).map(s => s*1);

		var size = 10000*data.length-data.join('').slice(0,7);

		data.reverse();
		for ( var i = 0 ; data.length < size ; ++i ) data.push(data[i]);

		for ( var phase = 0 ; phase < 100 ; ++phase ) {
			var result = [];
			var prev = 0;
			for ( var i = 0 ; i < data.length ; ++i ) {
				result[i] = (data[i] + prev)%10;
				prev = result[i];
			}
			data = result;
		}
		callback(data.slice(-8).reverse().join(''));
	});
}

function test ( test_name, filename, expected_result ) {
	run (filename, (result) => {
		if (result == expected_result)
			return;

		console.log(`${test_name} failed, expected '${expected_result}' but got '${result}'.`);
	});
}
