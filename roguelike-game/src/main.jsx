var React = require('react');
var ReactDOM = require('react-dom');
var Grid = require('./Grid.js');
import './styles.scss';

Math.randomBetween = (a, b) => {
  return Math.floor((Math.random() * (b - a + 1)) + a);
};

class Game extends React.Component {
  initiateCombat = (NPC, target) => {
    
  }
  
  initializeDungeon = () => {
    if (this.state.dungeon.length == 0) {
      for (let y = 0; y < this.state.gridHeight; y++) {
        let arr = [];
        for (let x = 0; x < this.state.gridWidth; x++) {
          arr.push(
            {
              type: "empty",
              NPCs: []
            }
          );
        }
        
        this.state.dungeon.push(arr);
      }
    }
    
    // Generate dungeon using BSP trees.
    this.splitDungeon(1, this.state.gridWidth - 2,
                      1, this.state.gridHeight - 2,
                      Grid.randomDirection, this.splitDungeon);
    
    let numOfHiddenRooms = Math.randomBetween(
      this.levels[this.state.level - 1].minNumOfHiddenRooms || this.state.minNumOfHiddenRooms,
      this.levels[this.state.level - 1].maxNumOfHiddenRooms || this.state.maxNumOfHiddenRooms
    );
    
    this.wallRooms();
    
    this.generateHiddenRooms(numOfHiddenRooms);
    
    // Generate NPCs 
    this.populateWithNPCs();
  }
  
  // Function takes a set of coordinates for a rectangle and splits it recursively.
  splitDungeon = (x1, x2, y1, y2, direction, callback) => {
    // Calculate the size of rectangle.
    let c1 = (direction == "x") ? (x1 - x1) : (y1 - y1),
        c2 = (direction == "x") ? (x2 - x1) : (y2 - y1),
        splitAtCoord = 0,
        minRoomHeight = this.levels[this.state.level - 1].minRoomHeight ||
        this.state.minRoomHeight,
        minRoomWidth = this.levels[this.state.level - 1].minRoomWidth ||
        this.state.minRoomWidth,
        minRoomSplitSize = (this.state.minSplitSize) ||
        (((direction == "y") ?
          minRoomHeight :
          minRoomWidth) + this.state.roomSpacing),
        minNumOfRooms = this.levels[this.state.level - 1].minNumOfRooms || this.state.minNumOfRooms,
        maxNumOfRooms = this.levels[this.state.level - 1].maxNumOfRooms || this.state.maxNumOfRooms,
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
        result = callback(x1, x2, y1, y2, (direction == "y") ? "x" : "y");
        if (!result && this.state.currNumOfRooms < maxNumOfRooms) {
          // generate a room if callback fails to split subdungeon.
          result = this.generateRoom(x1, x2, y1, y2);
        }
      }
      // Resort to generating a room if no callback exists, and there is room for more... rooms.
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
    let rx1 = x1 - x1 + this.state.roomSpacing,
        rx2 = x2 - x1 - this.state.roomSpacing,
        ry1 = y1 - y1 + this.state.roomSpacing,
        ry2 = y2 - y1 - this.state.roomSpacing,
        minRoomWidth = this.levels[this.state.level - 1].minRoomWidth || this.state.minRoomWidth,
        maxRoomWidth = this.levels[this.state.level - 1].maxRoomWidth || this.state.maxRoomWidth,
        minRoomHeight = this.levels[this.state.level - 1].minRoomHeight || this.state.minRoomHeight,
        maxRoomHeight = this.levels[this.state.level - 1].maxRoomHeight || this.state.maxRoomHeight;
    
    // Generate a room size between the min and max size of a room to fit within the parameters
    let roomWidth = Math.randomBetween(minRoomWidth, Math.min(rx2 + 1, maxRoomWidth)),
        roomHeight = Math.randomBetween(minRoomHeight, Math.min(ry2 + 1, maxRoomHeight));
    
    let roomX1 = Math.randomBetween(rx1, rx2 - roomWidth) + x1;
    let roomX2 = roomX1 + roomWidth - 1;
    let roomY1 = Math.randomBetween(ry1, ry2 - roomHeight) + y1;
    let roomY2 = roomY1 + roomHeight - 1;
    
    
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
  
