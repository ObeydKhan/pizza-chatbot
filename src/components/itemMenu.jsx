import Items from '../resources/menuItems.json';
import Options from '../resources/menuOptions.json';
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
  GetUserMsg(props){
    const n = this.GetStepProper(props.type);
    if(!props.hasOwnProperty('items')||props.items===null||props.items===undefined) {
      return `No ${n} selected`
    } else {
      if(props.type==='type'){
        const item = props.items['1'];
        const sID = item.hasOwnProperty('sizes')?item.sizes:false;
        const cID = item.hasOwnProperty('crusts')?item.crusts:false;
        if(!(sID&&cID)){return `No ${n} selected`}
        const size = Options.sizes;
        const crust = Options.crusts;
        const s = size.find((i)=>(i.id===sID));
        const c = crust.find((i)=>(i.id===cID));
        return `This pizza is a ${s.caption} with ${c.caption} crust`;
      } else {
        const arr = [];
        for (const x in props.items){
          arr.push(x)
        }
        if(arr.length===0){return `No ${n} selected`}
        let hasHalf=false;
        const item = Items[props.type];
        const half = item.half?Options.half:false;
        const qty = item.qty?Options.qty:false;
        const msg = props.items.map((i)=>{
          const v = item.values.find((x)=>(x.id===i.id));
          const name = v.caption;          
          const vHalf = half?i.half:'2';
          const vQty = qty?i.qty:'2';
          if(vHalf!==2){hasHalf=true};
          return {name:name, half:vHalf, qty:vQty, hID:parseInt(vHalf)}
        })
        msg.filter((i)=>{return i.name});
        if(msg.length>1){msg.sort((a,b)=>{return a.hID-b.hID});};
        if(msg.length===0){return `No ${n} selected`};
        const retArray = msg.map((i)=>{
          if(!i.name) {return ''};
          return `${i.qty} ${i.name}${hasHalf?` ${i.half}`:''}`
        })
        return retArray.toString();
      }      
    }    
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
      const c = this.checkStep(step);
      const s = c?step:this.getStep(this.getStepNum(step))
      if(s==='specialinstmsg'||s==='ordername'){
        return this.GetStepProper(s)
      } else if(!c){
        return ''
      } else {
        return Items[s].properU
      }
      
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
    if(this.outOfScope) {return false;}
    const step = this.step;
    if(!this.checkStep(step)){return false};
    const info = Items[step];
    return {
      menuType: step,
      botMsg:info.msg,
      caption:info.properU,
      properL:info.properL,
      next:this.GetStepProper('next'),
      prev:this.GetStepProper('prev'),
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
      return '2';
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