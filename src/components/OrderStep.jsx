import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';

class OrderStep extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selected:[],
      trigger: false,
    }
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);    
  }
  triggerNext(val){
   /* ownerType, ownerName, targetType, targetName, hasSpecial, trigger*/
    const ordercontrol = this.props.step.metadata;
    //update order
    const selectedObjs = this.state.selected;
    const processObj = {action:val, selections:selectedObjs}
    ordercontrol.ProcessAction(processObj);
    //trigger next step in chatbot
    const type = `${val.trigger}:${val.actionType}(${val.ownerType}:${val.ownerName}=>${val.targetType}:${val.targetName})`
    const msg = selectedObjs.length===0?'No Message':JSON.stringify(selectedObjs);
    const data = {
      value:selectedObjs,
      type:type,
      msg:msg,
    }
    this.setState({trigger: true}, () => {
      this.props.triggerNextStep(data);
    });
  }
  onSelect(val){
    const currrentlySelected = this.state.selected
    const i = currrentlySelected.findIndex(p=>p===val.key);
    if (i===-1){
      const v = currrentlySelected.concat(val.key);
      this.setState({selected:v});
    } else {
      currrentlySelected.splice(i,1);
      this.setState({selected:currrentlySelected});
    }       
  }
  render(){
    const ordercontrol = this.props.step.metadata;
    if(!ordercontrol.isStarted){
      const name = this.props.steps.ordername.value;
      ordercontrol.isStarted = name;
    }
    const currentStep = ordercontrol.CurrentStep();
    const stepInfo = ordercontrol.StepInfo();    
    const stepCtrls = StepFactory(stepInfo);
    const stepMsg = ordercontrol.StepMsg();

    return <BuildStep displayMsg={stepMsg} stepOptions={currentStep} selected={this.state.selected} stepCtrls={stepCtrls} onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
function BuildStep(props){
  const {stepOptions, stepCtrls} = props;
  const hasElements = stepOptions.hasMenuElements;
const stepMsg = props.displayMsg!==''?<div className="orderStepMsg">{props.displayMsg}</div>:null;
  const elementArray = hasElements?
    <ElementArray stepInfo={stepOptions.elements} selected={props.selected} onSelect={props.onSelect}/>
    :null;
  const controlArray = <ControlArray stepCtrls={stepCtrls} onTrigger={props.onTrigger}/>
  const stepClassName = `orderstep-${stepOptions.curStepType}-${stepOptions.stepName}`;
  return (
    <div className={stepClassName}>
      {stepMsg}
      {elementArray}
      {controlArray}
    </div>
  )  
}
function ElementArray(props){
  const elements = props.stepInfo.elements;
  const hasRows = props.stepInfo.hasRows;
  const hasMulti = props.stepInfo.hasMulti;  
  const click = props.onSelect;
  const sel = props.selected;
  return (
    <ul className="menuEleList">
    {hasRows?    
    elements.map((e)=>{
      const rowName = e.name;
      const rowClass = e.rClass;
      const rowKey = `${rowClass}-${rowName}`;
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
        <div className={rowClass} key={rowKey}>
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
    const ret = {      
      ownerType: s.ownerType,
      ownerName: s.ownerName,
      targetType: s.targetType,
      targetName: s.targetName,
      actionType: s.action,
      hasSpecial: s.hasSpecial,    
      trigger: s.trigger,
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