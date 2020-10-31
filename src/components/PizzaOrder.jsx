import Pizza from './Pizza';
class PizzaOrder {
  constructor() {
    this.orderName= '';
    this.pizzas= [];    
    this.lastID = 0;
    this.currentPizza = null;
    this.stepsProcessed = 0;   
    this.currentStepInfo = null;
    this.botKeys = [];
    this.addNewPizza = false;            
  }
  set newPizza(val){
    this.addNewPizza = val;
  }
  get newPizza(){
    return this.addNewPizza;
  }
  SetStep(step){
    this.currentStepInfo = step;
  }
  GetStep(){
    return this.currentStepInfo;
  }
  get hasCurrent(){
    return this.currentPizza!==null;
  }
  ProcessStep(stepKey){
    this.stepsProcessed++;
    const bot = `Step-${this.stepsProcessed}: ${stepKey.substring(0,5)}`;
    this.botKeys.push(bot)
    return bot;
  }
  set Name(value){    
    this.orderName= value;
  }  
  get Name(){
    return this.orderName;  
  }  
  get PizzaList(){    
    return this.pizzas.map((p)=>{
      return p.PizzaID;
    });
  }
  get CurrentPizzaID(){
    if(this.currentPizza!==null){
      return this.currentPizza.PizzaID;
    }
    return 0;
  }
  OrderIsStarted(){
    return this.orderName!=='';
  }
  StartNewOrder(name){
    this.CancelOrder();
    if(name===''){
      this.orderName= ' ';
    } else {
      this.orderName= name;
    }    
  }
  CancelOrder(){
    this.orderName= '';
    this.pizzas= [];    
    this.lastID = 0;
    this.currentPizza = null;
    this.stepsProcessed = 0;   
    this.currentStepInfo = null;
    this.botKeys = [];
  }
  SpecialActions(props){
    switch(props.type){
      case 'cancel':
        switch(props.name){
          case 'mainpage':            
            break;
          case 'storeselect':
            break;
          default:
            this.CancelOrder();
        }  
        break;
      case 'remove':
        switch(props.name){
          case 'restart':
            this.currentPizza = null;
            this.MakeNewPizza({type:'', name:'2'})
            break;
          case 'remove':
            const id = this.currentPizza.PizzaID;            
            this.RemovePizza(id);
            break;
          default:
        }
      break;
      default:
    }
  }
  CancelPizza(){
    this.currentPizza = null;    
  }
  MakeNewPizza(prev){    
    this.currentPizza = new Pizza(this.lastID+1);
    this.addNewPizza = false;
  }
  SavePizzaToOrder(){    
    if(!this.hasCurrent) return null;
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
    if(!this.hasCurrent) return null;
    const p = this.currentPizza;
    p.EditSelections(type);
    this.currentPizza = p;
    
  }
  get SpecialInstructions(){
    if(!this.hasCurrent) return null;
    const p = this.currentPizza;
    const ret = p.SpecialInstructions;
    this.currentPizza = p;
    return ret
  } 
  set SpecialInstructions(val){
    if(!this.hasCurrent) return null;
    const p = this.currentPizza;
    p.SpecialInstructions = val;
    this.currentPizza = p;
    
  }
  SelectPizzaItems(values){
    if(!this.hasCurrent) return null;
    const p = this.currentPizza;
    const ret = p.SelectPizzaItems(values);
    this.currentPizza = p;
    return ret;    
  }
  SelectionArray(type){
    if(!this.hasCurrent) return null;
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
    if(this.hasCurrent&&this.currentPizza.PizzaID===id){
      this.CancelPizza();
    }
    const step = {type:'review', name:'order'};
    this.SetStep({current:step, prev:step, next:step})
  }
  GetPizzaItems(type){
    if(!this.hasCurrent) return null;
    const p = this.currentPizza;
    const ret = p.getSelectedItems(type);
    this.currentPizza = p;
    return ret;
  }
  GetPizzaString(id){
    if(isNaN(id)) return this.currentPizza.PizzaInfo;
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i===-1){
      return `No pizza ${id}`;
    }
    const pizza = this.pizzas[i];
    return pizza.PizzaInfo;
  }
  GetOrderSummary(){
    const infoMap= this.pizzas.map((p)=> {return p.PizzaInfo});
    const cnt = infoMap.length;
    return ({
      orderName:this.orderName,
      pizzaCnt: cnt,
      pizzaInfo:infoMap,
    })
  }  
}

export default PizzaOrder;
