import React from 'react';
import ChatBot from '../chatbot/ChatBot';
import { ThemeProvider } from 'styled-components';
import ItemMenu from '../itemMenu';
import BotStep from './BotStep';
import logo from '../../resources/SliceLogo.png';
import Pizza from '../Pizza';
import {reducer} from './BotReducer';

export default class SliceBot extends React.Component{
  constructor(props){
    super(props)
    this.state={
      didUpdate:false,
      menu: new ItemMenu(),
      currentPizza: new Pizza(0),
    }
    this.handleTrigger = this.handleTrigger.bind(this);
    this.triggerAlert = this.triggerAlert.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }
  componentDidUpdate(prevProps,prevState){
    console.log('SliceBot did update');
    if(this.props!==prevProps&&prevState.didUpdate){
      this.setState({didUpdate:false});  
    }
  }
  shouldComponentUpdate(nextProps,nextState){
    const checkProps = this.props===nextProps;
    const didUpdate = !this.state.didUpdate&&nextState.didUpdate;
    const checkState = (this.state.menu===nextState.menu)&&(this.state.currentPizza===nextState.currentPizza);
    console.log('SliceBot should update');
    if(checkProps&&didUpdate){
      return false;
    } else if(checkProps && checkState){
      return true;
    } else {
      return true;
    }
  }
  handleEnd(){
    //load order summary page    
    this.props.onAppUpdate({val:'complete'});
  }
  triggerAlert(values){
    this.props.updateAppState({type:'alert', values:values});
  }

  updateBotState = (props) =>{
    const botProps = props.botUpdate;    
    this.setState(
      reducer({
        type:botProps.type,
        values:botProps.values,
      })
    )
  }
  handleTrigger(props){  
    this.props.updateAppState(props.appUpdate);
    this.updateBotState(props);        
  }
  render(){           
    if(!this.props.showBot){return (null)}
    const chkStep = typeof this.props.showBot==="boolean";    
    const refProps = {
      step:chkStep?'newOrder':this.props.showBot,
      pizza:this.state.currentPizza,      
      menu:this.state.menu,
      order:this.props.order,
    }
    if(refProps.step==='newOrder'&&this.props.hasOwnProperty('previousStep')){
      const c = this.props.previousStep.id==='ordername';
      refProps.name = c?this.props.previousStep.value:false;      
    }

    return (   
      <div className="chatBot" >
        <ThemeProvider theme={{
              background: '#f5f5f5',
              fontFamily: 'Montserrat',
              headerBgColor: '#DD841F',
              headerFontColor: '#fff',
              headerFontSize: '15px',
              botBubbleColor: '#DD841F',
              botFontColor: '#fff',
              userBubbleColor: '#fff',
              userFontColor: '#4a4a4a',
              marginTop: '60px',
          }}>
      <ChatBot headerTitle="Slice Bot"
        handleEnd = {this.handleEnd}
        floating={false}
        botAvatar={logo}                
        steps={[
          {
            id: '1',
            message: 'Welcome to Slice!',            
            trigger: '2',
                       
          },
          {
            id: '2',
            message: 'Please enter a name for the order',
            trigger: 'ordername',
                        
          },
          {
            id: 'ordername',
            user:true,
            placeholder: 'Please enter a name...',
            trigger: 'pizzabuilder',
               
          },
          {
            id: 'pizzabuilder',
            placeholder: 'Choose an option',
            component: <BotStep refProps={refProps} triggerAlert={this.triggerAlert} handleTrigger={(p)=>{this.handleTrigger(p)}} />,              
            waitAction: true, 
            replace: true,                        
            trigger: 'pizzabuilder',
                       
          },
          {
            id:'specialinstmsg',
            message:'Would you like to add any special instructions?',
            trigger: 'specialinstques',
            
          },
          {
            id:'specialinstques',
            options: [
              {value: 'yes', label:'Yes', trigger:'specialinstentry'},
              {value: 'no', label:'No, Lets review this pizza', trigger:'pizzabuilder'},
              ],
            
          },
          {
            id:'specialinstentry',
            user:true,
            trigger: 'pizzabuilder',
           
          },
          {
            id: 'endmsg1',         
            message: 'Thank you for using Slice!',
            trigger: 'endmsg2',            
          },
          {
            id: 'endmsg2',         
            message: 'Your order is confirmed. Please click OK to continue.',
            trigger: 'endmsg3',            
          },
          {
            id: 'endmsg3',         
            options: [{value: 'endbot', label:'OK', trigger:'endbot'}],                        
          },
          {
            id: 'endbot',         
            message: 'Good bye',
            end: true,            
          },
          ]}

        />
          </ThemeProvider>
      </div>   
    );   
  }
}
