import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';
import BotTrigger from './BotTrigger';
import ItemSelect from './ItemSelect';


const update = action=>(state,props)=>{  
  switch(action.type){
    case 'initial':        
      const show = (props.appState.step.StepObject&&props.appState.order.ordername)?true:false;
      if(!show||!props.appState.step.StepObject){
        return{renderStep:false, itemSelect:null}
      } else {
        const name = props.appState.step.StepObject.name
        const value={
          items:props.appState.order.GetCurrentItems(name),
          stepname:name,
          multi:props.appState.step.StepObject.multi,
          optList:props.appState.step.StepObject.content.optList};
        const s= GetSelected(value)
        return{renderStep:true, itemSelect:s}  
      }    
    case 'select':
      const sel = state.itemSelect;
      sel.selected = action.select;
      return{renderStep:true, itemSelect:sel};
    default:
      return null
  }
}
class OrderStep extends React.Component {
  constructor(props){
    super(props);    
    this.state={
      renderStep:true,                  
      itemSelect:null,      
      trigger: false,      
    }           
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);        
  }  
  componentDidUpdate(prevProps,prevState){    
    if(this.props.previousStep.id==='ordername'||this.props.previousStep.id==='specialinstques'||this.props.previousStep.id==='specialinstentry'){
      //handle updates to order from user name or special instructions
      const checkUp = (this.props.appState.appValues.appUpdateBot)||(this.props.appState.appValues.appSetName&&this.props.appState.appValues.appSetInst)?true:false;
      if(checkUp&&this.props.previousStep.id==='ordername'){            
        if(!prevState.renderStep){
          this.setState({renderStep:this.props.appState.appValues.appUpdateBot},
            ()=>{this.setOrderName(this.props.steps.ordername.value)});        
        }      
      }
    }    
  }
  shouldComponentUpdate(nextProps,nextState){    
    if((!nextState.renderStep&&this.state.renderStep)||(!this.state.renderStep&&nextState.renderStep)){            
      return false
    } else if (nextState.trigger){
      return false
    } else {      
      return true
    }
  }
  componentDidMount(){   
    if(this.props.previousStep.id==='ordername'){
      this.setState({
        renderStep:false,
      }, ()=>{this.props.updateAppState({type:'setName', values:this.props.steps.ordername.value})})
    } else if(this.props.previousStep.id==='specialinstques'||this.props.previousStep.id==='specialinstentry'){
      const val = this.props.steps.hasOwnProperty('specialinstques')?this.props.steps.specialinstentry.value:''
      this.setState({
        renderStep:false,
      }, ()=>{this.props.updateAppState({type:'setInst', values:val})})
    } else {
      const a = {type:'initial'}
      this.setState(update(a));
    }
  }
  onTrigger(props){
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
  triggerNext(props){
    const selected = this.state.itemSelect?this.state.itemSelect.SaveSelected():false;            
    const trig = props;
    trig.selected = selected;        
    const processTrigger = BotTrigger({trigger:trig, order:this.props.appState.order, step:this.props.appState.step});
    const triggerRet ={
      botStepClass:processTrigger.botStepClass,
      order:processTrigger.order,
      step:processTrigger.step,
    }
    trig.triggerRet= triggerRet
    this.props.onTriggerBot(trig);
    if(!processTrigger) {return null;}
    const ret = {bot:`(${props.type})=>${props.value}`};    
    ret.stepmsg = processTrigger.stepMsg;
    ret.usermsg = processTrigger.userMsg;
    ret.isuser = true;   
    ret.trigger = processTrigger.trigger;
    //change current step info to with new 'key'
    this.onTrigger(ret);
  }
  
  onSelect(val){
    if(val===null||val===undefined) return null;
    const sel = this.state.selected;
    sel.selected = val;
    this.setState({selected:sel});      
  }
  setOrderName(v){
    const ret = {bot:'(ordername)=>menusteps'}        
    ret.stepmsg = `Thank you, ${v}, Let's create our first pizza for this order.`;
    ret.usermsg = null;
    ret.isuser = false;    
    ret.trigger = 'pizzabuilder'
    this.onTrigger(ret);
  }
  setSpecInst(){

  }     
  render(){    
    if(this.state.renderStep&&this.props.appState.appValues.appUpdateBot&&!this.state.trigger){
      const selected = this.state.itemSelect?this.state.itemSelect.selected:[];            
      return <StepFactory refProps={this.props.appState} selected={selected} onTrigger={this.triggerNext} onSelect={(a)=>this.setState(update(a))}/>;
    } else {
      return null;
    }       
  }  
}
function GetSelected(props){
  return new ItemSelect(props.stepname,props.items,props.multi,props.optList);
}  
export default OrderStep;