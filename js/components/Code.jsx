let React = require('react');
let hljs = require('highlight.js');

module.exports = class Code extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    let innerHTML = {__html: hljs.highlight(this.props.lang, this.props.contents).value};
    return (
      <pre>
        <code className={'language-'+this.props.lang}
        dangerouslySetInnerHTML={innerHTML} />
      </pre>
    );
  }
}