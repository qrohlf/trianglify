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
    this.state.seed = Math.random();
  }

  debounceResize() {
    clearTimeout(this.state.resize_timer);
    this.setState({resize_timer: setTimeout(this.handleResize.bind(this), 100)});
  }

  handleResize(e) {
    this.setState({width: window.innerWidth});
    this.setState({height: React.findDOMNode(this).offsetHeight});

  }

  componentDidMount() {
    window.addEventListener('resize', this.debounceResize.bind(this));
    this.setState({height: React.findDOMNode(this).offsetHeight});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceResize.bind(this));
  }

  randomize() {
    this.setState({
      variance: Math.random(),
      cell_size: this.state.width/50 + Math.random()*100,
      x_colors: 'random',
      seed: Math.random()});
  }

  render() {
    console.log(this.state.cell_size);
    return (
      <div className='component-hero'>
        <TrianglifyCanvas
          height={this.state.height + 10}
          width={this.state.width + 10}
          x_colors={this.state.x_colors}
          variance={this.state.variance}
          cell_size={this.state.cell_size}
          seed={this.state.seed}/>
        <div className="content">
          <h1>Trianglify</h1>
          <p>algorithmically generated triangle art</p>
          <p>
            <a className="fancybutton" onClick={this.randomize.bind(this)}><span className='icon icon-spinner11'></span> generate</a>
            <a className="fancybutton" href="https://github.com/qrohlf/trianglify"><span className='icon icon-github'></span> star</a>
            <a className="fancybutton" href="https://twitter.com/qrohlf"><span className='icon icon-twitter3'></span> follow</a>
          </p>
        </div>
        <a className="arrow-down" href="#gettingstarted"></a>
      </div>
    );
  }
}