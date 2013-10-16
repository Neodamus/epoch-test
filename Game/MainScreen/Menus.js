function CreateMenus(Width, Height) {

	this.id = "menus";
	
	//object lists
	this.clickableObjects = new Array();
	this.highlightObjects = new Array();
	
	this.menus = true;
	
	var e; //Short variable
	
	e = this.namePlate = new Rectangle(0, 0, _.canvas.width * 0.21, _.canvas.height * 0.05); e.boxColor = "gray"; e.setText(_.userName, "white");
	
	e = this.nameLevel = new Rectangle(this.namePlate.x + this.namePlate.width, 0, _.canvas.width * 0.05, _.canvas.height * 0.05); e.boxColor = "blue"; e.setText("0", "white");
	
	e = this.nameLogout = new Rectangle(this.nameLevel.x + this.nameLevel.width, 0, _.canvas.width * 0.12, _.canvas.height * 0.05); e.boxColor = "green"; e.setText("Logout?", "white");
	this.clickableObjects.push(e);
	
	e = this.menuGear = new Rectangle(0, 0, _.canvas.width * 0.05, _.canvas.height * 0.05); e.boxColor = "rgba(5, 5, 5, 1)"; e.setText("O", "white");
	this.clickableObjects.push(e);
	
	
	
	
	
	e = this.bottomBar = new Rectangle(0, _.canvas.height * 0.95, _.canvas.width, _.canvas.height * 0.05); e.boxColor = "rgba(50, 50, 0, 1)"; e.setText("BottomBar", "white");
	
	e = this.currency = new Rectangle(0, _.canvas.height * 0.95, _.canvas.width * 0.168, _.canvas.height * 0.05); e.boxColor = "rgba(50, 50, 200, 1)"; e.setText("Currency", "white");
	
	//Menu options
	e = this.menuBox = new Rectangle(0, this.namePlate.height, this.namePlate.width * 0.8, _.canvas.height - this.namePlate.height); e.boxColor = "green"; 
	
	var bHeight = this.menuBox.height * 0.1; 
	var bSpaceHeight = this.menuBox.height * 0.031;
	
	e = this.quickmatch = new Rectangle(this.menuBox.width * 0.13, (this.menuBox.y + bSpaceHeight) + bHeight * 0, this.menuBox.width * 0.87, this.menuBox.height * 0.1); e.boxColor = "gray"; e.setText("quickmatch", "white");
	this.clickableObjects.push(e);
	
	e = this.chat = new Rectangle(this.menuBox.width * 0.13, (this.menuBox.y + bSpaceHeight) + bHeight * 1, this.menuBox.width * 0.87, this.menuBox.height * 0.1); e.boxColor = "rgba(250, 0, 0, 0.5)"; e.setText("chat", "white"); 
	this.clickableObjects.push(e);
	
	e = this.browse = new Rectangle(this.menuBox.width * 0.13, (this.menuBox.y + bSpaceHeight) + bHeight * 2, this.menuBox.width * 0.87, this.menuBox.height * 0.1); e.boxColor = "gray"; e.setText("browse", "white"); 
	this.clickableObjects.push(e);
	
	e = this.sandbox = new Rectangle(this.menuBox.width * 0.13, (this.menuBox.y + bSpaceHeight) + bHeight * 3, this.menuBox.width * 0.87, this.menuBox.height * 0.1); e.boxColor = "gray"; e.setText("sandbox", "white");
	this.clickableObjects.push(e);
	
	e = this.tutorial = new Rectangle(this.menuBox.width * 0.13, (this.menuBox.y + bSpaceHeight) + bHeight * 4, this.menuBox.width * 0.87, this.menuBox.height * 0.1); e.boxColor = "gray"; e.setText("tutorial", "white");
	this.clickableObjects.push(e);
	
	e = this.ladder = new Rectangle(this.menuBox.width * 0.13, (this.menuBox.y + bSpaceHeight) + bHeight * 5, this.menuBox.width * 0.87, this.menuBox.height * 0.1); e.boxColor = "gray"; e.setText("ladder", "white");
	this.clickableObjects.push(e);
	
	e = this.tournament = new Rectangle(this.menuBox.width * 0.13, (this.menuBox.y + bSpaceHeight) + bHeight * 6, this.menuBox.width * 0.87, this.menuBox.height * 0.1); e.boxColor = "gray"; e.setText("tournament", "white");
	this.clickableObjects.push(e);
	

	e = this.chatBox = new Rectangle(this.menuBox.width, this.namePlate.height * 1.6, _.canvas.width - this.menuBox.width * 2.25, _.canvas.height - this.namePlate.height); 
	e.boxColor = "rgba(250, 0, 0, 0.2)"; e.setText("chatBox", "white");
	
	e = this.playerList = new Rectangle(this.chatBox.x + this.chatBox.width, this.chatBox.y, _.canvas.width - this.menuBox.width - this.chatBox.width, _.canvas.height - this.namePlate.height); e.boxColor = "rgba(0, 0, 250, 0.2)"; e.setText("Players", "white");
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
		}
	}
}
	  

CreateMenus.prototype.mousePosition = function(){

}
	  
CreateMenus.prototype.Draw = function() {
	
	this.namePlate.draw();
	this.nameLevel.draw();
	
	
	
	this.menuGear.draw();
	
	if (this.menus == true) {
	
		this.nameLogout.draw();
		this.menuBox.draw();
		this.chatBox.draw();
		this.playerList.draw();
		this.chat.draw();
		this.quickmatch.draw();
		this.browse.draw();
		this.sandbox.draw();
		this.tutorial.draw();
		this.ladder.draw();
		this.tournament.draw();
	}
	
	this.bottomBar.draw();
	this.currency.draw();
}
