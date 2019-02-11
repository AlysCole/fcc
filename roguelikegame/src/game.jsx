const Grid = require("./Grid");
const Utility = require("./Utility");
import React from "react";
import HealthBar from "./healthbar.jsx";
import Viewport from "./viewport/index.jsx";

export default class Game extends React.Component {
  // helper functions
  getPlayerCell = () => {
    return this.state.dungeon[this.state.player.y][this.state.player.x];
  };

  initializeDungeon = () => {
    if (this.state.dungeon.length == 0) {
      for (let y = 0; y < this.config.gridHeight; y++) {
        let arr = [];
        for (let x = 0; x < this.config.gridWidth; x++) {
          arr.push({
            type: "empty",
            chars: [],
            items: []
          });
        }
        this.state.dungeon.push(arr);
      }
    }

    // Generate dungeon using BSP trees.
    this.splitDungeon(
      1,
      this.config.gridWidth - 1,
      1,
      this.config.gridHeight - 1,
      Grid.randomDirection,
      this.splitDungeon
    );

    let numOfHiddenRooms = Math.randomBetween(
      this.levels[this.state.level - 1].minNumOfHiddenRooms ||
        this.config.minNumOfHiddenRooms,
      this.levels[this.state.level - 1].maxNumOfHiddenRooms ||
        this.config.maxNumOfHiddenRooms
    );

    this.wallRooms();
    this.generateHiddenRooms(numOfHiddenRooms);
    // Generate NPCs
    this.populateWithNPCs();
  };

