import Random from 'random-id';
import Pizza from './Pizza';
import PropTypes from 'prop-types';

class PizzaOrder {

  constructor() {
    this.orderDate= new Date();    
    const mon = this.orderDate.getMonth()+1;
    const day = this.orderDate.getDate()+1;
    const m = mon<10?'0'+mon: mon+ '';
    const d = day<10?'0'+day: day+ '';
    this.shortID='-'+m+d;
    this.receiptNum = Random(8)+this.shortID;
    this.orderName= '';
    this.pickUpID= '';
    this.pizzas= [];
    this.pizzaCnt = 0;
    this.isEdit = false;
    this.editID = 0;      
  }
  set Name(value){    
    this.orderName= value;
    const x =value.indexOf(' ');    
    if(x!==-1){
      const str = value.substring(x+1);
      this.pickUpID= str + this.shortID;
    } else {
      this.pickUpID= value + this.shortID;
    }
  }  
  get Name(){
    return this.orderName;  
  }
  get PizzaCnt(){
    return this.pizzaCnt;
  }  
  get ReceiptNum(){
    return this.receiptNum;
  }
  get PickUpID(){
    return this.pickUpID;
  }
  get NextPizzaID(){
    return this.pizzaCnt+1;
  }
  get CurrentPizza(){
    if(this.PizzaCnt===0){
      return null;
    } 
    return this.pizzas[this.pizzaCnt-1];
  }
  get OrderDate(){
    return this.orderDate;
  }
  get Pizzas(){    
    return this.pizzas;
  }
  set EditID(v){
    this.editID = v;
  }
  get EditID(){
    return this.editID;
  }
  set IsOrderEdit(val){
    this.isEdit = val;
  }
  get IsOrderEdit(){
    return this.isEdit;
  }
  addNewPizza(id){        
    const oSize = this.pizzas.length;
    const cnt = this.pizzaCnt;    
    if(oSize!==cnt){
      new Error("Pizza Array Size Error");
    } else if(id!==(cnt+1)){
      new Error("New Pizza ID Error");
    } else {
      const p = new Pizza(id);
      this.pizzas = this.pizzas.concat(p);
      this.pizzaCnt++;
      return p;
    }
  }
  selectPizza(id){
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      return this.pizzas[i]
    }
    else {
      return null;
    }
  }
  editPizza(pizza){
    const newID = pizza.PizzaID;
    const i = this.pizzas.findIndex(p => p.PizzaID === newID);
    if(i!==-1){
      const p = pizza;      
      this.pizzas.splice(i,1,p);
    }
  }
  removePizza(id){    
    const i = this.pizzas.findIndex(p => p.PizzaID === id);
    if(i!==-1){
      this.pizzas.splice(i,1);
      this.pizzaCnt--;
    }
  }
  getPizza(id){
    const pizza = this.pizzas.filter(p => p.PizzaID === id)[0];
    if(pizza===null){
      return null;
    }
    const title = 'Pizza #'+ pizza.PizzaID + ' is a:';
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
