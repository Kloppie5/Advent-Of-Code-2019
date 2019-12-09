var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	verbose_interpret(data.split(','), [5]);
	console.log(`----------------------`);
	interpret(data.split(','), [5]);
});

function verbose_interpret ( memory, input ) {
	var IP = 0;
	var IC = 0;
	while ( true ) {
		console.log(`${memory[IP]}:`);
		switch ( memory[IP] % 100 ) {
			case 1: // ADD/3
				console.log(`ADD <${(memory[IP]/10000)&1}>[${memory[IP+3]}] = <${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}) + <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				memory[memory[IP+3]] =
					((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1
					+
					((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				IP += 4;
				break;
			case 2: // MULT/3
				console.log(`MULT <${(memory[IP]/10000)&1}>[${memory[IP+3]}] = <${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}) * <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				memory[memory[IP+3]] =
					((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1
					*
					((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				IP += 4;
				break;
			case 3: // INPUT/1
				console.log(`Received input ${input[IC]}`);
				memory[memory[IP+1]] = input[IC];
				IP += 2;
				IC += 1;
				break;
			case 4: // OUTPUT/1
				console.log(`OUTPUT: ${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])}`);
				IP += 2;
				break;
			case 5: // JT/2
				console.log(`JT<${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}) to <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				if ( ((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1 ) {
					console.log(`TRUE`);
					IP = ((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				} else {
					console.log(`FALSE`);
					IP += 3;
				}
				break;
			case 6: // JF/2
				console.log(`JF<${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}) to <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				if ( ((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1 ) {
					console.log(`TRUE`);
					IP += 3;
				} else {
					console.log(`FALSE`);
					IP = ((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1;
				}
				break;
			case 7: // LT/3
				console.log(`LT <${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}), <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				memory[(memory[IP]/10000)&1 ? IP+3 : memory[IP+3]] =
					(((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1
					<
					((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1)*1;
				IP += 4;
				break;
			case 8: // EQ/3
				console.log(`EQ <${(memory[IP]/100)&1}>[${memory[IP+1]}, ${memory[memory[IP+1]]}](${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1}), <${(memory[IP]/1000)&1}>[${memory[IP+2]}, ${memory[memory[IP+2]]}](${((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1})`);
				memory[(memory[IP]/10000)&1 ? IP+3 : memory[IP+3]] =
					(((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])*1
					==
					((memory[IP]/1000)&1 ? memory[IP+2] : memory[memory[IP+2]])*1)*1;
				IP += 4;
				break;
			case 99: // HALT/0
				console.log(`Halting`);
				return;
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return;
		}
	}
}
function interpret ( memory, input ) {
	var IP = 0;
	var IC = 0;
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
				console.log(`OUTPUT: ${((memory[IP]/100)&1 ? memory[IP+1] : memory[memory[IP+1]])}`);
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
				return;
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return;
		}
	}
}
