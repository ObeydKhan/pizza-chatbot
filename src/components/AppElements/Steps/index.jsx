import MenuStep from './MenuStep';
import CancelStep from './CancelStep';
import EditItemStep from './EditItemStep';
import RemoveStep from './RemoveStep';
import ReviewOrderStep from './ReviewOrderStep';
import ReviewPizzaStep from './ReviewPizzaStep';
import {NewOrderStep, ChangeName, SpecialInstructions} from './SpecialStep';

export default class OrderSteps {
  newOrder(){
    return <NewOrderStep props={this.props}/>
  }
  menuStep(){
    return <MenuStep props={this.props}/>
  }
  cancel(){
    return <CancelStep props={this.props}/>
  }
  editItem(){
    return <EditItemStep props={this.props}/>
  }  
  remove(){
    return <RemoveStep props={this.props}/>
  }
  reviewOrder(){
    return <ReviewOrderStep props={this.props}/>
  }
  reviewPizza(){
    return <ReviewPizzaStep props={this.props}/>
  }
  changeName(){
    return <ChangeName props={this.props}/>
  }
  specialInstructions(){
    return <SpecialInstructions props={this.props}/>
  }
}