let React = require('react');
let Trianglify = require('trianglify');

let TrianglifyCanvas = require('./TrianglifyCanvas.jsx');
let ButtonGroupSelect = require('./ButtonGroupSelect.jsx');

module.exports = class Hero extends React.Component {
  constructor(props) {
    super(props);
    this.state = Trianglify.defaults;
    this.state.height = window.innerHeight;
    this.state.width = window.innerWidth;
    this.state.color_set = 'RdBu';
  }

  handleResize(e) {
    this.setState({width: window.innerWidth});
    this.setState({height: window.innerHeight});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  render() {
    return (
      <div className="component-hero">
        <div className="masthead">
          <TrianglifyCanvas
            height={this.state.height * 0.7}
            width={this.state.width}
            variance={this.state.variance}
            cell_size={this.state.cell_size}
            color_space={this.state.color_space}
            stroke_width={this.state.stroke_width}
            x_colors={Trianglify.colorbrewer[this.state.color_set]}
            y_colors='match_x'
            seed='qux'/>

          <div className="content">
            <h1>Trianglify</h1>
            <h2>A javascript library for generating colorful triangle art</h2>
          </div>
        </div>

        <div className="container">
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
                options={['lab', 'rgb', 'hsl', 'hsv']}
                onChange={(e) => this.setState({color_space: e.target.value})}/>
            </div>
            <div className="col-md-3 text-center">
              <h3>Color Palette</h3>
              <select className='form-control' value={this.state.color_set}
                onChange={(e) => this.setState({color_set: e.target.value})}>
                {Object.keys(Trianglify.colorbrewer).map( (colors)=> <option value={colors}>{colors}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}