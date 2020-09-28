import * as opencage from 'opencage-api-client';
import { reject } from 'lodash';

function ResolveLocation(props){
  let results = {
    zipCode: '',
    city: '',
    state: '',
    isChecked: false,    
  };  
  const newGeoLoc = GetGeoLoc();    
  const r = newGeoLoc.then(data => {
    if(data==='NoGeo') {
      results.zipCode = 'NoGeo';
      results.city = '';
      results.state = '';
      results.isChecked = false;
    } else if(data==='GeoFail') {
      results.zipCode = '';
      results.city = '';
      results.state = '';
      results.isChecked = true;
    } else {
      const x1 = data.indexOf(",");
      const x2 = data.lastIndexOf(" ");
      const retCity = data.substring(0, x1);
      const retSt = data.substring(x1+2, x2);
      const newRes = data.substring(x2+1);
      results.zipCode = newRes;
      results.city = retCity;
      results.state = retSt;
      results.isChecked = true;
    }      
    return results;}
  )
  .catch(err => {
    console.error(err);    
  });
  return r;
}

function GetGeoLoc() { 
  const apiKey = 'af85575e9f8d4e71a402d1962a1361d1';
  let response = '';  
  let locOpt = {
    timeout: 5000,
    maximumAge: 0
  };
  let query = '';
  return (new Promise((resolve, reject) => {
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        query = lat + ', ' + long;
        resolve(query);
      },(error) => {
        console.log('Error getting location');
        console.error("Error Code = " + error.code + " - " + error.message);
        response = 'GeoFail';
        resolve(response);  
      },locOpt);
    }
  }, ()=>{
    console.log("Promise reject");
    response = 'NoGeo';
    reject(new Error ('Promise Rejected'));
    }
  ).then(query => {   
    let newQ = query+'';
    if(newQ!=='') {
      return GetOpenCage({query: newQ, apiKey: apiKey})       
    } else {
      console.log('Query is empty');
      response = 'NoGeo';
      return response;
    }
  }))  
}
function GetOpenCage(props) {
  const query = props.query;
  const apiKey = props.apiKey;
  const addressFormatter = require('@fragaria/address-formatter');
  let response = '';
  const p = opencage.geocode({ q: query, key: apiKey, pretty: '1', no_annotations: '1'})
      .then(geoData => {                              
        const data = geoData.results;          
        const formatted = addressFormatter.format(data[0].components, {output: 'array'});
        response = formatted[2];
        return response;
      })    
  return(p.then(response => {
    return response;}))  
}
export default ResolveLocation;
