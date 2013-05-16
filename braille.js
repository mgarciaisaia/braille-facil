Array.prototype.remove = function(element) {
	var index;
	while((index = this.indexOf(element)) != -1) {
		this.splice(index, 1);
	}
	return this;
};

var container = document.getElementById('letters_container');

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
			outputText.value = letters.reduce(function(text, aLetter) {
				return text + (aLetter.getCharacter() || ' ');
			}, '');
		}
	};
})();

var letters = [];
var BrailleLetter = function() {
	this.checkboxes = [];
	this.letter = document.createElement('div');
	this.letter.className = 'letter';
	var that = this, row;
	[0,1,2,3,4,5].forEach(function(i) {
		if(!(i % 2)) {
			row = document.createElement('div');
			that.letter.appendChild(row);
		}
		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.value = Math.pow(2, i);
		checkbox.onclick = function() {
			that.updateResult();
		};
		that.checkboxes.push(checkbox);
		row.appendChild(checkbox);
	});

	this.output = document.createElement('input');
	this.output.type = 'text';
	this.output.readOnly = true;
	this.letter.appendChild(this.output);

	var deleteButton = document.createElement('input');
	deleteButton.type = 'button';
	deleteButton.value = 'x';
	deleteButton.className = 'delete';
	deleteButton.onclick = function() {
		that.delete();
	};

	this.letter.appendChild(deleteButton);

	letters.push(this);
	container.appendChild(this.letter);
};

BrailleLetter.prototype.code = function() {
	code = 0;
	this.checkboxes.forEach(function(checkbox) {
		if(checkbox.checked) {
			code += parseInt(checkbox.value);
		}
	});
	return code;
};

BrailleLetter.prototype.getCharacter = function() {
	return alphabet.getLetter(this.code());
};

BrailleLetter.prototype.updateResult = function() {
	this.output.className = this.getCharacter() ? '' : 'error';
	this.output.value = this.getCharacter() || '';
	outputText.update();
};


BrailleLetter.prototype.delete = function() {
	this.letter.parentNode && this.letter.parentNode.removeChild(this.letter);
	letters.remove(this);
	outputText.update();
};

new BrailleLetter();