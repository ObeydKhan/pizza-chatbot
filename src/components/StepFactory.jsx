import React from 'react';
import Summary from './Summary';
import MenuArray from './MenuArray';

function StepFactory(props){  
  
  const step = Step(props)
  const content = ContentFactory(props);
  const btns = step.btns.map((b)=>{
    return (
      <button className={b.className} onClick={()=> b.onTrigger()}>{b.caption}</button>
    )
  })
  return (
    <div className="sliceBotStep">
      <div className="stepMessage">{step.msg}</div>
      <div className="stepContent">{content}</div>
      <div className="stepButtons">{btns}</div>
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
        return MenuArray(props);    
      case 'reviewPizza':
      case 'reviewOrder':
        return Summary(props);        
      default:
        return null;
    }
  }
  const content = ContentType(props);
  return (<div className={content.name}>{content.msg}</div>)
}
function MenuStep(props){
  const {step, onTrigger}= props;  
  const {name,multi}  = step;
  const {nextName, prevName} = step.controls;
  const msg = multi?`Please select the combination of ${name} you would like on the pizza`:
                    `Please select a ${name} for the pizza`;     
  const btns = [
    {className:"reg",onTrigger:onTrigger({type:'menu', value:'next', msg:msg, usr:"{r}"}),caption:`Next (${nextName})`},
    {className:"reg",onTrigger:onTrigger({type:'menu', value:'prev', msg:msg, usr:`Go back to ${prevName}`}),caption:`Back (${prevName})`},
    {className:"reg",onTrigger:onTrigger({type:'remove', value:'', msg:msg, usr:"Remove this pizza"}),caption:"Remove Pizza"},
    {className:"reg",onTrigger:onTrigger({type:'cancel', value:'', msg:msg, usr:"Cancel this order"}),caption:"Cancel Order"},
  ];
  return {msg:msg, btns:btns}
}
function EditMenuStep(props){
  const {step, onTrigger}= props;  
  const {name,multi}  = step;  
  const msg = multi?`Please select the combination of ${name} you would like on the pizza`:
                    `Please select a ${name} for the pizza`;     
  const btns = [
    {className:"reg",onTrigger:onTrigger({type:'editPizza', value:'next', msg:msg, usr:`Update ${name} to {r}`}),caption:`Save Changes`},
    {className:"reg",onTrigger:onTrigger({type:'editPizza', value:'prev', msg:msg, usr:"Discard changes"}),caption:`Discard Changes`},    
  ];
  return {msg:msg, btns:btns}
}
function EditStep(props){
  const {itemList, pizzaID, onTrigger}= props;  
  const msg = `Please select an item to change for this pizza`;
  const iBtns = itemList.map((i)=>{
    return {className:"reg",onTrigger:onTrigger({type:'editItem', value:i.val, msg:msg, usr:`Edit ${i.name}`}),caption:`Edit ${i.name}`}
  })  
  const btns = iBtns.concat(
    {className:"reg",onTrigger:onTrigger({type:'spec', value:'specialinstentry', msg:msg, usr:"Edit Special Instructions"}),caption:`Edit Special Instructions`},
    {className:"reg",onTrigger:onTrigger({type:'remove', value:pizzaID, msg:msg, usr:"Remove this pizza"}),caption:"Remove Pizza"},
    {className:"reg",onTrigger:onTrigger({type:'reviewPizza', value:'', msg:msg, usr:"Finished with edits"}),caption:`Continue`},    
  );
  return {msg:msg, btns:btns}                    
}
function ReviewPizzaStep(props){
  const {ordername, onTrigger}= props;  
  const msg = `${ordername}, Please review this pizza and then select an option below`;
  const btns = [
    {className:"reg",onTrigger:onTrigger({type:'reviewOrder', value:'save', msg:msg, usr:"Go to final review"}),caption:`Continue`},
    {className:"reg",onTrigger:onTrigger({type:'add', value:'save', msg:msg, usr:"Add another pizza to this order"}),caption:`Add another pizza`},
    {className:"reg",onTrigger:onTrigger({type:'editPizza', value:'cur', msg:msg, usr:"Edit this pizza"}),caption:`Edit Pizza`},
    {className:"reg",onTrigger:onTrigger({type:'remove', value:'', msg:msg, usr:"Remove this pizza"}),caption:"Remove Pizza"},
    {className:"reg",onTrigger:onTrigger({type:'cancel', value:'', msg:msg, usr:"Cancel this order"}),caption:"Cancel Order"}    
  ];
  return {msg:msg, btns:btns}
}
function ReviewOrderStep(props){
  const {ordername, itemList, onTrigger}= props;  
  const msg = `${ordername}, Please review your order and then select an option below`;
  const iBtns = itemList.map((i)=>{
    return {className:"reg",onTrigger:onTrigger({type:'editPizza', value:i, msg:msg, usr:`Edit Pizza ${i}`}),caption:`Edit Pizza ${i}`}
  })  
  const start = [
    {className:"reg",onTrigger:onTrigger({type:'complete', value:'', msg:msg, usr:"Complete this order"}),caption:`Complete Order`},
    {className:"reg",onTrigger:onTrigger({type:'add', value:'', msg:msg, usr:"Add another pizza to this order"}),caption:`Add another pizza`}];
  const end = [
    {className:"reg",onTrigger:onTrigger({type:'spec', value:'ordername', msg:msg, usr:"Change the name for this order"}),caption:"Change Name"},
    {className:"reg",onTrigger:onTrigger({type:'cancel', value:'', msg:msg, usr:"Cancel this order"}),caption:"Cancel Order"}];
  const btns = start.concat(iBtns).concat(end); 
  return {msg:msg, btns:btns}
}
function RemoveStep(props){
  const {pizzaID, onTrigger}= props;  
  const msg = pizzaID==='cur'?
    'Do you want to discard this pizza?':'Do you want to remove this pizza?';
  const res = pizzaID==='cur'?[{className:"warn",onTrigger:onTrigger({type:'remove', value:'cur', msg:msg, usr:"Yes, and start a new pizza"}),caption:"Yes, and start a new pizza"}]:[];
  const btns = res.concat(
    {className:"warn",onTrigger:onTrigger({type:'remove', value:pizzaID, msg:msg, usr:"Yes, Remove this pizza"}),caption:"Yes, Remove this pizza"},
    {className:"reg",onTrigger:onTrigger({type:'remove', value:'no', msg:msg, usr:"No, go back"}),caption:"No, go back"},
  );
  return {msg:msg, btns:btns}
}
function CancelStep(props){
  const {onTrigger}= props;
  const msg ='Do you really want to cancel this order?';
  const btns = [
    {className:"warn",onTrigger:onTrigger({type:'cancel', value:'main', msg:msg, usr:"Yes, go to main page"}),caption:"Yes, go to main page"},
    {className:"warn",onTrigger:onTrigger({type:'cancel', value:'select', msg:msg, usr:"Yes, go to the store selection page"}),caption:"Yes, go to the store selection page"},
    {className:"warn",onTrigger:onTrigger({type:'cancel', value:'restart', msg:msg, usr:"Yes, restart this order"}),caption:"Yes, restart this order"},
    {className:"reg",onTrigger:onTrigger({type:'cancel', value:'no', msg:msg, usr:"No, go back"}),caption:"No, go back"},
  ];
  return {msg:msg, btns:btns}
}
function CompleteStep(props){
  const {onTrigger}= props;
  const msg ='Complete this order and go to payment & confirmation?';
  const btns = [
    {className:"reg",onTrigger:onTrigger({type:'complete', value:'yes', msg:msg, usr:"Yes"}),caption:"Yes"},    
    {className:"reg",onTrigger:onTrigger({type:'complete', value:'no', msg:msg, usr:"No, go back"}),caption:"No, go back"},
  ];
  return {msg:msg, btns:btns}
}
export default StepFactory;