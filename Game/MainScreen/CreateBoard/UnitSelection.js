function SelectionScreen() {
	
	this.id = "selection"	  
	
	this.waiting = false;	// true if waiting for another player to join
	
	this.allyName;
	this.enemyName;
	  
	this.CreateRectanglesAndOrganizeUnits();
	this.ClickedObject = this.MainUnitBox;
	this.Element; this.Value = -1;
	this.pickRectangles;
	
	this.elementBox; 			// holds a rectangle that's the template for all element boxes
	this.unitBox;
	this.generalBox;
	this.initialize();
	
	this.allyPicks = [];	// holds generals for now --- should hold all units later
	this.enemyPicks = [];
	
	this.unitsShown = "units";  // units if showing units, generals if showing generals
	this.unitSelectionBoxes = [];
	
	this.currentPick = 0;
	this.enemyPick = 0;		
	this.numPicks = 9;	// replaces numberOfUnits
	
	this.pickOrder = [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1]; 	// holds the pick order array
	this.pickIndex = 0; // determines where in the pick order
	this.pickCount = this.pickOrder[this.pickIndex]; // determines how many units have been picked for current turn
	this.pickHidden = [0, 8, 9, 17]; // determines which unit picks are hidden from other player, uses pickIndex
	
	Screen = "UnitSelection";
}


