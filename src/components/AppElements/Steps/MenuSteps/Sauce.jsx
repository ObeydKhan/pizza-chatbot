import React from 'react';
import {StaticRowElement, PopupMenu} from '../../Elements/index';
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
  const ret = {sauces:'0', qty:'0'};
  if(isSel){
    const menuType = initial.menuType;
    const selMenuType = selected.hasOwnProperty(menuType)?selected[menuType]:false;
    if(selMenuType){
      const item = initial.itemList.find((i)=>(selMenuType.hasOwnProperty(i.id)));
      if(item!==null&&item!==undefined){
        const selItem = selMenuType[item.id];      
        const q = selItem.hasOwnProperty('qty')?selItem.qty:'2';
        ret.qty = q; 
        ret.sauces = item.id;
      }     
    }
  } 
  return ret;
}
export default function SauceStep(props){
  const classes = useStyles();    
  const updateItem = props.updateItem;
  const stepData = props.stepData;
  const type = stepData.menuType;
  const itemTypeCaption = stepData.caption;  
  const content = stepData.content.values.map((i)=>{
    const id = i.id;
    const caption = i.caption;
    const description = i.description;    
    return {id:id, caption:caption, description:description, isDisabled:false};
  });
  
  const [sauce, setSauce] = React.useState('0');
  const [qty, setQty] = React.useState('0');
  const [initialized, setInitialzied] = React.useState(false);
  const initialSelect = (p)=>{
    return initializeSelection(p)
  }
  if(!initialized){
    const ini = initialSelect({selected:props.selected,menuType:stepData.menuType, itemList:stepData.content.values})
    setSauce(ini.sauces);
    setQty(ini.qty);
    setInitialzied(true)
  }
  const handleMenuSelect = (input)=>{
    const chk = (p)=>{
      const item ={itemID:sauce,values:{qty:qty, half:'2'}};
      const type=p.type;
      const value = p.value;    
      if(type==='qty'&&qty!==value){        
        item.values.qty = value;
        setQty(value);
        return item;
      } else if(type==='sauces'&&sauce!==value){
        item.itemID = value;
        item.values.qty='2';
        setSauce(value);
        setQty('2');
        return item;
      } else {
        return false
      }
    }
    const doUpdate = chk(input);
    if(doUpdate){
      updateItem({item:doUpdate,replace:true})
    }
  }
  const selItem = sauce!=='0'?content.find((i)=>(i.id===sauce)):'0';
  const selName =selItem!==undefined&&selItem!=='0'?selItem.caption:`No ${itemTypeCaption} selected`;  
  const qtyVal = stepData.content.qty.find((i)=>(i.id===qty));  
  const maxQty =stepData.content.qty.length;
  const sel = {maxQty:maxQty, qty:parseInt(qty), half:2}
  const description = {name:selName, qty:(qtyVal!==undefined?qtyVal.caption:''),half:''};
  const captions = {qty:(qtyVal!==undefined?qtyVal.description:''),half:''};
  if(!initialized){return false}
  return(   
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container spacing={1}>
          <Grid item>
            <Paper className={classes.paper}>
              <PopupMenu type={type} itemTypeCaption={itemTypeCaption} selected={parseInt(selItem)} isDisabled={false} items={content} handleMenuSelect={(p)=>{handleMenuSelect(p)}}/>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item>
            <Paper className={classes.paper}>
              <StaticRowElement 
              typeCaption={itemTypeCaption} itemID={sauce} sel={sel} description={description} captions={captions} 
              hasHalf={false} hasQty={true} handleMenuSelect={(p)=>{handleMenuSelect(p)}}/>
            </Paper> 
          </Grid> 
        </Grid> 
      </Grid>      
    </div>             
  )
}