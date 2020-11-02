import Menu from './pizzaMenu.json';
class itemMenu{
  constructor(){
    this.menu = Menu;
    
    const arr = function(obj) {      
      let x;
      let ret = [];
      for (x in obj){
        ret = ret.concat(x); 
      }
      return ret;
    };    
    this.menuSteps = arr(this.menu.menuSteps);         
  }

  get MenuSteps(){
    return this.menuSteps;
  }
  GetItemName(type,id){
    const items = this.menu.menuSteps[type];
    const val = items.values.find((i)=>i.id===id);
    return val.name;
  }
  GetItemID(type,name){
    const items = this.menu.menuSteps[type];
    const val = items.values.find((i)=>i.name===name)
    return val.id;
  }
  GetOptMsg(type, id){
    //if(id==='0') return '';
    const items = this.menu.options[type];
    const val = items.find((i)=>i.id===id)
    return val.name;
  }
  getStepMessage(step){
    const proper = this.menu.menuSteps[step].properL;
    if(this.getHasMultipleSelect(step)){
     return `Please select the combination of ${proper} you would like on the pizza`;
    } else {      
      return `Please select a ${proper} for the pizza`;
    }
  }
  getContentType(step){
    if( this.getHasQty(step)|| this.getHasHalf(step)){
      return 'multi';
    } else {
      return 'simple';
    }
  }
  getStepElements(step){    
    if(this.menuSteps.findIndex(s => s === step)===-1) return null;    
    if( this.getHasQty(step)|| this.getHasHalf(step)){
     return this.buildMultRowStep(step,this.getHasHalf(step),this.getHasQty(step));
    } else {
      return this.buildSimpleStep(step);
    }
  }
  getNext(step){
    const i = this.menuSteps.findIndex(s => s === step)
    return this.getStep(i+1);
  }
  getPrev(step){
    const i = this.menuSteps.findIndex(s => s === step)
    return this.getStep(i-1);
  }
  checkStep(step){
    const i = this.menuSteps.findIndex(s => s === step)
    return i!==-1
  }
  getStep(i){
    if(i>=this.menuSteps.length){      
      return 'EOM';
    } else if(i<0){
      return 'BOM';
    } else {     
      return this.menuSteps[i];      
    }   
  } 
  buildMultRowStep(step, hasHalf, hasQty){
    const items = this.getItemsList(step);
    const itemArry = items.map((i)=> {
      const id = i.id;
      const name = i.short;
      let btns = [];
      if(hasHalf){
        const b = this.buildOptBtns(step, 'half', id);
        btns = btns.concat(b);
      }
      if(hasQty){
        const b = this.buildOptBtns(step, 'qty', id);
        btns = btns.concat(b);
      }
      const itemRow = {
        name:name,
        rClass: `row-item`,
        btns: btns,
      };
      return itemRow;
    })
    return itemArry;
  }
  buildSimpleStep(step){
    const items = this.getItemsList(step);
    const itemArry = items.map((i)=> {   
      const btn = {
        btnClass:'btn-item',
        btnCapt:i.short,
        listKey:`${step}-${i.id}`,
        btnMsg:i.name,
        itemInfo: {
          item:step,
          id:i.id,          
        },        
      };
      return btn;
    })
    return itemArry;
  }
  buildOptBtns(step, opt, itemID){ 
    const optList = this.getOptsList(opt);    
    const btnArry = optList.map((o)=> {
      const itemInfo= {
        item:step,
        id:itemID,
        [opt]:o.id,
      };
      const btn = {
        btnClass:`btn-${opt}-${o.class}`,
        btnCapt: o.short,
        listKey:`${step}-${itemID}-${opt}-${o.id}`,
        btnMsg:o.name,
        btnType: opt,
        itemInfo: itemInfo,
      };
      return btn;
    })
    return btnArry;
  }
  getItemsList(step){
    const obj = this.menu.menuSteps[step];
    const ret = obj.values;
    return ret;
  }  
  getHasSizes(step){
    const obj = this.menu.menuSteps[step];
    const ret = obj.sizes;
    return ret;
  }
  getHasQty(step){
    const obj = this.menu.menuSteps[step];
    const ret = obj.qty;
    return ret;
  }
  getHasHalf(step){
    const obj = this.menu.menuSteps[step];
    const ret = obj.half;
    return ret;
  }
  getHasMultipleSelect(step){
    const obj = this.menu.menuSteps[step];
    const ret = obj.multiple;
    return ret;
  }
  getOptsList(opt){
    const obj = this.menu.options[opt];    
    return obj;
  }
}


export default itemMenu;