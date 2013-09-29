var CurrentSelectedGrid; //make this private?
var CurrentTarget;
var Ui;
var PlacementStage = true;
var combatLog = new Array();
var ability
var gridSpotList;

//initialize board requirements
function Board(userPicks)
{
	this.id = "game";
	
	this.unitMoves = 3;
	this.unitsMovedThisTurn = new Array();
	
	var cg;
	this.BoardX = 0;
	this.BoardY = 0;
	cg = CreateGrid();
	this.gameType = "normal";
	if (userPicks == "sandbox") { this.gameType = "sandbox"; }
	
	Ui = new Ui(userPicks);
  
	ability = new ability(); //initialize abilities
	
	this.AllyUnits = new Array();
	this.EnemyUnits = new Array();
	
	this.tileModifierList = new Array();
	
	combatLog.push("Game Board was created.");
	Screen = "GameBoard";
	
	if (this.gameType == "normal") { this.waiting = true; } else { this.waiting = false; }	// used when waiting for other player
	 
	this.spawnZones("on");
	//Select first unit
	if (this.gameType == "normal") {
			
		for (var i = 0; i < Ui.unitPicks.length / 2; i++) {
			var nextUnit;
			if (Ui.unitPicks[i].customValue[0] != null) { nextUnit = Ui.unitPicks[i]; break; } 
		}
			
		if (nextUnit != null) { Ui.SelectedUnit = nextUnit; Ui.SelectedUnit.clicked = true; }
	}

}
	  
