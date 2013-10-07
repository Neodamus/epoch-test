function aura(auraType, sourceUnit) {
	
	this.auraType = auraType;
	this.sourceUnit = sourceUnit;
	
	this.stats = ability.abilityStats(auraType);
	/* aura specific ability stats
	
		auraRadius (required) -		sets radius of aura
		
		auraMode (required) - 		moving: units gain aura effect when in it, lose it when leaving it, no buff
									proc: units gain buff when entering aura or on turn if aura has a turn proc
		
		auraTime - 					number of turns aura is active, 0 if always on
									
		auraTarget - 				ally, enemy, or both
									
		auraSelf -					true if aura affects sourceUnit
		
		auraNumProcs - 				number of times aura can proc per turn
						
		auraTurnProc -				true if aura should proc on new turn
			
	*/
	
	// required properties
	this.radius = this.stats.auraRadius;
	this.mode = this.stats.auraMode;
	
	// optional properties
	this.time;
	this.numProcs;
	this.turnProc;
	
	// sets all properties if they're enabled
	if (this.stats.auraTime != undefined) { this.time = this.stats.auraTime; }
	if (this.stats.auraNumProcs != undefined) { this.numProcs = this.stats.auraNumProcs; }
	if (this.stats.auraTurnProc != undefined) { this.turnProc = this.stats.auraTurnProc; }
	
	this.auraTiles = [];							// tiles affected by aura
	this.unitsList = [];							// units affected by aura
	
	this.setAuraTiles();
	
}


aura.prototype.setAuraTiles = function() {

	// set new aura tiles
	sourceGrid = GridSpot[this.sourceUnit.x][this.sourceUnit.y];
	this.auraTiles = GameBoard.AreaSelect(sourceGrid, this.stats.auraRadius);
	
	// set new units list
	this.unitsList.splice();	
	for (var i = 0; i < this.auraTiles.length; i++) {
		
		var auraTile = this.auraTiles[i];
		var auraUnit = auraTile.currentUnit;
		
		if (auraUnit != null) { 
		
			// if the aura is moving aura, it will remove buffs from old units and add it to new ones; if its proc aura, it will run proc
			if (this.mode == "moving") {
				this.unitsList.push(auraUnit); 
			} else if (this.mode == "proc") {
				this.proc(auraTile);
			}
		}
	}	
}


aura.prototype.proc = function(auraTile) {	
	
	new newBuff(this.auraType, auraTile, this);	
	
}


aura.prototype.turn = function() {
	
	if (this.numProcs != null) { this.numProcs = this.stats.auraNumProcs; }
	
	if (this.turnProc) { 
		for (var i = 0; i < this.unitsList.length; i++) {
			var gridTile = GridSpot[this.unitsList[i].x][this.unitsList[i].y];
			this.proc(gridTile);
		}
	}
	
	if (this.time != null) { 
		this.time--;
		if (this.time == 0) { this.sourceUnit.setAura(this, "off"); }
	}
	
}


aura.prototype.moveInto = function(gridTile) {
	
	switch (this.mode) {
	
		case "moving":
		
		break;	
		
		case "proc":
		
			this.proc(gridTile);
		
		break;
		
	}
	
}


aura.prototype.contains = function(gridTile) {
	
	var contain = false;
	
	for (var i = 0; i < this.auraTiles.length; i++) {
		if (this.auraTiles[i] == gridTile) { contain = true; }
	}
	
	return contain;
	
}


aura.prototype.draw = function() {
	
	for (var i = 0; i < this.auraTiles.length; i++) {
		var auraTile = this.auraTiles[i];
		_.context.globalAlpha = 0.5;
		_.context.drawImage(Images[10], auraTile.Positionx, auraTile.Positiony, auraTile.width, auraTile.height);		
	}	
}