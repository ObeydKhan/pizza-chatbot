class Pizza {
  id= 0;
  size='';
  crust='';  
  sauce={type: '', qty: ''};
  cheeses=[];
  toppings= [];  
  specialInstructions='';          
  
  constructor(value){
    this.id = value;    
  }
  set Size(value){
    this.size = value.type;
  }
  set Crust(value) {
    this.crust = value.type;
  }
  set Sauce(props) {
    const t = props.type;
    const q = props.qty;
    if(t!=='None'){
      if(q===this.sauce.qty){
        this.sauce = {type: 'No', qty: ''};
      } else {
        this.sauce = {type: t, qty: q};
      }
    } else {
      this.sauce = {type: 'No', qty: ''};
    }    
  }
  set Cheese(props){
    const t = props.type;
    const q = props.qty;
    const i = this.cheeses.findIndex(cheese => cheese.type === t);
    if(t!=='None'){
      if(i===-1){
        const cheese = {type: t, qty: q};
        this.cheeses = this.cheeses.concat(cheese);
      } else {
        if(this.cheeses[i].qty===q) {
          this.cheeses.splice(i,1);
        } else {
          this.cheeses[i].qty=q;
        }
      }
    } else {
      this.cheeses = [{type: 'No', qty: ''}];
    }
  }
  set Topping(props) {
    const t = props.step;
    const q = props.qty;
    const n = props.type;
    const o = props.on;
    const oMsg = props.onMsg;       
    const i = this.toppings.findIndex(topping => 
      topping.step === t && topping.type===n);
    const newTopping = {step: t, type: n, qty: q, on:o, onMsg:oMsg, };
    if(i===-1){
      if(o!=='N'&& q!=='None'){       
        this.toppings = this.toppings.concat(newTopping);
      }
    } else if(q!=='None'){
      if(o==='N'){
        this.toppings.splice(i,1);
      } else {
        const top = this.toppings[i];
        if(top===newTopping){
          this.toppings.splice(i,1);
        } else {
          this.toppings.splice(i,1, newTopping);
        }
      }                       
    }    
  } 
  set SpecialInstructions(value){
    this.specialInstructions=value;
  }
  get PizzaID(){
    return this.id;
  }
  get Size(){
      return this.size;  
  }
  get Crust(){
      return this.crust;
  }
  get Sauce(){
    return (
      (this.sauce.qty!=='Regular'? this.sauce.qty+ ' ' : '')  + this.sauce.type + ' Sauce'
    );
  }
  get Cheese(){
    const cheeseCnt = this.cheeses.length;
    const chez = this.cheeses.map(cheese => {
      let obj = (
        (cheese.qty!=='Regular'? cheese.qty : '') + ' ' + cheese.type + ' Cheese'
      );
      return obj;
    });       
    let str= '';
    let i;
    for(i=0; i<cheeseCnt; i++){
      str = str + (i===cheeseCnt-1? (i===0?chez[i]:'and '+ chez[i]): chez[i] + ', ');
    }    
    return str;
  }
  get MeatToppings(){
    const meats = this.toppings.map(topping => {
      if(topping.step === 'meats') {
        let obj = (
          ((topping.qty!=='Regular'? topping.qty : '') + ' ' + topping.type)
           + (topping.on==='wp'? '' : ' ' + topping.onMsg)          
        );       
        return obj;        
      } else {
        return '';
      } 
    });
    let str = '';
    let i;
    for(i=0; i<meats.length; i++){
      if(meats[i]!==''){
        str = str + (i===meats.length-1? (i===0?meats[i]:'and '+ meats[i]): meats[i] + ', ');
      }
    }
    if(str===''){
      str= 'No meats';
    }    
    return str;
  }
  get NonMeatToppings(){
    let m = 0;
    const nonmeats = this.toppings.map(topping => {
      if(topping.step === 'nonmeats') {
        let obj = (
          ((topping.qty!=='Regular'? topping.qty : '') + ' ' + topping.type)
           + (topping.on==='wp'? '' : ' ' + topping.onMsg)          
        );       
        return obj;        
      } else {
        m++;
        return '';
      }
    });

    let str='';
    let i;
    for(i=m; i<nonmeats.length; i++){
      if(nonmeats[i]!==''){
        str = str + (i===nonmeats.length-1? (i===m?nonmeats[i]:'and '+ nonmeats[i]): nonmeats[i] + ', ');
      }      
    }
    if(str===''){
      str= 'No non-meats';
    }    
    return str;  
  }
  get SpecialInstructions(){
    if(this.specialInstructions===''){
      return 'No special instructions';
    }
    return this.specialInstructions;
  }
  get PizzaStringArray(){
    const title = 'Pizza #'+ this.PizzaID + ' is a:';
    const pizzaType = this.Size + ' ' + this.Crust;
    const pizzaSauce = this.Sauce;
    const cheese = this.Cheese;
    const meats = this.MeatToppings;
    const nonmeats = this.NonMeatToppings;
    const inst = this.SpecialInstructions;
    return ([title,pizzaType,pizzaSauce,cheese,meats,nonmeats,inst,]);
  }
}

export default Pizza;