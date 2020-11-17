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
    order.CurrentItems = props.trigger.selected;
    ret.userMsg = ret.userMsg.replace('{r}',getUserMsg(props))
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
function getUserMsg(props){
  /*returns the user message to the custom step
  getItemString(type,items){    
    const retArray = items.map((item)=>{      
      if(item.id==='0'||item.id==='') return `No ${type} added`;
      const itemName = this.menu.GetItemName(type,item.id);
      const qty = item.qty!=='0'?`${this.menu.GetOptMsg('qty',item.qty)} `:'';
      const half = item.half!=='0'?` ${this.menu.GetOptMsg('half',item.half)}`:'';
      return `${qty}${itemName}${half}`;
    })
    return retArray.join(', ')
  }
  CreateItemMsg(type){
    if(this.currentPizza===null) return null;    
    const items = [].concat(this.currentPizza.getSelectedItems(type));
    if(items.length===0||(items.length===1&&items[0].id==='')){
      return `No ${type} added`;
    }    
    return this.getItemString(type,items);
  }*/ 
  return 'Test user message' 
}
