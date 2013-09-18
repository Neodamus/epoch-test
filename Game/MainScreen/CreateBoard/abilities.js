function ability() { 

	//this.abilityBeingCasted = false; 
	this.abilityName;
	this.specialAbilityList(); 
	this.sourceUnit;
	this.targetSpot2 = null;
	this.targetList = [];
	
	this.castMode = false;	// true if in castmode, false if not
	this.castType = "single";		// type of casting area, ie: single, line, radius, chain
	this.castHighlight = GridSpot[0][0];		// holds center highlighted gridspot
	this.castHighlightList = []; // holds list of highlighted gridspots
	this.castHighlightOption = 0;	// used for changing the area select, ie: turning line cast different ways

}

ability.prototype.abilityStats = function(abilityName)
{
	var customValue = new Array(8);
	switch(abilityName){	
		
		case "Ambush":
		
			stats = {
				damageMultiplier: 1.5
			}
			
			return stats;
		
		case "Bark Armor":
		
			stats = {
				target: "ally",
				duration: 3,
				visibility: "both",
				stacks: false,
				defense: 2,
				range: 4
			}
			
			return stats;				  
	  
	  	case "Blind":
		
			stats = {
				target: "enemy",
				duration: 2,
				range: 3,
				sight: 1				
			}
			
			return stats;
					
		case "Condense":	
					
			stats = {
				duration: 3,
				hitpoints: 2
			}
			
			return stats; 
	  
		case "Engulf": 
		
			stats = {				
				duration: 3,
				damage: 1
			}
			
			return stats;
							
		case "Entanglement":	
					
			stats = {
				target: "enemy",
				hitpoints: -2,
				damage: 5,
				range: 4
			}
			
			return stats; 
					
		case "Exothermia":
					
			stats = {
				blocks: 2
			}
			
			return stats; 
					
		case "Fire Wall":	
					
			stats = {
				damage: 3,
				range: 4
			}
			
			return stats; 
					
		case "Frostbite":	
					
			stats = {
				damage: 3
			}
			
			return stats;
			
		case "Heal":	
					
			stats = {
				target: "ally",
				hitpoints: 6,
				range: 3
			} 
			
			return stats;
					
		case "Haste":	
					
			stats = {
				target: "ally",
				duration: 3,
				speed: 3,
				range: 4
			}
			
			return stats;
			
		case "Magma Trap":
		
			stats = {
				target: "tile",
				duration: 2,
				range: 3,
				damage: 2,
				stacks: true
			}
			
			return stats;
					
		case "Panic Aura": 
		
			stats = {
				duration: 3,
				unitAffectNumber: 1,
				auraRange: 2,
				auraTarget: "enemy"
			}
			
			return stats;
			
			
			/*
					customValue[0] = 3; 		//MaxTime (buff)
					customValue[1] = 3; 		//CurrentTime (buff)
					customValue[2] = "both";    //buff visibility (buff)
					customValue[3] = false;      //Does it stack? (buff)
					customValue[4] = 1; 	    //total-How many units can it affect per turn (aura)
					customValue[5] = 2;         //range of aura (aura)
					customValue[6] = 1;         //current-How many units can it affect per turn (aura)
					customValue[7] = "enemy"    //alliance that aura gets applied to, compared to sourceUnit (aura)
					return customValue; */
					
		case "Polarity":
		
			stats = {
				targetSelf: true,
				target: "both",
				targets: 2,
				range: 5
			}
			
			return stats;	
					
		case "Poison Tips":
		
			stats = {
				duration: 3,
				visibility: "both",
				stacks: false,
				damage: 1
			}
			
			return stats;	
					
		case "Precision":
		
			stats = {
				duration: 3,
				damage: 4,
				range: 2
			}
			
			return stats;	
					
		case "Rain Shield":	
					
			stats = {
				target: "ally",
				duration: 3,
				range: 4,
				defense: 2,
				blocks: 3
			}
			
			return stats; 
					
		case "Rapid Strikes": 
					
			stats = {
				attacks: 2
			}
			
			return stats;	
					
		case "Second Wind":
					
			stats = {
				speed: 3
			}
			
			return stats;
					
		case "Soulfire": 
					
			stats = {
				target: "ally",
				duration: 3,
				hitpoints: 2,
				range: 5
			}
			
			return stats;	
					
		case "Static":	
					
			stats = {
				target: "ally",
				duration: 2,
				damage: 2,
				range: 4
			}
			
			return stats;	
		
		case "Stealth":	
					
			stats = {
				empty: 0
			}
			
			return stats;	
		
		case "Stomp":	
					
			stats = {
				duration: 2,
				speed: -2,
				radius: 1
			}
			
			return stats;	
			
		case "Teleport":	
					
			stats = {
				target: "tile",
				range: 6
			}
			
			return stats;	
			
		case "Thunderclap":	
					
			stats = {
				target: "enemy",
				range: 1
			}
			
			return stats;							
					
		case "Torch": 
		
			stats = {
				target: "ally",
				duration: 3,
				reveal: 2,
				range: 4				
			}
			
			return stats;
					
		case "Wound":
		
			stats = {
				duration: 3,
				speed: -2,
				range: 4
			}
			
			return stats;				

  return null; } }
