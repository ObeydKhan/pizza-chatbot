import React from 'react';
import {MenuStep, CancelStep, EditItemStep, RemoveStep, ReviewOrderStep, ReviewPizzaStep, NewOrderStep, ChangeName, SpecialInstructions} from '../AppElements/Steps/index';

const StepComponents ={
  menuStep:MenuStep,
  cancel:CancelStep,
  editItem:EditItemStep,
  remove:RemoveStep, 
  reviewOrder:ReviewOrderStep, 
  reviewPizza:ReviewPizzaStep, 
  newOrder:NewOrderStep, 
  changeName:ChangeName, 
  specialInstructions:SpecialInstructions
}

export default class DisplayStep extends React.Component{
  render(){
    const {step, ...passThroughProps} = this.props;
    const StepComponent = StepComponents[step];
    return <StepComponent step={step} {...passThroughProps}/>
  }
}


