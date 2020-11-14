import React from 'react';
import Order from './PizzaOrder';
import ItemMenu from './itemMenu';
import {Header, MainArea, SliceBot} from './PageDisplay'
import '../css/App.css';
import BotTrigger from './BotTrigger';

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.onTriggerBot=this.onTriggerBot.bind(this);
    this.onTriggerLoc=this.onTriggerLoc.bind(this);    
    this.onTriggerSpecial =this.onTriggerSpecial.bind(this);        
    this.state = {
      showPage: 'Location',             
      locObj: this.props.locObj,
      botStep:{type:'', value:''},      
      order: new Order(),
      step: new ItemMenu(),      
    };
    this.input = React.createRef();        
  }
  onTriggerLoc(props){
    const locObj = props.locObj;
    const page = props.page;
    const botStep={type:'', value:''};
    if(page==='Main'){
      botStep.type = 
      botStep.value
    }    
    this.setState({
      locObj:locObj,
      showPage: page,             
    });
  }
  onTriggerSpecial(props){
    if(props.val==='Reload') {this.reset()}
    else if(props.val==='complete') {this.setState({showPage:'Final'})}    
    this.setState({showPage:props.val});
  }
  onTriggerBot(props){
    const trigger = props;
    const type = trigger.type;
    const value = trigger.value;
    if(value===''&&(type==='cancel'||type==='complete'||type==='remove')){
      trigger.prevStep = this.state.botStep;
    } else if(type==='cancel'&&value!=='no'){
      if(value==='main'){
        this.reset();
      } else if(value==='select'){
        this.onTriggerLoc({locObj:this.state.locObj,page:'Location'})
      } else if(value==='restart'){
        
      }
    }
    const triggerRet = BotTrigger({trigger:trigger, order:this.state.order, step:this.state.step});
    if(!triggerRet){return false;}

    this.setState({
      botStep:triggerRet.botStep,
      order:triggerRet.order,
      step:triggerRet.step,
    })
    return {
      trigger:triggerRet.tigger, 
      stepMsg:triggerRet.stepMsg, 
      userMsg:triggerRet.userMsg
    }
  }
  reset(){
    this.setState({
      showPage: 'Location',             
      locObj: this.props.locObj,      
      botStep:{type:'', value:''},
      order: new Order(),
      step: new ItemMenu(),      
    });
  }
  render(){
    console.log('App render');    
    return (
      <>      
      <Header cnt={this.state.order.PizzaCount} locObj={this.state.locObj} onCart={this.onTriggerCart} onChange={this.onTriggerSpecial}/>      
      <MainArea appState={this.state} onTriggerLoc={this.onTriggerLoc} forwardedRef={this.input}/>      
      <SliceBot appState={this.state} onTrigger={this.onTriggerBot} onSpecial={this.onTriggerSpecial}/>
      </>     
    );
  }
}

export default App;