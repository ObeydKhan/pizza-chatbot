import React from 'react';
import PopupMenu from './PopupMenu';
import MenuToolTip from './MenuToolTip'

export function PopupTitle(props){
  const {type,rowTitle,items} = props.rowTitle;  
  const [selected, setSelected]  = React.useState(props.hasOwnProperty('selected')?props.selected:0);
  const selectItem = (val) =>{
    setSelected(val);
    props.updateItem(type,rowTitle,selected)
  }

  return(
    <div className="rowTitle">
      <PopupMenu itemTypeName={rowTitle} items={items} selected={selected} selectItem={()=>{selectItem()}}/>
    </div>
  ) 
}
export function StaticTitle(props){
  const caption = props.rowTitle;
  const description = props.description;
  const component = <div>{props.rowTitle}</div>

  return(
    <div className="rowTitle">
      <MenuToolTip caption={caption} description={description} component={component}/>
    </div>
  )  
}