function advancedString(string, x, y) {

	this.canvas = _.canvas;
    this.context = _.context;
	_.context.font = "14px Georgia";
	
	this.string = string;
	
	this.spaceWidth = this.context.measureText(" ").width; //used for spacing between words
	this.spaceHeight = 16 * 2.5; //used for height spacing
	
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
			currentLength += this.spaceWidth + 5;
			
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
_.context.font = "14px Georgia";
var totalString = "";
var word = "";
var exception = 0;

var clr = false;
	//color and tooltip extras are counted when they shouldnt be... need to find a solution.
	for (var i = 0; i < string.length; i ++) {
		
				//found Color indicator
				
		if (string[i] == "`" && clr == false) {
			//var color = string.indexOf("`", i - 10); //console.warn(color);
			var cWord = "";
				for (var t = 0; t < string.length - i; t++) {
					
					cWord += string[i + t]; //console.warn(string[t]);
					if (string[i + t] == "`" && t != 0) { break; }
				}
				exception = _.context.measureText(cWord).width + (_.context.measureText("`").width * 2);// console.warn(cWord);
				clr = true;
			} else { if (string[i] == "`") { clr = false; } }
		//found tooltip indicator
		if (string[i] == "&") { 

			} 
			
		
		word += string[i];
	/*	if (totalString + word - exception > width) { 
		
				totalString += " ^ "; 
				totalString += word;
				exception = 0;
				word = "";
		}*/
		if (exception > 0 ) {console.warn(exception); }
		if (_.context.measureText(word).width > width + exception) {
			
			
			
			//if (_.context.measureText(word).width > width - 100) {
				
				//search for previous spaces to use...
				totalString += word;
			    exception = 0;
				var lastSpaceIndex = -1;
				for (var t = 0; t < 50; t++) { if (lastSpaceIndex == -1) {
				
				lastSpaceIndex = totalString.indexOf(" ", (totalString.length - 2) - t); } }
				var newLine = " ^";
				var totalString = [totalString.slice(0, lastSpaceIndex), newLine, totalString.slice(lastSpaceIndex)].join('');
				word = ""; 
				
		//	} //else { totalString += " ^ "}
			
			//extreme case
		/*	if (_.context.measureText(word).width - exception  > width + 50) {
				
				//search for previous spaces to use...
				var lastSpaceIndex = totalString.indexOf(" ", totalString.length - 15);
				var newLine = " ^";
				var totalString = [totalString.slice(0, lastSpaceIndex), newLine, totalString.slice(lastSpaceIndex)].join('');
				word = ""; 
			}
			
			exception = 0;*/
			
			
		//	word = ""; 
		}
		
	
	}
	if (word != "") {

	totalString += word; 
		if (_.context.measureText(word).width > width) {
			console.warn(totalString);
			//search for previous spaces to use...
			var lastSpaceIndex = -1;
				for (var t = 0; t < 50; t++) { if (lastSpaceIndex == -1) {
					lastSpaceIndex = totalString.indexOf(" ", totalString.length - t); } }
					var newLine = " ^";
					var totalString = [totalString.slice(0, lastSpaceIndex), newLine, totalString.slice(lastSpaceIndex)].join('');
					word = ""; 
		}
	}
	
	
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

	this.context.font = "14px Georgia";
	
	for (var i = 0; i < this.wordRectangle.length; i++) {
	this.wordRectangle[i].draw(); }
    this.context.fillStyle = "white";
	
	for (var i = 0; i < this.wordList.length; i++) {
	//this.context.fillStyle = "white";
	//for (var t = 0; t < this.wordColorList.length; t++) { if (i == this.wordColorList[t].word) { this.context.fillStyle = this.wordColorList[t].color; } } //color
	this.context.fillStyle = this.wordColorList[i];
	this.context.fillText(this.wordList[i], this.wordPositionList[i].x, this.wordPositionList[i].y); }

}

	