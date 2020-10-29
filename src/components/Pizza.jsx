
class Pizza {
  constructor(id){
    this.id = id;
    this.items = {};    
    this.specinst='';
    this.itemslist = {};
  }
  set SaveItemChanges(val){
    if(val){
      this.itemslist =this.items;
    } else {
      this.items=this.itemslist;
    }
  }
  set PizzaItems(props) {
    const t = props.type;
    const values = props.values    
    if(values.length===0&&this.items.hasOwnProperty(t)) {
      delete this.items[t];
    }
    this.items[t]=values;    
  }
  SelectPizzaItems(values){
    const hasMulti = values.multi;
    const itemInfo = values.itemInfo;    
    const items = hasMulti?this.multiItemSelect(itemInfo):this.singleItemSelect(itemInfo);
    this.PizzaItems = {type:itemInfo.item, values:items}    
    //returns selection array
    return this.SelectionArray(itemInfo.item);
  }
  SelectionArray(type){
    const curItemArry = [].concat(this.getSelectedItems(type));
    const select = this.arrayReduce(curItemArry);    
    return this.arrayBuild(select);
  }
  arrayBuild(type,array){
    if(array.length===0){
      return [];
    }
    const str = array.shift();
    const z = str.indexOf('-0');
    if(str===''||str==='0'||z!==-1){
      return [].concat(this.arrayBuild(array));
    }
    const out = `${type}-${str}`;
    return [out].concat(this.arrayBuild(array))
  }
  arrayReduce(array){
    if(array.length===0){
      return [];
    }
    const item = array.shift();
    const init=`${item.id}`;
    const q =`${item.id}-qty-${item.qty}`;
    const h = `${item.id}-half-${item.half}`;
    const arr = [init, q, h];
    return arr.concat(this.arrayReduce(array))
  }
  singleItemSelect(itemInfo){
    const type = itemInfo.item;
    const curItem = this.getSelectedItems(type);
    const updItem = this.updateItem(itemInfo, curItem);
    if (updItem.id==='') return [];
    return [].concat(updItem);
  }
  multiItemSelect(itemInfo){
    const type = itemInfo.item;
    const curItemArry = [].concat(this.getSelectedItems(type));
    const index = curItemArry.findIndex((i)=>i.id===itemInfo.id);
    if(index===-1){
      return curItemArry.concat(this.updateItem(itemInfo,index))
    }
    const curItem = curItemArry[index];
    const updItem = this.updateItem(itemInfo, curItem);
    if(updItem.id===''){
      curItemArry.splice(index,1);
    } else {
      curItemArry.splice(index,1,updItem);
    }
    return curItemArry;
  }
  updateItem(itemInfo, curitem){        
    const hasQty = itemInfo.hasOwnProperty('qty');
    const hasHalf = itemInfo.hasOwnProperty('half');
    const updItem = this.getSelectedItems('empty');
    const itemValues = {
      id:itemInfo.itemID,
      qty:hasQty?itemInfo.qty:'0',
      half:hasHalf?itemInfo.half:'0',
    };
    if(curitem===-1||curitem.id===''||itemInfo.id!==curitem.id){
      //no current item or change to current item
      updItem.id = itemValues.id;
      updItem.half = itemValues.half;
      updItem.qty = itemValues.qty;      
    } else {
      //same item: if changing half or qty, update and return
      //else remove selected item
      if(hasHalf){
        //change the selected half
        updItem.half = itemValues.half;
      } else if(hasQty&&itemValues.qty!==curitem.qty){
        //change selected qty
        updItem.qty = itemValues.qty
      } else {
        //items are identical - remove
        updItem.id = '';
        updItem.half = '';
        updItem.qty = '';
      }      
    }
    return updItem;   
  }
  getSelectedItems(type){
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
  get SpecialInstructions(){
    return this.specinst;
  }
  get PizzaID(){
    return this.id;
  }
  get PizzaInfo(){    
    return ({
      id: this.id,
      items: this.itemslist,
      specinst: this.specinst,      
    });
  } 
} 

export default Pizza;