import React from 'react';
import StoreLoc from './StoreLoc';
import pizzaImage from '../resources/pizza-main-area.jpg';
import ConfirmationPage from './ConfirmationPage';
import '../css/DisplayMainArea.css';

class MainArea extends React.Component{  
    
  render(){
    const {showPage, ...passThroughProps} = this.props;
    const dispComp = (type)=>{      
      switch(type){
        case 'Location':
          return <StoreLoc {...passThroughProps}/>;
        case 'NonMenuStep':
          return <div className="bgImage-container"><img className="pizza-bgImg img-fluid" src={pizzaImage} alt="pizzaImage"/></div>;
        case 'Main':
          return <div className="bgImage-container"><img className="pizza-bgImg img-fluid" src={pizzaImage} alt="pizzaImage"/></div>;
        case 'Final':
          return <ConfirmationPage {...passThroughProps}/>;      
        case 'Menu':
          return <div className="bgImage-container"><img className="pizza-bgImg img-fluid" src={pizzaImage} alt="pizzaImage" /></div>
        default:
          return <div className="bgImage-container"><img className="pizza-bgImg img-fluid" src={pizzaImage} alt="pizzaImage"/></div>
      }
    }
    const dis =showPage===null?'Location':showPage;     
    return (dispComp(dis));
  }
}
export default MainArea;