var CurrentSelectedGrid; //make this private?
var CurrentTarget;
var timer;
var PlacementStage = true;
var combatLog = new Array();

var gridSpotList;

//initialize board reqthis.Uirements
function Board(userPicks, allyPicks, enemyPicks)
{
	this.allyPicks = allyPicks;
	this.enemyPicks = enemyPicks;
	
	this.alliance = "ally"; //using this for sandbox...
	this.observer = false;
	this.sec = 0;
	this.min = 0;
	this.hour = 0;
	
	timerReset = { min: 1, sec: 10 };
	
	this.turnTimer = { toggle: true, min: timerReset.min, sec: timerReset.sec };
	
	if (timer == null) { timer = setInterval( function(){ GameBoard.stopwatch() }, 1000); }
	
	this.id = "game";
	
	this.unitCount = 0; 	// used to set unit id's
	
	this.unitMoves = 3;
	this.unitsMovedThisTurn = new Array();
	
	var cg;
	this.BoardX = 0;
	this.BoardY = 0;
	cg = CreateGrid();
	this.gameType = "normal";
	if (userPicks == "sandbox") { this.gameType = "sandbox"; this.observer = true; this.BoardY += 120; this.UpdateBoardPosition();}
	
	this.Ui = new Ui(userPicks, allyPicks, enemyPicks);
 
	
	this.AllyUnits = new Array();
	this.EnemyUnits = new Array();
	
	this.tileModifierList = new Array();
	this.auraList = [];
	
	combatLog.push("Game Board was created.");
	Screen = "GameBoard";
	
	if (this.gameType == "normal") { this.waiting = true; } else { this.waiting = false; }	// used when waiting for other player
	 
	this.spawnZones("on");
	//Select first unit
	if (this.gameType == "normal") {
			
		for (var i = 0; i < this.Ui.unitPicks.length / 2; i++) {
			var nextUnit;
			if (this.Ui.unitPicks[i].customValue[0] != null) { nextUnit = this.Ui.unitPicks[i]; break; } 
		}
			
		if (nextUnit != null) { this.Ui.SelectedUnit = nextUnit; this.Ui.SelectedUnit.clicked = true; }
	}

}


