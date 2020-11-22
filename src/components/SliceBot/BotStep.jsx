import React from 'react'
import OrderSteps from '../AppElements/Steps/index';

export default class BotStep extends React.Component{
  constructor(props){
    super(props)
    this.state = {trigger:false};
    this.onTrigger = this.onTrigger.bind(this);
  }

  onTrigger(props){
    //call props.handleTrigger()
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
    return <DisplayStep props={displayProps} onTrigger={this.onTrigger}/>;
  }
}

function DisplayStep(props){
  const diplayStep = new OrderSteps(props);
  const step = props.step;
  return diplayStep[step];

}