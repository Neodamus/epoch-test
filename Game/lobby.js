function lobby() {	

	this.id = "lobby"

	this.canvas = _.canvas
    this.context = _.context
	
	this.lobbyWidth = Math.floor(this.canvas.width)
	this.lobbyHeight = Math.floor(this.canvas.height)
	
	// buttons
	this.joinGame = new Rectangle(this.lobbyWidth * 0.1, this.lobbyHeight * 0.43, this.lobbyWidth * 0.2, this.lobbyHeight * 0.04);
	this.joinGame.setText("Join", "#fff", this.joinGame.width * 0.35, this.joinGame.height * 0.7);	
	this.joinGame.setFontSize(_.fontSize * 0.8);
	
	this.createGame = new Rectangle(this.lobbyWidth * 0.5, this.lobbyHeight * 0.43, this.lobbyWidth * 0.2, this.lobbyHeight * 0.04);
	this.createGame.setText("Create", "#fff", this.createGame.width * 0.35, this.createGame.height * 0.7);
	this.createGame.setFontSize(_.fontSize * 0.8);
	this.createGame.clickfxn = function() { UnitSelection = new SelectionScreen(); _.currentMode = UnitSelection; sendPacket("createRoom"); }
	
	// games list
	this.gamesList = new textBox(this.lobbyWidth * 0.05, this.lobbyHeight * 0.1, this.lobbyWidth * 0.7, this.lobbyHeight * 0.3)
	this.gamesList.setFontSize(_.fontSize * 0.8);
	this.gamesList.setColumns( [0, 0.35, 0.7] )
	gamesListRequest()
	
	// users list init
	this.connectedUsers = new Rectangle(this.lobbyWidth * 0.8, this.lobbyHeight * 0.1, this.lobbyWidth * 0.15, this.lobbyHeight * 0.05);
	this.connectedUsers.setText("Users Online: " + this.numUsers, "White", this.connectedUsers.width * 0.1, this.connectedUsers.height * 0.7);
	this.connectedUsers.setFontSize(_.fontSize * 0.75);
	
	this.connectedUsersList = new textBox(this.lobbyWidth * 0.8, this.lobbyHeight * 0.2, this.lobbyWidth * 0.15, this.lobbyHeight * 0.7);
	this.connectedUsersList.setFontSize(Math.floor(this.lobbyHeight * 0.025));
	
	this.numUsers = 0
	sendPacket("getUsersList")
	
	// chat init
	this.chatBar = new inputBox(this.lobbyWidth * 0.05, this.lobbyHeight * 0.85, this.lobbyWidth * 0.7, this.lobbyHeight * 0.05)
	this.chatBar.setPadding(Math.floor(this.chatBar.height * 0.1), Math.floor(this.chatBar.width * 0.015), Math.floor(this.chatBar.height * 0.3),
		Math.floor(this.chatBar.width * 0.015))
	this.chatBar.setFontSize(Math.floor(this.chatBar.height * 0.5))
	
	this.chatRoom = new textBox(this.lobbyWidth * 0.05, this.lobbyHeight * 0.5, this.lobbyWidth * 0.7, this.lobbyHeight * 0.30)
	this.chatRoom.setFontSize(_.fontSize * 0.8);
	this.chatRoom.setColumns( [0, 0.125, 0.3] )
	this.chatRoom.textReverse = true
	sendPacket("getChat")
	
}

lobby.prototype.draw = function() {
	
	// background
	this.context.drawImage(Images[4], 0, 0, this.lobbyWidth, this.lobbyHeight)
	this.context.fillStyle = "Black"
	this.context.font = "bold 16px serif"
	
	this.createGame.draw();	
	this.joinGame.draw();	
	this.gamesList.draw();	
	this.connectedUsers.draw();	
	this.connectedUsersList.draw();
	this.chatRoom.draw();
	this.chatBar.draw();	
}

function lobbyKeyDown(key) {
	
	// alert(key.keyCode)
	
	var chatBar = _.currentMode.chatBar
	var specials = [ 192, 173, 61, 219, 220, 221, 59, 222, 188, 190, 191 ]
	
	if (chatBar.active) {	
	
		if (key.keyCode == 8) { // backspace
			
			key.preventDefault()
			chatBar.text = chatBar.text.substring(0, chatBar.text.length - 1)
			
		} else if (key.keyCode >= 96 && key.keyCode <= 105) { // numpad
			
			chatBar.text = chatBar.text + String.fromCharCode(key.keyCode - 48)	
			
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
			
			chatBar.text = chatBar.text + String.fromCharCode(inputCode)
			
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
			
			chatBar.text = chatBar.text + String.fromCharCode(inputCode)
			
		} else if (shiftKey || key.keyCode == 32) {  // letters
			
			chatBar.text = chatBar.text + String.fromCharCode(key.keyCode)
			
		} else if (!shiftKey) {
	
			chatBar.text = chatBar.text + String.fromCharCode(key.keyCode).toLowerCase()
			
		}
	
	}	
	
	if (key.keyCode == 27) {
			
			key.preventDefault()
			_.currentMode = new CreateMenus(document.getElementById('Mycanvas').width, document.getElementById('Mycanvas').height)
			
	}	
	
	if (key.keyCode == 13) {
		
		sendPacket2("addChat", { id: _.userName, text: chatBar.text } )
		chatBar.text = ""			
		
	}
	
}

