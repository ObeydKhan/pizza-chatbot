import Items from './menuItems.json';
import Options from './menuOptions.json';
class ItemMenu{
  #items=null;
  #step=-1;
  constructor(){    
    const arr = function(obj) {      
      let x;
      let ret = [];
      for (x in obj){
        ret = ret.concat(x); 
      }
      return ret;
    };    
    this.#items = arr(Items);         
  }
  set step(val){
    const i = this.#step;
    switch (val){
      case 'next':
        const x = this.#items.length;        
        this.#step = i+1>=x?x:i+1;
        break;
      case 'prev':
        this.#step = i-1<=0?0:i-1;
        break;
      case 'new':
        this.#step = 0;
        break;
      default:
        const s = this.#items.findIndex(s => s === val);
        this.#step = s<0?0:s;
        break;
    }
  }
  get step(){
    return this.getStep(this.#step);
  }
  GetCaption(src,type,id){
    const item = (m,t,id)=>{
      switch(m){
        case 'items':
          return Items[t].values.find((i)=>i.id===id).caption;
        case 'opts':
          return Options[t].values.find((i)=>i.id===id).caption;
        default:
          return null;}}   
    return item(src,type,id);
  }
  GetDescription(src,type,id){
    const item = (m,t,id)=> {
      switch(m) {
      case 'items':
        return Items[t].values.find((i)=>i.id===id).description;
      case 'opts':
        return Options[t].values.find((i)=>i.id===id).description;
      default:
        return null;
      }
    }
    return item(src,type,id);
  }
  GetStepProper(step){
    if(step==='specialinstmsg'){
      return 'Special Instructions'
    } else if(step==='ordername'){
      return 'Name'
    } else if(step==='next'){      
      const s = this.getStep(this.#step+1);
      return Items[s].properU
    } else if(step==='prev'){
      const s = this.getStep(this.#step-1);
      return Items[s].properU
    } else if(this.checkStep(step)){
      return Items[step].properU
    } else {
      return Items[this.#step].properU
    }
  }
  get StepObject(){
    const step = this.step;
    const info = Items[step];
    return {
      name: step,
      botMsg:info.msg,
      properU:info.properU,
      properL:info.properL,
      multi:info.multiple,
      controls: {
        nextName:this.GetStepProper('next'),
        prevName:this.GetStepProper('prev'),
      },
      content: {
        sizes:info.sizes?Options.sizes:false,
        crusts:info.crusts?Options.crusts:false,
        half:info.half?Options.half:false,
        qty:info.qty?Options.qty:false,
        values:info.values,
        allergy:Options.allergy,
      }
    };
  }  
  checkStep(step){
    const i = this.items.findIndex(s => s === step)
    return i!==-1
  }
  getStep(i){
    if(i>=this.items.length){      
      return 'specialinstmsg';
    } else if(i<0){
      return 'ordername';
    } else {     
      return this.#items[i];      
    }   
  }
  get stepList(){
    return this.#items.map((i)=>{
      const name = this.GetStepProper(i);
      return {val:i, name:name}
    });
  } 
}
export default ItemMenu;