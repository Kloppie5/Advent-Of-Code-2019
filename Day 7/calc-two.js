var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;

	var phase = [5,6,7,8,9];

	var max = 0;

	for ( var i = 0 ; i < phase.length**phase.length ; ++i ) {
		var attempt = [];
		for ( var j = 0; j < phase.length; ++j ) {
			 attempt.push(phase[Math.floor(i / phase.length**j) % phase.length]);
		}
		if ( (new Set(attempt)).size !== attempt.length )
			continue;

		var r = [];
		for ( var j = 0 ; j < 5; ++j )
			r[j] = { 'status' : 'INIT', 'memory' : data.split(','), 'IP' : 0, 'phase' : attempt[j], 'signal' : 0 };
		do {
			for ( var j = 0 ; j < 5; ++j ) {
				r[j] = resumable_interpret(r[j].memory, r[j].IP, r[j].phase, r[(j+4)%5].signal);
			}
		} while ( r[4].status != 'HALT' );

		console.log(`[${attempt}]: ${r[4].signal}`);
		if (r[4].signal > max)
			max = r[4].signal;
	}
	console.log(max);
});
function resumable_interpret ( memory, IP, phase, input ) {
	while ( true ) {
		switch ( memory[IP] % 100 ) {
			case 1: // ADD/3
				memory[memory[IP+3]] = ((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1 + ((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				IP += 4;
				break;
			case 2: // MULT/3
				memory[memory[IP+3]] = ((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1 * ((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				IP += 4;
				break;
			case 3: // INPUT/1
				if ( phase != -1 ) {
					memory[memory[IP+1]] = phase;
					phase = -1;
				}
				else
					memory[memory[IP+1]] = input;
				IP += 2;
				break;
			case 4: // OUTPUT/1
				var output = ((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]]);
				IP += 2;
				return { 'status' : 'RESUMABLE', 'memory' : memory, 'IP' : IP, 'phase' : -1, 'signal' : output };
			case 5: // JT/2
				IP = (((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1) ? (((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1) : (IP+3);
				break;
			case 6: // JF/2
				IP = (((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1) ? (IP+3) : (((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1)
				break;
			case 7: // LT/3
				memory[(memory[IP]/10000)&1 ? IP+3 : memory[IP+3]] = (((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1 < ((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1)*1;
				IP += 4;
				break;
			case 8: // EQ/3
				memory[(memory[IP]/10000)&1 ? IP+3 : memory[IP+3]] = (((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1 == ((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1)*1;
				IP += 4;
				break;
			case 99: // HALT/0
				return { 'status' : 'HALT', 'memory' : memory, 'IP' : IP, 'phase' : -1, 'signal' : input };
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return { 'status' : 'ERROR', 'memory' : memory, 'IP' : IP, 'phase' : -1 };
		}
	}
}
