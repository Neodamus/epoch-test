function CreateMenus(Width, Height) {

	  this.StartOptionBox;
	  this.CreateBox;
	  this.FindBox;
	  this.quickGameBox;
	  this.WebsiteBox;
	  this.logoutBox
	
	  this.ColorSelect;
	  this.SelectedMenu;
	  
	  this.id = "menus"		
	
	  var newwidth = Canvas.width * 0.243;
	  var newheight = Canvas.height * 0.403;
	  var newyh = Canvas.height * 0.03;
	  
	  this.MenuY = Canvas.height * 0.069;
	  this.MenuHeight = Canvas.height * 0.069;
	  this.MenuYSpace = Canvas.height * 0.093;
	  this.StartOptionBox = new Rectangle(Canvas.width * 0.5 - newwidth * 0.5, newyh, newwidth, newheight);
	  
	  this.CreateBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + this.MenuYSpace * 1 - this.MenuY, this.StartOptionBox.width, this.MenuHeight);
	  this.FindBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + this.MenuYSpace * 2 - this.MenuY, this.StartOptionBox.width, this.MenuHeight);
	  this.quickGameBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + this.MenuYSpace * 3 - this.MenuY, this.StartOptionBox.width, this.MenuHeight);
	  this.WebsiteBox = new Rectangle(this.StartOptionBox.x, this.StartOptionBox.y + this.MenuYSpace * 4 - this.MenuY, this.StartOptionBox.width, this.MenuHeight);
	  this.logoutBox = new Rectangle(Canvas.width * 0.9, 0, Canvas.width * 0.1, Canvas.height * 0.05)
	  
	  this.ColorSelect = "rgba(180, 28, 28, 0.9)";
	  
	  this.CreateBoxText = "Create a new Game";
	  this.FindBoxText = "Browse Game list";
	  this.quickGameBoxText = "Quick Game Search";
	  this.WebsiteBoxText = "Visit the Website";
	  this.logoutText = "Log Out"
	  
	  this.fontSize = Canvas.height * 0.021;
	  var menuYadjust = Canvas.height * 0.0369;
	  
	  this.createText = new MenutextBoxPosition(centreTextX(this.CreateBoxText, this.CreateBox.x, this.CreateBox.width, this.fontSize), this.CreateBox.y + menuYadjust);
	  this.findText = new MenutextBoxPosition( centreTextX(this.FindBoxText, this.FindBox.x, this.FindBox.width, this.fontSize), this.FindBox.y + menuYadjust);
	  this.quickText = new MenutextBoxPosition(centreTextX(this.quickGameBoxText, this.quickGameBox.x, this.quickGameBox.width, this.fontSize), this.quickGameBox.y + menuYadjust);
	  this.websiteText = new MenutextBoxPosition(centreTextX(this.WebsiteBoxText, this.WebsiteBox.x, this.WebsiteBox.width, this.fontSize), this.WebsiteBox.y + menuYadjust);
	  
	  this.fontSize = this.fontSize.toString();
	  this.fontSize += 'px FLORI';
}
	  
	  function MenutextBoxPosition(x, y) { this.x = x; this.y = y; }
		
	  CreateMenus.prototype.ClickisWithin = function(Mouse)
	  {
		this.SelectedMenu = null;
		if (this.CreateBox.Contains(Mouse) == true){ currentScreen = new SelectionScreen(); sendPacket("createRoom"); UnitSelection = currentScreen }
		if (this.FindBox.Contains(Mouse) == true){ currentScreen = new lobby(); Screen = "lobby"; /*this.SelectedMenu = "find"; */ }
		if (this.quickGameBox.Contains(Mouse) == true){ sendPacket("quickGame") /*this.SelectedMenu = "settings"; */}
		if (this.WebsiteBox.Contains(Mouse) == true){ window.location = "http://respectthewin.com"; }
		
		if (this.logoutBox.Contains(Mouse) == true) { 
		
			localStorage.clear()
			currentScreen = new login()
			currentScreen.loginInput.text = "Guest"
			connectionStatus = 1  
			
		}
		
	  }
	  
	  CreateMenus.prototype.mousePosition = function(mousePos)
	  {
		this.SelectedMenu = null;
		if (this.CreateBox.Contains(Mouse) == true){ this.SelectedMenu = "create"; }
		if (this.FindBox.Contains(Mouse) == true){ this.SelectedMenu = "find";}
		if (this.quickGameBox.Contains(Mouse) == true){ this.SelectedMenu = "quickgame";}
		if (this.WebsiteBox.Contains(Mouse) == true){ this.SelectedMenu = "website";}
		if (this.logoutBox.Contains(Mouse) == true){ this.SelectedMenu = "logout";}
	  }
	  
	  /* CreateMenus.prototype.Key = function(KeyChar)
	  {
		if (KeyChar == "13" && this.SelectedMenu == "create") { UnitSelection = new SelectionScreen(); createRoomRequest(); }
		if (KeyChar == "13" && this.SelectedMenu == "find")   { lobbyStart(); Screen = "lobby"; }
		if (KeyChar == "13" && this.SelectedMenu == "settings") { UnitSelection = new SelectionScreen(); joinRoomRequest(0) }
		if (KeyChar == "13" && this.SelectedMenu == "website") { window.location = "http://respectthewin.com";}
	  } */
	
	
	  CreateMenus.prototype.Draw = function(context, canvas) {
		  
		    context = document.getElementById('Mycanvas').getContext('2d')
			
			context.drawImage(Images[0],0 ,0 ,Canvas.width, Canvas.height);
			context.font = this.fontSize;
			context.fillStyle = "rgba(20, 20, 20, 0.5)";
			
			context.fillRect(this.StartOptionBox.x, this.StartOptionBox.y, this.StartOptionBox.width, this.StartOptionBox.height);
			
			if (this.SelectedMenu == "create"){this.ColorSelect = "rgba(240, 100, 100, 0.9)";}
			if (this.SelectedMenu != "create"){this.ColorSelect = "rgba(100, 20, 20, 0.9)";}
			context.fillStyle = this.ColorSelect;
			context.fillRect(this.CreateBox.x, this.CreateBox.y, this.CreateBox.width, this.CreateBox.height);
			context.fillStyle = "Black";
			context.fillText(this.CreateBoxText, this.createText.x, this.createText.y);
			
			if (this.SelectedMenu == "find"){this.ColorSelect = "rgba(240, 100, 100, 0.9)";}
			if (this.SelectedMenu != "find"){this.ColorSelect = "rgba(100, 20, 20, 0.9)";}
			context.fillStyle = this.ColorSelect;
			context.fillRect(this.FindBox.x, this.FindBox.y, this.FindBox.width, this.FindBox.height);
			context.fillStyle = "Black";
			
			var text = "Browse game list";
			context.fillText(this.FindBoxText, this.findText.x, this.findText.y);
			
			if (this.SelectedMenu == "quickgame"){this.ColorSelect = "rgba(240, 100, 100, 0.9)";}
			if (this.SelectedMenu != "quickgame"){this.ColorSelect = "rgba(100, 20, 20, 0.9)";}
			context.fillStyle = this.ColorSelect;
			context.fillRect(this.quickGameBox.x, this.quickGameBox.y, this.quickGameBox.width, this.quickGameBox.height);
			context.fillStyle = "Black";
			context.fillText(this.quickGameBoxText, this.quickText.x, this.quickText.y);
			
			if (this.SelectedMenu == "website"){this.ColorSelect = "rgba(240, 100, 100, 0.9)";}
			if (this.SelectedMenu != "website"){this.ColorSelect = "rgba(100, 20, 20, 0.9)";}
			context.fillStyle = this.ColorSelect;
			context.fillRect(this.WebsiteBox.x, this.WebsiteBox.y, this.WebsiteBox.width, this.WebsiteBox.height);
			context.fillStyle = "Black";
			context.fillText(this.WebsiteBoxText, this.websiteText.x, this.websiteText.y);	
			
			if (this.SelectedMenu == "logout"){this.ColorSelect = "rgba(240, 100, 100, 0.9)";}
			if (this.SelectedMenu != "logout"){this.ColorSelect = "rgba(100, 20, 20, 0.9)";}
			context.fillStyle = this.ColorSelect;
			context.fillRect(this.logoutBox.x, this.logoutBox.y, this.logoutBox.width, this.logoutBox.height);
			context.fillStyle = "Black";
			context.fillText(this.logoutText, this.logoutBox.x + this.logoutBox.width * 0.15, this.logoutBox.height * 0.7);		
			
		}