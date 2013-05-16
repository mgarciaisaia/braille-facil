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
	var output = document.createElement('textarea');
	outputContainer = document.createElement('div');
	outputContainer.appendChild(output);
	container.appendChild(outputContainer);
	return output;
})();

var letters = [];
var BrailleLetter = function() {
	this.checkboxes = [];
	this.letter = document.createElement('div');
	this.letter.className = 'letter';
	var that = this, row;
	for(i = 0; i < 6; i++) {
		if(!(i % 2)) {
			row = document.createElement('div');
			this.letter.appendChild(row);
		}
		checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.value = Math.pow(2, i);
		checkbox.onclick = function() {
			that.updateResult();
		};
		this.checkboxes[i] = checkbox;
		row.appendChild(checkbox);
	}

	this.output = document.createElement('input');
	this.output.type = 'text';
	this.output.readOnly = true;
	this.letter.appendChild(this.output);

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

BrailleLetter.prototype.character = function() {
	return alphabet.getLetter(this.code());
};

BrailleLetter.prototype.updateResult = function() {
	this.output.className = this.character() ? '' : 'error';
	this.output.value = this.character() || '';
	updateOutput();
}

function updateOutput() {
	var output = '';
	letters.forEach(function(aLetter) {
		output += aLetter.character() || ' ';
	});
	outputText.value = output;
};

new BrailleLetter();
