import PizzaOrder from './PizzaOrder';
import PizzaMenu from './itemMenu';

class OrderControl {
  functionList = {
    menu: (v)=>this.pizzastep(v),
    special: (v)=>this.special(v),
    cancel: (v)=>this.cancel(v),    
    delete: (v)=>this.remove(v),    
    addnew:(v)=>this.addnewpizza(v),
    edit: (v)=>this.edit(v),
    review: (v)=>this.review(v),
    completeorder:()=>this.completeorder(),
  };
  constructor(){  
    this.pizzaOrder = new PizzaOrder(); 
    this.pizzaMenu = new PizzaMenu();          
    this.start = false;
    this.stepInfo = null;        
    this.currentPizzaID = 0;
    this.ProcessAction = this.ProcessAction.bind(this);
    this.menuStep = this.pizzaMenu.MenuSteps;
    this.stepMsg = '';
    this.specialSet = false;
    this.currentBotKey = '';
    this.botKeys = [];    
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
  HasSelected(){
    const name = this.currentStep.name;
    const items = this.pizzaOrder.getPizzaItems(name);
    if(!items){
      return []
    }
    return items;
  }
  RestartOrder(){       
    this.pizzaOrder = new PizzaOrder();
    return this;
  }
  StepMsg(){
    return this.stepMsg;
  }
  CurrentStep(){
    const curStepName = this.stepInfo.currentStep.name;
    const curStepType = this.stepInfo.currentStep.type;
    const hasMenuElements = this.menuStep.findIndex((i)=> i===curStepName)!==-1?true:false;
    const elements = hasMenuElements?this.pizzaMenu.getMenuStep(curStepName):null;
    if(hasMenuElements){
      this.stepMsg = elements.msg;
    } else {
      //do something else to get the message
      this.stepMsg = `Step ${curStepName} with type ${curStepType}`;
    }
    const stepInfo = {
      stepName: curStepName,
      curStepType: curStepType,
      hasMenuElements: hasMenuElements,
      elements: elements,
    }
    return stepInfo;
  }
  StepInfo(){        
    return this.stepInfo;
  }
  get handleSpecial(){
    return this.specialSet;
  }
  set handleSpecial(val){
    this.specialSet=val;
  }

  set specialInstructions(instr){
    this.pizzaOrder.currentPizza.SpecialInstructions = instr;
    if(instr!==''){
      this.specialSet = false;
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
      this.ProcessSpecial(val);

    } else {
      if(action.actionType==='next'){
        this.GoToNextStep(action.targetType, action.targetName, selections);
      } else if(action.actionType==='prev'){
        this.GoToPrevStep(action.targetType, action.targetName);
      }
    }
  }
  ProcessSpecial(val){

  }
  GoToNextStep(type, name, selections){
    
    if(type==='menu'){
      this.changeMenuStep(name);
    } else if(type==='special'){
      this.stepInfo = this.setSpecialStep();
    }
  }
  GoToPrevStep(type, name){
    if(type==='menu'){
      this.changeMenuStep(name);
    }
  }
  setSpecialStep(){
    const curStep = {
      type: 'special',
      name: 'specialinstmsg',            
    }
    const prevStep = {
      type: 'menu',
      name: this.menuStep[this.menuStep.length-1], 
    }    
    const nextStep = {
      type:'review',
      name:'pizza',
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
    this.stepInfo = stepInfo;
   
  }
  addnewpizza(){     
    this.changeMenuStep('crusts')
    this.specialSet = false;
    this.currentPizzaID = this.pizzaOrder.MakeNewPizza();
  }
  
}
export default OrderControl;