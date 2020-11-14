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
     const arrowRight = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
     <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
    </svg>;                 
    const banner = this.StoreBanner;
    return (
      <div className="mainPageArea">
      <header>
        <a href="/pizza-chatbot"><img src={logo} alt="Logo"></img>
        <h1>Slice</h1></a>
        {banner}
        <div className="container">
        <div className="progress">
          <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <ul className="nav justify-content-center info">
          <li className="nav-item">
            <a className="nav-link active" href="/pizza-chatbot">Search for location</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link" onClick={()=> console.log('Hello!')}>Select location</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link" href="/slicebot">Order pizzas</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link disabled" href="/review">Review order</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link disabled" href="/summary">Payment 	&amp; Confirmation</a>
          </li>
        </ul>
        </div>
      </header>      
      <StoreLoc appState={this.state} 
        set={this.setStore} update={this.updateLoc} forwardedRef={this.input}/>      
      <DisplayMainArea appState={this.state} 
        reset={this.resetOrder} cancel={this.cancelOrder} complete={this.completeOrder}/>
      </div> 
    );
  }
}

export default App;
