import Items from './menuItems.json';
import Options from './menuOptions.json';
class ItemMenu{
  constructor(){    
    const arr = function(obj) {      
      let x;
      let ret = [];
      for (x in obj){
        ret = ret.concat(x); 
      }
      return ret;
    };    
    this.items = arr(Items);
    this.optList = arr(Options);
    this.stepNum=-1;
    this.outOfScope=false;         
  }
  set step(val){
    if(val==='none')
    {this.outOfScope=true;
    } else {
    this.outOfScope=false;
    this.stepNum=this.getStepNum(val);
    }

  }
  get step(){
    if(this.outOfScope) {return 'none';}
    return this.getStep(this.stepNum);
  }
  GetCaption(src,type,id){
    const item = (m,t,id)=>{
      switch(m){
        case 'items':
        const i = (t)=>{
          switch(t){
            case 'type':
              return Items.type.values;
            case 'sauces':
              return Items.sauces.values;
            case 'cheeses':
              return Items.cheeses.values
            case 'meats':
               return Items.meats.values;
            case 'nonmeats':
              return Items.nonmeats.values;
            default:
              return null;
          }
        }
        const item= i(t);
        const f = item.find((i)=>i.id===id);
        const cap = f===undefined?'':f.caption;  
        return cap
        case 'opts':
          const o = (t)=>{
            switch(t){
              case 'crusts':
                return Options.crusts;
              case 'sizes':
                return Options.sizes;
              case 'qty':
                return Options.qty;
              case 'half':
                 return Options.half;
              case 'allergy':
                return Options.allergy;
              default:
                return null;
            }
          }
          const opt= o(t);
          const a = opt.find((i)=>i.id===id);
          const oc = a===undefined?'':a.caption; 
          return oc
        default:
          return null;}}   
    return item(src,type,id);
  }
  GetDescription(src,type,id){
    const item = (m,t,id)=> {
      switch(m) {
        case 'items':
          const i = (t)=>{
            switch(t){
              case 'type':
                return Items.type.values;
              case 'sauces':
                return Items.sauces.values;
              case 'cheeses':
                return Items.cheeses.values
              case 'meats':
                 return Items.meats.values;
              case 'nonmeats':
                return Items.nonmeats.values;
              default:
                return null;
            }
          }
          const item= i(t);
          const f = item.find((i)=>i.id===id);
          const cap = f===undefined?'':f.description;  
          return cap
          case 'opts':
            const o = (t)=>{
              switch(t){
                case 'crusts':
                  return Options.crusts;
                case 'sizes':
                  return Options.sizes;
                case 'qty':
                  return Options.qty;
                case 'half':
                   return Options.half;
                case 'allergy':
                  return Options.allergy;
                default:
                  return null;
              }
            }
            const opt= o(t);
            const a = opt.find((i)=>i.id===id);
            const oc = a===undefined?'':a.description; 
            return oc
      default:
        return null;
      }
    }
    return item(src,type,id);
  }
  GetStepProper(step){
    if(this.outOfScope) {return 'none';}
    if(step==='specialinstmsg'){
      return 'Special Instructions'
    } else if(step==='ordername'){
      return 'Name'
    } else {     
      const s = this.getStep(this.getStepNum(step))
      if(s==='specialinstmsg'||s==='ordername'){return this.GetStepProper(s)}
      return Items[s].properU
    }
  }
  GetStepTrigger(step){
    if(this.outOfScope) {return 'none';}
    const s = this.getStep(this.getStepNum(step)) 
    if(this.checkStep(s)){
      return 'pizzabuilder'
    } else {
      return s
    }
  }
  get StepObject(){
    if(this.outOfScope) {return null;}
    const step = this.step;
    if(!this.checkStep(step)){return false};
    const info = Items[step];
    const oList = this.optList.filter((o)=>{
      return info[o]
    })
    return {
      name: step,
      botMsg:info.msg,
      properU:info.properU,
      properL:info.properL,
      multi:info.multiple,
      controls: {
        nextTrig:this.GetStepTrigger('next'),
        prevTrig:this.GetStepTrigger('prev'),
        nextName:this.GetStepProper('next'),
        prevName:this.GetStepProper('prev'),
      },
      content: {
        optList:oList,
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
      return this.items[i];      
    }   
  }
  getStepNum(val){
    const i = this.stepNum;
    switch (val){
      case 'next':               
        return i+1;        
      case 'prev':
        return i-1;        
      case 'new':
        return 0;        
      default:
        const s = this.items.findIndex(s => s === val);
        return s<0?this.stepNum:s;        
    }
  }  
  get stepList(){
    return this.items.map((i)=>{
      const name = this.GetStepProper(i);
      return {val:i, name:name}
    });
  } 
}
export default ItemMenu;