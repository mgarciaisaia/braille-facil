var container = document.getElementById('letters_container');

var alphabet = { 1: 'a', 2: 'b', 3: 'c', 4: 'd' }
var letters = [];
var BrailleLetter = function() {
	this.checkboxes = [];
	this.letter = document.createElement('span');
	for(i = 0; i<6; i++) {
		checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.value = Math.pow(2, i);
		this.checkboxes[i] = checkbox;
		if(!(i%2)) this.letter.appendChild(document.createElement('br'));
		this.letter.appendChild(checkbox);
	}
	this.button = document.createElement('input');
	this.button.type = 'button';
	this.button.letter = this;
	this.button.onclick = function() { console.log(this.letter.character()); }
	this.button.value = "Dame!";
	this.letter.appendChild(this.button);
	letters[letters.length] = this.letter;
	container.appendChild(this.letter);
}

BrailleLetter.prototype.code = function() {
	code = 0;
	for(i in this.checkboxes) {
		if(this.checkboxes[i].checked) {
			code += parseInt(this.checkboxes[i].value);
		}
	}
	return code;
}

BrailleLetter.prototype.character = function() {
	return alphabet[this.code()];
}
