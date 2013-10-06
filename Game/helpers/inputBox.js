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
	
	this.enterFunction = function() { alert ("Enter function not set"); }
	this.escapeFunction = function() { alert ("Escape function not set"); }
	
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
	
	context = _.context;	
	context.fillStyle = this.inputBoxColor;
	
	if (!this.transparent) {		
		context.fillRect(this.x, this.y, this.width, this.height)		
	}
	
	this.drawText();
	
}

inputBox.prototype.drawText = function() {
	
	context = _.context;
	
	context.font = this.font;
	context.fillStyle = this.fontColor;
	
	
	if (this.active) {
		
		if (this.activeCount < 30) {		
			context.fillText(this.text + "|", this.x + this.paddingLeft, this.y + this.height - this.paddingBottom);					
		} else {			
			context.fillText(this.text, this.x + this.paddingLeft, this.y + this.height - this.paddingBottom);
		}
		
		this.activeCount++;	
		if (this.activeCount == 60) { this.activeCount = 0; }
		
	} else {
				
		context.fillText(this.text, this.x + this.paddingLeft, this.y + this.height - this.paddingBottom)		
		
	}
	
}


inputBox.prototype.keyDown = function(key) {
	
	var specials = [ 192, 173, 61, 219, 220, 221, 59, 222, 188, 190, 191 ];
	
	if (this.active) {	
	
		if (key.keyCode == 8) { // backspace
			
			key.preventDefault();
			this.text = this.text.substring(0, this.text.length - 1);
			
		} else if (key.keyCode >= 96 && key.keyCode <= 105) { // numpad
			
			this.text = this.text + String.fromCharCode(key.keyCode - 48);	
			
		} else if (shiftKey && key.keyCode >= 48 && key.keyCode <= 57) {  // shift+number characters
		
			var inputCode
		
			switch (key.keyCode) {
				
				case 48: inputCode = 41; break;
				case 49: inputCode = 33; break;
				case 50: inputCode = 64; break;
				case 51: inputCode = 35; break;
				case 52: inputCode = 36; break;
				case 53: inputCode = 37; break;
				case 54: inputCode = 94; break;
				case 55: inputCode = 38; break;
				case 56: inputCode = 42; break;
				case 57: inputCode = 40; break;
			
			}
			
			this.text = this.text + String.fromCharCode(inputCode);
			
		} else if (specials.indexOf(key.keyCode) != -1) {
			
			var inputCode;
			
			if (shiftKey) {
				
				switch (key.keyCode) {

					case 192: inputCode = 126; break;
					case 173: inputCode = 95; break;
					case 61: inputCode = 43; break;
					case 219: inputCode = 123; break;
					case 220: inputCode = 124; break;
					case 221: inputCode = 125; break;
					case 59: inputCode = 58; break;
					case 222: inputCode = 34; break;
					case 188: inputCode = 60; break;
					case 190: inputCode = 62; break;
					case 191: inputCode = 63; break;
					
				}
			
			} else {
				
				switch (key.keyCode) {

					case 192: inputCode = 96; break;
					case 173: inputCode = 45; break;
					case 61: inputCode = 61; break;
					case 219: inputCode = 91; break;
					case 220: inputCode = 92; break;
					case 221: inputCode = 93; break;
					case 59: inputCode = 59; break;
					case 222: inputCode = 39; break;
					case 188: inputCode = 44; break;
					case 190: inputCode = 46; break;
					case 191: inputCode = 47; break;
					
				}			
			
			}
			
			this.text = this.text + String.fromCharCode(inputCode);
			
		} else if (shiftKey || key.keyCode == 32) {
			
			this.text = this.text + String.fromCharCode(key.keyCode);
			
		} else if (!shiftKey) {
	
			this.text = this.text + String.fromCharCode(key.keyCode).toLowerCase();
			
		}
	
	}	
	
	if (key.keyCode == 27) {		// escape
			
		key.preventDefault();
		this.escapeFunction();
			
	}	
	
	if (key.keyCode == 13) {		// enter
		
		key.preventDefault();
		this.enterFunction();			
		
	}
	
}



inputBox.prototype.sendText = function(target) {

	target.receiveText(this.text);
	
}

inputBox.prototype.containsClick = function() {
	
	var x = Math.floor(_.mouse.x)
	var y = Math.floor(_.mouse.y)
	
	if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
		this.active = true;
		return true;
	} else {
		this.active = false;
		return false;	
	}
	
}