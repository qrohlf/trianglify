require("babel/register");
let React = require('react');
let GlyphiconGrid = require('./components/GlyphiconGrid.jsx')

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  click() {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div className="container">
        <h1>Hello, world</h1>
        <p>This is a ReactJS enabled app skeleton</p>
        <p>
          <button className="btn btn-primary" onClick={this.click.bind(this)}>Click Me</button>
        </p>
        <p>You have clicked the button {this.state.count} times.</p>
        <GlyphiconGrid />
      </div>
    );
  }
}

React.render(<App />, document.body);

console.log("hello, world")