
	  function Grid(x, y, Positionx, Positiony, Width, Height)
	  {
		this.centrePixelX = Positionx + Width / 2;
		this.centrePixelY = Positiony + Height / 2;
		this.centreRect = new Rectangle(this.centrePixelX, this.centrePixelY, 2, 2); this.centreRect.boxColor = "red";
		this.x = x; //Gridpos[X]
		this.y = y; //Gridpos[Y]
		this.Positionx = Positionx; //pixel location X
		this.Positiony = Positiony; //pixel location Y
		this.ThisRectangle = new Rectangle(Positionx, Positiony, Width, Height);
		
		this.visionBlock = new Array();
		
		this.visionBlockRectangleY = new Rectangle(Positionx + (Width / 2) - 2, Positiony - 2, 1 + 4, Height + 4); this.visionBlockRectangleY.boxColor = "red";
		this.visionBlockRectangleX = new Rectangle(Positionx - 2, Positiony + (Height * 0.22) - 2, Width + 4, Height * 0.54 + 4); this.visionBlockRectangleX.boxColor = "purple";
		//this.ThisRectangle.setText(this.x + "," + this.y, "White", this.ThisRectangle.x + 5, this.ThisRectangle.y + 15) // used to show gridtext
		
		this.selected = false;
		
		this.moveMarker = false;    //markers
		this.attackMarker = false;
		this.abilityMarker = false;
		this.abilitySelectMarker = false;
		
		this.spawnMarker = false;
		
		this.revealList = new Array(); //objected pushed to this must have a .alliance variable. (ie: unit class)
		this.tileBuffList = new Array(); //Contains tile modifiers (auras included)
		
		this.visible = false;
		this.allyVision = new Array();
		this.enemyVision = new Array();
		
		this.currentUnit;				// current unit on tile
	  }
	  
	  Grid.prototype.reveal = function(Toggle, Unit)
	  {
		switch(Toggle) {
			case "on":
				if (listContains(this.revealList, Unit) == false) { this.revealList.push(Unit);}
				if (this.currentUnit != null) { this.currentUnit.gridRevealer("on", Unit); }
				break;
			case "off":
				var rem = listReturnArray(this.revealList, Unit);
				if (rem != -1) { this.revealList.splice(rem, 1); }
				if (this.currentUnit != null) { this.currentUnit.gridRevealer("off", Unit); }
				break;
	  
		}
	  }
	  
	  Grid.prototype.refreshUnitSight = function()
	  {
		var unit = new Array();
		for (var i = 0; i < this.allyVision.length; i++) {
			unit.push(this.allyVision[i]);
		}
		for (var i = 0; i < unit.length; i++) {
			unit[i].sight("off");
			unit[i].sight("on");
		}
	  }
	  
	  //tilemod
	  Grid.prototype.tileModifiers = function(modifier, procedure)
	  {
		
		
		if (this.currentUnit != null) { 
			
			if (modifier == "all") { for (var i = 0; i < this.tileBuffList.length; i++) {
			var wasItRemoved = this.tileBuffList[i];
			//console.warn ("Grid initializing")
			this.tileBuffList[i].eventProc(procedure, this.currentUnit); 
			if (this.tileBuffList[i] != wasItRemoved) { i--; }
			} }
		
			if (modifier != "all") {
			var add = listReturnArray(this.tileBuffList, modifier);
			if (add != -1) { this.tileBuffList[add].eventProc(procedure, this.currentUnit); } } 
			
			}
	  }
	  
	   Grid.prototype.visibleCheck = function()
	   {
		this.visible = false;
		if (this.allyVision != undefined && this.allyVision.length > 0)  //if vision = true
		{
			this.visible = true;
		}
	   }
	  
	  Grid.prototype.Clicked = function(Mouse)
	  {
		if (this.ThisRectangle.Contains(Mouse) == true) { return true;}
		return false;
	  }
	  
	   Grid.prototype.Select = function(Toggle)
	   {
		if (this.currentUnit != null && this.currentUnit.alliance == "ally"){
			this.currentUnit.Select(Toggle);}
		if (Toggle == "on") { this.selected = true;}
		if (Toggle == "off") { this.selected = false;}
	   }

	   Grid.prototype.UpdatePosition = function(newx, newy, newwidth, newheight)
	  {
		this.ThisRectangle.x = this.Positionx + newx;
		this.ThisRectangle.y = this.Positiony + newy;
	  }
	  Grid.prototype.ReturnCurrentUnit = function()
	  { return this.currentUnit;
	  }
	  
	  Grid.prototype.Draw = function(context, canvas)
	  {
		this.visibleCheck(); // THIS MIGHT be a more taxing way of checking if tile has sight
		
		context.drawImage(Images[1],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);
		
		//Drawing unit
		if (this.currentUnit != null && this.visible == true && this.currentUnit.unitStealth == false ||
		this.currentUnit != null && this.visible == true && this.currentUnit.unitStealth == true && this.currentUnit.alliance == "ally"){
			// UNIT DRAWING
			if (this.currentUnit.unitStealth == true) { context.globalAlpha = 0.3; }
				context.drawImage(Images[ReturnUnitImage(this.currentUnit.name)], this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width,
				this.ThisRectangle.height); 
				if (this.currentUnit.unitStealth == true) {context.globalAlpha = 1; } 
				
				if (this.currentUnit.summon == true && this.currentUnit.alliance == "ally") {
				context.globalAlpha = 0.40;
				context.drawImage(Images[112], this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width,
				this.ThisRectangle.height); context.globalAlpha = 1;}
				}
				
		if (this.visible == false)		//Fog of war
		{
			context.drawImage(Images[7],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);
		}
		
		
		//SelectionMarkers
		context.globalAlpha = 0.7;
		if (this.spawnMarker == true) { context.drawImage( Images[14],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		
		if (this.abilityMarker == true) { context.drawImage( Images[9],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		
		if (this.selected == true) { context.drawImage( Images[3],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		context.globalAlpha = 0.25;
		if (this.moveMarker == true) { context.drawImage( Images[5],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		
		if (this.attackMarker == true) { context.drawImage( Images[6],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		context.globalAlpha = 1;
		if (this.abilitySelectMarker == true) { context.drawImage( Images[13],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		

		//revealed by unit spots
		var drawReveal = false;
		for (var i = 0; i < this.revealList.length; i ++){
		if (this.revealList[i].alliance == "ally") { drawReveal = true; break;} }
		if (drawReveal == true) {  context.globalAlpha = 0.4;
		context.drawImage( Images[11],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);
		context.globalAlpha = 1;}
		
		//Unit Stats
		context.save();
		context.font = '10px outline';
		var stats; //RETREIVE STATS
		if (this.currentUnit != null) {
		if (this.currentUnit.displayStats == true && this.currentUnit.alliance == "enemy") { stats = this.currentUnit.fakeStats; } else { stats = this.currentUnit.currentStats; } }
		
		if (this.currentUnit != null && this.currentUnit.alliance == "ally" && this.visible == true ||
		this.currentUnit != null && this.currentUnit.unitStealth == false && this.visible == true) {
		
		context.lineWidth=4.2;
		context.strokeText(stats[4], this.ThisRectangle.x + this.ThisRectangle.width * 0.135, this.ThisRectangle.y + this.ThisRectangle.height * 0.4);
		context.strokeText(stats[1], this.ThisRectangle.x + this.ThisRectangle.width - this.ThisRectangle.width * 0.30, this.ThisRectangle.y + this.ThisRectangle.height * 0.4);
		context.strokeText(stats[2], this.ThisRectangle.x + this.ThisRectangle.width * 0.135, this.ThisRectangle.y + this.ThisRectangle.height * 0.75);
		context.strokeText(stats[3], this.ThisRectangle.x + this.ThisRectangle.width - this.ThisRectangle.width * 0.30, this.ThisRectangle.y + this.ThisRectangle.height * 0.75);
		
		//var test = 
		context.fillStyle = "rgba(250, 250, 60, 1)";
		context.fillText(stats[4], this.ThisRectangle.x + this.ThisRectangle.width * 0.135, this.ThisRectangle.y + this.ThisRectangle.height * 0.4);
		context.fillStyle = "rgba(255, 120, 120, 1)";
		context.fillText(stats[1], this.ThisRectangle.x + this.ThisRectangle.width - this.ThisRectangle.width * 0.30, this.ThisRectangle.y + this.ThisRectangle.height * 0.4);
		context.fillStyle = "rgba(220, 220, 220, 1)";
		context.fillText(stats[2], this.ThisRectangle.x + this.ThisRectangle.width * 0.135, this.ThisRectangle.y + this.ThisRectangle.height * 0.75);
		context.fillStyle = "rgba(140, 140, 250, 1)";
		context.fillText(stats[3], this.ThisRectangle.x + this.ThisRectangle.width - this.ThisRectangle.width * 0.30, this.ThisRectangle.y + this.ThisRectangle.height * 0.75);
		
		}
		// this.ThisRectangle.draw();   // used to see grid numbers with line 10
		
		context.restore();
		//this.centreRect.draw();
		//if (this.visionBlock.length > 0) { context.globalAlpha = 0.2; this.visionBlockRectangleX.draw(); this.visionBlockRectangleY.draw(); context.globalAlpha = 1;}
	  }
	  
