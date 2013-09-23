function ability() { 
 
	this.abilityName;
	this.currentAbility;					// { name, cooldown }
	this.currentAbilityStats;				// holds the current ability's stats (changeable)
	this.specialAbilityList(); 
	this.sourceUnit;
	
	this.castMode = false;					// true if in castmode, false if not
	this.castType = "single";				// type of casting area, ie: single, line, radius, chain
	this.castTarget = GridSpot[0][0];		// holds current targeted gridspot, also the center of a highlight area
	this.castTargetList = []; 				// holds list of targeted gridspots
	this.castTargeOption = 0;				// used for changing the area select, ie: turning line cast different ways, determining radius

}



ability.prototype.abilityStats = function(abilityName)
{
	
	switch(abilityName){
		
		case "Arrowsmith":
		
			stats = {
				cooldown: 3,
				movementCost: 1,
				tileTarget: "ally",
				auraTarget: "ally",
				lifetime: 1,
				auraRange: 1,
				duration: 1,
				attacks: 1			
			}
			
			return stats;
		
		case "Ambush":
		
			stats = {
				damageMultiplier: 1.5
			}
			
			return stats;
		
		case "Bark Armor":
		
			stats = {
				cooldown: 3,
				movementCost: 1,
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
				cooldown: 3,
				movementCost: 2,
				target: "enemy",
				duration: 2,
				range: 3,
				sight: 1				
			}
			
			return stats;
					
		case "Condense":	
					
			stats = {
				cooldown: 4,
				movementCost: 2,
				duration: 3,
				life: 2
			}
			
			return stats; 
					
		case "Creeping Vines":	
					
			stats = {
				cooldown: 3,
				movementCost: 3,
				target: "any",
				tileTarget: "enemy",
				hidden: true,
				lifetime: 3,
				duration: 1,
				damage: 2,
				range: 5
			}
			
			return stats; 
			
		case "Energy Field":
		
			stats = {
				cooldown: 4,
				movementCost: 3,
				target: "any",
				tileTarget: "both",
				duration: 2,
				lifetime: 2,
				radius: 1,
				range: 3
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
				cooldown: 2,
				lifeCost: 3,
				target: "enemy",
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
				cooldown: 3,
				movementCost: 3,
				target: "any",
				tileTarget: "both",
				lifetime: 3,
				duration: 3,
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
				cooldown: 2,
				movementCost: 3,
				target: "ally",
				hitpoints: 6,
				range: 3
			} 
			
			return stats;
					
		case "Haste":	
					
			stats = {
				cooldown: 3,
				movementCost: 2,
				target: "ally",
				duration: 3,
				speed: 3,
				range: 4
			}
			
			return stats;
			
		case "Magma Trap":
		
			stats = {
				cooldown: 2,
				movementCost: 2,
				target: "tile",
				duration: 2,
				range: 3,
				damage: 2,
				lifetime: 6,
				stacks: true
			}
			
			return stats;
			
		case "Mirror Image":
		
			stats = {
				cooldown: 3,
				movementCost: 2,
				targetSelf: true,
				target: "ally",
				targets: 2,
				range: 4
			}
			
			return stats;
			
		case "Mist":
		
			stats = {
				cooldown: 4,
				movementCost: 4,
				target: "any",
				tileTarget: "ally",
				duration: 3,
				lifetime: 3,
				radius: 1,
				range: 4,
				blocks: 1
			}
			
			return stats;	
					
		case "Panic Aura": 
		
			stats = {
				tileTarget: "enemy",
				duration: 3,
				unitAffectNumber: 1,
				auraRange: 2,
				stacks: false
			}
			
			return stats;
					
		case "Polarity":
		
			stats = {
				cooldown: 2,
				movementCost: 4,
				targetSelf: true,
				target: "ally",
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
				cooldown: 2,
				movementCost: 4,
				duration: 3,
				damage: 4,
				range: 2
			}
			
			return stats;	
					
		case "Rain Shield":	
					
			stats = {
				cooldown: 3,
				movementCost: 2,
				target: "ally",
				duration: 3,
				range: 4,
				defense: 2,
				blocks: 3
			}
			
			return stats; 
					
		case "Rapid Strikes": 
					
			stats = {
				cooldown: 2,
				attacks: 2
			}
			
			return stats;	
					
		case "Second Wind":
					
			stats = {
				cooldown: 3,
				speed: 3
			}
			
			return stats;
					
		case "Sentry": 
		
			stats = {
				cooldown: 3,
				movementCost: 1,
				tileTarget: "enemy",
				auraRange: 3,
				duration: 2,
				attacks: 3,
				damage: 3
			}
			
			return stats;
			
		case "Smoke Screen":
		
			stats = {
				cooldown: 3,
				movementCost: 3,
				target: "any",
				tileTarget: "both",
				lifetime: 3,
				duration: 3,
				range: 3,
				radius: 1
			}
			
			return stats;
					
		case "Soulfire": 
					
			stats = {
				cooldown: 3,
				movementCost: 2,
				target: "ally",
				duration: 3,
				hitpoints: 2,
				range: 5
			}
			
			return stats;	
					
		case "Static":	
					
			stats = {
				cooldown: 2,
				movementCost: 3,
				target: "ally",
				duration: 2,
				damage: 2,
				range: 4
			}
			
			return stats;	
		
		case "Stealth":	
					
			stats = {
				cooldown: 3,
			}
			
			return stats;	
		
		case "Stomp":	
					
			stats = {
				cooldown: 3,
				movementCost: 2,
				duration: 2,
				speed: -2,
				radius: 1
			}
			
			return stats;	
			
		case "Teleport":	
					
			stats = {
				cooldown: 6,
				target: "tile",
				range: 6
			}
			
			return stats;	
			
		case "Thunderclap":	
					
			stats = {
				cooldown: 3,
				movementCost: 3,
				target: "both",
				range: 1
			}
			
			return stats;							
					
		case "Torch": 
		
			stats = {
				cooldown: 3,
				movementCost: 3,
				target: "ally",
				duration: 3,
				reveal: 2,
				range: 4				
			}
			
			return stats;
					
		case "Wound":
		
			stats = {
				cooldown: 2,
				movementCost: 1,
				duration: 3,
				speed: -2,
				range: 4
			}
			
			return stats;				

  return null; } }
  
  

