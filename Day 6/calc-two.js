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
			tree[orbit[1]] = { 'parent' : orbit[0], 'children' : []};
	});

	var REACHABLE = [];
	for ( var HEAD = 'YOU' ; tree[HEAD].parent !== null ; HEAD = tree[HEAD].parent )
		REACHABLE.push(HEAD);

	var path = 0;
	for ( var HEAD = 'SAN' ; tree[HEAD].parent !== null ; HEAD = tree[HEAD].parent ) {
		if (REACHABLE.indexOf(HEAD) == -1) {
			path += 1;
			continue;
		}

		path += REACHABLE.indexOf(HEAD);
		break;
	}

	console.log(path-2);
});
