import React from 'react';
import PizzaCartIcon from './PizzaCartIcon';
import logo from '../resources/SliceLogo.png';

class Header extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      locObj:null,
      order:null,
      set:false,
    }
  }
  componentDidMount(){
    const locObj = this.props.appState.locObj;
    const order = this.props.appState.order;
    this.setState({locObj:locObj, order:order, set:order?true:false});
  }
  render(){
    if(!this.state.set){return null}
    const onChange = this.props.onChange;
    const locObj = this.state.locObj;
    const cnt = this.state.order.PizzaCount;    
    const selectedStore = locObj.curStoreID;           
    const storeName = selectedStore!=='0'?locObj.curStoreInfo.name:'Please select a Store';
    const storeHours = selectedStore!=='0'?locObj.curStoreInfo.hours:'';
    const storeChange = selectedStore!=='0'?'Change Location':'';
    const arrowRight = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
   </svg>;  
    return (
      <header>
        <a href="/pizza-chatbot"><img src={logo} alt="Logo"></img>
        <h1>Slice</h1></a>
        <PizzaCartIcon cnt={cnt} />
        <div className="bannerHead">
          <div className="bannerName">{storeName}</div>
          <div className="bannerHours">{storeHours}</div>
          <div className="bannerChange" onClick={() => onChange({val:'Location'})}>{storeChange}</div>
        </div>
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
            <a className="nav-link" href="/pizza-chatbot" onClick={()=> console.log('Hello!')}>Select location</a>
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
    );
  } 
}
export default Header;