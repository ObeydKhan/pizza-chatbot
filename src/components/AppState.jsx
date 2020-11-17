import { valHooks } from "jquery";

class AppState {
  constructor(){
    this.display='Location';
    this.showBot=false;
    this.setName=false;
    this.setInst=false;
    this.updateBot=false;
    this.botStepClass='';
    this.botStepType='';    
  }
  set appBotStepType(val){
    switch(val){
      case 'name':
        this.display='Menu';
        this.setName=true;
        this.updateBot=val;
        break;
      case 'inst':
        this.display='NonMenuStep';        
        this.setInst=true;
        this.updateBot=val;  
        break;
      default:
        this.display='Menu';
        this.setName=false;
        this.setInst=false;
        this.updateBot=false;
      }    
    this.botStepType = val;
  }
  get appBotStepType(){
    return this.botStepType;
  }
  set appDisplay(val){
    
    this.display=val
  }
  get appDisplay(){
    return this.display
  }
  set appShowBot(val){
    this.showBot=val
  }
  get appShowBot(){
    return this.showBot
  }
  set appSetName(val){
    this.setName=val
  }
  get appSetName(){
    return this.setName
  }
  set appSetInst(val){
    this.setInst=val
  }
  get appSetInst(){
    return this.setInst
  }
  set appUpdateBot(val){
    this.updateBot=val
  }
  get appUpdateBot(){
    return this.updateBot
  }
  set appBotStepClass(val){
    this.botStepClass=val
  }
  get appBotStepClass(){
    return this.botStepClass
  }

}
export default AppState;