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
			var counts = str.reduce((a, c) => {
			  a[c] = (a[c] || 0) + 1;
			  return a;
			}, {});
			for (let k in counts) {
		  	if (counts[k] === 2) {
		    	count++;
					console.log(i + " | "+ str +" : "+ Object.values(counts));
					break;
				}
			}
		}
	}

	console.log(`${count} passwords.`);

});
