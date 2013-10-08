function advancedString(string, x, y) {
	//if you want the text to be wordwrapped the string needs to be pre-wordwrapped before you use this.
	
	this.font = "15px Georgia"; //line 4, 6+7, 106 deal with font-- (The font size should be the same as the wordwrapped font, also it should be passed to this function)
	_.context.font = this.font;
	this.canvas = _.canvas;
    this.context = _.context;
	
	this.string = string;
	
	// We get the current font size from the string _.context.font and parse it to an int
			var fontsize = _.context.font;
			var temp = fontsize.indexOf("p"); //.font = "15px Georgia", we find the p.
			fontsize = "";
			for (var i = 0; i < temp; i++) { fontsize += _.context.font[i]; }
			this.fontSize = parseInt(fontsize, 10);
	// ////////////////////////////////////////////////////////////////////////////////////////
	
	this.spaceWidth = this.context.measureText(" ").width; //used for spacing between words
	this.spaceHeight = this.fontSize * 1.3; //used for height spacing
	
	
	//This will be the total height that the string + wordwrapping will take up
	this.totalHeight = 0;
	
	//Reading inside strings to find codes
	this.wordRectangle = new Array(); //used for words with colors to have a tooltip event. (NOT fully used yet) &text&
	
	var currentWord = "";
	this.wordList = new Array();
	this.wordPositionList = new Array();
	
	this.wordColorList = new Array();
	this.wordTooltipList = new Array();
	
	var startx = x;
	var starty = y;
	
	var currentLength = startx;
	var currentHeight = starty;
	var currentColor = "white"; //Sets the basic color of the string(this gets overwritten by any `color` code)
	
	this.wordPositionList[0] = {x: currentLength, y: currentHeight};
	
	for (var i = 0; i < string.length; i++) { 
	
		//Add string letter to current word
		if (string[i] != " " && string[i] != "`" && string[i] != "^" && string[i] != "&" && string[i] != "|") { 
			currentWord += string[i];
		 }
		
		//new line found
		if (string[i] == "^") {
			//this.spaceHeight;
			this.totalHeight += this.spaceHeight;
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
		if (string[i] == " " || i == string.length - 1 || string[i] == null || string[i] == "|") { 
			if (this.wordPositionList.length == 1 && string[i] != "|") { currentLength += this.spaceWidth; }
			if (string[i] == "|") { currentLength -= this.spaceWidth; }
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



//Wordwrap is used to change a string so that you can create a wordwrapped- advanced string.
function wordWrap(string, width) { 

	_.context.font = "15px Georgia"; //the font size should probably be passed to this function!

	var totalString = "";
	var word = "";
	var exception = 0;

	var clr = false;

	//if a color is found-- it measures the color and makes an exception for the word wrapping because it won't be visible.
	for (var i = 0; i < string.length; i ++) {
		
		//add a new line to the string
		if (string[i] == "^") {
		word += string[i];
				//add the new line.
				totalString += word;
			    exception = 0
				word = ""; //reset the line
		}
		else {
			//If color is found, ignore it for positioning(because it will not be visible)
			if (string[i] == "`" && clr == false) {
				var cWord = "";
			
					for (var t = 0; t < string.length - i; t++) {
					
						cWord += string[i + t]; 
						if (string[i + t] == "`" && t != 0) { break; }
					}
				
			exception += _.context.measureText(cWord).width;
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
	}
	
	//this is adding the last line that might not have been added in the previous code...
	if (word != "") {
	totalString += word; 
		if (_.context.measureText(word).width > width + exception) {
			var lastSpaceIndex = -1;
				for (var t = 0; t < 50; t++) { if (lastSpaceIndex == -1) {
					lastSpaceIndex = totalString.indexOf(" ", totalString.length - t); } }
					this.totalHeight += this.spaceHeight;
					var newLine = " ^";
					var totalString = [totalString.slice(0, lastSpaceIndex), newLine, totalString.slice(lastSpaceIndex)].join('');
					word = ""; 
		}
	}
	
	
return totalString; //returning the string-coded word wrap!
}

//This is used in wordwrapping and advanced string
function findColor(string, i) {

		if (string[i] == "`") {
		var clr = "";
		for (var t = 0; t < string.length; t++) { clr += string[i + t]; if ( t != 0 && string[i + t] == "`") { var point = i + t; break;} }
		clr = clr.substring(1, clr.length - 1)
		//var colorAndNumber = { word: this.wordList.length, color: clr };
		
		var half1 = string.substring(0, i);
		var half2 = string.substring(point, string.length);

		string = half1 + half2;}
		var returnList = {string: string, color: clr};
		return returnList;
}

//This is used in wordwrapping and advanced string
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

//Draw advanced string
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

	