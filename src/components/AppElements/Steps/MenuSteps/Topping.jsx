import React from 'react';
import {StaticRowElement, StaticTitle} from '../../Elements/index';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width:'100%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
function initializeSelection(initial){
  const selected = initial.selected;  
  const isSel = selected!==null&&selected!==undefined;
  const ret = {};
  
  if(isSel){
    const menuType = initial.menuType;
    const selMenuType = selected.hasOwnProperty(menuType)?selected[menuType]:false;
    if(selMenuType){      
      const items = initial.itemList.filter((i)=>(selMenuType.hasOwnProperty(i.id)));
      if(items!==null&&items!==undefined){
        const selItem = items.map((i)=>{
          const id = i.id;
          const sel = selMenuType[id];
          const q = sel.hasOwnProperty('qty')?sel.qty:'2';
          const h = sel.hasOwnProperty('half')?sel.half:'2';
          return {id:id, qty:q, half:h};
        });      
        selItem.forEach(e => {
          const val = {qty:e.qty, half:e.half};
          ret[e.id]=val;
        });        
      }     
    }
  } 
  return ret;
}
export default function ToppingStep(props){
  const classes = useStyles();    
  const updateItem = props.updateItem;
  const stepData = props.stepData;
  const type = stepData.menuType;
  const itemTypeCaption = stepData.caption;  
  
  const [items, setItems] = React.useState('0');  
  const [initialized, setInitialzied] = React.useState(false);
  const initialSelect = (p)=>{
    return initializeSelection(p)
  }
  if(!initialized){
    const ini = initialSelect({selected:props.selected,menuType:type, itemList:stepData.content.values})
    setItems(ini);    
    setInitialzied(true)
  }
  const handleMenuSelect = (input)=>{
    const chk = (p)=>{
      const id = p.itemID;
      const type = p.type;
      const val = p.value;
      const hasItem =items.hasOwnProperty(id);      
      const itemVal = {qty:'0', half:'0'};      
      const ret = {itemID:'0', values:itemVal};      
      if(hasItem){
        const e = items[id];
        itemVal.qty=e.qty;
        itemVal.half = e.half;
      }
      if(type==='qty'&&itemVal.qty!==val){        
        itemVal.qty = val;
        items[id] =itemVal
        ret.itemID = id;
        ret.values= itemVal;
        setItems(items);
        return ret;
      } else if(type==='half'&&itemVal.half!==val){
        itemVal.half = val;
        items[id] =itemVal
        ret.itemID = id;
        ret.values= itemVal;
        setItems(items);        
        return ret;
      } else {
        return false
      }
    }
    const doUpdate = chk(input);
    if(doUpdate){      
      updateItem({item:doUpdate,replace:true})
    }
  }
  if(!initialized){return false}
  const maxQty =stepData.content.qty.length;
  const itemRows = stepData.content.values.map((i)=>{
    const id = i.id;
    const name = i.caption;
    const des = i.description;    
    const hasItem =items!==null&&items!==undefined?items.hasOwnProperty(id):false;
    const selItem = hasItem?items[id]:{qty:0,half:2};
    const q = selItem.hasOwnProperty('qty')?selItem.qty:'2';
    const h = selItem.hasOwnProperty('half')?selItem.half:'2';
    const qVal = stepData.content.qty?stepData.content.qty.filter((i)=>(i.id===q))[0]:false;
    const hVal = stepData.content.half?stepData.content.half.filter((i)=>(i.id===h))[0]:false;
    const sel = {maxQty:maxQty, qty:parseInt(q), half:parseInt(h)};
    const description = {name:name, qty:(qVal?qVal.caption:''),half:(hVal?hVal.caption:'')};
    const captions = {qty:(qVal?qVal.description:''),half:(hVal?hVal.description:'')};

    return(
      <Grid container item spacing={1} direction="row" justify="flex-start" alignItems="center">
        <Grid item>
          <Paper className={classes.paper}>
            <StaticTitle rowTitle={name} description={des}/>
          </Paper>
        </Grid>         
        <Grid item>
          <Paper className={classes.paper}>
            <StaticRowElement 
              typeCaption={itemTypeCaption} itemID={id} sel={sel} description={description} captions={captions} 
              hasHalf={false} hasQty={true} handleMenuSelect={(p)=>{handleMenuSelect(p)}}/>
          </Paper> 
        </Grid> 
      </Grid>
    )
  }); 
  if(!initialized){return false}
  return(   
    <div className={classes.root}>
      <Grid container spacing={1}>
        {itemRows}   
      </Grid>      
    </div>             
  )
}