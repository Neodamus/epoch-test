


function tileModifier(sourceUnit, name) 
{  
 if (name != 'undefined' && name != null && name != "" && name != "0") {
this.sourceUnit = sourceUnit;
this.name = name; //used to get aura stats
this.tileList = new Array();
var values = ability.abilityStats(name);

this.stats = values;
 }
//this.customValue = new Array();
//for (var i = 0; i < values.length; i++) { this.customValue.push(values[i]); } }
}


tileModifier.prototype.turnRefresh = function(alliance)
{
	switch(alliance){
		
		case "ally" :
		//if tilemod is ally do:
		break;
		
		case "enemy" :
		// if tilemod is enemy do:
		break;
		
		case "both" :
		// do:
		break;
	}
}

tileModifier.prototype.eventProc = function(procedure, currentUnit) {

	switch(procedure) {
	
		case "initialize": //when aura is first turned on..
		 //if it is added....
		if (listContains(currentUnit.currentTileMods, this) == false) {
		currentUnit.currentTileMods.push(this); }
		
		var exists = false;
		for (var i = 0; i < currentUnit.buffList.length; i++) { if (currentUnit.buffList[i].buffType == this.name) { exists = true; } }
		
		if (exists == false) { var buffIt = new newBuff(this.name, currentUnit, this); } 
		break;
		
		case "move": //if a unit gains aura by moving into area..
		if (listContains(currentUnit.currentTileMods, this) == false) { // <---------- THIS IS IF THE AURA DOES NOT STACK!
		currentUnit.currentTileMods.push(this); }
		
		var exists = false;
		for (var i = 0; i < currentUnit.buffList.length; i++) { if (currentUnit.buffList[i].buffType == this.name) { exists = true; } }
		
		if (exists == false) {
		var buffIt = new newBuff(this.name, currentUnit, this); }
		
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
							currentUnit.buffList[i].eventProc("Removal"); } } } }
				
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

					this.tileList.splice(i, 1); i--;  //i-- because the tileList is changing within, if you wanted to be safe, change: i = 0;
				}
			}
			for (var i = 0; i < oldUnitList.length; i++) {  this.eventProc("remove", oldUnitList[i]); } //remove from units
			break;
		
			//uncompleted- passover
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
			
			break;

	}
}

