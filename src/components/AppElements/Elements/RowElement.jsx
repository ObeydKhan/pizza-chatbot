import React from 'react';
import MenuToolTip from './MenuToolTip';
import {ChangeHalfButton, IncreaseQty, DecreaseQty} from '../Buttons/index'

export function StaticRowElement(props){
  const {type, itemTypeName, shortDescription, fullDescription,hasHalf,hasQty} = props;
  const [maxQty] = React.useState(hasQty?props.maxQty:2);
  const [qty, setQty] = React.useState(hasQty?props.qty:2);
  const [half,setHalf] = React.useState(hasHalf?props.half:2);  
  const changeHalf = (val)=>{    
    setHalf(val);
    props.updateItem(itemTypeName,half,qty);
  }
  const changeQty = (val)=>{
    setQty(qty+val);
    props.updateItem(itemTypeName,half,qty);
  }
  const halfDisplay = hasHalf?<li key={`${type}-${itemTypeName}-half`}><ChangeHalfButton caption={props.halfCaption} description={props.halfDescription} changeHalf={()=>{changeHalf()}}/></li>:null;
  const lowerQty = hasQty?<li key={`${type}-${itemTypeName}-less`}><DecreaseQty itemTypeName={itemTypeName} disabled={qty===0} description={props.lowQtyDescription} changeQty={()=>{changeQty()}}/></li>:null;
  const raiseQty = hasQty?<li key={`${type}-${itemTypeName}-more`}><IncreaseQty itemTypeName={itemTypeName} disabled={qty===maxQty} description={props.highQtyDescription} changeQty={()=>{changeQty()}}/></li>:null;

  return (
    <ul className="rowElement">
      {halfDisplay} 
      {lowerQty} 
      <li key={`${type}-${itemTypeName}-display`}>        
        <MenuToolTip caption={`Your current selection for ${itemTypeName} is:`} description={fullDescription} component={<div className="menuItemDisplay">{shortDescription}</div>}/>
      </li> 
      {raiseQty} 
    </ul>
  )
}