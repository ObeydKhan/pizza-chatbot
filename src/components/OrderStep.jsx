import React from 'react';
import '../css/OrderStyle.css';
import StepFactory from './StepFactory';
import PizzaMenu from './itemMenu';
import Summary from './Summary';

class OrderStep extends React.Component {
  constructor(props){
    super(props);
    this.state={       
      pizzaMenu: new PizzaMenu(),
      order:this.props.step.metadata,
      selectedOptions:[],     
      trigger: false,
    }    
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);    
  }
  checkRequiredInput(props){
    if((props.owner.name==='crusts'||props.owner.name==='sizes')&&this.state.selectedOptions.length===0){
      const trig = (props.trigger.name==='remove'||props.trigger.name==='cancel')?true:false;      
      return trig;
    }
    return true;
  }
  triggerNext(props){   
    if(!this.checkRequiredInput(props)){
      alert(`You must select one of the available ${props.owner.name}`);
      return null;
    }
    const order = this.props.step.metadata;
    const getUserMsg = (props) =>{
      switch(props.target.type){
      case 'new':
        //add new pizza
        order.SavePizzaToOrder();
        this.CreateNewPizza(props.owner);
        return props.stepMsg;     
      case 'edit':
        //handle edits
        return this.HandelEdit(props);      
      case 'menu' || 'review':
        order.SetStep(this.CreateStep(props));
        return this.CreateItemMsg(props.owner.name);       
      case 'special':
        order.SetStep(this.CreateStep(props));
        return props.stepMsg;      
      default:
        return this.HandleSpecialActions();
      }
    }
    //change current step info to with new 'key'
    const stepKey = order.ProcessStep(this.props.step.key);    
    const genericStep = this.props.steps.pizzabuilder;
    this.props.step.id = stepKey;
    genericStep.id = stepKey;
    this.props.steps[stepKey] = genericStep;
    
 
    
    //trigger next step in chatbot
    const type = `(${props.owner.type}:${props.owner.name})=>(${props.target.type}:${props.target.name})`
    
    const data = {
      preserveMsg:true,
      stepMsg: props.stepMsg,      
      type:type,
      msg:getUserMsg(props),
    }
    this.setState({selected:[],trigger: true, order:order}, () => {
      this.props.triggerNextStep(data);
    });
  }
  onSelect(val){
    if(val===null||val===undefined) return null;
    const order = this.props.step.metadata
    const currrentlySelected = order.SelectPizzaItems(val);
    this.props.step.metadata = order;
    this.setState({selectedOptions:currrentlySelected, order:order});      
  }
  CreateStep(props){       
    const next = (step)=>{
      switch(step.type){
        case 'menu':         
          return {type:step.type, name:this.state.pizzaMenu.getNext(step.name)};         
        case 'edit':          
          if(step.name==='save'||step.name==='drop') return {type:'review', name:'pizza'}
          const name = step.name.length<3?'pizza':step.name;
          return {type:step.type, name:name==='pizza'?this.state.pizzaMenu.MenuSteps.concat(['inst']):'item'};         
        case 'review':
          return {type:step.type, name:step.name==='order'?this.props.step.metadata.PizzaList:'pizza'};
        default:
          return {type:'', name:''};
      }
    }
    const stepContents = (step)=>{
      switch(step.type){
        case 'menu'||'edit':         
          if(step.type==='edit'&&step.name.length<3) return {type:'review', 
          contents:this.CreateReview(this.props.step.metadata.GetPizzaString(step.name))}//pizza summary
          return {type:this.state.pizzaMenu.getContentType(step.name), 
            contents:{hasMulti:this.state.pizzaMenu.getHasMultipleSelect(step.name),
              elements:this.state.pizzaMenu.getStepElements(step.name),
              onSelect: this.onSelect,
              selected:this.props.step.metadata.SelectionArray(step.name),}}        
        case 'review':
          const str = step.name==='pizza'?this.props.step.metadata.GetPizzaString(step.name):this.props.step.metadata.GetOrderSummary();
          return {type:'review', contents:this.CreateReview(str)}
        default:          
          return ''
      }
    };    
    const stepMsg = (step) => {
      switch(step.type){
        case 'menu':         
          return this.state.pizzaMenu.getStepMessage(step.name);         
        case 'edit':         
          return step.name==='pizza'?'Please select an option below:':this.state.pizzaMenu.getStepMessage(step.name);         
        case 'review':
          return step.name==='order'?'review your order':'review this pizza';
        default:
          return '';
      }
    };
    const fromReviewOrder = (props)=> {
      switch(props.owner.type){
        case 'review':
          return props.owner.name==='order';
        case 'edit':
          return props.isReturnFromReviewOrder;
        case 'menu':
          return false;
        default:
          return false;
      }
    }
    if(props.owner.type!=='special'){
      const returnStep = {
        current:props.target, 
        prev:props.owner, 
        next:next(props.target),
        isReturnFromReviewOrder:fromReviewOrder(props),
        stepMsg:stepMsg(props.target), 
        stepContents:stepContents(props.target)
      };    
      return returnStep;
    } else {
      //handle special step
      return ({
        current:props.target, 
        prev:props.owner,
        stepMsg:'',
      })
    }    
  }
  CreateReview(props){
    const isFinal = props.hasOwnProperty('orderName');
    if(isFinal){
      return({
        name:props.orderName,
        cnt:props.pizzaCnt,
        tables:props.pizzaInfo.map((i)=> {return this.CreateSummaryTable(i)})
      })
    } else {
      return Summary(this.CreateSummaryTable(props))
    }
  }
  CreateSummaryTable(pizza){
    const id = pizza.id;
    const items = pizza.items;
    const spcinst = pizza.specinst;
    const stringArray = items.map((i)=> {
      const item = Object.getOwnPropertyNames(i)[0];
      //const val = [].concat(this.props.step.metadata.GetPizzaItems(item));
      const str = this.CreateItemMsg(item);
      return ({
        tr:item,
        td:str,
      })
    })
    return({
      id: id,
      table:stringArray,
      specInst:spcinst,
    })
  }
  CreateItemMsg(type){
    const items = [].concat(this.props.step.metadata.GetPizzaItems(type));
    if(items.length===0||(items.length===1&&items[0].id==='')){
      return `No ${type} added`;
    }    
    const retArray = items.map((item)=>{      
      const itemName = this.state.pizzaMenu.GetItemName(type,item.id);
      const qty = item.qty!=='0'?`${this.state.pizzaMenu.GetOptMsg('qty',item.qty)} `:'';
      const half = item.half!=='0'?` ${this.state.pizzaMenu.GetOptMsg('half',item.half)}`:'';
      return `${qty}${itemName}${half}`;
    })
    return retArray.join(', ')
  }   
  CreateNewPizza(prev){
    const cur = {type:'menu', name:this.state.pizzaMenu.getStep(0)};
    this.props.step.metadata.MakeNewPizza()
    this.props.step.metadata.SetStep(this.CreateStep({owner:prev, target:cur}));    
  }
  HandelEdit(props){
    const altTrigger = props.target.name==='specialinstmsg'||props.target.name==='name';
    let step= {};    
    if(altTrigger){
      this.props.steps.trigger = props.target.name;
      const next = props.target.name==='name'?{type:'review', name:'order'}:{type:'edit', name:'pizza'};
      step = {current:props.prev, prev:props.prev, next:next, 
        isReturnFromReviewOrder:props.isReturnFromReviewOrder}
    } else if(isNaN(props.target.name)) {
      this.props.step.metadata.EditSelections(props.target.name);
      step = this.CreateStep(props);
    } else {
      if(this.props.step.metadata.ChangeCurrentPizza(props.target.name)){
        step = this.CreateStep(props);
      }
    }
    this.props.step.metadata.SetStep(step)
    return props.stepMsg;
  }
  HandleSpecialActions(props){
    switch(props.target.type){
      case 'complete':
        this.props.steps.trigger = 'endmsg1';      
        break;
      default:
        this.props.step.metadata.SpecialAction(props.target);
    }
    return props.stepMsg;
  }  
  render(){
    const order = this.props.step.metadata;
    if(!order.OrderIsStarted()){
      const name = this.props.steps.ordername.value;
      order.StartNewOrder(name);
      this.CreateNewPizza({type:'menu',name:'Enter Name'});
    } else if(this.props.steps.hasOwnProperty('specialinstmsg')){
        if(this.props.steps.hasOwnProperty('specialinstentry')){
          order.specialInstructions = this.props.steps.specialinstentry.value;
          delete this.props.steps.specialinstentry
        }
      delete this.props.steps.specialinstmsg;
      delete this.props.steps.specialinstques;
    }   
    const currentStep = order.GetStep();    
    return <StepFactory stepInfo={currentStep} selected={this.state.selected}  onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
export default OrderStep;