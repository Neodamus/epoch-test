function aura(auraType, sourceUnit) {
	
	this.auraType = auraType;
	this.sourceUnit = sourceUnit;
	
	this.stats = ability.abilityStats(auraType);
	
	// required properties
	this.radius = this.stats.auraRadius;
	this.mode = this.stats.auraMode;
	
	// optional properties
	this.time;						// number of turns aura lasts until turned off
	this.selfCast;		// needs to be implemented
	this.target;		// needs to be implemented
	this.numProcs = 0;					// number of times aura can proc before being turned off
	this.turnProc;					// true if aura procs on turn
	this.procsPerTurn;				// number of times aura can proc per turn, infinite if undefined
	
	// sets all properties if they're enabled
	if (this.stats.auraTime != undefined) { this.time = this.stats.auraTime; }
	if (this.stats.auraNumProcs != undefined) { this.numProcs = this.stats.auraNumProcs; }
	if (this.stats.auraTurnProc != undefined) { this.turnProc = this.stats.auraTurnProc; }
	if (this.stats.auraProcsPerTurn != undefined) { this.procsPerTurn = this.stats.auraProcsPerTurn; }
	
	this.auraTiles = [];			// tiles affected by aura -- holds grid
	this.unitsList = [];			// units affected by aura -- holds unit
	
	this.setAuraTiles();
	
}


// recalculates this.auraTiles -- ran when created and moving
aura.prototype.setAuraTiles = function() {

	// set new aura tiles
	sourceGrid = GridSpot[this.sourceUnit.x][this.sourceUnit.y];
	this.auraTiles = GameBoard.AreaSelect(sourceGrid, this.stats.auraRadius);
	
	// set new units list
	this.unitsList = [];	
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


// turns aura on and off
aura.prototype.setAura = function(toggle) {
	
	switch (toggle) {
		
		case "on":
		
			this.sourceUnit.newAuras.push(this); 
			GameBoard.auraList.push(this);
		
		break;
		
		case "off":
		
			this.sourceUnit.newAuras.splice(this.sourceUnit.newAuras.indexOf(this));
			GameBoard.auraList.splice(GameBoard.auraList.indexOf(this));
		
		break;		
	}
	
}


// procs aura
aura.prototype.proc = function(auraTile) {	

	new newBuff(this.auraType, auraTile, this);	
	
	if (this.numProcs > 0) { 
		this.numProcs--; 
		if (this.numProcs == 0) { this.setAura("off"); }
	}
	
}


aura.prototype.turn = function() {
	
	if (this.procsPerTurn != null) { this.procsPerTurn = this.stats.auraProcsPerTurn; }
	
	if (this.turnProc) { 
		for (var i = 0; i < this.unitsList.length; i++) {	
			var auraUnit = this.unitsList[i];	
			var gridTile = GridSpot[auraUnit.x][auraUnit.y];
			if (gridTile != -1) { this.proc(gridTile); }
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
		
			var movingUnit = gridTile.currentUnit;		
			if (this.unitsList.indexOf(movingUnit) == -1) { this.unitsList.push(movingUnit); }
		
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
		_.context.drawImage(Images[10], auraTile.ThisRectangle.x, auraTile.ThisRectangle.y, auraTile.ThisRectangle.width, auraTile.ThisRectangle.height);		
	}	
}