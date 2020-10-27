import React from 'react';
import SimpleForm from './SimpleForm';
import '../css/DisplayMainArea.css';
import StoreMenu from './StoreMenu';

class DisplayMainArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {      
      showSum: false,
      showEdit: false,
    };
    this.orderEnd = this.orderEnd.bind(this); 
  } 
  orderEnd(val){
    const o = val;
    const t = true;
    this.setState({
      order: o,
      showSum: t,
    })
  }  
  render() {
    const appState= this.props.appState;
    const showPage = appState.showPage;
    const order = appState.order;
    if (showPage!=='Main') {
      return null;
    } 
    return (
      <>
      <StoreMenu />
      <div className="chatBot">
          <SimpleForm order={order} showPage={showPage} end={(val)=>this.orderEnd(val)}/>
      </div>
      </>
    );
  }
}
export default DisplayMainArea;