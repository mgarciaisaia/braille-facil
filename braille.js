Array.prototype.remove = function(element) {
	var index;
	while((index = this.indexOf(element)) != -1) {
		this.splice(index, 1);
	}
	return this;
};

var container = document.getElementById('braille-wrapper');

var alphabet = (function(lettersToCodes){
	var codesToLetters = {};
	for(var letter in lettersToCodes) {
		codesToLetters[lettersToCodes[letter]] = letter;
	}

	return {
		getLetter: function(code) {
			return codesToLetters[code];
		}
	};
})({'a':1,'c':3,'b':5,'i':6,'f':7,'e':9,'d':11,'h':13,'j':14,'g':15,'k':17,'m':19,'l':21,'s':22,'p':23,'o':25,'n':27,'r':29,'t':30,'q':31,'w':46,'ñ':47,'u':49,'x':51,'v':53,'z':57,'y':59});

var outputText = (function() {
	var outputText = document.createElement('textarea');
	outputContainer = document.createElement('div');
	outputContainer.appendChild(outputText);
	container.appendChild(outputContainer);

	return {
		update: function() {
			outputText.value = cells.reduce(function(text, aCell) {
				return text + (aCell.getCharacter() || ' ');
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
	[0,1,2,3,4,5].forEach(function(i) {
		if(!(i % 2)) {
			row = document.createElement('div');
			that.cell.appendChild(row);
		}
		var dot = document.createElement('input');
		dot.type = "checkbox";
		dot.value = Math.pow(2, i);
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

	cells.push(this);
	container.appendChild(this.cell);
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

new BrailleCell();