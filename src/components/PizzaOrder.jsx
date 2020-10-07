import Random from 'random-id';
import Pizza from './Pizza';
import PropTypes from 'prop-types';

class PizzaOrder {
  #orderName= '';
  #pickUpID= '';
  #receiptNum= '';
  #shortID='';  
  #pizzas= [];
  #orderDate = new Date();
  constructor() {    
    const mon = this.#orderDate.getMonth()+1;
    const day = this.#orderDate.getDate()+1;
    let m = mon+ '';
    let d = day+'';
    if (mon<10){
      m = '0'+mon;
    } 
    if (day<10){
      d = '0'+day;
    }
    this.#shortID='-'+m+d;
    this.#receiptNum = Random(8) +this.#shortID;
  }
  set Name(value){    
    this.#orderName= value;
    const x =value.indexOf(' ');    
    if(x!==-1){
      const str = value.substring(x+1);
      this.#pickUpID= str + this.#shortID;
    } else {
      this.#pickUpID= value + this.#shortID;
    }
  }
  get PizzaCnt(){
    return this.#pizzas.length;
  }
  get Name(){
    return this.#orderName;
  }  
  get ReceiptNum(){
    return this.#receiptNum;
  }
  get PickUpID(){
    return this.#pickUpID;
  }
  get NextPizzaID(){
    return this.#pizzas.length+1;
  }
  get CurrentPizza(){
    if(this.PizzaCnt!==0){
      return this.#pizzas[this.PizzaCnt];
    } else {
      const p = new Pizza(1);
      this.#pizzas= new Array(p);
      return p;
    }
  }
  addPizza(pizza){
    const newID = pizza.PizzaID;
    const i = this.#pizzas.findIndex(p => p.PizzaID === newID);
    if(i===-1){
      this.#pizzas.concat(pizza);
    } else {
      const p = new Pizza(this.NextPizzaID);
      p.Size = pizza.Size;
      p.Crust = pizza.Crust;
      p.Sauce = pizza.Sauce;
      p.Cheese = pizza.Cheese;
      p.MeatToppings = pizza.MeatToppings;
      p.NonMeatToppings = pizza.NonMeatToppings;
      p.SpecialInstructions = pizza.SpecialInstructions;
      this.#pizzas.concat(p);
    }
  }
  editPizza(pizza){
    const newID = pizza.PizzaID;
    const i = this.#pizzas.findIndex(p => p.PizzaID === newID);
    if(i!==-1){
      const p = new Pizza(this.NextPizzaID);
      p.Size = pizza.Size;
      p.Crust = pizza.Crust;
      p.Sauce = pizza.Sauce;
      p.Cheese = pizza.Cheese;
      p.MeatToppings = pizza.MeatToppings;
      p.NonMeatToppings = pizza.NonMeatToppings;
      p.SpecialInstructions = pizza.SpecialInstructions;
      this.#pizzas.splice(i,1,p);
    }
  }
  removePizza(id){    
    const i = this.#pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.#pizzas.splice(i,1);
    }
  }
  getPizza(id){
    const pizza = this.state.pizzas.filter(p => p.PizzaID === id)
    if(pizza===null){
      return null;
    }
    const title = 'Pizza #'+ pizza.PizzaID + ' is:';
    const pizzaType = pizza.Size + ' ' + pizza.Crust;
    const pizzaSauce = pizza.Sauce;
    const cheese = pizza.Cheese;
    const meats = pizza.MeatToppings;
    const nonmeats = pizza.NonMeatToppings;
    
    return ({
      "Title": title,
      "Type": pizzaType,
      "Sauce": pizzaSauce,
      "Cheeses": cheese,
      "Meats": meats,
      "Non-Meats":nonmeats,
    });
  }  
}
PizzaOrder.propTypes = {
  orderName: PropTypes.string,
  pickUpID: PropTypes.string,
  receiptNum: PropTypes.string,
  shortID: PropTypes.string,  
  pizzas: PropTypes.object,
  orderDate: PropTypes.Date,
};

export default PizzaOrder;
