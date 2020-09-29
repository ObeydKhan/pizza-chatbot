import React from 'react';
import '../css/App.css';
import {DisplayStoreSelect, StoreDetails} from './DisplayStoreSelect';
import ShowSearchMenu from './ShowSearchMenu';
import DisplayMainArea from './DisplayMainArea';
import logo from '../resources/SliceLogo.png';
import ResolveLocation from './GeoLoc'
class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      searchedBy: '',
      searchedLocation: '',
      geoLococation: 'NoGeo',
      geoCity: '',
      geoState: '',      
      selectedStore: '0',
      previousStore: '0',
      showPage: 'Search', 
      geoIsChecked: false,
      hasError: false,
      errorMsg: '',
    };
    this.handleStoreSearch = this.handleStoreSearch.bind(this);
    this.handleStoreSelect = this.handleStoreSelect.bind(this);   
    this.updateLocation = this.updateLocation.bind(this);
    this.input = React.createRef();        
  }
  componentDidMount(){
    const geoIsChecked = this.state.geoIsChecked;    
    if(!geoIsChecked) {
      const results = ResolveLocation();      
      results.then(data => {
        this.setState({
          geoLococation: data.zipCode,
          geoIsChecked: data.isChecked,      
          geoCity: data.city,
          geoState: data.state,
        });
      });   
    }           
  }  
  handleStoreSearch(geoReturn) {
    const userEntLoc = this.input.current.value; 
    const geoRetLength = geoReturn.length;
    const userEntLength = userEntLoc.length;
    if(userEntLoc==='' && geoReturn==='') {
      console.log('Empty values');
      this.setState({
        hasError: true,
        errorMsg: "You must enter a US Zip Code"
      });
    } else if(geoRetLength>0) {
      console.log('Using Geo Info');
      this.setState({
        searchedBy: 'Geo Locate',
        searchedLocation: geoReturn,
        showPage: 'Select',
        hasError: false,
        errorMsg: '',
      });
    } else {         
      if(isNaN(userEntLoc) || userEntLength !== 5) {
        console.log('Invalid user input');
        this.setState({
          hasError: true,
          errorMsg: "You must enter a US Zip Code or use the Geo Location function"
        });
      } else {
        this.setState({
          searchedBy: 'User Entry',
          searchedLocation: userEntLoc,
          showPage: 'Select',
          hasError: false,
          errorMsg: '',
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
