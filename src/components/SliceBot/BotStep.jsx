import React from 'react'
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
export default class BotStep extends React.Component{
  constructor(props){
    super(props)
    this.state = {botStepData:null, trigger:false};
    this.onTrigger = this.onTrigger.bind(this);       
  }
  componentDidMount(){
    if(this.state.botStepData===null&&!this.state.trigger){
      const data = this.props.getBotState();
      this.setState({botStepData:data})
    }
  }  
  shouldComponentUpdate(nextProps,nextState){
    if(this.state.trigger||nextState.trigger){
      return false
    }    
    return true;   
  } 
  onTrigger(props){    
    const bot = `${props.botStepKey}=>(id=${this.props.step.key.substring(0,5)})`;
    const genericStep = this.props.steps.pizzabuilder;
    this.props.step.id = bot;
    genericStep.id = bot;    
    this.props.steps[bot] = genericStep;
    this.props.step.trigger = props.trigger;    
    this.setState({trigger: true}, () => {
      this.props.triggerNextStep(props);
    });
  }
  render(){
    if(this.state.botStepData===null||this.state.botStepData===undefined){return null}    
    const {step, steps, previousStep, ...passThroughProps} = this.props
    const prevStepValue = previousStep.hasOwnProperty('value')?previousStep.value:false;
    const prevStepID = previousStep.id;
    const botStepData = this.state.botStepData;
    botStepData.prevStepValue=prevStepValue;
    botStepData.prevStepID=prevStepID;
    const StepComponent = StepComponents[botStepData.botDisplay];       
    return <StepComponent botStepData={botStepData} triggerNext={(p)=>this.onTrigger(p)} {...passThroughProps}/>
  }
}
