import React from 'react';
import MenuToolTip from './MenuToolTip';
import {ChangeHalfButton, IncreaseQty, DecreaseQty} from '../Buttons/index'

export function StaticRowElement(props){
  const {type,typeCaption,itemID,sel,description,captions,hasHalf,hasQty} = props;
  const [maxQty] = React.useState(hasQty?sel.maxQty:2);
  const [qty, setQty] = React.useState(hasQty?sel.qty:2);
  const [half,setHalf] = React.useState(hasHalf?sel.half:2);  
  const handleMenuSelect = props.handleMenuSelect;
  const name = description.name;
  const qtyDescription = hasQty?`${description.qty} `:'';
  const halfDescription = hasHalf&&qty!==2?`(${description.half}) `:'';
  const qtyCaption = hasQty?captions.qty.replace('{i}',name):name;
  const halfCaption = hasHalf?captions.half.replace('{i}',qtyCaption):qtyCaption;
  const displayName = `${halfDescription}${qtyDescription}${name}`;
  const displayCaption = halfCaption;
  const changeHalf = (val)=>{    
    setHalf(val);
    handleMenuSelect({itemID:itemID, change:{type:'half', value:`${half}`}});
  }
  const changeQty = (val)=>{
    setQty(qty+val);
    handleMenuSelect({itemID:itemID, change:{type:'half', value:`${qty}`}});
  }
  const halfDisplay = hasHalf?<li key={`${type}-${itemID}-half`}><ChangeHalfButton caption={props.halfCaption} description={props.halfDescription} changeHalf={()=>{changeHalf()}}/></li>:null;
  const lowerQty = hasQty?<li key={`${type}-${itemID}-less`}><DecreaseQty itemTypeName={name} disabled={qty===0} description={props.lowQtyDescription} changeQty={()=>{changeQty()}}/></li>:null;
  const raiseQty = hasQty?<li key={`${type}-${itemID}-more`}><IncreaseQty itemTypeName={name} disabled={qty===maxQty} description={props.highQtyDescription} changeQty={()=>{changeQty()}}/></li>:null;

  return (
    <ul className="rowElement">
      {halfDisplay} 
      {lowerQty} 
      <li key={`${type}-${itemID}-display`}>        
        <MenuToolTip caption={`Your current selection for ${typeCaption} is:`} description={displayCaption} component={<div className="menuItemDisplay">{displayName}</div>}/>
      </li> 
      {raiseQty} 
    </ul>
  )
}