let React = require('react');
let trianglify = require('trianglify');

module.exports = class GlyphiconGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  getDefaultProps() {
    return trianglify.defaults;
  }

  componentDidMount() {
    this.renderCanvas();
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps.cell_size);
    for(var key in nextProps) {
      if (this.props[key] !== nextProps[key]) {
        console.log('re-render triggered');
        return true;
      }
    }
    console.log('re-render not happening');
    return false;
  }

  componentDidUpdate() {
    this.renderCanvas();
  }

  onClick() { // For demonstration purposes
    this.renderCanvas();
  }

  renderCanvas() {
    let canvas = React.findDOMNode(this);
    trianglify(this.props).canvas(canvas);
  }

  render() {
    return <canvas onClick={this.onClick.bind(this)}/>;
  }
}