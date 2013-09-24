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
	this.context.font = globalFont;
	this.text = text;
	this.fontColor = color;
	
	this.textSize = this.context.measureText(text).width;
	this.textSizeY = Math.floor(this.y + globalFontSize *0.88 + (this.height - globalFontSize) / 2)
	
	this.textX = this.x + (this.width - this.textSize) / 2;//(this.width - this.context.measureText(text).width);
	this.textY = Math.floor(this.y + globalFontSize *0.88 + (this.height - globalFontSize) / 2); // globalFontSize *0.88 has to do with where font is positioned based on 0, 0
	//Math.floor(this.y + (this.height + this.fontSize / 2) / 2);
	
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
		
		_.context.drawImage(this.image, this.x, this.y, this.width, this.height);	  
		
	} else {
	
		if (this.boxColor != null) { _.context.fillStyle = this.boxColor; }
		
		_.context.fillRect(this.x, this.y, this.width, this.height);		
		
	}
	
	if (this.text != null) {
		this.context.font = globalFont;
		this.context.save();
		this.context.fillStyle = this.fontColor; 
		//_.context.font = this.font;
		//HELPER//////////////////////////////////////////////////////////////////////
		this.context.lineWidth = 0.5;
		
		this.context.beginPath();
		this.context.moveTo(this.x + this.width / 2, this.y);
		this.context.lineTo(this.x + this.width / 2, this.y + this.height);
		this.context.strokeStyle = "blue";
		this.context.stroke();
		
		
		this.context.beginPath();
		this.context.moveTo(this.x, this.y + this.height / 2);
		this.context.lineTo(this.x + this.width, this.y + this.height / 2);
		this.context.strokeStyle = "blue";
		this.context.stroke();
		
		this.context.beginPath();
		this.context.moveTo(this.textX, this.y + this.height / 2);
		this.context.lineTo(this.textSize + this.textX, this.y + this.height / 2);
		this.context.strokeStyle = "white";
		this.context.stroke();
		
		this.context.beginPath();
		this.context.moveTo(this.x + this.width / 2,  this.textY - globalFontSize * 0.88);
		this.context.lineTo(this.x + this.width / 2, this.textY + globalFontSize * 0.12);
		this.context.strokeStyle = "white";
		this.context.stroke();
		//////////////////////////////////////////////////////////////////////////
		//DrawText
		this.context.fillText(this.text, this.textX, this.textY);

		this.context.restore();
	
	}
		  
}