
var AllUnits;
var Summons;

function UnitStats()
{
//Initializing Global variables cannot include other variables in their definition-- so I define them here.
AllUnits = new Array(
Vangaurd, Nightmare, Firebringer, Seer,     		 			//fire units
Assassin, Infiltrator, Sensei, Illusionist, /*MirrorImage,*/	//air units
Crossbowman, Sharpshooter, Ranger, Grovekeeper, 	 			//earth units
Charger, Ironfist, Inductor, Titan,                  			//lightning units
IceSpirit, Theurgist, Healer, Rainmaker);			 			//water units

this.generals = [];
this.initializeStats("generals");

Summons = new Array(
MirrorImage, FieryEye);
}

UnitStats.prototype.initializeStats = function(unitType) {
	
	switch (unitType) {
		
		case "generals":
		
			this.generals.push({
				name: "Phoenix",
				image: Images[50],
				life: 18,
				damage: 7,
				defense: 4,
				speed: 5,
				sight: 5,
				reveal: 2,
				attacks: 1,
				blocks: 3,
				castAbilities: ["Sixth Sense", "Heat Shield", "Meteor"],
				element: "Fire"			
			});	
		
			this.generals.push({
				name: "Djinn",
				image: Images[51],
				life: 18,
				damage: 7,
				defense: 4,
				speed: 5,
				sight: 5,
				reveal: 2,
				attacks: 1,
				blocks: 3,
				castAbilities: ["Sixth Sense", "Heat Shield", "Meteor"],
				element: "Air"			
			});	
		
			this.generals.push({
				name: "Furion",
				image: Images[52],
				life: 18,
				damage: 7,
				defense: 4,
				speed: 5,
				sight: 5,
				reveal: 2,
				attacks: 1,
				blocks: 3,
				castAbilities: ["Sixth Sense", "Heat Shield", "Meteor"],
				element: "Earth"			
			});	
		
			this.generals.push({
				name: "Odin",
				image: Images[53],
				life: 18,
				damage: 7,
				defense: 4,
				speed: 5,
				sight: 5,
				reveal: 2,
				attacks: 1,
				blocks: 3,
				castAbilities: ["Sixth Sense", "Heat Shield", "Meteor"],
				element: "Lightning"			
			});	
		
			this.generals.push({
				name: "Leviathan",
				image: Images[54],
				life: 18,
				damage: 7,
				defense: 4,
				speed: 5,
				sight: 5,
				reveal: 2,
				attacks: 1,
				blocks: 3,
				castAbilities: ["Sixth Sense", "Heat Shield", "Meteor"],
				element: "Water"			
			});			
		
		break;
		
	}
	
}

function returnUnitStats(name)
{
	for (var i = 0; i < AllUnits.length; i++) {
	
		if (AllUnits[i][0] == name) { return AllUnits[i]; }
	}
	
	for (var i = 0; i < Summons.length; i++) {
	
		if (Summons[i][0] == name) { return Summons[i]; }
	}
}

//might want to reduce the amount of global variables... make these all private 'this.variables'
var FieryEye = new Array(
"Fiery Eye",       //name
"1",      //hitpoints
"0",      //damage
"0",      //defence
"4",      //movement
"2",      //sight
"0",      //range
"1",      //reveal
"0",      //#attack
"0",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"",   //ability
"Fire"		//element
);



var Vangaurd = new Array(
"Vangaurd",	//name
"10",      //hitpoints1
"5",       //damage2
"4",       //defence3
"5",       //movement4
"4",       //sight5
"1",       //range6
"1",       //reveal 7
"1",       //#attack8
"3",       //#defend9
"Engulf",  //onAttackAbility10
"0",       //onDefendAbility11
"0, 0",    //auras12
"Engulf",    //ability13
"Fire"	   //element14
);
 
var Nightmare = new Array(
"Nightmare",     //name
"8",      //hitpoints
"6",      //damage
"4",      //defence
"5",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"Panic Aura",   //auras
"Panic Aura",   //ability
"Fire"		//element
);
 
var Firebringer = new Array(
"Firebringer",      //name
"7",      //hitpoints
"4",     //damage
"3",      //defence
"5",      //movement
"4",      //sight
"2",      //range
"0",      //reveal
"1",      //#attack
"2",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Soulfire, Fiery Eye",   //ability
"Fire"		//element
);
 
var Seer = new Array(
"Seer",       //name
"8",      //hitpoints
"3",     //damage
"3",      //defence
"5",      //movement
"5",      //sight
"2",      //range
"0",      //reveal
"1",      //#attack
"2",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Magma Trap, Fire Wall",   //ability
"Fire"		//element
);
 
var Assassin = new Array(
"Assassin",       //name
"11",      //hitpoints
"6",      //damage
"3",      //defence
"5",      //movement
"3",      //sight
"1",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"Ambush",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Stealth, Ambush",  //ability
"Air"		//element
);
 
var Infiltrator = new Array(
"Infiltrator",       //name
"8",      //hitpoints
"6",      //damage
"3",      //defence
"4",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Stealth, Blind",   //ability
"Air"		//element
);
 
