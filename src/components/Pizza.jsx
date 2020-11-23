class Pizza {
  constructor(id){
    this.id = id;
    this.items = {};       
    this.specinst=null;   
  }
  set PizzaItems(props) {
    const t = props.type;
    const values = props.values    
    if(values.length===0&&this.items.hasOwnProperty(t)) {
      delete this.items[t];
    } else {
      this.items[t]=values;
    }        
  }
  GetPizzaItems(type){
    if(this.items===null||!this.items.hasOwnProperty(type)) {
      return {id: ''};
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
      specinst: this.specinst,      
    });
  } 
} 

export default Pizza;