import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';

class OrderStep extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selectedOptions:[],     
      trigger: false,
    }    
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);    
  }  
  checkSpecialInstr(){
    const chk = this.props.steps.hasOwnProperty('specialinstmsg');
    const strchk = this.props.steps.hasOwnProperty('specialinstentry');
    if (strchk){
      return this.props.steps.specialinstentry.value;
    } else if (chk){
      return 'No Special Instructions'
    }
    return '';
  }
  checkRequiredInput(val){
    if((val.ownerName==='crusts'||val.ownerName==='sizes')&&this.state.selectedOptions.length===0){
      const trig = (val.trigger==='remove'||val.trigger==='cancel')?true:false;      
      return trig;
    }
    return true;
  }
  triggerNext(val){   
    if(!this.checkRequiredInput(val)){
      alert(`You must select one of the available ${val.ownerName}`);
      return null;
    }
    const ordercontrol = this.props.step.metadata;    
    const key = this.props.step.key;
    const stepID = this.props.step.id;
    //update order
    const processingResults = ordercontrol.ProcessAction({input:val, key:key, stepID:stepID});
    const msg = processingResults.msg;
    this.props.step.id = processingResults.botKey;
    const newsteps = this.props.steps.pizzabuilder;
    newsteps.id = processingResults.botKey;
    delete this.props.steps.pizzabuilder;
    this.props.steps[processingResults.botKey]=newsteps;
    
    switch(processingResults.trigger){
      case 'cancel':
        //cancel order

        break;
      case 'remove':
        //remove pizza

        break;
      default:        
        this.props.step.trigger =processingResults.trigger
    }    
    //trigger next step in chatbot
    const type = `${val.trigger}:${val.actionType}(${val.ownerType}:${val.ownerName}=>${val.targetType}:${val.targetName})`

    const data = {
      preserveMsg:true,
      stepMsg: ordercontrol.stepMsg,      
      type:type,
      msg:msg,
    }
    this.setState({selected:[],trigger: true}, () => {
      this.props.triggerNextStep(data);
    });
  }
  onSelect(val){
    const currrentlySelected = this.props.step.metadata.HandleItemSelect(val);
    this.setState({selectedOptions:currrentlySelected});      
  }
  render(){
    const ordercontrol = this.props.step.metadata;
    if(!ordercontrol.isStarted){
      const name = this.props.steps.ordername.value;
      ordercontrol.isStarted = name;
    } else if(ordercontrol.handleSpecialInst){
      const inst = this.checkSpecialInstr();

      ordercontrol.specialInstructions = inst;
    }   
    const currentStep = ordercontrol.CurrentStepInfo;    
    return <StepFactory currentStepInfo={currentStep} selected={this.state.selected}  onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
export default OrderStep;