var _ = new globals();	// globals
//var game = loadGame()

window.onload = function() { 

	sizeCanvas();	
	StartGame();
	
}

function loadGame() {
	
	// load helpers
	loadjs("helpers/inputBox.js")
	loadjs("helpers/Rectangles.js")
	
	
	loadjs("Game/MainScreen/Menus.js")
	loadjs("Game/websocket.js")
	loadjs("Game/UnitStats.js")
	loadjs("Game/lobby.js")
	loadjs("Game/MainScreen/CreateBoard/Board.js")
	loadjs("Game/MainScreen/CreateBoard/UnitSelection.js")
	loadjs("Game/MainScreen/CreateBoard/CreateGrid.js")
	loadjs("Game/MainScreen/CreateBoard/Grid.js")
	loadjs("Game/MainScreen/CreateBoard/Ui.js")
	loadjs("Game/MainScreen/CreateBoard/Unit.js")
	loadjs("Game/MainScreen/CreateBoard/abilities.js")
	loadjs("Game/MainScreen/CreateBoard/buff.js")

	setTimeout(function() { loadjs("Game/Game.js") } , 1000)
	
	sizeCanvas()
	
}

function loadjs(fileSrc) {
	
	var file = document.createElement('script')
  	file.setAttribute("type","text/javascript")
  	file.setAttribute("src", fileSrc)
	document.getElementsByTagName("head")[0].appendChild(file)	
	
}

function globals() {
	
	this.connectionStatus = 0; 								// 0 = connecting, 1 = logging in, 2 = logged in
	
	this.canvas = document.getElementById('Mycanvas');
    this.context = document.getElementById('Mycanvas').getContext('2d');
	
	this.mouse;  											// holds mouse position
	
	this.fontFamily = "FLORI";
	this.fontSize = Math.floor(this.canvas.height * 0.025);
	this.font = this.fontSize + "px " + this.fontFamily;
	 
	this.shiftKey = false; 									// returns true if shift is down, false if it's up
	 
	this.currentMode =  { id: "blank" };					// holds the currentMode object (ie: lobby, board) , identified by property -> id	 
	
	this.userName;
	this.host;
	
}

globals.prototype.fontResize = function() {

	this.fontSize = Math.floor(this.canvas.height * 0.032);
	this.font = this.fontSize + "px " + this.fontFamily;
}

window.onresize = function() { sizeCanvas() }

function sizeCanvas() {
	
	var M = {
		border: 20,
		width: Math.floor(window.innerWidth - 420), 
		height: Math.floor(window.innerHeight - 190) 
	}

	// resize middle divs
	document.getElementById('middle-wrapper').style.width = M.width + M.border + "px";
	document.getElementById('header-div').style.width = M.width + M.border + "px";
	document.getElementById('header').style.width = M.width + M.border + "px";
	
	// center header
	if (M.width + M.border > 900) {
		document.getElementById('header').style.marginLeft = (M.width + M.border - 900) / 2 + "px"; 
	} else {
		document.getElementById('header').style.marginLeft = "0px";
	}
	
	// align adboxes to middle
	document.getElementById('adbox-left').style.marginTop = (window.innerHeight - 834) / 2 + "px";
	document.getElementById('adbox-right').style.marginTop = (window.innerHeight - 834) / 2 + "px";

	//resize main viewport div
	main = document.getElementById('main')
	
	main.style.width = M.width + "px"
	main.style.height = M.height + "px"
	main.style.overflow = "auto"
	
	// resize canvas
	canvas = document.getElementById('Mycanvas')
	
	if (canvas != null) {
		
		main.style.overflow = "hidden"
		
		context = document.getElementById('Mycanvas').getContext('2d')
		  
		canvas.width = M.width
		canvas.height = M.height
	   
	    if (canvas.width * 4 / 5 > canvas.height) {
		
			canvas.width = canvas.height * 5 / 4
			  
			main.style.marginLeft = (M.width - canvas.width) / 2  + "px"			
			main.style.width = canvas.width + "px"	
			main.style.height = canvas.height + "px"
			main.style.paddingTop = "0px"
			  
		} else if (canvas.width * 4 / 5 < canvas.height) {
			  
			canvas.height = canvas.width * 4 / 5
			  
			main.style.marginTop = (M.height - canvas.height) / 2 + "px"	
			main.style.width = canvas.width + "px"
			main.style.height = canvas.height + "px";
			main.style.paddingLeft = "0px"
			  
		}
				
	} else {
		
		document.getElementById('content').style.width = Math.floor(M.width * 0.9) + "px"
		document.getElementById('content').style.marginLeft = Math.floor(M.width * 0.05 - 20) + "px"
	
	}
	
	_.fontResize();
}

// creates a clone of any object
Object.prototype.clone = function() {
	
	return JSON.parse(JSON.stringify(this)) 
	
}