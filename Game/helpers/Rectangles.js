function Rectangle(x, y, width, height, image) {
	  		  
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.image;
	this.hasImage = false;
	
	if (image != undefined) { this.image = image; }
	
	this.object;
	
	this.clicked = false;
	this.customValue = new Array();
	
	this.fontSize = _.fontSize;
	this.fontFamily = _.fontFamily;
	this.fontColor = "#FFF";
	this.font = _.font;
	this.outlineFont = false;
	
	this.drawBehind = false;
	this.imageRect;
	
	this.boxColor = "#000";
	
	
	this.button;
	
	this.clickfxn;
	
	this.text;
	this.textX;
	this.textY;
	
	this.tooltipOf;
}
	   
//Contains method checks for Points or Rectangles
Rectangle.prototype.Contains = function(Object) {
	if (Object.X != null && Object.Height != null)
		{
			if (Object.X >= this.x && Object.Width <= this.width + this.x
			    && Object.Y >= this.y && Object.Height <= this.height + this.y)
				{
					return true;
				}
		}
		if (Object.x != null && Object.y != null)
		{
			if (Object.x >= this.x && Object.x <= this.width + this.x
				&& Object.y >= this.y && Object.y <= this.height + this.y)
				{
					return true;
				}
		}
		return false;
}
  
 Rectangle.prototype.setTooltip = function(text, width, position) {
	
	var wordwrapText = new advancedString(wordWrap(text, width - 30), 0, 0);
	
	//if (position == "top") {  this.tooltipBox = new Rectangle(this.x - 33, this.y - this.height - 180 + 35, width + 100, 180); }
	//if (position == "right") { this.tooltipBox = new Rectangle(this.x + this.width + 25, this.y - this.height, width + 100, 180); }
	if (position == "left") { this.tooltipBox = new Rectangle(this.x - width - 15, this.y - 220 * 0.2, width, 220); }
	//if (position == "bottom") { this.tooltipBox = new Rectangle(this.x - 33, this.y + this.height + 19, width + 100, 180); }
	if (position.x != undefined) {
	this.tooltipBox = position; }
	
	this.tooltipBox.height = wordwrapText.totalHeight + 40;
	
	this.tooltipBox.tooltipString = new advancedString(wordWrap(text, width - 30), this.tooltipBox.x + 15, this.tooltipBox.y + 25);
	this.tooltipBox.tooltip = false;
	this.tooltipBox.boxColor = "rgba(20, 20, 20, 0.90)";
	this.tooltipBox.tooltipOf = this;
	//this.tooltipBox.setText(text, "black");
	return this.tooltipBox;
	
 
 }

  
Rectangle.prototype.setButton = function(id, buttonList) {  

	buttonList.push(this);
	this.button = id;
}
  
Rectangle.prototype.setText = function(text, color, posX, posY) {    
	
	_.context.font = this.font;		// needed to measureText correctly
	
	this.text = text;
	this.fontColor = color;
	this.textX = this.x + (this.width - _.context.measureText(text).width) * 0.5;
	this.textY = Math.floor(this.y + (this.height + this.fontSize * 0.6) * 0.5);
	
}

Rectangle.prototype.setFontSize = function(fontSize) {	
	this.font = fontSize + "px " + this.fontFamily		
}
  
Rectangle.prototype.setImage = function(image) {

	this.hasImage = true;
	this.image = image;
	this.bgImage;
	this.midImage;
}
	  
Rectangle.prototype.draw = function() {		  
	
	if (this.tooltip == undefined || this.tooltip == true) {
	
	
	if (this.hasImage) {
		//DRAW a rect behind
		if (this.drawBehind == true) {
			if (this.boxColor != null) { _.context.fillStyle = this.boxColor; }
			_.context.fillRect(this.x, this.y, this.width, this.height);	
		}
		//making image a different size than the box(as an option)
		var rect = { x: this.x, y: this.y, width: this.width, height: this.height };
		if (this.imageRect != null) { rect = { x: this.imageRect.x, y: this.imageRect.y, width: this.imageRect.width, height: this.imageRect.height }; }
		
		if (this.bgImage != undefined && this.bgImage != null) { _.context.drawImage(this.bgImage, rect.x, rect.y, rect.width, rect.height); }
		if (this.midImage != undefined && this.midImage != null) { _.context.drawImage(this.midImage, rect.x, rect.y, rect.width, rect.height); }
		
		_.context.drawImage(this.image, rect.x, rect.y, rect.width, rect.height);	  
		
	} else {
	
		if (this.boxColor != null) { _.context.fillStyle = this.boxColor; }
		
		_.context.fillRect(this.x, this.y, this.width, this.height);		
		
	}
	
	if (this.text != null) {
			
		_.context.font = this.font;		
		_.context.fillStyle = this.fontColor;
		
		if (this.outlineFont == true) { 
			
			_.context.strokeStyle = 'black';
			_.context.lineWidth=3.2;
			_.context.strokeText(this.text, this.textX, this.textY);
		}
		_.context.fillText(this.text, this.textX, this.textY);
		
	}
		
		
	if (this.tooltipString != undefined) { this.tooltipString.draw(); }
  }
}