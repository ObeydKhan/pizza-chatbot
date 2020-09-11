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
        meats: '',
        nonmeats: '',
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const { size, crust, cheese, sauce, meats, nonmeats } = steps;

    this.setState({ size, crust, cheese, sauce, meats, nonmeats });
  }

  render() {
    const { size, crust, cheese, sauce, meats, nonmeats } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <h3>Summary</h3>
        <table>
          <tbody>
            <tr>
              <td>Size</td>
              <td>{size.message}</td>
            </tr>
            <tr>
              <td>Crust</td>
              <td>{crust.message}</td>
            </tr>
            <tr>
              <td>Cheese</td>
              <td>{cheese.message}</td>
            </tr>
            <tr>
              <td>Sauce</td>
              <td>{sauce.message}</td>
            </tr>
            <tr>
              <td>Meats</td>
              <td>{meats.message}</td>
            </tr>
            <tr>
              <td>Non-Meats</td>
              <td>{nonmeats.message}</td>
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