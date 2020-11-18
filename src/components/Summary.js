import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Summary extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      pizza: null,
      cnt:0,
      msg:'',
    };
  }
  componentDidMount(){
    const order = this.props.order;
    const isSpc = this.props.steps.spcQues.value;

    const spec = (isSpc==='yesSpc'?this.props.steps.userInst.value:'');
    const p = order.CurrentPizza;
    p.SpecialInstructions = spec;
    const c = order.PizzaCnt;
    const pizzaID = p.PizzaID;
    const msg = order.getPizza(pizzaID);
    this.setState({
      pizza: p,
      cnt:c,
      msg:msg,
    })
  }

  render() {   
    const msg = this.state.msg;   
    return (
      <div className="summary" style={{ width: '100%' }}>
        <h3>{msg.title}</h3>
        <h6>{msg.type}</h6>
        <h6>With:</h6>        
        <table className="summaryTable">
          <tbody>
            <tr className="summarySauce">
               <td>{msg.sauce}</td>
            </tr>
            <tr className="summaryCheese">
              <td>{msg.cheeses}</td>
            </tr>
            <tr className="summaryMeats">
              <td>{msg.meats}</td>
            </tr>
            <tr className="summaryNonMeats"> 
              <td>{msg.nonMeats}</td>
            </tr>
            <tr className="summaryInst"> 
              <td>{msg.noninst}</td>
            </tr>            
          </tbody>
        </table>
      </div>
    );
  }
}

Summary.propTypes = {
  steps: PropTypes.object,
};

Summary.defaultProps = {
  steps: undefined,
};

export default Summary;