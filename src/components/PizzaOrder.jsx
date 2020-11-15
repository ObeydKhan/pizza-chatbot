import Pizza from './Pizza';
class PizzaOrder {
  constructor() {
    this.orderName= false;
    this.pizzas= [];    
    this.lastID = 0;
    this.currentPizza = null;
    this.saved=false;                
  }
  set ordername(val){
    this.orderName = val;
  } 
  get ordername(){
    return this.orderName;
  }
  CreateNewPizza(){    
    this.currentPizza = new Pizza(this.lastID+1);
    this.saved=false;               
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
    this.saved=true;
  } 
  set SpecialInstructions(val){
    if(this.currentPizza!==null){
      this.currentPizza.SpecialInstructions = val;
    }    
  }  
  GetCurrentItems(type){
    return this.currentPizza.GetPizzaItems(type);
  }
  set CurrentItems(props){
    if(props){
      this.currentPizza.PizzaItems = props;
    }    
  }
  set CurrentPizza(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.currentPizza =this.pizzas[i];      
    } 
  }
  RemovePizza(id){    
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.pizzas.splice(i,1);      
    }
    if(this.currentPizza!==null&&this.currentPizza.PizzaID===id){
      this.currentPizza=null;
    }
  }
  get CurrentID(){
    if(this.saved){
      return this.currentPizza.PizzaID;
    } else {
      return 'cur';
    }
  }   
  get PizzaCount(){
    return this.pizzas.length;
  }
  get CurrentPizza(){
    return this.currentPizza;
  }
  get PizzaList(){
    return this.pizzas.map((p)=> {return p.PizzaID})
  }
  get OrderSummary(){
    return {name:this.orderName, pizzas:this.pizzas}
  }
}
export default PizzaOrder;
