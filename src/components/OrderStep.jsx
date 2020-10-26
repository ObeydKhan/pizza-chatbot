import React, {useState} from 'react';
import '../css/OrderStyle.css';


class OrderStep extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selected:[null],
    }
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);    
  }
  triggerNext(val){
    const key = val.key;
    const target = val.target;
    const ref = val.refType;
    const ordercontrol = this.props.step.metadata;
    ordercontrol.ProcessAction(val);
  }
  onSelect(val){
    const i = this.state.selected.findIndex(p=>p===val.key);
    
    const v = i===-1?this.state.selected.concat(val.key):this.state.selected.splice(i,1);
    this.setState({selected:v});    
  }
  render(){
    const ordercontrol = this.props.step.metadata;
    if(!ordercontrol.isStarted){
      const name = this.props.steps.ordername.value;
      ordercontrol.isStarted = name;
    }
    const updatedStep = ordercontrol.ProcessStep();
    const currentStep = updatedStep.CurrentStep;
    const stepCtrls = updatedStep.StepControls;
    
    return <BuildStep stepOptions={currentStep} selected={this.state.selected} stepCtrls={stepCtrls} onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
function BuildStep(props){
  const {stepOptions, stepCtrls} = props;
  const hasElements = stepOptions.hasElements;
  const elementArray = hasElements?
    <ElementArray elements={stepOptions.elements} hasRows={stepOptions.hasRows} 
    hasMult={stepOptions.hasMulti} selected={props.selected} onSelect={props.onSelect}/>
    :null;
  const controlArray = <ControlArray stepCtrls={stepCtrls} onTrigger={props.onTrigger}/>
  return (
    <div className="orderStep">
      {elementArray}
      {controlArray}
    </div>
  )  
}
function ElementArray(props){
  const elements = props.elements;
  const hasRows = props.hasRows;
  const hasMulti = props.hasMulti;  
  const click = props.onSelect;
  const sel = props.selected;
  return (
    <ul className="menuEleList">
    {hasRows?    
    elements.map((e)=>{
      const rowName = e.name;
      const rowClass = e.rClass;
      const rowBtns = e.btns.map((b)=>{
        const key = b.listKey;
        const i = sel.findIndex(p=>p===key)
        const capt =b.btnCapt;        
        const val = {key:key, multi:hasMulti};
        const eleClass =  i===-1?b.btnClass:'btn-select';
                
        return (
          <li key={key} className={eleClass}>
            <button className="menuBtn" onClick={()=> {return click(val)}}>{capt}</button>
          </li>
        )
      });
      return (
        <div className={rowClass}>
          <div className="rowTitle">{rowName}</div>
          <div className="rowBtns">            
            {rowBtns}
          </div>
        </div>
      )
    }):elements.map((e)=>{ 
      const capt = e.btnCapt;
      const key = e.listKey;
      const val = {key:key, multi:hasMulti};
      const i = sel.findIndex(p=>p===key)
      const eleClass = i===-1?e.btnClass:'btn-select';
            
      return (
        <li key={key} className={eleClass}>
          <button className="menuBtn" onClick={()=> {return click(val)}}>{capt}</button>
        </li>
      )
    })
    }
    </ul>    
  )
}
function ControlArray(props){
  const stepControls = props.stepCtrls.map((s)=>{
    if(s===null) return null;
    const capt = s.btnCapt;
    const btnClass = s.btnClss;
    const key = s.listKey;
    const target = s.trigger;
    const spc = s.spc;
    const refType = s.refType;
    const ret = {
      key: key,
      target: target,
      spc: spc,
      refType: refType,
    }
    return (
      <li key={key} className={btnClass}>
        <button className="ctrlBtn" onClick={()=> {return props.onTrigger(ret)}}>{capt}</button>
      </li>
    )
  })
  return(
    <div className="btnNavigationArray">
      <ul className="btnCtrlList">
        {stepControls}
      </ul>
    </div>
  )
}

export default OrderStep;