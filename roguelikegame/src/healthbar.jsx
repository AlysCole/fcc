import React from 'react';

export default class HealthBar extends React.Component {
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
