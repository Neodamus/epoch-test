
 function newBuff(buff, targetSpot, sourceUnit)
	  {
		this.buffType = buff;
		this.buffStats;		// holds buffstats object
		this.targetSpot = targetSpot;	// should be instanceof Grid or instanceof Array with Grids in it for aoe/multi targets
		
		if (this.targetSpot instanceof Grid) { this.attachedUnit = this.targetSpot.currentUnit; }
		
		this.sourceUnit = sourceUnit;
		this.customValue = new Array(8);
		this.procList = new Array();
		this.eventProc("Initialize");
		this.removeReturn = false;
		this.aura; 		// used if buff is an aura initialization
	  }
	  
	  // Initialize, Turn, Removal                    Add: who is buff visible to is customValue[2];
	  
	 /* case "Panic Aura": 
					customValue[0] = 3; 		//MaxTime							(if buff gets refreshed, it gets refreshed to this number)
					customValue[1] = 3; 		//CurrentTime						(how long the buff lasts)
					customValue[2] = "both";    //buff visibility    				(both players can see the buff when unit is clicked)
					cusomValue[3] = false;      //Does it stack?    				 (if buff doesnt stack... does it refresh CurrentTime?)
					customValue[4] = 1; 	    //How many units can it affect per turn     (specific buff quality on panic aura...)
					customValue[5] = 4;         //range of aura									
					return customValue; 			*/
	  
	  //have specific buff properties. ie: Cannot be dispelled...   if (Procedure == "dispell") { do nothing. }
	   newBuff.prototype.eventProc = function(Procedure, source)
	    {
			
		if (Procedure == "Initialize") {  // copies variables from ability stats
		
			var buffStats = ability.abilityStats(this.buffType);
			
			if (buffStats instanceof Array) {
				for (var i = 0; i < buffStats.length; i++) { this.customValue[i] = buffStats[i]; }	
			} else {				
				this.buffStats = ability.abilityStats(this.buffType).clone()	// for buffStats using objects instead of arrays
			}
			
		}
			
		switch(this.buffType) {	
		
			case "Ambush":
			
				switch(Procedure) {
				
					case "Initialize":
						
						if (this.sourceUnit.stealthedLastAttack == true) {
						
							if (this.attachedUnit.blockedLastAttack == false) {
								
								damage = Math.floor(this.sourceUnit.lastPhysicalAttack * this.buffStats.damageMultiplier);
								
							} else {
								
								damage = Math.floor(this.sourceUnit.lastPhysicalAttack * this.buffStats.damageMultiplier
										 - this.attachedUnit.lastPhysicalBlock - this.attachedUnit.lastDamageLoss);
								
							}
								
							this.attachedUnit.receivePureDamage(damage, "Ambush");
						}
						
						break;
						
				}
						
			break;
			
			case "Bark Armor":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list
						
						this.attachedUnit.buffStats[3] += this.buffStats.defense					
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; //reduce buff time;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
						
					case "Defend":
					
						source.currentStats[8] = 0;
					
						break;
					
					case "Removal":
					
						this.removeBuff();
						
						this.attachedUnit.buffStats[3] -= this.buffStats.defense 	
						
						break;
				}   
			break;
			
			case "Blind":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
					
						this.attachedUnit.sight("off");
						
						this.buffStats.sightDebuff = this.buffStats.sight - this.attachedUnit.currentStats[5];					
						this.attachedUnit.buffStats[5] += this.buffStats.sightDebuff;			
						this.attachedUnit.currentStats[5] += this.buffStats.sightDebuff;						
					
						this.attachedUnit.sight("on");
						
						if (this.attachedUnit.currentStats[6] > this.buffStats.sight) {  // range greater than sight
							this.buffStats.rangeDebuff = this.buffStats.sight - this.attachedUnit.currentStats[6];
							this.attachedUnit.buffStats[6] += this.buffStats.rangeDebuff;		
							this.attachedUnit.currentStats[6] += this.buffStats.rangeDebuff;
						}
						
					break;
				
					case "Turn":						
						
						this.buffStats.duration--; 
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
					break;
					
					case "Removal":
					
						this.removeBuff();
											
						this.attachedUnit.buffStats[5] -= this.buffStats.sightDebuff;
						this.attachedUnit.buffStats[6] -= this.buffStats.rangeDebuff;	
						
						this.					
						
					break;
				}   
			break;
			
			case "Condense": // channeled
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
						
						break;
				
					case "Turn":
						
						if (this.attachedUnit.currentStats[1] + this.buffStats.hitpoints < this.attachedUnit.baseStats[1]) {
							this.attachedUnit.currentStats[1] += this.buffStats.hitpoints;
						} else {
							this.attachedUnit.currentStats[1] = this.attachedUnit.baseStats[1];
							this.eventProc("Removal");
						}
						
						this.buffStats.duration--;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
						
					case "Move":
					
						this.eventProc("Removal");
						
						break;
						
					case "Attack":
					
						this.eventProc("Removal");
						
						break;
						
					case "Defend":
					
						this.eventProc("Removal");
						
						break;
					
					case "Removal":
					
						this.removeBuff();	
						
						break;
				}   
			break;
			
			case "Creeping Vines":
				
				switch(Procedure) {					
				
					case "Initialize":
					
						if (this.sourceUnit instanceof Unit) { 
						
							var vineTiles = this.targetSpot;
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( vineTiles );
							Trap.affectedTiles(Instructions);
								
						}					
						
						if (this.sourceUnit instanceof tileModifier) {				
							
							var rem = listReturnArray(GridSpot[this.attachedUnit.x][this.attachedUnit.y].tileBuffList, this.sourceUnit); //Remove creeping vine tilemod from gridspot
							if (rem != -1) { GridSpot[this.attachedUnit.x][this.attachedUnit.y].tileBuffList.splice(rem, 1);}
							
							
							this.attachedUnit.buffList.push(this);
							this.attachedUnit.receivePureDamage(this.buffStats.damage, this.buffType);
							this.attachedUnit.currentStats[4] = 0;	

							var rem = listReturnArray(this.attachedUnit.currentTileMods, this.sourceUnit); //Remove creeping vine tilemod from unit
							if (rem != -1) {
							this.attachedUnit.currentTileMods.splice(rem, 1); }
						
						}
						
					break;
						
					case "Turn":
					
						this.eventProc("Removal");						
						
					break;
					
					case "Move":					
						
						this.eventProc("Removal");
						
					break;
					
					case "Removal":
					
						this.removeBuff();		
						
					break;
				
				}

				break;	
			
			case "Energy Field":
				
				switch(Procedure) {					
				
					case "Initialize":
					
						// if placing trap	
						if (this.sourceUnit instanceof Unit) { 
						
							var energyFieldTiles = this.targetSpot;
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( energyFieldTiles );
							Trap.affectedTiles(Instructions);
								
						}					
						
						// if unit steps on trap
						if (this.sourceUnit instanceof tileModifier) {
						   
							this.attachedUnit.buffList.push(this);
							this.attachedUnit.currentStats[4]++;			
						
						}
						
					break;
					
					case "Move":					
						
						this.eventProc("Removal");
						
					break;
					
					case "Removal":
					
						this.removeBuff();		
						
					break;
					
				}
				
			break;
		
			case "Engulf":
			
				switch(Procedure){
				
					case "Initialize":
					
						this.attachedUnit.buffList.push(this);
					
						this.attachedUnit.stealth("off", this);
						//this.attachedUnit.noStealthList.push(this);
						
					break;
				
					case "Turn":
					
						this.attachedUnit.receivePureDamage(this.buffStats.damage);
						
						this.buffStats.duration--;
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
							
					break;
					
					case "Removal":
					
						var removeArray = listReturnArray(this.attachedUnit.noStealthList, this);
						this.attachedUnit.noStealthList.splice(removeArray, 1);
						
						this.removeBuff(); 
						
					break;
				}   
			break;
				
			case "Entanglement":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.sourceUnit.receivePureDamage(-(this.buffStats.hitpoints), this.buffType);
					
						this.attachedUnit.receivePureDamage(this.buffStats.damage, this.buffType);
						
						break;
				}   
			break;
			
			case "Exothermia":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list
					
						this.attachedUnit.currentStats[9] += this.buffStats.blocks					
						
						break;
				
					case "Turn":
					
						this.eventProc("Removal");
						
						break;
					
					case "Removal":
					
						this.removeBuff();	
						
						break;
				}   
			break;
			
			case "Fire Wall":
				
				switch(Procedure) {					
				
					case "Initialize":
					
						// if placing trap	
						if (this.sourceUnit instanceof Unit) { 
						
							var fireWallTiles = this.targetSpot;
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( fireWallTiles );
							Trap.affectedTiles(Instructions);
								
						}					
						
						// if unit steps on trap
						if (this.sourceUnit instanceof tileModifier) {
						   
							this.attachedUnit.buffList.push(this);
							this.attachedUnit.receivePureDamage(this.buffStats.damage - 2, this.buffType);
							
							this.buffStats.duration = this.sourceUnit.stats.lifetime;
					
							this.attachedUnit.stealth("off", this);				
						
						}
						
					break;
						
					case "Turn":
					
						this.buffStats.duration--;
						
						if (this.buffStats.duration <= 0) { 
							this.eventProc("Removal"); 
						} else { 					
							this.attachedUnit.receivePureDamage(this.buffStats.damage, this.buffType);
						}
						
					break;
					
					case "Move":					
						
						this.eventProc("Removal");
						
					break;
					
					case "Removal":
					
						this.removeBuff();		
						
					break;
				
				}

				break;
			
			case "Frostbite":
			
				switch(Procedure) {
				
					case "Initialize":
						
						if (this.attachedUnit.lastDamageLoss < this.buffStats.damage) {
							
							this.attachedUnit.receivePureDamage(this.buffStats.damage - this.attachedUnit.lastDamageLoss, "Frostbite")
							
						}
						
						break;
						
				}
						
			break;
				
			case "Haste":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
						
						this.attachedUnit.buffStats[4] += this.buffStats.speed
						this.attachedUnit.currentStats[4] += this.buffStats.speed					
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; //reduce buff time;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						this.removeBuff();
						
						this.attachedUnit.buffStats[4] -= this.buffStats.speed
						this.attachedUnit.currentStats[4] -= this.buffStats.speed		
						
					break;
				}   
			break;
			
			case "Heal":
			
				switch(Procedure) {
				
					case "Initialize":
					
						if (this.attachedUnit.currentStats[1] + this.buffStats.hitpoints <= this.attachedUnit.baseStats[1]) {						
							this.attachedUnit.heal(this.buffStats.hitpoints, this.sourceUnit.baseStats[0]);
						} else {
							this.attachedUnit.heal(this.attachedUnit.baseStats[1] - this.attachedUnit.currentStats[1],this.sourceUnit.baseStats[0]);
						}
						
						break;	
				}   
			break;
			
			case "Magma Trap":
			
				switch(Procedure) {
				
					case "Initialize":
					
						// if placing trap	
						if (this.sourceUnit instanceof Unit) { 
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( [this.targetSpot] );
							Trap.affectedTiles(Instructions);
							
						} 
						
						if (this.sourceUnit instanceof tileModifier) {	// unit steps on trap	
							
							var rem = listReturnArray(this.attachedUnit.currentTileMods, this.sourceUnit);
							
							var test = [ "off" ];							
							if (rem != -1) { this.attachedUnit.currentTileMods[rem].affectedTiles(test); }
						   
							this.attachedUnit.buffList.push(this);
							this.attachedUnit.receivePureDamage(this.buffStats.damage, this.buffType);
					
							this.attachedUnit.stealth("off", this);		
						
						}
						
					break;
					
					case "Turn":
					
						this.buffStats.duration--;
						this.buffStats.damage--;
						
						if (this.buffStats.duration != 0) { this.attachedUnit.receivePureDamage(this.buffStats.damage, this.buffType); }
						if (this.buffStats.duration == 0) { this.eventProc("Removal") }						
					
					break;
					
					case "Removal":					
						
						this.removeBuff();
					
						var removeArray = listReturnArray(this.attachedUnit.noStealthList, this);
						this.attachedUnit.noStealthList.splice(removeArray, 1);
						
					break;
				}
			break;		
			
			case "Mirror Image":
			
				switch (Procedure) {
				
					case "Initialize":
					
						var targetSpot = this.attachedUnit[1];
						var copiedUnit = this.attachedUnit[0];
						
						var image = GameBoard.CreateUnit(copiedUnit.alliance, copiedUnit.baseStats[0], targetSpot.x, targetSpot.y);
						
						image.sight("off");
						
						image.baseStats = MirrorImage;
						
						image.currentStats = new Array(image.baseStats.length);
						for (var i = 0; i < image.baseStats.length; i++)
						{
							image.currentStats[i] = image.baseStats[i];
							if (i > 0 && i < 10) {
							image.baseStats[i] = parseInt(image.baseStats[i], 10); 
							image.currentStats[i] = parseInt(image.baseStats[i], 10);
							}
							image.buffStats[i] = 0;
						}
						
						image.summon = true;
						
						image.sight("on");
					
						targetSpot.currentUnit = image;
						if (copiedUnit.alliance == "ally") { GameBoard.AllyUnits.push(image); } else { GameBoard.EnemyUnits.push(image); }
					
					break;	
					
				}
			
			break;	
			
			case "Mist":
				
				switch(Procedure) {					
				
					case "Initialize":
					
						if (this.sourceUnit instanceof Unit) { 
						
							var mistTiles = this.targetSpot;
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( mistTiles );
							Trap.affectedTiles(Instructions);
								
						}					
						
						if (this.sourceUnit instanceof tileModifier) {
							
							var check = false;
							
							for (i = 0; i < this.attachedUnit.buffList.length; i++) {
								
								if (this.attachedUnit.buffList[i].buffType == this.buffType) { check = true; }
								
							}
						   
						   	if (check == false) {
								this.attachedUnit.buffList.push(this);
								this.attachedUnit.buffStats[9] += this.buffStats.blocks;
								this.attachedUnit.currentStats[9] += this.buffStats.blocks;			
							}
						
						}
						
					break;
					
					case "Turn":
					
						var mistCheck = false;
						
						for (i = 0; i < this.attachedUnit.currentTileMods.length; i++) {							
							if (this.attachedUnit.currentTileMods[i].name == this.buffType) { mistCheck = true; }
						}
						
						if (mistCheck == false) { this.eventProc("Removal"); }
						
					break;
					
					case "Removal":
					
						this.removeBuff();
						this.attachedUnit.buffStats[9] -= this.buffStats.blocks		
						
					break;
					
				}
				
			break;
				
			case "Panic Aura":

				switch(Procedure) {
				
						case "Initialize":
					//We use the sourceUnit for all the AURA/stats, that way any future buffs have to obey what the aura can currently do:
					
					var stacks = false;
					for (var i = 0; i < this.attachedUnit.buffList.length; i++) { if (this.attachedUnit.buffList[i].buffType == this.buffType) { stacks = true; break;} }
					
					for (var i = 0; i < this.attachedUnit.currentTileMods.length; i++) { //go through all panic auras to see if any can apply movementdecrease.
					
						if (this.attachedUnit.currentTileMods[i].name == this.buffType && this.attachedUnit.currentTileMods[i].stats.unitAffectNumber > 0) 
					
						{ if (stacks == false) { this.attachedUnit.currentStats[4] = 0; } this.attachedUnit.currentTileMods[i].stats.unitAffectNumber--; }
					
					}
					//if (this.sourceUnit.stats.unitAffectNumber > 0) { this.attachedUnit.currentStats[4] = 0; this.sourceUnit.stats.unitAffectNumber--; } //aura can only affect 1 unit per turn.
					
					
					if (stacks == false) {this.attachedUnit.buffList.push(this); }
					break;
				
						case "Turn":
					console.warn(this.buffStats.duration);
					this.buffStats.duration--; 
					this.sourceUnit.stats.unitAffectNumber = this.buffStats.unitAffectNumber; //we reset the aura's stats by using this.buffStats because we're not modifying the buffstats of that variable here.
					if (listContains(this.attachedUnit.currentTileMods, this.sourceUnit) == true) { this.buffStats.duration++; }
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
					break;
					
					/*	case "Move":
					break;*/
						
						case "Removal":
					removeArray = listReturnArray(this.attachedUnit.buffList, this);
					this.attachedUnit.buffList.splice(removeArray, 1); 
					break;
				}
				break;
				
			case "Poison Tips":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list					
						
						break;
				
					case "Turn":
					
						this.attachedUnit.receivePureDamage(this.buffStats.damage, "Poison Tips")
						
						this.buffStats.duration--; //reduce buff time;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						this.removeBuff(); 	
						
						break;
				}   
			break;
			
			case "Polarity": 
			
				switch (Procedure) {
					
					case "Initialize":
		
						this.sourceUnit.abilityMarkers("off", this.buffStats.range);
					
						var coords = { x: this.targetSpot[0].x, y: this.targetSpot[0].y }
						
						var target1 = this.targetSpot[0];
						var target2 = this.targetSpot[1];
						
						target1.x = target2.x;
						target1.y = target2.y;
						
						target2.x = coords.x
						target2.y = coords.y;
						
						GridSpot[target2.x][target2.y].currentUnit = target2;
						GridSpot[target1.x][target1.y].currentUnit = target1;	
						
						combatLog.push(target1.baseStats[0] + " swapped places with " + target2.baseStats[0]);
						
					break;
					
				}
			
			break;	
				
			case "Precision": 
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list
						
						this.attachedUnit.buffStats[2] += this.buffStats.damage;
						this.attachedUnit.currentStats[2] += this.buffStats.damage;							
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--;
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
						
					case "Attack":
					
						this.eventProc("Removal");
						
						break;
					
					case "Removal":
					
						this.removeBuff(); 
						
						this.attachedUnit.buffStats[2] -=  this.buffStats.damage;		
						
						break;
				}   
			break;
			
			case "Rain Shield":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
						
						this.attachedUnit.buffStats[3] += this.buffStats.defense;
						this.attachedUnit.currentStats[3] += this.buffStats.defense;
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); };
						
						break;
						
					case "Defend":
					
						var heal = this.attachedUnit.currentStats[3] - source.currentStats[2];
						
						if (heal + this.attachedUnit.currentStats[1] <= this.attachedUnit.baseStats[1]) {							
							this.attachedUnit.heal(heal, this.sourceUnit.baseStats[0])
						} else if (heal + this.attachedUnit.currentStats[1] > this.attachedUnit.baseStats[1]) {							
							this.attachedUnit.heal(this.attachedUnit.baseStats[1] - this.attachedUnit.currentStats[1],this.sourceUnit.baseStats[0]);
						}
						
						this.buffStats.blocks--;
						if (this.buffStats.blocks == 0) { this.eventProc("Removal"); };
					
						break;
					
					case "Removal":
					
						this.removeBuff();
						
						this.attachedUnit.buffStats[3] -= this.buffStats.defense 	
						
						break;
				}   
			break;
			
			case "Rapid Strikes": 
			
				switch(Procedure) {
				
					case "Initialize":
					
						this.attachedUnit.buffList.push(this);
					
						this.attachedUnit.currentStats[8] += this.buffStats.attacks;  
						
						break;
						
					case "Turn":
						
						this.eventProc("Removal");
						
						break;
					
					case "Removal":
					
						this.removeBuff(); 	
						
						break;
				}   
			break;	
			
			case "Second Wind":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
						
						this.attachedUnit.currentStats[4] += this.buffStats.speed;							
						
						break;					
						
					case "Turn":
						
						this.eventProc("Removal");
						
						break;
					
					case "Removal":
					
						this.removeBuff(); 	
						
						break;
				}   
			break;
				
			case "Sentry":

				switch(Procedure) {
				
					case "Initialize":
					
					if (this.attachedUnit == this.sourceUnit) {		// initial cast by crossbowman
						
						this.attachedUnit.buffList.push(this);

						this.aura = new tileModifier(this.attachedUnit, this.buffType);
						
						this.aura.attachedBuff = this; //Used For Referencing the buff from the aura
						
						this.attachedUnit.auras.push(this.aura);
						this.attachedUnit.auraTileModifier("on", this.aura);
						
					} else if (this.attachedUnit == this.sourceUnit.sourceUnit) { 	// prevents self targeting
						
					} else { 	// shoot someone's face off
						var xbowman = this.sourceUnit.sourceUnit;
					
						this.attachedUnit.receivePureDamage(this.buffStats.damage, xbowman.baseStats[0]);
						
						var sentry = this.sourceUnit;
						
						sentry.stats.attacks--;
						if (sentry.stats.attacks == 0) {
							
							this.eventProc("Removal");
							// remove aura	
						}
					}
					
				break;
				
				case "Move":
				
					//if crossbowman moves it should probably do removal right?
				
				break;
				
				case "Removal":
					
					this.sourceUnit.sourceUnit.auraTileModifier("off", this.sourceUnit) //TURN AURA OFF from the xbowman
					var rem = listReturnArray(this.sourceUnit.sourceUnit.auras, this.sourceUnit.name); //find aura on xbowman auralist
					if (rem != -1) { this.sourceUnit.sourceUnit.auras.splice(rem, 1); }	//remove aura from xbowman auralist
					this.sourceUnit.attachedBuff.removeBuff();	//remove the buff that is attached to xbowman(we set .attachedBuff inside "Initialize"
					
					
					//this.attachedUnit.auraTileModifier("off", this.aura);    not needed.
				
				break;
				}
			break;			
			
			case "Smoke Screen":
				
				switch(Procedure) {					
				
					case "Initialize":
					
						if (this.sourceUnit instanceof Unit) { 
						
							var smokeScreenTiles = this.targetSpot;
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( smokeScreenTiles );
							Trap.affectedTiles(Instructions);
								
						}					
						
						if (this.sourceUnit instanceof tileModifier) {
						   
							this.attachedUnit.buffList.push(this);
					
							this.attachedUnit.stealth("on", this);	
							this.attachedUnit.noStealthList = [];			
						
						}
						
					break;
					
					case "Move":					
						
						this.eventProc("Removal");
						
					break;
					
					case "Removal":
					
						this.removeBuff();	
						this.attachedUnit.stealth("off");		
						
					break;
					
				}
					
			break;
			
			case "Soulfire":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list	
						alert (this.attachedUnit.name);	
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; //reduce buff time;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						this.attachedUnit.heal(this.buffStats.hitpoints, this.buffType);
						
						break;
					
					case "Removal":
					
						this.removeBuff();	
						
						break;
				}   
			break;
			
			case "Static":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
						
						this.attachedUnit.currentStats[2] += this.buffStats.damage 
						this.attachedUnit.buffStats[2] += this.buffStats.damage
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; 
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						this.removeBuff();	
						
						this.attachedUnit.currentStats[2] -= this.buffStats.damage 
						this.attachedUnit.buffStats[2] -= this.buffStats.damage						
						
						break;
				}   
			break;
			
			case "Stealth":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.stealth("on");
						if (this.attachedUnit.unitStealth == true) {
						this.attachedUnit.buffList.push(this); }
						
						break;
					
					case "Attack":
					
						this.eventProc("Removal");
						break;
						
					case "StealthRemoval":
						
						this.eventProc("Removal");
						break;
					
					case "Removal":
					
						
						//if (removeArray != -1) {
						//this.attachedUnit.stealth("off"); 
						var removeArray = listReturnArray(this.attachedUnit.buffList, this);
						this.attachedUnit.buffList.splice(removeArray, 1);	//}
						this.attachedUnit.stealth("off"); 
						
						break;
				}   
			break;
			
			case "Stomp":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list
						
						this.attachedUnit.buffStats[4] += this.buffStats.speed;
						this.attachedUnit.currentStats[4] += this.buffStats.speed;
						if (this.attachedUnit.currentStats[4] < 0) { this.attachedUnit.currentStats[4] = 0; }				
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; //reduce buff time;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						this.removeBuff();
						
						this.attachedUnit.buffStats[4] -= this.buffStats.speed; 	
						
						break;
				}   
			break;
			
			case "Teleport":	
			
				var targetGridSpot = this.attachedUnit;
			
				switch(Procedure) {
				
					case "Initialize":
						
						var coords = { x: this.sourceUnit.x, y: this.sourceUnit.y };
						
						GridSpot[coords.x][coords.y].currentUnit.Remove();					
						
						targetGridSpot.currentUnit = this.sourceUnit;
						targetGridSpot.currentUnit.x = targetGridSpot.x;
						targetGridSpot.currentUnit.y = targetGridSpot.y;
						targetGridSpot.currentUnit.sight("on");
						targetGridSpot.currentUnit.Select();						
						
						break;	
				}   
			break;
			
			case "Thunderclap":
			
				switch(Procedure) {
				
					case "Initialize":
						
						var damage = Math.ceil(this.attachedUnit.currentStats[1] / 2)
						this.attachedUnit.receivePureDamage(damage, this.sourceUnit)
						
						break;
				}   
			break;					
				
			case "Torch":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
						this.attachedUnit.reveal("off");
						this.attachedUnit.currentStats[7] += this.buffStats.reveal;
						this.attachedUnit.reveal("on");
						this.attachedUnit.buffStats[7] += this.buffStats.reveal;
						//this.attachedUnit.resetStats("BUFF");
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; 
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						this.removeBuff();	
						
						this.attachedUnit.buffStats[7] -= this.buffStats.reveal;						
						
						break;
				}   
			break;
			
			case "Wound":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	
						
						this.attachedUnit.buffStats[4] += this.buffStats.speed				
						
						break;
				
					case "Turn":
					
						this.buffStats.duration--;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						this.removeBuff();
						
						this.attachedUnit.buffStats[4] -= this.buffStats.speed	 	
						
						break;
				}   
			break;				
		}
		
		if (this.attachedUnit != null) { this.attachedUnit.resetStats("BUFF"); } return this.removeReturn;
	}
	
newBuff.prototype.removeBuff = function() {
	
	removeArray = listReturnArray(this.attachedUnit.buffList, this);
	
	if (removeArray != -1) { 
		this.attachedUnit.buffList.splice(removeArray, 1); this.removeReturn = true;
	} else {
		alert("Buff being removed outside of buff class");
	}
	
}