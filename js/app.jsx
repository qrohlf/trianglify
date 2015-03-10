require("babel/register");
let React = require('react');
let Hero = require('./components/Hero.jsx');

class App extends React.Component {
  render() {
    return (
      <Hero />
    );
  }
}

React.render(<App />, document.body);