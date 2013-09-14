
 function newBuff(buff, targetUnit, source)
	  {
		this.buffType = buff;
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
	   newBuff.prototype.eventProc = function(Procedure)
	    {
		switch(this.buffType) {
			
			case "Blind": 
			
				switch(Procedure) {
				
					case "Initialize":
					
						// disconnect variables
						var buffStats = ability.abilityStats(this.buffType); 
						for (var i = 0; i < buffStats.length; i++) { this.customValue[i] = buffStats[i]; }
						
						this.procList.push("Turn"); // why 3 pushes that are always done? why are these pushes here?
						this.procList.push("Initialize");
						this.procList.push("Removal");
						
						this.attachedUnit.buffList.push(this);
						this.attachedUnit.buffStats[5] = 1 - this.attachedUnit.baseStats[5];
						
						break;
				
					case "Turn":
						
						this.customValue[1]--; //reduce buff time;  
						if (this.customValue[1] == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 
						this.attachedUnit.buffStats[5] = 0;
					
						break;
				}   
			break;
		
			case "Engulf":
				switch(Procedure){
				
						case "Initialize":
					var buffStats = ability.abilityStats(this.buffType); for (var i = 0; i < buffStats.length; i++) { this.customValue[i] = buffStats[i]; } //this disconnect variables...
					this.procList.push("Turn");
					this.procList.push("Initialize");
					this.procList.push("Removal");
					this.attachedUnit.noStealthList.push(this);
					this.attachedUnit.buffList.push(this);
					break;
				
						case "Turn":
					this.attachedUnit.currentStats[1] -= this.customValue[4]; //reduce damage
					this.customValue[1]--; //reduce buff time;
						if (this.customValue[1] == 0) { this.eventProc("Removal"); }
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
				switch(Procedure){
				
						case "Initialize":
					var buffStats = ability.abilityStats(this.buffType); for (var i = 0; i < buffStats.length; i++) { this.customValue[i] = buffStats[i]; } //this disconnect variables...
					this.procList.push("Turn");
					this.procList.push("Initialize");
					this.procList.push("Removal");
					this.attachedUnit.noStealthList.push(this);
					this.attachedUnit.buffList.push(this);
					//aura based ability holder
					break;
				
						case "Turn":
					//this.customValue[6] = this.customValue[4]; //reset how many units can be affected this turn
					this.customValue[1]--; //reduce buff time;
						if (this.customValue[1] == 0) { this.eventProc("Removal"); }
					break;
					
						case "Removal":
					var removeArray = listReturnArray(this.attachedUnit.noStealthList, this);
					this.attachedUnit.noStealthList.splice(removeArray, 1);
					removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
					this.attachedUnit.buffList.splice(removeArray, 1); 
					break;
				}   
				break;	
				
				
			case "Torch":
				switch(Procedure){
				
						case "Initialize":
					var buffStats = ability.abilityStats(this.buffType); for (var i = 0; i < buffStats.length; i++) { this.customValue[i] = buffStats[i]; } //this disconnect variables...
					this.procList.push("Turn");
					this.procList.push("Initialize");
					this.procList.push("Removal");
					this.attachedUnit.buffList.push(this);
					this.attachedUnit.buffStats[7] += this.customValue[4];
					break;
				
						case "Turn":
					this.customValue[1]--; //reduce buff time;  
						if (this.customValue[1] == 0) { this.eventProc("Removal"); }
					break;
					
						case "Removal":
					removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
					this.attachedUnit.buffList.splice(removeArray, 1); 
					this.attachedUnit.buffStats[7] -= this.customValue[4];
					break;
				}   
				break;
				
				case "Soulfire":
				switch(Procedure){
				
						case "Initialize":
					var buffStats = ability.abilityStats(this.buffType); for (var i = 0; i < buffStats.length; i++) { this.customValue[i] = buffStats[i]; } //this disconnect variables...
					this.procList.push("Turn");
					this.procList.push("Initialize");
					this.procList.push("Removal");
					this.attachedUnit.buffList.push(this);
					break;
				
						case "Turn":
					this.customValue[1]--; //reduce buff time;
					//this.attachedUnit.currentStats[1] += this.customValue[4];
					var lifeMissing = this.attachedUnit.baseStats[1] - this.attachedUnit.currentStats[1];
					var addingLife = this.customValue[4];
					if (lifeMissing < addingLife) { addingLife -= lifeMissing; }
					if (lifeMissing > 0) { this.attachedUnit.currentStats[1] += addingLife; }
					
						if (this.customValue[1] == 0) { this.eventProc("Removal"); }
					break;
					
						case "Removal":
					removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
					this.attachedUnit.buffList.splice(removeArray, 1); 
					break;
				}   
				break;
				
			case "Rapid Strikes": 
			
				switch(Procedure) {
				
					case "Initialize":
					
						// disconnect variables
						var buffStats = ability.abilityStats(this.buffType); 
						for (var i = 0; i < buffStats.length; i++) { this.customValue[i] = buffStats[i]; }
						
						this.procList.push("Turn");
						this.procList.push("Initialize");
						this.procList.push("Removal");
						
						this.attachedUnit.buffList.push(this);
						this.attachedUnit.buffStats[8] += this.customValue[4];
						
						break;
				
					case "Turn":
						
						this.customValue[1]--; //reduce buff time;  
						if (this.customValue[1] == 0) { this.eventProc("Removal"); }
						
						break;
					
					case "Removal":
					
						removeArray = listReturnArray(this.attachedUnit.buffList, this.buffType);
						this.attachedUnit.buffList.splice(removeArray, 1); 
						this.attachedUnit.buffStats[7] -= this.customValue[4];
					
						break;
				}   
			break;			
		}
	}

