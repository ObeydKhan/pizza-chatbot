import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import Summary from './Summary';

class SimpleForm extends Component {
    render() {
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

                 steps={[
            {
              id: '1',
              message: 'Welcome to Slice!',
              trigger: '2',
            },
            {
                id: '2',
                message: 'What size pizza would you like to order?',
                trigger: 'size',
              },
              {
                id: 'size',
                options: [
                  { value: 'small', label: 'Small 10"', trigger: '3' },
                  { value: 'medium', label: 'Medium 12"', trigger: '3' },
                  { value: 'large', label: 'Large 14"', trigger: '3' },
                  { value: 'x-large', label: 'X-Large 16"', trigger: '3' },
                ],
              },
              {
                id: '3',
                message: 'Select your crust Style:',
                trigger: 'crust',
              },
              {
                id: 'crust',
                options: [
                  { value: 'original', label: 'Original', trigger: '4' },
                  { value: 'thin-crust', label: 'Thin Crust', trigger: '4' },
                  { value: 'gluten-free', label: 'Gluten Free', trigger: '4' },
                ],
              },
              {
                id: '4',
                message: 'Cheese?',
                trigger: 'cheese',
              },
            {
              id: 'cheese',
              options: [
                { value: 'none', label: 'None', trigger: '5' },
                { value: 'light', label: 'Light', trigger: '5' },
                { value: 'normal', label: 'Normal', trigger: '5' },
                { value: 'double', label: 'Double', trigger: '5' }
              ],
            },
            {
              id: '5',
              message: 'Choose a sauce:',
              trigger: 'sauce',
            },
            {
              id: 'sauce',
              options: [
                { value: 'tomato', label: 'Tomato', trigger: '6' },
                { value: 'marinara', label: 'Marinara', trigger: '6' },
                { value: 'honey-bbq', label: 'Honey BBQ', trigger: '6' },
                { value: 'alfredo', label: 'Alfredo', trigger: '6' }
              ],
            },
            {
                id: '6',
                message: 'Choose your meats:',
                trigger: 'meats',
              },
              {
                id: 'meats',
                trigger: 'meatsinput',
                message: 'Pepperoni, Beef, Philly Steak, Italian Sausage, Grilled Chicken, Bacon',
              },
              {
                id: 'meatsinput',
                user: true,
                trigger: 8,
              },
              {
                id: '8',
                message: 'Choose your toppings:',
                trigger: 'nonmeats',
              },
              {
                id: 'nonmeats',
                trigger: 'nonmeatsinput',
                message: 'Tomatoes, Mushrooms, Jalapeño Peppers, Onions, Black Olives, Pineapple, Green Peppers',
              },
              {
                id: 'nonmeatsinput',
                user: true,
                trigger: '9',
              },
            {
              id: '9',
              message: 'Great! Check out your summary',
              trigger: 'review',
            },
            {
              id: 'review',
              component: <Summary />,
              asMessage: true,
              trigger: 'update',
            },
            {
              id: 'update',
              message: 'Would you like to make any changes to your order?',
              trigger: 'update-question',
            },
            {
              id: 'update-question',
              options: [
                { value: 'yes', label: 'Yes', trigger: 'update-yes' },
                { value: 'no', label: 'No', trigger: 'end-message' },
              ],
            },
            {
              id: 'update-yes',
              message: 'What would you like to change?',
              trigger: 'update-fields',
            },
            {
              id: 'update-fields',
              options: [
                { value: 'size', label: 'Size', trigger: 'update-size' },
                { value: 'crust', label: 'Crust', trigger: 'update-crust' },
                { value: 'cheese', label: 'Cheese', trigger: 'update-cheese' },
                { value: 'sauce', label: 'Sauce', trigger: 'update-sauce' },
                { value: 'meats', label: 'Meats', trigger: 'update-meats' },
                { value: 'nonmeats', label: 'Toppings', trigger: 'update-nonmeats' },
              ],
            },
            {
              id: 'update-size',
              update: 'size',
              trigger: 'review',
            },
            {
              id: 'update-crust',
              update: 'crust',
              trigger: 'review',
            },
            {
              id: 'update-cheese',
              update: 'cheese',
              trigger: 'review',
            },
            {
                id: 'update-sauce',
                update: 'sauce',
                trigger: 'review',
            },
            {
                id: 'update-meats',
                update: 'meats',
                trigger: 'review',
            },
            {
                id: 'update-nonmeats',
                update: 'nonmeats',
                trigger: 'review',
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