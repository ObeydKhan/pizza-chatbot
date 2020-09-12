import React from 'react';
//import ReactDOM from 'react-dom';
import '../css/App.css';
import SimpleForm from './SimpleForm';
import logo from './pizzaLogo100.png';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: '',
      selectedStore: 0,
      isStoreSelected: false,
      showStoreSearch: true,
      showStoreSelect: false,
      showMainPage: false,
    };
    this.handleStoreSearch = this.handleStoreSearch.bind(this);
    this.handleStoreSelect = this.handleStoreSelect.bind(this);     
    this.input = React.createRef();  
  }
  handleStoreSearch() {
    let userLoc = this.input.current.value;
    this.setState({
      userLocation: userLoc,
      showStoreSearch: false,
      showStoreSelect: true,
      showMainPage: false,
    });    
  }
  handleStoreSelect(i) {
    this.setState({
      selectedStore: i,
      isStoreSelected: true,
      showStoreSearch: false,
      showStoreSelect: false,
      showMainPage: true,
    });
  }
  
  render(){
    const showSearch = this.state.showStoreSearch;
    const showSelect = this.state.showStoreSelect;
    const showMain = this.state.showMainPage;
    const isSelected = this.state.isStoreSelected;
    let banner = null;
    if (isSelected){
      const storeID = ''+this.state.selectedStore;
      const storeInfo = StoreDetails(storeID);      
      banner = (<div className="bannerHead">
        <div className="bannerName">{storeInfo.name}</div>
        <div className="bannerHours">{storeInfo.hours}</div>
      </div>);
    }
    return (
      <>
      <div className="mainPageArea">
      <header>
        <img src={logo} alt="Logo"></img>
        Slice: The best pizza that never was!
        {banner}
      </header>
      <ShowSearchMenu show={showSearch} refIn={this.input} onClick={this.handleStoreSearch} />
      <DisplayStoreSelect userLocation={this.state.userLocation} show={showSelect} onClick={this.handleStoreSelect}/>
      <DisplayMainArea hidden={showMain} />
      </div>
      </>
      
    );
  }
}
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
class ShowSearchMenu extends React.Component {
  render(){
  const show = this.props.show;
  
  if (show){
    return (
      <>
      <div className="searchMenu">
        <div className="searchLabel">Find a store near you:</div>
        <form >
          <input className="inputString" type="text" ref={this.props.refIn} />          
        </form>
        <button className="searchBtn" onClick={() => this.props.onClick()}>Submit</button>
      </div>
      </>
    );
  } else {
    return null;
  }
}
}
class DisplayStoreSelect extends React.Component {
  render() {
    
    const show = this.props.show;
    if (show) {
      return (
      <>
      <div className="storeSelect">
        <h2>Results</h2>
        <h4>Showing results near {this.props.userLocation}</h4>
        <ul className="resultsList">
          <StoreResultsList onClick={(i) => this.props.onClick(i)} />
        </ul>
      </div>
      </>
      );
    } else {
      return null;
    }
    
  }
}
function StoreResultsList(props) {
  const storeIDs = ['1','2','3'];
  const storeList = storeIDs.map((storeID) => {
    const storeInfo = StoreDetails(storeID);   
    return (
        <li key={storeID} className="resultElement"> 
          <div className="store">
          <div className="storeAddress">{storeInfo.name}</div>
          <div className="storeDetails">Store is {storeInfo.hours}, and is located {storeInfo.dist} miles away</div>
          </div>
          <div>
            <button className="selectBtn" onClick={() => {
            return props.onClick(storeID);
          }}>Select</button> 
          </div>
        </li> 
      );
    }
  );
  return storeList;
}
function StoreDetails(storeID) {
  //const storeID = props.storeID;
  //let storeInfo;
  
  switch (storeID){
    case '1':
      return {name: 'Main Street', hours: 'Open 8am-8pm', dist: '1.2'};
      //break;
    case '2':
      return {name: 'Long Street', hours: 'Open 11am-9pm', dist:'3.6'};
      //break;
    case '3':
      return {name: 'Main Street', hours: 'Open 11am-11pm', dist:'4.1'};
      //break;
    default:
          
  }
  
  return null;
}
export default App;