function lobbyClick() {
	
	var lobby = _.currentMode
	
	var gamesList = lobby.gamesList
	var joinGame = lobby.joinGame
	var createGame = lobby.createGame
	var chatRoom = lobby.chatRoom
	var chatBar = lobby.chatBar	
	
	// determine where in the gamesList user clicks
	var x = Math.floor(Mouse.x) - gamesList.x
	var y = Math.floor(Mouse.y) - gamesList.y 
	
	if (gamesList.contains(Mouse)) {		
		
		// alert(Mouse.x + ", " + Mouse.y + ", " + gamesList.scrollbarUp.x + ", " + gamesList.scrollbarUp.y)
		
		gamesList.selectRow(x, y)
		
		if (gamesList.scrollbarUp.Contains(Mouse)) {
			
			alert(" scroll up")
					
			if (gamesList.scrollRow != 0) {
				
				gamesList.scrollRow--
				
			}
		
		} else if (gamesList.scrollbarDown.Contains(Mouse)) {
			
			alert("scroll down")
		
			if (gamesList.scrollRow < gamesList.textRows - gamesList.maxRows) {
				
				gamesList.scrollRow++
				
			}
		
		}
		
	} else if (chatRoom.scrollbarUp.Contains(Mouse)) {
		
		if (chatRoom.scrollRow != 0) {
			
			chatRoom.scrollRow--
			
		}
		
	} else if (chatRoom.scrollbarDown.Contains(Mouse)) {
		
		if (chatRoom.scrollRow < chatRoom.textRows - chatRoom.maxRows) {
			
			chatRoom.scrollRow++
			
		}	
		
	} 
	
	if (chatBar.containsClick()) {
		
		chatBar.active = true
		
	} else {
		
		chatBar.active = false
		
	}
	
	if (Mouse.x >= joinGame.x && Mouse.x <= joinGame.x + joinGame.width && Mouse.y >= joinGame.y && Mouse.y <= joinGame.y + joinGame.height) {
		
		gamesList.getSelectionData()	
		
	}
	
	// create game
	if (createGame.Contains(Mouse)) {
		
		createGame.clickfxn();	
		
	}
}

function login() {

	this.id = "login"	

	this.canvas = document.getElementById('Mycanvas')
    this.context = this.canvas.getContext('2d')
	
	menuWidth = Math.floor(this.canvas.width * 0.3)
	menuHeight = Math.floor(this.canvas.height * 0.3)
	
	menuX = Math.floor(this.canvas.width / 2 - (menuWidth / 2))
	menuY = Math.floor(this.canvas.height / 2 - (menuHeight / 2))
	
	this.loginMenu = { img: Images[100], x: menuX, y: menuY, width: menuWidth, height: menuHeight }
	this.loginButton = new Rectangle(menuX + menuWidth * 0.3, menuY + menuHeight * 0.7, menuWidth * 0.4, menuHeight * 0.2)
	
	this.loginInput = new inputBox(menuX + menuX * 0.12, menuY + menuHeight * 0.27, menuWidth * 0.7, menuHeight * 0.15)
	this.loginInput.transparent = true
	this.loginInput.setFontSize(Math.floor(this.loginInput.height * 0.5))
	
}

login.prototype.draw = function() {
	
	loginMenu = this.loginMenu
	loginButton = this.loginButton
	loginInput = this.loginInput
	
	this.context.drawImage(loginMenu.img, loginMenu.x, loginMenu.y, loginMenu.width, loginMenu.height)	
	this.context.drawImage(Images[101], loginButton.x, loginButton.y, loginButton.width, loginButton.height)
	loginInput.draw()	
	
}

function loginClick() {

	var login = _.currentMode	
	var input = login.loginInput
	
	if (input.containsClick()) {
		
		input.active = true
			
	} else {
		
		input.active = false
		
	}	
	
}

function loginKeydown(e) {

	var login = _.currentMode
	var input = login.loginInput
	
	if (input.active) {	
	
		if (e.keyCode == 8) {
			
			e.preventDefault()
			input.text = input.text.substring(0, input.text.length - 1)
			
		} else if (e.keyCode >= 96 && e.keyCode <= 105) {
			
			input.text = input.text + String.fromCharCode(e.keyCode - 48)	
				
		} else if (shiftKey && e.keyCode >= 48 && e.keyCode <= 57) {
			
			// do nothing
			
		} else if (shiftKey) {
			
			input.text = input.text + String.fromCharCode(e.keyCode)
			
		} else if (!shiftKey) {
	
			input.text = input.text + String.fromCharCode(e.keyCode).toLowerCase()
			
		}
	
	}
	
}

function loginEnter() {

	var login = _.currentMode
	var input = login.loginInput
	
	if (login.loginButton.Contains(Mouse)) {
		
		if 	(input.text != "") {
					
			localStorage.epochLogin = input.text
			_.userName = localStorage.epochLogin
			sendPacket2("loginRequest", _.userName)
			
			_.currentMode = new CreateMenus(document.getElementById('Mycanvas').width, document.getElementById('Mycanvas').height)		
			
		} else {
			
			alert("Please enter a login name")
			
		}
		
	}
	
}

