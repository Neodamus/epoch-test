function Rectangle(x, y, width, height) {
	
	this.canvas = document.getElementById('Mycanvas')
    this.context = this.canvas.getContext('2d')
	  		  
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.clicked = false;
	this.customValue = new Array();
	
	this.boxColor;
	
	this.hasImage = false
	this.image
	
	this.button;
	
	this.text;
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

	this.text = new Array(text, color, posX, posY);
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
		
		this.context.fillRect(this.x, this.y, this.width, this.height)	;		
		
	}
	
	if (this.text != null) {
	
		this.context.save();
		this.context.fillStyle = this.text[1];
		this.context.fillText(this.text[0], this.text[2], this.text[3]);
		this.context.restore();
	
	}
		  
}