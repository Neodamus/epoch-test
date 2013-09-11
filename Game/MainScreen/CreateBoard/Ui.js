
	  
	  
	  function Ui(pickedUnits) {
	  
		this.unitPicks = pickedUnits;
		//different Board Ui's
		if (this.unitPicks == "sandbox") { this.unitPicks = null; this.sandboxUi(); }
		else { this.createPlacementUi(); }
        //Set Rectangles
		
		//finishedPlacementBox
		this.finishPlacementBox = new Rectangle(Canvas.width * 0.5 - Canvas.width * 0.21, Canvas.height * 0.5 - Canvas.height * 0.04, Canvas.width * 0.21, Canvas.height * 0.04);
		this.finishPlacementBox.boxColor = "Green";
		var text = "Finish Placement";
		this.finishPlacementBox.setText(text, "Black", centreTextX(text, this.finishPlacementBox.x, this.finishPlacementBox.width, 
		globalFontSize), centreTextY(1, this.finishPlacementBox.y, this.finishPlacementBox.height, globalFontSize));    

		//endTurnBox
		this.finishTurnBox = new Rectangle(Canvas.width - Canvas.width * 0.17, 0, Canvas.width * 0.17, Canvas.height * 0.04);
		this.finishTurnBox.boxColor = "Green";
		var text = "End Turn";
		this.finishTurnBox.setText(text, "Black", centreTextX(text, this.finishTurnBox.x, this.finishTurnBox.width, 
		globalFontSize), centreTextY(1, this.finishTurnBox.y, this.finishTurnBox.height, globalFontSize));    
		
		this.standardUiBox = new Rectangle(Canvas.width - Canvas.width * 0.17, 0, Canvas.width * 0.17, Canvas.height);
		this.standardUiBox.boxColor = "rgba(5, 10, 5, 1)";
		
		//Current selected unit on Ui
		this.SelectedUnit = this.unitUiBox;
		
		//CombatLog
		this.combatLogRectangle = new Rectangle(5 , Canvas.height - Canvas.height * 0.17, Canvas.width * 0.81, Canvas.height * 0.17)
		this.combatLogRectangle.setImage(Images[8]);
		
		//createAbilityBoxes
		this.setAbilityBoxes();
		
		//Other arrays and Bools
		this.currentUnit;
		this.currentStats = new Array();
	  }
	  
	  //Remove unitstats, selection, and ability
	  Ui.prototype.purge = function() {
	  
	    ability.removeMarkers();
		this.abilityClickOff();
		this.currentStats = null;
		this.currentUnit = null;
	  }
	  
	  //Ability was clicked
	  Ui.prototype.useAbility = function(from, oldSpot) { 
	  
	     if (this.currentUnit != null || oldSpot != null){
		 switch(from) {
		 
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
				if (this.clickedAbility != null) {
			    var clickedAbilityName = this.currentUnit.ability[this.clickedAbility];
			    this.currentAbilities[this.clickedAbility].boxColor = "rgba(0,0,200,1)";
			    var castAbility = ability.cast(clickedAbilityName, CurrentSelectedGrid); //start ability cast
			   
			    if (castAbility == null) { this.abilityCastNeedsClick = false; this.abilityClickOff(); ability.removeMarkers();} //cancel cast
			   
			    if (castAbility == true) { //if ability finished casting:  SEND INFORMATION OFF TO SERVER...
			    var sendData = new Array("ability", ability.sourceSpot.x, ability.sourceSpot.y, null, null, ability.abilityName, null, null);
			    GameBoard.sendUnitInstruction(sendData);
			    this.abilityClickOff();
			    combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ")."); } 
			   
			    if (castAbility == false) {
			    // if false, ability requires another click OR ability was not found.
			    this.abilityCastNeedsClick = true;} }
			    break;
				
		    } } else { ability.removeMarkers(); }
	  }
	  
	  
	  //Ui Clicked Checking
	  Ui.prototype.ClickisWithin = function(Mouse) {
	  
		//UnitPlacement selection
		if (this.unitPicks != null) {
		 for (var i = 0; i < numberOfUnits; i++)
		 {
			if (this.unitPicks[i].Contains(Mouse) == true ) 
			{ 
				if (this.unitPicks[i].customValue[0] != null)
				{
			 this.SelectedUnit = this.unitPicks[i];
			 this.SelectedUnit.clicked = true;
			 return true; } } } }
		 
		 //sandbox selection
		 if (this.unitPicks == null && this.sandboxRectangle != null){
		  if (this.startGameBox.Contains(Mouse) == true){
			if (PlacementStage == true) {
			   PlacementStage = false; ClientsTurn = true; }
			   else{
			    PlacementStage = true; ClientsTurn = false; } 
				return true;}
		   if (PlacementStage == true) {
		   for (var i = 0; i < this.sandboxRectangle.length; i++) {
			  if (this.sandboxRectangle[i].Contains(Mouse) == true){
				this.SelectedUnit = this.sandboxRectangle[i];
				this.SelectedUnit.clicked = true;
				return true; }} } 
				if (PlacementStage == true && this.sandboxUiBox.Contains(Mouse) == true) { return true; } }
		 
		 //End turn box
		 if (ClientsTurn == true && this.finishTurnBox.Contains(Mouse) == true && ClientsTurn == true) {
			var endTurn = new Array();
			endTurn.push("end");
			GameBoard.sendUnitInstruction(endTurn);
			ClientsTurn = false;
			for (var i = 0; i < GameBoard.EnemyUnits.length; i++) { GameBoard.EnemyUnits[i].turnFunction(); }
			combatLog.push("Turn End.");
			return; }
		 
		 //If click is on Ui, Don't proceed board-clicks
		 if (this.unitUiBox != null && this.unitUiBox.Contains(Mouse) == true && PlacementStage == true || this.standardUiBox.Contains(Mouse) == true){ 
		 if (this.standardUiBox.Contains(Mouse) == true && ClientsTurn == true) {this.useAbility("ui", null);} return true; }
	  }
	  
	  //Turn ability selection off
	  Ui.prototype.abilityClickOff = function()
	  {
		this.abilityCastNeedsClick = false; this.clickedAbility = null;
	    for (var i = 0; i < this.currentAbilities.length; i++){
			this.currentAbilities[i].boxColor = "Black";}
	  }
	  
	  
	  
	  //Create&Adjust Placement Ui
	   Ui.prototype.createPlacementUi = function() {
	   
		this.unitUiBox = new Rectangle(Canvas.width - Canvas.width * 0.17 - Canvas.width * 0.08, 0, Canvas.width * 0.08, Canvas.height);
		this.unitUiBox.boxColor = "rgba(5, 10, 5, 1)";
		this.SelectedUnit.setImage(Images[3]);
		
		var x = 0; var y = 0; var sizeX = this.unitPicks[0].width;
		var sizeY = this.unitPicks[0].height; var unitsPerRow = 1;
		var PositionX = this.unitUiBox.x + 5;
		var PositionY = this.unitUiBox.y + 5;
		var PositionSpacer = 10;
		
		for (var i = 0; i < numberOfUnits; i++) {
			this.unitPicks[i].x = PositionX + (x * (sizeX + PositionSpacer));
			this.unitPicks[i].y = PositionY + (y * (sizeY + PositionSpacer));
			this.unitPicks[i].width = sizeX;
			this.unitPicks[i].height = sizeY;
			x++; if (x == unitsPerRow) { y++; x = 0; } }
	  }
	  
	  //Create Sandbox Ui
	  Ui.prototype.sandboxUi = function() {
	  
	    this.startGameBox = new Rectangle(Canvas.width * 0.63, 0, Canvas.width * 0.20, Canvas.height * 0.04); this.startGameBox.boxColor = "rgba(200, 0, 0, 1)";
		var text = "Switch Game State";
		this.startGameBox.setText(text, "Black", centreTextX(text, this.startGameBox.x, this.startGameBox.width, 
		globalFontSize), centreTextY(1, this.startGameBox.y, this.startGameBox.height, globalFontSize));
		
		this.sandboxRectangle = new Array(AllUnits.length);
		this.sandboxUiBox = new Rectangle(0, 0, Canvas.width, Canvas.height * 0.16); this.sandboxUiBox.boxColor = "rgba(0, 30, 0, 1)";
		
		var x = 0; var y = 0; var sizeX = Canvas.width * 0.032; var sizeY = Canvas.height * 0.05;
		var unitsPerRow = 12; var PositionX = 0; var PositionY = Canvas.height * 0.040; var PositionSpacer = 10;
		
		for (var i = 0; i < AllUnits.length; i++) {
			this.sandboxRectangle[i] = new Rectangle(PositionX + x * (sizeX + PositionSpacer), PositionY + y * (sizeY + PositionSpacer), sizeX, sizeY);
			this.sandboxRectangle[i].customValue.push(AllUnits[i][0]);
			this.sandboxRectangle[i].setImage(Images[ReturnUnitImage(this.sandboxRectangle[i].customValue[0])]); //set images
			x++; if (x == unitsPerRow) { y++; x = 0; } }
	  }
	  
	  //Initialize Ability Boxes
	  Ui.prototype.setAbilityBoxes = function() {
	  
		var numberOfAbility = 4;
	    this.currentAbilities = new Array(numberOfAbility);
		this.abilityCastNeedsClick = false;
		
		var x = 0; var y = 0;
		var thiswidth = 130; var thisheight = 25;
		var abilitiesPerRow = 1;
		var posX = this.standardUiBox.x; var posY = this.standardUiBox.y + 300; var posSpacer = 10; var numberOfAbilities = 4;
		for (var i = 0; i < numberOfAbility; i++) {
			this.currentAbilities[i] = new Rectangle(posX + (x * (thiswidth + posSpacer)), posY + (y * (thisheight + posSpacer)), thiswidth, thisheight);
			this.currentAbilities[i].boxColor = "rgba(0, 0, 0, 1)";
			x++; if (x == abilitiesPerRow) { y++; x = 0; } }
	  }
	  
	  
	  

	  
	  
	  
	  //Draw Ui
	  Ui.prototype.Draw = function(context, canvas) {
	  
		//CombatLog
		this.combatLogRectangle.draw();
		context.save(); context.fillStyle = "White"; context.font = "bold 16px Arial";
		var t = 0; for (var i = 0; i < combatLog.length; i++) { if (i > combatLog.length - 10) { 
		t++; if (combatLog.length > 8) { context.globalAlpha = t *0.1; }
		context.fillText(combatLog[i], this.combatLogRectangle.width * 0.02, this.combatLogRectangle.y + (t * 13) + 10); } }
		context.restore();
		
		//SandBoxUI
		if (this.unitPicks == null) { if (PlacementStage == true){ this.sandboxUiBox.draw();
			for (var i = 0; i < this.sandboxRectangle.length; i++) { this.sandboxRectangle[i].draw(); }}
			this.startGameBox.draw(); } //Switch button to turn off ui
	  
		//Unit Placement
		if (this.unitPicks != null && PlacementStage == true) {
		this.unitUiBox.draw();
		var tempBool = true;
		for (var i = 0; i < this.unitPicks.length; i++) { if (this.unitPicks[i].customValue[0] != null) { tempBool = false; }}  }
		
		//Main UiBox
		this.standardUiBox.draw();
		
		//Display UnitStats
		if (this.currentStats != null && this.currentStats[0] != null) {
		context.fillStyle = "White"; for (var i = 0; i < this.currentStats.length; i++) {
		context.fillText(this.currentStats[i], this.standardUiBox.x, this.standardUiBox.y + (i * 13) + 60); }
		
		//Display Unit Abilities
		for (var i = 0; i < this.currentUnit.ability.length; i++) {
			context.fillStyle = this.currentAbilities[i].customValue[0]; this.currentAbilities[i].draw();
			context.fillStyle = "White";
			context.fillText(this.currentUnit.ability[i], this.currentAbilities[i].x, this.currentAbilities[i].y + 13);
		} }
		
		//Display Placeable units during PlacementPhase
		if (this.unitPicks != null && PlacementStage == true) {
			for (var i = 0; i < numberOfUnits; i++) {
			if (this.unitPicks[i].customValue[0] != null){
			context.drawImage(Images[ReturnUnitImage(this.unitPicks[i].customValue[0][this.unitPicks[i].customValue[1]][0])], this.unitPicks[i].x,
			this.unitPicks[i].y, this.unitPicks[i].width, this.unitPicks[i].height); } } }
		
		//Current Selection on Ui Units
		if (this.SelectedUnit != null && PlacementStage == true) { //Cannot use rectangle.setImage() because SelectedUnit is dynamic!
		context.drawImage(Images[3], this.SelectedUnit.x, this.SelectedUnit.y, this.SelectedUnit.width, this.SelectedUnit.height); }
		
		//End Turn & Finished Placement Boxes
		if (PlacementStage == false || tempBool == true) { 
			context.save(); context.font = globalFont;
			if (ClientsTurn == true) { this.finishTurnBox.draw(); }
			if (tempBool == true) { this.finishPlacementBox.draw(); }
			context.restore(); }
		}