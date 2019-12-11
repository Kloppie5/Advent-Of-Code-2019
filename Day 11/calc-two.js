var fs = require('fs');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;
	memory = data.split(',').map(possible_string => possible_string*1);

	var IP = 0;
	var BASE = 0;

	var toggle_paint_move = true;

	var painted_tiles = [{ 'x' : 0, 'y' : 0, 'color' : 1 }];
	var x = 0;
	var y = 0;
	var dir = "UP";

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
		var input = (painted_tiles.filter(tile => tile.x == x && tile.y == y)[0] || {'color':0}).color;
		memory[pardest(pard, dest)] = input;
		IP += 2;
	}
	function OUTPUT ( par, src ) {
		if (toggle_paint_move) {
			var color = read(par, src);
			if (painted_tiles.filter(tile => tile.x == x && tile.y == y).length != 0)
				painted_tiles.filter(tile => tile.x == x && tile.y == y)[0].color = color;
			else
				painted_tiles.push({ 'x' : x, 'y' : y, 'color' : color });
		} else {
			var turn = read(par, src);
			switch(dir) {
				case "UP": 		dir = turn ? "RIGHT"  : "LEFT"; 	x += turn ? 1 : -1; break;
				case "LEFT": 	dir = turn ? "UP"  		: "DOWN"; 	y += turn ? -1 : 1; break;
				case "RIGHT": dir = turn ? "DOWN" 	: "UP";  		y += turn ? 1 : -1; break;
				case "DOWN": 	dir = turn ? "LEFT" 	: "RIGHT";  x += turn ? -1 : 1; break;
				default: console.log("CRITICAL ERROR"); return;
			}
		}
		toggle_paint_move = !toggle_paint_move;
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
			case 99:
				external_camera ();
			return;
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return;
		}
	}

	function external_camera ( ) {
		var minx = painted_tiles.map(tile => tile.x).reduce((l, r) => l < r ? l : r);
		var maxx = painted_tiles.map(tile => tile.x).reduce((l, r) => l > r ? l : r);
		var miny = painted_tiles.map(tile => tile.y).reduce((l, r) => l < r ? l : r);
		var maxy = painted_tiles.map(tile => tile.y).reduce((l, r) => l > r ? l : r);

		for ( var y = miny ; y <= maxy ; ++y ) {
			var string = "";
			for ( var x = minx ; x <= maxx ; ++x ) {
				if (painted_tiles.filter(tile => tile.x == x && tile.y == y).length != 0) {
					string += painted_tiles.filter(tile => tile.x == x && tile.y == y)[0].color ? "#" : ".";
				} else
					string += ".";
			}
			console.log(string);
		}
	}
});
