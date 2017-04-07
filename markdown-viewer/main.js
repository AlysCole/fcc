var MarkdownPreviewer = React.createClass({
  getInitialState: function() {
    return {text: "This is an h1 header.\n=====================\n\n# So is this! #\n\n## This, on the other hand, is a second-level header.\n\n### Shopping List:\n\n1. Potatoes\n2. Onions\n\n> Don't forget the spices!\n"};
  },
  handleMarkdownData: function(text) {
    this.setState({text: text.text})
  },
  render: function() {
    return (
      <div className="markdownPreviewer">
        <MarkdownEditor text={this.state.text} onUpdate={this.handleMarkdownData} />
        <MarkdownPreview text={this.state.text} />
      </div>
    );
  }
})

var MarkdownPreview = React.createClass({
  rawMarkup: function(text) {
    return { 
      __html: marked(text.toString(), {sanitize: true})
    };
  },
  render: function() {
    return (
      <div className="markdownPreview">
        <span dangerouslySetInnerHTML={this.rawMarkup(this.props.text)} />
      </div>
    );
  }
});

var MarkdownEditor = React.createClass({
  getInitialState: function() {
    return {text: this.props.text};
  },
  handleTextChange: function(e) {
    var text = {text: e.target.value};
    this.props.onUpdate(text);
    this.setState(text);
  },
  render: function() {
    return (
      <textarea
        placeholder="Insert your Markdown here."
        onChange={this.handleTextChange}
        className="markdownEditor"
        value={this.state.text}>
      </textarea>
    );
  }
});


ReactDOM.render(
  <MarkdownPreviewer />,
  document.getElementById('content')
);
