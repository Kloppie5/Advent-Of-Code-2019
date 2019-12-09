var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;

	var phase = [0, 1, 2, 3, 4];

	var max = 0;

	for ( var i = 0 ; i < phase.length**phase.length ; ++i ) {
		var attempt = [];
		for ( var j = 0; j < phase.length; ++j ) {
			 attempt.push(phase[Math.floor(i / phase.length**j) % phase.length]);
		}
		if ( (new Set(attempt)).size !== attempt.length )
			continue;
		var signal = [0];
		for ( var j = 0 ; j < 5; ++j ) {
			signal = interpret(data.split(','), [attempt[j]].concat(signal));
		}
		console.log(`[${attempt}]: ${signal[0]}`);
		if (signal[0] > max)
			max = signal[0];
	}
	console.log(max);
});
function interpret ( memory, input ) {
	var IP = 0;
	var IC = 0;
	var output = [];
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
				memory[memory[IP+1]] = input[IC];
				IP += 2;
				IC += 1;
				break;
			case 4: // OUTPUT/1
				output.push(((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]]));
				IP += 2;
				break;
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
				return output;
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return;
		}
	}
}