//cast time??,

ability.prototype.specialAbilityList = function() { 
this.noCastList = new Array();  //List of abilities that cannot be casted.
this.noCastList.push("Engulf", "Panic Aura");

this.twoTargetList = new Array(); //List of abilities that require two clicks.
this.twoTargetList.push("Polarity", "test1");
}

ability.prototype.receiveAbility = function(info)
{
	var cast = this.cast(info[5], GridSpot[info[1]][info[2]]);
	if (cast == false)
	{ 
	var target = this.targetCast(GridSpot[info[3]][info[4]]);
	if (target == false) { } //do second target ability!
	}
}



ability.prototype.cast = function(abilityName, sourceSpot) //Ability is clicked-> Ability setup or cast.
{	
	this.abilityName = abilityName;
	
	// maintains the casting source in case of multiple targets
	if (this.castMode == false) {
		this.sourceSpot = sourceSpot
		if (this.sourceSpot != null) { this.sourceUnit = this.sourceSpot.currentUnit;}
	}
	
	this.castMode = true;
	
	var customValue = this.abilityStats(this.abilityName);
	
	var finished = null;
	if (listContains(this.noCastList, this.abilityName) == true) { return null; }

	switch (this.abilityName) {
		
		case "Bark Armor":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
	
		case "Rapid Strikes":
			 var addBuff = new newBuff(this.abilityName, this.sourceUnit, this.sourceUnit)
			 finished = true;
			 this.castMode = false;
			break;
	
		case "Blind":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;
			break;
		
		case "Condense":
			var addBuff = new newBuff(this.abilityName, this.sourceUnit, this.sourceUnit)
			finished = true;
			this.castMode = false;
			break;
		
		case "Entanglement":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;		
		
		case "Exothermia":
			var addBuff = new newBuff(this.abilityName, this.sourceUnit, this.sourceUnit)
			finished = true;
			this.castMode = false;
			break;
			
		case "Fire Wall":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;
			this.castType = "line";									
			break;
			
		case "Haste":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
		
		case "Heal":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
			
		case "Magma Trap":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
			
		case "Polarity":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
			
		case "Precision":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;
			break;
		
		case "Rain Shield":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
			
		case "Second Wind":
			var addBuff = new newBuff(this.abilityName, this.sourceUnit, this.sourceUnit)
			finished = true;
			this.castMode = false;
			break;
			
		case "Soulfire":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;
			break;
			
		case "Static":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
		
		case "Stealth":
			var addBuff = new newBuff(this.abilityName, this.sourceUnit, this.sourceUnit)
			finished = true;
			this.castMode = false;
			break;
		
		case "Stomp":
			var gridCenter = GridSpot[this.sourceUnit.x][this.sourceUnit.y];
			var gridList = this.AreaSelect(gridCenter, customValue.radius)
			for (i = 0; i < gridList.length; i++) {
				if (gridList[i].currentUnit != null && gridList[i].currentUnit != this.sourceUnit) {
					new newBuff(this.abilityName, gridList[i].currentUnit, this.sourceUnit)
				}
			}
			finished = true;
			this.castMode = false;			
			break;
			
		case "Teleport":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
		
		case "Thunderclap":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
		
		case "Torch":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;
			break;	
		
		case "Wound":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;
			break;
	}
	
	return finished; //require another click
}



