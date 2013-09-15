


function ability() { this.abilityBeingCasted = false; this.specialAbilityList(); 
this.sourceUnit;
this.targetSpot2 = GridSpot[0][0];
this.gridTargetList = new Array();
}

ability.prototype.abilityStats = function(abilityName)
{
	var customValue = new Array(8);
	switch(abilityName){
		
		case "Bark Armor":
		
			stats = {
				duration: 3,
				visibility: "both",
				stacks: false,
				defense: 2,
				range: 4
			}
			
			return stats;				  
	  
	  	case "Blind":
					customValue[0] = 3; 		// MaxTime
					customValue[1] = 3; 		// CurrentTime
					customValue[2] = "both";    // buff visibility
					customValue[3] = false;     // stacks
					customValue[4] = 1; 		// sight range
					customValue[5] = 3;			// cast range
					return customValue; 
	  
		case "Engulf": 
					customValue[0] = 3; 		//MaxTime
					customValue[1] = 3; 		//CurrentTime
					customValue[2] = "both";    //buff visibility
					customValue[3] = false;      //Does it stack?
					customValue[4] = 1; 	    //Damage dealt to attachedUnit
					customValue[5] = 0;         //range
					return customValue; 
					
		case "Precision":
					customValue[0] = 2;			// duration
					customValue[1] = "both";	// buff visibility
					customValue[2] = false;		// stacks
					customValue[3] = 3;			// attack increase
					customValue[4] = 4;			// cast range
					return customValue;
					
		case "Panic Aura": 
					customValue[0] = 3; 		//MaxTime (buff)
					customValue[1] = 3; 		//CurrentTime (buff)
					customValue[2] = "both";    //buff visibility (buff)
					customValue[3] = false;      //Does it stack? (buff)
					customValue[4] = 1; 	    //total-How many units can it affect per turn (aura)
					customValue[5] = 2;         //range of aura (aura)
					customValue[6] = 1;         //current-How many units can it affect per turn (aura)
					customValue[7] = "enemy"    //alliance that aura gets applied to, compared to sourceUnit (aura)
					return customValue; 
					
		case "Poison Tips":
		
			stats = {
				duration: 3,
				visibility: "both",
				stacks: false,
				damage: 1
			}
			
			return stats;	
					
		case "Second Wind":
					customValue[0] = 1;			// duration
					customValue[1] = "both";	// buff visibility
					customValue[2] = false;		// stacks
					customValue[3] = 3;			// movement increase
					return customValue;	
					
		case "Stomp":	
					
			stats = {
				duration: 2,
				speed: -2,
				radius: 1
			}
			
			return stats;	
			
		case "Thunderclap":	
					
			stats = {
				range: 1
			}
			
			return stats;							
					
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
					
		case "Rapid Strikes":
					customValue[0] = 3; 		//MaxTime
					customValue[1] = 3; 		//CurrentTime
					customValue[2] = "both";    //buff visibility
					customValue[3] = false;      //Does it stack?
					customValue[4] = 2; 		// additional attacks
					customValue[5] = 0;			//cast range
					return customValue; 
					
		case "Wound":
		
			stats = {
				duration: 3,
				visibility: "both",
				stacks: false,
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



ability.prototype.cast = function(abilityName, sourceSpot) //Ability is clicked-> Ability setup or cast.
{	
	this.abilityName = abilityName;
	this.sourceSpot = sourceSpot
	if (this.sourceSpot != null) {
	this.sourceUnit = this.sourceSpot.currentUnit;}
	
	var customValue = this.abilityStats(this.abilityName);
	
	var finished = null;
	if (listContains(this.noCastList, this.abilityName) == true) { return null; }

	switch(this.abilityName){
		
		case "Bark Armor":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
	
		case "Rapid Strikes":
			 //this.sourceUnit.abilityMarkers("on", customValue[5]); casting is not needed
			 var addBuff = new newBuff(this.abilityName, this.sourceUnit, this.sourceUnit) // ("Rapid Strikes", target, sourceUnit)
			 finished = true; //because this applies passively, we set finished to true because the buff was casted and does not require further information.
			break;
	
		case "Blind":
			this.sourceUnit.abilityMarkers("on", customValue[5]);
			finished = false;
			break;
			
		case "Precision":
			this.sourceUnit.abilityMarkers("on", customValue[4]);
			finished = false;
			break;
			
		case "Second Wind":
			var addBuff = new newBuff(this.abilityName, this.sourceUnit, this.sourceUnit)
			finished = true;
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
			break;
		
		case "Thunderclap":
			this.sourceUnit.abilityMarkers("on", customValue.range);
			finished = false;						
			break;
		
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
	
	
	
	if (listContains(this.twoTargetList, this.abilityName) == true) { return false; }
	switch(this.abilityName){
		
		case "Bark Armor":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance){
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue.range);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue.range); finished = false; Ui.abilityClickOff(); }
			//else { this.sourceUnit.abilityMarkers("off", customValue[5]); }
			break;	
	
		case "Blind":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance){ // must be enemy for blind--- change this to !=
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue[5]);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue[5]); finished = false; Ui.abilityClickOff(); }
			//else { this.sourceUnit.abilityMarkers("off", customValue[5]); }
			break;
			
		case "Precision":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance) {
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue[4]);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue[4]); finished = false; Ui.abilityClickOff(); }
			break;
			
		case "Thunderclap":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance != this.sourceUnit.alliance){
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue.range);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue.range); finished = false; Ui.abilityClickOff(); }
			//else { this.sourceUnit.abilityMarkers("off", customValue[5]); }
			break;
			
		case "Torch":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance){
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue[5]);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue[5]); finished = false; Ui.abilityClickOff(); }
			break;
			
		case "Soulfire":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance){
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue[5]);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue[5]); finished = false; Ui.abilityClickOff(); }
			break;	
			
		case "Wound":
			//apply affect to target
			if (this.targetSpot.abilityMarker == true && this.targetUnit != null && this.targetUnit.alliance == this.sourceUnit.alliance){
			var addBuff = new newBuff(this.abilityName, this.targetUnit, this.sourceUnit)
			this.sourceUnit.abilityMarkers("off", customValue.range);
			finished = true;
			}
			else { this.sourceUnit.abilityMarkers("off", customValue.range); finished = false; Ui.abilityClickOff(); }
			break;	
	}
	if (finished == null) { this.removeMarkers(); }
	return finished; //require another click
}



ability.prototype.removeMarkers = function()
{
	if (this.abilityName != null){
	var customValue = this.abilityStats(this.abilityName);
	if (this.sourceUnit != null && customValue != 'undefined' && customValue != null) {this.sourceUnit.abilityMarkers("off", customValue[5]); }}
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


