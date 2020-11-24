import React from 'react';
import {StaticRowElement, PopupMenu} from '../../Elements/index';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function SauceStep(props){
  const classes = useStyles();    
  
  const handleMenuSelect = (props)=>{
    updateItem({itemID:props.id, change:{type:props.type, value:props.value}})
  }
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
  const hasHalf=stepData.content.half?true:false;
  const hasQty=stepData.content.qty?true:false;
  const selected = props.selected!==null&&props.selected.hasOwnProperty(stepData.menuType)?props.selected[stepData.menuType]:null;
  const selID = selected!==null?selected.itemID:'0';
  const selName = selected!==null?content.find((i)=>(i.id===selID)).caption:`No ${itemTypeCaption} selected`;
  const selQty = selected!==null&&selected.hasOwnProperty('qty')?selected.qty:'2';
  const qtyVal = hasQty?stepData.content.qty.find((i)=>(i.id===selQty)):null;
  const selHalf = selected!==null&&selected.hasOwnProperty('half')?selected.half:'2';
  const halfVal = hasHalf?stepData.content.half.find((i)=>(i.id===selHalf)):null;
  const maxQty = hasQty?stepData.content.half.length+1:2;
  const sel = {maxQty:maxQty, qty:parseInt(selQty), half:parseInt(selHalf)}
  const description = {name:selName, qty:hasQty?qtyVal.caption:'',half:hasHalf?halfVal.caption:''};
  const captions = {qty:hasQty?qtyVal.description:'',half:hasHalf?halfVal.description:''};
  const selectionElement = (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item>
          <Paper className={classes.paper}>
            <PopupMenu type={type} itemTypeCaption={itemTypeCaption} selected={selID} isDisabled={false} items={content} handleMenuSelect={(p)=>{handleMenuSelect(p)}}/>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
   
  const elementDisplay = (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item>
          <Paper className={classes.paper}>
            <StaticRowElement 
            type={type} typeCaption={itemTypeCaption} sel={sel} description={description} captions={captions} 
            hasHalf={hasHalf} hasQty={hasQty} handleMenuSelect={(p)=>{handleMenuSelect(p)}}/>
          </Paper> 
        </Grid> 
      </Grid>  
    </div>
  );
  return(   
    <div className={classes.root}>
      <Grid container spacing={1}>
        {selectionElement}
        {elementDisplay} 
      </Grid>      
    </div>             
  )
}