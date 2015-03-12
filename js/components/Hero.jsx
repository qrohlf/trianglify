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
    this.state.color_set = 'YlGnBu';
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

  render() {
    return (
      <div className="component-hero">
        <div className="masthead">
          <TrianglifyCanvas
            height={this.state.height * 0.85}
            width={this.state.width}
            variance={this.state.variance}
            cell_size={this.state.cell_size}
            color_space={this.state.color_space}
            stroke_width={this.state.stroke_width}
            x_colors={Trianglify.colorbrewer[this.state.color_set]} //Hacked RdBu: ["#67001f","#b2182b","#d6604d","#EEC2B0","#92c5de","#4393c3","#2166ac","#053061"]
            y_colors='match_x'
            seed='qux'/>

          <div className="content">
            <h1>Trianglify</h1>
            <h2>A javascript library for generating colorful triangle art</h2>
            <p>
              <a className="fancybutton" href="https://github.com/qrohlf/trianglify"><span className='icon-github'></span> star</a>
              <a className="fancybutton" href="https://twitter.com/qrohlf"><span className='icon-twitter3'></span> follow</a>
            </p>
          </div>
        </div>

        <div className="controls container">
          <div className="row">
            <div className="col-md-3 text-center">
              <h3>Variance</h3>
              <input type="range" min="0" max="1" step="0.01"
                value={this.state.variance}
                onChange={(e) => this.setState({variance: e.target.value})} />
              <p className="text-muted">{this.state.variance}</p>
            </div>
            <div className="col-md-3 text-center">
              <h3>Cell Size</h3>
              <input type="range" min="10" max="200" step="10"
                value={this.state.cell_size}
                onChange={(e) => this.setState({cell_size: parseInt(e.target.value)})} />
              <p className="text-muted">{this.state.cell_size}</p>
            </div>
            <div className="col-md-3 text-center">
              <h3>Color Space</h3>
              <ButtonGroupSelect selected={this.state.color_space}
                options={['rgb', 'lab', 'hsl', 'hsv']}
                onChange={(e) => this.setState({color_space: e.target.value})}/>
            </div>
            <div className="col-md-3 text-center">
              <h3>Color Palette</h3>
              <select className='form-control' value={this.state.color_set}
                onChange={(e) => this.setState({color_set: e.target.value})}>
                {Object.keys(Trianglify.colorbrewer).map( (colors)=> <option key={colors} value={colors}>{colors}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}