ability.prototype.specialAbilityList = function() { 
this.noCastList = new Array();  //List of abilities that cannot be casted.
this.noCastList.push("Engulf", "Panic Aura");

this.twoTargetList = new Array(); //List of abilities that require two clicks.
this.twoTargetList.push("Polarity", "test1");
}



ability.prototype.cast = function(ability, sourceSpot) //Ability is clicked-> Ability setup or cast.
{	
	this.currentAbility = ability;
	this.abilityName = ability.name;
	this.currentAbilityStats = this.abilityStats(this.abilityName);
	
	// maintains the casting source in case of multiple targets
	if (this.castMode == false) {
		this.sourceSpot = sourceSpot
		if (this.sourceSpot != null) { this.sourceUnit = this.sourceSpot.currentUnit;}
	}
	
	if (this.canCast()) { this.castMode = true; } else { return null; }
	
	var finished = null;
	if (listContains(this.noCastList, this.abilityName) == true) { return null; }
	
	var selfTarget = sourceSpot;		// used for when the caster grid is needed

	switch (this.abilityName) {
	
		case "Arrowsmith":
			this.castTarget = selfTarget;
			this.finishCast();
			finished = true;
			break;	
		
		case "Bark Armor":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
	
		case "Blind":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			break;
		
		case "Condense":
			this.castTarget = selfTarget;
			this.finishCast();
			finished = true;
			break;
			
		case "Creeping Vines":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			this.castType = "line";									
			break;	
			
		case "Energy Field":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			this.castType = "radius";
			this.castTargeOption = this.currentAbilityStats.radius;									
			break;
		
		case "Entanglement":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;		
		
		case "Exothermia":
			this.castTarget = selfTarget;
			this.finishCast();
			finished = true;
			break;
			
		case "Fire Wall":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			this.castType = "line";									
			break;
			
		case "Haste":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
		
		case "Heal":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
			
		case "Magma Trap":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
			
		case "Mirror Image":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			if (this.castTargetList.length == 1) { this.currentAbilityStats.target = "tile"; this.currentAbilityStats.targetSelf = false; }				
			break;
			
		case "Mist":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			this.castType = "radius";
			this.castTargeOption = this.currentAbilityStats.radius;									
			break;
			
		case "Polarity":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
			
		case "Precision":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			break;
		
		case "Rain Shield":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
	
		case "Rapid Strikes":
			this.castTarget = selfTarget;
			this.finishCast();
			finished = true;
			break;
			
		case "Second Wind":
			this.castTarget = selfTarget;
			this.finishCast();
			finished = true;
			break;
	
		case "Sentry":
			this.castTarget = selfTarget;
			this.finishCast();
			finished = true;
			break;		
			
		case "Smoke Screen":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			this.castType = "radius";
			this.castTargeOption = this.currentAbilityStats.radius;									
			break;
			
		case "Soulfire":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			break;
			
		case "Static":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
		
		case "Stealth":
			this.castTarget = selfTarget;
			this.finishCast();
			finished = true;
			break;
		
		case "Stomp":
			this.castTargetList = this.AreaSelect(selfTarget, this.currentAbilityStats.radius);
			this.finishCast();
			finished = true;			
			break;
			
		case "Teleport":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
		
		case "Thunderclap":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;						
			break;
		
		case "Torch":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
			finished = false;
			break;	
		
		case "Wound":
			this.sourceUnit.abilityMarkers("on", this.currentAbilityStats.range);
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
		var target = this.currentAbilityStats.target;	// holds whether target needs to be ally, enemy, or both
	}
	
	// multi target casting -- ex. polarity
	if (this.currentAbilityStats.targets != null && this.targetSpot.abilityMarker == true && this.targetUnit != null) {	
	
		if ((this.targetUnit == this.sourceUnit == this.currentAbilityStats.targetSelf) || this.targetUnit != this.sourceUnit) {	
		
			// -------------- ADD IN SAME TARGET PREVENTER HERE
		
			if (target == "ally") {
				
				if (this.targetUnit.alliance == this.sourceUnit.alliance) {			
					
					this.castTargetList.push(this.castTarget);
					
					if (this.castTargetList.length < this.currentAbilityStats.targets) { 
						this.cast(this.currentAbility, this.sourceUnit);
						return false; 				
					} else {
						this.finishCast();
					}	
					
				} else {
					
					alert("You can't use " + this.abilityName + " on an enemy")
					return false;				
					
				}
			
			} else if (target == "enemy") {
				
				if (this.targetUnit.alliance != this.sourceUnit.alliance) {				
					
					this.castTargetList.push(this.castTarget)
					
					if (this.castTargetList.length < this.currentAbilityStats.targets) {
						this.cast(this.currentAbility, this.sourceUnit); 
						return false; 				
					} else {
						this.finishCast();
					}					
					
				} else {
					
					alert("You can't use " + this.abilityName + " on an ally")	
					return false			
					
				}				
				
			} else if (target == "both") {
				
				this.castTargetList.push(this.castTarget)
				
				if (this.castTargetList.length < this.currentAbilityStats.targets) { 
					this.cast(this.currentAbility, this.sourceUnit);
					return false; 				
				} else {
					this.finishCast();
				}			
				
			} else if (target == "tile") {
							
				alert("You cannot target a tile with a unit on it");
				return false;		
				
			}
			
		} else {
			
			alert("You cannot target yourself");
			return false;
			
		}
	} else if (this.currentAbilityStats.targets != null && this.targetSpot.abilityMarker == true && this.targetUnit == null) {
		
		if (this.currentAbilityStats.target == "tile") {
			
			this.castTargetList.push(this.targetSpot);		
					
			if (this.castTargetList.length < this.currentAbilityStats.targets) { 
				this.cast(this.currentAbility, this.sourceUnit);
				return false; 				
			} else {
				this.finishCast();
			}	
			
		} else {
			
			alert ("You must target a unit");
			return false;
			
		}
					
	}
	
	// single target casting
	if (this.targetSpot.abilityMarker == true && customValue.target == "any") {
		
		this.finishCast();			
		finished = true;
		
	} else if (this.targetSpot.abilityMarker == true && this.targetUnit != null) {		
		
		if (target == "ally") {
		
			if (this.targetUnit.alliance == this.sourceUnit.alliance) {
				
			    this.finishCast();
				finished = true;
				
			} else { // target is an enemy with an ally buff
			
				this.removeMarkers();
				alert("You can't use " + this.abilityName + " on an enemy")
				finished = true;
			
			}
			
		} else if (target == "enemy") {
			
			if (this.targetUnit.alliance != this.sourceUnit.alliance) {
				
			    this.finishCast();
				finished = true;
				
			} else { // target is an ally with an enemy buff

				this.removeMarkers();			
				alert("You can't use " + this.abilityName + "on an ally");
				finished = true;
			
			}			
			
		} else { // target = both
			
			this.finishCast();
			finished = true;			
			
		}
		
	} else if (this.targetSpot.abilityMarker == true && this.targetUnit == null) {	// tile casting
		
		if (this.currentAbilityStats.target == "tile") {		
			this.finishCast();	
			finished = true;
		} else { 
			alert("You must target an " + this.currentAbilityStats.target);
			return false;
		}
	
	} else {
		
		this.removeMarkers();
		Ui.abilityClickOff();
		
	}
	
	if (finished == null) { this.removeMarkers(); }
	return finished; //require another click
}


