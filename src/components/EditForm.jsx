import React, { Component } from 'react';
import ChatBot from './chatbot/ChatBot';
import { ThemeProvider } from 'styled-components';
import OrderStep from './OrderStep';
import Summary from './Summary';
import AddPizza from './AddPizza'; 
import EditPizzzaSelect from './EditPizzaSelect';

class EditForm extends Component {
  constructor(props){
    super(props);
    this.state={
      order: null,
      cnt:0,
      pizzas: [],
      edt: true,
      trigger: false,
      pizzaID:'',
    };
    this.handleEnd = this.handleEnd.bind(this);
    this.triggerCan = this.triggerCan.bind(this);    
  }
  triggerCan(val){
    if(val==='-7'){
      window.location.reload(false);
    }
  }
  handleEnd(){
    //load order summary page
    const order = this.props.order;
    this.props.end(order)
  }
  componentDidMount(){
    const o = this.props.order;
    const c = o.PizzaCnt;
    const p = o.Pizzas;
    const e = o.IsOrderEdit;
    this.setState({
      order: o,
      cnt:c,
      pizzas: p,
      edt: e,
    });
  }
  render() {
    const order = this.props.order;    
    
    const sOvr = true;
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
            message: 'How would you like to modify this order?',
            trigger: 'editQuesResp',            
          },         
          {
            id: 'editQuesResp',
            options: [
              {value: 'editP', label:'Edit a Pizza', trigger:'editPizzaSel'},
              {value: 'addP', label:'Add a Pizza', trigger:'addNewPizza'},
              {value: 'remP', label:'Remove a Pizza', trigger:'remPizza'},
              {value: 'canOrd', label:'Cancel Order', trigger:'canorder'},
              {value: 'endEdit', label:'Finished Editting', trigger:'end-message'},
            ],
            placeholder: 'Select an option...',
          },
          {
            id: 'editPizzaSel',
            placeholder: 'Choose an option',
            component: <EditPizzzaSelect/>,              
            waitAction: true, 
            replace: true,
            metadata: order,            
            trigger: 'editQ',            
          },
          {
            id:'editQ',
            message:'Please select something to edit:',
            trigger: 'editP',
          },
          {
            id: 'editP',
            options:[
              {value:'crusts', label: "Crust", trigger: 'crustsEdt'},
              {value:'sizes', label: "Size", trigger: 'sizesEdt'},
              {value:'sauces', label: "Sauce", trigger: 'saucesEdt'},
              {value:'cheeses', label: "Cheese", trigger: 'cheesesEdt'},
              {value:'meats', label: "Meats", trigger: 'meatsEdt'},
              {value:'nonmeats', label: "Non-Meats", trigger: 'nonmeatsEdt'},
              {value:'noEdit', label: "Go Back", trigger: '1'},
            ],
            placeholder: 'Please select something to change...',              
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
            trigger: 'sizes'
          },
          {
            id: 'sizes',
            placeholder: 'Choose an option',
            component: <OrderStep/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
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
            component: <Summary order={order} />,
            asMessage: true,          
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
            id:'remPizza',
            message:'Remove',
            trigger: 'end-message',
          },
          {
            id: 'editPizza',
            message: 'EDIT',
            trigger: 'end-message',
          },
          {
            id: 'crustsEdt',
            placeholder: 'Choose an option',
            component: <OrderStep stepID='crusts' stepOvr={sOvr}/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: 'editQ',
          },
          {
            id: 'sizesEdt',
            placeholder: 'Choose an option',
            component: <OrderStep stepID='sizes' stepOvr={sOvr}/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: 'editQ',
          },
          {
            id: 'saucesEdt',
            placeholder: 'Choose an option',
            component: <OrderStep stepID='sauces' stepOvr={sOvr}/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: 'editQ',
          },
          {
            id: 'cheesesEdt',
            placeholder: 'Choose an option',
            component: <OrderStep stepID='cheeses' stepOvr={sOvr}/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: 'editQ',
          },
          {
            id: 'meatsEdt',
            placeholder: 'Choose an option',
            component: <OrderStep stepID='meats' stepOvr={sOvr}/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: 'editQ',
          },
          {
            id: 'nonmeatsEdt',
            placeholder: 'Choose an option',
            component: <OrderStep stepID='nonmeats' stepOvr={sOvr}/>,              
            waitAction: true, 
            replace: true,
            metadata: order,
            trigger: 'editQ',
          },
          {
            id: 'canorder',
            message: 'Are you sure you want to cancel this order?',
            trigger: 'canorderQ',
            placeholder:'Select an option...',
          },
          {
            id: 'canorderQ',
            options:[
              {value: 'yesCan', label: 'Yes', trigger: 'canorderYes'},
              {value: 'noCan', label: 'No', trigger: '1'},
            ],
            placeholder: 'Choose an option',          
          },
          {
            id: 'canorderYes',
            component: <CancelOrder onTrigger={(v)=>{this.triggerCan(v)}}/>,
            replace:true,
            waitAction: true,
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

function CancelOrder(props){
  return props.onTrigger('-7')
}
export default EditForm;