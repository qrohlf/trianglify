let React = require('react');
var marked = require('marked');

module.exports = class Code extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    // console.log(this.props.children);
    // let innerHTML = {__html: hljs.highlight(this.props.lang, this.props.contents).value};
    let innerHTML = {__html: marked(this.props.children)};
    return (
      <div className="component-markdowncontent"
        dangerouslySetInnerHTML={innerHTML} />
    );
  }
}