//var $g = new globals()	
//var game = loadGame()

sizeCanvas()

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
	
	this.connectionStatus = 0  								// 0 = connecting, 1 = logging in, 2 = logged in
	
	this.canvas = document.getElementById('Mycanvas')
    this.context = document.getElementById('Mycanvas').getContext('2d')	
	
	this.mouse  											// holds mouse position
	
	this.font = "FLORI"
	this.fontSize = Math.floor(this.canvas.height * 0.015)
	 
	this.shiftKey = false 									// returns true if shift is down, false if it's up
	 
	this.currentMode										// holds the currentMode object (ie: lobby, board) , identified by property -> id	 
	
	this.userName
	
}

window.onresize = function() { sizeCanvas() }

function sizeCanvas() {
	
	canvas = document.getElementById('Mycanvas')
	context = document.getElementById('Mycanvas').getContext('2d')
		
	canvas.width = window.innerWidth * 0.9
    canvas.height = window.innerHeight * 0.9
  
	if (canvas.width * 4 / 5 > canvas.height) {
		
		canvas.width = canvas.height * 5 / 4	
		canvas.style.marginLeft = (window.innerWidth * 0.9 - canvas.width) / 2 + "px"
		
	} else if (canvas.width * 4 / 5 < canvas.height) {
		
		canvas.height = canvas.width * 4 / 5
		
	}		
	
}