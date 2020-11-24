class PizzaOrder {
  constructor() {
    this.orderName= false;
    this.pizzas= [];    
    this.lastID = 0;                        
  }
  get NewOrder(){
    const n = new PizzaOrder();
    return n;
  }
  UpdateOrder = (props) => {
    switch(props.item){
      case 'name':
        this.orderName = props.name;
        break;      
      case 'savePizza':
        const pizza = props.pizza;
        const id = pizza.PizzaID
        if(id===0){
          pizza.PizzaID = this.lastID+1;
          this.lastID++;
        }
        this.pizzas = SavePizzaToOrder(props.pizza, this.pizzas);
        break;      
      case 'removePizza':
        if(props.id!==0){           
          const i = this.pizzas.findIndex(p => p.PizzaID === props.id);    
          if(i!==-1){
            this.pizzas.splice(i,1);      
          }
        }  
        break;
      default:        
    }
    return this;
  }
  GetPizzaByID(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      return this.pizzas[i];      
    } else {
      return false;
    }
  }
  set ordername(val){
    this.orderName = val;
  }   
  get ordername(){
    return this.orderName;
  }      
  get PizzaCount(){
    return this.pizzas.length;
  }  
  get PizzaList(){
    return this.pizzas.map((p)=> {return p.PizzaID})
  }
  get OrderSummary(){
    return {name:this.orderName, pizzas:this.pizzas, cnt:this.pizzas.length}
  }
}
export default PizzaOrder;

function SavePizzaToOrder(current, all){    
  if(current===null) return null;      
  const id = current.PizzaID;
  const i = all.findIndex(p => p.PizzaID === id);
  if(i!==-1){
    //Override existing pizza
    return all.splice(i,1,current);
  }
  else {    
    return all.concat(current);
  }  
}