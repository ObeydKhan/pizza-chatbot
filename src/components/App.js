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
      botStep.type = 'menu';
      botStep.value = 'new';
    }    
    this.setState({
      locObj:locObj,
      showPage: page,
      botStep:botStep,             
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
      const b = {type:'menu', value:this.state.step.stepList[0].val};
      this.setState({showPage:'Menu',botStep:b,order:o,step:s});      
    } else if(props.type==='inst') {
      const o = this.state.order;
      const s = this.state.step;
      o.SpecialInstructions = props.val;
      s.step = 'none';
      const b = {type:'reviewPizza', value:''};
      this.setState({showPage:'NonMenuStep',botStep:b,order:o,step:s});
    } else {
      this.setState({showPage:props.val});
    }        
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
    if(!props.triggerRet){return false;}
    this.setState({
      botStep:props.triggerRet.botStep,
      order:props.triggerRet.order,
      step:props.triggerRet.step,
    })    
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