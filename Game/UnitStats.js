
var AllUnits;

function UnitStats()
{
//Initializing Global variables cannot include other variables in their definition-- so I define them here.
AllUnits = new Array(
Vangaurd, Elemental, Firebringer, Seer,     		 //fire units
Assassin, Infiltrator, Sensei, Illusionist,   		 //air units
Crossbowman, Sharpshooter, Ranger, Grovekeeper, 	 //earth units
Charger, Ironfist, Inductor, Titan,                  //lightning units
Lifeforce, Theurgist, Healer, Rainmaker);			 //water units
}

function returnUnitStats(name)
{
	for (var i = 0; i < AllUnits.length; i++)
	{
		if (AllUnits[i][0] == name) { return AllUnits[i]; }
	}
}

//might want to reduce the amount of global variables... make these all private 'this.variables'
var Vangaurd = new Array(
"Vangaurd",	//name
"12",      //hitpoints1
"5",       //damage2
"4",       //defence3
"5",       //movement4
"3",       //sight5
"1",       //range6
"2",       //reveal7
"1",       //#attack8
"2",       //#defend9
"Engulf",  //onAttackAbility10
"0",       //onDefendAbility11
"0, 0",    //auras12
"Engulf",    //ability13
"Fire"	   //element14
);
 
var Elemental = new Array(
"Elemental",     //name
"8",      //hitpoints
"6",      //damage
"3",      //defence
"5",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"2",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"Panic Aura",   //auras
"Panic Aura",   //ability
"Fire"		//element
);
 
var Firebringer = new Array(
"Firebringer",      //name
"6",      //hitpoints
"4",     //damage
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
"Torch, Soulfire",   //ability
"Fire"		//element
);
 
var Seer = new Array(
"Seer",       //name
"8",      //hitpoints
"3",     //damage
"3",      //defence
"5",      //movement
"4",      //sight
"3",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Lay Mine, Firewall",   //ability
"Fire"		//element
);
 
var Assassin = new Array(
"Assassin",       //name
"11",      //hitpoints
"7",      //damage
"3",      //defence
"5",      //movement
"3",      //sight
"1",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Stealth DD",   //ability
"Air"		//element
);
 
var Infiltrator = new Array(
"Infiltrator",       //name
"8",      //hitpoints
"6",      //damage
"4",      //defence
"4",      //movement
"5",      //sight
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
"Mirror Image, Smokescreen",   //ability
"Air"		//element
);
 
var Crossbowman = new Array(
"Crossbowman",       //name
"8",      //hitpoints
"5",      //damage
"4",      //defence
"4",      //movement
"3",      //sight
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
"3",      //defence
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
"3",      //defence
"5",      //movement
"3",      //sight
"2",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Arrow Smith, Rootfield",   //ability
"Earth"		//element
);
 
var Charger = new Array(
"Charger",       //name
"13",      //hitpoints
"4",      //damage
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
"Rapid Strikes",   //ability
"Lightning"	//element
);
 
var Ironfist = new Array(
"Ironfist",       //name
"11",      //hitpoints
"6",      //damage
"4",      //defence
"4",      //movement
"4",      //sight
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
"7",      //hitpoints
"4",      //damage
"4",      //defence
"5",      //movement
"3",      //sight
"3",      //range
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
"Polarity, Electric Field",   //ability
"Lightning"	//element
);
 
var Lifeforce = new Array(
"Lifeforce",       //name
"15",      //hitpoints
"5",      //damage
"6",      //defence
"5",      //movement
"4",      //sight
"1",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"Frostbite",      //onAttackAbility
"0",     //onDefendAbility
"0, 0",   //auras
"Frostbite",   //ability
"Water"	//element
);
 
var Theurgist = new Array(
"Theurgist",       //name
"11",      //hitpoints
"5",      //damage
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
"Entanglement, Vapourize",   //ability
"Water"	//element
);
 
var Healer = new Array(
"Healer",       //name
"8",      //hitpoints
"3",      //damage
"2",      //defence
"5",      //movement
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
"Rainmaker",       //name
"9",      //hitpoints
"4",      //damage
"3",      //defence
"6",      //movement
"2",      //sight
"2",      //range
"0",      //reveal
"1",      //#attack
"1",      //#defend
"0",      //onAttackAbility
"0",      //onDefendAbility
"0, 0",   //auras
"Mist, Rain Shield",   //ability
"Water"	//element
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