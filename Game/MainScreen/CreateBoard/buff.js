
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
				
			case "Arrowsmith":

				switch(Procedure) {
				
					case "Initialize":
					
					if (this.attachedUnit == this.sourceUnit) {		// initial cast by crossbowman
						
						this.attachedUnit.buffList.push(this);

						this.aura = new tileModifier(this.attachedUnit, this.buffType);
						
						this.aura.attachedBuff = this; //Used For Referencing the buff from the aura
						
						this.attachedUnit.auras.push(this.aura);
						this.attachedUnit.auraTileModifier("on", this.aura);
						
					} else if (this.attachedUnit == this.sourceUnit.sourceUnit) { 	// prevents self targeting
						
					} else { 	// give extra attack
						var grovekeeper = this.sourceUnit.sourceUnit;
						
						if (this.attachedUnit.baseStats[6] > 1) {
							this.attachedUnit.buffList.push(this);
							this.attachedUnit.buffStats[8] += this.buffStats.attacks;
						}
					}
					
				break;
				
				case "Turn":					
				
					if (this.buffStats.duration <= 0) {	this.eventProc("Removal"); }
					this.buffStats.duration--;				
					
				break;
				
				case "Move":
				
					this.eventProc("Removal");
				
				break;
				
				case "Removal":
				
					if (this.sourceUnit instanceof tileModifier) {
						this.removeBuff();	
						this.attachedUnit.buffStats[8] -= this.buffStats.attacks;
					} else {				
						/*this.sourceUnit.auraTileModifier("off", this.aura);
						var rem = listReturnArray(this.sourceUnit.auras, this.aura); 
						if (rem != -1) { this.sourceUnit.auras.splice(rem, 1); } */
						this.removeBuff();		
					}
				
				break;
				}
			break;
		
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
					
						this.attachedUnit.reveal("off");
						
						this.buffStats.revealDebuff = this.buffStats.reveal - this.attachedUnit.currentStats[7];					
						this.attachedUnit.buffStats[7] += this.buffStats.revealDebuff;			
						this.attachedUnit.currentStats[7] += this.buffStats.revealDebuff;						
					
						this.attachedUnit.reveal("on");
						
						this.buffStats.rangeDebuff = 0;
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
						this.attachedUnit.buffStats[7] -= this.buffStats.revealDebuff;					
						
					break;
				}   
			break;
			
			case "Condense": // channeled
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
						
						break;
				
					case "Turn":
						
						this.attachedUnit.heal(this.buffStats.life, this.buffType);
						
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
							
							var rem = listReturnArray(this.sourceUnit.tileList, GridSpot[this.attachedUnit.x][this.attachedUnit.y]); //Remove creeping vine tilemod from tilemodifier class' tile list.
							if (rem != -1) { this.sourceUnit.tileList.splice(rem, 1);}
							
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
						
						if (this.sourceUnit instanceof Unit) { 
						
							var energyFieldTiles = this.targetSpot;
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( energyFieldTiles );
							Trap.affectedTiles(Instructions);
								
						}					
						
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
						this.removeTileModifier();	
						
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
						this.removeTileModifier();	
						
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
					
						var targetSpot = this.targetSpot[1];
						var copiedUnit = this.targetSpot[0].currentUnit;
						
						var image = GameBoard.CreateUnit(copiedUnit.alliance, copiedUnit.baseStats[0], targetSpot.x, targetSpot.y);
						
						image.Remove();
						
						image.currentStats = copiedUnit.currentStats.clone();
						
						image.displayStats = true;
						image.fakeStats = image.currentStats.clone();
						image.abilities = [];
						
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
						
						image.currentStats[4] = 0;
												
						image.summon = true;
						image.turnCost = false;
						image.sight("on");
					
						targetSpot.currentUnit = image;
					
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
					
						var isSelf = this.sourceUnit.sourceUnit == this.attachedUnit;	// determines if proc is self
					
						var stacks = false;
						for (var i = 0; i < this.attachedUnit.buffList.length; i++) { 
							if (this.attachedUnit.buffList[i].buffType == this.buffType) { 
								stacks = true; break;
							} 
						}
						
						for (var i = 0; i < this.attachedUnit.currentTileMods.length; i++) { 
											
							if (this.attachedUnit.currentTileMods[i].name == this.buffType && 
								this.attachedUnit.currentTileMods[i].stats.unitAffectNumber > 0 && isSelf == false) { 
								
									if (stacks == false) { this.attachedUnit.currentStats[4] = 0; } 
									
								this.attachedUnit.currentTileMods[i].stats.unitAffectNumber--; 
							}
						
						}					
						
						if (stacks == false) { this.attachedUnit.buffList.push(this); }
					
					break;
				
					case "Turn":
					
						this.buffStats.duration--; 
						this.sourceUnit.stats.unitAffectNumber = this.buffStats.unitAffectNumber;
						
						if (listContains(this.attachedUnit.currentTileMods, this.sourceUnit) == true) { this.buffStats.duration++; }
						
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
					break;
						
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
						
						var grid1 = this.targetSpot[0];
						var grid2 = this.targetSpot[1];
						
						var unit1 = grid1.currentUnit.Remove();
						var unit2 = grid2.currentUnit.Remove();
						
						unit1.currentStats[4] += 1;	
						unit1.Move(grid2);
						unit2.currentStats[4] += 1;
						unit2.Move(grid1);	
						
						combatLog.push(unit1.baseStats[0] + " swapped places with " + unit2.baseStats[0]);
						
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
					
						if (this.attachedUnit.currentStats[9] > 0) {
							
							var healAmount = this.attachedUnit.currentStats[3] - source.currentStats[2];
						
							this.attachedUnit.heal(healAmount, this.buffType);
							
							this.buffStats.blocks--;
							if (this.buffStats.blocks == 0) { this.eventProc("Removal"); };
							
						}
					
					break;
					
					case "Removal":
					
						this.removeBuff();
						
						this.attachedUnit.buffStats[3] -= this.buffStats.defense;	
						
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
					
					if (this.sourceUnit instanceof Unit) {		// initial cast by crossbowman
						
						this.attachedUnit.buffList.push(this);

						this.aura = new tileModifier(this.attachedUnit, this.buffType);
						this.aura.attachedBuff = this;
						
						this.attachedUnit.auras.push(this.aura);
						this.attachedUnit.auraTileModifier("on", this.aura);
						
					} else if (this.sourceUnit instanceof tileModifier) { 	// shoot someone's face off
					
						var xbowman = this.sourceUnit.sourceUnit;						
						var sentry = this.sourceUnit;
						
						if (ClientsTurn && this.attachedUnit.unitStealth == false) {
							
							this.attachedUnit.receivePureDamage(this.buffStats.damage, xbowman.baseStats[0]);
						
							sentry.stats.attacks--;
							if (sentry.stats.attacks == 0) {
								
								sentry.attachedBuff.eventProc("Removal");
								
							}
							this.removeTileModifier();
						}
					}
					
				break;
				
				case "Move":
				
					this.eventProc("Removal");
				
				break;
				
				case "Turn":
				
					this.buffStats.duration--;
					if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
				
				break;
				
				case "Removal":
					
					this.removeBuff();
					this.sourceUnit.auraTileModifier("off", this.aura);
					var rem = listReturnArray(this.sourceUnit.auras, this.aura);
					if (rem != -1) { this.sourceUnit.auras.splice(rem, 1); }
				
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
							
							/* for (i = 0; i < smokeScreenTiles.length; i++) {
								GridSpot[smokeScreenTiles[i].x][smokeScreenTiles[i].y].visionBlock.push(this);
							} */
								
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
						
						this.attachedUnit.buffList.push(this);
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; 
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
					
						var stompList = this.targetSpot;
						
						for (i = 0; i < stompList.length; i++) {
							var target = stompList[i].currentUnit;
							
							if (target != null && target.alliance != this.sourceUnit.alliance) {
								target.buffList.push(this);
							
								target.buffStats[4] += this.buffStats.speed;
								target.currentStats[4] += this.buffStats.speed;
								if (target.currentStats[4] < 0) { target.currentStats[4] = 0; }
							}
						}
						
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
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.sourceUnit.Remove();
						this.sourceUnit.currentStats[4] += 1;
						this.sourceUnit.Move(this.targetSpot);				
						
						break;	
				}   
			break;
			
			case "Thunderclap":
			
				switch(Procedure) {
				
					case "Initialize":
						
						var damage = Math.ceil(this.attachedUnit.currentStats[1] / 2)
						this.attachedUnit.receivePureDamage(damage, this.sourceUnit.name)
						
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
	
	if (this.attachedUnit != undefined) { 
		removeArray = listReturnArray(this.attachedUnit.buffList, this); 
	} else {
		alert(this.buffType + " is trying to remove a buff when it shouldn't")	
	}
	
	if (removeArray != -1) { 
		this.attachedUnit.buffList.splice(removeArray, 1); this.removeReturn = true;
	} else {
		alert("Buff being removed outside of buff class");
	}
	
}

newBuff.prototype.removeTileModifier = function() {
	
	removeArray = listReturnArray(this.attachedUnit.currentTileMods, this.sourceUnit);
	
	if (removeArray != -1) { 
		this.attachedUnit.currentTileMods.splice(removeArray, 1); this.removeReturn = true;
	}
	
}