import React from 'react';
import {NavButton} from '../Buttons/index';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {SingleTableDisplay} from '../Elements/index';

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

export default function ReviewPizzaStep(props){
  //allow users to click on item they need to edit directly
  const classes = useStyles();
  const updateAppState = props.updateAppState;
  const triggerNext = props.triggerNext;
  const botData = props.botStepData;
  const menu = botData.menu;
  const pizza = botData.pizza;

  const [selected, setSelected] = React.useState(0);
  const handleSelect = (item)=>{
    setSelected(item);
  }
  const triggerRet = (props)=>{    
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
        botStepKey:'review',
        botStepMsg:'Thank you for reviewing the pizza',
        userMsg: props.userMsg,
        preserveMsg: true,
        trigger:'pizzabuilder',
      }}
    };
    if(props.action==='specialinstmsg'){
      updateData.type = 'inst'
      updateData.values.appValues.botDisplay = 'reviewPizza';
      updateData.values.stepValues.trigger = props.action;      
    }
    updateAppState(updateData);
    triggerNext(updateData.values.stepValues);
  }
  const addNew = () => {
    const userMsg = 'Add another pizza to the order';
    triggerRet({type:'add', botDisplay:'', action:'', pizza:pizza, userMsg:userMsg})
  }
  const handleNext = ()=>{    
    const userMsg = 'Go to final review';
    triggerRet({type:'review', botDisplay:'reviewOrder', action:'', userMsg:userMsg, pizza:pizza})         
  }
  const handleEdit = ()=>{    
    const userMsg = `Edit ${selected}`;
    triggerRet({type:'edit', botDisplay:'menuStep', action:selected, userMsg:userMsg, pizza:pizza})
  }
  const handleRemove = ()=>{    
    const userMsg = 'Remove this pizza';
    triggerRet({type:'update', botDisplay:'remove', action:'ask', userMsg:userMsg, pizza:pizza})
  }
  const handleCancel = ()=>{    
    const userMsg = 'Cancel this order';
    triggerRet({type:'update', botDisplay:'cancel', action:'ask', userMsg:userMsg, pizza:pizza})
  }   
  const editIsDisabled = selected===0;
  const editCapt = editIsDisabled?'Edit':`Edit ${selected}`
  return(
    <div className={classes.root}>

      <div className="stepMessage">{`${botData.order.ordername}, Please review this pizza and then select an option below`}</div>
      <SingleTableDisplay pizza={pizza} menu={menu} handleSelect={(p)=>{return (handleSelect(p))}}/>
      <Grid container spacing={1}>
        <Grid item>
          <NavButton caption={editCapt} isDisabled={editIsDisabled} onClick={handleEdit}/>
        </Grid>
        <Grid item>
          <NavButton caption='Remove Pizza' onClick={handleRemove}/>
        </Grid>
        <Grid item>
          <NavButton caption='Cancel Order' onClick={handleCancel}/>
        </Grid>
        <Grid item>
          <NavButton caption='Add a Pizza' onClick={addNew}/>
        </Grid>
        <Grid item>
          <NavButton caption='Next' onClick={handleNext}/>
        </Grid>
      </Grid>
    </div>      
  )
}