  // Function takes a set of coordinates for a rectangle and splits it recursively.
  splitDungeon = (x1, x2, y1, y2, direction, callback) => {
    // Calculate the size of rectangle.
    let c1 = direction == "x" ? x1 - x1 : y1 - y1,
      c2 = direction == "x" ? x2 - x1 : y2 - y1,
      splitAtCoord = 0,
      minRoomHeight =
        this.levels[this.state.level - 1].minRoomHeight ||
        this.config.minRoomHeight,
      minRoomWidth =
        this.levels[this.state.level - 1].minRoomWidth ||
        this.config.minRoomWidth,
      minRoomSplitSize =
        this.config.minSplitSize ||
        (direction == "y" ? minRoomHeight : minRoomWidth) +
          this.config.roomSpacing,
      minNumOfRooms =
        this.levels[this.state.level - 1].minNumOfRooms ||
        this.config.minNumOfRooms,
      maxNumOfRooms =
        this.levels[this.state.level - 1].maxNumOfRooms ||
        this.config.maxNumOfRooms,
      result = 0,
      rooms = []; // array of rooms generated from split.

    if (
      c2 - minRoomSplitSize >= minRoomSplitSize &&
      this.state.currNumOfRooms < minNumOfRooms
    ) {
      splitAtCoord = Math.randomBetween(
        minRoomSplitSize,
        c2 - minRoomSplitSize
      );

      // Calculate rectangles that result from split.
      let subdungeons = [
        { x1: 0, x2: 0, y1: 0, y2: 0 },
        { x1: 0, x2: 0, y1: 0, y2: 0 }
      ];

      // First split
      // 1. First corner is the top-left corner of the current subdungeon.
      subdungeons[0].x1 = x1;
      subdungeons[0].y1 = y1;

      // 2. Bottom-left corner will be based on split coordinates.
      subdungeons[0].x2 = direction == "x" ? x1 + splitAtCoord : x2;
      subdungeons[0].y2 = direction == "y" ? y1 + splitAtCoord : y2;

      // Second split
      subdungeons[1].x1 = direction == "x" ? x1 + splitAtCoord + 1 : x1;
      subdungeons[1].y1 = direction == "y" ? y1 + splitAtCoord + 1 : y1;

      subdungeons[1].x2 = x2;
      subdungeons[1].y2 = y2;

      // Recursively call function on each rectangle.
      let splitDir = Grid.randomDirection();
      for (let i = 0; i <= 1; i++) {
        result = this.splitDungeon(
          subdungeons[i].x1,
          subdungeons[i].x2,
          subdungeons[i].y1,
          subdungeons[i].y2,
          splitDir,
          this.splitDungeon
        );
        if (isNaN(result) && result) rooms.push(result);
      }
      if (rooms.length == 2) {
        this.generateCorridor(rooms[0], rooms[1]);
      }
      if (rooms) {
        return rooms[Math.randomBetween(0, rooms.length - 1)];
      } else {
        return 0;
      }
      return 1;
    } else {
      // We try splitting it another direction if a callback exists.
      if (callback) {
        result = callback(x1, x2, y1, y2, direction == "y" ? "x" : "y");
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
  };

  generateRoom = (x1, x2, y1, y2) => {
    /*
      Generate a room within the minimum and maximum size of one and
      plot it within the coordinates passed as parameters in the dungeon.
      
      Returns 0 if function fails. Returns 1 otherwise.
    */

    let rx1 = x1 - x1 + this.config.roomSpacing,
      rx2 = x2 - x1 - this.config.roomSpacing,
      ry1 = y1 - y1 + this.config.roomSpacing,
      ry2 = y2 - y1 - this.config.roomSpacing,
      minRoomWidth =
        this.levels[this.state.level - 1].minRoomWidth ||
        this.config.minRoomWidth,
      maxRoomWidth =
        this.levels[this.state.level - 1].maxRoomWidth ||
        this.config.maxRoomWidth,
      minRoomHeight =
        this.levels[this.state.level - 1].minRoomHeight ||
        this.config.minRoomHeight,
      maxRoomHeight =
        this.levels[this.state.level - 1].maxRoomHeight ||
        this.config.maxRoomHeight;

    // Generate a room size between the min and max size of a room to fit within the parameters
    let roomWidth = Math.randomBetween(
        minRoomWidth,
        Math.min(rx2 + 1, maxRoomWidth)
      ),
      roomHeight = Math.randomBetween(
        minRoomHeight,
        Math.min(ry2 + 1, maxRoomHeight)
      );

    let roomX1 = Math.randomBetween(rx1, rx2 - roomWidth) + x1;
    let roomX2 = roomX1 + roomWidth - 1;
    let roomY1 = Math.randomBetween(ry1, ry2 - roomHeight) + y1;
    let roomY2 = roomY1 + roomHeight - 1;

    this.state.currNumOfRooms += 1;
    return this.positionRoom(roomX1, roomX2, roomY1, roomY2);
  };

  positionRoom = (x1, x2, y1, y2) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        this.state.dungeon[y][x].type = "room";
      }
    }

