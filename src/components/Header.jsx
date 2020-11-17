import React from 'react';
import ProgressBar from './ProgressBar';
import PizzaCartIcon from './PizzaCartIcon';
import logo from '../resources/SliceLogo.png';

class Header extends React.Component {
  constructor(props){
    super(props)
    const locObj = this.props.appState.locObj;
    const order = this.props.appState.order;
    this.state = {
      locObj:locObj,
      order:order,
      set:false,
    }
  }
  componentDidMount(){    
    this.setState({set:this.state.order?true:false});
  }
  componentDidUpdate(prevProps){
    if(this.props.appState!==prevProps.appState){
      const locObj = this.props.appState.locObj;
      const order = this.props.appState.order;
      this.setState({locObj:locObj, order:order, set:order?true:false});
    }
  }
  render(){
    if(!this.state.set){return null}
    const updateAppState = this.props.updateAppState;
    const locObj = this.state.locObj;
    const cnt = this.state.order.PizzaCount;    
    const selectedStore = locObj.curStoreID;          
    const storeName = selectedStore!=='0'?locObj.curStoreInfo.name:'Please select a Store';
    const storeHours = selectedStore!=='0'?locObj.curStoreInfo.hours:'';
    const storeChange = selectedStore!=='0'?'Change Location':'';
      
    return (
      <header>
        <a href="/pizza-chatbot"><img src={logo} alt="Logo"></img>
        <h1>Slice</h1></a>
        <PizzaCartIcon cnt={cnt} />
        <div className="bannerHead">
          <div className="bannerName">{storeName}</div>
          <div className="bannerHours">{storeHours}</div>
          <div className="bannerChange" onClick={() => {return updateAppState({type:'change', values:''})}}>{storeChange}</div>
        </div>
        <ProgressBar/>                
      </header>
    );
  } 
}
export default Header;