ability.prototype.targetCast = function(targetSpot) //if finished returns true, send it off to server, if not... wait for another click?
{	
    var customValue = this.abilityStats(this.abilityName);
	
	this.targetSpot = targetSpot;
	
	if (this.sourceSpot != null) {
	this.targetUnit = this.targetSpot.currentUnit; }
	var finished = null; //if it only requires one target, finished = true;	
	
	if (customValue != null) {
		var target = customValue.target;	// holds whether target needs to be ally, enemy, or both
	}
	
	// multi target casting -- ex. polarity
	if (customValue.targets != null && this.targetSpot.abilityMarker == true && this.targetUnit != null) {	
	
		if ((this.targetUnit == this.sourceUnit == customValue.targetSelf) || this.targetUnit != this.sourceUnit) {	
		
			// -------------- ADD IN SAME TARGET PREVENTER HERE
		
			if (target == "ally") {
				
				if (this.targetUnit.alliance == this.sourceUnit.alliance) {				
					
					this.targetList.push(this.targetUnit)
					
					if (this.targetList.length < customValue.targets) { 
						return false; 				
					} else {
						combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");
						this.multiCast();
						this.removeMarkers();
					}	
					
				} else {
					
					alert("You can't use " + this.abilityName + " on an enemy")
					return false;				
					
				}
			
			} else if (target == "enemy") {
				
				if (this.targetUnit.alliance != this.sourceUnit.alliance) {				
					
					this.targetList.push(this.targetUnit)
					
					if (this.targetList.length < customValue.targets) { 
						return false; 				
					} else {
						combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");
						this.multiCast();
						this.removeMarkers();
					}					
					
				} else {
					
					alert("You can't use " + this.abilityName + " on an ally")	
					return false			
					
				}				
				
			} else if (target == "both") {
				
				this.targetList.push(this.targetUnit)
				
				if (this.targetList.length < customValue.targets) { 
					return false; 				
				} else {
					combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");
					this.multiCast();
					this.removeMarkers();
				}			
				
			}
			
		} else {
			
			alert("You cannot target yourself");
			return false;
			
		}
	}
	
	// single target casting
	if (this.targetSpot.abilityMarker == true && this.targetUnit != null) {		
		
		if (target == "ally") {
		
			if (this.targetUnit.alliance == this.sourceUnit.alliance) {
				
			    combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");
				new newBuff(this.abilityName, this.targetUnit, this.sourceUnit);
				this.removeMarkers();
				finished = true;
				
			} else { // target is an enemy with an ally buff
			
				this.removeMarkers();
				alert("You can't use " + this.abilityName + " on an enemy")
				finished = true;
			
			}
			
		} else if (target == "enemy") {
			
			if (this.targetUnit.alliance != this.sourceUnit.alliance) {
				
			    combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");
				new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
				this.removeMarkers();
				finished = true;
				
			} else { // target is an ally with an enemy buff

				this.removeMarkers();			
				alert("You can't use " + this.abilityName + "on an ally");
				finished = true;
			
			}			
			
		} else { // target = both
			
			combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");
			new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.removeMarkers();
			finished = true;			
			
		}
		
	} else if (this.targetSpot.abilityMarker == true && this.targetUnit == null && customValue.target == "tile") {	// tile casting
		
		this.removeMarkers();
		combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");		
		new newBuff (this.abilityName, this.targetSpot, this.sourceUnit);
		finished = true;
		
	} else {
		
		this.removeMarkers();
		Ui.abilityClickOff();
		
		if (customValue.targets == null) {
			this.castMode = false;
		}
		
	}
	
	if (finished == null) { this.removeMarkers(); }
	return finished; //require another click
}

ability.prototype.multiCast = function() {
	
	switch (this.abilityName) {
		
		case "Polarity": // 2 targets
		
			this.sourceUnit.abilityMarkers("off", this.abilityStats(this.abilityName).range);
		
			var coords = { x: this.targetList[0].x, y: this.targetList[0].y }
			
			var target1 = this.targetList[0]
			var target2 = this.targetList[1]
			
			target1.x = target2.x;
			target1.y = target2.y;
			
			target2.x = coords.x
			target2.y = coords.y;
			
			GridSpot[target2.x][target2.y].currentUnit = target2;
			GridSpot[target1.x][target1.y].currentUnit = target1;	
			
			combatLog.push(target1.baseStats[0] + " swapped places with " + target2.baseStats[0])		
			
			break;
		
	}
	
}



ability.prototype.removeMarkers = function()
{
	if (this.castMode == true) {
		this.sourceUnit.abilityMarkers("off", this.abilityStats(this.abilityName).range);
		Ui.abilityClickOff();
		this.castMode = false;
		this.castHighlight.moveMarker = false;
		this.castType = "single";
		this.targetList = [];
		this.castHightlightList = [];
		this.castHighlightOption = 0;
	}
}

