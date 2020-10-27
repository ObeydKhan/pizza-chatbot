function StepFactory(stepInfo) {
  const owner = stepInfo.currentStep;
  const next = stepInfo.nextStep;
  const prev = stepInfo.prevStep;
  const isRetRevO = stepInfo.isRetRevO;
  return getCtrls(owner, next,prev,isRetRevO);
}
function getCtrls(owner, next, prev, isRetRevO){
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
    ctrlArry = ctrlArry.concat([['prev', prev.type==='menu'?`Prev Step -> ${prev.name}`:'Start Over', owner, prev, 'goto']]);
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
  return ({
    btnClass: `btn-${ctrlType}`,
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