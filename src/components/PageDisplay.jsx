import React from 'react';
import PizzaCartIcon from './PizzaCartIcon';
import logo from '../resources/SliceLogo.png';
import SimpleForm from './SimpleForm';
import '../css/DisplayMainArea.css';
import StoreMenu from './StoreMenu';
import StoreLoc from './StoreLoc';


function Header(props){
  const {cnt, locObj, onChange} = props;    
  const selectedStore = locObj.curStoreID;           
  const storeName = selectedStore!=='0'?locObj.curStoreInfo.name:'Please select a Store';
  const storeHours = selectedStore!=='0'?locObj.curStoreInfo.hours:'';
  const storeChange = selectedStore!=='0'?'Change Location':'';  
  return (
    <header>
      <img src={logo} alt="Logo" onClick={() => onChange({val:'Reload'})}></img>
      <h1>Slice</h1>
      <PizzaCartIcon cnt={cnt} />
      <div className="bannerHead">
        <div className="bannerName">{storeName}</div>
        <div className="bannerHours">{storeHours}</div>
        <div className="bannerChange" onClick={() => onChange({val:'Location'})}>{storeChange}</div>
      </div>
    </header>
  );
}
function MainArea(props){

  const dispComp = (type)=>{
    
    switch(type){
      case 'Location':
        return <StoreLoc appState={props.appState} onTriggerLoc={props.onTriggerLoc} forwardedRef={props.forwardedRef}/>;
      case 'Main':
        return <div>Something to display while waiting for the user to enter their name</div>;
      case 'Final':
        return <div>The final order summary and confirmation goes here</div>;      
      case 'Menu':
        return <div>Filtered menu displaying only relevant items</div>
      default:
        return <div>Default items?</div>
    }
  }
  
  return (dispComp(props.appState.showPage));
}

function SliceBot(props){
  const isDis = props.appState.showPage!=='Menu';  
  
  const appState = props.appState;
  const type = appState.botStep.type;
  const refProps = {type:type, isDis:isDis};
  if(type==='menu'||type==='editItem'){
    const step = appState.step.StepObject;
    refProps.name=step.name;
    refProps.multi=step.multi;
    refProps.nextName = step.controls.nextName;
    refProps.prevName = step.controls.prevName;
    refProps.selected = appState.order.GetCurrentItems(step.name);
    refProps.content = step.content;
  } else {
    refProps.itemList=type==='editPizza'?appState.step.stepList:type==='reviewOrder'?appState.order.PizzaList:false;
    refProps.pizzaID=appState.order.CurrentID;
    refProps.ordername=appState.order.ordername;

    if(type==='reviewPizza'){
      refProps.content = appState.order.CurrentPizza;
    } else if(type==='reviewOrder'){
      refProps.content = appState.order.OrderSummary;
    }
  }
  
  return (   
    <div className="chatBot" >
        <SimpleForm refProps={refProps} onTrigger={props.onTrigger}/>
    </div>   
  );
}

export {Header, MainArea, SliceBot};
