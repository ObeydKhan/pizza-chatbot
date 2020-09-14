import React from 'react';
import '../css/App.css';
import {DisplayStoreSelect, StoreDetails} from './DisplayStoreSelect';
import ShowSearchMenu from './ShowSearchMenu';
import DisplayMainArea from './DisplayMainArea';
import logo from '../resources/SliceLogo.png';

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
  updateLocation() {
    this.setState({
      userLocation: '',
      selectedStore: 0,
      isStoreSelected: false,
      showStoreSearch: true,
      showStoreSelect: false,
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
        <div className="bannerChange" onClick={() => this.updateLocation()}>change</div>

      </div>);
    }
    return (
      <>
      <div className="mainPageArea">
      <header>
        <img src={logo} alt="Logo"></img>
        <h1>Slice</h1>
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

export default App;
