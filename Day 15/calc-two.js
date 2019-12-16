var fs = require('fs');
var readline = require('readline-sync');

fs.readFile("./input.txt", {encoding: "utf8"}, function(err, data) {
	if(err) throw err;

	var memory = data.split(',').map(possible_string => possible_string*1);
	var input = []; //("NNWWSSWWWWNNNNNNNNNNEESSSSEESSEENNEESSEENNEESSSSEESSSSEEEESSWWSSEEEEEEEENNWWNNEENNWWWWWWNNEEEEEENNNNNNNNWWSSSSWWNNNNWWSSSSSSWWWWNNEENNNNWWWWSSWWWWWWNNNNWWWWWWNNEENNNNEEEEEESSSSEESSEEEEEEEENNNNWWSSWWWWNNEENNEENNEESSEESSEEEESSWWSSWWNN").split('');
	var output = [];

	arcade (memory, input, output);
});

var SEARCH = true;

var input_history = [];
function arcade ( memory, input, output ) {
	var path = [];
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

	var joystick;
	function INPUT ( pard, dest ) {
		if ( input.length ) {
			joystick = input.shift();
		} else {
			if (SEARCH) {
				if 			(screen[y-1]		=== undefined || screen[y-1][x] == ' ') joystick = 'N';
				else if (screen[y+1] 		=== undefined || screen[y+1][x] == ' ') joystick = 'S';
				else if (screen[y][x-1] === undefined || screen[y][x-1] == ' ') joystick = 'W';
				else if (screen[y][x+1] === undefined || screen[y][x+1] == ' ') joystick = 'E';
				else if (screen[y-1]		=== undefined || screen[y-1][x] == 'X') joystick = 'N';
				else if (screen[y+1] 		=== undefined || screen[y+1][x] == 'X') joystick = 'S';
				else if (screen[y][x-1] === undefined || screen[y][x-1] == 'X') joystick = 'W';
				else if (screen[y][x+1] === undefined || screen[y][x+1] == 'X') joystick = 'E';
				else joystick = 'T';
			}
			else
				joystick = ['N', 'S', 'W', 'E'][readline.question("Input: ")*1-1];

			input_history.push(joystick);
		}
		memory[pardest(pard, dest)] = joystick == 'N' ? 1 :
																  joystick == 'S' ? 2 :
																  joystick == 'W' ? 3 :
																  joystick == 'E' ? 4 :
																  0;
		IP += 2;
	}

	var x = 0;
	var y = 0;
	var width = 1;
	var height = 1;
	var screen = [['D']];
	var max_path = 0;
	function OUTPUT ( par, src ) {
		var reply = read(par, src);

		(function () {
			if (reply == 2) {
				console.log(`Reached Location (${x}, ${y}) + ${joystick}`);
				if (path.length == 1) {
					input.push('T');
					return;
				}
				x = 0;
				y = 0;
				width = 1;
				height = 1;
				screen = [['D']];
				path = [];
				max_path = 0;
				return;
			}

			console.log(`x: ${x}, y: ${y}, width: ${width}, height: ${height}, path: ${path.length}, max_path: ${max_path}`);
			for ( var iy = 0 ; iy < height ; ++iy )
				console.log(screen[iy].join(''));

			var nx = x;
			var ny = y;

			switch (joystick) {
				case 'N': ny--; break;
				case 'S': ny++; break;
				case 'W': nx--; break;
				case 'E': nx++; break;
				default:
					console.log(`UNSUPPORTED INPUT ${joystick}`);
					break;
			}

			if (ny < 0) {
				var line = []; for ( var ix = 0; ix < width ; ++ix ) line.push(' ');
				screen.unshift(line);
				height++;
				ny++
				y++;
			}
			if (ny == height) {
				var line = []; for ( var ix = 0; ix < width ; ++ix ) line.push(' ');
				screen.push(line);
				height++;
			}

			if (nx < 0) {
				screen.forEach(row => row.unshift(' '));
				width++;
				nx++
				x++;
			}
			if (nx == width) {
				screen.forEach(row => row.push(' '));
				width++;
			}

			if (reply == 0) {
				screen[ny][nx] = "#";
				return;
			}

			if (screen[ny][nx] == "X") {
				screen[y][x] = ".";
				path.pop();
			} else {
				screen[y][x] = "X";
				path.push(joystick);
				if (path.length > max_path) max_path = path.length;
			}

			screen[ny][nx] = "D";
			x = nx;
			y = ny;

		}());

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
		//console.log(`[${BASE} | ${IP}]; ${memory.slice(IP, IP+4)}`);
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
				console.log("Input History:");
				console.log(input_history.join(''));
				console.log("Path:");
				console.log(path.join(''));
			return;
			default:
				console.log(`UNSUPPORTED OPERATION ${memory[IP]} at IP(${IP})`);
				console.log(memory);
				return;
		}
	}
}
