import {lookup,lookupByCoords} from 'zipcodes';
import stores from '../resources/stores.json';

class Location {
  #geo = null;
  #user = null;
  #store = null;
  #search = null;
  #prevObj = null;
  constructor(){
    this.storeInfo = this.storeInfo.bind(this);
    this.initLoc = this.initLoc.bind(this);
    this.resolveGeoLoc = this.resolveGeoLoc.bind(this);
    this.resetLoc = this.resetLoc.bind(this);    
    this.#geo = {
      isResolved: false,
      entryErr: false,
      errMsg: '',
      zip: '',
      cityState: ''};     
    this.#user = {
      isResolved: false,
      entryErr: false,
      errMsg: '',
      zip: '',
      cityState: ''};  
    this.#store = {
      current: '0',
      previous: '0'};
    this.#search = {
      step:'search',
      method: '',
      searchLoc: '',
      isResolved: false,
      hasErr: false,
      errMsg: '',
    }
  }
  get searchStep(){
    return this.#search.step;
  }
  ChangeLoc(){
    this.#prevObj = {
      user:this.#user,
      store:this.#store,
      search:this.#search,
      }   
    this.#user.isResolved=false;
    this.#user.entryErr=false;
    this.#user.errMsg='';
    this.#user.zip='';
    this.#user.cityState='';            
    this.#store.previous=this.#store.current;
    this.#store.current = 0;     
    this.#search.step='search';
    this.#search.method='';
    this.#search.searchLoc='';
    this.#search.isResolved=false;
    this.#search.hasErr=false;
    this.#search.errMsg='';    
  }
  resetLoc(){
    this.#user = {
      isResolved: false,
      entryErr: false,
      errMsg: '',
      zip: '',
      cityState: ''};  
    this.#store = {
      current: '0',
      previous: '0',      
      didChange: false};
    this.#search = {
      step:'search',
      method: '',
      searchLoc: '',
      isResolved: false,
      hasErr: false,
      errMsg: '',
    } 
  }  
  get geoZip() {
    if(this.#geo.isResolved && !this.#geo.entryErr) {
      return this.#geo.zip;
    } else {
      return 'NoGeo';
    }
  } 
  get geoCityState(){
    if(this.#geo.isResolved && !this.geoErr) {
      return this.#geo.cityState;
    } else {
      return 'Geo Location Error';
    }   
  }
  get geoErr(){
    return this.#geo.entryErr;
  }
  get geoErrMsg(){
    return this.geoErr?this.#geo.errMsg:'';
  }
  set userZip(val){
    let z = val.trim();    
    let r = false;
    let e = false;
    let m = '';
    let cs = '';
    const l = lookup(z);
    if(typeof l !=="undefined"){
      const c = l.city;
      const s = l.state;        
      r = true;        
      cs = c + ', ' + s;
    } else {
      //invalid zip code
      z = '';  
      r = false;
      e = true;
      m = 'Enter a Valid US Zip Code';        
    }   
    this.#user = {
      isResolved: r,
      entryErr: e,
      errMsg: m,
      zip: z,
      cityState: cs,
    };
  }
  get userZip() {
    if(this.#user.isResolved && !this.#user.entryErr) {
      return this.#user.zip;
    } else {
      return 'NoUser';
    }
  } 
  get userCityState(){
    if(this.#user.isResolved && !this.userErr) {
      return this.#user.cityState;
    } else {
      return 'User Entry Error';
    }   
  }
  get userErr(){
    return this.#user.entryErr;
  }
  get userErrMsg(){
    return this.userErr?this.#user.errMsg:'';
  }
  set storeLoc(val){
    const c = this.#store.current;
    const p = this.#store.previous;
    if(p!==0&&val===p){
      this.#search.step='done';
      this.#user=this.#prevObj.user;
      this.#store=this.#prevObj.store;
      this.#search=this.#prevObj.search;
      this.#prevObj=null;
    } else if(c!==val){
      this.#search.step='done';      
      this.#store.current = val;
      this.#store.previous = 0;
      this.#prevObj=null;
    }    
  }
  get curStoreID(){
    return this.#store.current;
  }
  get prevStoreID(){
    return this.#store.previous;
  }
  get curStoreInfo(){
    const i = this.#store.current; 
    return this.storeInfo(i);
  }
  get prevStoreInfo(){
    const i = this.#store.previous; 
    return this.storeInfo(i);
  }
  get searchErr(){
    return this.#search.hasErr;    
  }
  get searchErrMsg(){
      return this.searchErr?this.#search.errMsg:'';
  }
  get searchMeth(){
    if(this.#search.isResolved){
      return this.#search.method;
    }
    return 'No Search'
  }
  get searchLoc(){
    if(this.#search.isResolved){
      return this.#search.searchLoc;
    }
    return 'No Search'
  }
  set search(values){
    this.#search.step = values.step;
    this.#search.method = values.method;
    this.#search.searchLoc = values.loc;
    this.#search.isResolved = values.res;
    this.#search.hasErr= values.err;
    this.#search.errMsg= values.errMsg;
  }
  set storeSearch(method){        
    let values ={
      step:'select',
      method: method.method,
      loc: '',
      res: false,
      err: false,
      errMsg: '',
    };
    if(values.method==='User Entry'){
      this.userZip = method.usrStr;
      if(this.userErr){
        values.step ='search';
        values.method = '';
        values.err= true;
        values.errMsg= 'Invalid Zip Entry';
      } else {
        values.loc = this.userCityState;
        values.res = true;
      }
    } else if(values.method==='Geo Locate'){
      if(this.geoErr){
        values.step ='search';
        values.method = '';
        values.err= true;
        values.errMsg= 'Invalid Geo Location';
      } else {
        values.loc = this.geoCityState;
        values.res = true;
      }
    } else {
      values.step ='search';
      values.method = '';
      values.err= true;
      values.errMsg= 'Invalid Search Method';
    }
    this.search = values;    
  }
  storeInfo(i){    
    const s = i!==0?stores.stores.find(
      (r) => {return r.id === i;}
    ):false;
    if(!s||s===undefined){
      return {
        storeName:'Please select a Store',
        storeHours:null,
        storeChange:null,
      }
    } else {
      return s;
    }    
  }
  initLoc() {
    return (this.resolveGeoLoc()
      .then(data => {
        if (data!=='GeoFail' && (data!==null||data!=='')) {
          const c = data.city;
          const s = data.state;
          this.#geo = {
            zip: data.zip,
            cityState: c + ', ' + s,
            isResolved: true,
            entryErr: false,
            errMsg: '',
          };      
        } else if (data==='GeoFail') {
          this.#geo = {
            zip: '',
            cityState: '',
            isResolved: true,
            entryErr: true,
            errMsg: 'Geo Location is Disabled',
          };
        } else {
          this.#geo = {
            zip: '',
            cityState: '',
            isResolved: false,
            entryErr: true,
            errMsg: 'Geo Location not resolved',
          };
        }
        return this;
      })
    )
  }  
  resolveGeoLoc(){ 
    const locOpt = {
      timeout: 5000,
      maximumAge: 0
    };    
    return (new Promise((resolve, reject) => {
      if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          let lat = position.coords.latitude;
          let long = position.coords.longitude;
          const tZip = lookupByCoords(lat,long);                  
          resolve(tZip);
        },(error) => {
          console.log('Error getting location');
          console.error("Error Code = " + error.code + " - " + error.message);
          const response = 'GeoFail';

          resolve(response);  
        },locOpt);
      }
    }, ()=>{
      console.log("Promise reject");   
      }
    ))        
  }
}

export default Location;