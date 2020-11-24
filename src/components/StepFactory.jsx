import React from 'react';
import Summary from './Summary';
import MenuArray from './MenuArray';
import Random from 'random-id';


function StepFactory(props){  
  const appState = props.refProps;
  if(appState===null||appState===undefined){return null};
  const type =appState.appValues.appBotStepClass;
  if(type===''){return null};  
  const ref = {
    type:type,     
    pizzaID:appState.order.CurrentID,
    isSaved:appState.order.IsSaved,
    ordername:appState.order.ordername,
    prevStep:appState.prevStep,
    onTrigger:props.onTrigger,
    onSelect:props.onSelect,
  };
  if(type==='menu'||type==='editItem'){      
    const s = appState.step.StepObject;      
    if(s){
      ref.name=s.name;
      ref.botMsg = s.botMsg;
      ref.multi=s.multi;
      ref.nextTrig = s.controls.nextTrig;
      ref.prevTrig = s.controls.prevTrig;
      ref.nextName = s.controls.nextName;
      ref.prevName = s.controls.prevName;
      ref.selected = props.selected;
      ref.content = s.content;
      ref.hasStep=true;      
    } else {
      ref.hasStep=false;
    }
  } else {
    ref.itemList=type==='editPizza'?appState.step.stepList:type==='reviewOrder'?appState.order.PizzaList:false;
    if(type==='reviewPizza'){
      ref.content = appState.order.CurrentPizza;
    } else if(type==='reviewOrder'){
      ref.content = appState.order.OrderSummary;
    }
  }  
  const step = Step(ref)
  const content = ContentFactory(ref);
  const btns = step.btns.map((b)=>{
    return (
      <li key={Random(8)} className="stepButton">
         <button className={b.className} onClick={()=> b.onTrigger(b.trigVal)}>{b.caption}</button>
      </li>     
    )
  })
  return (
    <div className="slicebotStepClass">
      <div className="stepMessage">{step.msg}</div>
      {content}
      <ul className="stepButtons">{btns}</ul>
    </div>
  )
}

