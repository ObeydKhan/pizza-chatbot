import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/umd/popper.js';
import 'bootstrap/dist/js/bootstrap.js';
import UserLocation from './components/ZipLookUp'


/*LocationFactory().then(obj => {
  console.log('Inside factory object');*/
  const obj = LocationFactory();
  ReactDOM.render(
  <React.StrictMode>
    <App userLocObj={obj}/>
  </React.StrictMode>,
  document.getElementById('root')
  );
/*})*/
function LocationFactory(loc){
  let x = new UserLocation();
  return x.initLoc();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
