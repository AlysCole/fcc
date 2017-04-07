import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';

Math.randomBetween = (a, b) => {
  return Math.floor((Math.random() * (b - a + 1)) + a);
};

// Declare a Dungeon namespace
var Grid = {}; 

Grid.getAdjacentCells = (x, y, grid, direction) => {
  // returns an array of adjacent cells' coordinates from a two-dimensional array representing a grid.
  var adjacents = [];

  if (grid[y - 1] && grid[y - 1][x] != null) { // northern cell
    adjacents.push({
      x: x,
      y: y - 1,
      cell: grid[y - 1][x]
    });
  }

  if (grid[y - 1] && grid[y - 1][x + 1] != null) { // north-east
    adjacents.push({
      x: x + 1,
      y: y - 1,
      cell: grid[y - 1][x + 1]
    });
  }

  if (grid[y] && grid[y][x + 1] != null) { // eastern cell
    adjacents.push({
      x: x + 1,
      y: y,
      cell: grid[y][x + 1]
    });
  }

  if (grid[y + 1] && grid[y + 1][x + 1] != null) { // south-east
    adjacents.push({
      x: x + 1,
      y: y + 1,
      cell: grid[y + 1][x + 1]
    });
  }
  
  if (grid[y + 1] && grid[y + 1][x] != null) { // southern cell
    adjacents.push({
      x: x,
      y: y + 1,
      cell: grid[y + 1][x]
    });
  }

  if (grid[y + 1] && grid[y + 1][x - 1] != null) { // south-west cell
    adjacents.push({
      x: x - 1,
      y: y + 1,
      cell: grid[y + 1][x - 1]
    });
  }

  if (grid[y] && grid[y][x - 1] != null) { // western cell
    adjacents.push({
      x: x - 1,
      y: y,
      cell: grid[y][x - 1]
    });
  }

  if (grid[y - 1] && grid[y - 1][x - 1] != null) { // north-west cell
    adjacents.push({
      x: x - 1,
      y: y - 1,
      cell: grid[y - 1][x - 1]
    });
  }

  if (direction)
    return adjacents[direction];
  
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

Grid.determinePath = (startX, startY, targetX, targetY, grid) => {
  let closed = [],
      open = [];

  let calculateHeuristic = (x1, y1, x2, y2) => {
    return (Math.abs((x2 - x1) + (y2 - y1)));
  };

  let getCoordinatesInList = (x, y, list) => {
    list.forEach((cell) => {
      
    });
  };

  let start = {
    x: startX,
    y: startY,
    g: 0,
    h: calculateHeuristic(startX, startY, targetX, targetY) * 10
  };

  start.f = start.g + start.h;

  closed.push(start);

  /* SAMPLE OBJECT */
  /* { "x": 0,
   *   "y": 0,
   *   "g": 0, // distance from start to current position 
   *   "h": 0, // approximate distance from current position to target
   *   "f": 0, // g + h = the score
   *   "parent": {"x": -1, "y": -1}
   * }
   */

  /* STEPS */
  /* 1. Push the start coordinates into the closed array.
   * 2. Start the loop.
   * 3. Set the current room to the last element in the closed list.
   * 4. Add the rooms adjacent to the current room to the open list, if they're not in the closed list.
   * 5. If already in the open list and if its score is lesser than the previous one, update its score and change its parent to the current room.
   * 6. Push the current room and the room with the lowest score from the open list to the closed list. 
   * 7. If it's a tie, push the most recently added room with the lowest score.
   * NOTE: To get approximate distance, subtract x2 from x1. This is xDist. Subtract y2 from y1, which is yDist. So, (x1 - x2) + (y1 - y2) = Math.abs(h)
   * 8. End the loop once the target square is in the closed list.
   */

  let searching = true;
  while (!searching) {
    let currRoom = closed[closed.length - 1];
  }
  
};



class Dungeon extends React.Component {
  initializeDungeon = () => {
    if (this.state.dungeon.length == 0) {
      for (let y = 0; y < this.state.gridHeight; y++) {
        let arr = [];
        for (let x = 0; x < this.state.gridWidth; x++) {
          arr.push(
            {
              type: "wall",
              NPCs: []
            }
          );
        }

        this.state.dungeon.push(arr);
      }
    }

  }

  // Function takes a set of coordinates for a rectangle and splits it recursively.
  splitDungeon = (x1, x2, y1, y2, direction, callback) => {
    let c1 = (direction == "x") ? (x1 - x1) : (y1 - y1),
        c2 = (direction == "x") ? (x2 - x1) : (y2 - y1),
        splitAtCoord = 0,
        minRoomHeight = this.level[this.state.level - 1].minRoomHeight ||
          this.state.minRoomHeight,
        minRoomWidth = this.level[this.state.level - 1].minRoomWidth ||
          this.state.minRoomWidth,
        minRoomSplitSize = (this.state.minSplitSize) ||
        (((direction == "y") ?
          minRoomHeight :
          minRoomWidth) + 1),
        minNumOfRooms = this.level[this.state.level - 1].minNumOfRooms || this.state.minNumOfRooms,
        maxNumOfRooms = this.level[this.state.level - 1].maxNumOfRooms || this.state.maxNumOfRooms,
        result = 0,
        rooms = []; // for rooms generated from split.
    
    if ((c2 - minRoomSplitSize) >= minRoomSplitSize &&
        this.state.currNumOfRooms < minNumOfRooms) {
      splitAtCoord = Math.randomBetween(minRoomSplitSize,
                                               c2 - minRoomSplitSize);

      // Calculate rectangles that result from split.
      let subdungeons = [
        {x1: 0, x2: 0, y1: 0, y2: 0},
        {x1: 0, x2: 0, y1: 0, y2: 0}
      ];

      // First subdungeon
      // 1. First corner is the top-left corner of the current subdungeon.
      subdungeons[0].x1 = x1;
      subdungeons[0].y1 = y1;

      // 2. Bottom-left corner will be based on split coordinates.
      subdungeons[0].x2 = (direction == "x") ? x1 + splitAtCoord : x2;
      subdungeons[0].y2 = (direction == "y") ? y1 + splitAtCoord : y2;

      // Second subdungeon
      subdungeons[1].x1 = (direction == "x") ? (x1 + splitAtCoord + 1) : x1;
      subdungeons[1].y1 = (direction == "y") ? (y1 + splitAtCoord + 1) : y1;

      subdungeons[1].x2 = x2;
      subdungeons[1].y2 = y2;

      // Recursively call function on each rectangle.
      let splitDir = Grid.randomDirection();
      for (let i = 0; i <= 1; i++) {
        result = this.splitDungeon(subdungeons[i].x1, subdungeons[i].x2,
                                   subdungeons[i].y1, subdungeons[i].y2,
                                   splitDir, this.splitDungeon);
        
        if (isNaN(result) && result)
          rooms.push(result);
      }

      if (rooms.length == 2) {
        this.generateCorridor(rooms[0], rooms[1]);
      }

      if (rooms) {
        return rooms[Math.randomBetween(0, rooms.length - 1)];
      }
      else {
        return 0;
      }

      return 1;
    }
    else {
      // We try splitting it another direction if a callback exists.
      if (callback) {
        result = callback(x1, x2, y1, y2, (direction == "y") ? "x" : "y", null);
        if (!result && this.state.currNumOfRooms < maxNumOfRooms) {
          // generate a room if callback fails to split subdungeon.
          result =  this.generateRoom(x1, x2, y1, y2);
        }
      }
      else if (this.state.currNumOfRooms < maxNumOfRooms) {
        result = this.generateRoom(x1, x2, y1, y2);
      }
    }
    return result;
  }

  generateRoom = (x1, x2, y1, y2) => {
    /*
       Generate a room within the minimum and maximum size of one and
       plot it within the coordinates passed as parameters in the dungeon.

       Returns 0 if fails. Returns 1 if success.
     */
    let rx1 = x1 - x1,
        rx2 = x2 - x1,
        ry1 = y1 - y1,
        ry2 = y2 - y1,
        minRoomWidth = this.level[this.state.level - 1].minRoomWidth || this.state.minRoomWidth,
        maxRoomWidth = this.level[this.state.level - 1].maxRoomWidth || this.state.maxRoomWidth,
        minRoomHeight = this.level[this.state.level - 1].minRoomHeight || this.state.minRoomHeight,
        maxRoomHeight = this.level[this.state.level - 1].maxRoomHeight || this.state.maxRoomHeight;


    let roomX1 = Math.randomBetween(this.state.roomSpacing,
                                           Math.max((rx2 - (maxRoomWidth - 1 +
                                                            this.state.roomSpacing) > 0)
                                                  ? (rx2 - (maxRoomWidth - 1 +
                                                            this.state.roomSpacing))
                                                  : (rx2 - (minRoomWidth - 1 +
                                                            this.state.roomSpacing)),
                                                    this.state.roomSpacing)) + x1;
    let roomX2 = Math.randomBetween((roomX1 - x1) + (minRoomWidth - 1),
                                           Math.min((roomX1 - x1) + (maxRoomWidth - 1),
                                           rx2)) + x1;
    let roomY1 = Math.randomBetween(this.state.roomSpacing,
                                           Math.max((ry2 - (maxRoomHeight - 1 +
                                                            this.state.roomSpacing) > 0)
                                                  ? (ry2 - (maxRoomHeight - 1 +
                                                            this.state.roomSpacing))
                                                  : (ry2 - (minRoomHeight - 1 +
                                                            this.state.roomSpacing)), 0))
               + y1;
    let roomY2 = Math.randomBetween((roomY1 - y1) + (minRoomHeight - 1),
                                           Math.min((roomY1 - y1) + (maxRoomHeight - 1),
                                                    ry2)) + y1;

    this.state.currNumOfRooms += 1;
    return this.positionRoom(roomX1, roomX2, roomY1, roomY2);
  }

  positionRoom = (x1, x2, y1, y2) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
          this.state.dungeon[y][x].type = "room";
      }
    }
    
    return {
     "x1": x1,
      "x2": x2,
      "y1": y1,
      "y2": y2
    };
  }

  generateCorridor = (r1, r2) => {
    const r1Point = Grid.getRandomPointWithin(r1.x1, r1.x2, r1.y1, r1.y2),
          r2Point = Grid.getRandomPointWithin(r2.x1, r2.x2, r2.y1, r2.y2);

    var currPoint = {
      x: r1Point.x,
      y: r1Point.y
    };

    var currDirection = Grid.randomDirection();
    var otherDirection = (currDirection == "x" ? "y" : "x");

    // if target coordinate is equal to starting coordinate and...
    if (r2Point[currDirection] == r1Point[currDirection] &&
        // the other coordinate is not equal to the starting coordinate
        r2Point[otherDirection] != r1Point[otherDirection])
      // set direction to the other axis
      currDirection = otherDirection;
    else if (r2Point[currDirection] == r1Point[currDirection])
      // if the starting coordinates are equal to the target, end function
      return 1;

    while ((currPoint[currDirection] != r2Point[currDirection])) {
      // generate a random direction to follow based on the randomness setting.
      if (Math.random() < this.state.randomCorridors * 0.01)
        currDirection = Grid.randomDirection();

      if (currPoint[currDirection] < r2Point[currDirection]) {
        currPoint[currDirection] += 1;
        this.state.dungeon[currPoint.y][currPoint.x].type = "corridor";
      }
      else if (currPoint[currDirection] > r2Point[currDirection]) {
        currPoint[currDirection] -= 1;
        this.state.dungeon[currPoint.y][currPoint.x].type = "corridor";
      }

      // check whether the next step is equal to our destination.
      if (currPoint[currDirection] == r2Point[currDirection] &&
          currPoint[(currDirection == "x") ? "y" : "x"] !=
          r2Point[(currDirection == "x") ? "y" : "x"])
        // if it is, change the direction to the other.
        currDirection = (currDirection == "x") ? "y" : "x";
    }
    return 1;
  }

  checkNPCExistsAtPoint = (x, y, arr) => {
    return (arr.filter(function(npc) {
      return (npc.x == x && npc.y == y);
    }).length > 0);
  }

  getNPCsAtPoint = (x, y, arr) => {
    return arr.filter(function(npc) {
      return (npc.x == x && npc.y == y);
    });
  }

  populateDungeonWithNPCs = (dungeon) => {
    // places NPC cells within the dungeon, based on level number
    let level = this.level[this.state.level - 1];

    level.typesOfNPCs.forEach((npc) => {
      let numOfNPCs = Math.randomBetween(npc.min, npc.max);
      for (let i = 0; i < numOfNPCs; i++) {
        let coordinates = Grid.getRandomMatchingCellWithin(0, dungeon[0].length - 1,
                                                           0, dungeon.length - 1,
                                                           "room", dungeon);

        let newNPC = new this.NPC(coordinates.x, coordinates.y,
                                  npc.type, this.NPCs[npc.type].health,
                                  this.NPCs[npc.type].attack);
        dungeon[coordinates.y][coordinates.x].NPCs.unshift(newNPC);

        // Run the NPC function every second.
        window.setInterval(() => {
          let dungeon = newNPC.update(this.state.dungeon);
          if (dungeon)
            this.setState({
              dungeon: dungeon
            });
        }, 1000);
      }
    });

    return dungeon;
  }


  generateHiddenRooms = (dungeon, max) => {
    // recursively places hidden rooms on the edges of the dungeon
    let minHiddenRoomWidth = this.level[this.state.level - 1].minHiddenRoomWidth ||
          this.state.minHiddenRoomWidth,
        maxHiddenRoomWidth = this.level[this.state.level - 1].maxHiddenRoomWidth ||
          this.state.maxHiddenRoomWidth,
        minHiddenRoomHeight = this.level[this.state.level - 1].minHiddenRoomHeight ||
          this.state.minHiddenRoomHeight,
        maxHiddenRoomHeight = this.level[this.state.level - 1].maxHiddenRoomHeight ||
          this.state.maxHiddenRoomHeight;

    let width = Math.randomBetween(this.state.minHiddenRoomWidth,
                                          this.state.maxHiddenRoomWidth),
        height = Math.randomBetween(this.state.minHiddenRoomHeight,
                                           this.state.maxHiddenRoomHeight);
    
    let x, y, adjacent;

    while (!adjacent) {
      x = Math.randomBetween(0, dungeon[0].length - 1);
      y = Math.randomBetween(0, dungeon.length - 1);
      if (this.checkRectOfCells(dungeon, x, y, width, height, function(cell) {
        if (cell.type == "wall")
          return true;
        return false;
      }.bind("this"))) {
        adjacent = this.checkAdjacentCells(x, y, dungeon, function(cell) {
          if (cell.type == "room")
            return true;
          return false;
        }.bind(this));
      }
    }

    for (let modY = 0; modY < height; modY++) {
      for (let modX = 0; modX < width; modX++) {
        if (dungeon[y  + modY])
          dungeon[y + modY][x + modX].type = "hiddenRoom";
      }
    }

    if (max > 1) {
      return (this.generateHiddenRooms(dungeon, max - 1));
    }

    return dungeon;
  }

  checkRectOfCells = (dungeon, x, y, width, height, func) => {
    // checks all cells within a set of coordinates 
    for (let modY = 0; modY < height; modY++) {
      for (let modX = 0; modX < width; modX++) {
        if (!dungeon[y + modY] || !dungeon[y + modY][x + modX] // check if cells don't exist
            || !func(dungeon[y + modY][x + modX]))
          return false;
      }
    }
    return true;
  }

  checkAdjacentCells = (x, y, dungeon, func) => {
    // check adjacent cells based on function parameter.

    /* pos should return a positive while neg should return a negative, otherwise the function
     * returns a false.
     */

    let directions = [
      {x: 0, y: -1}, // north
      {x: 1, y: 0}, // east
      {x: 0, y: 1}, // south
      {x: -1, y: 0}, // west
    ];

    for (let i = 0; i < directions.length; i++) {
      let currX = x + directions[i].x,
          currY = y + directions[i].y;

      if (!dungeon[currY] || !dungeon[currY][currX])
        continue;

      if (func(dungeon[currY][currX]))
        return true;
    }

    return false;
  }


  handleKeyDown = (event) => {
    if (event.keyCode < 37 || event.keyCode > 40)
      return false;
    
    let x = this.state.centerX,
        y = this.state.centerY;

    if (this.state.movementDelay) { // check if movement delay is true 
      if (this.state.movementLag < this.state.movementDelay) {
        this.state.movementLag++;
        return false;
      }
      else if (this.state.movementLag >= this.state.movementDelay)
        this.state.movementLag = 0;
    }

    if (event.keyCode == 37) { // left arrow key
      x -= 1;
    }
    else if (event.keyCode == 38) { // up arrow key
      y -= 1;
    }
    else if (event.keyCode == 39) { // right arrow key
      x += 1;
    }
    else if (event.keyCode == 40) { // down arrow key
      y += 1;
    }

    if ((this.state.dungeon[y] && this.state.dungeon[y][x]) &&
        (this.state.dungeon[y][x].type == "room" ||
         this.state.dungeon[y][x].type == "hiddenRoom" ||
         this.state.dungeon[y][x].type == "corridor")) {
      this.setState({
        centerX: x,
        centerY: y
      });

      return true;
    }
    return false;
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  
  constructor(props) {
    super(props);

    this.level = [
      {
        level: 1,
        minNumOfRooms: 1,
        maxNumOfRooms: 1,
        minNumOfHiddenRooms: 2,
        maxNumOfHiddenRooms: 3,
        typesOfNPCs: [
          {
            type: "monster1",
            min: 1,
            max: 2
          }
        ]
      },
      {
        level: 2,
        minNumOfRooms: 5,
        maxNumOfRooms: 7,
        minNumOfHiddenRooms: 5,
        maxNumOfHiddenRooms: 8,
        typesOfNPCs: [
          {
            type: "monster1",
            min: 3,
            max: 5
          }
        ]
      },
      {
        level: 3,
        minNumOfRooms: 7,
        maxNumOfRooms: 10,
        minNumOfHiddenRooms: 5,
        maxNumOfHiddenRooms: 8,
        typesOfNPCs: [
          {
            type: "monster1",
            min: 4,
            max: 6
          },
          {
            type: "monster2",
            min: 1,
            max: 2
          }
        ]
      }
    ];

    this.NPCs = {
      monster1: {
        health: 20,
        attack: 5
      },
      monster2: {
        health: 40,
        attack: 8
      },
      monster3: {
        health: 60,
        attack: 10
      },
      bossMonster: {
        health: 120,
        attack: 20
      }
    };

    this.NPC = function createNPC(x, y, type, health, attack) {
      this.type = type,
      this.x = x,
      this.y = y,
      this.health = health,
      this.attack = attack;

      // Moves NPC randomly and returns dungeon with new NPC position
      this.update = function updateNPCInDungeon(dungeon) {
        let ind = dungeon[y][x].NPCs.indexOf(this),
            adjacents = Grid.getAdjacentCells(this.x, this.y, dungeon),
            cell = Math.randomBetween(0, adjacents.length - 1),
            i = 0;

        while ((adjacents[cell].cell.type != "room" ||
                adjacents[cell].cell.type != "corridor") &&
               i < adjacents.length) {
          cell = Math.randomBetween(0, adjacents.length - 1);
          i++;
        }

        if (adjacents[cell].cell.type == "room" ||
            adjacents[cell].cell.type == "corridor") {
          let currNPC = this;
          dungeon[this.y][this.x].NPCs.splice(ind, 1);

          this.x = adjacents[cell].x,
          this.y = adjacents[cell].y;

          dungeon[this.y][this.x].NPCs.unshift(currNPC);

          return dungeon;
        }
        
        return false;

      };
    };

    this.state = {
      dungeon: [],
      level: 3,
      minRoomHeight: 5,
      minRoomWidth: 6,
      maxRoomHeight: 9,
      maxRoomWidth: 11,
      minNumOfRooms: 5,
      maxNumOfRooms: 7,
      minHiddenRoomHeight: 1,
      minHiddenRoomWidth: 1,
      maxHiddenRoomHeight: 1,
      maxHiddenRoomWidth: 1,
      minNumOfHiddenRooms: 6,
      maxNumOfHiddenRooms: 10,
      currNumOfRooms: 0,
      minSplitSize: null,
      roomSpacing: 1,
      gridWidth: 30,
      gridHeight: 20,
      randomCorridors: 0, // (0-100) Higher input means more chance of generating non-straight corridors
      centerX: 0,
      centerY: 0
    };

    this.initializeDungeon();
    this.splitDungeon(0, this.state.gridWidth - 1,
                      0, this.state.gridHeight - 1,
                      Grid.randomDirection(), this.splitDungeon, 1);

    let numOfHiddenRooms = Math.randomBetween(
      this.level[this.state.level - 1].minNumOfHiddenRooms || this.state.minNumOfHiddenRooms,
      this.level[this.state.level - 1].maxNumOfHiddenRooms || this.state.maxNumOfHiddenRooms
    );
    this.state.dungeon = this.populateDungeonWithNPCs(this.generateHiddenRooms(this.state.dungeon,
                                                                               numOfHiddenRooms));

    let center = Grid.getRandomMatchingCellWithin(0, this.state.dungeon[0].length - 1,
                                                  0, this.state.dungeon.length - 1,
                                                  "room", this.state.dungeon);
    this.state.centerX = center.x,
    this.state.centerY = center.y;
  }

  render() {
    return <Viewport dungeon={this.state.dungeon}
    centerX={this.state.centerX} centerY={this.state.centerY}
    NPCs={this.state.NPCs} />;
  }
}