SelectionScreen.prototype.initialize = function() {
	
	var hspacer = _.canvas.width * 0.037;
	
	this.elementBox = { width: _.canvas.width * 0.2 - hspacer, height: _.canvas.height * 0.48 };
	this.generalBox = { width: this.elementBox.width * 0.4, height: this.elementBox.width * 0.4 };
	
}
	  
	  
	   SelectionScreen.prototype.ReceiveRemove = function(RemoveNumber)
	  {
		var Removing = this.pickRectangles[RemoveNumber + numberOfUnits];
		Removing.customValue[0] = null;
		Removing.customValue[1] = null;
		Removing.customValue[2] = null;
	  }
	  
	  
	  SelectionScreen.prototype.ReceivePick = function(ElementType)
	  {
		  var elements = ["Fire", "Air", "Earth", "Lightning", "Water"];
		  
		  if (elements.indexOf(ElementType[0]) != -1) {
			var ElementalUnitGroup;
			if (ElementType[0] == "Fire") { ElementalUnitGroup = this.FireUnits;}
			if (ElementType[0] == "Air") { ElementalUnitGroup = this.AirUnits;}
			if (ElementType[0] == "Earth") { ElementalUnitGroup = this.EarthUnits;}
			if (ElementType[0] == "Lightning") { ElementalUnitGroup = this.LightningUnits;}
			if (ElementType[0] == "Water") { ElementalUnitGroup = this.WaterUnits;}
			for (var i = 0; i < numberOfUnits; i++)
				{
					if (this.pickRectangles[i + numberOfUnits].customValue[0] == null)
					{ this.enemyPick = i; break;}
				}
			
			this.pickRectangles[numberOfUnits + this.enemyPick].customValue[0] = ElementalUnitGroup;
			this.pickRectangles[numberOfUnits + this.enemyPick].customValue[1] = ElementType[1];
			this.pickRectangles[numberOfUnits + this.enemyPick].customValue[2] = ElementType[0];
		  } else {
			  var unitName = ElementType;
			  this.enemyPicks.push(UnitStats.getUnitByName(unitName));			  
		  }
	  }
	  
	  
	  SelectionScreen.prototype.RemovePick = function()
	  {
		  if (ClientsTurn == true) {
			  var number = this.pickRectangles.indexOf(this.ClickedObject);
			  if (number < numberOfUnits && number != -1)          //Add stipulation of unit is inside current pickphase
			  {
				  sendPacket("removeUnit", number)
	  
				  var Removing = this.pickRectangles[number];
				  
				  Removing.customValue[0] = null;
				  Removing.customValue[1] = null;
				  Removing.customValue[2] = null;
				  
				  this.ClickedObject.clicked = false;
				  
				  this.pickCount++;
			  }
		  }
	  }
	  
	  
	  SelectionScreen.prototype.AddPick = function()
	  {
		  if (ClientsTurn == true) {
			  
			  if (this.unitsShown == "units") {
		  
				  for (var i = 0; i < numberOfUnits; i++) //figures out where the selected unit goes...
					  {
						  if (this.pickRectangles[i].customValue[0] == null)
						  { this.currentPick = i; break;}
					  }
					  if (this.currentPick < numberOfUnits && this.pickCount > 0) { 
					  var SendElement = this.ClickedObject.customValue[2];
					  var SendValue = this.ClickedObject.customValue[1];
					  this.pickRectangles[this.currentPick].customValue[0] = this.ClickedObject.customValue[0];
					  this.pickRectangles[this.currentPick].customValue[1] = this.ClickedObject.customValue[1];
					  this.pickRectangles[this.currentPick].customValue[2] = this.ClickedObject.customValue[2];
					  this.pickRectangles[this.currentPick].customValue[3] = this.ClickedObject.customValue[3];
					  sendPacket("selectUnit", [SendElement, SendValue]);
					  
					  this.currentPick++;
					  this.pickCount--;
					  }
					  
			  } else if (this.unitsShown == "generals") {
				
					if (this.ClickedObject != null) {
					
						this.allyPicks.push(this.ClickedObject.object);
						sendPacket("selectUnit", this.ClickedObject.object.name);
						
					}
				  
			  }
				  
		  }
	  }
	  
	  //Clicking*********
	  SelectionScreen.prototype.ClickisWithin = function(Mouse)
	  {
	  //if unit clicks on "remove unit", set the customvalues[0 and 1] to null... 
		if (this.ClickedObject != null && this.RemoveSelectedBox.Contains(Mouse) == true && this.ClickedObject.clicked == true) { this.RemovePick(); }
		if (this.ClickedObject != null && this.SelectUnitBox.Contains(Mouse) == true && this.ClickedObject.clicked == true) { this.AddPick(); return; }
		
		
		// End turn / phase logic
	    if (this.NextStageBox.Contains(Mouse) == true) { 
			
			if (this.currentPick < this.numPicks) { // end turn
			
				if (this.pickCount == 0) {			
					
					this.pickIndex = this.pickIndex + 2;
					this.pickCount = this.pickOrder[this.pickIndex];
					
					ClientsTurn = false;
					sendPacket("endTurn");				
					
				} else {
					
					alert("Please pick " + this.pickCount + " more unit(s)")
					
				}
				
			} else if (this.currentPick == this.numPicks && this.allyPicks.length == 0) {   // generals pick
 
 				this.unitsShown = "generals";
				this.createUnitSelectionBoxes();
				
				sendPacket("endTurn");
 
			} else {	// end phase		
			
				ClientsTurn = false;
				sendPacket2("endPhase", "selection");
				GameBoard = new Board(this.pickRectangles, this.allyPicks, this.enemyPicks); 
			}
		}
			
		
		this.UnitClicked(Mouse); //checks if a unit was clicked
		
		for (var i = 0; i < this.pickRectangles.length; i++) //Checks if a picked unit was selected
		{
			if (this.pickRectangles[i].Contains(Mouse) == true && this.pickRectangles[i].customValue[0] != null) 
			{ 
			this.pickRectangles[i].clicked = true; this.ClickedObject = this.pickRectangles[i];
			this.DisplayStats(this.pickRectangles[i].customValue[0], this.pickRectangles[i].customValue[1]);
			break;
			}
		}
		
	  }
	  
	  
