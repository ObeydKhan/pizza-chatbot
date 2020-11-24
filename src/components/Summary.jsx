import React from 'react';
import ItemMenu from './itemMenu';
import Random from 'random-id';

function Summary(props){  
  switch (props.type){
    case 'reviewPizza':
      return single(props.content.PizzaInfo);
    case 'reviewOrder':
      return finalO(props.content);
    default:
      return null;
  }
}
function single(props){  
  const pizzaID = props.id
  const sum = `Pizza #${pizzaID} Summary`  
  const items = pizzaMsg(props.items);
  const specInst = props.specinst;
  const specRow = specInst===''?<tr className="specialInstHead"><td colSpan="2">No Special Instructions</td></tr>:
        (<><tr className="specialInstHead"><td colSpan="2">Special Instructions:</td></tr>
        <tr className="specialInstRow"><td colSpan="2">{props.specInst}</td></tr></>);  
  return(
    <table>
      <thead className="pizza-sum"><tr><th colSpan="2">{sum}</th></tr></thead>
      <tbody className="sum-table-body">
        {items}
        {specRow}
      </tbody>
    </table>
  )
}
function finalO(props){  
  const name = props.name;
  const cnt = props.cnt;  
  const msg1 = <div className="reviewH">{`Order summary for ${name}`}</div>;
  const msg2 = <div className="reviewH">{`There are ${cnt} pizzas in this order`}</div>;
  const tables = props.pizzas.map((p)=>{
    return <div className="reviewTable">{single(p.PizzaInfo)}</div>});
  return (<>{msg1}{msg2}{tables}</>)
}
function pizzaMsg(items){
  const itemMenu = new ItemMenu();
  const list = itemMenu.stepList;
  const rows = list.map((i)=>{
    const chk = items.hasOwnProperty(i.val)?items[i.val]:false;
    const item = {type:i.val, name:i.name, sel:chk}
    return item;
  })  
  const ret = rows.map((i)=> {
    return(<tr className="sum-row" key={Random(8)}><td>{i.name}</td><td>{getUserMsg(i)}</td></tr>)
  })
  return ret;
}
export function getUserMsg(props){
  if(!props.sel){return `No ${props.name} selected`}
  const itemMenu = new ItemMenu();
  if(props.type==='type'){
    if(!props.sel[0].hasOwnProperty('sizes')&&!props.sel[0].hasOwnProperty('crusts')){
      return 'Invalid pizza type';
    }
    const size = itemMenu.GetCaption('opts','sizes',props.sel[0].sizes);
    const crust = itemMenu.GetCaption('opts','crusts',props.sel[0].crusts);
    return `This pizza is a ${size} with ${crust} crust`;
  } else {
    let hasHalf=false;
    const items = props.sel.map((i)=>{
      const id = i.hasOwnProperty('id')?i.id:'0';
      const qty = i.hasOwnProperty('qty')?i.qty:'1';
      const half = i.hasOwnProperty('half')?(i.half===0?'2':i.half):'2';
      if(id==='0'||id.length<1||qty==='0'){
        return {hID:'3',item:false};
      } else {
        if(half!=='2'){hasHalf=true};
        const ret =  {hID:half, item:itemMenu.GetCaption('items',props.type,id),
                  qty:itemMenu.GetCaption('opts','qty',qty),
                  half:itemMenu.GetDescription('opts','half',half)};
        ret.half.replace('{i}',ret.item);
        return ret;
      }
    })
    items.filter((i)=>{return i.item});
    if(items.length>1){items.sort((a,b)=>{return a.hID-b.hID});};
    if(items.length===0){return `No ${props.name} selected`};
    const retArray = items.map((i)=>{
      if(!i.item) {return ''};
      return `${i.qty} ${i.item}${hasHalf?` ${i.half}`:''}`
    })
    return retArray.toString();    
  }  
}
export default Summary;