Board.prototype.stopwatch = function() {
   this.sec++;
  if (this.sec == 60) {
   this.sec = 0;
   this.min = this.min + 1; }
   
  if (this.min == 60) {
   this.min = 0;
   this.hour += 1; }
   
   if (this.turnTimer.toggle == true && ClientsTurn == true) {
		
		if (this.turnTimer.sec == 0) {
		
			if (this.turnTimer.min > 0) {
				this.turnTimer.min--; this.turnTimer.sec = 59;
			} 
			else { this.Ui.endTurn(); }
		} else { this.turnTimer.sec--; }
   }
}
Board.prototype.timerReset = function() {

this.turnTimer.min = timerReset.min;
this.turnTimer.sec = timerReset.sec; 
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
	if (WhichClick == "2") {
		ability.removeMarkers(); this.Ui.abilityClickOff(); 
		if (CurrentSelectedGrid != null) { CurrentSelectedGrid.Select("on"); }
	} 
	//Ability stuff
	//Turn off Selection
	if (WhichClick == "0" && CurrentSelectedGrid != null) { 
	
		CurrentSelectedGrid.Select("off");
		if (ability.castMode == false){  this.Ui.purge(); }
	
	} // unless casting ability
	
	
	CurrentTarget = null;
	
	//Unit Placement
	if (PlacementStage == true) {this.UnitPlacement(Mouse, WhichClick); }
	
	//Turn On Selection
	if (WhichClick == "0" && this.WhichGrid(Mouse, WhichClick) == true && ability.castMode == false) {
		
		CurrentSelectedGrid.Select("on"); 
		if (CurrentSelectedGrid.currentUnit != null && (CurrentSelectedGrid.allyVision.length > 0 || this.observer == true)) {
		
			if (CurrentSelectedGrid.currentUnit.alliance == "ally" || CurrentSelectedGrid.currentUnit.unitStealth == false) {
			
				this.Ui.currentStats = CurrentSelectedGrid.currentUnit.baseStats;
				this.Ui.currentUnit = CurrentSelectedGrid.currentUnit; this.Ui.setTooltips();
			}
		} //else { this.Ui.purge; }
		
	}
	
	if (ClientsTurn == true && ability.castMode == false) {
	//Unit Actions
	if (PlacementStage == false) { this.WhichGrid(Mouse, WhichClick); this.UnitActions(Mouse, WhichClick); } 
	}
	
	// Unit abilities
	if (ClientsTurn == true && ability.castMode == true && this.gridClick()) {
		
		if (PlacementStage == false) { 
			this.WhichGrid(Mouse, WhichClick); 
			this.Ui.useAbility("game", CurrentSelectedGrid);			// take out of this.Ui's hands if possible, move to ability??
		}
		
		CurrentSelectedGrid = GridSpot[ability.sourceUnit.x][ability.sourceUnit.y]
		CurrentSelectedGrid.Select("on")
		this.Ui.currentStats = ability.sourceUnit.baseStats;
		this.Ui.currentUnit = ability.sourceUnit;
	} else {
	
	if (CurrentSelectedGrid != null && CurrentSelectedGrid.selected == false) { ability.removeMarkers(); this.Ui.abilityClickOff(); } //Ability stuff  
	if (CurrentSelectedGrid != null && CurrentSelectedGrid.currentUnit != null) { CurrentSelectedGrid.Select("on"); }
	}
	
	if (WhichClick == "2") {
	
		if (CurrentSelectedGrid != null) { CurrentSelectedGrid.Select("on"); }
	} 
	
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
		if (CurrentSelectedGrid != null && CurrentTarget != null && CurrentTarget.moveMarker == true && CurrentTarget.currentUnit == null) {
			if (this.unitsMovedThisTurn.length < this.unitMoves || listContains(this.unitsMovedThisTurn, CurrentSelectedGrid.currentUnit) == true || CurrentSelectedGrid.currentUnit.turnCost == false) {
			instructions = new Array("move", CurrentSelectedGrid.x, CurrentSelectedGrid.y, CurrentTarget.x, CurrentTarget.y); this.sendUnitInstruction(instructions);
		
		CurrentSelectedGrid.currentUnit.Move(CurrentTarget); CurrentSelectedGrid.Select("off");
     		CurrentSelectedGrid = CurrentTarget; CurrentSelectedGrid.Select("on"); 
			//send instructions
			
			return; }
		
		//if target is not null... reveal tile until end of turn.
		} else { 
		if (CurrentTarget.moveMarker == true && CurrentTarget.currentUnit != null && listContains(CurrentTarget.allyVision, CurrentSelectedGrid.currentUnit) == false)
		{
			
			CurrentSelectedGrid.currentUnit.currentStats[4] -= CurrentSelectedGrid.currentUnit.movementCost;
			CurrentTarget.allyVision.push(CurrentSelectedGrid.currentUnit);
			CurrentSelectedGrid.select("off");
			CurrentSelectedGrid.select("on");
		} }
		
		//Attack Action		
		if (CurrentSelectedGrid != null && CurrentTarget != null && CurrentTarget.currentUnit != null && CurrentSelectedGrid.currentUnit != null && CurrentSelectedGrid != CurrentTarget
			&& (CurrentTarget.attackMarker == true && CurrentTarget.currentUnit.unitStealth != true) && CurrentSelectedGrid.currentUnit.alliance == "ally")
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
		sendPacket2("unitAction", sendData); 
		if (sendData == "end") { console.warn("Turn End"); }
		}
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
			 if (theSame != this.AllyUnits[i]) { i--; }  }
			
			for (var i = 0; i < this.tileModifierList.length; i++) { var theSame = this.tileModifierList[i]; this.tileModifierList[i].turnRefresh("ally"); 
			if (theSame != this.tileModifierList[i]) { i--; } } //fixing index error
			
			for (var i = 0; i < GameBoard.auraList.length; i++) { 
				if (GameBoard.auraList[i].sourceUnit.alliance == "ally") {
					GameBoard.auraList[i].turn(); 
				}
			}
			
			console.warn("Turn End");
			ClientsTurn = true; combatLog.push("Turn End");
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
			this.AllyUnits.push(new Unit(Alliance, Name, x, y, value1, this.unitCount));
			this.unitCount++; 
			return this.AllyUnits[this.AllyUnits.length - 1];
		} else {
			this.EnemyUnits.push(new Unit(Alliance, Name, x, y, value1, value2));
			this.unitCount++;
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
			this.Ui.Draw(context, canvas); 
		
		context.font = globalFont;
		
		for (var i = 0; i < this.AllyUnits.length; i++) { this.AllyUnits[i].draw(); }
		
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
				if (this.Ui.unitPicks != null && CurrentTarget != null && CurrentTarget.currentUnit != null) {
				var targetCustomValue0 = CurrentTarget.currentUnit.element;
				var targetCustomValue1 = CurrentTarget.currentUnit.value;
				for (var i = 0; i < this.Ui.unitPicks.length; i++)
				{
				  if (this.Ui.unitPicks[i].customValue[0] == null && CurrentTarget.currentUnit.alliance == "ally")
				  {
					this.Ui.unitPicks[i].customValue[0] = targetCustomValue0;
					this.Ui.unitPicks[i].customValue[1] = targetCustomValue1;
					
					
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
					
					//reselect a unit on this.Ui
					for (var i = 0; i < this.Ui.unitPicks.length / 2; i++) {
							var nextUnit;
							if (this.Ui.unitPicks[i].customValue[0] != null) { nextUnit = this.Ui.unitPicks[i]; break; } 
						}
					
					if (nextUnit != null) { this.Ui.SelectedUnit = nextUnit; this.Ui.SelectedUnit.clicked = true; }
					
					return;
				  } } } }
			if (this.gameType == "sandbox" && CurrentTarget.currentUnit != null) { CurrentTarget.currentUnit.Delete(); return; } //Sandbox
			
			// Placing Units
			if (this.Ui.SelectedUnit != null && this.Ui.SelectedUnit.clicked != false)
			{
				if (CurrentTarget != null && GridSpot[CurrentTarget.x][CurrentTarget.y].currentUnit == null)
				{
				//Add unit to the board
				
				var name;
				if (this.Ui.unitPicks != null) {
					if (this.Ui.SelectedUnit.customValue[0] != 0) {
						name = this.Ui.SelectedUnit.customValue[0][this.Ui.SelectedUnit.customValue[1]][0]; 
					} else { // general
						name = this.Ui.SelectedUnit.object.name;
					}
				}
				
				if (this.Ui.unitPicks == null) { name = this.Ui.SelectedUnit.customValue[0]; } //sandbox
				
				if (CurrentTarget != null && CurrentTarget.spawnMarker == true || this.gameType == "sandbox") { //send data
					if (this.Ui.SelectedUnit.customValue[0] != 0) {
					var CreateUnitArray = new Array("ally", name, CurrentTarget.x, CurrentTarget.y, this.Ui.SelectedUnit.customValue[0], this.Ui.SelectedUnit.customValue[1]); 
					
					} else { // general				
						
						var CreateUnitArray = new Array("ally", name, CurrentTarget.x, CurrentTarget.y);
						
					}
										
					if (this.gameType == "normal") { sendPacket("createUnit", CreateUnitArray); 
				}
				
				if (this.Ui.SelectedUnit.customValue[0] != 0) {
				this.CreateUnit(this.alliance, name, CurrentTarget.x, CurrentTarget.y, this.Ui.SelectedUnit.customValue[0], this.Ui.SelectedUnit.customValue[1]); 
				} else { // general
					this.CreateUnit(this.alliance, name, CurrentTarget.x, CurrentTarget.y);
				}
				
				if (this.Ui.unitPicks != null) { //game mode
					this.Ui.SelectedUnit.customValue[0] = null; 
					this.Ui.SelectedUnit.clicked = false; this.Ui.SelectedUnit = null; 
						for (var i = 0; i < this.Ui.unitPicks.length / 2; i++) {
							var nextUnit;
							if (this.Ui.unitPicks[i].customValue[0] != null) { 
								if (i == 9) { i = 18; }	// all units picked, switch to general
								nextUnit = this.Ui.unitPicks[i];
								if (nextUnit.customValue[0] == null) { nextUnit = null; }
								break; } 
						}
					
					if (nextUnit != null) { this.Ui.SelectedUnit = nextUnit; this.Ui.SelectedUnit.clicked = true; }
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
		
Board.prototype.AreaSelect = function(CentreGrid, Radius)
	  {
			var x = 0; 
			var y = 0;
            var row = 1;
            var howmanyleft = 0;
            var push = 0;
			
			var gridList = [];		// holds the gridList to return
			
            {
                if (CentreGrid.y % 2 == 0)
                {
                    for (var i = 0; i < (Radius * ((Radius * 2 + 1) + Radius)) / 2; i++)
                    {
                        if (i == 0)
                        {
                            howmanyleft = Radius;
                            if (row != 1) { howmanyleft += 2; }
                        }
                        x = CentreGrid.x + howmanyleft - (Math.floor(Radius / 2) + 1) - push;

                        y = CentreGrid.y - Radius + row - 1;

                        if (Radius % 2 == 0 && y % 2 == 0) { x++; }

                        if (x >= 0 && x < GridSpot.length &&
                             y >= 0 && y < GridSpot[0].length)
                        {

                               gridList.push(GridSpot[x][y])

                        }
                        howmanyleft--;
                        if (howmanyleft == -1)
                        {

                            howmanyleft = Radius;
                            howmanyleft += row;
                            row++;
                            if ((row - 1) % 2 == 0 && row != 1) { push++; }
                        }
                    }
                }
                row = 1;
                howmanyleft = 0;
                push = 0;
                if (CentreGrid.y % 2 == 0)
                {
                    for (var i = 0; i < (Radius * ((Radius * 2 + 1) + Radius)) / 2; i++)
                    {
                        if (i == 0)
                        {
                            howmanyleft = Radius;
                            if (row != 1) { howmanyleft += 2; }

                        }
                        x = CentreGrid.x + howmanyleft - (Math.floor(Radius / 2) + 1) - push;

                        y = CentreGrid.y + Radius - row + 1;
                        if (Radius % 2 == 0 && y % 2 == 0) { x++; }

                        if (x >= 0 && x < GridSpot.length &&
                             y >= 0 && y < GridSpot[0].length)
                        {



                               gridList.push(GridSpot[x][y]);


                        }
                        howmanyleft--;
                        if (howmanyleft == -1)
                        {

                            howmanyleft = Radius;
                            howmanyleft += row;
                            row++;
                            if ((row - 1) % 2 == 0 && row != 1) { push++; }
                        }
                    }
                }


                for (var i = 0; i < Radius + 1; i++)
                {
                    x = CentreGrid.x + i;
                    y = CentreGrid.y;
                    if (x >= 0 && x < GridSpot.length &&
                         y >= 0 && y < GridSpot[0].length)
                    {
                           gridList.push(GridSpot[x][y]);
                    }
                }
                for (var i = 0; i < Radius + 1; i++)
                {
                    x = CentreGrid.x - i;
                    y = CentreGrid.y;
                    if (x >= 0 && x < GridSpot.length &&
                         y >= 0 && y < GridSpot[0].length)
                    {
                             if (x != CentreGrid.x) { gridList.push(GridSpot[x][y]); }
                    }
                }



                row = 1;
                howmanyleft = 0;
                push = 0;
                if (CentreGrid.y % 2 != 0)
                {
                    for (var i = 0; i < (Radius * ((Radius * 2 + 1) + Radius)) / 2; i++)
                    {
                        if (i == 0)
                        {
                            howmanyleft = Radius;
                            if (row != 1) { howmanyleft += 2; }
                        }
                        x = CentreGrid.x + howmanyleft - (Math.floor(Radius / 2) + 1) - push;

                        y = CentreGrid.y - Radius + row - 1;
                        if (y % 2 != 0) { x++; }
                        if (Radius % 2 != 0 && y % 2 == 0) { x++; }
                        if (Radius % 2 != 0 && y % 2 != 0) { x--; }
                        if (Radius % 2 == 0 && y % 2 == 0) { x++; }
                        if (x >= 0 && x < GridSpot.length &&
                             y >= 0 && y < GridSpot[0].length)
                        {
                               gridList.push(GridSpot[x][y]);

                        }
                        howmanyleft--;
                        if (howmanyleft == -1)
                        {

                            howmanyleft = Radius;
                            howmanyleft += row;
                            row++;
                            if ((row - 1) % 2 == 0 && row != 1) { push++; }
                        }
                    }
                }
                row = 1;
                howmanyleft = 0;
                push = 0;
                if (CentreGrid.y % 2 != 0)
                {
                    for (var i = 0; i < (Radius * ((Radius * 2 + 1) + Radius)) / 2; i++)
                    {
                        if (i == 0)
                        {
                            howmanyleft = Radius;
                            if (row != 1) { howmanyleft += 2; }

                        }
                        x = CentreGrid.x + howmanyleft - (Math.floor(Radius / 2) + 1) - push + 1;

                        y = CentreGrid.y + Radius - row + 1;
                        // if (Radius % 2 == 0 && y % 2 == 0) { x++; }
                        if (Radius % 2 != 0) { x--; }
                        if (Radius % 2 != 0 && y % 2 == 0) { x++; }

                        if (y % 2 == 0)
                        {
                            //x++;
                        }
                        if (x >= 0 && x < GridSpot.length &&
                             y >= 0 && y < GridSpot[0].length)
                        {
                               gridList.push(GridSpot[x][y]);
                        }
                        howmanyleft--;
                        if (howmanyleft == -1)
                        {

                            howmanyleft = Radius;
                            howmanyleft += row;
                            row++;
                            if ((row - 1) % 2 == 0 && row != 1) { push++; }
                        }
                    }
                }
            }
			
			return gridList;
			
}


// returns true if last click was on a grid tile, returns false if not
Board.prototype.gridClick = function() {
	
	for (var x = 0; x < GridSpot.length; x++) {
	
		for (var y = 0; y < GridSpot[x].length; y++) {
			if (GridSpot[x][y].ThisRectangle.Contains(_.mouse)) { return true; }	
		}		
		
	}
	
	return false;	
} 


// gets the current state of the board -- [ gridtiles, unitname, alliance ]
Board.prototype.saveState = function() {

	var state = [];
	
	for (var i = 0; i < this.AllyUnits.length; i++) {
		
		var currentUnit = this.AllyUnits[i]; 
		
		var gridTile = { x: currentUnit.x, y: currentUnit.y };
		var unitName = currentUnit.name;
		var unitAlliance = currentUnit.alliance;
		
		var unitObject = { grid: gridTile, name: unitName, alliance: unitAlliance };
		
		state.push(unitObject);
		
	}
	
	for (var i = 0; i < this.EnemyUnits.length; i++) {
		
		var currentUnit = this.EnemyUnits[i]; 
		
		var gridTile = { x: currentUnit.x, y: currentUnit.y };
		var unitName = currentUnit.name;
		var unitAlliance = currentUnit.alliance;
		
		var unitObject = { grid: gridTile, name: unitName, alliance: unitAlliance };
		
		state.push(unitObject);
		
	}
	
	return state;
	
}

// loads state of board from a saveState
Board.prototype.loadState = function(saveState) {
	
	for (var i = 0; i < this.AllyUnits.length; i++) { this.AllyUnits[i].Delete(); i--; }
	for (var i = 0; i < this.EnemyUnits.length; i++) { this.EnemyUnits[i].Delete(); i--; }
	
	//this.AllyUnits = [];
	//this.EnemyUnits = [];
	
	for (var i = 0; i < saveState.length; i++) {
	
		var currentUnit = saveState[i];
		
		var gridTile = currentUnit.grid;
		var unitName = currentUnit.name;
		var unitAlliance = currentUnit.alliance;
		
		this.CreateUnit(unitAlliance, unitName, gridTile.x, gridTile.y);
		
	}
	
}