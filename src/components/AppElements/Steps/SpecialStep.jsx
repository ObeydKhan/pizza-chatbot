import React from 'react';

export class NewOrderStep extends React.Component{  
  retVal = {
    botUpdate:{type:'start',values:{step:'new'}},
    appUpdate:{type:'name',values:{name:this.props.prevStepValue, display:'Menu', showBot:'menuStep'}},
    data:{
      botStepKey:'neworder',
      botStepMsg:`Thank you, ${this.props.prevStepValue}, Let's create our first pizza for this order.`,
      usermsg: null,
      preserveMsg: false,
      trigger:'pizzabuilder',
    }
  }
  componentDidMount(){
    this.props.onTrigger(this.retVal);
  }
  componentDidUpdate(){
    return true;
  }
  shouldComponentUpdate(){
    return true;
  }
  render(){
    return <div className="orderStep"><div className="stepMessage">{this.retVal.data.botStepMsg}</div></div>;
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