import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Menu from './pizzaMenu.json';
import '../css/OrderStyle.css';

class OrderStep extends React.Component {
  constructor(props) {
    super(props);
    const curStep = this.props.step.id;
    const pizza = this.props.step.metadata;
    const sizeStep= curStep==='crusts'||curStep==='sizes'? true:false;
    const topStep = curStep==='meats'||curStep==='nonmeats'? true:false;
    const notTopStep = curStep==='cheeses'||curStep==='sauces'? true:false;
    const multiSel = curStep==='cheeses'||'meats'||curStep==='nonmeats'? true:false;
    const opts = Menu[curStep];
    const qty = Menu.qty;
    this.state ={
      stepType: curStep,
      itemOptions: opts,
      optionQty: qty,      
      isSizeStep: sizeStep,
      isTopStep: topStep,
      isNotTopStep: notTopStep,
      multiSel:multiSel,
      currentSel: [],
      pizza: pizza,
      trigger: false,
      label: {
        crusts: '',
        sizes: '',
        sauces: '',
        cheeses: '',
        meats: '',
        nonmeats: '',
      },
    };   
    this.triggerNext = this.triggerNext.bind(this);
    this.handleClick = this.handleClick.bind(this);
  } 
  handleClick(value){
    console.log('Entered handle click')
    const {stepType, /*currentSel, multiSel,*/ pizza, label } = this.state;
    let updateSel;
    let newPizza = pizza;
    let lbl = label; 
    const newSel = GetItemInfo(value);
    /*
    const i = currentSel.findIndex(item => item.type === newSel.type && item.step === newSel.step);
    if((i===-1 && multiSel) || currentSel.length===0) {
      //add selection
      updateSel = currentSel.concat(newSel);
    } else if(i===-1 && !multiSel) {
      //change selection
      updateSel = newSel;
    } else {
      //change/delete selection
      if(newSel===currentSel[i]) {
        updateSel =currentSel.splice(i,1);
      } else {
        updateSel =currentSel.splice(i,1,newSel);
      }
    }*/
    console.log('Entering step switch'); 
    switch(stepType){
      case 'crusts':
        newPizza.Crust = newSel;
        lbl.crusts = newPizza.Crust;
        break;
      case 'sizes':
        newPizza.Size = newSel;
        lbl.sizes = newPizza.Size;
        break;
      case 'sauces':
        newPizza.Sauce = newSel;
        lbl.sauces = newPizza.Sauce;
        break;
      case 'cheeses':
        newPizza.Cheese = newSel;
        lbl.cheeses = newPizza.Cheese;
        break;
      case 'meats':
        newPizza.Topping = newSel;
        lbl.meats = newPizza.MeatToppings;
        break;
      case 'nonmeats':
        newPizza.Topping = newSel;
        lbl.nonmeats = newPizza.NonMeatToppings;
        break;
      default:
    }
    console.log('Updating State');
    this.setState({
      currentSel: updateSel,
      pizza: newPizza,
      label: lbl,
    });
    if(newSel.type==='None'||newSel.step==='crusts'||newSel.step==='sizes'||newSel.step==='sauces'){
      console.log('Triggering next from click handler');
      this.triggerNext();
    }
    console.log('Exiting click handler');
  }
  triggerNext(){
    console.log('Entering trigger');
    const type = this.state.stepType;
    const label = new Array(this.state.label[type]);
    const msg = label[0];
    if(msg===''){
      console.log('Overriding empty trigger');
      const r = type + ':None:None';
      this.handleClick(r);
      return null;
    }
    const data = {
      value: label,
      type: type,
      msg: msg,
    };
    const p = this.state.pizza;
    this.props.step.metadata=p;
    console.log('Updating trigger state');
    this.setState({trigger: true}, () => {
      this.props.triggerNextStep(data);
    });
  }
  render(){
    const {stepType, itemOptions, optionQty, isNotTopStep, isSizeStep, isTopStep } = this.state;    
    return (
      <div className='orderStep'>
        {isNotTopStep && 
          <NotToppingStep step={stepType} items={itemOptions} qty={optionQty}   
        onClick={(value)=>this.handleClick(value)} onTrigger={()=>this.triggerNext()}/>}
        {isSizeStep && 
          <SizeCrustStep stepType={stepType} itemOptions={itemOptions} onClick={(value)=>this.handleClick(value)}/>        
        }
        {isTopStep && 
          <ToppingStep stepType={stepType} itemOptions={itemOptions} optionQty={optionQty}  
        onClick={(value)=>this.handleClick(value)} onTrigger={()=>this.triggerNext()}/>
        }
      </div>
    );
  }
}
function SizeCrustStep(props){
  const step = props.stepType;
  
    const list = props.itemOptions;
    const c = list.map((i) => {
      const cName = i.type;
      const code = step+':'+cName+':No';
      return (
        <li key={code} className="menuListOptsEle">
          <button className="menuListOptsBtn" onClick={()=> {
            return props.onClick(code);}}>{cName}</button>        
        </li>
      )
    })
    return (
      <div className="menuList">
        <ul className="menuOptions">{c}</ul>
      </div>
    )
}
function HalfBtn(){
  const [half, setHalf] = useState(0);
  let btn = {
    b: null,
    v: null,
  };
  if(half===0){
    btn.b = <button className="wpBtn" onClick={()=>setHalf(half+1)}>wp</button>
    btn.v = 'wp';
  } else if(half===1){
    btn.b = <button className="lhBtn" onClick={()=>setHalf(half+1)}>L</button>
    btn.v = 'LH';
  } else if(half===2){
    btn.b = <button className="rhBtn" onClick={()=>setHalf(half+1)}>R</button>
    btn.v = 'RH';
  } else if(half===3){
    btn.b = <button className="nBtn" onClick={()=>setHalf(0)}>N</button>
    btn.v = 'N';
  } else{
    setHalf(0);
    btn = null;
  }
  return btn;
}
function InnerQtyList(props){
  const q = props.qty;
  //const sel = props.sel;
  let h=null;
  if(props.hKey){
    h = props.hKey;
  }
  const oLiKey = props.oLiKey;
  const qList = q.map((qty) => {
    const qName = qty.type;
    const short = qty.short;    
    const code = oLiKey+':'+qName +(h?':'+h:'');    
    /*const i = sel.findIndex(item => item.type === sel.type && item.step === sel.step);
    console.log('Currently selected index = ' + i);
    let btnCapt = "menuListOptsBtn";
    if(i!==-1){
      btnCapt = "selMenuListOptsBtn";
    }*/
    return (
      <li key={code} className="menuListOptsEle">
        <button className="menuListOptsBtn" onClick={()=> {
          return props.onClick(code);}}>{short}</button>        
      </li>
    )
  })
  return qList; 
}
function NotToppingStep(props){
  const items = props.items;
  const step = props.step; 
  const qty = props.qty;   
  const nxt = NextStep(step);
  const itemList = items.map((i) => {
    const itemName = i.type;
    const oLiKey = step+':'+itemName;
    if(itemName==='None'){      
      const nncode = oLiKey+':None';
      const none = 'No ' + step;     
      return (        
        <li key={oLiKey} className="menuOptionsEle">
          <ul className="menuListOpts">  
          <li key={nncode} className="menuListOptsEleNone">
          <button className="menuListOptsBtnNone" onClick={()=> {
            return props.onClick(nncode);}}>{none}</button>        
        </li></ul></li>        
      );
    }               
    return (      
      <li key={oLiKey}  className="menuOptionsEle"> <div className="menuOptionName">{itemName}</div>
        <ul className="menuListOpts"><InnerQtyList oLiKey={oLiKey} qty={qty} onClick={(value)=>props.onClick(value)}/></ul>
      </li> 
    );
  });

  return (
    <div className="menuList">
      <ul className="menuOptions">{itemList}</ul>
      <button className="nextStep" onClick={()=> props.onTrigger()}>{nxt}</button>
    </div>
  )
  
}
function ToppingStep(props){
  const {stepType, itemOptions, optionQty } = props;
  const nxt = NextStep(stepType);
  const itemList = itemOptions.map((i) => {
    const itemName = i.type;
    const oLiKey = stepType+':'+itemName;
    const b = HalfBtn();
    const btn = b.b;
    const v = b.v;
    const bKey = oLiKey+ ':'+v;                   
    return (      
      <li key={oLiKey}  className="menuOptionsEle"> <div className="menuOptionName">{itemName}</div>
        <ul className="menuHalfOpts">
          <li key={bKey} className="halfList">{btn}</li>
        </ul>
        <ul className="menuListOpts"><InnerQtyList oLiKey={oLiKey} hKey={v} qty={optionQty} onClick={(value)=>props.onClick(value)}/></ul>
      </li> 
    );
  });

  return (
    <div className="menuList">
      <ul className="menuOptions">{itemList}</ul>
      <button className="nextStep" onClick={()=> props.onTrigger()}>{nxt}</button>
    </div>
  )
}
function GetItemInfo(value){
  if(value.length===0){
    return null;
  }
  let x = value.indexOf(':');
  let s = [];
  let i = 0;
  let rem = value+':';
  while (x>0){
    s[i] = rem.substring(0,x);
    rem = rem.substring(x+1);
    x = rem.indexOf(':');
    i++;    
  }
  let ret = {
    step: (i>=1?s[0]:''),
    type: (i>=2?s[1]:''),
    qty: (i>=3?s[2]:''),
    on: '',
    onMsg: '',
  };
  if(i===4){
    ret.on = s[3];
    const z = Menu.half.findIndex(h => h.value === s[3]);
    if(z!==-1){
      ret.onMsg = Menu.half[z].msg;
    } else {
      ret.qty = 'None';
      ret.on = '';
      ret.onMsg = '';
    }
  }
  return ret;
}
function NextStep(value){
  const curStep = value;
  switch(curStep){
    case 'crusts':
      return '';
    case 'sizes':
      return '';
    case 'sauces':
      return 'Go to Cheeses';
    case 'cheeses':
      return 'Go to meats';
    case 'meats':
      return 'Go to non-meats';
    case 'nonmeats':
      return 'Go to summary';
    default:
      return '';
  }
}
OrderStep.propTypes = {
  steps: PropTypes.object,
  step: PropTypes.object,
  triggerNextStep: PropTypes.func,
  pizza: PropTypes.object,  
};
OrderStep.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,    
};

export default OrderStep;