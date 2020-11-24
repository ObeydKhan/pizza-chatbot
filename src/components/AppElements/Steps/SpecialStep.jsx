import React from 'react';

export class NewOrderStep extends React.Component{  
  constructor(props){
    super(props)
    this.state={data:null, trigger:false};    
  }
  componentDidMount(){    
    const updateData={
      type:'start',
      values:{
      appValues:{
        name:this.props.botStepData.prevStepValue,
        step:'new'},     
      stepValues:{
        isSpecialStep:true,
        botStepKey:'neworder',
        botStepMsg:`Thank you, ${this.props.botStepData.prevStepValue}, Let's create our first pizza for this order.`,
        userMsg: null,
        preserveMsg: false,
        trigger:'pizzabuilder',
      }}
    };        
    this.setState({data:updateData.values.stepValues}, ()=>{this.props.updateAppState(updateData)});        
  }
  componentDidUpdate(prevProps,prevState){
    if(this.state.data!==null){
      this.setState({trigger:!prevState.trigger}, ()=>this.props.triggerNext(this.state.data))
    }          
  }
  shouldComponentUpdate(nextProps,nextState){
    if(nextState.trigger||this.state.trigger){
      return false;
    } else {
      return true;  
    }      
  }    
  render(){
    //const msg = `Thank you, ${this.props.prevStepValue}, Let's create our first pizza for this order.`;    
    return <div>{''}</div>;
  } 
}
export function SpecialInstructions(props){
  const inst = props.prevStepID==='specialinstentry'?props.prevStepValue:''; 
  const retVal = {
    type:'inst',
    values:inst,
    data:{
      botStepKey:'reviewPizza',
      botStepMsg:`Okay, Let's review your pizza.`,
      usermsg: null,
      isuser: false,
      trigger:'pizzabuilder',
    } 
  }
  props.onTrigger(retVal);
  return null;
}
export function ChangeName(props){
  const name = props.prevStepValue; 
  const retVal = {
    type:'name',
    values:name,
    data:{
      botStepKey:'reviewOrder',
      botStepMsg:`Thank you, ${name}, I've updated the name for this order.`,
      usermsg: null,
      isuser: false,
      trigger:'pizzabuilder',
    } 
  }
  props.onTrigger(retVal);
  return null;
}