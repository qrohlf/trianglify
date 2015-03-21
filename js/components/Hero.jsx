// let React = require('react');
let React = require('react/addons');
let Trianglify = require('trianglify');

let TrianglifyCanvas = require('./TrianglifyCanvas.jsx');
let ButtonGroupSelect = require('./ButtonGroupSelect.jsx');

module.exports = class Hero extends React.Component {
  constructor(props) {
    super(props);
    this.state = React.addons.update(Trianglify.defaults, {}); // Copy Trianglify.defaults instead of referencing it. Prevents heisenbugs
    this.state.height = window.innerHeight;
    this.state.width = window.innerWidth;
    this.state.x_colors = 'RdYlGn';
    this.state.resize_timer = null;
    this.state.cell_size = 100;
  }

  debounceResize() {
    clearTimeout(this.state.resize_timer);
    this.setState({resize_timer: setTimeout(this.handleResize.bind(this), 100)});
  }

  handleResize(e) {
    console.log('resize event!');
    this.setState({width: window.innerWidth});
    this.setState({height: window.innerHeight});
  }

  componentDidMount() {
    window.addEventListener('resize', this.debounceResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceResize.bind(this));
  }

  randomize() {
    this.setState({variance: rand()});
    this.setState({cell_size: 25+rand()*500});
    this.setState({x_colors: 'random'});
  }

  render() {
    return (
      <div className='component-hero'>
        <TrianglifyCanvas
          height={this.state.height + 10}
          width={this.state.width + 10}
          x_colors={this.state.x_colors}
          variance={this.state.variance}/>
        <div className="content">
          <h1><a onClick={this.randomize.bind(this)}>Trianglify</a></h1>
          <p>algorithmically generated triangle art</p>
          <p>
            <a className="fancybutton" href="https://github.com/qrohlf/trianglify"><span className='icon-github'></span> star</a>
            <a className="fancybutton" href="https://twitter.com/qrohlf"><span className='icon-twitter3'></span> follow</a>
          </p>
        </div>
        <a className="arrow-down" href="#gettingstarted"></a>
      </div>
    );
  }
}