import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';
import BotTrigger from './BotTrigger';
import ItemSelect from './ItemSelect';


class OrderStep extends React.Component {
  constructor(props){
    super(props);    
    this.state={
      renderStep:true,                  
      itemSelect:null,      
      trigger: false,
      selectedItems:[],      
    }           
    this.triggerNext = this.triggerNext.bind(this);
    this.onTrigger = this.onTrigger.bind(this);
    this.update = this.update.bind(this);
                
  }
  update = action=>()=>{  
    switch(action.type){
      case 'initial':        
        const show = (this.props.appState.step.StepObject&&this.props.appState.order.ordername)?true:false;
        if(!show||!this.props.appState.step.StepObject){
          return{renderStep:false, itemSelect:null}
        } else {
          const name = this.props.appState.step.StepObject.name
          const value={
            items:this.props.appState.order.GetCurrentItems(name),
            stepname:name,
            multi:this.props.appState.step.StepObject.multi,
            optList:this.props.appState.step.StepObject.content.optList};
          const s= GetSelected(value)
          const sel = s.selected;
          return{renderStep:true, itemSelect:s, selectedItems:sel}  
        }    
      case 'select':
        const sel = this.state.itemSelect;
        sel.selected = action.values;
        return{renderStep:true, itemSelect:sel};
      default:
        return null
    }
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
      } else if(checkUp&&(this.props.previousStep.id==='specialinstques'||this.props.previousStep.id==='specialinstentry')){            
        if(!prevState.renderStep){
          this.setState({renderStep:this.props.appState.appValues.appUpdateBot},
            ()=>{this.setSpecInst()});        
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
  onSelect(values){
    const sel = this.state.itemSelect;
    sel.selected = values.values;
    const s = sel.selected;
    this.setState({itemSelect:sel, selectedItems:s})
  }
  componentDidMount(){   
    if(this.props.previousStep.id==='ordername'){
      this.setState({
        renderStep:false,
      }, ()=>{this.props.updateAppState({type:'setName', values:this.props.steps.ordername.value})})
    } else if(this.props.previousStep.id==='specialinstques'||this.props.previousStep.id==='specialinstentry'){
      const val = this.props.previousStep.id==='specialinstentry'?this.props.previousStep.value:''      
      this.setState({
        renderStep:false,
      }, ()=>{this.props.updateAppState({type:'setInst', values:val})})
    } else {
      const a = {type:'initial'}
      this.setState(this.update(a));
    }
  }
  triggerNext(props){
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
  onTrigger(props){
    const selected = this.state.itemSelect?this.state.itemSelect.SaveSelected():false;            
    const trig = props;
    trig.selected = selected;        
    const processTrigger = BotTrigger({trigger:trig, order:this.props.appState.order, step:this.props.appState.step});
    if(!processTrigger){
      const msgTitle = 'Alert'
      const msg = 'You must select a valid crust type and size before continuing.'
      const status = true;
      const val ={status:status,title:msgTitle,msg:msg};
      this.setState({
        renderStep:true,
      }, ()=>{this.props.updateAppState({type:'alert', values:val})})
      return null;
    }
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
    this.triggerNext(ret);
  }  
  setOrderName(v){
    const ret = {bot:'(ordername)=>menusteps'}        
    if(this.props.appState.appValues.appBotStepClass==='edit'){
      ret.stepmsg =`Thank you, ${v}, I've updated the order name`;
    } else {
      ret.stepmsg = `Thank you, ${v}, Let's create our first pizza for this order.`;
    }    
    ret.usermsg = null;
    ret.isuser = false;    
    ret.trigger = 'pizzabuilder'
    this.triggerNext(ret);
  }
  setSpecInst(){
    const ret = {bot:'(Special Instructions)=>Review Pizza'}        
    ret.stepmsg = `Okay, Let's review your pizza.`;
    ret.usermsg = null;
    ret.isuser = false;    
    ret.trigger = 'pizzabuilder'
    this.triggerNext(ret);
  }     
  render(){
    const checkPrev= this.props.previousStep.id==='ordername'||this.props.previousStep.id==='specialinstques'||this.props.previousStep.id==='specialinstentry';    
    if(this.state.renderStep&&!this.state.trigger&&!checkPrev){
      const selected = this.state.selectedItems;            
      return <StepFactory refProps={this.props.appState} selected={selected} onTrigger={this.onTrigger} onSelect={(a)=>{return this.onSelect(a)}}/>;
    } else {
      return null;
    }       
  }  
}
function GetSelected(props){
  return new ItemSelect(props.stepname,props.items,props.multi,props.optList);
}  
export default OrderStep;