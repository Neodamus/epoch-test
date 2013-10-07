function userConsole() {
	
	this.consoleDisplay;
	this.consoleInput;
	
	this.initialize();
	
	this.display = 0;
}


userConsole.prototype.initialize = function() {

	// console display
	this.consoleDisplay = new textBox(_.canvas.width * 0.05, _.canvas.height * 0.7, _.canvas.width * 0.9, _.canvas.height * 0.25);
	this.consoleDisplay.setFontFamily("Georgia");
	this.consoleDisplay.setFontSize(this.consoleDisplay.height * 0.12);
	this.consoleDisplay.globalAlpha = 0.7;
	this.consoleDisplay.textBoxColor = "#277";
	this.consoleDisplay.maxRows = this.consoleDisplay.maxRows * 0.55;
	
	// console input
	this.consoleInput = new inputBox(_.canvas.width * 0.07, _.canvas.height * 0.88, _.canvas.width * 0.86, _.canvas.height * 0.05);
	this.consoleInput.setPadding(this.consoleInput.height * 0.05, this.consoleInput.width * 0.05,
		this.consoleInput.height * 0.25, this.consoleInput.width * 0.01);
	this.consoleInput.setFontSize(this.consoleInput.height * 0.6);
	
	this.consoleInput.escapeFunction = function() { this.text = ""; }
	
	this.consoleInput.enterFunction = function() { this.sendText(_.console.consoleDisplay); this.text = ""; }	
}


userConsole.prototype.toggle = function() {

	switch (this.display) {
	
		case 0: this.display = 1; this.consoleInput.active = true; break;	
		case 1: this.display = 0; this.consoleInput.text = ""; break;
		
	}
	
}


userConsole.prototype.consoleKeyDown = function(key) {
	
	this.consoleInput.keyDown(key);
}


userConsole.prototype.consoleClick = function() {
	
	this.consoleInput.containsClick();
	
}


userConsole.prototype.draw = function() {
	
	if (this.display) {
		this.consoleDisplay.draw();
		this.consoleInput.draw();
	}
}