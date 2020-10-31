import React from 'react';

function Summary(props){
  const isFinal = props.hasOwnProperty('name');
  if(isFinal){
    return finalO(props)
  } else{
    return single(props)
  }
}

function single(props){  
  const sum = `Pizza #${props.id} Summary`
  const rows = props.table.map((i)=>{return pizzaMsg(i)})
  return(
    <table>
      <tr><th colspan="2">{sum}</th></tr>
      {rows}
      <tr><td colspan="2">Special Instructions:</td></tr>
      <tr><td colspan="2">{props.specInst}</td></tr>
    </table>
  )
}
function finalO(props){
  const name = props.name;
  const cnt = props.cnt;
  const tables = props.tables.map((p)=>{return single(p)});
  const msg1 = <div className="reviewH">{`Order summary for ${name}`}</div>;
  const msg2 = <div className="reviewH">{`There are ${cnt} pizzas in this order`}</div>;
  return ([].concat(msg1,msg2,tables))
}
function pizzaMsg(props){
  const ret = props.map((i)=> {
    return(<tr><td>{i.tr}</td><td>{i.str}</td></tr>)
  })
  return ret;
}
export default Summary;