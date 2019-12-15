var fs = require('fs');

(function () {
	test ( "Test 1", "./test1.txt", 31 );
	test ( "Test 2", "./test2.txt", 165 );
	test ( "Test 3", "./test3.txt", 13312 );
	test ( "Test 4", "./test4.txt", 180697 );
	test ( "Test 5", "./test5.txt", 2210736 );
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

		var inventory = {};
		inventory.FUEL = -1;

		while (true) {
			var target = null;
			for (var i in inventory)
				if (inventory[i] < 0 && i != 'ORE')
					target = i;
			if (target == null)
				break;

			var reaction = reactions.find(e => e.p[1] == target);

			inventory[target] += reaction.p[0]*1;

			reaction.i.forEach(i => {inventory[i[1]] = (inventory[i[1]] || 0) - i[0]*1});
		}

		callback(inventory['ORE']*-1);
	});
}

function test ( test_name, filename, expected_result ) {
	run (filename, (result) => {
		if (result == expected_result)
			return;

		console.log(`${test_name} failed, expected '${expected_result}' but got '${result}'.`);
	});
}
