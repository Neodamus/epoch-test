function CreateMenus(Width, Height) {
	  this.id = "menus"		

	  var textYPosition = Canvas.height * 0.0369; //text adjustment for y
	 // this.fontSize = _.fontSize; //font size
	  
	  //Rectangle dynamic adjustments
	  var newwidth = Canvas.width * 0.243;
	  var newheight = Canvas.height * 0.403;
	  
	  var newxw = (Canvas.width - newwidth) * 0.5; //posx
	  var newyh = Canvas.height * 0.05; //posy
	  
	  var MenuY = Canvas.height * 0.069;
	  var MenuHeight = Canvas.height * 0.069;
	  var MenuYSpace = Canvas.height * 0.093; //menuboxes /end
	  
	  
	// this.stringT = { x: "lala", y: "blahblah", string: "" };
	// this.stringT.string = this.stringT.x + " " + this.stringT.y;
	  
	 this.color1 = "rgba(120, 20, 20, 0.5)"; //normal
	 this.color2 = "rgba(238, 0, 0, 0.8)"; //highlight
	  
	  //Create rectangles
	  this.StartOptionBox = new Rectangle(newxw, newyh, newwidth, newheight); this.StartOptionBox.boxColor = "rgba(50, 50, 50, 0.2)"

	  this.CreateBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 1 - MenuY, this.StartOptionBox.width, MenuHeight); this.CreateBox.boxColor =  this.color1
	  this.FindBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 2 - MenuY, this.StartOptionBox.width, MenuHeight);  this.FindBox.boxColor =  this.color1
	  this.quickGameBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 3 - MenuY, this.StartOptionBox.width, MenuHeight);  this.quickGameBox.boxColor =  this.color1
	  this.WebsiteBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + MenuYSpace * 4 - MenuY, this.StartOptionBox.width, MenuHeight);  this.WebsiteBox.boxColor =  this.color1;
	  this.logoutBox = new Rectangle(Canvas.width * 0.9, 1, Canvas.width * 0.1, Canvas.height * 0.05);  this.logoutBox.boxColor = this.color1;
	
	this.tooltipList = new Array();
	var width = 350;
	var posX = _.canvas.width * 0.5 - (width) * 0.5 ; posY =  _.canvas.height * 0.5; //           
	var clr = "`rgba(238, 0, 0, 0.5)`";
	var clr1 = "`rgba(238, 238, 0, 0.5)`";
	var clr2 = "`rgba(150, 150, 150, 0.7)`";
	var tooltipRect = new Rectangle(posX, posY, width, 0);
		var testing = this.quickGameBox.setTooltip(clr + "Find " + clr2 + "a match with another player. ^ ^ " + clr1 + "If a game cannot be found you will host a new game and wait for another player.", width, tooltipRect);
		 this.tooltipList.push(testing);
		 
	var tooltipRect = new Rectangle(posX, posY, width, 0); 
		 var testing = this.CreateBox.setTooltip(clr2 +"Create a " + clr + "Single-player " + clr2 + "gameboard with options. ^ ^ " + clr1 + "This is for testing out units and game mechanics.", width, tooltipRect);
		 this.tooltipList.push(testing);
		 
	var tooltipRect = new Rectangle(posX, posY, width, 0);
		 var testing = this.FindBox.setTooltip(clr2 + "Enter the " + clr + "Game Lobby " + clr2 + "to join or create specific games. ^ ^ " + clr1 + "Also chat with other players of this Epoch Community!", width, tooltipRect);
		 this.tooltipList.push(testing);
	
	var tooltipRect = new Rectangle(posX, posY, width, 0);
		 var testing = this.WebsiteBox.setTooltip(clr2 + "This menu will re-direct this page to our " + clr + "Blog|" + clr2 + ". ^ ^ " + clr1 + "Where you can read all about the creators, ideas, and the making of this Epoch Game!", width, tooltipRect);
		 this.tooltipList.push(testing);
		 
	var tooltipRect = new Rectangle(posX, posY, width, 0);
		  var testing = this.logoutBox.setTooltip(clr + "Change " + clr2 + "your current user-name to another name. ^ ^ " + clr1 + "No signup or register is required!", width, tooltipRect);
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
	  var text = "Visit the Blog";
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
		this.buttonList[i].boxColor =  this.color1;
		if (this.buttonList[i].tooltipBox != undefined) { this.buttonList[i].tooltipBox.tooltip = false;}
		} }
		
		if (button == null) { this.colorBool = false; }
		
	    
		
		//highlight selected button (using switch can only allow for 1 selection, so break was used previously)
		switch(button) {
			
			case "logout":
			this.logoutBox.boxColor = this.color2;
			this.logoutBox.tooltipBox.tooltip = true;
			break;
			
			case "sandbox":
			this.CreateBox.boxColor = this.color2;
			this.CreateBox.tooltipBox.tooltip = true;
			break;
			
			case "browse":
			this.FindBox.boxColor = this.color2;
			this.FindBox.tooltipBox.tooltip = true;
			break;
			
			case "quick":
			this.quickGameBox.boxColor = this.color2;
			this.quickGameBox.tooltipBox.tooltip = true;
			break;
			
			case "web":
			this.WebsiteBox.boxColor = this.color2;
			this.WebsiteBox.tooltipBox.tooltip = true;
			break;
			}
			
	  }
	  
	  CreateMenus.prototype.Draw = function(context, canvas) {
	  
		
	  
		  
		    context = document.getElementById('Mycanvas').getContext('2d')
			
			context.drawImage(Images[0], (_.canvas.width - 955) * 0.5 , _.canvas.height - 560 ,955, 745);
			 //this.stringT = { blah: "lala", string: "ooh " + blah };
			// context.fillText(this.stringT.string, 400, 400);
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