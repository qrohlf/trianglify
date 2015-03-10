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
    console.log(nextProps.stroke_width);
    for(var key in nextProps) {
      if (this.props[key] !== nextProps[key]) {
        return true;
      }
    }
    return false;
  }

  componentDidUpdate() {
    this.renderCanvas();
  }

  renderCanvas() {
    let canvas = React.findDOMNode(this);
    trianglify(this.props).canvas(canvas);
  }

  render() {
    return <canvas />;
  }
}