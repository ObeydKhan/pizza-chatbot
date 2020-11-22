import PizzaType from './PizzaType';
import Sauce from './Sauce';
import Topping from './Topping';

export default class GetDisplay{
  type(){
    return <PizzaType props={this.props}/>
  }
  sauces(){
    return <Sauce props={this.props}/>    
  }
  topping(){
    return <Topping props={this.props}/>
  }
}