var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	interpret(data.split(','), false, [1]);
});

function interpret ( memory, verbose, input ) {
	var IP = 0;
	var IC = 0;
	while ( true ) {
		if ( verbose )
			console.log(`${memory[IP]}:`);
		switch ( memory[IP] % 100 ) {
			case 1: // ADD/3
				if ( verbose )
					console.log(`<${(memory[IP]/10000)&1}>[${memory[IP+3]}] = <${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}) + <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				memory[memory[IP+3]] =
					((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1
					+
					((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				IP += 4;
				break;
			case 2: // MULT/3
				if ( verbose )
					console.log(`<${(memory[IP]/10000)&1}>[${memory[IP+3]}] = <${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}) * <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				memory[memory[IP+3]] =
					((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1
					*
					((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				IP += 4;
				break;
			case 3: // INPUT/1
				if ( verbose )
					console.log(`Received input ${input[IC]}`);
				memory[memory[IP+1]] = input[IC];
				IP += 2;
				IC += 1;
				break;
			case 4: // OUTPUT/1
				console.log(`OUTPUT: ${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])}`);
				IP += 2;
				break;
			case 99: // HALT/0
				if ( verbose )
					console.log(`Halting`);
				return;
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return;
		}
	}
}
