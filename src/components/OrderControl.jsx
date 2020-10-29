import PizzaOrder from './PizzaOrder';
import PizzaMenu from './itemMenu';

class OrderControl {
  constructor(){  
    this.pizzaOrder = new PizzaOrder(); 
    this.pizzaMenu = new PizzaMenu();   
    this.currentStepInfo = null;
    this.ProcessAction = this.ProcessAction.bind(this);
    this.menuStep = this.pizzaMenu.MenuSteps;       
    this.botKeys = [];
    this.specialStep = null;
           
  }
  get IsSpecialStep(){
    return this.specialStep!==null;
  }  
  set SpecialStep(val){
    if(val===null){
      this.specialStep = null;
    } else {
      this.specialStep = val;      
    }    
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
    return this.pizzaOrder.SelectPizzaItems(val);
  }
  get CurrentStepInfo(){
    const stepInfo = this.currentStepInfo;
    const curStepName = stepInfo.currentStep.name;
    const curStepType = stepInfo.currentStep.type;
    const hasMenuElements = this.menuStep.findIndex((i)=> i===curStepName)!==-1?true:false;
    const elements = hasMenuElements?this.pizzaMenu.getMenuStep(curStepName):null;
    if(hasMenuElements){
      stepInfo.stepMsg = elements.msg;
    } else {
      //do something else to get the message
      stepInfo.stepMsg = `Step ${curStepName} with type ${curStepType}`;
    }
    const getBuildType = (val) => {
      if(val.isSpecialStep) return 'specialStep';
      switch (val.type){
        case 'review':
          return 'reviewStep';
        case 'edit':
          return val.name==='order'?'editOrderStep':'editStep';
        default:
          return 'standard';
      }      
    }
    const buildType = getBuildType({isSpecialStep:this.IsSpecialStep, type:curStepType, name:curStepName});
    const stepProcesingInfo = {
      stepInfo: stepInfo,
      stepMsg: stepInfo.stepMsg,      
      buildType: buildType,
      hasMenuElements: hasMenuElements,
      elements: elements,
    }
    return stepProcesingInfo;
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
    const action = val.input;
    const botKey = val.key;
    const botID = val.stepID;
    const newKey = `${botID}-${botKey.subString(0,7)}`;
    this.botKeys.push(newKey);
    
    if(action.hasSpecial){
      return this.ProcessSpecial(val);
    } else {
      if(action.actionType==='next'){
        return this.GoToNextStep(action.targetType, action.targetName, action.ownerType, action.ownerName);
      } else if(action.actionType==='prev'){
        return this.GoToPrevStep(action.targetType, action.targetName, action.ownerType, action.ownerName);
      } else if(action.actionType==='edit'){

      }else if(action.actionType==='review'){

      }
    }

    return {msg:'', trigger:'', botKey:newKey}
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
  GoToNextStep(newType, newName, prevType, prevName){
    const ret={msg:'', trigger:'pizzabuilder'};
    //handle selections
    if(prevType==='menu'||prevType==='edit'){
      this.pizzaOrder.SaveItemChanges = true;
    }
    if(newType==='menu'||newType==='special'){
      //change menustep
      this.currentStepInfo = this.changeMenuStep(newName);          
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
    if(prevType==='menu'||prevType==='edit'){
      this.pizzaOrder.SaveItemChanges = false;
    }
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
 
  changeMenuStep(step){
    const curStep = {}
    const prevStep ={}
    const nextStep ={}
    if(step==='instruction'){
      curStep.type= 'review';
      curStep.name= 'pizza';
      prevStep.type='menu';
      prevStep.name=this.menuStep[this.menuStep.length-1];
      nextStep.type='';      
      nextStep.name='';
    } else {
      const i = this.menuStep.findIndex((s)=>s===step);

      if(i===-1) return null;
      curStep.type= 'menu';
      curStep.name= this.menuStep[i];
      if(i===0){
        prevStep.type='chatbot';
        prevStep.name='2'
      } else {
        prevStep.type='menu';
        prevStep.name=this.menuStep[i-1];
      }
      if (i===this.menuStep.length-1){
        nextStep.type='special'
        nextStep.name='instruction'
      } else {
        nextStep.type='menu';      
        nextStep.name= this.menuStep[i+1];
      }
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
    this.currentStepInfo = this.changeMenuStep(this.menuStep[0])
    this.currentPizzaID = this.pizzaOrder.MakeNewPizza();    
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