function CreateMenus(Width, Height) {
	  this.id = "menus"		
	  
	  var textYPosition = Canvas.height * 0.0369; //text adjustment for y
	 // this.fontSize = _.fontSize; //font size
	  
	  //Rectangle dynamic adjustments
	  var newwidth = Canvas.width * 0.243;
	  var newheight = Canvas.height * 0.403;
	  var newyh = Canvas.height * 0.03; //backgroundbox /end
	  var MenuY = Canvas.height * 0.069;
	  var MenuHeight = Canvas.height * 0.069;
	  var MenuYSpace = Canvas.height * 0.093; //menuboxes /end
	  
	// this.stringT = new advancedString(wordWrap("We&a& should make a font-class,`red` it`white` could be&test& like var`blue` font{size:`blue` 16,`blue` font:`blue` 16px`blue` newfont}`blue`", 400) 600, 400);
	  
	 // this.stringT = new advancedString(wordWrap("Hello, my name is Travis Miller", 100));
	  
	 //  this.stringT = new advancedString("hello`red` is this working?", 300, 600);
	 
	  
	  //Create rectangles
	  this.StartOptionBox = new Rectangle(Canvas.width * 0.5 - newwidth * 0.5, newyh, newwidth, newheight); this.StartOptionBox.boxColor = "rgba(10, 10, 10, 0.4)"

	  this.CreateBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 1 - MenuY, this.StartOptionBox.width, MenuHeight); this.CreateBox.boxColor = "rgba(100, 20, 20, 0.9)";
	  this.FindBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 2 - MenuY, this.StartOptionBox.width, MenuHeight);  this.FindBox.boxColor = "rgba(100, 20, 20, 0.9)";
	  this.quickGameBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 3 - MenuY, this.StartOptionBox.width, MenuHeight);  this.quickGameBox.boxColor = "rgba(100, 20, 20, 0.9)";
	  this.WebsiteBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 4 - MenuY, this.StartOptionBox.width, MenuHeight);  this.WebsiteBox.boxColor = "rgba(100, 20, 20, 0.9)";
	  this.logoutBox = new Rectangle(Canvas.width * 0.9, 1, Canvas.width * 0.1, Canvas.height * 0.05);  this.logoutBox.boxColor = "rgba(100, 20, 20, 0.9)";
	
	this.tooltipList = new Array();
	
		var testing = this.quickGameBox.setTooltip("Search the Game`red` List for`white` the first available game. If`yellow` no games are available you will host a new game lobby.", 200, "right");
		 this.tooltipList.push(testing);
		 
		 var testing = this.CreateBox.setTooltip("Create a single-player`red` GameBoard`white` with extra options. This`yellow` is for learning and testing out units and game mechanics.", 200, "right");
		 this.tooltipList.push(testing);
		 
		 var testing = this.FindBox.setTooltip("Enter the Game`red` Lobby to`white` join and create games, and`yellow` chat with other players.", 200, "right");
		 this.tooltipList.push(testing);
		 
		 var testing = this.WebsiteBox.setTooltip("This menu will re-direct this page to our blog.`red`", 200, "right");
		 this.tooltipList.push(testing);
	  
	 
	  
		
	  //Set text to be displayed inside the rectangle(position is set BASED on canvas, not rectangle!)                  centreTextY(numberOfLines, y, height, fontSize)
	  var text = "Log Out";
	  this.logoutBox.setText(text, "Black", centreTextX(text, this.logoutBox.x, this.logoutBox.width, this.fontSize), centreTextY(1, this.logoutBox.y, this.logoutBox.height, this.fontSize));
	  var text = "Sandbox";
	  this.CreateBox.setText(text, "Black", centreTextX(text, this.CreateBox.x, this.CreateBox.width, this.fontSize), centreTextY(1, this.CreateBox.y, this.CreateBox.height, this.fontSize));
	  var text = "Game Lobby";
	  this.FindBox.setText(text, "Black", centreTextX(text, this.FindBox.x, this.FindBox.width, this.fontSize), centreTextY(1, this.FindBox.y, this.FindBox.height, this.fontSize));
	  var text = "Quick Game Search";
	  this.quickGameBox.setText(text, "Black", 0, 0);
	  var text = "Visit the Website";
	  this.WebsiteBox.setText(text, "Black", centreTextX(text, this.WebsiteBox.x, this.WebsiteBox.width, this.fontSize), centreTextY(1, this.WebsiteBox.y, this.WebsiteBox.height, this.fontSize));
	  
	  this.buttonList = new Array(); //list that contains all buttons.
	  
	  //Sets rectangle to button and gives ID to each button
	  this.logoutBox.setButton("logout", this.buttonList);
	  this.CreateBox.setButton("sandbox", this.buttonList);
	  this.FindBox.setButton("browse", this.buttonList);
	  this.quickGameBox.setButton("quick", this.buttonList);
	  this.WebsiteBox.setButton("web", this.buttonList);
	   
	 // this.colorBool = false; //used to change colors of buttons normal
	 // this.fontSize = this.fontSize.toString(); 
	 // this.fontSize += 'px FLORI'; //finalize fontSize
}
	  
		
	  CreateMenus.prototype.ClickisWithin = function(Mouse){
	  
		var button;
		//Finds buttons selected
		for (var i = 0; i < this.buttonList.length; i++) { if (this.buttonList[i].Contains(Mouse)) { button = this.buttonList[i].button; break; } }
		
		switch(button) {
			
			case "logout":
			localStorage.clear()
			_.currentMode = new login()
			_.currentMode.loginInput.text = "Guest"
			_.connectionStatus = 1  
			break;
			
			case "sandbox":
			//_.currentMode = new SelectionScreen(); sendPacket("createRoom"); UnitSelection = _.currentMode;
			GameBoard = new Board("sandbox"); _.currentMode.id = "";
			break;
			
			case "browse":
			_.currentMode = new lobby(); Screen = "lobby";
			break;
			
			case "quick":
			sendPacket("quickGame")
			break;
			
			case "web":
			window.location = "http://epochofelements.com/blog/";
			break;
			}
	  }
	  
	  //highlight selection
	  CreateMenus.prototype.mousePosition = function(mousePos)
	  {
		var button;
		
		//Find buttons selected
		for (var i = 0; i < this.buttonList.length; i++) { if (this.buttonList[i].Contains(Mouse)) { this.colorBool = true; button = this.buttonList[i].button; break; } }
		
		//change all button colors to normal if applicable*
		if (button != null || this.colorBool == true &&  button == null) {for (var i = 0; i < this.buttonList.length; i++) { 
		this.buttonList[i].boxColor = "rgba(100, 20, 20, 0.9)"; 
		if (this.buttonList[i].tooltipBox != undefined) { this.buttonList[i].tooltipBox.tooltip = false;}
		} }
		
		if (button == null) { this.colorBool = false; }
		
	    
		
		//highlight selected button (using switch can only allow for 1 selection, so break was used previously)
		switch(button) {
			
			case "logout":
			this.logoutBox.boxColor = "rgba(240, 100, 100, 0.9)";
			
			break;
			
			case "sandbox":
			this.CreateBox.boxColor = "rgba(240, 100, 100, 0.9)";
			this.CreateBox.tooltipBox.tooltip = true;
			break;
			
			case "browse":
			this.FindBox.boxColor = "rgba(240, 100, 100, 0.9)";
			this.FindBox.tooltipBox.tooltip = true;
			break;
			
			case "quick":
			this.quickGameBox.boxColor = "rgba(240, 100, 100, 0.9)";
			this.quickGameBox.tooltipBox.tooltip = true;
			break;
			
			case "web":
			this.WebsiteBox.boxColor = "rgba(240, 100, 100, 0.9)";
			this.WebsiteBox.tooltipBox.tooltip = true;
			break;
			}
			
	  }
	  
	  CreateMenus.prototype.Draw = function(context, canvas) {
	  
		
	  
		  
		    context = document.getElementById('Mycanvas').getContext('2d')
			
			context.drawImage(Images[0],0 ,0 ,Canvas.width, Canvas.height);
			 
			//this.stringT.draw();
			//context.font = this.fontSize;
			
			context.fillStyle = "rgba(20, 20, 20, 0.5)";
			this.StartOptionBox.draw();
			context.fillStyle = "rgba(100, 20, 20, 0.9)";
			this.CreateBox.draw();
			this.FindBox.draw();
			this.quickGameBox.draw();
			this.WebsiteBox.draw();
			this.logoutBox.draw();
			for (var i = 0; i < this.tooltipList.length; i++) { if (this.tooltipList[i].tooltip == true) {  this.tooltipList[i].draw(); } }
			}