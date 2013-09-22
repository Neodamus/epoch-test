function tileModifier(sourceUnit, name) 
{  
	if (name != 'undefined' && name != null && name != "" && name != "0") {
		this.sourceUnit = sourceUnit;
		this.name = name; //used to get aura stats
		this.tileList = new Array();
		var values = ability.abilityStats(name);
		
		this.attachedBuff;
		
		this.stats = ability.abilityStats(name).clone()
		//this.stats = values;
		GameBoard.tileModifierList.push(this);
	}

}


tileModifier.prototype.turnRefresh = function(alliance)
{
	//if (alliance == this.sourceUnit.alliance)
		{
			if (this.stats.lifetime != 'undefined' && this.stats.lifetime != null)
				{
					this.stats.lifetime--; console.warn(this.stats.lifetime);
					if (this.stats.lifetime <= 0) {
					var Instructions = new Array(); Instructions.push("off");
					this.affectedTiles(Instructions); }
				}
		}

}

tileModifier.prototype.eventProc = function(procedure, currentUnit) {

	switch(procedure) {
	
		case "initialize": 
		
		if (listContains(currentUnit.currentTileMods, this) == false) {
			
			// checks aura targets to verify it should be initialized
			if ((currentUnit.alliance == this.sourceUnit.alliance && this.stats.tileTarget == "ally") || 
					(currentUnit.alliance != this.sourceUnit.alliance && this.stats.tileTarget == "enemy") || this.stats.tileTarget == "both") {
						
				currentUnit.currentTileMods.push(this);
				
				var exists = false;
				for (var i = 0; i < currentUnit.buffList.length; i++) { if (currentUnit.buffList[i].buffType == this.name) { exists = true; } }
				
				//if (exists == false || this.stats.stacks != undefined && this.stats.stacks == true) { 
							
				var buffIt = new newBuff(this.name, GridSpot[currentUnit.x][currentUnit.y], this); //}
			}
		}
		break;
		
		case "move": //if a unit gains aura by moving into area..
		//console.warn(procedure);
		if (listContains(currentUnit.currentTileMods, this) == false) {
			
			// checks tileTarget to verify it should be initialized
			if ((currentUnit.alliance == this.sourceUnit.alliance && this.stats.tileTarget == "ally") || 
					(currentUnit.alliance != this.sourceUnit.alliance && this.stats.tileTarget == "enemy") || this.stats.tileTarget == "both") {
						
				currentUnit.currentTileMods.push(this); 
				
				var exists = false;
				for (var i = 0; i < currentUnit.buffList.length; i++) { if (currentUnit.buffList[i].buffType == this.name) { exists = true; } }
				
				//if (exists == false || this.stats.stacks != undefined && this.stats.stacks == true) {
				var buffIt = new newBuff(this.name, GridSpot[currentUnit.x][currentUnit.y], this); //}
			}
		}
		
		break;
		
		
		case "remove": //if aura is removed from unit...
		// console.warn(currentUnit.currentTileMods);
			var unitIsWithinAura = false;
			if (this.tileList != null) {
		    for (var i = 0; i < this.tileList.length; i++) {
				if (currentUnit.x == this.tileList[i].x && currentUnit.y == this.tileList[i].y)
					{ unitIsWithinAura = true; break; } } }
			
				if (unitIsWithinAura == false) {    // <---------------- THIS IS IF THE AURA HAS NO BUFF COOLDOWN?? IDK LOOK AT THIS.
					var rem = listReturnArray(currentUnit.currentTileMods, this);
					if (rem != -1) {
					currentUnit.currentTileMods.splice(rem, 1); }
				
				var exists = false;
				for (var i = 0; i < currentUnit.currentTileMods.length; i ++) { if (currentUnit.currentTileMods[i].name == this.name) { exists = true; } }
					
					if (exists == false) {
					for (var i = 0; i < currentUnit.buffList.length; i++) {
			
						if (currentUnit.buffList[i].buffType == this.name && this.stats.duration == null){
							if (currentUnit.buffList[i].eventProc("Removal") == true) { i--; } } } } }
				
		break;
		
	}

}

tileModifier.prototype.affectedTiles = function(Instructions)
{	//if (this.tileList instanceof Array) {} else { var t = Instructions; Intructions = new Array(); Instructions.push(t); } ??
	switch(Instructions[0]) {
	
		case "on":
			
			if (this.tileList instanceof Array) {for (var i = 0; i < Instructions[1].length; i++) { this.tileList.push(Instructions[1][i]); } } // needs to push all tiles affected...
			else { this.tileList.push(Instructions[1]);  } //if tile list is just one tile .. push
		   // console.warn(this.tileList);
			for (var i = 0; i < this.tileList.length; i++) { 
			
			this.tileList[i].tileBuffList.push(this); } //adding tile effects to grid
			for (var i = 0; i < this.tileList.length; i++) { this.tileList[i].tileModifiers(this, "initialize"); }
			
			break;
			
		case "move":

			for (var i = 0; i < Instructions[1].length; i++) { 
				
				if (listContains(this.tileList, Instructions[1][i]) == false) { 
					
					Instructions[1][i].tileBuffList.push(this);
					Instructions[1][i].tileModifiers(this, "move"); 
					this.tileList.push(Instructions[1][i]);}
			 } 
			
			var oldUnitList = new Array();
			
			for (var i = 0; i < this.tileList.length; i++) {
				if (listContains(Instructions[1], this.tileList[i]) == false) { 
				
					var remTile = listReturnArray(this.tileList[i].tileBuffList, this);
					
					if (remTile != -1) { this.tileList[i].tileBuffList.splice(remTile, 1); }
					
					if (this.tileList[i].currentUnit != null) { oldUnitList.push(this.tileList[i].currentUnit);  }

					this.tileList.splice(i, 1); i--;  //i-- because the tileList is changing within,
				}
			}
			for (var i = 0; i < oldUnitList.length; i++) {  this.eventProc("remove", oldUnitList[i]); } //remove from units
			break;
		
			
		case "off":
			//remove from all tiles...
			var oldUnitList = new Array();
			for (var i = 0; i < this.tileList.length; i++) { 
			
				this.tileList[i].tileModifiers(this, "remove");
				if (this.tileList[i].currentUnit != null) { oldUnitList.push(this.tileList[i].currentUnit); }
				
				var rem = listReturnArray(this.tileList[i].tileBuffList, this);
				if (rem != -1) { this.tileList[i].tileBuffList.splice(rem, 1); } }
			
			this.tileList = null;
			for (var i = 0; i < oldUnitList.length; i++) {  this.eventProc("remove", oldUnitList[i]); }//remove from units
			
			var rem = listReturnArray(GameBoard.tileModifierList, this); //removing this tilemodifier from the list of all tilemods on board.
			if (rem != -1) { GameBoard.tileModifierList.splice(rem, 1); } else { alert("splicing modifier error, in OFF of tileModClass"); }
		
			break;

	}
}

tileModifier.prototype.draw = function(context, canvas) {
	
	for (var i = 0; i < this.tileList.length; i++) {
		
		context.drawImage(returnTileImage(this.name), this.tileList[i].ThisRectangle.x, this.tileList[i].ThisRectangle.y, this.tileList[i].ThisRectangle.width, this.tileList[i].ThisRectangle.height);
		
		}
		
	

}

