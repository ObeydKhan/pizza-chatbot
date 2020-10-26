import PizzaOrder from './PizzaOrder';
import PizzaMenu from './itemMenu';
import StepFactory from './StepFactory';

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
    this.currentStep = null;
    this.currentPizzaID = 0;
    this.prevStep = null;
    
    this.ProcessAction = this.ProcessAction.bind(this);
    this.ProcessStep = this.ProcessStep.bind(this);    
  }
  get isStarted(){
    return this.start;
  }
  set isStarted(name){
    this.pizzaOrder.Name = name;
    this.addnewpizza();
    this.start = true;
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
  StepControls(){
    return StepFactory(this.currentStep);
  }
  CurrentStep(){
    //returns the current step
    const curStep =this.currentStep;
    const stepOptions = {
      name: curStep.name,
      type: curStep.type,      
      hasElements: false,     
    };
    if(curStep.type==='menu'){
      const ele = this.pizzaMenu.getMenuStep(curStep.name);
      stepOptions.msg = ele.msg;
      stepOptions.hasElements = true;      
      stepOptions.elements = ele.elements;
      stepOptions.hasRows = ele.hasRows;
      stepOptions.hasMulti = ele.hasMulti;
      curStep.next=ele.next;
      curStep.prev = ele.prev;
      curStep.choices = null;
      curStep.secondOrder = false;
    } else if(curStep.type==='edit'){
        curStep.next='';
        curStep.prev='';
      if(curStep.name==='editpizza'){
        curStep.choices = this.pizzaMenu.MenuSteps;
        curStep.secondOrder = this.prevStep.second;        
      } else if(curStep.name==='editorder'){
        curStep.choices = this.pizzaOrder.PizzaList;
        curStep.secondOrder = true;
      }
    }
    this.currentStep = curStep;    
    return stepOptions;
  }  
  ProcessStep(){
    return {
      CurrentStep:this.CurrentStep(),
      StepControls:this.StepControls()
    }
  }
  ProcessAction(val){
    const key = val.key;
    const target = val.target;
    const ref = val.refType;
    const spc = val.spc;  
    this.prevStep = this.currentStep;
    if(!spc){
      alert('Regular Menu Step')
    } else {
      this.functionList[target]();

    }

  }
  cancel(v){
    
    alert(`Cancel ${v}`)
  }
  
  remove(id){

  }
  specialinstmsg(){

  }
  addnewpizza(){
    const curStep = {
      type: 'menu',
      name: 'crusts',
      next: '',
      prev: '',
      choices: null,
      second:false,      
    }
    this.currentStep = curStep;
    this.currentPizzaID = this.pizzaOrder.MakeNewPizza();
  }
  completeorder(){

  }
}
export default OrderControl;