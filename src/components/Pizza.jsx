
class Pizza {
  constructor(id){
    this.id = id;
    this.items = {};    
    this.specinst='';
    this.templist = {};
  }
  EditSelections(type){
    switch(type){
    case 'save':
      //do nothing
      break;
    case 'drop':
      //reverse changes
      if(this.items.hasOwnProperty(type)){
        this.items[type] = this.templist[type];
      }
      break;
    default:
      //create temp list to save existing items
      if(this.items.hasOwnProperty(type)){
        this.templist[type] =this.items[type];
      }
    }             
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
    return this.arrayBuild(type, select);
  }
  arrayBuild(type,array){
    if(array.length===0||array===null||array===undefined){
      return [];
    }
    const str = array.shift();
    const z = str.indexOf('-0');
    if(str===''||str==='0'||z!==-1){
      return [].concat(this.arrayBuild(type,array));
    }
    const out = `${type}-${str}`;
    return [out].concat(this.arrayBuild(type,array))
  }
  arrayReduce(array){
    if(array.length===0||array[0].id===''){
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
    const updItem = this.updateItem(itemInfo, curItem[0]);
    if (updItem.id==='') return [];
    return [].concat(updItem);
  }
  multiItemSelect(itemInfo){
    const type = itemInfo.item;
    const curItemArry = [].concat(this.getSelectedItems(type));
    if(curItemArry.length===1&&curItemArry[0].id===''){
      return [].concat(this.updateItem(itemInfo,curItemArry[0]))
    }
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
    const updItem = {id: '',qty:'',half:'',};
    const itemValues = {
      id:itemInfo.id,
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
      return [].concat({id: '',qty:'',half:'',});
    }
    return [].concat(this.items[type]);
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