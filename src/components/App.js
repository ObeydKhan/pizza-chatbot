import React from 'react';
import Order from './PizzaOrder';
import {Header, MainArea, SliceBot} from './PageDisplay'
import '../css/App.css';
import '../css/DisplayMainArea.css';
import BotAlertMsg from './AppElements/Util/BotAlertMsg';
import {reducer} from './AppReducer';
import Pizza from './Pizza';
import ItemMenu from './itemMenu';
class App extends React.Component {
  constructor(props) {
    super(props);       
    this.updateAppState =this.updateAppState.bind(this);
    this.getBotState = this.getBotState.bind(this);          
    this.state = {      
      alert:false,      
      display:{
        page:'Location',
        bot:false,
        botDisplay:false,        
      },             
      locObj: this.props.locObj,           
      order: new Order(),
      menu: new ItemMenu(),
      currentPizza: new Pizza(0),                       
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
  getBotState(){
    const botState = {
      showBot:this.state.display.bot,
      botDisplay:this.state.display.botDisplay,
      order:this.state.order,
      menu: this.state.menu,
      pizza:this.state.currentPizza,
    }
    return botState
  }
  reset(){
    const values= {                 
      order: new Order()}
    this.updateAppState({type:'reset', values:values})
  }  
  render(){
    const alert = this.state.alert?<BotAlertMsg values={this.state.alert} onClose={(p)=>{return this.updateAppState(p)}}/>:null;
    const {display, locObj}=this.state;
    const showPage = display.page;
    const showBot = display.bot;
    
    return (
      <div className="sliceBot">
        <Header cnt={this.state.order.PizzaCount} locObj={locObj} updateAppState={(p)=>{return this.updateAppState(p)}}/>
        <MainArea showPage={showPage} locObj={locObj} updateAppState={(p)=>{return this.updateAppState(p)}} forwardedRef={this.input}/>
        <SliceBot showBot={showBot} getBotState={this.getBotState} updateAppState={(p)=>{return this.updateAppState(p)}}/>
        {alert}
      </div>
    )      
  }
}

export default App;