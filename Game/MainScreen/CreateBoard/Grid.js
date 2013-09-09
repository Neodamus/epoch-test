
	  function Grid(x, y, Positionx, Positiony, Width, Height)
	  {
		this.x = x;
		this.y = y;
		this.Positionx = Positionx;
		this.Positiony = Positiony;
		this.ThisRectangle = new Rectangle(Positionx, Positiony, Width, Height);
		this.selected = false;
		this.moveMarker = false;
		this.attackMarker = false;
		this.abilityMarker = false;
		this.currentUnit;
		this.allyVision = new Array();
		this.enemyVision = new Array();
		
		this.visible = false;
	  }
	  
	   Grid.prototype.visibleCheck = function()
	   {
		this.visible = false;
		if (this.allyVision != undefined && this.allyVision.length > 0) //if vision = true
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
		this.visibleCheck();
		
		context.drawImage(Images[1],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);
		
		if (this.currentUnit != null && this.visible == true){  // UNIT DRAWING
		context.drawImage(Images[ReturnUnitImage(this.currentUnit.name)], this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width,
		this.ThisRectangle.height); }
		if (this.visible == false)		//Fog of war
		{
			context.drawImage(Images[7],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);
		}
		
		
		if (this.selected == true) { context.drawImage( Images[3],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		context.globalAlpha = 0.7;
		if (this.moveMarker == true) { context.drawImage( Images[5],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		if (this.attackMarker == true && this.abilityMarker == false) { context.drawImage( Images[6],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		if (this.abilityMarker == true) { context.drawImage( Images[9],this.ThisRectangle.x, this.ThisRectangle.y, this.ThisRectangle.width, this.ThisRectangle.height);}
		context.globalAlpha = 1;
		
		
		context.save();
		context.font = '10px outline';
		context.shadowBlur=0;
		
		context.shadowColor="black";
		context.shadowOffsetX=1;
		context.shadowOffsetY=1;
		//context.strokeStyle = 'black';
		if (this.currentUnit != null && this.visible == true){ // UNIT DRAWING
		context.fillStyle = "rgba(250, 250, 150, 1)";
		context.fillText(this.currentUnit.currentStats[4], this.ThisRectangle.x + 7, this.ThisRectangle.y + 23);
		context.fillStyle = "rgba(255, 180, 180, 1)";
		context.fillText(this.currentUnit.currentStats[1], this.ThisRectangle.x + this.ThisRectangle.width - 15, this.ThisRectangle.y + 23);
		context.fillStyle = "rgba(255, 255, 255, 1)";
		context.fillText(this.currentUnit.currentStats[2], this.ThisRectangle.x + 7, this.ThisRectangle.y + 45);
		context.fillStyle = "rgba(170, 170, 255, 1)";
		context.fillText(this.currentUnit.currentStats[3], this.ThisRectangle.x + this.ThisRectangle.width - 15, this.ThisRectangle.y + 45);
		}
		context.restore();
	  }
	  
