import React from 'react';
import Order from './PizzaOrder';
import ItemMenu from './itemMenu';
import {Header, MainArea, SliceBot} from './PageDisplay'
import '../css/App.css';
import '../css/DisplayMainArea.css';
class App extends React.Component {
  constructor(props) {
    super(props);    
    this.onTriggerBot=this.onTriggerBot.bind(this);
    this.onTriggerLoc=this.onTriggerLoc.bind(this);    
    this.onTriggerSpecial =this.onTriggerSpecial.bind(this);        
    this.state = {
      showPage: 'Location',
      showBot:false,             
      locObj: this.props.locObj,
      botStep:'',      
      order: new Order(),
      step: new ItemMenu(),
      prevStep:false,           
    };
    this.input = React.createRef();        
  }

    
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
    this.setState({
      locObj:props,
      showPage: p,
      botStep:p==='Main'?'menu':'',
      showBot:p==='Main',             
    });   
  }
  onTriggerSpecial(props){
    if(props.val==='Reload') {this.reset()}
    else if(props.val==='complete') {this.setState({showPage:'Final'})}    
    else if(props.type==='start'){
      const o = this.state.order;
      const s = this.state.step;
      o.CreateNewPizza();
      o.ordername = props.val;
      s.step = 'new';      
      this.setState({showPage:'Menu',botStep:'menu',order:o,step:s});      
    } else if(props.type==='inst') {
      const o = this.state.order;
      const s = this.state.step;
      o.SpecialInstructions = props.val;
      s.step = 'none';      
      this.setState({showPage:'NonMenuStep',botStep:'reviewPizza',order:o,step:s,showBot:true});
    } else if(props==='change'){
      const loc = this.state.locObj;
      loc.ChangeLoc();      
      this.setState({        
        locObj:loc,
        showPage: 'Location',
        showBot:false,              
      });
    } else {
      this.setState({showPage:props.val});
    }       
  }
  onTriggerBot(props){
    const trigger = props;
    const type = trigger.type;
    const value = trigger.value;
    const stateVal = {
      botStep:trigger.triggerRet.botStep,
      order:trigger.triggerRet.order,
      step:trigger.triggerRet.step,
      prevStep:false,
    }
    if(value===''&&(type==='cancel'||type==='complete'||type==='remove')){
      stateVal.prevStep = {botStep:this.state.botStep, order:this.state.order, step:this.state.step}
    } else if(type==='cancel'&&value!=='no'){
      if(value==='main'){
        this.reset();
      } else if(value==='select'){
        this.onTriggerLoc({locObj:this.state.locObj,page:'Location'})
      } else if(value==='restart'){
        
      }
    } else if(value==='no'){
      stateVal.botStep = this.state.prevStep.botStep
      stateVal.order=this.state.prevStep.order
      stateVal.step=this.state.prevStep.step
      stateVal.prevStep=false;
    }   
    if(!trigger.triggerRet){return false;}
    this.setState({
      botStep:stateVal.botStep,
      order:stateVal.order,
      step:stateVal.step,
      prevStep:stateVal.prevStep,
    })    
  }
  reset(){
    this.setState({
      showPage: 'Location',
      showBot:false,             
      locObj: this.props.locObj,      
      botStep:'',
      order: new Order(),
      step: new ItemMenu(),            
    });
  }
  render(){   
    return (
      <div className="sliceBot">
        <Header appState={this.state} onChange={this.onTriggerSpecial}/>
        <MainArea appState={this.state} onTriggerLoc={this.onTriggerLoc} forwardedRef={this.input}/>
        <SliceBot appState={this.state} onTriggerBot={this.onTriggerBot} onAppUpdate={this.onTriggerSpecial}/>
      </div>
    )      
  }
}
export default App;