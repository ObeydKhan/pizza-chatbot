import React from 'react';
import SimpleForm from './SimpleForm';
import '../css/ShowSearchMenu.css';

class DisplayMainArea extends React.Component {
    render() {
    const showPage= this.props.data.showPage;
    if (showPage!=='Main') {
      return null;
    } else {
    return (
      <>
      <div className="displayArea">
        <div className="menuSummary">
            <h2>Menu</h2>
            <div className="leftPanel">
            <h3>Sizes</h3>
            <hr/>
            <p>Small 10"</p>
            <p>Medium 12"</p>
            <p>Large 14"</p>
            <p>X-Large 16"</p>
            <h3>Crust</h3>
            <hr/>
            <p>Original</p>
            <p>Thin Crust</p>
            <p>Gluten Free</p>
            <h3>Cheese</h3>
            <hr/>
            <p>None</p>
            <p>Light</p>
            <p>Normal</p>
            <p>Double</p>
            <h3>Sauce</h3>
            <hr/>
            <p>Tomato</p>
            <p>Marinera</p>
            <p>Honey BBQ</p>
            <p>Alfredo</p>
            </div>

            <div className="rightPanel">
            <h3>Meats</h3>
            <hr/>
            <p>Pepeproni</p>
            <p>Beef</p>
            <p>Philly Steak</p>
            <p>Italian Sausage</p>
            <p>Grilled Chicken</p>
            <p>Bacon</p>
            <h3>Toppings</h3>
            <hr/>
            <p>Tomatoes</p>
            <p>Mushrooms</p>
            <p>Jalapeño Peppers</p>
            <p>Onions</p>
            <p>Pineapple</p>
            <p>Green Peppers</p>
            </div>
        </div>
      </div>
      <div className="chatBot">
          <SimpleForm />
      </div>
      </>
    );
    }
    }
  }
  export default DisplayMainArea;