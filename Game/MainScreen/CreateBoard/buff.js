
 function newBuff(buff, targetUnit, source)
	  {
		this.buffType = buff;
		this.buffStats			// holds buffstats object
		this.attachedUnit = targetUnit;
		this.sourceUnit = source;
		this.customValue = new Array(8);
		this.procList = new Array();
		this.eventProc("Initialize");
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);
						
						this.attachedUnit.buffStats[3] -= this.buffStats.defense 	
						
						break;
				}   
			break;
			
			case "Blind":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);
					
						this.attachedUnit.sight("off");
					
						this.attachedUnit.currentStats[5] = this.buffStats.sight 
						if (this.attachedUnit.baseStats[6] > this.buffStats.sight) { this.attachedUnit.currentStats[6] = this.buffStats.sight; }
					
						this.attachedUnit.sight("on");
						
					break;
				
					case "Turn":
					
						this.attachedUnit.sight("off");
					
						this.attachedUnit.currentStats[5] = this.buffStats.sight 
						if (this.attachedUnit.baseStats[6] > this.buffStats.sight) { this.attachedUnit.currentStats[6] = this.buffStats.sight; }
					
						this.attachedUnit.sight("on");						
						
						this.buffStats.duration--; 
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
					break;
					
					case "Removal":
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);						
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);	
						
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
						
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);	
						
						break;
				}   
			break;
			
			case "Firewall":
				
				switch(Procedure) {
				
				//buffstats... debuff stuff that is spawned from the tilemod
				
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);
						
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
			
				var targetGridSpot = this.attachedUnit;
			
				switch(Procedure) {
				
					case "Initialize": //initialize modifier
						
						if (this.attachedUnit.name == null) {
							
							var Trap = new tileModifier(this.sourceUnit, this.buffType) 
						
							var Instructions = new Array();
						
							Instructions.push("on");
							Instructions.push( [targetGridSpot] );
							Trap.affectedTiles(Instructions);
						}
						
						// targetGridSpot.push
						if (this.attachedUnit != undefined && this.attachedUnit.buffList != undefined) {
							
							var rem = listReturnArray(this.attachedUnit.currentTileMods, this.sourceUnit);
							var test = [ "off" ];
							
							if (rem != -1) { this.attachedUnit.currentTileMods[rem].affectedTiles(test); }
							
							this.attachedUnit.buffList.push(this);		
							
							this.attachedUnit.receivePureDamage(this.buffStats.damage, this.buffType);
					
							this.attachedUnit.stealth("off", this);				
						
						}   // Do not display buff??						
						
					break;
					
					case "Turn":
					
						this.buffStats.damage--;
						this.attachedUnit.receivePureDamage(this.buffStats.damage, this.buffType);
					
						this.buffStats.duration--;
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
					
					break;
					
					case "Removal":	
					
						var removeArray = listReturnArray(this.attachedUnit.noStealthList, this);
						this.attachedUnit.noStealthList.splice(removeArray, 1);				
						
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 
						
					break;
				}
			break;
				
			case "Panic Aura":

				switch(Procedure) {
				
						case "Initialize":
						
					
					//We use the sourceUnit for the AURA.stats, that way any future buffs have to obey what the aura can currently do:
					if (this.sourceUnit.stats.unitAffectNumber > 0) { this.attachedUnit.currentStats[4] = 0; this.sourceUnit.stats.unitAffectNumber--; } //aura can only affect 1 unit per turn.
					this.attachedUnit.buffList.push(this);
					
					break;
				
						case "Turn":
					
					this.buffStats.duration--; 
					this.sourceUnit.stats.unitAffectNumber = this.buffStats.unitAffectNumber; //we reset the aura's stats by using this.buffStats because we're not modifying the buffstats of that variable here.
					if (listContains(this.attachedUnit.currentTileMods, this.sourceUnit) == true) { this.buffStats.duration = this.resetDuration; }
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
					break;
					
						case "Move":
						 //take out movement
						if (listContains(this.attachedUnit.currentTileMods, this.sourceUnit) == true) { this.buffStats.duration = this.resetDuration; }  //reset duration if moves and still has aura tilemod
					break;
						
						case "Removal":
					var removeArray = listReturnArray(this.attachedUnit.noStealthList, this);
					removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 	
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 	
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 	
						
						break;
				}   
			break;
			
			case "Soulfire":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list		
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; //reduce buff time;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						this.attachedUnit.currentStats[4] += this.buffStats.hitpoints;	
						
						break;
					
					case "Removal":
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);	
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);	
						
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);	
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
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);
						
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
						
						this.attachedUnit.currentStats[7] += this.buffStats.reveal 
						this.attachedUnit.buffStats[7] += this.buffStats.reveal
						
						break;
				
					case "Turn":
						
						this.buffStats.duration--; 
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);	
						
						this.attachedUnit.buffStats[2] -= this.buffStats.reveal;						
						
						break;
				}   
			break;
			
			case "Wound":
			
				switch(Procedure) {
				
					case "Initialize":
						
						this.attachedUnit.buffList.push(this);	// add buff to unit's buff list	
						
						this.attachedUnit.buffStats[4] += this.buffStats.speed				
						
						break;
				
					case "Turn":
					
						this.buffStats.duration--; //reduce buff time;  
						if (this.buffStats.duration == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1);
						
						this.attachedUnit.buffStats[4] -= this.buffStats.speed	 	
						
						break;
				}   
			break;				
		}
		
		if (this.attachedUnit.currentStats != null) { this.attachedUnit.resetStats("BUFF"); }
	}

