import React from 'react';
import ProgressBar from './AppElements/Util/ProgressBar';
import PizzaCartIcon from './AppElements/Util/PizzaCartIcon';
import logo from '../resources/SliceLogo.png';

class Header extends React.Component {  
  render(){    
    const updateAppState = this.props.updateAppState;
    const locObj = this.props.locObj;
    const cnt = this.props.cnt;              
    const storeName = locObj.curStoreInfo.name;
    const storeHours = locObj.curStoreInfo.hours;
    const storeChange = 'Change Location';
      
    return (
      <header>
        <a href="/pizza-chatbot"><img src={logo} alt="Logo"></img>
        <h1>Slice</h1></a>
        <PizzaCartIcon cnt={cnt} />
        <div className="bannerHead">
          <div className="bannerName">{storeName}</div>
          <div className="bannerHours">{storeHours}</div>
          <div className="bannerChange" onClick={() => {return updateAppState({type:'location', values:{type:'change'}})}}>{storeChange}</div>
        </div>
        <ProgressBar/>                
      </header>
    );
  } 
}
export default Header;