import PizzaOrder from './PizzaOrder';
import PizzaMenu from './itemMenu';

class OrderControl {
  constructor(){  
    this.pizzaOrder = new PizzaOrder(); 
    this.pizzaMenu = new PizzaMenu();          
    this.start = false;
    this.currentStepInfo = null;        
    this.currentPizzaID = 0;
    this.ProcessAction = this.ProcessAction.bind(this);
    this.menuStep = this.pizzaMenu.MenuSteps;
    this.stepMsg = '';
    this.specInstSet = false;
    this.currentBotKey = '';
    this.botKeys = [];
    this.isSpecialStep = false;
    this.specialStep = null;       
  }
  get IsSpecialStep(){
    return this.isSpecialStep;
  }
  set IsSpecialStep(val){
    this.isSpecialStep = false;
  }
  get SpecialStep(){
    return this.specialStep;
  }
  set SpecialStep(val){
    this.specialStep = val;
  }
  get isStarted(){
    return this.start;
  }
  set isStarted(name){
    this.pizzaOrder.Name = name;
    this.addnewpizza();
    this.start = true;
  }
  set botKey(val){
    if (this.currentBotKey!==val){
      this.currentBotKey = val;
      this.botKeys = this.botKeys.concat(val);
    }
  }
  get botKey(){
    return this.currentBotKey;
  }
  HandleItemSelect(val){
    const itemType = val.itemInfo.item;
    const itemID = val.itemInfo.itemID;
    const hasMulti = val.hasMulti;
    const hasQty = val.itemInfo.hasOwnProperty('qty');
    const hasHalf = val.itemInfo.hasOwnProperty('half');
    const qty = hasQty?val.itemInfo.qty:'0';
    const half = hasHalf?val.itemInfo.half:'0';
    const qtyMsg = hasQty?this.pizzaMenu.GetOptMsg('qty',qty)+' ':'';
    const halfMsg = hasHalf?' ' +this.pizzaMenu.GetOptMsg('half',half):'';
    const itemName = this.pizzaMenu.GetItemName(itemType,itemID);
    const itemMsg = `${qtyMsg}${itemName}${halfMsg}`;
    const retVal = {id:itemID, name:itemName, qty:qty, qtyMsg:qtyMsg, half:half, halfMsg:halfMsg, itemMsg:itemMsg}
    const curSelectItems = [].concat(this.pizzaOrder.ReturnPizzaItems(itemType));
    if(curSelectItems.length===0){
      //add item      
      const add = {type:itemType, values:retVal};
      this.pizzaOrder.SavePizzaItems(add);
    } else {
      //handle single/multiselct + qty/half
      
      const i = curSelectItems.findIndex((p)=>p.id===itemID);
      if(i===-1){
        //item not found
        if(hasMulti){
          const add = {type:itemType, values:retVal};          
          this.pizzaOrder.SavePizzaItems(curSelectItems.concat(add));
        } else {
          //item not in collection - replace existing item
          const add = {type:itemType, values:retVal};
          curSelectItems.splice(0,1,add);
          this.pizzaOrder.SavePizzaItems(curSelectItems);
        }
      } else {
        if(curSelectItems[i].itemMsg===itemMsg){
          //item is previously selected - remove  
          curSelectItems.splice(i,1);
          const add = {type:itemType, values:curSelectItems};
          this.pizzaOrder.SavePizzaItems(add);
        } else {        
          const foundQty = curSelectItems[i].qty;
          const foundHalf = curSelectItems[i].half;
          if(qty==='0'){
            retVal.qty = foundQty;
            retVal.qtyMsg = curSelectItems[i].qtyMsg;
          }
          if(half==='0'){
            retVal.half = foundHalf;
            retVal.halfMsg = curSelectItems[i].halfMsg;
          }
          retVal.itemMsg = `${retVal.qtyMsg}${itemName}${retVal.halfMsg}`;
          const add = {type:itemType, values:retVal};
          curSelectItems.splice(i,1,add);
          this.pizzaOrder.SavePizzaItems(curSelectItems);
        }
      }
    } 
    const updatedItems = [this.pizzaOrder.ReturnPizzaItems(itemType)];
    if(updatedItems.length===0) return []
    
    const ret = updatedItems.map((i)=> {
      const init = `${itemType}-${i.id}`;
      
      const q =i.qty!=='0'?[`${init}-qty-${i.qty}`]:[];
      const h =i.half!=='0'?[`${init}-half-${i.half}`]:[];
      return [init,q,h];

    })
    //return = list key=>[${itemType}-${itemID}-${opt}-${o.id},${step}-${i.id}]
    return ret.flat();
  }

  RestartOrder(){       
    this.pizzaOrder = new PizzaOrder();
    return this;
  }
  StepMsg(){
    return this.stepMsg;
  }
  CurrentStep(){
    const curStepName = this.currentStepInfo.currentStep.name;
    const curStepType = this.currentStepInfo.currentStep.type;
    const hasMenuElements = this.menuStep.findIndex((i)=> i===curStepName)!==-1?true:false;
    const elements = hasMenuElements?this.pizzaMenu.getMenuStep(curStepName):null;
    if(hasMenuElements){
      this.stepMsg = elements.msg;
    } else {
      //do something else to get the message
      this.stepMsg = `Step ${curStepName} with type ${curStepType}`;
    }
    const stepProcesingInfo = {
      stepName: curStepName,
      curStepType: curStepType,
      hasMenuElements: hasMenuElements,
      elements: elements,
    }
    return stepProcesingInfo;
  }
  StepInfo(){        
    return this.currentStepInfo;
  }
  get handleSpecialInst(){
    return this.specInstSet;
  }
  set handleSpecialInst(val){
    this.specInstSet=val;
  }

