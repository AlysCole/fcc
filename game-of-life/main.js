class GameOfLifeBox extends React.Component {
  constructor() {
    super();
    this.state = this.calculateTableSize();
  }
  componentDidMount() {
    var self = this;
    $(window).on('resize', (function() {
      clearTimeout($.data(window, 'resizeTimer'));
      $.data(window, 'resizeTimer', setTimeout(function() {
        self.updateDimensions(); 
      }, 100));
    }));
    $.data(window, 'gameTimeout', setTimeout(this.updateGame, this.state.speed));
  }
  componentDidUpdate() {
    clearTimeout($.data(window, 'gameTimeout'));
    if (this.state.running)
      $.data(window, 'gameTimeout', setTimeout(this.updateGame, this.state.speed));
  }
  componentWillUnmount() {
    $(window).off('resize');
  }
  generateGame = (width, height) => {
    var grid = [];
    for (var y = 0; y < height; y++) {
      var gridRow = [];
      for (var x = 0; x < width; x++) {
        gridRow.push((Math.floor(Math.random() * 5)) < 4 ? 0 : 1);
      }
      grid.push(gridRow);
    }
    return grid;
  }
  calculateTableSize = () => {
    var width = Math.floor(window.innerWidth / 10 * 0.7),
        height = Math.floor(window.innerHeight / 10 * 0.5);
    return {
      width: width,
      height: height,
      grid: this.generateGame(width, height),
      running: true,
      speed: 130,
    };
  }
  updateDimensions = () => {
    this.setState(this.calculateTableSize());
  }
  updateGame = () => {
    var newGrid = [];
    for (var y = 0; y < this.state.height; y++) {
      var newGridRow = [];
      for (var x = 0; x < this.state.width; x++) {
        var alive = this.calculateAliveNeighbors(x,y);
        if (alive < 2 && this.state.grid[y][x] >= 1) // With less than two live neigbors, cell dies.
          newGridRow.push(0);
        else if (alive > 3 && this.state.grid[y][x] >= 1) // With more than three, cell dies.
          newGridRow.push(0);
        else if (alive == 3 && this.state.grid[y][x] == 0) // With three, cell becomes live.
          newGridRow.push(1);
        else if (this.state.grid[y][x] >= 1) // If living cell does not die, it lives on another generation.
          newGridRow.push(this.state.grid[y][x] + 1);
        else
          newGridRow.push(this.state.grid[y][x]);
      }
      newGrid.push(newGridRow);
    }

    this.setState({
      grid: newGrid,
    });
  }
  updateCell = (x, y, value) => {
    var newGrid = this.state.grid;
    newGrid[y][x] = value;
    this.setState({
      grid: newGrid
    });
  }
  
  clearTable = () => {
    var newGrid = [];
    for (var y = 0; y < this.state.height; y++) {
      var gridRow = [];
      for (var x = 0; x < this.state.width; x++) {
        gridRow.push(0);
      }
      newGrid.push(gridRow);
    }

    this.setState({
      grid: newGrid 
    });
  }
  changeSpeed = (ms) => {
    this.setState({
      speed: ms,
    });
  }
  changeRunning = (isRun) => {
    if (this.state.running != isRun) {
      this.setState({
        running: isRun 
      });
    }
  }
  calculateAliveNeighbors = (x, y) => {
    var coords = [
      {x: 0, y: -1}, // north
      {x: 1, y: -1}, // northeast
      {x: 1, y: 0},  // east
      {x: 1, y: 1},  // southeast
      {x: 0, y: 1},  // south
      {x: -1, y: 1}, // southwest
      {x: -1, y: 0}, // west
      {x: -1, y: -1} // northwest
    ],
    numOfAlive = 0; 
    
    for (var c = 0; c < coords.length; c++) {
      var currX = x + coords[c].x,
          currY = y + coords[c].y;
      if (this.state.grid[currY] && this.state.grid[currY][currX] && this.state.grid[y + coords[c].y][x + coords[c].x] > 0)
          numOfAlive += 1;
    }
    return numOfAlive;
  }
  render = () => {
    return (
      <div className="gameOfLifeBox">
        <GameOfLifeControl clearTable={this.clearTable} changeRunning={this.changeRunning} />
        <GameOfLifeTable height={this.state.height} width={this.state.width} grid={this.state.grid} updateCell={this.updateCell} />
        <GameOfLifeSpeedControl changeSpeed={this.changeSpeed} />
      </div>
    );
  }
};

class GameOfLifeControl extends React.Component {
  render() {
    return (
      <div className="gameOfLifeControl">
        <input type="button" className="gameButton" id="gameButtonRun" value="Run" onClick={() => this.props.changeRunning(true)} />
        <input type="button" className="gameButton" id="gameButtonPause" value="Pause" onClick={() => this.props.changeRunning(false)} />
        <input type="button" className="gameButton" id="gameButtonClear" value="Clear" onClick={this.props.clearTable} />
      </div>
    );
  }
}

class GameOfLifeSpeedControl extends React.Component {
  render() {
    return (
      <div className="speedControl">
        <span className="speedTag">Speed: </span>
        <input type="button" className="gameButton" id="speedSlow" value="Slow" onClick={() => this.props.changeSpeed(300)} />
        <input type="button" className="gameButton" id="speedMedium" value="Medium" onClick={() => this.props.changeSpeed(200)} />
        <input type="button" className="gameButton" id="speedFast" value="Fast" onClick={() => this.props.changeSpeed(130)} />
      </div>
    )
  }
}

class GameOfLifeTable extends React.Component {
  render() {
    var rowNodes = [];
    for (var y = 0; y < this.props.height; y++) {
      rowNodes.push(<GameOfLifeTableRow width={this.props.width} gridRow={this.props.grid[y]} rowIndex={y} updateCell={this.props.updateCell} />);
    }
    return (
      <table className="gameOfLifeTable">
        {rowNodes}
      </table>
    );
  }
}

class GameOfLifeTableRow extends React.Component {
  render() {
    var cellNodes = [];
    for (var x = 0; x < this.props.width; x++) {
      var index = {x: x, y: this.props.rowIndex};
      cellNodes.push(<GameOfLifeTableCell cell={this.props.gridRow[x]} index={index} updateCell={this.props.updateCell} />);
    }
    return (
      <tr className="gameTableRow">
        {cellNodes}
      </tr>
    );
  }
}

class GameOfLifeTableCell extends React.Component {
  render() {
    var cellActivity;
    if (this.props.cell < 2)
      cellActivity = this.props.cell ? "aliveCell" : "deadCell";
    else if (this.props.cell >= 2)
      cellActivity = "oldAliveCell";
    var className = "gameTableCell " + cellActivity;
    return (
      <td className={className} onClick={() => this.props.updateCell(this.props.index.x, this.props.index.y, 1)}></td>
    );
  }
} 

ReactDOM.render(<GameOfLifeBox />,
  document.getElementById('gameOfLife'));
