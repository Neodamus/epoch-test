	   function SelectionScreen()
	  {
		this.CreateRectanglesAndOrganizeUnits();
		this.ClickedObject = this.MainUnitBox;
		this.Element; this.Value = -1;
		this.pickRectangles;
		this.currentPick = 0;
		this.enemyPick = 0;
		Screen = "UnitSelection";
	  }
	  
	  
	   SelectionScreen.prototype.ReceiveRemove = function(RemoveNumber)
	  {
		var Removing = this.pickRectangles[RemoveNumber + numberOfUnits];
		Removing.customValue[0] = null;
		Removing.customValue[1] = null;
		Removing.customValue[2] = null;
	  }
	  
	  
	  SelectionScreen.prototype.ReceivePick = function(ElementType, ElementValue)
	  {
		var ElementalUnitGroup;
		if (ElementType == "Fire") { ElementalUnitGroup = this.FireUnits;}
		if (ElementType == "Air") { ElementalUnitGroup = this.AirUnits;}
		if (ElementType == "Earth") { ElementalUnitGroup = this.EarthUnits;}
		if (ElementType == "Lightning") { ElementalUnitGroup = this.LightningUnits;}
		if (ElementType == "Water") { ElementalUnitGroup = this.WaterUnits;}
		for (var i = 0; i < numberOfUnits; i++)
			{
				if (this.pickRectangles[i + numberOfUnits].customValue[0] == null)
				{ this.enemyPick = i; break;}
			}
		
		this.pickRectangles[numberOfUnits + this.enemyPick].customValue[0] = ElementalUnitGroup;
		this.pickRectangles[numberOfUnits + this.enemyPick].customValue[1] = ElementValue;
		this.pickRectangles[numberOfUnits + this.enemyPick].customValue[2] = ElementType;
	  }
	  
	  
	  SelectionScreen.prototype.RemovePick = function()
	  {
		var number = this.pickRectangles.indexOf(this.ClickedObject);
		if (number < numberOfUnits && number != -1)          //Add stipulation of unit is inside current pickphase
		{
			sendPacket2("removeUnit", number)

			var Removing = this.pickRectangles[number];
			
			Removing.customValue[0] = null;
			Removing.customValue[1] = null;
			Removing.customValue[2] = null;
			
			this.ClickedObject.clicked = false;
		}
	  }
	  
	  
	  SelectionScreen.prototype.AddPick = function()
	  {
		for (var i = 0; i < numberOfUnits; i++) //figures out where the selected unit goes...
			{
				if (this.pickRectangles[i].customValue[0] == null)
				{ this.currentPick = i; break;}
			}
			if (this.currentPick < numberOfUnits) { 
			var SendElement = this.ClickedObject.customValue[2];
			var SendValue = this.ClickedObject.customValue[1];
			this.pickRectangles[this.currentPick].customValue[0] = this.ClickedObject.customValue[0];
			this.pickRectangles[this.currentPick].customValue[1] = this.ClickedObject.customValue[1];
			this.pickRectangles[this.currentPick].customValue[2] = this.ClickedObject.customValue[2];
			sendPacket3("selectUnit", SendElement, SendValue)
			}
	  }
	  
	  //Clicking*********
	  SelectionScreen.prototype.ClickisWithin = function(Mouse)
	  {
	  //if unit clicks on "remove unit", set the customvalues[0 and 1] to null... 
		if (this.ClickedObject != null && this.RemoveSelectedBox.Contains(Mouse) == true && this.ClickedObject.clicked == true) { this.RemovePick(); }
		if (this.ClickedObject != null && this.SelectUnitBox.Contains(Mouse) == true && this.ClickedObject.clicked == true) { this.AddPick(); return; }
		
	    if (this.NextStageBox.Contains(Mouse) == true) { GameBoard = new Board(this.pickRectangles);  }//(this.pickRectangles);
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
	  
	  
	  SelectionScreen.prototype.UnitClicked = function(Mouse)
	  {
		if (this.ClickedObject != null) {this.ClickedObject.clicked = false;}
		for (var i = 0; i < this.ClickableRectangles.length; i++)
		{
			if (this.ClickableRectangles[i].Contains(Mouse) == true)
			{
				//if (this.ClickedObject != null && this.ClickedObject.clicked == true && this.ClickedObject == this.ClickableRectangles[i])
				if (this.ClickedObject == this.ClickableRectangles[i]) { this.AddPick();}
				this.ClickedObject = this.ClickableRectangles[i]; 
				this.ClickedObject.clicked = true;
				
				break;
			}
		}
		if (this.ClickedObject.customValue[1] != null)
		{
		 this.DisplayStats(this.ClickedObject.customValue[0], this.ClickedObject.customValue[1]);
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
		context.fillStyle = "rgba(10, 10, 10, 1)";
		context.fillRect(this.SelectUnitBox.x, this.SelectUnitBox.y, this.SelectUnitBox.width, this.SelectUnitBox.height);
		context.fillRect(this.NextStageBox.x, this.NextStageBox.y, this.NextStageBox.width, this.NextStageBox.height);
		context.fillRect(this.RemoveSelectedBox.x, this.RemoveSelectedBox.y, this.RemoveSelectedBox.width, this.RemoveSelectedBox.height);
		context.fillStyle = "rgba(100, 255, 100, 1)";;
		context.fillText("Use selected unit", this.SelectUnitBox.x + this.SelectUnitBox.width * 0.05, this.SelectUnitBox.y + this.SelectUnitBox.height / 2 + this.SelectUnitBox.height * 0.1);
		context.fillStyle = "rgba(255, 100, 100, 1)";;
		context.fillText("Proceed", this.NextStageBox.x + this.NextStageBox.width * 0.272, this.NextStageBox.y + this.NextStageBox.height / 2 + this.NextStageBox.height * 0.1);
		context.fillStyle = "rgba(255, 100, 100, 1)";
		context.fillText("Remove unit", this.RemoveSelectedBox.x + this.RemoveSelectedBox.width * 0.19, this.RemoveSelectedBox.y + this.RemoveSelectedBox.height / 2 + this.RemoveSelectedBox.height * 0.1);
		//Buttons 

		
		//Draw Units
		for (var i = 0; i < this.ClickableRectangles.length; i++)
		{
			context.drawImage(Images[ReturnUnitImage(this.ClickableRectangles[i].customValue[0][this.ClickableRectangles[i].customValue[1]][0])], this.ClickableRectangles[i].x, this.ClickableRectangles[i].y, this.ClickableRectangles[i].width, this.ClickableRectangles[i].height);
		}
		//End Draw units
		
		//Draw Selected Unit
		if (this.ClickedObject != null && this.ClickedObject.clicked == true) 
		{ 
			context.drawImage(Images[3], this.ClickedObject.x, this.ClickedObject.y, this.ClickedObject.width, this.ClickedObject.height);
			context.fillStyle = "Black";
			for (var i = 0; i < this.Stats.length; i++)
			{
				context.fillText(this.Stats[i], this.StatsInfoBox.x, this.StatsInfoBox.y + (i * 13) + 30);
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
				context.drawImage(Images[ReturnUnitImage(this.pickRectangles[i].customValue[0][this.pickRectangles[i].customValue[1]][0])], this.pickRectangles[i].x, this.pickRectangles[i].y, this.pickRectangles[i].width, this.pickRectangles[i].height);
				}
				if (this.pickRectangles[i].clicked == true) {context.drawImage(Images[3], this.ClickedObject.x, this.ClickedObject.y, this.ClickedObject.width, this.ClickedObject.height); }
			}
			context.fillStyle = "rgba(100, 255, 100, 1)";
			context.fillText("Your Picks", this.PickLine.x + this.PickLine.width * 0.920 / 2, this.PickLine.y * 0.91);
			context.fillStyle = "rgba(255, 100, 100, 1)";
			context.fillText("Enemy Picks", this.PickLine.x + this.PickLine.width * 0.91 / 2, this.PickLine.y + this.PickLine.height * 3 * 3.2);
			context.font = globalFont;
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

		this.SelectUnitBox = new Rectangle(this.StatsInfoBox.x + this.StatsInfoBox.width / 2 - (this.StatsInfoBox.width * 0.15 / 2), this.StatsInfoBox.y + this.StatsInfoBox.height * 0.04, this.StatsInfoBox.width * 0.15, this.StatsInfoBox.y * 0.08)
		this.SelectUnitBox.boxColor =  "rgba(40, 200, 40, 1)";
		//add text box to selectunitbox
		
		
		this.NextStageBox = new Rectangle(this.StatsInfoBox.x + this.StatsInfoBox.width - (this.StatsInfoBox.width * 0.15 * 1.05), this.StatsInfoBox.y 
		+ this.StatsInfoBox.height * 0.04, this.StatsInfoBox.width * 0.15, this.StatsInfoBox.y * 0.08)
		
		this.RemoveSelectedBox = new Rectangle(this.StatsInfoBox.x + this.StatsInfoBox.width - (this.StatsInfoBox.width * 0.30 * 1.05), this.StatsInfoBox.y 
		+ this.StatsInfoBox.height * 0.04, this.StatsInfoBox.width * 0.15, this.StatsInfoBox.y * 0.08)
		
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
	 

	 