Board.prototype.spawnZones = function(toggle) {
	
	if (this.gameType == "normal") {
	var x = 0; var y = 0; for (var i = 0; i < GridSpot[0].length * GridSpot.length; i++) {
	
	if (_.host && (y == 0 || y == 1)) { 
		if (toggle == "on") { GridSpot[x][y].spawnMarker = true; } else if (toggle == "off") { GridSpot[x][y].spawnMarker = false; }
	} else if (!_.host && (y == GridSpot[0].length - 1 || y == GridSpot[0].length - 2)) {  
		if (toggle == "on") { GridSpot[x][y].spawnMarker = true; } else if (toggle == "off") { GridSpot[x][y].spawnMarker = false; }
	}
	
	x++; if (x == GridSpot.length) { x = 0; y++;} } }			  

}


	  
//Handle Clicks
Board.prototype.ClickGrid = function(Mouse, WhichClick)
{
	if (WhichClick == "2") { ability.removeMarkers(); Ui.abilityClickOff(); } //Ability stuff
	//Turn off Selection
	if (WhichClick == "0" && CurrentSelectedGrid != null) { CurrentSelectedGrid.Select("off"); Ui.currentStats = null; } // unless casting ability
	CurrentTarget = null;
	
	//Unit Placement
	if (PlacementStage == true) {this.UnitPlacement(Mouse, WhichClick); }
	
	//Turn On Selection
	if (WhichClick == "0" && this.WhichGrid(Mouse, WhichClick) == true && ability.castMode == false)
	{ 
	CurrentSelectedGrid.Select("on"); 
	if (CurrentSelectedGrid.currentUnit != null && CurrentSelectedGrid.allyVision.length > 0) { 
	Ui.currentStats = CurrentSelectedGrid.currentUnit.baseStats;
	Ui.currentUnit = CurrentSelectedGrid.currentUnit; Ui.setTooltips();
	}
	}
	
	if (ClientsTurn == true && ability.castMode == false) {
	//Unit Actions
	if (PlacementStage == false) { this.WhichGrid(Mouse, WhichClick); this.UnitActions(Mouse, WhichClick); } 
	}
	
	// Unit abilities
	if (ClientsTurn == true && ability.castMode == true) {
		
		if (PlacementStage == false) { 
			this.WhichGrid(Mouse, WhichClick); 
			Ui.useAbility("game", CurrentSelectedGrid);			// take out of UI's hands if possible, move to ability??
		}
		
		CurrentSelectedGrid = GridSpot[ability.sourceUnit.x][ability.sourceUnit.y]
		CurrentSelectedGrid.Select("on")
		Ui.currentStats = ability.sourceUnit.baseStats;
		Ui.currentUnit = ability.sourceUnit;
	}
	
	if (CurrentSelectedGrid != null && CurrentSelectedGrid.selected == false) { ability.removeMarkers(); Ui.abilityClickOff(); } //Ability stuff  
}

	  	  //Used by ClickGridfunction to determine which grid is clicked
	Board.prototype.WhichGrid = function(Mouse, WhichClick)
	{
	  var x = 0;
	  var y = 0;
	  for (var i = 0; i < GridSpot.length * GridSpot[0].length;i++)
		{
		if (GridSpot[x][y].Clicked(Mouse) == true)
		{
			if (WhichClick == "0") {
				var lastSelected = CurrentSelectedGrid;
				CurrentSelectedGrid = GridSpot[x][y];
			}
			
			if (WhichClick == "2") { CurrentTarget = GridSpot[x][y]; }
			return true;
		}
		x++;
		if (x == GridSpot.length)
		{
		y++;
		x = 0;
		}
	    }
		return false;
	}
	  
	  
	   Board.prototype.UnitActions = function(Mouse, WhichClick)
	  {
	  
	     var instructions;
		 		 
		if (WhichClick == "2") {
	
		//Movement Action
		if (CurrentSelectedGrid != null && CurrentTarget != null && CurrentTarget.moveMarker == true && CurrentTarget.currentUnit == null)
		{ 
			if (this.unitsMovedThisTurn.length < this.unitMoves || listContains(this.unitsMovedThisTurn, CurrentSelectedGrid.currentUnit) == true || CurrentSelectedGrid.currentUnit.turnCost == false) {
			instructions = new Array("move", CurrentSelectedGrid.x, CurrentSelectedGrid.y, CurrentTarget.x, CurrentTarget.y); this.sendUnitInstruction(instructions);
		
		CurrentSelectedGrid.currentUnit.Move(CurrentTarget); CurrentSelectedGrid.Select("off");
     		CurrentSelectedGrid = CurrentTarget; CurrentSelectedGrid.Select("on"); 
			//send instructions
			
			return; }
			
			}
		
		//Attack Action		
		if (CurrentSelectedGrid != null && CurrentTarget != null && CurrentTarget.currentUnit != null && CurrentSelectedGrid.currentUnit != null && CurrentSelectedGrid != CurrentTarget
			&& CurrentTarget.attackMarker == true && CurrentSelectedGrid.currentUnit.alliance == "ally")
		{
			if (this.unitsMovedThisTurn.length < this.unitMoves || listContains(this.unitsMovedThisTurn, CurrentSelectedGrid.currentUnit) == true || CurrentSelectedGrid.currentUnit.turnCost == false) {
			instructions = new Array("attack", CurrentSelectedGrid.x, CurrentSelectedGrid.y, CurrentTarget.x, CurrentTarget.y); this.sendUnitInstruction(instructions);
			
			CurrentSelectedGrid.currentUnit.Attack(CurrentTarget); CurrentSelectedGrid.Select("off");
    		CurrentTarget = null;
           CurrentSelectedGrid.Select("on");
		   //send instructions
		    
			return; }
			}
		}
		
		
		
		  
	  }
	  
	  
	  //Send unit Actions
	   Board.prototype.sendUnitInstruction = function(sendData)
	  {
		//Instructions 0 = Action(-1 Value == null)
		//      	   1 = source.x, 2 = source.y,
		//			   3 = target.x, 4 = target.y,
	    //             5 = ?Ability,
		// 			   6 = target2.x, 7 = target2.y;
		//var instructions = new Array(Action, sourcex, sourcey, targetx, targety, Ability, target2x, target2y);
		if (this.gameType == "normal") {
		sendPacket2("unitAction", sendData); }
	  }
	  
	  //Removes unit from lists
	  Board.prototype.removeUnitFromList = function(unit)
	  {
		if (listContains(this.AllyUnits, unit) == true)
		{
			var arrayNum = listReturnArray(this.AllyUnits, unit);
			this.AllyUnits.splice(arrayNum, 1); 
		}
		if (listContains(this.EnemyUnits, unit) == true)
		{
			var arrayNum = listReturnArray(this.EnemyUnits, unit);
			this.EnemyUnits.splice(arrayNum, 1); 
		}
	  }
	  
	  //Receive action instructions
	   Board.prototype.receiveAction = function(Instructions)
	  {
		//Instructions 0 = Action(-1 Value == null)
		//      	   1 = source.x, 2 = source.y,
		//			   3 = target.x, 4 = target.y,
	    //             5 = ?Ability,
		// 			   6 = target2.x, 7 = target2.y;
		var action = Instructions[0];
		switch(action){
			case "move":
			GridSpot[Instructions[1]][Instructions[2]].currentUnit.Move(GridSpot[Instructions[3]][Instructions[4]]);
			break;
			
			case "attack":
			GridSpot[Instructions[1]][Instructions[2]].currentUnit.Attack(GridSpot[Instructions[3]][Instructions[4]]); 
			break;
			
			case "end":
			for (var i = 0; i < this.AllyUnits.length; i++) { var theSame = this.AllyUnits[i]; this.AllyUnits[i].turnFunction(); 
			if (theSame != this.tileModifierList[i]) { i--; } }
			
			for (var i = 0; i < this.tileModifierList.length; i++) { var theSame = this.tileModifierList[i]; this.tileModifierList[i].turnRefresh("ally"); 
			if (theSame != this.tileModifierList[i]) { i--; } } //fixing index error
			ClientsTurn = true; combatLog.push("Turn End.");
			break;
			
			case "ability":
			ability.receiveAbility(Instructions);
			break;
		}
	  }
	  
	  
	  //CreateUnit
	  Board.prototype.CreateUnit = function(Alliance, Name, x, y, value1, value2)
	  {
		if (Alliance == "ally") { 
			this.AllyUnits.push(new Unit(Alliance, Name, x, y, value1, value2)); 
			return this.AllyUnits[this.AllyUnits.length - 1];
		} else {
			this.EnemyUnits.push(new Unit(Alliance, Name, x, y, value1, value2));
			return this.EnemyUnits[this.EnemyUnits.length - 1];
		}
		
		var CreateUnitArray = new Array(Alliance, Name, x, y, value1, value2);		
		
	  }
	  
	  
	  //Receive create information (Alliance is already switched)
	  Board.prototype.ReceiveCreate = function(createArray)
	  {
		var alliance;
		if (createArray[0] == "ally") { alliance = "enemy"; }
		if (createArray[0] == "enemy") { alliance = "ally"; }
		
		if (alliance == "ally") { this.AllyUnits.push(new Unit(alliance, createArray[1], createArray[2], createArray[3], createArray[4], createArray[5])); }
		if (alliance == "enemy") { this.EnemyUnits.push(new Unit(alliance, createArray[1], createArray[2], createArray[3], createArray[4], createArray[5])); }
	  }
	  
	  
	  //Receive gridpiece to remove unit from
	   Board.prototype.ReceiveRemove = function(removeArray)
	  {
		var Target = GridSpot[removeArray[0]][removeArray[1]];
		Target.currentUnit.Delete();
	  }
	  
	  
	  //Handle Key press
	  Board.prototype.Key = function(KeyChar)
	  {
	  // 37  left, up 38, down 40, right 39
		if (KeyChar == "37") { if (this.BoardX < 400) {this.BoardX += 20; this.UpdateBoardPosition(); }} 
		if (KeyChar == "39") { if (this.BoardX > -400) {this.BoardX -= 20; this.UpdateBoardPosition(); }} 
		if (KeyChar == "40") { if (this.BoardY > -400) {this.BoardY -= 20; this.UpdateBoardPosition(); }}
		if (KeyChar == "38") { if (this.BoardY < 400) {this.BoardY += 20; this.UpdateBoardPosition(); }}
	  }
	
	
	  //Handle Board screen scrolling
	  Board.prototype.UpdateBoardPosition = function()
	  {
	  var x = 0;
	  var y = 0;
	  for (var i = 0; i < GridSpot.length * GridSpot[0].length;i++)
		{
		GridSpot[x][y].UpdatePosition(this.BoardX, this.BoardY, 0, 0);
		x++;
		if (x == GridSpot.length)
			{
			y++;
			x = 0;
			}
		}
	  }
	 
	  

		
		
	  //Draw board
	  Board.prototype.Draw = function(context, canvas)
	  {
	    context.fillStyle = "rgba(0, 0, 0, 0.5)";
		context.globalAlpha = 0.5;
		context.drawImage(Images[2], 0, 0, canvas.width, canvas.height);
		context.globalAlpha = 1;
		context.fillStyle = "rgba(48, 48, 48, 0.8)";
		context.fillRect(StartX - 20 + this.BoardX, StartY - 15 + this.BoardY, EndX, EndY);
		var x = 0; var y = 0; 
		for (var i = 0; i < GridSpot.length * GridSpot[0].length; i++)
		{ 
			GridSpot[x][y].Draw(context, canvas);
			x++; 
			if (x == GridSpot.length) 
			{ y++; x = 0; } 
		}
		
		for (var i = 0; i < this.tileModifierList.length; i++) {
		this.tileModifierList[i].draw(context, canvas); }
		
		context.font = globalFont;
			Ui.Draw(context, canvas); 
		
		context.font = globalFont;
		
		// Draw waiting box		
		if (this.waiting) {
				
				var waitingRect = new Rectangle(0, 0, canvas.width, canvas.height)
				waitingRect.boxColor = "#333"
				waitingRect.setText("Waiting for another player to finish picks", "White", canvas.width * 0.3, canvas.height * 0.55)
				waitingRect.draw()
				
		}
		
		
	  }
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  Board.prototype.UnitPlacement = function(Mouse, WhichClick)
	  {
	  if (WhichClick == "2" && this.WhichGrid(Mouse, WhichClick) == true) 
		{
			//Removing Units
			if (this.gameType == "normal") //Real game
			{
				if (Ui.unitPicks != null && CurrentTarget != null && CurrentTarget.currentUnit != null) {
				var targetCustomValue0 = CurrentTarget.currentUnit.element;
				var targetCustomValue1 = CurrentTarget.currentUnit.value;
				for (var i = 0; i < Ui.unitPicks.length; i++)
				{
				  if (Ui.unitPicks[i].customValue[0] == null && CurrentTarget.currentUnit.alliance == "ally")
				  {
					Ui.unitPicks[i].customValue[0] = targetCustomValue0;
					Ui.unitPicks[i].customValue[1] = targetCustomValue1;
					
					
					var RemoveUnitArray = new Array();
					RemoveUnitArray[0] = CurrentTarget.x;
					RemoveUnitArray[1] = CurrentTarget.y;
					var newAlliance;
					 if (CurrentTarget.currentUnit.alliance == "ally") { newAlliance = "enemy";}
					 if (CurrentTarget.currentUnit.alliance == "enemy") { newAlliance = "ally";}  
					RemoveUnitArray[2] = newAlliance;
					
					//senddata
					if (this.gameType == "normal") {
					sendPacket2("removeBoardUnit", RemoveUnitArray); }

					CurrentTarget.currentUnit.Delete();
					if (this.gameType == "normal") { CurrentTarget.spawnMarker = true; }
					
					//reselect a unit on ui
					for (var i = 0; i < Ui.unitPicks.length / 2; i++) {
							var nextUnit;
							if (Ui.unitPicks[i].customValue[0] != null) { nextUnit = Ui.unitPicks[i]; break; } 
						}
					
					if (nextUnit != null) { Ui.SelectedUnit = nextUnit; Ui.SelectedUnit.clicked = true; }
					
					return;
				  } } } }
			if (this.gameType == "sandbox" && CurrentTarget.currentUnit != null) { CurrentTarget.currentUnit.Delete(); return; } //Sandbox
			
			// Placing Units
			if (Ui.SelectedUnit != null && Ui.SelectedUnit.clicked != false)
			{
				if (CurrentTarget != null && GridSpot[CurrentTarget.x][CurrentTarget.y].currentUnit == null)
				{
				//Add unit to the board
				if (Ui.unitPicks != null) {
				var name = Ui.SelectedUnit.customValue[0][Ui.SelectedUnit.customValue[1]][0];}
				
				if (Ui.unitPicks == null) { var name = Ui.SelectedUnit.customValue[0]; } //sandbox
				
				if (CurrentTarget != null && CurrentTarget.spawnMarker == true || this.gameType == "sandbox")
					{
				//send data
				var CreateUnitArray = new Array("ally", name, CurrentTarget.x, CurrentTarget.y, Ui.SelectedUnit.customValue[0], Ui.SelectedUnit.customValue[1]);
				if (this.gameType == "normal") { sendPacket2("createUnit", CreateUnitArray); }
				
				this.CreateUnit("ally", name, CurrentTarget.x, CurrentTarget.y, Ui.SelectedUnit.customValue[0], Ui.SelectedUnit.customValue[1]);
				
				if (Ui.unitPicks != null) { //game mode
					Ui.SelectedUnit.customValue[0] = null; 
					Ui.SelectedUnit.clicked = false; Ui.SelectedUnit = null; 
						for (var i = 0; i < Ui.unitPicks.length / 2; i++) {
							var nextUnit;
							if (Ui.unitPicks[i].customValue[0] != null) { nextUnit = Ui.unitPicks[i]; break; } 
						}
					
					if (nextUnit != null) { Ui.SelectedUnit = nextUnit; Ui.SelectedUnit.clicked = true; }
				}
				
				if (this.gameType == "normal") { CurrentTarget.spawnMarker = false; }
				
				if (CurrentSelectedGrid != undefined || CurrentSelectedGrid != null){
				CurrentSelectedGrid.Select("off");}
					}
				}
				return;
			}
		}
		}
	  
  