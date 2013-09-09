
	  
	  
	  function Ui(pickedUnits)
	  {
		this.unitPicks = pickedUnits;
		
		this.unitUiBox = new Rectangle(Canvas.width - Canvas.width * 0.17 - Canvas.width * 0.08, 0, Canvas.width * 0.08, Canvas.height);
		
		this.finishPlacementBox = new Rectangle(Canvas.width * 0.5 - Canvas.width * 0.21, Canvas.height * 0.5 - Canvas.height * 0.04, Canvas.width * 0.21, Canvas.height * 0.04);
		this.finishTurnBox = new Rectangle(Canvas.width - Canvas.width * 0.17, 0, Canvas.width * 0.17, Canvas.height * 0.04);
		
		this.standardUiBox = new Rectangle(Canvas.width - Canvas.width * 0.17, 0, Canvas.width * 0.17, Canvas.height);
		this.SelectedUnit = this.unitUiBox;
		
		this.currentUnit;
		this.currentStats = new Array();
		this.currentAbilities = new Array();
		
		
		this.setAbilityBoxes();
		this.combatLogRectangle = new Rectangle(5 , Canvas.height - Canvas.height * 0.17, Canvas.width * 0.81, Canvas.height * 0.17)
		
		this.endTurnText = "End Turn";
		this.adjustPickedRectangles();
		
		this.abilityCastNeedsClick = false;
	  }
	  
	  Ui.prototype.setAbilityBoxes = function()
	  {
		var x = 0;
		var y = 0;
		var thiswidth = 130;
		var thisheight = 25;
		var abilitiesPerRow = 1;
		var posX = this.standardUiBox.x;
		var posY = this.unitUiBox.y + 300;
		var posSpacer = 10;
		var numberOfAbilities = 4;
		for (var i = 0; i < 4; i++)
		{
			this.currentAbilities[i] = new Rectangle(0, 0, 0, 0);
			this.currentAbilities[i].x = posX + (x * (thiswidth + posSpacer));
			this.currentAbilities[i].y = posY + (y * (thisheight + posSpacer));
			this.currentAbilities[i].width = thiswidth;
			this.currentAbilities[i].height = thisheight;
			this.currentAbilities[i].customValue[0] = "rgba(0, 0, 0, 1)";
			
			x++;
			if (x == abilitiesPerRow)
			{
				y++;
				x = 0;
			}
		}
		
		
	  }
	  
	  Ui.prototype.adjustPickedRectangles = function()
	  {
		var x = 0;
		var y = 0;
		var sizeX = this.unitPicks[0].width;
		var sizeY = this.unitPicks[0].height;
		var unitsPerRow = 1;
		var PositionX = this.unitUiBox.x + 5;
		var PositionY = this.unitUiBox.y + 5;
		var PositionSpacer = 10;
		
		for (var i = 0; i < numberOfUnits; i++)
		{
			this.unitPicks[i].x = PositionX + (x * (sizeX + PositionSpacer));
			this.unitPicks[i].y = PositionY + (y * (sizeY + PositionSpacer));
			this.unitPicks[i].width = sizeX;
			this.unitPicks[i].height = sizeY;
			
			x++;
			if (x == unitsPerRow)
			{
				y++;
				x = 0;
			}
		}
	  }
	  
	    Ui.prototype.purge = function()
	  {
	    ability.removeMarkers();
		this.abilityClickOff();
		this.currentStats = null;
		this.currentUnit = null;
	  }
	  
	  
	   Ui.prototype.useAbility = function(from, oldSpot)
	  {
	  if (this.currentUnit != null || oldSpot != null){
		 
		 //find if ability was clicked
		 
		 //Instructions 0 = Action(-1 Value == null)
		//      	   1 = source.x, 2 = source.y,
		//			   3 = target.x, 4 = target.y,
	    //             5 = ?Ability,
		// 			   6 = target2.x, 7 = target2.y;
		//var instructions = new Array(Action, sourcex, sourcey, targetx, targety, Ability, target2x, target2y);
		 switch(from)
		 {
			case "game":
			
			var castedAbility = ability.targetCast(CurrentSelectedGrid);
			if (castedAbility == true) {
			var sendData = new Array("ability", ability.sourceSpot.x, ability.sourceSpot.y, ability.targetSpot.x, ability.targetSpot.y, ability.abilityName, ability.targetSpot2.x, ability.targetSpot2.y);
		    GameBoard.sendUnitInstruction(sendData);		
			combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");} //it casted
			this.abilityClickOff(); 
			
			   
			if (castedAbility == false) { }//needs more click
			
			if (castedAbility == null) { ability.removeMarkers(); this.abilityClickOff(); }//cancel cast
			
			break;
			
			case "ui":
			ability.removeMarkers();
			this.abilityClickOff();
			this.clickedAbility;
			for (var i = 0; i < this.currentUnit.ability.length; i++) { if (this.currentAbilities[i].Contains(Mouse) == true) {  this.clickedAbility = i; break; } }
	     	if (this.clickedAbility != null)
			{
			   var clickedAbilityName = this.currentUnit.ability[this.clickedAbility];
			   
			   this.currentAbilities[this.clickedAbility].customValue[0] = "rgba(0,0,200,1)";
		       
			   var castAbility = ability.cast(clickedAbilityName, CurrentSelectedGrid); //start ability cast
			   
			   if (castAbility == null) { this.abilityCastNeedsClick = false; this.abilityClickOff(); ability.removeMarkers();} //cancel cast
			   
			   if (castAbility == true) { //if ability finished casting:  SEND INFORMATION OFF TO SERVER...
			   var sendData = new Array("ability", ability.sourceSpot.x, ability.sourceSpot.y, null, null, ability.abilityName, null, null);
			   GameBoard.sendUnitInstruction(sendData);
			   this.abilityClickOff();
			   combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ")."); } 
			   
			   if (castAbility == false) {
			   // if false, ability requires another click OR ability was not found.
			   this.abilityCastNeedsClick = true;}
			   
			   }
			break;
		    }
         }
		 else { ability.removeMarkers(); }
	  }
	  
	  
	  
	   Ui.prototype.ClickisWithin = function(Mouse)
	  {
		 for (var i = 0; i < numberOfUnits; i++)
		 {
			if (this.unitPicks[i].Contains(Mouse) == true ) 
			{ 
				if (this.unitPicks[i].customValue[0] != null)
				{
			 this.SelectedUnit = this.unitPicks[i];
			 this.SelectedUnit.clicked = true;
			return true; 
			}
			}
		 }
		 if (ClientsTurn == true && this.finishTurnBox.Contains(Mouse) == true && ClientsTurn == true)
		 {
			var endTurn = new Array();
			endTurn.push("end");
			GameBoard.sendUnitInstruction(endTurn);
			ClientsTurn = false;
			for (var i = 0; i < GameBoard.EnemyUnits.length; i++) { GameBoard.EnemyUnits[i].turnFunction(); }
			return;
		 }
		 
		 
		 
		 if (this.unitUiBox.Contains(Mouse) == true || this.standardUiBox.Contains(Mouse) == true) { if (this.standardUiBox.Contains(Mouse) == true && ClientsTurn == true) {this.useAbility("ui", null);} return true; }
	  }
	  
	   Ui.prototype.abilityClickOff = function()
	  {
	  this.abilityCastNeedsClick = false;
	  this.clickedAbility = null;

	    for (var i = 0; i < this.currentAbilities.length; i++)
		{
			this.currentAbilities[i].customValue[0] = "rgba(0, 0, 0, 1)";
		}
	  }
	  
	  
	  Ui.prototype.ReturnSelectedUnit = function()
	  {
		return this.SelectedUnit;
	  }
	  
	  Ui.prototype.Draw = function(context, canvas)
	  {
		//combatLog
		context.drawImage(Images[8], this.combatLogRectangle.x, this.combatLogRectangle.y, this.combatLogRectangle.width, this.combatLogRectangle.height);
		
		context.fillStyle = "White";
		context.font = "bold 16px Arial";
		var t = 0;
		for (var i = 0; i < combatLog.length; i++)
		{
			if (i > combatLog.length - 10) { t++;
			context.fillText(combatLog[i], this.combatLogRectangle.width * 0.02, this.combatLogRectangle.y + (t * 13) + 10); }
		}	
		//combatlog
	  
		
	  
	  
	    context.font = "bold 16px Arial";
	    context.fillStyle = "rgba(5, 10, 5, 1)";
		if (PlacementStage == true)
		{
		context.fillRect(this.unitUiBox.x, this.unitUiBox.y, this.unitUiBox.width, this.unitUiBox.height); 
		var tempBool = true;
		for (var i = 0; i < this.unitPicks.length; i++) { if (this.unitPicks[i].customValue[0] != null) { tempBool = false; }}
		}
		
		
		
		context.fillStyle = "rgba(5, 10, 5, 1)";
		context.fillRect(Canvas.width - Canvas.width * 0.17, 0, Canvas.width * 0.17, Canvas.height);
		
		//UnitStats///////////////
		if (this.currentStats != null && this.currentStats[0] != null) {
		context.fillStyle = "White";
		for (var i = 0; i < this.currentStats.length; i++)
		{
			context.fillText(this.currentStats[i], this.standardUiBox.x, this.standardUiBox.y + (i * 13) + 60);
		}
		
		for (var i = 0; i < this.currentUnit.ability.length; i++)
		{
			context.fillStyle = this.currentAbilities[i].customValue[0];
			this.currentAbilities[i].draw();
			context.fillStyle = "White";
			context.fillText(this.currentUnit.ability[i], this.currentAbilities[i].x, this.currentAbilities[i].y + 13);
		}
		
		}
		///////////////////////////////////////////////////////////////////////////
		if (PlacementStage == true) {
		for (var i = 0; i < numberOfUnits; i++)
		{
			//if unit pick doesnt exist draw rect
			if (this.unitPicks[i].customValue[0] == null){
			context.fillStyle = "rgba(0, 0, 0, 0)";
			context.fillRect(this.unitPicks[i].x, this.unitPicks[i].y, this.unitPicks[i].width, this.unitPicks[i].height);
			}
			//if unit exists, draw image
			if (this.unitPicks[i].customValue[0] != null){
			context.drawImage(Images[ReturnUnitImage(this.unitPicks[i].customValue[0][this.unitPicks[i].customValue[1]][0])], this.unitPicks[i].x, this.unitPicks[i].y, this.unitPicks[i].width, this.unitPicks[i].height);
			}
		}
		}
		context.fillStyle = "rgba(100, 0, 0, 1)";
		// if selected, draw selection
		if (this.SelectedUnit != null && this.SelectedUnit.clicked == true) {
		context.drawImage(Images[3], this.SelectedUnit.x, this.SelectedUnit.y, this.SelectedUnit.width, this.SelectedUnit.height);
		}
		
		
		
		if (PlacementStage == false || tempBool == true) //
		{ 
		context.save();
		context.font = globalFont;
		
		if (ClientsTurn == true)
		{
		context.fillStyle = "rgba(5, 200, 5, 1)";
		this.finishTurnBox.draw();
		
		context.fillStyle = 'black';
		context.fillText(this.endTurnText, centreTextX(this.endTurnText, this.finishTurnBox.x, this.finishTurnBox.width, globalFontSize), this.finishTurnBox.y + 20); 
		}
		if (tempBool == true) {
		var newText = "Click to start";
		
		context.fillStyle = "rgba(5, 200, 5, 1)";
		this.finishPlacementBox.draw();
		
		context.fillStyle = 'black';
		context.fillText(newText, centreTextX(newText, this.finishPlacementBox.x,this.finishPlacementBox.width, globalFontSize), this.finishPlacementBox.y + 20); 
		}
		context.restore();
		}
		
		
		context.font = globalFont;
		}
		
	  
