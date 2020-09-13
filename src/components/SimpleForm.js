import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import Summary from './Summary';

class SimpleForm extends Component {
    render() {
      return (
        <ChatBot
          steps={[
            {
              id: '1',
              message: 'Welcome to Slice!',
              trigger: '2',
            },
            {
                id: '2',
                message: 'What size Pizza would you like to order?',
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
                message: 'Select your Crust Style:',
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
              message: 'Choose a Sauce:',
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
                message: 'Choose your Meats:',
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
                message: 'Choose your Non-Meats:',
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
              message: 'Would you like to update some field?',
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
              message: 'Would you like to update your order?',
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
                { value: 'nonmeats', label: 'Non-Meats', trigger: 'update-nonmeats' },
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
      );
    }
  }
  
  export default SimpleForm;