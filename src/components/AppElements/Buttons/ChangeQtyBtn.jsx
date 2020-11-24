import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuToolTip from '../Elements/MenuToolTip';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      

    },
  },
}));

export function IncreaseQty(props){
  const icon = <AddCircleIcon/>
  const ariaLabel ='increase-qty';
  const caption = `Add more ${props.itemTypeName}`;
  const val = 1
  return <QtyButton ariaLabel={ariaLabel} caption={caption} description={props.description} icon={icon} value={val} onClick={(p)=>{props.changeQty(p)}}/>
}
export function DecreaseQty(props){
  const icon = <RemoveCircleIcon/>  
  const ariaLabel ='decrease-qty';
  const caption = `Add less ${props.itemTypeName}`;
  const val  =-1
  return <QtyButton ariaLabel={ariaLabel} caption={caption} description={props.description} icon={icon} value={val} onClick={(p)=>{props.changeQty(p)}}/>
}
function QtyButton(props){
  const classes = useStyles();
  const val = props.value;
  const iconButton = <IconButton aria-label={props.ariaLabel} onClick={()=>{return props.onClick(val)}}>{props.icon}</IconButton>
  return (
    <div className={classes.root}>        
      <MenuToolTip caption={props.caption} description={props.description} component={iconButton}/>     
    </div>
  );
}