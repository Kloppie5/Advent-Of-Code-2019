var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	var data = data.split('\n')[0].split('-');

	var min = data[0].split('');
	for ( var i = 0, m = 0 ; i < min.length ; ++i ) {
		if ( min[i] > m )
			m = min[i];
		min[i] = m;
	}
	min = min.join('');

	var max = data[1].split('');
	for ( var i = 0, m = 9 ; i < max.length ; ++i ) {
		if ( max[i] < m )
			m = max[i];
		max[i] = m;
	}
	max = max.join('');

	console.log(`${min}-${max}`);

	var count = 0;

	for ( var i = min ; i <= max ; ++i ) {
		var str = i.toString().split('');
		if ( str.sort().join('') == i ) {
			if ( !str.every((v, k, s) => s.indexOf(v) === k ) ) {
				count++;
			} else {
				console.log(i +"X");
			}
		}
	}

	console.log(`${count} passwords.`);

});
