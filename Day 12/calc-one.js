var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	data = data
	.split('\n')
	.slice(0,-1)
	.map(pos => { return {
		'pos' : pos
			.replace('<', '')
			.replace('>', '')
			.split(',')
			.map(coordinate =>
				coordinate
				.split('=')
				[1]
				*1
			),
		'vel' : [0,0,0]
	};});

	for ( var step = 0 ; step < 1000 ; ++step ) {
		data.forEach ( moon1 => {
			data.forEach ( moon2 => {
				if (moon1 == moon2) return;
				for ( var axis = 0 ; axis < 3 ; ++axis ) {
					var d = moon1.pos[axis] < moon2.pos[axis] ? 1 :
									moon1.pos[axis] > moon2.pos[axis] ? -1 :
									0;
					moon1.vel[axis] += d;
				}
			});
		});
		data.forEach ( moon => {
			for ( var axis = 0 ; axis < 3 ; ++axis )
				moon.pos[axis] += moon.vel[axis];
		});
		print_data(data);
	}

	console.log(data.reduce((l, r) => l +	(r.pos.reduce((il, ir) => il + Math.abs(ir), 0)*r.vel.reduce((il, ir) => il + Math.abs(ir), 0)), 0));
});

function print_data ( data ) {
	console.log(`pos-x | pos-y | pos-z || vel-x | vel-y | vel-z || poten | kinet | total`);
	console.log(`-------------------------------------------------------------------------`);
	data.forEach(moon =>
		console.log(
			`${moon.pos[0].toString().padStart(5, ' ')} | `+
			`${moon.pos[1].toString().padStart(5, ' ')} | `+
			`${moon.pos[2].toString().padStart(5, ' ')} || `+
			`${moon.vel[0].toString().padStart(5, ' ')} | `+
			`${moon.vel[1].toString().padStart(5, ' ')} | `+
			`${moon.vel[2].toString().padStart(5, ' ')} || `+
			`${moon.pos.reduce((l, r) => l + Math.abs(r), 0).toString().padStart(5, ' ')} | `+
			`${moon.vel.reduce((l, r) => l + Math.abs(r), 0).toString().padStart(5, ' ')} | `+
			`${(moon.pos.reduce((l, r) => l + Math.abs(r), 0)*moon.vel.reduce((l, r) => l + Math.abs(r), 0)).toString().padStart(5, ' ')}`
		)
	);
	console.log();
}