ability.prototype.castModeHighlight = function(option) {
	
	var mousePosition = { x: Mouse.x, y: Mouse.y };
	
	if (this.castMode)	{
		
		if (this.castHighlight.ThisRectangle.Contains(mousePosition) == false || option == true) {
			
			// remove marker
			this.castHighlight.moveMarker = false;
			
			// if it's an area highlight, turn off the list and empty it
			if (this.castHighlightList.length > 0) { 
				for (i = 0; i < this.castHighlightList.length; i++) { this.castHighlightList[i].moveMarker = false; }
			}
			
			// find a new highlight
			var mouseOnBoard = false;
			
			for (i = 0; i < gridSpotList.length; i++) {
				
				gridSpot = gridSpotList[i];	
				
				if (gridSpot.ThisRectangle.Contains(mousePosition) == true) {
					this.castHighlight = gridSpot;
					mouseOnBoard = true;	
				}
				
			}
			
			if (mouseOnBoard) {
				
				switch(this.castType) {
				
					case "single":
					
						this.castHighlight.moveMarker = true;
						
					break;
						
					case "line":
					
						this.castHighlightList = this.specialAreaSelect(this.castHighlight, 2, this.castHighlightOption);
							
						for (i = 0; i < this.castHighlightList.length; i++) {
							this.castHighlightList[i].moveMarker = true;	
						}					
					
					break;
						
				}			
				
			}
		
		}
		
	}
	
}

ability.prototype.specialAreaSelect = function(gridCenter, numberOfTiles, option) {
	
	gridList = [];
	gridList.push(gridCenter);
	
	switch (this.castType) {
	
			case "line": 
					
					x = gridList[0].x;
					y = gridList[0].y;
			
				switch (option) {
					
					case 0:
					
						for (i = 1; i <= numberOfTiles / 2; i++) {
							if (GridSpot[x - i][y] != null) { gridList.push(GridSpot[x - i][y]); }
							if (GridSpot[x + i][y] != null) { gridList.push(GridSpot[x + i][y]); }
						}
						
					break;
					
					case 1:
					
						for (i = 1; i <= numberOfTiles / 2; i++) {
							
							if (y % 2 == 0) {
							
								if (GridSpot[x - i][y - i] != null) { gridList.push(GridSpot[x - i][y - i]); }
								if (GridSpot[x][y + i] != null) { gridList.push(GridSpot[x][y + i]); } 
								
							} else {
							
								if (GridSpot[x][y - i] != null) { gridList.push(GridSpot[x][y - i]); }
								if (GridSpot[x + i][y + i] != null) { gridList.push(GridSpot[x + i][y + i]); }
							
							}
						}
						
					break;
					
					case 2:
					
						for (i = 1; i <= numberOfTiles / 2; i++) {
							
							if (y % 2 == 0) {
							
								if (GridSpot[x][y - i] != null) { gridList.push(GridSpot[x][y - i]); }
								if (GridSpot[x - i][y + i] != null) { gridList.push(GridSpot[x - i][y + i]); } 
								
							} else {
							
								if (GridSpot[x + i][y - i] != null) { gridList.push(GridSpot[x + i][y - i]); }
								if (GridSpot[x][y + i] != null) { gridList.push(GridSpot[x][y + i]); }
							
							}
						}
						
					break;
				
				}

			break;
	} 
	
	return gridList;
}

ability.prototype.AreaSelect = function(CentreGrid, Radius)
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
	  
ability.prototype.mouseWheelHandler = function(mouseWheelDirection) {

	switch (this.castType) {
	
		case "line":
		
			switch (mouseWheelDirection) {
				
				case "up":
				
					switch (this.castHighlightOption) {
					
						case 0: this.castHighlightOption = 1; break;
						case 1: this.castHighlightOption = 2; break;
						case 2: this.castHighlightOption = 0; break;
						
					}
				
				break;
				
				case "down":
				
					switch (this.castHighlightOption) {
					
						case 0: this.castHighlightOption = 2; break;
						case 1: this.castHighlightOption = 0; break;
						case 2: this.castHighlightOption = 1; break;
						
					}			
				
				break;	
				
			}
			
			this.castModeHighlight(true);
		
		break;
		
	}
	
}