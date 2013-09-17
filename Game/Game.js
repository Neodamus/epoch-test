	 var numberOfUnits = 9;
	 var Canvas; //mine is 968 by 775
	 var Context;
	 var Images = new Array(110); //Images
	 var Mouse; //Mouse position (tied to 'click' event)
	 var KeyPressed; //KeyChar pressed
	 var FrameRate = 1000 / (30); //Edit brackets for frames per second
	 var Menus;
	 var Edit; //Alpha editor
	 var globalFont;
	 var globalFontSize;
	 
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
	  
	  currentScreen = { id: "blank" }	  
	  
	  LoadImageContent();
	  UnitStats = UnitStats(); //initialize unitstats
	  
	  //Start Draw updates
	  globalFont = (Canvas.height * 0.021).toString() + 'px FLORI';
	  globalFontSize = Canvas.height * 0.021;
	  var frame = setInterval(function(){Draw(context, canvas)},FrameRate);
	  
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
		Images[4].src = "Game/Images/lobby.png";
		Images[5].src = "Game/Images/borderyellow.png";
		Images[6].src = "Game/Images/borderattack.png";
		Images[7].src = "Game/Images/fog.png";
		Images[8].src = "Game/Images/roundedbox.png";
		Images[9].src = "Game/Images/borderspell.png";	  
		Images[10].src = "Game/Images/auratest.png";	 
		Images[11].src = "Game/Images/reveal.png";	 
		Images[12].src = "Game/Images/Menus/testborder1.png";	 
	  
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
	  
		document.addEventListener('keydown', function(evt) {
		  KeyPressed = evt.which;
		  Key(KeyPressed);
		  keyDownHandler(evt);
		}, false);
		
		document.addEventListener('keyup', keyUpHandler, false)
		
	}	
	
	function mouseMoveHandler(mouse) {
		
        var rect = _.canvas.getBoundingClientRect()
		
        Mouse = { 
		
			x: Math.floor(mouse.clientX - rect.left), 
			y: Math.floor(mouse.clientY - rect.top)
			
        }
			
		switch (_.currentMode.id) { 
		
			case "menus":
				_.currentMode.mousePosition(Mouse)
				break
				
		}
		
		switch (Screen) {
				
			case "GameBoard":
				ability.castModeHighlight();
				break;		
		
		}
		
	}
	
	function mouseClickHandler(mouse) {
	
        var rect = _.canvas.getBoundingClientRect()
		
        Mouse = { 
		
			x: Math.floor(mouse.clientX - rect.left), 
			y: Math.floor(mouse.clientY - rect.top)
			
        }
		
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
		
	}
	  
	function keyDownHandler(key) {
		
		var alphaNumeric = false	// returns true if key is letter or number
		
		if ((key.keyCode >= 96 && key.keyCode <= 105) || (key.keyCode >= 48 && key.keyCode <= 57) || (key.keyCode >= 65 && key.keyCode <= 90)
			|| key.keyCode == 8) {
			
			alphaNumeric = true
			
		}
		
		switch(key.keyCode) {
			
			case 16: 
				shiftKey = true
				break
				
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
	
	/* function detectCapsLock(key) {	
	
		var temp = document.createElement('p')	
		
		var s = document.createTextNode(key.which)
		temp.appendChild(s)
		temp.id = 'temp'
		  
		document.getElementById('bottom').insertBefore(temp, document.getElementById('bottom').childNodes[0])
		
		document.getElementById('temp').parentNode.removeChild(document.getElementById('temp'))
		
	} */
	
	//Drawing
	function Draw(context, canvas)
	{
		//Clear canvas before drawing next scene
	    context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "white";
		

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
		
		context.fillStyle = "White"
		context.font = '15px Arial';
		
		switch (_.connectionStatus) {
			
			case 0:
			
				context.fillText("Connecting...", 5, 15)	
				
				break
			
			case 1:
			
				context.fillText("Logging in...", 5, 15)	
				
				break
				
			case 2:

				context.fillText("Logged in as " + _.userName, 5, 15)
				
				break
			
		}
      
	}
	
