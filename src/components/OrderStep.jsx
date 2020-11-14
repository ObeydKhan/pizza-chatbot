import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';
import ItemSelect from './ItemSelect';

class OrderStep extends React.Component {
  constructor(props){
    super(props);    
  /*step factory props:
    .type: {this.props.type}
    .stepObject: {this.props.stepObject}
    .onTrigger: this.triggerNext(v=>props.onTrigger)
    .itemList: {this.props.itemList}
    .pizzaID: {this.props.pizzaID}
    .name: {this.props.ordername}  
    .selected: {this.state.selected}
    .onSelect: (v)=>this.onSelect    
  */
    this.state={     
      selected:GetSelected(this.props.type,this.props.order,this.props.step),      
      trigger: false,      
    }        
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);        
  }
  triggerNext(props){
    const selected = this.state.selected.SaveSelected();            
    const trig = props;
    trig.selected = selected;
    const processTrigger = props.onTrigger(trig);
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
    const order = this.props.order;    
    if(!order.ordername){
      order.ordername = this.props.steps.ordername.value;            
    } else if(order.getSpecial){
      const inst = this.props.steps.specialinstques.value==='yes'?this.props.steps.specialinstentry.value:'';       
      order.AddSpecialInstructions(inst);      
      const dispStep = order.GetDisplayStep();
      this.setState({displayStep:dispStep});
    }    
  }
    
  render(){
    const itemSelect = this.state.itemSelect.selected;
    console.log('Orderstep render');        
    return <StepFactory refProps={this.props.refProps} selected={itemSelect} onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}

function GetSelected(type,items,stepname,multi){
  if(type!=='menu'&&type!=='editMenu'){return null}  
  return new ItemSelect(stepname,items,multi);  
}
  
   
export default OrderStep;