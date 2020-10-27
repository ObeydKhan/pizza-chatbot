import React from 'react';
import '../css/App.css';
import DisplayMainArea from './DisplayMainArea';
import logo from '../resources/SliceLogo.png';
import Order from './OrderControl';

import StoreLoc from './StoreLoc';

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      showPage: 'Location',       
      locObj: this.props.locObj,      
      order: new Order(),
    };
    this.updateLoc = this.updateLoc.bind(this);
    this.setStore = this.setStore.bind(this);
    this.input = React.createRef();        
  }
  setStore(locObj){
    const page = 'Main';    
    const order = this.state.order.RestartOrder();
    this.setState({
      showPage: page,
      locObj: locObj,
      order: order,     
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
  resetOrder(){
    const locObj = this.state.locObj;
    const page = 'Location';
    const order = this.state.order.RestartOrder();
    this.setState({
      locObj:locObj,
      showPage: page,
      order: order,      
    })
  }
  cancelOrder(){
    const order = this.state.order.RestartOrder();
    this.setState({
      order: order,      
    });
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
  completeOrder(){

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
        set={this.setStore} update={this.updateLoc}/>      
      <DisplayMainArea appState={this.state} 
        reset={this.resetOrder} cancel={this.cancelOrder} complete={this.completeOrder}/>
      </div>
      </>     
    );
  }
}

export default App;
