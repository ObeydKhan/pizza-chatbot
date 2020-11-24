import React from 'react';
import MenuComponent from './MenuComponent';
import Random from 'random-id';

function MenuArray(props){
  if(!props.hasStep){return null};  
  const sel = props.selected;  
  const step = props.name;  
  const content = props.content;
  const vals = content.values;
  const qty = content.qty;
  const half = content.half;
  const rows = vals.map((i)=>{
    const itemCaption = i.caption;
    const itemDescription = i.description;
    const rowKey = Random(8);
    const title = {itemClass:'rowTitle', itemCaption:itemCaption, itemDescription:itemDescription};
    const btns = i.hasOwnProperty('type')?content[i.type]:half?half.concat(qty):qty;
    const rowbtns = btns.map((b)=>{
      const bCap = b.caption;
      const bDes = b.description;
      const bVal = `${step}:${i.id}:${b.type}:${b.id}`;
      const isSel = sel.findIndex(p=>p===bVal)!==-1;
      const outerClass = isSel?'btn-select':'btn-item';
      return {
        itemClass:'menuBtn',
        itemCaption:bCap,
        itemDescription:bDes,
        itemValue:bVal,
        itemKey:Random(8),
        btnClass:outerClass,        
      }
    });    
    return {
      componentType:'botmenu',
      rowTitle:title,
      rowbtns:rowbtns,
      rowKey:rowKey,
    }
  })
  const components = rows.map((r)=>{
    const val = r;
    val.onSelect= props.onSelect;
    return MenuComponent(val)});
  const stepKey = Random(8);
  return (
    <div className={components.componentType} key={stepKey}>
      <ul>
        {components.map((c)=>{
          return (
            <li key={c.rowKey} className="menuRow">
              <div>{c.rowtitle.comp}</div>
              <ul>
                {c.rowbtns.map((r)=>{ return (
                <li key={r.key} className={r.iClass}>
                  {r.comp}
                </li>)                  
                })}
              </ul>
            </li>  
          )
        })}
      </ul>
    </div>
  )
}
export default MenuArray;