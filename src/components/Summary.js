import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
        size: '',
        crust: '',
        cheese: '',
        sauce: '',
        meatsinput: '',
        nonmeatsinput: '',
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const { size, crust, cheese, sauce, meatsinput, nonmeatsinput } = steps;

    this.setState({ size, crust, cheese, sauce, meatsinput, nonmeatsinput });
  }

  render() {
    const { size, crust, cheese, sauce, meatsinput, nonmeatsinput } = this.state;
    return (
      <div className="summary" style={{ width: '100%' }}>
        <h3>Summary</h3>
        <table>
          <tbody>
            <tr>
              <td className="align-text-top">Size</td>
              <td>{size.message}</td>
            </tr>
            <tr>
              <td className="align-text-top">Crust</td>
              <td>{crust.message}</td>
            </tr>
            <tr>
              <td className="align-text-top">Cheese</td>
              <td>{cheese.message}</td>
            </tr>
            <tr>
              <td className="align-text-top">Sauce</td>
              <td>{sauce.message}</td>
            </tr>
            <tr>
              <td className="align-text-top">Meats</td>
              <td>{meatsinput.value}</td>
            </tr>
            <tr>
              <td className="align-text-top">Toppings</td>
              <td>{nonmeatsinput.value}</td>
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