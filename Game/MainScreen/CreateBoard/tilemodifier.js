


function tileModifier(sourceUnit, name) 
{  

this.sourceUnit = sourceUnit;
this.name = name; //used to get aura stats
this.tileList = new Array();

var values = abilites.abilityStats(name);
this.customValues = new Array();
for (var i = 0; i < values.length; i++) { this.customValue.push(values[i]); }
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
		
		break;
		
		case "move": //if a unit gains aura by moving into area..
		
		break;
		
		
		case "remove": //if aura is removed from unit...
	
		//other possible cases:     move but already has aura...
	}

}

tileModifier.prototype.affectedTiles = function(Instructions)
{
	switch(Instructions[0]) {
	
		case "on":
			if (tileList instanceof Array) {for (var i = 0; i < Instructions[1].length; i++) { this.tileList.push(Instructions[1][i]); } } // needs to push all tiles affected...
			else { this.tileList = tileList; } //if tile list is just one tile .. push
		
			for (var i = 0; i < this.tileList.length; i++) { this.tileList[i].tileBuffList.push(this); } //adding tile effects to grid
			break;
		
		case "move":
			//this is used for moving auras without a second buff.initialization occurring.
			for (var i = 0; i < this.tileList.length; i++) { var rem = listContains(Instructions[1], this.tileList[i];
			if (rem == -1) { this.tileList.splice(rem, 1); } } // check if instruction has tilelist, if it doesn't, remove it.
			break;
		
		case "off":
			//remove from all tiles...
			for (var i = 0; i < this.tileList.length; i++) { var rem = listContains(this.tileList[i].tileBuffList, this);
			if (rem != -1) { this.tileList[i].tileBuffList.splice(rem, 1); } } // remove tile effects from each grid -
			break;
			
		case "delete":
			//removes aura from unit
			var rem = listContains(this.sourceUnit.auras, this);
			if (rem != -1) { this.sourceUnit.auras.splice(rem, 1); }
			break;
			
		case "add":
			//adds aura to unit
			this.sourceUnit.auras.push(this);
	}
}

