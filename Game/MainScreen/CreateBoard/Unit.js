	  function Unit(Alliance, Name, x, y, Element, Value) //element& value may not be needed
	  {
	    this.alliance = Alliance;

	    this.baseStats = returnUnitStats(Name);
		this.buffStats = new Array(this.baseStats.length);
		this.currentStats = new Array(this.baseStats.length);
		for (var i = 0; i < this.baseStats.length; i++)
		{
			this.currentStats[i] = this.baseStats[i];
		    if (i > 0 && i < 10) {
			this.baseStats[i] = parseInt(this.baseStats[i], 10); 
			this.currentStats[i] = parseInt(this.baseStats[i], 10);
			}
			this.buffStats[i] = 0;
		}
		
		this.auraNames = stringParseForList(this.currentStats[12]); //if (this.auras[0] == "") { this.auras = null; }
		this.auras = new Array();
		for (var i = 0; i < this.auraNames.length; i++) {
		if (this.auraNames[i] != "" && this.auraNames[i] != "0" && this.auraNames[i] != 0)
		{ var newMod = new tileModifier(this, this.auraNames[i]); this.auras.push(newMod);} } //making auras.
		
		this.genericGridList = new Array();//used for stuff like auras and abilities...
		
		this.ability = stringParseForList(this.currentStats[13]); //if (this.ability[0] == "") { this.ability = null; }//Gets the abilities of the unit and puts them in a list.
		
	 	this.buffList = new Array();
		this.noStealthList = new Array(); //reasons unit can not stealth or go invis.
		this.visibleGridSpots = new Array(); //squares that this unit has vision over
		this.x = x;
		this.y = y;
		
		this.lastDamageHit;		// last damage amount this unit inflicted	
		this.lastDamageLoss; 	// last damage amout this unit suffered
		
		this.unitStealth = false;
		
		this.name = Name;                //not necessary(may need to remove any uses before removing this)
		this.element = Element; 	     //not necessary(may need to remove any uses before removing this)
		this.value = Value; 		     //not necessary(may need to remove any uses before removing this)
		
		
		//Costs
		this.movementCost = 1;
		this.attackMovementCost = 1;
		this.attackCost = 1;
		this.movementRange = 1;
		
		GridSpot[this.x][this.y].currentUnit = this;
		this.currentTileMods = new Array();
		GridSpot[this.x][this.y].tileModifiers("all", "move");
		
		if (this.alliance == "ally"){
		this.AreaSelect("vision", GridSpot[this.x][this.y], this.currentStats[5], "on", "") }
		
		
		
		for (var i = 0; i < this.auras.length; i++) { this.auraTileModifier("on", this.auras[i]); }
	  }
	  
	  
	   Unit.prototype.turnFunction = function()
	    {
			if (this.alliance == "ally") { this.sight("off"); }
			for (var i = 0; i < this.buffList.length; i++) { this.buffList[i].eventProc("Turn");  }
			
			//apply buff per turn effects
			//reduce cooldowns
			this.resetStats();
			if (this.alliance == "ally" && this.currentStats[1] > 0) { this.sight("on"); } //sight on if health > 0
	    }
	  
	  
		 Unit.prototype.resetStats = function(resetFrom)
		 { 		 
			if (resetFrom == null) 
			{			
			this.currentStats[4] = this.baseStats[4] + this.buffStats[4]; //movement
			if (this.currentStats[4] < 0) { this.currentStats[4] = 0 };
			
			this.currentStats[8] = this.baseStats[8] + this.buffStats[8];	//#attacks
			
			this.currentStats[9] = this.baseStats[9] + this.buffStats[9]; //#defends 
			}
			
			this.currentStats[3] = this.baseStats[3] + this.buffStats[3]; // defense
			
			this.currentStats[2] = this.baseStats[2] + this.buffStats[2]; // damage
		 }
		 
		 
	    Unit.prototype.markers = function(x, y, Toggle, Action, requirement) 
		{ 
		if (GridSpot[x][y] != undefined) 
		{
			switch(Action){
			
			case "move":
			if (Toggle == "on" && GridSpot[x][y].currentUnit == null && this.currentStats[4] >= this.movementCost) { if (x != this.x || y != this.y) {GridSpot[x][y].moveMarker = true; }}
			if (Toggle == "off") { if (x != this.x || y != this.y) {GridSpot[x][y].moveMarker = false; }}
			break;
			
			case "attack":
			if (Toggle == "on" && this.currentStats[4] >= this.attackMovementCost && this.currentStats[8] >= this.attackCost) { if (GridSpot[x][y].currentUnit == null || GridSpot[x][y].currentUnit != null && GridSpot[x][y].currentUnit.alliance != "ally") {if (x != this.x || y != this.y) {GridSpot[x][y].attackMarker = true; } } }
			if (Toggle == "off") { if (x != this.x || y != this.y) {GridSpot[x][y].attackMarker = false; }}
			break;
			
			case "vision":
			if (Toggle == "on" ) { if (listContains(GridSpot[x][y].allyVision, this) == false) { GridSpot[x][y].allyVision.push(this); this.visibleGridSpots.push(GridSpot[x][y]); } }
			if (Toggle == "off") { var removal = listReturnArray(GridSpot[x][y].allyVision, this); if (removal != -1) { GridSpot[x][y].allyVision.splice(removal, 1); } }
			break;
			
			case "ability":
			if (Toggle == "on" ) { GridSpot[x][y].abilityMarker = true; }
			if (Toggle == "off") { GridSpot[x][y].abilityMarker = false; }
			break;
			
			case "list":
			this.genericGridList.push(GridSpot[x][y]);
			break;
		  }
		}
	  }
	  
	  
	  //Put Toggle in these functions so they can be useable for on/off purposes.
	    Unit.prototype.auraTileModifier = function(Toggle, aura)
	   {
			this.genericGridList = new Array();
			
			if (Toggle == "on" || Toggle == "move") { this.AreaSelect("list", GridSpot[this.x][this.y], aura.customValue[5], Toggle, ""); }
			
			var Instructions = new Array();
			Instructions.push(Toggle); Instructions.push(this.genericGridList);
			aura.affectedTiles(Instructions);
	   }
		
	   Unit.prototype.abilityMarkers = function(Toggle, range)
	   {
			this.AreaSelect("ability", GridSpot[this.x][this.y], range, Toggle, "");
	   }
	  
	    Unit.prototype.sight = function(Toggle)
	   {
			this.AreaSelect("vision", GridSpot[this.x][this.y], this.currentStats[5] + this.buffStats[5], Toggle, "");
	   }
	   
	    Unit.prototype.stealth = function(Toggle, noStealthReason)
	   {
			switch(Toggle) {
				case: "on"
					if (noStealthList == null || noStealthList.length < 1) { this.unitStealth = true; } //turns stealth on
				break;
				
				case: "off"
					this.unitStealth = false; //turns stealth off
					for (var i = 0; i < this.buffList.length; i++) { this.buffList[i].eventProc("StealthRemoval");  } //removes stealth buffs
					if (noStealthReason != null) { noStealthList.push(noStealthReason); } //tells unit why it cannot stealth
				break;
	   }
	   
	   Unit.prototype.movementMarkers = function(Toggle)
	   {
			this.AreaSelect("move", GridSpot[this.x][this.y], this.movementRange, Toggle, "");
	   }

	   Unit.prototype.attackMarkers = function(Toggle)
	   {
			this.AreaSelect("attack", GridSpot[this.x][this.y], this.currentStats[6], Toggle, "");
	   }
	   
	   Unit.prototype.Remove = function() //this does not delete the unit, only removes it from the board!
	   {
		  GridSpot[this.x][this.y].Select("off");
		  this.AreaSelect("vision", GridSpot[this.x][this.y], this.currentStats[5], "off", "")
		  GridSpot[this.x][this.y].currentUnit = null;
	   }
	   
	   Unit.prototype.Delete = function() //deletes unit
	   {
		  GridSpot[this.x][this.y].Select("off");
		  var instruct = new Array(); instruct.push("off");
		  for (var i = 0; i < this.auras.length; i++) { this.auras[i].affectedTiles(instruct); }
		  this.AreaSelect("vision", GridSpot[this.x][this.y],  this.currentStats[5], "off", "")
		  GridSpot[this.x][this.y].currentUnit = null;
		  GameBoard.removeUnitFromList(this);
		  
	   }
	  
	  Unit.prototype.Select = function(Toggle)
	  {
		
		this.AreaSelect("move", GridSpot[this.x][this.y], this.movementRange, Toggle, "");

		this.AreaSelect("attack", GridSpot[this.x][this.y], this.currentStats[6], Toggle, ""); 

	  }
	  //
	  //used by AreaSelect to place movement Markers
	  
	  Unit.prototype.receivePureDamage = function(damage, from)
	  {
		combatLog.push(this.baseStats[0] + " receives " + damage + " pure damage from " + from)
		
		this.currentStats[1] -= damage;
		if (this.currentStats[1] <= 0){
		
		combatLog.push(this.baseStats[0] + " has died.");
		this.Delete(); //Removes unit selection/vision & splices from Teamlist arrays
		}
		
	  }
	  
	  
	   Unit.prototype.receivePhysicalDamage = function(damage, attackerUnit)
	  {
	    var totalDamage = damage;
		var damageDefended = 0;
		var damageDealt = damage;
		//send damage variable to "On Defend buffs" for this unit
		
		if (this.currentStats[9] > 0)
		{
			if (this.currentStats[3] <= damage) { damageDealt = damage - this.currentStats[3]; damageDefended = totalDamage - damageDealt; }
			if (this.currentStats[3] > damage) { damageDealt = 0; damageDefended = totalDamage; }
			this.currentStats[9]--;
		}

		this.currentStats[1] -= damageDealt;
		
		combatLog.push(this.baseStats[0] + " receives " + totalDamage.toString() + " damage from " + attackerUnit.baseStats[0] + ". " + damageDefended.toString() + " damage was defended and " + 
		damageDealt.toString() + " was dealt.");
		 
		this.lastDamageLoss = damageDealt;
		attackerUnit.lastDamageHit = damageDealt;
		
		if (this.currentStats[1] <= 0){
		
		combatLog.push(this.baseStats[0] + " has died.");
		this.Delete(); //Removes unit selection/vision & splices from Teamlist arrays
		}
	  }
	  
	  
	  
	   Unit.prototype.Attack = function(NewGridSpot)
	  {
		if (this.currentStats[8] > 0)
		{
		this.Select("off");
		var damage = this.currentStats[2];
		
		//send damage variable to "On Attack buffs" for this unit
		
		combatLog.push(this.baseStats[0] + " has attacked " + NewGridSpot.currentUnit.baseStats[0] + " with " + damage.toString() +" damage.");		

		NewGridSpot.currentUnit.receivePhysicalDamage(damage, this);
		
		if (this.currentStats[10] != 0) {
		var buffIt = new newBuff(this.currentStats[10], NewGridSpot.currentUnit, this); }
		
		this.currentStats[4] -= this.attackMovementCost;
		this.currentStats[8] -= this.attackCost;
		
		for (var i = 0; i < NewGridSpot.currentUnit.buffList.length; i++) { NewGridSpot.currentUnit.buffList[i].eventProc("Defend", this);  }
		
		for (var i = 0; i < this.buffList.length; i++) { this.buffList[i].eventProc("Attack", damage);  }
	  }
	 }
	  
	  
	  
	   Unit.prototype.Move = function(NewGridSpot)
	  {
		if (this.currentStats[4] > 0)
		{
		 //Checks for on move event in buffs
		 
		 this.currentStats[4] -= 1;    //minus movement cost for this unit.
		 
		// this.sight("off");
		 
		 this.Remove(); //removes unit from grid && removes sight
		 
		 combatLog.push(this.baseStats[0] + " has moved.");
		 NewGridSpot.currentUnit = this;
		 this.x = NewGridSpot.x;
		 this.y = NewGridSpot.y;
		 
		 for (var i = 0; i < this.buffList.length; i++) { this.buffList[i].eventProc("Move");  }
		 
		 // make sure unit is alive before giving back vision
			if (this.alliance == "ally" && this.currentStats[1] > 0){
		 
			this.sight("on");
		 
			for (var i = 0; i < this.auras.length; i++) { this.auraTileModifier("move", this.auras[i]); } //move all aura origins
		 
			for (var i = 0; i < this.currentTileMods.length; i++) {  this.currentTileMods[i].eventProc("remove", this); }
		 
			NewGridSpot.tileModifiers("all", "move"); //get new tile modifiers
			}
		 }
	  }
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  

			
		
	
	
			
		 
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  Unit.prototype.AreaSelect = function(Action, CentreGrid, Radius, Toggle, requirement)
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
