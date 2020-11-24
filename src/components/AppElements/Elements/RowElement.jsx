import React from 'react';
import MenuToolTip from './MenuToolTip';
import {ChangeHalfButton, IncreaseQty, DecreaseQty} from '../Buttons/index'
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

export function StaticRowElement(props){
  const classes = useStyles();
  const {typeCaption,itemID,sel,description,captions,hasHalf,hasQty} = props;
  const [maxQty] = React.useState(hasQty?sel.maxQty:2);
  const [qty, setQty] = React.useState(hasQty?sel.qty:2);
  const [half,setHalf] = React.useState(hasHalf?sel.half:2);  
  const handleMenuSelect = props.handleMenuSelect;
  const name = description.name;
  const qtyDescription = hasQty?`${description.qty} `:'';
  const halfDescription = hasHalf&&qty!==2?`(${description.half}) `:'';
  const qtyCaption = hasQty?captions.qty.replace('{i}',name):name;
  const halfCaption = hasHalf?captions.half.replace('{i}',qtyCaption):qtyCaption;
  const displayName = `${halfDescription}${qtyDescription}${name}`;
  const displayCaption = halfCaption;
  const changeHalf = (val)=>{    
    setHalf(val);
    handleMenuSelect({itemID:itemID, change:{type:'half', value:`${half}`}});
  }
  const changeQty = (val)=>{
    setQty(qty+val);
    handleMenuSelect({itemID:itemID, change:{type:'half', value:`${qty}`}});
  }
  const halfDisplay = hasHalf?
    <Grid item xs={1}>
      <ChangeHalfButton caption={props.halfCaption} description={props.halfDescription} changeHalf={(p)=>{changeHalf(p)}}/>
    </Grid>:null;
  const lowerQty = hasQty?
    <Grid item xs={1}>
      <DecreaseQty itemTypeName={name} disabled={qty===0} description={props.lowQtyDescription} changeQty={(p)=>{changeQty(p)}}/>
    </Grid>:null;
  const raiseQty = hasQty?
    <Grid item xs={1}>
      <IncreaseQty itemTypeName={name} disabled={qty===maxQty} description={props.highQtyDescription} changeQty={(p)=>{changeQty(p)}}/>
    </Grid>:null;

  return (
    <div className={classes.root}>      
      <Grid container spacing={2}>        
        {halfDisplay}            
        {lowerQty}              
      <Grid item xs={4}>              
          <MenuToolTip caption={`Your current selection for ${typeCaption} is:`} description={displayCaption} component={<div className="menuItemDisplay">{displayName}</div>}/>
      </Grid>      
        {raiseQty}           
      </Grid>            
    </div>
  )
}