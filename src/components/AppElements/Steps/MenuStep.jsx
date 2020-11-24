import React from 'react';
import {NavButton} from '../Buttons/index';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {PizzaType, Sauce, Topping} from './MenuSteps/index';

const DisplayComponents = {
  type:PizzaType,
  sauces:Sauce,
  topping:Topping,
}

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
  const botData = props.botStepData;
  const menu = botData.menu;
  const pizza = botData.pizza;
  const stepData = menu.StepObject;
  const menuType = stepData.menuType;
  const selected = pizza.GetPizzaItems(menuType);
  const [items, setItems] = React.useState(selected);
  const updateItem = (props) =>{    
    const itemID = props.itemID;
    const change = props.change;
    
    const newItem = items!==null&&items.hasOwnProperty(itemID)?items[itemID]:{[itemID]:null};
    newItem[change.type]=change.value;
    const newState = items!==null?(items[itemID] = newItem):{[itemID]:newItem};
    
    setItems(newState);    
  }
  const triggerRet = (props)=>{
    const nextTrigger = menu.GetStepTrigger(props.action);

    const updateData={
      type:props.type,
      values:{
      appValues:{
        step:props.action,
        pizza:props.pizza,
        botDisplay:props.botDisplay,
      },      
      stepValues:{
        isSpecialStep:false,
        botStepKey:stepData.menuType,
        botStepMsg:stepData.botMsg,
        userMsg: props.userMsg,
        preserveMsg: true,
        trigger:nextTrigger,
      }}
    };
    if(nextTrigger==='specialinstmsg'){
      updateData.type = 'inst'
      updateData.values.appValues.botDisplay = 'reviewPizza';      
    } else if(nextTrigger==='2'){
      updateData.type = 'newOrder';
      updateData.values.appValues.step='new';
      updateData.values.appValues.botDisplay ='menuStep'
    }
    this.props.updateAppState(updateData);
    this.props.triggerNext(updateData.stepValues);
  }
  const handleNext = ()=>{     
    const c = menuType==='type'?props.checkAlert(items):true;      
    if(c){
      const ret = {type:stepData.menuType, items:items};
      const userMsg = menu.GetUserMsg(ret);     
      ret.userMsg = userMsg;
      pizza.PizzaItems = ret;
      triggerRet({type:'update', botDisplay:'menuStep', action:'next', userMsg:userMsg, pizza:pizza}) 
    }    
  }
  const handlePrev = ()=>{    
    const userMsg = `Go back to ${stepData.prev}`;
    triggerRet({type:'update', botDisplay:'menuStep', action:'prev', userMsg:userMsg, pizza:pizza})
  }
  const handleRemove = ()=>{    
    const userMsg = 'Remove this pizza';
    triggerRet({type:'update', botDisplay:'remove', action:'ask', userMsg:userMsg, pizza:pizza})
  }
  const handleCancel = ()=>{    
    const userMsg = 'Cancel this order';
    triggerRet({type:'update', botDisplay:'cancel', action:'ask', userMsg:userMsg, pizza:pizza})
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
  const StepDisplay = DisplayComponents[displayType(menuType)];
  return(
    <div className={classes.root}>
      <div className="stepMessage">{stepData.botMsg}</div>
      <StepDisplay selected={selected} stepData={stepData} updateItem={(p)=>{return (updateItem(p))}}/>
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
