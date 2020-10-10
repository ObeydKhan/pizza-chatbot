import React from 'react';
import PropTypes from 'prop-types';


class AddPizza extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      order: this.props.order,
      pizza:'',
      cnt:0,
      edt:false,
    };
  }
  componentDidMount(){
    let order = this.state.order;
    const step = this.props.step.id;
    const edt = order.IsOrderEdit;    
    if(order.Name === ''){
      const name = this.props.steps.ordername.value;
      order.Name = name;
    }
    if(step==='addNewPizza'&& !edt){
      const cnt = order.PizzaCnt;
      const p = order.addNewPizza(cnt+1);
      this.setState({
        pizza:p,
        cnt:cnt+1,
        edt:false,
      });      
    }    
  }
  render(){
    const edt = this.state.edt;
    let ret;
    if(edt){
      ret = (
        <div className="editPizzaMsg">Select a crust style:</div>
      )
    } else{
      ret=<div className="addPizzaMsg">Select a crust style:</div>
    }
    return ret;  
  }  
}
AddPizza.propTypes = {
  steps: PropTypes.object,
};

AddPizza.defaultProps = {
  steps: undefined,
};
export default AddPizza;