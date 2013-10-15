var socket

function startSocket() {

	if ('WebSocket' in window ) {	
		socket = new WebSocket('ws://epoch-neodamus.rhcloud.com:8000')
	} else {
	   alert("Your browser doesn't support multiplayer!")
	}	
	
	socket.onerror = function() {
	}
	
	socket.onmessage = function(message) {
		messageHandler(message)
	}
	
	socket.onopen = function() {
		
		sendPacket("connectSuccess")
		_.connectionStatus = 1
		
		_.userName = localStorage.epochLogin
		
		if (_.userName == null) {
			
			_.currentMode = new login()
			_.userName = "Guest"
			_.currentMode.loginInput.text = _.userName
			
		} else {		
			
			_.currentMode = new CreateMenus(document.getElementById('Mycanvas').width, document.getElementById('Mycanvas').height)
			sendPacket2("loginRequest", _.userName)
			_.connectionStatus = 2			
			
		}
			
	}
	
	socket.onclose = function() {
	}
		
}

function game_packet(id, data, data2) {
        this.id = id;
        this.data = data;
        this.data2 = data2;
}
	
// create event which fires when a packet is sent to websocket for handling
var test = new Event("pevt")
document.addEventListener("pevt",function() { socket.send("test") },true)
	
function send_packet() {
	var p = new game_packet(1, 0, 0)
	socket.send(JSON.stringify(p))
}

function messageHandler(message) {
	
	var p = message.data
	var id = JSON.parse(p).id
	var data = JSON.parse(p).data
	var data2 = JSON.parse(p).data2
	
	switch(id) {
		
		case "ability":		
			ability.receiveAbility(data);		
		break;
		
		case "broadcast":
			_.messages.addFadeText("`pink`" + data);
		break;
		
		case "loginSuccess":		
			_.userName = data
			document.title = _.userName + " - Epoch of Elements"
			_.connectionStatus = 2			
		break;
		
		case "createRoom":
			UnitSelection = new SelectionScreen()
			_.currentMode = UnitSelection
			_.currentMode.waiting = true
			_.host = true;
		break
			
		case "playerJoin":
			_.currentMode.waiting = false
			ClientsTurn = true;
			sendPacket("joinSuccess");
		break;
			
		case "joinSuccess":
			UnitSelection = new SelectionScreen();
			UnitSelection.pickIndex = 1;
			UnitSelection.pickCount = UnitSelection.pickOrder[UnitSelection.pickIndex];
			_.currentMode = UnitSelection;
			_.host = false;
			break;
			
		case "loadState":
					
			if (data == 0) { 
				alert("No game state saved by that name"); 
			} else {		
				var state = data.state;
				if (GameBoard != null) { 
					GameBoard.loadState(state) 
				} else { 
					alert("hello");
					GameBoard = new Board("sandbox");
					_.currentMode = GameBoard;
					GameBoard.loadState(state);
				}
			}
		
		break;
			
		case "observe":
		
			var phase = data[0];
			var players = data[1];
			var packetList = data[2];
			
			switch(phase) {
				
				case "selection": 
					UnitSelection = new SelectionScreen(); 
					UnitSelection.allyName = players[0];
					UnitSelection.enemyName = players[1];
					_.currentMode = UnitSelection; 
					UnitSelection.syncObserver(packetList);				
				break;
				
				case "game": 
				
				break;	
			}
			
			_.host = false;
			_.observer = true;
				
		break;
		
		case "requestState":
		
			var saveName = data;
			
			if (GameBoard != null) {
				var saveState = GameBoard.saveState();
				var packet = { name: saveName, state: saveState };
				sendPacket("saveState", packet);
			}
		
		break;
			
		case "selectUnit":
			UnitSelection.ReceivePick(data, data2)
			break
			
		case "removeUnit":
			UnitSelection.ReceiveRemove(data)
			break
			
		case "createUnit":
			GameBoard.ReceiveCreate(data)
			break
			
		case "unitAction":
			GameBoard.receiveAction(data)
			break	
			
		case "removeBoardUnit":
			GameBoard.ReceiveRemove(data)
			break
			
		case "getGamesList":
		
			if (_.currentMode.id == "lobby") {
				
				_.currentMode.gamesList.inputObject(data)		
				setTimeout(gamesListRequest, 1000)
			  
			}			  
		break;
			
		case "getUsersList":		
		
			if (_.currentMode.id == "lobby") {			
				
				_.currentMode.numUsers = data.length;
				
				if (data.length == undefined) {
					_.currentMode.connectedUsers.setText("Users Online: " + _.currentMode.numUsers, "White");
				} else {
					_.currentMode.connectedUsers.setText("Users Online: " + _.currentMode.numUsers, "White");
				}
				
				_.currentMode.connectedUsersList.inputObject(data);		
				setTimeout(sendPacket("getUsersList"), 1000);
			  
			}
		
			break
			
		case "getChat":
		
			switch (_.currentMode.id) {
			
				case "lobby":
				
					_.currentMode.chatRoom.clear();
									
					if (data[0] != undefined) {
						_.currentMode.chatRoom.inputObject(data);
						_.currentMode.chatRoom.scrollToLastRow();
					}
										
				break;	
				
			}
		
			break
			
		case "startGame":
		
			ClientsTurn = data
			break
			
		case "endTurn":
		
			ClientsTurn = true;
			break;
			
		case "startTurn":		
			ClientsTurn = true;
			if (GameBoard != null) { if (GameBoard.waiting == true) { GameBoard.waiting = false; } }
		break;
			
	}
	
}

function gamesListRequest() {
	var p = new game_packet("getGamesList")
	socket.send(JSON.stringify(p))	
}

function joinRoomRequest(room) {
	var p = new game_packet("joinRoom", 0)
	socket.send(JSON.stringify(p))
}

function sendUnitSelection(element, index) {
	var p = new game_packet("selectUnit", element, index)
	socket.send(JSON.stringify(p))		
}

function sendCreateUnit(createArray) {
	var p = new game_packet("createUnit", createArray)
	socket.send(JSON.stringify(p))		
}

function sendUnitAction(createArray) {
	var p = new game_packet("unitAction", Instructions)
	socket.send(JSON.stringify(p))		
}

function sendRemoveUnit(createArray) {
	var p = new game_packet("removeBoardUnit", removeArray)
	socket.send(JSON.stringify(p))		
}

function sendUnitRemove(unitNumber) {
	var p = new game_packet("removeUnit", unitNumber)
	socket.send(JSON.stringify(p))		
}

function sendPacket(id, data) {	
	var p = new game_packet(id, data)
	socket.send(JSON.stringify(p))
}

function sendPacket2(id, data) {	
	var p = new game_packet(id, data)
	socket.send(JSON.stringify(p))
}

function sendPacket3(id, data, data2) {	
	var p = new game_packet(id, data, data2)
	socket.send(JSON.stringify(p))
}


