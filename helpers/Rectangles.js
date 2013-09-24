function Rectangle(x, y, width, height) {
	
	this.canvas = document.getElementById('Mycanvas')
    this.context = this.canvas.getContext('2d')
	  		  
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.clicked = false;
	this.customValue = new Array();
	
	this.fontSize = _.fontSize;
	this.fontFamily = _.fontFamily;
	this.fontColor = "#FFF";
	this.font = this.fontSize + "px " + this.fontFamily;
	
	this.boxColor = "#000";
	
	this.hasImage = false
	this.image
	
	this.button;
	
	this.clickfxn;
	
	this.text;
	this.textX;
	this.textY;
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
  
Rectangle.prototype.setButton = function(id, buttonList) {  

	buttonList.push(this);
	this.button = id;
}
  
Rectangle.prototype.setText = function(text, color, posX, posY) {    

	this.text = text;
	this.fontColor = color;
	_.context.font = this.font;
	this.textX = this.x + (this.width - _.context.measureText(text).width) / 2;
	this.textY = Math.floor(this.y + (this.height + this.fontSize / 2) / 2);
	
}

Rectangle.prototype.setFontSize = function(fontSize) {	
	this.font = fontSize + "px " + this.fontFamily		
}
  
Rectangle.prototype.setImage = function(image) {

	this.hasImage = true;
	this.image = image;
}
	  
Rectangle.prototype.draw = function() {		  
	
	if (this.hasImage) {
		
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);	  
		
	} else {
	
		if (this.boxColor != null) { this.context.fillStyle = this.boxColor; }
		
		this.context.fillRect(this.x, this.y, this.width, this.height);		
		
	}
	
	if (this.text != null) {
	
		this.context.save();
		this.context.fillStyle = this.fontColor; 
		this.context.font = this.font;
		this.context.fillText(this.text, this.textX, this.textY);
		this.context.restore();
	
	}
		  
}