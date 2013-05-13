var container = document.getElementById('letters_container');

var alphabet = { 1: 'a', 5: 'b', 3: 'c', 11: 'd', 9: 'e', 7 : 'f', 15: 'g', 13: 'h', 6: 'i', 14: 'j', 17: 'k', 21: 'l', 19: 'm', 27: 'n', 47: 'ñ', 25: 'o', 23: 'p', 31: 'q', 29: 'r', 22: 's', 30: 't', 49: 'u', 53: 'v', 46: 'w', 51: 'x', 59: 'y', 57: 'z' }
var letters = [];
var BrailleLetter = function() {
	this.checkboxes = [];
	this.letter = document.createElement('span');
	for(i = 0; i<6; i++) {
		checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.value = Math.pow(2, i);
		checkbox.letter = this;
		checkbox.onclick = function() { this.letter.updateResult(); }
		this.checkboxes[i] = checkbox;
		if(!(i%2)) this.letter.appendChild(document.createElement('br'));
		this.letter.appendChild(checkbox);
	}

	this.output = document.createElement('input');
	this.output.readonly = true;
	this.letter.appendChild(this.output);

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

BrailleLetter.prototype.updateResult = function() {
	this.output.value = this.character();
}
