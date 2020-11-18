import * as opencage from 'opencage-api-client';
import {lookup} from 'zipcodes';

class UserLocation {
  #geoIsResolved = false;
  #userEntLocation = '';
  #geoZip = '';
  #geoLocString = '';
  #userZip = '';
  #userLocString = '';
  #userLocSet = false;  

  get geoLoc() {
    return this.#geoZip;
  }
  get geoString(){
    return this.#geoLocString;
  }
  get userLoc() {
    if(this.#userLocSet){
      return this.#userZip;      
    } else if(this.#geoIsResolved) {
      return this.#geoZip;
    } else {
      return '';
    }
  }
  get userString() {
    if(this.#userLocSet){
      return this.#userLocString;      
    } else if(this.#geoIsResolved) {
      return this.#geoLocString;
    } else {
      return '';
    }
  }
  get userEntry() {
    return this.#userEntLocation;
  }
  set userEntry(value){
    let rZ = '';
    let rS = '';
    let lSet = false;
    let uel = value.trim();
    rS = this.zipLookUp(uel); 
    if(!isNaN(value) && value.length === 5){
      /*is a zip code*/
      rS = this.zipLookUp(uel);      
      if(rS!=='Invalid ZipCode'){
        lSet = true;
        rZ = uel;
      } else {
        rZ = '';
        rS = '';
        uel = '';
        lSet = false;
      }
    } else {
      /*invalid entry*/
      rZ = '';
      rS = '';
      uel = '';
      lSet = false;
    }
    this.#userEntLocation = uel;
    this.#userZip = rZ;
    this.#userLocString = rS;
    this.#userLocSet = lSet;
  }
  zipLookUp(value){
    const l = lookup(value);
    if(typeof l !=="undefined"){
      const c = l.city;
      const s = l.state;
      return c + ', ' + s;
    }
    return 'Invalid ZipCode';        
  }  
  initLoc() {
    /*Factory method commented out for testing*/
    return (this.handleGeoLocation()
      .then(data => {
        console.log('Setting geo zip property: ' + data)
        this.#geoZip = data;
        if(data!==null||data!==''){
          this.#geoIsResolved = true;
          const l = lookup(data);
          const c = l.city;
          const s = l.state;
          this.#geoLocString = c + ', ' + s;
        }
        return this;
      })
    )
      /*geo location hard coded for testing
      const data = '22060';    
      const l = lookup(data);
      const c = l.city;
      const s = l.state;
      this.#geoLocString = c + ', ' + s;
      this.#geoZip = data;
      this.#geoIsResolved = true;
    
    return this;*/
       
  }  
  resolveGeoLoc(){
    let response = '';  
    let locOpt = {
      timeout: 5000,
      maximumAge: 0
    };
    let query = '';
    console.log('Resolving Location...');
    return (new Promise((resolve, reject) => {
      if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('Browser location resolved');
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
      }
    ).then(query => {   
      let newQ = query+'';
      console.log('Passing location to API: ' + newQ);
      if(newQ!=='') {
        return this.resolveOpenCage(newQ)       
      } else {
        console.log('Query is empty');
        response = 'NoGeo';
        return response;
      }
    }))        
  }
  handleGeoLocation() {    
    let results = '';
    console.log('Entering location handler');  
    const newGeoLoc = this.resolveGeoLoc();    
    const r = newGeoLoc.then(data => {
      if(data==='NoGeo') {
        results = 'NoGeo';
      } else if(data==='GeoFail') {
        results = '';        
      } else {        
        const x2 = data.lastIndexOf(" ");       
        const newRes = data.substring(x2+1);
        results = newRes;        
      }      
      return results;}
    )
    .catch(err => {
      console.error(err);    
    });
    return r;
  }
  resolveOpenCage(query) {
    const apiKey = 'af85575e9f8d4e71a402d1962a1361d1';
    const addressFormatter = require('@fragaria/address-formatter');
    let response = '';
    console.log('Querying API');
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
}

export default UserLocation;
