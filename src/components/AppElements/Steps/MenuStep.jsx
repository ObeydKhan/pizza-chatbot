import React from 'react';
import {NavButton} from '../Buttons/index';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GetDisplay from './MenuSteps/index';

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
export default function MenuStep(props){     
  const classes = useStyles();
  const [item, setItem] = React.useState(props.initialState);
  
  const updateItem = (itemID,change) =>{    
    const newState = item;
    const newItem = newState[itemID];
    newItem[change.type]=change.value;
    newState[itemID] = newItem;
    setItem(newState);    
  }
  const handleNext = ()=>{    
    const userMsg = '{r}';
    const stepState = item;
    stepState.menuType = props.menuType;
    props.onTrigger({step:'menuStep', action:'next', userMsg:userMsg, state:stepState})
  }
  const handlePrev = ()=>{    
    const userMsg = 'Go back to {r}';
    props.onTrigger({step:'menuStep', action:'prev', userMsg:userMsg})
  }
  const handleRemove = ()=>{    
    const userMsg = 'Remove this pizza';
    props.onTrigger({step:'remove', action:'ask', userMsg:userMsg})
  }
  const handleCancel = ()=>{    
    const userMsg = 'Cancel this order';
    props.onTrigger({step:'cancel', action:'ask', userMsg:userMsg})
  }
  const displayProps = {
    initialState:props.initialState,
    menuType:props.menuType,
    displayContent:props.displayContent,
    updateItem:updateItem,
  }
  const displayType = (t)=>{
    switch(t){
      case 'type':        
      case 'sauces':
        return t;
      default:
        return 'topping';
    }
  }
  const display = new GetDisplay(displayProps);
  return(
    <div className={classes.root}>
      {display[displayType(props.menuType)]}
      <Grid container spacing={1}>
        <Grid item>
          <NavButton caption='Next' onClick={handleNext}/>
        </Grid>
        <Grid item>
          <NavButton caption='Back' onClick={handlePrev}/>
        </Grid>
        <Grid item>
          <NavButton caption='Remove Pizza' onClick={handleRemove}/>
        </Grid>
        <Grid item>
          <NavButton caption='Cancel Order' onClick={handleCancel}/>
        </Grid>
      </Grid>
    </div>      
  )
}
