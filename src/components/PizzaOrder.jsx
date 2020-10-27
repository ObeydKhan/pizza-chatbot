import Pizza from './Pizza';
class PizzaOrder {
  constructor() {
    this.orderName= '';
    this.pizzas= [];
    this.pizzaCnt = 0;
    this.lastID = 0;
    this.currentPizza = null;        
  }
  set Name(value){    
    this.orderName= value;
  }  
  get Name(){
    return this.orderName;  
  }
  get PizzaCnt(){
    return this.pizzaCnt;
  }  
  get NextPizzaID(){
    return this.lastID+1;
  }
  
  get NewPizza(){    
    return new Pizza(this.lastID+1);
  }
  get PizzaList(){    
    return this.pizzas.map((p)=>{
      return p.PizzaID;
    });
  }
  set UpdatePizzas(pizza){
    const id = pizza.PizzaID;
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      //Override existing pizza
      this.pizzas.splice(i,1,pizza);
    }
    else {
      this.lastID = pizza.PizzaID;
      this.pizzaCnt = this.pizzas.push(pizza);
    }
  }
  set CurrentPizza(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.currentPizza = this.pizzas[i];
    } else {
      this.currentPizza = null;
    }
  }
  get CurrentPizzaID(){
    if(this.currentPizza!==null){
      return this.currentPizza.PizzaID;
    }
    return 0;
  }
  setPizzaItems(val){
    const itemType = val.type;
    const itemSelc = val.selected;
    
    if(itemSelc.length===0){
      return `No ${itemType} added`

    } else {
      return `Added some stuff`;
    }
  }
  getPizzaItems(type){
    const items = this.currentPizza.GetPizzaItem(type);
    if(items===`No ${type}`){
      return false;
    }
    return items;
  }
  CancelPizza(){
    this.currentPizza = null;
    return 0;
  }
  MakeNewPizza(){
    this.currentPizza = this.NewPizza;
    return this.CurrentPizzaID;
  }
  AddPizzaToOrder(){
    this.UpdatePizzas = this.currentPizza;
  }
  ReturnPizzaItems(items){
    return this.currentPizza.GetPizzaItem(items);
  }
  SavePizzaItems(items){
    this.currentPizza.PizzaItems = items;
  }
  GetPizza(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      return this.pizzas[i]
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
  }
  get CurrentPizzaString(){
   return this.currentPizza.PizzaString;
  }
  GetPizzaString(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i===-1){
      return `No pizza ${id}`;
    }
    const pizza = this.pizzas[i];
    return pizza.PizzaString;
  }  
}

export default PizzaOrder;