  wallRooms = () => {
    /* 
     * Loops through all cells in dungeon and replaces empty cells 
     * adjacent to room cells with wall cells.
     */
    
    let directions = [
      {x: 0, y: -1}, // north
      {x: 1, y: -1}, // north-east
      {x: 1, y: 0}, // east
      {x: 1, y: 1}, // south-east
      {x: 0, y: 1}, // south
      {x: -1, y: 1}, // south-west
      {x: -1, y: 0}, // west
      {x: -1, y: -1} // north-west
    ];
    
    for (let y in this.state.dungeon) {
      for (let x in this.state.dungeon[y]) {
        if (this.state.dungeon[y][x].type == "room" ||
            this.state.dungeon[y][x].type == "corridor") {
          
          // Loop through adjacent cells
          for (let direction of directions) {
            let currX = parseInt(x) + direction.x,
                currY = parseInt(y) + direction.y;
            
            if (!this.state.dungeon[currY] || !this.state.dungeon[currY][currX]) {
              continue;
            }
            
            if (this.state.dungeon[currY][currX].type == "empty") {
              this.state.dungeon[currY][currX].type = "wall";
            }
          }
        }
      }
    }
    return false;
  }
  
  NPC = function createNPC(x, y, type, health, attack) {
    this.type = type,
    this.x = x,
    this.y = y,
    this.direction = {
      x: Math.randomBetween(-1, 1),
      y: Math.randomBetween(-1, 1)
    },
    this.health = health,
    this.attack = attack,
    this.targetX = -1,
    this.targetY = -1,
    this.path = [];
    
    // Updates NPC position
    this.update = function updateNPCInDungeon(dungeon, targetX, targetY) {
      if (this.x == targetX && this.y == targetY) {
        // run combat code here.
        
        return false;
      }
      
      let ind = dungeon[this.y][this.x].NPCs.indexOf(this),
          adjacents = Grid.getAdjacentCells(this.x, this.y, dungeon).filter(function(curr) {
            // Filter adjacent cells to room cells.
            return (curr.cell.type == "room" || curr.cell.type == "corridor");
          });
      
      let distance = Grid.calculateApproxDistance(this.x, this.y,
                                                  targetX, targetY);
      
      // Move NPC towards the PC if within view 
      if (distance < 4 && dungeon[targetY][targetX].type != "hiddenRoom") {
        console.log("NPC's target:", this.targetX, this.targetY + "\n" +
                    "Current target:", targetX, targetY);
        if (this.targetX != targetX || this.targetY != targetY) {
          this.path = Grid.determinePath(this.x, this.y,
                                         targetX, targetY, dungeon);
          this.targetX = targetX;
          this.targetY = targetY;
        }
        
        if (this.path && this.path.length > 0) {
          console.log("Path:", this.path);
          // Take current coordinates off of path
          this.path.splice(0, 1);
          
          // Move NPC into next step in path
          let currNPC = this;
          
          // Take NPC off of cell.
          dungeon[this.y][this.x].NPCs.splice(ind, 1);
          
          this.x = this.path[0].x; 
          this.y = this.path[0].y;
          console.log(this);
          
          // Push NPC to front of new cell.
          dungeon[this.y][this.x].NPCs.unshift(currNPC);
          return dungeon;
        }
      }
      else if (distance >= 4 || dungeon[targetY][targetX].type == "hiddenRoom") {
        let cell = Math.randomBetween(0, adjacents.length - 1);
        
        // otherwise, NPC roams around
        if (adjacents[cell].cell.type == "room" ||
            adjacents[cell].cell.type == "corridor") {
          let currNPC = this;
          dungeon[this.y][this.x].NPCs.splice(ind, 1);
          
          this.x = adjacents[cell].x,
          this.y = adjacents[cell].y;
          
          dungeon[this.y][this.x].NPCs.unshift(currNPC);
          
          return dungeon;
        }
      }
      
      return false;
    };
  };
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
  
