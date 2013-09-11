


function tileModifier(sourceUnit, auraName) 
{  

this.sourceUnit = sourceUnit;
this.auraName = auraName; //used to get aura stats
this.tileList = new Array();
}

tileModifier.prototype.affectedTiles = function(Instructions)
{
	switch(Instructions[0]) {
	
		case "on":
	if (tileList instanceof Array) {
		for (var i = 0; i < Instructions[1].length; i++)
		{	
			this.tileList[i] = Instructions[1][i];
		}
	}
	else
	{
	this.tileList = tileList;
	}
	break;
		
		case "off":
		//remove froma all tile lists
		break;
	
	
	}
}

