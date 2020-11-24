import React from 'react'
import DisplayStep from './BotComponentWrapper';
export default class BotStep extends React.Component{
  constructor(props){
    super(props)
    this.state = {trigger:false};
    this.onTrigger = this.onTrigger.bind(this);   
  }  
  shouldComponentUpdate(nextProps,nextState){
    if(this.state.trigger||nextState.trigger){
      return false
    }    
    return true;   
  }  
  checkAlert(props){
    //check that a crust and size have been selected   
    if(this.props.refProps.step!=='type'){return true}
    const i = props.state['1'];
    const c = i.hasOwnProperty('crusts')?i.crusts!=='0':false;
    const s = i.hasOwnProperty('sizes')?i.sizes!=='0':false;
    if(!(c&&s)){
      const msgTitle = 'Alert'
      const msg = 'You must select a valid crust type and size before continuing.'
      const status = true;
      const val ={status:status,title:msgTitle,msg:msg};
      this.props.triggerAlert(val)
      return false;
    } else {
      return true;
    }    
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
        
    const {step, steps, previousStep, ...passThroughProps} = this.props
    const prevStepValue = previousStep.hasOwnProperty('value')?previousStep.value:false;
    const prevStepID = previousStep.id;       
    return <DisplayStep prevStepValue={prevStepValue} prevStepID={prevStepID} triggerNext={(p)=>this.onTrigger(p)} {...passThroughProps}/>
  }
}
