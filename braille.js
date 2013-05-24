Array.prototype.remove = function(element) {
	var index;
	while((index = this.indexOf(element)) != -1) {
		this.splice(index, 1);
	}
	return this;
};

var container = document.getElementById('braille-wrapper');

var alphabet = (function(lettersToCodes, capitalCode, numeralCode){
	var codesToLetters = {};
	for(var letter in lettersToCodes) {
		codesToLetters[lettersToCodes[letter]] = letter;
	}

	return {
		getLetter: function(code) {
			return codesToLetters[code];
		},
		getCode: function(letter) {
			return lettersToCodes[letter];
		},
		CAPITAL_CODE: capitalCode,
		NUMERAL_CODE: numeralCode,
		CAPITAL_LETTER: codesToLetters[capitalCode],
		NUMERAL_LETTER: codesToLetters[numeralCode]
	};
})({'a':1,'b':3,'c':9,'d':25,'e':17,'f':11,'g':27,'h':19,'i':10,'j':26,'k':5,'l':7,'m':13,'n':29,'o':21,'p':15,'q':31,'r':23,'s':14,'t':30,'u':37,'v':39,'x':45,'y':61,'z':53,'ñ':59, 'á': 55, 'é': 46, 'í': 12, 'ó': 44, 'ú': 62, 'ü': 51, '&' : 47, '.' : 4, '#' : 60, '\u2191' : 40 , ',' : 2, '?' : 34, ';' : 6, '!' : 22, '"' : 38, '(' : 35, ')' : 28, '-' : 36, '*' : 20, ' ' : 0}, 40, 60);

var outputText = (function() {
	var outputText = document.createElement('textarea');
	outputText.lastValue = '';
	outputText.onkeyup = function() {
		if(this.value !== this.lastValue) {
			this.lastValue = this.value;
			while(cells.length) {
				cells[0].delete();
			}
			addCells(BrailleCell.forPhrase(this.lastValue));
		}
	};
	outputContainer = document.createElement('div');
	outputContainer.appendChild(outputText);
	container.appendChild(outputContainer);

	return {
		update: function() {
			var capitalizeNext = false, number = false;
			// FIXME: detect & point out double upperCase chars
			outputText.value = cells.reduce(function(text, aCell) {
				var character = aCell.getCharacter() || ' ';
				if(capitalizeNext) {
					character = character.toUpperCase();
				}
				
				capitalizeNext = aCell.getCharacter() === alphabet.CAPITAL_LETTER;
				return text + (capitalizeNext ? '' : character);
			}, '');
		}
	};
})();

var cells = [];
var BrailleCell = function() {
	this.dots = [];
	this.cell = document.createElement('div');
	this.cell.className = 'cell';
	var that = this, row;
	[0,3,1,4,2,5].forEach(function(value, i) {
		if(!(i % 2)) {
			row = document.createElement('div');
			that.cell.appendChild(row);
		}
		var dot = document.createElement('input');
		dot.type = "checkbox";
		dot.value = Math.pow(2, value);
		dot.onclick = function() {
			that.updateResult();
		};
		that.dots.push(dot);
		row.appendChild(dot);
	});

	this.output = document.createElement('input');
	this.output.type = 'text';
	this.output.readOnly = true;
	this.cell.appendChild(this.output);

	var deleteButton = document.createElement('input');
	deleteButton.type = 'button';
	deleteButton.value = 'x';
	deleteButton.className = 'delete';
	deleteButton.onclick = function() {
		that.delete();
	};

	this.cell.appendChild(deleteButton);
};

BrailleCell.forPhrase = function(phrase) {
	var cells = [];
	for(var index = 0; index < phrase.length; index++) {
		var letterCells = BrailleCell.forLetter(phrase[index]);
		letterCells.forEach(function(cell) { cells.push(cell); });
	}
	return cells;
};

BrailleCell.forLetter = function(letter) {
	var cells = [];
	if(letter !== letter.toLowerCase()) {
		cells.push(BrailleCell.forCharacter(alphabet.CAPITAL_LETTER));
	}
	cells.push(BrailleCell.forCharacter(letter.toLowerCase()));
	return cells;
};

BrailleCell.forCharacter = function(character) {
	var cell = new BrailleCell();
	cell.setCharacter(character);
	return cell;
};

BrailleCell.prototype.code = function() {
	code = 0;
	this.dots.forEach(function(aDot) {
		if(aDot.checked) {
			code += parseInt(aDot.value);
		}
	});
	return code;
};

BrailleCell.prototype.setCharacter = function(character) {
	var code = alphabet.getCode(character);
	var sortedDots = this.dots.sort(function(previous, next) { return next.value - previous.value; });
	sortedDots.forEach(function(dot) {
		dot.checked = code >= dot.value;
		if(dot.checked) {
			code -= dot.value;
		}
	});
	this.updateResult();
};

BrailleCell.prototype.getCharacter = function() {
	return alphabet.getLetter(this.code());
};

BrailleCell.prototype.updateResult = function() {
	this.output.className = this.getCharacter() ? '' : 'error';
	this.output.value = this.getCharacter() || '';
	outputText.update();
};


BrailleCell.prototype.delete = function() {
	this.cell.parentNode && this.cell.parentNode.removeChild(this.cell);
	cells.remove(this);
	outputText.update();
};

function addCells(cells) {
	cells.forEach(function(cell) {
		appendCell(cell);
	});
	outputText.update();
};

function appendCell(aCell) {
	cells.push(aCell);
	container.appendChild(aCell.cell);
}
function addCell(instance) {
	appendCell(instance);
	outputText.update();
}

function newCell() {
	addCell(BrailleCell.forCharacter(' '));
};

newCell();