class Viewport extends React.Component {
  getRectangularViewFromPoint = (centerX, centerY, radius, dungeon) => {
    let viewCoordinates = {
      x1: (centerX - 1) - Math.floor(this.state.viewPortWidth / 2),
      x2: (centerX - 1) + Math.floor(this.state.viewPortWidth / 2),
      y1: (centerY - 1) - Math.floor(this.state.viewPortHeight / 2),
      y2: (centerY - 1) + Math.floor(this.state.viewPortHeight / 2) 
    };


    let view = [];

    for (let y = viewCoordinates.y1; y <= viewCoordinates.y2; y++) {
      let cellsInRow = [];
      for (let x = viewCoordinates.x1; x <= viewCoordinates.x2; x++) {
        if (x == centerX && y == centerY)
          cellsInRow.push("player");
        else if (!(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) < Math.pow(radius, 2))
                 && this.state.darkViewToggle) {
          cellsInRow.push("empty");
        }
        else if (dungeon[y] && dungeon[y][x]) {
          if (dungeon[y][x].NPCs.length > 0) {
            cellsInRow.push(dungeon[y][x].NPCs[0].type);
          }
          else if (dungeon[y][x].type == "hiddenRoom") { // check if the cell is a hidden room
            // calculate the distance between player cell and hidden room
            let distance = Math.sqrt(Math.pow(x - centerX, 2) +
                                     Math.pow(y - centerY, 2));
            if (distance < 2) // decide whether the hidden room is visible
              cellsInRow.push("hiddenRoom");
            else
              cellsInRow.push("wall");
          }
          else if (dungeon[y][x].type == "corridor")
            cellsInRow.push("room");
          else {
            cellsInRow.push(dungeon[y][x].type);
          }
        }
        else
          cellsInRow.push("wall");
      }
      view.push(cellsInRow);
    }
    return view;
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.dungeon != nextProps.dungeon ||
        this.props.centerX != nextProps.centerX ||
        this.props.centerY != nextProps.centerY) {
      this.setState({
        dungeon: nextProps.dungeon,
        playerCell: {
          x: nextProps.centerX,
          y: nextProps.centerY
        },
        dungeonView: this.getRectangularViewFromPoint(nextProps.centerX,
                                                      nextProps.centerY,
                                                      this.state.darkViewRadius,
                                                      nextProps.dungeon)
      });
    }
  }

  componentWillUpdate = (nextProps, nextState) => {
    nextState.dungeonView = this.getRectangularViewFromPoint(nextState.playerCell.x,
                                                             nextState.playerCell.y,
                                                             nextState.darkViewRadius,
                                                             nextState.dungeon);
  }

  constructor(props) {
    super(props);
    this.state = {
      dungeon: this.props.dungeon,
      NPCs: this.props.NPCs,
      dungeonView: [],
      roomCellFill: '#aaa',
      wallCellFill: '#eee',
      emptyCellFill: '#000',
      playerCellFill: 'red',
      hiddenRoomCellFill: '#6D6D6D',
      NPCCellFill: {
        monster1: '',
        monster2: '',
        monster3: '',
        bossMonster: ''
      },
      cellWidth: 20,
      cellHeight: 20,
      playerCell: {
        x: this.props.centerX,
        y: this.props.centerY
      },
      movementLag: 0,
      movementDelay: 0,
      viewPortHeight: 0,
      viewPortWidth: 0,
      darkViewToggle: true,
      darkViewRadius: 10,
      health: 100,
      level: this.props.level
    };

    this.symbols = {
      room: ".",
      hiddenRoom: ".",
      wall: "#",
      empty: " ",
      player: "@",
      monster1: "!",
      monster2: "!",
      monster3: "!",
      bossMonster: "!"
    };

    this.classNames = {
      room: "roomCell",
      hiddenRoom: "hiddenRoomCell",
      wall: "wallCell",
      empty: "emptyCell",
      player: "playerCell",
      monster1: "monster1Cell",
      monster2: "monster2Cell",
      monster3: "monster3Cell",
      bossMonster: "bossMonsterCell"   
    };


    // Set the viewport size to fit the screen size, and substract a quarter to add spacing.
    this.state.viewPortHeight = (window.innerHeight / this.state.cellHeight);
    this.state.viewPortHeight = this.state.viewPortHeight - (this.state.viewPortHeight / 4);

    this.state.viewPortWidth = (window.innerWidth / this.state.cellWidth);
    this.state.viewPortWidth = this.state.viewPortWidth - (this.state.viewPortWidth / 4);


    // Make sure radius is within the viewport size.
    if ((this.state.darkViewRadius > this.state.viewPortWidth / 2) ||
        this.state.darkViewRadius > this.state.viewPortHeight / 2) {
      this.state.darkViewRadius = Math.floor(Math.min(this.state.viewPortWidth / 2,
                                                      this.state.viewPortHeight / 2));
    }

    // Generate a dungeon with HTML5 Canvas
    this.state.dungeonView = this.getRectangularViewFromPoint(this.state.playerCell.x,
                                                              this.state.playerCell.y,
                                                              this.state.darkViewRadius,
                                                              this.state.dungeon);

  }

  render() {
    return (
        <div>
        {this.state.dungeonView.map((row, ind) => {
          let viewportCells = row.map((cell, ind) => {
            // Get index key based on value of cell
            return (<ViewportCell key={ind}
                    type={cell}
                    class={this.classNames[cell]}
                    symbol={this.symbols[cell]} />);
          });

          return (<div key={ind}>{viewportCells}</div>);
        })}
      </div>
    );
  }
}

class ViewportCell extends React.Component {
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      type: nextProps.type,
      class: nextProps.class,
      symbol: nextProps.symbol
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      class: this.props.class,
      symbol: this.props.symbol
    };
  }

  render() {
    return (
        <span className={this.state.class}>{this.state.symbol}</span>
    );
  }
}

ReactDOM.render(<Dungeon />,
                document.getElementById("game"));
