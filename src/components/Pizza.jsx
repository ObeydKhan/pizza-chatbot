class Pizza {
  constructor(id){
    this.id = id;
    this.items = {};
    this.itemMsg = {};       
    this.specinst=null;   
  }
  get NewPizza(){
    const p = new Pizza();
    return p;
  }
  set PizzaItems(props) {
    const t = props.type;
    const values = props.items    
    if(values==={}&&this.items.hasOwnProperty(t)) {
      delete this.items[t];
      delete this.itemMsg[t];
    } else {
      this.items[t]=values;
      this.itemMsg[t]=props.userMsg;
    }        
  }
  GetPizzaItems(type){
    if(this.items===null||!this.items.hasOwnProperty(type)) {
      return null;
    }
    return this.items[type];
  }  
  set SpecialInstructions(value){
    this.specinst=value;
  }
  get SpecialInstructions(){
    if(this.specinst===null){
      return false;
    } else {
      return this.specinst;
    }
  }
  set PizzaID(val){
    this.id = val;
  }  
  get PizzaID(){
    return this.id;
  }
  get PizzaInfo(){    
    return ({
      id: this.id,
      items: this.items,
      itemMsg: this.itemMsg,
      specinst: this.specinst,      
    });
  } 
} 

export default Pizza;