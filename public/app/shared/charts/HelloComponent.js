import React from 'react';

export default class HelloComponent extends React.Component {  
  render() {
    return <span>Hello2 {this.props.fname} {this.props.lname}</span>
  }
}

// Set the display name so ngReact can find your component
HelloComponent.displayName = 'HelloComponent';