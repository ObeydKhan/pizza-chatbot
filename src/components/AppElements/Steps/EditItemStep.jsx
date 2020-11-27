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
    width: '75%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
function checkAlert(props){
  //check that a crust and size have been selected
  const incItem = props.item;    
  const i = incItem!==null&&incItem!==undefined&&incItem.hasOwnProperty('1')?incItem['1']:{crusts:'0',sizes:'0'};
  const item = i!==null?i:{crusts:'0',sizes:'0'};
  const c = item.hasOwnProperty('crusts')?item.crusts!=='0':false;
  const s = item.hasOwnProperty('sizes')?item.sizes!=='0':false;
  if(!(c&&s)){
    const msgTitle = 'Alert'
    const msg = 'You must select a valid crust type and size before continuing.'
    const status = true;
    const val ={status:status,title:msgTitle,msg:msg};
    props.updateAppState({type:'alert', values:{appValues:{val}}});
    return false;
  } else {
    return true;
  }
}
export default function EditItemStep(props){     
  const classes = useStyles();
  const updateAppState = props.updateAppState;
  const triggerNext = props.triggerNext;
  const botData = props.botStepData;
  const menu = botData.menu;
  const pizza = botData.pizza;
  const stepData = menu.StepObject;
  const menuType = stepData.menuType;
  const selected = pizza.GetPizzaItems(menuType);
  const [items, setItems] = React.useState(selected);
  const updateItem = (props) =>{    
    const item = props.item;
    const itemID = item.itemID;
    const values = item.values;    
    const replace = props.replace;
    if(replace){
      const update = {};
      update[itemID]=values;
      setItems(update);
    } else {
      const current = items;            
      current[item.itemID]=values;
      setItems(current);
    }       
  }
  const triggerRet = (props)=>{
    //const nextTrigger = menu.GetStepTrigger(props.action);
    
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
        trigger:'pizzabuilder',
      }}
    };
    
    updateAppState(updateData);
    triggerNext(updateData.values.stepValues);
  }
  const handleNext = ()=>{     
    const c = menuType==='type'?checkAlert({item:items, updateAppState:updateAppState}):true;      
    if(c){
      const ret = {type:stepData.menuType, items:items};
      const userMsg = menu.GetUserMsg(ret);     
      ret.userMsg = userMsg;
      pizza.PizzaItems = ret;
      triggerRet({type:'update', botDisplay:'reviewPizza', action:'reviewPizza', userMsg:userMsg, pizza:pizza}) 
    }    
  }
  const handlePrev = ()=>{    
    const userMsg = `Done with edits`;
    triggerRet({type:'update', botDisplay:'reviewPizza', action:'reviewPizza', userMsg:userMsg, pizza:pizza})
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
          <NavButton caption='Discard changes' onClick={handlePrev}/>
        </Grid>        
        <Grid item>
          <NavButton caption='Save Changes' onClick={handleNext}/>
        </Grid>
      </Grid>
    </div>      
  )
}
