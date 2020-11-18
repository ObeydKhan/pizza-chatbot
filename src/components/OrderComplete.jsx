import React from 'react';
import '../css/App.css';

class OrderComplete extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      order:this.props.order,
    };
    this.confirm = this.confirm.bind(this);
  }
  confirm(){
    alert("Thank you for choosing Slice!");
    alert("Returning to the main page...");
    window.location.reload(false);
  }
  render(){
    const order = this.state.order;
    const cnt = 'Number of Pizzas: ' + order.PizzaCnt;
    const name = 'Please review the following order for '+order.Name;
    const pickup = 'Your pickup number for this order is: ' + order.PickUpID;
    const recpt = 'Receipt #' + order.ReceiptNum;
    const oDt = 'Order Date: ' + order.OrderDate;
    
    const pizzas = order.Pizzas;
    const pizzaMsg = pizzas.map( (p)=> {
      const id = p.PizzaID;
      const msg = p.PizzaStringArray;
      const t = 'sumT-' +id;      
      const ret = msg.map((m, index)=> {
        const r = t + '-'+(index+1);
        return (<li key={r} className="sumListRow">{m}</li>);
      })
      return(<ul key={t} className={t}>{ret}</ul>);
    })
    return (
      <div className="finalSummary">      
        <div className="or-cm-Greet">{name}</div>
        <div className="or-cm-Date">{oDt}</div>
        <div className="or-cm-Rec">{recpt}</div>
        <div className="or-cm-Cnt">{cnt}</div>
        <div className="or-cm-Table">{pizzaMsg}</div>
        <div className="or-cm-Pick">{pickup}</div>
        <div className="or-cm-Btns">
          <button className="or-cm-Confirm" onClick={()=>this.confirm()}>Confirm Order</button>
          <button className="or-cm-Edit" onClick={()=>{return (this.props.onEdit(order))}}>Edit this Order</button>
          <button className="or-cm-Cancel" onClick={()=>this.props.onCancel()}>Cancel Order and start over</button>
        </div>
      </div>
      );
  }
}
export default OrderComplete;