  set specialInstructions(instr){
    this.pizzaOrder.currentPizza.SpecialInstructions = instr;
    if(instr!==''){
      this.specInstSet = false;
    }        
  }
  ProcessAction(val){
    /* ownerType, ownerName, targetType, targetName, hasSpecial, trigger*/
    //types: menu|edit|review|special[remove|change|complete|cancel]
    //names: {item}|{pizzaID}|pizza|order|special[mainpage|storeselect|restart|order|name|revieworder]
    //trigger: goto|special|remove|change|complete|cancel
    const action = val.action;
    const selections = val.selections;
    
    if(action.hasSpecial){
      return this.ProcessSpecial(val);
    } else {
      if(action.actionType==='next'){
        return this.GoToNextStep(action.targetType, action.targetName, action.ownerType, action.ownerName, selections);
      } else if(action.actionType==='prev'){
        return this.GoToPrevStep(action.targetType, action.targetName, action.ownerType, action.ownerName);
      }
    }
  }
  ProcessSpecial(val){
    const chck = val.action.hasSpecial.hasOwnProperty('msgClass');
    const retDef={msg:'No special return message', trigger:'pizzabuilder'};
    if(chck){
      //setup for special step
      this.isSpecialStep = true;
      this.specialStep = val.action.hasSpecial;
      retDef.msg = `Going to ${this.specialStep.trigger}`;
    } else {
      //execute special step
      this.isSpecialStep = false;
      this.specialStep = null;
      if(val.action.actionType==='prev'){
       return this.GoToPrevStep(val.action.targetType, val.action.targetName)
      } else {
        //dispose of action
       return this.handleSpecialActions(val);
      }
    }
    
    return retDef;
  }
  GoToNextStep(newType, newName, prevType, prevName, selections){
    const ret={msg:'', trigger:'pizzabuilder'};
    //handle selections
    if(prevType==='menu'||prevType==='edit'){
      const items = {type:prevName, selected:selections};
      ret.msg = this.pizzaOrder.setPizzaItems(items);
    }
    if(newType==='menu'){
      //change menustep
      this.currentStepInfo = this.changeMenuStep(newName);      
    } else if(newType==='special'){
      //change step to special instruction step
      this.currentStepInfo = this.setSpecialInstStep();      
    } else if(newType==='new'){
      
      return this.addnewpizza();
    } else if(newType==='edit'){
      //go to edits
    } else if(newType==='review'){
      //go to review

    }
    return ret;
  }
  GoToEditStep(val){
    const ret={msg:'Going to edit step', trigger:'pizzabuilder'};

    return ret;
  }
  GoToReviewStep(val){
    const ret={msg:'Going to review step', trigger:'pizzabuilder'};

    return ret;
  }
  GoToPrevStep(newType, newName, prevType, prevName){
    const ret={msg:'Going to previous step--', trigger:'pizzabuilder'};
    if(newType==='menu'){
      this.changeMenuStep(newName);
    } else if(newType==='edit') {
      //go to edits

    }
    return ret;
  }
  setSpecialInstStep(){
    const curStep = {
      type: 'review',
      name: 'pizza',            
    }
    const prevStep = {
      type: 'menu',
      name: this.menuStep[this.menuStep.length-1], 
    }    
    const nextStep = {
      type:'',
      name:'',
    }    
    const stepInfo = {
      currentStep: curStep,
      prevStep: prevStep,
      nextStep: nextStep,
      isRetRevO: false,
    }
    return stepInfo;
  }
  changeMenuStep(step){
    const i = this.menuStep.findIndex((s)=>s===step);
    if(i===-1) return null;
    
    const curStep = {
      type: 'menu',
      name: this.menuStep[i],            
    }
    const prevStep = {
      type: 'menu',
      name: this.menuStep[i-1], 
    }
    if(i===0){
      prevStep.type='chatbot';
      prevStep.name='2'
    }
    const nextStep = {
      type:'menu',
      name:this.menuStep[i+1],
    }
    if (i===this.menuStep.length-1){
      nextStep.type='special'
      nextStep.name='instruction'
    }
    const stepInfo = {
      currentStep: curStep,
      prevStep: prevStep,
      nextStep: nextStep,
      isRetRevO: false,
    }
    return stepInfo;    
  }
  addnewpizza(){     
    this.currentStepInfo = this.changeMenuStep('crusts')
    this.specialSet = false;
    this.currentPizzaID = this.pizzaOrder.MakeNewPizza();
    this.currentSelectedItems = [];
    const ret={msg:'Adding a new pizza', trigger:'pizzabuilder'};

    return ret;
  }
  handleSpecialActions(val){
    const type = val.action.targetType;
    const name = val.action.targetName;
    const ret={msg:'Special action message', trigger:'pizzabuilder'};
    switch(type){
      case 'cancel':
        switch(name){
          case 'mainpage':
            ret.msg = 'Going to main page';
            ret.trigger = 'cancel';
            break;
          case 'storeselect':
            ret.msg = 'Going to store select';
            ret.trigger = 'cancel';
            break;            
          case 'restart':
            ret.msg = 'Restarting this order';
            ret.trigger = 'cancel';
            break;
          default:
        }
        break;
      case 'complete':
        ret.msg = 'Completing order';
        ret.trigger = 'endmsg1';
        break;      
      case 'change':
        //call go to review step to set current step = review order
        //
        ret.msg = 'Changing order name';
        ret.trigger = '2';
        break;               
      case 'remove':
        switch (name){
          case 'restart':
            ret.msg = 'Restarting pizza';
            ret.trigger = 'remove';
            break;
          case 'remove':
            ret.msg = 'Removing Pizza';
            ret.trigger = 'remove';
            break;
          default:
        }
        break;
      default:
    }
    return ret;
  }
  
}
export default OrderControl;