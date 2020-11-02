import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';

class OrderStep extends React.Component {
  constructor(props){
    super(props);
    const order = this.props.step.metadata;

    this.state={
      nameSet:order.orderName!=='',             
      displayStep: order.GetDisplayStep(),           
      trigger: false,      
    }    
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);    
  }
  
  triggerNext(props){   
    const order = this.props.step.metadata;
    if(!order.CurrentStepSelection(props)){
      alert(`You must select one of the available ${props.owner.name}`);
      return null;
    }        
    const processTrigger = order.ProcessStep({trigger:props, key:this.props.step.key});
    const userMsg = processTrigger.userMsg;
    const trigger = processTrigger.trigger;
    //change current step info to with new 'key'
    const stepKey = processTrigger.key;    
    const genericStep = this.props.steps.pizzabuilder;
    this.props.step.id = stepKey;
    genericStep.id = stepKey;
    delete genericStep.metadata;
    this.props.steps[stepKey] = genericStep; 
    
    //trigger next step in chatbot
    this.props.step.trigger = trigger;  

    const type = `(${props.owner.type}:${props.owner.name})=>(${props.target.type}:${props.target.name})`;    
    const data = {
      preserveMsg:true,
      stepMsg: props.stepMsg,      
      type:type,
      msg:userMsg,
    }    
    this.setState({trigger: true,}, () => {
      this.props.triggerNextStep(data);
    });
  }
  onSelect(val){
    if(val===null||val===undefined) return null;
    const order = this.props.step.metadata
    order.SelectPizzaItems(val);    
    const dispStep = order.GetDisplayStep();
    this.setState({displayStep:dispStep});      
  }  
  componentDidMount(){
    const order = this.props.step.metadata;    
    if(!this.state.nameSet){
      const name = this.props.steps.ordername.value;
      order.StartNewOrder(name);
      const dispStep = order.GetDisplayStep();
      this.setState({displayStep:dispStep});      
    } else if(order.getSpecial){
      const inst = this.props.steps.specialinstques.value==='yes'?this.props.steps.specialinstentry.value:'';       
      order.AddSpecialInstructions(inst);      
      const dispStep = order.GetDisplayStep();
      this.setState({displayStep:dispStep});
    }    
  }
    
  render(){    
    const dispStep = this.state.displayStep;    
    if(dispStep===null){
      return null
    }        
    return <StepFactory stepInfo={dispStep} onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
export default OrderStep;