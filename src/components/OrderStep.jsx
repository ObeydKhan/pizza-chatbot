import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';
import BotTrigger from './BotTrigger';
import ItemSelect from './ItemSelect';

class OrderStep extends React.Component {
  constructor(props){
    super(props);
    
    const sel = (props)=>{      
      if(!props.step.StepObject){
        const name = props.step.StepObject.name
        const value={
          items:props.state.order.GetCurrentItems(name),
          stepname:name,
          multi:props.step.StepObject.multi,
          optList:props.step.StepObject.content.optList};
        return GetSelected(value)
      }
        return false;
    }        
    if(!this.props.appState.order.ordername&&this.props.previousStep.id==='ordername'){
      this.props.onAppUpdate({type:'start', val:this.props.previousStep.value})                  
    } else if(this.props.previousStep.id==='specialinstques'){
      this.props.onAppUpdate({type:'inst', val:''})
    } else if(this.props.previousStep.id==='specialinstentry'){
      this.props.onAppUpdate({type:'inst', val:this.props.previousStep.value})
    }      
    const s = sel(this.props.appState)
    this.state={      
      selected:s,      
      trigger: false,      
    }        
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);        
  }
  triggerNext(props){
    const selected = this.state.selected?this.state.selected.SaveSelected():false;            
    const trig = props;
    trig.selected = selected;
    trig.prevStep = this.state.refProps.prevStep;
    if(props.type==='menu'){
      if(props.value==='next'){
        trig.stepTrig = this.state.refProps.nextTrig;
      } else if(props.value==='prev'){
        trig.stepTrig = this.state.refProps.prevTrig;
      } else {
        trig.stepTrig ='pizzabuilder';
      }
    }
    const processTrigger = BotTrigger({trigger:trig, order:this.props.appState.order, step:this.props.appState.step});
    const triggerRet ={
      botStep:processTrigger.botStep,
      order:processTrigger.order,
      step:processTrigger.step,
    }
    trig.triggerRet= triggerRet
    this.props.onTrigger(trig);
    if(!processTrigger) {return null;}
    //change current step info to with new 'key'
    const bot = `(${props.type})=>${props.value}(id=${this.props.step.key.substring(0,5)})`;   
    const genericStep = this.props.steps.pizzabuilder;
    this.props.step.id = bot;
    genericStep.id = bot;
    delete genericStep.metadata;
    this.props.steps[bot] = genericStep;     
    //trigger next step in chatbot
    this.props.step.trigger = processTrigger.trigger;        
    const data = {
      preserveMsg:true,
      stepMsg: processTrigger.stepMsg,      
      type:bot,
      msg:processTrigger.userMsg,
    }    
    this.setState({trigger: true,}, () => {
      this.props.triggerNextStep(data);
    });
  }
  
  onSelect(val){
    if(val===null||val===undefined) return null;
    const sel = this.state.selected;
    sel.selected = val;
    this.setState({selected:sel});      
  }  
  componentDidMount(){

  }
  componentDidUpdate(){
    if(this.state.refProps!==this.props.steps['1'].metadata){
      const ref = this.props.steps['1'].metadata;      
      this.setState({refProps:ref})
    }
  }    
  render(){        
    const itemSelect = this.state.selected?this.state.selected.selected:[];            
    return <StepFactory refProps={this.props.appState} selected={itemSelect} onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
function GetSelected(props){
  return new ItemSelect(props.stepname,props.items,props.multi,props.optList);  
} 
  
export default OrderStep;