let React = require('react');

module.exports = class ButtonGroupSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick(e) {
    this.props.onChange(e);
  }

  render() {

    var createButton = function(item) {
      return (
        <button
        key={item}
        value={item}
        className={item === this.props.selected ? 'btn btn-active' : 'btn btn-default'}>
        {item}
        </button>
      )
      ;
    }

    return <div className="btn-group" onClick={this.onClick.bind(this)}>{this.props.options.map(createButton.bind(this))}</div>
  }
}