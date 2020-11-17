import React from 'react';
import Order from './PizzaOrder';
import ItemMenu from './itemMenu';
import {Header, MainArea, SliceBot} from './PageDisplay'
import '../css/App.css';
import '../css/DisplayMainArea.css';
import AppState from './AppState';

const appOrder = new Order();
const menuStep = new ItemMenu();
const appValues = new AppState();

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.onTriggerBot=this.onTriggerBot.bind(this);
    this.onTriggerLoc=this.onTriggerLoc.bind(this);    
    this.onTriggerSpecial =this.onTriggerSpecial.bind(this);
    this.updateAppState =this.updateAppState.bind(this);        
    this.state = {
      appValues:appValues,             
      locObj: this.props.locObj,           
      order: appOrder,
      step: menuStep,
      prevStep:false,                 
    };
    this.input = React.createRef();
            
  }
  updateAppState = (p) => {    
    const type = p.type;
    switch (type) {    
      case 'setName':
        appOrder.ordername = p.values;      
        appOrder.CreateNewPizza();      
        menuStep.step = 'new';
        appValues.appBotStepClass='menu';
        appValues.appBotStepType='name';              
        this.setState((state,props)=>{        
          return {
            appValues:appValues,
            order:appOrder,
            step:menuStep,
          }
        })
        break;
      case 'setInst':
        appOrder.SpecialInstructions = p.values;
        menuStep.step = 'none';
        appValues.appBotStepClass='reviewPizza';
        appValues.appBotStepType='setInst';       
        this.setState((state,props)=>{        
          return {
            appValues:appValues,
            order:appOrder,
            step:menuStep,
          }
        })
        break;
      default:
        return null;
    }
    
  };  
  onTriggerLoc(props){   
    const locMode = props.searchStep;
    const page = (t)=>{
      switch(t){
        case 'search':
          return 'Location';
        case 'select':
          return 'Location';
        case 'done':
          return 'Main';
        default:
          return 'Location'
      }
    }
    const p = page(locMode);
    appValues.appDisplay =p;
    appValues.appBotStepClass=p==='Main'?'menu':'';
    appValues.appShowBot=p==='Main';
    this.setState({
      locObj:props,
      appValues:appValues                   
    });   
  }
  onTriggerSpecial(props){
    if(props.val==='Reload') {this.reset()}
    else if(props.val==='complete') {this.setState({display:'Final'})}    
          
   else if(props.type==='inst') {
      
    } else if(props==='change'){
      const loc = this.state.locObj;
      loc.ChangeLoc();      
      this.setState({        
        locObj:loc,
        display: 'Location',
        showBot:false,              
      });
    } else {
      this.setState({display:props.val});
    }       
  }
  onTriggerBot(props){
    const trigger = props;
    const type = trigger.type;
    const value = trigger.value;
    const stateVal = {
      appValues:new AppState(),
      order:trigger.triggerRet.order,
      step:trigger.triggerRet.step,
      prevStep:false,
    }
    stateVal.appValues = this.state.appValues
    if(value===''&&(type==='cancel'||type==='complete'||type==='remove')){
      stateVal.prevStep = {appValues:this.state.appValues, order:this.state.order, step:this.state.step}
    } else if(type==='cancel'&&value!=='no'){
      if(value==='main'){
        this.reset();
      } else if(value==='select'){
        this.onTriggerLoc({locObj:this.state.locObj,page:'Location'})
      } else if(value==='restart'){
        
      }
    } else if(value==='no'){
      stateVal.appValues = this.state.prevStep.appValues
      stateVal.order=this.state.prevStep.order
      stateVal.step=this.state.prevStep.step
      stateVal.prevStep=false;
    } else {
      stateVal.appValues.appBotStepClass=type
      stateVal.appValues.appBotStepType=value

    }   
    if(!trigger.triggerRet){return false;}
    this.setState({
      botStepClass:stateVal.botStepClass,
      order:stateVal.order,
      step:stateVal.step,
      prevStep:stateVal.prevStep,
    })    
  }
  reset(){
    this.setState({
      display: 'Location',
      showBot:false,             
      locObj: this.props.locObj,      
      botStepClass:'',
      order: new Order(),
      step: new ItemMenu(),            
    });
  }
  
  render(){   
    
    return (
      <div className="sliceBot">
        <Header appState={this.state} onChange={this.onTriggerSpecial}/>
        <MainArea appState={this.state} onTriggerLoc={this.onTriggerLoc} forwardedRef={this.input}/>
        <SliceBot appState={this.state} updateAppState={(p)=>{return this.updateAppState(p)}} onTriggerBot={this.onTriggerBot} onAppUpdate={this.onTriggerSpecial}/>
      </div>
    )      
  }
}

export default App;