    return {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2
    };
  };

  generateCorridor = (r1, r2) => {
    const r1Point = Grid.getRandomPointWithin(r1.x1, r1.x2, r1.y1, r1.y2),
      r2Point = Grid.getRandomPointWithin(r2.x1, r2.x2, r2.y1, r2.y2);

    var currPoint = {
      x: r1Point.x,
      y: r1Point.y
    };

    var currDirection = Grid.randomDirection();
    var otherDirection = currDirection == "x" ? "y" : "x";

    // if the target coordinate is equal to starting coordinate and the other
    // coordinate is not equal to the starting coordinate
    if (
      r2Point[currDirection] == r1Point[currDirection] &&
      r2Point[otherDirection] != r1Point[otherDirection]
    )
      // set direction to the other axis
      currDirection = otherDirection;
    else if (r2Point[currDirection] == r1Point[currDirection])
      // if the starting coordinates are equal to the target, end function
      return 1;

    while (currPoint[currDirection] != r2Point[currDirection]) {
      // generate a random direction to follow based on the randomness setting.
      if (Math.random() < this.config.randomCorridors * 0.01)
        currDirection = Grid.randomDirection();

      if (currPoint[currDirection] < r2Point[currDirection]) {
        currPoint[currDirection] += 1;
        this.state.dungeon[currPoint.y][currPoint.x].type = "corridor";
      } else if (currPoint[currDirection] > r2Point[currDirection]) {
        currPoint[currDirection] -= 1;
        this.state.dungeon[currPoint.y][currPoint.x].type = "corridor";
      }

      // check whether the next step is equal to our destination.
      if (
        currPoint[currDirection] == r2Point[currDirection] &&
        currPoint[currDirection == "x" ? "y" : "x"] !=
          r2Point[currDirection == "x" ? "y" : "x"]
      )
        // if it is, change the direction to the other.
        currDirection = currDirection == "x" ? "y" : "x";
    }
    return 1;
  };

  wallRooms = () => {
    /* 
     * Loops through all cells in dungeon and replaces empty cells 
     * adjacent to room cells with wall cells.
     */

    let directions = [
      { x: 0, y: -1 }, // north
      { x: 1, y: -1 }, // north-east
      { x: 1, y: 0 }, // east
      { x: 1, y: 1 }, // south-east
      { x: 0, y: 1 }, // south
      { x: -1, y: 1 }, // south-west
      { x: -1, y: 0 }, // west
      { x: -1, y: -1 } // north-west
    ];

    for (let y = 0; y < this.state.dungeon.length; y++) {
      for (let x = 0; x < this.state.dungeon[y].length; x++) {
        if (
          this.state.dungeon[y][x].type == "room" ||
          this.state.dungeon[y][x].type == "corridor"
        ) {
          // Loop through adjacent cells
          for (let direction of directions) {
            let currX = parseInt(x) + direction.x,
              currY = parseInt(y) + direction.y;

            if (
              !this.state.dungeon[currY] ||
              !this.state.dungeon[currY][currX]
            ) {
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
  };

  generateHiddenRooms = max => {
    // recursively places hidden rooms on the edges of the dungeon
    let minHiddenRoomWidth =
        this.levels[this.state.level - 1].minHiddenRoomWidth ||
        this.config.minHiddenRoomWidth,
      maxHiddenRoomWidth =
        this.levels[this.state.level - 1].maxHiddenRoomWidth ||
        this.config.maxHiddenRoomWidth,
      minHiddenRoomHeight =
        this.levels[this.state.level - 1].minHiddenRoomHeight ||
        this.config.minHiddenRoomHeight,
      maxHiddenRoomHeight =
        this.levels[this.state.level - 1].maxHiddenRoomHeight ||
        this.config.maxHiddenRoomHeight;

    let width = Math.randomBetween(minHiddenRoomWidth, maxHiddenRoomWidth),
      height = Math.randomBetween(minHiddenRoomHeight, maxHiddenRoomHeight);

    let x, y, adjacent;

    while (!adjacent) {
      x = Math.randomBetween(0, this.state.dungeon[0].length - 1);
      y = Math.randomBetween(0, this.state.dungeon.length - 1);
      if (
        this.checkRectOfCells(x, y, width, height, function(cell) {
          return cell.type == "wall";
        })
      ) {
        adjacent = this.checkAdjacentCells(x, y, function(cell) {
          return cell.type == "room";
        });
      }
    }

    for (let modY = 0; modY < height; modY++) {
      for (let modX = 0; modX < width; modX++) {
        if (this.state.dungeon[y + modY])
          this.state.dungeon[y + modY][x + modX].type = "hiddenRoom";
      }
    }

    if (max > 1) {
      this.generateHiddenRooms(max - 1);
    }
  };

  checkRectOfCells = (x, y, width, height, func) => {
    // checks all cells within a set of coordinates
    for (let modY = 0; modY < height; modY++) {
      for (let modX = 0; modX < width; modX++) {
        if (
          !this.state.dungeon[y + modY] ||
          !this.state.dungeon[y + modY][x + modX] || // check if cells don't exist
          !func(this.state.dungeon[y + modY][x + modX])
        )
          return false;
      }
    }
    return true;
  };

  checkAdjacentCells = (x, y, func) => {
    // check adjacent cells based on function parameter.

    let directions = [
      { x: 0, y: -1 }, // north
      { x: 1, y: 0 }, // east
      { x: 0, y: 1 }, // south
      { x: -1, y: 0 } // west
    ];

    for (let i in directions) {
      let currX = x + directions[i].x,
        currY = y + directions[i].y;

      if (!this.state.dungeon[currY] || !this.state.dungeon[currY][currX])
        continue;

      if (func(this.state.dungeon[currY][currX], currX, currY)) return true;
    }
    return false;
  };

  NPC = function createNPC(
    game,
    x,
    y,
    type,
    health,
    offense,
    defense,
    delay,
    walkDelay,
    runDelay,
    calculatePath
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.direction = {
      x: Math.randomBetween(-1, 1),
      y: Math.randomBetween(-1, 1)
    };
    this.health = health;
    this.maxHealth = health;
    this.offense = offense;
    this.defense = defense;
    this.targetX = -1;
    this.targetY = -1;
    this.path = [];
    this.delay = delay;
    this.walkDelay = walkDelay;
    this.runDelay = runDelay;
    this.calculatePath = calculatePath;
    this.paused = false;
    this.moveTimeout = null;

    // Updates NPC position
    this.update = function(dungeon, targetX, targetY) {
      // if the NPC is paused, do not update/move position
      if (this.paused) return false;

      if (this.x == targetX && this.y == targetY) {
        const ind = game.state.combatTurns.indexOf(this);
        if (ind == -1) game.initiateCombat(this, ind);
        return false;
      } else if (this.x != targetX || this.y != targetY) {
        if (game.state.combatIntervalID) {
          // remove NPC from combatTurns array if found
          const ind = game.state.combatTurns.indexOf(this);
          if (ind > -1) game.state.combatTurns.splice(ind, 1);

          if (game.state.combatTurns.length <= 1) {
            // kill running combat interval if PC is not engaged in combat
            clearInterval(game.state.combatIntervalID);
            game.state.combatIntervalID = null;
          }
        }
      }

      this.path = this.calculatePath(dungeon, this.x, this.y, targetX, targetY);

      if (this.path.length > 0) {
        const ind = dungeon[this.y][this.x].chars.indexOf(this);

        // Move NPC into next step in path
        let currNPC = this;

        // Take NPC out of cell's chars array.
        dungeon[this.y][this.x].chars.splice(ind, 1);

        this.x = this.path[0].x;
        this.y = this.path[0].y;

        // Push NPC to the top of the chars array in the new cell.
        dungeon[this.y][this.x].chars.unshift(currNPC);

        return dungeon;
      }
      return false;
    };
  };

  setNPCTimeout = npc => {
    // break out of function if NPC no longer exists
    if (this.state.NPCs.indexOf(npc) === -1) return false;

    window.setTimeout(() => {
      const dungeon = npc.update(
        this.state.dungeon,
        this.state.player.x,
        this.state.player.y
      );
      if (dungeon) {
        this.setState({
          dungeon: dungeon
        });
      }
      npc.moveTimeout = window.setTimeout(
        () => this.setNPCTimeout(npc),
        npc.delay
      );
    });
  };

  initiateCombat = (npc, ind) => {
    const pc = this.state.player;

    console.log(`Combat initiated with NPC ${this.state.NPCs.indexOf(npc)}`);

    // Insert NPC in combat turns array
    this.state.combatTurns.unshift(npc);

    // Insert the PC if it isn't already in the combatTurns array
    if (this.state.combatTurns.indexOf(pc) == -1) {
      this.state.combatTurns.unshift(pc);
    }

    if (!this.state.combatIntervalID) {
      const combatIntervalID = setInterval(() => {
        this.enterCombat();
      }, 2000);
      this.state.combatIntervalID = combatIntervalID;
    }
  };

  enterCombat = () => {
    const attacker = this.state.combatTurns[0];
    let target;

    console.log(`Combat turn: ${attacker.type}`);
    if (attacker.type == "player") {
      // determine player's target if not defined, or not existing in combatTurns
      if (
        !attacker.target ||
        this.state.combatTurns.indexOf(attacker.target) == -1
      ) {
        attacker.target = this.state.combatTurns[1];
      }
      target = attacker.target;
    } else {
      target = this.state.player;
    }

    // calculate damage
    const damage = this.calculateDamage(attacker.offense, target.defense);

    console.log(
      `${attacker.type} is dealing ${damage} damage to ${target.type}.`
    );
    console.log(`${target.type} now has ${target.health} health.`);

    // apply damage to target's health
    target.health = target.health - damage;

    // kill target
    if (target.health <= 0) {
      console.log(`${attacker.type} killed ${target.type}.`);
      if (target.type == "player") {
        // if target is a PC, run the game over function... which
        // doesn't yet exist
        this.gameOver();
      } else {
        // if target is an NPC, kill target
        this.killNPC(target);
      }
    }

    // move attacker to the end of combatTurns array
    this.state.combatTurns.splice(this.state.combatTurns[0], 1);
    this.state.combatTurns.push(attacker);
  };

  calculateDamage = (attackerOff, targetDef) => {
    // calculate damage by generating a random number between 1 and
    // the attacker's offense. https://copr.fedorainfracloud.org/Subtract a number between 0 and the
    // target's defense from the damage.
    let damage = Math.randomBetween(1, attackerOff);

    console.log(`Calculated ${damage} from attacker offense ${attackerOff}.`);

    let damageResistance = Math.randomBetween(0, targetDef);
    damage = Math.max(0, damage - Math.randomBetween(0, targetDef));

    console.log(
      `Subtracting damage resistance ${damageResistance} from target defense ${targetDef}.`
    );
    console.log(`Calculated damage: ${damage}.`);
    return damage;
  };

  killNPC = npc => {
    let ind = this.state.NPCs.indexOf(npc);
    let combatIntervalID = this.state.combatIntervalID;
    let combatTurns = this.state.combatTurns;
    let dungeon = this.state.dungeon;

    if (ind > -1) {
      combatTurns = combatTurns.remove(npc);
      // stop combat if no other NPCs are engaged in combat
      if (combatTurns.length <= 1) {
        clearInterval(combatIntervalID);
        combatIntervalID = null;
        combatTurns = [];
      }

      // remove from dungeon
      dungeon[npc.y][npc.x].chars.splice(
        dungeon[npc.y][npc.x].chars.indexOf(npc),
        1
      );

      // drop random item in place of NPC
      dungeon[npc.y][npc.x].items.concat(this.loadDrops(npc));

      this.setState({
        NPCs: this.state.NPCs.remove(npc),
        dungeon: dungeon,
        combatIntervalID: combatIntervalID,
        combatTurns: combatTurns
      });
    }
  };

  loadDrops = npc => {
    // load items in place of NPC
    let dropsLoaded = [];

    for (let type in this.NPCs[npc.type].drops) {
      if (Math.checkPercentage(this.NPCs[npc.type].drops[type])) {
        // generate drop based on its possible parameters in this.items
        let drop = this.generateDrop(type);
        dropsLoaded.push(drop);
      }
    }

    if (dropsLoaded.length > 0) {
      // print the names of the objects dropped:
      dropsLoaded = dropsLoaded.map(drop => {
        return drop.prefixArticle();
      });
      let dropsStr = dropsLoaded.join(", ");
      const ind = dropsStr.lastIndexOf(", ");
      let npcString = this.NPCs[npc.type].prefixArticle();

      dropsStr = dropsStr.slice(0, ind) + ", and" + dropsStr.slice(ind + 1);

      console.log(`${npcString} drops ${dropsStr}.`.capitalizeFirstLetter());
    }
  };

  generateDrop = dropType => {};

  checkNPCExistsAtPoint = (x, y, arr) => {
    return (
      arr.filter(function(npc) {
        return npc.x == x && npc.y == y;
      }).length > 0
    );
  };

  getNPCsAtPoint = (x, y, arr) => {
    return arr.filter(function(npc) {
      return npc.x == x && npc.y == y;
    });
  };

  populateWithNPCs = () => {
    // Modifies dungeon in place and generates NPCs, based on level number
    let level = this.levels[this.state.level - 1];

    // clear current NPCs and kill any running combat intervals
    this.state.NPCs = [];

    for (let i = 0; i < level.typesOfNPCs.length; i++) {
      const npc = level.typesOfNPCs[i];
      let numOfNPCs = Math.randomBetween(npc.min, npc.max);
      for (let i = 0; i < numOfNPCs; i++) {
        let coordinates = Grid.getRandomMatchingCellWithin(
          0,
          this.state.dungeon[0].length - 1,
          0,
          this.state.dungeon.length - 1,
          "room",
          this.state.dungeon
        );

        let newNPC = new this.NPC(
          this,
          coordinates.x,
          coordinates.y,
          npc.type,
          this.NPCs[npc.type].health,
          this.NPCs[npc.type].offense,
          this.NPCs[npc.type].defense,
          this.NPCs[npc.type].delay,
          this.NPCs[npc.type].walkDelay,
          this.NPCs[npc.type].runDelay,
          this.NPCs[npc.type].calculatePath
        );
        this.state.dungeon[coordinates.y][coordinates.x].chars.unshift(newNPC);
        this.state.NPCs.push(newNPC);

        // Run the NPC function every {newNPC.delay}ms
        this.setNPCTimeout(newNPC);
      }
    }
  };

  // function to initiate and run combat as long as NPC(s) and PC are in the same
  // room.
  handleKeyDown = event => {
    if (event.keyCode < 37 || event.keyCode > 40) return false;

    let x = this.state.player.x,
      y = this.state.player.y,
      newX = this.state.player.x,
      newY = this.state.player.y;

    if (this.config.movementDelay) {
      // check if movement delay is true
      if (this.state.movementLag < this.config.movementDelay) {
        this.state.movementLag++;
        return false;
      } else if (this.state.movementLag >= this.config.movementDelay)
        this.state.movementLag = 0;
    }

    if (event.keyCode == 37) {
      // left arrow key
      newX -= 1;
    } else if (event.keyCode == 38) {
      // up arrow key
      newY -= 1;
    } else if (event.keyCode == 39) {
      // right arrow key
      newX += 1;
    } else if (event.keyCode == 40) {
      // down arrow key
      newY += 1;
    } else if (event.keyCode == 67) {
      // 'c' key
      /*
      if (this.state.dungeon[y][x].chars > 0) {
        // capture a random NPC within the same cell
        const charIndex = Math.randomBetween(
          0,
          this.state.dungeon[y][x].chars.length
        );
        const npc = this.state.dungeon[y][x].chars[charIndex];
        npc.paused = true;
      }
      */
    }

    if (
      this.state.dungeon[newY] &&
      this.state.dungeon[newY][newX] &&
      (this.state.dungeon[newY][newX].type == "room" ||
        this.state.dungeon[newY][newX].type == "hiddenRoom" ||
        this.state.dungeon[newY][newX].type == "corridor")
    ) {
      let dungeon = this.state.dungeon;

      dungeon[y][x].chars.splice(
        dungeon[y][x].chars.indexOf(this.state.player),
        1
      );

      (this.state.player.x = newX), (this.state.player.y = newY);

      dungeon[newY][newX].chars.unshift(this.state.player);

      // once successfully moved, kill any running combat processes
      if (this.state.combatIntervalID) {
        clearInterval(this.state.combatIntervalID);
        this.state.combatIntervalID = null;
        this.state.combatTurns = [];
      }

      // initiate combat if there are NPCs in the current cell
      if (dungeon[newY][newX].chars > 1) {
        this.initiateCombat();
      }

      this.setState({
        dungeon: dungeon
      });

      return true;
    }
    return false;
  };

  gameOver = () => {};

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  constructor(props) {
    super(props);

    this.state = {
      dungeon: [],
      level: 1,
      player: {
        type: "player",
        x: 0,
        y: 0,
        health: 30,
        maxHealth: 30,
        offense: 8,
        defense: 0,
        target: null
      },
      combatIntervalID: null,
      combatTurns: [],
      currNumOfRooms: 0,
      movementLag: 0,
      movementDelay: 0
    };

    this.config = {
      minRoomHeight: 6,
      minRoomWidth: 8,
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
      minSplitSize: null,
      roomSpacing: 0,
      gridWidth: 40,
      gridHeight: 30,
      randomCorridors: 0 /* (0-100) Higher input means more chance
                          * of generating non-straight corridors
                          */
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
            type: "npc1",
            min: 1,
            max: 1
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
            type: "npc1",
            min: 2,
            max: 3
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
            type: "npc1",
            min: 4,
            max: 6
          },
          {
            type: "npc2",
            min: 1,
            max: 2
          }
        ]
      }
    ];

    this.NPCs = {
      npc1: {
        name: "rat",
        health: 20,
        offense: 2,
        defense: 1,
        walkDelay: 750,
        runDelay: 150,
        delay: 5000,
        drops: {
          bloodBag1: 100, // percentage likely to drop
          ratFang: 100,
          ratHide: 100
        },
        // function that returns the coordinates for the NPC's next move.
        calculatePath: function getRatCoords(dungeon, x, y, playerX, playerY) {
          // the 'rat' should be sent into a panic once the PC nears it.
          // return: a random set of coordinates adjacent to the given
          // parameters x and y
          const distance = Grid.calculateApproxDistance(
            x,
            y,
            playerX,
            playerY,
            dungeon
          );
          const adjacent = Grid.getAdjacentCells(x, y, dungeon).filter(function(
            curr
          ) {
            return curr.cell.type === "room" || curr.cell.type === "corridor";
          });

          let path = [],
            delay;
          // return the path with a random set of coordinates if the PC is
          // within view OR out of a 3 out of 10 possibility
          if (
            (distance < 5 && dungeon[playerY][playerX].type != "hiddenRoom") ||
            Math.random() < 0.3
          ) {
            // push a random set of adjacent coordinates to the path
            path.push(adjacent[Math.randomBetween(0, adjacent.length - 1)]);
            // lower the delay of movement to simulate panicked running
            delay = this.runDelay;
          } else {
            delay = this.walkDelay;
          }
          if (this.delay != delay) {
            this.delay = delay;
          }

          return path;
        }
      },
      npc2: {
        name: "kid",
        health: 40,
        offense: 7,
        defense: 3,
        walkDelay: 900,
        runDelay: 350,
        delay: 1000,
        // return a random set of adjacent coordinates -or- coordinates directly
        // away from the PC
        calculatePath: function getKidCoords(dungeon, x, y, playerX, playerY) {
          const distance = Grid.calculateApproxDistance(x, y, playerX, playerY);
          const adjacent = Grid.getAdjacentCells(x, y, dungeon).filter(function(
            curr
          ) {
            return curr.cell.type == "room" || curr.cell.type == "corridor";
          });

          let path = [];
          if (distance < 2 && dungeon[playerY][playerX].type != "hiddenRoom") {
            // randomly return either a random set of adjacent coordinates or
            // the farthest coordinates from the PC
            if (Math.random() < 0.5) {
              // push the farthest coordinates from the player's position to the
              // array to the array to the array to the array
              path.push(
                adjacent.reduce(function(coords, curr) {
                  // check whether the current coordinates are farther from the
                  // player's coordinates than 'coords'.
                  if (
                    Grid.calculateApproxDistance(
                      playerX,
                      playerY,
                      curr.x,
                      curr.y
                    ) >
                    Grid.calculateApproxDistance(
                      playerX,
                      playerY,
                      coords.x,
                      coords.y
                    )
                  )
                    // return the current coordinates if so.
                    return curr;
                  // otherwise, return the current 'furthest' coordinates.
                  return coords;
                })
              );
            } else {
              // push a random set of coordinates from the array of adjacent sets of
              // coordinates
              path.push(adjacent[Math.randomBetween(0, adjacent.length - 1)]);
            }
            // set delay lower to simulate running
            this.delay = this.runDelay;
          } else {
            path.push(adjacent[Math.randomBetween(0, adjacent.length - 1)]);
            this.delay = this.walkDelay;
          }
          // return the path
          return path;
        }
      },
      npc3: {
        name: "adult",
        health: 60,
        offense: 10,
        defense: 5,
        walkDelay: 1000,
        runDelay: 250,
        delay: 2000,
        // return the coordinates farthest away from the PC
        calculatePath: function getAdultCoords(
          dungeon,
          x,
          y,
          playerX,
          playerY
        ) {
          const distance = Grid.calculateApproxDistance(x, y, playerX, playerY);
          const adjacent = Grid.getAdjacentCells(x, y, dungeon).filter(function(
            curr
          ) {
            return curr.cell.type == "room" || curr.cell.type == "corridor";
          });

          let path = [];
          if (distance < 4 && dungeon[playerY][playerX].type != "hiddenRoom") {
            // push coordinates furthest away from the PC to the path array
            path.push(
              adjacent.reduce(function(coords, curr) {
                if (
                  Grid.calculateApproxDistance(
                    playerX,
                    playerY,
                    curr.x,
                    curr.y
                  ) >
                  Grid.calculateApproxDistance(
                    playerX,
                    playerY,
                    coords.x,
                    coords.y
                  )
                )
                  return curr;
                return coords;
              })
            );
            this.delay = this.runDelay;
          } else {
            // push a random set of adjacent coordinates
            path.push(adjacent[Math.randomBetween(0, adjacent.length - 1)]);
            this.delay = this.walkDelay;
          }
          return path;
        }
      },
      bossNPC: {
        health: 120,
        offense: 20,
        defense: 10,
        delay: 2000 - (120 - 0.8 * 120) * 10,
        // return a path that leads to the PC; simulate the NPC attempting to
        // attack the PC
        calculatePath: function getBossCoords(dungeon, x, y, playerX, playerY) {
          const distance = Grid.calculateApproxDistance(x, y, playerX, playerY);
          // find a path to the PC if the PC is within view of the NPC
          if (distance < 10 && dungeon[playerY][playerX].type != "hiddenRoom") {
            return Grid.determinePath(x, y, playerX, playerY, dungeon);
          }

          // otherwise, return a random set of coordinates
          const adjacent = Grid.getAdjacentCells(x, y, dungeon).filter(function(
            curr
          ) {
            return curr.cell.type == "room" || curr.cell.type == "corridor";
          });
          return [adjacent[Math.randomBetween(0, adjacent.length - 1)]];
        }
      }
    };

    this.items = {
      bloodBag1: {
        name: "blood bag",
        minHealthRestore: 10, // restores health
        maxHealthRestore: 15,
        maxHealth: 10 // boosts max. health
      },
      ratFang: {
        name: "rat fang",
        minOffense: 10, // adds to offense
        maxOffense: 10
      },
      ratHide: {
        name: "rat hide",
        minDefense: 5,
        maxDefense: 5
      }
    };

    this.initializeDungeon();

    let center = Grid.getRandomMatchingCellWithin(
      0,
      this.state.dungeon[0].length - 1,
      0,
      this.state.dungeon.length - 1,
      "room",
      this.state.dungeon
    );
    this.state.player.x = center.x;
    this.state.player.y = center.y;

    this.state.dungeon[center.y][center.x].chars.unshift(this.state.player);
  }

  render() {
    return (
      <div className="game">
        <div className="top-bar">
          <div className="left">
            {
              <HealthBar
                type="player"
                currHP={this.state.player.health}
                maxHP={this.state.player.maxHealth}
              />
            }
          </div>
          <div className="right">
            {this.getPlayerCell().chars.map((char, ind) => {
              if (char.type == "player") return false;
              console.log(
                `Generating a health bar for character type ${char.type}.`
              );
              return (
                <HealthBar
                  type={char.type}
                  key={ind}
                  currHP={char.health}
                  maxHP={char.maxHealth}
                />
              );
            })}
          </div>
        </div>
        <Viewport
          dungeon={this.state.dungeon}
          player={this.state.player}
          NPCs={this.NPCs}
        />
      </div>
    );
  }
}
