import React from 'react';
import SimpleForm from './SimpleForm';

class DisplayMainArea extends React.Component {
    render() {
    const hidePage= !this.props.hidden;
    if (hidePage) {
      return null;
    } else {
    return (
      <>
      <div className="displayArea">
        <div className="menuSummary">
          <p>This area has the menu.</p>
          <p>Or the order summary.</p>
        </div>
      </div>
      <div className="container">        
        <SimpleForm />
      </div>
      </>
    );
    }
    }
  }
  export default DisplayMainArea;