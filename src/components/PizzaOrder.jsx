import Pizza from './Pizza';
import PizzaMenu from './itemMenu';

class PizzaOrder {
  constructor(props) {
    if(props==='new'){
      this.Cancel('order');
    } else {
      this.CreateOrder(props);
    }
    this.getSpecial=false;                
  }
  ProcessStep(props){
    const stepKey = props.key;
    const triggerValue = props.trigger;
    const userMsg = this.getUserMsg(triggerValue);    
    this.stepsProcessed++;
    const bot = `Step-${this.stepsProcessed}: ${stepKey.substring(0,5)}`;
    this.botKeys.push(bot)
    return {userMsg:userMsg, trigger:this.newTrigger, key:bot};
  }
  GetDisplayStep(){
    if(this.currentStepInfo===null||this.triggerValue===null) return null
    this.currentStepInfo = this.CreateStep(this.triggerValue);
    return this.currentStepInfo;
  }
  CurrentStepSelection(props){   
    if((props.owner.name==='crusts'||props.owner.name==='sizes')&&this.SelectionArray(props.owner.name).length===0){
        const trig = (props.target.name==='remove'||props.target.name==='cancel'||(props.hasOwnProperty('btnCapt')&&(props.btnCapt.indexOf('Prev')!==-1)))?true:false;      
        return trig;
      }
      return true;    
  }
  getUserMsg(props){
    //returns the user message to the custom step
    this.triggerValue = props;
    const isPrev = (props.hasOwnProperty('btnCapt')&&(props.btnCapt.indexOf('Prev')!==-1));
    switch(props.target.type){
    case 'new':
      //add new pizza
      this.SavePizzaToOrder();
      this.triggerValue = this.CreateNewPizza(props.owner);             
      return 'Add a new pizza to the order';     
    case 'edit':
      //handle edits
      return this.HandelEdit(props);      
    case 'menu':
      return isPrev?`Go back to ${this.menu.getPrev(props.owner.name)}`:this.CreateItemMsg(props.owner.name);
    case 'review':
      this.ResetTrigger();           
      return props.target.name==='order'?'Review pizza order':'Review pizza';          
    case 'special': 
      //Going to a special step
      return `Go to ${props.owner.name}`;      
    default:
      return this.HandleSpecialActions(props);
    }
  }
  HandelEdit(props){
    const altTrigger = props.target.name==='specialinstmsg'||props.target.name==='ordername';        
    this.ResetTrigger();
    if(altTrigger){
      this.newTrigger = props.target.name;      
      const target = props.target.name==='ordername'?{type:'review', name:'order'}:{type:'edit', name:'pizza'};
      const owner = props.target.name==='ordername'?{type:'change', name:'ordername'}:{type:'inst', name:'specialinstmsg'};
      this.triggerValue = {owner:owner, target:target};
      return props.target.name==='ordername'?'Change order name':'Change special instructions';
    } else if(this.menu.checkStep(props.target.name)) {
      //menu step
      const target = {type:'edit', name:props.target.name};
      const owner = {type:'edit', name:'pizza'};
      this.triggerValue = {owner:owner, target:target};
      return `Edit ${props.target.name}`;
    } else if(props.target.name==='pizza'){
      return 'Edit this pizza'
    }else {
      if(this.ChangeCurrentPizza(props.target.name)){        
        const target = {type:'edit', name:'pizza'};
        const owner = {type:'review', name:'order'};
        this.triggerValue = {owner:owner, target:target};
        return `Edit Pizza #${props.target.name}`;
      }
      return 'Invalid edit selection'
    }    
  }
  CreateNewPizza(prev){
    const cur = {type:'menu', name:this.menu.getStep(0)};
    this.currentPizza = new Pizza(this.lastID+1);
    this.ResetTrigger();    
    return {owner:prev, target:cur}           
  }
  StartNewOrder(name){    
    if(name===''){
      this.orderName= ' ';
    } else {
      this.orderName= name;
    }
    this.currentStepInfo = {current:{type:'change', name:'ordername'}};
    this.triggerValue = this.CreateNewPizza({type:'change', name:'ordername'})
  } 
  SavePizzaToOrder(){    
    if(this.currentPizza===null) return null;
    const pizza = this.currentPizza;    
    const id = pizza.PizzaID;
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      //Override existing pizza
      this.pizzas.splice(i,1,pizza);
    }
    else {
      this.lastID = pizza.PizzaID;
      this.pizzas = this.pizzas.concat(pizza);
    }
  }
  EditSelections(type){
    if(this.currentPizza===null) return null;    
    this.currentPizza.EditSelections(type);    
  } 
  AddSpecialInstructions(val){
    if(this.currentPizza===null) return null;    
    this.currentPizza.SpecialInstructions = val;    
    const owner = {type:'inst', name:'specialinstmsg'};
    const target = {type:'review', name:'pizza'};
    this.triggerValue = {owner:owner, target:target};
    this.getSpecial = false;
  }
  SelectPizzaItems(values){
    if(this.currentPizza===null) return null;
    const p = this.currentPizza;
    const ret = p.SelectPizzaItems(values);
    this.currentPizza = p;
    return ret;    
  }
  SelectionArray(type){
    if(this.currentPizza===null) return null;
    const p = this.currentPizza;
    const ret = p.SelectionArray(type);
    this.currentPizza = p;
    return ret;    
  }
  ChangeCurrentPizza(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.currentPizza =this.pizzas[i];
      return true
    } else {
      return false;
    }
  }
  RemovePizza(id){    
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.pizzas.splice(i,1);
      this.pizzaCnt = this.pizzas.length();
    }
    if(this.currentPizza!==null&&this.currentPizza.PizzaID===id){
      this.CancelPizza();
    }
    const step = {type:'review', name:'order'};
    this.currentStepInfo =({current:step, prev:step, next:step})
  }
  StepMessage(props){    
    switch(props.type){
      case 'menu':
        return this.menu.getStepMessage(props.name);         
      case 'edit':         
        return props.name==='pizza'?'Please select an option to edit':this.menu.getStepMessage(props.name);         
      case 'review':
        const str = 'Please {0} and select an option below:'
        return str.replace('{0}',props.name==='order'?'review your order':'review this pizza');
      case 'complete':
        return 'Complete this order and go to payment & confirmation?'
      case 'cancel':
        return 'Do you really want to cancel this order?';
      case 'remove':
        return props.name==='restart'?'Are you sure you want to discard this pizza?':'Do you really want to remove this pizza?';
      case 'change':
        return 'Do you really want to change the name for this order?'
      default:
        return '';
    }
  }  
  CreateStep(props){       
    const next = (step)=>{
      switch(step.type){
        case 'menu':         
          const chkNxt = this.menu.getNext(step.name);
          const next = chkNxt==='EOM'?'Special Instructions':chkNxt;
          const type = chkNxt==='EOM'?'inst':step.type;   
          return {type:type, name:next};         
        case 'edit':          
          if(step.name==='save'||step.name==='drop') return {type:'review', name:'pizza'}
          const name = step.name.length<3?'pizza':step.name;
          return {type:step.type, name:name==='pizza'?this.menu.MenuSteps.concat(['inst']):'item'};         
        case 'review':
          return {type:step.type, name:step.name==='order'?this.pizzas.map((p)=>{return p.PizzaID}):'pizza'};
        default:
          return {type:'', name:''};
      }
    }
    const stepContents = (step)=>{
      switch(step.type){
        case 'menu':
        case 'edit':         
          if(step.type==='edit'&&step.name.length<3) return {type:'review', 
          contents:this.CreateReview(this.GetPizzaString(step.name))}//pizza summary
          if(step.name==='pizza'){return ''}
          return {type:this.menu.getContentType(step.name), 
            contents:{hasMulti:this.menu.getHasMultipleSelect(step.name),
              elements:this.menu.getStepElements(step.name),              
              selected:this.SelectionArray(step.name),}}        
        case 'review':         
          return {type:'review', contents:this.CreateReview(step.name)}
        default:          
          return ''
      }
    };
    const fromReviewOrder = (props)=> {
      switch(props.owner.type){
        case 'review':
          return props.owner.name==='order';
        case 'edit':
          return props.isReturnFromReviewOrder;
        case 'menu':
          return false;
        default:
          return false;
      }
    }
    const isPrev = (props.hasOwnProperty('btnCapt')&&(props.btnCapt.indexOf('Prev')!==-1));
    const chkPrev = isPrev?this.menu.getPrev(props.target.name):props.owner.name;
    const prevStep = chkPrev==='BOM'?'Enter Name':chkPrev
    const prevType  =chkPrev==='BOM'?'change':props.target.type;
    if(props.owner.type!=='special'){      
      const returnStep = {
        current:props.target, 
        prev:{type:prevType, name:prevStep}, 
        next:next(props.target),
        isReturnFromReviewOrder:fromReviewOrder(props),
        stepMsg:this.StepMessage(props.target), 
        stepContents:stepContents(props.target)
      };
      if(returnStep.next.type!=='inst'||returnStep.next.type!=='change'){this.ResetTrigger();}    
      return returnStep;
    } else {
      //handle special step
      return ({
        current:props.target, 
        prev:props.owner,
        stepMsg:'',
      })
    }    
  }
  CreateReview(type){    
    if(type==='order'){
      const infoMap= this.pizzas.map((p)=> {return p.PizzaInfo});
      const cnt = infoMap.length;      
      return({
        name:this.orderName,
        cnt:cnt,
        tables:infoMap.map((i)=> {return this.CreateSummaryTable(i)})
      })
    } else {
      if(isNaN(type)) return this.CreateSummaryTable(this.currentPizza.PizzaInfo);
      const i = this.pizzas.findIndex(p => p.PizzaID === type);
      if(i===-1){return `No pizza ${type}`;}
      const pizza = this.pizzas[i];     
      return this.CreateSummaryTable(pizza.PizzaInfo)
    }
  }
  CreateSummaryTable(pizza){
    const id = pizza.id;
    const items = pizza.items;
    const itemTypeArray = this.menu.MenuSteps;
    const spcinst = pizza.specinst;
    const stringArray = itemTypeArray.map((i)=> {
      if(!items.hasOwnProperty(i)){return {tr:i, td:`No ${i} added`}}
      const item = items[i];     
      const str = this.getItemString(i,item);
      return ({
        tr:i,
        td:str,
      })
    })
    return({
      id: id,
      table:stringArray,
      specInst:spcinst,
    })
  }
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
  }
  
  HandleSpecialActions(props){
    switch(props.target.type){
      case 'complete':
        this.newTrigger = 'endmsg1';      
        return 'Complete Order'       
      case 'inst':
        const prev=props.owner;
        const next = {type:'review', name:'pizza'};
        const cur = props.target;
        this.currentStepInfo =({current:cur, next:next, prev:prev});
        this.newTrigger = props.target.name;
        this.getSpecial = true;
        return this.CreateItemMsg(props.owner.name);        
      case 'cancel':
        return this.Cancel(props.target.name);
      case 'remove':
        return this.Remove(props.target.name);
      default:
        return 'Invalid special action attempted'
    }    
  }  
  Remove(type){    
    switch(type){
      case 'restart':
        this.currentPizza = null;
        this.CreateNewPizza({type:'review', name:'order'})
        return 'Start this pizza over'
      case 'remove':
        const id = this.currentPizza.PizzaID;            
        this.RemovePizza(id);
        return `Remove pizza #${id}`;
      default:
        return 'Invalid remove operation attempted'
    }
  }
  Cancel(type){
    switch (type){      
    case 'mainpage':            
      return 'Go to main page';          
    case 'storeselect':
      return 'Go to store selection page'
    case 'order':
      this.CreateOrder(
        { orderName: '',
          pizzas: [],    
          lastID: 0,
          currentPizza: null,
          stepsProcessed: 0,   
          currentStepInfo: null,
          botKeys: [],
          triggerValue: null,      
          newTrigger: 'pizzabuilder',
        }
      )
      return 'Cancel this order'
    default:
      return 'Invalid cancel operation attempted'
    }
  }
  CreateOrder(props){
    this.orderName= props.orderName;
    this.pizzas= props.pizzas;    
    this.lastID = props.lastID;
    this.currentPizza = props.currentPizza;
    this.stepsProcessed = props.stepsProcessed;   
    this.currentStepInfo = props.currentStepInfo;
    this.botKeys = props.botKeys;
    this.triggerValue = props.triggerValue;
    this.menu = new PizzaMenu();
    this.newTrigger = props.newTrigger;
  }
  ResetTrigger(){
    this.newTrigger='pizzabuilder';
  }
}
    


export default PizzaOrder;
