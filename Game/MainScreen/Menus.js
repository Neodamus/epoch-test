function CreateMenus(Width, Height) {

	this.id = "menus";
	this.test = "hi: "
	//object lists
	this.clickableObjects = new Array();
	this.highlightObjects = new Array();
	
	this.menus = true;
	
	var e; //Short variable
	
	e = this.namePlate = new Rectangle(0, 0, _.canvas.width * 0.28, _.canvas.height * 0.06); e.setText(_.userName, "white"); e.setImage(Images[150]);
	
	e = this.nameLevel = new Rectangle(this.namePlate.x + this.namePlate.width, 0, _.canvas.width * 0.05, _.canvas.height * 0.05); e.boxColor = "blue"; e.setText("0", "white");
	
	e = this.nameLogout = new Rectangle(this.nameLevel.x + this.nameLevel.width, 0, _.canvas.width * 0.12, _.canvas.height * 0.05); e.boxColor = "green"; e.setText("Logout?", "white");
	this.clickableObjects.push(e);
	
	e = this.menuGear = new Rectangle(0, 0, _.canvas.width * 0.05, _.canvas.height * 0.05); e.boxColor = "rgba(5, 5, 5, 1)";
	this.clickableObjects.push(e); e.setImage(Images[147]); e.bgImage = Images[148]; e.midImage = Images[149];
	
	/*  Images[140].src = "Game/Images/Menus/107.77.button.bg.png";
	   Images[141].src = "Game/Images/Menus/107.77.button.border.png";
	   Images[142].src = "Game/Images/Menus/706.163.left.png";
	   Images[147].src = "Game/Images/Menus/gearborder.png";
	   Images[148].src = "Game/Images/Menus/gear.bg.png";
	   
	   */
	
	
	
	e = this.bottomBar = new Rectangle(0, _.canvas.height * 0.965, _.canvas.width, _.canvas.height * 0.05); e.boxColor = "rgba(50, 50, 0, 1)"; e.setText("BottomBar", "white"); e.setImage(Images[146]);
	
	e = this.currency = new Rectangle(0, _.canvas.height * 0.95, _.canvas.width * 0.168, _.canvas.height * 0.05); e.boxColor = "rgba(50, 50, 200, 1)"; e.setText("Currency", "white");
	
	//Menu options
	e = this.menuBox = new Rectangle(0, 0, this.namePlate.width * 0.5, _.canvas.height - this.namePlate.height * 0.5); e.setImage(Images[142]);
	
	var bHeight = this.menuBox.height * 0.13; 
	var bSpaceFromTop = this.menuBox.height * 0.071;
	
	var menuWidth = this.menuBox.width * 0.89;
	var menuHeight = this.menuBox.height * 0.12;
	var menuX = this.menuBox.width * 0.10;
	var menuY = this.menuBox.y + bSpaceFromTop;
	
	e = this.quickmatch = new Rectangle(menuX, (menuY) + bHeight * 0, menuWidth, menuHeight); e.boxColor = "gray"; e.setText("quickmatch", "white");
	this.clickableObjects.push(e); e.setImage(Images[141]); e.bgImage = Images[140];
	
	e = this.chat = new Rectangle(menuX, (menuY) + bHeight * 1, menuWidth, menuHeight); e.boxColor = "rgba(250, 0, 0, 0.5)"; e.setText("chat", "white"); 
	this.clickableObjects.push(e); e.setImage(Images[141]); e.bgImage = Images[140];
	
	e = this.browse = new Rectangle(menuX, (menuY) + bHeight * 2, menuWidth, menuHeight); e.boxColor = "gray"; e.setText("browse", "white"); 
	this.clickableObjects.push(e); e.setImage(Images[141]); e.bgImage = Images[140];
	
	e = this.sandbox = new Rectangle(menuX, (menuY) + bHeight * 3, menuWidth, menuHeight); e.boxColor = "gray"; e.setText("sandbox", "white");
	this.clickableObjects.push(e); e.setImage(Images[141]); e.bgImage = Images[140];
	
	e = this.tutorial = new Rectangle(menuX, (menuY) + bHeight * 4, menuWidth, menuHeight); e.boxColor = "gray"; e.setText("tutorial", "white");
	this.clickableObjects.push(e); e.setImage(Images[141]); e.bgImage = Images[140];
	
	e = this.ladder = new Rectangle(menuX, (menuY) + bHeight * 5, menuWidth, menuHeight); e.boxColor = "gray"; e.setText("ladder", "white");
	this.clickableObjects.push(e); e.setImage(Images[141]); e.bgImage = Images[140];
	
	e = this.tournament = new Rectangle(menuX, (menuY) + bHeight * 6, menuWidth, menuHeight); e.boxColor = "gray"; e.setText("tournament", "white");
	this.clickableObjects.push(e); e.setImage(Images[141]); e.bgImage = Images[140];
	

	e = this.chatBox = new Rectangle(this.menuBox.width, this.namePlate.height * 1.6, _.canvas.width - this.menuBox.width * 2.25, _.canvas.height - this.namePlate.height); 
	e.setImage(Images[143]);
	
	e = this.chatBar = new Rectangle(this.menuBox.width * 0.98, this.chatBox.y + this.chatBox.height * 0.876, this.chatBox.width * 0.995, this.chatBox.height * 0.05); 
	e.setImage(Images[145]);
	
	e = this.motdBar = new Rectangle(this.menuBox.width * 1.03, this.chatBox.y * 1.05, this.chatBox.width * 0.986, this.chatBox.height * 0.05); 
	e.setImage(Images[146]);
	
	//chatbar  Images[145]
	
	e = this.playerList = new Rectangle(this.chatBox.x + this.chatBox.width, this.chatBox.y, _.canvas.width - this.menuBox.width - this.chatBox.width, _.canvas.height - this.namePlate.height);
	e.boxColor = "rgba(0, 0, 250, 0.2)"; e.setText("Players", "white"); e.setImage(Images[144]);
}
	  
		
CreateMenus.prototype.ClickisWithin = function(){

	for (var i = 0; i < this.clickableObjects.length; i++) {
	
		if (this.clickableObjects[i].Contains(_.mouse) == true) { 
		
			switch(this.clickableObjects[i]) {
			
				case this.menuGear: this.menus = (this.menus == true) ? false : true; break;
				
				case this.quickmatch: if (this.menus == true) {
					sendPacket("quickGame"); break; }
				
				case this.sandbox: if (this.menus == true) { 
					GameBoard = new Board("sandbox"); _.currentMode.id = ""; break; }
				
				case this.browse: if (this.menus == true) {
					_.currentMode = new lobby(); Screen = "lobby"; break; }
				
				case this.nameLogout: if (this.menus == true) {
					localStorage.clear();
					_.currentMode = new login();
					_.currentMode.loginInput.text = "Guest";
					_.connectionStatus = 1;
					break; }
				
				
			}
			if (this.clickableObjects[i] != this.menuGear) {
				this.menus = false; }
		}
	}
}
	  
