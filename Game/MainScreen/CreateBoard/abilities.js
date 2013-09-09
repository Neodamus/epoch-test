


function ability() { this.abilityBeingCasted = false; this.specialAbilityList(); 
this.sourceUnit;
this.targetSpot2 = GridSpot[0][0];

}

ability.prototype.abilityStats = function(abilityName)
{
  var customValue = new Array(0, 0, 0, 0, 0, 0);
  switch(abilityName){
		case "Engulf": 
					customValue[0] = 3; 		//MaxTime
					customValue[1] = 3; 		//CurrentTime
					customValue[2] = "both";    //buff visibility
					cusomValue[3] = false;      //Does it stack?
					customValue[4] = 1; 	    //Damage dealt to attachedUnit
					customValue[5] = 0;         //range
					return customValue; 
					
		case "Torch": 
					customValue[0] = 3; 		//MaxTime
					customValue[1] = 3; 		//CurrentTime
					customValue[2] = "both";    //buff visibility
					customValue[3] = false;      //Does it stack?
					customValue[4] = 3; 		//reveal buffstats
					customValue[5] = 3;			//cast range
					customValue[6] = "local sight"//requirements for casting (note: sight is local to the unit, other unit's sight cannot be used)
					return customValue; 
					
		case "Soulfire": 
					customValue[0] = 3; 		//MaxTime
					customValue[1] = 3; 		//CurrentTime
					customValue[2] = "both";    //buff visibility
					customValue[3] = false;      //Does it stack?
					customValue[4] = 2; 		//life per turn
					customValue[5] = 5;			//cast range
					customValue[6] = "local sight"//requirements for casting (note: sight is local to the unit, other unit's sight cannot be used)
					return customValue; 			

  return null;
}
}
//cast time??,

ability.prototype.specialAbilityList = function() { 
this.noCastList = new Array();  //List of abilities that cannot be casted.
this.noCastList.push("Engulf", "Panic Aura");

this.twoTargetList = new Array(); //List of abilities that require two clicks.
this.twoTargetList.push("test", "test1");
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



ability.prototype.cast = function(abilityName, sourceSpot)
{	
	this.abilityName = abilityName;
	this.sourceSpot = sourceSpot
	if (this.sourceSpot != null) {
	this.sourceUnit = this.sourceSpot.currentUnit;}
	
	var customValue = this.abilityStats(this.abilityName);
	
	var finished = null;
	if (listContains(this.noCastList, this.abilityName) == true) { return null; }

	switch(this.abilityName){
		case "Torch":
			//sourceUnit apply range
			   this.sourceUnit.abilityMarkers("on", customValue[5]);
			   finished = false;
			break;
			
		case "Soulfire":
			//sourceUnit apply range
			   this.sourceUnit.abilityMarkers("on", customValue[5]);
			   finished = false;
			break;	
	}
	
	return finished; //require another click
}



ability.prototype.targetCast = function(targetSpot) // if finished returns true, send it off to server, if not... wait for another click?
{	

     var customValue = this.abilityStats(this.abilityName);
	
	this.targetSpot = targetSpot;
	
	if (this.sourceSpot != null) {
	this.targetUnit = this.targetSpot.currentUnit; }
	var finished = null; //if it only requires one target, finished = true;
	
	
	
	if (listContains(this.twoTargetList, this.abilityName) == true) { return false; }
	switch(this.abilityName){
		case "Torch":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance){
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue[5]);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue[5]); finished = false; Ui.abilityClickOff(); }
			//else { this.sourceUnit.abilityMarkers("off", customValue[5]); }
			break;
			
		case "Soulfire":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance){
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue[5]);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue[5]); finished = false; Ui.abilityClickOff(); }
			//else { this.sourceUnit.abilityMarkers("off", customValue[5]); }
			break;	
	}
	if (finished == null) { this.removeMarkers(); }
	return finished; //require another click
}



ability.prototype.removeMarkers = function()
{
	if (this.abilityName != null){
	var customValue = this.abilityStats(this.abilityName);
	if (this.sourceUnit != null && customValue[5] != null) {this.sourceUnit.abilityMarkers("off", customValue[5]); }}
}

