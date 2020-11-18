import React from 'react';
import GeoIcon from '../resources/GeoIcon.jsx';
import {StoreDetails} from './DisplayStoreSelect';
import '../css/ShowSearchMenu.css';

function ShowSearchMenu(props) { 
  const {userLoc, previousStore, hasError, errorMsg} = props.data;
  const geoLococation = userLoc.geoLoc;
  const geoString = userLoc.geoString ? userLoc.geoString : "";
  const showPage= props.data.showPage;
  if (showPage!=='Search') {
    return null;
  } else {
    let hasErr = null;
    let midOR = null;
    if(hasError) {
      hasErr = <div className="searchErrorMsg">{errorMsg}</div>
    }
    if(previousStore!=='0'){
      midOR = <div className="searchOrPrev">Or</div>      
    }
    return (
      <>
      <div className="searchPage">
      <div className="searchGreeting">Find your Slice</div>
      <div className="srchGrtCaption">Available Menu Items, Special Offers, and Pricing can vary by location.</div>
      <div className="searchContentWrapper">
      <div className="searchBox">
        <div className="searchBoxBanner">Find Locations</div>
        <div className="searchOptions">
          <GeoSearchDialog geoLococation={geoLococation} geoString={geoString} onClick={(geoReturn) => props.onClick(geoReturn)}/>
          <UserSearchDialog hasErr={hasErr} ref={props.refIn} onClick={(geoReturn) => props.onClick(geoReturn)}/>
        </div>
      </div>
      {midOR}      
      <PreviousLoc previousStore={previousStore} confirmLocation={(previousStore)=> props.confirmLocation(previousStore)}/>
      </div>
      </div> 
      </>
    );
  } 
}

const UserSearchDialog = React.forwardRef((props, ref) => {
  const geoString = '';
  const hasErr = props.hasErr;
  return (
    <>
    <div className="userSearchArea">
    <div className="userSearchLabel">Enter a Zip Code</div>
    <form className="searchForm" onKeyDown={(event) => {if(event.key === 'Enter') {props.onClick(geoString); event.preventDefault();}}}>
      <input className="userInputString" type="text" ref={ref}/>
      {hasErr}
    </form>
      <button className="userSearchBtn" type="button" onClick={() => props.onClick(geoString)}>Submit</button>


    </div>
    </>
  );
});
function GeoSearchDialog(props) {
  const geoLococation = props.geoLococation;
  const geoString = props.geoString;
  const btnCaption = 'Locations near ' + geoLococation;
  if(geoString==='') {
    return null;
  }
  return (
    <div className="geoSearchArea">
      <button className="geoSearchBtn" onClick={() => props.onClick(geoString)}>
        <GeoIcon fill="#000000" className="geoSearchIcon"/>
        <div className="geoSearchBtnCapt">{btnCaption}</div>
      </button>
    </div>
  );
}
function PreviousLoc(props) {
  const {previousStore} = props;          
  if (previousStore==='0'){
    return null;
  }
  const storeInfo = StoreDetails(previousStore); 
  console.log(storeInfo)
  return(
    <div className="prevLocBox">    
      <div className="prevLocBanner">Keep this location</div>        
      <div className="prevLocName">{storeInfo.name}</div>
      <div className="prevLocHours">{storeInfo.hours}</div>
      <button className="prevLocConfirm" onClick={() => props.confirmLocation(previousStore)}>Select</button>
    </div>
  );
}
export default ShowSearchMenu;