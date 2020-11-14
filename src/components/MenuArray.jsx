import React from 'react';
import MenuComponent from './MenuComponent';
import Random from 'random-id';

function MenuArray(props){
  const item = props.step;
  const sel = props.selected;
  const onSelect = props.onSelect;
  const step = item.name;
  const vals = item.values;
  const qty = item.qty;
  const half = item.half;
  const rows = vals.map((i)=>{
    const itemCaption = i.caption;
    const itemDescription = i.description;
    const rowKey = Random(8);
    const title = {itemClass:'rowTitle', itemCaption:itemCaption, itemDescription:itemDescription};
    const btns = i.hasOwnProperty('type')?item[i.type]:half?half.concat(qty):qty;
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
        onClick:onSelect,
      }
    });    
    return {
      componentType:'botmenu',
      rowTitle:title,
      rowbtns:rowbtns,
      rowKey:rowKey,
    }
  })
  const components = rows.map((r)=>{return MenuComponent(r)});
  const stepKey = Random(8);
  

    return (
      (!qty&&!half)?<li key={outerKey} className={outerClass}>
        <MenuComponent itemClass={'menuBtn'} itemCaption={itemCaption} itemDescription={itemDescription} itemVal={itemVal} onClick={onSelect}/>
      </li>:
      <li key={outerKey} className='menuRow'>
        <MenuComponent itemClass={'rowItem'} itemCaption={itemCaption} itemDescription={itemDescription}/>
        <ul>
          {half?half.map((h)=> {
            const hCaption = h.caption;
            const hDescription = h.description.replace('{i}', i.properU);
            const hVal = `${itemVal}:half:${h.id}`;
            const innerKey = Random(8);
            const hSel = sel.findIndex(p=>p===hVal)!==-1;
            const innerClass = hSel?`btn-sel-${h.btnClass}`:`btn-${h.btnClass}`;
            return (
              <li key={innerKey} className={innerClass}>
                <MenuComponent itemClass={'menuBtn'} itemCaption={hCaption} itemDescription={hDescription} itemVal={hVal} onClick={onSelect}/>
              </li>
            )
          }):null}
          {qty?qty.map((q)=>{ 
            const hCaption = q.caption;
            const hDescription = q.description.replace('{i}', i.properL);
            const hVal = `${itemVal}:qty:${q.id}`;
            const innerKey = Random(8);
            const hSel = sel.findIndex(p=>p===hVal)!==-1;
            const innerClass = hSel?`btn-select`:`btn-${q.btnClass}`;
            return (
              <li key={innerKey} className={innerClass}>
                <MenuComponent itemClass={'menuBtn'} itemCaption={hCaption} itemDescription={hDescription} itemVal={hVal} onClick={onSelect}/>
              </li>
            )
          }):null}
        </ul>
      </li>
    )
  })
  const name = (item.qty||item.half)?'multiList':'simpleList';
  return {name:name, msg:rows};
}
export default MenuArray;