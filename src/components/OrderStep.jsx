import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';
import ItemSelect from './ItemSelect';
import { isNull } from 'lodash';
import BotTrigger from './BotTrigger';
class OrderStep extends React.Component {
  constructor(props){
    super(props);
    const ref = this.getRefProps();
    const set = ref?true:false;
    const sel = (props)=>{      
      const type=props.type;
      if((type!=='menu'&&type!=='editMenu')||!props.hasStep){return false}
      const value={
        items:props.selected,
        stepname:props.name,
        multi:props.multi,
        optList:props.content.optList};
      return GetSelected(value)
    }    
    if(set){    
      if(!ref.ordername&&this.props.previousStep.id==='ordername'){
       this.props.onAppUpdate({type:'start', val:this.props.previousStep.value})                  
      } else if(this.props.previousStep.id==='specialinstques'){
        this.props.onAppUpdate({type:'inst', val:''})
      } else if(this.props.previousStep.id==='specialinstentry'){
        this.props.onAppUpdate({type:'inst', val:this.props.previousStep.value})
      }
      
    }
    const select = set?sel(ref):[];
    this.state={
      refProps: ref,
      setRef:set,     
      selected:select,      
      trigger: false,      
    }        
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);        
  }
  triggerNext(props){
    const selected = this.state.selected?this.state.selected.SaveSelected():false;            
    const trig = props;
    trig.selected = selected;
    if(props.type==='menu'){
      if(props.value==='next'){
        trig.stepTrig = this.state.refProps.nextTrig;
      } else if(props.value==='prev'){
        trig.stepTrig = this.state.refProps.prevTrig;
      } else {
        trig.stepTrig ='pizzabuilder';
      }
    }
    const processTrigger = BotTrigger({trigger:props, order:this.props.appState.order, step:this.props.appState.step});
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
  getRefProps(){
    const appState = this.props.appState;
    if(isNull(appState)){return false}
    if(appState.locObj.curStoreID==='0'){return 'NoLoc'}    
    const type = appState.botStep.type;
    const ref = {
      type:type,     
      pizzaID:appState.order.CurrentID,
      ordername:appState.order.ordername,
    };
    if(type==='menu'||type==='editItem'){      
      const step = appState.step.StepObject;
      
      if(step){
        ref.name=step.name;
        ref.botMsg = step.botMsg;
        ref.multi=step.multi;
        ref.nextTrig = step.controls.nextTrig;
        ref.prevTrig = step.controls.prevTrig;
        ref.nextName = step.controls.nextName;
        ref.prevName = step.controls.prevName;
        ref.selected = appState.order.GetCurrentItems(step.name);
        ref.content = step.content;
        ref.hasStep=true;      
      } else {
        ref.hasStep=false;
      }
    } else {
      ref.itemList=type==='editPizza'?appState.step.stepList:type==='reviewOrder'?appState.order.PizzaList:false;
      if(type==='reviewPizza'){
        ref.content = appState.order.CurrentPizza;
      } else if(type==='reviewOrder'){
        ref.content = appState.order.OrderSummary;
      }
    }
    return ref; 
  }
  onSelect(val){
    if(val===null||val===undefined) return null;
    const sel = this.state.selected;
    sel.selected = val;
    this.setState({selected:sel});      
  }  
  componentDidMount(){

  }
  componentDidUpdate(prevProps){
    if(this.props.appState!==prevProps.appState){
      const ref = this.getRefProps();
      const set = ref?true:false;
      this.setState({refProps:ref,setRef:set})
    }
  }    
  render(){    
    const ref = ()=>{
      if(!this.state.setRef||this.state.triggered||this.state.updated){
        return this.getRefProps();
      } else {
        return this.state.refProps
      }
    }
    const refProps = ref();    
    const itemSelect = this.state.selected?this.state.selected.selected:[];            
    return <StepFactory refProps={refProps} selected={itemSelect} onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}

function GetSelected(props){

  return new ItemSelect(props.stepname,props.items,props.multi,props.optList);  
}
  
   
export default OrderStep;