var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	interpret(data.split(',').map(possible_string => possible_string*1), 1);
});

function interpret ( memory, input ) {
	var IP = 0;
	var BASE = 0;
	function read ( par, src ) {
		return par == 0 ? memory[src] :
					 par == 1 ? src :
					 par == 2 ? memory[BASE+src]
					 : "ERROR";
	}
	function pardest ( par, dest ) {
		return par == 0 ? dest :
					 par == 2 ? BASE+dest
					 : "ERROR";
	}
	function ADD ( par1, src1, par2, src2, pard, dest ) {
		memory[pardest(pard, dest)] = read(par1, src1) + read(par2, src2);
		IP += 4;
	}
	function MULT ( par1, src1, par2, src2, pard, dest ) {
		memory[pardest(pard, dest)] = read(par1, src1) * read(par2, src2);
		IP += 4;
	}
	function INPUT ( pard, dest ) {
		memory[pardest(pard, dest)] = input;
		IP += 2;
	}
	function OUTPUT ( par, src ) {
		console.log(`OUTPUT: ${read(par, src)}`);
		IP += 2;
	}
	function JUMP_IF_TRUE ( parc, cond, parj, jump ) {
		if ( read(parc, cond) != 0 )
			IP = read(parj, jump);
		else
			IP += 3;
	}
	function JUMP_IF_FALSE ( parc, cond, parj, jump ) {
		if ( read(parc, cond) == 0 )
			IP = read(parj, jump);
		else
			IP += 3;
	}
	function LESS_THAN ( par1, src1, par2, src2, pard, dest ) {
		memory[pardest(pard, dest)] = (read(par1, src1) < read(par2, src2));
		IP += 4;
	}
	function EQUALS ( par1, src1, par2, src2, pard, dest ) {
		memory[pardest(pard, dest)] = (read(par1, src1) == read(par2, src2));
		IP += 4;
	}
	function REBASE ( par, src ) {
		BASE += read(par, src);
		IP += 2;
	}

	while ( true ) {
		console.log(`[${BASE} | ${IP}]; ${memory.slice(IP, IP+4)}`);
		switch ( memory[IP] % 100 ) {
			case 1: ADD          (Math.floor(memory[IP]/100)%10, memory[IP+1], Math.floor(memory[IP]/1000)%10, memory[IP+2], Math.floor(memory[IP]/10000)%10, memory[IP+3]); break;
			case 2: MULT         (Math.floor(memory[IP]/100)%10, memory[IP+1], Math.floor(memory[IP]/1000)%10, memory[IP+2], Math.floor(memory[IP]/10000)%10, memory[IP+3]); break;
			case 3: INPUT        (Math.floor(memory[IP]/100)%10, memory[IP+1]                                                                                             ); break;
			case 4: OUTPUT       (Math.floor(memory[IP]/100)%10, memory[IP+1]                                                                                             ); break;
			case 5: JUMP_IF_TRUE (Math.floor(memory[IP]/100)%10, memory[IP+1], Math.floor(memory[IP]/1000)%10, memory[IP+2]                                               ); break;
			case 6: JUMP_IF_FALSE(Math.floor(memory[IP]/100)%10, memory[IP+1], Math.floor(memory[IP]/1000)%10, memory[IP+2]                                               ); break;
			case 7: LESS_THAN    (Math.floor(memory[IP]/100)%10, memory[IP+1], Math.floor(memory[IP]/1000)%10, memory[IP+2], Math.floor(memory[IP]/10000)%10, memory[IP+3]); break;
			case 8: EQUALS       (Math.floor(memory[IP]/100)%10, memory[IP+1], Math.floor(memory[IP]/1000)%10, memory[IP+2], Math.floor(memory[IP]/10000)%10, memory[IP+3]); break;
			case 9: REBASE       (Math.floor(memory[IP]/100)%10, memory[IP+1]                                                                                             ); break;
			case 99: return;
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return;
		}
	}
}
