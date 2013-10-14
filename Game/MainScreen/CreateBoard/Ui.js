
	  
	  
	  function Ui(pickedUnits, allyPicks, enemyPicks) {
	  
		this.unitPicks = pickedUnits;
		this.allyPicks = allyPicks;
		this.enemyPicks = enemyPicks;
		//different Board Ui's
		if (this.unitPicks == "sandbox") { this.unitPicks = null; this.sandboxUi(); }
		else { this.createPlacementUi(); }
        //Set Rectangles
		
		this.tooltipList = new Array();
		
		
		
		//finishedPlacementBox
		this.finishPlacementBox = new Rectangle(Canvas.width * 0.52 - Canvas.width * 0.21, Canvas.height * 0.5 - Canvas.height * 0.04, Canvas.width * 0.21, Canvas.height * 0.04);
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
		this.SelectedUnit;// = this.unitUiBox;
		
		//CombatLog
		this.combatLogRectangle = new Rectangle(5 , Canvas.height - Canvas.height * 0.17, Canvas.width * 0.81, Canvas.height * 0.17)
		this.combatLogRectangle.setImage(Images[8]);
		
		//createAbilityBoxes
		this.setAbilityBoxes(); this.buffCount = 0;
		
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
	  
Ui.prototype.setTooltips = function() {

	if (this.currentUnit != null) {
	
			this.tooltipList = new Array();
			
			//abilities
			for (var i = 0; i < this.currentUnit.abilityStats.length; i++) {
			
				var string = "nothing is here";
				
				if (this.currentUnit.abilityStats[i] != undefined && 
					this.currentUnit.abilityStats[i].abilityTooltip != undefined &&
					this.currentUnit.abilityStats[i].abilityTooltip != "") {
				
						string = this.currentUnit.abilityStats[i].abilityTooltip;
					}

			var tooltip = this.currentAbilities[i].setTooltip(string, 300, "left");
			this.tooltipList.push(tooltip);
		}
		
		//buffs
		this.buffCount = 0;
		for (var i = 0; i < this.currentBuffs.length; i++) {
			
			this.currentBuffs[i].setTooltip(string, 300, "left");
			var string = "";
			
			if (this.currentUnit.buffList[i] != null) {
			
				string += this.currentUnit.buffList[i].buffType; 
				this.buffCount++;
			}
			
			if (this.currentUnit.buffList[i] != null && this.currentUnit.buffList[i].buffStats.buffTooltip != undefined) {
			
				string = this.currentUnit.buffList[i].buffStats.buffTooltip;
			}
			
			if (string != "") {
			var tooltip = this.currentBuffs[i].setTooltip(string, 300, "left");
			this.tooltipList.push(tooltip); }
		}
		
	}
}
	  
	  Ui.prototype.tooltips = function() {
	  
	  //Mouse
		if (this.currentUnit != null) {
			for (var i = 0; i < this.tooltipList.length; i++) {
				
				if (this.tooltipList[i] != undefined) {
					this.tooltipList[i].tooltip = false;
					if (this.tooltipList[i].tooltipOf.Contains(Mouse) == true) { this.tooltipList[i].tooltip = true; }
				}
			
			}
		}
	  
	  
	  
	  
	  
	  
	  
	  
	  
	/*	if (this.currentUnit != null) {
			for (var i = 0; i < this.currentAbilities.length; i++) {
				
				if (this.tooltipList[i] != undefined) {
					this.tooltipList[i].tooltip = false;
					if (this.currentAbilities[i].Contains(Mouse) == true) { this.tooltipList[i].tooltip = true; }
				}
			}
			
			for (var i = 0; i < this.currentBuffs.length; i++) {
				
				if (this.tooltipList[i] != undefined) {
					this.tooltipList[i].tooltip = false;
					if (this.currentBuffs[i].Contains(Mouse) == true) { this.tooltipList[i].tooltip = true; }
				}
			}
		}*/
			
	  }
	  
	  
	  
	  //Ability was clicked
	  Ui.prototype.useAbility = function(from, oldSpot) { 
		
	     if (this.currentUnit != null || oldSpot != null){
			
			if (this.currentUnit.alliance == "enemy" || this.currentUnit.canCast == false) { return true; }
			
		 switch(from) {
		 
			case "game":
				var castedAbility = ability.targetCast(CurrentSelectedGrid);
				if (castedAbility == true) {
				//var sendData = new Array("ability", ability.sourceSpot.x, ability.sourceSpot.y, ability.targetSpot.x, ability.targetSpot.y, ability.abilityName /*, ability.targetSpot2.x, ability.targetSpot2.y*/);
				//GameBoard.sendUnitInstruction(sendData);		
				} 
				if (ability.castMode == false) { this.abilityClickOff(); }
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
			    //var sendData = new Array("ability", ability.sourceSpot.x, ability.sourceSpot.y, null, null, ability.abilityName, null, null);
			    //GameBoard.sendUnitInstruction(sendData);
			    this.abilityClickOff();
				}
			   
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
		 for (var i = 0; i < this.unitPicks.length; i++)
		 {
			if (this.unitPicks[i].Contains(Mouse) == true ) 
			{ 
				if (this.unitPicks[i].customValue.length > 0) {
					if (this.unitPicks[i].customValue[0] != null) {
					   this.SelectedUnit = this.unitPicks[i];
					   this.SelectedUnit.clicked = true;
				 		return true; 
				 	} 
				} else if (this.unitPicks[i].object != null) {  // general
					this.SelectedUnit = this.unitPicks[i];
					this.SelectedUnit.clicked = true;
					return true;					
				}
			} } }
		 
		 //sandbox selection
		if (this.unitPicks == null && this.sandboxRectangle != null){
		 
			if (PlacementStage == true && this.allianceBox.Contains(Mouse) == true) {
			if (GameBoard.alliance == "ally") { GameBoard.alliance = "enemy"; this.allianceBox.boxColor = "red"; } 
				else { GameBoard.alliance = "ally"; this.allianceBox.boxColor = "blue";} }
		 
			//switch gamestate was clicked
		  if (this.startGameBox.Contains(Mouse) == true){
			if (PlacementStage == true) { this.sandBoxUiToggle(); }
			   else{ PlacementStage = true; GameBoard.observer = true; ClientsTurn = false; } 
				return true;}
				
			//placing units (unit was selected)
		   if (PlacementStage == true) { for (var i = 0; i < this.sandboxRectangle.length; i++) { if (this.sandboxRectangle[i].Contains(Mouse) == true){
					this.SelectedUnit = this.sandboxRectangle[i];
					this.SelectedUnit.clicked = true;
					return true; }} } 
				if (PlacementStage == true && this.sandboxUiBox.Contains(Mouse) == true) { return true; } 
				
			
			

		}
		 
		 //End turn box
		 if (ClientsTurn == true && this.finishTurnBox.Contains(Mouse) == true && ClientsTurn == true) {
			this.endTurn(); return true;
		}
			
		// End placement box
		if (this.unitUiBox != undefined && this.unitUiBox != null && this.finishPlacementBox.Contains(Mouse) == true && PlacementStage == true) {
				var allUnitsPlacedBool = true;
				for (var i = 0; i < this.unitPicks.length / 2 - 1; i++) {
					
					if (this.unitPicks[i].customValue[0] != null) { allUnitsPlacedBool = false; }
				}
				if (this.unitPicks[18].customValue[0] != null) { allUnitsPlacedBool = false; }	// make sure general is placed
			if (allUnitsPlacedBool == true) {
			PlacementStage = false; this.unitUiBox.x = -500; //temporary moving of sidebar
			GameBoard.spawnZones("off");
			ClientsTurn = false;
			sendPacket2("endPhase", "placement");	
			}
		}
		 
		 //If click is on Ui, Don't proceed to board-clicks
		 if (PlacementStage == true && this.standardUiBox.Contains(Mouse) && GameBoard.gameType == "sandbox") { this.sandBoxUiToggle(); }
		 if (this.unitUiBox != null && this.unitUiBox.Contains(Mouse) == true && PlacementStage == true || this.standardUiBox.Contains(Mouse) == true){ 
		 if (this.standardUiBox.Contains(Mouse) == true && ClientsTurn == true) {this.useAbility("ui", null);} return true; }
	  }
	  
	   Ui.prototype.sandBoxUiToggle = function() {
	   
			PlacementStage = false;  GameBoard.observer = false; ClientsTurn = true;
	  }
	  
	  //Turn ability selection off
	  Ui.prototype.abilityClickOff = function()
	  {
		this.abilityCastNeedsClick = false; this.clickedAbility = null;
	    for (var i = 0; i < this.currentAbilities.length; i++){
			this.currentAbilities[i].boxColor = "Black";}
	  }
	  
	
	  Ui.prototype.endTurn = function() {
	  
			var endTurn = new Array();
			endTurn.push("end");
			
			for (var i = 0; i < GameBoard.tileModifierList.length; i++) { var theSame = GameBoard.tileModifierList[i]; GameBoard.tileModifierList[i].turnRefresh("enemy");
			if (theSame != GameBoard.tileModifierList[i]) { i--; } } //fixing index error
			
			GameBoard.sendUnitInstruction(endTurn);
			if (GameBoard.gameType == "normal") { 
				ClientsTurn = false; 
				GameBoard.unitsMovedThisTurn = new Array();
				
				for (var i = 0; i < GameBoard.EnemyUnits.length; i++) {  var theSame = GameBoard.EnemyUnits[i]; GameBoard.EnemyUnits[i].turnFunction(); 
				if (theSame != GameBoard.EnemyUnits[i]) { i--; } } //fixing index error}				
				
				for (var i = 0; i < GameBoard.auraList.length; i++) { 
					if (GameBoard.auraList[i].sourceUnit.alliance == "enemy") {
						GameBoard.auraList[i].turn(); 
					}
				}
				
			} else if (GameBoard.gameType == "sandbox") {
				GameBoard.unitsMovedThisTurn = new Array();
				
				for (var i = 0; i < GameBoard.AllyUnits.length; i++) { var theSame = GameBoard.AllyUnits[i]; GameBoard.AllyUnits[i].turnFunction();
					if (theSame != GameBoard.AllyUnits[i]) { i--; } } //fixing index error}				}	
				
				for (var i = 0; i < GameBoard.auraList.length; i++) { 
					if (GameBoard.auraList[i].sourceUnit.alliance == "ally") {
						GameBoard.auraList[i].turn(); 
					}
				}
			}
			combatLog.push("Turn End.");
			GameBoard.timerReset();
	  }
	  
	  //Create&Adjust Placement Ui
	   Ui.prototype.createPlacementUi = function() {
	   
		this.unitUiBox = new Rectangle(Canvas.width * 0.1, Canvas.height * 0.3, Canvas.width * 0.62, Canvas.height * 0.2);
		this.unitUiBox.boxColor = "rgba(5, 10, 5, 1)";
		
		var x = 0; var y = 0; var sizeX = this.unitPicks[0].width;
		var sizeY = this.unitPicks[0].height; var unitsPerRow = 9;
		var PositionX = Canvas.width * 0.17;
		var PositionY = Canvas.height * 0.3;
		var PositionSpacer = 10;
		
		for (var i = 0; i < numberOfUnits; i++) {
			this.unitPicks[i].x = PositionX + (x * (sizeX + PositionSpacer));
			this.unitPicks[i].y = PositionY + (y * (sizeY + PositionSpacer));
			this.unitPicks[i].width = sizeX;
			this.unitPicks[i].height = sizeY;
			x++; if (x == unitsPerRow) { y++; x = 0; } }
			

		var general = {
				x: PositionX + (sizeX + PositionSpacer) * 4 - sizeX * 0.2,
				y: PositionY + sizeY + PositionSpacer * 1.2,
				w: sizeX * 1.4,
				h: sizeX * 1.4
		};
		
		var generalRect = new Rectangle(general.x, general.y, general.w, general.h);
		generalRect.customValue[0] = 0;
		generalRect.object = this.allyPicks[0];
		
		this.unitPicks.push(generalRect);
	  }
	  
	  //Create Sandbox Ui
	  Ui.prototype.sandboxUi = function() {
	    
	    this.startGameBox = new Rectangle(Canvas.width * 0.63, 0, Canvas.width * 0.20, Canvas.height * 0.04); this.startGameBox.boxColor = "rgba(80, 150, 60, 1)";
		var text = "Switch Game State";
		this.startGameBox.setText(text, "Black", centreTextX(text, this.startGameBox.x, this.startGameBox.width, 
		globalFontSize), centreTextY(1, this.startGameBox.y, this.startGameBox.height, globalFontSize));
		
		this.allianceBox = new Rectangle(Canvas.width * 0.63, Canvas.height * 0.045, Canvas.width * 0.20, Canvas.height * 0.04); this.allianceBox.boxColor = "rgba(0, 0, 200, 1)";
		var text = "Switch Alliance";
		this.allianceBox.setText(text, "Black", centreTextX(text, this.startGameBox.x, this.startGameBox.width, 
		globalFontSize), centreTextY(1, this.startGameBox.y, this.startGameBox.height, globalFontSize));
		
		
		this.sandboxRectangle = new Array(AllUnits.length);
		this.sandboxUiBox = new Rectangle(0, 0, Canvas.width, Canvas.height * 0.16); this.sandboxUiBox.boxColor = "rgba(0, 30, 0, 1)";
		
		var x = 0; var y = 0; var sizeX = Canvas.width * 0.035; var sizeY = Canvas.height * 0.052;
		var unitsPerRow = 12; var PositionX = Canvas.width * 0.035; var PositionY = Canvas.height * 0.040; var PositionSpacer = 10;
		
		for (var i = 0; i < AllUnits.length; i++) {
			this.sandboxRectangle[i] = new Rectangle(PositionX + x * (sizeX + PositionSpacer), PositionY + y * (sizeY + PositionSpacer), sizeX, sizeY);
			this.sandboxRectangle[i].customValue.push(AllUnits[i][0]);
			this.sandboxRectangle[i].setImage(Images[ReturnUnitImage(this.sandboxRectangle[i].customValue[0])]); //set images
			x++; if (x == unitsPerRow) { y++; x = 0; } }
	  }
	  
	  //Initialize Ability Boxes & buff Boxes
	  Ui.prototype.setAbilityBoxes = function() {
	  
		//Abilities
		var numberOfAbility = 4;
		
	    this.currentAbilities = new Array(numberOfAbility);
		this.abilityCastNeedsClick = false;
		
		var x = 0; var y = 0;
		var thiswidth = 130; var thisheight = 25;
		var abilitiesPerRow = 1;
		var posX = this.standardUiBox.x; var posY = this.standardUiBox.y + 300; var posSpacer = 10; 
		for (var i = 0; i < numberOfAbility; i++) {
			this.currentAbilities[i] = new Rectangle(posX + (x * (thiswidth + posSpacer)), posY + (y * (thisheight + posSpacer)), thiswidth, thisheight);
			this.currentAbilities[i].boxColor = "rgba(0, 0, 0, 1)";
			this.currentAbilities[i].setTooltip("no information", 200, "left");
			x++; if (x == abilitiesPerRow) { y++; x = 0; } }
		
		//Buffs			
		var numberOfBuffs = 30;
	    this.currentBuffs = new Array(numberOfBuffs);
		
		var x = 0; var y = 0;
		var thiswidth = 30; var thisheight = 30;
		var buffsPerRow = 4;
		var posX = this.standardUiBox.x + 10; var posY = this.standardUiBox.y + 400; var posSpacer = 8; 
		for (var i = 0; i < numberOfBuffs; i++) {
			this.currentBuffs[i] = new Rectangle(posX + (x * (thiswidth + posSpacer)), posY + (y * (thisheight + posSpacer)), thiswidth, thisheight);
			this.currentBuffs[i].boxColor = "rgba(0, 0, 90, 1)";
			x++; if (x == buffsPerRow) { y++; x = 0; } }	
			
		
		
			
	  }
	  
	  
	  

	  
	  
	  
	  //Draw Ui
	  Ui.prototype.Draw = function(context, canvas) {
	  
		//CombatLog
		if (GameBoard.gameType == "sandbox") {
		this.combatLogRectangle.draw();
		context.save(); context.fillStyle = "White"; context.font = "bold 16px Arial";
		var alphaVar = 0.2;
		var t = 0; for (var i = 0; i < combatLog.length; i++) { if (i > combatLog.length - 9) { 
		t++; if (i == combatLog.length - 1) {alphaVar = 1; } context.globalAlpha = alphaVar;
		alphaVar += 0.1;
		context.fillText(combatLog[i], this.combatLogRectangle.width * 0.02, this.combatLogRectangle.y + (t * 13) + 12); } }
		context.restore(); }
		
		//SandBoxUI
		if (this.unitPicks == null) { if (PlacementStage == true){ this.sandboxUiBox.draw();
			for (var i = 0; i < this.sandboxRectangle.length; i++) { this.sandboxRectangle[i].draw(); } this.allianceBox.draw();}
			this.startGameBox.draw(); 
			
			} //Switch button to turn off ui
	  
		//Unit Placement
		if (this.unitPicks != null && PlacementStage == true) {
		this.unitUiBox.draw();
		var tempBool = true; }
		//for (var i = 0; i < this.unitPicks.length; i++) { if (this.unitPicks[i].customValue[0] != undefined) { /* tempBool = false; */ }}  }
		
		//Main UiBox
		this.standardUiBox.draw();
		
		context.save();
		context.font = '15px Arial';
		
		if (this.currentUnit != null && ( GridSpot[this.currentUnit.x][this.currentUnit.y].visible == true || GameBoard.observer == true ))  {
		
				//Display unitStats
				var stats;
				if (this.currentUnit.displayStats == true && this.currentUnit.alliance == "enemy") { stats = this.currentUnit.fakeStats; }
					else { 
						stats = this.currentUnit.currentStats; 
					}
				
				context.fillStyle = "White"; for (var i = 0; i < stats.length; i++) { if (i < 10) {
				var extra = " ";
				if (i == 0) { extra = ""; } //Name: 
				if (i == 1) { extra = "Life: "; }
				if (i == 2) { extra = "Damage: "; }
				if (i == 3) { extra = "Defence: "; }
				if (i == 4) { extra = "Speed: "; }
				if (i == 5) { extra = "Sight: "; }
				if (i == 6) { extra = "Range: "; }
				if (i == 7) { extra = "Reveal: "; }
				if (i == 8) { extra = "Attacks: "; }
				if (i == 9) { extra = "Blocks: "; }
				if (i != 0) {
				var totalStat = " / " + this.currentUnit.baseStats[i]; 
				if (this.currentUnit.displayStats == true) { totalStat = " / " + this.currentUnit.fakeStats[i]; } //this shou be changed
				} else { var totalStat = ""; }
				
				
				var totalString = extra + stats[i] + totalStat;
				context.fillText(totalString, this.standardUiBox.x + 1, this.standardUiBox.y + (i * 23) + 60); } }
				
				//Display Unit Abilities
				for (var i = 0; i < this.currentUnit.ability.length; i++) { //may need reworking
				
					if (this.currentUnit.ability[i].name != null && this.currentUnit.ability[i].name != "" && this.currentUnit.ability[i].name != "None") {
						context.fillStyle = this.currentAbilities[i].customValue[0]; 
							
						this.currentAbilities[i].draw(); //draws as many boxes as there are abilities
							
						context.fillStyle = "White";
						context.fillText(this.currentUnit.ability[i].name, this.currentAbilities[i].x + 1, this.currentAbilities[i].y + 13); //draws text on the abilities-^
							
						if (this.currentUnit.ability[i].cooldown > 0 && this.currentUnit.alliance == "ally") {
						context.globalAlpha = 0.3;
						context.fillStyle = "Gray";
						context.fillRect(this.currentAbilities[i].x, this.currentAbilities[i].y, this.currentAbilities[i].width, this.currentAbilities[i].height);
						context.fillStyle = "White";
						context.globalAlpha = 1;
						context.fillText(this.currentUnit.ability[i].cooldown, this.currentAbilities[i].x + this.currentAbilities[i].width - 20, this.currentAbilities[i].y + 13); }
					}
				} 
				
				context.restore();
				//Display Unit Buffs
				
				for (var i = 0; i < this.currentUnit.buffList.length; i++) { //may need reworking
				if (this.currentBuffs.length >= i) { this.currentBuffs[i].draw();
					context.font = '7px Arial';
				context.fillStyle = "White";
					context.fillText(this.currentUnit.buffList[i].buffType, this.currentBuffs[i].x, this.currentBuffs[i].y + 8 + ((i % 4) * 5));
					context.font = '13px Arial';
					context.fillStyle = "Yellow";
					if (this.currentUnit.buffList[i].buffStats.duration != undefined) {
					context.fillText(this.currentUnit.buffList[i].buffStats.duration, this.currentBuffs[i].x + 14, this.currentBuffs[i].y + 22); }
				}
				}
				if (this.currentUnit.buffList.length > this.buffCount) { this.setTooltips(); } //refresh tooltips...
			
		
		}
		
		//Display Placeable units during PlacementPhase
		if (this.unitPicks != null && PlacementStage == true) {
			for (var i = 0; i < numberOfUnits; i++) {
			if (this.unitPicks[i].customValue[0] != null){
			context.drawImage(Images[ReturnUnitImage(this.unitPicks[i].customValue[0][this.unitPicks[i].customValue[1]][0])], this.unitPicks[i].x,
			this.unitPicks[i].y, this.unitPicks[i].width, this.unitPicks[i].height); } } 
		
			// draw general
			if (this.unitPicks[this.unitPicks.length - 1].customValue[0] != null) {
				var generalRect = this.unitPicks[this.unitPicks.length - 1];
				var image = generalRect.object.image;
				var x = generalRect.x;			
				var y = generalRect.y;
				var w = generalRect.width;
				var h = generalRect.height;
				
				_.context.drawImage(image, x, y, w, h);
			}
			
		}
		
		//Current Selection on Ui Units
		if (this.SelectedUnit != null && PlacementStage == true) { //Cannot use rectangle.setImage() because SelectedUnit is dynamic!
		context.drawImage(Images[3], this.SelectedUnit.x, this.SelectedUnit.y, this.SelectedUnit.width, this.SelectedUnit.height); }
		
		//End Turn & Finished Placement Boxes
		if (PlacementStage == true && GameBoard.gameType == "normal") { 
			var allUnitsPlacedBool = true; //make sure all units are placed before drawing
			for (var i = 0; i < this.unitPicks.length / 2 - 1; i++) {
			if (this.unitPicks[i].customValue[0] != null) {allUnitsPlacedBool = false; } } //make sure all units are placed before drawing
			if (this.unitPicks[18].customValue[0] != null) {allUnitsPlacedBool = false; }	// check if general is placed
				context.save();
				if (allUnitsPlacedBool == true) {
			 context.font = globalFont;
			this.finishPlacementBox.draw();
				}
			context.restore();
		} else {
			if (ClientsTurn == true) {
				this.finishTurnBox.draw();
			}
		}
		
		
		//Number of units you can move this turn
		context.font = '18px Arial';
		context.fillStyle = "White";
		
		if (PlacementStage == false && ClientsTurn == true && ( GameBoard.gameType == "normal" || GameBoard.gameType == "sandbox" )) { 
		context.fillText(GameBoard.unitMoves - GameBoard.unitsMovedThisTurn.length, canvas.width - 20, 20); }
		
		if (this.currentUnit != null && ( GridSpot[this.currentUnit.x][this.currentUnit.y].visible == true || GameBoard.observer == true) ) {
		for (var i = 0; i < this.tooltipList.length; i++) {
		
			if (this.tooltipList[i].tooltip == true) { this.tooltipList[i].draw(); }
			}
		}
	    context.font = '18px Arial';
		context.fillStyle = "rgba(250, 250, 250, 0.5)";
		context.fillText("Total: " + this.clockTime(GameBoard.hour) + ":" + this.clockTime(GameBoard.min) + ":" + this.clockTime(GameBoard.sec), _.canvas.width * 0.84,  _.canvas.height * 0.985);
		if (ClientsTurn == true && GameBoard.turnTimer.toggle == true) { 
		if (GameBoard.turnTimer.min < 1 && GameBoard.turnTimer.sec < 30) { context.fillStyle = "red"; context.font = '25px Arial'; if ( GameBoard.turnTimer.sec < 11) { context.font = '35px Arial';} }
		context.fillText( this.clockTime(GameBoard.turnTimer.min) + ":" + this.clockTime(GameBoard.turnTimer.sec), _.canvas.width * 0.40, 40);
		}
	  }
	  
	  Ui.prototype.clockTime = function(time) { if (time < 10) { return "0" + time; } else { return time; } }
			