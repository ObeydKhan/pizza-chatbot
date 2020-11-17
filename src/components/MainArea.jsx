import React from 'react';
import StoreLoc from './StoreLoc';


class MainArea extends React.Component{  
  render(){
    const dispComp = (type)=>{      
      switch(type){
        case 'Location':
          return <StoreLoc appState={this.props.appState} onTriggerLoc={this.props.onTriggerLoc} forwardedRef={this.props.forwardedRef}/>;
        case 'NonMenuStep':
          return <div>This step doesnt have a menu item</div>;
        case 'Main':
          return <div>Something to display while waiting for the user to enter their name</div>;
        case 'Final':
          return <div>The final order summary and confirmation goes here</div>;      
        case 'Menu':
          return <div>Filtered menu displaying only relevant items</div>
        default:
          return <div>Default items?</div>
      }
    }
    const dis =this.props.appState.appValues===null?'Location':this.props.appState.appValues.appDisplay     
    return (dispComp(dis));
  }
}
export default MainArea;