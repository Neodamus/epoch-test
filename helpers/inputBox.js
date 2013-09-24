function inputBox(x, y, width, height) {
	
	this.x = Math.floor(x)
	this.y = Math.floor(y)
	this.width = Math.floor(width)
	this.height = Math.floor(height)

	this.canvas = document.getElementById('Mycanvas')
    this.context = this.canvas.getContext('2d')	
	
	this.inputBoxColor = "White"
	this.transparent = false
	
	this.paddingTop = 5
	this.paddingRight = 10
	this.paddingBottom = 5
	this.paddingLeft = 10
	
	this.fontSize = 16
	this.fontFamily = "Georgia"
	this.fontColor = "#000"
	this.font = this.fontSize + "px " + this.fontFamily
	
	this.text = ""
	
	this.active = false
	this.activeCount = 0
	
}

inputBox.prototype.setPadding = function(top, right, bottom, left) {
	
	this.paddingTop = top
	this.paddingRight = right
	this.paddingBottom = bottom
	this.paddingLeft = left
	
}

inputBox.prototype.setFontSize = function(fontSize) {	
	this.font = fontSize + "px " + this.fontFamily		
}

inputBox.prototype.draw = function() {
	
	context = this.context
	
	context.fillStyle = this.inputBoxColor
	
	if (!this.transparent) {
		
		context.fillRect(this.x, this.y, this.width, this.height)
		
	}
	
	this.drawText()	
	
}

inputBox.prototype.drawText = function() {
	
	context = this.context
	
	context.font = this.font
	context.fillStyle = this.fontColor
	
	
	if (this.active) {
		
		if (this.activeCount < 30) {	
		
			context.fillText(this.text + "|", this.x + this.paddingLeft, this.y + this.height - this.paddingBottom)
		
		} else {
			
			context.fillText(this.text, this.x + this.paddingLeft, this.y + this.height - this.paddingBottom)
			
		}
		
		this.activeCount++
	
		if (this.activeCount == 60) { this.activeCount = 0 }
		
	} else {
				
		context.fillText(this.text, this.x + this.paddingLeft, this.y + this.height - this.paddingBottom)		
		
	}
	
}

inputBox.prototype.containsClick = function() {
	
	var x = Math.floor(Mouse.x)
	var y = Math.floor(Mouse.y)
	
	if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
		return true	
	} else {
		return false	
	}
	
}