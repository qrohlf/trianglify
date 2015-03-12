let React = require('react');
let Trianglify = require('trianglify');

let TrianglifyCanvas = require('./TrianglifyCanvas.jsx');
let Code = require('./Code.jsx');
let ButtonGroupSelect = require('./ButtonGroupSelect.jsx');

module.exports = class TrianglifyOptionDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = React.addons.update(Trianglify.defaults, {}); // Copy Trianglify.defaults instead of referencing it. Prevents heisenbugs
    this.state.width = 800;
    this.state.x_colors = 'random';
    this.state.y_colors = 'match_x';
    this.state.seed = Math.random().toString(36).substr(2, 5);
    if(props.demo === 'palette') {
      this.state.palette = [['crimson', 'gold', 'indigo'], ['dodgerblue', 'white', 'chartreuse'], ['navy', 'aqua']];
    }
    if(props.demo === 'color_function') {
      this.state.color_function = function(x, y) {
        return 'hsl('+Math.floor(Math.abs(x*y)*360)+',80%,60%)';
      }
    }
  }

  // Return the appropriate input for what we're demoing
  getInput() {
    return {
      cell_size: <input type="range" min="10" max="200" step="10"
          value={this.state.cell_size}
          onChange={(e) => this.setState({cell_size: parseInt(e.target.value)})} />,
      variance: <input type="range" min="0" max="1" step="0.01"
                value={this.state.variance}
                onChange={(e) => this.setState({variance: e.target.value})} />,
      palette: <button className='btn btn-default' style={{margin: '12px 0'}} onClick={()=> this.setState({seed: Math.random().toString(36).substr(2, 5)})}>Randomize</button>,
      color_space: <ButtonGroupSelect style={{margin: '12px 0'}} selected={this.state.color_space}
                options={['rgb', 'lab', 'hsl', 'hsv']}
                onChange={(e) => this.setState({color_space: e.target.value})}/>
    }[this.props.demo];
  }

  render() {
    let optionString = `Trianglify({${this.props.demo}: ${JSON.stringify(this.state[this.props.demo]) || this.state[this.props.demo].toString()}, seed: '${this.state.seed}', x_colors: 'random'}).canvas()`;
    return (
      <div className="component-options-demo">
        <TrianglifyCanvas {...this.state}/>
        {this.getInput()}
        <Code lang="javascript" contents={optionString} />
      </div>
    );
  }
}