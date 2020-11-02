import React from 'react';
import Summary from './Summary';

function StepFactory(props) {
  const stepInfo = props.stepInfo;
  const curType = stepInfo.current.type;
  const isSpecial = curType==='special';
  const controls = isSpecial?BuildSpecialStep(stepInfo.current,stepInfo.prev):getCtrls(stepInfo);
  const stepMsg = controls.stepMsg.replace("{0}",stepInfo.stepMsg)  
  const displayMsg = <div className="orderStepMsg">{stepMsg}</div>;
  const stepContents = props.stepContents!==''?BuildContents(props):<div></div>;
  const controlArray = <ControlArray stepMsg={stepMsg} stepCtrls={controls.stepCtrls} onTrigger={props.onTrigger}/>
  const stepClassName = `orderStep`;
  return (
    <div className={stepClassName}>
      {displayMsg}
      {stepContents}
      {controlArray}
    </div>
  ) 
}
function BuildContents(props){
  const contents = {cName:'', retArray:[]}
  switch(props.stepInfo.stepContents.type){
    case 'review':
      contents.cName = 'reviewList'
      contents.retArray = ReviewMsgArray(props)
      break;
    case 'simple':
      contents.cName = 'simpleList'
      contents.retArray = SimpleItemArray(props)
      break;    
    case 'multi':
      contents.cName = 'multiList'
      contents.retArray = MultiRowArray(props)
      break;    
    default:
  }
  return (<div className={contents.cName}>{contents.retArray}</div>)
}
function ReviewMsgArray(props){
  return (Summary(props.stepInfo.stepContents.contents))
}

function SimpleItemArray(props){
  const contents = props.stepInfo.stepContents.contents;
  const elements = contents.elements;  
  const hasMulti = contents.hasMulti;  
  const click = props.onSelect;
  const sel = contents.selected;
  const retArray = elements.map((e)=>{ 
    const capt = e.btnCapt;
    const key = e.listKey;
    const val = {itemInfo:e.itemInfo, multi:hasMulti};
    const i = sel.findIndex(p=>p===key)
    const eleClass = i===-1?(capt===''?'btn-hide':key):'btn-select';          
    return (
      <li key={key} className={eleClass}>
        <button className="menuBtn" onClick={()=> {return click(val)}}>{capt}</button>
      </li>
    )
  })
  return (
    <ul className="simpleMenu">
      {retArray}
    </ul>
  )
}
function MultiRowArray(props){
  const contents = props.stepInfo.stepContents.contents;
  const elements = contents.elements;  
  const hasMulti = contents.hasMulti; ;  
  const click = props.onSelect;
  const sel = contents.selected;
  const retArray = elements.map((e)=>{
    const rowName = e.name;
    const rowClass = e.rClass;
    const rowKey = `${rowClass}-${rowName}`;
    const halfBtns = e.btns.filter((b)=> b.btnType==='half');
    const qtyBtns = e.btns.filter((b)=> b.btnType==='qty');
    const halfRow = halfBtns.length===0?null:<ul className="halfBtns">{BtnArray(halfBtns, sel, click, hasMulti)}</ul>
    const qtyRow = qtyBtns.length===0?null:<ul className="qtyBtns">{BtnArray(qtyBtns, sel, click, hasMulti)}</ul>
    return (
      <div className="menuEleRow" key={rowKey}>                  
        <ul className="rowBtns">
          <div className="rowTitle">{rowName}</div>            
          {halfRow}
          {qtyRow}
        </ul>        
      </div>
    )
  })
  return (
    <ul className="multiRowMenu">
      {retArray}
    </ul>
  )
}
function BtnArray(btns, sel, click, hasMulti){  
  const rowBtns = btns.map((b)=>{       
    const key = b.listKey;
    const i = sel.findIndex(p=>p===key)
    const capt =b.btnCapt;        
    const val = {itemInfo:b.itemInfo, multi:hasMulti};
    const eleClass =  i===-1?b.btnClass:`btn-select`;            
    return (
      <li key={key} className={eleClass}>
        <button className="menuBtn" onClick={()=> {return click(val)}}>{capt}</button>
      </li>
    )
  });
  return rowBtns
}
function ControlArray(props){
  const stepControls = props.stepCtrls.map((s)=>{
    if(s===null) return null;
    const capt = s.btnCapt;
    //const listClass = s.btnClass;
    const btnClass = `${s.btnCat}`
    const key = s.listKey;    
    s.stepMsg = props.stepMsg;
    return (
      <li key={key}>
        <button className={btnClass} onClick={()=> {return props.onTrigger(s)}}>{capt}</button>
      </li>
    )
  })
  return(
    <div className="btnNavigationArray">
      <ul className="btnCtrlList">
        {stepControls}
      </ul>
    </div>
  )
}