SelectionScreen.prototype.UnitClicked = function(Mouse) {
	
	if (this.unitsShown == "units") {
		if (this.ClickedObject != null) {this.ClickedObject.clicked = false;}
		for (var i = 0; i < this.ClickableRectangles.length; i++)
		{
			if (this.ClickableRectangles[i].Contains(Mouse) == true)
			{
				// if (this.ClickedObject == this.ClickableRectangles[i]) { this.AddPick();}
				this.ClickedObject = this.ClickableRectangles[i]; 
				this.ClickedObject.clicked = true;
				
				break;
			}
		}
		if (this.ClickedObject.customValue[1] != null)
		{
		 this.DisplayStats(this.ClickedObject.customValue[0], this.ClickedObject.customValue[1]);
		}
		
	} else if (this.unitsShown == "generals") {
	
		for (var i = 0; i < this.unitSelectionBoxes.length; i++) {
		
			if (this.unitSelectionBoxes[i].Contains(_.mouse)) { this.ClickedObject = this.unitSelectionBoxes[i]; }
			
		}
		
	}
}
	  
	  
	  //Sets the stats variables to selected unit.
	  SelectionScreen.prototype.DisplayStats = function(Element, Value)
	  {
		this.Stats = new Array();
		for (var i = 0; i < Element[Value].length; i++)
			{
				this.Stats.push(Element[Value][i]);
			}
	  }

	  
	  SelectionScreen.prototype.Draw = function(context, canvas)
	  {
	  // All background images starting
	    context.font = "bold 16px Arial";
		context.fillStyle = "rgba(38, 38, 38, 0.2)";
		context.fillRect(0, 0, Canvas.width, Canvas.height * 0.8);
		context.fillStyle = "rgba(23, 30, 30, 1)";
		context.fillRect(this.MainUnitBox.x, this.MainUnitBox.y, this.MainUnitBox.width, this.MainUnitBox.height);
		context.fillStyle = "rgba(100, 40, 40, 0.5)";
		context.fillRect(this.FireUnitBox.x, this.FireUnitBox.y, this.FireUnitBox.width, this.FireUnitBox.height);
		context.fillStyle = "rgba(100, 100, 100, 0.5)";
		context.fillRect(this.AirUnitBox.x, this.AirUnitBox.y, this.AirUnitBox.width, this.AirUnitBox.height);
		context.fillStyle = "rgba(40, 100, 40, 0.5)";
		context.fillRect(this.EarthUnitBox.x, this.EarthUnitBox.y, this.EarthUnitBox.width, this.EarthUnitBox.height);
		context.fillStyle = "rgba(150, 150, 40, 0.5)";
		context.fillRect(this.LightningUnitBox.x, this.LightningUnitBox.y, this.LightningUnitBox.width, this.LightningUnitBox.height);
		context.fillStyle = "rgba(40, 40, 100, 0.5)";
		context.fillRect(this.WaterUnitBox.x, this.WaterUnitBox.y, this.WaterUnitBox.width, this.WaterUnitBox.height);
		context.fillStyle = "rgba(40, 40, 40, 1)";
		context.fillRect(this.StatsInfoBox.x, this.StatsInfoBox.y, this.StatsInfoBox.width, this.StatsInfoBox.height);
		context.fillStyle = "rgba(100, 100, 100, 1)";
		context.fillRect(this.PickLine.x, this.PickLine.y, this.PickLine.width, this.PickLine.height);
		// All background images ending
		
		
		//Buttons start
		this.SelectUnitBox.draw();
		this.RemoveSelectedBox.draw();
		this.NextStageBox.draw();

		
		//Draw Units
		if (this.unitsShown == "units") {
			for (var i = 0; i < this.ClickableRectangles.length; i++)
			{
				context.drawImage(Images[ReturnUnitImage(this.ClickableRectangles[i].customValue[0][this.ClickableRectangles[i].customValue[1]][0])], this.ClickableRectangles[i].x, this.ClickableRectangles[i].y, this.ClickableRectangles[i].width, this.ClickableRectangles[i].height);
			}
		} else if (this.unitsShown == "generals") {
			
			for (var i = 0; i < this.unitSelectionBoxes.length; i++) {
				
				var box = this.unitSelectionBoxes[i];
			
				_.context.drawImage(box.image, box.x, box.y, box.width, box.height);
				
			}
				
		}
		//End Draw units
		
		//Draw Selected Unit
		if (this.unitsShown == "units") {
			if (this.ClickedObject != null && this.ClickedObject.clicked == true) 
			{ 
				context.drawImage(Images[3], this.ClickedObject.x, this.ClickedObject.y, this.ClickedObject.width, this.ClickedObject.height);
				context.fillStyle = "Black";
				for (var i = 0; i < this.Stats.length; i++)
				{
					context.fillText(this.Stats[i], this.StatsInfoBox.x, this.StatsInfoBox.y + (i * 13) + 30);
				}
				
			}
			
		} else if (this.unitsShown == "generals") {
		
			if (this.ClickedObject != null) {
				
				var selection = this.ClickedObject;
				var selectionX = selection.x - selection.width * 0.05;
				var selectionY = selection.y - selection.height * 0.05;
				var selectionWidth = selection.width * 1.1;
				var selectionHeight = selection.height * 1.1;
			
				_.context.drawImage(Images[3], selectionX, selectionY, selectionWidth, selectionHeight);
				
			}
			
		}
		//End selectedunit
		
		//Draw picked unit Boxes
			context.fillStyle = "rgba(7, 19, 7, 1)";
			for (var i = 0; i < this.pickRectangles.length; i++)
			{
				if (this.pickRectangles[i].customValue[0] == null){
				context.fillRect(this.pickRectangles[i].x, this.pickRectangles[i].y, this.pickRectangles[i].width, this.pickRectangles[i].height);}
				if (this.pickRectangles[i].customValue[0] != null){
					if (this.pickHidden.indexOf(i) == -1) {
				context.drawImage(Images[ReturnUnitImage(this.pickRectangles[i].customValue[0][this.pickRectangles[i].customValue[1]][0])], this.pickRectangles[i].x, this.pickRectangles[i].y, this.pickRectangles[i].width, this.pickRectangles[i].height);
					} else {
						if (i <= 8) {
				context.drawImage(Images[ReturnUnitImage(this.pickRectangles[i].customValue[0][this.pickRectangles[i].customValue[1]][0])], this.pickRectangles[i].x, this.pickRectangles[i].y, this.pickRectangles[i].width, this.pickRectangles[i].height);							
						} else {
					context.drawImage(Images[104], this.pickRectangles[i].x, this.pickRectangles[i].y, this.pickRectangles[i].width, 
						this.pickRectangles[i].height);	
						}
					}
				}
				if (this.pickRectangles[i].clicked == true) {context.drawImage(Images[3], this.ClickedObject.x, this.ClickedObject.y, this.ClickedObject.width, this.ClickedObject.height); }
			}
			context.fillStyle = "rgba(100, 255, 100, 1)";
			context.fillText("Your Picks", this.PickLine.x + this.PickLine.width * 0.920 / 2, this.PickLine.y * 0.91);
			context.fillStyle = "rgba(255, 100, 100, 1)";
			context.fillText("Enemy Picks", this.PickLine.x + this.PickLine.width * 0.91 / 2, this.PickLine.y + this.PickLine.height * 3 * 3.2);
			context.font = globalFont;
			
			// draw from ally picks
			for (var i = 0; i < this.allyPicks.length; i++) {
			
				if (i < this.allyPicks.length - 1) { // draw units -- not used yet
				
				} else { 	// draw generals
				
					var lastDrawnUnit = this.pickRectangles[this.pickRectangles.length * 0.5 - 1];
				
					var general = this.allyPicks[i];
					var image = general.image;
					var generalX = lastDrawnUnit.x + lastDrawnUnit.width * 1.5;
					var generalY = lastDrawnUnit.y + lastDrawnUnit.height - this.generalBox.height;
					var generalWidth = this.generalBox.width;
					var generalHeight = this.generalBox.height;
					
					_.context.drawImage(image, generalX, generalY, generalWidth, generalHeight);
				
				}				
			}
			
			// draw from enemy picks
			for (var i = 0; i < this.enemyPicks.length; i++) {
			
				if (i < this.enemyPicks.length - 1) { // draw units -- not used yet
				
				} else { 	// draw generals
				
					var lastDrawnUnit = this.pickRectangles[this.pickRectangles.length - 1];
				
					var general = this.enemyPicks[i];
					var image = general.image;
					var generalX = lastDrawnUnit.x + lastDrawnUnit.width * 1.5;
					var generalY = lastDrawnUnit.y + lastDrawnUnit.height - this.generalBox.height;
					var generalWidth = this.generalBox.width;
					var generalHeight = this.generalBox.height;
					
					_.context.drawImage(image, generalX, generalY, generalWidth, generalHeight);
				
				}				
			}
			
		// Draw waiting box		
		if (this.waiting) {
				
				var waitingRect = new Rectangle(0, 0, canvas.width, canvas.height)
				waitingRect.boxColor = "#333"
				waitingRect.setText("Waiting for another player to join", "White", canvas.width * 0.35, canvas.height * 0.52)
				waitingRect.draw()
				
		} else {
					
			// temporary turn fix
			_.context.fillStyle = "#FFF";
			_.context.font = _.font
			if (ClientsTurn) { 
				if (this.unitsShown == "units") {
					_.context.fillText("Your turn to pick - " + this.pickCount, this.StatsInfoBox.width * 0.2, this.StatsInfoBox.y * 1.07);
				} else if (this.unitsShown == "generals") {
					_.context.fillText("Pick your General", this.StatsInfoBox.width * 0.2, this.StatsInfoBox.y * 1.07)	
				}
			} else {
				_.context.fillText("Enemy picking", this.StatsInfoBox.width * 0.2, this.StatsInfoBox.y * 1.07);
			}
		}
	  }
	  
	 
	 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 SelectionScreen.prototype.CreateRectanglesAndOrganizeUnits = function()
	 {
		//background Colored rectangles to draw
		var spacer1 = Canvas.width * 0.009;
		this.MainUnitBox = new Rectangle(spacer1, spacer1, Canvas.width - spacer1 * 2, Canvas.height * 0.8 - spacer1 * 2); this.MainUnitBox.boxColor = "rgba(23, 30, 30, 1)";
		
		spacer = Canvas.width * 0.037;
	    this.FireUnitBox = new Rectangle(spacer, spacer / 2, Canvas.width / 5 - spacer, Canvas.height / 2 - spacer);
		this.FireUnitBox.boxColor = "rgba(100, 40, 40, 0.5)";
		
		this.AirUnitBox = new Rectangle(spacer + Canvas.width / 5 - spacer1, spacer / 2, Canvas.width / 5 - spacer, Canvas.height / 2 - spacer);
		this.AirUnitBox.boxColor = "rgba(100, 100, 100, 0.5)";
		
		this.EarthUnitBox = new Rectangle(spacer + ((Canvas.width / 5 - spacer1) * 2), spacer / 2, Canvas.width / 5 - spacer, Canvas.height / 2 - spacer); 
		this.EarthUnitBox.boxColor = "rgba(40, 100, 40, 0.5)";
		
		this.LightningUnitBox = new Rectangle(spacer + ((Canvas.width / 5 - spacer1) * 3), spacer / 2, Canvas.width / 5 - spacer, Canvas.height / 2 - spacer);
		this.LightningUnitBox.boxColor = "rgba(150, 150, 40, 0.5)";
		
		this.WaterUnitBox = new Rectangle(spacer + ((Canvas.width / 5 - spacer1) * 4), spacer / 2, Canvas.width / 5 - spacer, Canvas.height / 2 - spacer); 
		this.WaterUnitBox.boxColor = "rgba(40, 40, 100, 0.5)";
		
		this.StatsInfoBox = new Rectangle(spacer, Canvas.height / 2, Canvas.width - spacer * 2, (Canvas.height + spacer / 2 - (Canvas.height * 0.8 - spacer) ));
		this.StatsInfoBox.boxColor =  "rgba(40, 40, 40, 1)";

		this.SelectUnitBox = new Rectangle(this.StatsInfoBox.x + this.StatsInfoBox.width * 0.425, this.StatsInfoBox.y 
		+ this.StatsInfoBox.height * 0.04, this.StatsInfoBox.width * 0.15, this.StatsInfoBox.y * 0.08);
		this.SelectUnitBox.setText("Select Unit", "#DDD");
		
		this.NextStageBox = new Rectangle(this.StatsInfoBox.x + this.StatsInfoBox.width * 0.825, this.StatsInfoBox.y 
		+ this.StatsInfoBox.height * 0.04, this.StatsInfoBox.width * 0.15, this.StatsInfoBox.y * 0.08);
		this.NextStageBox.setText("End Turn", "#DDD");
		
		this.RemoveSelectedBox = new Rectangle(this.StatsInfoBox.x + this.StatsInfoBox.width * 0.65, this.StatsInfoBox.y 
		+ this.StatsInfoBox.height * 0.04, this.StatsInfoBox.width * 0.15, this.StatsInfoBox.y * 0.08);		
		this.RemoveSelectedBox.setText("Remove Unit", "#DDD");
		
		this.PickLine = new Rectangle(0, Canvas.height * 0.905, Canvas.width, Canvas.height * 0.007);
		this.PickLine.boxColor = "rgba(100, 100, 100, 1)";
		
		var x = 0;
		var y = 0;
		var UnitSizeX = Canvas.width * 0.0447;
		var UnitSizeY = Canvas.height * 0.0649;
		var UnitStartx = this.PickLine.x + this.PickLine.width * 0.22;
		var UnitStarty = this.PickLine.y - (UnitSizeY * 1.12);
		var spacer = 20;
		this.pickRectangles = new Array();
		for (var i = 0; i < numberOfUnits * 2; i++)
		{
			var NewRec = new Rectangle(UnitStartx + ((UnitSizeX + spacer) * x), UnitStarty + ((UnitSizeY + spacer) * y), UnitSizeX, UnitSizeY);
			this.pickRectangles.push(NewRec);
			x++;
			if (x == numberOfUnits)
			{
				x = 0;
				y++;
			}
		}
		//List of ElementUnits and List of ElementUnitsRectangles
		this.FireUnits = new Array(); this.FireUnitRectangles = new Array();
		this.AirUnits = new Array(); this.AirUnitRectangles = new Array();
		this.EarthUnits = new Array(); this.EarthUnitRectangles = new Array();
		this.LightningUnits = new Array(); this.LightningUnitRectangles = new Array();
		this.WaterUnits = new Array(); this.WaterUnitRectangles = new Array();
		
		//Rectangles that can be clicked
		this.ClickableRectangles = new Array();
		
		for (var i = 0; i < AllUnits.length; i++) //Organize units into their elements
		{ // #14 is unitstat: Element type
			if (AllUnits[i][14] == "Fire") { this.FireUnits.push(AllUnits[i]); }
			if (AllUnits[i][14] == "Air") { this.AirUnits.push(AllUnits[i]); }
			if (AllUnits[i][14] == "Earth") { this.EarthUnits.push(AllUnits[i]);}
			if (AllUnits[i][14] == "Lightning") { this.LightningUnits.push(AllUnits[i]);}
			if (AllUnits[i][14] == "Water") { this.WaterUnits.push(AllUnits[i]);}
		}
		
		//Send elements off to create rectangles for each unit
		this.CreateUnitBoxes(this.FireUnits, this.FireUnitBox, this.FireUnitRectangles, "Fire");
		this.CreateUnitBoxes(this.AirUnits, this.AirUnitBox, this.AirUnitRectangles, "Air");
		this.CreateUnitBoxes(this.EarthUnits, this.EarthUnitBox, this.EarthUnitRectangles, "Earth");
		this.CreateUnitBoxes(this.LightningUnits, this.LightningUnitBox, this.LightningUnitRectangles, "Lightning");
		this.CreateUnitBoxes(this.WaterUnits, this.WaterUnitBox, this.WaterUnitRectangles, "Water");
	 }
	 
	 
	 
	 // Creates rectangles for each unit, divided by Element Type
	  SelectionScreen.prototype.CreateUnitBoxes = function(UnitList, ElementBox, UnitRectanglesList, ElementType)
	  {
		var UnitSizeX = Canvas.width * 0.0447; //console.log();
		var UnitSizeY = Canvas.height * 0.0649;// console.log();
		var x = 0;
		var y = 0;
		var rowSize = 3;
		var spacer = ElementBox.width * 0.045;
		var Startx = ElementBox.x + spacer ;
		var Starty = ElementBox.y + spacer;
		
		for (var i = 0; i < UnitList.length; i++)
		{
			var NewRectangle = new Rectangle(Startx + (x * (UnitSizeX + spacer)), Starty + (y * (UnitSizeY + spacer)),UnitSizeX, UnitSizeY)
			NewRectangle.customValue[0] = UnitList;
			NewRectangle.customValue[1] = i;
			NewRectangle.customValue[2] = ElementType;
			
			UnitRectanglesList.push(NewRectangle);
			
			this.ClickableRectangles.push(NewRectangle);
			x++;
			if (x == rowSize)
			{
				x = 0;
				y++;
			}
		}
	  }


