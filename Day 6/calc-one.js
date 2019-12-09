var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	var orbits = data.split('\n').slice(0, -1).map(orbit => orbit.split(')'));

	var tree = {};
	orbits.forEach(orbit => {
		if (orbit[0] in tree)
			tree[orbit[0]].children.push(orbit[1]);
		else
			tree[orbit[0]] = { 'parent' : null, 'children' : [orbit[1]]};
		if (orbit[1] in tree)
			tree[orbit[1]].parent = orbit[0];
		else
			tree[orbit[1]] = { 'parent' : orbit[1], 'children' : []};
	});
	var level = 0;
	var orbit_count = 0;
	var bodies = ['COM'];
	while (bodies.length != 0) {
		console.log(`[${level}]: ${bodies}`);
		var next = [];
		bodies.forEach(body => {
			orbit_count += level;
			next = next.concat(tree[body].children);
		});
		bodies = next;
		level += 1;
	}
	console.log(orbit_count);
});
