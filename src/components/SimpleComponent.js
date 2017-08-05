import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import SimpleComponentD3 from './SimpleComponentD3';

class SimpleComponent extends Component {
  render() {
    return <div className="simple-component" ref={node => this.node = node}></div>;
  }

  /** When we mount, initialize our D3 component */
  componentDidMount() {
    this.simpleComponentD3 = new SimpleComponentD3(this.node, this.getProps());
  }

  /** When we update, update our D3 component */
  componentDidUpdate() {
    this.simpleComponentD3.update(this.node, this.getProps());
  }

  /** When we unmount, destroy our D3 component */
  componentWillUnmount() {
    this.simpleComponentD3.destroy(this.node);
  }

  /** Get the properties object to pass along to our D3 component */
  getProps() {
    return this.props;
  }
}

export default SimpleComponent;
