import Pizza from './Pizza';
class PizzaOrder {
  constructor() {
    this.orderName= '';
    this.pizzas= [];    
    this.lastID = 0;
    this.currentPizza = null;        
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
    this.orderName= name;
    this.MakeNewPizza();
  }
  CancelOrder(){
    this.orderName= '';
    this.pizzas= [];    
    this.lastID = 0;
    this.currentPizza = null;
  }
  CancelPizza(){
    this.currentPizza = null;    
  }
  MakeNewPizza(){
    this.currentPizza = new Pizza(this.lastID+1);
  }
  SavePizzaToOrder(){    
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
  set SaveItemChanges(val){
    this.currentPizza.SaveItemChanges =val;
  }  
  SelectPizzaItems(values){
    return this.currentPizza.SelectPizzaItems(values);
  }
  SelectionArray(type){
    return this.currentPizza.SelectionArray(type);
  }
  ChangeCurrentPizza(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.currentPizza =this.pizzas[i];
      return this.currentPizza
    } else {
      return null;
    }
  }
  RemovePizza(id){    
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.pizzas.splice(i,1);
      this.pizzaCnt = this.pizzas.length();
    }
    if(this.currentPizza.PizzaID===id){
      this.CancelPizza();
    }
  }
  get CurrentPizzaString(){  
   return this.currentPizza.PizzaInfo;
  }
  GetPizzaString(id){
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
