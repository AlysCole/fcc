// Declare a Grid namespace
var Grid = {}; 

Grid.getAdjacentCells = (x, y, grid, noDiagonal) => {
  // returns an array of adjacent cells.
  var adjacents = [];

  if (grid[y - 1] && grid[y - 1][x] != null) { // northern cell
    adjacents.push({
      x: x,
      y: y - 1,
      cell: grid[y - 1][x],
      direction: "n"
    });
  }

  if (grid[y] && grid[y][x + 1] != null) { // eastern cell
    adjacents.push({
      x: x + 1,
      y: y,
      cell: grid[y][x + 1],
      direction: "e"
    });
  }
  
  if (grid[y + 1] && grid[y + 1][x] != null) { // southern cell
    adjacents.push({
      x: x,
      y: y + 1,
      cell: grid[y + 1][x],
      direction: "s"
    });
  }

  if (grid[y] && grid[y][x - 1] != null) { // western cell
    adjacents.push({
      x: x - 1,
      y: y,
      cell: grid[y][x - 1],
      direction: "w"
    });
  }

  // if noDiagonal is false, grab diagonal cells
  if (!noDiagonal) {
    if (grid[y - 1] && grid[y - 1][x - 1] != null) { // north-west cell
      adjacents.push({
        x: x - 1,
        y: y - 1,
        cell: grid[y - 1][x - 1],
        direction: "nw"
      });
    }

    if (grid[y - 1] && grid[y - 1][x + 1] != null) { // north-east
      adjacents.push({
        x: x + 1,
        y: y - 1,
        cell: grid[y - 1][x + 1],
        direction: "ne"
      });
    }

    if (grid[y + 1] && grid[y + 1][x + 1] != null) { // south-east
      adjacents.push({
        x: x + 1,
        y: y + 1,
        cell: grid[y + 1][x + 1],
        direction: "se"
      });
    }
    
    if (grid[y + 1] && grid[y + 1][x - 1] != null) {
      adjacents.push({
        x: x - 1,
        y: y + 1,
        cell: grid[y + 1][x - 1],
        direction: "sw"
      });
    }
  }

  return adjacents;
};

Grid.getRandomPointWithin = (x1, x2, y1, y2) => {
  return {
    x: Math.randomBetween(x1, x2),
    y: Math.randomBetween(y1, y2)
  };
};

Grid.getRandomMatchingCellWithin = (x1, x2, y1, y2, type, grid) => {
  let cell = {
    x: Math.randomBetween(x1, x2),
    y: Math.randomBetween(y1, y2)
  };

  while (grid[cell.y][cell.x].type != type) {
    cell = {
      x: Math.randomBetween(x1, x2),
      y: Math.randomBetween(y1, y2)
    };
  }

  return cell;
};

Grid.randomDirection = () => {
  return (Math.randomBetween(0,1) ? "x" : "y");
};

Grid.calculateApproxDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

Grid.determinePath = (startX, startY, targetX, targetY, grid) => {
  let closed = [],
      open = [];

  if (startX == targetX && startY == targetY)
    return [];

  let getCellFromList = (x, y, list) => {
    for (let cell of list) {
      if (cell.x == x && cell.y == y) {
        return cell;
      }
    }
    return false;
  };

  let addCellToList = (cell, list) => {
    for (let i in list) {
      // check whether cell already exists in the list
      if (list[i].x == cell.x && list[i].y == cell.y) {
        // if so, check whether the cell in list has a higher score.
        if (list[i].f > cell.f) {
          // update cell to the lower score if so.
          list[i].g = cell.g;
          list[i].h = cell.h;
          list[i].f = cell.f;
          list[i].parent = cell.parent;
          return list;
        }
        // and if it the newer cell has a higher score, return the list as it is.
        return list;
      }
    }

    // The cell doesn't exist in the list. Push it in.
    list.push(cell);
    return list;
  };

  let start = {
    x: startX,
    y: startY,
    g: 0,
    h: Grid.calculateApproxDistance(startX, startY, targetX, targetY) * 10
  };

  start.f = start.g + start.h;

  open.push(start);

  let searching = true;
  while (searching) {
    console.log("Length of open:", open.length);
    if (open.length < 1) {
      searching = false;
      return false;
    }

    // Set the current cell to one with the lowest score in the open list.
    let curr = open.reduce(function lowestScoreInOpenList(prev, next) {
      if (!prev)
        return next;
      if (next.f < prev.f)
        return next;
      if (next.f == prev.f)
        return next;
      return prev;
    }, null);

    console.log("Current:", curr);

    // Transfer it to the closed list
    open.splice(open.indexOf(curr), 1);
    closed = addCellToList(curr, closed);

    // Check whether we've reached the target square
    if (curr.x == targetX && curr.y == targetY) {
      // Go backwards through the parents of the target cell and return path.
      let parent = true,
          path = [],
          parentCell = curr;

      while (parent) {
        // Go by parents and add them to the path array.
        path.unshift(parentCell);

        // If a parent value doesn't exist, end the loop.
        if (!parentCell.parent)
          parent = false;
        // Otherwise, set the parentCell to the current cell's parent.
        else 
          parentCell = parentCell.parent;
      }

      // End the search for a path loop and return path.
      searching = false;
      return path;
    }

    // Check adjacent cells
    let adjacentCells = Grid.getAdjacentCells(curr.x, curr.y, grid);

    // Filter through adjacent cells
    adjacentCells = adjacentCells.filter(function adjacentCellFilter(a) {
      // Check whether cell is in the closed list
      if (getCellFromList(a.x, a.y, closed)) {
        // If so, skip it.
        return false;
      }
      else if (a.cell.type != "corridor" &&
               a.cell.type != "room") {
        // If cell is not a room cell, skip it.
        return false;
      }
      
      return true;
    });

    // Transform each returned adjacent object into a path object
    adjacentCells = adjacentCells.map((cell) => {
      let pathObj = {
        x: cell.x,
        y: cell.y,
        g: curr.g,
        h: 0,
        f: 0,
        parent: curr
      };

      pathObj.g += (cell.direction == "n" || cell.direction == "e" ||
                    cell.direction == "s" || cell.direction == "w") ? 10 : 15;
      pathObj.h = Grid.calculateApproxDistance(cell.x, cell.y, targetX, targetY) * 10;
      pathObj.f = pathObj.g + pathObj.h;

      return pathObj;
    });

    // Loop through adjacent cells and add each to open list.
    adjacentCells.forEach(function(cell) {
      open = addCellToList(cell, open);
    });
  }
};

module.exports = Grid;
