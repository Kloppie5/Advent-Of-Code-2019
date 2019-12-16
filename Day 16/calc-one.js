var fs = require('fs');

(function () {
	test ( "Test 1", "./test1.txt", 24176176 );
	test ( "Test 2", "./test2.txt", 73745418 );
	test ( "Test 3", "./test3.txt", 52432133 );
	run ("./input.txt", console.log );
}());

function run ( filename, callback ) {
	fs.readFile(filename, {encoding: "utf8"}, function(err, data) {
		if(err) throw err;
		data = data.split('').slice(0,-1).map(s => s*1);
		for ( var phase = 0 ; phase < 100 ; ++phase ) {
			var result = [];
			for ( var round = 0 ; round < data.length ; ++round ) {
				var pattern = [];
				while ( pattern.length-1 < data.length ) {
					for ( var i = 0 ; i <= round && pattern.length-1 < data.length; ++i ) pattern.push(0);
					for ( var i = 0 ; i <= round && pattern.length-1 < data.length; ++i ) pattern.push(1);
					for ( var i = 0 ; i <= round && pattern.length-1 < data.length; ++i ) pattern.push(0);
					for ( var i = 0 ; i <= round && pattern.length-1 < data.length; ++i ) pattern.push(-1);
				}
				pattern.shift();
				var r = 0;
				for ( var i = 0 ; i < data.length ; ++i ) {
					r = (r + 1*data[i]*pattern[i]);
				}
				result.push(r%10 * (r < 0 ? -1 : 1) );
			}
			data = result;
		}
		callback(data.slice(0,8).join(''));
	});
}

function test ( test_name, filename, expected_result ) {
	run (filename, (result) => {
		if (result == expected_result)
			return;

		console.log(`${test_name} failed, expected '${expected_result}' but got '${result}'.`);
	});
}