// creates all of the boxes for the unit selections	  
SelectionScreen.prototype.createUnitSelectionBoxes = function() {
	
	this.ClickedObject = null;
	this.unitSelectionBoxes = [];
	
	if (this.unitsShown == "units") {
		
	} else if (this.unitsShown == "generals") {
		
		var fireCount = 0;
		var airCount = 0;
		var earthCount = 0;
		var lightningCount = 0;
		var waterCount = 0;
		
		var vspacer = this.elementBox.height * 0.05;
		var boxWidth = this.generalBox.width;
		var boxHeight = this.generalBox.height;
	
		var fireUnitX = this.FireUnitBox.x + this.FireUnitBox.width * 0.3;
		var fireUnitY = this.FireUnitBox.y + this.FireUnitBox.height * 0.05;
	
		var airUnitX = this.AirUnitBox.x + this.AirUnitBox.width * 0.3;
		var airUnitY = this.AirUnitBox.y + this.AirUnitBox.height * 0.05;
	
		var earthUnitX = this.EarthUnitBox.x + this.EarthUnitBox.width * 0.3;
		var earthUnitY = this.EarthUnitBox.y + this.EarthUnitBox.height * 0.05;
	
		var lightningUnitX = this.LightningUnitBox.x + this.LightningUnitBox.width * 0.3;
		var lightningUnitY = this.LightningUnitBox.y + this.LightningUnitBox.height * 0.05;
	
		var waterUnitX = this.WaterUnitBox.x + this.WaterUnitBox.width * 0.3;
		var waterUnitY = this.WaterUnitBox.y + this.WaterUnitBox.height * 0.05;
		
		for (var i = 0; i < UnitStats.generals.length; i++) {
		
			var currentUnit = UnitStats.generals[i];
			var unitBox;
			
			switch (currentUnit.element) {
				
				case "Fire":
				
					unitBox = new Rectangle(fireUnitX, fireUnitY + (boxHeight + vspacer) * fireCount, boxWidth, boxHeight, currentUnit.image);
					unitBox.object = currentUnit;
				
					this.unitSelectionBoxes.push(unitBox);
					fireCount++;
				
				break;
				
				case "Air":
				
					unitBox = new Rectangle(airUnitX, airUnitY + (boxHeight + vspacer) * airCount, boxWidth, boxHeight, currentUnit.image);
					unitBox.object = currentUnit;
				
					this.unitSelectionBoxes.push(unitBox);
					airCount++;
				
				break;
				
				case "Earth":
				
					unitBox = new Rectangle(earthUnitX, earthUnitY + (boxHeight + vspacer) * earthCount, boxWidth, boxHeight, currentUnit.image);
					unitBox.object = currentUnit;
				
					this.unitSelectionBoxes.push(unitBox);
					earthCount++;
				
				break;
				
				case "Lightning":
				
					unitBox = new Rectangle(lightningUnitX, lightningUnitY + (boxHeight + vspacer) * lightningCount, 
						boxWidth, boxHeight, currentUnit.image);
					unitBox.object = currentUnit;
				
					this.unitSelectionBoxes.push(unitBox);
					lightningCount++;
				
				break;
				
				case "Water":
				
					unitBox = new Rectangle(waterUnitX, waterUnitY + (boxHeight + vspacer) * waterCount, boxWidth, boxHeight, currentUnit.image);
					unitBox.object = currentUnit;
				
					this.unitSelectionBoxes.push(unitBox);
					waterCount++;
				
				break;
				
			}
			
		}
		
	}
	
}
	 

SelectionScreen.prototype.doubleClick = function() {
	
	this.AddPick();
	
}