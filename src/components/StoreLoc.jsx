import React from 'react';
import GeoIcon from '../resources/GeoIcon.jsx';
import '../css/StoreLoc.css';


class StoreLoc extends React.Component {
  constructor(props){
    super(props);    
    this.state = {
      isSearch:true,
      isSelect:false,
      searchMeth: '',
      searchLoc: '',      
    };
    this.storeSearch = this.storeSearch.bind(this);    
    this.storeSelect = this.storeSelect.bind(this);
    this.resetSearch = this.resetSearch.bind(this); 
    
  }
  buildSearchMenu(locObj, forwardedRef){
    const showSearch = this.state.isSearch;
    if(showSearch){
      return <StoreSearchMenu locObj={locObj} forwardedRef={forwardedRef} search={this.storeSearch} select={this.storeSelect}/>
    }
    return null;
  }
  resetSearch(locObj){
    const updateProps={      
      locObj:locObj,
      page:'Location',
      resetSearch: true,
    };
    this.props.update(updateProps);
  }
  storeSearch(searchObj){    
    const locObj = searchObj.locObj;
    const method = searchObj.method;
    
    const obj = {
      method: method,
      usrStr: method==='User Entry'?this.props.forwardedRef.current.value:'',
    };
    locObj.storeSearch = obj;
    this.setState({     
      isSearch: locObj.searchErr,
      isSelect: !locObj.searchErr,
      searchMeth: locObj.searchMeth,
      searchLoc: locObj.searchLoc,      
    });
    const updateProps={
      locObj: locObj,
      page:'Location'
    };
    this.props.update(updateProps);
  }
  buildStoreSelectMenu(locObj){
    const showSelect = this.state.isSelect;
    if(showSelect){
      return <StoreSelectMenu locObj={locObj} reset={this.resetSearch} select={this.storeSelect}/>
    }
    return null;
  }
  storeSelect(selectObj){
    const locObj = selectObj.locObj;
    const selLoc = selectObj.selLoc;    
    locObj.storeLoc = selLoc;    
    this.setState({
      isSearch: false,
      isSelect: false,     
    });    
    this.props.set(locObj); 
  }  
  render(){    
    const {locObj, showPage} = this.props.appState;
    const show= showPage==='Location'?true:false;   
    const {forwardedRef}=this.props;
    return(
      <>
      {show && this.buildSearchMenu(locObj, forwardedRef)}
      {show && this.buildStoreSelectMenu(locObj)}
      </>
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
  const searchObj = {
    method: 'Geo Locate',
    locObj: locObj,
  };   
  return (
    <div className="geoSearchArea">
      <button className={clsStr} onClick={() => props.search(searchObj)}>
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
  const searchObj = {
    method: 'User Entry',
    locObj: locObj,
    ref: props.forwardedRef,
  };    
  return (
    <>
    <div className="userSearchArea">
    <div className="userSearchLabel">Enter a Zip Code</div>
    <form className="searchForm" onKeyDown={(event, i) => {
      if(event.key === 'Enter') {
        this.storeSearch(searchObj); 
        event.preventDefault();}}}>
      <input className="userInputString" type="text" ref={props.forwardedRef}/>
      {capStr}
    </form>
      <button className="userSearchBtn" type="button" onClick={() => props.search(searchObj)}>
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
    const ret = {
      locObj: locObj,
      selLoc: storeID,
    };
    return (
      <li key={storeID} className="resultElement"> 
        <div className="store">
        <div className="storeAddress">{store.name}</div>
        <div className="storeDetails">Store is {store.hours}, and is located {store.dist} miles away</div>
        </div>
        <div>
        <button className="selectBtn" onClick={() => {
          props.select(ret)
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
      <div className="resultsChange" onClick={() => props.reset(locObj)}>Change Location</div>
      </div>
      <ul className="resultsList">
        {storeList}
      </ul>
    </div>
    </>
  );  
}
export default StoreLoc;