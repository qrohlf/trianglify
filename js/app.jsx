require("babel/register");
let React = require('react');
let Trianglify = require('./components/TrianglifyCanvas.jsx')

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  render() {
    return (
      <div>
        <h1>Trianglify Docs, yo</h1>
        <Trianglify />
      </div>
    );
  }
}

React.render(<App />, document.body);