// determines if an ability can be cast
ability.prototype.canCast = function() {
	
	var canCast = true;
	
	if (this.currentAbility.cooldown != 0) { canCast = false; }
	
	if (this.currentAbilityStats.lifeCost != undefined) { 	
		if (this.sourceUnit.currentStats[1] - this.currentAbilityStats.lifeCost <= 0) { canCast = false; }
	} else if (this.currentAbilityStats.movementCost != undefined) {
		if (this.sourceUnit.currentStats[4] - this.currentAbilityStats.movementCost < 0) { canCast = false; }
	} else if (this.currentAbilityStats.attackCost != undefined) {
		if (this.sourceUnit.currentStats[8] - this.currentAbilityStats.attackCost < 0) { canCast = false; }
	}
	
	return canCast;

}


ability.prototype.finishCast = function() {
	
	combatLog.push(ability.sourceUnit.name + " has casted ability(" + ability.abilityName + ").");	
		
	if (this.castTargetList.length == 0) {				
		new newBuff (this.abilityName, this.castTarget, this.sourceUnit);
	} else {
		new newBuff (this.abilityName, this.castTargetList, this.sourceUnit);
	}
	
	// decrease ability costs
	this.currentAbility.cooldown = this.currentAbilityStats.cooldown;	
	if (this.currentAbilityStats.lifeCost != undefined) { this.sourceUnit.currentStats[1] -= this.currentAbilityStats.lifeCost; }
	if (this.currentAbilityStats.movementCost != undefined) { this.sourceUnit.currentStats[4] -= this.currentAbilityStats.movementCost; }
	if (this.currentAbilityStats.attackCost != undefined) { this.sourceUnit.currentStats[8] -= this.currentAbilityStats.attackCost; }
	
	if (ClientsTurn) { this.sendAbility(); }	// must be before removeMarkers	
	this.removeMarkers();
}



