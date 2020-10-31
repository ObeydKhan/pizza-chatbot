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
  const sumCl =`summary-${props.id}`;
  let x = 0
  const rows = props.table.map((i)=>{x++; return pizzaMsg(i,x)})
  return(
    <table>
      <thead className={sumCl}><tr><th colSpan="2">{sum}</th></tr></thead>
      <tbody>
        {rows}
        <tr><td colSpan="2">Special Instructions:</td></tr>
        <tr><td colSpan="2">{props.specInst}</td></tr>
      </tbody>
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
function pizzaMsg(i, x){
  const items = [].concat(i);
  const rowCl = `${i.tr}-row-pizza-${x}`;
  const ret = items.map((i)=> {
    return(<tr className={rowCl}><td>{i.tr}</td><td>{i.str}</td></tr>)
  })
  return ret;
}
export default Summary;