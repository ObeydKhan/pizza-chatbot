import React, { Component } from 'react';
import ChatBot from './chatbot/ChatBot';
import { ThemeProvider } from 'styled-components';
import OrderStep from './OrderStep';
import Summary from './Summary';
import Pizza from './Pizza';

class SimpleForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      order: this.props.order,
      pizzaCnt: 0,
      curPizza: '',
    };
    this.handleEnd = this.handleEnd.bind(this);
  }
  handleEnd(){
    //load order summary page
  }
  componentDidMount(){
    const order = this.state.order;
    const p = order.CurrentPizza;
    const cnt = order.PizzaCnt;
    console.log('Current Pizza:\n'+ JSON.stringify(p));
    console.log('Pizza count = ' + cnt);
    this.setState({
      curPizza: p,
      pizzaCnt: cnt,
    });
  }
  render() {
    const pizza = new Pizza(1);      
    console.log('Form constructor');
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
            trigger: '3'   
          },
          {
            id: '3',
            message: 'Select a crust style:',
            trigger: 'crusts',            
          },
          {
            id: 'crusts',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: pizza,
            trigger: '4',
          },
          {
            id: '4',
            message:'Please choose a pizza size:',
            trigger: 'sizes'
          },
          {
            id: 'sizes',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: pizza,
            trigger: '5'
          },
          {
            id: '5',
            message: 'Please choose a sauce:',
            trigger: 'sauces',            
          },
          {
            id: 'sauces',
            placeholder: 'Choose an option',
            component: <OrderStep/>,
            waitAction: true,
            replace: true,
            metadata: pizza,
            trigger: '6',
          },
          {
            id: '6',
            message: 'Please choose your cheeses:',
            trigger: 'cheeses',
          },          
          {
            id: 'cheeses',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: pizza,               
            trigger: '7',                        
          },         
          {
            id: '7',
            message: 'Please choose your meat toppings:',
            trigger: 'meats',            
          },
          {
            id: 'meats',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: pizza,               
            trigger: '8',
          },
          {
            id: '8',
            message: 'Please choose your non-meat toppings:',
            trigger: 'nonmeats',            
          },
          {
            id: 'nonmeats',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: pizza,               
            trigger: '9'
          },
          {
            id: '9',
            message: 'Please review your pizza:',
            trigger: 'pizzareview',            
          },
          {
            id: 'pizzareview',
            component: <Summary />,
            asMessage: true,            
            metadata: pizza,
            trigger: '10'
          },
          {
            id: '10',
            message: 'Good Bye',
            trigger: 'end-message',            
          },            
          {
            id: 'end-message',
            message: 'Thank you for choosing Slice! Your order will be ready in 5-10 minutes!',
            end: true,
          },
          ]}
        />
          </ThemeProvider>
      );
    }
  }
  
  export default SimpleForm;