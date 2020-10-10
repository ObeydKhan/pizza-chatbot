import React from 'react';
import '../css/App.css';
import {DisplayStoreSelect, StoreDetails} from './DisplayStoreSelect';
import ShowSearchMenu from './ShowSearchMenu';
import DisplayMainArea from './DisplayMainArea';
import logo from '../resources/SliceLogo.png';
/*import ResolveLocation from './GeoLoc';*/

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      searchedBy: '',
      searchedLocation: '',          
      selectedStore: '0',
      previousStore: '0',
      showPage: 'Search', 
      hasError: false,
      errorMsg: '',
      userLoc: this.props.userLocObj,
    };
    this.handleStoreSearch = this.handleStoreSearch.bind(this);
    this.handleStoreSelect = this.handleStoreSelect.bind(this);   
    this.updateLocation = this.updateLocation.bind(this);
    this.input = React.createRef();        
  }
   
  handleStoreSearch(geoReturn) {
    const userEntered = this.input.current.value; 
    const geoRetLength = geoReturn.length;  
    const userLoc = this.state.userLoc;
    if(userEntered==='' && geoReturn==='') {
      console.log('Empty values');
      this.setState({
        hasError: true,
        errorMsg: "You must enter a US Zip Code"
      });
    } else if(geoRetLength>4) {
      this.setState({
        searchedBy: 'Geo Locate',
        searchedLocation: geoReturn,
        showPage: 'Select',
        hasError: false,
        errorMsg: '',
      });
    } else {         
      userLoc.userEntry = userEntered;
      const locString = userLoc.userString;
      if(userLoc.userEntry){
        this.setState({
          searchedBy: 'User Entry',
          searchedLocation: locString,
          showPage: 'Select',
          hasError: false,
          errorMsg: '',
        });
      } else {
        this.setState({
          hasError: true,
          errorMsg: "You must enter a US Zip Code"
        });
      }
    }           
  }
  updateLocation() {
    const prevStore = this.state.selectedStore;
    this.setState({
      searchedBy: '',      
      selectedStore: '0',
      previousStore: prevStore,
      showPage: 'Search',
      hasError: false,
      errorMsg: '',
    });
  }
  handleStoreSelect(i) {
    const prevStore = this.state.selectedStore;
    this.setState({
      selectedStore: i,
      previousStore: prevStore,
      showPage: 'Main',
    });
  }
  render(){
    const {selectedStore} = this.state;          
    let banner = null;       
    if (selectedStore!=='0'){
      const storeInfo = StoreDetails(selectedStore);      
      banner = (
        <div className="bannerHead">
          <div className="bannerName">{storeInfo.name}</div>
          <div className="bannerHours">{storeInfo.hours}</div>
          <div className="bannerChange" onClick={() => this.updateLocation()}>Change Location</div>
        </div>
      );
    }
    return (
      <>
      <div className="mainPageArea">
      <header>
        <img src={logo} alt="Logo" onClick={() => this.updateLocation()}></img>
        <h1>Slice</h1>
        {banner}
      </header>      
      <ShowSearchMenu data={this.state} refIn={this.input} confirmLocation={this.handleStoreSelect} onClick={this.handleStoreSearch}/>
      <DisplayStoreSelect data={this.state} updateLocation={this.updateLocation} onClick={this.handleStoreSelect}/>
      <DisplayMainArea data={this.state} />
      </div>
      </>     
    );
  }
}
export default App;
