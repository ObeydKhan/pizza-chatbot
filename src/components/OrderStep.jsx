import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';

class OrderStep extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selected:[],
      items:[],
      curKey: '',
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
      return 'noentry'
    }
    return '';
  }
  checkRequiredInput(val){
    if((val.ownerName==='crusts'||val.ownerName==='sizes')&&this.state.selected.length===0){
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
  
    //update order
    const selectedObjs = this.state.selected;
    const processObj = {action:val, selections:selectedObjs}
    const processingResults = ordercontrol.ProcessAction(processObj);
    const msg = processingResults.msg;
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
    const key = this.props.step.key;
    this.props.step.metadata.botKey = key;
    if(key!==this.state.curKey){
      this.setState({curKey:key});
      this.props.step.id = key;
      const newsteps = this.props.steps.pizzabuilder;
      newsteps.id = key;
      delete this.props.steps.pizzabuilder;
      this.props.steps[key]=newsteps;
    }
    const data = {
      preserveMsg:true,
      stepMsg: ordercontrol.stepMsg,
      value:selectedObjs,
      type:type,
      msg:msg,
    }
    if(val.targetType==='special'&&val.actionType==='next'){
      ordercontrol.handleSpecialInst =true;
      this.props.step.trigger = val.targetName;
    }
    this.setState({selected:[],trigger: true, curKey:''}, () => {
      this.props.triggerNextStep(data);
    });
  }
  onSelect(val){
    const currrentlySelected = this.props.step.metadata.HandleItemSelect(val);
    this.setState({selected:currrentlySelected});      
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
    if(ordercontrol.IsSpecialStep){
      return <BuildSpecialStep stepInfo={ordercontrol.SpecialStep} onTrigger={this.triggerNext}/>
    }

    const getStepType = (val) => {
      if(val.IsSpecialStep) return 'specialStep';
      switch (val.currentStepInfo.currentStep.type){
        case 'review':
          return 'reviewStep';
        case 'edit':
          return val.currentStepInfo.currentStep.name==='order'?'editOrderStep':'editStep';
        default:
          return 'standard';
      }      
    }
    const currentStep = ordercontrol.StepInfo();    
    const stepCtrls = StepFactory(currentStep);
    
    const buildType = getStepType(ordercontrol);
    return <BuildStep ordercontrol={ordercontrol} stepCtrls={stepCtrls} stepType={buildType} selected={this.state.selected}  onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
function BuildStep(props){
  const buildType = props.stepType;
  const stepMsg = props.ordercontrol.StepMsg();
  switch (buildType){
    case 'specialStep':
      return <BuildSpecialStep stepInfo={props.ordercontrol.SpecialStep} onTrigger={props.onTrigger}/>
    case 'reviewStep':
    return <BuildReviewStep reviewType={props.ordercontrol.currentStepInfo.currentStep.name} pizzaOrder={props.ordercontrol.pizzaOrder} stepCtrls={props.stepCtrls} onTrigger={props.onTrigger}/>;
    case 'editOrderStep':
      return null;
    default:
      const stepProcesingInfo = props.ordercontrol.CurrentStep();
      return <BuildStandardStep displayMsg={stepMsg} stepOptions={stepProcesingInfo} selected={props.selected} stepCtrls={props.stepCtrls} onTrigger={props.onTrigger} onSelect={props.onSelect}/>;
  }
}
function BuildSpecialStep(props){
  const stepMsg = <div className="orderStepMsg">{props.stepInfo.stepMsg}</div>;
  const controlArray = <ControlArray stepCtrls={props.stepInfo.stepCtrls} onTrigger={props.onTrigger}/>
  const stepClassName = `orderstep-${props.stepInfo.msgClass}`;
  return (
    <div className={stepClassName}>
      {stepMsg}     
      {controlArray}
    </div>
  )
}
function BuildReviewStep(props){
  const reviewType = props.reviewType;
  if(reviewType==='pizza'){
    const id = props.pizzaOrder.CurrentPizzaID;    
    const retclass = `review-pizza-${id}`;
    const topMsg = `Summary for Pizza #${id}`;
    const reviewStr = props.pizzaOrder.CurrentPizzaString;
    const controlArray = <ControlArray stepCtrls={props.stepCtrls} onTrigger={props.onTrigger}/>
    return (
      <div className="pizzaReviewMsg">
        <div className="pizzaIDmsg">{topMsg}</div>
        <div className={retclass}>{reviewStr}</div>
        {controlArray}
      </div>
    )
  }
}
function BuildStandardStep(props){
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
        const val = {itemInfo:b.itemInfo, multi:hasMulti};
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
      const val = {itemInfo:e.itemInfo, multi:hasMulti};
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