CreateMenus.prototype.keyDown = function(key){
	
	// alert(key.keyCode)
	
	//var chatBar = _.currentMode.chatBar
	var specials = [ 192, 173, 61, 219, 220, 221, 59, 222, 188, 190, 191 ]
	
		
	
		if (key.keyCode == 8) { // backspace
			
			key.preventDefault()
			this.test = this.test.substring(0, this.test.length - 1)
			
		} else if (key.keyCode >= 96 && key.keyCode <= 105) { // numpad
			
			this.test += String.fromCharCode(key.keyCode - 48)	
			
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
			
			this.test += String.fromCharCode(inputCode)
			
		} else if (specials.indexOf(key.keyCode) != -1) {
			
			var inputCode
			
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
			
			this.test += String.fromCharCode(inputCode)
			
		} else if (shiftKey || key.keyCode == 32) {  // letters
			
			this.test += String.fromCharCode(key.keyCode)
			
		} else if (!shiftKey) {
	
			this.test += String.fromCharCode(key.keyCode).toLowerCase()
			
		}
	
		
	
	if (key.keyCode == 27) {
			
	//		key.preventDefault()
	//		_.currentMode = new CreateMenus(document.getElementById('Mycanvas').width, document.getElementById('Mycanvas').height)
			
	}	
	
	if (key.keyCode == 13) {
		
		//sendPacket2("addChat", { id: _.userName, text: chatBar.text } )
	//	chatBar.text = ""			
		
	}
	
}
	  
	  
	  
	  
CreateMenus.prototype.mousePosition = function(){

}
	  
CreateMenus.prototype.Draw = function() {
	
	
	
	
	
	this.menuGear.draw();
	
	if (this.menus == true) {
	
		
		this.menuBox.draw();
		this.chatBox.draw();
		this.chatBar.draw();
		this.playerList.draw();
		this.chat.draw();
		this.motdBar.draw();
		this.quickmatch.draw();
		this.browse.draw();
		this.sandbox.draw();
		this.tutorial.draw();
		this.ladder.draw();
		this.tournament.draw();
		this.nameLogout.draw();
		_.context.fillText(this.test, this.chatBar.x * 1.08, this.chatBar.y * 1.032);
	}
	this.namePlate.draw();
	this.nameLevel.draw();
	this.menuGear.draw();
	this.bottomBar.draw();
	//this.currency.draw();
}
