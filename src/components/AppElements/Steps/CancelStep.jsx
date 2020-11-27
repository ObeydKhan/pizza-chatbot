import React from 'react';
import {NavButton} from '../Buttons/index';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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

export default function CancelStep(props){
  const classes = useStyles();
  const updateAppState = props.updateAppState;
  const triggerNext = props.triggerNext;
  const triggerRet = (props)=>{    
    const updateData={
      type:props.type,
      values:{
      appValues:{
        step:props.action,        
        botDisplay:props.botDisplay,
      },      
      stepValues:{
        isSpecialStep:false,
        botStepKey:'cancel',
        botStepMsg:'Do you really want to cancel this order?',
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
  const handlePrev = () => {
    const userMsg = 'No, go back';
    triggerRet({type:'special', botDisplay:'cancel', action:'no', userMsg:userMsg})
  }
  const handleNext = (p)=>{    
    const userMsg = `Yes, and ${p==='main'?'go to the main page':'start a new order'}`;
    triggerRet({type:'special', botDisplay:'cancel', action:p, userMsg:userMsg})         
  }
  return(
    <div className={classes.root}>
      <div className="stepMessage">{`Do you really want to cancel this order?`}</div>     
      <Grid container spacing={1}>
        <Grid item>
          <NavButton caption='No' onClick={handlePrev}/>
        </Grid>
        <Grid item>
          <NavButton caption='Yes, and start a new order' onClick={()=>{handleNext('restart')}}/>
        </Grid>
        <Grid item>
          <NavButton caption='Yes, and go to the main page' onClick={()=>{handleNext('main')}}/>
        </Grid>   
      </Grid>
    </div>      
  )
}