  populateWithNPCs = () => {
    // Modifies dungeon in place and generates NPCs, based on level number
    let level = this.levels[this.state.level - 1];
    
    level.typesOfNPCs.forEach((npc) => {
      let numOfNPCs = Math.randomBetween(npc.min, npc.max);
      for (let i = 0; i < numOfNPCs; i++) {
        let coordinates = Grid.getRandomMatchingCellWithin(0, this.state.dungeon[0].length - 1,
                                                           0, this.state.dungeon.length - 1,
                                                           "room", this.state.dungeon);
        
        let newNPC = new this.NPC(coordinates.x, coordinates.y,
                                  npc.type, this.NPCs[npc.type].health,
                                  this.NPCs[npc.type].attack);
        this.state.dungeon[coordinates.y][coordinates.x].NPCs.unshift(newNPC);
        
        // Run the NPC function every second.
        window.setInterval(() => {
          let dungeon = newNPC.update(this.state.dungeon, this.state.centerX, this.state.centerY);
          if (dungeon)
            this.setState({
              dungeon: dungeon
            });
        }, 1000);
      }
    });
  }
  
  generateHiddenRooms = (max) => {
    // recursively places hidden rooms on the edges of the dungeon
    let minHiddenRoomWidth = this.levels[this.state.level - 1].minHiddenRoomWidth ||
        this.state.minHiddenRoomWidth,
        maxHiddenRoomWidth = this.levels[this.state.level - 1].maxHiddenRoomWidth ||
        this.state.maxHiddenRoomWidth,
        minHiddenRoomHeight = this.levels[this.state.level - 1].minHiddenRoomHeight ||
        this.state.minHiddenRoomHeight,
        maxHiddenRoomHeight = this.levels[this.state.level - 1].maxHiddenRoomHeight ||
        this.state.maxHiddenRoomHeight;
    
    let width = Math.randomBetween(minHiddenRoomWidth,
                                   maxHiddenRoomWidth),
        height = Math.randomBetween(minHiddenRoomHeight,
                                    maxHiddenRoomHeight);
    
    let x, y, adjacent;
    
    while (!adjacent) {
      x = Math.randomBetween(0, this.state.dungeon[0].length - 1);
      y = Math.randomBetween(0, this.state.dungeon.length - 1);
      if (this.checkRectOfCells(x, y, width, height, function(cell) {
        return (cell.type == "wall");
      })) {
        adjacent = this.checkAdjacentCells(x, y, function(cell) {
          return (cell.type == "room");
        });
      }
    }
    
    for (let modY = 0; modY < height; modY++) {
      for (let modX = 0; modX < width; modX++) {
        if (this.state.dungeon[y  + modY])
          this.state.dungeon[y + modY][x + modX].type = "hiddenRoom";
      }
    }
    
    if (max > 1) {
      this.generateHiddenRooms(max - 1);
    }
  }
  
  checkRectOfCells = (x, y, width, height, func) => {
    // checks all cells within a set of coordinates 
    for (let modY = 0; modY < height; modY++) {
      for (let modX = 0; modX < width; modX++) {
        if (!this.state.dungeon[y + modY] || !this.state.dungeon[y + modY][x + modX] // check if cells don't exist
            || !func(this.state.dungeon[y + modY][x + modX]))
          return false;
      }
    }
    return true;
  }
  
