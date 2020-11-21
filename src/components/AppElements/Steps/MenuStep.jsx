import React from 'react';
import NavButton from '../Buttons/index';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {PizzaType, Sauce, Topping} from './MenuSteps/index';

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
  const display = GetDisplay(props);
  const {nextStep,prevStep} = props;

  const nextTarget={step:nextStep==='EOM'?'specInst':'menuStep',type:nextStep};
  const prevTarget={step:nextStep==='BOM'?'name':'menuStep',type:prevStep};
  const removeTarget={step:'remove',type:''};
  const cancelTarget={step:'cancel',type:''};

  return(
    <div className={classes.root}>
      {display[props.type]}
      <Grid container spacing={1}>
        <Grid item>
          <NavButton caption={'Next'} target={nextTarget} onTrigger={props.onTrigger}/>
        </Grid>
        <Grid item>
          <NavButton caption={'Back'} target={prevTarget} onTrigger={props.onTrigger}/>
        </Grid>
        <Grid item>
          <NavButton caption={'Remove'} target={removeTarget} onTrigger={props.onTrigger}/>
        </Grid>
        <Grid item>
          <NavButton caption={'Cancel'} target={cancelTarget} onTrigger={props.onTrigger}/>
        </Grid>
      </Grid>
    </div>      
  )
}
class GetDisplay{
  type(){
    return <PizzaType props={this.props}/>
  }
  sauces(){
    return <Sauce props={this.props}/>    
  }
  topping(){
    return <Topping props={this.props}/>
  }
}