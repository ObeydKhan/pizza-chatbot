import React from 'react';
import {Route,Redirect} from 'react-router-dom';
import GeoIcon from '../resources/GeoIcon.jsx';
import '../css/StoreLoc.css';

class StoreLoc extends React.Component {
  constructor(props){
    super(props);    
    this.state = {
      locMode:this.props.appState.locObj.searchStep,
      locObj:this.props.appState.locObj,     
    };
    this.storeSearch = this.storeSearch.bind(this);    
    this.storeSelect = this.storeSelect.bind(this);
    this.resetSearch = this.resetSearch.bind(this);    
  }
  componentDidUpdate(prevProps){
    if(this.props.appState!==prevProps.appState){
      this.setState({     
        locMode:this.props.appState.locObj.searchStep,
        locObj:this.props.appState.locObj,      
      });
    }
  }
  resetSearch(){
    const loc =this.props.appState.locObj;
    loc.resetLoc();
    this.props.onTriggerLoc(loc);
    this.setState({     
      locMode:loc.searchStep,
      locObj:loc,     
    });
  }
  storeSearch(searchObj){    
    const loc = this.state.locObj;        
    const obj = {
      method: searchObj,
      usrStr: searchObj==='User Entry'?this.props.forwardedRef.current.value:'',
    };
    loc.storeSearch = obj;
    this.props.onTriggerLoc(loc);
    this.setState({     
      locMode:loc.searchStep,
      locObj:loc,     
    });
  }
  storeSelect(selectObj){    
    const loc = this.state.locObj;
    loc.storeLoc = selectObj;
    this.props.onTriggerLoc(loc);
    this.setState({     
      locMode:loc.searchStep,
      locObj:loc,     
    }); 
  }  
  render(){    
    const show= (type)=>{
      switch(type){
        case 'search':
          return <StoreSearchMenu locObj={this.state.locObj} forwardedRef={this.props.forwardedRef} search={this.storeSearch} select={this.storeSelect}/>
        case 'select':
          return <><Redirect to="/pizza-chatbot/locations" /><Route path="/pizza-chatbot/locations" component={() => <StoreSelectMenu locObj={this.state.locObj} reset={this.resetSearch} select={this.storeSelect}/>}/></>
        default:
          return null;
      }
    }    
    return(
      <>{show(this.state.locMode)}</>
    )
  }
}

function StoreSearchMenu(props) {
  const locObj = props.locObj;
  return (
    <>
    <div className="searchPage">
    <div className="searchGreeting">Find your Slice</div>
    <div className="srchGrtCaption">Available Menu Items, Special Offers, and Pricing can vary by location.</div>
    <div className="searchContentWrapper">
    <div className="searchBox">
      <div className="searchBoxBanner">Find Locations</div>
      <div className="searchOptions">
        <MakeGeoDialog locObj={locObj} search={props.search}/>
        <MakeUserDialog locObj={locObj} search={props.search} forwardedRef={props.forwardedRef} />
      </div>
    </div>              
      <MakePrevDialog locObj={locObj} select={props.select}/>
    </div>
    </div> 
    </>
  );
}
function MakeGeoDialog(props) {
  const locObj = props.locObj;
  const hasErr = locObj.geoErr;
  const capStr = hasErr?locObj.geoErrMsg:'Locations near ' + locObj.geoZip;    
  const clsStr = hasErr?"geoSearchFail": "geoSearchBtn";  
  return (
    <div className="geoSearchArea">
      <button className={clsStr} onClick={() => props.search('Geo Locate')}>
        <GeoIcon fill="#000000" className="geoSearchIcon"/>
        <div className="geoSearchBtnCapt">{capStr}</div>
      </button>
    </div>
  );
}
function MakeUserDialog(props) {
  const locObj = props.locObj;
  const hasErr = locObj.userErr;
  const capStr = hasErr?locObj.userErrMsg:null;    
  return (
    <>
    <div className="userSearchArea">
    <div className="userSearchLabel">Enter a Zip Code</div>
    <form className="searchForm" onKeyDown={(event, i) => {
      if(event.key === 'Enter') {
        event.preventDefault();
        props.search('User Entry');
        }}}>
      <input className="userInputString" type="text" ref={props.forwardedRef}/>
      {capStr}
    </form>
      <button className="userSearchBtn" type="button" onClick={() => props.search('User Entry')}>
      Submit</button>
    </div>
    </>
  );
}
function MakePrevDialog(props) {
  const locObj = props.locObj;
  const cur = locObj.curStoreID;              
  if (cur==='0'){
    return null;
  }
  const storeInfo = locObj.curStoreInfo;    
  return(
    <>
    <div className="searchOrPrev">Or</div>
    <div className="prevLocBox">    
      <div className="prevLocBanner">Keep this location</div>        
      <div className="prevLocName">{storeInfo.name}</div>
      <div className="prevLocHours">{storeInfo.hours}</div>
      <button className="prevLocConfirm" onClick={() => props.select(cur)}>Select</button>
    </div>
    </>
  );
}
function StoreSelectMenu(props){
  const locObj = props.locObj;  
  const searchLoc = locObj.searchLoc;    
  const storeIDs = ['1','2','3'];
  const storeList = storeIDs.map((storeID) => {
    const store = locObj.storeInfo(storeID);
    return (
      <li key={storeID} className="resultElement"> 
        <div className="store">
        <div className="storeAddress">{store.name}</div>
        <div className="storeDetails">Store is {store.hours}, and is located {store.dist} miles away</div>
        </div>
        <div>
        <button className="selectBtn" onClick={() => {
          props.select(storeID)
          }}>Select</button> 
        </div>
      </li> 
      );
    });
  return (
    <>
    <div className="storeSelect">
    <div className="storeSelectBanner">
      <h2>Results</h2>
      <div className="resultsCapt">Showing results near: {searchLoc}</div>
      <div className="resultsChange" onClick={() => props.reset()}>Change Location</div>
      </div>
      <ul className="resultsList">
        {storeList}
      </ul>
    </div>
    </>
  );  
}
export default StoreLoc;