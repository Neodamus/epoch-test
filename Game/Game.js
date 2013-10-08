	 var numberOfUnits = 9;
	 var Canvas; //mine is 968 by 775
	 var Context;
	 var Images = new Array(200); //Images
	 var Mouse; //Mouse position (tied to 'click' event)
	 var KeyPressed; //KeyChar pressed
	 var FrameRate = 1000 / (30); //Edit brackets for frames per second
	 var Menus;
	 var Edit; //Alpha editor
	 var globalFont;
	 var globalFontSize;
	 
	 var myAudio;
	 
	 var shiftKey = false // returns true if it's down, false if it's up
	 
	 var ClientsTurn = false;	 
	 
	 //public Classes
	 var UnitStats;
	 var UnitSelection;
	 var GameBoard;
	 
	 
	 var Screen;
	 
	//Start game and attach events to canvas
	function StartGame()
	{
	  
	  Canvas = _.canvas;
	  Context = _.context;
	  canvas.oncontextmenu = function(event) { event.preventDefault(); event.stopPropagation(); return false; } //disables rightclick on canvas
	  canvas.onmousedown = function(){ return false;} //ON MOUSE DOWN -- Disable highlighting text on page
	  startEventHandlers()
	  
	  //canvas.style.cursor = "none";
	  
	  currentScreen = { id: "blank" }	  
	  
	  LoadImageContent();
	  UnitStats = UnitStats(); //initialize unitstats
	  
	  //Start Draw updates
	  globalFont = (Canvas.height * 0.031).toString() + 'px FLORI';
	  globalFontSize = Canvas.height * 0.031;
	  
	  var frame = setInterval(function(){ Draw(context, canvas) },FrameRate);
	  
	  
	  myAudio = new Audio('Game/Images/modWardruna - Hagal.mp3'); 
		myAudio.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
		}, false);
	 // myAudio.currentTime = 0;
	  //  myAudio.play();
	 
	  myAudio.volume = 0.40;
	  
	  // initialize message box --- change to initialize when initialize is added to textBox
	  _.messages = new textBox(_.canvas.width * 0.05, _.canvas.height * 0.05, _.canvas.width * 0.9, _.canvas.height * 0.5);
	  _.messages.setAlpha(0, 1);
	  _.messages.setFontFamily("Georgia");
	  _.messages.setFontSize(Math.floor(_.canvas.height * 0.025));
	  _.messages.setMaxRows(5);	   
	  
	}
	
	function LoadImageContent()
	{
	  for (var i = 0; i < Images.length; i++)
	  {
		Images[i] = new Image();
	  }
		Images[0].src = "Game/Images/MenuBackground.png";
		Images[1].src = "Game/Images/newgrass.png";
		Images[2].src = "Game/Images/gamemat.png";
		Images[3].src = "Game/Images/border.png";
		Images[4].src = "Game/Images/lobby.jpg";
		Images[5].src = "Game/Images/borderyellow.png";
		Images[6].src = "Game/Images/borderattack.png";
		Images[7].src = "Game/Images/fog.png";
		Images[8].src = "Game/Images/roundedbox.png";
		Images[9].src = "Game/Images/borderspell.png";	  
		Images[10].src = "Game/Images/auratest.png";	 
		Images[11].src = "Game/Images/reveal.png";	 
		Images[12].src = "Game/Images/Menus/testborder1.png";	 
		Images[13].src = "Game/Images/abilitySelect.png";	
		Images[14].src = "Game/Images/spawnMarker.png";	

		//tilemods
		Images[15].src = "Game/Images/abilities/fire.png"
		Images[16].src = "Game/Images/abilities/energyfield.png"
		Images[17].src = "Game/Images/abilities/root.png"
		Images[18].src = "Game/Images/abilities/smokescreen.png"
		Images[19].src = "Game/Images/abilities/mine.png"
	  
		//20 = first unit image (loaded in same order as "AllUnits Variable")
	  Images[20].src = "Game/Images/Units/vangaurd.png";
	  Images[21].src = "Game/Images/Units/elemental.png";
	  Images[22].src = "Game/Images/Units/firebringer.png";
	  Images[23].src = "Game/Images/Units/seer.png";
	  Images[24].src = "Game/Images/Units/assassin.png";
	  Images[25].src = "Game/Images/Units/infiltrator.png";
	  Images[26].src = "Game/Images/Units/sensei.png";
	  Images[27].src = "Game/Images/Units/illusionist.png";
	  Images[28].src = "Game/Images/Units/crossbowman.png";
	  Images[29].src = "Game/Images/Units/sharpshooter.png";
	  Images[30].src = "Game/Images/Units/ranger.png";
	  Images[31].src = "Game/Images/Units/grovekeeper.png";
	  Images[32].src = "Game/Images/Units/charger.png";
	  Images[33].src = "Game/Images/Units/ironfist.png";
	  Images[34].src = "Game/Images/Units/inductor.png";
	  Images[35].src = "Game/Images/Units/titan.png";
	  Images[36].src = "Game/Images/Units/lifeforce.png";
	  Images[37].src = "Game/Images/Units/theurgist.png";
	  Images[38].src = "Game/Images/Units/healer.png";
	  Images[39].src = "Game/Images/Units/rainmaker.png";
	  
	  Images[100].src = "Game/Images/Menus/login.png"
	  Images[101].src = "Game/Images/Menus/login-button.png"	
	  Images[102].src = "Game/Images/scrollup.png" 
	  Images[103].src = "Game/Images/scrolldown.png"
	  Images[104].src = "Game/Images/stealthpick.png"
	  

	  Images[112].src = "Game/Images/abilities/summon.png";
	  
	  
	  Images[113].src = "Game/Images/abilities/mist.png";
	  Images[114].src = "Game/Images/abilities/sentry.png";
	  Images[115].src = "Game/Images/Units/fire-eye.png";
	  Images[116].src = "Game/Images/mouse1.png";
	  
	  Images[130].src = "Game/Images/fire.png";
	  Images[131].src = "Game/Images/air.png";
	  Images[132].src = "Game/Images/earth.png";
	  Images[133].src = "Game/Images/lightning.png";
	  Images[134].src = "Game/Images/water.png";
	  Images[135].src = "Game/Images/menu.png";
	  Images[136].src = "Game/Images/enemy.png";
	}
	
	function returnTileImage(name)
	{
		/*Images[15].src = "Game/Images/abilities/fire.png"
		Images[16].src = "Game/Images/abilities/energyfield.png"
		Images[17].src = "Game/Images/abilities/root.png"
		Images[18].src = "Game/Images/abilities/smokescreen.png"*/
		switch(name){
			case "Fire Wall": return Images[15]; 
			case "Creeping Vines": return Images[17];
			case "Energy Field": return Images[16];
			case "Smoke Screen": return Images[18];
			case "Magma Trap": return Images[19];
			case "Mist": return Images[113];
			//case "Sentry": return Images[114]; NEEDS TO be hidden from enemy no matter what
		}
		return Images[10];
	}
	
	
	//Assigns a number to string names for Images
	function ReturnUnitImage(name)
	{
		switch(name){
			case "Vangaurd": return 20; 
			case "Nightmare": return 21;
			case "Firebringer": return 22; 
			case "Seer": return 23; 
			case "Assassin": return 24; 
			case "Infiltrator": return 25; 
			case "Sensei": return 26; 
			case "Illusionist": return 27; 
			case "Crossbowman": return 28; 
			case "Sharpshooter": return 29; 
			case "Ranger": return 30; 
			case "Grovekeeper": return 31; 
			case "Charger": return 32; 
			case "Ironfist": return 33; 
			case "Inductor": return 34;
			case "Titan": return 35;
			case "Ice Spirit": return 36; 
			case "Theurgist": return 37; 
			case "Healer": return 38;
			case "Rainmaker": return 39; 
			case "Fiery Eye": return 115;
			}
			
	}
	
	function startEventHandlers() {
		
		canvas = _.canvas;
		
		canvas.addEventListener('mousemove', mouseMoveHandler, false)	
		
		canvas.addEventListener('click', mouseClickHandler, false)	
		
		canvas.addEventListener('mouseup', function(evt) {
		  Mouse = getMousePos(canvas, evt);
		  Click(Mouse, evt.button);
		}, false);
		
		canvas.addEventListener('mousewheel', mouseWheelHandler, false);
		canvas.addEventListener('DOMMouseScroll', mouseWheelHandler, false);
	  
		document.addEventListener('keydown', function(evt) {
		  KeyPressed = evt.which;
		  Key(KeyPressed);
		  keyDownHandler(evt);
		}, false);
		
		document.addEventListener('keyup', keyUpHandler, false)
		
	}	
	
	function mouseMoveHandler(mouse) {
		
        var rect = _.canvas.getBoundingClientRect()
		
        _.mouse = { 
		
			x: Math.floor(mouse.clientX - rect.left), 
			y: Math.floor(mouse.clientY - rect.top)
			
        };
		
		Mouse = _.mouse;
			
		switch (_.currentMode.id) { 
		
			case "menus":
				_.currentMode.mousePosition(Mouse)
				break
				
		}
		
		switch (Screen) {
				
			case "GameBoard":
				ability.castModeHighlight();
				Ui.tooltips();
				break;		
		
		}
		
	}
	
	function mouseClickHandler(mouse) {
		
		switch(_.currentMode.id) {
			
			case "lobby":
				lobbyClick()
				break
				
			case "login":
				loginClick()
				loginEnter()
				break
				
			case "menus":
				_.currentMode.ClickisWithin(Mouse)
				break
		
		}
		
		if (_.console.display == 1) {
			_.console.consoleClick();
		}
		
	}
	
	function mouseWheelHandler(mouse) {
		
		var mouseWheelDirection;			
		if (mouse.wheelDelta != undefined) {	
			if (mouse.wheelDelta > 0) { mouseWheelDirection = "up"; } else { mouseWheelDirection = "down"; } // Non-FF browsers
		} else {
			if (mouse.detail < 0) { mouseWheelDirection = "up"; } else { mouseWheelDirection = "down"; }	// Firefox
		}
		
		switch(Screen) {
		
			case "GameBoard":
			
				ability.mouseWheelHandler(mouseWheelDirection);
			
			break;		
		
		}
		
		mouse.preventDefault();
		
	}
	  
