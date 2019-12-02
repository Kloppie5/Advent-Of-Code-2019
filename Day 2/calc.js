var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	var lines = data.split(',');

	lines[1] = 64;
	lines[2] = 21;

	for ( var cursor = 0 ; lines[cursor] != 99 ; cursor += 4 ) {
		if (lines[cursor] == 1) {
			console.log(`[${lines[cursor+3]}] = [${lines[cursor+1]}](${lines[lines[cursor+1]]}) + [${lines[cursor+2]}](${lines[lines[cursor+2]]})`);
			lines[lines[cursor+3]] = lines[lines[cursor+1]]*1 + lines[lines[cursor+2]]*1;
		}
		else if (lines[cursor] == 2) {
			console.log(`[${lines[cursor+3]}] = [${lines[cursor+1]}](${lines[lines[cursor+1]]}) * [${lines[cursor+2]}](${lines[lines[cursor+2]]})`);
			lines[lines[cursor+3]] = lines[lines[cursor+1]]*1 * lines[lines[cursor+2]]*1;
		}
	}

	console.log("Result[0]: " + lines[0]);
});

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	var lines = data.split(',');

	lines[1] = 12;
	lines[2] = 2;

	for ( var cursor = 0 ; lines[cursor] != 99 ; cursor += 4 ) {
		lines[lines[cursor+3]] = "(" +
			(( lines[cursor+1] == 1 || lines[cursor+1] == 2 )
				? `[${lines[cursor+1]}]`
				: (lines[lines[cursor+1]]))
			+
			(( lines[cursor] == 1 )
				? " + "
				: " * ")
			+
			(( lines[cursor+2] == 1 || lines[cursor+2] == 2 )
				? `[${lines[cursor+2]}]`
				: lines[lines[cursor+2]])
			+ ")";
	}

	console.log("Result[0]: " + lines[0]);
	// (2 + ((1 + (2 * ((1 + (((1 + ((((((5 * (5 + ((1 + (((((5 + (5 + ((4 * ((5 * [1]) + 4)) + 2))) + 4) * 5) + 3) * 5)) * 3))) + 1) * 5) + 2) + 1) * 2)) + 5) * 2)) + 3))) + [2]))
	// = 300000 * [1] + 490699 + [2]
	// = 19690720 => [64] [21]
});
