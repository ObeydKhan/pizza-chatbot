import Menu from './pizzaMenu.json';

class itemMenu{
  constructor(){
    this.menu = Menu;
    const obj = this.menu.menuSteps;
    const arr = function(obj) {      
      let x;
      let ret = [];
      for (x in obj){
        ret = ret.concat(x); 
      }
      return ret;
    };    
    this.menuSteps = arr(obj);         
  }
  get MenuSteps(){
    return this.menuSteps;
  }
  getMenuStep(step){    
    const hasQty = this.getHasQty(step);
    const hasHalf = this.getHasHalf(step);
    const hasMulti = this.getHasMultiple(step);
    const hasSizes = this.getHasSizes(step);
    let oEle = [];
    if(hasQty||hasHalf){
      oEle = this.buildMultRowStep(step,hasHalf,hasQty);
    } else {
      oEle = this.buildSimpleStep(step);
    }
    let msg = '';
    if(hasMulti){
     msg = `Please select the combination of ${step} you would like on the pizza`;
    } else {
      let single = step.substring(0,step.length-1);
      msg = `Please select a ${single} for the pizza`;
    }
    const n = this.getNext(step);
    const orderStep = {      
      msg: msg,
      next: n==='EOM'?'specialinstmsg':n,
      prev: this.getPrev(step),
      elements: oEle,
      hasRows: (hasHalf||hasQty),
      hasMulti: hasMulti,
      hasSizes: hasSizes,
    };
    return orderStep;
  }
  getNext(step){
    const i = this.menuSteps.findIndex(s => s === step)
    return this.getStep(i+1);
  }
  getPrev(step){
    const i = this.menuSteps.findIndex(s => s === step)
    return this.getStep(i-1);
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
      const name = i.name;
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
        btnCapt:i.name,
        listKey:`${step}-${i.id}`,
        btnMsg:i.name,        
      };
      return btn;
    })
    return itemArry;
  }
  buildOptBtns(step, opt, itemID){ 
    const optList = this.getOptsList(opt);    
    const btnArry = optList.map((o)=> {
      const btn = {
        btnClass:`btn-${opt}-${o.class}`,
        btnCapt: o.short,
        listKey:`${step}-${itemID}-${opt}-${o.id}`,
        btnMsg:o.name
      };
      return btn;
    })
    return btnArry;
  }
  getItemsList(step){
    const obj = this.menu.menuSteps[step];
    return obj.values;
  }  
  getHasSizes(step){
    const obj = this.menu.menuSteps[step];
    return obj.sizes;
  }
  getHasQty(step){
    const obj = this.menu.menuSteps[step];
    return obj.qty;
  }
  getHasHalf(step){
    const obj = this.menu.menuSteps[step];
    return obj.half;
  }
  getHasMultiple(step){
    const obj = this.menu.menuSteps[step];
    return obj.multiple;
  }
  getOptsList(opt){
    const obj = this.menu.options[opt];
    return obj.values;
  }
}


export default itemMenu;