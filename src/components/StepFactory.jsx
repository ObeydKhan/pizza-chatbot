import React from 'react';
function StepFactory(props) {  
  
  return <BuildStep currentStepInfo={props.CurrentStepInfo} selected={props.selected}  onTrigger={props.onTrigger} onSelect={props.onSelect}/>;
}
function BuildStep(props){
  const buildType = props.currentStepInfo.buildType;
  const stepInfo = props.currentStepInfo.stepInfo;
  const stepMsg = props.currentStepInfo.stepMsg;
  switch (buildType){
    case 'specialStep':
      return <BuildSpecialStep stepInfo={stepInfo} onTrigger={props.onTrigger}/>
    case 'reviewStep':
      return <BuildReviewStep stepInfo={stepInfo} pizzaOrder={props.pizzaOrder} onTrigger={props.onTrigger}/>;
    case 'editOrderStep':
      return null;
    default:      
      return <BuildStandardStep displayMsg={stepMsg} stepInfo={stepInfo} selected={props.selected} onTrigger={props.onTrigger} onSelect={props.onSelect}/>;
  }
}
function BuildSpecialStep(props){
  const stepMsg = <div className="orderStepMsg">{props.stepInfo.stepMsg}</div>;
  const controlArray = <ControlArray stepCtrls={props.stepInfo.stepCtrls} onTrigger={props.onTrigger}/>
  const stepClassName = `orderStep`;
  return (
    <div className={stepClassName}>
      {stepMsg}     
      {controlArray}
    </div>
  )
}
function BuildReviewStep(props){
  const reviewType = props.stepInfo.currentStep.name;
  const stepCtrls =  getCtrls(props.stepInfo);
  if(reviewType==='pizza'){
    const id = props.pizzaOrder.CurrentPizzaID;    
    
    const topMsg = `Summary for Pizza #${id}`;
    const reviewStr = props.pizzaOrder.CurrentPizzaString;
    const controlArray = <ControlArray stepCtrls={stepCtrls} onTrigger={props.onTrigger}/>
    return (
      <div className="orderStep">
        <div className="orderStepMsg">{topMsg}</div>
        <div className="pizzaReviewMsg">{reviewStr}</div>
        {controlArray}
      </div>
    )
  }
}
function BuildStandardStep(props){
  const {stepInfo} = props;
  const hasElements = stepInfo.hasMenuElements;
  const stepCtrls =  getCtrls(props.stepInfo);
  const stepMsg = props.displayMsg!==''?<div className="orderStepMsg">{props.displayMsg}</div>:null;
  const elementArray = hasElements?
    <ElementArray stepInfo={stepInfo.elements} selected={props.selected} onSelect={props.onSelect}/>
    :null;
  const controlArray = <ControlArray stepCtrls={stepCtrls} onTrigger={props.onTrigger}/>
  const stepClassName = `orderStep`;
  return (
    <div className={stepClassName}>
      {stepMsg}
      {elementArray}
      {controlArray}
    </div>
  )  
}
function ElementArray(props){
  const hasRows = props.stepInfo.hasRows;
  const eleArray = hasRows?MultiRowArray(props):SimpleItemArray(props);
  return (
    <div className="menuEleList">      
      {eleArray}      
    </div>    
  )
}
function SimpleItemArray(props){
  const elements = props.stepInfo.elements;  
  const hasMulti = props.stepInfo.hasMulti;  
  const click = props.onSelect;
  const sel = props.selected;
  const retArray = elements.map((e)=>{ 
    const capt = e.btnCapt;
    const key = e.listKey;
    const val = {itemInfo:e.itemInfo, multi:hasMulti};
    const i = sel.findIndex(p=>p===key)
    const eleClass = i===-1?key:'btn-select';          
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
  const elements = props.stepInfo.elements;  
  const hasMulti = props.stepInfo.hasMulti;  
  const click = props.onSelect;
  const sel = props.selected;
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
    const ret = {      
      ownerType: s.ownerType,
      ownerName: s.ownerName,
      targetType: s.targetType,
      targetName: s.targetName,
      actionType: s.action,
      hasSpecial: s.hasSpecial,    
      trigger: s.trigger,
    }
    return (
      <li key={key}>
        <button className={btnClass} onClick={()=> {return props.onTrigger(ret)}}>{capt}</button>
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
  const owner = stepInfo.currentStep;
  const next = stepInfo.nextStep;
  const prev = stepInfo.prevStep;
  const isRetRevO = stepInfo.isRetRevO;
  const hasRemoveSpecial = (owner.type==='menu'||((owner.type==='edit'||owner.type==='review')&&owner.name==='pizza'))?true:false;  
  const isFinalReview = (owner.type==='review'&&owner.name==='order')?true:false;  
  const revS = [['warn', owner.type==='menu'?'Discard pizza':'Remove this pizza', owner,owner,'remove']];
  const comp = [['next', 'Complete Order', owner, owner, 'complete']];
  const chng = [['next', "Change Name", owner, owner, 'change']];
  const cancel = [['warn', 'Cancel order', owner, owner, 'cancel']];
  let ctrlArry =[];
  if(owner.type==='menu'){
    const a = next.type==='menu'?next:{type:'special', name:'specialinstmsg'}
    ctrlArry = ctrlArry.concat([['next', next.type==='menu'?`Next Step -> ${next.name}`:'Next Step -> Special Instructions', owner, a, 'goto']]);
    ctrlArry = ctrlArry.concat([['prev', prev.type==='menu'?`Prev Step -> ${prev.name}`:'Prev Step -> Order Name', owner, prev, 'goto']]);
  } else if(owner.type==='edit'){
    if(owner.name==='pizza'){      
      const a = next.map((i)=>{
        return [['next', `Edit ${i.name}`, owner, i, 'goto']]
      })
      ctrlArry = ctrlArry.concat(a);
      ctrlArry = ctrlArry.concat([['prev', 'Finished with edits', owner, isRetRevO?{name:'order',type:'review'}:{name:'pizza',type:'review'}, 'goto']]);
    } else {
      ctrlArry = ctrlArry.concat([['next', 'Save Changes', owner, {name:'pizza', type:'edit'}, 'goto']]);
      ctrlArry = ctrlArry.concat([['prev', 'Discard Changes', owner, {name:'pizza', type:'edit'}, 'goto']]);
    }
  } else if(owner.type==='review'){
    if(owner.name==='pizza'){
      ctrlArry = ctrlArry.concat([['next', 'Edit this Pizza', owner, {name:'pizza', type:'edit'}, 'goto']]);
      ctrlArry = ctrlArry.concat([['next', 'Add another Pizza', owner, {name:'crusts', type:'new'}, 'goto']]);
      ctrlArry = ctrlArry.concat([['next', 'Review Order', owner, {name:'order', type:'review'}, 'goto']]);
    } else {
      const a = next.map((i)=>{
        return ['next', `Edit Pizza ${i.name}`, owner, i, 'goto']
      })
      ctrlArry = ctrlArry.concat(a);
      ctrlArry = ctrlArry.concat([['next', 'Add another Pizza', owner, {name:'crusts', type:'menu'}, 'goto']]);
    }  
  }
  ctrlArry =hasRemoveSpecial?ctrlArry.concat(revS):ctrlArry;
  ctrlArry =isFinalReview?ctrlArry.concat(comp,chng):ctrlArry;
  ctrlArry = ctrlArry.concat(cancel);
  return (
    ctrlArry.map((i)=>{
      return buildCtrlObj(i[0],i[1],i[2],i[3],i[4]);
    })
  )
}
function buildCtrlObj(ctrlType, btnCapt, owner, target, tarFunc){
const key = `${owner.type}:${owner.name}-${tarFunc}(${target.type}:${target.name})`;
const specStep = tarFunc==='goto'?false:buildSpecialStep(tarFunc, owner);
const btnCat = ctrlType==='warn'?'warn':'ctrl';
  return ({
    btnClass: `btn-${ctrlType}`,
    btnCat: `btn-${btnCat}`,
    btnCapt: btnCapt,
    listKey: key,
    ownerType: owner.type,
    ownerName: owner.name,
    targetType: target.type,
    targetName: target.name,
    action:ctrlType,
    hasSpecial: specStep,    
    trigger: tarFunc,  
  }) 
}
function buildSpecialStep(type, prev){
  const vals = (t,p)=> {
    switch(t){
      case 'remove':
        return removeCtrl(t,p);
      case 'cancel':
        return cancelCtrl(t,p);
      case 'complete':
        return compCtrl(t,p);
      case 'change':
        return 
      default:changeCtrl(t,p)
        return ''
    }
  }
  const ctrlVals = vals(type,prev);
  return({
    stepMsg:ctrlVals.msg,
    msgClass:`msg-${type}`,
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
  const ctrlType = type==='yes'?'warn':'prev';
  const key = `${owner}-${type}-${tarType}-${tarName}`
  return ({
    btnClass: `btn-${ctrlType}`,
    btnCapt: label,
    btnCat: `btn-${ctrlType}`,
    listKey: key,
    ownerType: type,
    ownerName: owner,
    targetType: tarType,
    targetName: tarName,
    action: ctrlType,
    hasSpecial: true,    
    trigger: 'special',  
  })
}
export default StepFactory;