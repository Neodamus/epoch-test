function advancedString(string, x, y) {

	this.canvas = document.getElementById('Mycanvas')
    this.context = this.canvas.getContext('2d')
	
	this.string = string;
	
	this.spaceWidth = this.context.measureText(" ").width; //used for spacing between words
	this.spaceHeight = 12 * 2.5; //used for height spacing
	
	this.wordRectangle = new Array(); //used for words with colors to have a tooltip event.
	
	var currentWord = "";
	this.wordList = new Array();
	this.wordPositionList = new Array();
	
	this.wordColorList = new Array();
	this.wordTooltipList = new Array();
	
	var startx = x;
	var starty = y;
	
	var currentLength = startx;
	var currentHeight = starty;
	var currentColor = "white";
	
	this.wordPositionList[0] = {x: currentLength, y: currentHeight};
	
	for (var i = 0; i < string.length; i++) { 
	
		//Add string letter to currentword
		if (string[i] != " " && string[i] != "`" && string[i] != "^" && string[i] != "&") { 
			currentWord += string[i];
		 }
		
		//new line found
		if (string[i] == "^") {
			//this.spaceHeight;
			currentHeight += this.spaceHeight;
			currentLength = startx;
		}
		
		//found Color indicator
		if (string[i] == "`") {
			var returnList = findColor(string, i);
		/*	this.wordColorList.push(returnList.colorAndNumber);*/
			string = returnList.string; 
			currentColor = returnList.color
			
			}
		
		
		
		//found tooltip indicator
		if (string[i] == "&") {
			var returnList = findTooltip(string, i, this.wordList);
			this.wordTooltipList.push(returnList.colorAndNumber);
			string = returnList.string; }
		
		//new word has formed
		if (string[i] == " " || i == string.length - 1 || string[i] == null) { 
			if (this.wordPositionList.length == 1) { currentLength += this.spaceWidth; }
			currentLength += this.context.measureText(currentWord).width;
			this.wordColorList[this.wordList.length] = currentColor;
			this.wordList.push(currentWord);
			this.wordPositionList[this.wordList.length] = {x: currentLength, y: currentHeight };
			currentLength += this.spaceWidth;
			
			currentWord = "";
		}

	}
	

	for (var i = 0; i < this.wordTooltipList.length; i++) {
		 var boxSize = this.context.measureText(this.wordList[this.wordTooltipList[i].word]).width;
		 this.wordRectangle.push(new Rectangle(this.wordPositionList[this.wordTooltipList[i].word].x, this.wordPositionList[this.wordTooltipList[i].word].y - 12, boxSize, 12)); 
		 this.wordRectangle[i].boxColor = "blue";
	}

	

}

function wordWrap(string, width) {
var totalString = "";
var word = "";

	//color and tooltip extras are counted when they shouldnt be... need to find a solution.
	for (var i = 0; i < string.length; i ++) {
		
		/*		//found Color indicator
		if (string[i] == "`") { 
			var returnList = findColor(string, i);
			exception = string.length - returnList.string; 
			} 
		//found tooltip indicator
		if (string[i] == "&") { 
			var returnList = findTooltip(string, i);
			exception = string.length - returnList.string;} */
			
		
		word += string[i];
		if (_.context.measureText(word).width  > width && string[i] == " ") {
			
			exception = 0;
			totalString += word;
			totalString += " ^ "
			word = "";
		}
		
	
	}
if (word != "") { totalString += word; }
return totalString;
}


function findColor(string, i) {

		if (string[i] == "`") {
		var clr = "";
		for (var t = 0; t < string.length; t++) { clr += string[i + t]; if ( t != 0 && string[i + t] == "`") { var point = i + t; break;} }
		clr = clr.substring(1, clr.length - 1)
		//var colorAndNumber = { word: this.wordList.length, color: clr };
		
		var half1 = string.substring(0, i);
		var half2 = string.substring(point + 1, string.length);

		string = half1 + half2;}
		var returnList = {string: string, color: clr};
		return returnList;
}

function findTooltip(string, i, wordList) {
		
		var colorAndNumber = null;
		if (string[i] == "&") {
		var clr = "";
		for (var t = 0; t < string.length; t++) { clr += string[i + t]; if ( t != 0 && string[i + t] == "&") { var point = i + t; break;} }
		clr = clr.substring(1, clr.length - 1);
		if (wordList != null) {
		var colorAndNumber = { word: wordList.length, color: clr }; }
		
		var half1 = string.substring(0, i);
		var half2 = string.substring(point + 1, string.length);

		string = half1 + half2;}
		var returnList = {string: string, colorAndNumber: colorAndNumber};
		return returnList

}


advancedString.prototype.draw = function() {

	for (var i = 0; i < this.wordRectangle.length; i++) {
	this.wordRectangle[i].draw(); }
    this.context.fillStyle = "white";
	
	for (var i = 0; i < this.wordList.length; i++) {
	//this.context.fillStyle = "white";
	//for (var t = 0; t < this.wordColorList.length; t++) { if (i == this.wordColorList[t].word) { this.context.fillStyle = this.wordColorList[t].color; } } //color
	this.context.fillStyle = this.wordColorList[i];
	this.context.fillText(this.wordList[i], this.wordPositionList[i].x, this.wordPositionList[i].y); }

}

	