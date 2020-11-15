class ItemSelect {
  constructor(type, items, multi, optList){
    this.itemList = [].concat(items);
    this.type = type;
    this.multi = multi; 
    this.private=new privateSelect(optList);   
  }
  set selected(value){
    const item = this.private.MakeItem(value);
    const select = (item)=>{
      if(this.multi){
        const curArray = [].concat(this.itemList);
        if(curArray.length===1&&curArray[0].id===''){
          return [].concat(this.private.updateItem(item,curArray[0]))
        }
        const index = curArray.findIndex((i)=>i.id===item.id);
        if(index===-1){
          return curArray.concat(this.private.updateItem(item,index))
        }
        const curItem = curArray[index];
        const updItem = this.private.updateItem(item, curItem);
        if(updItem.id===''){
          curArray.splice(index,1);
        } else {
          curArray.splice(index,1,updItem);
        }
        return curArray;
      } else{
        return [].concat(this.private.updateItem(item, this.itemList[0]))
      }
    }
    this.itemList = select(item);
  }
  get selected(){
    return this.private.SelectionArray(this.type,this.itemList);
  }
  SaveSelected(){
    return {type:this.type, values:this.itemList}
  }

}
class privateSelect{ 
  optList=null;
  constructor(optList){ 
    this.optList=optList;   
  }
  MakeItem(value){
    const x = value.indexOf(':');
    const type = value.substring(x);  
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
    const ret = {id:0};
    ret.id = type!=='type'?id:'9';
    if(opt){
      ret[opt.type]=opt.id;
    }
    return ret;
  }
  SelectionArray(type, items){
    
    const select = this.arrayReduce(items);    
    return this.arrayBuild(type, select);
  }
  arrayReduce(array){
    if(array.length===0||array[0].id===''){
      return [];
    }
    const item = array.shift();
    const arr = this.optList.map((o)=>{
      if(item.hasOwnProperty(o)) {
        const oID = item[o]
        return `${item.id}:${o}:${oID}`
      }
      return `${item.id}:${o}:0`
    })
    return arr.concat(this.arrayReduce(array))
  }
  arrayBuild(type,array){
    if(array.length===0||array===null||array===undefined){
      return [];
    }
    const str = array.shift();  
    if(str===''||str==='0'||str.indexOf(':0')!==-1){
      return [].concat(this.arrayBuild(type,array));
    }
    const out = `${type}:${str}`;
    return [out].concat(this.arrayBuild(type,array))
  }
  updateItem(itemInfo, curitem){        
    const hasOpt = this.optList.map((o)=>{
      return itemInfo.hasOwnProperty(o)
    });    
    const updItem = {id: ''};
    const itemValues = {id:itemInfo.id};
    this.optList.forEach((e,index) => {
      updItem[e]='0';
      itemValues[e]=hasOpt[index]?itemInfo[e]:'0'
    });      
    if(curitem===-1||curitem.id===''||itemInfo.id!==curitem.id){
      //no current item or change to current item
      this.optList.forEach((e) => {
        updItem[e]=itemValues[e]
      })           
    } else if(itemValues!==curitem){
      //same item: if changing half or qty, update and return
      //else remove selected item
      this.optList.forEach((e,index) => {
        if(hasOpt[index]){updItem[e]=itemValues[e]}        
      })
    } else {
      //items are identical - remove
      this.optList.forEach((e) => {
        updItem[e]='';
      })
    } 
    return updItem;   
  }
}
export default ItemSelect;