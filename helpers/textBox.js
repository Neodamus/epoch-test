function textBox(x, y, width, height) {
	
	this.x = Math.floor(x)
	this.y = Math.floor(y)
	this.width = Math.floor(width)
	this.height = Math.floor(height)
	
	this.context = document.getElementById('Mycanvas').getContext('2d')
	this.textBoxColor = "#777777"
	
	this.font =  14 + "px " + _.font;
	this.fontFamily = _.font;
	this.fontColor = "Black";
	
	this.columns = 1
	this.columnArray = [ 0 ]
	
	this.rows = 0
	this.rowHeight = 18
	this.rowBuffer = 6
	this.maxRows = Math.floor(this.height / (this.rowHeight + this.rowBuffer))
	
	this.leftPadding = 10
	this.topPadding = 5
	
	this.text = []
	this.textColumns = 0
	this.textRows = 0
	this.textReverse = false
	
	this.scrollbar = false
	this.scrollRow = 0
	
	this.scrollbarRect = new Rectangle(this.x + this.width - this.leftPadding - 10, this.y + this.topPadding, 10, this.height - this.topPadding * 2)
	this.scrollbarUp = new Rectangle(this.scrollbarRect.x, this.scrollbarRect.y, 10, 10)
	this.scrollbarUp.setImage(Images[102])
	this.scrollbarDown = new Rectangle(this.scrollbarRect.x, this.scrollbarRect.y + this.scrollbarRect.height - 10, 10, 10)
	this.scrollbarDown.setImage(Images[103])
	
	this.selectedRow = 0
	
	this.textWidth = this.width - this.leftPadding * 2 - this.scrollbarRect.width
	this.textHeight = this.height - this.topPadding * 2
}


textBox.prototype.setFontSize = function(fontSize) {
	
	this.font = fontSize + "px " + this.fontFamily	
	
}

textBox.prototype.setColumns = function(columnArray) {
	
		this.columns = columnArray.length
		this.columnArray = columnArray
	
}

textBox.prototype.draw = function() {
	
	this.context.fillStyle = this.textBoxColor
	this.context.fillRect(this.x, this.y, this.width, this.height)
	
	if (this.selectedRow != 0) {
		this.context.fillStyle = "#d6fcb4"
		
		selectionX = this.x + this.leftPadding
		selectionY = this.y + this.topPadding + (this.rowHeight + this.rowBuffer) * (this.selectedRow - 1)
		selectionWidth = this.textWidth
		selectionHeight = this.rowHeight + this.rowBuffer
		
		this.context.fillRect(selectionX, selectionY, selectionWidth, selectionHeight)
	}
	
	this.drawText()	
}

textBox.prototype.drawText = function() {
	
	this.context.fillStyle = this.fontColor
	this.context.font = this.font
	
	// determine if a scrollbar is needed	
	if (this.textRows > this.maxRows) {
		
		this.scrollbar = true
		
	} else {
			
		this.scrollbar = false
		this.scrollRow = 0		
		
	}
	
	var textOutput = []
	var textScroll
	
	if (this.textReverse == true) {
		
		for (row = 0; row < this.textRows; row++) {
			
			for (col = 0; col < this.textColumns && col < this.columns; col++) {
				
				textOutput[row * this.textColumns + col] = this.text[(this.textRows - row - 1) * this.textColumns + col]
				
			}
			
		}
		
	} else {
		
		textOutput = this.text	
		
	}
	
	// printing loop!!!
	if (this.scrollbar) {
				
		for (row = this.scrollRow; row < this.maxRows + this.scrollRow; row++) {
		
			for (col = 0; col < this.columns && col < this.textColumns; col++) {
				
				var text = textOutput[row * this.textColumns + col]
				var x = this.x + this.leftPadding + this.textWidth * this.columnArray[col]
				var y = this.y + this.topPadding + (this.rowHeight + this.rowBuffer) * (row - this.scrollRow + 1) - this.rowBuffer
			
				this.context.fillText(text, x, y)
					
			}
			
		}	
	
	this.scrollbarRect.draw()
	this.scrollbarUp.draw()
	this.scrollbarDown.draw()
		
	} else {
	
		for (row = 0; row < this.textRows; row++) {
		
			for (col = 0; col < this.columns && col < this.textColumns; col++) {
				
				var text = textOutput[row * this.textColumns + col]
				var x = this.x + this.leftPadding + this.textWidth * this.columnArray[col]
				var y = this.y + this.topPadding + (this.rowHeight + this.rowBuffer) * (row + 1) - this.rowBuffer
			
				this.context.fillText(text, x, y)
					
			}
			
		}
		
	}
	
}

textBox.prototype.contains = function(mouse) {
	
	var x = Math.floor(mouse.x)
	var y = Math.floor(mouse.y)
	
	if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
		return true	
	} else {
		return false	
	}
}

textBox.prototype.inputText = function(textArray) {
	
	this.text = textArray
	
}

textBox.prototype.inputObjects = function(objectArray, objProps) {
	
	this.text = new Array()
	
	this.columns = objProps	
	this.textColumns = objProps
	
	for (i = 0; i < objectArray.length; i++) {		
			
		var count = 0
		
		for (var p in objectArray[i]) {
			
			if (objectArray[i].hasOwnProperty(p) && count < objProps) {
				this.text[i * objProps + count] = objectArray[i][p]
				count++
			}
		}
	}
}

textBox.prototype.inputObject = function(objectArray) {
	
	this.text = new Array()
	
	var properties = new Array()
	
	if (objectArray.length >= 0) {
		
		for (var p in objectArray[0]) {
  
			if (objectArray[0].hasOwnProperty(p)) {
			
				properties.push(p)
				
			}
	
		}
	
	}
	
	for (i = 0; i < objectArray.length; i++) {	
	
		var property	
		
		for (propIndex = 0; propIndex < properties.length; propIndex++) {
			
			if (objectArray[i] != null) {
				
				property = properties[propIndex]		
				
				propertyValue = objectArray[i][property]
				
				this.text.push(propertyValue)	
				
			} else {
			
				propIndex = properties.length
				i = objectArray.length
				
			}
			
		}
		
	}
	
	this.textColumns = properties.length	
	this.textRows = this.text.length / this.textColumns
		
}

textBox.prototype.scrollToLastRow = function() {
	
	this.scrollRow = this.textRows - this.maxRows
	
}

textBox.prototype.selectRow = function(x, y) {
	
	if (x >= this.leftPadding && x <= this.leftPadding + this.textWidth) {
		
		if (y >= this.topPadding && y <= (this.rowHeight + this.rowBuffer) * this.text.length / this.columns) {
		
			this.selectedRow =  Math.ceil((y - this.topPadding) / (this.rowHeight + this.rowBuffer))
			
			if (this.selectedRow > this.maxRows) {  // if clicked at the bottom edge of window
			
				this.selectedRow = 0
				
			}
		
		} else {
		
			this.selectedRow = 0	
		
		}
		
	} else {
		
		this.selectedRow = 0	
		
	}
	
}

textBox.prototype.getSelectionData = function() {
	
	var data = new Array()
	
	if (this.selectedRow != 0) {
			
		for (i = 0; i < this.columns; i++) {
			data[i] = this.text[(this.selectedRow - 1) * this.columns + i]
		}
			
	}
	
	sendPacket2("joinGame", data)
		
}