  checkAdjacentCells = (x, y, func) => {
    // check adjacent cells based on function parameter.
    
    let directions = [
      {x: 0, y: -1}, // north
      {x: 1, y: 0}, // east
      {x: 0, y: 1}, // south
      {x: -1, y: 0}, // west
    ];
    
    for (let i in directions) {
      let currX = x + directions[i].x,
          currY = y + directions[i].y;
      
      if (!this.state.dungeon[currY] || !this.state.dungeon[currY][currX])
        continue;
      
      if (func(this.state.dungeon[currY][currX], currX, currY))
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
  
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  constructor(props) {
    super(props);
    
    this.state = {
      dungeon: [],
      level: 3,
      currHP: 100,
      maxHP: 100,
      minRoomHeight: 5,
      minRoomWidth: 7,
      maxRoomHeight: 6,
      maxRoomWidth: 8,
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
      roomSpacing: 2,
      gridWidth: 40,
      gridHeight: 30,
      randomCorridors: 0, // (0-100) Higher input means more chance of generating non-straight corridors
      centerX: 0,
      centerY: 0
    };
    
    this.levels = [ 
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

    this.initializeDungeon();
    
    let center = Grid.getRandomMatchingCellWithin(0, this.state.dungeon[0].length - 1,
                                                  0, this.state.dungeon.length - 1,
                                                  "room", this.state.dungeon);
    this.state.centerX = center.x,
    this.state.centerY = center.y;
  }
  
  render() {
    return (
      <div className="game">
        <HealthBar currHP={this.state.currHP} maxHP={this.state.maxHP} className="pc-health-bar" />
        <Viewport dungeon={this.state.dungeon}
                  centerX={this.state.centerX} centerY={this.state.centerY}
                  NPCs={this.NPCs} />
      </div>
    );
  }
}

class HealthBar extends React.Component {
  calculateHealthBar = () => {
    // calculate percentage based on current and max HP values
    let percent = (this.state.currHP / this.state.maxHP) * 100;
    return Math.floor(percent / 10);
  }
  
  fillHealthBar = (val) => {
    let barFills = [];
    
    for (let i = 0; i < val; i++) {
      barFills.push(<div className="health-bar-fill" key={i}></div>);
    }
    
    return barFills;
  }
  
  constructor(props) {
    super(props);
    
    this.state = {
      currHP: this.props.currHP,
      maxHP: this.props.maxHP,
      className: this.props.className || "npc-health-bar"
    };
  }
  
  render() { 
    let classNames = `${this.state.className} health-bar-container`;
    return (
      <div className={classNames}>
        {this.fillHealthBar(this.calculateHealthBar())}
      </div>
    );
  }
}

class NavigationButtons extends React.Component {
  
}

class LevelIndicator extends React.Component {
  
}

class EquipmentList extends React.Component {
  
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
          cellsInRow.push("null");
        }
        else if (dungeon[y] && dungeon[y][x]) {
          if (dungeon[y][x].NPCs.length > 0) {
            cellsInRow.push(dungeon[y][x].NPCs[0].type);
          }
          else if (dungeon[y][x].type == "hiddenRoom") { // check if the cell is a hidden room
            let distance = Grid.calculateApproxDistance(x, y, centerX, centerY);
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
          cellsInRow.push("empty");
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
      cellWidth: 20,
      cellHeight: 20,
      playerCell: {
        x: this.props.centerX,
        y: this.props.centerY
      },
      movementLag: 0,
      movementDelay: 0,
      viewPortHeight: 15,
      viewPortWidth: 15,
      darkViewToggle: true,
      darkViewRadius: 10,
      level: this.props.level
    };
    
    this.symbols = {
      room: ".",
      hiddenRoom: "#",
      wall: "#",
      null: ".",
      empty: ".",
      player: "@",
      monster1: "!",
      monster2: "!",
      monster3: "!",
      bossMonster: "!"
    };
    
    this.classNames = {
      room: "room-cell",
      hiddenRoom: "hidden-room-cell",
      wall: "wall-cell",
      null: "null-cell",
      empty: "empty-cell",
      player: "player-cell",
      monster1: "monster1-cell",
      monster2: "monster2-cell",
      monster3: "monster3-cell",
      bossMonster: "boss-monster-cell"   
    };
    
    
    /*
    // Set the viewport size to fit the screen size, and substract a portion to add spacing.
    this.state.viewPortHeight = (window.innerHeight / this.state.cellHeight);
    this.state.viewPortHeight = this.state.viewPortHeight - (this.state.viewPortHeight / 10);
    
    this.state.viewPortWidth = (window.innerWidth / this.state.cellWidth);
    this.state.viewPortWidth = this.state.viewPortWidth - (this.state.viewPortWidth / 10);
    */
    
    
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
            return (<ViewportCell
                        key={ind}
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
  componentWillReceiveProps(nextProps) {
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
    let classNames = `${this.state.class} cell`;
    return (
      <span className={classNames}>{this.state.symbol}</span>
    );
  }
}

ReactDOM.render(<Game />,
                document.getElementById("game"));