function Step(props){
  const type = props.type  
  switch(type){
    case 'menu': 
      return MenuStep(props);
    case 'editItem':
      return EditMenuStep(props);
    case 'editPizza':
      return EditStep(props);
    case 'reviewPizza':
      return ReviewPizzaStep(props);
    case 'reviewOrder':
      return ReviewOrderStep(props);
    case 'remove':
      return RemoveStep(props);
    case 'cancel':
      return CancelStep(props);
    case 'complete':
      return CompleteStep(props);
    default:
      return null;
  } 
}
function ContentFactory(props){  
  const ContentType = (props) => {
    const type = props.type  
    switch(type){
      case 'menu':      
      case 'editItem':
        if(props.hasStep){
          return MenuArray(props);
        } else {
          return null
        }            
      case 'reviewPizza':
      case 'reviewOrder':
        return Summary(props);        
      default:
        return null;
    }
  }  
  return (ContentType(props))
}
function MenuStep(props){
  const {botMsg, prevName, onTrigger}= props;
  const btns = [
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'menu', value:'next', msg:botMsg, usr:"{r}"},caption:`Next`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'menu', value:'prev', msg:botMsg, usr:`Go back to ${prevName}`},caption:`Back`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'remove', value:'', msg:botMsg, usr:"Remove this pizza"},caption:"Remove"},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'cancel', value:'', msg:botMsg, usr:"Cancel this order"},caption:"Cancel"},
  ];
  return {msg:botMsg, btns:btns}
}
function EditMenuStep(props){
  const {name,botMsg, onTrigger}= props;         
  const btns = [
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'editPizza', value:'next', msg:botMsg, usr:`Update ${name} to {r}`},caption:`Save Changes`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'editPizza', value:'prev', msg:botMsg, usr:"Discard changes"},caption:`Discard Changes`},    
  ];
  return {msg:botMsg, btns:btns}
}
function EditStep(props){
  const {itemList, pizzaID, onTrigger}= props;     
  const msg = `Please select an item to change for this pizza`;
  const iBtns = itemList.map((i)=>{
    return {className:"reg",onTrigger:onTrigger,trigVal:{type:'editItem', value:i.val, msg:msg, usr:`Edit ${i.name}`},caption:`Edit ${i.name}`}
  })  
  const btns = iBtns.concat(
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'spec', value:'specialinstentry', msg:msg, usr:"Edit Special Instructions"},caption:`Edit Special Instructions`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'remove', value:pizzaID, msg:msg, usr:"Remove this pizza"},caption:"Remove Pizza"},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'reviewPizza', value:'', msg:msg, usr:"Finished with edits"},caption:`Continue`},    
  );
  return {msg:msg, btns:btns}                    
}
function ReviewPizzaStep(props){
  const {ordername, onTrigger}= props;    
  const msg = `${ordername}, Please review this pizza and then select an option below`;
  const btns = [
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'reviewOrder', value:'save', msg:msg, usr:"Go to final review"},caption:`Continue`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'add', value:'save', msg:msg, usr:"Add another pizza to this order"},caption:`Add another pizza`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'editPizza', value:'', msg:msg, usr:"Edit this pizza"},caption:`Edit Pizza`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'remove', value:'', msg:msg, usr:"Remove this pizza"},caption:"Remove Pizza"},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'cancel', value:'', msg:msg, usr:"Cancel this order"},caption:"Cancel Order"}    
  ];
  return {msg:msg, btns:btns}
}
function ReviewOrderStep(props){
  const {itemList, ordername, onTrigger}= props;     
  const msg = `${ordername}, Please review your order and then select an option below`;
  const iBtns = itemList.map((i)=>{
    return {className:"reg",onTrigger:onTrigger,trigVal:{type:'editPizza', value:i, msg:msg, usr:`Edit Pizza ${i}`},caption:`Edit Pizza ${i}`}
  })  
  const start = [
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'complete', value:'', msg:msg, usr:"Complete this order"},caption:`Complete Order`},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'add', value:'', msg:msg, usr:"Add another pizza to this order"},caption:`Add another pizza`}];
  const end = [
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'spec', value:'ordername', msg:msg, usr:"Change the name for this order"},caption:"Change Name"},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'cancel', value:'', msg:msg, usr:"Cancel this order"},caption:"Cancel Order"}];
  const btns = start.concat(iBtns).concat(end); 
  return {msg:msg, btns:btns}
}
function RemoveStep(props){
  const {pizzaID,isSaved, onTrigger}= props;  
  const msg = !isSaved?
    'Do you want to discard this pizza?':'Do you want to remove this pizza?';
  const res = !isSaved?[{className:"warn",onTrigger:onTrigger,trigVal:{type:'remove', value:'cur', msg:msg, usr:"Yes, and start a new pizza"},caption:"Yes, and start a new pizza"}]:[];
  const btns = res.concat(
    {className:"warn",onTrigger:onTrigger,trigVal:{type:'remove', value:pizzaID, msg:msg, usr:"Yes, Remove this pizza"},caption:"Yes, Remove this pizza"},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'remove', value:'no', msg:msg, usr:"No, go back"},caption:"No, go back"},
  );
  return {msg:msg, btns:btns}
}
function CancelStep(props){
  const {onTrigger}= props;
  const msg ='Do you really want to cancel this order?';
  const btns = [
    {className:"warn",onTrigger:onTrigger,trigVal:{type:'cancel', value:'main', msg:msg, usr:"Yes, go to main page"},caption:"Yes, go to main page"},
    {className:"warn",onTrigger:onTrigger,trigVal:{type:'cancel', value:'select', msg:msg, usr:"Yes, go to the store selection page"},caption:"Yes, go to the store selection page"},
    {className:"warn",onTrigger:onTrigger,trigVal:{type:'cancel', value:'restart', msg:msg, usr:"Yes, restart this order"},caption:"Yes, restart this order"},
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'cancel', value:'no', msg:msg, usr:"No, go back"},caption:"No, go back"},
  ];
  return {msg:msg, btns:btns}
}
function CompleteStep(props){
  const {onTrigger}= props;
  const msg ='Complete this order and go to payment & confirmation?';
  const btns = [
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'complete', value:'yes', msg:msg, usr:"Yes"},caption:"Yes"},    
    {className:"reg",onTrigger:onTrigger,trigVal:{type:'complete', value:'no', msg:msg, usr:"No, go back"},caption:"No, go back"},
  ];
  return {msg:msg, btns:btns}
}

export default StepFactory;