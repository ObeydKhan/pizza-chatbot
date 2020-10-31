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
      selectedOptions:[],     
      trigger: false,      
    }    
    this.triggerNext = this.triggerNext.bind(this);
    this.onSelect = this.onSelect.bind(this);    
  }
  checkRequiredInput(props){
    if((props.owner.name==='crusts'||props.owner.name==='sizes')&&this.state.selectedOptions.length===0){
      const trig = (props.target.name==='remove'||props.target.name==='cancel'||(props.hasOwnProperty('btnCapt')&&(props.btnCapt.indexOf('Prev')!==-1)))?true:false;      
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
    const isPrev = (props.hasOwnProperty('btnCapt')&&(props.btnCapt.indexOf('Prev')!==-1));
    const getUserMsg = (props) =>{
      switch(props.target.type){
      case 'new':
        //add new pizza
        order.newPizza = true;        
        return 'Adding a new pizza to the order';     
      case 'edit':
        //handle edits
        return this.HandelEdit(props);      
      case 'menu' || 'review':
        order.SetStep(this.CreateStep(props));
        return isPrev?`Going back to ${this.state.pizzaMenu.getPrev(props.owner.name)}`:this.CreateItemMsg(props.owner.name);       
      case 'special':
        order.SetStep(this.CreateStep(props));
        return props.stepMsg;      
      default:
        return this.HandleSpecialActions(props);
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
    const selc = isPrev?this.props.step.metadata.SelectionArray(this.state.pizzaMenu.getPrev(props.owner.name)):[];
    const data = {
      preserveMsg:true,
      stepMsg: props.stepMsg,      
      type:type,
      msg:getUserMsg(props),
    }
    this.props.step.metadata = order;
    this.setState({selectedOptions:selc,trigger: true}, () => {
      this.props.triggerNextStep(data);
    });
  }
  onSelect(val){
    if(val===null||val===undefined) return null;
    const order = this.props.step.metadata
    const currrentlySelected = order.SelectPizzaItems(val);
    this.props.step.metadata = order;
    this.setState({selectedOptions:currrentlySelected});      
  }
  CreateStep(props){       
    const next = (step)=>{
      switch(step.type){
        case 'menu':         
          const chkNxt = this.state.pizzaMenu.getNext(step.name);
          const next = chkNxt==='EOM'?'Special Instructions':chkNxt;
          const type = chkNxt==='EOM'?'special':step.type;   
          return {type:type, name:next};         
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
    const isPrev = (props.hasOwnProperty('btnCapt')&&(props.btnCapt.indexOf('Prev')!==-1));
    const chkPrev = isPrev?this.state.pizzaMenu.getPrev(props.target.name):props.owner.name;
    const prevStep = chkPrev==='BOM'?'Enter Name':chkPrev
    const prevType  =chkPrev==='BOM'?'special':props.target.type;
    if(props.owner.type!=='special'){
      const returnStep = {
        current:props.target, 
        prev:{type:prevType, name:prevStep}, 
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
    const itemTypeArray = this.state.pizzaMenu.MenuSteps;
    const spcinst = pizza.specinst;
    const stringArray = itemTypeArray.map((i)=> {
      if(!items.hasOwnProperty(i)){return `No ${i} added`}
      const item = items[i];     
      const str = this.getItemString(i,item);
      return ({
        tr:i,
        td:str,
      })
    })
    return({
      id: id,
      table:stringArray,
      specInst:spcinst,
    })
  }
  getItemString(type,items){
    
    const retArray = items.map((item)=>{      
      if(item.id==='0'||item.id==='') return `No ${type} added`;
      const itemName = this.state.pizzaMenu.GetItemName(type,item.id);
      const qty = item.qty!=='0'?`${this.state.pizzaMenu.GetOptMsg('qty',item.qty)} `:'';
      const half = item.half!=='0'?` ${this.state.pizzaMenu.GetOptMsg('half',item.half)}`:'';
      return `${qty}${itemName}${half}`;
    })
    return retArray.join(', ')
  }
  CreateItemMsg(type){
    const items = [].concat(this.props.step.metadata.GetPizzaItems(type));
    if(items.length===0||(items.length===1&&items[0].id==='')){
      return `No ${type} added`;
    }    
    return this.getItemString(type,items);
  }   
  CreateNewPizza(prev){
    const cur = {type:'menu', name:this.state.pizzaMenu.getStep(0)};
    this.props.step.metadata.MakeNewPizza()
    this.props.step.metadata.SetStep(this.CreateStep({owner:prev, target:cur}));
    this.setState({addNewPizza:false});    
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
        this.props.step.trigger = 'endmsg1';      
        break;
      case 'inst':
        const prev=props.owner;
        const next = {type:'review', name:'pizza'};
        const cur = props.target;
        this.props.step.metadata.SetStep({current:cur, next:next, prev:prev});
        this.props.step.trigger = props.target.name;
        return this.CreateItemMsg(props.owner.name);        
      default:
        this.props.step.metadata.SpecialActions(props.target);
    }
    return props.stepMsg;
  }
  componentDidMount(){
    const order = this.props.step.metadata;
    if(order.newPizza){
      order.SavePizzaToOrder();
      this.CreateNewPizza({type:'review',name:'pizza'})
      order.newPizza = false
      this.props.step.metadata = order;
    }
    
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
        const owner = {type:'inst', name:'specialinstmsg'};
        const target = {type:'review', name:'pizza'};        
        order.SetStep(this.CreateStep({owner:owner, target:target}));
      delete this.props.steps.specialinstmsg;
      delete this.props.steps.specialinstques;
    }   
    const currentStep = order.GetStep();
    if (currentStep.current.type==='inst') return null;    
    return <StepFactory stepInfo={currentStep} selected={this.state.selectedOptions}  onTrigger={this.triggerNext} onSelect={this.onSelect}/>;
  }  
}
export default OrderStep;