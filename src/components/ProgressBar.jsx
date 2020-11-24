import React from 'react';

class ProgressBar extends React.Component{
render(){
  const arrowRight = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
   </svg>;
  return (
    <div className="container">
        <div className="progress">
          <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <ul className="nav justify-content-center info">
          <li className="nav-item">
            <a className="nav-link disabled" href="/pizza-chatbot">Search for location</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link disabled" href="/pizza-chatbot" onClick={()=> console.log('Hello!')}>Select location</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link disabled" href="/slicebot">Order pizzas</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link disabled" href="/review">Review order</a>
          </li>
          {arrowRight}
          <li className="nav-item">
            <a className="nav-link disabled" href="/summary">Payment 	&amp; Confirmation</a>
          </li>
        </ul>
        </div>
  )
}
}
export default ProgressBar;