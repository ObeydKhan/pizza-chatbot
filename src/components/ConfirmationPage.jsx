import React from 'react';
import Summary from './Summary';

class ConfirmationPage extends React.Component{
  render(){
    const order = this.props.appState.order;
    const oSum = order.OrderSummary;
    const finalS = Summary({type:'reviewOrder',content:oSum})
    const out = finalS?finalS:'This is the final order summary and confimation page';
    return (
      <div>{out}</div>
    )
  }

}
export default ConfirmationPage;
    
