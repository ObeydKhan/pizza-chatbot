import React, { Component } from 'react';
import ChatBot from './chatbot/ChatBot';
import { ThemeProvider } from 'styled-components';
import OrderStep from './OrderStep';
import Summary from './Summary';
import AddPizza from './AddPizza'; 

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
  componentDidMount(){
    
  }
  render() {
    const order = this.props.order;
    let cnt = 0;      
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
            trigger: 'addNewPizza',   
          },
          {
            id: 'addNewPizza',
            component: <AddPizza order={order}/>,       
            asMessage: true,
            trigger: 'crusts',           
          },          
          {
            id: 'crusts',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: '4',
          },
          {
            id: '4',
            message:'Please choose a pizza size:',
            trigger: 'sizes',
          },
          {
            id: 'sizes',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: '5',
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
            metadata: order,
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
            metadata: order,               
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
            metadata: order,               
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
            metadata: order,               
            trigger: '9'
          },
          {
            id: '9',
            message: 'Any Special instructions?',
            trigger: 'spcQues',            
          },
          {
            id: 'spcQues',
            options: [
              {value: 'yesSpc', label: 'Yes', trigger: 'yesSpc'},
              {value: 'noSpc', label: 'No', trigger: '10'},
            ],
            placeholder: 'Choose an option',
          },
          {
            id: 'yesSpc',
            message: 'Please enter your special instructions below',
            trigger: 'userInst',
          },
          {
            id: 'userInst',
            user: true,
            placeholder: 'Enter instructions here...',
            trigger: '10',
          },
          {
            id: '10',
            message: 'Please review your pizza:',
            trigger: 'pizzareview',            
          },
          {
            id: 'pizzareview',
            component: <Summary order={order} cnt={cnt}/>,
            asMessage: true,                       
            metadata: cnt,
            trigger: '11'
          },
          {
            id: '11',
            options: [
              {value: 'editP', label: 'Edit this pizza', trigger: 'editPizza'},
              {value: 'addP', label: 'Add another pizza', trigger: 'addNewPizza'},
              {value: 'compOr', label: 'Complete Order', trigger: 'end-message'},
            ],            
          },
          {
            id: 'editPizza',
            message: 'Please review your pizza:',
            trigger: 'end-message',
          },            
          {
            id: 'end-message',
            message: 'Thank you for choosing Slice!',
            end: true,
          },
          ]}
        />
          </ThemeProvider>
      );
    }
  }
  
  export default SimpleForm;