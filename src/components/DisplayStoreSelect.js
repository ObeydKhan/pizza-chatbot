import React from 'react';
import '../css/DisplayStoreSelect.css';
class DisplayStoreSelect extends React.Component {
  render() {
    const showPage= this.props.data.showPage;
    const userLocation = this.props.data.searchedLocation;

    if (showPage!=='Select') {
      return null;
    } else {
      return (
        <>
        <div className="storeSelect">
        <div className="storeSelectBanner">
          <h2>Results</h2>
          <div className="resultsCapt">Showing results near: {userLocation}</div>
          <div className="resultsChange" onClick={() => this.props.updateLocation()}>Change Location</div>
          </div>
          <ul className="resultsList">
            <StoreResultsList onClick={(i) => this.props.onClick(i)} />
          </ul>
        </div>
        </>
      );
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
    });
  return storeList;
}
function StoreDetails(storeID) {
  switch (storeID){
    case '1':
      return {name: 'Main Street', hours: 'Open 8am-8pm', dist: '1.2'};
      //break;
    case '2':
      return {name: 'Long Street', hours: 'Open 11am-9pm', dist:'3.6'};
      //break;
    case '3':
      return {name: 'Easy Street', hours: 'Open 11am-11pm', dist:'4.1'};
      //break;
    default:
          
  }
  return null;
}
  export {DisplayStoreSelect, StoreDetails};