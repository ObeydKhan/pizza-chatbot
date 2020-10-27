
class Pizza {
  constructor(id){
    this.id = id;
    this.pizzaItems = {};    
    this.specialInstructions='';
  }
  set PizzaItems(props) {
    const t = props.type;
    const values = props.values
    this.pizzaItems[t]=values;    
  }
  
  get AvailSizes(){
    if(this.pizzaItems.HasItemType('crusts')){
      return this.pizzaItems.crusts.sizes;
    } else {
      return [0];
    }    
  }
  HasItemType(type){
    if(this.pizzaItems===null) return false;
    return this.pizzaItems.hasOwnProperty(type);     
  }
  GetPizzaItem(type){
    if(this.HasItemType(type)){
      return this.pizzaItems[type];
    } else {     
      return [];
    }
  }  
  get Pizza(){
    return this;
  }
  set SpecialInstructions(value){
    this.specialInstructions=value;
  }
  get SpecialInstructions(){
    return this.specialInstructions;
  }
  get PizzaID(){
    return this.id;
  }
  get PizzaString(){
    const title = 'Pizza #'+ this.id + ' is a:';
    /*this.pizzaItems[t]
    const pizzaType = pizza.Size + ' ' + pizza.Crust;
    const pizzaSauce = pizza.Sauce;
    const cheese = pizza.Cheese;
    const meats = pizza.MeatToppings;
    const nonmeats = pizza.NonMeatToppings;
    const inst = pizza.SpecialInstructions;
    return ({
      title: title,
      type: pizzaType,
      sauce: pizzaSauce,
      cheeses: cheese,
      meats: meats,
      nonMeats:nonmeats,
      inst:inst,
    });*/
    return title;
  } 
} 

export default Pizza;