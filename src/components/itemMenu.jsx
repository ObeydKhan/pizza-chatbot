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
        const x = this.items.length;        
        return i+1>=x?x:i+1;        
      case 'prev':
        return i-1<=0?0:i-1;        
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