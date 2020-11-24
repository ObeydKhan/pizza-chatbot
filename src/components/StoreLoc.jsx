import React from 'react';
//import {Route,Redirect} from 'react-router-dom';
import GeoIcon from '../resources/GeoIcon.jsx';
import '../css/StoreLoc.css';

class StoreLoc extends React.Component {
  constructor(props){
    super(props);    
    const mode = this.props.locObj===undefined?'':this.props.locObj.searchStep
    this.state = {
      locMode:mode,           
    };
    this.updateLoc = this.updateLoc.bind(this);   
  }
  componentDidUpdate(prevProps){
    if(this.props.locObj!==prevProps.locObj){
      this.setState({     
        locMode:this.props.locObj.searchStep,              
      });
    }
  }
  updateLoc = (p)=>{
    const loc = this.props.locObj
    const values = {type:'loc', locObj:null};
    switch(p.type){
      case 'reset':
        loc.resetLoc();
        
        break;
      case 'search':
        const obj = {method: p.values,
          usrStr: p.values==='User Entry'?this.props.forwardedRef.current.value:''};
        loc.storeSearch = obj;
        break;
      case 'select':
        loc.storeLoc = p.values;
      break;
      default:
    }
    values.locObj = loc;
    values.type = loc.searchStep;
    this.setState({locMode:loc.searchStep}, ()=> {
      this.props.updateAppState({type:'location',values:{appValues:values}})
    });
  }  
  render(){    
    const show= (type)=>{
      switch(type){
        case 'search':
          return <StoreSearchMenu locObj={this.props.locObj} forwardedRef={this.props.forwardedRef} updateLoc={(p)=>{return this.updateLoc(p)}}/>
        case 'select':
          return (/*<><Redirect to="/pizza-chatbot/locations" /><Route path="/pizza-chatbot/locations" component={() =>*/ 
          <StoreSelectMenu locObj={this.props.locObj} updateLoc={(p)=>{return this.updateLoc(p)}}/>
          /*}}/></>*/)
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
        <MakeGeoDialog locObj={locObj} updateLoc={props.updateLoc}/>
        <MakeUserDialog locObj={locObj} updateLoc={props.updateLoc} forwardedRef={props.forwardedRef} />
      </div>
    </div>              
      <MakePrevDialog locObj={locObj} updateLoc={props.updateLoc}/>
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
  const ret = {type:'search', values:'Geo Locate'};
  return (
    <div className="geoSearchArea">
      <button className={clsStr} onClick={() => props.updateLoc(ret)}>
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
  const ret = {type:'search', values:'User Entry'};
  return (
    <>
    <div className="userSearchArea">
    <div className="userSearchLabel">Enter a Zip Code</div>
    <form className="searchForm" onKeyDown={(event, i) => {
      if(event.key === 'Enter') {
        props.updateLoc(ret); 
        event.preventDefault();}}}>
      <input className="userInputString" type="text" ref={props.forwardedRef}/>
      {capStr}
    </form>
      <button className="userSearchBtn" type="button" onClick={() => props.updateLoc(ret)}>
      Submit</button>
    </div>
    </>
  );
}
function MakePrevDialog(props) {
  const locObj = props.locObj;
  const prev = locObj.prevStoreID;              
  if (prev==='0'){
    return null;
  }
  const ret = {type:'select', values:prev};
  const storeInfo = locObj.curStoreInfo;    
  return(
    <>
    <div className="searchOrPrev">Or</div>
    <div className="prevLocBox">    
      <div className="prevLocBanner">Keep this location</div>        
      <div className="prevLocName">{storeInfo.name}</div>
      <div className="prevLocHours">{storeInfo.hours}</div>
      <button className="prevLocConfirm" onClick={() => props.updateLoc(ret)}>Select</button>
    </div>
    </>
  );
}
function StoreSelectMenu(props){
  const locObj = props.locObj;  
  const searchLoc = locObj.searchLoc;    
  const storeIDs = ['1','2','3'];
  const ret = {type:'reset', values:false};
  const storeList = storeIDs.map((storeID) => {
    const store = locObj.storeInfo(storeID);
    const sel = {type:'select', values:storeID};
    return (
      <li key={storeID} className="resultElement"> 
        <div className="store">
        <div className="storeAddress">{store.name}</div>
        <div className="storeDetails">Store is {store.hours}, and is located {store.dist} miles away</div>
        </div>
        <div>
        <button className="selectBtn" onClick={() => {
          props.updateLoc(sel)
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
      <div className="resultsChange" onClick={() => props.updateLoc(ret)}>Change Location</div>
      </div>
      <ul className="resultsList">
        {storeList}
      </ul>
    </div>
    </>
  );  
}
export default StoreLoc;