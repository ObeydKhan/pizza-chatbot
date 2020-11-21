import React from 'react'
import OrderSteps from '../AppElements/Steps/index';

export default class BotStep extends React.Component{
  constructor(props){
    super(props)
    this.state = {trigger:false};
    this.handleTrigger = this.handleTrigger.bind(this);
  }

  handleTrigger(props){
    const bot = `${props.bot}=>(id=${this.props.step.key.substring(0,5)})`;
    const genericStep = this.props.steps.pizzabuilder;
    this.props.step.id = bot;
    genericStep.id = bot;
    delete genericStep.metadata;
    this.props.steps[bot] = genericStep;
    this.props.step.trigger = props.trigger;
    const data = {
      preserveMsg:props.isuser,
      stepMsg: props.stepmsg,      
      type:bot,
      msg:props.usermsg,
    }    
    this.setState({trigger: true,}, () => {
      this.props.triggerNextStep(data);
    });
  }

  render(){
    const displayProps = this.props.refProps;
    
    
    return <DisplayStep props={this.props.refProps} handleTrigger={this.handleTrigger}/>;
  }
}

function DisplayStep(props){
  const diplayStep = new OrderSteps(props);
  const step = props.step;
  return diplayStep[step];

}