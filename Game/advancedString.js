function advancedString(string, rectangleToFitIn, colorList) {

	this.canvas = document.getElementById('Mycanvas')
    this.context = this.canvas.getContext('2d')
	
	this.string = string;
	
	this.spaceWidth = this.context.measureText(" ").width; //used for spacing between words
	this.spaceHeight = this.context.measureText("T").height; this.spaceHeight += 3; //used for height spacing
	
	this.wordRectangle = new Array(); //used for words with colors to have a tooltip event.
	
	var currentWord = "";
	this.wordList = new Array();
	this.wordPositionList = new Array();
	
	this.wordColorList = new Array();
	this.wordTooltipList = new Array();
	
	for (var i = 0; i < string.length; i++) { 
	
		//Add string letter to currentword
		if (string[i] != " " && string[i] != "`" && string[i] != "&") { currentWord += string[i];}
		
		//found Color indicator
		if (string[i] == "`") {
		var returnList = this.findColor(string, i);
		this.wordColorList.push(returnList.colorAndNumber);
		string = returnList.string; }
		
		//found tooltip indicator
		if (string[i] == "&") {
		var returnList = this.findTooltip(string, i);
		this.wordTooltipList.push(returnList.colorAndNumber);
		string = returnList.string; }
		
		//new word has formed
		if (string[i] == " " || i == string.length - 1 || string[i] == null) { this.wordList.push(currentWord); currentWord = ""; }
	}
		
	
	var currentLength = 0;
	for (var i = 0; i < this.wordList.length; i++) {
		
		if (i > 0) {
		currentLength += this.spaceWidth;
		this.wordPositionList[i] = currentLength;
		currentLength += this.context.measureText(this.wordList[i]).width;
		} else { this.wordPositionList[0] = 0; currentLength += this.context.measureText(this.wordList[i]).width; }
	}	

	for (var i = 0; i < this.wordTooltipList.length; i++) {
		 var boxSize = this.context.measureText(this.wordList[this.wordTooltipList[i].word]).width;
		 this.wordRectangle.push(new Rectangle(this.wordPositionList[this.wordTooltipList[i].word], 640, boxSize, 12)); 
	}

	this.wordRectangle[0].boxColor = "blue";

}

advancedString.prototype.findColor = function(string, i) {

		if (string[i] == "`") {
		var clr = "";
		for (var t = 0; t < string.length; t++) { clr += string[i + t]; if ( t != 0 && string[i + t] == "`") { var point = i + t; break;} }
		clr = clr.substring(1, clr.length - 1)
		var colorAndNumber = { word: this.wordList.length, color: clr };
		
		var half1 = string.substring(0, i);
		var half2 = string.substring(point + 1, string.length);

		string = half1 + half2;}
		var returnList = {string: string, colorAndNumber: colorAndNumber};
		return returnList
}

advancedString.prototype.findTooltip = function(string, i) {

		if (string[i] == "&") {
		var clr = "";
		for (var t = 0; t < string.length; t++) { clr += string[i + t]; if ( t != 0 && string[i + t] == "&") { var point = i + t; break;} }
		clr = clr.substring(1, clr.length - 1)
		var colorAndNumber = { word: this.wordList.length, color: clr };
		
		var half1 = string.substring(0, i);
		var half2 = string.substring(point + 1, string.length);

		string = half1 + half2;}
		var returnList = {string: string, colorAndNumber: colorAndNumber};
		return returnList

}


advancedString.prototype.draw = function() {

	this.wordRectangle[0].draw();
    this.context.fillStyle = "white";
	
	for (var i = 0; i < this.wordList.length; i++) {
	this.context.fillStyle = "white";
	for (var t = 0; t < this.wordColorList.length; t++) { if (i == this.wordColorList[t].word) { this.context.fillStyle = this.wordColorList[t].color; } } //color
	this.context.fillText(this.wordList[i], this.wordPositionList[i], 650); }

}

	