import React from 'react';
import MenuToolTip from './MenuToolTip';

export default function MenuItemDisplay(props){
  const itemTypeName = props.itemTypeName;
  const toolTipCaption = `Your current selection for ${itemTypeName} is:`;
  const component = <div className="menuItemDisplay">{props.itemDescription}</div>
  return <MenuToolTip caption={toolTipCaption} description={props.toolTipDescription} component={component}/>
  
}