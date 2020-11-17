import {getUserMsg}  from './Summary';

export default function BotTrigger(props){  
  const type = props.trigger.type;
  const value = props.trigger.value;
  const order = props.order;
  const step = props.step;
  const ret = {
    botStepClass:type,
    order:null,
    step:null,
    trigger:'pizzabuilder',
    stepMsg:props.trigger.msg,
    userMsg:props.trigger.usr,
  };
  if(value==='next'){    
    const s = props.trigger.selected.type;
    if(s==='type'){
      const a = props.trigger.selected.values[0];
      const chk = a.hasOwnProperty('sizes')&&a.hasOwnProperty('crusts');
      const pass = chk&&a.sizes!==0&&a.crusts!==0;
      if(!pass){return false}
    }
    order.CurrentItems = props.trigger.selected;    
    const n = step.GetStepProper(s);
    const item = {type:s, name:n, sel:order.GetCurrentItems(s)};
    ret.userMsg = ret.userMsg.replace('{r}',getUserMsg(item))
    ret.trigger = type==='menu'?step.StepObject.controls.nextTrig:'pizzabuilder';
  } else if(value==='prev'){
    ret.trigger = type==='menu'?step.StepObject.controls.prevTrig:'pizzabuilder';
  }      
  switch(type){
    case 'menu':      
    case 'editItem':      
      if(ret.trigger==='specialinstmsg'||ret.trigger==='ordername') {        
        step.step='none';
        if(ret.trigger==='specialinstmsg'){
          ret.botStepClass = 'reviewPizza';          
        } else if(ret.trigger==='ordername'){
          ret.botStepClass = '';          
        }
      } else {                
        step.step = value;
        ret.botStepClass=type;
      }
      break;
    case 'editPizza':
      ret.botStepClass=type;  
      if(!isNaN(value)){order.CurrentPizza=value}
      break;      
    case 'reviewPizza':
    case 'reviewOrder':            
    case 'add':
      ret.botStepClass=type;  
      if(value==='save'){
        order.SavePizzaToOrder();
      }
      if(type==='add'){
        order.CreateNewPizza();
        step.step = 'new'; 
      }      
      break;
    case 'spec':
      if(value==='specialinstentry'){
        ret.botStepClass = 'editPizza';
      } else if(value==='ordername'){
        ret.botStepClass = 'reviewOrder';
      }
      ret.trigger=value;
      break;      
    case 'remove':     
    case 'cancel':      
    case 'complete':
      if(value==='no'){
        //ret.botStepClass = props.trigger.prevStep;
      } else if(value!=='') {
        if(type==='complete'){
          ret.trigger='endmsg1';
        } else if(type==='remove'){
          order.RemovePizza(value);
          if(value==='cur'){
            ret.botStepClass = 'menu';            
            order.CreateNewPizza();
            step.step = 'new';
          } else {            
            ret.botStepClass = 'reviewOrder';
          }
        } 
      }
      break;
    default:      
  }
  ret.order = order;
  ret.step = step;
  return ret; 
}

