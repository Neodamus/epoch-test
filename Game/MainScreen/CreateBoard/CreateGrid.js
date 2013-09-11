
	  
	  var GridSpot;
	  var StartX;
	  var StartY;
	  var EndX;
	  var EndY;
	  function CreateGrid()
	  {
		this.Rows = 15;
		this.Columns = 15;
		this.Spacing = -3;
		this.GridSizeX = Canvas.width * 0.048;
		this.GridSizeY = Canvas.height * 0.07;
		console.warn(Canvas.width); console.warn(Canvas.height);
		StartX = Canvas.width * 0.046;//Canvas.width * 0.135;
		StartY = Canvas.height * 0.006;//Canvas.height * 0.1;
		EndX = (this.Columns + 1) * (this.GridSizeX);
		EndY = (this.Rows - 3) * (this.GridSizeY);
		
		this.x = 0;
		this.y = 0;
		
		GridSpot = new Array(this.Columns);
		for (var i = 0; i < this.Columns; i++)
		{
			GridSpot[i] = new Array(Rows); 
		}
		
		for (var i = 0; i < GridSpot.length * GridSpot[0].length;i++)
		{
			this.ycope = -(this.GridSizeY * 0.22);
			this.xcope = 0;
			if (this.y % 2 != 0) { this.xcope = this.GridSizeX / 2; }
			GridSpot[this.x][this.y] = new Grid(x, y, this.xcope +this.StartX + this.x*(this.Spacing+1) + this.x*(this.GridSizeX+1),
													  this.StartY + this.y*(this.Spacing+this.ycope) + this.y*(this.GridSizeY+1),
													  this.GridSizeX, this.GridSizeY);
			this.x++;
			if (this.x==this.Columns)
			{
				this.x = 0;
				this.y++;
			}
			
		}
	  }
	  