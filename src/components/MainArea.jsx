import React from 'react';
import StoreLoc from './StoreLoc';
import pizzaImage from '../resources/pizza-main-area.jpg';

class MainArea extends React.Component{  
  render(){
    const dispComp = (type)=>{      
      switch(type){
        case 'Location':
          return <StoreLoc appState={this.props.appState} updateAppState={this.props.updateAppState} forwardedRef={this.props.forwardedRef}/>;
        case 'NonMenuStep':
          return <div>This step doesnt have a menu item</div>;
        case 'Main':
          return <div><img className="pizza-bgImg img-fluid" src={pizzaImage} alt="pizzaImage"/>Something to display while waiting for the user to enter their name</div>;
        case 'Final':
          return <div>The final order summary and confirmation goes here</div>;      
        case 'Menu':
          return <div><img className="pizza-bgImg img-fluid" src={pizzaImage} alt="pizzaImage" />Filtered menu displaying only relevant items</div>
        default:
          return <div>Default items?</div>
      }
    }
    const dis =this.props.appState.appValues===null?'Location':this.props.appState.appValues.appDisplay     
    return (dispComp(dis));
  }
}
export default MainArea;