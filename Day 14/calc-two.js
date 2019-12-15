var fs = require('fs');

(function () {
	test ( "Test 3", "./test3.txt", 82892753 );
	test ( "Test 4", "./test4.txt", 5586022 );
	test ( "Test 5", "./test5.txt", 460664 );
	run ("./input.txt", console.log );
}());

function run ( filename, callback ) {
	fs.readFile(filename, {encoding: "utf8"}, function(err, data) {
		if(err) throw err;
		var reactions =
			data
			.split('\n')
			.slice(0,-1)
			.map(r => { return {
				'i' : r.split('=>')[0].split(',').map(i => i.trim().split(' ')),
				'p' : r.split('=>')[1].trim().split(' ')
			};});

		var inventory = { 'FUEL' : -1, 'ORE' : 0 };
		while (true) {
			var target = null;
			for (var i in inventory)
				if (inventory[i] < 0 && i != 'ORE')
					target = i;
			if (target == null)
				break;

			var reaction = reactions.find(e => e.p[1] == target);

			var multiplier = -1*inventory[target]/reaction.p[0]*1;
			inventory[target] = 0;

			reaction.i.forEach(i => {inventory[i[1]] = (inventory[i[1]] || 0) - i[0]*multiplier});
		}

		callback(Math.floor(1000000000000/inventory['ORE']*-1));
	});
}

function test ( test_name, filename, expected_result ) {
	run (filename, (result) => {
		if (result == expected_result)
			return;

		console.log(`${test_name} failed, expected '${expected_result}' but got '${result}'.`);
	});
}
