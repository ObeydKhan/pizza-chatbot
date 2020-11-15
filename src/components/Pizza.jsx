
class Pizza {
  constructor(id){
    this.id = id;
    this.items = {};    
    this.specinst='';   
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
      return {id: '',qty:'',half:'',};
    }
    return this.items[type];
  }     
  get Pizza(){
    return this;
  }
  set SpecialInstructions(value){
    this.specinst=value;
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