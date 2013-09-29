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
		{ var newMod = new tileModifier(this, this.auraNames[i]); this.auras.push(newMod);} } //making auras.A
		
		this.genericGridList = new Array();//used for stuff like auras and abilities...
		var abilityName = stringParseForList(this.currentStats[13]);
		
		this.ability = new Array();
		for (var i = 0; i < abilityName.length; i++) {
			var newAbility = { name: abilityName[i], cooldown: 0 };
			this.ability.push(newAbility);
			
		}
		//this.ability = stringParseForList(this.currentStats[13]); //if (this.ability[0] == "") { this.ability = null; }//Gets the abilities of the unit and puts them in a list.
		
	 	this.buffList = new Array();
		this.noStealthList = new Array(); //reasons unit can not stealth or go invis.
		this.visibleGridSpots = new Array(); //squares that this unit has vision over
		this.x = x;
		this.y = y;
		
		// attack properties
		this.stealthedLastAttack;	// determines if stealth was active at last physical attack
		this.blockedLastAttack;		// determines if unit blocked last physical attack
		this.lastPhysicalAttack;	// keeps track of a unit's attack stat during its last attack
		this.lastPhysicalBlock;		// keeps track of a unit's block stat during its last block
		this.lastDamageHit;			// last damage amount this unit inflicted	
		this.lastDamageLoss;	 	// last damage amount this unit suffered
		
		// other properties
		this.unitStealth = false;
		this.summon = false;
		this.turnCost = true;
		//mirror image fake stats
		this.displayStats = false;
		this.fakeStats = new Array();
		
		this.name = Name;                //not necessary(may need to remove any uses before removing this)
		this.element = Element; 	     //not necessary(may need to remove any uses before removing this)
		this.value = Value; 		     //not necessary(may need to remove any uses before removing this)
		
		
		//Costs
		this.movementCost = 1;
		this.attackMovementCost = 1;
		this.attackCost = 1;
		this.movementRange = 1;
		
		this.revealersOnGridList = new Array();
		
		
		GridSpot[this.x][this.y].currentUnit = this;
		this.currentTileMods = new Array();
		GridSpot[this.x][this.y].tileModifiers("all", "move");
		
		if (this.alliance == "ally"){ this.sight("on"); }
		this.reveal("on");

		for (var i = 0; i < this.auras.length; i++) { this.auraTileModifier("on", this.auras[i]); }
	  }
	  
	  
	   Unit.prototype.turnFunction = function()
	    {
			
			for (var i = 0; i < this.buffList.length; i++) { 
			
			if (this.buffList[i].eventProc("Turn") == true) { i--; } 
			  }
			
			this.resetStats();
			for (var i = 0; i < this.ability.length; i++) {
				if (this.ability[i].cooldown > 0) { this.ability[i].cooldown--; }
			}
		
	    }
	  
	  
		 Unit.prototype.resetStats = function(resetFrom)
		 {
			if (this.currentStats[1] > 0) { //this condition is needed for an example: firebringer with torch dies to firewall.
			if (resetFrom == null) 
			{						
			this.sight("off"); //maybe we should make sure the unit is alive before messing with this stuff
			this.currentStats[5] = this.baseStats[5] + this.buffStats[5]; // sight
			if (this.currentStats[5] < 1) { this.currentStats[5] = 1; }
			this.sight("on");
			
			this.currentStats[4] = this.baseStats[4] + this.buffStats[4]; //movement
			if (this.currentStats[4] < 0) { this.currentStats[4] = 0 };
			
			this.currentStats[6] = this.baseStats[6] + this.buffStats[6]; // range
			if (this.currentStats[6] < 1) { this.currentStats[6] = 1; }
			
			this.reveal("off");
			this.currentStats[7] = this.baseStats[7] + this.buffStats[7]; // reveal
			if (this.currentStats[7] < 0) { this.currentStats[7] = 0; }
			this.reveal("on");	
			
			this.currentStats[8] = this.baseStats[8] + this.buffStats[8];	//#attacks
			
			this.currentStats[9] = this.baseStats[9] + this.buffStats[9]; //#defends 
			
				if (this.displayStats == true) { 
					this.fakeStats[4] = this.baseStats[4] + this.buffStats[4];
					this.fakeStats[8] = this.baseStats[8] + this.buffStats[8];
					this.fakeStats[9] = this.baseStats[9] + this.buffStats[9];
				}
			}
						
			this.currentStats[3] = this.baseStats[3] + this.buffStats[3]; // defense
			
			this.currentStats[2] = this.baseStats[2] + this.buffStats[2]; // damage
		 	}
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
			if (Toggle == "on") { // == "ally condition exists here and in lineofsight code
			if (listContains(GridSpot[x][y].allyVision, this) == false && this.alliance == "ally") { this.visibleGridSpots.push(GridSpot[x][y]); }  } //GridSpot[x][y].allyVision.push(this);
			
			if (Toggle == "off") { var removal = listReturnArray(GridSpot[x][y].allyVision, this); if (removal != -1) { GridSpot[x][y].allyVision.splice(removal, 1); } }
			break;
			
			case "reveal":
			if (Toggle == "on" ) { if (this.x != x || this.y != y) {GridSpot[x][y].reveal("on", this); } }
			if (Toggle == "off") { GridSpot[x][y].reveal("off", this); }
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
			
			if (Toggle == "on" || Toggle == "move") { this.AreaSelect("list", GridSpot[this.x][this.y], aura.stats.auraRange, Toggle, ""); }
			
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
			if (this.alliance == "ally") { // == "ally condition exists here and in .markers code for sight
			this.visibleGridSpots = new Array();
			this.AreaSelect("vision", GridSpot[this.x][this.y], this.currentStats[5], Toggle, "");
			if (Toggle == "on") {
				//find the blockers
				var blockers = new Array();
				for (var i = 0; i < this.visibleGridSpots.length; i++) {
					if (this.visibleGridSpots[i].visionBlock.length > 0) { blockers.push(this.visibleGridSpots[i]); }
				}
				
				
				for (var i = 0; i < this.visibleGridSpots.length; i++) {

				var start = {x: Math.floor(GridSpot[this.x][this.y].centrePixelX), y: Math.floor(GridSpot[this.x][this.y].centrePixelY)};
				var end = {x: Math.floor(this.visibleGridSpots[i].centrePixelX), y: Math.floor(this.visibleGridSpots[i].centrePixelY)};
				var visionRay = new ray(start, end);
				
				var giveSight = true;
					
					for (var t = 0; t < blockers.length; t++) {
						
							if (blockers[t] != this.visibleGridSpots[i] && visionRay.intersects(blockers[t].visionBlockRectangleX) == true ||
								blockers[t] != this.visibleGridSpots[i] && visionRay.intersects(blockers[t].visionBlockRectangleY) == true) { 
								giveSight = false;
								}
							
							
					}
				//if (this.visibleGridSpots[i] != blockers[t]) { }
				
					/*for (var t = 0; t < this.visibleGridSpots.length; t++) {
						
						if (this.visibleGridSpots[t].visionBlock.length > 0 && visionRay.intersects(this.visibleGridSpots[t].visionBlockRectangleX) == true ||
						this.visibleGridSpots[t].visionBlock.length > 0 && visionRay.intersects(this.visibleGridSpots[t].visionBlockRectangleY) == true) { 
						
						if (this.visibleGridSpots[t] != this.visibleGridSpots[i]) {
						giveSight = false; }
						
						
						} 
					}*/
				if (giveSight == true) { this.visibleGridSpots[i].allyVision.push(this); }
				
				} }
				
			}
	   }
	   
	    Unit.prototype.stealth = function(Toggle, noStealthReason)
	   {
			switch(Toggle) {
				case "on":
					if (this.noStealthList == null || this.noStealthList.length < 1) { this.unitStealth = true; } //turns stealth on
				break;
				
				case "off":
					this.unitStealth = false; //turns stealth off
					for (var i = 0; i < this.buffList.length; i++) { if (this.buffList[i].eventProc("StealthRemoval") == true) { i--; }  } //removes stealth buffs  
					if (noStealthReason != 'undefined' && noStealthReason != null) { this.noStealthList.push(noStealthReason); } //tells unit why it cannot stealth
				break;
			}
	   }
	   
	   Unit.prototype.reveal = function(Toggle)
	   {
			this.AreaSelect("reveal", GridSpot[this.x][this.y], this.currentStats[7], Toggle, "");
	   }
	   
	   Unit.prototype.movementMarkers = function(Toggle)
	   {
			this.AreaSelect("move", GridSpot[this.x][this.y], this.movementRange, Toggle, "");
	   }

	   Unit.prototype.attackMarkers = function(Toggle)
	   {
			this.AreaSelect("attack", GridSpot[this.x][this.y], this.currentStats[6], Toggle, "");
	   }
	   
	   Unit.prototype.Remove = function() //removes unit from the board for movement purposes-- auras have their own movement
	   {
		  
		  GridSpot[this.x][this.y].Select("off");
		  this.reveal("off");
		  this.sight("off");
		  
		  if (GridSpot[this.x][this.y].currentUnit == this) { GridSpot[this.x][this.y].currentUnit = null; } // if statement needed for unit swaps
		  
		  if (ability.castMode == true) { ability.removeMarkers(); }
		  
		  return this;	// return the unit so it can be used if necessary
	   }
	   
	   Unit.prototype.Delete = function() //deletes unit
	   {
		  this.reveal("off");
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
			this.blockedLastAttack = true;
			this.lastPhysicalBlock = this.currentStats[3];
			if (this.currentStats[3] <= damage) { damageDealt = damage - this.currentStats[3]; damageDefended = totalDamage - damageDealt; }
			if (this.currentStats[3] > damage) { damageDealt = 0; damageDefended = totalDamage; }
			this.currentStats[9]--;
		} else {
			this.blockedLastAttack = false;	
		}

		attackerUnit.lastPhysicalAttack = attackerUnit.currentStats[2];
		
		this.currentStats[1] -= damageDealt;
		
		combatLog.push(attackerUnit.baseStats[0] + " (" + totalDamage + " damage) attacks " + this.baseStats[0] + " (" + damageDefended + 
			" defense), " + damageDealt.toString() + " damage was dealt.");
		 
		this.lastDamageLoss = damageDealt;
		attackerUnit.lastDamageHit = damageDealt;
		
		if (this.currentStats[1] <= 0){
		
		combatLog.push(this.baseStats[0] + " has died.");
		this.Delete(); //Removes unit selection/vision & splices from Teamlist arrays
		}
	  }
	   
	   Unit.prototype.heal = function(hp, source) { // source should be string
		   
			lifeLost = this.baseStats[1] + this.buffStats[1] - this.currentStats[1];
		   
			if (hp <= lifeLost && hp > 0) { // do nothing
			} else if (hp > lifeLost && this.currentStats[1] + hp > this.baseStats[1] + this.buffStats[1]) { hp = lifeLost; 
			} else { hp = 0 }		   
			
			this.currentStats[1] += hp;
			combatLog.push(this.baseStats[0] + " healed by " + source + " for " + hp + " hit points.")
	   }
	   	  
	   Unit.prototype.Attack = function(NewGridSpot)
	  {
		if (this.currentStats[8] > 0 && this.currentStats[4] > 0)
		{
		if (this.turnCost == true && this.alliance == "ally" && GameBoard.unitsMovedThisTurn.length < GameBoard.unitMoves && listContains(GameBoard.unitsMovedThisTurn, this) == false) { GameBoard.unitsMovedThisTurn.push(this); }
			if (listContains(GameBoard.unitsMovedThisTurn, this) == true || this.alliance == "enemy" || this.turnCost == false) {
				this.Select("off");
				var damage = this.currentStats[2];
		
		if (this.unitStealth == true) { this.stealthedLastAttack = true; } else { this.stealthedLastAttack = false; }	
		

		if (NewGridSpot.currentUnit != null && NewGridSpot.currentUnit != undefined) {
		
			for (var i = 0; i < NewGridSpot.currentUnit.buffList.length; i++) { 
				if (NewGridSpot.currentUnit.buffList[i].eventProc("Defend", this) == true) { i--; }  
			}	 
			
			// receive damage
			NewGridSpot.currentUnit.receivePhysicalDamage(damage, this);
			
			// apply attack buffs
			if (this.currentStats[10] != 0 && NewGridSpot.currentUnit != null) {
				var buffIt = new newBuff(this.currentStats[10], NewGridSpot, this); }
			
			// attack proc		
			for (var i = 0; i < this.buffList.length; i++) {  if (this.buffList[i].eventProc("Attack") == true) { i--; }  }
			
				this.currentStats[4] -= this.attackMovementCost;
				this.currentStats[8] -= this.attackCost;
				
				if (this.displayStats == true) { 
				
					this.fakeStats[4] -= this.attackMovementCost; 
					this.fakeStats[8] -= this.attackCost;
				}
			}
			
		
		} else { alert(this.name + " tried to attack gridspot at " + NewGridSpot.x + ", " + NewGridSpot.y + " but no unit is there") }
	  }
	 }
	  
	  
	  
	   Unit.prototype.Move = function(NewGridSpot)
	  {
		if (this.currentStats[4] > 0)
		{
		if (this.turnCost == true && this.alliance == "ally" && GameBoard.unitsMovedThisTurn.length < GameBoard.unitMoves && listContains(GameBoard.unitsMovedThisTurn, this) == false) { GameBoard.unitsMovedThisTurn.push(this); }
			if (listContains(GameBoard.unitsMovedThisTurn, this) == true || this.alliance == "enemy" || this.turnCost == false) {
		
		
		 //Checks for on move event in buffs
		 this.currentStats[4] -= this.movementCost;    //minus movement cost for this unit.
		 if (this.displayStats == true) { this.fakeStats[4] -= this.movementCost; }
		 
		// this.sight("off");
		 
		 this.Remove(); //removes unit from grid && removes sight
		 
		 combatLog.push(this.baseStats[0] + " has moved.");
		 NewGridSpot.currentUnit = this;
		 this.x = NewGridSpot.x;
		 this.y = NewGridSpot.y;
		 
		 for (var i = 0; i < this.buffList.length; i++) {  if (this.buffList[i].eventProc("Move") == true) { i--; }  }
		 
		 // make sure unit is alive before giving back vision
			if (this.alliance == "ally" && this.currentStats[1] > 0){
		 
				this.sight("on");
				this.reveal("on");
			}
			
			for (var i = 0; i < this.auras.length; i++) { this.auraTileModifier("move", this.auras[i]); } //move all aura origins
		 
			for (var i = 0; i < this.currentTileMods.length; i++) {  this.currentTileMods[i].eventProc("remove", this); } //this could have an indexing problem when a tilemod is removed and can't find the next one
				NewGridSpot.tileModifiers("all", "move"); //get new tile modifiers
			
			for (var i = 0 ; i < this.revealersOnGridList.length; i++) { if (listContains(NewGridSpot.revealList, this.revealersOnGridList[i]) == false) { 
				var rem = listReturnArray(this.noStealthList, this.revealersOnGridList[i]);
					if (rem != -1) { this.noStealthList.splice(rem, 1); }
						this.revealersOnGridList.splice(i, 1); i--; } }
			
			for (var i = 0; i < NewGridSpot.revealList.length; i++) { 
				if (//NewGridSpot.revealList[i].alliance == "enemy" && 
					listContains(this.revealersOnGridList, NewGridSpot.revealList[i]) == false) {
					this.revealersOnGridList.push(NewGridSpot.revealList[i]);
					this.stealth("off", NewGridSpot.revealList[i]);
				}
	   
				}
			}
		 }
	  }
	  
	  
	  
	   Unit.prototype.gridRevealer = function(Toggle, unit)
	  {
			switch(Toggle) {
				case "on": 
					if (listContains(this.revealersOnGridList, unit) == false) {//NewGridSpot.revealList[i].alliance == "enemy" && 
						
						this.revealersOnGridList.push(unit);
						this.stealth("off", unit);
						}
				
				break;
				
				case "off":
					var rem = listReturnArray(this.noStealthList, unit);
						if (rem != -1) { this.noStealthList.splice(rem, 1); }
					var rem = listReturnArray(this.revealersOnGridList, unit);
						if (rem != -1) {this.revealersOnGridList.splice(rem, 1); }
				break;
			
			
			}
	  }
	  
	  
	  
	  
	  
	  

			
		
	
	
			
		 
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  Unit.prototype.AreaSelect = function(Action, CentreGrid, Radius, Toggle, requirement)
	  {
		if (Radius < 0 || Radius == 0 && Action == "reveal") { if(Action != "reveal") { alert("negative AreaSelect for " + Action); } return; }
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
