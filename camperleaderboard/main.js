var LeaderboardTable = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      url: "https://fcctop100.herokuapp.com/api/fccusers/top/recent",
      toggled: "recent"
    };
  },
  getDataFromURL: function(url, toggled) {
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data, url: url, toggled: toggled});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.getDataFromURL(this.state.url, this.state.toggled);
  },
  handleToggle: function(text) {
    this.getDataFromURL("https://fcctop100.herokuapp.com/api/fccusers/top/" + text, text);
  },
  render: function() {
    var userNodes = this.state.data.map(function(usr, ind) {
      usr.key = ind;
      return (
        <LeaderboardUser data={usr} />
      );
    });
    return (
      <div className="leaderboardTable">
        <LeaderboardHeader onToggle={this.handleToggle} toggled={this.state.toggled} />
        {userNodes}
      </div>
    )
  } 
});

var LeaderboardHeader = React.createClass({
  renderHeaderCell: function(text, clickFunc, id, toggled) {
    return (
      <LeaderboardHeaderCell text={text} onClick={clickFunc} id={id} toggled={toggled}/>
    )
  },
  handleClick: function(e) {
    this.setState({id: e.target.id});
    this.props.onToggle(e.target.id);
  },
  render: function() {
    return (
      <div className="leaderboardHeader">
        {this.renderHeaderCell("#")}
        {this.renderHeaderCell("Camper Name")}
        {this.renderHeaderCell("Points in past 30 days", this.handleClick, "recent", (this.props.toggled == "recent" ? true : false))}
        {this.renderHeaderCell("All time points", this.handleClick, "alltime", (this.props.toggled == "alltime" ? true: false))}
     </div>
    )
  } 
});

var LeaderboardHeaderCell = React.createClass({
  render: function() {
    return (
      <div className={(this.props.id ? "leaderboardHeaderToggle " : "") + (this.props.toggled ? "leaderboardHeaderToggled " : "") + "leaderboardHeaderCell"} onClick={this.props.onClick} id={this.props.id}>
        {this.props.text}
      </div>
    );
  }
});

var LeaderboardUser = React.createClass({
  renderUserCell: function(text, image) {
    return (
      <LeaderboardUserCell text={text} img={image} />
    );
  },
  render: function() {
    return (
      <div className="leaderboardUser">
        {this.renderUserCell(this.props.data.key + 1)}
        {this.renderUserCell(this.props.data.username, this.props.data.img)}
        {this.renderUserCell(this.props.data.recent)}
        {this.renderUserCell(this.props.data.alltime)}
      </div>
    );
  }
});

var LeaderboardUserCell = React.createClass({
  render: function() {
    var userURL = "http://freecodecamp.com/" + this.props.text;
    if (this.props.img) {
      return (
        <div className="leaderboardUserCell">
          <img src={this.props.img} className="userIcon" />
          <a href={userURL}>{this.props.text}</a>
        </div>
      );
    }
    return (
      <div className="leaderboardUserCell">
        {this.props.text}
      </div>
    );
  }
});

ReactDOM.render(
  <LeaderboardTable />, document.getElementById('leaderboard-table')
);
