let React = require('react');
let trianglify = require('trianglify');

module.exports = class GlyphiconGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderCanvas();
  }

  componentDidUpdate() {
    this.renderCanvas();
  }

  renderCanvas() {
    let canvas = React.findDOMNode(this);
    trianglify(this.props.options).canvas(canvas);
  }

  render() {
    return <canvas height={this.props.height} width={this.props.width} />;
  }
}