ability.prototype.removeMarkers = function()
{
	if (this.castMode == true) {
		this.sourceUnit.abilityMarkers("off", this.currentAbilityStats.range);
		Ui.abilityClickOff();
		this.castMode = false;
		this.castTarget.abilitySelectMarker = false;
	}
	
	this.castType = "single";
	
	if (this.castTargetList.length > 0) {
		for (i = 0; i < this.castTargetList.length; i++) { this.castTargetList[i].abilitySelectMarker = false; }		
		this.castTargetList = [];
	}
	
	this.castTargeOption = 0;
}



ability.prototype.castModeHighlight = function(option) {
	
	var mousePosition = { x: Mouse.x, y: Mouse.y };
	
	if (this.castMode)	{
		
		if (this.castTarget.ThisRectangle.Contains(mousePosition) == false || option == true) {
			
			// remove marker
			this.castTarget.abilitySelectMarker = false;
			
			// if it's an area highlight, turn off the list and empty it
			if (this.castTargetList.length > 0) { 
				for (i = 0; i < this.castTargetList.length; i++) { this.castTargetList[i].abilitySelectMarker = false; }
			}
			
			// find a new highlight
			var mouseOnBoard = false;
			
			for (i = 0; i < gridSpotList.length; i++) {
				
				gridSpot = gridSpotList[i];	
				
				if (gridSpot.ThisRectangle.Contains(mousePosition) == true) {
					this.castTarget = gridSpot;
					mouseOnBoard = true;	
				}
				
			}
			
			if (mouseOnBoard) {
				
				switch(this.castType) {
				
					case "single":
					
						this.castTarget.abilitySelectMarker = true;
						
					break;
						
					case "line":
					
						this.castTargetList = this.specialAreaSelect(this.castTarget, 2, this.castTargeOption);
							
						for (i = 0; i < this.castTargetList.length; i++) {
							this.castTargetList[i].abilitySelectMarker = true;	
						}					
					
					break;
						
					case "radius":
					
						this.castTargetList = this.AreaSelect(this.castTarget, this.castTargeOption);
							
						for (i = 0; i < this.castTargetList.length; i++) {
							this.castTargetList[i].abilitySelectMarker = true;	
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
							if (x > 0) { gridList.push(GridSpot[x - i][y]); }
							if (x < 14) { gridList.push(GridSpot[x + i][y]); }
						}
						
					break;
					
					case 1:
					
						for (i = 1; i <= numberOfTiles / 2; i++) {
							
							if (y % 2 == 0) {
							
								if (x > 0 && y > 0) { gridList.push(GridSpot[x - i][y - i]); }
								if (y < 14) { gridList.push(GridSpot[x][y + i]); } 
								
							} else {
							
								if (y > 0) { gridList.push(GridSpot[x][y - i]); }
								if (x < 14 && y < 14) { gridList.push(GridSpot[x + i][y + i]); }
							
							}
						}
						
					break;
					
					case 2:
					
						for (i = 1; i <= numberOfTiles / 2; i++) {
							
							if (y % 2 == 0) {
							
								if (y > 0) { gridList.push(GridSpot[x][y - i]); }
								if (x > 0 && y < 14) { gridList.push(GridSpot[x - i][y + i]); } 
								
							} else {
							
								if (x < 14 && y > 0) { gridList.push(GridSpot[x + i][y - i]); }
								if (y < 14) { gridList.push(GridSpot[x][y + i]); }
							
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
				
					switch (this.castTargeOption) {
					
						case 0: this.castTargeOption = 1; break;
						case 1: this.castTargeOption = 2; break;
						case 2: this.castTargeOption = 0; break;
						
					}
				
				break;
				
				case "down":
				
					switch (this.castTargeOption) {
					
						case 0: this.castTargeOption = 2; break;
						case 1: this.castTargeOption = 0; break;
						case 2: this.castTargeOption = 1; break;
						
					}			
				
				break;	
				
			}
			
			this.castModeHighlight(true);
		
		break;
		
	}
	
}



ability.prototype.sendAbility = function() {
	
	var ability = this.abilityName;
	var target = [];	// always send targets as array	
	var source = { x: this.sourceUnit.x, y: this.sourceUnit.y };
	
	if (this.castTargetList.length == 0) {
		
		target.push({ x: this.castTarget.x, y: this.castTarget.y });
		
	} else {
		
		for (i = 0; i < this.castTargetList.length; i++) {
			target.push( { x: this.castTargetList[i].x, y: this.castTargetList[i].y } );
		}
	}
	
	packet = [ability, target, source];
	
	sendPacket("ability", packet);
	
}



ability.prototype.receiveAbility = function(packet) {
	
	var ability = packet[0];
	var target = packet[1];
	var source = packet[2];
	
	this.abilityName = ability;
	this.sourceUnit = GridSpot[source.x][source.y].currentUnit;
	
	if (target.length == 1) {
		
		this.castTarget = GridSpot[target[0].x][target[0].y];
			
	} else {
		
		for (i = 0; i < target.length; i++) {
			this.castTargetList.push(GridSpot[target[i].x][target[i].y]);
		}
		
	}
	
	this.finishCast();
	
}