function keyDownHandler(key) {
		
	var alphaNumeric = false	// returns true if key is letter or number
	
	// alert(key.keyCode);
	
	if ((key.keyCode >= 96 && key.keyCode <= 105) || (key.keyCode >= 48 && key.keyCode <= 57) || (key.keyCode >= 65 && key.keyCode <= 90)
		|| key.keyCode == 8) {
		
		alphaNumeric = true
		
	}
		  
	if (_.console.display == 1) {
		_.console.consoleKeyDown(key);	
	}	
	
	switch(key.keyCode) {
		
		case 16: 
			shiftKey = true
			break
			
		case 192: 	// tilde for console
			_.console.toggle();
		break;
			
	}
	
	switch(_.currentMode.id) {
	
		case "login": 
		
			if (alphaNumeric) { loginKeydown(key) }
			
			break
			
		case "lobby":
		
			lobbyKeyDown(key)
			
			break
		
	}	
}
	
	function keyUpHandler(key) {
		
		switch(key.keyCode) {
			
			case 16: 
				shiftKey = false
				break
				
		}		
		
	}
	
	//Getting mouse position
	 function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
	  
	  
	  
	  
	  function listContains(list, value) { for (var i = 0; i < list.length; i++) { if (list[i] === value) { return true;} } return false; }
	  
	  function listReturnArray(list, value) { for (var i = 0; i < list.length; i++) { if (list[i] === value) { return i;} } return -1; }
	  
	  function centreTextX(Textstring, x, width, fontSize) { var stringSize;  
	  stringSize = (Textstring.length) * (fontSize * 0.599); 
	  if (width - stringSize > 0) 
	  { var stringLength = (width - stringSize) * 0.5;
	  return (x + stringLength)} 
	  return 0;} 
	  
	  function centreTextY(numberOfLines, y, height, fontSize) { 
	  y += fontSize * 0.8; //not exact, fontSize is != actual height of font
	  var stringSize = numberOfLines * (fontSize);  //isn't based on string, just number of lines - fix
	  stringSize = (height - stringSize) * 0.50;          //height - 
	  return (y + stringSize)} 
	  

	  
	//Event of mouse click
	function Click(Mouse, WhichClick)
	{
		if (Menus != null && Screen == "Menus")
		{	
			alert("deprecated menu click function")
			Menus.ClickisWithin(Mouse);
		}
		if (Screen == "GameBoard")
		{
			if (Ui.ClickisWithin(Mouse) == true)
			{ return; }
			GameBoard.ClickGrid(Mouse, WhichClick);
		}
		if (Screen == "UnitSelection")
		{
			UnitSelection.ClickisWithin(Mouse, WhichClick);
		}
	}
	
	//Event of key press
	function Key(KeyPress)
	{
		if (Menus != null && Screen == "Menus")
		{
			// Menus.Key(KeyPress);
		}
		if (Screen == "GameBoard")
		{
			GameBoard.Key(KeyPress);
		}
	}
	
	//Drawing
	function Draw(context, canvas)
	{
		//Clear canvas before drawing next scene
	    context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "white";
		_.context.globalAlpha = 1;
		
		

		switch(Screen) {
			case "Menus": Menus.Draw(context, canvas); alert ("Drawing menus from screen"); break;				
			case "UnitSelection": UnitSelection.Draw(context, canvas); break;
			case "GameBoard": GameBoard.Draw(context, canvas); break;
		}
		
		switch (_.currentMode.id) {
			
			case "lobby": 
				_.currentMode.draw();
				break;
			
			case "login":
				_.currentMode.draw();
				break;
				
			case "menus":
				_.currentMode.Draw();
				break;
				
			case "blank":
				context.fillStyle = "Black";
				context.fillRect(0, 0, canvas.width, canvas.height);
						
		}
		
		context.fillStyle = "#BBB"
		context.font = (_.fontSize * 1) + "px " + _.fontFamily;;
		
		switch (_.connectionStatus) {
			
			case 0:
			
				context.fillText("Connecting...", 5, _.fontSize)	
				
				break
			
			case 1:
			
				context.fillText("Logging in...", 5, _.fontSize)	
				
				break
				
			case 2:

				context.fillText("Logged in as " + _.userName, 5, _.fontSize)
				
				break
			
		}
		
		_.console.draw();
		_.messages.draw();
      
	 // if (Mouse != undefined) { 
	 // _.context.drawImage(Images[116], Mouse.x, Mouse.y); }
	}
	
