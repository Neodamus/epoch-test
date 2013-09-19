function ray(start, end) { this.pointList = this.createLine(start, end); }

ray.prototype.intersects = function(Rectangle) {
	var bool = false;
	for (var i = 0; i < this.pointList.length; i++)
	{
		if (Rectangle.Contains(this.pointList[i]) == true) { bool = true; break;  }
		
	}
	return bool;
}

ray.prototype.createLine = function(start, end) {
    var coordinatesArray = new Array();
    
    var x1 = start.x;
    var y1 = start.y;
    var x2 = end.x;
    var y2 = end.y;
	
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
	
    // Set first coordinates
	var pos = {x: x1, y: y1};
    coordinatesArray.push(pos);
	
    // Find points between
    while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // Set coordinates
	  var pos = {x: x1, y: y1};
      coordinatesArray.push(pos);
    }
    // Return the result
    return coordinatesArray;
  }
	