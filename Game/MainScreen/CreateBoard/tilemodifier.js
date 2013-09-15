


function tileModifier(sourceUnit, name) 
{  
 if (name != 'undefined' && name != null && name != "" && name != "0") {
	this.sourceUnit = sourceUnit;
	this.name = name; //used to get aura stats
	this.tileList = new Array();
	var values = ability.abilityStats(name);
	this.customValue = new Array();
	for (var i = 0; i < values.length; i++) { this.customValue.push(values[i]); } }
}

/*case "Panic Aura": 
					customValue[0] = 3; 		//MaxTime
					customValue[1] = 3; 		//CurrentTime
					customValue[2] = "both";    //buff visibility
					cusomValue[3] = false;      //Does it stack?
					customValue[4] = 1; 	    //total-How many units can it affect per turn
					customValue[5] = 4;         //range of aura
					customValue[6] = 1;         //current-How many units can it affect per turn
					customValue[7] = "enemy"    //alliance that aura gets applied to, compared to sourceUnit (aura)
					return customValue; 		*/	




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
		currentUnit.currentTileMods.push(this);
		var buffIt = new newBuff("Panic Aura", currentUnit, this.sourceUnit); //change source unit to  "this"
		}
		break;
		
		case "move": //if a unit gains aura by moving into area..
		if (listContains(currentUnit.currentTileMods, this) == false) { // <---------- THIS IS IF THE AURA DOES NOT STACK!
		currentUnit.currentTileMods.push(this);
		var buffIt = new newBuff("Panic Aura", currentUnit, this.sourceUnit);
		}
		break;
		
		
		case "remove": //if aura is removed from unit...
			var unitIsWithinAura = false;
			if (this.tileList != null) {
		    for (var i = 0; i < this.tileList.length; i++) {
			if (currentUnit.x == this.tileList[i].x && currentUnit.y == this.tileList[i].y)
			{ unitIsWithinAura = true; break; } } }
			
			if (unitIsWithinAura == false) {    // <---------------- THIS IS IF THE AURA HAS NO BUFF COOLDOWN?? IDK LOOK AT THIS.
				var rem = listReturnArray(currentUnit.currentTileMods, this);
				currentUnit.currentTileMods.splice(rem, 1);
					for (var i = 0; i < currentUnit.buffList.length; i++) {
			
						if (currentUnit.buffList[i].buffType == this.name){
							currentUnit.buffList[i].eventProc("Removal"); } }
							 console.warn("remove");
				}
				
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
		/*	
		case "delete":
			//removes aura from unit... (recommended that you use this."off" first.)
			var rem = listReturnArray(this.sourceUnit.auras, this);
			if (rem != -1) { this.sourceUnit.auras.splice(listReturnArray(this.sourceUnit.auras, this), 1); } //removes the aura from origin unit
			break;
			
		case "add":
			//adds aura to unit(this is not the aura effect, this is giving the unit the origin aura...
			this.sourceUnit.auras.push(this);*/
	}
}

