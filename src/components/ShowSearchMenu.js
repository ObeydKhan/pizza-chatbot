import React from 'react';

class ShowSearchMenu extends React.Component {
    render(){
    const show = this.props.show;
    
    if (show){
      return (
        <>
        <div className="searchMenu">
          <div className="searchLabel">Find a store near you:</div>
          <form >
            <input className="inputString" type="text" ref={this.props.refIn} />          
          </form>
          <button className="searchBtn" onClick={() => this.props.onClick()}>Submit</button>
        </div>
        </>
      );
    } else {
      return null;
    }
  }
  }
export default ShowSearchMenu;