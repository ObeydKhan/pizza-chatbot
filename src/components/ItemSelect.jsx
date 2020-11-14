class ItemSelect {
  #itemList=null;
  #type=null;
  #multi=null;  

  constructor(type, items, multi){
    this.#itemList = items;
    this.#type = type;
    this.#multi = multi;    
  }
  set selected(value){
    const item = MakeItem(value);
    const select = (item)=>{
      if(this.#multi){
        const curArray = [].concat(this.#itemList);
        if(curArray.length===1&&curArray[0].id===''){
          return [].concat(this.updateItem(item,curArray[0]))
        }
        const index = curArray.findIndex((i)=>i.id===item.id);
        if(index===-1){
          return curArray.concat(this.updateItem(item,index))
        }
        const curItem = curArray[index];
        const updItem = this.updateItem(item, curItem);
        if(updItem.id===''){
          curArray.splice(index,1);
        } else {
          curArray.splice(index,1,updItem);
        }
        return curArray;
      } else{
        return [].concat(updateItem(item, this.#itemList))
      }
    }
    this.#itemList = select(item);
  }
  get selected(){
    return SelectionArray(this.#type,this.#itemList);
  }
  SaveSelected(){
    return {type:this.#type, values:this.#itemList}
  }
}
function MakeItem(value){
  const x = value.indexOf(':');  
  const id = value.substring(x+1,x+2);  
  const y = value.indexOf(':',x+1);
  const getOpt = (i)=> {
    if(i===-1) {return false}
    const optStr = value.substring(y+1);
    const z = optStr.indexOf(':');
    const oType = optStr.substring(0,z);
    const oID = optStr.substring(z+1);
    return {type:oType, id:oID};
  } 
  const opt = getOpt(y);
  const ret = {id:0, half:0, qty:0};
  ret.id = id;
  if(opt){
    ret[opt.type]=opt.id;
  }
  return ret;
}

function SelectionArray(type, items){
  const select = arrayReduce(items);    
  return arrayBuild(type, select);
}
function arrayReduce(array){
  if(array.length===0||array[0].id===''){
    return [];
  }
  const item = array.shift();
  const init=`${item.id}`;
  const q =`${item.id}:qty:${item.qty}`;
  const h = `${item.id}:half:${item.half}`;
  const arr = [init, q, h];
  return arr.concat(arrayReduce(array))
}
function arrayBuild(type,array){
  if(array.length===0||array===null||array===undefined){
    return [];
  }
  const str = array.shift();  
  if(str===''||str==='0'||str.indexOf(':0')!==-1){
    return [].concat(arrayBuild(type,array));
  }
  const out = `${type}:${str}`;
  return [out].concat(arrayBuild(type,array))
}
function updateItem(itemInfo, curitem){        
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
export default ItemSelect;