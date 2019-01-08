import React from "react";

export default class ViewportCell extends React.Component {
  componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.type,
      className: nextProps.className,
      symbol: nextProps.symbol
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      className: this.props.className,
      symbol: this.props.symbol
    };
  }

  render() {
    let classNames = `${this.state.className} cell`;

    return <span className={classNames}>{this.state.symbol}</span>;
  }
}
