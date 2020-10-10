import React from 'react';

class EditPizzzaSelect extends React.Component{
  constructor(props){
    super(props);
    this.state={
      trigger:false,
    };
    this.triggerNext = this.triggerNext.bind(this);
  }
  triggerNext(id){
    const pID = id;
    const label = new Array(pID);
    const i = label[0];
    const msg = 'Pizza '+i;
    const data = {
      value: label,
      msg: msg,
    };
    const o = this.props.step.metadata;
    o.EditID = pID;

    this.setState({trigger: true}, () => {
      this.props.triggerNextStep(data);
    });
  }
  render() {
    const o = this.props.step.metadata;
    const p = o.Pizzas;  
    const m = p.map((i)=>{
      const id = i.PizzaID;
      const r = `Edit Pizza ${id}`;
      const k = `pizza-${id}`;
      return (
        <li key={k} className='menuListOptsEle'>
          <button className="menuListOptsBtn" onClick={()=> {
              this.triggerNext(id)}}>{r}</button>
        </li>
      )
    })
    return(
      <ul key='pizza-edit' className='menuOptions'>
        {m}
      </ul>
    )
  }   
}

export default EditPizzzaSelect;