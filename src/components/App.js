import React from 'react';
import '../css/App.css';
import DisplayMainArea from './DisplayMainArea';
import logo from '../resources/SliceLogo.png';
import Order from './PizzaOrder';

import StoreLoc from './StoreLoc';

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.updateLoc = this.updateLoc.bind(this);
    this.setStore = this.setStore.bind(this);
    this.mainPage = this.mainPage.bind(this);    
    this.state = {
      showPage: 'Location',       
      locObj: this.props.locObj,      
      order: new Order('new'),
    };
    this.input = React.createRef();        
  }
  setStore(locObj){
    const page = 'Main';    
    this.setState({
      showPage: page,
      locObj: locObj,           
    });    
  }
  updateLoc(props){
    const locObj = props.locObj;
    const page = props.page;    
    this.setState({
      locObj:locObj,
      showPage: page,             
    });
  }
  mainPage(){

  }
  cancelOrder(){

  }
  completeOrder(){

  }
  get StoreBanner(){
    const {locObj} = this.state;
    const selectedStore = locObj.curStoreID;
    if(selectedStore==='0'){ return null;}          
    const storeInfo = locObj.curStoreInfo;
    const banner = (
      <div className="bannerHead">
        <div className="bannerName">{storeInfo.name}</div>
        <div className="bannerHours">{storeInfo.hours}</div>
        <div className="bannerChange" onClick={() => this.updateLoc('Search')}>Change Location</div>
      </div>
    );
    return banner;
  }
  render(){                 
    const banner = this.StoreBanner;
    return (
      <>
      <div className="mainPageArea">
      <header>
        <img src={logo} alt="Logo" onClick={() => this.resetOrder()}></img>
        <h1>Slice</h1>
        {banner}
      </header>      
      <StoreLoc appState={this.state} 
        set={this.setStore} update={this.updateLoc} forwardedRef={this.input}/>      
      <DisplayMainArea appState={this.state} 
        reset={this.resetOrder} cancel={this.cancelOrder} complete={this.completeOrder}/>
      </div>
      </>     
    );
  }
}

export default App;
