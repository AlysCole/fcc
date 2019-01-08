const Grid = require("../Grid");
import React from "react";

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      dungeon: this.props.dungeon,
      NPCs: this.props.NPCs,
      dungeonView: [],
      cellWidth: 20,
      cellHeight: 20,
      player: this.props.player,
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
      npc1: "!",
      npc2: "!",
      npc3: "!",
      bossMonster: "!"
    };

    // Make sure radius is within the viewport size.
    if (
      this.state.darkViewRadius > this.state.viewPortWidth / 2 ||
      this.state.darkViewRadius > this.state.viewPortHeight / 2
    ) {
      this.state.darkViewRadius = Math.floor(
        Math.min(this.state.viewPortWidth / 2, this.state.viewPortHeight / 2)
      );
    }

    // Generate a dungeon with HTML5 Canvas
    this.state.dungeonView = this.getRectangularViewFromPoint(
      this.state.player.x,
      this.state.player.y,
      this.state.darkViewRadius,
      this.state.dungeon
    );
  }

  getRectangularViewFromPoint = (centerX, centerY, radius, dungeon) => {
    let viewCoordinates = {
      x1: centerX - Math.floor(this.state.viewPortWidth / 2),
      x2: centerX + Math.floor(this.state.viewPortWidth / 2),
      y1: centerY - Math.floor(this.state.viewPortHeight / 2),
      y2: centerY + Math.floor(this.state.viewPortHeight / 2)
    };

    let view = [];

    for (let y = viewCoordinates.y1; y <= viewCoordinates.y2; y++) {
      let cellsInRow = [];
      for (let x = viewCoordinates.x1; x <= viewCoordinates.x2; x++) {
        if (
          !(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <
            Math.pow(radius, 2)
          ) &&
          this.state.darkViewToggle
        ) {
          cellsInRow.push("null");
        } else if (dungeon && dungeon[y] && dungeon[y][x]) {
          if (dungeon[y][x].chars.length > 0) {
            cellsInRow.push(dungeon[y][x].chars[0].type);
          } else if (dungeon[y][x].type == "hiddenRoom") {
            // check if the cell is a hidden room
            let distance = Grid.calculateApproxDistance(x, y, centerX, centerY);
            if (distance < 2)
              // decide whether the hidden room is visible
              cellsInRow.push("hiddenRoom");
            else cellsInRow.push("wall");
          } else if (dungeon[y][x].type == "corridor") cellsInRow.push("room");
          else {
            cellsInRow.push(dungeon[y][x].type);
          }
        } else cellsInRow.push("empty");
      }
      view.push(cellsInRow);
    }
    return view;
  };

  componentWillReceiveProps = nextProps => {
    if (
      this.props.dungeon != nextProps.dungeon ||
      this.props.darkViewRadius != nextProps.darkViewRadius ||
      this.props.centerX != nextProps.centerX ||
      this.props.centerY != nextProps.centerY
    ) {
      this.setState({
        dungeon: nextProps.dungeon,
        player: nextProps.player,
        dungeonView: this.getRectangularViewFromPoint(
          nextProps.player.x,
          nextProps.player.y,
          nextProps.darkViewRadius,
          nextProps.dungeon
        )
      });
    }
  };

  componentDidUpdate() {}

  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}
