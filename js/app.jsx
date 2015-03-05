require("babel/register");
let React = require('react');
let TrianglifyCanvas = require('./components/TrianglifyCanvas.jsx');
let Trianglify = require('trianglify');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Trianglify.defaults;
  }

  handleOptionChange(opt) {
    let newopt = {};

    return function(e) {
      newopt[opt] = e.target.value;
      this.setState(newopt);
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h1>Trianglify Docs, yo</h1>
          <div className="col-md-3">
            <p>variance: {this.state.variance}</p>
            <input type="range" min="0" max="1" step="0.01"
              value={this.state.variance}
              onChange={this.handleOptionChange('variance').bind(this)} />

            <p>cell_size: {this.state.cell_size}</p>
            <input type="range" min="10" max="200" step="10"
              value={this.state.cell_size}
              onChange={(e) => this.setState({cell_size: parseInt(e.target.value)})} />
          </div>
          <TrianglifyCanvas variance={this.state.variance} cell_size={this.state.cell_size} seed='foobar' />
        </div>
      </div>
    );
  }
}

React.render(<App />, document.body);