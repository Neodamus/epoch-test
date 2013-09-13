


function ability() { this.abilityBeingCasted = false; this.specialAbilityList(); 
this.sourceUnit;
this.targetSpot2 = GridSpot[0][0];
this.gridTargetList = new Array();
}

ability.prototype.abilityStats = function(abilityName)
{
  var customValue = new Array(8);
  switch(abilityName){
		case "Engulf": 
					customValue[0] = 3; 		//MaxTime
					customValue[1] = 3; 		//CurrentTime
					customValue[2] = "both";    //buff visibility
					cusomValue[3] = false;      //Does it stack?
					customValue[4] = 1; 	    //Damage dealt to attachedUnit
					customValue[5] = 0;         //range
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



ability.prototype.targetCast = function(targetSpot) //if finished returns true, send it off to server, if not... wait for another click?
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
	if (this.sourceUnit != null && customValue != 'undefined' && customValue != null) {this.sourceUnit.abilityMarkers("off", customValue[5]); }}
}








ability.prototype.AreaSelect = function(CentreGrid, Radius)
	  {
			var x = 0; 
			var y = 0;
            var row = 1;
            var howmanyleft = 0;
            var push = 0;
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

                               this.markers(x, y, Toggle, Action, requirement);


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



                               this.markers(x, y, Toggle, Action, requirement);


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
                           this.markers(x, y, Toggle, Action, requirement);
                    }
                }
                for (var i = 0; i < Radius + 1; i++)
                {
                    x = CentreGrid.x - i;
                    y = CentreGrid.y;
                    if (x >= 0 && x < GridSpot.length &&
                         y >= 0 && y < GridSpot[0].length)
                    {
                             if (x != CentreGrid.x) { this.markers(x, y, Toggle, Action, requirement); }
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
                               this.markers(x, y, Toggle, Action, requirement);

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
                               this.markers(x, y, Toggle, Action, requirement);
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
	  }


