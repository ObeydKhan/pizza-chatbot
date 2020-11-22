import React from 'react';
import MenuToolTip from './MenuToolTip'

export function StaticTitle(props){
  return(
    <div className="rowTitle">
      <MenuToolTip caption={props.rowTitle} description={props.description} component={<div>{props.rowTitle}</div>}/>
    </div>
  )  
}