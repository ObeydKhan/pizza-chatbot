import React from 'react';
import ChatBot from './chatbot/ChatBot';
import { ThemeProvider } from 'styled-components';
import BotStep from './BotStep';
import logo from '../resources/SliceLogo.png';
class BotDisplay extends React.Component{
  constructor(props){
    super(props)
    
    this.handleEnd = this.handleEnd.bind(this);
      }   

  handleEnd(){
    //load order summary page    
    this.props.onAppUpdate({val:'complete'});
  }
  render(){
    if(this.props.appState.appValues===null||this.props.appState.appValues===undefined){return null}
    const showBot=this.props.appState.appValues.showBot;        
    if(!showBot){return (null)}
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
        hideSubmitButton={true}        
        steps={[
          {
            id: '1',
            message: 'Welcome to Slice!',            
            trigger: '2',
            hideInput: true,            
          },
          {
            id: '2',
            message: 'Please enter a name for the order',
            trigger: 'ordername',
            hideInput: true,            
          },
          {
            id: 'ordername',
            user:true,
            placeholder: 'Please enter a name...',
            trigger: 'pizzabuilder',
            hideInput: true,   
          },
          {
            id: 'pizzabuilder',
            placeholder: 'Choose an option',
            component: <BotStep appState={this.props.appState} onTriggerBot={this.props.onTriggerBot} updateAppState={(p)=>{return this.props.updateAppState(p)}}/>,              
            waitAction: true, 
            replace: true,                        
            trigger: 'pizzabuilder',
            hideInput: true,           
          },
          {
            id:'specialinstmsg',
            message:'Would you like to add any special instructions?',
            trigger: 'specialinstques',
            hideInput: true,
          },
          {
            id:'specialinstques',
            options: [
              {value: 'yes', label:'Yes', trigger:'specialinstentry'},
              {value: 'no', label:'No, Lets review this pizza', trigger:'pizzabuilder'},
              ],
            hideInput: true,
          },
          {
            id:'specialinstentry',
            user:true,
            trigger: 'pizzabuilder',
            hideInput: true,
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
export default BotDisplay;