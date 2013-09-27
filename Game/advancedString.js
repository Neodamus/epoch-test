function advancedString(string, x, y) {

	this.font = "15px Georgia"; //line 3, 4, 6, 91 deal with font-- needs cleanup
	_.context.font = this.font;
	this.canvas = _.canvas;
    this.context = _.context;
	
	
	this.string = string;
	
	this.spaceWidth = this.context.measureText(" ").width; //used for spacing between words
	this.spaceHeight = 15 * 2.5; //used for height spacing
	
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
	
		//Add string letter to current word
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

function wordWrap(string, width) { //Current word wrap bugs: sometimes the last word can be pushed to the next line... starts @ line 152, minor bug.
_.context.font = "15px Georgia";
var totalString = "";
var word = "";
var exception = 0;

var clr = false;

	//if a color is found-- it measures the color and makes an exception for the word wrapping because it won't be visible.
	for (var i = 0; i < string.length; i ++) {
				
		if (string[i] == "`" && clr == false) {
			var cWord = "";
			
				for (var t = 0; t < string.length - i; t++) {
					
					cWord += string[i + t]; 
					if (string[i + t] == "`" && t != 0) { break; }
				}
				
			exception += _.context.measureText(cWord).width; console.warn(cWord);// console.warn(cWord);
			clr = true;} 
			else { if (string[i] == "`") { clr = false; } }
			
			
		//if a tooltip is found-- it should ignore all text within!
			if (string[i] == "&") { 
			} 
			
		
		word += string[i]; //adds character to current line.

		//Measuring current line, making exceptions, and adding a word to the next line(which negatively influences the exception)
		
		if (string[i] == " " && _.context.measureText(word).width > width + exception) {

			var size = _.context.measureText(word).width - (width + exception); //How much is the current word off by?

				var wordL = "";
				var lastException = "";
				var lastColor = false;
				for (var q = 0; q < word.length - 1; q++) {
					
					wordL += word[word.length - 1 - q]; //forming a new line backwards.
					if (word[word.length - 1 - q] == "`") { lastColor = true; }
					if (lastColor == true) { lastException += word[word.length - 1 - q]; if (lastException.length > 1 && word[word.length - 1 - q] == "`") { lastColor = false; } }
						//Reading backwards and making sure it's split on a space / comparing the size--^
						if (word[word.length - 1 - q] == " " && _.context.measureText(wordL).width >= size) {
						
							//adding in the new-line character.
							word = [word.slice(0, word.length - 1 - q), " ^", word.slice(word.length - 1 - q)].join(''); break;
						}
				
				}
				
				//add the new line.
				totalString += word;
			    exception = -1 * _.context.measureText(wordL).width; //tell the next line that a new word is starting.
				exception += _.context.measureText(lastException).width;
				word = ""; //reset the line
				
		}
		
	
	}
	
	//this is adding the last line that might not have been added in the previous code...
	if (word != "") {
	totalString += word; 
		if (_.context.measureText(word).width > width + exception) {
			var lastSpaceIndex = -1;
				for (var t = 0; t < 50; t++) { if (lastSpaceIndex == -1) {
					lastSpaceIndex = totalString.indexOf(" ", totalString.length - t); } }
					var newLine = " ^";
					var totalString = [totalString.slice(0, lastSpaceIndex), newLine, totalString.slice(lastSpaceIndex)].join('');
					word = ""; 
		}
	}
	
	
return totalString; //returning the string-coded word wrap!
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
		//color = tooltip
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

	this.context.font = this.font;;
	
	for (var i = 0; i < this.wordRectangle.length; i++) {
		this.wordRectangle[i].draw(); 
	}
		
	this.context.fillStyle = "white";
	
	for (var i = 0; i < this.wordList.length; i++) {
		this.context.fillStyle = this.wordColorList[i];
		this.context.fillText(this.wordList[i], this.wordPositionList[i].x, this.wordPositionList[i].y); 
	}

}

	