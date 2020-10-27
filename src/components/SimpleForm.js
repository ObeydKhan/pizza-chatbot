import React, { Component } from 'react';
import ChatBot from './chatbot/ChatBot';
import { ThemeProvider } from 'styled-components';
import OrderStep from './OrderStep';


class SimpleForm extends Component {
  constructor(props){
    super(props);
    this.handleEnd = this.handleEnd.bind(this);
  }
  handleEnd(){
    //load order summary page
    const order = this.props.order;
    this.props.end(order)
  }
  render() {
    const order = this.props.order;          
    return (
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
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
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
      );
    }
  }
  
  export default SimpleForm;