function getCtrls(stepInfo){
  const owner = stepInfo.current;
  const next = stepInfo.next;
  const prev = stepInfo.prev;
  const isRetRevO = stepInfo.isRetRevO;
  const hasRemoveSpecial = (owner.type==='menu'||((owner.type==='edit'||owner.type==='review')&&owner.name==='pizza'))?true:false;  
  const isFinalReview = (owner.type==='review'&&owner.name==='order')?true:false;  
  const revS = [[owner.type==='menu'?'Discard pizza':'Remove this pizza', owner,{type:'special', name:'remove'}]];
  const comp = [['Complete Order', owner, {type:'special', name:'complete'}]];
  const chng = [["Change Name", owner, {type:'change', name:'name'}]];
  const cancel = [['Cancel order', owner, {type:'special', name:'cancel'}]];
  let ctrlArry =[];
  if(owner.type==='menu'){
    const a = next.type==='menu'?next:{type:'inst', name:'specialinstmsg'}
    ctrlArry = ctrlArry.concat([[next.type==='menu'?`Next Step(${next.name})`:'Next Step(Special Instructions)', owner, a]]);
    ctrlArry = ctrlArry.concat([[prev.type==='menu'?`Prev Step(${prev.name})`:'Prev Step(Order Name)', owner, prev]]);
  } else if(owner.type==='edit'){
    if(owner.name==='pizza'){      
      const a = next.name.map((i)=>{
        return ([`Edit ${i}`, owner, {name:i, type:'edit'}])
      })
      ctrlArry = ctrlArry.concat(a);
      ctrlArry = ctrlArry.concat([['Edit Special Instructions', owner, {type:'inst', name:'specialinstmsg'}]]);
      ctrlArry = ctrlArry.concat([['Finished Editing', owner, isRetRevO?{name:'order',type:'review'}:{name:'pizza',type:'review'}]]);
    } else {
      ctrlArry = ctrlArry.concat([['Save Changes', owner, {name:'save', type:'edit'}]]);
      ctrlArry = ctrlArry.concat([['Discard Changes', owner, {name:'drop', type:'edit'}]]);
    }
  } else if(owner.type==='review'){
    if(owner.name==='pizza'){
      ctrlArry = ctrlArry.concat([['Edit this Pizza', owner, {name:'pizza', type:'edit'}]]);
      ctrlArry = ctrlArry.concat([['Add a Pizza', owner, {name:'new', type:'new'}]]);
      ctrlArry = ctrlArry.concat([['Go to Final Review', owner, {name:'order', type:'review'}]]);
    } else {
      const a = next.name.map((i)=>{
        return [`Edit Pizza ${i}`, owner, {name:i, type:'edit'}, 'goto']
      })
      ctrlArry = ctrlArry.concat(a);
      ctrlArry = ctrlArry.concat([['Add another Pizza', owner, {name:'new', type:'new'}]]);
    }  
  }
  ctrlArry =hasRemoveSpecial?ctrlArry.concat(revS):ctrlArry;
  ctrlArry =isFinalReview?ctrlArry.concat(comp,chng):ctrlArry;
  ctrlArry = ctrlArry.concat(cancel);
  const ctrlVals = ctrlArry.map((i)=>{
      return buildCtrlObj(i[0],i[1],i[2]);
    });  
  return({
    stepMsg:'{0}',    
    stepCtrls:ctrlVals,
  })
}
function buildCtrlObj(btnCapt, owner, target){      
  const ctrlType = target.type==='special'?'warn':'ctrl'
  return ({
    btnClass: `btn-${ctrlType}`,
    btnCat: `btn-${ctrlType}`,
    btnCapt: btnCapt,
    listKey: `(${owner.type}:${owner.name})=>(${target.type}:${target.name})`,
    owner: owner,
    target: target,          
  }) 
}
function BuildSpecialStep(step, prev){ 
  const vals = (t,p)=> {
    switch(t.type){
      case 'remove':
        return removeCtrl(t,p);
      case 'cancel':
        return cancelCtrl(t,p);
      case 'complete':
        return compCtrl(t,p);
      case 'change':
        return changeCtrl(t,p)
      default:
        return {msg:'No special step created', ctrls:[]};
    }
  }
  const ctrlVals = vals(step,prev);
  return({
    stepMsg:ctrlVals.msg,    
    stepCtrls:ctrlVals.ctrls,
  })
}
const cancelCtrl = (t,p)=>{
  const msg ='Do you really want to cancel this order?';
  let ctrls = [];
  ctrls = ctrls.concat(buildConfirmationCtrl('yes','Yes, go to main page',t,'cancel','mainpage'));
  ctrls = ctrls.concat(buildConfirmationCtrl('yes','Yes, go to the store selection page',t,'cancel','storeselect'));
  ctrls = ctrls.concat(buildConfirmationCtrl('yes','Yes, restart this order',t,'cancel','restart'));
  ctrls = ctrls.concat(buildConfirmationCtrl('no','No, go back',t,p.type,p.name));
  return ({
    msg:msg,
    ctrls:ctrls,}
  )
}
const compCtrl = (t,p)=>{
  const msg ='Complete this order and go to payment & confirmation?';
  let ctrls = [];
  ctrls = ctrls.concat(buildConfirmationCtrl('yes','Yes',t,'complete','order'));
  ctrls = ctrls.concat(buildConfirmationCtrl('no','No, go back',t,p.type,p.name));
  return ({
    msg:msg,
    ctrls:ctrls,}
  )
}
const changeCtrl = (t,p)=>{
  const msg ='Do you really want to change the name for this order?';
  let ctrls = [];
  ctrls = ctrls.concat(buildConfirmationCtrl('yes','Yes',t,'change','name'));
  ctrls = ctrls.concat(buildConfirmationCtrl('no','No, go back',t,p.type,p.name));
  return ({
    msg:msg,
    ctrls:ctrls,}
  )
}
const removeCtrl = (t,p) =>{
  const pType = p.type;
  const msg = pType==='menu'?'Are you sure you want to discard this pizza?':'Do you really want to remove this pizza?';
  let ctrls = [];
  if(pType==='menu'){
    ctrls = ctrls.concat(buildConfirmationCtrl('yes','Yes-start over',t,'remove','restart'));
  }
  ctrls = ctrls.concat(buildConfirmationCtrl('yes','Yes',t,'remove','revieworder'));
  ctrls = ctrls.concat(buildConfirmationCtrl('no','No, go back',t,p.type,p.name));
  return ({
    msg:msg,
    ctrls:ctrls,}
  )
}
function buildConfirmationCtrl(type, label, owner, tarType, tarName){
  const ctrlType = type==='yes'?'warn':'ctrl';   
  return ({
    btnClass: `btn-${ctrlType}`,
    btnCapt: label,
    btnCat: `btn-${ctrlType}`,
    listKey: `(${owner})=>(${tarType}:${tarName})`,
    owner: owner,
    target: {type:tarType, name:tarName},      
  })
}
export default StepFactory;