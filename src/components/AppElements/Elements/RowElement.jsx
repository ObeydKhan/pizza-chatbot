import React from 'react';
import PopupMenu from './PopupMenu';
import ItemDisplay from './ItemDisplay';
import {ChangeHalfButton, IncreaseQty, DecreaseQty} from '../Buttons/index'
/* 
PopupRowElement expects props={
  updateItem:(function),
  type:(string),
  itemTypeName:(string),  
  items:(list)=>PopupMenu()
}
*/
export function PopupRowElement(props){
  const {type, itemTypeName, items} = props;
  const [selected, setSelected]  = React.useState(props.hasOwnProperty('selected')?props.selected:0);
  
  const selectItem = (val) =>{
    setSelected(val);
    props.updateItem(type,selected)
  }
  return (
    <ul className="rowElement">
      <PopupMenu itemTypeName={itemTypeName} items={items} selected={selected} isDisabled={props.isDisabled} selectItem={()=>{selectItem()}}/>
    </ul>
  )
}
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
     <li key={`${type}-${itemTypeName}-display`}><ItemDisplay itemTypeName={itemTypeName} itemDescription={shortDescription} toolTipDescription={fullDescription}/></li> 
     {raiseQty} 
    </ul>
  )

}