var Sensei = new Array(
"Sensei",       //name
"10",      //hitpoints
"5",      //damage
"3",      //defence
"5",      //movement
"3",      //sight
"1",      //range
"0",      //reveal
"1",      //#attack
"2",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Precision, Second Wind",   //ability
"Air"		//element
);
 
var Illusionist = new Array(
"Illusionist",       //name
"7",      //hitpoints
"4",      //damage
"2",      //defence
"5",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Mirror Image, Smoke Screen",   //ability
"Air"		//element
);

var MirrorImage = new Array(
"Mirror Image",       //name
"1",      //hitpoints
"1",      //damage
"0",      //defence
"4",      //movement
"2",      //sight
"0",      //range
"0",      //reveal
"1",      //#attack
"0",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"None",   //ability
"Air"		//element
);
 
var Crossbowman = new Array(
"Crossbowman",       //name
"8",      //hitpoints
"5",      //damage
"4",      //defence
"4",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Sentry",   //ability
"Earth"		//element
);
 
var Sharpshooter = new Array(
"Sharpshooter",       //name
"7",      //hitpoints
"6",      //damage
"2",      //defence
"3",      //movement
"5",      //sight
"4",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Wound",   //ability
"Earth"		//element
);
 
var Ranger = new Array(
"Ranger",       //name
"8",      //hitpoints
"5",      //damage
"4",      //defence
"4",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"Poison Tips",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Bark Armor, Poison Tips",   //ability
"Earth"		//element
);
 
var Grovekeeper = new Array(
"Grovekeeper",       //name
"7",      //hitpoints
"4",      //damage
"2",      //defence
"5",      //movement
"3",      //sight
"2",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Arrowsmith, Creeping Vines",   //ability
"Earth"		//element
);
 
var Charger = new Array(
"Charger",       //name
"13",      //hitpoints
"4",      //damage
"3",      //defence
"6",      //movement
"3",      //sight
"1",      //range
"0",      //reveal
"1",      //#attack
"2",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Rapid Strikes",   //ability
"Lightning"	//element
);
 
var Ironfist = new Array(
"Ironfist",       //name
"11",      //hitpoints
"6",      //damage
"4",      //defence
"6",      //movement
"3",      //sight
"1",      //range
"0",      //reveal
"1",      //#attack
"2",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Thunderclap, Stomp",   //ability
"Lightning"	//element
);
 
var Inductor = new Array(
"Inductor",       //name
"8",      //hitpoints
"4",      //damage
"2",      //defence
"5",      //movement
"3",      //sight
"2",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Static, Haste",   //ability
"Lightning"	//element
);
 
var Titan = new Array(
"Titan",       //name
"8",      //hitpoints
"4",      //damage
"3",      //defence
"5",      //movement
"4",      //sight
"2",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Polarity, Energy Field",   //ability
"Lightning"	//element
);
 
var IceSpirit = new Array(
"Ice Spirit",       //name
"15",      //hitpoints
"5",      //damage
"7",      //defence
"5",      //movement
"3",      //sight
"1",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"Frostbite",      //onAttackAbility
"0",     //onDefendAbility
"0, 0",   //auras
"Frostbite, Exothermia",   //ability
"Water"	//element
);
 
var Theurgist = new Array(
"Theurgist",       //name
"12",      //hitpoints
"5",      //damage
"4",      //defence
"4",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Entanglement, Condense",   //ability
"Water"	//element
);
 
var Healer = new Array(
"Healer",       //name
"8",      //hitpoints
"3",      //damage
"3",      //defence
"4",      //movement
"3",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Teleport, Heal",   //ability
"Water"	//element
);
 
var Rainmaker = new Array(
"Rainmaker",       //name 0
"11",      //hitpoints 1 
"4",      //damage2 
"3",      //defence3
"5",      //movement4
"3",      //sight5
"3",      //range 6
"0",      //reveal 7
"1",      //#attack8
"1",      //#defend9
"0",      //onAttackAbility10
"0",      //onDefendAbility11
"0, 0",   //auras12
"Mist, Rain Shield",   //ability13
"Water"	//element14
);

 
 
 
 
 
 
 
 
 function stringParseForList(stringToParse) //used to turn a list inside a string into a list of strings.
{
		var ability = new Array();
		var totalAB = stringToParse;
		var abilityNumber = 0;
		var num = 1;
		for (var i = 0; i < totalAB.length; i++) { if (totalAB[i] == ",") { num++; } }
		for (var t = 0; t < num; t++)
		{
		ability[abilityNumber] = "";
		var splitAt = totalAB.indexOf(",");
		if (splitAt == -1) { splitAt = totalAB.length; t = num; }
		for (var i = 0; i < splitAt; i++) 
		{ 
		ability[abilityNumber] += totalAB[i]; 
		}
		totalAB = totalAB.replace(ability[abilityNumber] + ", ",'');
		abilityNumber++;
		}
		
		return ability;
}


// will return a unit object based on name entered, returns -1 if no unit is found by that name
UnitStats.prototype.getUnitByName = function (name) {
	
	for (var i = 0; i < this.generals.length; i++) {
		if (this.generals[i].name == name) { return this.generals[i]; }
	}
	
	return -1;
	
}