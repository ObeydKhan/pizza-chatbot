import React from 'react'
import DisplayStep from './BotComponentWrapper';
export default class BotStep extends React.Component{
  constructor(props){
    super(props)
    this.state = {trigger:false};
    this.onTrigger = this.onTrigger.bind(this);
    console.log('Custom constructor called')    
  }
  componentDidMount(){

  }
  componentDidUpdate(prevProps,prevState){
    console.log('Custom step did update');
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('Custom step should update');
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
    if(!this.checkAlert){
      return false;
    }     
    this.props.handleTrigger(props)    
    const data = props.data;
    const bot = `${data.botStepKey}=>(id=${this.props.step.key.substring(0,5)})`;
    const genericStep = this.props.steps.pizzabuilder;
    this.props.step.id = bot;
    genericStep.id = bot;    
    this.props.steps[bot] = genericStep;
    this.props.step.trigger = data.trigger;        
    this.setState({trigger: true,}, () => {
      this.props.triggerNextStep(data);
    });
  }
  render(){
    const {step, steps, previousStep, ...passThroughProps} = this.props
    const prevStepValue = previousStep.hasOwnProperty('value')?previousStep.value:false;
    const prevStepID = previousStep.id;    
    if(!this.props.refProps.step){return null}
    const disp = DisplayStep({prevStepValue:prevStepValue, prevStepID:prevStepID, onTrigger:(p)=>this.onTrigger(p), ...passThroughProps})        
    return <div>{disp}</div>;
  }
}
