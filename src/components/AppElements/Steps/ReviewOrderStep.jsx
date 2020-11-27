import React from 'react';
import {NavButton} from '../Buttons/index';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {MultiTableDisplay} from '../Elements/index';

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

export default function ReviewOrderStep(props){
  //allow users to click on item they need to edit directly
  const classes = useStyles();
  const updateAppState = props.updateAppState;
  const triggerNext = props.triggerNext;
  const botData = props.botStepData;
  const menu = botData.menu;
  const order = botData.pizza;

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
        id:props.editID,
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
    if(props.action==='endmsg1'){
      updateData.values.stepValues.trigger = props.action;      
    }
    updateAppState(updateData);
    triggerNext(updateData.values.stepValues);
  }
  const addNew = () => {
    const userMsg = 'Add another pizza to the order';
    triggerRet({type:'add', botDisplay:'', action:'', editID:0, userMsg:userMsg})
  }
  const handleNext = ()=>{    
    const userMsg = 'Complete this order';
    triggerRet({type:'', botDisplay:'', action:'endmsg1', editID:0, userMsg:userMsg}) 
        
  }
  const handleEdit = ()=>{    
    const userMsg = `Edit pizza ${selected}`;
    triggerRet({type:'setpizza', botDisplay:'NonMenuStep', action:'', userMsg:userMsg, editID:selected})
  }
  const handleRemove = ()=>{    
    const userMsg = `Remove pizza ${selected}`;
    triggerRet({type:'update', botDisplay:'remove', action:'ask', userMsg:userMsg, editID:selected})
  }
  const handleCancel = ()=>{    
    const userMsg = 'Cancel this order';
    triggerRet({type:'update', botDisplay:'cancel', action:'ask', userMsg:userMsg, editID:0,})
  }   
  const editIsDisabled = selected===0;
  const editCapt = editIsDisabled?'Edit':`Edit ${selected}`
  const remCapt =editIsDisabled?'Remove':`Remove ${selected}`
  return(
    <div className={classes.root}>

      <div className="stepMessage">{`${botData.order.ordername}, Please review your order and then select an option below`}</div>
      <MultiTableDisplay order={order} menu={menu} handleSelect={(p)=>{return (handleSelect(p))}}/>
      <Grid container spacing={1}>
        <Grid item>
          <NavButton caption={editCapt} isDisabled={editIsDisabled} onClick={handleEdit}/>
        </Grid>
        <Grid item>
          <NavButton caption={remCapt} isDisabled={editIsDisabled} onClick={handleRemove}/>
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