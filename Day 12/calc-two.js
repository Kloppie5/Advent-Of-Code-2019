var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;

	const parse = (data) => data
	.split('\n')
	.slice(0,-1)
	.map(pos => pos
		.replace('<', '')
		.replace('>', '')
		.split(',')
		.map(coordinate =>
			coordinate
			.split('=')
			[1]
			*1
		)
	);
	const transpose = (matrix) => matrix[0].map((col, i) => matrix.map(row => [row[i], 0]));
	const gcd = (a, b) => a ? gcd(b % a, a) : b;
	const lcm = (a, b) => a * b / gcd(a, b);

	console.log(
		transpose(parse(data))
		.map(axis => get_axis_period(axis))
		.reduce(lcm)
	);
});

function get_axis_period ( axis ) {
	var initial = axis.toString();
	var step = 0;
	do {
		++step;
		for ( var moon1 = 0; moon1 < axis.length ; ++moon1 ) {
			for ( var moon2 = moon1+1; moon2 < axis.length ; ++moon2 ) {
				var d = axis[moon1][0] < axis[moon2][0] ? 1 :
								axis[moon1][0] > axis[moon2][0] ? -1 :
								0;
				axis[moon1][1] += d;
				axis[moon2][1] -= d;
			}
		}
		axis.forEach ( moon => moon[0] += moon[1]);
	} while (axis.toString() != initial);
	return step;
}
