import React from 'react';

export default class ViewportCell extends React.Component {
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
