/**
 * Copyright (C) 2013 BrailleFacil Contributors
 *
 * This file is part of BrailleFacil
 * 
 * BrailleFacil is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * BrailleFacil is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with BrailleFacil.  If not, see <http://www.gnu.org/licenses/>.
 */

Array.prototype.remove = function(element) {
	var index;
	while((index = this.indexOf(element)) != -1) {
		this.splice(index, 1);
	}
	return this;
};

var container = document.getElementById('braille-wrapper');

var alphabet = (function(lettersToCodes, capitalCode, numeralCode, lettersToNumbers){
	var codesToLetters = {};
	var numbersToLetters = {};
	for(var letter in lettersToCodes) {
		codesToLetters[lettersToCodes[letter]] = letter;
	}
	for(var letter in lettersToNumbers) {
		numbersToLetters[lettersToNumbers[letter]] = letter;
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
		NUMERAL_LETTER: codesToLetters[numeralCode],
		getNumber: function(letter) {
			return lettersToNumbers[letter];
		},
		getNumberLetter: function(number) {
			return numbersToLetters[number];
		},
		isNumberizable: function(letter) {
			return letter in lettersToNumbers;
		},
		isNumber: function(number) {
			return number in numbersToLetters;
		}
	};
})({'a':1,'b':3,'c':9,'d':25,'e':17,'f':11,'g':27,'h':19,'i':10,'j':26,'k':5,'l':7,'m':13,'n':29,'o':21,'p':15,'q':31,'r':23,'s':14,'t':30,'u':37,'v':39,'w':58,'x':45,'y':61,'z':53, \u00f1 : 59, \u00e1: 55, \u00e9: 46, \u00ed: 12, \u00f3: 44, \u00fa: 62, \u00fc: 51, '&' : 47, '.' : 4, '#' : 60, '\u2191' : 40 , ',' : 2, '?' : 34, ';' : 6, '!' : 22, '"' : 38, '(' : 35, ')' : 28, '-' : 36, '*' : 20, ' ' : 0, ':' : 18 },
		40, 60, {'a': '1', 'b': '2', 'c': '3', 'd': '4', 'e': '5', 'f': '6', 'g': '7', 'h': '8', 'i': '9', 'j' : '0'});

var outputText = (function() {
	var outputText = document.createElement('textarea');
	outputText.lastValue = '';
	outputText.onkeyup = function() {
		if(this.value !== this.lastValue) {
			this.lastValue = this.value;
			while(cells.length) {
				cells[0].remove();
			}
			addCells(BrailleCell.forPhrase(this.lastValue));
		}
	};
	outputContainer = document.createElement('div');
	outputContainer.appendChild(outputText);
	container.appendChild(outputContainer);

	return {
		update: function() {
			var capitalizeNext = false, numberize = false;
			// FIXME: detectar y marcar como erroneo dos [vieneMayuscula] seguidas
			outputText.value = cells.reduce(function(text, aCell) {
				var character = aCell.getCharacter() || ' ';
				if(capitalizeNext) {
					character = character.toUpperCase();
				}
				if(numberize) {
					if(alphabet.isNumberizable(character)) {
						character = alphabet.getNumber(character);
					} else {
						numberize = false;
					}
				} else {
					numberize = aCell.getCharacter() === alphabet.NUMERAL_LETTER;
					character = numberize ? '' : character;
				}
				
				capitalizeNext = aCell.getCharacter() === alphabet.CAPITAL_LETTER;
				return text + (capitalizeNext ? '' : character);
			}, '');
			outputPatterns.update();
			cells.forEach(function(aCell) {
				aCell.updateResult();
			});
			if(cells.length !== 0 && cells[cells.length - 1].code() !== 0) {
				appendCell(BrailleCell.forCharacter(' '));
			}
		}
	};
})();

var outputPatterns = (function() {
	var outputPatterns = document.createElement('textarea');
	outputPatterns.readOnly = true;
	outputPatterns.lastValue = '';
	outputContainer = document.createElement('div');
	outputContainer.appendChild(outputPatterns);
	container.appendChild(outputContainer);

	return {
		update: function() {
			outputPatterns.value = cells.reduce(function(text, aCell) {
				return text + aCell.braillePattern();
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
		dot.value = value;
		dot.onclick = function() {
			outputText.update();
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
		that.remove();
	};

	this.cell.appendChild(deleteButton);
};

BrailleCell.forPhrase = function(phrase) {
	var cells = [];
	var numberized = { value: false };
	for(var index = 0; index < phrase.length; index++) {
		var letterCells = BrailleCell.forLetter(phrase[index], numberized);
		letterCells.forEach(function(cell) { cells.push(cell); });
	}
	return cells;
};

BrailleCell.forLetter = function(letter, numberized) {
	var cells = [];
	if(alphabet.isNumber(letter)) {
		if(!numberized.value) {
			cells.push(BrailleCell.forCharacter(alphabet.NUMERAL_LETTER));
			numberized.value = true;
		}
		cells.push(BrailleCell.forCharacter(alphabet.getNumberLetter(letter)));
		return cells;
	} else {
		numberized.value = false;
	}
	if(letter !== letter.toLowerCase()) {
		cells.push(BrailleCell.forCharacter(alphabet.CAPITAL_LETTER));
	}
	cells.push(BrailleCell.forCharacter(letter.toLowerCase()));
	outputText.update();
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
			code += Math.pow(2, parseInt(aDot.value));
		}
	});
	return code;
};

BrailleCell.prototype.setCharacter = function(character) {
	var code = alphabet.getCode(character);
	var sortedDots = this.dots.sort(function(previous, next) { return next.value - previous.value; });
	sortedDots.forEach(function(dot) {
		dot.checked = code >= Math.pow(2, dot.value);
		if(dot.checked) {
			code -= Math.pow(2, dot.value);
		}
	});
};

BrailleCell.prototype.getCharacter = function() {
	return alphabet.getLetter(this.code());
};

BrailleCell.BLANK_PATTERN_UNICODE = 10240;
BrailleCell.prototype.braillePattern = function() {
	return String.fromCharCode(BrailleCell.BLANK_PATTERN_UNICODE + this.code());
};

BrailleCell.prototype.updateResult = function() {
	this.output.className = this.getCharacter() ? '' : 'error';
	this.output.value = this.getCharacter() || '';
};


BrailleCell.prototype.remove = function() {
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
