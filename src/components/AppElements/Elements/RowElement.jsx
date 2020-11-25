import React from 'react';
import MenuToolTip from './MenuToolTip';
import {ChangeHalfButton, IncreaseQty, DecreaseQty} from '../Buttons/index'
import { makeStyles } from '@material-ui/core/styles';
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
function createRowString(stringVal){
  if(stringVal===null||stringVal===undefined){
    return false;
  }
  const hasHalf = stringVal.hasOwnProperty('half');
  const hasQty = stringVal.hasOwnProperty('qty');
  return {
    half:hasHalf?stringVal.half:'',
    qty:hasHalf?stringVal.qty:'',
  }
}
export function StaticRowElement(props){
  const classes = useStyles();
  const {typeCaption,itemID,sel,description,captions,hasHalf,hasQty} = props;
  const [maxQty] = React.useState(hasQty?sel.maxQty:2);
  const [qty, setQty] = React.useState(hasQty?sel.qty:2);
  const [half,setHalf] = React.useState(hasHalf?sel.half:2);  
  const handleMenuSelect = props.handleMenuSelect;
  const name = description.name;
  const des = itemID!=='0'?createRowString(description):false;
  const cap = itemID!=='0'?createRowString(captions):false;
  const qtyDescription = `${des?des.qty:''} `;
  const halfDescription = `${des?des.half:''}`;
  const qtyCaption = `${cap?(cap.qty.replace('{i}',name)):name}`;
  const halfCaption = `${cap?(cap.half.replace('{i}',qtyCaption)):qtyCaption}`
  const displayName = `${halfDescription!==''?`(${halfDescription}) `:''}${qtyDescription}${name}`;
  const displayCaption = halfCaption;
  const changeHalf = (val)=>{    
    setHalf(val);
    handleMenuSelect({itemID:itemID, type:'half', value:`${val}`});
  }
  const changeQty = (val)=>{
    setQty(qty+val);
    handleMenuSelect({itemID:itemID, type:'qty', value:`${qty+val}`});
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
      <Grid container spacing={2}           
            direction="row"
            justify="flex-start"
            alignItems="center"
            width='100%'
          >        
        {halfDisplay}            
        {lowerQty}              
      <Grid item xs={10}>              
          <MenuToolTip caption={`Your current selection for ${typeCaption} is:`} description={displayCaption} component={<div className="menuItemDisplay">{displayName}</div>}/>
      </Grid>      
        {raiseQty}           
      </Grid>            
    </div>
  )
}