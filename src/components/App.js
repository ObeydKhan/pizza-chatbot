import React from 'react';
import Order from './PizzaOrder';
import ItemMenu from './itemMenu';
import {Header, MainArea, SliceBot} from './PageDisplay'
import '../css/App.css';
import '../css/DisplayMainArea.css';
import AppState from './AppState';
import BotAlertMsg from './BotAlertMsg';

const appOrder = new Order();
const menuStep = new ItemMenu();
const appValues = new AppState();

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.onTriggerBot=this.onTriggerBot.bind(this);        
    this.onTriggerSpecial =this.onTriggerSpecial.bind(this);
    this.updateAppState =this.updateAppState.bind(this);        
    this.state = {
      alert:false,
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
        if(appOrder.appBotStepClass!=='edit'){
          appOrder.CreateNewPizza();      
          menuStep.step = 'new';
          appValues.appBotStepClass='menu';
          appValues.appBotStepType='name'; 
        } else {
          menuStep.step = 'none';
          appValues.appBotStepClass='reviewOrder';
          appValues.appBotStepType='none';
        }              
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
        appValues.appBotStepType='inst';       
        this.setState((state,props)=>{        
          return {
            appValues:appValues,
            order:appOrder,
            step:menuStep,
          }
        })
        break;
      case 'change':
        const locChng = this.state.locObj;
        locChng.ChangeLoc();
        appValues.appBotStepClass='Location';
        appValues.appBotStepType='loc';      
        this.setState((state,props)=>{        
          return{
            locObj:locChng,
            appValues:appValues}});
        break;
      case 'location':
        const locSet = this.state.locObj;
        const appClass = p.values.searchStep==='done'?'menu':'';
        const appType = appClass==='menu'?appClass:'loc';
        appValues.appBotStepClass=appClass;
        appValues.appBotStepType=appType;
        this.setState((state,props)=>{        
          return{
            locObj:locSet,
            appValues:appValues}});
        break;
      case 'alert':
        this.setState((state,props)=>{        
          return{
            alert:p.values}});
        break;
      default:
        return null;
    }    
  };
  onTriggerSpecial(props){
    if(props.val==='Reload') {this.reset()}
    else if(props.val==='complete') {this.setState({display:'Final'})  
    } else {
      this.setState({display:props.val});
    }       
  }
  onTriggerBot(props){
    const trigger = props;
    const type = trigger.type;
    const value = trigger.value;
    const botClass = trigger.triggerRet.botStepClass;
    const stateVal = {
      appValues:new AppState(),
      order:trigger.triggerRet.order,
      step:trigger.triggerRet.step,
      prevStep:false,
    }
    stateVal.appValues = this.state.appValues
    if(value===''&&(type==='cancel'||type==='complete'||type==='remove')){
      stateVal.prevStep = {appValues:this.state.appValues, order:this.state.order, step:this.state.step};
      stateVal.appValues.appBotStepClass=botClass;
      stateVal.appValues.appBotStepType=value;
    } else if(type==='cancel'&&value!=='no'){
      if(value==='main'){
        this.reset();
      } else if(value==='select'){
        this.onTriggerLoc({locObj:this.state.locObj,page:'Location'})
      } else if(value==='restart'){
        
      }
    } else if(type==='remove'&&value!=='no'){      
      stateVal.appValues.appBotStepClass=botClass
      stateVal.appValues.appBotStepType=botClass==='menu'?'menu':'none';      
    } else if(value==='no'){
      stateVal.appValues = this.state.prevStep.appValues
      stateVal.order=this.state.prevStep.order
      stateVal.step=this.state.prevStep.step
      stateVal.prevStep=false;
    } else if(type==='spec'){
      stateVal.appValues.appBotStepClass='edit'
      stateVal.appValues.appBotStepType=type;
    } else if(type==='add'){
      stateVal.appValues.appBotStepClass='menu';
      stateVal.appValues.appBotStepType='name';
      stateVal.step.step='new';
      
    } else {
      stateVal.appValues.appBotStepClass=type
      stateVal.appValues.appBotStepType=value;
    }   
    if(!trigger.triggerRet){return false;}
    this.setState({
      appValues:stateVal.appValues,
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
    const alert = this.state.alert?<BotAlertMsg values={this.state.alert} onClose={(p)=>{return this.updateAppState(p)}}/>:null;
    return (
      <div className="sliceBot">
        <Header appState={this.state} updateAppState={(p)=>{return this.updateAppState(p)}}/>
        <MainArea appState={this.state} updateAppState={(p)=>{return this.updateAppState(p)}} forwardedRef={this.input}/>
        <SliceBot appState={this.state} updateAppState={(p)=>{return this.updateAppState(p)}} onTriggerBot={this.onTriggerBot} onAppUpdate={this.onTriggerSpecial}/>
        {alert}
      </div>
    )      
  }
}

export default App;