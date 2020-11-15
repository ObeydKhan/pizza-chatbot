export default function BotTrigger(props){  
  const type = props.trigger.type;
  const value = props.trigger.value;
  const order = props.order;
  const step = props.step;
  const ret = {
    botStep:{type:type, value:value},
    order:null,
    step:null,
    trigger:'pizzabuilder',
    stepMsg:props.trigger.msg,
    userMsg:props.trigger.usr,
  };
  if(value==='next'){
    
    order.CurrentItems = props.trigger.selected;
    ret.userMsg = ret.userMsg.replace('{r}',getUserMsg(props))
  }       
  switch(type){
    case 'menu':      
    case 'editItem':
      
      if(value==='specialinstmsg'){
        ret.botStep = {type:'reviewPizza',value:''};
        ret.trigger=value;
      } else if(value==='ordername'){
        ret.botStep = {type:'menu',value:'crusts'};
        step.step = 'new'
        ret.trigger=value;
      } else {
        if(props.trigger.hasOwnProperty('stepTrig')){
          ret.trigger=props.trigger.stepTrig;
        }
        step.step = value;
      }
      break;
    case 'editPizza':
      if(!isNaN(value)){order.CurrentPizza=value}
      break;      
    case 'reviewOrder':      
    case 'add':
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
        ret.botStep = {type:'editPizza',value:'cur'};
      } else if(value==='ordername'){
        ret.botStep = {type:'reviewOrder',value:''};
      }
      ret.trigger=value;
      break;      
    case 'remove':     
    case 'cancel':      
    case 'complete':
      if(value==='no'){
        ret.botStep = props.trigger.prevStep;
      } else if(value!=='') {
        if(type==='complete'){
          ret.trigger='endmsg1';
        } else if(type==='remove'){
          if(value==='cur'){
            ret.botStep = {type:'menu',value:'crusts'};
            order.CreateNewPizza();
            step.step = 'new';
          } else {
            order.RemovePizza(value);
            ret.botStep = {type:'reviewOrder',value:''};
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
