function StepFactory(stepInfo, functions) {
  const type = stepInfo.type;
  const name = stepInfo.name;  
  switch(type){
    case 'menu':    
      const step = {
        prev: stepInfo.prev,
        next:stepInfo.next,
      };
      return getMenuCtrls(type,step,name);
    case 'review':
      return getReviewCtrls(type);
    case 'edit':
      const choices = stepInfo.choices;
      const secondOrder = stepInfo.secondOrder;
      return getEditCtrls(type, name, choices,secondOrder);
    default:
      return null;
  }

}
function getReviewCtrls(refType, refBy){
  const edit = refBy==='reviewpizza'?
    {id:'review',name:'editpizza', cap:'Change this Pizza',reftype:`${refType}`,tar:'editpizza',type:'ctrl'}:
    {id:'review',name:'editorder', cap:'Edit this order',spc:false, reftype: `${refType}`, tar:'editorder',type:'ctrl'};
  const newp = {id:'review',name:'newpizza', cap:'Add annother pizza',spc:true, reftype: `${refType}`, tar:'addnewpizza',type:'ctrl'};
  const remp = refType==='reviewpizza'?
    {id:'review',name:'removepizza', cap:'Remove this Pizza',spc:true, reftype: `${refType}`, tar:'removepizza',type:'warn'}:
    {id:'review',name:'', cap:'', tar:'',type:''};  
  const revo = refType==='reviewpizza'?
    {id:'review',name:'revieworder', cap:'Continue to final review',spc:false, reftype: `${refType}`, tar:'revieworder',type:'ctrl'}:
    {id:'review',name:'', cap:'', tar:'',type:'ctrl'};
  const comp = refType==='reviewpizza'?
    {id:'review',name:'', cap:'', tar:'',type:''}:
    {id:'review',name:'completeorder', cap:'Complete this order',spc:true, reftype: `${refType}`, tar:'completeorder',type:'ctrl'};
  remp.ctrlclass = 'single'; 
  edit.ctrlclass = 'single'; 
  newp.ctrlclass = 'single'; 
  revo.ctrlclass = 'single'; 
  comp.ctrlclass = 'single'; 
  const ctrlMap = [comp,edit,newp,remp,revo,cano];
  const ctrlBtns = btnFactory(refType,ctrlMap)
  return ctrlBtns;
}
function getEditCtrls(refType,refBy,choiceList,isSecondOrder){  
  const editList = {
    id: 'edit',
    name: refType,
    type: 'ctrl',
    spc:false,
    refType: refType,
    items: choiceList.map((a)=>{
      const tar = a;
      const cap = refType==='editorder'?`Edit Pizza ${a}`:`Change ${a}`;
      const item = {
        tar: tar,
        cap: cap,
      };
      return item;
    })
  };
  const remp =refType==='editorder'?
    {id:'edit',name:'', cap:'', tar:'',type:''}:
    {id:'edit',name:'removepizza', cap:'Remove this Pizza',spc:true,reftype: `${refType}`, tar:isSecondOrder?'removebyorder':'removebypizza',type:'warn'};
  const undo =refType==='editorder'?
    {id:'edit',name:'undo-order', cap:'Go Back',spc:false, reftype: `${refType}`, tar:'revieworder',type:'ctrl'}:
    {id:'edit',name:'undo-pizza', cap:'Go Back',spc:false, reftype: `${refType}`, tar:isSecondOrder?'revieworder':'reviewpizza',type:'ctrl'};
  const chng =refType==='editorder'?
    {id:'edit',name:'changename', cap:'Change the Name for this order',spc:true, reftype: `${refType}`, tar:'changename',type:'ctrl'}:
    {id:'edit',name:'', cap:'', tar:'',type:'ctrl'};
  editList.ctrlclass = 'multi';
  remp.ctrlclass = 'single'; 
  undo.ctrlclass = 'single';
  chng.ctrlclass = 'single'; 
  const ctrlMap = [editList,remp,undo,chng,cano];
  const ctrlBtns = btnFactory(refType,ctrlMap)
  return ctrlBtns;
}
function getMenuCtrls(refType, refBy, name){   
  const next = refType==='menu'?
    refBy.next!=='specialinstmsg'?
      {id:'menu',name:refBy.next, cap:`Continue to ${refBy.next}`,spc:false,reftype:`${refType}`, tar:`${refBy.next}`,type:'ctrl'}:
      {id:'menu',name:'special', cap:'Continue to special instructions',spc:true, reftype: `${refType}`, tar:'specialinstmsg',type:'msg'}:
    {id:'edit',name:'save',cap:'Save Changes', reftype: `${refType}`,spc:false, tar:'editpizza',type:'ctrl'};
  const prev = refType==='menu'?
    refBy.prev!=='BOM'?  
      {id:'menu',name:refBy.prev, cap:`Continue to ${refBy.prev}`,spc:false, reftype: `${refType}`, tar:`${refBy.prev}`,type:'ctrl'}:
      {id:'menu',name:'',cap:'', tar:'',type:'ctrl'}:
    {id:'next',name:'drop',cap:'Drop Changes',spc:false, reftype: `${refType}`, tar:'editpizza',type:'ctrl'};
  const restart = refType==='menu'?
    {id:'menu',name:'restart', cap:'Restart Pizza',spc:true, reftype: `${refType}`, tar:'resetpizza',type:'ctrl'}:
    {id:'edit',name:'restart', cap:'', tar:''};
  const canp = refType==='menu'?
    {id:'menu',name:'canp', cap:'Discard Pizza',spc:true,  reftype: `${refType}`,tar:'cancelpizza',type:'warn'}:
    {id:'edit',name:'', cap:'', tar:''};
  next.ctrlclass = 'single';
  prev.ctrlclass = 'single'; 
  restart.ctrlclass = 'single';
  canp.ctrlclass = 'single'; 
  const ctrlMap = [next,prev,restart,canp,cano];   
  const ctrlBtns = btnFactory(name,ctrlMap)
  return ctrlBtns;
}
function btnFactory(step, ctrlMap){    
  const ctrlBtns = ctrlMap.map((a)=>{
    const btntype = a.type;
    const ctrlclass = a.ctrlclass;         
    switch (ctrlclass){
      case 'single':       
        const target = a.tar;
        if(target==='') return null;
        const id= `${a.id}-${step}-${a.name}`;
        const spc = a.spc;
        const caption = a.cap;
        const refType = a.reftype      
        return makeButton(id,btntype,target,caption,refType,spc);
      case 'multi':
        return a.items.map((i)=>{
          const target = i.tar;
          if(target==='') return null;
          const id= `${a.id}-${step}-${a.name}-${target}`;          
          const caption = i.cap;
          const spc = i.spc;
          const refType = i.reftype;        
          return makeButton(id,btntype,target,caption,refType, spc);
          })
      default:
      //error
      return null;
    }
  })
  return ctrlBtns;    
}
function makeButton(id, btntype, target, caption, refType, spc){
  //id = this buttons id
  //target = what happens after button is clicked
  //caption = button caption
  const ret = {
    btnClss: `btn-${btntype}`,
    btnCapt: caption,
    listKey: `${id}`,
    spc:spc,
    refType: refType,
    trigger: target  
  };
  return ret;
}
const cano = {cap:'Cancel Order', tar: 'cancelorder',type:'warn'};

export default StepFactory;