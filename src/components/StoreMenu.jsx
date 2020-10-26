import React from 'react';
import df from "../resources/dairyfree.svg";
import gf from "../resources/glutenfree.svg";
import veggie from "../resources/vegetarian.svg";
import vegan from "../resources/vegan.svg";
import '../css/DisplayMainArea.css';

class StoreMenu extends React.Component {
render(){
  return(
    <div className="displayArea">
        <div className="menuSummary">
            <h2>Menu</h2>
            <div className="leftPanel">
            <h3>Sizes</h3>
            <hr/>
            <div className="menuItem">
            <p>Small 10"</p>
            </div>
            <div className="menuItem">
                <p>Medium 12"</p>
            </div>
            <div className="menuItem">
                <p>Large 14"</p>
            </div>
            <div className="menuItem">
                <p>X-Large 16"</p>
            </div>
            <h3>Crust</h3>
            <hr/>
            <div className="menuItem">
                <p>Original</p>
                <img className="allergyInfo" src={veggie} alt="Vegetarian"></img>
            </div>
            <div className="menuItem">
                <p>Thin Crust</p>
                <img className="allergyInfo" src={veggie} alt="Vegetarian"></img>
            </div>
            <div className="menuItem">
                <p>Gluten Free</p>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>
            </div>
            <h3>Cheese</h3>
            <hr/>
            <div className="menuItem">
                <p>None</p>
            </div>
            <div className="menuItem">
                <p>Light</p>
                <img className="allergyInfo" src={veggie} alt="Vegetarian"></img>
            </div>
            <div className="menuItem">
                <p>Normal</p>
                <img className="allergyInfo" src={veggie} alt="Vegetarian"></img>
            </div>
            <div className="menuItem">
                <p>Double</p>
                <img className="allergyInfo" src={veggie} alt="Vegetarian"></img>
            </div>
            <h3>Sauce</h3>
            <hr/>
            <div className="menuItem">
                <p>Tomato</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>
            </div>
            <div className="menuItem">
                <p>Marinara</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>            </div>
            <div className="menuItem">
                <p>Honey BBQ</p>
                <img className="allergyInfo" src={veggie} alt="Vegetarian"></img>
            </div>
            <div className="menuItem">
                <p>Alfredo</p>
                <img className="allergyInfo" src={veggie} alt="Vegetarian"></img>
            </div>
            </div>
            <div className="rightPanel">
            <h3>Meats</h3>
            <hr/>
            <div className="menuItem">
                <p>Pepperoni</p>
                <img className="allergyInfo" src={df} alt="Dairy Free"></img>
            </div>
            <div className="menuItem">
                <p>Beef</p>
                <img className="allergyInfo" src={df} alt="Dairy Free"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>
            </div>
            <div className="menuItem">
                <p>Philly Cheese Steak</p></div>
            <div className="menuItem">
                <p>Italian Sausage</p>
                <img className="allergyInfo" src={df} alt="Dairy Free"></img>
            </div>
            <div className="menuItem">
                <p>Grilled Chicken</p>
                <img className="allergyInfo" src={df} alt="Dairy Free"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>
            </div>
            <div className="menuItem">
                <p>Bacon</p>
                <img className="allergyInfo" src={df} alt="Dairy Free"></img>
            </div>
            <h3>Toppings</h3>
            <hr/>
            <div className="menuItem">
                <p>Tomatoes</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>            </div>
            <div className="menuItem">
                <p>Mushrooms</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>               </div>
            <div className="menuItem">
                <p>Jalapeño Peppers</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>               </div>
            <div className="menuItem">
                <p>Onions</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>               </div>
            <div className="menuItem">
                <p>Pineapple</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>               </div>
            <div className="menuItem">
                <p>Green Peppers</p>
                <img className="allergyInfo" src={vegan} alt="Vegan"></img>
                <img className="allergyInfo" src={gf} alt="Gluten Free"></img>               </div>
            </div>
        </div>
      </div>
  )
}
}
export default StoreMenu;