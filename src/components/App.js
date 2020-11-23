import React from 'react';
import Order from './PizzaOrder';
import {Header, MainArea, SliceBot} from './PageDisplay'
import '../css/App.css';
import '../css/DisplayMainArea.css';
import BotAlertMsg from './AppElements/Util/BotAlertMsg';
import {reducer} from './AppReducer';


class App extends React.Component {
  constructor(props) {
    super(props);    
    this.handleBotActions=this.handleBotActions.bind(this);   
    this.updateAppState =this.updateAppState.bind(this);          
    this.state = {
      alert:false,
      display:{
        page:'Location',
        bot:false,        
      },             
      locObj: this.props.locObj,           
      order: new Order(),                       
    };
    this.input = React.createRef();            
  }
  updateAppState = (props) => {    
    this.setState(
      reducer({
        type:props.type,
        values:props.values,
      })
    )
  }
  componentDidUpdate(prevProps,prevState){

  }
  shouldComponentUpdate(nextProps,nextState){

    return true;
  }
  handleBotActions(props){
    const trigger = props;
    const type = trigger.type;
    const value = trigger.value;
    const botClass = trigger.triggerRet.botStepClass;
    const stateVal = {      
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
    const values= {                 
      order: new Order()}
    this.updateAppState({type:'reset', values:values})
  }  
  render(){
    const alert = this.state.alert?<BotAlertMsg values={this.state.alert} onClose={(p)=>{return this.updateAppState(p)}}/>:null;
    return (
      <div className="sliceBot">
        <Header cnt={this.state.order.PizzaCount} locObj={this.state.locObj} updateAppState={(p)=>{return this.updateAppState(p)}}/>
        <MainArea showPage={this.state.display.page} locObj={this.state.locObj} updateAppState={(p)=>{return this.updateAppState(p)}} forwardedRef={this.input}/>
        <SliceBot showBot={this.state.display.bot} order={this.state.order} updateAppState={(p)=>{return this.updateAppState(p)}}/>
        {alert}
      </div>
    )      
  }
}

export default App;